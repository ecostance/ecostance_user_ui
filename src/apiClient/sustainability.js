import { getCookie } from "cookies-next";
import request from "./request";

export const checkSlug = async (slug) => {
  return await request.get(`${process.env.API_BASE}/v1/users/${slug}`);
};

export const updateSlug = async (slug, newSlug) => {
  if (getCookie("JWTToken")) {
    return await request.patch(
      `${process.env.API_BASE}v1/user-certificate-slugs/${slug}`,
      { newSlug },
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      }
    );
  }
};

export const updateUserSettingInfo = async (data) => {
  if (getCookie("JWTToken")) {
    // const config = {
    //   headers: {
    //     "content-type": "multipart/form-data",
    //   },
    // };
    return await request.patch(
      `${process.env.API_BASE}/v1/sustainability-page-settings`,
      data,
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
          "content-type": "multipart/form-data",
        },
      }
    );
  }
};

export const publishPage = async (data = {}) => {
  if (getCookie("JWTToken")) {
    return await request.patch(
      `${process.env.API_BASE}/v1/sustainability-page-settings/publish`,
      data,
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
          "content-type": "multipart/form-data",
        },
      }
    );
  }
};

export const getUserSettings = async () => {
  if (getCookie("JWTToken")) {
    return await request.get(
      `${process.env.API_BASE}/v1/sustainability-page-settings`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      }
    );
  }
};

export const getPublicUserCertPageViaSlug = async (slug) => {
  return await request.get(
    `${process.env.API_BASE}/v1/sustainability-page-settings/${slug}/public`
  );
};

export const getCurrentSustainabilityPage = async () => {
  if (getCookie("JWTToken")) {
    return await request.get(
      `${process.env.API_BASE}/v1/sustainability-page-settings/`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      }
    );
  }
};

export const getPreviousSustainabilityPage = async () => {
  if (getCookie("JWTToken")) {
    return await request.get(
      `${process.env.API_BASE}/v1/sustainability-page-settings/previous`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      }
    );
  }
};
