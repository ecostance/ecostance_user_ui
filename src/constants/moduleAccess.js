export const MODULE_ACCESS = {
  1: {
    id: 1,
    name: "Business Account",
    routes: ["/other/my-business-account"],
  },
  2: {
    id: 2,
    name: "Employee Account",
    routes: ["/other/my-employer-account"],
  },
  3: {
    id: 3,
    name: "Event Page",
    routes: ["/other/conference-carbon-offset"],
  },
  4: {
    id: 4,
    name: "Digital Passport Page",
    routes: ["/other/my-account"],
    query: { sustainability: "true" },
  },
  5: {
    id: 5,
    name: "Supply Chain",
    routes: ["/other/my-business-account"],
    tabKey: "supplierDetails",
  },
};

export const MODULE_ADMIN_EMAIL = "tony@ecostance.com";

export const hasModuleAccess = (moduleSupported = [], moduleId) => {
  const moduleConfig = MODULE_ACCESS[moduleId];
  if (!moduleConfig) return false;

  const now = Math.floor(Date.now() / 1000);
  return moduleSupported.some((entry) => {
    const entryModuleId = entry?.otherDetail?.moduleId;
    const nameMatch =
      entry?.name &&
      moduleConfig.name &&
      entry.name.toLowerCase() === moduleConfig.name.toLowerCase();
    const idMatch = entryModuleId != null && Number(entryModuleId) === Number(moduleId);
    const notExpired = !entry?.expiry || entry.expiry > now;
    return (idMatch || nameMatch) && notExpired;
  });
};

export const hasAnyModuleAccess = (moduleSupported = [], moduleIds = []) =>
  moduleIds.some((id) => hasModuleAccess(moduleSupported, id));
