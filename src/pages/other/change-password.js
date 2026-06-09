import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import { sendResetPassword } from "src/apiClient/auth";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { deleteCookie } from "cookies-next";
import { addOrder } from "src/redux/actions/orderActions";
import { deleteAllFromCart } from "src/redux/actions/cartActions";
import { connect } from "react-redux";
import { logoutCheckoutCurrencyAction } from "src/helpers/currencyActionHelper";
import { removeAllItemsFromSustainabilityPage } from "src/redux/actions/sustainabilityActions";
import { removeAllItemsFromBusinessSustainabilityPage } from "src/redux/actions/businessSustainabilityActions";
import { removeCurrentUser } from "src/redux/actions/userAction";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const LoginRegister = ({
  deleteAllFromCar,
  removeAllItemsFromSustainabilityPaget,
  removeCurrentUser,
}) => {
  const [passwordStrength, setPasswordStrength] = useState("");
  const Router = useRouter();
  const { addToast } = useToasts();
  const [showPassword, setShowPassword] = useState(false);
  const [initialValues, setInitialValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isError, setIsError] = useState({});
  const [isFocus, setIsFocus] = useState({});
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const {
    query: { tk },
  } = Router;

  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    deleteCookie("JWTToken");
    deleteCookie("checkout");
    deleteCookie("user-slug", {
      domain: `${process.env.COOKIE_URL}`,
    });

    deleteCookie("stripeSession");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validate(initialValues);

    setIsError(validation);
    setIsFocus(validation);

    if (Object.keys(validation).length) {
      return null;
    }
    setIsloading(true);
    await sendResetPassword(initialValues, tk)
      .then((response) => {
        try {
          if (response.status == 200) {
            addToast(response.data?.message, {
              appearance: "success",
              autoDismiss: true,
            });
            deleteCookie("JWTToken");
            deleteCookie("checkout");
            deleteCookie("user-slug", {
              domain: `${process.env.COOKIE_URL}`,
            });

            deleteCookie("stripeSession");
            logoutCheckoutCurrencyAction();
            removeAllItemsFromSustainabilityPage();
            removeAllItemsFromBusinessSustainabilityPage();
            addOrder(false, {});
            deleteAllFromCart();
            removeCurrentUser();
            Router.push("/login-register");
          } else {
            addToast(response.data?.message, {
              appearance: "error",
              autoDismiss: true,
            });
          }
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        addToast("Failed to change Password", {
          appearance: "error",
          autoDismiss: true,
        });
      })
      .finally(() => {
        setIsloading(false);
      });
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
    setInitialValues({
      ...initialValues,
      [e.target.name]: e.target.value.trim(),
    });
    setIsError({ ...isError, [e.target.name]: "" });
    if (e.target.name === "password")
      checkPasswordStrength(e.target.value.trim());
  };

  const validate = (values) => {
    let errors = {};
    if (!values.password) {
      errors.password = "New Password is Required";
    }
    if (
      values.password &&
      !values.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      errors.password =
        "Password must be at least 8 characters long and contain lower case, upper case, number, and special character.";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm New Password is Required";
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const handleFocus = (e) => {
    const validation = validate(initialValues);
    setIsError(validation);
    setIsFocus({ ...isFocus, [e.target.name]: true });
  };

  const handleEyeIconClick = (inputType) =>
    inputType === "password"
      ? setIsShowPassword(!isShowPassword)
      : setIsShowConfirmPassword(!isShowConfirmPassword);

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Change Password"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Change Password</li>
        </ul>
      </BreadcrumbOne>
      <div className="login-area space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={6} className="space-mb-mobile-only--50">
              <div className="lezada-form login-form">
                <form>
                  <Row>
                    <Col lg={12}>
                      <div className="section-title--login text-center space-mb--50">
                        <h2 className="space-mb--20">Change Password</h2>
                        {/* <p>Great to have you back!</p> */}
                      </div>
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <div className="d-flex align-item-center">
                        <input
                          type={isShowPassword ? "text" : "password"}
                          name="password"
                          placeholder="New password   "
                          value={initialValues.password}
                          onBlur={handleFocus}
                          autoCompleteType="off"
                          onChange={(e) => handleChangeValue(e)}
                          // error
                          // helperText={isError.email}
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
                        <p
                          className="error-msg"
                          style={{ marginBottom: "0px" }}
                        >
                          {isError.password}
                        </p>
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
                      <p
                        style={{ paddingTop: "3px" }}
                        className={passwordStrength}
                      >
                        {passwordStrength ? passwordStrength : ""}
                      </p>
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <div className="d-flex align-item-center">
                        <input
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          type={isShowConfirmPassword ? "text" : "password"}
                          value={initialValues.confirmPassword}
                          onBlur={handleFocus}
                          onChange={(e) => handleChangeValue(e)}
                          // error
                          // helperText={isError.password}
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
                    <Col lg={12} className="space-mb--30">
                      <button
                        className="lezada-button lezada-button--medium"
                        onClick={handleSubmit}
                      >
                        Submit{" "}
                        {isLoading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          ""
                        )}
                      </button>
                    </Col>
                  </Row>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAllFromCart: () => {
      dispatch(deleteAllFromCart(true));
    },
    removeAllItemsFromSustainabilityPage: () => {
      dispatach(removeAllItemsFromSustainabilityPage());
    },
    removeCurrentUser: () => {
      dispatch(removeCurrentUser());
    },
  };
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    userData: state.userData,
    orderData: state.orderData,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegister);
