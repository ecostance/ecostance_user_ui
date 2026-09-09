import request from "./request";
import { setCookies, getCookie,deleteCookie } from "cookies-next";
import { getAllOrders } from "src/apiClient/orders";
import { getBusinessProfile } from "src/apiClient/business";
import { getJoinedBusiness } from "src/apiClient/employer";
import { removeAllItemsFromSustainabilityPage } from "src/redux/actions/sustainabilityActions";
import { removeAllItemsFromBusinessSustainabilityPage } from "src/redux/actions/businessSustainabilityActions";
import {
  logoutCheckoutCurrencyAction,
  runValidateUserProcessSync,
} from "src/helpers/currencyActionHelper";
import {
  validateUser,
  setIsVerifyPopupShown,
  removeCurrentUser,
} from "src/redux/actions/userAction";
import { addOrder } from "src/redux/actions/orderActions";
import { deleteAllFromWishlist } from "src/redux/actions/wishlistActions";



export const login = async ({
  userName: userId,
  password,
  rememberMe,
  temporaryCheckoutCurrency,
}) => {
  const loginResult = await request.post("auth/login", {
    userId,
    password,
    strategy: "password",
    temporaryCheckoutCurrency,
  });
  console.log(loginResult, "loginn")
  const keyToKeep = 'JoinBusinessCode';
  const valueToKeep = localStorage.getItem("JoinBusinessCode");

  const keepSupplyKey = 'JoinSupplierCode';
  const valueSupplyKey = localStorage.getItem("JoinSupplierCode");

  const keepRIDKey = 'RID';
  const valueRIDKey = localStorage.getItem("RID");

  const keepDistKey = 'JoinDistributorCode';
  const valueDistKey = localStorage.getItem("JoinDistributorCode");

  const keepRefKey = "ReferralID";
  const valueRefKey = localStorage.getItem("ReferralID");

  const keepConfKey = "conferenceCode";
  const valueConfKey = localStorage.getItem("conferenceCode");
  
  if (loginResult?.data?.success) {
    deleteCookie("JWTToken");
    deleteCookie("checkout");
    deleteCookie("stripeSession");
    deleteCookie("userSlug", {
      domain: `${process.env.COOKIE_URL}`,
    });
    localStorage.clear();
    removeAllItemsFromSustainabilityPage();
    removeAllItemsFromBusinessSustainabilityPage();
    logoutCheckoutCurrencyAction();
    setIsVerifyPopupShown(false);
    removeCurrentUser();
    addOrder(false, {});
    deleteAllFromWishlist();
    if (valueToKeep !== null) {
      localStorage.setItem(keyToKeep, valueToKeep);
    }
    if (valueRefKey !== null) {
      localStorage.setItem(keepRefKey, valueRefKey);
    }
    if (valueConfKey !== null) {
      localStorage.setItem(keepConfKey, valueConfKey);
    }
    if (valueSupplyKey !== null) {
      localStorage.setItem(keepSupplyKey, valueSupplyKey);
    }
    if (valueDistKey !== null) {
      localStorage.setItem(keepDistKey, valueDistKey);
    }
    if (valueRIDKey !== null) {
      localStorage.setItem(keepRIDKey, valueRIDKey);
    }
    localStorage.setItem("userId", loginResult?.data?.user?._id)
    localStorage.setItem("email", loginResult?.data?.user?.email)
    localStorage.setItem("name", loginResult?.data?.user?.firstName + " " + loginResult?.data?.user?.lastName)
    localStorage.setItem("userCreated", loginResult?.data?.user?.createdAt)
    await getJoinedBusiness(`Bearer ${loginResult?.data?.token}`)
      .then((response) => {
        console.log("join", response)
        if (response.status == 200) {
          if (response?.data?.success) {
            localStorage.setItem("JoinedBusinessDetails", JSON.stringify(response?.data?.data?.[0]))
          }
        }
      })
    let MyBusinessDetails = await getBusinessProfile(`Bearer ${loginResult?.data?.token}`)
    console.log("business", MyBusinessDetails)
    if (MyBusinessDetails?.data?.success && MyBusinessDetails.data.data?.[0]?.name) {
      localStorage.setItem("MyBusinessDetails", JSON.stringify(MyBusinessDetails.data.data[0]))
    } else {
      localStorage.removeItem("MyBusinessDetails")
    }

    await getAllOrders(1, loginResult?.data?.token)
      .then((response) => {
        if (response.status == 200) {
          localStorage.setItem("TotalOrders", response.data?.data?.length)
        }
      })
  }
  return loginResult;
};

export const me = async (token = "") => {
  if (getCookie("JWTToken") || token) {
    const loginResult = await request.get("v1/me", {
      headers: {
        Authorization: `Bearer ${getCookie("JWTToken") || token}`,
      },
    });

    if (loginResult.status !== 200) throw "read user failed";
    else return loginResult.data;
  }
};

export const userRegistration = async (user) => {
  const keyToKeep = 'JoinBusinessCode';
  const valueToKeep = localStorage.getItem("JoinBusinessCode");

  const keepSupplyKey = 'JoinSupplierCode';
  const valueSupplyKey = localStorage.getItem("JoinSupplierCode");

  const keepDistKey = 'JoinDistributorCode';
  const valueDistKey = localStorage.getItem("JoinDistributorCode");

  const keepRefKey = "ReferralID";
  const valueRefKey = localStorage.getItem("ReferralID");

  const keepConfKey = "conferenceCode";
  const valueConfKey = localStorage.getItem("conferenceCode");

  const keepRIDKey = 'RID';
  const valueRIDKey = localStorage.getItem("RID");

  deleteCookie("JWTToken");
  deleteCookie("checkout");
  deleteCookie("stripeSession");
  deleteCookie("userSlug", {
    domain: `${process.env.COOKIE_URL}`,
  });
  localStorage.clear();
  removeAllItemsFromSustainabilityPage();
  removeAllItemsFromBusinessSustainabilityPage();
  logoutCheckoutCurrencyAction();
  setIsVerifyPopupShown(false);
  removeCurrentUser();
  addOrder(false, {});
  deleteAllFromWishlist();
  if (valueToKeep !== null) {
    localStorage.setItem(keyToKeep, valueToKeep);
  }
  if (valueRefKey !== null) {
    localStorage.setItem(keepRefKey, valueRefKey);
  }
  if (valueConfKey !== null) {
    localStorage.setItem(keepConfKey, valueConfKey);
  }
  if (valueSupplyKey !== null) {
    localStorage.setItem(keepSupplyKey, valueSupplyKey);
  }
  if (valueDistKey !== null) {
    localStorage.setItem(keepDistKey, valueDistKey);
  }
  if (valueRIDKey !== null) {
    localStorage.setItem(keepRIDKey, valueRIDKey);
  }
  const register = await request.post("/auth/register", user);
  return register;
};

export const sendResetPasswordLink = async (email) => {
  return await request.post("/auth/reset-password-link", email);
};

export const sendResetPassword = async (newPassword, token) => {
  return await request.post(`/auth/reset-password?tk=${token}`, newPassword);
};

export const verifyEmail = async (token) => {
  return await request.get(`/auth/verify-account?tk=${token}`);
};

export const reSendRegistration = async (email) => {
  return await request.patch("auth/resend-registration-link", {
    email,
    origin: "desktop",
  });
};

export const checkEmailVerificationStatus = async (email) => {
  return await request.get(`/auth/email-verification-status/${email}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWTToken")}`,
    },
  });
};

// export const checkVerifyAccount = async () => {
//   return await request.get(`/auth/verify-account?tk=${getCookie("JWTToken")}`);
// };

export const setCurrency = async (currency) => {
  if (getCookie("JWTToken")) {
    const res = await request.post(
      `/auth/set-currency`,
      { currency: currency },
      // { withCredentials: true, credentials: "include" },
      {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      }
    );

    // temp
    // const getRes = await request.get(
    //   "/auth/get-currency",
    //   { withCredentials: true, credentials: "include" },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${getCookie("JWTToken")}`,
    //     },
    //   }
    // );

    // console.log("set currency", res);
    // console.log("set currency", currency);
    // console.log("get currency", getRes);
    return res;
  }
};

export const verifyUserEmail = (email, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request.patch("/auth/registration-otp-verify", {
        email,
        otp,
      });
      resolve(res);
    } catch (error) {
      reject(error.message);
    }
  });
};

export const resendVerificationOTP = (email, origin) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = { email };
      if (origin && origin === "checkout") payload.checkout = true;
      const res = await request.patch("/auth/resend-otp-register", payload);
      resolve(res);
    } catch (error) {
      reject(error.message);
    }
  });
};

export const getGeoDataFromIP = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await request.get("v1/ip-stack");
      if (data && data.error) reject(data.error.info);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const changePassword = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request.patch("/auth/change-password", payload, {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateRecoveryEmail = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request.patch("/auth/update-recovery-email", payload, {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyRecoveryEmail = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request.patch(
        "/auth/recovery-email-otp-verify",
        payload,
        {
          headers: {
            Authorization: `Bearer ${getCookie("JWTToken")}`,
          },
        }
      );
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

export const updatePrimaryEmail = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request.patch("/auth/update-primary-email", payload, {
        headers: {
          Authorization: `Bearer ${getCookie("JWTToken")}`,
        },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyPrimaryEmail = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request.patch(
        "/auth/primary-email-otp-verify",
        payload,
        {
          headers: {
            Authorization: `Bearer ${getCookie("JWTToken")}`,
          },
        }
      );
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

export const sendForgotPasswordOTP = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      return resolve(
        await request.patch("/auth/otp-reset-password", { email })
      );
    } catch (err) {
      return reject(err);
    }
  });
};

export const resetPasswordUsingOTP = (email, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      return resolve(await request.patch("/auth/otp-verify", { email, otp }));
    } catch (err) {
      return reject(err);
    }
  });
};

export const resetPasswordUsingToken = (token, password, confirmPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      return resolve(
        await request.post(`/auth/reset-password?tk=${token}`, {
          password,
          confirmPassword,
        })
      );
    } catch (err) {
      return reject(err);
    }
  });
};

export const verifyPasswordForPrimaryEmail = (payload, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request.patch(
        `/auth/primary-email-password-verify?tk=${token}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getCookie("JWTToken")}`,
          },
        }
      );
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};
