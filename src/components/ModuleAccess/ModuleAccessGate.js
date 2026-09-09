import { useEffect, useState } from "react";
import ModuleLockedModal from "./ModuleLockedModal";
import { hasAnyModuleAccess, hasModuleAccess, MODULE_ACCESS } from "src/constants/moduleAccess";
import { me } from "src/apiClient/auth";

const ModuleAccessGate = ({
  moduleId,
  moduleIds,
  meData,
  userData,
  children,
}) => {
  const [profile, setProfile] = useState(meData);
  const ids = moduleIds?.length ? moduleIds : [moduleId];
  const primaryModuleId = moduleId || ids[0];
  const moduleName =
    MODULE_ACCESS[primaryModuleId]?.name ||
    ids.map((id) => MODULE_ACCESS[id]?.name).filter(Boolean).join(" / ");

  useEffect(() => {
    setProfile(meData);
  }, [meData]);

  useEffect(() => {
    const hasModules =
      profile?.moduleSupported?.length ||
      profile?.data?.moduleSupported?.length;
    if (!hasModules && userData?.isLoggedIn) {
      me()
        .then((res) => setProfile(res))
        .catch(() => {});
    }
  }, [profile, userData?.isLoggedIn]);

  const moduleSupported = profile?.moduleSupported || profile?.data?.moduleSupported || [];
  const access =
    ids.length > 1
      ? hasAnyModuleAccess(moduleSupported, ids)
      : hasModuleAccess(moduleSupported, primaryModuleId);

  if (!access) {
    return (
      <ModuleLockedModal
        show
        moduleId={primaryModuleId}
        moduleName={moduleName}
        defaultName={
          userData?.user?.firstName
            ? `${userData.user.firstName} ${userData.user.lastName || ""}`.trim()
            : ""
        }
        defaultEmail={userData?.user?.email || ""}
        defaultCompany=""
      />
    );
  }

  return children;
};

export default ModuleAccessGate;
