import { useRouter } from "next/router";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { login, me, userRegistration } from "../../apiClient/auth";
import { setCookies, getCookie, deleteCookie } from "cookies-next";
// import Registration from '../../pages/other/registration'
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useToasts } from "react-toast-notifications";
import LezadaBackdrop from "../lezadaBackdrop";
import { updateApiCartData } from "src/redux/store";
import { getWishlist } from "src/apiClient/wishlist";
import { updateAPICarbonCalculator } from "src/helpers/updateAPICalculator";
import { removeAllItemsFromSustainabilityPage } from "src/redux/actions/sustainabilityActions";
import { removeAllItemsFromBusinessSustainabilityPage } from "src/redux/actions/businessSustainabilityActions";
import {
  logoutCheckoutCurrencyAction,
  runValidateUserProcessSync,
} from "src/helpers/currencyActionHelper";
import {
  validateUser,
  setIsVerifyPopupShown,
  removeCurrentUser,
} from "src/redux/actions/userAction";
import { addOrder } from "src/redux/actions/orderActions";
import { deleteAllFromWishlist } from "src/redux/actions/wishlistActions";

const LoginRegisterModel = ({
  closeModel,
  showSuccessModel,
  circleSliderData,
  userData,
  setEmail,
  setIsShowModel,
  setUserEmail,
  addAPIDataToCart,
  addAPIDataToWishlist,
  cartItems,
  wishlistItems,
  resetCircleDataIndex,
  handleForgotPasswordPopup,
  origin,
  setIsVerifyEmailSent,
}) => {
  const { addToast } = useToasts();
  const router = useRouter();
  const [isError, setIsError] = useState({});
  const [isFocus, setIsFocus] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [initialValues, setInitialValues] = useState({
    userName: "",
    password: "",
    email: "",
    regPassword: "",
    regConfirmPassword: "",
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

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
        // validateUser();

        setCookies("JWTToken", loginResponse?.data?.token, {
          domain: process.env.COOKIE_URL,
        });
        resetCircleDataIndex();
        const allCartitems = cartItems?.products;
        const allWishListItems = wishlistItems;

        const tempProducts = [];

        allCartitems?.map((each) => {
          tempProducts.push({ ...each, product: each?.product?._id });
        });

        const apiCartItems = await updateApiCartData(
          tempProducts || [],
          cartItems?.currency,
          true
        );

        const currentApiCartData = apiCartItems?.data?.data;

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

        circleSliderData?.localDataUpdated &&
          (await updateAPICarbonCalculator(circleSliderData));

        const resWishListProducts = resWishList?.data?.products;

        addAPIDataToCart(resCartProducts);

        addAPIDataToWishlist(resWishListProducts, allWishListItems);
        // addCoupon(
        //   type,
        //   coupon,
        //   discount,
        //   subTotal,
        //   total,
        //   discountUnit,
        //   stripeCode,
        //   (name = "a")
        // );

        // if (
        //   loginResponse?.data?.user?.emailVerificationStatus === "UNVERIFIED"
        // ) {
        //   setUserEmail(userName);
        //   return router.push("/userlogin");
        // }
        setUserEmail(userName);
        await closeModel({ flow: "login" });
      } else if (loginResponse.status === 403) {
        setIsFocus({ ...isFocus, password: true });
        setIsError((prevValue) => ({
          ...prevValue,
          password: loginResponse.data?.message,
        }));
        setIsLoginLoading(false);
      } else if (loginResponse.data?.message === "User not found") {
        setIsFocus({ ...isFocus, password: true });
        setIsError((prevValue) => ({
          ...prevValue,
          password: "Email not found",
        }));
        setIsLoginLoading(false);
      } else if (
        loginResponse.data?.message.includes("Wrong email or password") ||
        loginResponse.data?.message.includes("Your account is on hold")
      ) {
        setInitialValues((prevValue) => ({ ...prevValue, password: "" }));
        // if (loginResponse?.data?.loginAttemptCount >= 5) return

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
                <span style={{ textDecoration: "underline" }}>
                  {8 - loginResponse?.data?.loginAttemptCount}
                </span>{" "}
                more unsuccessful{" "}
                {8 - loginResponse?.data?.loginAttemptCount === 1
                  ? "attempt"
                  : "attempts"}
                . Please reset your password by clicking “Forgot Password”
              </p>
            );
          }
        } else {
          errMessage = loginResponse?.data?.message;
        }

        setIsFocus({ ...isFocus, password: true });
        setIsError((prevValue) => ({
          ...prevValue,
          password: errMessage,
        }));
        setIsLoginLoading(false);
      } else {
        setIsFocus({ ...isFocus, password: true });
        setIsError((prevValue) => ({
          ...prevValue,
          password: loginResponse.data?.message,
        }));
        setIsLoginLoading(false);
      }
    } catch (e) {
      addToast("Failed to Login", {
        appearance: "error",
        autoDismiss: true,
      });
      setIsLoginLoading(false);
    } finally {
    }
  };

  const handleChangeValue = (e) => {
    setInitialValues({
      ...initialValues,
      [e.target.name]: e.target.value.trim(),
    });
    if (e.target.name === "regPassword")
      checkPasswordStrength(e.target.value.trim());
    setIsError({ ...isError, [e.target.name]: "" });
  };

  const [loginActive, setLoginActive] = useState(true);

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

  const validateReg = (values) => {
    let errors = {};

    if (!values.email) {
      errors.email = "Email is required";
    }
    if (
      values.email &&
      !values.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errors.email = "Enter a valid Email";
    }
    if (
      values.regPassword &&
      !values.regPassword.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      errors.regPassword =
        "Password must be at least 8 characters long and contain lower case, upper case, number, and special character.";
    }
    if (!values.regPassword) {
      errors.regPassword = "Password is required";
    }
    if (!values.regConfirmPassword) {
      errors.regConfirmPassword = "Confirm password is required";
    }
    if (values.regPassword !== values.regConfirmPassword) {
      errors.regConfirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    const keyToKeep = 'JoinBusinessCode';
    const valueToKeep = localStorage.getItem("JoinBusinessCode");

    const keepSupplyKey = 'JoinSupplierCode';
    const valueSupplyKey = localStorage.getItem("JoinSupplierCode");

    const keepDistKey = 'JoinDistributorCode';
    const valueDistKey = localStorage.getItem("JoinDistributorCode");

    const keepRefKey = "ReferralID";
    const valueRefKey = localStorage.getItem("ReferralID");

    const keepConfKey = "conferenceCode";
    const valueConfKey = localStorage.getItem("conferenceCode");

    const keepRIDKey = 'RID';
    const valueRIDKey = localStorage.getItem("RID");

    deleteCookie("JWTToken");
    deleteCookie("checkout");
    deleteCookie("stripeSession");
    deleteCookie("userSlug", {
      domain: `${process.env.COOKIE_URL}`,
    });
    localStorage.clear();
    removeAllItemsFromSustainabilityPage();
    removeAllItemsFromBusinessSustainabilityPage();
    logoutCheckoutCurrencyAction();
    setIsVerifyPopupShown(false);
    removeCurrentUser();
    addOrder(false, {});
    deleteAllFromWishlist();
    if (valueToKeep !== null) {
      localStorage.setItem(keyToKeep, valueToKeep);
    }
    if (valueRefKey !== null) {
      localStorage.setItem(keepRefKey, valueRefKey);
    }
    if (valueConfKey !== null) {
      localStorage.setItem(keepConfKey, valueConfKey);
    }
    if (valueSupplyKey !== null) {
      localStorage.setItem(keepSupplyKey, valueSupplyKey);
    }
    if (valueDistKey !== null) {
      localStorage.setItem(keepDistKey, valueDistKey);
    }
    if (valueRIDKey !== null) {
      localStorage.setItem(keepRIDKey, valueRIDKey);
    }
    const validation = validateReg(initialValues);

    setIsError(validation);
    setIsFocus(validation);

    if (!isDisable) {
      setIsDisableError("Agreement to terms of service is required");
      return null;
    }

    if (Object.keys(validation).length) {
      return null;
    }
    setIsRegisterLoading(true);
    // if (userData?.email) {
    //   if (userData.email !== initialValues.email) {
    //   } else {
    //     const response = await checkEmailVerificationStatus(userData?.email);

    //     if (response.status === 200) {
    //       if (!response.data?.emailVerified) {
    //         setEmail(initialValues.email);
    //         showSuccessModel(true, userData.email, userData?.email);
    //         setIsRegisterLoading(false);
    //         return;
    //       } else {
    //       }
    //     }
    //   }
    // }
    const payload = {
      email: initialValues.email,
      password: initialValues.regPassword,
      confirmPassword: initialValues.regConfirmPassword,
      newsLetter: newsLetterSelected,
      temporaryCheckoutCurrency: cartItems?.currency,
    };
    if (origin === "checkout") payload.checkout = true;
    let currentDate = new Date()
    await userRegistration(payload)
      .then(async (response) => {
        if (response?.status === 200) {
          setEmail(initialValues.email);
          setUserEmail(initialValues.email);
          setIsVerifyEmailSent(true);
          // showSuccessModel(true, response.data?.message, initialValues?.email);
          setCookies("JWTToken", response?.data?.token);
          localStorage.setItem("TotalOrders", 0)
          localStorage.setItem("userCreated", currentDate)
          localStorage.setItem("userId", response?.data?.user?._id)
          localStorage.setItem("email", response?.data?.user?.email)
          localStorage.setItem("name", response?.data?.user?.firstName + " " + response?.data?.user?.lastName)
          // localStorage.setItem("userCreated", response?.data?.user?.createdAt)



          const allCartitems = cartItems?.products;
          const allWishListItems = wishlistItems;

          const tempProducts = [];

          allCartitems?.map((each) => {
            tempProducts.push({ ...each, product: each?.product?._id });
          });

          const apiCartItems = await updateApiCartData(
            tempProducts || [],
            cartItems?.currency,
            true
          );

          const currentApiCartData = apiCartItems?.data?.data;

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
          setInitialValues({
            ...initialValues,
            email: "",
            password: "",
            confirmPassword: "",
          });
          setIsDisable(!isDisable);
          closeModel({ flow: "registration" });
        } else {
          addToast(response.data?.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
        setIsRegisterLoading(false);
      })
      .catch(() => {
        addToast("Registration Failed", {
          appearance: "error",
          autoDismiss: true,
        });
        setIsRegisterLoading(false);
      })
      .finally(() => { });
  };

  const [isDisable, setIsDisable] = useState(false);
  const [isDisableError, setIsDisableError] = useState("");

  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [newsLetterSelected, setnewsLetterSelected] = useState(false);
  const handleFocus = (e) => {
    const validation = validate(initialValues);
    setIsError(validation);
    setIsFocus({ ...isFocus, [e.target.name]: true });
  };

  const handleFocusReg = (e) => {
    const validation = validateReg(initialValues);
    setIsError(validation);
    setIsFocus({ ...isFocus, [e.target.name]: true });
  };

  const handleCheckBox = () => {
    setIsDisable(!isDisable);
    setIsDisableError("");
  };

  const handleEyeIconClick = () => setIsShowPassword(!isShowPassword);

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return setPasswordStrength("");

    if (
      password.length >= 12 &&
      password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
      return setPasswordStrength("Strong");

    if (
      password.length >= 8 &&
      password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
      return setPasswordStrength("Good");

    if (
      password.length > 8 &&
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
      return setPasswordStrength("Weak");

    if (
      password.length < 8 ||
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
      return setPasswordStrength("Poor");
  };

  useEffect(() => {
    if (loginActive) {
      setInitialValues((prevValues) => ({
        ...prevValues,
        email: "",
        regPassword: "",
        regConfirmPassword: "",
      }));
      setIsError((prevValue) => ({
        ...prevValue,
        email: "",
        regPassword: "",
        regConfirmPassword: "",
      }));
      setIsFocus((prevValue) => ({
        ...prevValue,
        email: "",
        regPassword: "",
        regConfirmPassword: "",
      }));
      setIsDisableError("");
      setPasswordStrength("");
      setIsShowConfirmPassword(false);
      setIsShowPassword(false);
    } else {
      setInitialValues((prevValues) => ({
        ...prevValues,
        userName: "",
        password: "",
      }));
      setIsError((prevValue) => ({
        ...prevValue,
        userName: "",
        password: "",
      }));
      setIsFocus((prevValue) => ({
        ...prevValue,
        userName: "",
        password: "",
      }));
      setIsShowPassword(false);
    }
    return () => {
      setInitialValues({});
      setIsError({});
      setIsFocus({});
      setIsShowPassword(false);
    };
  }, [loginActive]);

  return (
    <LezadaBackdrop bgType="light">
      <div className="standard-popup-holder login-register--main-popup-holder">
        <img
          className="login-reg-image"
          src="/assets/images/login-register-popup.png"
        />
        <div className="login-registration-popup-info">
          <div
            className="standard-popup-cross-icon login-register-cross-icon"
            onClick={() => setIsShowModel(false)}
          >
            <img src="/assets/images/cross-sustainability.png" />
          </div>

          {/* <div
            className="login-register-svg-holder standard-popup-cross-icon"
            style={{ cursor: "pointer" }}
            onClick={() => setIsShowModel(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path stroke="#828282" d="M1.5 18.5l17-17m-17 0l17 17"></path>
            </svg>
          </div> */}
          <div
            className={`login-reg-popup-nav ${!loginActive && "registerActive"
              }`}
          >
            <div
              onClick={() => setLoginActive(true)}
              className={loginActive ? "active" : ""}
            >
              Login
            </div>
            <div
              onClick={() => setLoginActive(false)}
              className={!loginActive ? "active" : ""}
            >
              Register
            </div>
          </div>
          {loginActive && (
            <form className="login-reg-popup-login--holder ">
              <h1>
                Please <span>Login</span> or <span>Register</span>{" "}
                {origin === "checkout" && "to checkout"}{" "}
                {origin === "apply-coupon" ? "to apply coupon" : ""}
                {origin === "change-currency" ? "to change currency" : ""}
              </h1>
              <div className="login-registration--input-holder">
                <div className="login-res-popup-input-holder">
                  <label htmlFor="userName">Email Address *</label>
                  <input
                    placeholder="Email"
                    name="userName"
                    type="text"
                    value={initialValues.userName}
                    onBlur={handleFocus}
                    onChange={(e) => handleChangeValue(e)}
                  />
                  {isFocus.userName && isError.userName ? (
                    <p className="error-msg">{isError.userName}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="login-res-popup-input-holder">
                  <label htmlFor="password">Password *</label>
                  <input
                    name="password"
                    value={initialValues.password}
                    onChange={(e) => handleChangeValue(e)}
                    placeholder="Password"
                    onBlur={handleFocus}
                    type={isShowPassword ? "text" : "password"}
                  />
                  {isShowPassword ? (
                    <FaRegEye
                      onClick={handleEyeIconClick}
                      className="eye-icon login-reg-modal"
                    />
                  ) : (
                    <FaRegEyeSlash
                      onClick={handleEyeIconClick}
                      className="eye-icon login-reg-modal"
                    />
                  )}
                  {isFocus.password && isError.password ? (
                    <p className="error-msg">{isError.password}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="login--forgot-pasword-holder">
                <button
                  disabled={isLoginLoading}
                  className="button--black"
                  onClick={handleLogin}
                >
                  LOGIN{" "}
                  {isLoginLoading ? (
                    <Spinner size="sm" animation="border" />
                  ) : null}
                </button>
                <p
                  onClick={handleForgotPasswordPopup}
                  className="login-reg-forgot-holder"
                >
                  Forgot Password?
                </p>
              </div>
            </form>
          )}
          {!loginActive && (
            <form className="login-reg-popup-register--holder">
              {/* <h1>
                Please <span>Login</span> / <span>Register</span>{' '}
                {origin === 'checkout' && 'to checkout'}
              </h1> */}
              <div className="login-registration--input-holder reg-input-holder">
                <div className="login-res-popup-input-holder">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    onBlur={handleFocusReg}
                    onChange={handleChangeValue}
                    name="email"
                    value={initialValues.email}
                    required
                    placeholder="Email"
                  />
                  {isFocus.email && isError.email ? (
                    <p className="error-msg">{isError.email}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="login-res-popup-input-holder">
                  <label htmlFor="regPassword">Password *</label>
                  <input
                    onBlur={handleFocusReg}
                    placeholder="Password"
                    type={isShowPassword ? "text" : "password"}
                    onChange={handleChangeValue}
                    value={initialValues.regPassword}
                    name="regPassword"
                    required
                  />
                  {isShowPassword ? (
                    <FaRegEye
                      onClick={handleEyeIconClick}
                      className="eye-icon login-reg-modal"
                    />
                  ) : (
                    <FaRegEyeSlash
                      onClick={handleEyeIconClick}
                      className="eye-icon login-reg-modal"
                    />
                  )}
                  {isFocus.regPassword && isError.regPassword ? (
                    <p className="error-msg" style={{ marginBottom: "0px" }}>
                      {isError.regPassword}
                    </p>
                  ) : (
                    ""
                  )}
                  <div
                    className={`password-strength-container register ${passwordStrength}`}
                    style={{ height: "6px" }}
                  >
                    <div className="password-strength-bar register" />
                    <div className="password-strength-bar register" />
                    <div className="password-strength-bar register" />
                    <div className="password-strength-bar register" />
                  </div>
                  <p
                    style={{ paddingTop: "3px", fontSize: "15px" }}
                    className={passwordStrength}
                  >
                    {passwordStrength ? passwordStrength : ""}
                  </p>
                </div>
                <div className="login-res-popup-input-holder">
                  <label htmlFor="regConfirmPassword">Confirm Password *</label>
                  <input
                    type={isShowConfirmPassword ? "text" : "password"}
                    onBlur={handleFocusReg}
                    onChange={handleChangeValue}
                    name="regConfirmPassword"
                    value={initialValues.regConfirmPassword}
                    required
                    placeholder="Password"
                  />
                  {isShowConfirmPassword ? (
                    <FaRegEye
                      onClick={() =>
                        setIsShowConfirmPassword((prevValue) => !prevValue)
                      }
                      className="eye-icon login-reg-modal"
                    />
                  ) : (
                    <FaRegEyeSlash
                      onClick={() =>
                        setIsShowConfirmPassword((prevValue) => !prevValue)
                      }
                      className="eye-icon login-reg-modal"
                    />
                  )}
                  {isFocus.regConfirmPassword && isError.regConfirmPassword ? (
                    <p className="error-msg">{isError.regConfirmPassword}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="login-reg-remember-login-holder">
                <div>
                  <div
                    className="login-reg-remember-checkbox-holder"
                    style={{ marginBottom: "13px" }}
                  >
                    <input
                      type="checkbox"
                      id="vehicle1"
                      value="Bike"
                      color="primary"
                      checked={isDisable}
                      name="terms"
                      onBlur={handleFocus}
                      onChange={handleCheckBox}
                    />
                    <label for="Remember">
                      I agree to the terms and privacy policy
                    </label>
                    <br />
                  </div>
                  {isDisableError ? (
                    <p className="error-msg tos">{isDisableError}</p>
                  ) : (
                    ""
                  )}
                  <div className="login-reg-remember-checkbox-holder">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      value="Bike"
                      color="primary"
                      // checked={isDisable}
                      name="terms"
                      onBlur={handleFocus}
                      onChange={() =>
                        setnewsLetterSelected((prevValue) => !prevValue)
                      }
                    />
                    <label for="Remember">
                      I want to subscribe to Newsletter
                    </label>
                    {/* <br /> */}
                  </div>
                </div>
                <div>
                  <button
                    className="button--black"
                    onClick={handleRegistration}
                    disabled={isRegisterLoading}
                  >
                    REGISTER{" "}
                    {isRegisterLoading ? (
                      <Spinner size="sm" animation="border" />
                    ) : null}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </LezadaBackdrop>
  );
};

export default LoginRegisterModel;
