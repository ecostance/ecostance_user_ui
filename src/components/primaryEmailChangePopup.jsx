import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import LezadaBackdrop from './lezadaBackdrop'
import { useToasts } from 'react-toast-notifications'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import {
  verifyPrimaryEmail,
  verifyPasswordForPrimaryEmail,
} from 'src/apiClient/auth'
import { useRouter } from 'next/router'
import { Spinner } from 'react-bootstrap'

let timeoutId
let token
let shouldShowInvalidOTP
const primaryEmailChangePopup = ({
  email,
  setShowPrimaryEmailPopup,
  isPrimaryEmailCodeSent,
  setIsPrimaryEmailCodeSent,
  sendPrimaryEmailCode,
  emailEditEnabledRef,
  getMeData,
  isAttemptLeft,
  setIsAttemptLeft,
  handleForgotPasswordPopup,
}) => {
  const { addToast } = useToasts()
  const router = useRouter()

  const input1Ref = useRef()
  const input2Ref = useRef()
  const input3Ref = useRef()
  const input4Ref = useRef()
  const input5Ref = useRef()
  const input6Ref = useRef()

  const [isOTPValid, setIsOTPValid] = useState(false)
  const [invalidOTPRes, setInvalidOTPRes] = useState('')
  const [isStepOneCompleted, setIsStepOneCompleted] = useState(false)
  const [initialValues, setInitialValues] = useState({ password: '' })
  const [isError, setIsError] = useState({})
  const [isFocus, setIsFocus] = useState({})
  const [shouldShowPassword, setShouldShowPassword] = useState(false)
  const [otpInput, setOtpInput] = useState([
    { ref: input1Ref, value: '' },
    { ref: input2Ref, value: '' },
    { ref: input3Ref, value: '' },
    { ref: input4Ref, value: '' },
    { ref: input5Ref, value: '' },
    { ref: input6Ref, value: '' },
  ])

  const [passwordLoading, setPasswordLoading] = useState(false)

  /**--------------------------Timer Logic Starts-------------------------- */
  useEffect(() => {
    if (isPrimaryEmailCodeSent) startTimer()
  }, [isPrimaryEmailCodeSent])

  useEffect(() => {
    return () => resetTimer()
  }, [])

  const [timerData, setTimerData] = useState({
    minutes: 5,
    seconds: 0,
  })
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const startTimer = () => {
    setIsTimerRunning(true)
    timer(timerData)
  }

  useEffect(() => {
    if (isTimerRunning)
      timeoutId = setTimeout(() => {
        timer(timerData)
      }, 1000)
  }, [timerData, isTimerRunning])

  const timer = (timerData) => {
    if (timerData?.seconds === 0 && timerData?.minutes !== 0)
      return setTimerData((prevState) => ({
        minutes: prevState.minutes - 1,
        seconds: 59,
      }))

    if (timerData?.seconds === 0 && timerData?.minutes === 0)
      return resetTimer()

    if (timerData?.seconds > 0)
      return setTimerData((prevState) => ({
        ...prevState,
        seconds: prevState.seconds - 1,
      }))
  }

  const resetTimer = () => {
    clearTimeout(timeoutId)
    setIsTimerRunning(false)
    setIsPrimaryEmailCodeSent(false)
    setTimerData({
      minutes: 5,
      seconds: 0,
    })
  }

  const formatRemainingTime = (time) => String(time).padStart(2, '0')

  /**--------------------------Timer Logic Ends-------------------------- */

  useEffect(() => {
    input1Ref?.current?.focus()
  }, [])

  useEffect(() => {
    const isValid = otpInput.every((input) => typeof input.value === 'number')
    setIsOTPValid(isValid)
    if (isValid) verifyAccoutHandler()
  }, [otpInput])

  const setOtpInputHandler = (index, val) => {
    if (isNaN(val)) return
    const newOtpInput = otpInput.map((ele, otpInputIndex) => {
      if (otpInputIndex === index)
        return {
          ...ele,
          value: val.trim() === '' ? val : Number(val),
        }
      return { ...ele, value: ele.value }
    })
    setOtpInput(newOtpInput)

    if (index + 1 >= newOtpInput.length) return
    if (val.trim() === '') return
    if (newOtpInput[index + 1].value !== '') return

    newOtpInput[index + 1].ref?.current?.focus()
  }

  const handleKeyPress = (key, index, prevValue) => {
    setInvalidOTPRes('')
    if (key !== 'Backspace') return
    if (index - 1 < 0) return
    if (prevValue !== '') return
    otpInput[index - 1].ref?.current?.focus()
  }

  const verifyAccoutHandler = async () => {
    let OTP = otpInput.reduce((acc, input) => {
      return acc + input.value
    }, '')

    try {
      const res = await verifyPrimaryEmail({ otp: OTP })
      if (res?.status === 200) {
        // setTimeout(() => setShowPrimaryEmailPopup(false), 1000)
        // emailEditEnabledRef.current?.setPrimaryEmailEditEnabled(false)
        setIsStepOneCompleted(true)
        token = res?.data?.data
      } else if (res?.status === 400) {
        shouldShowInvalidOTP = true
        setInvalidOTPRes(res?.data?.message)
        resetTimer()
        setOtpInput([
          { ref: input1Ref, value: '' },
          { ref: input2Ref, value: '' },
          { ref: input3Ref, value: '' },
          { ref: input4Ref, value: '' },
          { ref: input5Ref, value: '' },
          { ref: input6Ref, value: '' },
        ])
        otpInput.forEach((input) => {
          input?.ref?.current?.blur()
        })
      } else {
        addToast(res?.data?.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    } catch (error) {
      addToast(error?.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }

  const verifyPasswordHandler = async () => {
    try {
      if (!isAttemptLeft) return
      const err = validate(initialValues)
      if (Object.keys(err).length > 0) return
      setPasswordLoading(true)
      const res = await verifyPasswordForPrimaryEmail(
        { password: initialValues.password },
        token
      )
      setPasswordLoading(false)
      if (res?.status === 200) {
        addToast('Primary email updated successfully', {
          appearance: 'success',
          autoDismiss: true,
        })
        setTimeout(() => setShowPrimaryEmailPopup(false), 1000)
        emailEditEnabledRef.current?.setPrimaryEmailEditEnabled(false)
        emailEditEnabledRef.current?.setPrimaryEmailSuccess(true)
        getMeData()
      } else if (res?.data?.code === 'PRIMARY_EMAIL_CHANGE_ATTEMPTS_EXCEEDED') {
        setIsError({
          password: (
            <p>
              Wrong password.
              <br /> Your account is locked per our security protocol. To
              unlock, please reset your password by clicking “Forgot Password”.
              Meanwhile you can use the system and we will remind you next time
              you log in.
            </p>
          ),
        })
        setInitialValues((prevData) => ({ ...prevData, password: '' }))
        return setIsAttemptLeft(false)
      } else if (
        res?.data?.primaryEmailChangeAttemptCount > 1 &&
        res?.data?.primaryEmailChangeAttemptCount < 4
      ) {
        setInitialValues((prevData) => ({ ...prevData, password: '' }))
        setIsError({
          password: (
            <p>
              Wrong password.
              <br /> Your account will be locked after{' '}
              <span style={{ textDecoration: 'underline' }}>
                {4 - res?.data?.primaryEmailChangeAttemptCount}
              </span>{' '}
              more unsuccessful{' '}
              {4 - res?.data?.primaryEmailChangeAttemptCount === 1
                ? 'attempt'
                : 'attempts'}
              . Please reset your password by clicking “Forgot Password”
            </p>
          ),
        })
      } else {
        setIsError({ password: res?.data?.message })
        setInitialValues((prevData) => ({ ...prevData, password: '' }))
      }
    } catch (error) {
      addToast(error?.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }

  const otpFields = otpInput.map((ele, index) => (
    <input
      className={`input-box ${invalidOTPRes.trim() && 'err-box'}`}
      key={index}
      type="tel"
      maxLength={1}
      ref={ele.ref}
      value={ele.value}
      onChange={({ target: { value } }) => setOtpInputHandler(index, value)}
      onKeyDown={({ key }) => handleKeyPress(key, index, ele.value)}
    />
  ))

  const reSendRegistrationMailHandler = () => {
    shouldShowInvalidOTP = false
    setInvalidOTPRes('')
    setOtpInput([
      { ref: input1Ref, value: '' },
      { ref: input2Ref, value: '' },
      { ref: input3Ref, value: '' },
      { ref: input4Ref, value: '' },
      { ref: input5Ref, value: '' },
      { ref: input6Ref, value: '' },
    ])
    input1Ref?.current?.focus()
    resetTimer()
    sendPrimaryEmailCode(email)
  }

  const handleChangeValue = (e) => {
    setInitialValues({
      ...initialValues,
      [e.target.name]: e.target.value.trim(),
    })
    setIsError({ ...isError, [e.target.name]: '' })
  }
  const validationHandler = (e) => {
    const validation = validate(initialValues)
    setIsError(validation)
    setIsFocus({ ...isFocus, [e.target.name]: true })
  }

  const validate = (values) => {
    let errors = {}
    if (!values.password) {
      errors.password = 'Password is required'
    }
    return errors
  }

  const heading = isStepOneCompleted
    ? 'Enter Password to change your Primary email'
    : 'Verify your new Primary email for login'

  // const message = isStepOneCompleted
  //   ? `Help us secure your account by entering your current password.`
  //   : `Please enter the six-digit code we have sent you at ${email}`

  const message = isStepOneCompleted ? (
    <p>Help us secure your account by entering your current password.</p>
  ) : (
    <p>
      Please enter the six-digit code we have sent you at{' '}
      <span style={{ color: '#000', textDecoration: 'underline' }}>
        {email}
      </span>
    </p>
  )

  const stepTwoClass = isStepOneCompleted ? 'step-two' : ''

  let remainingTime
  if (isTimerRunning) {
    remainingTime = (
      <p>
        Please enter the code within this time:{' '}
        <span style={{ color: '#f02849', fontWeight: '500' }}>
          {formatRemainingTime(timerData?.minutes)}:
          {formatRemainingTime(timerData?.seconds)}
        </span>
      </p>
    )
  } else {
    if (invalidOTPRes || shouldShowInvalidOTP) {
      remainingTime = (
        <p>
          You can request new code{' '}
          <span style={{ color: '#f02849', fontWeight: '500' }}>now</span>
        </p>
      )
    } else {
      remainingTime = <p>Your request is being processed</p>
    }
  }
  return (
    <LezadaBackdrop>
      <div className="standard-popup-holder verify-popup-holder">
        <div
          className="standard-popup-cross-icon"
          onClick={() => {
            if (!isAttemptLeft)
              emailEditEnabledRef.current?.setPrimaryEmailEditEnabled(false)
            emailEditEnabledRef.current?.resetPrimaryEmail()
            setShowPrimaryEmailPopup(false)
          }}
        >
          <img src="/assets/images/cross-sustainability.png" />
        </div>

        <div className="verify-primary-email-content-wrapper">
          <div
            className={`verify-primary-email--popup-img-area ${stepTwoClass}`}
          >
            <div className="verify-primary-email--popup-steps-container">
              <p className="txt-step">Step {isStepOneCompleted ? 2 : 1}/2</p>
              <div className="steps-bar-container">
                <div className="steps-bar completed" />
                <div
                  className={`steps-bar ${
                    isStepOneCompleted ? 'completed' : ''
                  }`}
                />
              </div>
            </div>
            <div className="verify-primary-email--popup-img-container">
              <img
                className="verify-primary-email--popup-img"
                src="/images/river.png"
              />
            </div>
          </div>
          <div className={`verify-primary-email-text-area ${stepTwoClass}`}>
            <h3 className={`verify-primary-email-heading ${stepTwoClass}`}>
              {heading}
            </h3>

            <div className={`verify-primary-email-message ${stepTwoClass}`}>
              {message}
            </div>

            {isStepOneCompleted ? (
              <div className="login-res-popup-input-holder verify-primary-email--password-holder">
                <label htmlFor="password">Password *</label>
                <input
                  className={`${!isAttemptLeft ? 'disabled' : ''}`}
                  name="password"
                  value={initialValues.password}
                  onChange={(e) => handleChangeValue(e)}
                  placeholder="Password"
                  onBlur={validationHandler}
                  type={shouldShowPassword ? 'text' : 'password'}
                  disabled={!isAttemptLeft}
                />
                {shouldShowPassword ? (
                  <FaRegEye
                    className={`eye-icon login-reg-modal ${
                      !isAttemptLeft ? 'disabled' : ''
                    }`}
                    onClick={() => {
                      isAttemptLeft && setShouldShowPassword(false)
                    }}
                  />
                ) : (
                  <FaRegEyeSlash
                    className={`eye-icon login-reg-modal ${
                      !isAttemptLeft ? 'disabled' : ''
                    }`}
                    onClick={() => {
                      isAttemptLeft && setShouldShowPassword(true)
                    }}
                  />
                )}
                {isFocus.password && isError.password ? (
                  <p className="error-msg">{isError.password}</p>
                ) : (
                  ''
                )}
              </div>
            ) : (
              <>
                <div className="verify-email-otp-container verify-primary-email">
                  {otpFields}
                </div>
                <div className="invalid-otp-msg">{invalidOTPRes}</div>
                <p className="timer-text">{remainingTime}</p>
              </>
            )}

            <div
              className={`verify-primary-email-button-container ${stepTwoClass}`}
            >
              <button
                className={`verify-primary-email-button button--black ${
                  isStepOneCompleted && !isAttemptLeft
                    ? 'button--black--disabled'
                    : ''
                }`}
                disabled={passwordLoading}
                onClick={() => {
                  if (isStepOneCompleted) verifyPasswordHandler()
                  else {
                    emailEditEnabledRef.current?.resetPrimaryEmail()
                    setShowPrimaryEmailPopup(false)
                  }
                }}
              >
                {isStepOneCompleted ? 'Done' : "I'll verify it later"}
                {passwordLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  ''
                )}
              </button>
              {isStepOneCompleted && (
                <button
                  className="verify-primary-email-button ghost button--white"
                  onClick={() => {
                    if (!isAttemptLeft)
                      emailEditEnabledRef.current?.setPrimaryEmailEditEnabled(
                        false
                      )
                    emailEditEnabledRef.current?.resetPrimaryEmail()
                    setShowPrimaryEmailPopup(false)
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="verify-primary-email-resend-container">
              {isStepOneCompleted ? (
                <span
                  onClick={handleForgotPasswordPopup}
                  className="forgot-password"
                >
                  Forgot Password?
                </span>
              ) : (
                <div>
                  Didn't get a code?{' '}
                  <span onClick={reSendRegistrationMailHandler}>
                    Click to Resend
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LezadaBackdrop>
  )
}

export default primaryEmailChangePopup
