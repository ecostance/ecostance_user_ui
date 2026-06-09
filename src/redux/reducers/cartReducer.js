import { v4 as uuidv4 } from "uuid";
import {
  ADD_TO_CART,
  DECREASE_QUANTITY,
  DELETE_FROM_CART,
  DELETE_ALL_FROM_CART,
  ADD_API_TO_CART,
  DELETE_ALL_FROM_CART_LOCAL,
  ADD_COUPON,
  DELETE_COUPON,
  UPDATE_CART_FOR_CURRENCY,
  UPDATE_CART_FOR_STRIPE,
  ADD_HIDDEN_PRODUCTS,
  REMOVE_HIDDEN_PRODUCTS,
  ADD_EXPRESS_PRICE_DATA,
  ADD_EXPRESS_ITEM_ADDED_TO_CART,
  REMOVE_EXPRESS_ITEM_ADDED_TO_CART,
  REMOVE_EXPRESS_ITEM_ADDED_TO_CART_LOCAL,
  REMOVE_COUPON,
  UPDATE_LOCAL_CART_COUNT,
  SET_CART_CURRENCY,
} from "../actions/cartActions";

// export const initState = [];
export const initState = {
  products: [],
  moduleProducts: [], // Add module products array
  isModuleProduct: false, // Add module product flag
  orderTotal: 0,
  subTotal: 0,
  moduleOrderTotal: 0,
  moduleSubTotal: 0,
  moduleDiscount: 0,
  discountUnit: 0,
  discount: 0,
  coupon: "",
  couponType: "",
  couponData: {},
  hiddenProducts: [],
  useHiddenProducts: false,
  expressPriceData: {},
  expressAddedToCart: false,
  localCartCount: 0,
  currency: "USD",
  oneTimeFee: 0, // One-time fee for dynamic pricing
};

const cartReducer = (state = initState, action) => {
  const cartItems = state;
  // product = action.payload;

  if (action.type === ADD_API_TO_CART) {
    return {
      ...state,
      // Only update fields that are provided in the payload
      ...(action.payload.products !== undefined && { products: action.payload.products }),
      ...(action.payload.moduleProducts !== undefined && { moduleProducts: action.payload.moduleProducts }),
      ...(action.payload.isModuleProduct !== undefined && { isModuleProduct: action.payload.isModuleProduct }),
      ...(action.payload.orderTotal !== undefined && { orderTotal: action.payload.orderTotal }),
      ...(action.payload.subTotal !== undefined && { subTotal: action.payload.subTotal }),
      ...(action.payload.moduleOrderTotal !== undefined && { moduleOrderTotal: action.payload.moduleOrderTotal }),
      ...(action.payload.moduleSubTotal !== undefined && { moduleSubTotal: action.payload.moduleSubTotal }),
      ...(action.payload.moduleDiscount !== undefined && { moduleDiscount: action.payload.moduleDiscount }),
      ...(action.payload.discount !== undefined && { discount: action.payload.discount }),
      ...(action.payload.discountUnit !== undefined && { discountUnit: action.payload.discountUnit }),
      ...(action.payload.orderTotalWithinStripeRange !== undefined && { orderTotalWithinStripeRange: action.payload.orderTotalWithinStripeRange }),
      ...(action.payload.couponData !== undefined && { couponData: action.payload.couponData }),
      ...(action.payload.localCartCount !== undefined && { localCartCount: action.payload.localCartCount }),
      ...(action.payload.oneTimeFee !== undefined && { oneTimeFee: action.payload.oneTimeFee }),
      // Preserve existing state
      useHiddenProducts: state.useHiddenProducts,
      hiddenProducts: state.hiddenProducts,
      expressPriceData: state.expressPriceData,
    };
  }

  if (action.type === ADD_TO_CART) {
    // for non variant products
    return {
      ...state,
      ...action.payload,
      useHiddenProducts: state.useHiddenProducts,
      hiddenProducts: state.hiddenProducts,
      expressPriceData: state.expressPriceData,
    };
  }

  if (action.type === DECREASE_QUANTITY) {
    return {
      ...state,
      ...action.payload,
      useHiddenProducts: state.useHiddenProducts,
      hiddenProducts: state.hiddenProducts,
      expressPriceData: state.expressPriceData,
    };
  }

  if (action.type === DELETE_FROM_CART) {
    return {
      ...state,
      ...action.payload,
      useHiddenProducts: state.useHiddenProducts,
      hiddenProducts: state.hiddenProducts,
      expressPriceData: state.expressPriceData,
    };
  }

  if (action.type === UPDATE_CART_FOR_CURRENCY) {
    return {
      ...state,
      ...action.payload,
      useHiddenProducts: state.useHiddenProducts,
      hiddenProducts: state.hiddenProducts,
      expressPriceData: state.expressPriceData,
    };
  }

  if (action.type === DELETE_ALL_FROM_CART) {
    return { 
      ...state, 
      products: [], 
      moduleProducts: [], // Also clear module products
      localCartCount: 0 
    };
  }

  if (action.type === DELETE_ALL_FROM_CART_LOCAL) {
    return { 
      ...state, 
      products: [], 
      moduleProducts: [], // Also clear module products
      localCartCount: 0 
    };
  }

  if (action.type === ADD_COUPON) {
    return { ...state, coupon: true, ...action.payload };
  }
  if (action.type === DELETE_COUPON) {
    return { ...state, coupon: false, couponData: {} };
  }

  if (action.type === UPDATE_CART_FOR_STRIPE) {
    return {
      ...state,
      ...action.payload,
      useHiddenProducts: state.useHiddenProducts,
      hiddenProducts: state.hiddenProducts,
      expressPriceData: state.expressPriceData,
    };
  }

  if (action.type === ADD_HIDDEN_PRODUCTS) {
    return {
      ...state,
      useHiddenProducts: true,
      hiddenProducts: action.payload.products,
    };
  }

  if (action.type === REMOVE_HIDDEN_PRODUCTS) {
    return {
      ...state,
      useHiddenProducts: false,
      hiddenProducts: [],
      expressPriceData: {},
      expressAddedToCart: false,
    };
  }

  if (action.type === ADD_EXPRESS_PRICE_DATA) {
    return {
      ...state,
      expressPriceData: action.payload.data,
    };
  }

  if (action.type === ADD_EXPRESS_ITEM_ADDED_TO_CART) {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === REMOVE_EXPRESS_ITEM_ADDED_TO_CART_LOCAL) {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === REMOVE_EXPRESS_ITEM_ADDED_TO_CART) {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === REMOVE_COUPON) {
    return {
      ...state,
      ...action.payload,
      coupon: false,
      couponData: {},
      discountUnit: "",
      discount: "",
    };
  }

  if (action.type === UPDATE_LOCAL_CART_COUNT) {
    return {
      ...state,
      localCartCount: action?.payload?.localCartCount,
    };
  }

  if (action.type === SET_CART_CURRENCY) {
    if (!action?.payload?.currency) return state;
    return {
      ...state,
      currency: action?.payload?.currency,
    };
  }

  return state;
};

export default cartReducer;
