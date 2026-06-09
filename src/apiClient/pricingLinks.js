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
