import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";
import fileDownload from "js-file-download";
import { getCookie } from "cookies-next";
import { useToasts } from "react-toast-notifications";
import { getModulePurchases } from "src/apiClient/orders";
import { getFormattedDate, getFormattedTime } from "src/helpers/formatDateTime";
import formatCurrency from "src/helpers/formatCurrency";

const ModulePurchases = ({ moduleSupported = [] }) => {
  const { addToast } = useToasts();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await getModulePurchases();
        if (response?.status === 200) {
          setPurchases(response.data?.data || []);
        }
      } catch (err) {
        console.error("Error fetching module purchases:", err);
      } finally {
        setLoading(false);
      }
    };
    if (getCookie("JWTToken")) fetchPurchases();
    else setLoading(false);
  }, []);

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

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!purchases.length) {
    return (
      <div className="my-account-area__content no--border">
        <h3>Module Purchases</h3>
        <p>No module purchases found.</p>
      </div>
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const activeModules = (moduleSupported || []).filter(
    (m) => !m.expiry || m.expiry > now,
  );

  return (
    <div className="my-account-area__content no--border">
      <h3>Module Purchases</h3>

      {activeModules.length > 0 && (
        <Card className="mb-4 p-3">
          <h5 style={{ marginBottom: "12px" }}>Active Modules</h5>
          {activeModules.map((mod, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: i < activeModules.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              <span>{mod.name || `Module ${mod.otherDetail?.moduleId || ""}`}</span>
              <span>
                {mod.expiry
                  ? `Expires: ${getFormattedDate(mod.expiry)}`
                  : "No expiry"}
                {mod.units ? ` · ${mod.units} units` : ""}
              </span>
            </div>
          ))}
        </Card>
      )}

      {purchases.map((purchase, index) => {
        const details = purchase.paymentDetails || {};
        const sym = details.currencySymbol || "$";
        const cur = details.currency || "USD";
        const amount =
          details.grandTotal ?? purchase.paymentInfo?.amountPaid ?? 0;
        const planLabel =
          details.paymentPlan === "monthly" ? "12-Month Plan" : "Pay Full Today";
        const modules = purchase.selectedModules || [];
        const invoicePath = purchase.invoice?.filePath;

        return (
          <Card key={purchase._id || index} className="my-account--order-card mb-3">
            <div className="orders-main-container d-flex justify-content-between p-3">
              <div>
                <p>
                  Purchase #: <b>{formatPurchaseNumber(purchase.purchaseNumber)}</b>
                </p>
                <p>
                  Date:{" "}
                  {getFormattedDate(purchase.createdAt)}{" "}
                  {getFormattedTime(purchase.createdAt)}
                </p>
                <p>
                  Amount: {cur} {sym}
                  {formatCurrency(amount, cur)}
                </p>
                <p>Plan: {planLabel}</p>
                <p>Status: {purchase.status || "active"}</p>
                {purchase.moduleExpiresAt && (
                  <p>
                    Expires:{" "}
                    {getFormattedDate(purchase.moduleExpiresAt)}{" "}
                    {getFormattedTime(purchase.moduleExpiresAt)}
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
                      handleFileDownload(invoicePath, purchase.purchaseNumber)
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
    </div>
  );
};

export default ModulePurchases;
