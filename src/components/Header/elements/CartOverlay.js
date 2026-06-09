import Link from "next/link";
import { IoIosClose } from "react-icons/io";
import CustomScroll from "react-custom-scroll";
import { connect } from "react-redux";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../../lib/product";
import {
  addAPIDataToCart,
  deleteAllFromCart,
  deleteFromCart,
  setCartCurrency,
  updateCartForCurrency,
} from "../../../redux/actions/cartActions";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  setUserCurrencyPreference,
  setUserEmail,
  validateUser,
} from "src/redux/actions/userAction";
import { getCart } from "src/apiClient/cart";
import regionPrice from "src/helpers/regionPrice";
import NewLoginRegisterModel from "src/components/NewLoginRegisterModal";
import RegistrationSuccessPopup from "src/components/registrationSuccessPopup";
import VerifyEmailPopup from "src/components/verifyEmailPopup";
import { applyCouponToAPI } from "src/apiClient/coupon";
// import { addCoupon } from "src/redux/actions/couponActions";
import { saveCoupon } from "src/helpers/applyCoupon";
import { updateApiCartData } from "src/redux/store";
import { addAPIDataToWishlist } from "src/redux/actions/wishlistActions";
import {
  checkEmailVerificationStatus,
  me,
  resendVerificationOTP,
  setCurrency,
} from "src/apiClient/auth";
import formatCurrency from "src/helpers/formatCurrency";
import { resetCircleDataIndex } from "src/redux/actions/carbonCalculatorActions";
import { Spinner } from "react-bootstrap";
import { addOrder } from "src/redux/actions/orderActions";
import { addToastRequest, setToastRequest } from "src/apiClient/request";
import {
  validateUserHelper,
  userCurrencyPreferenceHelper,
  setValidateUserHelper,
  setUserCurrencyPreferenceHelper,
  cartCurrencyHelper,
  setCartCurrencyHelper,
  logoutCheckoutCurrencyAction,
} from "src/helpers/currencyActionHelper";
import { getCookie, deleteCookie } from "cookies-next";
import CartSummary from "src/components/common/cartSummary";
import getCouponText from "src/components/helpers/getCouponText";

// Helper function to get currency symbol
const getCurrencySymbol = (currency = "USD") => {
  const currencyMap = {
    USD: "$",
    CAD: "$",
    GBP: "£",
    EUR: "€",
    INR: "₹",
    JPY: "¥",
    CNY: "¥",
  };
  return currencyMap[currency] || "$";
};

// Helper function to safely get image from thumbImage array
const getSafeImage = (thumbImage, index = 0, fallback = '/assets/images/default-product.png') => {
  if (!thumbImage || !Array.isArray(thumbImage) || thumbImage.length <= index) {
    return fallback;
  }
  return thumbImage[index];
};

const CartOverlay = ({
  activeStatus,
  getActiveStatus,
  cartItems,
  deleteFromCart,
  userData,
  validateUser,
  addCoupon,
  setUserEmail,
  addAPIDataToWishlist,
  addAPIDataToCart,
  wishlistItems,
  resetCircleDataIndex,
  circleSliderData,
  totalItemsInCart,
  setUserCurrencyPreference,
  setCartCurrency,
  updateCartForCurrency,
  deleteAllFromCart,
}) => {
  const { addToast } = useToasts();
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const currencyUpdateRef = useRef(true);
  const router = useRouter();
  const [couponCode, setCouponCode] = useState(
    cartItems?.couponData?.coupon || ""
  );
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [localTotal, setLocalTotal] = useState(0);
  const [localTotalQuantity, setLocalTotalQuantity] = useState(0);
  // const [tryToCheckout, setTryToCheckout] = useState
  const items = cartItems?.moduleProducts?.length
    ? cartItems.moduleProducts
    : (cartItems?.products || []);

  // const applyCouponUpdate = async () => {
  //   const res = await updateApiCartData(cartItems, userData?.currency, false);
  //   const data = res?.data?.data;
  //   const coupon = data?.coupon;
  //   const type = data?.couponType;
  //   const discount = data?.discount;
  //   const total = data?.orderTotal;
  //   const subTotal = data?.subTotal;
  //   const discountUnit = data?.discountUnit;
  //   console.log("here is discountunit", data);

  //   const stripeCode = {
  //     regular: data?.stripePaymentCouponId,
  //     subscription: data?.stripeSubscriptionCouponId,
  //   };

  //   console.log("all items", {
  //     type,
  //     coupon,
  //     discount,
  //     subTotal,
  //     total,
  //     discountUnit,
  //     stripeCode,
  //   });

  //   addCoupon(
  //     type,
  //     coupon,
  //     discount,
  //     subTotal,
  //     total,
  //     discountUnit,
  //     stripeCode,
  //     (name = "a")
  //   );
  // };

  // useEffect(() => {
  //   console.log("userdata", userData);
  //   if (userData?.isLoggedIn && cartItems.length > 0) {
  //     applyCouponUpdate().catch((err) => console.log(err));
  //   }
  // }, [cartItems]);

  useEffect(() => {
    if (activeStatus) {
      document.body.classList.add("scrollbar--change");
    } else {
      document.body.classList.remove("scrollbar--change");
    }
    return () => {
      document.body.classList.remove("scrollbar--change");
    };
  }, [activeStatus]);

  useEffect(() => {
    if (!addToastRequest) {
      setToastRequest(addToast);
    }
    if (!validateUserHelper) {
      setValidateUserHelper(validateUser);
    }

    if (!userCurrencyPreferenceHelper) {
      setUserCurrencyPreferenceHelper(setUserCurrencyPreference);
    }

    if (!cartCurrencyHelper) {
      setCartCurrencyHelper(setCartCurrency);
    }

    if (userData.isLoggedIn) {
      setUserDetail(userData);
      setIsShowModel(false);
    }

    return () => {
      setUserDetail({});
      setIsShowModel(false);
    };
  }, [userData]);

  // const addCSS = (css) =>
  //   (document.head.appendChild(document.createElement('style')).innerHTML = css)

  // const addCSS = (css) =>
  //   (document.head.appendChild(
  //     document.createElement('mainOverlay')
  //   ).innerHTML = css)

  useEffect(() => {
    if (currencyUpdateRef.current) {
      currencyUpdateRef.current = false;
      return;
    }
    // setCurrency(userData?.currency).catch((err) => console.log(err))
    if (
      window.location.search != "?loggedIn=true" &&
      window.location.path !== "/login-register" &&
      userData?.isLoggedIn
    )
      updateCartForCurrency(cartItems?.currency);
    // return () => {
    //   currencyUpdateRef.current = true
    // }
  }, [cartItems?.currency]);

  const handleViewCart = () => {
    if(localStorage.getItem("carbonroute")){
      localStorage.removeItem("BusinessOrderSelection")
      localStorage.removeItem("carbonroute")
    }
    setOrigin("view-cart");
    if (window.location.pathname === "/other/cart") {
      return getActiveStatus(false);
    }
    if (!userData.isLoggedIn) {
      // getActiveStatus(false);
      // return setIsShowModel(true)
    }
    setCartClicked(true);
    setCheckoutClicked(false);
    return router.push("/other/cart");
    // checkVerifyAccountRequest().then((res) => {
    //   if (res?.data?.emailVerified === true) {
    //     return router.push("/other/cart");
    //   } else {
    //     // return setShouldShowSuccessModel(true);
    //     return setShouldShowVerifyModel(true)
    //   }
    // });
  };
  const checkVerifyAccountRequest = async () => {
    return await checkEmailVerificationStatus(userData?.user?.email);
  };

  const handleCheckout = () => {
    setOrigin("checkout");
    if(localStorage.getItem("carbonroute")){
      localStorage.removeItem("BusinessOrderSelection")
      localStorage.removeItem("carbonroute")
    }
    if (window.location.pathname === "/other/checkout") {
      if (router.query.express) {
        router.push("/other/checkout", undefined, { shallow: true });
      }
      return getActiveStatus(false);
    }
    if (!userData.isLoggedIn) {
      // getActiveStatus(false);
      // return setIsShowModel(true)
    }
    router.push("/other/checkout", undefined, { shallow: true });
    setCheckoutClicked(true);
    setCartClicked(false);
    // checkVerifyAccountRequest().then((res) => {
    //   if (res?.data?.emailVerified == true) {
    //     setCheckoutClicked(true)
    //     setCartClicked(false)
    //     return router.push('/other/checkout')
    //   } else {
    //     // return setShouldShowSuccessModel(true);
    //     reSendRegistrationMail(null, 'checkout')
    //     return setShouldShowVerifyModel(true)
    //   }
    // })
  };

  const [isShowModel, setIsShowModel] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [cartClicked, setCartClicked] = useState(false);
  const [shouldShowSuccessModel, setShouldShowSuccessModel] = useState(false);
  const [shouldShowVerifyModel, setShouldShowVerifyModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState("");
  const [isVerifyEmailSent, setIsVerifyEmailSent] = useState(false);
  const [checkoutClicked, setCheckoutClicked] = useState(false);

  const showSuccessModel = (shouldShow, message) => {
    setIsShowModel(!shouldShow);
    setShouldShowSuccessModel(shouldShow);
    getActiveStatus(true);
    setSuccessMessage(message);
  };

  const closeLoginModel = async ({ flow } = {}) => {
    await validateUser();
    document.querySelector("body").classList.remove("overflow-hidden");
    const { data } = await me();
    if (data?.emailVerificationStatus === "UNVERIFIED") {
      if (flow === "login") {
        reSendRegistrationMail(data?.email, origin);
      }
      setShouldShowVerifyModel(true);
      if (!isVerifyEmailSent && flow !== "login") {
        setIsVerifyEmailSent(true);
      }
      return;
    }

    if (cartClicked) {
      setCartClicked(false);
      return router.push("/other/cart");
    }
    router.push("/other/checkout");
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
          `A six-digit code has been sent to ${
            email || userData?.user?.email
          }. It will expire within 5 minutes.`,
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
  return (
    <div className={`cart-overlay ${activeStatus ? "active" : ""}`}>
      <div>
        {isShowModel && (
          <NewLoginRegisterModel
            resetCircleDataIndex={resetCircleDataIndex}
            closeModel={closeLoginModel}
            showSuccessModel={showSuccessModel}
            setEmail={setEmail}
            cartItems={cartItems}
            setUserEmail={setUserEmail}
            setIsShowModel={setIsShowModel}
            addAPIDataToCart={addAPIDataToCart}
            addAPIDataToWishlist={addAPIDataToWishlist}
            wishlistItems={wishlistItems}
            origin={origin}
            circleSliderData={circleSliderData}
          />
        )}

        {shouldShowSuccessModel && (
          <RegistrationSuccessPopup
            setShouldShowSuccessModel={setShouldShowSuccessModel}
            email={email || userData?.user?.email}
          />
        )}
        {shouldShowVerifyModel && (
          <VerifyEmailPopup
            isVerifyEmailSent={isVerifyEmailSent}
            setIsVerifyEmailSent={setIsVerifyEmailSent}
            email={email || userData?.user?.email}
            setShouldShowVerifyModel={setShouldShowVerifyModel}
            reSendRegistrationMail={reSendRegistrationMail}
            origin={origin}
          />
        )}
      </div>
      <div className={`cart-overlay ${activeStatus ? "active" : ""}`}>
        {/* {console.log("HERE ARE THE CART ITEMs HERE", cartItems)} */}
        <div
          className="cart-overlay__close"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector("body").classList.remove("overflow-hidden");
          }}
        />
        <div className="cart-overlay__content">
          {/*=======  close icon  =======*/}
          <button
            className="cart-overlay__close-icon"
            onClick={() => {
              getActiveStatus(false);
              setShouldShowSuccessModel(false);
              document
                .querySelector("body")
                .classList.remove("overflow-hidden");
            }}
          >
            <IoIosClose />
          </button>
          {/*=======  offcanvas cart content container  =======*/}
          <div className="cart-overlay__content-container">
            <h3 className="cart-title">Cart</h3>
            {items.length >= 1 ? (
              <div
                className="clear--cart--holder cart--overlay"
                onClick={() => deleteAllFromCart(addToast)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.09922 1.7998C7.75832 1.7998 7.44669 1.99241 7.29424 2.29731L6.64299 3.5998H3.59922C3.10216 3.5998 2.69922 4.00275 2.69922 4.4998C2.69922 4.99686 3.10216 5.3998 3.59922 5.3998L3.59922 14.3998C3.59922 15.3939 4.40511 16.1998 5.39922 16.1998H12.5992C13.5933 16.1998 14.3992 15.3939 14.3992 14.3998V5.3998C14.8963 5.3998 15.2992 4.99686 15.2992 4.4998C15.2992 4.00275 14.8963 3.5998 14.3992 3.5998H11.3555L10.7042 2.29731C10.5518 1.99241 10.2401 1.7998 9.89922 1.7998H8.09922ZM6.29922 7.1998C6.29922 6.70275 6.70216 6.2998 7.19922 6.2998C7.69628 6.2998 8.09922 6.70275 8.09922 7.1998V12.5998C8.09922 13.0969 7.69628 13.4998 7.19922 13.4998C6.70216 13.4998 6.29922 13.0969 6.29922 12.5998V7.1998ZM10.7992 6.2998C10.3022 6.2998 9.89922 6.70275 9.89922 7.1998V12.5998C9.89922 13.0969 10.3022 13.4998 10.7992 13.4998C11.2963 13.4998 11.6992 13.0969 11.6992 12.5998V7.1998C11.6992 6.70275 11.2963 6.2998 10.7992 6.2998Z"
                    fill="#333333"
                  />
                </svg>
                <p>Clear Cart</p>
              </div>
            ) : (
              ""
            )}
            {items.length >= 1 ? (
              <div className="cart-product-wrapper">
                <div className="cart-product-container">
                  <CustomScroll allowOuterScroll={true}>
                    {items.map((item, i) => {
                      // For module products, the product field might just be an ID reference
                      // We need to get the actual product object with pricing information
                      let product = item?.product;
                      let productPrice = 0;
                      let productCurrency = "USD";
                      let productCurrencySymbol = "$";
                      let productName = item?.name || "Product";
                      
                      // If product is just an ID (string), we need to look it up
                      if (typeof product === 'string' || typeof product === 'number') {
                        // This is just an ID, we can't get pricing from it
                        // Use the stored pricing information from the item
                        productPrice = item?.price || 0;
                        productCurrency = item?.currency || "USD";
                        productCurrencySymbol = item?.currencySymbol || "$";
                        productName = item?.name || "Product";
                        
                        // Create a minimal product object for display
                        product = {
                          _id: item?.product,
                          name: item?.name || "Product",
                          thumbImage: item?.thumbImage || [],
                          slug: item?.slug || ""
                        };
                      } else if (product && typeof product === 'object') {
                        // This is a full product object, we can get pricing from it
                        try {
                          const regionPricing = regionPrice(product, {
                            currency: cartItems?.currency || userData?.currency,
                            isLoggedIn: userData?.isLoggedIn,
                          });
                          productPrice = regionPricing?.productPrice || 0;
                          productCurrency = regionPricing.currencyCode || "USD";
                          productCurrencySymbol = regionPricing.currencySymbol || "$";
                          productName = product?.name || "Product";
                        } catch (error) {
                          console.warn("Error getting region pricing:", error);
                          // Fallback to stored pricing if regionPrice fails
                          productPrice = item?.price || 0;
                          productCurrency = item?.currency || "USD";
                          productCurrencySymbol = item?.currencySymbol || "$";
                          productName = item?.name || product?.name || "Product";
                        }
                      }
                      
                      // Ensure we have valid pricing
                      if (productPrice === 0 && item?.price) { productPrice = item.price; }
                      if (productCurrency === "USD" && item?.currency) { productCurrency = item.currency; }
                      if (productCurrencySymbol === "$" && item?.currencySymbol) { productCurrencySymbol = item?.currencySymbol; }
                      
                      // Calculate totals for this item
                      const mainModuleTotal = productPrice * (item?.quantity || 1);
                      const additionalUnitsTotal = productPrice * (item?.additionalUnit || 0);
                      const itemTotal = mainModuleTotal + additionalUnitsTotal;
                      
                      return (
                        <div className="single-cart-product" key={i}>
                          <span className="cart-close-icon">
                            <button
                              onClick={() =>
                                deleteFromCart(product, addToast, cartItems)
                              }
                            >
                              <IoIosClose />
                            </button>
                          </span>
                          <div className="image">
                            <Link
                              href={`/shop/product-basic/[slug]?slug=${product?.slug}`}
                              as={`${process.env.PUBLIC_URL}/shop/product-basic/${product?.slug}`}
                            >
                              <a>
                                <img
                                  src={getSafeImage(product?.thumbImage, 0)}
                                  className="img-fluid"
                                  alt=""
                                />
                              </a>
                            </Link>
                          </div>
                          <div className="content">
                            <h5>
                              <Link
                                href={`/shop/product-basic/[slug]?slug=${product?.slug}`}
                                as={`${process.env.PUBLIC_URL}/shop/product-basic/${product?.slug}`}
                              >
                                <a style={{ maxWidth: "200px" }}>
                                  {productName}
                                </a>
                              </Link>
                            </h5>

                            <p>
                              <span className="cart-count">
                                {item?.quantity || 1} x{" "}
                              </span>{" "}
                              <span className="discounted-price">
                                {productCurrency} {productCurrencySymbol}
                                {formatCurrency(productPrice, productCurrency)}
                              </span>
                            </p>
                            {/* Show additional units if they exist */}
                            {item?.additionalUnit > 0 && (
                              <p className="additional-units">
                                <span className="cart-count">
                                  Additional {productName} × {item?.additionalUnit}
                                </span>
                                <span className="additional-price">
                                  {productCurrency} {productCurrencySymbol}
                                  {formatCurrency(additionalUnitsTotal, productCurrency)}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CustomScroll>
                </div>
                <div className="cart--summary--holder">
                  <CartSummary
                    cartItems={cartItems}
                    localTotalQuantity={localTotalQuantity}
                    localTotal={localTotal}
                    setLocalTotalQuantity={setLocalTotalQuantity}
                    setLocalTotal={setLocalTotal}
                    getCouponText={getCouponText}
                    couponCode={couponCode}
                    userData={userData}
                    currencySymbol={currencySymbol}
                    currencyCode={currencyCode}
                    setCurrencyCode={setCurrencyCode}
                    express={false}
                    showCurrencyOverlay={false}
                    showChangeCurrency={false}
                    isModuleOrder={cartItems?.moduleProducts?.length > 0}
                  />
                </div>
                {/* <p className="total--items--cartOverlay">
                  <span className="subtotal-title">Total items:</span>
                  <span className="ammount--total">{totalItemsInCart}</span>
                </p>
                <p className="cart-subtotal">
                  <span className="subtotal-title">Cart total:</span>

                  <span className="subtotal-amount">
                    {currencyCode} {currencySymbol}
                    {formatCurrency(
                      cartItems?.subTotal?.toFixed(2) ||
                        cartTotalPriceLocal?.toFixed(2),
                      currencyCode
                    )}
                  </span>
                </p> */}

                {/*=======  cart buttons  =======*/}
                <div
                  className="cart-buttons"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <div onClick={handleViewCart}>
                    <a>
                      {cartClicked ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        "view cart"
                      )}
                    </a>
                  </div>

                  <div onClick={handleCheckout}>
                    <a>
                      {checkoutClicked ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        "checkout"
                      )}
                    </a>
                  </div>
                </div>
                {/*=======  free shipping text  =======*/}
                <p className="free-shipping-text">No Additional Cost!</p>
              </div>
            ) : (
              <p className="no--item--in--cart">No items found in cart</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    userData: state.userData,
    circleSliderData: state.circleSliderData,
    wishlistItems: state.wishlistData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromCart: (item, addToast, cartItems) => {
      dispatch(deleteFromCart(item, addToast, cartItems));
    },
    deleteAllFromCart: (addToast) => {
      dispatch(deleteAllFromCart(addToast));
    },
    validateUser: (userData = {}) => {
      dispatch(validateUser(userData));
    },

    setUserEmail: (email) => {
      dispatch(setUserEmail(email));
    },

    setUserCurrencyPreference: (type, currency) => {
      dispatch(setUserCurrencyPreference(type, currency));
    },

    setCartCurrency: (currency) => {
      dispatch(setCartCurrency(currency));
    },

    addCoupon: (
      type,
      coupon,
      discount,
      subTotal,
      total,
      discountUnit,
      stripeCode,
      name
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
          name
        )
      );
    },
    updateCartForCurrency: (currency) => {
      dispatch(updateCartForCurrency(currency));
    },
    addAPIDataToCart: (data) => {
      dispatch(addAPIDataToCart(data));
    },
    addAPIDataToWishlist: (newData, data) => {
      dispatch(addAPIDataToWishlist(newData, data));
    },
    resetCircleDataIndex: () => {
      dispatch(resetCircleDataIndex());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartOverlay);
