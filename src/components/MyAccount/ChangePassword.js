import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { changePassword } from "src/apiClient/auth";
import { useToasts } from "react-toast-notifications";

const ChangePassword = ({ isPasswordTabActive }) => {
  const { addToast } = useToasts();

  const [isLoading, setIsLoading] = useState(false);
  const [editDisabled, setEditDisabled] = useState(true);

  useEffect(() => {
    if (!isPasswordTabActive) {
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setError({});
      setFocus({ oldPassword: true, newPassword: true, confirmPassword: true });
      setPasswordStrength("");
      setShouldShowOldPass(false);
      setShouldShowNewPass(false);
      setShouldShowConfirmPass(false);
    }
  }, [isPasswordTabActive]);

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [shouldShowOldPass, setShouldShowOldPass] = useState(false);
  const [shouldShowNewPass, setShouldShowNewPass] = useState(false);
  const [shouldShowConfirmPass, setShouldShowConfirmPass] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [focus, setFocus] = useState({
    oldPassword: true,
    newPassword: true,
    confirmPassword: true,
  });
  const [passwordStrength, setPasswordStrength] = useState("");

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return setPasswordStrength("");

    if (password.length >= 12 && password.match(PASSWORD_REGEX))
      return setPasswordStrength("Strong");

    if (password.length >= 8 && password.match(PASSWORD_REGEX))
      return setPasswordStrength("Good");

    if (password.length > 8 && !password.match(PASSWORD_REGEX))
      return setPasswordStrength("Weak");

    if (password.length < 8 || !password.match(PASSWORD_REGEX))
      return setPasswordStrength("Poor");
  };

  const onChangeHandler = ({ target }) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [target.name]: target.value.trim(),
      };
    });
    if (target.name === "newPassword")
      checkPasswordStrength(target.value.trim());
    setFocus((prevData) => {
      return {
        ...prevData,
        [target.name]: true,
      };
    });
    setError((prevData) => {
      return {
        ...prevData,
        [target.name]: "",
      };
    });
  };

  const onBlurHandler = ({ relatedTarget, target }) => {
    if (relatedTarget?.name === "btn-cancel") return;
    const validationResult = validate(formData);
    setError(validationResult);
    setFocus((prevData) => {
      return {
        ...prevData,
        [target.name]: false,
      };
    });
  };

  const validate = ({ oldPassword, newPassword, confirmPassword }) => {
    const error = {};

    // if (!oldPassword.match(PASSWORD_REGEX))
    //   error.oldPassword =
    //     'Password must be at least 8 characters long and contain lower case, upper case, number, and special character'
    if (!oldPassword) error.oldPassword = "Old password is required";

    if (!newPassword?.match(PASSWORD_REGEX))
      error.newPassword =
        "Password must be at least 8 characters long and contain lower case, upper case, number, and special character";
    if (!newPassword) error.newPassword = "New password is required";

    if (confirmPassword !== newPassword)
      error.confirmPassword = "Passwords do not match";
    if (!confirmPassword)
      error.confirmPassword = "Confirm password is required";

    return error;
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    const validationResult = validate(formData);
    setError(validationResult);
    setFocus({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

    if (Object.values(validationResult).length > 0) return;

    try {
      setIsLoading(true);
      const { data, status } = await changePassword({
        currentPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      setIsLoading(false);

      if (data.message === "Invalid current password")
        setFormData((prevData) => ({ ...prevData, oldPassword: "" }));

      if (status !== 200 && status !== 201)
        return addToast(data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      if (status === 200) {
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordStrength("");
        setEditDisabled(true);
        return addToast(data.message, {
          appearance: "success",
          autoDismiss: true,
        });
      }
    } catch (error) {
      addToast("Failed to Change Password, Please Try Again!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (e?.key == "Enter") {
    }
    setFocus({ oldPassword: true, newPassword: true, confirmPassword: true });
    setError({});
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordStrength("");
    setEditDisabled(true);
  };

  return (
    <>
      {!editDisabled ? (
        <div className="submit-btn-container">
          <button
            name="btn-cancel"
            className="submit-btn button--white"
            onClick={handleCancel}
          >
            CANCEL{" "}
          </button>
          <button
            type="submit"
            className="submit-btn button--black standard--save--button--my-account"
            disabled={isLoading}
            onClick={submitFormHandler}
          >
            SAVE {isLoading ? <Spinner animation="border" size="sm" /> : ""}
          </button>
        </div>
      ) : (
        <div className="submit-btn-container">
          <button
            name="btn-cancel"
            className="submit-btn button--black"
            onClick={() => setEditDisabled(false)}
          >
            EDIT{" "}
          </button>
        </div>
      )}

      <div className="change-password-container">
        <h3 className="common--heading">Change Password</h3>
        <form className="change-password-form" onSubmit={submitFormHandler}>
          <div className="password--containter--all">
            <div
              className={`old-password standard--input--box no--padding--sides--input ${
                editDisabled ? "disabled" : ""
              }`}
            >
              <label htmlFor="oldPassword">Old Password *</label>
              <br />
              <input
                className={`input-field  ${
                  !focus.oldPassword && error.oldPassword ? "field-invalid" : ""
                } `}
                type={shouldShowOldPass ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                disabled={editDisabled}
              />
              {shouldShowOldPass && !editDisabled ? (
                <FaRegEye
                  onClick={() =>
                    setShouldShowOldPass((prevValue) => !prevValue)
                  }
                  className="change-password-eye-icon"
                />
              ) : (
                ""
              )}

              {!shouldShowOldPass && !editDisabled ? (
                <FaRegEyeSlash
                  onClick={() =>
                    setShouldShowOldPass((prevValue) => !prevValue)
                  }
                  className="change-password-eye-icon"
                />
              ) : (
                ""
              )}
              {!focus.oldPassword && error.oldPassword ? (
                <p className="change-password-error-msg">{error.oldPassword}</p>
              ) : (
                ""
              )}
            </div>
            <div
              className={`new-password standard--input--box no--padding--sides--input ${
                editDisabled ? "disabled" : ""
              }`}
            >
              <label htmlFor="newPassword">New Password *</label>
              <br />
              <input
                className={`input-field ${
                  !focus.newPassword && error.newPassword ? "field-invalid" : ""
                } `}
                type={shouldShowNewPass ? "text" : "password"}
                name="newPassword"
                placeholder={!editDisabled ? "must be 8 character" : ""}
                value={formData.newPassword}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                disabled={editDisabled}
              />
              {shouldShowNewPass && !editDisabled ? (
                <FaRegEye
                  onClick={() =>
                    setShouldShowNewPass((prevValue) => !prevValue)
                  }
                  className="change-password-eye-icon"
                />
              ) : (
                ""
              )}

              {!shouldShowNewPass && !editDisabled ? (
                <FaRegEyeSlash
                  onClick={() =>
                    setShouldShowNewPass((prevValue) => !prevValue)
                  }
                  className="change-password-eye-icon"
                />
              ) : (
                ""
              )}
              {!focus.newPassword && error.newPassword ? (
                <p className="change-password-error-msg">{error.newPassword}</p>
              ) : (
                ""
              )}
              <div
                className={`password-strength-container ${passwordStrength}`}
              >
                <div className="password-strength-bar" />
                <div className="password-strength-bar" />
                <div className="password-strength-bar" />
                <div className="password-strength-bar" />
              </div>
              <p style={{ paddingTop: "3px" }} className={passwordStrength}>
                {passwordStrength ? passwordStrength : ""}
              </p>
            </div>
            <div
              className={`confirm-password standard--input--box standard--input--box no--padding--sides--input ${
                editDisabled ? "disabled" : ""
              }`}
            >
              <label htmlFor="confirmPassword">Confirm New Password *</label>
              <br />
              <input
                className={`input-field ${
                  !focus.confirmPassword && error.confirmPassword
                    ? "field-invalid"
                    : ""
                } `}
                type={shouldShowConfirmPass ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                disabled={editDisabled}
              />
              {shouldShowConfirmPass && !editDisabled ? (
                <FaRegEye
                  onClick={() =>
                    setShouldShowConfirmPass((prevValue) => !prevValue)
                  }
                  className="change-password-eye-icon"
                />
              ) : (
                ""
              )}

              {!shouldShowConfirmPass && !editDisabled ? (
                <FaRegEyeSlash
                  onClick={() =>
                    setShouldShowConfirmPass((prevValue) => !prevValue)
                  }
                  className="change-password-eye-icon"
                />
              ) : (
                ""
              )}
              {!focus.confirmPassword && error.confirmPassword ? (
                <p className="change-password-error-msg">
                  {error.confirmPassword}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          {/* <div className="old-password-container">
            
          </div> */}

          {/* <div className="new-password-container"></div> */}
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
