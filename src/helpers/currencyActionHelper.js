import { getCookie, setCookie } from "cookies-next";
import { getCountries } from "src/apiClient/country";
import { trackCountry } from "src/apiClient/user";
import { getUserInfo } from "src/lib/userValidation";
import {
  CURRENCY_ADDRESS_COUNTRY_LOW,
  CURRENCY_AUTO_NONE,
  CURRENCY_CHECKOUT_TOP,
  CURRENCY_SELECTED_COUNTRY_MID,
} from "src/redux/actions/userAction";

export const CURRENCY_VALID_REQUIRED = "CURRENCY_VALID_REQUIRED";
export const CURRENCY_VALID_OPTIONAL = "CURRENCY_VALID_OPTIONAL";

export let validateUserHelper;
export let userCurrencyPreferenceHelper;
export let cartCurrencyHelper;

let countryList = [];

let runSyncCheckoutCurrency = true;

const validCurrencies = ["USD", "CAD", "GBP", "EUR", "INR", "JPY", "CNY"];

export const setValidateUserHelper = (FUNCTION) => {
  validateUserHelper = FUNCTION;
};

export const setUserCurrencyPreferenceHelper = (FUNCTION) => {
  userCurrencyPreferenceHelper = FUNCTION;
};

export const setCartCurrencyHelper = (FUNCTION) => {
  cartCurrencyHelper = FUNCTION;
};

const setCurrencyType = (
  preferredCountry,
  userInfo,
  setCurrencyTypeVariable,
) => {
  preferredCountry === userInfo?.addressCountry
    ? setCurrencyTypeVariable(CURRENCY_ADDRESS_COUNTRY_LOW)
    : "";

  preferredCountry === userInfo?.selectedCountry
    ? setCurrencyTypeVariable(CURRENCY_SELECTED_COUNTRY_MID)
    : "";

  // preferredCountry === userInfo?.checkoutDefaultCurrency
  //   ? setCurrencyTypeVariable(CURRENCY_CHECKOUT_TOP)
  //   : ''
};

const getCountryList = async () => {
  await getCountries({ show: "yes", limit: 255 })
    .then((data) => {
      const newCountries = data?.data?.filter(
        (each) => each.carbonCountryPerCapita !== "0" && each.countryCode,
      );

      newCountries.sort((a, b) =>
        a.entity.localeCompare(b.entity, "es", { sensitivity: "base" }),
      );
      // ##################################################################

      countryList = newCountries;
    })
    .catch((error) => {
      console.log(error);
    });
};

const countryToCurrencyMapper = async (country, condition) => {
  if (!countryList || !countryList.length) await getCountryList();
  let preferredCountryData;
  preferredCountryData = countryList.find(
    (dbCountry) => dbCountry.entity?.toUpperCase() === country?.toUpperCase(),
  );

  if (!preferredCountryData)
    preferredCountryData = countryList.find(
      (dbCountry) =>
        dbCountry.countryCode?.toUpperCase() === country?.toUpperCase(),
    );

  const currencyCode = preferredCountryData?.currencyCode;
  if (!currencyCode || !validCurrencies.includes(currencyCode)) {
    if (condition === CURRENCY_VALID_REQUIRED) {
      return "";
    }
    if (condition === CURRENCY_VALID_OPTIONAL) {
      return "USD";
    }
    throw Error("Currency condition must be provided");
  }
  return currencyCode;
};

export const runValidateUserProcessSync = async (props = {}) => {
  let currencyType;
  const setCurrencyTypeVariable = (type) => {
    currencyType = type;
  };
  const userInfo = await getUserInfo();
  if (!userInfo?.success) return;
  validateUserHelper(userInfo, true);
  if (userInfo?.checkoutDefaultCurrency) {
    cartCurrencyHelper(userInfo?.temporaryCheckoutCurrency?.toUpperCase());
    runUpdateCurrencyTop(userInfo?.checkoutDefaultCurrency);
    return userInfo;
  }
  const preferredCountry =
    userInfo?.selectedCountry || userInfo?.addressCountry;
  if (!preferredCountry) return;

  setCurrencyType(preferredCountry, userInfo, setCurrencyTypeVariable);

  const currencyCode = await countryToCurrencyMapper(
    preferredCountry,
    CURRENCY_VALID_REQUIRED,
  );

  if (currencyCode) {
    userCurrencyPreferenceHelper(currencyType, currencyCode);
  }

  cartCurrencyHelper(userInfo?.temporaryCheckoutCurrency?.toUpperCase());

  // if (runSyncCheckoutCurrency) {
  //   // cartCurrencyHelper(currencyCode)
  //   runSyncCheckoutCurrency = false
  // }

  return userInfo;
};

const userDetectionHelper = async () => {
  const addressCountry = (await trackCountry())?.data?.addressCountry;
  // console.log("addressCOuntry", addressCountry);

  const currencyCode = await countryToCurrencyMapper(
    addressCountry,
    CURRENCY_VALID_OPTIONAL,
  );

  // console.log("here is found currency code", currencyCode);
  return { currencyCode, addressCountry };
};

export const setUniqueVisitInformation = async ({
  userCurrencyPreference,
  setCartCurrency,
}) => {
  if (getCookie("COUNTRY_SET")) {
    console.log("Getcookie exec");
    return;
  }

  const { currencyCode, addressCountry } = await userDetectionHelper();

  userCurrencyPreference(CURRENCY_AUTO_NONE, currencyCode);
  setCartCurrency(currencyCode);

  setCookie("COUNTRY_SET", addressCountry);
};

export const setRecurringVisitInformation = async () => {
  if (getCookie("COUNTRY_SET")) {
    console.log("Getcookie exec");
    return;
  }

  const { currencyCode, addressCountry } = await userDetectionHelper();

  if (typeof userCurrencyPreferenceHelper === "function") {
    userCurrencyPreferenceHelper(CURRENCY_AUTO_NONE, currencyCode);
  }
  if (typeof cartCurrencyHelper === "function") {
    cartCurrencyHelper(currencyCode);
  }

  setCookie("COUNTRY_SET", addressCountry);
};

export const runUpdateCurrencyTop = async (currency) => {
  if (!validCurrencies?.includes(currency?.toUpperCase())) return;

  if (typeof userCurrencyPreferenceHelper === "function") {
    userCurrencyPreferenceHelper(
      CURRENCY_CHECKOUT_TOP,
      currency?.toUpperCase(),
    );
  }
};

export const logoutCheckoutCurrencyAction = async () => {
  if (getCookie("COUNTRY_SET")) {
    const country = getCookie("COUNTRY_SET");
    const currencyCode = await countryToCurrencyMapper(
      country,
      CURRENCY_VALID_OPTIONAL,
    );
    if (typeof userCurrencyPreferenceHelper === "function") {
      userCurrencyPreferenceHelper(CURRENCY_AUTO_NONE, currencyCode);
    }
    if (typeof cartCurrencyHelper === "function") {
      cartCurrencyHelper(currencyCode);
    }
  } else {
    setRecurringVisitInformation();
  }
  runSyncCheckoutCurrency = true;
};
