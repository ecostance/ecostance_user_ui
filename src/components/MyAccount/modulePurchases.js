import { useEffect, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import fileDownload from "js-file-download";
import { getCookie } from "cookies-next";
import { useToasts } from "react-toast-notifications";
import { me } from "src/apiClient/auth";
import {
  getAllModuleOrders,
  getModulePurchases,
  getModulePurchaseById,
} from "src/apiClient/orders";
import {
  MODULE_ACCESS,
  isModuleExpired,
  cachePurchasedModules,
} from "src/constants/moduleAccess";
import { getFormattedDate, getFormattedTime } from "src/helpers/formatDateTime";
import formatCurrency from "src/helpers/formatCurrency";

const toMs = (value) => {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return num < 1e11 ? num * 1000 : num;
};

const formatTimestamp = (value) => {
  const ms = toMs(value);
  if (!ms) return "—";
  return `${getFormattedDate(ms)} ${getFormattedTime(ms)}`;
};

const getRenewalLabel = (expiryValue) => {
  const expiryMs = toMs(expiryValue);
  if (!expiryMs) return "No renewal date on file";
  const diffMs = expiryMs - Date.now();
  if (diffMs <= 0) return "Renewal overdue";

  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days >= 30) {
    const months = Math.floor(days / 30);
    const remDays = days % 30;
    const monthPart = `${months} month${months === 1 ? "" : "s"}`;
    const dayPart =
      remDays > 0 ? ` ${remDays} day${remDays === 1 ? "" : "s"}` : "";
    return `${monthPart}${dayPart} left`;
  }
  return `${days} day${days === 1 ? "" : "s"} left`;
};

const normalizeModuleOrder = (order) => ({
  _id: order?._id,
  purchaseNumber: order?.purchaseNumber || order?.orderNumber || order?.orderId,
  customer: order?.customer,
  userInfo: order?.userInfo,
  billingAddress: order?.billingAddress,
  createdAt: order?.createdAt,
  status: order?.status || "completed",
  moduleExpiresAt: order?.moduleExpiresAt,
  pricingLink: order?.pricingLink,
  selectedModules:
    order?.selectedModules ||
    (order?.products || []).map((product) => ({
      moduleName: product?.moduleName || product?.name || product?.productName,
      name: product?.name || product?.productName,
      moduleId: product?.moduleId || product?.otherDetail?.moduleId,
      units:
        product?.units ||
        product?.additionalQuantity ||
        product?.additionalUsers,
      pricing: product?.pricing,
    })),
  paymentDetails: order?.paymentDetails || order?.priceBreakdown || {},
  paymentInfo: order?.paymentInfo,
  invoice: order?.invoice,
  unlockedAt:
    order?.moduleUnlockedAt ||
    order?.unlockedAt ||
    order?.activatedAt ||
    order?.updatedAt ||
    order?.createdAt,
});

const getModuleLabel = (mod) => {
  const moduleId = mod?.otherDetail?.moduleId || mod?.moduleId;
  return (
    mod?.name ||
    MODULE_ACCESS[moduleId]?.name ||
    (moduleId ? `Module ${moduleId}` : "Module")
  );
};

const moduleMatchesPurchase = (mod, purchase) => {
  const modId = mod?.otherDetail?.moduleId || mod?.moduleId;
  const modName = (mod?.name || "").toLowerCase();
  const selected = purchase?.selectedModules || [];

  return selected.some((entry) => {
    const entryId = entry?.moduleId || entry?.otherDetail?.moduleId;
    const entryName = (entry?.moduleName || entry?.name || "").toLowerCase();
    const idMatch =
      modId != null && entryId != null && Number(entryId) === Number(modId);
    const nameMatch = modName && entryName && modName === entryName;
    return idMatch || nameMatch;
  });
};

const dedupePurchases = (purchaseList) => {
  const seen = new Set();
  return purchaseList.filter((purchase) => {
    const key =
      purchase?._id ||
      purchase?.purchaseNumber ||
      purchase?.orderNumber ||
      purchase?.orderId;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const findPurchaseForModule = (mod, purchaseList) => {
  const directMatch = purchaseList.find((purchase) =>
    moduleMatchesPurchase(mod, purchase),
  );
  if (directMatch) return directMatch;

  if (!mod?.expiry) return null;
  return (
    purchaseList.find((purchase) => {
      if (!purchase?.moduleExpiresAt) return false;
      const modExpiry = toMs(mod.expiry);
      const purchaseExpiry = toMs(purchase.moduleExpiresAt);
      if (!modExpiry || !purchaseExpiry) return false;
      return Math.abs(modExpiry - purchaseExpiry) < 86400000;
    }) || null
  );
};

const resolveInvoiceUrl = (filePath, fileName) => {
  if (!filePath && !fileName) return null;
  const name =
    fileName ||
    (typeof filePath === "string" ? filePath.split(/[/\\]/).pop() : null);
  if (
    typeof filePath === "string" &&
    (filePath.startsWith("http://") || filePath.startsWith("https://"))
  ) {
    return filePath;
  }
  const apiBase = (process.env.API_BASE || "").replace(/\/+$/, "");
  if (name) {
    return `${apiBase}/pricing/${name}`;
  }
  if (typeof filePath === "string") {
    return `${apiBase}/${filePath.replace(/^\/+/, "")}`;
  }
  return null;
};

const ModulePurchases = ({ moduleSupported = [], onActiveModulesChange }) => {
  const { addToast } = useToasts();
  const [purchases, setPurchases] = useState([]);
  const [activeModules, setActiveModules] = useState(moduleSupported || []);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    setActiveModules(moduleSupported || []);
  }, [moduleSupported]);

  useEffect(() => {
    const fetchData = async () => {
      if (!getCookie("JWTToken")) {
        setLoading(false);
        return;
      }

      try {
        const [profile, purchasesResponse, ordersResponse] = await Promise.all([
          me().catch(() => null),
          getModulePurchases().catch(() => null),
          getAllModuleOrders().catch(() => null),
        ]);

        const loggedInEmail = (
          profile?.data?.email ||
          profile?.email ||
          (typeof window !== "undefined" ? localStorage.getItem("email") : "") ||
          ""
        )
          .toLowerCase()
          .trim();

        const loggedInUserId = String(
          profile?.data?._id ||
          profile?._id ||
          (typeof window !== "undefined" ? localStorage.getItem("userId") : "") ||
          "",
        ).trim();

        const customerProfileId = String(
          profile?.customerProfile?._id ||
          profile?.data?.customerProfile?._id ||
          profile?.customerProfile ||
          "",
        ).trim();

        const matchesUser = (p) => {
          if (!loggedInEmail && !loggedInUserId) return true;

          const pEmail = (
            p?.userInfo?.email ||
            p?.billingAddress?.email ||
            p?.buyerEmail ||
            ""
          )
            .toLowerCase()
            .trim();

          if (loggedInEmail && pEmail && loggedInEmail === pEmail) {
            return true;
          }

          const cust = p?.customer;
          const custId = String(
            typeof cust === "string" ? cust : cust?._id || cust?.user || "",
          ).trim();

          if (
            loggedInUserId &&
            custId &&
            (custId === loggedInUserId || custId === customerProfileId)
          ) {
            return true;
          }

          return false;
        };

        let rawPurchases = [];
        if (purchasesResponse?.status === 200 && purchasesResponse.data) {
          rawPurchases =
            purchasesResponse.data.data ||
            purchasesResponse.data.ModulePurchases ||
            purchasesResponse.data.modulePurchases ||
            (Array.isArray(purchasesResponse.data) ? purchasesResponse.data : []);
        }

        const userPurchases = (Array.isArray(rawPurchases) ? rawPurchases : [])
          .filter(matchesUser)
          .map(normalizeModuleOrder);

        let orderPurchases = [];
        if (ordersResponse?.status === 200 && ordersResponse.data) {
          const rawOrders =
            ordersResponse.data.data ||
            ordersResponse.data.orders ||
            ordersResponse.data.ModulePurchases ||
            (Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
          orderPurchases = (Array.isArray(rawOrders) ? rawOrders : [])
            .filter(matchesUser)
            .map(normalizeModuleOrder);
        }

        const combinedList = dedupePurchases([
          ...userPurchases,
          ...orderPurchases,
        ]);
        setPurchases(combinedList);

        const supported =
          profile?.moduleSupported || profile?.data?.moduleSupported || [];
        if (supported.length) {
          setActiveModules(supported);
        } else if (moduleSupported?.length) {
          setActiveModules(moduleSupported);
        }
      } catch (err) {
        console.error("Error fetching module purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleSupported?.length]);

  const handleInvoiceDownload = async (purchase) => {
    const purchaseKey = purchase._id || purchase.purchaseNumber;
    setDownloadingId(purchaseKey);

    try {
      let filePath = purchase.invoice?.filePath;
      let fileName = purchase.invoice?.fileName;

      if (!filePath && purchase._id) {
        const singleRes = await getModulePurchaseById(purchase._id).catch(
          () => null,
        );
        if (singleRes?.status === 200) {
          const singleData = singleRes.data?.data || singleRes.data;
          filePath = singleData?.invoice?.filePath || singleData?.invoice;
          fileName = singleData?.invoice?.fileName;
        }
      }

      const invoiceUrl = resolveInvoiceUrl(filePath, fileName);
      if (invoiceUrl) {
        const res = await axios.get(invoiceUrl, { responseType: "blob" });
        fileDownload(
          res.data,
          `INVOICE-${purchase.purchaseNumber || "MODULE-PURCHASE"}.pdf`,
        );
        addToast("Invoice downloaded successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast("Invoice is being generated. Please check back shortly.", {
          appearance: "info",
          autoDismiss: true,
        });
      }
    } catch (err) {
      console.error("Invoice download error:", err);
      addToast("Download failed. Please try again later.", {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const now = Math.floor(Date.now() / 1000);

  const allActiveModules = useMemo(() => {
    const list = [...(activeModules || [])];
    purchases.forEach((p) => {
      (p.selectedModules || []).forEach((mod) => {
        const modId = mod.moduleId;
        const exists = list.some((m) => {
          const id = m?.otherDetail?.moduleId || m?.moduleId;
          return id != null && modId != null && Number(id) === Number(modId);
        });
        if (!exists) {
          list.push({
            name: mod.moduleName || mod.name,
            expiry: p.moduleExpiresAt,
            purchasedAt: p.createdAt,
            unlockedAt: p.unlockedAt || p.createdAt,
            units: mod.units,
            otherDetail: {
              moduleId: mod.moduleId,
              numberofUnits: mod.units,
            },
          });
        }
      });
    });
    return list.filter((mod) => !isModuleExpired(mod?.expiry ?? mod?.moduleExpiresAt));
  }, [activeModules, purchases]);

  useEffect(() => {
    if (allActiveModules && allActiveModules.length > 0) {
      cachePurchasedModules(allActiveModules);
      onActiveModulesChange?.(allActiveModules);
    }
  }, [allActiveModules, onActiveModulesChange]);

  const moduleDetails = useMemo(
    () =>
      allActiveModules.map((mod) => {
        const purchase = findPurchaseForModule(mod, purchases);
        const expiry = mod.expiry || purchase?.moduleExpiresAt;
        const purchasedAt =
          mod.purchasedAt ||
          mod.purchaseDate ||
          mod.createdAt ||
          purchase?.createdAt;
        const unlockedAt =
          mod.unlockedAt ||
          mod.activatedAt ||
          mod.grantedAt ||
          purchase?.unlockedAt ||
          purchase?.createdAt;

        return {
          mod,
          label: getModuleLabel(mod),
          purchasedAt,
          unlockedAt,
          expiry,
          renewalLabel: getRenewalLabel(expiry),
          units:
            mod.units ||
            mod.otherDetail?.numberofUnits ||
            mod.otherDetail?.numberofUnit ||
            1,
        };
      }),
    [allActiveModules, purchases],
  );

  const totalAllocatedUnits = useMemo(() => {
    return moduleDetails.reduce((sum, item) => sum + (Number(item.units) || 1), 0);
  }, [moduleDetails]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3 text-muted" style={{ fontSize: "14px" }}>
          Loading your module purchases...
        </p>
      </div>
    );
  }

  return (
    <div className="module-purchases-container">
      {/* Header & Overview */}
      <div className="mp-header-area">
        <h3 className="mp-title">Module Purchases</h3>
        <p className="mp-subtitle">
          Manage your active enterprise modules, subscription details, and tax invoices.
        </p>

        {/* Quick Stats Banner */}
        <div className="mp-stats-row">
          <div className="mp-stat-card">
            <div className="mp-stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div className="mp-stat-value">{moduleDetails.length}</div>
              <div className="mp-stat-label">Active Modules</div>
            </div>
          </div>

          <div className="mp-stat-card">
            <div className="mp-stat-icon secondary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <div className="mp-stat-value">{totalAllocatedUnits}</div>
              <div className="mp-stat-label">Allocated Units / Seats</div>
            </div>
          </div>

          <div className="mp-stat-card">
            <div className="mp-stat-icon warning">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <div className="mp-stat-value">{purchases.length}</div>
              <div className="mp-stat-label">Completed Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Modules Section */}
      {moduleDetails.length > 0 && (
        <div className="mb-4">
          <div className="mp-section-header">
            <h4 className="mp-section-title">
              Active Modules
              <span className="mp-badge-count">{moduleDetails.length}</span>
            </h4>
          </div>

          <div className="mp-active-grid">
            {moduleDetails.map((entry, index) => (
              <div key={entry.mod._id || index} className="mp-active-card">
                <div className="mp-active-card-top">
                  <div className="mp-active-header-left">
                    <div className="mp-active-icon-badge">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="mp-active-title">{entry.label}</h5>
                    </div>
                  </div>
                  <span className="mp-active-tag">
                    <span className="mp-pulse-dot"></span>
                    Active
                  </span>
                </div>

                <div className="mp-active-card-body">
                  <div className="mp-meta-block">
                    <span className="mp-meta-label">Units / Seats</span>
                    <span className="mp-meta-value">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {entry.units} {entry.units === 1 ? "Unit" : "Units"}
                    </span>
                  </div>

                  <div className="mp-meta-block">
                    <span className="mp-meta-label">Purchased On</span>
                    <span className="mp-meta-value" style={{ fontSize: "12px" }}>
                      {formatTimestamp(entry.purchasedAt)}
                    </span>
                  </div>

                  <div className="mp-meta-block">
                    <span className="mp-meta-label">Unlocked On</span>
                    <span className="mp-meta-value" style={{ fontSize: "12px" }}>
                      {formatTimestamp(entry.unlockedAt)}
                    </span>
                  </div>

                  <div className="mp-meta-block">
                    <span className="mp-meta-label">Status</span>
                    <span className="mp-meta-value" style={{ color: "#16a34a" }}>
                      Unlocked & Active
                    </span>
                  </div>
                </div>

                <div className="mp-active-card-footer">
                  <div className="mp-renewal-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Renewal: {entry.renewalLabel}</span>
                  </div>
                  {entry.expiry && (
                    <span className="mp-expiry-hint">
                      Exp: {new Date(toMs(entry.expiry)).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purchase History Section */}
      <div className="mt-4">
        <div className="mp-section-header">
          <h4 className="mp-section-title">
            Purchase History
            <span className="mp-badge-count">{purchases.length}</span>
          </h4>
        </div>

        {!purchases.length ? (
          <div className="mp-empty-state">
            <div className="mp-empty-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h5 className="mp-empty-title">No module purchases found</h5>
            <p className="mp-empty-desc">
              When you purchase or unlock enterprise modules, your detailed invoices, purchase history, and receipts will appear here.
            </p>
          </div>
        ) : (
          <div className="mp-history-list">
            {purchases.map((purchase, index) => {
              const details = purchase.paymentDetails || {};
              const sym = details.currencySymbol || "$";
              const cur = details.currency || "USD";
              const amount =
                details.grandTotal ?? purchase.paymentInfo?.amountPaid ?? 0;
              const planLabel =
                details.paymentPlan === "monthly"
                  ? "12-Month Plan"
                  : "Pay Full Today";
              const modules = purchase.selectedModules || [];
              const isDownloading =
                downloadingId === (purchase._id || purchase.purchaseNumber);
              const cleanPurchaseNum = purchase.purchaseNumber || `MP-${String(index + 1).padStart(5, "0")}`;

              return (
                <div
                  key={purchase._id || index}
                  className="mp-history-card"
                >
                  {/* Card Top Bar */}
                  <div className="mp-history-header">
                    <div className="mp-history-id-group">
                      <span className="mp-order-number">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        Purchase #: <strong>{cleanPurchaseNum}</strong>
                      </span>
                      <span className="mp-status-pill mp-status-completed">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {purchase.status || "Completed"}
                      </span>
                    </div>

                    {/* Invoice Download Action */}
                    <button
                      type="button"
                      className="mp-invoice-btn"
                      disabled={isDownloading}
                      onClick={() => handleInvoiceDownload(purchase)}
                      title="Download Official Tax Invoice PDF"
                    >
                      {isDownloading ? (
                        <>
                          <Spinner animation="border" size="sm" variant="danger" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="20"
                            fill="none"
                            viewBox="0 0 22 26"
                          >
                            <path
                              fill="#B7323B"
                              d="M5.66 16.727c0-.431-.3-.689-.829-.689-.216 0-.362.021-.438.042v1.385c.09.02.201.027.355.027.563 0 .911-.284.911-.765zM8.931 16.053c-.236 0-.39.02-.48.041v3.069c.09.02.237.02.37.02.96.008 1.586-.521 1.586-1.641.007-.974-.564-1.49-1.476-1.49z"
                            />
                            <path
                              fill="#B7323B"
                              d="M15.011 0H4.57A2.771 2.771 0 001.8 2.767V13h-.27c-.616 0-1.115.499-1.115 1.115v6.763c0 .616.5 1.115 1.115 1.115h.27v1.24A2.77 2.77 0 004.57 26h14.248a2.77 2.77 0 002.767-2.767V6.549L15.01 0zM3.341 15.335a8.742 8.742 0 011.434-.096c.654 0 1.12.124 1.433.375.3.236.501.627.501 1.086 0 .459-.153.849-.431 1.113-.362.34-.898.494-1.524.494-.14 0-.264-.007-.362-.02v1.676h-1.05v-4.628zm15.476 8.97H4.57c-.591 0-1.072-.48-1.072-1.072v-1.24h13.282c.616 0 1.116-.5 1.116-1.115v-6.763c0-.616-.5-1.115-1.116-1.115H3.497V2.767c0-.59.481-1.07 1.072-1.07l9.808-.01v3.625c0 1.059.86 1.919 1.92 1.919l3.551-.01.04 16.012c0 .591-.48 1.072-1.07 1.072zm-11.43-4.363v-4.607c.39-.062.897-.096 1.433-.096.89 0 1.468.16 1.92.5.488.362.793.94.793 1.768 0 .897-.326 1.517-.779 1.9-.494.41-1.245.605-2.164.605-.55 0-.94-.035-1.204-.07zm7.594-2.727v.862h-1.684v1.886h-1.065v-4.69H15.1v.87h-1.802v1.072h1.684z"
                            />
                          </svg>
                          <span>INVOICE (PDF)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Card Content Grid */}
                  <div className="mp-history-body">
                    {/* Left Column: Modules & Purchase Timing */}
                    <div className="mp-modules-col">
                      <div className="mb-2">
                        <span className="mp-meta-label">Purchased Modules</span>
                        {modules.map((mod, i) => (
                          <div key={i} className="mp-module-item mt-2">
                            <div className="mp-module-item-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                              </svg>
                            </div>
                            <div>
                              <div className="mp-module-item-name">
                                {mod.moduleName || mod.name || "Module Access"}
                              </div>
                              <div className="mp-module-item-desc">
                                {mod.units ? `${mod.units} allocated user seat${mod.units === 1 ? "" : "s"}` : "Standard Tier"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Info Chips */}
                      <div className="mp-info-chips">
                        <div className="mp-chip">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          Date: <strong>{formatTimestamp(purchase.createdAt)}</strong>
                        </div>

                        {purchase.moduleExpiresAt && (
                          <div className="mp-chip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            Expires: <strong>{formatTimestamp(purchase.moduleExpiresAt)}</strong>
                          </div>
                        )}

                        <div className="mp-chip">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                            <line x1="1" y1="10" x2="23" y2="10"/>
                          </svg>
                          Plan: <strong>{planLabel}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Pricing & Calculation Breakdown Box */}
                    <div className="mp-pricing-box">
                      <div className="mp-meta-label" style={{ marginBottom: "12px" }}>
                        Payment Summary
                      </div>

                      {details.totalModulePrice != null && (
                        <div className="mp-pricing-row">
                          <span>Module Price</span>
                          <span>
                            {cur} {sym}{formatCurrency(details.totalModulePrice, cur)}
                          </span>
                        </div>
                      )}

                      {details.totalMonthlyMaintenance != null && (
                        <div className="mp-pricing-row">
                          <span>
                            Annual Maintenance ({sym}{formatCurrency(details.totalMonthlyMaintenance, cur)}/mo × 12)
                          </span>
                          <span>
                            {cur} {sym}{formatCurrency(details.totalMonthlyMaintenance * 12, cur)}
                          </span>
                        </div>
                      )}

                      {details.totalMonthlyCost != null && details.totalMonthlyCost > 0 && (
                        <div className="mp-pricing-row">
                          <span>Additional Users</span>
                          <span>
                            {cur} {sym}{formatCurrency(details.totalMonthlyCost, cur)}
                          </span>
                        </div>
                      )}

                      <div className="mp-pricing-row">
                        <span>Payment Method</span>
                        <span>Credit / Debit Card</span>
                      </div>

                      <div className="mp-pricing-row total">
                        <span>Total Paid</span>
                        <span>
                          {cur} {sym}{formatCurrency(amount, cur)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulePurchases;
