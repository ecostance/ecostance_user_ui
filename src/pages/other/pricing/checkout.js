import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { LayoutTwo } from "../../../components/Layout";
import { BreadcrumbOne } from "../../../components/Breadcrumb";
import DynamicPriceCheckoutForm from "../../../components/Stripe/dynamicPriceStripe";
import BusinessPopup from "src/components/business-popup"

// import UseModalBare from 'src/components/use/bareUseModal'

import { setUserEmail, validateUser } from "src/redux/actions/userAction";

import { useRouter } from "next/router";
import {
  checkEmailVerificationStatus,
  me,
  resendVerificationOTP,
} from "src/apiClient/auth";
import NewLoginRegisterModel from "src/components/NewLoginRegisterModal";
import RegistrationSuccessPopup from "src/components/registrationSuccessPopup";
import router from "next/router";

import LezadaBackdrop from "src/components/lezadaBackdrop";
import VerifyPopup from "src/components/verifyEmailPopup";
import { useToasts } from "react-toast-notifications";
import CarbonOffsetPopup from "src/components/carbon--offset-popup";
import { resetCircleDataIndex } from "src/redux/actions/carbonCalculatorActions";
import { addAPIDataToCart } from "src/redux/actions/cartActions";
import { addAPIDataToWishlist } from "src/redux/actions/wishlistActions";
import { verifyLoggedIn } from "src/apiClient/user";
import Resetpasswordflow from "../../resetpasswordflow";
const Checkout = ({
  validateUser,
  userData,
  resetCircleDataIndex,
  cartItems,
  setUserEmail,
  addAPIDataToCart,
  addAPIDataToWishlist,
  wishlistItems,
  circleSliderData,
}) => {
  const router = useRouter();
  const checkoutElement = useRef();
  const [shouldShowVerifyModel, setShouldShowVerifyModel] = useState(false);
  const [shouldShowCarbonOffsetModel, setShouldShowCarbonOffsetModel] =
    useState(false);
  const [carbonPopupShown, setCarbonPopupShown] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isShowModel, setIsShowModel] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [shouldShowSuccessModel, setShouldShowSuccessModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrencyOverlay, setShowCurrencyOverlay] = useState(false);
  const [calculatorCheckout, setCalculatorCheckout] = useState(false);
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState("checkout");
  const [isVerifyEmailSent, setIsVerifyEmailSent] = useState(false);
  const [actionSuccessType, setActionSuccessType] = useState("");
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [businessPopupShown, setBusinessPopShown] = useState(false)
  const [isBusinessOrder, setIsBusinessOrder] = useState(false)

  const { addToast } = useToasts();

  const handleForgotPasswordPopup = () => {
    setShowLoginPopup(false);
    setShowForgotPasswordPopup(true);
  };

  const [express, setExpress] = useState("");
  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  }, []);
  
  // Handle dynamic pricing checkout data
  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady) return;

    console.log("=== CHECKOUT PAGE MOUNT DEBUGGING ===");
    console.log("Checkout page mounted with cartItems:", cartItems);
    console.log("Router query:", router.query);
    console.log("Module order flag:", router.query.moduleOrder === "true");
    console.log("LocalStorage modulepurchase:", localStorage.getItem("modulepurchase"));
    console.log("LocalStorage checkoutCartBackup:", localStorage.getItem("checkoutCartBackup"));

    // Handle dynamic pricing data
    if (router.query.dynamicPricing === "true" && router.query.linkId) {
      console.log("=== DYNAMIC PRICING CHECKOUT ===");

      // Check if we already processed this pricing link
      const processedLinkId = sessionStorage.getItem('processedDynamicPricingLinkId');
      if (processedLinkId === router.query.linkId) {
        console.log("Dynamic pricing already processed for this link");
        return;
      }

      const dynamicPricingData = localStorage.getItem('dynamicPricingCheckout') ||
                                 sessionStorage.getItem('dynamicPricingCheckout');

      if (dynamicPricingData) {
        const checkoutData = JSON.parse(dynamicPricingData);
        console.log("Dynamic pricing checkout data:", checkoutData);

        const baseUsers = checkoutData.baseUsers || 5;

        // Get selected modules - check multiple possible locations for backwards compatibility
        const selectedModules = checkoutData.selectedModules ||
                                checkoutData.pricingData?.modules ||
                                [];

        // Safety check - ensure selectedModules is an array
        if (!Array.isArray(selectedModules) || selectedModules.length === 0) {
          console.error("No valid selectedModules found in checkout data:", checkoutData);
          return;
        }

        // Convert dynamic pricing data to cart format
        // All modules are included by default with base users
        const moduleProducts = selectedModules.map(module => {
          const additionalUsers = checkoutData.quantities[module.id] || 0;
          const totalUsers = baseUsers + additionalUsers;
          const pricing = module.customPricing || {};

          return {
            productId: module.id,
            cartItemId: module.id,
            name: module.name,
            quantity: 1, // Each module is purchased once
            additionalUnit: additionalUsers, // Only users beyond base 5 (base users are included in module cost)
            totalUsers: totalUsers, // Total users for this module
            baseUsers: baseUsers,
            // Pricing breakdown
            price: pricing.modulePrice || 0, // One-time setup fee
            mainPrice: pricing.modulePrice || 0,
            maintenancePrice: pricing.monthlyMaintenance || 0,
            additionalPrice: pricing.monthlyCostPerUser || 0,
            perUserCost: (pricing.monthlyCostPerUser || 0) * totalUsers,
            currency: "USD",
            currencySymbol: "$",
            // Full product object for CartSummary
            product: {
              _id: module.id,
              name: module.name,
              priceList: [{
                price: pricing.monthlyMaintenance || 0,
                currency: "USD"
              }],
              priceListAdditional: [{
                price: pricing.monthlyCostPerUser || 0,
                currency: "USD"
              }],
              startupPriceList: [{
                price: pricing.modulePrice || 0,
                currency: "USD"
              }]
            }
          };
        });

        console.log("Converted module products:", moduleProducts);

        // Store in localStorage as backup
        localStorage.setItem('dynamicPricingModuleProducts', JSON.stringify(moduleProducts));
        localStorage.setItem('dynamicPricingTotals', JSON.stringify(checkoutData.totals));
        localStorage.setItem('checkoutCartBackup', JSON.stringify(moduleProducts));
        localStorage.setItem('modulepurchase', 'true');

        // Store one-time fee separately for stripe component to access
        const oneTimeFee = checkoutData.oneTimeFee || checkoutData.pricingData?.oneTimeFee || 0;
        localStorage.setItem('dynamicPricingOneTimeFee', oneTimeFee.toString());

        // Store discount data for stripe component to access
        const discount = checkoutData.discount || checkoutData.pricingData?.discount || 0;
        const discountType = checkoutData.discountType || checkoutData.pricingData?.discountType || "percentage";
        const paymentPlan = checkoutData.paymentPlan || "full";
        localStorage.setItem('dynamicPricingDiscount', discount.toString());
        localStorage.setItem('dynamicPricingDiscountType', discountType);
        localStorage.setItem('dynamicPricingPaymentPlan', paymentPlan);

        // Add to Redux cart
        if (moduleProducts.length > 0) {
          addAPIDataToCart({
            moduleProducts: moduleProducts,
            isModuleProduct: true,
            oneTimeFee: oneTimeFee,
            discount: discount,
            discountType: discountType,
            paymentPlan: paymentPlan
          });

          // Mark as processed to prevent duplicate additions
          sessionStorage.setItem('processedDynamicPricingLinkId', router.query.linkId);
        }
      }
    }
    
    // Debug: Check the actual pricing structure of cart items
    if (cartItems?.moduleProducts && cartItems.moduleProducts.length > 0) {
      console.log("=== CART PRICING DEBUGGING ===");
      cartItems.moduleProducts.forEach((item, index) => {
        console.log(`Cart item ${index}:`, {
          name: item.name,
          quantity: item.quantity,
          additionalUnit: item.additionalUnit,
          price: item.price,
          product: item.product,
          priceList: item.product?.priceList,
          priceListAdditional: item.product?.priceListAdditional
        });
      });
    }
  }, [router.isReady, router.query.dynamicPricing, router.query.linkId, addAPIDataToCart]);
  const checkVerifyAccountRequest = async () => {
    return await checkEmailVerificationStatus(userData?.user?.email);
  };

  // useEffect(async () => {
  //   if (!userData?.isLoggedIn) return
  //   const response = await checkEmailVerificationStatus(userData?.user?.email)
  //   if (response?.status === 200) {
  //     if (!response?.data?.emailVerified) {
  //       reSendRegistrationMail(null, 'checkout')
  //       setShouldShowVerifyModel(true)
  //     }
  //   }
  // }, [])

  // useEffect(() => {
  //   verifyLoggedIn()
  //   // if (!userData.isLoggedIn) {
  //   //   return router.push("/login-register");
  //   // }
  //   // checkVerifyAccountRequest().then((res) => {
  //   //   if (res?.data?.emailVerified == true) {
  //   //     return;
  //   //   } else {
  //   //     return router.push("/userlogin");
  //   //   }
  //   // });
  // }, [])

  // useEffect(() => {
  //   if (localStorage.getItem("MyBusinessDetails")) {
  //     setBusinessPopShown(true)
  //   }
  // }, [businessPopupShown])

  useEffect(() => {
    if (!userData.isLoggedIn) {
      return;
    }
    setUserDetail(userData);
    setIsShowModel(false);
    return () => {
      setUserDetail({});
      setIsShowModel(false);
    };
  }, [userData]);

  // Restore cart from localStorage if it gets cleared during navigation
  useEffect(() => {
    const isModuleOrder = router.query.moduleOrder === "true" || localStorage.getItem("modulepurchase") === "true";
    
    console.log("=== CART RESTORATION DEBUGGING ===");
    console.log("isModuleOrder:", isModuleOrder);
    console.log("Current cartItems:", cartItems);
    console.log("moduleProducts check:", {
      hasModuleProducts: !!cartItems?.moduleProducts,
      moduleProductsLength: cartItems?.moduleProducts?.length || 0,
      isEmpty: !cartItems?.moduleProducts || cartItems.moduleProducts.length === 0
    });
    
    if (isModuleOrder && (!cartItems?.moduleProducts || cartItems.moduleProducts.length === 0)) {
      const cartBackup = localStorage.getItem("checkoutCartBackup");
      console.log("Cart backup found:", cartBackup);
      
      if (cartBackup) {
        try {
          const restoredCart = JSON.parse(cartBackup);
          console.log("Restoring cart from localStorage backup:", restoredCart);
          
          // Format the restored cart for Redux with proper product structure
          const moduleProducts = restoredCart.map((item) => {
            // Use the stored prices from the cart item
            const mainPrice = item.mainPrice || item.price || 0;
            const additionalPrice = item.additionalPrice || item.price || 0;
            
            console.log(`Restoring cart item ${item.name}:`, {
              mainPrice,
              additionalPrice,
              quantity: item.quantity,
              additionalUnit: item.additionalUnit,
              maintenancePrice: item.maintenancePrice
            });
            
            // Build the cart item with proper structure for CartSummary
            const cartItem = {
              product: item.productId, // Product ID as string for API compatibility
              quantity: item.quantity,
              additionalUnit: item.additionalUnit || 0,
              cartItemId: item.productId,
              // CRITICAL: Preserve monthly maintenance cost - this is the value that gets lost!
              maintenancePrice: item.maintenancePrice || 0,
              // Preserve pricing information for display
              name: item.name || "",
              // Store both prices separately
              mainPrice: mainPrice,
              additionalPrice: additionalPrice,
              // For backward compatibility, keep the price field
              price: item.price || 0,
              currency: item.currency || "USD",
              currencySymbol: item.currencySymbol || "$",
              thumbImage: item.thumbImage || [],
              slug: item.slug || ""
            };
            
            // Add the full product object (CartSummary expects this in item.product)
            // IMPORTANT: priceList should contain MONTHLY MAINTENANCE, not startup price
            cartItem.product = {
              _id: item.productId,
              name: item.name || "",
              // priceList should be monthly maintenance (from item.maintenancePrice)
              priceList: [{
                price: item.maintenancePrice || 0,  // This is the $6/month maintenance
                currency: item.currency || "USD"
              }],
              // priceListAdditional is for additional users per month
              priceListAdditional: [{
                price: additionalPrice,  // Per-user additional cost
                currency: item.currency || "USD"
              }],
              // Store startup price separately
              startupPriceList: [{
                price: mainPrice,  // This is the $60 one-time startup
                currency: item.currency || "USD"
              }],
              thumbImage: item.thumbImage || [],
              slug: item.slug || ""
            };
            
            return cartItem;
          });
          
          console.log("Formatted moduleProducts for Redux:", moduleProducts);
          
          // Dispatch to Redux to restore the cart
          addAPIDataToCart({
            moduleProducts: moduleProducts,
            isModuleProduct: true
          });
          
          console.log("Cart restored successfully, dispatched to Redux");
          
          // Add a small delay to ensure Redux state is updated
          setTimeout(() => {
            console.log("Redux state should be updated now");
          }, 100);
        } catch (error) {
          console.error("Error restoring cart from localStorage:", error);
        }
      } else {
        console.log("No cart backup found in localStorage");
      }
    } else {
      console.log("Cart restoration not needed - module order or cart has items");
    }
  }, [cartItems, router.query.moduleOrder, addAPIDataToCart]);

  // Monitor cart changes to detect unexpected clearing
  useEffect(() => {
    const isModuleOrder = router.query.moduleOrder === "true" || localStorage.getItem("modulepurchase") === "true";
    
    if (isModuleOrder) {
      console.log("=== CHECKOUT CART DEBUGGING ===");
      console.log("Cart items changed:", cartItems);
      console.log("Cart items structure:", {
        hasProducts: !!cartItems?.products,
        productsLength: cartItems?.products?.length || 0,
        hasModuleProducts: !!cartItems?.moduleProducts,
        moduleProductsLength: cartItems?.moduleProducts?.length || 0,
        hasHiddenProducts: !!cartItems?.hiddenProducts,
        hiddenProductsLength: cartItems?.hiddenProducts?.length || 0,
        cartItemsKeys: cartItems ? Object.keys(cartItems) : []
      });
      
      if (cartItems?.moduleProducts && cartItems.moduleProducts.length > 0) {
        console.log("Cart has module products, clearing backup");
        console.log("Module products:", cartItems.moduleProducts);
        localStorage.removeItem("checkoutCartBackup");
      } else if (cartItems?.moduleProducts && cartItems.moduleProducts.length === 0) {
        console.warn("Cart was cleared unexpectedly! Module products array is empty");
        const cartBackup = localStorage.getItem("checkoutCartBackup");
        if (cartBackup) {
          console.log("Cart backup available:", cartBackup);
        }
      }
      
      // Check if we have any cart data at all
      if (!cartItems?.products && !cartItems?.moduleProducts && !cartItems?.hiddenProducts) {
        console.warn("No cart data found at all!");
      }
    }
  }, [cartItems, router.query.moduleOrder]);

  // Cleanup localStorage when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Only cleanup if we're not going to success page
      if (!window.location.pathname.includes('/checkout/success')) {
        console.log("Cleaning up checkout localStorage items");
        localStorage.removeItem("checkoutCartBackup");
        localStorage.removeItem("modulepurchase");
      }
    };
  }, []);

  const showSuccessModel = (shouldShow, message) => {
    setShowLoginPopup(!showLoginPopup);
    setShouldShowSuccessModel(shouldShow);
    setSuccessMessage(message);
  };

  const reSendRegistrationMail = async (userEmail, origin) => {
    try {
      setIsVerifyEmailSent(false);
      const res = await resendVerificationOTP(
        userData?.user?.email || userEmail,
        origin
      );
      if (res?.status === 200) {
        setIsVerifyEmailSent(true);
        addToast(
          `A six-digit code has been sent to ${userData?.user?.email}. It will expire within 5 minutes.`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
      } else {
        addToast(res?.data?.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      addToast(error?.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const closeLoginModel = async ({ flow } = {}) => {
    await validateUser();
    document.querySelector("body").classList.remove("overflow-hidden");
    setShowLoginPopup(false);
    if (origin === "apply-coupon") {
      return setActionSuccessType("SUCCESS_COUPON_APPLY");
    }

    if (origin === "change-currency") {
      return setActionSuccessType("SUCCESS_CHANGE_CURRENCY");
    }

    const { data } = await me();

    if (data?.emailVerificationStatus === "UNVERIFIED") {
      if (flow === "login") {
        reSendRegistrationMail(data?.email, origin);
      }
      return setShouldShowVerifyModel(true);
    }
  };

  const handleRedirect = () => {
    setCalculatorCheckout(true);
    setCarbonPopupShown(true);
  };

  const Checkout = () => (
    <div className="main-checkout-holder">
      {showLoginPopup && (
        <NewLoginRegisterModel
          resetCircleDataIndex={resetCircleDataIndex}
          closeModel={closeLoginModel}
          showSuccessModel={showSuccessModel}
          circleSliderData={circleSliderData}
          setEmail={setEmail}
          cartItems={cartItems}
          setUserEmail={setUserEmail}
          setIsShowModel={setShowLoginPopup}
          addAPIDataToCart={addAPIDataToCart}
          addAPIDataToWishlist={addAPIDataToWishlist}
          wishlistItems={wishlistItems}
          origin={origin}
          handleForgotPasswordPopup={handleForgotPasswordPopup}
          userData={userData}
          setIsVerifyEmailSent={setIsVerifyEmailSent}
        />
      )}

      {showForgotPasswordPopup ? (
        <Resetpasswordflow
          setShowForgotPasswordPopup={setShowForgotPasswordPopup}
          setShowPreviousPopup={setShowLoginPopup}
        />
      ) : (
        ""
      )}

      {shouldShowSuccessModel && (
        <RegistrationSuccessPopup
          setShouldShowSuccessModel={setShouldShowSuccessModel}
          email={email || userData?.user?.email}
        />
      )}
      {shouldShowVerifyModel && (
        <div>
          <VerifyPopup
            isVerifyEmailSent={isVerifyEmailSent}
            setIsVerifyEmailSent={setIsVerifyEmailSent}
            setShouldShowVerifyModel={setShouldShowVerifyModel}
            email={userData?.user?.email}
            reSendRegistrationMail={reSendRegistrationMail}
            origin={"checkout"}
            originCalculator={router.query.carbonCalculated == "true"}
          />
        </div>
      )}
      {shouldShowCarbonOffsetModel && !carbonPopupShown && (
        <CarbonOffsetPopup
          setShowPopup={setShouldShowCarbonOffsetModel}
          handleRedirect={handleRedirect}
          remainingAmount={router.query.remainingAmount}
          totalAmount={router.query.totalAmount}
          carbonPopupShown={carbonPopupShown}
        />
      )}
      {businessPopupShown ? (
        <BusinessPopup
          // setShowPopup={businessPopupShown}
          handleRedirect={handleRedirect}
          businessPopupShown={businessPopupShown}
          isBusinessOrder={isBusinessOrder}
          setIsBusinessOrder={setIsBusinessOrder}
          setBusinessPopShown={setBusinessPopShown}
        />
      ) : (<></>)}

      <div
        style={{ background: "rgba(0, 0, 0, 0.51)", postion: "absolute" }}
        className={showCurrencyOverlay ? "main-checkout-overlay" : ""}
      />
      <LayoutTwo>
        {/* breadcrumb */}
        <BreadcrumbOne
          pageTitle="Pricing Proposal"
          className="bg--7"
        // backgroundImage="https://ik.imagekit.io/anik/13_Depk2svdUg.png?ik-sdk-version=javascript-1.4.3&updatedAt=1657793951929"
        >
          <ul className="breadcrumb__list">
            <li>
              <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                <a>Home</a>
              </Link>
            </li>

            <li>Pricing Proposal</li>
          </ul>
        </BreadcrumbOne>
        <div className="checkout-area space-mt--r130 space-mb--r130">
          <DynamicPriceCheckoutForm
            showLoginPopup={showLoginPopup}
            setShowLoginPopup={setShowLoginPopup}
            checkoutElement={checkoutElement}
            userDetail={userDetail}
            userData={userData}
            cartItems={cartItems}
            setShouldShowCarbonOffsetModel={setShouldShowCarbonOffsetModel}
            express={router?.query?.express === "true"}
            openLoginModel={() => setIsShowModel(true)}
            showSuccessModel={showSuccessModel}
            showCurrencyOverlay={showCurrencyOverlay}
            setShowCurrencyOverlay={setShowCurrencyOverlay}
            setShouldShowVerifyModel={setShouldShowVerifyModel}
            reSendRegistrationMail={reSendRegistrationMail}
            calculatorCheckout={calculatorCheckout}
            setCalculatorCheckout={setCalculatorCheckout}
            shouldShowCarbonOffsetModel={shouldShowCarbonOffsetModel}
            carbonPopupShown={carbonPopupShown}
            setCarbonPopupShown={setCarbonPopupShown}
            setOrigin={setOrigin}
            actionSuccessType={actionSuccessType}
            setActionSuccessType={setActionSuccessType}
            setBusinessPopShown={setBusinessPopShown}
            isBusinessOrder={isBusinessOrder}
            setIsBusinessOrder={setIsBusinessOrder}
          />
        </div>
      </LayoutTwo>
    </div>
  );

  return <> {Checkout()} </>;
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    userData: state.userData,
    wishlistItems: state.wishlistData,
    circleSliderData: state.circleSliderData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    validateUser: () => {
      dispatch(validateUser());
    },
    resetCircleDataIndex: () => {
      dispatch(resetCircleDataIndex());
    },
    setUserEmail: (email) => {
      dispatch(setUserEmail(email));
    },
    addAPIDataToCart: (data) => {
      dispatch(addAPIDataToCart(data));
    },
    addAPIDataToWishlist: (newData, data) => {
      dispatch(addAPIDataToWishlist(newData, data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
