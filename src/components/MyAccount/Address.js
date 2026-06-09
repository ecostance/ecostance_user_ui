import { useEffect, useState } from "react";
import { FaRegEdit, FaRegAddressBook } from "react-icons/fa";
import { connect } from "react-redux";
import { div, Col, Spinner } from "react-bootstrap";
import { Country, State, City } from "country-state-city";
import { updateBillingAddress } from "../../apiClient/user";
import { useToasts } from "react-toast-notifications";
import { validateUser } from "src/redux/actions/userAction";

const Address = ({ userData, validateUser }) => {
  const { addToast } = useToasts();
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [isEditAddressLoading, setIsEditAddressLoading] = useState(false);
  const [isError, setIsError] = useState({});
  const [isFocus, setIsFocus] = useState({});
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    billingAddress1: "",
    billingAddress2: "",
    billingState: "",
    billingCity: "",
    billingPinCode: "",
    billingCountry: "",
    billingCountryCode: "",
    billingStateCode: "",
  });

  const [allCountryList, setAllCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const populateReduxData = () => {
    const countryList = Country.getAllCountries();
    setAllCountryList(countryList);
    const {
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      pincode,
      countryCode,
      stateCode,
    } = userData.billingAddress;
    if (countryCode && stateCode) {
      const statesList = State.getStatesOfCountry(countryCode);
      setStateList(statesList);
      const cities = City.getCitiesOfState(countryCode, stateCode);
      setCityList(cities);
    }
    setInitialValues({
      ...initialValues,
      billingAddress1: addressLine1 ? addressLine1 : "",
      billingAddress2: addressLine2 ? addressLine2 : "",
      billingState: state ? state : "",
      billingCity: city ? city : "",
      billingPinCode: pincode ? pincode : "",
      billingCountry: country ? country : "",
      billingCountryCode: countryCode ? countryCode : "",
      billingStateCode: stateCode ? stateCode : "",
    });
  };

  useEffect(() => {
    populateReduxData();
  }, [userData]);

  const handleEditAddress = () => {
    setIsEditAddress(true);
  };

  const handleChangeValue = (e) => {
    if (
      e.target.name !== "billingCountry" &&
      e.target.name !== "billingState" &&
      e.target.name !== "billingCity"
    ) {
      setInitialValues({
        ...initialValues,
        [e.target.name]: e.target.value,
      });
    }
    if (e.target.name === "billingCountry") {
      const { isoCode, name } = e.target.value && JSON.parse(e.target.value);
      const statesList = State.getStatesOfCountry(isoCode);
      setCityList([]);
      setStateList(statesList);
      setInitialValues({
        ...initialValues,
        billingCountry: name,
        billingState: "",
        billingCity: "",
      });
    }
    if (e.target.name === "billingState") {
      const { isoCode, countryCode, name } =
        e.target.value && JSON.parse(e.target.value);
      const cities = City.getCitiesOfState(countryCode, isoCode);
      setCityList(cities);
      setInitialValues({
        ...initialValues,
        billingState: name,
        billingCountryCode: countryCode,
        billingStateCode: isoCode,
        billingCity: "",
      });
    }
    if (e.target.name === "billingCity") {
      const { name } = JSON.parse(e.target.value);
      setInitialValues({
        ...initialValues,
        billingCity: name,
      });
    }
    setIsError({ ...isError, [e.target.name]: "" });
  };

  const validate = (values) => {
    let errors = {};
    // if (!values.firstName) {
    //   errors.firstName = 'First name is Required'
    // }
    // if (!values.lastName) {
    //   errors.lastName = 'Last name is Required'
    // }
    if (!values.billingAddress1) {
      errors.billingAddress1 = "Address is Required";
    }
    if (!values.billingCity) {
      errors.billingCity = "City is Required";
    }
    if (!values.billingState) {
      errors.billingState = "State is Required";
    }
    if (!values.billingCountry) {
      errors.billingCountry = "Country is Required";
    }
    if (!values.billingPinCode) {
      errors.billingPinCode = "Pin Code is Required";
    }
    // if (!values.phoneNumber) {
    //   errors.phoneNumber = 'Phone Number is Required'
    // }
    return errors;
  };

  const handleFocus = (e) => {
    const validation = validate(initialValues);
    setIsError(validation);
    setIsFocus({ ...isFocus, [e.target.name]: true });
  };

  const handleCancel = () => {
    populateReduxData();
    setIsEditAddress(false);
    setIsFocus({});
    setIsError({});
  };

  const handleSaveAddressData = async (e, prevent = true) => {
    prevent && e.preventDefault();
    const validation = validate(initialValues);
    setIsError(validation);
    setIsFocus(validation);
    if (Object.keys(validation).length) {
      return null;
    }
    const billingAddress = {
      addressLine1: initialValues.billingAddress1,
      addressLine2: initialValues.billingAddress2,
      city: initialValues.billingCity,
      state: initialValues.billingState,
      country: initialValues.billingCountry,
      pincode: initialValues.billingPinCode,
      stateCode: initialValues.billingStateCode,
      countryCode: initialValues.billingCountryCode,
    };
    setIsEditAddressLoading(true);
    await updateBillingAddress(billingAddress)
      .then((response) => {
        if (response.status === 200) {
          addToast("Address Updated Successfully", {
            appearance: "success",
            autoDismiss: true,
          });
          setIsEditAddress(false);
          validateUser();
        } else {
          addToast("Failed to update address", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        addToast("Failed to update address", {
          appearance: "error",
          autoDismiss: true,
        });
      })
      .finally(() => setIsEditAddressLoading(false));
  };

  const handleKeyDown = async (e) => {
    if (e.key == "Enter") await handleSaveAddressData(e, false);
  };

  return (
    <div className="change--address--main">
      <div className="button--holder">
        {isEditAddress ? (
          <div className="d-flex" style={{ gap: "20px" }}>
            <button className="button--white" onClick={handleCancel}>
              CANCEL
            </button>
            <button
              className="button--black standard--save--button--my-account"
              onClick={handleSaveAddressData}
              disabled={isEditAddressLoading}
            >
              Save
              {isEditAddressLoading ? (
                <>
                  <Spinner size="sm" animation="border" />
                </>
              ) : (
                ""
              )}
            </button>
          </div>
        ) : (
          <button
            className="button--black"
            onClick={() => setIsEditAddress(true)}
          >
            Edit
          </button>
        )}
      </div>

      <div className="address--page--main">
        {/* <>
          <h3>Billing Address</h3>
          {Object.keys(userData.billingAddress).length > 0 ? (
            <address>
              <p>
                <strong>
                  {userData.billingAddress.firstName
                    ? userData.billingAddress.firstName
                    : ''}{' '}
                  {userData.billingAddress.lastName
                    ? userData.billingAddress.lastName
                    : ''}
                </strong>
              </p>
              <p>
                {userData.billingAddress?.addressLine1
                  ? userData.billingAddress?.addressLine1
                  : ''}
                ,{' '}
                {userData.billingAddress?.addressLine2
                  ? userData.billingAddress?.addressLine2
                  : ''}
                <br />
                {userData.billingAddress?.city
                  ? userData.billingAddress?.city
                  : ''}
                ,{' '}
                {userData.billingAddress?.state
                  ? userData.billingAddress?.state
                  : ''}
                ,{' '}
                {userData.billingAddress?.country
                  ? userData.billingAddress?.country
                  : ''}{' '}
                {userData.billingAddress?.pincode
                  ? userData.billingAddress?.pincode
                  : ''}
              </p>
              <p>
                Mobile:{' '}
                {userData.billingAddress?.contactNo
                  ? userData.billingAddress?.contactNo
                  : '--'}
              </p>
            </address>
          ) : (
            <p>Please Add Billing Address</p>
          )}
          <a onClick={handleEditAddress} className="check-btn sqr-btn ">
            {Object.keys(userData.billingAddress).length > 0 ? (
              <span>
                <FaRegEdit /> Edit Address
              </span>
            ) : (
              <span>
                {' '}
                <FaRegAddressBook /> Add Address
              </span>
            )}
          </a>
        </> */}
        <div
          className={
            !isEditAddress
              ? "address--section--profile editDisabled"
              : "address--section--profile"
          }
        >
          <h3>Change Address</h3>
          <div className="account-details-form account-details-address">
            {/* <div>
              <div>
                <div className="single-input-item">
                  <label htmlFor="first-name" className="required">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    onBlur={handleFocus}
                    onKeyDown={handleKeyDown}
                    value={initialValues.firstName}
                    onChange={handleChangeValue}
                  />
                </div>
                {isFocus.firstName && isError.firstName ? (
                  <p className="error-msg">{isError.firstName}</p>
                ) : (
                  ''
                )}
              </div>
              <div>
                <div className="single-input-item">
                  <label htmlFor="last-name" className="required">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    id="lastName"
                    onBlur={handleFocus}
                    type="text"
                    onKeyDown={handleKeyDown}
                    value={initialValues.lastName}
                    onChange={handleChangeValue}
                  />
                </div>
                {isFocus.lastName && isError.lastName ? (
                  <p className="error-msg">{isError.lastName}</p>
                ) : (
                  ''
                )}
              </div>
            </div>*/}
            <div className="d-flex-row mb--60 gap--41">
              <div
                className={`single-input-item standard--input--box ${
                  !isEditAddress ? "disabled" : ""
                }`}
              >
                <label htmlFor="first-name" className="required">
                  Address Line 1 *
                </label>
                <input
                  name="billingAddress1"
                  id="billingAddress1"
                  type="text"
                  onKeyDown={handleKeyDown}
                  onBlur={handleFocus}
                  value={initialValues.billingAddress1}
                  onChange={handleChangeValue}
                />
                {isFocus.billingAddress1 && isError.billingAddress1 ? (
                  <p className="error-msg">{isError.billingAddress1}</p>
                ) : (
                  ""
                )}
              </div>

              <div
                className={`single-input-item standard--input--box ${
                  !isEditAddress ? "disabled" : ""
                }`}
              >
                <label htmlFor="first-name" className="required">
                  Address Line 2
                </label>
                <input
                  name="billingAddress2"
                  id="billingAddress2"
                  type="text"
                  onKeyDown={handleKeyDown}
                  value={initialValues.billingAddress2}
                  onChange={handleChangeValue}
                />
              </div>
            </div>
            <div className="d-flex-row mb--60 gap--41">
              <div
                className={`single-input-item select--container--address standard--input--box ${
                  !isEditAddress ? "disabled" : ""
                }`}
              >
                <div className={`select--container--address`}>
                  <label htmlFor="first-name" className="required">
                    Country *
                  </label>

                  <select
                    className="w-100 h-100"
                    name="billingCountry"
                    value={initialValues.billingCountry}
                    onChange={handleChangeValue}
                    onBlur={handleFocus}
                  >
                    <option value={initialValues.billingCountry} selected>
                      {initialValues.billingCountry
                        ? initialValues.billingCountry
                        : "Country"}
                    </option>
                    {allCountryList.length > 0 ? (
                      allCountryList.map((country, index) => (
                        <option value={JSON.stringify(country)} key={index}>
                          {" "}
                          {country.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No Country
                      </option>
                    )}
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="7"
                    fill="none"
                    viewBox="0 0 12 7"
                  >
                    <path fill="#333" d="M6 7L0 0h12L6 7z"></path>
                  </svg>
                </div>
                {isFocus.billingCountry && isError.billingCountry ? (
                  <p className="error-msg">{isError.billingCountry}</p>
                ) : (
                  ""
                )}
              </div>
              <div
                className={`single-input-item standard--input--box ${
                  !isEditAddress ? "disabled" : ""
                }`}
              >
                <label htmlFor="last-name" className="required">
                  State *
                </label>
                <div className={`select--container--address`}>
                  <select
                    className="w-100 h-100"
                    name="billingState"
                    value={initialValues.billingState}
                    onChange={handleChangeValue}
                    onBlur={handleFocus}
                  >
                    {initialValues.billingState ? (
                      <option value="" selected>
                        {initialValues.billingState}
                      </option>
                    ) : (
                      <option value="" selected disabled hidden>
                        State
                      </option>
                    )}

                    {stateList.length > 0 ? (
                      stateList.map((state, index) => (
                        <option value={JSON.stringify(state)} key={index}>
                          {" "}
                          {state.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        {initialValues.billingCountry == ""
                          ? "Please Select the Country."
                          : initialValues.billingCountry &&
                            stateList.length === 0
                          ? `No State's found`
                          : null}
                      </option>
                    )}
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="7"
                    fill="none"
                    viewBox="0 0 12 7"
                  >
                    <path fill="#333" d="M6 7L0 0h12L6 7z"></path>
                  </svg>
                </div>

                {isFocus.billingState && isError.billingState ? (
                  <p className="error-msg">{isError.billingState}</p>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="d-flex-row mb--60 gap--41">
              <div
                className={`single-input-item standard--input--box ${
                  !isEditAddress ? "disabled" : ""
                }`}
              >
                <label htmlFor="first-name" className="required">
                  City *
                </label>
                <div className={`select--container--address`}>
                  <select
                    className="w-100 h-100"
                    name="billingCity"
                    value={initialValues.billingCity}
                    onChange={handleChangeValue}
                    onBlur={handleFocus}
                  >
                    {initialValues.billingCity && (
                      <option value="" selected>
                        {initialValues.billingCity}
                      </option>
                    )}
                    {!initialValues.billingCity && (
                      <option value="" selected disabled hidden>
                        Town/City
                      </option>
                    )}
                    {cityList.length > 0 ? (
                      cityList.map((city, index) => (
                        <option value={JSON.stringify(city)} key={index}>
                          {" "}
                          {city.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        {initialValues.billingCountry == "" &&
                        initialValues.billingState == ""
                          ? "Please Select the Country and State."
                          : initialValues.billingCountry &&
                            initialValues.billingState == ""
                          ? "Please Select the State."
                          : initialValues.billingCountry &&
                            initialValues.billingState &&
                            cityList.length === 0
                          ? `No Town/City found`
                          : null}
                      </option>
                    )}
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="7"
                    fill="none"
                    viewBox="0 0 12 7"
                  >
                    <path fill="#333" d="M6 7L0 0h12L6 7z"></path>
                  </svg>
                </div>
                {isFocus.billingCity && isError.billingCity ? (
                  <p className="error-msg">{isError.billingCity}</p>
                ) : (
                  ""
                )}
              </div>

              {/* <div> */}
              {/* <div className="single-input-item">
                  <label htmlFor="first-name" className="required">
                    Phone Number
                  </label>
                  <div className="phone-number-account">
                    <input
                      onKeyDown={handleKeyDown}
                      name="phoneNumber"
                      id="phoneNumber"
                      type="text"
                      value={initialValues.phoneNumber}
                      onChange={handleChangeValue}
                    />
                  </div>
                </div>
                {isFocus.phoneNumber && isError.phoneNumber ? (
                  <p className="error-msg">{isError.phoneNumber}</p>
                ) : (
                  ''
                )} */}
              {/* </Col> */}

              <div
                className={`single-input-item  standard--input--box ${
                  !isEditAddress ? "disabled" : ""
                }`}
              >
                <label htmlFor="first-name" className="required">
                  Zip Code/Pin Code *
                </label>
                <input
                  name="billingPinCode"
                  id="billingPinCode"
                  type="text"
                  onKeyDown={handleKeyDown}
                  value={initialValues.billingPinCode}
                  onChange={handleChangeValue}
                  onBlur={handleFocus}
                />
                {isFocus.billingPinCode && isError.billingPinCode ? (
                  <p className="error-msg">{isError.billingPinCode}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div>
              {/* <Col
              style={{ marginBottom: '20px' }}
              lg={6}
              className="d-flex mt-4"
            >
              
            </Col> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    validateUser: () => {
      dispatch(validateUser());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Address);
