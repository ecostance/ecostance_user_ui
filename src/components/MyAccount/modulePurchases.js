import { useEffect, useMemo, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
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
import { MODULE_ACCESS } from "src/constants/moduleAccess";
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
    return `${monthPart}${dayPart} left to renew`;
  }
  return `${days} day${days === 1 ? "" : "s"} left to renew`;
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

const ModulePurchases = ({ moduleSupported = [] }) => {
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

  const formatPurchaseNumber = (num) => {
    if (!num) return "";
    return String(num)
      .split("")
      .map((c, i) => (i === 4 || i === 8 ? ` ${c}` : c))
      .join("");
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
    return list.filter((mod) => !mod.expiry || mod.expiry > now);
  }, [activeModules, purchases, now]);

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
            mod.otherDetail?.numberofUnit,
        };
      }),
    [allActiveModules, purchases],
  );

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="my-account-area__content no--border">
      <h3>Module Purchases</h3>

      {moduleDetails.length > 0 && (
        <div className="mb-4">
          <h5 style={{ marginBottom: "12px" }}>Active Modules</h5>
          {moduleDetails.map((entry, index) => (
            <Card key={entry.mod._id || index} className="mb-3 p-3">
              <h6 style={{ marginBottom: "10px" }}>{entry.label}</h6>
              <p className="mb-1">
                <strong>Purchased:</strong> {formatTimestamp(entry.purchasedAt)}
              </p>
              <p className="mb-1">
                <strong>Unlocked:</strong> {formatTimestamp(entry.unlockedAt)}
              </p>
              <p className="mb-1">
                <strong>Renewal:</strong> {entry.renewalLabel}
                {entry.expiry
                  ? ` (expires ${formatTimestamp(entry.expiry)})`
                  : ""}
              </p>
              {entry.units ? (
                <p className="mb-0">
                  <strong>Units:</strong> {entry.units}
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      {!purchases.length ? (
        <p>No module purchase orders found.</p>
      ) : (
        <>
          <h5 style={{ marginBottom: "16px", marginTop: "24px" }}>
            Purchase History
          </h5>
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

            return (
              <Card
                key={purchase._id || index}
                className="my-account--order-card mb-3"
              >
                <div className="orders-main-container p-3">
                  <div
                    className="d-flex justify-content-between align-items-center flex-wrap"
                    style={{
                      gap: "12px",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div className="orders--orderNumber-PDF-holder">
                      <p className="orders--orderNumber-Holder mb-0">
                        Purchase #:{" "}
                        <b>{formatPurchaseNumber(purchase.purchaseNumber)}</b>
                      </p>
                    </div>
                    <div
                      className="orders--download-pdf-holder"
                      style={{
                        cursor: isDownloading ? "not-allowed" : "pointer",
                      }}
                      onClick={() =>
                        !isDownloading && handleInvoiceDownload(purchase)
                      }
                      title="Download Invoice PDF"
                    >
                      {isDownloading ? (
                        <Spinner animation="border" size="sm" variant="danger" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="26"
                          fill="none"
                          viewBox="0 0 22 26"
                        >
                          <path
                            fill="#B7323B"
                            d="M5.66 16.727c0-.431-.3-.689-.829-.689-.216 0-.362.021-.438.042v1.385c.09.02.201.027.355.027.563 0 .911-.284.911-.765zM8.931 16.053c-.236 0-.39.02-.48.041v3.069c.09.02.237.02.37.02.96.008 1.586-.521 1.586-1.641.007-.974-.564-1.49-1.476-1.49z"
                          ></path>
                          <path
                            fill="#B7323B"
                            d="M15.011 0H4.57A2.771 2.771 0 001.8 2.767V13h-.27c-.616 0-1.115.499-1.115 1.115v6.763c0 .616.5 1.115 1.115 1.115h.27v1.24A2.77 2.77 0 004.57 26h14.248a2.77 2.77 0 002.767-2.767V6.549L15.01 0zM3.341 15.335a8.742 8.742 0 011.434-.096c.654 0 1.12.124 1.433.375.3.236.501.627.501 1.086 0 .459-.153.849-.431 1.113-.362.34-.898.494-1.524.494-.14 0-.264-.007-.362-.02v1.676h-1.05v-4.628zm15.476 8.97H4.57c-.591 0-1.072-.48-1.072-1.072v-1.24h13.282c.616 0 1.116-.5 1.116-1.115v-6.763c0-.616-.5-1.115-1.116-1.115H3.497V2.767c0-.59.481-1.07 1.072-1.07l9.808-.01v3.625c0 1.059.86 1.919 1.92 1.919l3.551-.01.04 16.012c0 .591-.48 1.072-1.07 1.072zm-11.43-4.363v-4.607c.39-.062.897-.096 1.433-.096.89 0 1.468.16 1.92.5.488.362.793.94.793 1.768 0 .897-.326 1.517-.779 1.9-.494.41-1.245.605-2.164.605-.55 0-.94-.035-1.204-.07zm7.594-2.727v.862h-1.684v1.886h-1.065v-4.69H15.1v.87h-1.802v1.072h1.684z"
                          ></path>
                        </svg>
                      )}
                      <p style={{ margin: 0 }}>Invoice</p>
                    </div>
                  </div>

                  <div
                    className="d-flex justify-content-between flex-wrap"
                    style={{ gap: "20px" }}
                  >
                    <div style={{ flex: 1, minWidth: "260px" }}>
                      <p className="mb-1">
                        <strong>Date:</strong> {formatTimestamp(purchase.createdAt)}
                      </p>
                      <p className="mb-1">
                        <strong>Status:</strong>{" "}
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                            textTransform: "capitalize",
                            backgroundColor:
                              purchase.status === "completed" ||
                              purchase.status === "active"
                                ? "#dcfce7"
                                : "#fef3c7",
                            color:
                              purchase.status === "completed" ||
                              purchase.status === "active"
                                ? "#166534"
                                : "#92400e",
                          }}
                        >
                          {purchase.status || "Completed"}
                        </span>
                      </p>
                      <p className="mb-1">
                        <strong>Plan:</strong> {planLabel}
                      </p>
                      {purchase.moduleExpiresAt && (
                        <p className="mb-1">
                          <strong>Expires:</strong>{" "}
                          {formatTimestamp(purchase.moduleExpiresAt)}
                        </p>
                      )}
                      {purchase.unlockedAt && (
                        <p className="mb-1">
                          <strong>Unlocked:</strong>{" "}
                          {formatTimestamp(purchase.unlockedAt)}
                        </p>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: "260px" }}>
                      <p className="mb-1">
                        <strong>Amount Paid:</strong>{" "}
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#111",
                          }}
                        >
                          {cur} {sym}
                          {formatCurrency(amount, cur)}
                        </span>
                      </p>
                      {details.totalModulePrice != null && (
                        <p
                          className="mb-1"
                          style={{ fontSize: "13px", color: "#666" }}
                        >
                          • Base Price: {cur} {sym}
                          {formatCurrency(details.totalModulePrice, cur)}
                        </p>
                      )}
                      {details.totalMonthlyMaintenance != null && (
                        <p
                          className="mb-1"
                          style={{ fontSize: "13px", color: "#666" }}
                        >
                          • Maintenance: {cur} {sym}
                          {formatCurrency(
                            details.totalMonthlyMaintenance,
                            cur,
                          )}
                          /mo ({sym}
                          {formatCurrency(
                            details.totalMonthlyMaintenance * 12,
                            cur,
                          )}
                          /yr)
                        </p>
                      )}

                      {modules.length > 0 && (
                        <div style={{ marginTop: "10px" }}>
                          <strong>Modules:</strong>
                          <ul style={{ marginBottom: 0, paddingLeft: "18px" }}>
                            {modules.map((mod, i) => (
                              <li key={i}>
                                <b>
                                  {mod.moduleName || mod.name || "Module"}
                                </b>
                                {mod.units
                                  ? ` (${mod.units} unit${
                                      mod.units === 1 ? "" : "s"
                                    })`
                                  : ""}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
};

export default ModulePurchases;
