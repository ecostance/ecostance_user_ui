import { useRouter } from "next/router";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { LayoutTwo } from "../components/Layout";
import { BreadcrumbOne } from "../components/Breadcrumb";
import { useEffect, useState } from "react";
import { login, me, setCurrency } from "../apiClient/auth";
import { setCookies, getCookie } from "cookies-next";
import { useToasts } from "react-toast-notifications";
import Registration from "./other/registration";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import UseModel from "src/components/use/model";
// import UseModalBare from 'src/components/use/bareUseModal'
import { getCart } from "src/apiClient/cart";
import { addAPIDataToCart } from "src/redux/actions/cartActions";
import { connect } from "react-redux";
import { addAPIDataToWishlist } from "src/redux/actions/wishlistActions";
import { getWishlist } from "src/apiClient/wishlist";
import { verifyLoggedIn } from "src/apiClient/user";
import { setUserCurrency, setUserEmail } from "src/redux/actions/userAction";
import { addCoupon } from "src/redux/actions/couponActions";
import RegistrationSuccessPopup from "src/components/registrationSuccessPopup";
import { updateApiCartData } from "src/redux/store";
import { resetCircleDataIndex } from "src/redux/actions/carbonCalculatorActions";
import { useRef } from "react";
import { returnCorrectImage } from "src/components/helpers/returnCorrectImage";
import { updateAPICarbonCalculator } from "src/helpers/updateAPICalculator";
import { setCookie } from "nookies";

let toastId;
const LoginRegister = ({
  addAPIDataToCart,
  cartItems,
  userData,
  wishlistItems,
  addAPIDataToWishlist,
  setUserCurrency,
  setUserEmail,
  addCoupon,
  resetCircleDataIndex,
  circleSliderData,
}) => {
  const router = useRouter();
  const { addToast, removeAllToasts, removeToast } = useToasts();
  const [isError, setIsError] = useState({});
  const [isFocus, setIsFocus] = useState({});
  const [initialValues, setInitialValues] = useState({
    userName: "",
    password: "",
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [shouldShowSuccessModel, setShouldShowSuccessModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPage, setShowPage] = useState(false);
  const [email, setEmail] = useState("");
  let theJoinBusinessCode = localStorage.getItem("JoinBusinessCode")

  useEffect(() => () => removeAllToasts(), []);

  useEffect(() => {
    if (userData.isLoggedIn) {
      console.log("handle 2")
      router.push({
        pathname: "/",
        query: { loggedIn: "true" },
      });
      if (localStorage.getItem("JoinBusinessCode")) {
        setTimeout(() => {
          router.push('/other/my-employer-account');
        }, 1000)
      }
      if (localStorage.getItem("JoinSupplierCode") || localStorage.getItem("JoinDistributorCode")) {
        setTimeout(() => {
          router.push('/other/my-business-account');
        }, 1000)
      }
    }
  }, []);

  const showSuccessModel = (shouldShow, message, mail = "") => {
    setEmail(mail);
    setSuccessMessage(message);
    setShouldShowSuccessModel(shouldShow);
    // setTimeout(() => {
    //   setShouldShowSuccessModel(false);
    // }, 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validation = validate(initialValues);
    setIsError(validation);
    setIsFocus(validation);
    if (Object.keys(validation).length) {
      return null;
    }
    try {
      setIsLoginLoading(true);
      const { userName, password } = initialValues;
      const loginResponse = await login({
        userName,
        password,
        temporaryCheckoutCurrency: cartItems?.currency,
      });

      if (loginResponse.status == 200) {
        setCookie(null, "JWTToken", loginResponse?.data?.token, {
          // maxAge: 30 * 24 * 60 * 60,
          // path: "/",
          // domain: "https://marketsverse.com/",
        });
        // setCookies("JWTToken", loginResponse?.data?.token, {
        //   domain: process.env.COOKIE_URL,
        // });
        // setCookie(null, "nextjsToken", loginResponse?.data?.token, {
        //   maxAge: 3600, // Cookie expiration time (1 hour)
        //   path: "/",
        //   domain: ".marketsverse.com",
        //   secure: true,
        //   sameSite: "none",
        //   // httpOnly: true,
        // });

        const allCartitems = cartItems?.products;
        const allWishListItems = wishlistItems;
        resetCircleDataIndex();

        const tempProducts = [];
        // const tempProduct2 = [];
        allCartitems?.map((each) => {
          tempProducts.push({ ...each, product: each?.product?._id });
        });

        const onlyapidata = await getCart();

        console.log(cartItems?.products, "actualAnnoDataaaa");
        console.log(tempProducts, "mappedAnnoDataaaa");
        console.log(onlyapidata?.data?.data?.products, "apiDataaaa");

        // tempProducts?.map((each, eachIndex) => {
        //   const index = onlyapidata?.data?.data?.products?.findIndex(
        //     (item) => item?.cartItemId == each?.cartItemId
        //   );

        //   if (index > -1) {
        //     if (
        //       each?.quantity >
        //       onlyapidata?.data?.data?.products[index]?.quantity
        //     ) {
        //       each.quantity =
        //         each?.quantity -
        //         onlyapidata?.data?.data?.products[index]?.quantity;
        //     } else {
        //       tempProducts.splice(eachIndex, 1);
        //     }
        //   }
        // });
        // tempProduct2 = [...tempProducts];
        // console.log(tempProduct2, "tempProduct2Dataaaa");
        const apiCartItems = await updateApiCartData(
          tempProducts || [],
          cartItems?.currency,
          // true
          false
        );

        const currentApiCartData = apiCartItems?.data?.data;

        // console.log(currentApiCartData, "currentApi&annCartData");

        const resCartProducts = currentApiCartData;
        addAPIDataToCart(resCartProducts);

        // const coupon = currentApiCartData?.coupon;
        // const type = currentApiCartData?.couponType;
        // const discount = currentApiCartData?.discount;
        // const total = currentApiCartData?.orderTotal;
        // const subTotal = currentApiCartData?.subTotal;
        // const discountUnit = currentApiCartData?.discountUnit;

        // const stripeCode = {
        //   regular: currentApiCartData?.stripePaymentCouponId,
        //   subscription: currentApiCartData?.stripeSubscriptionCouponId,
        // };

        const resWishList = await getWishlist();

        const resWishListProducts = resWishList?.data?.products;

        circleSliderData?.localDataUpdated &&
          (await updateAPICarbonCalculator(circleSliderData));
        addAPIDataToCart(resCartProducts);

        addAPIDataToWishlist(resWishListProducts, allWishListItems);
        // if (localStorage.getItem("JoinBusinessCode")) {
        //   return router.push({
        //     pathname: "/other/my-employer-account",
        //     query: { loggedIn: "true" }
        //   })
        // }
        console.log("handle 1")
        router.push({
          pathname: "/",
          query: { loggedIn: "true" },
        });
        if (localStorage.getItem("JoinBusinessCode")) {
          setTimeout(() => {
            router.push('/other/my-employer-account');
          }, 1000)
        }
        if (localStorage.getItem("JoinSupplierCode") || localStorage.getItem("JoinDistributorCode")) {
          setTimeout(() => {
            router.push('/other/my-business-account');
          }, 1000)
        }
      } else if (loginResponse.status === 403) {
        addToast(loginResponse.data?.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setIsLoginLoading(false);
      } else if (loginResponse.data?.message === "User not found") {
        addToast("Email not found", {
          appearance: "error",
          autoDismiss: true,
        });
        setIsLoginLoading(false);
      } else if (
        loginResponse.data?.message.includes("Wrong email or password") ||
        loginResponse.data?.message.includes("Your account is on hold")
      ) {
        setInitialValues((prevValue) => ({ ...prevValue, password: "" }));
        // if (loginResponse?.data?.loginAttemptCount >= 5) return
        let autoDismissToast;
        let errMessage;
        if (loginResponse?.data?.loginAttemptCount) {
          if (loginResponse?.data?.loginAttemptCount >= 8) {
            if (loginResponse?.data?.code === "ACCOUNT_HOLD")
              errMessage = loginResponse?.data?.message;
            else
              errMessage = (
                <p>
                  Wrong email or password.
                  <br /> Your account is locked due to{" "}
                  <b style={{ textDecoration: "underline" }}>8</b> unsuccessful
                  login attempts. Please reset your password by clicking “Forgot
                  Password”
                </p>
              );
          } else {
            errMessage = (
              <p>
                Wrong email or password.
                <br /> Your account will be locked after{" "}
                <soan style={{ textDecoration: "underline" }}>
                  {8 - loginResponse?.data?.loginAttemptCount}
                </soan>{" "}
                more unsuccessful{" "}
                {8 - loginResponse?.data?.loginAttemptCount === 1
                  ? "attempt"
                  : "attempts"}
                . Please reset your password by clicking “Forgot Password”
              </p>
            );
          }
          autoDismissToast = !loginResponse?.data?.loginAttemptCount >= 5;
        } else {
          autoDismissToast = loginResponse?.data?.code !== "ACCOUNT_HOLD";
          errMessage = loginResponse?.data?.message;
        }
        if (!autoDismissToast && toastId) {
          removeToastHandler(toastId);
        }
        if (!autoDismissToast) toastId = String(Math.random());
        addToast(errMessage, {
          appearance: "error",
          autoDismiss: autoDismissToast,
          ...(!autoDismissToast && { id: toastId }),
        });
        setIsLoginLoading(false);
      } else {
        addToast(loginResponse?.data?.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setIsLoginLoading(false);
      }
    } catch (e) {
      addToast("Failed to Login", {
        appearance: "error",
        autoDismiss: true,
      });
      setIsLoginLoading(false);
      console.log(e);
    }
  };

  const handleChangeValue = (e) => {
    const value = e.target.name === "userName"
      ? e.target.value.trim().toLowerCase()
      : e.target.value.trim();
    setInitialValues({
      ...initialValues,
      [e.target.name]: value,
    });
    setIsError({ ...isError, [e.target.name]: "" });
  };

  const handleFocus = (e) => {
    const validation = validate(initialValues);
    setIsError(validation);
    setIsFocus({ ...isFocus, [e.target.name]: true });
  };

  const validate = (values) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let errors = {};
    if (!values.userName) {
      errors.userName = "Please enter email";
    }
    if (values.userName && !values.userName.match(emailRegex)) {
      errors.userName = "Please enter a valid email";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleEyeIconClick = () => setIsShowPassword(!isShowPassword);

  const registrationContainerRef = useRef();

  const columnFocusHandler = (columnName) => {
    if (columnName === "registration") {
      setIsError({});
      setIsFocus({});
      return;
    }
    if (columnName === "login") {
      registrationContainerRef.current?.setRegistrationError({});
      registrationContainerRef.current?.setRegistrationFocus({});
      registrationContainerRef.current?.setTermsOfServiceError("");
      return;
    }
  };

  const removeToastHandler = (toastId) => {
    setTimeout(() => removeToast(toastId), 1000);
  };

  const LoginReg = (
    <>
      {shouldShowSuccessModel && (
        <RegistrationSuccessPopup
          setShouldShowSuccessModel={setShouldShowSuccessModel}
          email={email}
        />
      )}
      {/* {shouldShowSuccessModel && <Popup />} */}
      <LayoutTwo style={{ postion: "relative" }}>
        {/* breadcrumb */}
        <BreadcrumbOne
          pageTitle="Customer Login"
          className="bg--2"
        // backgroundImage={
        //   '/assets/images/backgrounds/' +
        //   returnCorrectImage('breadcrumb-bg-2', window.innerWidth)
        // }
        >
          <ul className="breadcrumb__list">
            <li>
              <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                <a>Home</a>
              </Link>
            </li>

            <li>Customer Login</li>
          </ul>
        </BreadcrumbOne>
        <div className="login-area space-mt--r130 space-mb--r130">
          <Container>
            <Row>
              <Col lg={6} className="space-mb-mobile-only--50">
                <div
                  className="lezada-form login-form"
                  onFocus={() => columnFocusHandler("login")}
                >
                  <form onSubmit={handleLogin} className="space-mb--20">
                    <Row>
                      <Col lg={12}>
                        <div className="section-title--login text-center space-mb--50">
                          <h2 className="space-mb--20">Login</h2>
                          <p>Great to have you back!</p>
                        </div>
                      </Col>
                      <Col lg={12} className="space-mb--60">
                        <label htmlFor="regEmail">
                          Email Address <span className="required">*</span>{" "}
                        </label>
                        <input
                          name="userName"
                          type="text"
                          value={initialValues.userName}
                          onBlur={handleFocus}
                          onChange={(e) => handleChangeValue(e)}
                          placeholder="Email"
                        />
                        {isFocus.userName && isError.userName ? (
                          <p className="error-msg">{isError.userName}</p>
                        ) : (
                          ""
                        )}
                      </Col>
                      <Col lg={12} className="space-mb--60">
                        <label htmlFor="regEmail">
                          Password <span className="required">*</span>{" "}
                        </label>
                        <div className="d-flex align-item-center">
                          <input
                            name="password"
                            value={initialValues.password}
                            onChange={(e) => handleChangeValue(e)}
                            onBlur={handleFocus}
                            type={isShowPassword ? "text" : "password"}
                            placeholder="Password"
                          />
                          {isShowPassword ? (
                            <FaRegEye
                              onClick={handleEyeIconClick}
                              className="eye-icon"
                            />
                          ) : (
                            <FaRegEyeSlash
                              onClick={handleEyeIconClick}
                              className="eye-icon"
                            />
                          )}
                        </div>
                        {isFocus.password && isError.password ? (
                          <p className="error-msg">{isError.password}</p>
                        ) : (
                          ""
                        )}
                      </Col>
                      <Col lg={12} className="space-mb--30">
                        <button
                          disabled={isLoginLoading}
                          className="lezada-button lezada-button--medium space-mb--10"
                        >
                          login{" "}
                          {isLoginLoading ? (
                            <Spinner size="sm" animation="border" />
                          ) : null}
                        </button>
                      </Col>
                      {/* <Col>
                        <input type="checkbox" />{" "}
                        <span className="remember-text">Remember me</span>
                      </Col> */}
                    </Row>
                  </form>
                  <Link
                    href={process.env.PUBLIC_URL + "/other/forgot-password"}
                    className="reset-pass-link"
                  >
                    Forgot password?
                  </Link>
                </div>
              </Col>
              <Col lg={6} onFocus={() => columnFocusHandler("registration")}>
                <Registration
                  showSuccessModel={showSuccessModel}
                  registrationContainerRef={registrationContainerRef}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </LayoutTwo>
      {/* {loading && (
    <div
      style={{
        position: "absolute",
        zIndex: 99,
        top: 0,
        height: "100%",
        width: "100%",
        left: 0,
        background: "rgb(0 0 0 / 71%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000"
      }}
    >
      <div style={{ padding: 20, background: "#ccc", }}> Loading Please wait ckecking user status ...</div>
    </div>
  )} */}
    </>
  );

  return <>{!userData.isLoggedIn ? LoginReg : ""}</>;
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAPIDataToCart: (items, cartItems) => {
      dispatch(addAPIDataToCart(items, cartItems));
    },
    addAPIDataToWishlist: (items, cartItems) => {
      dispatch(addAPIDataToWishlist(items, cartItems));
    },
    setUserCurrency: (currency) => {
      dispatch(setUserCurrency(currency));
    },
    setUserEmail: (email) => {
      dispatch(setUserEmail(email));
    },
    resetCircleDataIndex: () => {
      dispatch(resetCircleDataIndex());
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

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    userData: state.userData,
    wishlistItems: state.wishlistData,
    circleSliderData: state.circleSliderData,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegister);
