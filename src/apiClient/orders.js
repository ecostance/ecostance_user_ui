import request from "./request";
import { getCookie } from "cookies-next";

export const saveStripeCheckout = async (checkout) => {
  checkout.referalUserId =
    localStorage.getItem("ReferralID") === localStorage.getItem("userId")
      ? ""
      : localStorage.getItem("ReferralID");
  localStorage.removeItem("ReferralID");
  if (localStorage.getItem("modulepurchase")) {
    checkout.isModulePurchase = true;
  }
  if (localStorage.getItem("BusinessOrderSelection") === "yes") {
    localStorage.setItem("isLastOrderBusiness", true);
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"));
    checkout.isBusinessOrder = true;
    checkout.buyerEmail = localStorage.getItem("email");
    checkout.businessCode = BusinessDetails?.businessCode;
    checkout.firstName = BusinessDetails?.name;
    checkout.lastName = ".";
    checkout.address.firstName = BusinessDetails?.name;
    checkout.address.lastName = ".";
    checkout.businessOwnerUserId = localStorage.getItem("userId");
    if (localStorage.getItem("eventOwnerOrder")) {
      checkout.conferanceCode = localStorage.getItem("conferenceCode");
      checkout.eventOwnerOrder = true;
    }
  } else {
    checkout.conferanceCode = localStorage.getItem("conferenceCode");
    checkout.businessEventUserId = localStorage.getItem("userEventId");
    localStorage.setItem("isLastOrderBusiness", false);
  }
  if (getCookie("JWTToken")) {
    const response = await request.post("v1/orders", checkout, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    });
    if (response.status !== 200) throw "order failed";
    else return response.data;
  } else {
    throw new Error("Missing JWTToken cookie; cannot create order");
  }
};

export const cartTransfer = async () => {
  let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"));
  let body = {
    businessCode: BusinessDetails?.businessCode,
  };
  if (getCookie("JWTToken")) {
    let cartResponse = await request.put(`/v1/carts/transfer`, body, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    });
    return cartResponse.data;
  }
};

export const getOrderPdf = async (orderId, lastOrder) => {
  console.log("localorder", lastOrder);
  let apiEndpoint;
  console.log(lastOrder, true, "api-last-order", typeof lastOrder, typeof true);
  if (lastOrder) {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"));
    let businessCode = BusinessDetails?.businessCode;
    apiEndpoint = `v1/orders/${orderId}?isBusinessOrder=${lastOrder}&businessCode=${businessCode}`;
  } else {
    apiEndpoint = `v1/orders/${orderId}`;
  }
  console.log("kjgdkwgefkwef", getCookie("JWTToken"));
  if (getCookie("JWTToken")) {
    return await request.get(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    });
  }
};

export const getAllOrders = async (page, token) => {
  if (getCookie("JWTToken") || token) {
    return await request.get(`/v1/customer-orders?page=${page}&cert={true}`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken") || token}`,
      },
    });
  }
};


export const getAllModuleOrders = async (page, token) => {
  if (getCookie("JWTToken") || token) {
    return await request.get(`v1/customer-orders/modules`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken") || token}`,
      },
    });
  }
};

export const getAdminModulePurchases = async ({ page, limit, status, pricingLinkId } = {}) => {
  const token = getCookie("JWTToken");
  if (!token) return;

  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (status) params.append("status", status);
  if (pricingLinkId) params.append("pricingLinkId", pricingLinkId);

  const queryString = params.toString();
  const url = `v1/admin/module-purchases${queryString ? `?${queryString}` : ""}`;

  return await request.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
