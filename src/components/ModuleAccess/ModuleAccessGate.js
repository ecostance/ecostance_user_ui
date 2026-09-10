import { useEffect, useState } from "react";
import ModuleLockedModal from "./ModuleLockedModal";
import { hasAnyModuleAccess, hasModuleAccess, MODULE_ACCESS } from "src/constants/moduleAccess";
import { me } from "src/apiClient/auth";

import { useRouter } from "next/router";

const ModuleAccessGate = ({
  moduleId,
  moduleIds,
  meData,
  userData,
  onHide,
  children,
}) => {
  const router = useRouter();
  const handleClose =
    onHide ||
    (() => {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/other/my-business-account");
      }
    });
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
        onHide={handleClose}
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
