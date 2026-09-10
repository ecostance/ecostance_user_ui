import { useState, useEffect } from "react";
import { IoMdCash } from "react-icons/io";
import { connect, useSelector } from "react-redux";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { getDiscountPrice } from "../../lib/product";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import { setCookies } from "cookies-next";
import { addOrder } from "../../redux/actions/orderActions";
import { checkEmailVerificationStatus } from "src/apiClient/auth";
import { reverseBusinessCart } from "src/apiClient/business";
import {
  setUserCurrencyForce,
  setUserEmail,
  validateUser,
  setUserCurrencyPreference,
} from "../../../src/redux/actions/userAction";
import regionPrice from "src/helpers/regionPrice";
import { returnPhoneDetails } from "src/helpers/returnPhoneDetails";
import {
  addCoupon,
  addExpressPriceData,
  deleteAllFromCart,
  removeCoupon,
  removeHiddenProducts,
  setCartCurrency,
  updateCartForCurrency,
  updateCartForStripe,
} from "src/redux/actions/cartActions";
import { useToasts } from "react-toast-notifications";
import { saveCoupon } from "src/helpers/applyCoupon";
import CurrencyOption from "./currencyOption";
import { addAPIDataToCart } from "../../redux/actions/cartActions";
import { calculateExpress } from "src/apiClient/cart";
import formatCurrency from "src/helpers/formatCurrency";
import buttonStatusHandler from "src/helpers/buttonStatusHandler";
import NoSSR from "react-no-ssr";
import PhoneInput from "./phoneInput";
import { saveStripeCheckout, cartTransfer } from "src/apiClient/orders";
import { map } from "src/helpers/allCountries";
import { unApplyCouponToAPI, applyCouponToAPI } from "src/apiClient/coupon";
import CartSummary from "../common/cartSummary";
import getCouponText from "../helpers/getCouponText";
import { returnReverseCode } from "src/data/countryCodeToISO3";
import { validatePhoneNumber } from "src/helpers/phoneValidation";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Add debugging for Stripe configuration
console.log(
  "Stripe Publishable Key:",
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "Set" : "Not Set",
);

const CheckoutForm = ({
  userDetail,
  userData,
  openLoginModel,
  addOrder,
  orderData,
  addAPIDataToCart,
  checkoutElement,
  showSuccessModel,
  cartItems,
  addCoupon,
  showCurrencyOverlay,
  setShowCurrencyOverlay,
  setUserCurrencyForce,
  updateCartForCurrency,
  updateCartForStripe,
  removeHiddenProducts,
  express,
  addExpressPriceData,
  validateUser,
  setShouldShowVerifyModel,
  reSendRegistrationMail,
  deleteAllFromCart,
  calculatorCheckout,
  setCalculatorCheckout,
  setShouldShowCarbonOffsetModel,
  shouldShowCarbonOffsetModel,
  setShowLoginPopup,
  showLoginPopup,
  carbonPopupShown,
  removeCoupon,
  setOrigin,
  actionSuccessType,
  setActionSuccessType,
  setUserCurrencyPreference,
  setCartCurrency,
  setBusinessPopShown,
  setCarbonPopupShown,
  isBusinessOrder,
  setIsBusinessOrder,
}) => {
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [currencyCode, setCurrencyCode] = useState(cartItems?.currency);
  const [localTotal, setLocalTotal] = useState(0);
  const [localTotalQuantity, setLocalTotalQuantity] = useState(
    cartItems?.useHiddenProducts && express
      ? cartItems?.hiddenProducts?.[0]?.cartData?.quantity
      : 0,
  );
  const [currencyChangeInProgress, setCurrencyChangeInProgress] =
    useState(false);
  const { addToast } = useToasts();

  const router = useRouter();

  let cartTotalPrice = 0;
  let refferalCheck =
    localStorage.getItem("ReferralID") &&
    localStorage.getItem("userId") !== localStorage.getItem("ReferralID") &&
    localStorage.getItem("TotalOrders") == 0;
  const [isError, setIsError] = useState({});
  const [isFocus, setIsFocus] = useState({});
  const [reRender, setreRender] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    streetAddressOne: "",
    streetAddressTwo: "",
    companyName: "",
    city: "",
    state: "",
    email: "",
    country: "",
    mailcode: "",
    phone: "",
    phoneInfo: {
      number: "",
      numericCode: "",
      countryCode: "",
    },
    countryCode: "",
    stateCode: "",
    termsAndConditions: false,
  });
  const [paymentMode, setPaymentMode] = useState("payment");
  const [subscriptionRecurring, setSubscriptionRecurring] = useState({});
  const [isPaymentModeErrorMsg, setIsPaymentModeErrorMsg] = useState(false);
  const [allCountryList, setAllCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [couponCode, setCouponCode] = useState(
    refferalCheck ? "ED3VY7" : cartItems?.couponData?.coupon,
  );
  const [applyCouponPressed, setApplyCouponPressed] = useState(false);

  const [expressCouponCode, setExpressCouponCode] = useState({});
  const [monthPay, setMonthPay] = useState(0);

  // Module order detection and calculations
  const isModuleOrder =
    router.query.moduleOrder === "true" ||
    localStorage.getItem("modulepurchase") === "true";

  useEffect(() => {
    if (router.query.dynamicPricing === "true") {
      // Both full and monthly plans use "payment" mode; plan is read inside
      // getModuleOrderTotal via dynamicPricingPaymentPlan in localStorage.
      paymentOptionChange("payment");
    }
  }, [router.query.dynamicPricing]);

  const getDynamicPricingCheckoutData = () => {
    const raw =
      localStorage.getItem("dynamicPricingCheckout") ||
      sessionStorage.getItem("dynamicPricingCheckout");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const getDynamicPricingPayToday = () => {
    const data = getDynamicPricingCheckoutData();
    if (!data) return null;
    const payToday = Number(data.payToday ?? data.totals?.payToday);
    return payToday > 0 ? payToday : null;
  };

  const getDynamicPricingPaymentPlan = () => {
    const data = getDynamicPricingCheckoutData();
    return (
      data?.paymentPlan ||
      localStorage.getItem("dynamicPricingPaymentPlan") ||
      "full"
    );
  };

  const resolveModuleChargeAmount = (moduleTotals) => {
    const dynamicPayToday =
      router.query.dynamicPricing === "true" ? getDynamicPricingPayToday() : null;
    if (dynamicPayToday != null) return dynamicPayToday;
    if (paymentMode === "subscription") {
      return moduleTotals?.subscriptionTotal || localTotal / 12 || 0;
    }
    return moduleTotals?.oneTimeTotal || localTotal || 0;
  };

  const buildModuleCheckoutMetadata = ({
    moduleTotals,
    productIds,
    isGuestModuleCheckout,
    guestCheckoutLinkId,
    guestCheckoutPaymentPlan,
  }) => {
    const paymentPlan =
      guestCheckoutPaymentPlan || getDynamicPricingPaymentPlan();
    const metadata = {
      calculationBreakdown: JSON.stringify(moduleTotals),
      isModulePurchase: "true",
      isDynamicPricing:
        isGuestModuleCheckout || router.query.dynamicPricing === "true"
          ? "true"
          : "false",
      isPricingLinkPurchase: guestCheckoutLinkId ? "true" : "false",
      guestCheckout: isGuestModuleCheckout ? "true" : "false",
      linkId: guestCheckoutLinkId || "",
      pricingLinkId: guestCheckoutLinkId || "",
      paymentPlan,
      productIds: JSON.stringify(productIds),
      selectedPaymentMode: paymentMode,
    };
    if (paymentPlan === "monthly") {
      metadata.requiresSubscriptionSetup = "true";
    }
    return metadata;
  };

  // Debug module order detection
  console.log("=== MODULE ORDER DETECTION DEBUG ===");
  console.log("router.query.moduleOrder:", router.query.moduleOrder);
  console.log(
    "localStorage modulepurchase:",
    localStorage.getItem("modulepurchase"),
  );
  console.log("Final isModuleOrder:", isModuleOrder);
  console.log("cartItems structure:", {
    hasProducts: !!cartItems?.products,
    productsLength: cartItems?.products?.length,
    hasModuleProducts: !!cartItems?.moduleProducts,
    moduleProductsLength: cartItems?.moduleProducts?.length,
    hasHiddenProducts: !!cartItems?.hiddenProducts,
    hiddenProductsLength: cartItems?.hiddenProducts?.length,
  });

  // Calculate module order totals based on payment option
  const getModuleOrderTotal = (paymentMode) => {
    const mode = paymentMode || "payment"; // default to one-time if not selected yet
    console.log("=== getModuleOrderTotal DEBUGGING ===");
    console.log("Payment mode:", mode);
    console.log("isModuleOrder:", isModuleOrder);
    console.log("localTotal:", localTotal);
    console.log("cartItems:", cartItems);
    console.log("cartItems.moduleProducts:", cartItems?.moduleProducts);
    console.log("cartItems.products:", cartItems?.products);

    // Get one-time fee from cart or localStorage
    let oneTimeFeeAmount = cartItems?.oneTimeFee || 0;
    if (!oneTimeFeeAmount) {
      const storedFee = localStorage.getItem("dynamicPricingOneTimeFee");
      oneTimeFeeAmount = storedFee ? parseFloat(storedFee) : 0;
    }
    console.log("One-time fee:", oneTimeFeeAmount);

    // Get discount from localStorage
    let discountAmount =
      (isModuleOrder
        ? cartItems?.moduleDiscount || cartItems?.discount
        : cartItems?.discount) || 0;
    let discountType = cartItems?.discountType || "percentage";
    if (!discountAmount) {
      const storedDiscount = localStorage.getItem("dynamicPricingDiscount");
      const storedDiscountType = localStorage.getItem(
        "dynamicPricingDiscountType",
      );
      discountAmount = storedDiscount ? parseFloat(storedDiscount) : 0;
      discountType = storedDiscountType || "percentage";
    }
    console.log("Discount:", discountAmount, "Type:", discountType);

    // Get payment plan from localStorage (full = pay all 12 months upfront, monthly = pay 1st month today + 11 months recurring)
    const storedPaymentPlan =
      localStorage.getItem("dynamicPricingPaymentPlan") || "full";
    const isMonthlyPlan = storedPaymentPlan === "monthly";
    const remainingMonths = 11; // 1st month is included in upfront payment
    console.log(
      "Payment plan:",
      storedPaymentPlan,
      "isMonthlyPlan:",
      isMonthlyPlan,
    );

    // Helper function to apply discount to an amount
    const applyDiscount = (amount) => {
      if (!discountAmount || discountAmount <= 0) return amount;
      if (discountType === "percentage") {
        return amount * (1 - discountAmount / 100);
      } else {
        return Math.max(0, amount - discountAmount);
      }
    };

    // Guard clause: if localTotal is not set yet, try to calculate from cart items
    if (!localTotal || localTotal === 0) {
      console.log(
        "localTotal not set yet, attempting to calculate from cart items",
      );

      // Try to calculate totals from cart items directly
      let calculatedTotal = 0; // one-time module price total
      let calculatedAdditionalTotal = 0; // monthly additional units total
      let calculatedMaintenanceTotal = 0; // monthly maintenance total

      const seedProducts =
        cartItems?.moduleProducts && Array.isArray(cartItems.moduleProducts)
          ? cartItems.moduleProducts
          : cartItems?.products && Array.isArray(cartItems.products)
            ? cartItems.products
            : [];

      if (seedProducts.length > 0) {
        seedProducts.forEach((item, index) => {
          let mainModulePrice = item.mainPrice || item.price || 0;
          let additionalUnitPrice = item.additionalPrice || item.price || 0;
          let maintenancePrice = item.maintenancePrice || 0;

          if (item.quantity > 0) {
            calculatedTotal += mainModulePrice * item.quantity;
            // Maintenance applies when a main module is selected
            calculatedMaintenanceTotal += maintenancePrice * item.quantity;
          }

          if (item.additionalUnit > 0) {
            calculatedAdditionalTotal +=
              additionalUnitPrice * item.additionalUnit;
          }
        });

        if (
          calculatedTotal > 0 ||
          calculatedAdditionalTotal > 0 ||
          calculatedMaintenanceTotal > 0 ||
          oneTimeFeeAmount > 0
        ) {
          console.log("Calculated totals from cart items:", {
            calculatedTotal,
            calculatedAdditionalTotal,
            calculatedMaintenanceTotal,
            oneTimeFeeAmount,
          });

          if (mode === "payment") {
            // For monthly plan: pay setup + 1st month today, then 11 months recurring
            // For full plan: pay everything upfront including 12 months recurring
            const monthlyRecurring =
              calculatedAdditionalTotal + calculatedMaintenanceTotal;
            let oneTimeTotal;
            if (isMonthlyPlan) {
              // Monthly plan: setup + oneTimeFee + 1st month
              oneTimeTotal =
                calculatedTotal + monthlyRecurring + oneTimeFeeAmount;
            } else {
              // Full plan: setup + oneTimeFee + 12 months recurring
              oneTimeTotal =
                calculatedTotal + monthlyRecurring * 12 + oneTimeFeeAmount;
            }
            const discountedOneTimeTotal = applyDiscount(oneTimeTotal);
            return {
              oneTimeTotal: discountedOneTimeTotal,
              originalOneTimeTotal: oneTimeTotal,
              subscriptionTotal: monthlyRecurring,
              moduleTotal: discountedOneTimeTotal,
              oneTimeFee: oneTimeFeeAmount,
              discount: discountAmount,
              discountType: discountType,
              discountValue: oneTimeTotal - discountedOneTimeTotal,
              isMonthlyPlan: isMonthlyPlan,
              remainingMonths: remainingMonths,
              monthlyRecurring: monthlyRecurring,
            };
          } else if (mode === "subscription") {
            const monthlyRecurring =
              calculatedAdditionalTotal + calculatedMaintenanceTotal;
            const oneTimeTotal =
              calculatedTotal + monthlyRecurring * 12 + oneTimeFeeAmount;
            return {
              oneTimeTotal: oneTimeTotal,
              subscriptionTotal: oneTimeTotal / 12,
              moduleTotal: oneTimeTotal / 12,
              oneTimeFee: oneTimeFeeAmount,
              discount: 0,
              discountType: discountType,
              discountValue: 0,
              isMonthlyPlan: false,
              remainingMonths: 12,
              monthlyRecurring: monthlyRecurring,
            };
          } else if (mode === "module") {
            const orderTotal =
              calculatedTotal +
              calculatedAdditionalTotal +
              calculatedMaintenanceTotal +
              oneTimeFeeAmount;
            const discountedOrderTotal = applyDiscount(orderTotal);
            return {
              oneTimeTotal: discountedOrderTotal,
              originalOneTimeTotal: orderTotal,
              subscriptionTotal:
                calculatedAdditionalTotal + calculatedMaintenanceTotal,
              moduleTotal: discountedOrderTotal,
              oneTimeFee: oneTimeFeeAmount,
              discount: discountAmount,
              discountType: discountType,
              discountValue: orderTotal - discountedOrderTotal,
            };
          }
        }
      }

      console.log(
        "Could not calculate from cart items, returning default values",
      );
      return {
        oneTimeTotal: 0,
        originalOneTimeTotal: 0,
        subscriptionTotal: 0,
        moduleTotal: 0,
        oneTimeFee: 0,
        discount: 0,
        discountType: "percentage",
        discountValue: 0,
      };
    }

    // If this is NOT a module order, return the normal cart totals
    if (!isModuleOrder) {
      console.log("Not a module order, returning normal cart totals");
      const discountedTotal = applyDiscount(localTotal);
      return {
        oneTimeTotal: discountedTotal,
        originalOneTimeTotal: localTotal,
        subscriptionTotal: localTotal / 12,
        moduleTotal: discountedTotal,
        oneTimeFee: 0,
        discount: discountAmount,
        discountType: discountType,
        discountValue: localTotal - discountedTotal,
      };
    }

    // This is a module order - calculate special module pricing
    console.log("Module order detected, calculating special pricing");

    let moduleTotal = 0; // one-time module price total
    let additionalItemsTotal = 0; // monthly additional units total
    let maintenanceTotal = 0; // monthly maintenance total

    // Handle both old and new cart structures
    let productsToProcess = [];
    if (cartItems?.moduleProducts && Array.isArray(cartItems.moduleProducts)) {
      // New structure: use moduleProducts array
      productsToProcess = cartItems.moduleProducts;
      console.log(
        "Using moduleProducts array, length:",
        productsToProcess.length,
      );
    } else if (cartItems?.products && Array.isArray(cartItems.products)) {
      // Old structure: use products array
      productsToProcess = cartItems.products;
      console.log("Using products array, length:", productsToProcess.length);
    }

    console.log("Products to process:", productsToProcess);

    if (productsToProcess.length > 0) {
      productsToProcess.forEach((item, index) => {
        console.log(`=== ITEM ${index} DETAILED DEBUG ===`);
        console.log("Full item object:", item);
        console.log("Item keys:", Object.keys(item));
        console.log("Item name:", item.name);
        console.log("Item quantity:", item.quantity);
        console.log("Item additionalUnit:", item.additionalUnit);
        console.log("Item price:", item.price);
        console.log("Item mainPrice:", item.mainPrice);
        console.log("Item additionalPrice:", item.additionalPrice);
        console.log("Item currency:", item.currency);
        console.log("Item product:", item.product);

        // Use the correct price information from the cart item
        // Prioritize mainPrice and additionalPrice if available
        let mainModulePrice = item.mainPrice || item.price || 0;
        let additionalUnitPrice = item.additionalPrice || item.price || 0;
        let itemCurrency = item.currency || "USD";
        let maintenancePrice = item.maintenancePrice || 0;

        console.log(
          `Item ${index} pricing: mainPrice=${mainModulePrice}, additionalPrice=${additionalUnitPrice}, currency=${itemCurrency}`,
        );

        // Calculate main module total (one-time payment)
        if (item.quantity > 0) {
          const mainModuleTotal = mainModulePrice * item.quantity;
          moduleTotal += mainModuleTotal;
          console.log(
            `Main module: ${item.name || "Unknown"}, price: ${mainModulePrice}, quantity: ${item.quantity}, total: ${mainModuleTotal}`,
          );
          // Maintenance applies when a main module is selected
          maintenanceTotal += maintenancePrice * item.quantity;
          console.log(
            `Maintenance: price: ${maintenancePrice}, quantity: ${item.quantity}, total: ${maintenancePrice * item.quantity}`,
          );
        }

        // Calculate additional units total (monthly subscription)
        if (item.additionalUnit > 0) {
          const additionalUnitsTotal =
            additionalUnitPrice * item.additionalUnit;
          additionalItemsTotal += additionalUnitsTotal;
          console.log(
            `Additional units: ${item.name || "Unknown"}, price: ${additionalUnitPrice}, additionalUnits: ${item.additionalUnit}, total: ${additionalUnitsTotal}`,
          );
          console.log(
            `Note: For one-time payment, this will be multiplied by 12 months: ${additionalUnitsTotal} × 12 = ${additionalUnitsTotal * 12}`,
          );
        }
      });
    } else {
      console.log(
        "No products found in cartItems or cartItems.products/moduleProducts is not an array",
      );
    }

    console.log("Final calculation:");
    console.log("Module total (one-time):", moduleTotal);
    console.log("Additional items total (monthly):", additionalItemsTotal);
    console.log("Maintenance total (monthly):", maintenanceTotal);
    console.log("One-time fee:", oneTimeFeeAmount);
    console.log("Combined total:", moduleTotal + additionalItemsTotal);
    console.log("=== PAYMENT CALCULATION BREAKDOWN ===");
    console.log("Main module cost:", moduleTotal);
    console.log("Additional units cost (per month):", additionalItemsTotal);
    console.log("Maintenance cost (per month):", maintenanceTotal);
    console.log("One-time fee:", oneTimeFeeAmount);
    console.log(
      "Monthly costs (additional + maintenance):",
      additionalItemsTotal + maintenanceTotal,
    );
    console.log(
      "Monthly costs × 12:",
      (additionalItemsTotal + maintenanceTotal) * 12,
    );
    console.log(
      "One-time payment total:",
      moduleTotal +
        (additionalItemsTotal + maintenanceTotal) * 12 +
        oneTimeFeeAmount,
    );
    console.log(
      "Monthly subscription:",
      (moduleTotal +
        (additionalItemsTotal + maintenanceTotal) * 12 +
        oneTimeFeeAmount) /
        12,
    );
    console.log(
      "Module payment: now =",
      moduleTotal + additionalItemsTotal + maintenanceTotal + oneTimeFeeAmount,
      "monthly =",
      additionalItemsTotal + maintenanceTotal,
    );

    if (mode === "payment") {
      // For monthly plan: pay setup + 1st month today, then 11 months recurring
      // For full plan: pay everything upfront including 12 months recurring
      const monthlyRecurring = additionalItemsTotal + maintenanceTotal;
      let oneTimeTotal;
      if (isMonthlyPlan) {
        // Monthly plan: setup + oneTimeFee + 1st month
        oneTimeTotal = moduleTotal + monthlyRecurring + oneTimeFeeAmount;
        console.log(
          "Monthly plan: oneTimeTotal =",
          oneTimeTotal,
          "(setup + 1st month)",
        );
      } else {
        // Full plan: setup + oneTimeFee + 12 months recurring
        oneTimeTotal = moduleTotal + monthlyRecurring * 12 + oneTimeFeeAmount;
        console.log(
          "Full plan: oneTimeTotal =",
          oneTimeTotal,
          "(setup + 12 months)",
        );
      }
      const discountedOneTimeTotal = applyDiscount(oneTimeTotal);
      console.log(
        "Payment mode 'payment': oneTimeTotal =",
        oneTimeTotal,
        "discounted =",
        discountedOneTimeTotal,
      );
      console.log(
        "Breakdown: main module =",
        moduleTotal,
        "+ monthly recurring =",
        monthlyRecurring,
        "+ one-time fee =",
        oneTimeFeeAmount,
      );
      return {
        oneTimeTotal: discountedOneTimeTotal,
        originalOneTimeTotal: oneTimeTotal,
        subscriptionTotal: monthlyRecurring,
        moduleTotal: discountedOneTimeTotal,
        oneTimeFee: oneTimeFeeAmount,
        discount: discountAmount,
        discountType: discountType,
        discountValue: oneTimeTotal - discountedOneTimeTotal,
        isMonthlyPlan: isMonthlyPlan,
        remainingMonths: remainingMonths,
        monthlyRecurring: monthlyRecurring,
      };
    } else if (mode === "subscription") {
      // Subscription: total one time payment amount divided by 12 (no discount on subscription)
      const monthlyRecurring = additionalItemsTotal + maintenanceTotal;
      const oneTimeTotal =
        moduleTotal + monthlyRecurring * 12 + oneTimeFeeAmount;
      console.log(
        "Payment mode 'subscription': subscriptionTotal =",
        oneTimeTotal / 12,
      );
      console.log(
        "Breakdown: main module =",
        moduleTotal,
        "+ (maintenance + additional) × 12 =",
        monthlyRecurring * 12,
        "+ one-time fee =",
        oneTimeFeeAmount,
      );
      return {
        oneTimeTotal: oneTimeTotal,
        subscriptionTotal: oneTimeTotal / 12,
        moduleTotal: oneTimeTotal / 12,
        oneTimeFee: oneTimeFeeAmount,
        discount: 0,
        discountType: discountType,
        discountValue: 0,
        isMonthlyPlan: false,
        remainingMonths: 12,
        monthlyRecurring: monthlyRecurring,
      };
    } else if (mode === "module") {
      // Third option (one time and subscription):
      // Now amount = main module + current monthly (maintenance + additional units) + one-time fee
      const orderTotal =
        moduleTotal +
        additionalItemsTotal +
        maintenanceTotal +
        oneTimeFeeAmount; // NOT multiplied by 12
      const discountedOrderTotal = applyDiscount(orderTotal);
      console.log(
        "Payment mode 'module': now =",
        orderTotal,
        "discounted =",
        discountedOrderTotal,
        "monthly =",
        additionalItemsTotal + maintenanceTotal,
      );
      console.log(
        "Breakdown: main module =",
        moduleTotal,
        "+ current monthly (maintenance + additional units) =",
        additionalItemsTotal + maintenanceTotal,
        "+ one-time fee =",
        oneTimeFeeAmount,
      );
      console.log("Returning:", {
        oneTimeTotal: discountedOrderTotal,
        originalOneTimeTotal: orderTotal,
        subscriptionTotal: additionalItemsTotal + maintenanceTotal,
        moduleTotal: discountedOrderTotal,
        oneTimeFee: oneTimeFeeAmount,
        discount: discountAmount,
        discountType: discountType,
        discountValue: orderTotal - discountedOrderTotal,
      });
      return {
        oneTimeTotal: discountedOrderTotal, // Now amount (main + current monthly + one-time fee) with discount
        originalOneTimeTotal: orderTotal, // Original amount before discount
        subscriptionTotal: additionalItemsTotal + maintenanceTotal, // Monthly amount (maintenance + additional units)
        moduleTotal: discountedOrderTotal, // Now amount with discount
        oneTimeFee: oneTimeFeeAmount,
        discount: discountAmount,
        discountType: discountType,
        discountValue: orderTotal - discountedOrderTotal,
      };
    }

    // Default fallback for module orders
    console.log("=== DEFAULT FALLBACK TRIGGERED ===");
    console.log("Payment mode was:", paymentMode);
    console.log("Module total calculated:", moduleTotal);
    console.log("Additional items total calculated:", additionalItemsTotal);
    console.log("One-time fee:", oneTimeFeeAmount);
    console.log("localTotal fallback:", localTotal);
    const fallbackTotal = localTotal + oneTimeFeeAmount;
    const discountedFallbackTotal = applyDiscount(fallbackTotal);
    console.log("Returning fallback values:", {
      oneTimeTotal: discountedFallbackTotal,
      originalOneTimeTotal: fallbackTotal,
      subscriptionTotal: localTotal,
      moduleTotal: discountedFallbackTotal,
      oneTimeFee: oneTimeFeeAmount,
      discount: discountAmount,
      discountType: discountType,
      discountValue: fallbackTotal - discountedFallbackTotal,
    });
    return {
      oneTimeTotal: discountedFallbackTotal,
      originalOneTimeTotal: fallbackTotal,
      subscriptionTotal: localTotal,
      moduleTotal: discountedFallbackTotal,
      oneTimeFee: oneTimeFeeAmount,
      discount: discountAmount,
      discountType: discountType,
      discountValue: fallbackTotal - discountedFallbackTotal,
    };
  };

  useEffect(() => {
    setCurrencySymbol(
      returnCurrencySymbol(cartItems?.currency || userData?.currency),
    );
    setCurrencyCode(cartItems?.currency || userData?.currency);
  }, [cartItems?.currency || userData?.currency]);

  useEffect(() => {
    console.log("here is initialValues", initialValues);
    console.log("userData", userData);
  }, [initialValues]);

  let monthprice;
  let monthlymodulequantity = 0;

  useEffect(() => {
    console.log("couponcode", couponCode);
    console.log("cartt", cartItems);
    // Handle both old and new cart structures
    let productsToProcess = [];
    if (cartItems?.moduleProducts && Array.isArray(cartItems.moduleProducts)) {
      // New structure: use moduleProducts array
      productsToProcess = cartItems.moduleProducts;
    } else if (cartItems?.products && Array.isArray(cartItems.products)) {
      // Old structure: use products array
      productsToProcess = cartItems.products;
    }

    if (productsToProcess.length > 0) {
      productsToProcess.forEach((item) => {
        // For the new cart structure, we need to handle both quantity and additionalUnit
        // The old logic was looking for specific product IDs, but now we should use additionalUnit
        if (item.additionalUnit && item.additionalUnit > 0) {
          // This is the new way - use additionalUnit for monthly subscriptions
          monthlymodulequantity = item.additionalUnit + monthlymodulequantity;
          console.log(
            `Adding ${item.additionalUnit} additional units from ${item.name || "Unknown product"}`,
          );
        } else if (
          // Keep the old logic as fallback for backward compatibility
          item.product &&
          (item.product._id === 10000027 ||
            item.product._id === 10000028 ||
            item.product._id === 10000029 ||
            item.product._id === 10000030 ||
            item.product._id === 10000031)
        ) {
          monthlymodulequantity = item.quantity + monthlymodulequantity;
          console.log(
            `Adding ${item.quantity} units from old product ID ${item.product._id}`,
          );
        }
      });
    }
    setMonthPay(monthlymodulequantity);
    console.log("monthlyy ", monthlymodulequantity);
    let carbonroute = localStorage.getItem("carbonroute");
    if (carbonroute === "eventOffset" || carbonroute === "workcarbonoffset") {
      localStorage.setItem("BusinessOrderSelection", "yes");
    } else if (localStorage.getItem("carbonroute")) {
      localStorage.setItem("BusinessOrderSelection", "no");
    } else {
      localStorage.removeItem("BusinessOrderSelection");
    }
    if (refferalCheck) {
      setTimeout(() => {
        handleApplyCoupon({
          preventDefault: () => {
            console.log("");
          },
        });
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (calculatorCheckout) {
      handleSubmit("", false).catch((err) => console.log(err));
      setCalculatorCheckout(false);
      setShouldShowCarbonOffsetModel(false);
    }
  }, [calculatorCheckout]);

  const addExpressDataToRedux = async () => {
    const res = await calculateExpress(
      cartItems?.hiddenProducts[0]?.cartData?._id,
      cartItems?.hiddenProducts[0]?.cartData?.quantity,
      couponCode,
      cartItems?.currency || userData?.currency,
      true,
    );
    addExpressPriceData(res?.data?.data);
  };

  useEffect(() => {
    if (actionSuccessType === "SUCCESS_COUPON_APPLY") {
      handleApplyCoupon({
        preventDefault: () => {
          console.log("");
        },
      });
    }

    if (actionSuccessType === "SUCCESS_CHANGE_CURRENCY") {
      setShowCurrencyOverlay(true);
    }

    return () => {
      setActionSuccessType("");
    };
  }, [actionSuccessType]);

  // Debug: Monitor localTotal changes
  useEffect(() => {
    console.log("=== STRIPE COMPONENT DEBUGGING ===");
    console.log("localTotal changed to:", localTotal);
    console.log("localTotalQuantity changed to:", localTotalQuantity);
    console.log("cartItems:", cartItems);
    console.log("isModuleOrder:", isModuleOrder);

    if (isModuleOrder && cartItems?.moduleProducts) {
      console.log("Module products in cart:", cartItems.moduleProducts);
      const totals = getModuleOrderTotal("payment");
      console.log("Calculated module totals:", totals);
    }

    // Also handle normal products when cartItems change
    if (!isModuleOrder && cartItems?.products?.length > 0) {
      console.log("Normal products in cart, recalculating totals");
      let calculatedTotal = 0;
      let calculatedQuantity = 0;

      cartItems.products.forEach((item, index) => {
        let itemPrice = 0;
        if (item.price) {
          itemPrice = item.price;
        } else if (item.product?.price) {
          itemPrice = item.product.price;
        } else if (
          item.product?.priceList &&
          Array.isArray(item.product.priceList)
        ) {
          const defaultPrice = item.product.priceList[0]?.price || 0;
          itemPrice = defaultPrice;
        }

        const itemQuantity = item.quantity || 1;
        const itemTotal = itemPrice * itemQuantity;

        calculatedTotal += itemTotal;
        calculatedQuantity += itemQuantity;
      });

      if (calculatedTotal > 0 && calculatedTotal !== localTotal) {
        console.log(
          "Updating localTotal for normal products to:",
          calculatedTotal,
        );
        setLocalTotal(calculatedTotal);
        setLocalTotalQuantity(calculatedQuantity);
      }
    }
  }, [cartItems, isModuleOrder]);

  // Calculate and set localTotal for module orders
  useEffect(() => {
    if (
      isModuleOrder &&
      (cartItems?.moduleProducts?.length > 0 || cartItems?.products?.length > 0)
    ) {
      console.log("=== CALCULATING MODULE ORDER TOTAL ===");
      const totals = getModuleOrderTotal(paymentMode);
      console.log("Module order totals calculated:", totals);

      // Use originalOneTimeTotal for Cart Total display (before discount)
      const displayTotal = totals.originalOneTimeTotal || totals.oneTimeTotal;
      if (displayTotal > 0) {
        console.log("Setting localTotal to (original):", displayTotal);
        setLocalTotal(displayTotal);
        setLocalTotalQuantity(1); // Module orders are typically single items
      }
    }
  }, [
    isModuleOrder,
    cartItems?.moduleProducts,
    cartItems?.products,
    paymentMode,
  ]);

  // Additional effect to recalculate totals when cartItems change
  useEffect(() => {
    if (
      isModuleOrder &&
      (cartItems?.moduleProducts?.length > 0 || cartItems?.products?.length > 0)
    ) {
      // Force recalculation when cartItems change
      const totals = getModuleOrderTotal(paymentMode);
      // Use originalOneTimeTotal for Cart Total display (before discount)
      const displayTotal = totals.originalOneTimeTotal || totals.oneTimeTotal;
      if (displayTotal > 0 && displayTotal !== localTotal) {
        console.log(
          "Cart items changed, updating localTotal to (original):",
          displayTotal,
        );
        setLocalTotal(displayTotal);
      }
    }
  }, [cartItems, isModuleOrder, paymentMode]);

  // Recalculate totals when payment mode changes for module orders
  useEffect(() => {
    if (isModuleOrder) {
      // Force re-render when payment mode changes to update displayed totals
      setreRender(!reRender);
    }
  }, [paymentMode, isModuleOrder]);

  // Calculate and set localTotal for normal products (non-module orders)
  useEffect(() => {
    if (!isModuleOrder && cartItems?.products?.length > 0) {
      console.log("=== CALCULATING NORMAL PRODUCTS TOTAL ===");
      let calculatedTotal = 0;
      let calculatedQuantity = 0;
      const userCurrency = cartItems?.currency || userData?.currency || "USD";

      cartItems.products.forEach((item, index) => {
        console.log(`Processing normal product ${index}:`, item);

        // Try to get price from multiple sources
        let itemPrice = 0;
        if (item.price && item.price > 0) {
          itemPrice = item.price;
        } else if (item.product && typeof item.product === "object") {
          // Try to get price from priceList with currency matching
          if (
            Array.isArray(item.product.priceList) &&
            item.product.priceList.length > 0
          ) {
            // First try to match user's currency
            const matchingPrice = item.product.priceList.find(
              (p) => p.currency === userCurrency,
            );
            if (matchingPrice && matchingPrice.price > 0) {
              itemPrice = matchingPrice.price;
            } else {
              // Fallback to first price in list
              itemPrice = item.product.priceList[0]?.price || 0;
            }
          } else if (item.product.price && item.product.price > 0) {
            itemPrice = item.product.price;
          }
        }

        const itemQuantity = item.quantity || 1;
        const itemTotal = itemPrice * itemQuantity;

        calculatedTotal += itemTotal;
        calculatedQuantity += itemQuantity;

        console.log(
          `Product ${index}: price=${itemPrice}, quantity=${itemQuantity}, total=${itemTotal}`,
        );
      });

      console.log("Normal products total calculated:", calculatedTotal);
      console.log("Normal products quantity calculated:", calculatedQuantity);

      if (calculatedTotal > 0) {
        console.log("Setting localTotal to:", calculatedTotal);
        setLocalTotal(calculatedTotal);
        setLocalTotalQuantity(calculatedQuantity);
      }
    }
  }, [
    isModuleOrder,
    cartItems?.products,
    cartItems?.currency,
    userData?.currency,
  ]);

  useEffect(() => {
    if (express) {
      addExpressDataToRedux().catch((err) =>
        console.log(
          "error while adding expressDataToRedux in checkout page",
          err,
        ),
      );
    }
    getAllCountries();
    checkoutElement.current = removeErrorMessage;
    console.log("callcart1", cartItems);
    if (userData?.isLoggedIn && localStorage.getItem("MyBusinessDetails")) {
      handleReverseCart();
    }
    updateCartForStripe(cartItems?.currency || userData?.currency);

    // Initialize localTotal for normal products on component mount
    if (!isModuleOrder && cartItems?.products?.length > 0) {
      console.log("=== INITIALIZING NORMAL PRODUCTS TOTAL ON MOUNT ===");
      let calculatedTotal = 0;
      let calculatedQuantity = 0;

      cartItems.products.forEach((item, index) => {
        let itemPrice = 0;
        if (item.price) {
          itemPrice = item.price;
        } else if (item.product?.price) {
          itemPrice = item.product.price;
        } else if (
          item.product?.priceList &&
          Array.isArray(item.product.priceList)
        ) {
          const defaultPrice = item.product.priceList[0]?.price || 0;
          itemPrice = defaultPrice;
        }

        const itemQuantity = item.quantity || 1;
        const itemTotal = itemPrice * itemQuantity;

        calculatedTotal += itemTotal;
        calculatedQuantity += itemQuantity;

        console.log(
          `Initial product ${index}: price=${itemPrice}, quantity=${itemQuantity}, total=${itemTotal}`,
        );
      });

      if (calculatedTotal > 0) {
        console.log("Initializing localTotal to:", calculatedTotal);
        setLocalTotal(calculatedTotal);
        setLocalTotalQuantity(calculatedQuantity);
      }
    }
  }, []);

  const handleReverseCart = async () => {
    let reverseData = await reverseBusinessCart();
    console.log(reverseData.data, "reversee");
    if (reverseData.data.success) {
      window.location.reload();
    }
  };

  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady) {
      return;
    }

    // Skip this useEffect for dynamic pricing guest checkout - let the dedicated useEffect handle it
    const isDynamicPricingGuestFlow =
      router.query.dynamicPricing === "true" &&
      router.query.linkId &&
      !userData?.isLoggedIn;

    if (isDynamicPricingGuestFlow) {
      console.log(
        "Skipping userDetail useEffect for dynamic pricing guest flow",
      );
      return;
    }

    const {
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      pincode,
      countryCode,
      stateCode,
      companyName,
    } = userData?.billingAddress || {};

    if (countryCode && stateCode) {
      const statesList = State.getStatesOfCountry(countryCode);
      setStateList(statesList);
      const cities = City.getCitiesOfState(countryCode, stateCode);
      setCityList(cities);
    }
    setInitialValues({
      ...initialValues,
      firstName: firstName ? firstName : "",
      lastName: lastName ? lastName : "",
      email: userDetail?.user?.email ? userDetail.user?.email : "",
      phone: phone ? phone?.numericCode + phone?.number : "",
      phoneInfo: phone
        ? phone
        : { number: "", numericCode: "", countryCode: "" },
      streetAddressOne: addressLine1 ? addressLine1 : "",
      streetAddressTwo: addressLine2 ? addressLine2 : "",
      mailcode: pincode ? pincode : "",
      city: city ? city : "",
      state: state ? state : "",
      country: country ? country : "",
      countryCode: countryCode ? countryCode : "",
      stateCode: stateCode ? stateCode : "",
      companyName: companyName ? companyName : "",
    });
  }, [router.isReady, userDetail, router.query, userData?.isLoggedIn]);

  // Pre-populate form with address from dynamicPricingCheckout for guest checkout
  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady) {
      console.log("Router not ready yet, waiting...");
      return;
    }

    const isDynamicPricingGuestFlow =
      router.query.dynamicPricing === "true" &&
      router.query.linkId &&
      !userData?.isLoggedIn;

    if (isDynamicPricingGuestFlow) {
      console.log("=== DYNAMIC PRICING GUEST FLOW DETECTED ===");

      // Try to get data from localStorage or sessionStorage
      const rawData =
        localStorage.getItem("dynamicPricingCheckout") ||
        sessionStorage.getItem("dynamicPricingCheckout");

      console.log("Raw localStorage data:", rawData);

      if (!rawData) {
        console.log("No dynamic pricing data found in storage");
        return;
      }

      try {
        const dynamicPricingData = JSON.parse(rawData);
        const buyerInfo = dynamicPricingData?.buyerInfo;
        const guestEmail =
          dynamicPricingData?.guestEmail || buyerInfo?.email || "";

        console.log("Parsed dynamicPricingData:", dynamicPricingData);
        console.log("buyerInfo:", buyerInfo);
        console.log("guestEmail:", guestEmail);

        // Pre-fill with available data
        const newValues = {
          ...initialValues,
          firstName: buyerInfo?.firstName || "",
          lastName: buyerInfo?.lastName || "",
          email: guestEmail,
          companyName: buyerInfo?.company || "",
          // Address fields - these may not be available from admin quote
          phone: buyerInfo?.phone || "",
          phoneInfo: {
            number: buyerInfo?.phone || "",
            numericCode: "",
            countryCode: buyerInfo?.countryCode || "",
          },
          streetAddressOne: buyerInfo?.address1 || "",
          streetAddressTwo: buyerInfo?.address2 || "",
          mailcode: buyerInfo?.zip || "",
          city: buyerInfo?.city || "",
          state: buyerInfo?.state || "",
          country: buyerInfo?.country || "",
          countryCode: buyerInfo?.countryCode || "",
          stateCode: buyerInfo?.stateCode || "",
        };

        console.log("Setting initialValues to:", newValues);
        setInitialValues(newValues);

        // Update state and city lists if country is available
        if (buyerInfo?.countryCode) {
          const statesList = State.getStatesOfCountry(buyerInfo.countryCode);
          setStateList(statesList);
          if (buyerInfo?.stateCode) {
            const cities = City.getCitiesOfState(
              buyerInfo.countryCode,
              buyerInfo.stateCode,
            );
            setCityList(cities);
          }
        }
      } catch (e) {
        console.error("Error pre-populating guest checkout form:", e);
      }
    }
  }, [
    router.isReady,
    router.query.dynamicPricing,
    router.query.linkId,
    userData?.isLoggedIn,
  ]);

  const buttonSpinner = (
    <Spinner size="sm" animation="border" role="status">
      {" "}
      <span style={{ opacity: "0%" }}>Loading...</span>{" "}
    </Spinner>
  );

  const getAllCountries = () => {
    const countryList = Country.getAllCountries();
    setAllCountryList(countryList);
  };

  const unApplyCoupon = () => {
    if (!couponCode) return;
    if (express) {
      calculateExpress(
        cartItems?.hiddenProducts[0]?.cartData?._id,
        cartItems?.hiddenProducts[0]?.cartData?.quantity,
        "",
        cartItems?.currency,
        true,
      ).then((res) => {
        addExpressPriceData(res?.data?.data);
        setApplyCouponPressed(false);
      });
    }
    unApplyCouponToAPI()
      .then((res) => {
        if (res?.status !== 200 && !res?.message) {
          return addToast("Please Try again later", {
            appearance: "error",
            autoDismiss: true,
          });
        }

        if (res?.status !== 200) {
          return addToast(res?.message, { autoDismiss: true });
        }

        res = res?.data;

        const subTotal = res?.data?.subTotal || 0;
        const total = res?.data?.orderTotal || 0;
        const orderTotalWithinStripeRange =
          res?.data?.orderTotalWithinStripeRange;
        removeCoupon(subTotal, total, orderTotalWithinStripeRange);

        setCouponCode("");
        return addToast("Coupon Removed Successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((err) => console.log(err));
  };

  const returnCurrencySymbol = (currency = "USD") => {
    const currencyMap = {
      USD: "$",
      CAD: "$",
      GBP: "£",
      EUR: "€",
      INR: "₹",
      JPY: "¥",
      CNY: "¥",
    };
    return currencyMap[currency];
  };

  const handeStripeOpen = () => {
    document.getElementById("stripeDiv") &&
      (document.getElementById("stripeDiv").style.display = "block");
  };

  const saveCouponFunc = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (express) {
          const res = await calculateExpress(
            cartItems?.hiddenProducts[0]?.cartData?._id,
            cartItems?.hiddenProducts[0]?.cartData?.quantity,
            couponCode,
          );

          addExpressPriceData(res?.data?.data);

          if (res?.data?.data?.coupon === couponCode) {
            setExpressCouponCode({
              stripePaymentCouponId: res?.data?.data?.stripePaymentCouponId,
              stripeSubscriptionCouponId:
                res?.data?.data?.stripeSubscriptionCouponId,
            });
          }
        }
        await saveCoupon(
          couponCode,
          addCoupon,
          addToast,
          setreRender,
          true,
          setCouponCode,
        );
        resolve();
        return;
      } catch (err) {
        return reject(err.message);
      }
    });
  };

  const handleApplyCoupon = async (e, getStripeCoupon = false) => {
    e.preventDefault();
    if (couponCode === "ED3VY7" && !refferalCheck)
      return addToast("refferal code cannot be applied manually", {
        appearance: "error",
        autoDismiss: true,
      });
    if (!userData?.isLoggedIn && actionSuccessType !== "SUCCESS_COUPON_APPLY") {
      setOrigin("apply-coupon");
      return setShowLoginPopup(true);
    }
    if (!couponCode) {
      return addToast("Please enter a coupon to apply", { autoDismiss: true });
    }
    const res = await applyCouponToAPI(couponCode, getStripeCoupon);

    if (res?.status !== 200) {
      setCouponCode && setCouponCode("");

      return addToast(res?.data?.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    buttonStatusHandler(setApplyCouponPressed, saveCouponFunc);
  };

  const paymentOptionChange = (paymentMode) => {
    if (paymentMode === "subscription") {
      setSubscriptionRecurring({
        interval: "month",
      });
    } else if (paymentMode === "module") {
      // For module payment, set subscription recurring for the monthly portion
      setSubscriptionRecurring({
        interval: "month",
      });
    } else {
      setSubscriptionRecurring({});
    }
    setPaymentMode(paymentMode);
  };

  const returnCorrectCurrency = (currency = "USD", priceList, sub = false) => {
    // Guard clause: if priceList is undefined or not an array, return a default value
    if (!priceList || !Array.isArray(priceList) || priceList.length === 0) {
      console.warn(
        "returnCorrectCurrency: priceList is undefined or invalid:",
        priceList,
      );
      // Return a default price based on currency
      const defaultPrice = 1; // Default to $1.00
      let finalPrice;
      if (sub) finalPrice = Number((defaultPrice * 100) / 12)?.toFixed(2);
      else finalPrice = Number(defaultPrice * 100)?.toFixed(2);
      if (currency === "JPY") return Math.round(finalPrice / 100);
      else return finalPrice;
    }

    let price;
    priceList.forEach((each) => {
      if (each.currency === currency) {
        price = each.price;
      }
    });
    if (!price) {
      price = priceList[0].price;
    }
    let finalPrice;
    if (sub) finalPrice = Number((price * 100) / 12)?.toFixed(2);
    else finalPrice = Number(price * 100)?.toFixed(2);
    if (currency === "JPY") return Math.round(finalPrice / 100);
    else return finalPrice;
  };

  const returnAPIProductsForOrder = (productsArg) => {
    console.log("=== returnAPIProductsForOrder DEBUG ===");
    console.log("Products input:", productsArg);
    console.log("isModuleOrder:", isModuleOrder);
    console.log("cartItems:", cartItems);

    // Determine products to use - fallback to cartItems if not provided
    let products = productsArg;
    if (!products || !Array.isArray(products) || products.length === 0) {
      if (isModuleOrder) {
        products = cartItems?.moduleProducts || [];
      } else if (cartItems?.useHiddenProducts) {
        products = cartItems?.hiddenProducts || [];
      } else {
        products = cartItems?.products || [];
      }
    }
    console.log("Final products to process:", products);

    // Return empty array if still no products
    if (!products || !Array.isArray(products) || products.length === 0) {
      console.warn("returnAPIProductsForOrder: No products found");
      return [];
    }

    // let saveStripeInfo = {
    //   products: newCartItems,
    //   address: initialValues,
    //   total: cartItems?.subTotal,
    //   paymentLogs: [],
    //   paymentStatus: "success",
    //   paymentMethod: "card",
    //   type: cartItems?.useHiddenProducts ? "express" : "regular",
    //   origin: "desktop",
    //   currency: cartItems?.currency || userData?.currency,
    //   currencySymbol: regionPricing.currencySymbol,
    //   couponCode: cartItems?.couponData?.coupon,
    // };

    const newCartItems = products.map((each, index) => {
      console.log(`=== PROCESSING PRODUCT ${index} ===`);
      console.log("Product item:", each);

      const express = cartItems?.useHiddenProducts;
      let regionPricing;

      if (express) {
        regionPricing = regionPrice(
          cartItems?.hiddenProducts[0]?.cartData,
          cartItems,
        );
        console.log("Express pricing result:", regionPricing);
      } else {
        regionPricing = regionPrice(each?.product, cartItems);
        console.log("Regular pricing result:", regionPricing);
      }

      // Guard clause: ensure regionPricing has the expected structure
      if (!regionPricing || typeof regionPricing !== "object") {
        console.warn(
          `returnAPIProductsForOrder: regionPricing is invalid for product ${index}:`,
          regionPricing,
        );
        regionPricing = {
          productPrice: 0,
          currencySymbol: "$",
        };
      }

      // For normal products, try to get price from multiple sources
      let productPrice = 0;
      if (regionPricing?.productPrice) {
        productPrice = regionPricing.productPrice;
      } else if (each?.price) {
        productPrice = each.price;
      } else if (each?.product?.price) {
        productPrice = each.product.price;
      } else if (
        each?.product?.priceList &&
        Array.isArray(each.product.priceList)
      ) {
        // Try to get price from priceList
        const defaultPrice = each.product.priceList[0]?.price || 0;
        productPrice = defaultPrice;
      }

      console.log(`Product ${index} final price:`, productPrice);

      // Base product object
      let productObj = {
        ...each,
        product: express ? each?.cartData?._id : each?.product?._id,
        price: productPrice,
        quantity: express ? each?.cartData?.quantity : each?.quantity,
        currency: cartItems?.currency || userData?.currency,
        name: express ? each?.cartData?.name : each?.product?.name,
      };

      // Add module-specific fields if this is a module order
      if (isModuleOrder && !express) {
        const setupCost = Number(
          each?.mainPrice || each?.price || productPrice || 0,
        );
        const maintenanceCost = Number(each?.maintenancePrice || 0);
        productObj = {
          ...productObj,
          price: setupCost + maintenanceCost,
          startupCost: setupCost,
          additionalQuantity: each?.additionalUnit || 0,
          additionalPrice: maintenanceCost,
        };
      }

      console.log(`Product ${index} final object:`, productObj);
      return productObj;
    });

    let companyName = {};

    if (initialValues?.companyName)
      companyName = { companyName: initialValues?.companyName };
    const phoneDetails = returnPhoneDetails(initialValues?.phoneInfo);
    const addressValues = {
      firstName: initialValues?.firstName,
      lastName: initialValues?.lastName,
      phone: {
        number: phoneDetails?.number,
        countryCode: phoneDetails?.countryCode,
        numericCode: phoneDetails?.numericCode,
      },

      addressLine1: initialValues?.streetAddressOne,
      addressLine2: initialValues?.streetAddressTwo,
      city: initialValues?.city,
      state: initialValues?.state,
      country: initialValues.country,
      pincode: initialValues?.mailcode,
      countryCode: initialValues?.countryCode,
      stateCode: initialValues?.stateCode,
      ...companyName,
    };
    const date = new Date();

    // Determine period based on payment mode for module orders
    let period = 1; // Default to 1
    if (isModuleOrder) {
      if (paymentMode === "payment") {
        // One time payment - period is 12 months
        period = 12;
      } else if (paymentMode === "subscription") {
        // 12 subscription payments - period is 12 months
        period = 12;
      } else if (paymentMode === "module") {
        // Module payment - period is 1 month (monthly recurring)
        period = 1;
      }
    }

    // Get default currency symbol for non-express orders
    let defaultCurrencySymbol = "$";
    if (products && products.length > 0 && !cartItems?.useHiddenProducts) {
      // For regular products, try to get currency symbol from first product
      const firstProduct = products[0];
      if (
        firstProduct?.product?.priceList &&
        Array.isArray(firstProduct.product.priceList)
      ) {
        const firstPrice = firstProduct.product.priceList[0];
        if (firstPrice?.currency) {
          defaultCurrencySymbol = returnCurrencySymbol(firstPrice.currency);
        }
      }
    }

    let saveStripeInfo = {
      products: newCartItems,
      address: addressValues,
      total: express
        ? cartItems?.expressPriceData?.subTotal
        : isModuleOrder
          ? getModuleOrderTotal(paymentMode).oneTimeTotal // Use module order total for module orders
          : cartItems?.subTotal, // Use regular cart total for non-module orders
      paymentLogs: [],
      paymentStatus: "success",
      paymentMethod: "card",
      type: express ? "express" : "regular",
      origin: "desktop",
      currency: cartItems?.currency || userData?.currency,
      currencySymbol: defaultCurrencySymbol,
      couponCode: express
        ? cartItems?.expressPriceData?.coupon
        : cartItems?.couponData?.coupon,
      timezone: date.getTimezoneOffset(),
      timeAbbrevation: new Date()
        .toLocaleDateString([], { day: "2-digit", timeZoneName: "long" })
        .substring(4)
        .match(/\b(\w)/g)
        .join(""),
      // Add module-specific fields
      ...(isModuleOrder && {
        isModulePurchase: true,
        period: period,
      }),
    };

    console.log("=== FINAL saveStripeInfo ===");
    console.log("Final saveStripeInfo:", saveStripeInfo);

    return saveStripeInfo;
  };

  const saveOrder = (saveStripeInfo) => {
    return saveStripeCheckout({
      ...saveStripeInfo,
    })
      .then((response) => {
        if (!response?.success) return;
        validateUser();
        addOrder(true, response);

        return router.push({
          pathname: "/checkout/success",
          query: { nonPayment: "true" },
        });
      })
      .catch((error) => console.log("error stripe", error));
  };

  const sleepFunc = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  };

  const scrollErrorIntoView = () => {
    const element = document.getElementsByClassName("error-msg")?.[0];
    if (!element) return; // Exit if no error element found

    const headerOffset = 250;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const emailhandler = () => {
    // Skip login popup for dynamic pricing guest checkout
    const isDynamicPricingGuestFlow =
      router.query.dynamicPricing === "true" &&
      router.query.linkId &&
      !userData?.isLoggedIn;

    if (isDynamicPricingGuestFlow) {
      // Allow guest checkout for dynamic pricing - no popup needed
      return;
    }

    if (!userData?.isLoggedIn) {
      setIsPaymentLoading(false);
      return setShowLoginPopup(true);
    }
  };

  const hasOwnBusiness = () => {
    if (!userData?.isLoggedIn) return false;
    try {
      const details = JSON.parse(localStorage.getItem("MyBusinessDetails") || "null");
      return !!details?.name;
    } catch {
      return false;
    }
  };

  const handlePress = () => {
    if (hasOwnBusiness()) {
      setBusinessPopShown(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    const validation = validate(initialValues, true);
    if (Object.keys(validation).length) {
      setIsError(validation);
      setIsFocus(validation);
      scrollErrorIntoView();
      return;
    }

    if (!paymentMode) {
      setIsPaymentModeErrorMsg(true);
      return;
    }

    // Check for carbon offset model
    if (
      !shouldShowCarbonOffsetModel &&
      router.query.remainingAmount > 0 &&
      !carbonPopupShown &&
      localStorage.getItem("BusinessOrderSelection") != "yes"
    ) {
      setIsPaymentLoading(false);
      return setShouldShowCarbonOffsetModel(true);
    }

    // Check if this is a dynamic pricing guest checkout flow.
    // NOTE: intentionally guest-only. For guests the Stripe webhook is the sole
    // creator of the order/module purchase (see checkout success page), so it
    // must receive isDynamicPricing/linkId/productIds. Logged-in buyers create
    // their order via the success page instead, so broadening this flag to them
    // would double-provision their modules.
    const isDynamicPricingGuestFlow =
      router.query.dynamicPricing === "true" &&
      router.query.linkId &&
      !userData?.isLoggedIn;

    // Check if user is logged in (bypass for dynamic pricing guest flow)
    if (!userData?.isLoggedIn && !isDynamicPricingGuestFlow) {
      setIsPaymentLoading(false);
      return setShowLoginPopup(true);
    }

    // Check email verification (skip for guest checkout)
    if (userData?.user?.email && !isDynamicPricingGuestFlow) {
      const response = await checkEmailVerificationStatus(
        userData?.user?.email,
      );
      if (response?.status === 200) {
        if (!response?.data?.emailVerified) {
          setIsPaymentLoading(false);
          setShouldShowVerifyModel(true);
          reSendRegistrationMail(null, "checkout");
          return;
        }
      }
    }

    // Check business popup — only for logged-in users who created a business
    if (!localStorage.getItem("BusinessOrderSelection") && hasOwnBusiness()) {
      setBusinessPopShown(true);
      setIsPaymentLoading(false);
      return;
    }

    if (orderData.isOrderPlaced) {
      addOrder(false, {});
    }

    // Prepare user address data
    const phoneDetails = returnPhoneDetails(initialValues?.phoneInfo);
    const userAddressData = {
      ...initialValues,
      phone: {
        number: phoneDetails?.number,
        countryCode: phoneDetails?.countryCode,
        numericCode: `${phoneDetails?.numericCode}`,
      },
    };

    setIsPaymentLoading(true);
    setCookies("checkout", userAddressData);

    try {
      // Guest dynamic-pricing checkout data (survives Stripe redirect via storage)
      let guestCheckoutEmail = null;
      let guestCheckoutLinkId = null;
      let guestCheckoutPaymentPlan = null;
      const dynamicPricingRaw =
        localStorage.getItem("dynamicPricingCheckout") ||
        sessionStorage.getItem("dynamicPricingCheckout");
      const isGuestModuleCheckout =
        !userData?.isLoggedIn &&
        (!!dynamicPricingRaw || isDynamicPricingGuestFlow);

      if (isGuestModuleCheckout && dynamicPricingRaw) {
        try {
          const dynamicPricingData = JSON.parse(dynamicPricingRaw);
          guestCheckoutEmail =
            dynamicPricingData?.guestEmail ||
            dynamicPricingData?.buyerInfo?.email;
          guestCheckoutLinkId =
            dynamicPricingData?.linkId ||
            router.query.linkId ||
            sessionStorage.getItem("processedDynamicPricingLinkId");
          guestCheckoutPaymentPlan =
            dynamicPricingData?.paymentPlan ||
            localStorage.getItem("dynamicPricingPaymentPlan") ||
            "monthly";
        } catch (e) {
          console.error("Error parsing dynamicPricingCheckout:", e);
        }
      }

      // Handle express orders
      if (express && isModuleOrder) {
        // Determine period based on payment mode
        const expressPeriod = paymentMode === "module" ? 1 : 12;
        const moduleTotals = getModuleOrderTotal(paymentMode);
        const chargeAmount = resolveModuleChargeAmount(moduleTotals);

        const expressModuleData = {
          isModulePurchase: true,
          period: expressPeriod,
          products: returnAPIProductsForOrder(),
          address: userAddressData,
          total: chargeAmount,
          paymentLogs: [],
          user: isDynamicPricingGuestFlow
            ? { email: guestCheckoutEmail }
            : { email: userData?.user?.email },
        };

        localStorage.setItem("modulepurchase", "true");
        localStorage.setItem(
          "moduleOrderData",
          JSON.stringify(expressModuleData),
        );
        localStorage.setItem("BusinessOrderSelection", "express");

        // Keep pricing quote in sessionStorage so the success page can render a
        // receipt even if localStorage is cleared during the Stripe redirect.
        const pricingCheckoutRaw =
          localStorage.getItem("dynamicPricingCheckout") ||
          sessionStorage.getItem("dynamicPricingCheckout");
        if (pricingCheckoutRaw) {
          sessionStorage.setItem("dynamicPricingCheckout", pricingCheckoutRaw);
        }

        const moduleAmount = Math.round(chargeAmount * 100);
        if (!moduleAmount || moduleAmount < 50) {
          addToast(
            "Payment amount could not be calculated. Please go back and try again.",
            { appearance: "error", autoDismiss: true },
          );
          return;
        }

        // Get product IDs for webhook processing
        const moduleOrderData = returnAPIProductsForOrder();
        const productIds = moduleOrderData?.products
          ?.map(
            (p) =>
              p.productId ||
              p.product?.id ||
              p.product ||
              p._id,
          )
          .filter(Boolean);

        // Determine product name based on payment mode
        let productName = "Module Payment (Setup + Current Monthly)";
        if (paymentMode === "payment") {
          productName =
            getDynamicPricingPaymentPlan() === "monthly"
              ? "Module Payment (Setup + First Month)"
              : "One-Time Payment (Full Amount)";
        } else if (paymentMode === "subscription") {
          productName = "Subscription Payment (Monthly)";
        }

        const response = await axios.post("/api/checkout_sessions", {
          paymentMode: paymentMode,
          items: [
            {
              price_data: {
                currency: cartItems?.currency || userData?.currency || "USD",
                product_data: {
                  name: productName,
                  images: [],
                  metadata: {
                    productId:
                      productIds?.length > 0 ? productIds[0] : undefined,
                    productIds: JSON.stringify(productIds),
                  },
                },
                unit_amount: moduleAmount,
              },
              quantity: 1,
            },
          ],
          address: userAddressData,
          total: chargeAmount,
          totalQuantity: localTotalQuantity,
          currency: returnCorrectCurrency(
            cartItems?.currency || userData?.currency,
          ),
          express: true,
          // Pass guest email for Stripe customer_email
          customerEmail: guestCheckoutEmail || userData?.user?.email,
          metadata: buildModuleCheckoutMetadata({
            moduleTotals,
            productIds,
            isGuestModuleCheckout,
            guestCheckoutLinkId,
            guestCheckoutPaymentPlan,
          }),
        });

        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error("No checkout URL received");
        }
        return;
      }

      // Handle regular module orders
      if (isModuleOrder && !express) {
        // Determine period based on payment mode
        const regularPeriod = paymentMode === "module" ? 1 : 12;
        const moduleTotals = getModuleOrderTotal(paymentMode);
        const chargeAmount = resolveModuleChargeAmount(moduleTotals);

        const moduleData = {
          isModulePurchase: true,
          period: regularPeriod,
          products: returnAPIProductsForOrder(),
          address: userAddressData,
          total: chargeAmount,
          paymentLogs: [],
          user: isDynamicPricingGuestFlow
            ? { email: guestCheckoutEmail }
            : { email: userData?.user?.email },
        };

        localStorage.setItem("modulepurchase", "true");
        localStorage.setItem("moduleOrderData", JSON.stringify(moduleData));
        localStorage.setItem("BusinessOrderSelection", "regular");
        const moduleAmount = Math.round(chargeAmount * 100);

        // Get product IDs for webhook processing
        const moduleOrderData = returnAPIProductsForOrder();
        const productIds = moduleOrderData?.products
          ?.map(
            (p) =>
              p.productId ||
              p.product?.id ||
              p.product ||
              p._id,
          )
          .filter(Boolean);

        // Determine product name based on payment mode
        let productName = "Module Payment (Setup + Current Monthly)";
        if (paymentMode === "payment") {
          productName =
            getDynamicPricingPaymentPlan() === "monthly"
              ? "Module Payment (Setup + First Month)"
              : "One-Time Payment (Full Amount)";
        } else if (paymentMode === "subscription") {
          productName = "Subscription Payment (Monthly)";
        }

        const response = await axios.post("/api/checkout_sessions", {
          paymentMode: paymentMode,
          items: [
            {
              price_data: {
                currency: cartItems?.currency || userData?.currency || "USD",
                product_data: {
                  name: productName,
                  images: [],
                  metadata: {
                    productId:
                      productIds?.length > 0 ? productIds[0] : undefined,
                    productIds: JSON.stringify(productIds),
                  },
                },
                unit_amount: moduleAmount,
              },
              quantity: 1,
            },
          ],
          address: userAddressData,
          total: chargeAmount,
          totalQuantity: localTotalQuantity,
          currency: returnCorrectCurrency(
            cartItems?.currency || userData?.currency,
          ),
          express: false,
          // Pass guest email for Stripe customer_email
          customerEmail: guestCheckoutEmail || userData?.user?.email,
          metadata: buildModuleCheckoutMetadata({
            moduleTotals,
            productIds,
            isGuestModuleCheckout,
            guestCheckoutLinkId,
            guestCheckoutPaymentPlan,
          }),
        });

        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error("No checkout URL received");
        }
        return;
      }

      // Handle non-module orders
      if (!isModuleOrder) {
        if (!window.location.search.includes("express=true")) {
          removeHiddenProducts();
        }

        if (
          cartItems?.couponData?.coupon &&
          !cartItems?.couponData?.stripePaymentCouponId
        ) {
          updateCartForStripe();
        }

        // Helper function to extract price from cart item (handles various structures)
        const getProductPrice = (item) => {
          // Try direct price first (some items store price at top level)
          if (item.price && item.price > 0) {
            console.log("Using item.price:", item.price);
            return item.price;
          }

          // Try nested product object with priceList array (normal products from API)
          if (item.product && typeof item.product === "object") {
            // Check priceList array
            if (
              Array.isArray(item.product.priceList) &&
              item.product.priceList.length > 0
            ) {
              // Try to match user's currency
              const userCurrency =
                cartItems?.currency || userData?.currency || "USD";
              const matchingPrice = item.product.priceList.find(
                (p) => p.currency === userCurrency,
              );
              if (matchingPrice && matchingPrice.price > 0) {
                console.log(
                  "Using priceList matching currency:",
                  matchingPrice.price,
                );
                return matchingPrice.price;
              }
              // Fallback to first price in list
              if (item.product.priceList[0]?.price > 0) {
                console.log(
                  "Using priceList[0].price:",
                  item.product.priceList[0].price,
                );
                return item.product.priceList[0].price;
              }
            }
            // Check direct price property on nested product
            if (item.product.price && item.product.price > 0) {
              console.log("Using item.product.price:", item.product.price);
              return item.product.price;
            }
          }

          console.warn("Could not find valid price for item:", item);
          return 0;
        };

        // Helper function to get product name
        const getProductName = (item) => {
          if (item.name) return item.name;
          if (
            item.product &&
            typeof item.product === "object" &&
            item.product.name
          )
            return item.product.name;
          return "Product";
        };

        // Helper function to get product images
        const getProductImages = (item) => {
          if (item.image && Array.isArray(item.image)) return item.image;
          if (item.thumbImage && Array.isArray(item.thumbImage))
            return item.thumbImage;
          if (item.product && typeof item.product === "object") {
            if (item.product.image && Array.isArray(item.product.image))
              return item.product.image;
            if (
              item.product.thumbImage &&
              Array.isArray(item.product.thumbImage)
            )
              return item.product.thumbImage;
          }
          return [];
        };

        console.log("=== NON-MODULE ORDER CHECKOUT DEBUG ===");
        console.log("Cart products:", cartItems.products);

        const stripeItems = cartItems.products.map((product) => {
          const price = getProductPrice(product);
          const name = getProductName(product);
          const images = getProductImages(product);
          const quantity = product.quantity || 1;

          console.log(
            `Product: ${name}, Price: ${price}, Quantity: ${quantity}`,
          );

          return {
            price_data: {
              currency: cartItems?.currency || userData?.currency || "USD",
              product_data: {
                name: name,
                images: images,
              },
              unit_amount: Math.round(price * 100),
            },
            quantity: quantity,
          };
        });

        console.log("Stripe items built:", stripeItems);

        // Apply coupon discount to Stripe checkout
        // Always use the discounted total directly in line items to avoid
        // Stripe environment mismatches (live vs test coupon IDs).
        const hasCoupon = !!cartItems?.couponData?.coupon;
        // Use nullish coalescing so a genuine $0 total is preserved
        const discountedTotal = hasCoupon
          ? (cartItems?.orderTotal ?? null)
          : null;
        const isFreeOrder =
          hasCoupon && discountedTotal !== null && discountedTotal <= 0;

        // Free order (100% coupon) — skip Stripe entirely and save the order directly
        if (isFreeOrder) {
          console.log(
            "Order total is $0 after coupon — bypassing Stripe and saving order directly",
          );
          const saveStripeInfo = returnAPIProductsForOrder();
          await saveOrder(saveStripeInfo);
          return;
        }

        let finalStripeItems = stripeItems;

        if (
          hasCoupon &&
          discountedTotal !== null &&
          discountedTotal < localTotal
        ) {
          // Replace all line items with a single consolidated item at the
          // post-discount total so Stripe charges exactly the right amount.
          const currency = cartItems?.currency || userData?.currency || "USD";
          finalStripeItems = [
            {
              price_data: {
                currency: currency,
                product_data: {
                  name: "Order Total (coupon applied)",
                  images: [],
                },
                unit_amount: Math.round(discountedTotal * 100),
              },
              quantity: 1,
            },
          ];
          console.log(
            "Coupon applied — using discounted total as single line item:",
            discountedTotal,
          );
        }

        const response = await axios.post("/api/checkout_sessions", {
          paymentMode:
            paymentMode === "subscription" ? "subscription" : "payment",
          items: finalStripeItems,
          email: userData?.user?.email || initialValues?.email || "",
          address: userAddressData,
          total: discountedTotal !== null ? discountedTotal : localTotal,
          totalQuantity: localTotalQuantity,
          currency: returnCorrectCurrency(
            cartItems?.currency || userData?.currency,
          ),
          express: express || false,
        });

        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error("No checkout URL received");
        }
        return;
      }

      // Fallback for module orders when express is undefined
      if (isModuleOrder && express === undefined) {
        // Determine period based on payment mode
        const fallbackPeriod = paymentMode === "module" ? 1 : 12;
        const moduleTotals = getModuleOrderTotal(paymentMode);
        const chargeAmount = resolveModuleChargeAmount(moduleTotals);

        const fallbackModuleData = {
          isModulePurchase: true,
          period: fallbackPeriod,
          products: returnAPIProductsForOrder(),
          address: userAddressData,
          total: chargeAmount,
          paymentLogs: [],
          user: isDynamicPricingGuestFlow
            ? { email: guestCheckoutEmail }
            : { email: userData?.user?.email },
        };

        localStorage.setItem("modulepurchase", "true");
        localStorage.setItem(
          "moduleOrderData",
          JSON.stringify(fallbackModuleData),
        );
        localStorage.setItem("BusinessOrderSelection", "fallback");
        const moduleAmount = Math.round(chargeAmount * 100);

        // Get product IDs for webhook processing
        const moduleOrderData = returnAPIProductsForOrder();
        const productIds = moduleOrderData?.products
          ?.map(
            (p) =>
              p.productId ||
              p.product?.id ||
              p.product ||
              p._id,
          )
          .filter(Boolean);

        // Determine product name based on payment mode
        let productName = "Module Payment (Setup + Current Monthly)";
        if (paymentMode === "payment") {
          productName =
            getDynamicPricingPaymentPlan() === "monthly"
              ? "Module Payment (Setup + First Month)"
              : "One-Time Payment (Full Amount)";
        } else if (paymentMode === "subscription") {
          productName = "Subscription Payment (Monthly)";
        }

        const response = await axios.post("/api/checkout_sessions", {
          paymentMode: paymentMode,
          items: [
            {
              price_data: {
                currency: cartItems?.currency || userData?.currency || "USD",
                product_data: {
                  name: productName,
                  images: [],
                  metadata: {
                    productId:
                      productIds?.length > 0 ? productIds[0] : undefined,
                    productIds: JSON.stringify(productIds),
                  },
                },
                unit_amount: moduleAmount,
              },
              quantity: 1,
            },
          ],
          address: userAddressData,
          total: chargeAmount,
          totalQuantity: localTotalQuantity,
          currency: returnCorrectCurrency(
            cartItems?.currency || userData?.currency,
          ),
          express: false,
          // Pass guest email for Stripe customer_email
          customerEmail: guestCheckoutEmail || userData?.user?.email,
          metadata: buildModuleCheckoutMetadata({
            moduleTotals,
            productIds,
            isGuestModuleCheckout,
            guestCheckoutLinkId,
            guestCheckoutPaymentPlan,
          }),
        });

        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error("No checkout URL received");
        }
        return;
      }
    } catch (error) {
      console.error("Payment processing error:", error);

      let errorMessage = "Payment processing failed. Please try again.";

      if (error.code === "NETWORK_ERROR") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.code === "TIMEOUT_ERROR") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.status === 400) {
        errorMessage =
          "Invalid request. Please check your details and try again.";
      } else if (error.response?.status === 404) {
        errorMessage = "Service not found. Please contact support.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. Please check your permissions.";
      }

      addToast(errorMessage, {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleChangeValue = (e) => {
    if (
      e.target.name !== "country" &&
      e.target.name !== "state" &&
      e.target.name !== "city"
    ) {
      setInitialValues({
        ...initialValues,
        [e.target.name]: e.target.value,
      });
    }
    setIsError({ ...isError, [e.target.name]: "" });
    if (e.target.name === "country") {
      const { isoCode, name } = e.target.value && JSON.parse(e.target.value);
      const statesList = State.getStatesOfCountry(isoCode);
      setCityList([]);
      setStateList(statesList);
      setInitialValues({
        ...initialValues,
        country: name,
        state: "",
        city: "",
      });
    }
    if (e.target.name === "state") {
      const { isoCode, countryCode, name } =
        e.target.value && JSON.parse(e.target.value);
      const cities = City.getCitiesOfState(countryCode, isoCode);
      setCityList(cities);
      setInitialValues({
        ...initialValues,
        state: name,
        countryCode,
        stateCode: isoCode,
        city: "",
      });
    }
    if (e.target.name === "city") {
      const city = JSON.parse(e.target.value).name;
      setInitialValues({
        ...initialValues,
        city,
      });
    }
  };

  const handleSetPhoneInfo = () => {};

  const validate = (values, isFormSubmitted) => {
    let errors = {};
    if (!values.firstName) {
      errors.firstName = "First Name is Required";
    }
    if (!values.lastName) {
      errors.lastName = "Last Name is Required";
    }
    if (!values.email && userData?.isLoggedIn) {
      errors.email = "Email is Required";
    }

    // if (!values?.phoneInfo?.number) {
    //   errors.phone = "Phone is Required";
    // }
    if (!values.streetAddressOne) {
      errors.streetAddressOne = "Address is Required";
    }
    if (!values.city) {
      errors.city = "City is Required";
    }
    if (!values.state) {
      errors.state = "State is Required";
    }
    if (!values.country) {
      errors.country = "Country is Required";
    }
    if (!values.mailcode) {
      errors.mailcode = "Zip Code/Pin Code is Required";
    }
    if (isFormSubmitted && !values.termsAndConditions)
      errors.termsAndConditions = "Agreement to terms of service is required";

    if (
      !validatePhoneNumber(
        initialValues.phoneInfo?.numericCode + initialValues.phoneInfo?.number,
      )
    )
      errors.phone = "Enter a valid phone number";

    return errors;
  };

  const handleFocus = (e) => {
    const validation = validate(initialValues, false);
    setIsError(validation);
    setIsFocus({ ...isFocus, [e.target.name]: true });
  };

  const removeErrorMessage = () => {
    setIsFocus({});
    setIsError({});
  };

  const handleShowCurrency = (e) => {
    e.preventDefault();
    // if (!userData?.isLoggedIn) {
    //   setOrigin('change-currency')
    //   return setShowLoginPopup(true)
    // }
    setShowCurrencyOverlay(true);
  };

  const handleKeyPressSubmit = async (e) => {
    if (e?.key == "Enter") {
      await handleSubmit(e, false);
    }
  };

  const handleCouponKeyPress = async (e) => {
    if (e?.key == "Enter") {
      await handleApplyCoupon(e);
    }
  };

  const handlePhoneInfoChange = (values) => {
    setInitialValues({
      ...initialValues,
      phoneInfo: values,
    });
    setIsError(() => {
      delete isError.phone;
      return isError;
    });
  };

  const checkoutPage = () => (
    <Container>
      {(cartItems?.products && cartItems?.products?.length >= 1) ||
      (cartItems?.moduleProducts && cartItems?.moduleProducts?.length >= 1) ||
      cartItems?.hiddenProducts.length >= 1 ? (
        <div className="lezada-form">
          <form
            className="checkout-form"
            onKeyDown={(e) => e?.key == "Enter" && e.preventDefault()}
          >
            <div className="checkout--main">
              <div className="space-mb--20">
                {/* Billing Address */}
                <div id="billing-form" className="space-mb--40">
                  {/* <h4 className="checkout-title" style={{ display: userData?.user?.firstName ? "" : "none" }}>User Details</h4> */}
                  {/* <div className="each--address--row--checkout " style={{ display: userData?.user?.firstName ? "flex" : "none" }}>
                    <div className="space-mb--20 w-100" style={{ marginBottom: "34px" }}>
                      <label>First Name</label>
                      <p>{userData?.user?.firstName}</p>
                    </div>
                    <div className="space-mb--20 w-100" style={{ marginBottom: "34px" }}>
                      <label>Last Name</label>
                      <p>{userData?.user?.lastName}</p>
                    </div>
                  </div> */}
                  <h4 className="checkout-title">Your Address</h4>
                  <div className="">
                    <div className="d-flex each--address--row--checkout ">
                      <div className="space-mb--20 w-100">
                        <label>First Name*</label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          placeholder="First Name"
                          value={initialValues.firstName}
                          onBlur={handleFocus}
                          onChange={handleChangeValue}
                          onKeyDown={handleKeyPressSubmit}
                          // error
                          // helperText={isError.firstName}
                        />
                        {isFocus.firstName && isError.firstName ? (
                          <p className="error-msg">{isError.firstName}</p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="space-mb--20 w-100">
                        <label>Last Name*</label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          placeholder="Last Name"
                          value={initialValues.lastName}
                          onBlur={handleFocus}
                          onChange={handleChangeValue}
                          onKeyDown={handleKeyPressSubmit}
                          // error
                          // helperText={isError.lastName}
                        />
                        {isFocus.lastName && isError.lastName ? (
                          <p className="error-msg">{isError.lastName}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="d-flex each--address--row--checkout">
                      <div
                        className="space-mb--20 w-100"
                        onClick={emailhandler}
                      >
                        <label>Email Address*</label>
                        <input
                          id="email"
                          name="email"
                          placeholder="Email *"
                          type="email"
                          value={initialValues.email}
                          onBlur={handleFocus}
                          onChange={handleChangeValue}
                          onKeyDown={handleKeyPressSubmit}
                          readOnly={
                            !(
                              router.query.dynamicPricing === "true" &&
                              router.query.linkId &&
                              !userData?.isLoggedIn
                            )
                          }
                          // error
                          // helperText={isError.email}
                        />
                        {isFocus.email && isError.email ? (
                          <p className="error-msg">{isError.email}</p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="space-mb--20 w-100">
                        <label>Phone no*</label>
                        <PhoneInput
                          number={`${initialValues.phoneInfo?.numericCode || ""}${initialValues.phoneInfo?.number || ""}`}
                          handleChangeValue={() => ""}
                          handleOnBlur={handleFocus}
                          country={"us"}
                          name={"phone"}
                          handleKeyPressSubmit={handleKeyPressSubmit}
                          setPhoneInfo={handlePhoneInfoChange}
                        />
                        {/* <input
                            type="text"
                            name="phone"
                            placeholder="Phone number"
                            value={initialValues.phone}
                            onBlur={handleFocus}
                            onChange={handleChangeValue}
                            onKeyDown={handleKeyPressSubmit}
                            // error
                            // helperText={isError.phone}
                          /> */}
                        {isError.phone && isFocus?.phone ? (
                          <p className="error-msg">{isError.phone}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="space-mb--20">
                      <label>Company Name</label>
                      <input
                        onKeyDown={handleKeyPressSubmit}
                        type="text"
                        name="companyName"
                        value={initialValues.companyName}
                        onBlur={handleFocus}
                        onChange={handleChangeValue}
                        placeholder="Company Name"
                      />
                      {isFocus.companyName && isError.companyName ? (
                        <p className="error-msg">{isError.companyName}</p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="space-mb--20">
                      <label>Address*</label>
                      <input
                        type="text"
                        name="streetAddressOne"
                        id="streetAddressOne"
                        placeholder="Street Address 1 *"
                        value={initialValues.streetAddressOne}
                        onBlur={handleFocus}
                        onChange={handleChangeValue}
                        onKeyDown={handleKeyPressSubmit}
                        // error
                        // helperText={isError.streetAddressOne}
                      />
                      {isFocus.streetAddressOne && isError.streetAddressOne ? (
                        <p className="error-msg">{isError.streetAddressOne}</p>
                      ) : (
                        ""
                      )}
                      <input
                        type="text"
                        name="streetAddressTwo"
                        id="streetAddressTwo"
                        placeholder="Street Address 2"
                        value={initialValues.streetAddressTwo}
                        onBlur={handleFocus}
                        onChange={handleChangeValue}
                        onKeyDown={handleKeyPressSubmit}
                        // error
                        // helperText={isError.streetAddressTwo}
                      />
                      {/* {isFocus.streetAddressTwo && isError.streetAddressTwo ? (
                                                            <p className="error-msg">{isError.streetAddressTwo}</p>
                                                        ) : ""} */}
                    </div>
                    <div className="d-flex each--address--row--checkout">
                      <div className="space-mb--20 w-100">
                        <label>Country*</label>
                        <select
                          name="country"
                          placeholder="Country *"
                          onChange={handleChangeValue}
                          // onFocus={handleFocus}
                          id="country"
                          value={initialValues.country}
                          onKeyDown={handleKeyPressSubmit}
                          // error
                          // helperText={isError.country}
                        >
                          <option
                            value={initialValues.country}
                            selected
                            defaultValue=""
                          >
                            {initialValues.country
                              ? initialValues.country
                              : "Country"}
                          </option>
                          {allCountryList.length > 0 ? (
                            allCountryList.map((country, index) => (
                              <option
                                value={JSON.stringify(country)}
                                key={index}
                              >
                                {" "}
                                {country.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No Country
                            </option>
                          )}
                        </select>
                        {isFocus.country && isError.country ? (
                          <p className="error-msg">{isError.country}</p>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="space-mb--20 w-100">
                        <label>Town/City*</label>
                        <select
                          name="city"
                          placeholder="city *"
                          onChange={handleChangeValue}
                          onKeyDown={handleKeyPressSubmit}
                          disabled={initialValues.state == "" ? true : false}
                          // onFocus={handleFocus}
                          id="city"
                          title={
                            initialValues?.state == ""
                              ? "Please Select State first"
                              : ""
                          }
                          value={initialValues?.city}

                          // value={initialValues.city}
                          // error
                          // helperText={isError.city}
                        >
                          {initialValues?.city && (
                            <option value="" selected defaultValue="">
                              {initialValues.city}
                            </option>
                          )}
                          {!initialValues?.city && (
                            <option value="" defaultValue="" disabled hidden>
                              Town/City
                            </option>
                          )}
                          {cityList.length > 0 ? (
                            cityList.map((city, index) => (
                              <option value={JSON.stringify(city)} key={index}>
                                {" "}
                                {city.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              {initialValues.country == "" &&
                              initialValues.state == ""
                                ? "Please Select the Country and State."
                                : initialValues.country &&
                                    initialValues.state == ""
                                  ? "Please Select the State."
                                  : initialValues.country &&
                                      initialValues.state &&
                                      cityList.length === 0
                                    ? `No Town/City found`
                                    : null}
                            </option>
                          )}
                        </select>
                        {isFocus.city && isError.city ? (
                          <p className="error-msg">{isError.city}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="d-flex each--address--row--checkout">
                      <div className="space-mb--20 w-100">
                        <label>State*</label>
                        <select
                          name="state"
                          placeholder="State *"
                          onChange={handleChangeValue}
                          onKeyDown={handleKeyPressSubmit}
                          // onFocus={handleFocus}
                          id="state"
                          value={initialValues.state}
                        >
                          {initialValues.state && (
                            <option value="" defaultValue="">
                              {initialValues.state}
                            </option>
                          )}
                          {!initialValues.state && (
                            <option value="" defaultValue="" disabled hidden>
                              State
                            </option>
                          )}
                          {stateList.length > 0 ? (
                            stateList.map((state, index) => (
                              <option value={JSON.stringify(state)} key={index}>
                                {" "}
                                {state.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              {initialValues.country == ""
                                ? "Please Select the Country."
                                : initialValues.country &&
                                    stateList.length === 0
                                  ? `No State's found`
                                  : null}
                            </option>
                          )}
                        </select>
                        {isFocus.state && isError.state ? (
                          <p className="error-msg">{isError.state}</p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="space-mb--20 w-100">
                        <label>Zip Code/Pin Code*</label>
                        <input
                          name="mailcode"
                          id="mailcode"
                          placeholder="Zip Code/Pin Code"
                          type="text"
                          onKeyDown={handleKeyPressSubmit}
                          value={initialValues.mailcode}
                          onBlur={handleFocus}
                          onChange={handleChangeValue}
                          // error
                          // helperText={isError.mailcode}
                        />
                        {isFocus.mailcode && isError.mailcode ? (
                          <p className="error-msg">{isError.mailcode}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="checkout-cards">
                  <div className="end-images">
                    <img
                      src="/assets/images/stripe-image.svg"
                      alt="stripe-safe-checkout"
                      className="stripe-img"
                      onClick={() =>
                        window.open(
                          "https://stripe.com/en-in/payments",
                          "_blank",
                        )
                      }
                    />
                  </div>
                  <div className="end-images">
                    <div className="end-left-images">
                      <img
                        src="/assets/images/TrustedSiteImg.svg"
                        className="safe-img"
                        onClick={() =>
                          window.open(
                            "https://www.trustedsite.com/certifications",
                            "_blank",
                          )
                        }
                      />
                      {/* <img
                      src="/assets/images/safe-checkout-image.svg"
                      className="safe-img top-margin"
                      onClick={()=>window.open("https://trustlock.co","_blank")}
                    /> */}
                    </div>
                    <div className="end-right-images">
                      <img
                        src="/assets/images/goDaddyImg.svg"
                        className="safe-right-img"
                        onClick={() =>
                          window.open(
                            "https://www.godaddy.com/en-in/ssl-checker",
                            "_blank",
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* </div> */}
              <div className="checkout--right-side-holder">
                <div className="">
                  {/* Cart Total */}
                  <div className="space-mb--50">
                    <h4 className="checkout-title">Cart Total</h4>

                    <CartSummary
                      cartItems={cartItems}
                      localTotalQuantity={localTotalQuantity}
                      localTotal={localTotal}
                      setLocalTotalQuantity={setLocalTotalQuantity}
                      setLocalTotal={setLocalTotal}
                      getCouponText={getCouponText}
                      addCoupon={addCoupon}
                      saveCoupon={saveCoupon}
                      couponCode={couponCode}
                      addAPIDataToCart={addAPIDataToCart}
                      express={express}
                      setCurrencyChangeInProgress={setCurrencyChangeInProgress}
                      updateCartForCurrency={updateCartForCurrency}
                      setUserCurrencyForce={setUserCurrencyForce}
                      setShowCurrencyOverlay={setShowCurrencyOverlay}
                      setUserCurrencyPreference={setUserCurrencyPreference}
                      setCartCurrency={setCartCurrency}
                      userData={userData}
                      currencySymbol={currencySymbol}
                      addExpressPriceData={addExpressPriceData}
                      currencyCode={currencyCode}
                      setCurrencyCode={setCurrencyCode}
                      handleShowCurrency={handleShowCurrency}
                      showCurrencyOverlay={showCurrencyOverlay}
                      showChangeCurrency={true}
                      isModuleOrder={isModuleOrder}
                    />
                  </div>

                  <div
                    className="space-mb--50"
                    style={{
                      display: isModuleOrder ? "none" : "",
                    }}
                  >
                    <div className="checkout-cart-total checkout-cart-coupon-holder--outer">
                      <div className="checkout-cart-coupon-holder">
                        <h4
                          className="checkout-title"
                          style={{ marginLeft: "0px" }}
                        >
                          Apply coupon
                        </h4>
                        <div className="checkout--coupon-button-holder">
                          <div className="coupon--input--svg--holder">
                            <input
                              placeholder="Enter coupon"
                              onChange={(e) => setCouponCode(e.target.value)}
                              disabled={applyCouponPressed}
                              value={refferalCheck ? "REFFERAL" : couponCode}
                              onKeyDown={handleCouponKeyPress}
                            />
                            <svg
                              style={{ display: refferalCheck ? "none" : "" }}
                              onClick={() => unApplyCoupon()}
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 18 18"
                            >
                              <path
                                fill="#333"
                                fillRule="evenodd"
                                d="M8.152 1.728a.864.864 0 00-.773.477l-.625 1.25H3.833a.864.864 0 100 1.728v8.639c0 .954.773 1.727 1.727 1.727h6.911c.954 0 1.728-.773 1.728-1.727V5.183a.864.864 0 100-1.728h-2.922l-.625-1.25a.864.864 0 00-.772-.477H8.152zM6.424 6.91a.864.864 0 011.728 0v5.183a.864.864 0 11-1.728 0V6.91zm4.32-.864a.864.864 0 00-.864.864v5.183a.864.864 0 001.727 0V6.91a.864.864 0 00-.864-.864z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>

                          <button
                            disabled={applyCouponPressed}
                            onClick={handleApplyCoupon}
                          >
                            {!applyCouponPressed ? "APPLY" : buttonSpinner}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <h4 className="checkout-title">Payment Option</h4>

                    {/* Payment Structure Explanation - Only show for module orders */}
                    {isModuleOrder && (
                      <div
                        className="payment-explanation"
                        style={{
                          backgroundColor: "#f8f9fa",
                          padding: "20px",
                          borderRadius: "8px",
                          marginBottom: "20px",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <h5
                          style={{
                            color: "#333",
                            marginBottom: "15px",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          💡 Understanding Your Payment Options
                        </h5>

                        <div
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.6",
                            color: "#555",
                          }}
                        >
                          <p style={{ marginBottom: "10px" }}>
                            <strong>1 TIME PAYMENT:</strong> Pay the full amount
                            today including 12 months of additional units
                            upfront. ($60 + $0.50 × 3 × 12 = $78.00)
                          </p>
                          <p style={{ marginBottom: "10px" }}>
                            <strong>12 SUBSCRIPTION PAYMENTS:</strong> Pay
                            monthly for 12 months. The total one-time amount is
                            divided by 12 for equal monthly payments. ($78.00 ÷
                            12 = $6.50/month)
                          </p>
                          <p style={{ marginBottom: "0" }}>
                            <strong>MODULE PAYMENT:</strong> Pay the module cost
                            + current monthly additional units now, then only
                            the additional units monthly. ($60 + $1.50 = $61.50
                            now, $1.50 monthly)
                          </p>
                        </div>

                        <div
                          style={{
                            padding: "12px",
                            marginTop: "8px",
                            backgroundColor: "#e3f2fd",
                            borderRadius: "6px",
                            border: "1px solid #bbdefb",
                          }}
                        >
                          <small
                            style={{ color: "#1976d2", fontStyle: "italic" }}
                          >
                            <strong>Example:</strong> For a $60 module + $0.50
                            additional items × 3 quantity order: One-time = $60
                            + ($0.50 × 3 × 12) = $78.00, Monthly = $6.50, Module
                            = $61.50 now + $1.50 monthly
                          </small>
                        </div>
                      </div>
                    )}
                    <div className="checkout-payment-method space-mb--50">
                      <div className="single-method radio-group">
                        <input
                          type="radio"
                          id="payment_check"
                          name="payment-option"
                          defaultValue="payment"
                          defaultChecked={true}
                          onChange={() => paymentOptionChange("payment")}
                        />
                        {(() => {
                          const totals = getModuleOrderTotal("payment");
                          console.log(
                            "Payment option 1 - oneTimeTotal:",
                            totals.oneTimeTotal,
                            "originalOneTimeTotal:",
                            totals.originalOneTimeTotal,
                            "discountValue:",
                            totals.discountValue,
                          );
                          const currency = express
                            ? cartItems?.currency || userData?.currency
                            : currencyCode ||
                              cartItems?.currency ||
                              userData?.currency;
                          const hasDiscount =
                            totals.discountValue && totals.discountValue > 0;
                          return (
                            <label htmlFor="payment_check">
                              1 time Payment: Pay {currency}{" "}
                              {hasDiscount ? (
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#999",
                                    marginRight: "8px",
                                  }}
                                >
                                  {currencySymbol}
                                  {formatCurrency(
                                    totals.originalOneTimeTotal?.toFixed(2) ||
                                      localTotal,
                                    currency,
                                  )}
                                </span>
                              ) : null}
                              {currencySymbol}
                              {formatCurrency(
                                totals.oneTimeTotal?.toFixed(2) || localTotal,
                                currency,
                              )}{" "}
                              today
                              {hasDiscount ? (
                                <span
                                  style={{
                                    color: "#28a745",
                                    fontSize: "12px",
                                    marginLeft: "8px",
                                  }}
                                >
                                  (Save{" "}
                                  {totals.discountType === "percentage"
                                    ? `${totals.discount}%`
                                    : `${currencySymbol}${formatCurrency(totals.discountValue?.toFixed(2), currency)}`}
                                  )
                                </span>
                              ) : null}
                            </label>
                          );
                        })()}
                      </div>
                      <div className="single-method radio-group">
                        <input
                          type="radio"
                          id="payment_bank"
                          name="payment-option"
                          defaultValue="bank"
                          onChange={() => paymentOptionChange("subscription")}
                        />
                        {express ? (
                          <label htmlFor="payment_bank">
                            12 Subscription payments of{" "}
                            {cartItems?.currency || userData?.currency}{" "}
                            {currencySymbol}
                            {formatCurrency(
                              getModuleOrderTotal(
                                "subscription",
                              ).subscriptionTotal?.toFixed(2) ||
                                localTotal / 12,
                              cartItems?.currency || userData?.currency,
                            )}{" "}
                            Per Month: Pay{" "}
                            {cartItems?.currency || userData?.currency}{" "}
                            {currencySymbol}
                            {formatCurrency(
                              getModuleOrderTotal(
                                "subscription",
                              ).subscriptionTotal?.toFixed(2) ||
                                localTotal / 12,
                              cartItems?.currency || userData?.currency,
                            )}{" "}
                            Today
                          </label>
                        ) : (
                          <label htmlFor="payment_bank">
                            12 Subscription payments of{" "}
                            {currencyCode ||
                              cartItems?.currency ||
                              userData?.currency}{" "}
                            {currencySymbol}
                            {formatCurrency(
                              getModuleOrderTotal(
                                "subscription",
                              ).subscriptionTotal?.toFixed(2) ||
                                localTotal / 12,
                              cartItems?.currency || userData?.currency,
                            )}{" "}
                            Per Month: Pay{" "}
                            {currencyCode ||
                              cartItems?.currency ||
                              userData?.currency}{" "}
                            {currencySymbol}
                            {formatCurrency(
                              getModuleOrderTotal(
                                "subscription",
                              ).subscriptionTotal?.toFixed(2) ||
                                localTotal / 12,
                              cartItems?.currency || userData?.currency,
                            )}{" "}
                            Today
                          </label>
                        )}
                      </div>
                      <div
                        className="single-method radio-group"
                        style={{
                          display: isModuleOrder ? "" : "none",
                        }}
                      >
                        <input
                          type="radio"
                          id="payment_module"
                          name="payment-option"
                          defaultValue="module"
                          onChange={() => paymentOptionChange("module")}
                        />
                        {(() => {
                          const totals = getModuleOrderTotal("module");
                          console.log(
                            "Payment option 3 - oneTimeTotal:",
                            totals.oneTimeTotal,
                            "originalOneTimeTotal:",
                            totals.originalOneTimeTotal,
                            "discountValue:",
                            totals.discountValue,
                          );
                          const currency = express
                            ? cartItems?.currency || userData?.currency
                            : currencyCode ||
                              cartItems?.currency ||
                              userData?.currency;
                          const hasDiscount =
                            totals.discountValue && totals.discountValue > 0;
                          return (
                            <label htmlFor="payment_module">
                              Module Payment: Pay {currency}{" "}
                              {hasDiscount ? (
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#999",
                                    marginRight: "8px",
                                  }}
                                >
                                  {currencySymbol}
                                  {formatCurrency(
                                    totals.originalOneTimeTotal?.toFixed(2) ||
                                      localTotal,
                                    currency,
                                  )}
                                </span>
                              ) : null}
                              {currencySymbol}
                              {formatCurrency(
                                totals.oneTimeTotal?.toFixed(2) || localTotal,
                                currency,
                              )}{" "}
                              now
                              {hasDiscount ? (
                                <span
                                  style={{
                                    color: "#28a745",
                                    fontSize: "12px",
                                    marginLeft: "4px",
                                  }}
                                >
                                  (Save{" "}
                                  {totals.discountType === "percentage"
                                    ? `${totals.discount}%`
                                    : `${currencySymbol}${formatCurrency(totals.discountValue?.toFixed(2), currency)}`}
                                  )
                                </span>
                              ) : null}
                              , {currency} {currencySymbol}
                              {formatCurrency(
                                totals.subscriptionTotal?.toFixed(2) ||
                                  localTotal,
                                currency,
                              )}{" "}
                              monthly
                            </label>
                          );
                        })()}
                      </div>
                      {isPaymentModeErrorMsg ? (
                        <p className="error-msg">
                          Please Select the Payment Option.
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="">
                    <h4 className="checkout-title">Payment Method</h4>
                    <div className="checkout-payment-method">
                      <div className="single-method">
                        <input
                          type="radio"
                          id="stripe"
                          name="payment-method"
                          defaultValue="bank"
                          defaultChecked={true}
                          onClick={handeStripeOpen}
                        />
                        <label htmlFor="stripe">Stripe</label>
                      </div>
                      <div className="single-method">
                        <input
                          type="checkbox"
                          id="accept_terms"
                          name="termsAndConditions"
                          checked={initialValues.termsAndConditions}
                          onChange={(e) => {
                            setIsError({ ...isError, [e.target.name]: "" });
                            setInitialValues((prevValues) => ({
                              ...prevValues,
                              termsAndConditions:
                                !prevValues.termsAndConditions,
                            }));
                          }}
                        />
                        <label htmlFor="accept_terms" className="termsCheckbox">
                          I agree to the{" "}
                          <span
                            onClick={(e) => {
                              window.open(
                                process.env.NEXT_PUBLIC_UI_URL + `/terms`,
                                "_blank",
                              );
                            }}
                            style={{ display: "inline" }}
                          >
                            terms of services
                          </span>{" "}
                          and{" "}
                          <span
                            onClick={(e) => {
                              window.open(
                                process.env.NEXT_PUBLIC_UI_URL + `/privacy`,
                                "_blank",
                              );
                            }}
                            style={{ display: "inline" }}
                          >
                            privacy policy
                          </span>
                        </label>
                      </div>
                      {isError.termsAndConditions ? (
                        <p className="error-msg">
                          {isError.termsAndConditions}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <button
                      className="checkout--change-currency place--order--button"
                      onClick={handleSubmit}
                      style={{ marginTop: 25 }}
                      disabled={applyCouponPressed || isPaymentLoading}
                    >
                      Place order{" "}
                      <span>
                        {isPaymentLoading && (
                          <Spinner size="sm" animation="border" />
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <Row>
          <Col>
            <div className="item-empty-area text-center">
              <div className="item-empty-area__icon space-mb--30">
                <IoMdCash />
              </div>
              <div className="item-empty-area__text">
                <p className="space-mb--30">
                  No items found in cart to checkout
                </p>
                <Link
                  onClick={() => localStorage.removeItem("modulepurchase")}
                  href="/shop/left-sidebar"
                  as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                >
                  <a className="lezada-button lezada-button--medium">
                    Shop Now
                  </a>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );

  return <>{reRender ? checkoutPage() : checkoutPage()}</>;
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    userData: state.userData,
    orderData: state.orderData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addOrder: (isOrder, item) => {
      dispatch(addOrder(isOrder, item));
    },
    updateCartForCurrency: (currency, origin, data) => {
      dispatch(updateCartForCurrency(currency, origin, data));
    },
    setUserEmail: (email) => {
      dispatch(setUserEmail(email));
    },
    setUserCurrencyPreference: (type, currency) => {
      dispatch(setUserCurrencyPreference(type, currency));
    },
    updateCartForStripe: (currency) => {
      dispatch(updateCartForStripe(currency));
    },
    addExpressPriceData: (data) => {
      dispatch(addExpressPriceData(data));
    },
    removeHiddenProducts: () => {
      dispatch(removeHiddenProducts());
    },
    deleteAllFromCart: () => {
      dispatch(deleteAllFromCart());
    },
    setCartCurrency: (currency) => {
      dispatch(setCartCurrency(currency));
    },
    addAPIDataToCart: (
      product,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize,
      cartItems,
    ) => {
      dispatch(
        addAPIDataToCart(
          product,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize,
          cartItems,
        ),
      );
    },
    validateUser: () => {
      dispatch(validateUser());
    },
    removeCoupon: (subTotal, total, orderTotalWithinStripeRange) => {
      dispatch(removeCoupon(subTotal, total, orderTotalWithinStripeRange));
    },
    addCoupon: (
      type,
      coupon,
      discount,
      subTotal,
      total,
      discountUnit,
      stripeCode,
      name,
    ) => {
      dispatch(
        addCoupon(
          type,
          coupon,
          discount,
          subTotal,
          total,
          discountUnit,
          stripeCode,
          name,
        ),
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm);
