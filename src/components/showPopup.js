import React from 'react'
import ComparePopup from './comparePopup'
import SignupConnect from './signupconnectpopup'
import VerifyPopup from './verifyEmailPopup'

const showPopup = ({
  children,
  showComparePopup,
  setShowComparePopup,
  showNewUserPopup,
  setShowNewUserPopup,
  compareData,
  showVerifyPopup,
  setShowVerifyPopup,
  email,
  reSendRegistrationMail,
  isVerifyEmailSent,
  setIsVerifyEmailSent,
  onEmailVerified,
}) => {
  return (
    <div>
      {showComparePopup && (
        <ComparePopup
          setShowComparePopup={setShowComparePopup}
          showComparePopup={showComparePopup}
          compareData={compareData}
        />
      )}

      {showNewUserPopup && (
        <SignupConnect setShowNewUserPopup={setShowNewUserPopup} />
      )}
      {showVerifyPopup && (
        <VerifyPopup
          isVerifyEmailSent={isVerifyEmailSent}
          setIsVerifyEmailSent={setIsVerifyEmailSent}
          setShouldShowVerifyModel={setShowVerifyPopup}
          email={email}
          reSendRegistrationMail={reSendRegistrationMail}
          onEmailVerified={onEmailVerified}
        />
      )}
      <>{children}</>
    </div>
  )
}

export default showPopup
