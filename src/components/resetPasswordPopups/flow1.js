import { useRouter } from 'next/router'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import {
  login,
  me,
  sendForgotPasswordOTP,
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

const ResetPasswordEmail = ({
  setIsShowModel,
  setGlobalEmail,
  setShowSecondFlow,
  setShowForgotPasswordPopup,
}) => {
  const { addToast } = useToasts()
  const router = useRouter()
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
  const [isLoginLoading, setIsLoading] = useState(false)

  const handleResetPassword = async (e) => {
    e.preventDefault()
    const validation = validate(initialValues)
    setIsError(validation)
    setIsFocus(validation)
    if (Object.keys(validation).length) {
      return null
    }
    try {
      setIsLoading(true)
      const { userName } = initialValues
      const loginResponse = await sendForgotPasswordOTP(userName)

      if (loginResponse.status == 200) {
        // validateUser();
        setGlobalEmail(userName)
        addToast(loginResponse?.data?.message, {
          autoDismiss: true,
          appearance: 'success',
        })
        setIsShowModel(false)
        setShowSecondFlow(true)
      } else {
        setIsError({ apiError: loginResponse?.data?.message })
        // addToast(loginResponse?.data?.message, {
        //   autoDismiss: true,
        //   appearance: 'error',
        // })
      }
    } finally {
      setIsLoading(false)
    }
  }

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
    return errors
  }

  const validateReg = (values) => {
    let errors = {}

    if (!values.email) {
      errors.email = 'Email is required'
    }
    if (
      values.email &&
      !values.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errors.email = 'Enter a valid Email'
    }
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

  const [isDisable, setIsDisable] = useState(false)
  const [isDisableError, setIsDisableError] = useState('')

  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
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
            className={`login-reg-popup-nav ${
              !loginActive && 'registerActive'
            }`}
          ></div>
          {loginActive && (
            <form className="login-reg-popup-login--holder ">
              <h1>
                Enter your registered email below to receive password reset
                instruction
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
                    ''
                  )}
                  {isError?.apiError ? (
                    <p className="error-msg">{isError?.apiError}</p>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="login--forgot-pasword-holder">
                <button className="button--black" onClick={handleResetPassword}>
                  SEND{' '}
                  {isLoginLoading ? (
                    <Spinner size="sm" animation="border" />
                  ) : null}
                </button>
              </div>
              {}
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default ResetPasswordEmail
