import React, { useState } from 'react'
import LezadaBackdrop from 'src/components/lezadaBackdrop'
import ResetPasswordEmail from 'src/components/resetPasswordPopups/flow1'
import ResetPasswordOTP from 'src/components/resetPasswordPopups/flow2'
import ResetPasswordConfirmPassword from 'src/components/resetPasswordPopups/flow3'

const Resetpasswordflow = ({
  setShowForgotPasswordPopup,
  setShowPreviousPopup,
  origin,
  setIsPrimaryEmailCodeSent,
  sendPrimaryEmailCode,
}) => {
  const [showFirstFlow, setShowFirstFlow] = useState(true)
  const [showSecondFlow, setShowSecondFlow] = useState(false)
  const [showThirdFlow, setShowThirdFlow] = useState(false)
  const [globalEmail, setGlobalEmail] = useState('')
  const [token, setToken] = useState('')
  return (
    <LezadaBackdrop bgType="light">
      {showFirstFlow ? (
        <ResetPasswordEmail
          setShowSecondFlow={setShowSecondFlow}
          setIsShowModel={setShowFirstFlow}
          setGlobalEmail={setGlobalEmail}
          setShowForgotPasswordPopup={setShowForgotPasswordPopup}
        />
      ) : (
        ''
      )}
      {showSecondFlow ? (
        <ResetPasswordOTP
          setShowSecondFlow={setShowSecondFlow}
          email={globalEmail}
          setToken={setToken}
          setShowThirdFlow={setShowThirdFlow}
          setShowForgotPasswordPopup={setShowForgotPasswordPopup}
        />
      ) : (
        ''
      )}
      {showThirdFlow ? (
        <ResetPasswordConfirmPassword
          token={token}
          setShowForgotPasswordPopup={setShowForgotPasswordPopup}
          setShowPreviousPopup={setShowPreviousPopup}
          origin={origin}
          setIsPrimaryEmailCodeSent={setIsPrimaryEmailCodeSent}
          sendPrimaryEmailCode={sendPrimaryEmailCode}
        />
      ) : (
        ''
      )}
    </LezadaBackdrop>
  )
}

export default Resetpasswordflow
