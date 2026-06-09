import router from "next/router";
import LezadaBackdrop from "./lezadaBackdrop";
import SubscribeEmail from "./Newsletter/SubscribeEmailTwo";
import React, { useState } from "react";
import { useRef } from "react";

const signupconnectpopup = ({ setShowNewUserPopup }) => {
  const SubscribeEmailRef = useRef();
  const userEmail = useRef();
  const [shouldPopupClose, setShouldPopupClose] = useState(false);
  const [subscribeResponse, setSubscribeResponse] = useState({
    status: "",
    message: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailAlreadyVerified, setEmailAlreadyVerified] = useState(false);

  const closePopup = () => {
    setShouldPopupClose(true);
    setTimeout(() => setShowNewUserPopup(false), 1000);
  };
  const setSubscribeResponseHandler = (res) => {
    if (res?.status === 200) {
      console.log(res, "kjwgeflwehflwf");
      if (res?.existingUser) {
        setIsEmailSent(false);
        setEmailAlreadyVerified(true);
      } else {
        setIsEmailSent(true);
      }
    } else {
      setIsEmailSent(false);
    }
    if (res?.status === 409 || res?.status === 201)
      setEmailAlreadyVerified(true);
    else {
      setEmailAlreadyVerified(false);
    }
    setSubscribeResponse(res);
    if (res["email"]) userEmail.current = res.email;
  };
  const reSendSubscriptionMail = () => {
    setSubscribeResponse((prevValue) => {
      return {
        ...prevValue,
        message: "",
      };
    });
    SubscribeEmailRef.current(userEmail.current);
  };
  return (
    <LezadaBackdrop bgType={"light"}>
      <div
        className={`standard-popup-holder signup-connect-popup-holder animate__animated animate__fadeInLeft ${
          shouldPopupClose && "animate__fadeOutRight"
        }`}
      >
        <div className="standard-popup-cross-icon" onClick={closePopup}>
          <img src="/assets/images/cross-sustainability.png" />
        </div>

        <div className="signup-connect-content-wrapper">
          <div className="signup-connect-popup-img-area">
            <img src="/images/signup_connect-sm.png" alt="signup-connect" />
          </div>
          <div className="signup-connect-right-side-holder">
            <h3 className="signup-connect-heading">
              Hello, <span> Sign up</span> for our <br />
              <span className="signup-connect-brand">newsletter</span>
            </h3>
            {/* <div className="signup-connect-button-holder">
            
            <button
              className="signup-connect-button-sign-up"
              onClick={() => router.push("/login-register")}
            >
              Sign up
            </button>
            <button
              className="signup-connect-button-log-in"
              onClick={() => router.push("/login-register")}
            >
              Log in
            </button>
          </div> */}
            <div
              className={`subscription-response ${
                isEmailSent || emailAlreadyVerified
                  ? "subscription-response-verified"
                  : ""
              }`}
            >
              {subscribeResponse.message && <img src="/images/tick.png" />}
              <p> {subscribeResponse.message}</p>
            </div>
            <div className="footer-subscribe-widget">
              <SubscribeEmail
                isPopup={true}
                seRef={SubscribeEmailRef}
                placeHolder="Email Address *"
                subscribeResponse={setSubscribeResponseHandler}
                setIsEmailValid={setIsEmailValid}
              />
              <p className="subscription-email-error">
                {!isEmailValid ? "Please enter a valid email" : ""}
              </p>
            </div>
            <p
              className={`signup-connect-signup-later ${
                isEmailSent || emailAlreadyVerified
                  ? "signup-connect-signup-later-verified"
                  : ""
              }`}
              // onClick={closePopup}
            >
              Be the first one to get cutting-edge insights on Sustainability,
              delivered to your inbox
            </p>
            <div
              className="verify-email-button-container signup-connect-btn-container"
              // style={{ display: `${!isEmailSent ? 'none' : 'flex'}` }}
            >
              {isEmailSent && (
                <>
                  <button
                    className="registration-success-button signup-connect-btn verified button--black"
                    onClick={closePopup}
                  >
                    Verified
                  </button>
                  <button
                    className="registration-success-button signup-connect-btn verify-ltr button--white"
                    onClick={closePopup}
                  >
                    I'll verify it later
                  </button>
                </>
              )}

              {emailAlreadyVerified && (
                <button
                  className="registration-success-button signup-connect-btn ok-btn button--black"
                  onClick={closePopup}
                >
                  OK
                </button>
              )}
            </div>
            {isEmailSent && (
              <div className="verify-email-resend-container">
                Didn't get the mail?{" "}
                <span
                  onClick={reSendSubscriptionMail}
                  style={{ textDecoration: "underline" }}
                >
                  Click here to Resend
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </LezadaBackdrop>
  );
};

export default signupconnectpopup;
