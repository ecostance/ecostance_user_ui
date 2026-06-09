import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import Checkbox from "@material-ui/core/Checkbox";
import { userRegistration } from "src/apiClient/auth";
import { useRouter } from "next/router";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { checkEmailVerificationStatus } from "src/apiClient/auth";
import { setCookies } from "cookies-next";
import { setUserEmail } from "src/redux/actions/userAction";
import { addAPIDataToWishlist } from "src/redux/actions/wishlistActions";
import { addAPIDataToCart } from "src/redux/actions/cartActions";
import { getWishlist } from "src/apiClient/wishlist";
import { updateApiCartData } from "src/redux/store";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const IndividualRegistration = ({
  isModal,
  userData,
  showSuccessModel,
  setUserEmail,
  cartItems,
  wishlistItems,
  registrationContainerRef,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { addToast } = useToasts();
  const [initialValues, setInitialValues] = useState({
    // user_type: "individual",
    // userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // orgId: "",
    // orgName: "",
    // streetAddress1: "",
    // streetAddress2: "",
    // city: "",
    // state: "",
    // country: "",
    // role: "",
    // isAffiliated: false,
  });
  const [isDisable, setIsDisable] = useState(false);
  const [isDisableError, setIsDisableError] = useState("");
  const [isNewsLetter, setIsNewsLetter] = useState(false);
  const [isError, setIsError] = useState({});
  const [isFocus, setIsFocus] = useState({});
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;



  useEffect(() => {
    registrationContainerRef.current = {
      setRegistrationError: setIsError,
      setRegistrationFocus: setIsFocus,
      setTermsOfServiceError: setIsDisableError,
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(initialValues);

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
    //         showSuccessModel(true, userData.email, userData?.email);
    //         setIsRegisterLoading(false);
    //         return;
    //       } else {
    //       }
    //     }
    //   }
    // }
    setUserEmail(initialValues?.email);
    initialValues.email = initialValues?.email.toLowerCase()
    localStorage.getItem("ReferralID") ? initialValues.refId = localStorage.getItem("ReferralID") : ""
    let currentDate = new Date()
    await userRegistration({
      ...initialValues,
      newsLetter: isNewsLetter,
      termsAndConditions: true,
      redirect: isModal ? "/other/checkout" : "/login-register",
      temporaryCheckoutCurrency: cartItems?.currency,
    })
      .then(async (response) => {
        if (response.status === 200) {
          // showSuccessModel(true, response.data?.message, initialValues?.email);
          setCookies("JWTToken", response?.data?.token);
          localStorage.setItem("TotalOrders", 0)
          localStorage.setItem("email", initialValues?.email.toLowerCase())
          localStorage.setItem("userId", response?.data?.user?._id.toLowerCase())
          localStorage.setItem("userCreated", currentDate)
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

          addAPIDataToCart(resCartProducts);

          addAPIDataToWishlist(resWishListProducts, allWishListItems);
          setInitialValues({
            ...initialValues,
            email: "",
            password: "",
            confirmPassword: "",
          });
          setIsDisable(!isDisable);
          router.push({
            pathname: "/",
            query: { loggedIn: "true", register: "success" },
          });
        } else {
          addToast(response?.data?.message, {
            appearance: "error",
            autoDismiss: true,
          });
          setIsRegisterLoading(false);
        }
      })
      .catch((err) => {
        addToast("Registration Failed", {
          appearance: "error",
          autoDismiss: true,
        });
        setIsRegisterLoading(false);
        console.log(err);
      })
      .finally(() => { });
  };
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return setPasswordStrength("");

    if (password.length >= 12 && password.match(PASSWORD_REGEX))
      return setPasswordStrength("Strong");

    if (password.length >= 8 && password.match(PASSWORD_REGEX))
      return setPasswordStrength("Good");

    if (password.length > 8 && !password.match(PASSWORD_REGEX))
      return setPasswordStrength("Weak");

    if (password.length < 8 || !password.match(PASSWORD_REGEX))
      return setPasswordStrength("Poor");
  };
  const handleChangeValue = (e) => {
    // if (e.target.name === 'isAffiliated') {
    //     setInitialValues({
    //         ...initialValues,
    //         [e.target.name]: e.target.checked,
    //     });
    // } else {
    //     setInitialValues({
    //         ...initialValues,
    //         [e.target.name]: e.target.value,
    //     });
    // }
    const value = e.target.name === "email"
      ? e.target.value.toLowerCase()
      : e.target.value;
    setInitialValues({
      ...initialValues,
      [e.target.name]: value,
    });
    if (e.target.name === "password")
      checkPasswordStrength(e.target.value.trim());
    setIsError({ ...isError, [e.target.name]: "" });
  };

  // const handleChangeOrgValue = (e) => {
  //     const orgId = e.target.value;
  //     const orgName = orgList.find((item) => item.id === orgId).value
  //     setInitialValues({
  //         ...initialValues,
  //         orgName,
  //         orgId
  //     });
  //     setIsError({ ...isError, [e.target.name]: "" });
  // };

  const validate = (values) => {
    let errors = {};
    // if (!values.userName) {
    //     errors.userName = "User Name is Required";
    // }
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
      !values.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      errors.password =
        "Password must be at least 8 characters long and contain lower case, upper case, number, and special character.";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    // if (!values.orgName) {
    //     errors.orgName = "Organization is Required";
    // }
    // if (!values.role) {
    //     errors.role = "Role is Required";
    // }
    return errors;
  };

  const handleFocus = (e) => {
    const validation = validate(initialValues);
    setIsError(validation);
    setIsFocus({ ...isFocus, [e.target.name]: true });
  };

  const handleCheckBox = (value = "") => {
    if (value === "newsletter") {
      return setIsNewsLetter((prev) => !prev);
    }
    setIsDisable(!isDisable);
    setIsDisableError("");
  };

  const handleEyeIconClick = (inputType) =>
    inputType === "password"
      ? setIsShowPassword(!isShowPassword)
      : setIsShowConfirmPassword(!isShowConfirmPassword);

  return (
    <>
      {/* <Col lg={12} className="space-mb--30">
                <input type="text" id="regEmail" onBlur={handleFocus} placeholder="Username *" onChange={handleChangeValue} name="userName" value={initialValues.userName} required />
                {isFocus.userName && isError.userName ? (
                    <p className="error-msg">{isError.userName}</p>
                ) : ""}
            </Col> */}
      <Col lg={12} className="space-mb--30">
        <input
          type="text"
          id="regEmail"
          onBlur={handleFocus}
          placeholder="Email Address *"
          onChange={handleChangeValue}
          name="email"
          value={initialValues.email}
          required
        />
        {isFocus.email && isError.email ? (
          <p className="error-msg">{isError.email}</p>
        ) : (
          ""
        )}
      </Col>
      <Col lg={12} className="space-mb--30">
        <div className="d-flex align-item-center">
          <input
            type={isShowPassword ? "text" : "password"}
            id="regPassword"
            placeholder="Password *"
            onBlur={handleFocus}
            onChange={handleChangeValue}
            value={initialValues.password}
            name="password"
            required
          />
          {isShowPassword ? (
            <FaRegEye
              onClick={() => handleEyeIconClick("password")}
              className="eye-icon"
            />
          ) : (
            <FaRegEyeSlash
              onClick={() => handleEyeIconClick("password")}
              className="eye-icon"
            />
          )}
        </div>
        {isFocus.password && isError.password ? (
          <p className="error-msg register">{isError.password}</p>
        ) : (
          ""
        )}
        <div
          className={`password-strength-container register ${passwordStrength}`}
        >
          <div className="password-strength-bar register" />
          <div className="password-strength-bar register" />
          <div className="password-strength-bar register" />
          <div className="password-strength-bar register" />
        </div>
        <p style={{ paddingTop: "3px" }} className={passwordStrength}>
          {passwordStrength ? passwordStrength : ""}
        </p>
      </Col>
      <Col lg={12} className="space-mb--30">
        <div className="d-flex align-item-center">
          <input
            type={isShowConfirmPassword ? "text" : "password"}
            id="regConfirmPassword"
            placeholder="Confirm Password *"
            onBlur={handleFocus}
            onChange={handleChangeValue}
            name="confirmPassword"
            value={initialValues.confirmPassword}
            required
          />
          {isShowConfirmPassword ? (
            <FaRegEye
              onClick={() => handleEyeIconClick("cPassword")}
              className="eye-icon"
            />
          ) : (
            <FaRegEyeSlash
              onClick={() => handleEyeIconClick("cPassword")}
              className="eye-icon"
            />
          )}
        </div>
        {isFocus.confirmPassword && isError.confirmPassword ? (
          <p className="error-msg">{isError.confirmPassword}</p>
        ) : (
          ""
        )}
      </Col>
      {/* <Col lg={12} className="space-mb--30">
                <FormControl className={`m-0 ${classes.formControl}`}>
                    <NativeSelect
                        value={initialValues.orgId}
                        onChange={handleChangeOrgValue}
                        name="orgName"
                        inputProps={{
                            name: 'orgName',
                            id: 'age-native-label-placeholder'
                        }}
                    >
                        <option value="" selected disabled hidden>Select Organization</option>
                        {orgList.length > 0 ? orgList.map((item) => (
                            <option value={item.id}>{item.value}</option>
                        )) : <option value="" disabled>No Organization</option>
                        }
                    </NativeSelect>
                </FormControl>
                {isFocus.orgName && isError.orgName ? (
                    <p className="error-msg">{isError.orgName}</p>
                ) : ""}
            </Col> */}
      {/* <Col lg={12} className="space-mb--30">
                <FormControl className={`m-0 ${classes.formControl}`}>
                    <NativeSelect
                        value={initialValues.role}
                        onChange={handleChangeValue}
                        name="role"
                        inputProps={{
                            name: 'role',
                            id: 'age-native-label-placeholder',
                        }}
                    >
                        <option value="">Role</option>
                        <option value="user">User</option>
                    </NativeSelect>
                </FormControl>
                {isFocus.role && isError.role ? (
                    <p className="error-msg">{isError.role}</p>
                ) : ""}
            </Col> */}
      {/* <Col lg={12} className="text-center">
                <div className="d-flex align-items-center registration-checkbox-area">
                    <Checkbox color="primary" name="isAffiliated" checked={initialValues.isAffiliated} value={initialValues.isAffiliated} onChange={handleChangeValue} />
                    <label className="mb-0 checkbox">Affiliated to business </label>
                </div>
            </Col> */}
      <Col lg={12} className="text-center" style={{ marginBottom: "10px" }}>
        <div className="d-flex align-items-center registration-checkbox-area">
          <Checkbox
            color="primary"
            checked={isDisable}
            name="terms"
            onBlur={handleFocus}
            onChange={handleCheckBox}
          />
          <label className={`${isModal ? "checkbox-text" : ""} mb-0 checkbox`}>
            I agree to the terms and privacy policy
          </label>

          {isDisableError ? (
            <p
              className="error-msg"
              style={{ position: "absolute", bottom: "-5.1px", left: "56px" }}
            >
              {isDisableError}
            </p>
          ) : (
            ""
          )}
        </div>
      </Col>
      <Col lg={12}>
        <div className="d-flex align-items-center registration-checkbox-area">
          <Checkbox
            color="primary"
            checked={isNewsLetter}
            name="terms"
            onBlur={handleFocus}
            onChange={() => handleCheckBox("newsletter")}
          />
          <label className={`${isModal ? "checkbox-text" : ""} mb-0 checkbox`}>
            I want to subscribe to newsletter
          </label>
        </div>
      </Col>
      <Col lg={12} className="text-center mt-4">
        <button
          className="lezada-button lezada-button--medium"
          onClick={handleSubmit}
          disabled={isRegisterLoading}
        >
          register{" "}
          {isRegisterLoading ? <Spinner animation="border" size="sm" /> : null}
        </button>
      </Col>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
    cartItems: state.cartData,
    wishlistItems: state.wishlistItems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserEmail: (email) => {
      dispatch(setUserEmail(email));
    },
    addAPIDataToCart: (data) => {
      dispatch(addAPIDataToCart(data));
    },
    addAPIDataToWishlist: (data) => {
      dispatch(addAPIDataToWishlist(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndividualRegistration);
