import React from "react";
import LezadaBackdrop from "./lezadaBackdrop";

const registrationSuccessPopup = ({ setShouldShowSuccessModel, email }) => {
  return (
    <LezadaBackdrop>
      <div className="standard-popup-holder registration--popup-holder">
        <div
          className="standard-popup-cross-icon"
          onClick={() => setShouldShowSuccessModel(false)}
        >
          <img src="/assets/images/cross-sustainability.png" />
        </div>

        <div className="registration--popup-content-wrapper">
          <div className="registration--popup-img-area">
            <img src="/images/reg-success.png" />
          </div>
          <div className="registration--popup-text-area">
            <h3 className="registration-success-heading">
              Registration is <span>successful</span>
            </h3>
            <div className="registration-success-message">
              We just sent you an email at{" "}
              <span className="registraion-success-user-email">{email}</span>{" "}
              Kindly click on the <span>"Verify email"</span> button in that
              email to verify your email and activate your account.
            </div>
            <button
              className="registration-success-button"
              onClick={() => setShouldShowSuccessModel(false)}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </LezadaBackdrop>
  );
};

export default registrationSuccessPopup;
