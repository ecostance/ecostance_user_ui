import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import LezadaBackdrop from './lezadaBackdrop'
import { useToasts } from 'react-toast-notifications'
import { verifyRecoveryEmail } from 'src/apiClient/auth'

let timeoutId
let shouldShowInvalidOTP
const recoveryEmailChangePopup = ({
  email,
  setShowRecoveryEmailPopup,
  sendRecoveryEmailCode,
  setIsRecoveryCodeSent,
  isRecoveryCodeSent,
  getMeData,
  emailEditEnabledRef,
}) => {
  const { addToast } = useToasts()

  const input1Ref = useRef()
  const input2Ref = useRef()
  const input3Ref = useRef()
  const input4Ref = useRef()
  const input5Ref = useRef()
  const input6Ref = useRef()

  const [isOTPValid, setIsOTPValid] = useState(false)
  const [invalidOTPRes, setInvalidOTPRes] = useState('')
  const [isStepOneCompleted, setIsStepOneCompleted] = useState(false)

  const [otpInput, setOtpInput] = useState([
    { ref: input1Ref, value: '' },
    { ref: input2Ref, value: '' },
    { ref: input3Ref, value: '' },
    { ref: input4Ref, value: '' },
    { ref: input5Ref, value: '' },
    { ref: input6Ref, value: '' },
  ])

  /**--------------------------Timer Logic Starts-------------------------- */
  useEffect(() => {
    if (isRecoveryCodeSent) startTimer()
  }, [isRecoveryCodeSent])

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
    setIsRecoveryCodeSent(false)
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
      const res = await verifyRecoveryEmail({ otp: OTP })
      if (res?.status === 200) {
        addToast('Recovery email updated successfully', {
          appearance: 'success',
          autoDismiss: true,
        })
        setTimeout(() => setShowRecoveryEmailPopup(false), 1000)
        emailEditEnabledRef.current?.setRecoveryEmailEditEnabled(false)
        emailEditEnabledRef.current?.setRecoveryEmailSuccess(true)
        getMeData()
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
    sendRecoveryEmailCode(email)
  }

  const heading = 'Verify your recovery email'

  const message = (
    <p>
      Please enter the six-digit code we have sent you at{' '}
      <span style={{ color: '#000', textDecoration: 'underline' }}>
        {email}
      </span>{' '}
      Six boxes below it
    </p>
  )

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
            emailEditEnabledRef.current?.resetRecoveryEmail()
            setShowRecoveryEmailPopup(false)
          }}
        >
          <img src="/assets/images/cross-sustainability.png" />
        </div>

        <div className="verify-primary-email-content-wrapper">
          <div
            className={`verify-primary-email--popup-img-area verify-recovery-email--popup-img-area`}
          >
            <div className="verify-primary-email--popup-steps-container recovery-email-steps-container">
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
          <div className={`verify-primary-email-text-area`}>
            <h3
              className={`verify-primary-email-heading recovery-email-heading`}
            >
              {heading}
            </h3>

            <div className={`verify-primary-email-message`}>{message}</div>

            <div className="verify-email-otp-container verify-primary-email">
              {otpFields}
            </div>
            <div className="invalid-otp-msg">{invalidOTPRes}</div>
            <p className="timer-text recovery-email-popup">{remainingTime}</p>

            <div className={`verify-primary-email-button-container`}>
              <button
                className="verify-primary-email-button button--black"
                onClick={() => {
                  emailEditEnabledRef.current?.resetRecoveryEmail()
                  setShowRecoveryEmailPopup(false)
                }}
              >
                I'll verify it later
              </button>
            </div>
            <div className="verify-primary-email-resend-container">
              Didn't get a code?{' '}
              <span onClick={reSendRegistrationMailHandler}>
                Click to Resend
              </span>
            </div>
          </div>
        </div>
      </div>
    </LezadaBackdrop>
  )
}

export default recoveryEmailChangePopup
