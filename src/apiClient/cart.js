import request from "./request";
import { getCookie } from "cookies-next";

export const getCart = async () => {
  if (getCookie("JWTToken")) {
    return await request.get("/v1/carts", {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    });
  }
};

export const deleteItemFromCart = async (id, getStripeCoupon, isModuleProduct = false) => {
  if (getCookie("JWTToken")) {
    const body = {};
    if (typeof getStripeCoupon !== "undefined" && getStripeCoupon !== null) {
      body.getStripeCoupon = getStripeCoupon;
    }
    if (isModuleProduct) {
      body.isModuleProduct = true;
    }
    return await request.patch(
      `/v1/carts/${id}/remove`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      }
    );
  }
};

export const updateCart = async (
  items,
  currency,
  preLogin = false,
  getStripeCoupon = false,
  type = "regular"
) => {
  console.log(items, "items");
  let cartData;
  if (!localStorage.getItem("conferenceCode")) {
    cartData = {
      products: items,
      updateCurrency: currency,
      itemsPreLogin: preLogin,
      getStripeCoupon: getStripeCoupon,
      type,
    };
  } else {
    cartData = {
      products: items,
      updateCurrency: currency,
      itemsPreLogin: preLogin,
      getStripeCoupon: getStripeCoupon,
      type,
      conferanceCode: localStorage.getItem("conferenceCode"),
    };
    if (localStorage.getItem("eventOwnerOrder")) {
      cartData.eventOwnerOrder = localStorage.getItem("eventOwnerOrder");
    } else {
      cartData.productId = localStorage.getItem("lowestProduct");
      cartData.businessEventUserId = localStorage.getItem("userEventId");
    }
  }
  try {
    if (getCookie("JWTToken")) {
      return await request.patch("/v1/carts", cartData, {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// export const updateCartModule = async () => {
//   let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"));
//   let businessCode = BusinessDetails?.businessCode;
//   if (getCookie("JWTToken")) {
//     return await request.put(
//       `/v1/carts/transfer/reverse`,
//       { businessCode: businessCode },
//       {
//         headers: {
//           Authorization: `Bearer ${getCookie("JWTToken")}`,
//         },
//       }
//     );
//   }
// };

export const updateCartModule = async (items, isModuleProduct = false) => {
  console.log("updateCartModule called with:", { items, isModuleProduct });
  
  let cartData;
  
  if (isModuleProduct) {
    // New structure for module products
    cartData = {
      isModuleProduct: true,
      moduleProducts: items,
      updateCurrency: "USD",
      itemsPreLogin: false,
      getStripeCoupon: false,
      type: "regular",
    };
    console.log("Sending moduleProducts structure:", cartData);
  } else {
    // Old structure for regular products
    cartData = {
      products: items,
      updateCurrency: "USD",
      itemsPreLogin: false,
      getStripeCoupon: false,
      type: "regular",
    };
    console.log("Sending products structure:", cartData);
  }
  
  if (getCookie("JWTToken")) {
    console.log("Making API call to /v1/carts with:", cartData);
    return await request.patch("/v1/carts", cartData, {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken")}`,
      },
    });
  } else {
    console.log("No JWT token found, cannot make API call");
  }
};

export const deleteAllFromCartAPI = async () => {
  try {
    if (getCookie("JWTToken")) {
      return await request.delete("/v1/carts", {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const calculateExpress = async (
  product,
  quantity,
  coupon = "",
  currency = "",
  getStripeCoupon = true
) => {
  if (getCookie("JWTToken")) {
    return await request.patch(
      "/v1/calculate-express-checkout",
      {
        products: [
          {
            product,
            quantity,
          },
        ],
        coupon,
        getStripeCoupon,
        updateCurrency: currency,
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      }
    );
  }
};
