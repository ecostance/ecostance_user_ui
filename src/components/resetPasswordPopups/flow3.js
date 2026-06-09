import { useRouter } from 'next/router'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import {
  changePassword,
  login,
  me,
  resetPasswordUsingOTP,
  resetPasswordUsingToken,
  userRegistration,
} from '../../apiClient/auth'
import { setCookies, getCookie } from 'cookies-next'
// import Registration from '../../pages/other/registration'
import Link from 'next/link'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useToasts } from 'react-toast-notifications'
import { validateUser } from 'src/redux/actions/userAction'
import LezadaBackdrop from '../lezadaBackdrop'
import { updateApiCartData } from 'src/redux/store'
import { getWishlist } from 'src/apiClient/wishlist'
import { updateAPICarbonCalculator } from 'src/helpers/updateAPICalculator'

const ResetPasswordConfirmPassword = ({
  token,
  setShowForgotPasswordPopup,
  setShowPreviousPopup,
  origin,
  sendPrimaryEmailCode,
}) => {
  const { addToast } = useToasts()
  const [isError, setIsError] = useState({})
  const [isFocus, setIsFocus] = useState({})
  const [passwordStrength, setPasswordStrength] = useState('')
  const [initialValues, setInitialValues] = useState({
    userName: '',
    password: '',
    email: '',
    regPassword: '',
    regConfirmPassword: '',
  })
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)

  const handleChangeValue = (e) => {
    setInitialValues({
      ...initialValues,
      [e.target.name]: e.target.value.trim(),
    })
    if (e.target.name === 'regPassword')
      checkPasswordStrength(e.target.value.trim())
    setIsError({ ...isError, [e.target.name]: '' })
  }

  const [loginActive, setLoginActive] = useState(true)

  const validate = (values) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let errors = {}
    if (!values.userName) {
      errors.userName = 'Please enter email'
    }
    if (values.userName && !values.userName.match(emailRegex)) {
      errors.userName = 'Please enter a valid email'
    }
    if (!values.password) {
      errors.password = 'Password is required'
    }
    return errors
  }

  const validateReg = (values) => {
    let errors = {}

    if (
      values.regPassword &&
      !values.regPassword.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      errors.regPassword =
        'Password must be at least 8 characters long and contain lower case, upper case, number, and special character.'
    }
    if (!values.regPassword) {
      errors.regPassword = 'Password is required'
    }
    if (!values.regConfirmPassword) {
      errors.regConfirmPassword = 'Confirm password is required'
    }
    if (values.regPassword !== values.regConfirmPassword) {
      errors.regConfirmPassword = 'Passwords do not match'
    }

    return errors
  }

  const handleRegistration = async (e) => {
    e.preventDefault()
    const validation = validateReg(initialValues)

    setIsError(validation)
    setIsFocus(validation)

    if (Object.keys(validation).length) {
      return null
    }
    setIsChangePasswordLoading(true)
    // if (userData?.email) {
    //   if (userData.email !== initialValues.email) {
    //   } else {
    //     const response = await checkEmailVerificationStatus(userData?.email);

    //     if (response.status === 200) {
    //       if (!response.data?.emailVerified) {
    //         setEmail(initialValues.email);
    //         showSuccessModel(true, userData.email, userData?.email);
    //         setIsChangePasswordLoading(false);
    //         return;
    //       } else {
    //       }
    //     }
    //   }
    // }

    resetPasswordUsingToken(
      token,
      initialValues.regPassword,
      initialValues.regConfirmPassword
    )
      .then((response) => {
        if (response?.status === 200) {
          // setEmail(initialValues.email)
          // setUserEmail(initialValues.email)
          // showSuccessModel(true, response.data?.message, initialValues?.email);
          if (origin === 'CHANGE_EMAIL') {
            sendPrimaryEmailCode()
            addToast(
              'Password changed successfully, Please continue with changing email',
              {
                appearance: 'success',
                autoDismiss: true,
              }
            )
          } else {
            addToast(response?.data?.message, {
              appearance: 'success',
              autoDismiss: true,
            })
          }

          setShowForgotPasswordPopup(false)
          setShowPreviousPopup && setShowPreviousPopup(true)
        } else {
          setIsError({ apiError: response.data?.message })
          addToast(response.data?.message, {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      })
      .catch((err) => {
        addToast('Please try after sometime', {
          appearance: 'error',
          autoDismiss: true,
        })
      })
      .finally(() => {
        setIsChangePasswordLoading(false)
      })
  }

  const [isDisable, setIsDisable] = useState(false)
  const [isDisableError, setIsDisableError] = useState('')

  const [isRegisterLoading, setIsChangePasswordLoading] = useState(false)
  const [newsLetterSelected, setnewsLetterSelected] = useState(false)
  const handleFocus = (e) => {
    const validation = validate(initialValues)
    setIsError(validation)
    setIsFocus({ ...isFocus, [e.target.name]: true })
  }

  const handleFocusReg = (e) => {
    const validation = validateReg(initialValues)
    setIsError(validation)
    setIsFocus({ ...isFocus, [e.target.name]: true })
  }

  const handleCheckBox = () => {
    setIsDisable(!isDisable)
    setIsDisableError('')
  }

  const handleEyeIconClick = () => setIsShowPassword(!isShowPassword)

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return setPasswordStrength('')

    if (
      password.length >= 12 &&
      password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
      return setPasswordStrength('Strong')

    if (
      password.length >= 8 &&
      password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
      return setPasswordStrength('Good')

    if (
      password.length > 8 &&
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
      return setPasswordStrength('Weak')

    if (
      password.length < 8 ||
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
      return setPasswordStrength('Poor')
  }

  return (
    <>
      <div className="standard-popup-holder login-register--main-popup-holder">
        <img
          className="login-reg-image"
          src="/assets/images/login-register-popup.png"
        />
        <div className="login-registration-popup-info">
          <div
            className="standard-popup-cross-icon login-register-cross-icon"
            onClick={() => setShowForgotPasswordPopup(false)}
          >
            <img src="/assets/images/cross-sustainability.png" />
          </div>
          <div style={{ marginTop: '50px' }}>
            <h1>Change Password </h1>
          </div>

          <form className="login-reg-popup-register--holder">
            {/* <h1>
                Please <span>Login</span> / <span>Register</span>{' '}
                {origin === 'checkout' && 'to checkout'}
              </h1> */}
            <div className="login-registration--input-holder reg-input-holder">
              <div className="login-res-popup-input-holder">
                <label htmlFor="regPassword">Password *</label>
                <input
                  onBlur={handleFocusReg}
                  placeholder="Password"
                  type={isShowPassword ? 'text' : 'password'}
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
                  <p className="error-msg" style={{ marginBottom: '0px' }}>
                    {isError.regPassword}
                  </p>
                ) : (
                  ''
                )}
                <div
                  className={`password-strength-container register ${passwordStrength}`}
                  style={{ height: '6px' }}
                >
                  <div className="password-strength-bar register" />
                  <div className="password-strength-bar register" />
                  <div className="password-strength-bar register" />
                  <div className="password-strength-bar register" />
                </div>
                <p
                  style={{ paddingTop: '3px', fontSize: '15px' }}
                  className={passwordStrength}
                >
                  {passwordStrength ? passwordStrength : ''}
                </p>
              </div>
              <div className="login-res-popup-input-holder">
                <label htmlFor="regConfirmPassword">Confirm Password *</label>
                <input
                  type={isShowConfirmPassword ? 'text' : 'password'}
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
                  ''
                )}
                {isError?.apiError ? (
                  <p className="error-msg">{isError?.apiError}</p>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="login-reg-remember-login-holder">
              <div style={{ marginTop: '30px' }}>
                <button className="button--black" onClick={handleRegistration}>
                  DONE{' '}
                  {isRegisterLoading ? (
                    <Spinner size="sm" animation="border" />
                  ) : null}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ResetPasswordConfirmPassword
