import axios from "axios";
import { deleteCookie } from "cookies-next";
import { logoutCheckoutCurrencyAction } from "src/helpers/currencyActionHelper";

// const API_URL = "http://localhost:3001/"; // TO-DO move this to env on next.config.js

// const API_URL = "https://boapi.rayabharitechnologies.com/"

const request = axios.create({
  baseURL: process.env.API_BASE,
  headers: {},
  validateStatus: function (status) {
    return true;
  },
});

export let addToastRequest = "";

export const setToastRequest = (addToast) => {
  addToastRequest = addToast;
};

export const nextInterceptorWrapper = (
  router,
  validateUser,
  resetIsEmailChangeAttemptLeft,
  removeAllItemsFromSustainabilityPage,
  removeCurrentUser
) => {
  request.interceptors.response.use((res) => {
    if (
      res?.request?.responseURL?.includes("/auth/reset-password") ||
      res?.request?.responseURL?.includes("/auth/otp-verify") ||
      res?.request?.responseURL?.includes("/auth/otp-reset-password")
    ) {
      return res;
    }

    if (
      res?.request?.responseURL?.includes("/auth/login") ||
      res?.request?.responseURL?.includes("/auth/register")
    ) {
      if (res?.status === 200 || res?.status === 201) {
        resetIsEmailChangeAttemptLeft();
      }
      return res;
    }

    if (addToastRequest && res?.data?.loginAttemptCount >= 5) {
      addToastRequest(res?.data?.message, {
        appearance: "error",
      });
    }

    if (res?.status === 401) {
      deleteCookie("JWTToken");
      deleteCookie("checkout");
      deleteCookie("stripeSession");
      deleteCookie("user-slug", {
        domain: `${process.env.COOKIE_URL}`,
      });
      removeAllItemsFromSustainabilityPage();
      logoutCheckoutCurrencyAction();
      removeCurrentUser();
      router.push({
        pathname: process.env.PUBLIC_URL + "/login-register",
        query: { loggedIn: "false" },
      });
    }
    return res;
  });
};

export default request;
