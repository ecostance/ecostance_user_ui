import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import LezadaBackdrop from './lezadaBackdrop'
import { verifyUserEmail } from 'src/apiClient/auth'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import { deleteCookie } from 'cookies-next'

let timeoutId
let shouldShowInvalidOTP
const verifyPopup = ({
  email,
  setShouldShowVerifyModel,
  reSendRegistrationMail,
  origin,
  originCalculator,
  setIsVerifyEmailSent,
  isVerifyEmailSent,
  onEmailVerified,
}) => {
  const { addToast } = useToasts()
  const router = useRouter()

  const input1Ref = useRef()
  const input2Ref = useRef()
  const input3Ref = useRef()
  const input4Ref = useRef()
  const input5Ref = useRef()
  const input6Ref = useRef()

  const popupData = {
    heading: 'Verify your email to checkout',
  }

  /**--------------------------Timer Logic Starts-------------------------- */
  useEffect(() => {
    if (isVerifyEmailSent) startTimer()
  }, [isVerifyEmailSent])

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
    setIsVerifyEmailSent(false)
    setTimerData({
      minutes: 5,
      seconds: 0,
    })
  }

  const formatRemainingTime = (time) => String(time).padStart(2, '0')

  /**--------------------------Timer Logic Ends-------------------------- */

  const handleCloseAndLogout = () => {
    deleteCookie('JWTToken')
    deleteCookie('checkout')
    deleteCookie('stripeSession')
    deleteCookie('user-slug', { domain: `${process.env.COOKIE_URL}` })
    localStorage.removeItem('email')
    localStorage.removeItem('userId')
    localStorage.removeItem('name')
    localStorage.removeItem('userCreated')
    localStorage.removeItem('TotalOrders')
    setShouldShowVerifyModel(false)
    localStorage.setItem('showVerifyLogoutToast', 'true')
    window.location.href = '/'
  }

  const [isOTPValid, setIsOTPValid] = useState(false)
  const [invalidOTPRes, setInvalidOTPRes] = useState('')
  const [otpInput, setOtpInput] = useState([
    { ref: input1Ref, value: '' },
    { ref: input2Ref, value: '' },
    { ref: input3Ref, value: '' },
    { ref: input4Ref, value: '' },
    { ref: input5Ref, value: '' },
    { ref: input6Ref, value: '' },
  ])

  useEffect(() => {
    input1Ref.current.focus()
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

    newOtpInput[index + 1].ref.current.focus()
  }

  const handleKeyPress = (key, index, prevValue) => {
    setInvalidOTPRes('')
    if (key !== 'Backspace') return
    if (index - 1 < 0) return
    if (prevValue !== '') return
    otpInput[index - 1].ref.current.focus()
  }

  const verifyAccoutHandler = async () => {
    let OTP = otpInput.reduce((acc, input) => {
      return acc + input.value
    }, '')
    try {
      const res = await verifyUserEmail(email, OTP)
      if (res?.status === 200) {
        console.log("register-origin", window.location.href)
        onEmailVerified?.()
        addToast('Email Verification Successfull!', {
          appearance: 'success',
          autoDismiss: true,
        })
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
        setTimeout(() => setShouldShowVerifyModel(false), 1000)

        if (originCalculator) {
          return
        }

        if (origin === 'checkout') {
          router.push('/other/checkout')
        } else if (origin === 'view-cart') {
          router.push('/other/cart')
        } else {
          setTimeout(() => window.location.reload(), 1000)
        }
      } else if (res?.data?.code === 'USER_ALREADY_VERIFIED') {
        addToast('Email Already Verified', {
          appearance: 'error',
          autoDismiss: true,
        })
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
    input1Ref.current.focus()
    resetTimer()
    if (origin === 'checkout') return reSendRegistrationMail(email, origin)
    reSendRegistrationMail()
  }

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
      <div className="standard-popup-holder registration--popup-holder verify-popup-holder">
        <div
          className="standard-popup-cross-icon"
          onClick={handleCloseAndLogout}
        >
          <img src="/assets/images/cross-sustainability.png" />
        </div>

        <div className="registration--popup-content-wrapper verify-email-content-wrapper">
          <div className="registration--popup-img-area">
            <img src="/images/reg-success.png" />
          </div>
          <div className="verify-email-text-area">
            <h3 className="registration-success-heading verify-email-heading">
              {origin === 'checkout'
                ? popupData.heading
                : 'Verify your email to complete registration and login'}
            </h3>
            {origin === 'checkout' ? (
              <div
                className="verify-email-message"
                style={{ marginBottom: '26px' }}
              >
                Please enter the six-digit code we have sent you at
                <span className="registraion-success-user-email verify-email-user-email">
                  {' '}
                  {email}.
                </span>
              </div>
            ) : (
              <div className="verify-email-message">
                Help us secure your account by verifying that
                <span className="registraion-success-user-email verify-email-user-email">
                  {' '}
                  {email}{' '}
                </span>
                is your email. Please enter the six-digit code we sent you to
                verify your email.
              </div>
            )}
            <div className="verify-email-otp-container">{otpFields}</div>

            <div className="invalid-otp-msg">{invalidOTPRes}</div>
            <p className="timer-text">{remainingTime}</p>
            <div className="verify-email-button-container">
              <button
                className="registration-success-button verify-email-button do-it-later button--black"
                onClick={handleCloseAndLogout}
              >
                I'll verify it later
              </button>
            </div>
            <div className="verify-email-resend-container">
              Didn't get a code?{' '}
              <span
                onClick={reSendRegistrationMailHandler}
                style={{
                  textDecoration: 'underline',
                }}
              >
                Click here to Resend
              </span>
            </div>
          </div>
        </div>
      </div>
    </LezadaBackdrop>
  )
}

export default verifyPopup
