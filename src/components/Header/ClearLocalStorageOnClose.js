import { useEffect } from "react";

const ClearsessionStorageOnClose = () => {
  useEffect(() => {
    const handleBeforeUnload = () => {
        localStorage.removeItem("businessCode");
        localStorage.removeItem("businessId");
        localStorage.removeItem("MyBusinessDetails");
        // localStorage.removeItem("TotalOrders")
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default ClearsessionStorageOnClose;
