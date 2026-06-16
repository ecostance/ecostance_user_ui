import React, { useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

let toastId;
const ChangeEmail = ({
  meData,
  setChangedEmail,
  setShowRecoveryEmailPopup,
  setShowPrimaryEmailPopup,
  sendRecoveryEmailCode,
  sendPrimaryEmailCode,
  emailEditEnabledRef,
  isChangeEmailActive,
  isAttemptLeft,
}) => {
  const { addToast, removeAllToasts, removeToast } = useToasts();

  const profileRelatedData = meData?.meData?.data;
  const [email, setEmail] = useState(profileRelatedData?.email || "");
  const [recoveryEmail, setRecoveryEmail] = useState(
    profileRelatedData?.recoveryEmail || ""
  );
  const [emailEditEnabled, setEmailEditEnabled] = useState(false);
  const [recoveryEmailEditEnabled, setRecoveryEmailEditEnabled] =
    useState(false);
  const [recoveryEmailErr, setRecoveryEmailErr] = useState("");
  const [primaryEmailErr, setprimaryEmailErr] = useState("");
  const [isPrimaryEmailTouched, setIsPrimaryEmailTouched] = useState(false);
  const [isRecoveryEmailTouched, setIsRecoveryEmailTouched] = useState(false);
  const [recoveryEmailSuccess, setRecoveryEmailSuccess] = useState(false);
  const [primaryEmailSuccess, setPrimaryEmailSuccess] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [recoveryEmailLoading, setRecoveryEmailLoading] = useState(false);

  const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const resetPrimaryEmail = useCallback(
    () => setEmail(profileRelatedData?.email || ""),
    [profileRelatedData?.email]
  );
  const resetRecoveryEmail = useCallback(
    () => setRecoveryEmail(profileRelatedData?.recoveryEmail || ""),
    [profileRelatedData?.recoveryEmail]
  );

  // meData often arrives after mount (client /me fetch, tab switch). useState
  // initializers only run once — keep fields in sync when profile loads.
  useEffect(() => {
    if (!profileRelatedData) return;
    if (!emailEditEnabled) {
      setEmail(profileRelatedData.email || "");
    }
    if (!recoveryEmailEditEnabled) {
      setRecoveryEmail(profileRelatedData.recoveryEmail || "");
    }
  }, [
    profileRelatedData,
    emailEditEnabled,
    recoveryEmailEditEnabled,
  ]);

  useEffect(() => () => removeAllToasts(), []);

  useEffect(() => {
    if (!isChangeEmailActive) {
      resetPrimaryEmail();
      resetRecoveryEmail();
      setRecoveryEmailEditEnabled(false);
      setEmailEditEnabled(false);
      setRecoveryEmailErr("");
      setprimaryEmailErr("");
      setIsPrimaryEmailTouched(false);
      setIsRecoveryEmailTouched(false);
      setRecoveryEmailSuccess(false);
      setPrimaryEmailSuccess(false);
      removeAllToasts();
    }
  }, [isChangeEmailActive, resetPrimaryEmail, resetRecoveryEmail, removeAllToasts]);

  useEffect(() => {
    emailEditEnabledRef.current = {
      setRecoveryEmailEditEnabled: setRecoveryEmailEditEnabled,
      setPrimaryEmailEditEnabled: setEmailEditEnabled,
      resetPrimaryEmail,
      resetRecoveryEmail,
      setRecoveryEmailSuccess: setRecoveryEmailSuccess,
      setPrimaryEmailSuccess: setPrimaryEmailSuccess,
    };
  }, [
    resetPrimaryEmail,
    resetRecoveryEmail,
    emailEditEnabledRef,
  ]);

  const submitChangeHandler = async (emailType) => {
    if (emailType === "Email") {
      if (primaryEmailErr) return;
      if (email === profileRelatedData?.email)
        return [setEmailEditEnabled(false), setEmailLoading(false)];
      setChangedEmail(email);
      setEmailLoading(true);
      const resStatus = await sendPrimaryEmailCode(email);
      setEmailLoading(false);
      if (resStatus == 200) setShowPrimaryEmailPopup(true);
      if (resStatus == 400) resetPrimaryEmail();
      return;
    }
    if (emailType === "Recovery Email") {
      if (recoveryEmailErr) return;
      if (recoveryEmail === profileRelatedData?.recoveryEmail)
        return [
          setRecoveryEmailEditEnabled(false),
          setRecoveryEmailLoading(false),
        ];
      setChangedEmail(recoveryEmail);
      setRecoveryEmailLoading(true);
      const resStatus = await sendRecoveryEmailCode(recoveryEmail);
      setRecoveryEmailLoading(false);
      if (resStatus == 200) setShowRecoveryEmailPopup(true);
      if (resStatus == 400) resetRecoveryEmail();
    }
  };

  const changeEmailHandler = ({ target: { name, value } }) => {
    if (name === "Email") {
      setEmail(value);
      setIsPrimaryEmailTouched(false);
      setprimaryEmailErr("");
      return;
    }
    if (name === "Recovery Email") {
      setRecoveryEmail(value);
      setIsRecoveryEmailTouched(false);
      setRecoveryEmailErr("");
      return;
    }
  };

  const ValidateEmailHandler = ({ relatedTarget, target: { name, value } }) => {
    if (relatedTarget?.name === "btn-cancel") return;
    const validationErr = validate(value);
    if (!validationErr) return;
    if (name === "Email") {
      setIsPrimaryEmailTouched(true);
      setprimaryEmailErr(validationErr);
      return;
    }
    if (name === "Recovery Email") {
      setIsRecoveryEmailTouched(true);
      setRecoveryEmailErr(validationErr);
      return;
    }
  };

  const validate = (email) => {
    let error = "";
    if (!email.match(EMAIL_REGEX)) error = "Enter a valid Email";
    if (!email?.trim()) error = "Email is required";
    return error;
  };

  const editEnabledHandler = (emailType, showEnableEdit) => {
    if (emailType === "Email") {
      if (!isAttemptLeft) {
        if (toastId) {
          removeToastHandler(toastId);
        }
        toastId = String(Math.random());
        return addToast(
          <p>
            Wrong password.
            <br /> Your account is locked per our security protocol. To unlock,
            please reset your password by clicking{" "}
            <a
              style={{ textDecoration: "underline" }}
              href={process.env.PUBLIC_URL + "/other/forgot-password"}
            >
              “Forgot Password”
            </a>{" "}
            . Meanwhile you can use the system and we will remind you next time
            you log in.
          </p>,
          {
            appearance: "error",
            autoDismiss: false,
            id: toastId,
          }
        );
      }

      if (showEnableEdit) return setEmailEditEnabled(true);
      setEmailEditEnabled(false);
      setprimaryEmailErr("");
      setEmail(profileRelatedData?.email || "");
      setIsPrimaryEmailTouched(false);
      return;
    }
    if (emailType === "Recovery Email") {
      if (showEnableEdit) return setRecoveryEmailEditEnabled(true);
      setRecoveryEmailEditEnabled(false);
      setRecoveryEmailErr("");
      setRecoveryEmail(profileRelatedData?.recoveryEmail || "");
      setIsRecoveryEmailTouched(false);
      return;
    }
  };

  const removeToastHandler = (toastId) => {
    setTimeout(() => removeToast(toastId), 1000);
  };

  const changeEmailInput = (
    heading,
    mail,
    setMail,
    editEnabled,
    setEditEnabled,
    isTouched,
    err,
    emailChangedSuccessfull,
    loading
  ) => {
    return (
      <form className="change--mail--form">
        <div className="change--mail--form--input--wrapper">
          <div className="change--email--heading">{heading}</div>
          <div
            className={
              !editEnabled
                ? "input--button--holder--change--mail disabled"
                : "input--button--holder--change--mail"
            }
          >
            <div className="change--mail--form--input--container">
              <div style={{ position: "relative" }}>
                <input
                  className={editEnabled ? `input-padding` : ``}
                  disabled={!editEnabled}
                  value={mail}
                  onChange={setMail}
                  name={heading}
                  onBlur={ValidateEmailHandler}
                />
                {!editEnabled && (
                  <svg
                    className="edit-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                    onClick={() => setEditEnabled(heading, true)}
                  >
                    <path
                      fill="#333"
                      d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                    ></path>
                    <path
                      fill="#333"
                      fillRule="evenodd"
                      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
                {emailChangedSuccessfull && (
                  <div class="sustainability--each-template-check-holder template-clicked edit-icon">
                    <div class="big-checkmark">
                      <svg
                        style={{ verticalAlign: "unset" }}
                        width="14"
                        height="10"
                        viewBox="0 0 14 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                          fill="white"
                        ></path>
                      </svg>
                    </div>
                    <div class="small-checkmark">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          fill="#fff"
                          fill-rule="evenodd"
                          d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              {isTouched && err && editEnabled ? (
                <p className="error-msg">{err}</p>
              ) : (
                ""
              )}
              {editEnabled && (
                <div className="change-email-btn-container">
                  <button
                    name="btn-cancel"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditEnabled(heading, false);
                    }}
                    className="change--email--button button--white"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      submitChangeHandler(heading);
                    }}
                    disabled={loading}
                    className="change--email--button button--black"
                  >
                    SAVE{" "}
                    {loading ? <Spinner animation="border" size="sm" /> : ""}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="change--email--wrapper">
      <h3 className="common--heading">Change Email</h3>
      <div className="change--email--main">
        {changeEmailInput(
          "Email",
          email,
          changeEmailHandler,
          emailEditEnabled,
          editEnabledHandler,
          isPrimaryEmailTouched,
          primaryEmailErr,
          primaryEmailSuccess,
          emailLoading
        )}
        {changeEmailInput(
          "Recovery Email",
          recoveryEmail,
          changeEmailHandler,
          recoveryEmailEditEnabled,
          editEnabledHandler,
          isRecoveryEmailTouched,
          recoveryEmailErr,
          recoveryEmailSuccess,
          recoveryEmailLoading
        )}
      </div>
    </div>
  );
};

export default ChangeEmail;