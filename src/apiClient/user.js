import request from "./request";
import { getCookie } from "cookies-next";

export const getCertificates = async (slug) => {
  return await request.get(`/v1/users/${slug}/certificates`);
};

export const updateBillingAddress = async (address) => {
  if (getCookie("JWTToken")) {
    return await request.patch(`/v1/addresses`, address, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    });
  }
};

export const verifyLoggedIn = async () => {
  return await request.get(`/v1/verify-token`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWTToken")}`,
    },
  });
};

export const getMetric = async (token) => {
  if (getCookie("JWTToken") || token) {
    return await request.get(`/v1/metrics`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken") || token}`,
      },
    });
  }
};

export const getGraphicMetricData = async (data) => {
  if (getCookie("JWTToken")) {
    return await request.get(`v1/orders/graph`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    });
  }
};


export const saveProfileInfo = async (data) => {
  if (getCookie("JWTToken")) {
    return await request.patch(`/v1/save-profile-info`, data, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    });
  }
};

export const trackCountry = async () => {
  try {
    return await request.patch("/v1/track-country");
  } catch (err) {
    console.log(err, "ipstack error");
  }
};

export const getRefferalData = async (data) => {
  if (getCookie("JWTToken")) {
    return await request.get(`auth/referral/stats?periodType=${data}`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    });
  }
};


export const getEarningData = async (data) => {
  if (getCookie("JWTToken")) {
    return await request.get(`auth/referral/earning/stats?periodType=${data}`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    });
  }
};


export const getAllRefferalLogs = async (page, size) => {
  let userId = localStorage.getItem("userId")
  // if (getCookie("JWTToken")) {
  return await request.get(`v1/referral-user-earning-logs/user/${userId}?page=${page}&size=${size}`, {
    // headers: {
    //   Authorization: `Bearer ${getCookie("JWTToken")}`,
    // },
  });
  // }
};


export const getAnnualGraph = async () => {
  return await request.get(`/v1/orders/annual/graph`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWTToken")}`,
    },
  });
};