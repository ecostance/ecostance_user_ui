import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbOne } from "src/components/Breadcrumb";
import CurrencySelect from "src/components/helpers/currencySelect";
import { LayoutTwo } from "src/components/Layout";
import FileUpload from "src/components/profile/helpers/fileUpload";
import CountrySelector from "src/components/profile/helpers/countrySelector";
import { me } from "src/apiClient/auth";
import { saveProfileInfo } from "src/apiClient/user";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import moment from "moment";
import { convertURLToFile } from "src/components/profile/helpers/convertImageURLToFile";
import PhoneInputJSX from "../Stripe/phoneInput";
import ReactDatePicker from "react-datepicker";
import { Spinner } from "react-bootstrap";
import Switch from "./elements/Switch";
import { runValidateUserProcessSync } from "src/helpers/currencyActionHelper";
import { setCartCurrency } from "src/redux/actions/cartActions";
import { getFormattedDate, getFormattedTime } from "src/helpers/formatDateTime";
import { returnReverseCode } from "src/data/countryCodeToISO3";
import { returnPhoneDetails } from "src/helpers/returnPhoneDetails";
import { validatePhoneNumber } from "src/helpers/phoneValidation";
import { MdInfoOutline } from "react-icons/md";
import { Tooltip } from "react-tippy";

const ProfilePage = ({ meData, userData, setCartCurrency }) => {
  const { addToast } = useToasts();
  const urlRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  const [image, setImage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [apiLoadFinished, setApiLoadFinished] = useState(false);
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [editDisabled, setEditDisabled] = useState(true);
  const [notificationEnable, setNotificationEnable] = useState(true);
  const [newsLetterEnable, setNewsLetterEnable] = useState(true);
  const [focus, setFocus] = useState({});
  const [mobileSelectedCountry, setMobileSelectedCountry] = useState("");
  const [lastLoggedIn, setLastLoggedIn] = useState("");
  const [deviceInfo, setDeviceInfo] = useState({});
  const [addressCountry, setAddressCountry] = useState("");
  const [phoneInfo, setPhoneInfo] = useState({});
  const [ageVerify, setAgeVerify] = useState(true);

  // const yearRef = useRef();
  // const monthRef = useRef();
  // const dateRef = useRef();

  // const [dateInput, setDateInput] = useState([
  //   {
  //     ref: yearRef,
  //     value: "",
  //     length: 4,
  //     placeholder: "YYYY",
  //   },
  //   {
  //     ref: monthRef,
  //     value: "",
  //     length: 2,
  //     placeholder: "MM",
  //   },
  //   {
  //     ref: dateRef,
  //     value: "",
  //     length: 2,
  //     placeholder: "DD",
  //   },
  // ]);

  useEffect(() => {
    fetchDataFromAPI().catch((err) => console.log(err));
  }, []);

  // Will research this solution
  // const returnBinaryImage = async (image) => {
  //   let binaryImage;
  //   if (typeof image === "string") {
  //     const readStream = await fetch(image);
  //     const imageBlob = await readStream.blob();
  //     binaryImage = await new File(
  //       [imageBlob],
  //       `${`${Math.random() * 100} + ${Math.random()}`}`,
  //       {
  //         type: imageBlob.type,
  //       }
  //     );
  //   } else {
  //     binaryImage = image;
  //   }

  //   console.log("here is binary", URL.createObjectURL(binaryImage));
  //   return binaryImage;
  // };

  const validEmail = (email) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    return email.match(regex);
  };

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  // const setDateInputHandler = (index, val, length) => {
  //   if (isNaN(val)) return;
  //   const newdateInput = dateInput.map((ele, dateInputIndex) => {
  //     if (dateInputIndex === index)
  //       return {
  //         ...ele,
  //         value: val.trim() === "" ? val : Number(val),
  //       };
  //     return { ...ele, value: ele.value };
  //   });
  //   console.log("here is val each", val);
  //   setDateInput(newdateInput);

  //   if (index + 1 >= newdateInput.length) return;
  //   if (val.trim() === "") return;
  //   if (newdateInput[index + 1].value !== "") return;

  //   val.length >= length && newdateInput[index + 1].ref.current.focus();
  // };

  // const handleKeyPress = (key, index, prevValue) => {
  //   if (key !== "Backspace") return;
  //   if (index - 1 < 0) return;
  //   if (prevValue !== "") return;
  //   dateInput[index - 1].ref.current.focus();
  // };

  // const dateInputFields = dateInput.map((ele, index) => {
  //   const { length, placeholder } = ele;
  //   let additional = true;
  //   if (index === 2) {
  //     additional = false;
  //   }

  //   return (
  //     <>
  //       <input
  //         key={index}
  //         type="tel"
  //         placeholder={placeholder}
  //         maxLength={length}
  //         ref={ele.ref}
  //         value={ele.value}
  //         onChange={({ target: { value } }) =>
  //           setDateInputHandler(index, value, length)
  //         }
  //         onKeyDown={({ key }) => handleKeyPress(key, index, ele.value)}
  //       />
  //       {additional && <p>-</p>}
  //     </>
  //   );
  // });

  const validateFields = () => {
    const mandatoryFields = [
      { val: firstName, name: "firstName" },
      { val: lastName, name: "lastName" },
      { val: primaryEmail, name: "primaryEmail" },
      // { val: selectedCurrency, name: 'currency' },
      // { val: selectedCountry, name: 'country' },
    ];
    const currentErrors = {};
    mandatoryFields.map((each) => {
      each?.val?.length > 0 ? "" : (currentErrors[each?.name] = true);
    });

    !validEmail(primaryEmail) ? (currentErrors["primaryEmail"] = true) : "";

    if (
      new Date(dob)?.getFullYear() < 1900 ||
      new Date(dob)?.getFullYear() > new Date()?.getFullYear() - 17
    ) {
      currentErrors["DOB"] = true;
    }

    // const generatedDOB = generateDOB();
    // if (generatedDOB.replaceAll("-").length > 0) {
    //   console.log(generatedDOB, "dob");
    //   const date = moment(generatedDOB);

    //   if (
    //     Number(dateInput[0]?.value) < 2015 &&
    //     Number(dateInput[0]?.value) > 1900 &&
    //     (dateInput[1]?.value + "")?.length == 2 &&
    //     (dateInput[2]?.value + "")?.length == 2
    //   ) {
    //     !date.isValid() ? (currentErrors["DOB"] = true) : "";
    //   } else {
    //     currentErrors["DOB"] = true;
    //   }
    // }

    if (recoveryEmail?.length > 0) {
      !validEmail(recoveryEmail) ? (currentErrors["recoveryEmail"] = true) : "";
    }

    if (!validatePhoneNumber(phone)) {
      currentErrors.phone = true;
    }

    setErrors(currentErrors);
    return Object.values(currentErrors) < 1;
  };

  // useEffect(() => {
  //   if (newsLetterEnable === false) {
  //     axios
  //       .patch(
  //         `${process.env.API_BASE}/v1/mailing-lists/${profileRelatedData?.email}/unsubscribe`
  //       )
  //       .then((res) => {});
  //   }
  // }, [newsLetterEnable]);

  const appendValuesToFormData = async (formData) => {
    if (dob) {
      formData.append("dob", generateDOB());
    }
    image && formData.append("profileImage", image);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);

    formData.append("checkoutDefaultCurrency", selectedCurrency);
    const phoneDetails = returnPhoneDetails(phoneInfo);
    formData.append("number", phoneDetails?.number);
    formData.append("countryCode", phoneDetails?.countryCode);
    formData.append("numericCode", `+${phoneDetails?.numericCode}`);
    formData.append("newsLetter", newsLetterEnable);
    formData.append("notification", notificationEnable);
    // recoveryEmail && formData.append('recoveryEmail', recoveryEmail);
    return formData;
  };

  const generateDOB = () => {
    const currentDate = [
      dob.getFullYear(),
      padTo2Digits(dob.getMonth() + 1),
      padTo2Digits(dob.getDate()),
    ].join("-");
    return currentDate;
  };

  const generateError = (name, dob = false) => {
    if (!dob) {
      return <p className="error-msg profile">Enter a valid {name}</p>;
    } else {
      return <p className="error-msg profile">Please enter a valid {name}</p>;
    }
  };

  const saveAPIDateToLocal = (dob) => {
    if (!dob) return setDob(null);
    const date = new Date(dob);
    setDob(date || "");
  };

  const fetchDataFromAPI = async () => {
    const data = await runValidateUserProcessSync();
    const savedData = data?.data;
    const phoneObject = savedData?.phone
      ? savedData?.phone
      : data?.billingAddress?.phone;
    setSelectedCountry(data?.addressCountry || "");
    setMobileSelectedCountry(data?.selectedCountry);
    saveAPIDateToLocal(savedData?.dob);
    setPrimaryEmail(savedData?.email);
    setFirstName(savedData?.firstName || data?.slug?.firstName || "");
    setLastName(savedData?.lastName || data?.slug?.lastName || "");
    // setSelectedCountry(
    //   savedData?.country?.name || data?.billingAddress?.country || ''
    // )
    setNotificationEnable(savedData?.notification);
    setNewsLetterEnable(savedData?.newsLetter);
    setImage(
      savedData?.profileImage && typeof savedData?.profileImage == "string"
        ? await convertURLToFile(savedData?.profileImage)
        : ""
    );
    setRecoveryEmail(savedData?.recoveryEmail);
    setSelectedCurrency(data?.checkoutDefaultCurrency || "");
    setPhone(`${phoneObject?.numericCode + phoneObject?.number}`);
    setPhoneInfo(phoneObject);
    setApiLoadFinished(true);
    setLastLoggedIn(data?.lastLoggedIn);
    setDeviceInfo(data?.deviceInfo);
    setAddressCountry(data?.addressCountry);
  };

  const handleCurrencySelect = (e) => {
    setSelectedCurrency(e?.target?.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!validateFields()) return;
      setLoading(true);
      const data = new FormData();
      const res = await saveProfileInfo(await appendValuesToFormData(data));
      if (res?.status === 200) {
        runValidateUserProcessSync();
        setEditDisabled(true),
          addToast("Profile data saved successfully", {
            appearance: "success",
            autoDismiss: true,
          });
      } else if (res?.status === 500) {
        addToast("Please try again later", {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        addToast(res?.data?.message, {
          autoDismiss: true,
        });
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSetFocus = (name) => {
    const tempFocusObj = {};
    tempFocusObj[name] = true;
    setFocus(tempFocusObj);
  };

  const handleInputOnChange = (value, setValue, name) => {
    setValue(value);
    const tempErrorObject = errors;
    if (name !== "phone") tempErrorObject[name] = "";
    if (name === "phone" && value?.length >= 5) tempErrorObject[name] = "";
    setErrors(tempErrorObject);
  };

  const commonInput = (
    value,
    onChange,
    placeholder,
    type,
    required = false,
    disabled,
    name,
    ...props
  ) => {
    const restProps = props;
    return (
      <input
        onChange={(e) => handleInputOnChange(e.target.value, onChange, name)}
        value={value}
        // placeholder={placeholder}
        type={type}
        name={name}
        required={required}
        disabled={disabled}
        // onFocus={() => handleSetFocus(name)}
        onKeyDown={handleKeyPressSubmit}
        className={editDisabled ? "profile--disabled--padding-0" : ""}
        onBlur={handleOnBlur}
        {...restProps}
      />
    );
  };

  const handlePhoneChange = (e) => {
    handleInputOnChange(e.target.value, setPhone, "phone");
    // setPhone(e.target.value)
  };

  const handleKeyPressSubmit = (e) => {
    if (e?.key == "Enter") handleSubmit(e);
  };

  const validateSingleField = (value, name) => {
    const errorObject = errors;

    if (name === "phone") {
      if (!validatePhoneNumber(value)) errorObject.phone = true;
    } else {
      if (!value) errorObject[name] = true;
      else errorObject[name] = false;
    }
    setErrors(errorObject);
  };

  const handleOnBlur = ({ relatedTarget, target }) => {
    if (relatedTarget?.name == "btn-cancel") return;
    target?.name && validateSingleField(target?.value, target?.name);
    setFocus((prevData) => {
      return {
        ...prevData,
        [target.name]: false,
      };
    });
  };

  const handlePhoneInfoChange = (values) => {
    setPhoneInfo(values);
    setErrors(() => {
      delete errors.phone;
      return errors;
    });
  };

  return (
    apiLoadFinished && (
      <div
        className={editDisabled ? "profile-disabled" : ""}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className="edit--button--profile--holder">
          {!editDisabled ? (
            <button
              name="btn-cancel"
              className="button--white"
              onClick={() => [
                setAgeVerify(true),
                fetchDataFromAPI(),
                setEditDisabled(true),
                setErrors({}),
              ]}
            >
              CANCEL
            </button>
          ) : (
            ""
          )}
          {editDisabled ? (
            <button
              className="button--black"
              onClick={() => setEditDisabled(false)}
            >
              EDIT
            </button>
          ) : (
            ""
          )}
          {!editDisabled ? (
            <button
              className="button--black standard--save--button--my-account"
              style={{ opacity: ageVerify ? 1 : 0.5 }}
              onClick={(e) => {
                ageVerify ? handleSubmit(e) : null;
              }}
              // : () => {
              //     addToast(
              //       "You need to be over 18 years old to use this application",
              //       {
              //         appearance: "error",
              //         autoDismiss: true,
              //       }
              //     );
              //   }

              disabled={loading}
            >
              SAVE {loading ? <Spinner size="sm" animation="border" /> : ""}
            </button>
          ) : (
            ""
          )}
        </div>
        <form
          style={editDisabled ? { pointerEvents: "none" } : {}}
          onSubmit={handleSubmit}
          className="profileSection--form"
        >
          <h3 className="common--heading">Change Profile</h3>
          <div className="profileSection--form--main">
            <div className="image--upload-holder">
              <FileUpload image={image} setImage={setImage} />
            </div>
            <div className="main--profile--input-holder">
              <div className="profile--each-row">
                <div
                  className={`profile--input-main no--padding--sides--input standard--input--box ${
                    editDisabled ? "disabled" : ""
                  } ${focus?.firstName ? "focused--input" : ""}`}
                >
                  <p>First Name *</p>
                  {commonInput(
                    firstName,
                    setFirstName,
                    "",
                    "",
                    false,
                    false,
                    "firstName"
                  )}
                  {errors?.firstName && generateError("First name")}
                </div>
                <div
                  className={`profile--input-main no--padding--sides--input standard--input--box ${
                    editDisabled ? "disabled" : ""
                  } ${focus?.lastName ? "focused--input" : ""}`}
                >
                  <p>Last Name *</p>
                  {commonInput(
                    lastName,
                    setLastName,
                    "",
                    "",
                    false,
                    false,
                    "lastName"
                  )}
                  {errors?.lastName && generateError("Last name")}
                </div>
              </div>
              {/* <div className="profile--each-row">
                <div className="profile--input-main--DOB">
                  <p>Birthday</p>
                  <div
                    className={`profile--input-DOB--holder standard--input--box no--padding--sides--input ${
                      editDisabled ? 'disabled' : ''
                    } ${focus?.dob ? 'focused--input' : ''}`}
                  >
                   
                    <ReactDatePicker
                      selected={dob || null}
                      name="dob"
                      maxDate={
                        new Date(
                          new Date()?.getFullYear() - 18,
                          new Date()?.getMonth(),
                          new Date()?.getDate()
                        )
                      }
                      onBlur={handleOnBlur}
                      onChange={(date) => setDob(date)}
                      dateFormat={'yyyy/MM/dd'}
                      className={
                        editDisabled ? 'profile--disabled--padding-0' : ''
                      }
                    
                    />
                    <svg
                      className="calender--svg--profile"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="#333"
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>

                  {errors?.DOB && generateError('date of birth', true)}
                </div>
              
                <div
                  className={`profile--input-main country--select-main standard--input--box ${
                    editDisabled ? 'disabled' : ''
                  } ${focus?.country ? 'focused--input' : ''}`}
                >
                  <p>Country *</p>
                  <CountrySelector
                    setSelectedCountry={setSelectedCountry}
                    selectedCountry={selectedCountry}
                    handleOnBlur={handleOnBlur}
                    name="country"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="7"
                    fill="none"
                    viewBox="0 0 12 7"
                  >
                    <path fill="#333" d="M6 7L0 0h12L6 7z"></path>
                  </svg>
                  {errors?.country && generateError('country')}
                </div>
              </div>
             
              <div className="profile--each-row">
                <div
                  className={`profile--input-main no--padding--sides--input standard--input--box ${
                    editDisabled ? 'disabled' : ''
                  }  ${focus?.currency ? 'focused--input' : ''}`}
                >
                  <p>Default Currency *</p>
                  <CurrencySelect
                    selectedCurrency={selectedCurrency}
                    handleSelect={handleCurrencySelect}
                    placeholderChange={true}
                    name={'currency'}
                    className={
                      editDisabled ? 'profile--disabled--padding-0' : ''
                    }
                    onBlur={handleOnBlur}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="7"
                    fill="none"
                    viewBox="0 0 12 7"
                  >
                    <path fill="#333" d="M6 7L0 0h12L6 7z"></path>
                  </svg>
                  {errors?.currency && generateError('currency')}
                </div>
                <div
                  className={`profile--input-main standard--input--box ${
                    editDisabled ? 'disabled' : ''
                  } ${focus?.phone ? 'focused--input' : ''}`}
                >
                  <p>Phone *</p>
                  <PhoneInputJSX
                    handleChangeValue={handlePhoneChange}
                    number={phone}
                    country={'us'}
                    name={'phone'}
                    handleKeyPressSubmit={handleKeyPressSubmit}
                    handleOnBlur={handleOnBlur}
                  />
                  {errors?.phone && generateError('phone number')}
                </div>
              </div>

              <div>
                <div className="settings-title">Settings</div>

                <div className="profile--settings">
                  <div className="settings-toggle-holder">
                    <div>Notifications</div>
                    <Switch
                      height={24}
                      width={46}
                      display={notificationEnable}
                      setDisplay={setNotificationEnable}
                      profile={true}
                      disabled={editDisabled}
                    />
                  </div>
                  <div className="settings-toggle-holder">
                    <div>Newsletter</div>
                    <Switch
                      height={24}
                      width={46}
                      display={newsletterEnable}
                      setDisplay={setNewsletterEnable}
                      profile={true}
                      disabled={editDisabled}
                    />
                  </div>
                </div>
              </div> */}

              <div className="profile--each-row">
                <div
                  className="profile--input-main--DOB"
                  style={{ width: "50%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingBottom: "15px",
                    }}
                  >
                    <p>Are You 18 Years Old</p>
                    <Tooltip
                      className="profileiconHover1"
                      title="You need to be over 18 years old to use this application"
                      position="top"
                      trigger="mouseenter"
                      animation="shift"
                      arrow={true}
                      duration={200}
                      // style={{ marginTop: "15px" }}
                    >
                      <MdInfoOutline
                        style={{
                          pointerEvents: "all",
                          width: "20px",
                          height: "20px",
                          position: "relative",
                          top: "auto",
                          bottom: "auto",
                          right: "auto",
                          left: "auto",
                          display: "inline-block",
                        }}
                      />
                    </Tooltip>
                  </div>
                  {/* <div
                    className={`profile--input-DOB--holder standard--input--box no--padding--sides--input ${
                      editDisabled ? "disabled" : ""
                    } ${focus?.dob ? "focused--input" : ""}`}
                  >
                    <ReactDatePicker
                      selected={dob || null}
                      name="dob"
                      maxDate={
                        new Date(
                          new Date()?.getFullYear() - 18,
                          new Date()?.getMonth(),
                          new Date()?.getDate()
                        )
                      }
                      onBlur={handleOnBlur}
                      onChange={(date) => setDob(date)}
                      dateFormat={"yyyy/MM/dd"}
                      className={
                        editDisabled ? "profile--disabled--padding-0" : ""
                      }
                    />
                    <svg
                      className="calender--svg--profile"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="#333"
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div> */}
                  <Switch
                    height={24}
                    width={46}
                    display={ageVerify}
                    setDisplay={setAgeVerify}
                    profile={true}
                    disabled={editDisabled}
                  />

                  {!ageVerify && !editDisabled ? (
                    <p className="error-msg profile">
                      You need to be over 18 years old to use this application
                    </p>
                  ) : (
                    <p
                      className="error-msg profile"
                      style={{ visibility: "hidden" }}
                    >
                      hi
                    </p>
                  )}
                </div>

                <div
                  className={`profile--input-main country--select-main--mobile standard--input--box ${
                    editDisabled ? "disabled" : ""
                  } ${focus?.country ? "focused--input" : ""}`}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p>Country Selected on Mobile Phone</p>
                    <Tooltip
                      className="profileiconHover1"
                      title="Usually the home country of your mobile device"
                      position="top"
                      trigger="mouseenter"
                      animation="shift"
                      arrow={true}
                      duration={200}
                      // style={{ marginTop: "15px" }}
                    >
                      <MdInfoOutline
                        style={{
                          pointerEvents: "all",
                          width: "20px",
                          height: "20px",
                          position: "relative",
                          top: "auto",
                          bottom: "auto",
                          right: "auto",
                          left: "auto",
                          display: "inline-block",
                        }}
                      />
                    </Tooltip>
                  </div>
                  <CountrySelector
                    setSelectedCountry={setMobileSelectedCountry}
                    selectedCountry={mobileSelectedCountry}
                    handleOnBlur={handleOnBlur}
                    name="country"
                    disabled={true}
                    origin={"profile"}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="7"
                    fill="none"
                    viewBox="0 0 12 7"
                  >
                    <path fill="#333" d="M6 7L0 0h12L6 7z"></path>
                  </svg>
                  {errors?.country && generateError("Mobile Selected country")}
                </div>
              </div>

              <div className="profile--each-row">
                <div
                  className={`profile--input-main standard--input--box ${
                    editDisabled ? "disabled" : ""
                  } ${focus?.phone ? "focused--input" : ""}`}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p>Mobile Phone *</p>
                    <Tooltip
                      className="profileiconHover1"
                      title="Your mobile phone number. It can be changed later"
                      position="top"
                      trigger="mouseenter"
                      animation="shift"
                      arrow={true}
                      duration={200}
                      // style={{ marginTop: "15px" }}
                    >
                      <MdInfoOutline
                        style={{
                          pointerEvents: "all",
                          width: "20px",
                          height: "20px",
                          position: "relative",
                          top: "auto",
                          bottom: "auto",
                          right: "auto",
                          left: "auto",
                          display: "inline-block",
                        }}
                      />
                    </Tooltip>
                  </div>

                  <PhoneInputJSX
                    handleChangeValue={handlePhoneChange}
                    number={phone}
                    country={"us"}
                    name={"phone"}
                    handleKeyPressSubmit={handleKeyPressSubmit}
                    handleOnBlur={handleOnBlur}
                    setPhoneInfo={handlePhoneInfoChange}
                  />
                  {errors?.phone && generateError("Phone Number")}
                </div>
                <div
                  className={`profile--input-main no--padding--sides--input standard--input--box ${
                    editDisabled ? "disabled" : ""
                  }  ${focus?.currency ? "focused--input" : ""}`}
                >
                  <div className="profile--input--main--information--holder">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p>Checkout Default Currency </p>
                      <Tooltip
                        className="profileiconHover1"
                        title="Your preferred currency to buy products"
                        position="top"
                        trigger="mouseenter"
                        animation="shift"
                        arrow={true}
                        duration={200}
                        // style={{ marginTop: "15px" }}
                      >
                        <MdInfoOutline
                          style={{
                            pointerEvents: "all",
                            width: "20px",
                            height: "20px",
                            position: "relative",
                            top: "auto",
                            bottom: "auto",
                            right: "auto",
                            left: "auto",
                            display: "inline-block",
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <CurrencySelect
                    selectedCurrency={selectedCurrency}
                    handleSelect={handleCurrencySelect}
                    placeholderChange={true}
                    name={"currency"}
                    className={
                      editDisabled ? "profile--disabled--padding-0" : ""
                    }
                    onBlur={handleOnBlur}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="7"
                    fill="none"
                    viewBox="0 0 12 7"
                  >
                    <path fill="#333" d="M6 7L0 0h12L6 7z"></path>
                  </svg>
                  {errors?.currency && generateError("currency")}
                </div>
              </div>
              <div className="profile--each-row">
                <div
                  className={`profile--input-main standard--input--box `}
                ></div>
                <div className={`profile--input-main standard--input--box `}>
                  <div className="last--logged-in--information--wrapper">
                    <div className="last--logged-in--information--holder">
                      <div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <p> Last logged </p>
                          <Tooltip
                            className="profileiconHover1"
                            title="Your last login to this site"
                            position="top"
                            trigger="mouseenter"
                            animation="shift"
                            arrow={true}
                            duration={200}
                            // style={{ marginTop: "15px" }}
                          >
                            <MdInfoOutline
                              style={{
                                pointerEvents: "all",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                top: "auto",
                                bottom: "auto",
                                right: "auto",
                                left: "auto",
                                display: "inline-block",
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                      <span>
                        {" "}
                        {getFormattedDate(lastLoggedIn)}{" "}
                        {getFormattedTime(lastLoggedIn)},{" "}
                        {deviceInfo?.browser?.name}, {addressCountry}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="settings-title">Settings</div>

                <div className="profile--settings">
                  <div className="settings-toggle-holder">
                    <div>Notifications</div>
                    <Switch
                      height={24}
                      width={46}
                      display={notificationEnable}
                      setDisplay={setNotificationEnable}
                      profile={true}
                      disabled={editDisabled}
                    />
                  </div>
                  <div className="settings-toggle-holder">
                    <div>Newsletter</div>
                    <Switch
                      height={24}
                      width={46}
                      display={newsLetterEnable}
                      setDisplay={setNewsLetterEnable}
                      profile={true}
                      disabled={editDisabled}
                    />
                  </div>
                </div>
              </div>

              <div className="profile--each-row">
                <div className="profile--input-main" />
                <div className="profile--input-main"></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCartCurrency: (currency) => {
      dispatch(setCartCurrency(currency));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
