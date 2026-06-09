import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  deleteAllFromCart,
  cartItemStock,
  addCoupon,
  removeCoupon,
  updateLocalCartCount,
  addAPIDataToCart,
} from "../../redux/actions/cartActions";
import { getDiscountPrice } from "../../lib/product";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { IoIosClose, IoMdCart } from "react-icons/io";
import { useRouter } from "next/router";
import UseModel from "src/components/use/model";
import LoginRegisterModel from "src/components/LoginRegisterModel";
import { setUserEmail, validateUser } from "src/redux/actions/userAction";
import {
  applyCouponToAPI,
  checkCoupon,
  unApplyCouponToAPI,
} from "src/apiClient/coupon";
import regionPrice from "src/helpers/regionPrice";
import { saveCoupon } from "src/helpers/applyCoupon";
import {
  checkEmailVerificationStatus,
  me,
  resendVerificationOTP,
} from "src/apiClient/auth";
import formatCurrency from "src/helpers/formatCurrency";
import buttonStatusHandler from "src/helpers/buttonStatusHandler";
import { deleteItemFromCart, updateCart } from "src/apiClient/cart";
import _debounce, { _newDebounce } from "src/helpers/debounce";
import { resetCircleDataIndex } from "src/redux/actions/carbonCalculatorActions";
import { addAPIDataToWishlist } from "src/redux/actions/wishlistActions";
import NewLoginRegisterModel from "src/components/NewLoginRegisterModal";
import CartSummary from "src/components/common/cartSummary";
import getCouponText from "src/components/helpers/getCouponText";

// Helper function to safely get image from thumbImage array
const getSafeImage = (thumbImage, index = 0, fallback = '/assets/images/default-product.png') => {
  if (!thumbImage || !Array.isArray(thumbImage) || thumbImage.length <= index) {
    return fallback;
  }
  return thumbImage[index];
};

const DELETE_FROM_CART_PRODUCT = "DELETE_FROM_CART_PRODUCT";
const ADD_TO_CART_PRODUCT_INITIAL = "ADD_TO_CART_PRODUCT_INITIAL";
const REDUCE_QUANTITY_TO_CART = "REDUCE_QUANTITY_TO_CART";
const ADD_QUANTITY_TO_CART = "ADD_QUANTITY_TO_CART";
let shouldPerformLocalStateUpdate = true;

// import { addAllToCart } from "../../redux/actions/cartActions";
const { setDebounce, removeDebounce } = _newDebounce();
const Cart = ({
  cartItems,
  decreaseQuantity,
  increaseQuantity,
  resetCircleDataIndex,
  deleteFromCart,
  deleteAllFromCart,
  userData,
  validateUser,
  addCoupon,
  removeCoupon,
  updateLocalCartCount,
  addAPIDataToCart,
  addAPIDataToWishlist,
  wishlistItems,
  circleSliderData,
  setUserEmail,
}) => {
  const { addToast } = useToasts();

  const router = useRouter();
  const [reRender, setreRender] = useState(false);
  const [applyCouponPressed, setApplyCouponPressed] = useState(false);
  const [checkoutPressed, setCheckoutPressed] = useState(false);
  const [email, setEmail] = useState("");
  const [isShowModel, setIsShowModel] = useState(false);
  const [origin, setOrigin] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [actionSuccessType, setActionSuccessType] = useState("");
  const [isVerifyEmailSent, setIsVerifyEmailSent] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [localTotal, setLocalTotal] = useState(0);
  const [localTotalQuantity, setLocalTotalQuantity] = useState(0);

  const checkVerifyAccountRequest = async () => {
    return await checkEmailVerificationStatus(userData?.user?.email);
  };

  // useEffect(() => {
  //   validateUser()
  //   !userData.isLoggedIn && router.push('/login-register')
  // checkVerifyAccountRequest().then((res) => {
  //   if (res?.data?.emailVerified === true) {
  //   } else {
  //     return router.push("/userlogin");
  //   }
  // });
  //   userData.isLoggedIn && setUserLoggedIn(true)
  // }, [])

  const debounceQuantityChange = useCallback(
    setDebounce(
      (func, id, quantity, cartItems, type) => {
        if (type === ADD_QUANTITY_TO_CART) {
          return func({ _id: id }, addToast, quantity, cartItems);
        }

        if (type === REDUCE_QUANTITY_TO_CART) {
          return func(
            { _id: id },
            addToast,
            cartItems,
            true,
            quantity,
            false,
            userData?.isLoggedIn,
            true
          );
        }

        // if (type === DELETE_FROM_CART_PRODUCT) {
        //   return func({ _id: id }, addToast, cartItems)
        // }
      },
      userData?.isLoggedIn ? 3000 : 0.1
    ),
    []
  );

  const checkoutElement = useRef();
  let refferalCheck = localStorage.getItem("ReferralID") && localStorage.getItem("userId") !== localStorage.getItem("ReferralID") && localStorage.getItem("TotalOrders") == 0


  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  }, []);

  useEffect(() => {
    if (refferalCheck) {
      setTimeout(() => {
        handleApplyCoupon({
          preventDefault: () => {
            console.log("");
          },
        });
      }, 1000)
    }
  }, [])

  useEffect(() => {
    if (!userData.isLoggedIn) return;
    setUserDetail(userData);
    setIsShowModel(false);
    return () => {
      setUserDetail({});
      setIsShowModel(false);
    };
  }, [userData]);

  useEffect(() => {
    if (shouldPerformLocalStateUpdate) {
      const moduleItems = Array.isArray(cartItems?.moduleProducts) ? cartItems.moduleProducts : [];
      const regularItems = Array.isArray(cartItems?.products) ? cartItems.products : [];
      const allItems = moduleItems.length ? moduleItems : regularItems;
      setLocalProducts(allItems);
    }

    return () => {
      shouldPerformLocalStateUpdate = true;
    };
  }, [cartItems?.products, cartItems?.moduleProducts]);

  const handleCheckout = () => {
    setCheckoutPressed(true);
    return router.push("/other/checkout");

    // if (!userData.isLoggedIn) {
    //   console.log('NOT LOGGED IN')
    //   return setIsShowModel(true)
    // }
    // router.push('/other/checkout');
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
          `A six-digit code has been sent to ${email || userData?.user?.email
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

  const saveCouponFunc = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await saveCoupon(
          couponCode,
          addCoupon,
          addToast,
          setreRender,
          false,
          setCouponCode
        );
        resolve();
      } catch (err) {
        reject(err.message);
      }
    });
  };

  const closeLoginModel = async ({ flow } = {}) => {
    setShowLoginPopup(false);
    await validateUser();
    document.querySelector("body").classList.remove("overflow-hidden");
    if (origin === "apply-coupon") {
      setActionSuccessType("SUCCESS_COUPON_APPLY");
    }

    // const { data } = await me()
    // if (data?.emailVerificationStatus === 'UNVERIFIED') {
    //   if (flow === 'login') {
    //     reSendRegistrationMail(data?.email, origin)
    //   }
    //   setShouldShowVerifyModel(true)
    //   if (!isVerifyEmailSent && flow !== 'login') {
    //     setIsVerifyEmailSent(true)
    //   }
    //   return
    // }

    // if (cartClicked) {
    //   setCartClicked(false)
    //   return router.push('/other/cart')
    // }
    // router.push('/other/checkout')
  };

  useEffect(() => {
    if (actionSuccessType === "SUCCESS_COUPON_APPLY")
      handleApplyCoupon({
        preventDefault: () => console.log(""),
      });

    return () => {
      setActionSuccessType("");
    };
  }, [actionSuccessType]);

  const showSuccessModel = (shouldShow, message) => {
    setShowLoginPopup(false);
    setIsShowModel(!shouldShow);
    setShouldShowSuccessModel(shouldShow);
    // getActiveStatus(true)
    setSuccessMessage(message);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (couponCode === "ED3VY7" && !refferalCheck) return addToast("refferal code cannot be applied manually", {
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

    await buttonStatusHandler(setApplyCouponPressed, saveCouponFunc);
  };
  const [dynamicPrices, setDynamicPrices] = useState({});

  const [localProducts, setLocalProducts] = useState(
    cartItems?.moduleProducts?.length
      ? cartItems.moduleProducts
      : cartItems?.products || []
  );

  // const [isShowModel, setIsShowModel] = useState(false)
  const [userDetail, setUserDetail] = useState({});
  const [couponCode, setCouponCode] = useState(
    refferalCheck ? "ED3VY7" : cartItems?.couponData?.coupon
  );
  const [shouldShowSuccessModel, setShouldShowSuccessModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // const showSuccessModel = (shouldShow, message) => {
  //   setIsShowModel(!shouldShow)
  //   setShouldShowSuccessModel(shouldShow)
  //   setSuccessMessage(message)
  //   setTimeout(() => {
  //     setShouldShowSuccessModel(false)
  //   }, 5000)
  // }

  useEffect(() => {
    setDynamicPrices({
      ...cartItems?.couponData,
      total: cartItems?.orderTotal,
    });
    return () => {
      setDynamicPrices({});
    };
  }, [cartItems]);

  // const closeLoginModel = () => {
  //   router.push('/other/checkout')
  //   validateUser()
  // }

  // const debounceDeleteFromCart = useCallback(
  //   _debounce((func, id) => {
  //     func({ _id: id }, addToast, { products: localProducts });
  //   }, 7000),
  //   []
  // );

  // const debounceAddToCart = useCallback(
  //   _debounce((func, id, quantity) => {
  //     func({ cartItemId: id }, addToast, quantity, { products: localProducts });
  //   }, 7000),
  //   []
  // );

  // const debounceReduceQuantityToCart = useCallback(
  //   _debounce((func, id, quantity) => {
  //     func({ _id: id }, addToast, { products: localProducts }, true, quantity);
  //   }, 7000),
  //   []
  // );

  const createHandleQuantityFunc = (id, type, quantityCount = 0) => {
    const isModule = cartItems?.moduleProducts?.length > 0;
    const cartDataPayload = isModule
      ? { products: [], moduleProducts: localProducts }
      : { products: localProducts };
    return new Promise(async (resolve, reject) => {
      try {
        if (type === "DELETE_ITEM_FROM_CART") {
          await deleteFromCart({ _id: id }, addToast, cartDataPayload);
        } else {
          await increaseQuantity({ _id: id }, addToast, quantityCount, cartDataPayload);
        }
        resolve();
      } catch (err) {
        reject(err.message);
      }
    });
  };
  const handleQuantityChange = (changeState, id) => {
    shouldPerformLocalStateUpdate
      ? (shouldPerformLocalStateUpdate = false)
      : "";
    let changedProducts;
    if (changeState === "INCREASE_QUANTITY") {
      changedProducts = localProducts?.map((each) => {
        if (each?.cartItemId === id) {
          debounceQuantityChange(
            increaseQuantity,
            id,
            each?.quantity + 1,
            cartItems,
            ADD_QUANTITY_TO_CART
          );
          each.quantity = each?.quantity + 1;
        }
        return each;
      });
      updateLocalCartCount(cartItems?.localCartCount + 1);
    } else if (changeState === "DECREASE_QUANTITY") {
      changedProducts = localProducts?.map((each) => {
        if (each?.cartItemId === id) {
          if (each?.quantity === 1) {
            setTimeout(
              () => {
                removeDebounce();
                deleteFromCart({ _id: id }, addToast, cartItems);
              },
              userData?.isLoggedIn ? 3000 : 0.1
            );
            // debounceQuantityChange(
            //   deleteFromCart,
            //   id,
            //   '',
            //   cartItems,x
            //   DELETE_FROM_CART_PRODUCT
            // )
            return null;
            // debounceDeleteFromCart(deleteFromCart, id);
            // deleteItemFromCart(each?.cartItemId, false).catch((err) =>
            //   console.log(err)
            // );
          } else {
            debounceQuantityChange(
              decreaseQuantity,
              id,
              each?.quantity - 1,
              cartItems,
              REDUCE_QUANTITY_TO_CART
            );
            // debounceReduceQuantityToCart(
            //   decreaseQuantity,
            //   id,
            //   each?.quantity - 1
            // );
            each.quantity = each?.quantity - 1;
            return each;
          }
        } else {
          return each;
        }
      });
      updateLocalCartCount(cartItems?.localCartCount - 1);
    } else if (changeState === "DELETE_ITEM_FROM_CART") {
      setTimeout(
        () => {
          deleteFromCart({ _id: id }, addToast, cartItems);
        },
        userData?.isLoggedIn ? 3000 : 0.1
      );
      // debounceDeleteFromCart(deleteFromCart, id);
      const totalItemsInCart = 0;
      changedProducts = localProducts?.map((each) => {
        if (each?.cartItemId !== id) {
          totalItemsInCart += each?.quantity;
          return each;
        } else {
          return null;
        }
      });
      updateLocalCartCount(totalItemsInCart);
    }
    const filtered = changedProducts?.filter((each) => each !== null);
    setLocalProducts(filtered);
  };

  const unApplyCoupon = () => {
    if (!couponCode) return;
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

  const cartLayout = (
    <div>
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
          actionSuccessType={actionSuccessType}
          setActionSuccessType={setActionSuccessType}
          userData={userData}
        />
      )}

      <LayoutTwo>
        {/* breadcrumb */}
        <BreadcrumbOne pageTitle="Cart" className="bg--4">
          <ul className="breadcrumb__list">
            <li>
              <a href="/" as={process.env.PUBLIC_URL + "/"}>
                <div>Home</div>
              </a>
            </li>

            <li>Cart</li>
          </ul>
        </BreadcrumbOne>

        {/* cart content */}
        <div className="checkout-area space-mt--r130 space-mb--r130"></div>
        <div className="cart-content space-mt--r130 space-mb--r130">
          <Container>
            {localProducts && localProducts?.length >= 1 ? (
              <Row>
                <Col lg={12}>
                  {/* cart table */}
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th className="product-name" colSpan="2">
                          Product
                        </th>
                        <th className="product-price">Price</th>
                        <th className="product-quantity">Quantity</th>
                        <th className="product-subtotal">Total</th>
                        <th className="product-remove">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localProducts?.map((item, i) => {
                        // For module products, the product field might just be an ID reference
                        // We need to get the actual product object with pricing information
                        let product = item?.product;
                        let productPrice = 0;
                        let productCurrency = "USD";
                        let productCurrencySymbol = "$";
                        let productName = item?.name || "Product";
                        
                        // If product is just an ID (string), we need to look it up
                        if (typeof product === 'string' || typeof product === 'number') {
                          // This is just an ID, we can't get pricing from it in this component
                          // We'll use the item's stored price information if available
                          productPrice = item?.price || 0;
                          productCurrency = item?.currency || "USD";
                          productCurrencySymbol = item?.currencySymbol || "$";
                          productName = item?.name || "Product";
                          
                          // Create a minimal product object for display
                          product = {
                            _id: item?.product,
                            name: productName,
                            thumbImage: item?.thumbImage || [],
                            slug: item?.slug || ""
                          };
                        } else if (product && typeof product === 'object') {
                          // Product is a full object, use regionPrice to get pricing
                          try {
                            const regionPricing = regionPrice(product, {
                              currency: cartItems?.currency || userData?.currency,
                              isLoggedIn: userData?.isLoggedIn,
                            });
                            productCurrency = regionPricing.currencyCode;
                            productCurrencySymbol = regionPricing.currencySymbol;
                            productPrice = regionPricing?.productPrice || 0;
                            productName = product?.name || item?.name || "Product";
                          } catch (error) {
                            console.warn("Error getting region pricing:", error);
                            // Fallback to stored pricing if available
                            productPrice = item?.price || 0;
                            productCurrency = item?.currency || "USD";
                            productCurrencySymbol = item?.currencySymbol || "$";
                            productName = item?.name || product?.name || "Product";
                          }
                        }

                        // Ensure we have valid pricing
                        if (productPrice === 0 && item?.price) {
                          productPrice = item.price;
                        }
                        if (productCurrency === "USD" && item?.currency) {
                          productCurrency = item.currency;
                        }
                        if (productCurrencySymbol === "$" && item?.currencySymbol) {
                          productCurrencySymbol = item.currencySymbol;
                        }

                        // Totals are calculated by CartSummary component
                        
                        return (
                          <tr key={i}>
                            <td className="product-thumbnail">
                              <Link
                                href={`/shop/product-basic/${product.slug}`}
                                as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                              >
                                <div style={{ cursor: "pointer" }}>
                                  <img
                                    src={getSafeImage(product?.thumbImage, 0)}
                                    className="img-fluid"
                                    alt=""
                                  />
                                </div>
                              </Link>
                            </td>
                            <td className="product-name">
                              <Link
                                href={`/shop/product-basic/${product.slug}`}
                                as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                              >
                                <div style={{ cursor: "pointer" }}>
                                  {productName}
                                </div>
                              </Link>
                              {product.selectedProductColor &&
                                product.selectedProductSize ? (
                                <div className="product-variation">
                                  <span>
                                    Color: {product.selectedProductColor}
                                  </span>
                                  <span>
                                    Size: {product.selectedProductSize}
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                            </td>

                            <td className="product-price">
                              <span className="price">
                                <span style={{ marginRight: "5px" }}>
                                  {productCurrency}
                                </span>
                                {productCurrencySymbol}
                                {formatCurrency(productPrice, productCurrency)}
                              </span>
                            </td>

                            <td className="product-quantity">
                              <div className="cart-plus-minus">
                                <button
                                  className="dec qtybutton"
                                  onClick={
                                    () =>
                                      handleQuantityChange(
                                        "DECREASE_QUANTITY",
                                        item?.cartItemId
                                      )
                                    // decreaseQuantity(product, addToast, cartItems)
                                  }
                                >
                                  -
                                </button>
                                <input style={{ background: "none" }}
                                  className="cart-plus-minus-box"
                                  type="text"
                                  value={item?.quantity || 1}
                                  readOnly
                                />
                                <button
                                  className="inc qtybutton"
                                  onClick={() =>
                                    handleQuantityChange(
                                      "INCREASE_QUANTITY",
                                      item?.cartItemId
                                    )
                                  }
                                  disabled={
                                    product !== undefined &&
                                    item?.quantity &&
                                    item?.quantity >=
                                    cartItemStock(
                                      product,
                                      product.selectedProductColor,
                                      product.selectedProductSize
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                              {/* Show additional units if they exist */}
                              {item?.additionalUnit > 0 && (
                                <div className="additional-units-display">
                                  <small className="text-muted">
                                    + {item.additionalUnit} additional units
                                  </small>
                                </div>
                              )}
                            </td>

                            <td className="total-price">
                              <span className="price">
                                <span style={{ marginRight: "5px" }}>
                                  {productCurrency}
                                </span>
                                {productCurrencySymbol}
                                {formatCurrency(
                                  (productPrice * ((item?.quantity || 1) + (item?.additionalUnit || 0))).toFixed(2),
                                  productCurrency
                                )}
                              </span>
                            </td>

                            <td className="product-remove">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    "DELETE_ITEM_FROM_CART",
                                    item?.cartItemId
                                  )
                                }
                              >
                                <IoIosClose />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Col>
                <Col lg={12} className="space-mb--r100">
                  <div className="cart-coupon-area space-pt--30 space-pb--30">
                    <Row className="align-items-center">
                      <Col lg={7} className="space-mb-mobile-only--30">
                        <div className="lezada-form coupon-form">
                          <form>
                            <Row>
                              <Col md={7}>
                                <div className="cart-coupon-input--svg--holder">
                                  <input
                                    value={refferalCheck ? "REFFERAL" : couponCode}
                                    type="text"
                                    placeholder="Enter your coupon code"
                                    onChange={(e) =>
                                      setCouponCode(e.target.value)
                                    }
                                  />

                                  <svg style={{ display: refferalCheck ? "none" : "" }}
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
                              </Col>

                              <Col md={5}>
                                <button
                                  onClick={handleApplyCoupon}
                                  className="lezada-button lezada-button--medium"
                                  disabled={applyCouponPressed ? true : false}
                                >
                                  {!applyCouponPressed ? (
                                    "apply coupon"
                                  ) : (
                                    <Spinner
                                      size="sm"
                                      animation="border"
                                      role="status"
                                    >
                                      {" "}
                                      <span style={{ opacity: "0%" }}>
                                        Loading...
                                      </span>{" "}
                                    </Spinner>
                                  )}
                                </button>
                              </Col>
                            </Row>
                          </form>
                        </div>
                      </Col>

                      <Col lg={5} className="text-left text-lg-right">
                        <button
                          className="lezada-button lezada-button--medium"
                          onClick={() => [
                            removeDebounce(),
                            deleteAllFromCart(addToast),
                            setLocalProducts([]),
                          ]}
                        >
                          clear cart
                        </button>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <div className="w-100 cart--total--cart--page--holder">
                  <div className=" space-mb--50 cart--total-holder">
                    <div className="">
                      <h4 className="checkout-title">Cart Total</h4>
                      {/* <div className="checkout-cart-total">
                        <div className="checkout-cart-total-main">
                          <h4>
                            Product <span>Total</span>
                          </h4>
                          <ul>
                            {localProducts?.map((item, i) => {
                              const product = item?.product;
                              const regionPricing = regionPrice(product, {
                                currency: cartItems?.currency || userData?.currency,
                                isLoggedIn: userData?.isLoggedIn,
                              });
                              currencyCode = regionPricing.currencyCode;
                              currencySymbol = regionPricing.currencySymbol;

                              const discountedPrice =
                                regionPricing?.productPrice

                              const itemQuantity = item?.quantity || 1;
                              const additionalUnits = item?.additionalUnit || 0;
                              const totalItemQuantity = itemQuantity + additionalUnits;

                              localTotal +=
                                regionPricing.productPrice * totalItemQuantity
                              localTotalQuantity += totalItemQuantity

                              return (
                                <li key={i}>
                                  {product.name} x{totalItemQuantity}{' '}
                                  {additionalUnits > 0 && (
                                    <span className="additional-units">
                                      ({itemQuantity} main + {additionalUnits} additional)
                                    </span>
                                  )}
                                  <span>
                                    {currencyCode ||
                                      cartItems?.currency ||
                                      userData?.currency}{' '}
                                    {currencySymbol}
                                    {formatCurrency(
                                      (discountedPrice * totalItemQuantity).toFixed(
                                        2
                                      ),
                                      cartItems?.currency || userData?.currency
                                    )}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                          <div className="total--cart--total">
                            <p>
                              Total item(s) <span>{localTotalQuantity}</span>
                            </p>
                            <p>
                              Cart Total{' '}
                              <span>
                                {currencyCode ||
                                  cartItems?.currency ||
                                  userData?.currency}{' '}
                                {currencySymbol}
                                {formatCurrency(
                                  cartItems?.subTotal?.toFixed(2) || localTotal,
                                  cartItems?.currency || userData?.currency
                                )}
                              </span>
                            </p>
                          </div>

                          {cartItems?.couponData?.coupon ||
                          cartItems?.expressPriceData?.coupon ? (
                            <div className="promotion--price--wrapper">
                              <p>Promotion</p>
                              <div>
                                {cartItems?.couponData?.coupon ? (
                                  <span>
                                    -
                                    {currencyCode ||
                                      cartItems?.currency ||
                                      userData?.currency}{' '}
                                    {currencySymbol}
                                    {formatCurrency(
                                      (cartItems?.moduleProducts?.length > 0 ? (cartItems?.moduleDiscount || cartItems?.discount) : cartItems?.discount)?.toFixed(2),
                                      cartItems?.currency || userData?.currency
                                    )}
                                  </span>
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                          <div className="order--extra--info">
                            {cartItems?.couponData?.coupon ? (
                              <>
                                <p className="discount--information">
                                  {getCouponText({
                                    code: cartItems?.couponData?.coupon,
                                    type: cartItems?.couponData?.type,
                                    discountUnit: cartItems?.discountUnit,
                                  })}
                                </p>
                              </>
                            ) : (
                              ''
                            )}

                            <p>
                              Tax{' '}
                              <span>
                                {currencyCode ||
                                  cartItems?.currency ||
                                  userData?.currency}{' '}
                                {currencySymbol}
                                0.00
                              </span>
                            </p>
                            <p>
                              Shipping{' '}
                              <span>
                                {currencyCode ||
                                  cartItems?.currency ||
                                  userData?.currency}{' '}
                                {currencySymbol}
                                0.00
                              </span>
                            </p>
                          </div>

                          <h4 className="order--total--holder">
                            Order Total{' '}
                            <span>
                              {currencyCode ||
                                cartItems?.currency ||
                                userData?.currency}{' '}
                              {currencySymbol}
                              {formatCurrency(
                                cartItems?.orderTotal?.toFixed(2) || localTotal,
                                cartItems?.currency || userData?.currency
                              )}
                            </span>
                          </h4>
                        </div>
                      </div> */}
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
                      />
                    </div>

                    <div
                      style={{ marginTop: "11px" }}
                      className="cart-calculation-button text-center"
                      onClick={handleCheckout}
                    >
                      <a className="button--black proceed--to--checkout--button">
                        {!checkoutPressed ? (
                          "proceed to checkout"
                        ) : (
                          <Spinner size="sm" animation="border" role="status">
                            {" "}
                            <span style={{ opacity: "0%" }}>
                              Loading...
                            </span>{" "}
                          </Spinner>
                        )}
                      </a>
                    </div>
                  </div>
                </div>
              </Row>
            ) : (
              <Row>
                <Col>
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon space-mb--30">
                      <IoMdCart />
                    </div>
                    <div className="item-empty-area__text">
                      <p className="space-mb--30">No items found in cart</p>
                      <a
                        href="/shop/left-sidebar"
                        as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                      >
                        <div className="lezada-button lezada-button--medium">
                          Shop Now
                        </div>
                      </a>
                    </div>
                  </div>
                </Col>
              </Row>
            )}
          </Container>
        </div>
      </LayoutTwo>
    </div>
  );

  return (
    <>
      <>{reRender ? cartLayout : cartLayout}</>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    userData: state.userData,
    circleSliderData: state.circleSliderData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    increaseQuantity: (item, addToast, quantityCount, cartItems) => {
      dispatch(
        increaseQuantity(item, addToast, quantityCount, (cartItems = cartItems))
      );
    },

    setUserEmail: (email) => {
      dispatch(setUserEmail(email));
    },

    decreaseQuantity: (
      item,
      addToast,
      cartItems,
      specifyQuantity,
      fullItem,
      quantity,
      loggedIn,
      notDelete
    ) => {
      dispatch(
        decreaseQuantity(
          item,
          addToast,
          cartItems,
          specifyQuantity,
          fullItem,
          quantity,
          loggedIn,
          notDelete
        )
      );
    },
    deleteFromCart: (item, addToast, cartItems) => {
      dispatch(deleteFromCart(item, addToast, cartItems));
    },
    deleteAllFromCart: (addToast) => {
      dispatch(deleteAllFromCart(addToast));
    },
    validateUser: () => {
      dispatch(validateUser());
    },

    removeCoupon: (subTotal, total, orderTotalWithinStripeRange) => {
      dispatch(removeCoupon(subTotal, total, orderTotalWithinStripeRange));
    },

    updateLocalCartCount: (count) => {
      dispatch(updateLocalCartCount(count));
    },
    resetCircleDataIndex: () => {
      dispatch(resetCircleDataIndex());
    },

    addAPIDataToCart: (data) => {
      dispatch(addAPIDataToCart(data));
    },

    addAPIDataToWishlist: (newData, data) => {
      dispatch(addAPIDataToWishlist(newData, data));
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
