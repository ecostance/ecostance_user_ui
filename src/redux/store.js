import axios from "axios";
import { useSelector } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import storage from "./createNoopStorage";
import thunkMiddleware from "redux-thunk";
import { setCurrency } from "src/apiClient/auth";
import { getCart, updateCart } from "src/apiClient/cart";
import { updateWishlist } from "src/apiClient/wishlist";
import { carbonOffsetMiddleware } from "./middlewares/carbonCalculationSave";
import rootReducer from "./reducers/rootReducer";
export const updateApiCartData = async (items, currency, itemsPreLogin) => {
  // const apiCart = [];

  // items.forEach((each) => {
  //   const currentItem = {};
  //   currentItem["product"] = each._id;
  //   currentItem["quantity"] = each?.quantity || 1;
  //   currentItem["cartItemId"] = each?.cartItemId;
  //   apiCart.push(currentItem);
  // });
  console.log("here are items being sent", items.length);
  const getStripe = window.location.pathname === "/other/checkout";

  try {
    if (items.length === 0) return await getCart();
    else return await updateCart(items, currency, itemsPreLogin, getStripe);
  } catch (err) {
    throw err;
  }
};

// const updateWishlistApiData = async (items) => {
//   const apiWishlist = [];

//   items.forEach((each) => {
//     const currentItem = {};
//     currentItem["product"] = each._id;
//     currentItem["quantity"] = each?.quantity || 1;
//     currentItem["cartItemId"] = each?.cartItemId;
//     apiWishlist.push(currentItem);
//   });

//   await updateWishlist(apiWishlist);
// };

const persistConfig = {
  key: "primary",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const bindMiddleWare = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

export function initializeStore() {
  const store = createStore(
    persistedReducer,
    bindMiddleWare([carbonOffsetMiddleware, thunkMiddleware])
  );

  // const setCurrentCurrency = async (currency) => {
  //   const res = await setCurrency(currency);
  //   console.log("set currency", res);
  // };

  // const updateAPICartDataASync = async (cartData, wishlistData, currency) => {
  //   await updateApiCartData(cartData?.products, currency, false);
  //   await updateWishlistApiData(wishlistData);
  // };

  // store.subscribe(() => {
  //   console.log("here is stoore state", store.getState());
  //   console.log("here is couponData state", store.getState().couponData);
  //   // if (!store.getState().userData.isLoggedIn) {
  //   //   store.getState().couponData.code = "";
  //   //   store.getState().couponData.discount = "";
  //   //   store.getState().couponData.total = "";
  //   //   store.getState().couponData.subTotal = "";
  //   //   return (store.getState().couponData.coupon = false);
  //   // }
  //   // if (store.getState()?.userData) {
  //   //   setCurrentCurrency(store.getState()?.userData?.currency).catch((err) =>
  //   //     console.log(err)
  //   //   );
  //   // }
  //   // updateAPICartDataASync(
  //   //   store.getState().cartData,
  //   //   store.getState().wishlistData,
  //   //   store.getState().userData.currency
  //   // ).catch((err) => console.log(err));
  //   // console.log("Here is the full store", store.getState());
  //   // console.log("Here is the store state", store.getState());
  //   // const currency =
  //   //   timeZoneToCurrency[Date()?.split("(")[1]?.split(")")[0].toString()];
  //   // store.getState().userData.currency = currency;
  // });

  return store;
}
