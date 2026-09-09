import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { Spinner } from "react-bootstrap";
import sampleQRCode from "../../assets/images/qr.svg";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { saveStripeCheckout } from "src/apiClient/orders";
import { addOrder } from "src/redux/actions/orderActions";
import { useToasts } from "react-toast-notifications";
import { getOrderPdf } from "src/apiClient/orders";
import { getAllOrders } from "src/apiClient/orders";
import { getOrderByCheckoutSession } from "src/apiClient/orders";
import {
  deleteAllFromCart,
  removeExpressItemAddedToCart,
  removeHiddenProducts,
} from "src/redux/actions/cartActions";
import regionPrice from "./../../helpers/regionPrice";
import { deleteCoupon } from "src/redux/actions/couponActions";
import { validateUser, validateUserFast } from "src/redux/actions/userAction";
import {
  getFormattedDate,
  getFormattedTime,
  returnOneYearForwardDate,
} from "src/helpers/formatDateTime";
import formatCurrency from "src/helpers/formatCurrency";
import { QRCode } from "react-qrcode-logo";
import { connect } from "react-redux";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  All,
} from "react-share";
import {
  getCompanyAddress,
  updateCompanyAddress,
} from "src/apiClient/companyAddress";
import { runValidateUserProcessSync } from "src/helpers/currencyActionHelper";
import getCouponText from "src/components/helpers/getCouponText";
import { unApplyCouponToAPI } from "src/apiClient/coupon";
import { BsCloudDownload } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import axios from "axios";
// import { SlBadge } from "react-icons/sl";

const NewSuccess = ({
  cartItems,
  orderData,
  addOrder,
  deleteAllFromCart,
  userData,
  deleteCoupon,
  removeHiddenProducts,
  removeExpressItemAddedToCart,
  validateUser,
  validateUserFast,
}) => {
  const Router = useRouter();
  const [isOrderLoaded, setIsOrderLoaded] = useState(false);
  const { addToast } = useToasts();
  const [order, setOrder] = useState({});
  const [qrCode, setQrCode] = useState("");
  const [quoteURL, setQuoteURL] = useState("/c/");
  const [pdfFilePath, setPdfFilePath] = useState(null);
  const [currency, setCurrency] = useState("");
  const [discount, setDiscount] = useState("");
  const [companyAddress, setCompanyAddress] = useState({});
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  // Track module flow explicitly so UI can hide share/QR for module purchases
  const [isModuleFlow, setIsModuleFlow] = useState(false);
  // Track guest checkout flow
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

  const [linkHovered, setLinkHovered] = useState(false);

  let totalProductCount = 0;

  const handleSuccess = async () => {
    const isModuleOrder =
      localStorage.getItem("modulepurchase") === "true" ||
      !!localStorage.getItem("moduleOrderData") ||
      Router.query.moduleOrder === "true";
    console.log("handleSuccess called, isModuleOrder:", isModuleOrder);
    console.log("orderData:", orderData);
    
    // Always prioritize module order flow to avoid stale regular order data blocking it
    if (isModuleOrder) {
      // Mark module flow active so UI hides slug-dependent sections
      setIsModuleFlow(true);
      console.log("Processing module order...");
      try {
        // For module orders, we need to get the order from the API
        // since they don't go through the regular Stripe checkout flow
        await handleModuleOrder();
      } catch (err) {
        console.log("an error occurred while processing module order", err);
        // Set order loaded to prevent infinite loading
        setIsOrderLoaded(true);
      }
      return;
    }
    
    // If not a module order but redux already holds an order, process it as regular
    if (orderData?.order?.data) {
      console.log("Order data exists, processing regular order:", orderData);
      orderData?.order?.data?.isBusinessOrder
        ? setQuoteURL("/b/")
        : setQuoteURL("/c/");
      setOrder(orderData.order);
      orderData.order?.slug &&
        getQRCode(
          process.env.NEXT_PUBLIC_UI_URL + quoteURL + orderData.order?.slug
        );
      console.log("Setting order as loaded for regular order");
      return setIsOrderLoaded(true);
    }
    
    // For regular orders, use the existing Stripe session handling
    console.log("Processing regular order with Stripe session...");
    try {
      await handleStripeSession();
    } catch (err) {
      console.log("an error occurred while checking out with stripe", err);
    }
  };

  useEffect(() => {
    axios
      .get(`https://wp.marketsverse.com/wp-json/wp/v2/socialmessage`)
      .then((res) => {});
  }, []);

  const getCompanyAddressHandler = async () => {
    try {
      // Wait for the auth cookie before calling, otherwise the request 401s
      // and the seller/company info block renders empty.
      const jwtReady = await waitForJWTToken(5000);
      // Guests never get a token here; calling anyway 401s, which signs them
      // out and redirects away from their receipt.
      if (!jwtReady) return;
      const res = await getCompanyAddress();
      setCompanyAddress(res?.data?.data || {});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(async () => {
    getCompanyAddressHandler();
  }, []);

  useEffect(() => {
    if (!orderData?.order?.data?._id) return;
    localStorage.removeItem("BusinessOrderSelection");
    localStorage.removeItem("modulepurchase");
    localStorage.removeItem("checkoutCartBackup"); // Clean up cart backup
    // Guest (dynamic pricing) buyers have no JWT yet — these endpoints require
    // one, and a 401 would sign them out and bounce them to the login page.
    if (!getCookie("JWTToken")) return;
    ordersData();
    const intervalId = setInterval(() => {
      const orderId = orderData?.order?.data?._id;
      const lastOrder = orderData?.order?.data?.isBusinessOrder;
      getPdf(orderId, lastOrder);
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [orderData?.order?.data?._id]);

  const ordersData = async () => {
    console.log("OrdersDataa", orderData?.order?.data);
    orderData?.order?.data?.isBusinessOrder
      ? setQuoteURL("/b/")
      : setQuoteURL("/c/");
    await getAllOrders(1, `Bearer ${getCookie("JWTToken")}`).then(
      (response) => {
        if (response.status == 200) {
          localStorage.setItem("TotalOrders", response.data?.data?.length);
        }
      }
    );
  };

  useEffect(() => {
    if (Router.query.nonPayment == "true") {
      cartItems?.expressAddedToCart &&
        removeExpressItemAddedToCart(
          cartItems?.hiddenProducts[0]?.cartData?._id
        );

      cartItems?.useHiddenProducts ? "" : deleteAllFromCart();
      removeHiddenProducts();
    }
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!isOrderLoaded) {
        console.log("Order loading timeout reached, setting order as loaded to prevent infinite loading");
        setIsOrderLoaded(true);
      }
    }, 30000); // 30 second timeout
    
    handleSuccess().catch((err) => {
      console.log("Error in handleSuccess:", err);
      // Set order as loaded to prevent infinite loading
      setIsOrderLoaded(true);
    });
    
    return () => {
      clearTimeout(timeoutId);
    };
    // deleteAllFromCart();
    // const intervalId = setInterval(() => {
    //   getPdf(orderId)
    // }, 10000)
    // return () => {
    //   clearInterval(intervalId)
    // }
  }, []);

  const getPdf = async (orderId, lastOrder) => {
    await getOrderPdf(orderId, lastOrder)
      .then((response) => {
        console.log(response, "kwjgefkwebjfkwejfbkwefb");
        if (response.status == 200) {
          if (
            response.data?.data?.invoice &&
            response.data?.data?.invoice?.status == 3 &&
            response.data?.data?.invoice?.filePath
          ) {
            setPdfFilePath(response.data?.data?.invoice?.filePath);
          } else {
            setPdfFilePath(null);
          }
        }
      })
      .catch((error) => console.log("error", error));
  };

  const getQRCode = async (text = "https://google.com") => {
    try {
      setQrCode(text);
      return text;
    } catch (err) {
      setQrCode("https://google.com");
      console.error(err);
    }
  };

  const handleCopy = (url) => {
    setCopied(true);
    navigator.clipboard.writeText(url);
    addToast("Link copied to clipboard", {
      appearance: "success",
      autoDismiss: true,
    });
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const downloadCode = (id) => {
    setDownloading(true);
    const canvas = document.getElementById(id);
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `ecostance.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => {
        setDownloading(false);
      }, 2000);
    }
  };

  // The Stripe webhook creates the guest order server-side, which can land a
  // moment after the buyer is redirected here. Poll until it exists.
  const waitForWebhookOrder = async (sessionId, timeoutMs = 20000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const response = await getOrderByCheckoutSession(sessionId);
        if (response?.data) {
          return { data: response.data, user: response.user };
        }
      } catch (err) {
        console.log("Error fetching order by checkout session", err);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    console.log("Webhook order not available within timeout for", sessionId);
    return null;
  };

  // Fallback receipt built from the checkout we just completed. Field names here
  // must match what the receipt below reads (addressLine1/pincode/phone), not the
  // checkout form's own names (streetAddressOne/mailcode).
  const buildLocalOrderFallback = (guestEmailFromData) => {
    const rawModuleOrder = localStorage.getItem("moduleOrderData");
    if (!rawModuleOrder) return null;

    try {
      const parsed = JSON.parse(rawModuleOrder);
      // `products` holds the full order payload built at checkout time.
      const orderPayload = parsed?.products || {};
      const address = parsed?.address || orderPayload?.address || {};

      return {
        data: {
          orderNumber: "",
          products: (Array.isArray(orderPayload?.products)
            ? orderPayload.products
            : []
          ).map((item) => ({
            product: {
              id: item?.product?.id || item?.product,
              name:
                item?.name ||
                item?.product?.name ||
                item?.productName ||
                "Module",
            },
            price: Number(item?.price || 0),
            quantity: Number(item?.quantity || 1),
          })),
          orderTotal: Number(parsed?.total || orderPayload?.total || 0),
          subTotal: Number(parsed?.total || orderPayload?.total || 0),
          currency: orderPayload?.currency || "USD",
          currencySymbol: orderPayload?.currencySymbol || "$",
          billingAddress: {
            firstName: address.firstName || "",
            lastName: address.lastName || "",
            companyName: address.companyName || "",
            addressLine1: address.addressLine1 || address.streetAddressOne || "",
            addressLine2: address.addressLine2 || address.streetAddressTwo || "",
            city: address.city || "",
            state: address.state || "",
            country: address.country || "",
            pincode: address.pincode || address.mailcode || "",
            phone: address.phone || address.phoneInfo || {},
          },
          paymentStatus: "success",
          paymentMethod: "card",
          paymentLogs: [
            {
              customer_email: guestEmailFromData,
              payment_method_types: ["card"],
            },
          ],
          createdAt: new Date().toISOString(),
          isModulePurchase: true,
        },
        user: { email: guestEmailFromData },
      };
    } catch (parseError) {
      console.error("Error building local guest order:", parseError);
      return null;
    }
  };

  const handleModuleOrder = async () => {
    console.log("Handling module order...");

    try {
      setIsModuleFlow(true);

      const sessionId = getCheckoutSessionId();
      if (sessionId) {
        const webhookOrder = await waitForWebhookOrder(sessionId, 30000);
        if (webhookOrder) {
          setOrder(webhookOrder);
          addOrder(true, webhookOrder);
          cleanupModuleCheckoutStorage();
          setIsOrderLoaded(true);
          return;
        }
      }

      // Check if this is a guest checkout (no JWT token)
      const hasJWTToken = !!getCookie("JWTToken");
      const dynamicPricingData =
        localStorage.getItem("dynamicPricingCheckout") ||
        sessionStorage.getItem("dynamicPricingCheckout");
      const isGuestFlow = !hasJWTToken && dynamicPricingData;

      if (isGuestFlow) {
        console.log("Guest checkout detected - webhook creates the order");
        setIsGuestCheckout(true);

        let guestEmailFromData = "";
        try {
          const parsedDynamicData = JSON.parse(dynamicPricingData);
          guestEmailFromData =
            parsedDynamicData?.guestEmail ||
            parsedDynamicData?.buyerInfo?.email ||
            "";
          setGuestEmail(guestEmailFromData);
        } catch (parseError) {
          console.error("Error parsing guest checkout data:", parseError);
        }

        // Webhook has not landed yet - show what we know from the checkout we
        // just completed rather than an empty receipt.
        const localOrder = buildLocalOrderFallback(guestEmailFromData);
        if (localOrder) {
          setOrder(localOrder);
          addOrder(true, localOrder);
        }

        cleanupModuleCheckoutStorage();

        setIsOrderLoaded(true);
        return;
      }

      // Ensure JWT token is available before attempting to create order
      const jwtReady = await waitForJWTToken(5000);
      if (!jwtReady) {
        console.log("JWTToken not available after waiting; cannot create module order.");
      }

      // For module orders, we need to get the order details from the API
      // since they don't go through the regular Stripe checkout flow
      const moduleOrderData = localStorage.getItem("moduleOrderData");
      console.log("Module order data from localStorage:", moduleOrderData);
      
      if (moduleOrderData) {
        const parsedOrderData = JSON.parse(moduleOrderData);
        console.log("Module order data parsed successfully:", parsedOrderData);

        // Checkout stores the order payload it built under `products` (see
        // returnAPIProductsForOrder in components/Stripe/stripe.js); the module
        // fields sit alongside it. Address there is already in API shape.
        const orderPayload = parsedOrderData.products || {};
        const payloadProducts = Array.isArray(orderPayload.products)
          ? orderPayload.products
          : [];
        const payloadAddress = orderPayload.address || parsedOrderData.address || {};
        const payloadCurrency = orderPayload.currency || "USD";
        const payloadTotal =
          parsedOrderData.total ?? orderPayload.total ?? 0;
        const buyerEmail = parsedOrderData.user?.email || userData?.user?.email;

        // Create the order in the backend via API
        console.log("Creating module order in backend via API...");
        try {
          // Format products array to match API requirements
          const formattedProducts = payloadProducts.map((product) => ({
            product: product.product || product._id,
            price: product.price?.toString() || "0.00",
            currency: payloadCurrency.toLowerCase(),
            quantity: 1, // Default one only for module orders
            startupCost: product.startupCost || 0,
            additionalQuantity: product.additionalQuantity || 0,
            additionalPrice: product.additionalPrice?.toString() || "0.00",
            name: product.name || product.product?.name || "Module Product"
          }));

          // Format address to match API requirements. Fall back to the checkout
          // form's own field names in case only that copy was stored.
          const formattedAddress = {
            firstName: payloadAddress.firstName || "",
            lastName: payloadAddress.lastName || "",
            phone: {
              number: payloadAddress.phone?.number || payloadAddress.phoneInfo?.number || "",
              countryCode: payloadAddress.phone?.countryCode || payloadAddress.countryCode || "",
              numericCode: `${payloadAddress.phone?.numericCode || payloadAddress.phoneInfo?.numericCode || ""}`
            },
            addressLine1: payloadAddress.addressLine1 || payloadAddress.streetAddressOne || "",
            addressLine2: payloadAddress.addressLine2 || payloadAddress.streetAddressTwo || "",
            city: payloadAddress.city || "",
            state: payloadAddress.state || "",
            country: payloadAddress.country || "",
            pincode: payloadAddress.pincode || payloadAddress.mailcode || "",
            countryCode: payloadAddress.countryCode || "",
            stateCode: payloadAddress.stateCode || "",
            companyName: payloadAddress.companyName || ""
          };

          // Create mock payment log entry for module orders
          const mockPaymentLog = {
            id: "module_order_" + Date.now(),
            object: "checkout.session",
            adaptive_pricing: { enabled: true },
            after_expiration: null,
            allow_promotion_codes: null,
            amount_subtotal: Math.round(payloadTotal * 100),
            amount_total: Math.round(payloadTotal * 100),
            automatic_tax: { enabled: false, liability: null, provider: null, status: null },
            billing_address_collection: null,
            cancel_url: process.env.NEXT_PUBLIC_UI_URL + "/checkout/cancel?session_id={CHECKOUT_SESSION_ID}",
            client_reference_id: null,
            client_secret: null,
            collected_information: { shipping_details: null },
            consent: null,
            consent_collection: null,
            created: Math.floor(Date.now() / 1000),
            currency: payloadCurrency.toLowerCase(),
            currency_conversion: null,
            custom_fields: [],
            custom_text: { after_submit: null, shipping_address: null, submit: null, terms_of_service_acceptance: null },
            customer: null,
            customer_creation: "always",
            customer_details: {
              address: null,
              email: buyerEmail,
              name: null,
              phone: null,
              tax_exempt: "none",
              tax_ids: null
            },
            customer_email: buyerEmail,
            discounts: [],
            expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
            invoice: null,
            invoice_creation: { enabled: true, invoice_data: { account_tax_ids: null, custom_fields: null, description: null, footer: null, issuer: { type: "self" }, metadata: {}, rendering_options: null } },
            livemode: false,
            locale: null,
            metadata: {},
            mode: "payment",
            origin_context: null,
            payment_intent: "pi_module_" + Date.now(),
            payment_link: null,
            payment_method_collection: "always",
            payment_method_configuration_details: null,
            payment_method_options: { card: { request_three_d_secure: "automatic" } },
            payment_method_types: ["card"],
            payment_status: "paid",
            permissions: null,
            phone_number_collection: { enabled: false },
            recovered_from: null,
            saved_payment_method_options: { allow_redisplay_filters: ["always"], payment_method_remove: "disabled", payment_method_save: null },
            setup_intent: null,
            shipping: null,
            shipping_address_collection: null,
            shipping_options: [],
            shipping_rate: null,
            status: "complete",
            submit_type: null,
            subscription: null,
            success_url: process.env.NEXT_PUBLIC_UI_URL + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
            total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
            ui_mode: "hosted",
            url: "",
            wallet_options: null
          };

          const orderResponse = await saveStripeCheckout({
            isModulePurchase: true,
            period: parsedOrderData.period || 12,
            products: formattedProducts,
            address: formattedAddress,
            total: payloadTotal,
            paymentLogs: [mockPaymentLog],
            paymentStatus: "success",
            paymentMethod: "card",
            type: "regular",
            origin: "desktop",
            currency: payloadCurrency,
            currencySymbol: orderPayload.currencySymbol || "$",
            timezone: new Date().getTimezoneOffset(),
            timeAbbrevation: new Date()
              .toLocaleDateString([], { day: "2-digit", timeZoneName: "long" })
              .substring(4)
              .match(/\b(\w)/g)
              .join(""),
            referalUserId: null,
            conferanceCode: null,
            businessEventUserId: null
          });
          
          console.log("Module order created successfully via API:", orderResponse);

          // Render the order the API actually created (order number, billing
          // address, products), not the local checkout payload.
          const updatedOrderData = orderResponse;

          // Set the updated order data
          setOrder(updatedOrderData);
          console.log("Updated order state set successfully");
          
          // Set quote URL based on business order
          if (updatedOrderData?.data?.isBusinessOrder) {
            setQuoteURL("/b/");
            console.log("Quote URL set to business: /b/");
          } else {
            setQuoteURL("/c/");
            console.log("Quote URL set to customer: /c/");
          }
          // For module orders, avoid any slug/QR handling to prevent downstream slug calls
          console.log("Skipping QR/slug handling for module order UI");
          
          // Add order to Redux store
          console.log("Adding order to Redux store");
          addOrder(true, updatedOrderData);
          
        } catch (apiError) {
          console.error("Error creating module order via API:", apiError);
          // Fallback: show the checkout we just completed rather than an empty
          // receipt. Must be the receipt's shape, not the raw stored payload.
          console.log("Falling back to localStorage data due to API error");
          const localOrder = buildLocalOrderFallback(buyerEmail);
          if (localOrder) {
            setOrder(localOrder);
            addOrder(true, localOrder);
          }
        }
        
        // Clean up localStorage
        console.log("Cleaning up localStorage");
        cleanupModuleCheckoutStorage();
        
        // Set order as loaded
        console.log("Setting order as loaded");
        setIsOrderLoaded(true);
        console.log("Module order handling completed successfully");
        return;
      }
      
      // If no module order data in localStorage, try to get from API
      // This might happen if the user refreshes the page
      console.log("No module order data in localStorage, checking API...");
      
      // For now, set order as loaded to prevent infinite loading
      // In a real implementation, you might want to make an API call to get the order
      console.log("Setting order as loaded to prevent infinite loading");
      setIsOrderLoaded(true);
      
    } catch (error) {
      console.error("Error handling module order:", error);
      // Set order as loaded to prevent infinite loading
      console.log("Setting order as loaded due to error");
      setIsOrderLoaded(true);
    }
  };

  const handleStripeSession = async () => {
    // Ensure JWT token is available before attempting to create order
    const jwtReady = await waitForJWTToken(5000);
    if (!jwtReady) {
      console.log("JWTToken not available after waiting; cannot create regular order now.");
    }

    const userCheckoutDetails = getCookie("checkout");

    const session = getCookie("stripeSession");
    setDiscount(cartItems?.discount);
    const billingAddress = userCheckoutDetails
      ? JSON.parse(userCheckoutDetails)
      : {};
    const successSection = session ? JSON.parse(session) : {};

    const {
      firstName,
      lastName,
      streetAddressOne,
      streetAddressTwo,
      city,
      state,
      country,
      mailcode,
      phone,
      countryCode,
      stateCode,
      companyName,
    } = billingAddress;

    // if (!userData?.slug?.slug) {
    //   handleSaveSettings(
    //     firstName,
    //     phone,
    //     country,
    //     userData?.user?.email
    //   ).catch((err) => {
    //     console.log(err);
    //   });
    // }

    let cartTotalPrice = 0;

    let regionPricing;
    let mainCartItems;
    cartItems?.useHiddenProducts
      ? (mainCartItems = [cartItems?.hiddenProducts[0]?.cartData])
      : (mainCartItems = cartItems?.products);

    const products =
      mainCartItems &&
      mainCartItems?.map((item) => {
        let product;
        cartItems?.useHiddenProducts
          ? (product = item)
          : (product = item?.product);

        regionPricing = regionPrice(product, cartItems);

        setCurrency(regionPricing?.currencySymbol);

        const productPrice = regionPricing.productPrice;
        const oldPrice = regionPricing.oldPrice;
        const discount = 100 - (100 / oldPrice) * productPrice;

        // const discountedPrice = getDiscountPrice(oldPrice, discount);
        cartTotalPrice += productPrice * item.quantity;
        return {
          product: product?._id,
          price: productPrice,
          currency: successSection.currency,
          quantity: item?.quantity,
          name: product?.name,
        };
      });

    const address = {
      firstName: firstName ? firstName : "",
      lastName: lastName ? lastName : "",
      phone: phone ? phone : "",
      addressLine1: streetAddressOne ? streetAddressOne : "",
      addressLine2: streetAddressTwo ? streetAddressTwo : "",
      city: city ? city : "",
      state: state ? state : "",
      country: country ? country : "",
      pincode: mailcode ? mailcode : "",
      countryCode,
      stateCode,
      companyName,
    };
    const date = new Date();
    let saveStripeInfo = {
      products,
      address,
      total: cartTotalPrice,
      paymentLogs: [successSection],
      paymentStatus: "success",
      paymentMethod: "card",
      type: cartItems?.useHiddenProducts ? "express" : "regular",
      origin: "desktop",
      currency: cartItems?.currency || userData.currency,
      currencySymbol: regionPricing.currencySymbol,
      timezone: date.getTimezoneOffset(),
      timeAbbrevation: new Date()
        .toLocaleDateString([], { day: "2-digit", timeZoneName: "long" })
        .substring(4)
        .match(/\b(\w)/g)
        .join(""),
    };
    if (cartItems?.couponData?.coupon && !cartItems?.useHiddenProducts) {
      saveStripeInfo = {
        ...saveStripeInfo,
        couponCode: cartItems?.couponData?.coupon,
      };
    } else if (
      cartItems?.expressPriceData?.coupon &&
      cartItems?.useHiddenProducts
    ) {
      saveStripeInfo = {
        ...saveStripeInfo,
        couponCode: cartItems?.expressPriceData?.coupon,
      };
    }

    saveStripeCheckout({
      ...saveStripeInfo,
      // Coupon is optional, if there is coupon we need to send the coupon to the bankend with a coupon, field is couponCode
    })
      .then((response) => {
        if (!userData?.slug?.slug && response?.success) {
          validateUserFast({
            slug: response?.slug,
            email: response?.user?.email,
            billingAddress: response?.data?.billingAddress,
          });
          runValidateUserProcessSync();
        }
        localStorage.removeItem("BusinessOrderSelection");
        localStorage.removeItem("eventOwnerOrder");
        localStorage.removeItem("checkoutCartBackup"); // Clean up cart backup
        if (cartItems?.expressAddedToCart) {
          removeExpressItemAddedToCart(
            cartItems?.hiddenProducts[0]?.cartData?._id
          );
        }
        // cartItems?.useHiddenProducts ? "" : deleteAllFromCart();

        removeHiddenProducts();
        setOrder(response);
        addOrder(true, response);
        response?.slug &&
          getQRCode(process.env.NEXT_PUBLIC_UI_URL + quoteURL + response?.slug);
        setIsOrderLoaded(true);
      })
      .catch((error) => console.log("error stripe", error))
      .finally(() => {
        // deleteCoupon();
        // validateUser();
      });
  };

  // Helper: wait for JWT token to become available
  const waitForJWTToken = async (timeoutMs = 15000) => {
    const start = Date.now();
    while (!getCookie("JWTToken") && Date.now() - start < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    return !!getCookie("JWTToken");
  };

  const handlePfdClick = () => {
    if (pdfFilePath != null) return;
    addToast("Your PDF is Generating, Please wait!", {
      appearance: "info",
      autoDismiss: true,
    });
  };

  const formatCertificateNumber = (certificateNumber) => {
    let certNumber = "";
    if (!certificateNumber) return certNumber;
    String(certificateNumber)
      .split("")
      .forEach((item, index) => {
        certNumber += item;
        if (index == 3 || index == 7) certNumber += " ";
      });
    return certNumber;
  };

  const returnFirstLetterCapitalized = (string) => {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  };

  const calculateTotalProductCount = (productQuantity = 0) =>
    (totalProductCount += Number(productQuantity));

  const getFullName = (fName, lName) => [fName, lName].filter(Boolean).join(" ");

  // Renders "" (not "+undefined undefined") when the order carries no phone.
  const getFormattedPhone = (phone) => {
    if (!phone) return "";
    if (typeof phone === "string") return phone;
    const { numericCode, number } = phone;
    if (!number) return "";
    return numericCode ? `+${numericCode} ${number}` : `${number}`;
  };

  const formatAmount = (amount, currency) =>
    formatCurrency(Number(amount || 0).toFixed(2), currency);

  const formatProductPrice = (price, currency) =>
    formatCurrency(Number(price || 0).toFixed(2), currency);

  const cleanupModuleCheckoutStorage = () => {
    localStorage.removeItem("modulepurchase");
    localStorage.removeItem("moduleOrderData");
    localStorage.removeItem("dynamicPricingCheckout");
    sessionStorage.removeItem("dynamicPricingCheckout");
    localStorage.removeItem("BusinessOrderSelection");
    localStorage.removeItem("checkoutCartBackup");
  };

  const getCheckoutSessionId = () =>
    Router.query.session_id ||
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("session_id")
      : null);

  // Renders "" (not "Invalid Date") until the order carries a timestamp.
  const getFormattedDateTime = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return "";
    return `${getFormattedDate(date)}, ${getFormattedTime(date)}`;
  };

  const getFormattedAddress1 = (address = "") => address.split(",").join(", ");

  const getFormattedBillingAddress = ({
    city = "",
    state = "",
    country = "",
    pincode = "",
  } = {}) => {
    return [city, state, pincode, country].reduce((acc, item) => {
      if (item && item?.trim())
        return (acc += `${item}${item === country ? "" : ", "}`);
      else return acc;
    }, "");
  };

  useEffect(() => {
    if (isOrderLoaded) {
      deleteAllFromCart();
    }
  }, [isOrderLoaded]);

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle="Thank you"
        // backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
        // backgroundImageLowRes="/assets/images/backgrounds/breadcrumb-bg-1-small.png"
        className="bg--1"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.NEXT_PUBLIC_UI_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>
          <li>Thank you</li>
        </ul>
      </BreadcrumbOne>
      <div className="order__success__wrapper">
        {!isOrderLoaded ? (
          <div className={"d-flex justify-content-center space-mb--10"}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="order__success__main-container">
            <div className="order__success__section_one">
              <div className="order__success__main-container_row">
                <div className="order__success__thankyou-container">
                  <svg
                    className="success_svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="55"
                    height="55"
                    fill="none"
                    viewBox="0 0 55 55"
                  >
                    <path
                      fill="#7BA986"
                      fillRule="evenodd"
                      d="M27.5 54.3c14.8 0 26.8-11.999 26.8-26.8S42.3.7 27.5.7C12.697.7.7 12.7.7 27.5s11.998 26.8 26.8 26.8zM39.917 23.17a3.35 3.35 0 10-4.738-4.738L24.15 29.463l-4.332-4.332a3.35 3.35 0 10-4.738 4.738l6.7 6.7a3.35 3.35 0 004.738 0l13.4-13.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <h1 className="order__success__thankyou-msg">
                    Thanks for your order!
                  </h1>
                </div>
              </div>
            </div>

            <div className="order__success__section_two">
              <div className="order__success__main-container_row">
                <div className="order__success-info-container">
                  <div className="order__success__company-info-container">
                    {companyAddress?.companyName && (
                      <p className="text-bold">{companyAddress?.companyName}</p>
                    )}
                    {companyAddress?.departmentName && (
                      <p>{companyAddress?.departmentName}</p>
                    )}
                    {companyAddress?.addressLine1 && (
                      <p>{getFormattedAddress1(companyAddress?.addressLine1)},</p>
                    )}
                    {getFormattedBillingAddress(companyAddress) && (
                      <p>{getFormattedBillingAddress(companyAddress)}</p>
                    )}
                    {companyAddress?.email && (
                      <p>Contact: {companyAddress?.email}</p>
                    )}
                  </div>
                  <div className="order__success__buyer-info-container">
                    <p className="text-bold">Sold To</p>
                    {localStorage.getItem("isLastOrderBusiness") === true ? (
                      <p>
                        {
                          JSON.parse(localStorage.getItem("MyBusinessDetails"))
                            ?.name
                        }
                      </p>
                    ) : (
                      <p>
                        {getFullName(
                          order?.data?.billingAddress?.firstName,
                          order?.data?.billingAddress?.lastName
                        )}
                      </p>
                    )}
                    <p
                      className="order__success__billing-address"
                      style={{
                        display: localStorage.getItem("isLastOrderBusiness")
                          ? ""
                          : "none",
                      }}
                    >
                      Order By: {localStorage.getItem("email")}
                    </p>
                    {order?.data?.billingAddress?.addressLine1 && (
                      <p className="order__success__billing-address">
                        {getFormattedAddress1(
                          order?.data?.billingAddress?.addressLine1
                        )}
                        ,
                      </p>
                    )}
                    <p className="order__success__billing-address">
                      {getFormattedBillingAddress({
                        companyName: order?.data?.billingAddress?.companyName,
                        city: order?.data?.billingAddress?.city,
                        state: order?.data?.billingAddress?.state,
                        country: order?.data?.billingAddress?.country,
                        pincode: order?.data?.billingAddress?.pincode,
                      })}
                    </p>
                    <p className="order__success__billing-address">
                      Contact:{" "}
                      {order?.data?.paymentLogs?.[0]?.customer_email ||
                        order?.data?.buyerEmail ||
                        order?.user?.email ||
                        ""}
                    </p>
                    {getFormattedPhone(order?.data?.billingAddress?.phone) && (
                      <p className="order__success__billing-address">
                        Phone:{" "}
                        {getFormattedPhone(order?.data?.billingAddress?.phone)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="order__success-order-detail-pdf-container">
                  <a
                    className="order__success-order-detail-pdf-download-container"
                    href={pdfFilePath}
                    target="_blank"
                    download
                    onClick={handlePfdClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="17"
                      fill="none"
                      viewBox="0 0 15 17"
                    >
                      <path
                        fill="#B7323B"
                        d="M4.008 10.936c0-.282-.196-.45-.542-.45-.14 0-.236.013-.286.027v.905c.059.014.132.018.232.018.368 0 .596-.186.596-.5zM6.142 10.495c-.155 0-.255.014-.314.027v2.006c.06.014.155.014.241.014.628.005 1.038-.34 1.038-1.073.004-.637-.369-.974-.965-.974z"
                      ></path>
                      <path
                        fill="#B7323B"
                        d="M10.121-.001H3.293c-.997 0-1.81.812-1.81 1.81v6.69h-.176a.729.729 0 00-.729.73v4.42c0 .404.327.73.73.73h.176v.81c0 .999.812 1.81 1.81 1.81h9.316c.997 0 1.809-.811 1.809-1.81V4.282L10.12 0zm-7.63 10.027c.214-.036.514-.063.937-.063.428 0 .732.081.937.245.196.155.328.41.328.71s-.1.555-.282.728c-.237.223-.587.323-.997.323-.09 0-.172-.005-.236-.013v1.096H2.49v-3.026zm10.119 5.865H3.293a.702.702 0 01-.7-.701v-.811h8.684c.403 0 .73-.326.73-.73V9.23a.729.729 0 00-.73-.73H2.593v-6.69c0-.386.314-.7.7-.7L9.707 1.1v2.371c0 .693.561 1.255 1.254 1.255l2.323-.007.026 10.47a.701.701 0 01-.7.7zm-7.474-2.853v-3.012c.254-.04.587-.063.937-.063.582 0 .96.104 1.256.327.318.237.518.614.518 1.156 0 .587-.213.992-.51 1.242-.322.268-.814.396-1.414.396-.36 0-.614-.023-.787-.046zm4.965-1.783v.564h-1.1v1.233h-.697V9.986h1.874v.568H9v.7h1.101z"
                      ></path>
                    </svg>
                    <p>Order.pdf</p>
                  </a>
                </div>
                <div
                  className={`order__success-order-detail-container ${
                    order?.data?.paymentMode === "subscription"
                      ? "no-max-width"
                      : ""
                  }`}
                >
                  <div className="order__success-order-detail-container-left">
                    <div className="order__success-container-left-keys">
                      <p>
                        Order #:
                        <span className="order__success-container-left-values-mb">
                          {formatCertificateNumber(order?.data?.orderNumber)}
                        </span>
                      </p>
                      <p>
                        Email ID:
                        <span className="order__success-container-left-values-mb">
                          {order?.user?.email}
                        </span>
                      </p>
                      <p>
                        Status:
                        <span
                          className={`order__success-container-left-values-mb ${
                            order?.data?.paymentStatus === "success"
                              ? "order__success__status-success"
                              : ""
                          }`}
                        >
                          {order?.data?.paymentStatus}
                        </span>
                      </p>
                    </div>
                    <div className="order__success-container-left-values">
                      <p>{formatCertificateNumber(order?.data?.orderNumber)}</p>
                      <p>{order?.user?.email}</p>
                      <p
                        className={
                          order?.data?.paymentStatus === "success"
                            ? "order__success__status-success"
                            : ""
                        }
                      >
                        {order?.data?.paymentStatus}
                      </p>
                    </div>
                  </div>
                  <div className="order__success-order-detail-container-right">
                    <div className="order__success-container-right-keys">
                      <p>
                        Date & Time:
                        <span className="order__success-container-left-values-mb">
                          {getFormattedDateTime(order?.data?.createdAt)}
                        </span>
                      </p>
                      <p>
                        Payment mode:
                        <span className="order__success-container-left-values-mb">
                          {order?.data?.paymentLogs?.[0]?.payment_method_types?.[0]
                            ? returnFirstLetterCapitalized(
                                order?.data?.paymentLogs?.[0]
                                  ?.payment_method_types[0]
                              )
                            : order?.data?.paymentMethod
                            ? returnFirstLetterCapitalized(order?.data?.paymentMethod)
                            : ""}
                          {/* {order?.data?.paymentMode == "Non-payment"
                            ? "Not Applicable"
                            : ""} */}
                        </span>
                      </p>
                      <p>
                        Payment type:
                        <span className="order__success-container-left-values-mb">
                          {order?.data?.paymentLogs?.[0]?.mode === "subscription"
                            ? "Monthly Subscription"
                            : "One Time Payment"}
                        </span>
                      </p>
                      {order?.data?.paymentMode === "subscription" ? (
                        <>
                          <p>
                            Start date:
                            <span className="order__success-container-left-values-mb">
                              {getFormattedDateTime(order?.data?.createdAt)}
                            </span>
                          </p>
                          <p>
                            End date:
                            <span className="order__success-container-left-values-mb">
                              {returnOneYearForwardDate(order?.data?.createdAt)}
                              , {getFormattedTime(order?.data?.createdAt)}
                            </span>
                          </p>
                          <p>
                            Monthly payment:
                            <span className="order__success-container-left-values-mb">
                              {order?.data?.currency}{" "}
                              {order?.data?.currencySymbol}
                              {formatCurrency(
                                Number(
                                  (order?.data?.paymentLogs?.[0]?.amount_total ||
                                    0) / 100,
                                ).toFixed(2),
                                order?.data?.currency
                              )}
                            </span>
                          </p>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="order__success-container-right-values">
                      <p>
                        {getFormattedDateTime(order?.data?.createdAt)}
                      </p>
                      <p>
                        {order?.data?.paymentLogs?.[0]?.payment_method_types?.[0]
                          ? returnFirstLetterCapitalized(
                              order?.data?.paymentLogs?.[0]
                                ?.payment_method_types[0]
                            )
                          : order?.data?.paymentMethod
                          ? returnFirstLetterCapitalized(order?.data?.paymentMethod)
                          : ""}
                        {/* {order?.data?.paymentMode == "Non-payment"
                          ? "Not Applicable"
                          : ""}{" "} */}
                      </p>
                      <p>
                        {order?.data?.paymentLogs?.[0]?.mode === "subscription"
                          ? "Monthly Subscription"
                          : "One Time Payment"}
                      </p>
                      {order?.data?.paymentMode === "subscription" ? (
                        <>
                          <p>
                            {getFormattedDateTime(order?.data?.createdAt)}
                          </p>
                          <p>
                            {returnOneYearForwardDate(order?.data?.createdAt)},{" "}
                            {getFormattedTime(order?.data?.createdAt)}
                          </p>
                          <p>
                            {order?.data?.currency}{" "}
                            {order?.data?.currencySymbol}
                            {formatCurrency(
                              Number(
                                (order?.data?.paymentLogs?.[0]?.amount_total ||
                                  0) / 100,
                              ).toFixed(2),
                              order?.data?.currency
                            )}
                          </p>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order__success__section_three">
              <div className="order__success__main-container_row">
                <div className="order__success__product-table-header">
                  <p className="product-table-header-item-1">Num</p>
                  <p className="product-table-header-item-3">Product Num</p>
                  <p className="product-table-header-item-2">Product Name</p>
                  <p className="product-table-header-item-3">Unit Price</p>
                  <p className="product-table-header-item-4">Qty</p>
                  <p className="product-table-header-item-5">Product Total</p>
                </div>
                {order?.data?.products?.length > 0 &&
                  order?.data?.products.map((item, index) => {
                    calculateTotalProductCount(item?.quantity);
                    return (
                      <div key={index} className="order__success__product-row">
                        <p className="product-table-header-item-1">
                          {index + 1}
                        </p>
                        <p className="product-table-header-item-3">
                          {formatCertificateNumber(item?.product?.id)}
                        </p>
                        <p className="product-table-header-item-2">
                          {item?.product?.name}
                        </p>
                        <p className="product-table-header-item-3">
                          {order?.data?.currency}{" "}
                          {currency || order?.data?.currencySymbol}
                          {formatProductPrice(
                            item?.price,
                            order?.data?.currency
                          )}
                        </p>
                        <p
                          className="product-table-header-item-4"
                          style={{ paddingLeft: "2px" }}
                        >
                          {item?.quantity}
                        </p>
                        <p className="product-table-header-item-5">
                          {order?.data?.currency}{" "}
                          {currency || order?.data?.currencySymbol}
                          {formatProductPrice(
                            Number(item?.price || 0) * Number(item?.quantity || 1),
                            order?.data?.currency
                          )}
                        </p>
                      </div>
                    );
                  })}

                {/* <div className="order__success__product-row">
                  <p className="product-table-header-item-1">2</p>
                  <p className="product-table-header-item-2">Kariba Red++</p>
                  <p className="product-table-header-item-3">INR₹ 100.00</p>
                  <p className="product-table-header-item-4">100</p>
                  <p className="product-table-header-item-5">INR₹ 2000.00</p>
                </div> */}

                <div className="order__success__order-price-container">
                  <div className="order__success__total-items-container">
                    <p className="order__success__total-items-txt">
                      Total items
                    </p>
                    <p className="order__success__total-items">
                      {totalProductCount}
                    </p>
                  </div>
                  <div className="order__success__cart-total-container">
                    <p className="order__success__cart-total-txt">Cart Total</p>
                    <p className="order__success__cart-total">
                      {order?.data?.currency}{" "}
                      {currency || order?.data?.currencySymbol}
                      {formatAmount(order?.data?.subTotal, order?.data?.currency)}
                    </p>
                  </div>
                </div>

                <div className="order__success__order-promo-tax-container">
                  <div className="order__success__order-promo-tax-keys">
                    {order?.data?.calculatedCouponDiscount ? (
                      <p>Promotion {getCouponText(order?.data?.coupon)}</p>
                    ) : (
                      ""
                    )}
                    <p>Tax</p>
                    <p>Shipping</p>
                  </div>

                  <div className="order__success__order-promo-tax-values">
                    {order?.data?.calculatedCouponDiscount ? (
                      <p>
                        -{order?.data?.currency}{" "}
                        {currency || order?.data?.currencySymbol}
                        {formatProductPrice(
                          order?.data?.calculatedCouponDiscount,
                          order?.data?.currency
                        )}
                      </p>
                    ) : (
                      ""
                    )}
                    <p>
                      {order?.data?.currency}{" "}
                      {currency || order?.data?.currencySymbol}
                      {formatCurrency(0, order?.data?.currency)}
                    </p>
                    <p>
                      {order?.data?.currency}{" "}
                      {currency || order?.data?.currencySymbol}
                      {formatCurrency(0, order?.data?.currency)}
                    </p>
                  </div>
                </div>

                <div className="order__success__footer">
                  <div className="order__success__order-total-container">
                    <p>ORDER TOTAL</p>
                    <p>
                      {order?.data?.currency}{" "}
                      {currency || order?.data?.currencySymbol}
                      {formatAmount(
                        order?.data?.orderTotal,
                        order?.data?.currency
                      )}
                    </p>
                  </div>
                  <div className="order__success__media-container" style={{display: (isModuleFlow || order?.data?.isModulePurchase) ? "none" : ""}}>
                    <div className="leftBox">
                      <div
                        style={{
                          fontSize: "15.74px",
                          fontWeight: 500,
                          color: "#333333",
                          justifyContent: "center",
                          display: "flex",
                          marginTop: "-18px",
                          paddingBottom: "10px",
                          // width: "100%",
                        }}
                      >
                        <p
                          style={{
                            width: "140px",
                            background: "#F2F2F2",
                            textAlign: "center",
                          }}
                        >
                          EcoStance Page
                        </p>
                      </div>

                      {order?.slug && (
                        <div className="order__success__qr-container">
                          <a
                            on
                            onMouseEnter={(e) => setLinkHovered(true)}
                            onMouseLeave={(e) => setLinkHovered(false)}
                            className="order__success__qr-img-wrapper"
                            style={{
                              boxShadow: linkHovered
                                ? "0px 4px 4px rgba(0, 0, 0, 0.25)"
                                : "",
                            }}
                            // onClick={(e) => downloadCode("qrID")}
                            href={
                              process.env.NEXT_PUBLIC_UI_URL +
                              quoteURL +
                              order?.slug
                            }
                            target="_blank"
                          >
                            {qrCode && (
                              <QRCode
                                value={qrCode}
                                logoImage="/assets/images/ecostance-qr-logo.png"
                                size={110}
                              />
                            )}
                            <div style={{ display: "none" }}>
                              {qrCode && (
                                <QRCode
                                  value={qrCode}
                                  logoImage="/assets/images/ecostance-qr-logo.png"
                                  size={400}
                                  logoWidth={100}
                                  id={"qrID"}
                                />
                              )}
                            </div>
                          </a>
                          <div>
                            <p className="order__success__profile-link">
                              <a
                                onMouseEnter={(e) => setLinkHovered(true)}
                                onMouseLeave={(e) => setLinkHovered(false)}
                                style={{
                                  color: linkHovered ? "#333333" : "",
                                }}
                                href={
                                  process.env.NEXT_PUBLIC_UI_URL +
                                  quoteURL +
                                  order?.slug
                                }
                                target="_blank"
                              >
                                {process.env.NEXT_PUBLIC_UI_URL +
                                  quoteURL +
                                  order?.slug}
                              </a>
                            </p>
                            <div
                              style={{
                                paddingTop: "10px",
                                display: "flex",
                                alignItems: "center",
                                // marginLeft: "-5px",
                              }}
                            >
                              <div style={{ width: "130px" }}>
                                <button
                                  className="copyButton"
                                  onClick={(e) =>
                                    handleCopy(
                                      process.env.NEXT_PUBLIC_UI_URL +
                                        quoteURL +
                                        order?.slug
                                    )
                                  }
                                >
                                  <div className="copyButtonSvg">
                                    <MdContentCopy
                                      style={{
                                        pointerEvents: "all",
                                        width: "18px",
                                        height: "18px",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                  <span>
                                    {copied ? "Link Copied" : "Copy Link"}
                                  </span>
                                </button>
                              </div>
                              <div>
                                <button
                                  className="copyButton"
                                  onClick={(e) => downloadCode("qrID")}
                                >
                                  <div className="copyButtonSvg">
                                    <BsCloudDownload
                                      style={{
                                        pointerEvents: "all",
                                        width: "18px",
                                        height: "18px",
                                        // marginRight: "10px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                      }}
                                    />
                                  </div>
                                  <span>
                                    {downloading
                                      ? "Downloading..."
                                      : "Download QR Code"}
                                  </span>
                                </button>
                              </div>
                            </div>
                            <p className="pageUpdateMsg">
                              Your EcoStance page will be updated with your
                              latest purchases and certificates after 5 to 10
                              minutes of your last order.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="rightBox">
                      <div
                        style={{
                          fontSize: "15.74px",
                          fontWeight: 500,
                          color: "#333333",
                          justifyContent: "center",
                          display: "flex",
                          marginTop: "-18px",
                          paddingBottom: "10px",
                          width: "100%",
                        }}
                      >
                        <p
                          style={{
                            width: "200px",
                            background: "#F2F2F2",
                            textAlign: "center",
                          }}
                        >
                          Share EcoStance Page
                        </p>
                      </div>
                      <div>
                        <p className="order__success__share-txt">
                          Show this on your social networks:{" "}
                        </p>
                        {/* <SlBadge /> */}
                      </div>
                      <div
                        className="order__success__share-container share-holder-success"
                        style={{ paddingTop: "1.6rem" }}
                      >
                        {order?.slug && (
                          <>
                            <TwitterShareButton
                              title="Hi friends, I have a zero carbon footprint now and I am helping solve the climate crisis. Visit my EcoStance Page."
                              url={
                                process.env.NEXT_PUBLIC_UI_URL +
                                // "https://dev1.ebcopen.com" +
                                quoteURL +
                                order?.slug
                              }
                              // hashtags={[
                              //   "Saveplanet",
                              //   "MakeTheWorldSustainable",
                              // ]}
                            >
                              <TwitterIcon size={40} round={true} />
                            </TwitterShareButton>
                            <FacebookShareButton
                              title="Hello there #Saveplanet #MakeTheWorldSustainable"
                              quote="Hi friends, I have a zero carbon footprint now and I am helping solve the climate crisis. Visit my EcoStance Page."
                              url={
                                // "https://dev1.ebcopen.com" +
                                process.env.NEXT_PUBLIC_UI_URL +
                                quoteURL +
                                order?.slug
                              }
                            >
                              <FacebookIcon size={40} round={true} />
                            </FacebookShareButton>
                            <WhatsappShareButton
                              title="Hi friends, I have a zero carbon footprint now and I am helping solve the climate crisis. Visit my EcoStance Page."
                              url={
                                process.env.NEXT_PUBLIC_UI_URL +
                                // "https://dev1.ebcopen.com" +
                                quoteURL +
                                order?.slug
                              }
                            >
                              <WhatsappIcon size={40} round={true} />
                            </WhatsappShareButton>
                            {/* <LinkedinShareButton
                            title="Test Title for LinkedIn"
                            summary="Test Summary for LinkedIn"
                            url={
                              "https://dev1.ebcopen.com" +
                              quoteURL +
                              order?.slug
                            }
                            source="https://dev1.ebcopen.com"
                          >
                            <LinkedinIcon size={40} round={true} />
                          </LinkedinShareButton> */}
                            <a
                              target="_blank"
                              href={`https://www.linkedin.com/sharing/share-offsite/?url=${
                                process.env.NEXT_PUBLIC_UI_URL +
                                // "https://dev1.ebcopen.com" +
                                quoteURL +
                                order?.slug
                              }`}
                              url={
                                process.env.NEXT_PUBLIC_UI_URL +
                                quoteURL +
                                order?.slug
                              }
                            >
                              <LinkedinIcon size={40} round={true} />
                            </a>
                            <div className="linkedInAddToProfile">
                              <a
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                target="_blank"
                                href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=My%20EcoStance%20Certificate&organizationId=98574720&issueYear=2023
&issueMonth=10&expirationYear=2024&expirationMonth=10&certUrl=
${process.env.NEXT_PUBLIC_UI_URL}/c/${order?.slug}`}
                              >
                                {/* <img
                                  src="https://download.linkedin.com/desktop/add2profile/buttons/en_US.png "
                                  alt="LinkedIn Add to Profile button"
                                /> */}
                                <LinkedinIcon size={40} round={true} />
                                <div
                                  style={{
                                    paddingLeft: "5px",
                                    paddingRight: "10px",
                                  }}
                                >
                                  Add to profile
                                </div>
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order__success__closing-text mt-4">
              {isGuestCheckout ? (
                <>
                  <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    Thank you for your purchase!
                  </p>
                  <p>
                    Within a few minutes, you will receive an email at{" "}
                    <strong>{guestEmail || order?.user?.email}</strong> with your order details
                    and a link to set up your account password.
                  </p>
                  <p style={{ marginTop: "10px" }}>
                    Once you set your password, you can log in to access your account
                    and view your orders.
                  </p>
                </>
              ) : (
                <>
                  Within a few minutes, you will also receive an email at{" "}
                  {userData?.user?.email} with order details. You can also visit
                  your "MyAccount" Page to view your orders.
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    orderData: state.orderData,
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addOrder: (isOrder, item) => {
      dispatch(addOrder(isOrder, item));
    },
    deleteAllFromCart: () => {
      dispatch(deleteAllFromCart(true));
    },
    deleteCoupon: () => {
      dispatch(deleteCoupon());
    },
    validateUser: () => {
      dispatch(validateUser());
    },
    removeHiddenProducts: () => {
      dispatch(removeHiddenProducts());
    },
    removeExpressItemAddedToCart: (id) => {
      dispatch(removeExpressItemAddedToCart(id));
    },
    validateUserFast: (data) => {
      dispatch(validateUserFast(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewSuccess);
