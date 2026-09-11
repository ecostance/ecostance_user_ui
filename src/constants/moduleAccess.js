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
    tabKey: "businessEvent",
  },
  4: {
    id: 4,
    name: "Digital Passport Page",
    routes: ["/other/my-account", "/other/my-business-account"],
    query: { sustainability: "true" },
    tabKey: "productInfo",
  },
  5: {
    id: 5,
    name: "Supply Chain",
    routes: ["/other/my-business-account"],
    tabKey: "supplierDetails",
  },
};

export const MODULE_ADMIN_EMAIL = "tony@ecostance.com";

export const MODULE_ALIASES = {
  1: [
    "business account",
    "my business account",
    "business",
    "business account module",
    "businessaccount",
    "business-account",
  ],
  2: [
    "employee account",
    "my employer account",
    "employer account",
    "employee",
    "employee account module",
  ],
  3: [
    "event page",
    "business event",
    "event",
    "events",
    "conference carbon offset",
    "event page module",
  ],
  4: [
    "digital passport page",
    "digital product passport",
    "digital product passport page",
    "digital passport",
    "product passport",
    "digital product passports",
    "digital passports",
    "product info",
    "productinfo",
    "digital identity",
    "dpp",
    "digital passport page module",
  ],
  5: [
    "supply chain",
    "suppliers",
    "supplier details",
    "verified supply chain",
    "supply chain module",
  ],
};

export const parseExpiryToMs = (value) => {
  if (value == null || value === "") return null;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return num < 1e11 ? num * 1000 : num;
};

export const isModuleExpired = (expiryValue) => {
  const expiryMs = parseExpiryToMs(expiryValue);
  if (!expiryMs) return false;
  return expiryMs <= Date.now();
};

export const getEntryModuleId = (entry) => {
  if (entry == null) return null;
  if (typeof entry === "number") return entry;
  if (typeof entry === "string" && /^\d+$/.test(entry.trim())) return Number(entry.trim());
  const rawId =
    entry?.otherDetail?.moduleId ??
    entry?.moduleId ??
    entry?.id ??
    entry?._id;
  if (rawId != null && !Number.isNaN(Number(rawId))) {
    return Number(rawId);
  }
  return null;
};

export const findActiveModuleEntry = (moduleSupported = [], moduleId) => {
  const targetId = Number(moduleId);
  const moduleConfig = MODULE_ACCESS[targetId];
  if (!moduleConfig) return null;

  const targetAliases = (MODULE_ALIASES[targetId] || []).map((s) => s.toLowerCase().trim());
  const targetName = (moduleConfig.name || "").toLowerCase().trim();

  const list = Array.isArray(moduleSupported)
    ? moduleSupported
    : moduleSupported
    ? [moduleSupported]
    : [];

  return (
    list.find((entry) => {
      if (!entry) return false;

      const expiryVal = entry?.expiry ?? entry?.moduleExpiresAt ?? entry?.expiresAt;
      if (isModuleExpired(expiryVal)) return false;

      const entryId = getEntryModuleId(entry);
      if (entryId != null && entryId === targetId) return true;

      const entryName = (
        entry?.name ||
        entry?.moduleName ||
        entry?.productName ||
        entry?.title ||
        (typeof entry === "string" ? entry : "")
      )
        .toLowerCase()
        .trim();

      if (entryName) {
        if (entryName === targetName) return true;
        if (
          targetAliases.some(
            (alias) =>
              entryName === alias ||
              entryName.includes(alias) ||
              alias.includes(entryName)
          )
        ) {
          return true;
        }
      }

      return false;
    }) || null
  );
};

export const hasModuleAccess = (moduleSupported = [], moduleId) => {
  return Boolean(findActiveModuleEntry(moduleSupported, moduleId));
};

export const hasAnyModuleAccess = (moduleSupported = [], moduleIds = []) =>
  moduleIds.some((id) => hasModuleAccess(moduleSupported, id));

export const mergeModuleLists = (primary = [], secondary = []) => {
  const list = [...(Array.isArray(primary) ? primary : [])];
  const additions = Array.isArray(secondary) ? secondary : [];

  additions.forEach((mod) => {
    if (!mod) return;
    const modId = getEntryModuleId(mod);
    const modName = (
      mod?.name ||
      mod?.moduleName ||
      mod?.productName ||
      ""
    )
      .toLowerCase()
      .trim();

    const exists = list.some((existing) => {
      if (!existing) return false;
      const existingId = getEntryModuleId(existing);
      const existingName = (
        existing?.name ||
        existing?.moduleName ||
        existing?.productName ||
        ""
      )
        .toLowerCase()
        .trim();

      const idMatch = modId != null && existingId != null && modId === existingId;
      const nameMatch = Boolean(modName && existingName && modName === existingName);
      return idMatch || nameMatch;
    });

    if (!exists) {
      list.push(mod);
    }
  });

  return list;
};

const STORAGE_KEY = "ecostance_user_purchased_modules";

export const getCachedPurchasedModules = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) => !isModuleExpired(m?.expiry ?? m?.moduleExpiresAt ?? m?.expiresAt)
    );
  } catch {
    return [];
  }
};

export const cachePurchasedModules = (modules = []) => {
  if (typeof window === "undefined" || !Array.isArray(modules)) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
  } catch (e) {
    console.warn("Could not cache purchased modules:", e);
  }
};

export const fetchUserPurchasedModules = async (profile) => {
  if (typeof window === "undefined") return [];
  try {
    const { getCookie } = await import("cookies-next");
    if (!getCookie("JWTToken")) return getCachedPurchasedModules();

    const { getModulePurchases, getAllModuleOrders } = await import(
      "src/apiClient/orders"
    );

    const [purchasesRes, ordersRes] = await Promise.all([
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
      ""
    ).trim();

    const customerProfileId = String(
      profile?.customerProfile?._id ||
      profile?.data?.customerProfile?._id ||
      profile?.customerProfile ||
      ""
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
        typeof cust === "string" ? cust : cust?._id || cust?.user || ""
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
    if (purchasesRes?.status === 200 && purchasesRes.data) {
      rawPurchases =
        purchasesRes.data.data ||
        purchasesRes.data.ModulePurchases ||
        purchasesRes.data.modulePurchases ||
        (Array.isArray(purchasesRes.data) ? purchasesRes.data : []);
    }

    let rawOrders = [];
    if (ordersRes?.status === 200 && ordersRes.data) {
      rawOrders =
        ordersRes.data.data ||
        ordersRes.data.orders ||
        ordersRes.data.ModulePurchases ||
        (Array.isArray(ordersRes.data) ? ordersRes.data : []);
    }

    const allOrders = [
      ...(Array.isArray(rawPurchases) ? rawPurchases : []),
      ...(Array.isArray(rawOrders) ? rawOrders : []),
    ].filter(matchesUser);

    const extractedModules = [];
    allOrders.forEach((order) => {
      const items =
        order?.selectedModules ||
        order?.products ||
        [];

      items.forEach((item) => {
        const rawModId =
          item?.moduleId ??
          item?.otherDetail?.moduleId ??
          item?.id ??
          item?.product?.moduleId;

        const name =
          item?.moduleName ||
          item?.name ||
          item?.productName ||
          (rawModId ? MODULE_ACCESS[rawModId]?.name : null);

        let resolvedId = rawModId != null && !Number.isNaN(Number(rawModId)) ? Number(rawModId) : null;
        if (!resolvedId && name) {
          const lowerName = name.toLowerCase().trim();
          for (const [mid, aliases] of Object.entries(MODULE_ALIASES)) {
            if (
              aliases.some(
                (a) =>
                  lowerName === a ||
                  lowerName.includes(a) ||
                  a.includes(lowerName)
              )
            ) {
              resolvedId = Number(mid);
              break;
            }
          }
        }

        if (!resolvedId) return;

        const expiry = order?.moduleExpiresAt || order?.expiresAt;
        if (isModuleExpired(expiry)) return;

        const units =
          item?.units ||
          item?.additionalQuantity ||
          item?.additionalUsers ||
          1;

        const exists = extractedModules.some(
          (m) => Number(m.moduleId) === resolvedId
        );
        if (!exists) {
          extractedModules.push({
            name: name || MODULE_ACCESS[resolvedId]?.name || `Module ${resolvedId}`,
            moduleId: resolvedId,
            expiry,
            purchasedAt: order?.createdAt,
            unlockedAt:
              order?.moduleUnlockedAt ||
              order?.unlockedAt ||
              order?.activatedAt ||
              order?.createdAt,
            units,
            otherDetail: {
              moduleId: resolvedId,
              numberofUnits: units,
            },
          });
        }
      });
    });

    if (extractedModules.length > 0) {
      cachePurchasedModules(extractedModules);
      return extractedModules;
    }

    return getCachedPurchasedModules();
  } catch (err) {
    console.error("fetchUserPurchasedModules error:", err);
    return getCachedPurchasedModules();
  }
};
