import { useEffect, useMemo, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";
import fileDownload from "js-file-download";
import { getCookie } from "cookies-next";
import { useToasts } from "react-toast-notifications";
import { me } from "src/apiClient/auth";
import { getAllModuleOrders, getModulePurchases } from "src/apiClient/orders";
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
  createdAt: order?.createdAt,
  status: order?.status || "active",
  moduleExpiresAt: order?.moduleExpiresAt,
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
  const moduleId = mod?.otherDetail?.moduleId;
  return (
    mod?.name ||
    MODULE_ACCESS[moduleId]?.name ||
    (moduleId ? `Module ${moduleId}` : "Module")
  );
};

const moduleMatchesPurchase = (mod, purchase) => {
  const modId = mod?.otherDetail?.moduleId;
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

const ModulePurchases = ({ moduleSupported = [] }) => {
  const { addToast } = useToasts();
  const [purchases, setPurchases] = useState([]);
  const [activeModules, setActiveModules] = useState(moduleSupported || []);
  const [loading, setLoading] = useState(true);

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
        let purchaseList = [];
        const purchasesResponse = await getModulePurchases();
        if (purchasesResponse?.status === 200) {
          purchaseList = purchasesResponse.data?.data || [];
        }

        if (!purchaseList.length) {
          const ordersResponse = await getAllModuleOrders();
          if (ordersResponse?.status === 200) {
            const rawOrders =
              ordersResponse.data?.data ||
              ordersResponse.data?.orders ||
              ordersResponse.data ||
              [];
            purchaseList = (Array.isArray(rawOrders) ? rawOrders : []).map(
              normalizeModuleOrder,
            );
          }
        }

        setPurchases(purchaseList);

        if (!moduleSupported?.length) {
          const profile = await me();
          const supported =
            profile?.moduleSupported || profile?.data?.moduleSupported || [];
          if (supported.length) setActiveModules(supported);
        }
      } catch (err) {
        console.error("Error fetching module purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleSupported?.length]);

  const handleFileDownload = async (link, purchaseNum) => {
    axios
      .get(link, { responseType: "blob" })
      .then((res) => {
        fileDownload(res.data, `MODULE-PURCHASE-${purchaseNum}.pdf`);
      })
      .catch(() => {
        addToast("Download failed!", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const formatPurchaseNumber = (num) => {
    if (!num) return "";
    return String(num)
      .split("")
      .map((c, i) => (i === 4 || i === 8 ? ` ${c}` : c))
      .join("");
  };

  const now = Math.floor(Date.now() / 1000);
  const unlockedModules = useMemo(
    () =>
      (activeModules || []).filter((mod) => !mod.expiry || mod.expiry > now),
    [activeModules, now],
  );

  const moduleDetails = useMemo(
    () =>
      unlockedModules.map((mod) => {
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
    [unlockedModules, purchases],
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
          <h5 style={{ marginBottom: "12px" }}>Purchase History</h5>
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
            const invoicePath = purchase.invoice?.filePath;

            return (
              <Card
                key={purchase._id || index}
                className="my-account--order-card mb-3"
              >
                <div className="orders-main-container d-flex justify-content-between p-3">
                  <div>
                    <p>
                      Purchase #:{" "}
                      <b>{formatPurchaseNumber(purchase.purchaseNumber)}</b>
                    </p>
                    <p>
                      Date: {formatTimestamp(purchase.createdAt)}
                    </p>
                    <p>
                      Amount: {cur} {sym}
                      {formatCurrency(amount, cur)}
                    </p>
                    <p>Plan: {planLabel}</p>
                    <p>Status: {purchase.status || "active"}</p>
                    {purchase.moduleExpiresAt && (
                      <p>
                        Expires: {formatTimestamp(purchase.moduleExpiresAt)}
                      </p>
                    )}
                    {purchase.unlockedAt && (
                      <p>
                        Unlocked: {formatTimestamp(purchase.unlockedAt)}
                      </p>
                    )}
                    {modules.length > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <strong>Modules:</strong>
                        <ul style={{ marginBottom: 0 }}>
                          {modules.map((mod, i) => (
                            <li key={i}>
                              {mod.moduleName || mod.name || "Module"}
                              {mod.units ? ` (${mod.units} units)` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {invoicePath && (
                    <div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          handleFileDownload(
                            invoicePath,
                            purchase.purchaseNumber,
                          )
                        }
                      >
                        Download Invoice
                      </button>
                    </div>
                  )}
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
