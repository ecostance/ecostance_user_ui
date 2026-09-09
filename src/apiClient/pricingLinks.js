import request from "./request";
import { getCookie } from "cookies-next";

/**
 * Create a new pricing link
 * Backend generates the linkId automatically
 * @param {Object} data - Pricing data including userInfo, customPrices, enabledModules, modules, baseTotals
 * @param {Date|string} [expiresAt] - Optional expiration date
 * @returns {Promise<Object>} Response with { success, data: { linkId, ... }, message }
 */
export const createPricingLink = async (data, expiresAt = null) => {
  const payload = { ...data };
  if (expiresAt) {
    payload.expiresAt = expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt;
  }

  const res = await request.post("/v1/pricing-links", payload, {
    headers: {
      Authorization: `Bearer ${getCookie("JWTToken")}`,
    },
  });

  return res;
};

/**
 * Get a pricing link by ID (public endpoint - no auth required)
 * @param {string} linkId - The pricing link ID
 * @returns {Promise<Object>} Response with { success, data, message }
 */
export const getPricingLinkById = async (linkId) => {
  const res = await request.get(`/v1/pricing-links/${linkId}`);
  return res;
};

/**
 * Get all pricing links with pagination (admin endpoint)
 * @param {number} [page=1] - Page number
 * @param {number} [size=10] - Page size
 * @param {string} [status] - Filter by status: 'active', 'expired', 'used'
 * @returns {Promise<Object>} Response with { success, data: { links, total, page, totalPages }, message }
 */
export const getAllPricingLinks = async (page = 1, size = 10, status = null) => {
  let url = `/v1/pricing-links?page=${page}&size=${size}`;
  if (status) {
    url += `&status=${status}`;
  }

  const res = await request.get(url, {
    headers: {
      Authorization: `Bearer ${getCookie("JWTToken")}`,
    },
  });

  return res;
};

/**
 * Delete a pricing link by ID (admin endpoint)
 * @param {string} linkId - The pricing link ID to delete
 * @returns {Promise<Object>} Response with { success, message }
 */
export const deletePricingLink = async (linkId) => {
  const res = await request.delete(`/v1/pricing-links/${linkId}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWTToken")}`,
    },
  });

  return res;
};

/**
 * Update a pricing link by ID (admin endpoint)
 * @param {string} linkId - The pricing link ID to update
 * @param {Object} data - Updated pricing data
 * @returns {Promise<Object>} Response with { success, data, message }
 */
export const updatePricingLink = async (linkId, data) => {
  const res = await request.patch(`/v1/pricing-links/${linkId}`, data, {
    headers: {
      Authorization: `Bearer ${getCookie("JWTToken")}`,
    },
  });

  return res;
};

/**
 * Create or update a pricing link with a specific linkId (upsert - public endpoint)
 * @param {string} linkId - The pricing link ID
 * @param {Object} data - Pricing data
 * @returns {Promise<Object>} Response with { success, data, message }
 */
export const createOrUpdatePricingLink = async (linkId, data) => {
  const res = await request.post(`/v1/pricing-links/${linkId}`, data);
  return res;
};

export const recordPricingLinkEvent = async (linkId, stage, metadata = {}) => {
  const res = await request.post(`/v1/pricing-links/${linkId}/events`, {
    stage,
    metadata,
  });
  return res;
};

export const getAdminPricingFunnel = async ({
  page = 1,
  limit = 10,
  stage,
  email,
  pricingLinkId,
  filter = "all",
} = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (stage) params.append("stage", stage);
  if (email) params.append("email", email);
  if (pricingLinkId) params.append("pricingLinkId", pricingLinkId);
  if (filter) params.append("filter", filter);

  const res = await request.get(`/v1/admin/pricing-funnel?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWTToken")}`,
    },
  });
  return res;
};

export const submitModuleAccessInquiry = async (data) => {
  const token = getCookie("JWTToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await request.post("/v1/module-access-inquiries", data, { headers });
  return res;
};
