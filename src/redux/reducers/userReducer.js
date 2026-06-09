import { setCookie, setCookies } from "cookies-next";
import countryToCurrency from "src/data/countryToCurrency";
import { timeZoneToCurrency } from "src/data/timeZoneToCurrency";
import {
  VALIDATE_USER,
  SET_USER_REGISTRATION_EMAIL,
  SET_USER_CURRENCY,
  ADD_UNVERIFIED_USER_EMAIL,
  SET_USER_CURRENCY_FORCE,
  SET_IS_VERIFY_POPUP_SHOWN,
  SET_IS_EMAIL_CHANGE_ATTEMPT_LEFT,
  VALIDATE_USER_FAST,
  SET_USER_CURRENCY_PREFERENCE,
  REMOVE_USER,
  SET_EMAIL_VERIFIED,
} from "../actions/userAction";

const initState = {
  isLoggedIn: false,
  user: {},
  billingAddress: {},
  email: "",
  slug: {},
  currency: "USD",
  currencyType: 0,
  tempCartCurrency: "USD",
  isVerifyPopupShown: false,
  isEmailChangeAttemptLeft: true,
};

const userReducer = (state = initState, action) => {
  if (action.type === VALIDATE_USER) {
    let currency;
    // if (action?.payload?.billingAddress?.country && !state?.force) {
    //   let tempCurrency;
    //   countryToCurrency.map((each) =>
    //     each.country === action?.payload?.billingAddress?.country
    //       ? (tempCurrency = each?.currency_code)
    //       : ''
    //   );

    //   console.log('excecuting userReducer', tempCurrency);
    //   if (validCurrencies.includes(tempCurrency)) {
    //     console.log('it includes');
    //     currency = tempCurrency;
    //   } else {
    //     currency = 'USD';
    //   }
    // }
    // if (currency && !state?.force) {
    //   const userData = {
    //     ...state,
    //     user: { ...action.payload.user },
    //     billingAddress: { ...action.payload.billingAddress },
    //     isLoggedIn: action.payload.isUserLoggedIn,
    //     slug: { ...action.payload.slug },
    //     currency: currency,
    //   }

    //   return userData
    // } else {

    // }

    let additionalData = {};

    // if (action.payload?.revertCurrency) {
    //   additionalData = { currencyType: 0, currency: 'USD' }
    // }

    if (action.payload.slug?.slug) {
      setCookies("user-slug", btoa(action.payload.slug?.slug), {
        domain: `${process.env.COOKIE_URL}`,
      });
    }

    const userData = {
      ...state,
      user: { ...action.payload.user },
      billingAddress: { ...action.payload.billingAddress },
      isLoggedIn: action.payload.isUserLoggedIn,
      slug: { ...action.payload.slug },
      ...additionalData,
    };
    return userData;
  }

  if (action.type === VALIDATE_USER_FAST) {
    if (action.payload.slug?.slug) {
      setCookies("user-slug", btoa(action.payload.slug?.slug), {
        domain: `${process.env.COOKIE_URL}`,
      });
    }
    return { ...state, ...action.payload };
  }

  if (action.type === SET_USER_REGISTRATION_EMAIL) {
    return {
      ...state,

      user: {
        ...state.user,
        email: action.payload?.email,
      },
    };
  }

  if (action.type === SET_USER_CURRENCY_FORCE) {
    // The return state is just to stop the action for the time being
    return state;
    return {
      ...state,
      currency: action.payload.currency,
      force: true,
    };
  }

  if (action.type === SET_USER_CURRENCY) {
    // The return state is just to stop the action for the time being
    return state;
    if (state?.currency || !action?.payload?.currency) {
      return state;
    }
    let currency;
    if (state?.billingAddress?.country) {
      let tempCurrency;
      countryToCurrency.map((each) =>
        each.country === action?.payload?.billingAddress?.country
          ? (tempCurrency = each?.currency_code)
          : ""
      );
      if (validCurrencies.includes(tempCurrency)) {
        currency = tempCurrency;
      } else {
        currency = "USD";
      }
    } else {
      currency = action.payload.currency;
    }
    return {
      ...state,
      currency: currency,

      // currency: action.payload.currency,
    };
  }

  if (action.type === SET_USER_CURRENCY_PREFERENCE) {
    if (
      !state.isLoggedIn ||
      action.payload.currencyType >= state.currencyType
    ) {
      return {
        ...state,
        currency: action.payload.currency,
        currencyType: action.payload.currencyType,
      };
    } else {
      return state;
    }
  }

  if (action.type === SET_IS_VERIFY_POPUP_SHOWN) {
    return {
      ...state,
      isVerifyPopupShown: action.payload,
    };
  }
  if (action.type === SET_IS_EMAIL_CHANGE_ATTEMPT_LEFT) {
    return {
      ...state,
      isEmailChangeAttemptLeft: action.payload,
    };
  }

  if (action.type === REMOVE_USER) {
    return initState;
  }

  if (action.type === SET_EMAIL_VERIFIED) {
    return { ...state, user: { ...state.user, emailVerificationStatus: 'VERIFIED' } };
  }

  return state;
};

export default userReducer;
