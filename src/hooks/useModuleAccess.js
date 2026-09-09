import { useMemo } from "react";
import { hasModuleAccess, MODULE_ACCESS } from "src/constants/moduleAccess";

const useModuleAccess = (moduleId, meData) => {
  const moduleSupported = meData?.moduleSupported || meData?.data?.moduleSupported || [];

  return useMemo(() => {
    const config = MODULE_ACCESS[moduleId];
    const access = hasModuleAccess(moduleSupported, moduleId);
    const activeEntry = moduleSupported.find((entry) => {
      const entryModuleId = entry?.otherDetail?.moduleId;
      const nameMatch =
        entry?.name &&
        config?.name &&
        entry.name.toLowerCase() === config.name.toLowerCase();
      const idMatch = entryModuleId != null && Number(entryModuleId) === Number(moduleId);
      return idMatch || nameMatch;
    });

    return {
      hasAccess: access,
      moduleName: config?.name || "Module",
      units:
        activeEntry?.otherDetail?.numberofUnits ||
        activeEntry?.otherDetail?.numberofUnit ||
        null,
      expiry: activeEntry?.expiry || null,
    };
  }, [moduleId, moduleSupported]);
};

export default useModuleAccess;
