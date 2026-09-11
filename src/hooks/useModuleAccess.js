import { useMemo } from "react";
import {
  hasModuleAccess,
  findActiveModuleEntry,
  MODULE_ACCESS,
  mergeModuleLists,
  getCachedPurchasedModules,
} from "src/constants/moduleAccess";

const useModuleAccess = (moduleId, meData) => {
  const rawModules = meData?.moduleSupported || meData?.data?.moduleSupported || [];

  return useMemo(() => {
    const moduleSupported = mergeModuleLists(rawModules, getCachedPurchasedModules());
    const config = MODULE_ACCESS[moduleId];
    const access = hasModuleAccess(moduleSupported, moduleId);
    const activeEntry = findActiveModuleEntry(moduleSupported, moduleId);

    return {
      hasAccess: access,
      moduleName: config?.name || "Module",
      units:
        activeEntry?.units ||
        activeEntry?.otherDetail?.numberofUnits ||
        activeEntry?.otherDetail?.numberofUnit ||
        null,
      expiry: activeEntry?.expiry || activeEntry?.moduleExpiresAt || null,
    };
  }, [moduleId, rawModules]);
};

export default useModuleAccess;
