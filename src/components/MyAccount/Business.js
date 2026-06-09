import { useEffect, useState, useRef } from "react";
import { FaRegEdit, FaRegAddressBook } from "react-icons/fa";
import { connect } from "react-redux";
import { div, Col, Spinner } from "react-bootstrap";
import { Country, State, City } from "country-state-city";
import { addBusiness, getBusinessProfile, slugChange, joinSupplyChain } from "../../apiClient/business";
import { useToasts } from "react-toast-notifications";
import { validateUser } from "src/redux/actions/userAction";
import FileUpload from "src/components/profile/helpers/fileUpload";
import { useMyContext } from "src/Context"

const Address = ({ userData, validateUser }) => {
  let JoinSupplierCode = localStorage.getItem("JoinSupplierCode");
  let JoinDistributorCode = localStorage.getItem("JoinDistributorCode");
  const { addToast } = useToasts();
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [isEditAddressLoading, setIsEditAddressLoading] = useState(false);
  const [isError, setIsError] = useState({});
  const [isFocus, setIsFocus] = useState({});
  const [businessId, setBusinessId] = useState("")
  const [countryArray, setCountryArray] = useState([])
  const [warningPopup, setWarningPopup] = useState(false)
  const [businessName, setBusinessName] = useState("")
  const [theSupplierCode, setTheSupplierCode] = useState(
    JoinSupplierCode
      ? JoinSupplierCode
      : window.location.href.includes("supplierCode")
        ? window.location.href.split("supplierCode=")[1]
        : ""
  );
  const [theDistributorCode, setTheDistributorCode] = useState(
    JoinDistributorCode
      ? JoinDistributorCode
      : window.location.href.includes("distributorCode")
        ? window.location.href.split("distributorCode=")[1]
        : ""
  );
  const [initialValues, setInitialValues] = useState({
    businessName: "",
    companyWebsite: "",
    industry: "",
    organizationSize: "",
    organizationType: "",
    tagline: "",
    employees: "",
    businessAddress: "",
    globalOffices: "",
    countries: countryArray,
  });

  const [allCountryList, setAllCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([])



  const [selectedFile, setSelectedFile] = useState("");
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [preview, setPreview] = useState('');





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
    // setInitialValues({
    //   ...initialValues,
    //   billingAddress1: addressLine1 ? addressLine1 : "",
    //   billingAddress2: addressLine2 ? addressLine2 : "",
    //   billingState: state ? state : "",
    //   billingCity: city ? city : "",
    //   billingPinCode: pincode ? pincode : "",
    //   billingCountry: country ? country : "",
    //   billingCountryCode: countryCode ? countryCode : "",
    //   billingStateCode: stateCode ? stateCode : "",
    //   country: country ? country : "",
    // });
  };



  const joinTheChain = async (theid , thename) => {
    let body = {
      businessRefCode: JoinSupplierCode || JoinDistributorCode,
      chainBusinessId: theid || businessId,
      chainBusinessName: initialValues?.businessName || thename,
      relationship: JoinSupplierCode ? "supplier" : "distributor",
      primaryName: localStorage.getItem("name"),
      rid: localStorage.getItem("RID")
    }
    await joinSupplyChain(body)
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("JoinSupplierCode")
          localStorage.removeItem("JoinDistributorCode")
          addToast("Added to chain successfully", {
            appearance: "success",
            autoDismiss: true,
          });
        } else {
          addToast(response?.data?.message || "Failed to add to chain", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        addToast(response?.data?.message || "Failed to add to chain", {
          appearance: "error",
          autoDismiss: true,
        });
      })
  }

  const getBusinessDetails = async () => {
    const businessDetail = await getBusinessProfile()
    console.log("business", businessDetail.data.data?.[0])
    if (businessDetail.data.success) {
      let theBusinessData = businessDetail.data.data?.[0]
      // if (JoinSupplierCode || JoinDistributorCode) {
      //   joinTheChain(theBusinessData?._id, theBusinessData?.name)
      // }
      localStorage.setItem("MyBusinessDetails", JSON.stringify(businessDetail.data.data?.[0]))
      setCountryArray(theBusinessData?.countries?.[0].split(","))
      setPreview(theBusinessData?.logo)
      setBusinessId(theBusinessData?._id)
      localStorage.setItem("businessCode", theBusinessData?.businessCode)
      localStorage.setItem("businessId", theBusinessData?._id)
      setBusinessName(theBusinessData?.name)
      setInitialValues({
        businessName: theBusinessData?.name,
        companyWebsite: theBusinessData?.companyWebsite,
        industry: theBusinessData?.industryType,
        organizationSize: theBusinessData?.organizationSize,
        organizationType: theBusinessData?.organizationType,
        tagline: theBusinessData?.tagline,
        employees: theBusinessData?.numberofEmp,
        businessAddress: theBusinessData?.address,
        globalOffices: theBusinessData?.globalOffices,
        countries: theBusinessData?.countries
      });
    }
  }

  let BusinessDetails = localStorage.getItem("MyBusinessDetails");
  let theBusinessName = JSON.parse(BusinessDetails)?.name;
  let theBusinessId = JSON.parse(BusinessDetails)?._id;


  useEffect(() => {
    if (localStorage.getItem("MyBusinessDetails")) {
      if (JoinSupplierCode || JoinDistributorCode) {
        joinTheChain(theBusinessId, theBusinessName);
      }
    }
  }, [])


  useEffect(() => {
    populateReduxData();
    getBusinessDetails();
  }, [userData]);

  const handleEditAddress = () => {
    setIsEditAddress(true);
  };

  const handleChangeValue = (e) => {
    if (e.target.name !== "organizationType") {
      setInitialValues({
        ...initialValues,
        [e.target.name]: e.target.value,
      });
    }
    // if (e.target.name === "billingCountry") {
    //   const { isoCode, name } = e.target.value && JSON.parse(e.target.value);
    //   const statesList = State.getStatesOfCountry(isoCode);
    //   setCityList([]);
    //   setStateList(statesList);
    //   setInitialValues({
    //     ...initialValues,
    //     billingCountry: name,
    //     billingState: "",
    //     billingCity: "",
    //   });
    // }
    // if (e.target.name === "billingState") {
    //   const { isoCode, countryCode, name } =
    //     e.target.value && JSON.parse(e.target.value);
    //   const cities = City.getCitiesOfState(countryCode, isoCode);
    //   setCityList(cities);
    //   setInitialValues({
    //     ...initialValues,
    //     billingState: name,
    //     billingCountryCode: countryCode,
    //     billingStateCode: isoCode,
    //     billingCity: "",
    //   });
    // }
    if (e.target.name === "organizationType") {
      console.log(e.target.value)
      const name = e.target.value;
      setInitialValues({
        ...initialValues,
        organizationType: e.target.value,
      });
    }
    console.log(initialValues, "values")
    setIsError({ ...isError, [e.target.name]: "" });
  };

  const validate = (values) => {
    let errors = {};
    if (!values.businessName) {
      errors.businessName = "Business Name is Required";
    }
    if (!values.companyWebsite) {
      errors.companyWebsite = "Company Website is Required";
    }
    if (!values.industry) {
      errors.industry = "Industry is Required";
    }
    if (!values.organizationSize) {
      errors.organizationSize = "Organization Size is Required";
    }
    if (!values.organizationType) {
      errors.organizationType = "Organization Type is Required";
    }
    if (!values.tagline) {
      errors.tagline = "Tagline is Required";
    }
    if (!values.employees) {
      errors.employees = "Number of employees is Required";
    }
    if (!values.businessAddress) {
      errors.businessAddress = "Business Address is Required";
    }
    if (!values.globalOffices) {
      errors.globalOffices = "Global Offices is Required";
    }
    if (!values.countries) {
      errors.countries = "Countries is Required";
    }


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
    console.log(initialValues)
    console.log("Wdwdw")
    prevent && e.preventDefault();
    const validation = validate(initialValues);
    setIsError(validation);
    setIsFocus(validation);
    console.log(Object.keys(validation))
    if (Object.keys(validation).length) {
      return null;
    }
    let formData = new FormData();
    businessName && businessName !== initialValues.businessName ? "" : formData.set("name", initialValues.businessName)
    formData.set("companyWebsite", initialValues.companyWebsite)
    formData.set("industryType", initialValues.industry)
    formData.set("organizationSize", parseInt(initialValues.organizationSize))
    formData.set("organizationType", initialValues.organizationType)
    formData.set("tagline", initialValues.tagline)
    formData.set("numberofEmp", parseInt(initialValues.employees))
    formData.set("address", initialValues.businessAddress)
    formData.set("globalOffices", initialValues.globalOffices)
    formData.set("countries", countryArray)
    formData.append("profileImage", preview);
    formData.append("userName", localStorage.getItem("email"));
    formData.set("userId", localStorage.getItem("userId"))
    formData.set("businessSlugName", initialValues.businessName.replace(/\s+/g, '').toLowerCase());
    // const businessData = {
    //   name: initialValues.businessName,
    //   companyWebsite: initialValues.companyWebsite,
    //   industry: initialValues.industry,
    //   organizationSize: initialValues.organizationSize,
    //   organizationType: initialValues.organizationType,
    //   tagline: initialValues.tagline,
    //   employees: initialValues.employees,
    //   address: initialValues.businessAddress,
    //   globalOffices: initialValues.globalOffices,
    //   countries: countryArray,
    //   profileImage: preview
    // };
    // console.log("businessData", businessData)
    setIsEditAddressLoading(true);
    // setTimeout(() => {
    //   addToast("Bussiness Profile Updated Successfully", {
    //     appearance: "success",
    //     autoDismiss: true,
    //   });
    //   setIsEditAddressLoading(false);
    //   setIsEditAddress(false)
    // }, 2000)
    await addBusiness(formData, businessId)
      .then((response) => {
        setIsEditAddressLoading(false)
        if (response.status === 200) {
          addToast("Business Profile Updated Successfully", {
            appearance: "success",
            autoDismiss: true,
          });
          setIsEditAddress(false);
          validateUser();
          if (JoinSupplierCode || JoinDistributorCode) {
            joinTheChain(response.data.data._id);
          }
          if (businessName && businessName !== initialValues.businessName) {
            slugchange1(businessId || response.data.data._id);
          } else {
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }

          // setRefetchBusiness(!refetchBusiness)
          console.log("BusinessUpdate", response.data.data)
          // localStorage.setItem("MyBusinessDetails", JSON.stringify(response.data.data))
        } else {
          addToast(response?.data?.message || "Failed to update business profile", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        addToast(response?.data?.message || "Failed to update business profile", {
          appearance: "error",
          autoDismiss: true,
        });
      })
      .finally(() => setIsEditAddressLoading(false));


  };

  const slugchange1 = async (businessId) => {
    let body = {
      businessSlugName: initialValues.businessName.replace(/\s+/g, '').toLowerCase(),
      name: initialValues.businessName,
    }
    // if (businessName && businessName !== initialValues.businessName) {
    //   body = {
    //     businessSlugName: initialValues.businessName.replace(/\s+/g, '').toLowerCase(),
    //     name: initialValues.businessName,
    //     ownerAcknowledgement: false
    //   }
    // } else {
    //   body = {
    //     businessSlugName: initialValues.businessName.replace(/\s+/g, '').toLowerCase(),
    //     name: initialValues.businessName,
    //     ownerAcknowledgement: false
    //   }
    // }
    await slugChange(body, businessId)
      .then((response) => {
        if (response.status === 200) {
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          addToast(response?.data?.message || "Failed to update business profile", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error)
      })
  }

  const handleKeyDown = async (e) => {
    if (e.key == "Enter") await handleSaveAddressData(e, false);
  };

  const delCountryClick = (item) => {
    let theList = countryArray.filter(value => value !== item)
    setCountryArray(theList)
  }

  const countryClick = (item) => {
    setCountryArray([...countryArray, JSON.parse(item).name])
  }

  const TotalOrders = localStorage.getItem("TotalOrders")

  return (
    <>
      {/* {TotalOrders > 0 ? */}
      <div className="change--address--main">
        <div className="backdrop-popup" style={{ display: warningPopup ? "" : "none" }}>
          <div className="sustainability--confirm-popup-holder">
            <div
              className="sustainability-cross-icon"
              onClick={() => setWarningPopup(false)}
            >
              <img src="/assets/images/cross-sustainability.png" />
            </div>
            <div>
              <img src="/assets/images/sustainability-popup.png" />
            </div>
            <div>
              <h3 style={{ textAlign: "center" }} className={`sustainability--popup-sure-text`}>
                Are you Sure?
              </h3>
              <p style={{ textAlign: "center", fontSize: "15px" }}>
                Changing the business name will affect all the DPP pages
              </p>
            </div>
            <div className="sustainability--popup-button-holder">
              <button
                className="sustainability--popup-button-white button--white"
                onClick={(e) => [
                  setWarningPopup(false),
                  handleSaveAddressData(e, false)
                ]}
              >
                YES
              </button>
              <button
                className="sustainability--popup-button-black button--black button--cursor"
                onClick={() => setWarningPopup(false)}
              >
                NO
              </button>
            </div>
          </div>
        </div>
        <div className="button--holder">
          {isEditAddress ? (
            <div className="d-flex" style={{ gap: "20px" }}>
              <button className="button--white" onClick={handleCancel}>
                CANCEL
              </button>
              <button
                className="button--black standard--save--button--my-account"
                onClick={(e) => businessName && businessName !== initialValues.businessName ? setWarningPopup(true) : handleSaveAddressData(e, false)}
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
            <div className="profile-line">
              <p className="profile-head"> {businessId ? "Edit" : "Add"} Business Profile</p>
              <p className="profile-head" style={{ display: businessId ? "" : "none" }}>Business Code : {localStorage.getItem("businessCode")}</p>
            </div>
            <div className="profileSection--form--main">
              <div className="image--upload-holder" style={{ marginTop: "60px", pointerEvents: isEditAddress ? "" : "none" }}>
                <FileUpload image={preview} setImage={setPreview} />
                {/* <label htmlFor="first-name" className="required">
                Upload Logo
              </label> */}
              </div>
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
                    className={`single-input-item standard--input--box ${!isEditAddress ? "disabled" : ""
                      }`}
                  >
                    <label htmlFor="first-name" className="required">
                      Business Name
                    </label>
                    <input
                      name="businessName"
                      id="businessName"
                      type="text"
                      onKeyDown={handleKeyDown}
                      onBlur={handleFocus}
                      value={initialValues.businessName}
                      onChange={handleChangeValue}
                    />
                    {isFocus.businessName && isError.businessName ? (
                      <p className="error-msg">{isError.businessName}</p>
                    ) : (
                      ""
                    )}
                  </div>

                  <div
                    className={`single-input-item standard--input--box ${!isEditAddress ? "disabled" : ""
                      }`}
                  >
                    <label htmlFor="first-name" className="required">
                      Add Your Company Website
                    </label>
                    <input
                      name="companyWebsite"
                      id="companyWebsite"
                      type="text"
                      onKeyDown={handleKeyDown}
                      value={initialValues.companyWebsite}
                      onBlur={handleFocus}
                      onChange={handleChangeValue}
                    />
                    {isFocus.companyWebsite && isError.companyWebsite ? (
                      <p className="error-msg">{isError.companyWebsite}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="d-flex-row mb--60 gap--41">
                  <div
                    className={`single-input-item select--container--address standard--input--box ${!isEditAddress ? "disabled" : ""
                      }`}
                  >
                    <div className={`select--container--address`}>
                      <label htmlFor="first-name" className="required">
                        Industry
                      </label>

                      <input
                        name="industry"
                        id="industry"
                        type="text"
                        onKeyDown={handleKeyDown}
                        value={initialValues.industry}
                        onBlur={handleFocus}
                        onChange={handleChangeValue}
                      />
                      {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="7"
                    fill="none"
                    viewBox="0 0 12 7"
                  >
                    <path fill="#333" d="M6 7L0 0h12L6 7z"></path>
                  </svg> */}
                    </div>
                    {isFocus.industry && isError.industry ? (
                      <p className="error-msg">{isError.industry}</p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className={`single-input-item standard--input--box ${!isEditAddress ? "disabled" : ""
                      }`}
                  >
                    <label htmlFor="last-name" className="required">
                      Organization Size
                    </label>
                    <div className={`select--container--address`}>
                      <input
                        name="organizationSize"
                        id="organizationSize"
                        type="text"
                        onKeyDown={handleKeyDown}
                        value={initialValues.organizationSize}
                        onBlur={handleFocus}
                        onChange={handleChangeValue}
                      />
                      {/* <select
                    className="w-100 h-100"
                    name="billingState"
                    // value={initialValues.billingState}
                    // onChange={handleChangeValue}
                    // onBlur={handleFocus}
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
                  </select> */}
                      {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="7"
                    fill="none"
                    viewBox="0 0 12 7"
                  >
                    <path fill="#333" d="M6 7L0 0h12L6 7z"></path>
                  </svg> */}
                    </div>

                    {isFocus.organizationSize && isError.organizationSize ? (
                      <p className="error-msg">{isError.organizationSize}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="d-flex-row mb--60 gap--41">
                  <div
                    className={`single-input-item standard--input--box ${!isEditAddress ? "disabled" : ""
                      }`}
                  >
                    <label htmlFor="first-name" className="required">
                      Organization type
                    </label>
                    <div className={`select--container--address`}>
                      <select
                        className="w-100 h-100"
                        name="organizationType"
                        value={initialValues.organizationType}
                        onChange={handleChangeValue}
                        onBlur={handleFocus}

                      >
                        <option value="Public company">Public company</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Government Agency">Government Agency</option>
                        <option value="Nonprofit">Nonprofit</option>
                        <option value="Sole proprietorship">Sole proprietorship</option>
                        <option value="Privately held">Privately held</option>
                        <option value="Partnership">Partnership</option>

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
                    {/* <input
                    name="organizationType"
                    id="organizationType"
                    type="text"
                    onKeyDown={handleKeyDown}
                    onBlur={handleFocus}
                    value={initialValues.organizationType}
                    onChange={handleChangeValue}
                  /> */}
                    {isFocus.organizationType && isError.organizationType ? (
                      <p className="error-msg">{isError.organizationType}</p>
                    ) : (
                      ""
                    )}
                  </div>

                  <div
                    className={`single-input-item standard--input--box ${!isEditAddress ? "disabled" : ""
                      }`}
                  >
                    <label htmlFor="first-name" className="required">
                      Tagline
                    </label>
                    <input
                      name="tagline"
                      id="tagline"
                      type="text"
                      onKeyDown={handleKeyDown}
                      value={initialValues.tagline}
                      onBlur={handleFocus}
                      onChange={handleChangeValue}
                    />
                    {isFocus.tagline && isError.tagline ? (
                      <p className="error-msg">{isError.tagline}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="d-flex-row mb--60 gap--41">
                  <div
                    className={`single-input-item standard--input--box ${!isEditAddress ? "disabled" : ""
                      }`}
                  >
                    <label htmlFor="first-name" className="required">
                      Number of Employees
                    </label>
                    <input
                      name="employees"
                      id="employees"
                      type="text"
                      onKeyDown={handleKeyDown}
                      onBlur={handleFocus}
                      value={initialValues.employees}
                      onChange={handleChangeValue}
                    />
                    {isFocus.employees && isError.employees ? (
                      <p className="error-msg">{isError.employees}</p>
                    ) : (
                      ""
                    )}
                  </div>

                  <div
                    className={`single-input-item standard--input--box ${!isEditAddress ? "disabled" : ""
                      }`}
                  >
                    <label htmlFor="first-name" className="required">
                      Business Address
                    </label>
                    <input
                      name="businessAddress"
                      id="businessAddress"
                      type="text"
                      onKeyDown={handleKeyDown}
                      value={initialValues.businessAddress}
                      onBlur={handleFocus}
                      onChange={handleChangeValue}
                    />
                    {isFocus.businessAddress && isError.businessAddress ? (
                      <p className="error-msg">{isError.businessAddress}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="d-flex-row mb--60 gap--41">
                  <div
                    className={`single-input-item standard--input--box ${!isEditAddress ? "disabled" : ""
                      }`}
                  >
                    <label htmlFor="first-name" className="required">
                      Number of Global Offices
                    </label>
                    <input
                      name="globalOffices"
                      id="globalOffices"
                      type="text"
                      onKeyDown={handleKeyDown}
                      onBlur={handleFocus}
                      value={initialValues.globalOffices}
                      onChange={handleChangeValue}
                    />
                    {isFocus.globalOffices && isError.globalOffices ? (
                      <p className="error-msg">{isError.globalOffices}</p>
                    ) : (
                      ""
                    )}
                  </div>

                  <div
                    className={`single-input-item standard--input--box ${!isEditAddress ? "disabled" : ""
                      }`}
                  >
                    <label htmlFor="first-name" className="required">
                      Operating Countries
                    </label>
                    <div className={`select--container--address`} style={{ display: isEditAddress ? "" : "none" }}>

                      <select
                        className="w-100 h-100"
                        name="country"
                        value={`Select country`}
                        onChange={(e) => countryClick(e.target.value)}
                        onBlur={handleFocus}
                      >
                        <option value="select country">
                          Select country
                        </option>
                        {/* {initialValues.billingState ? (
                      <option value="" selected>
                        {initialValues.billingState}
                      </option>
                    ) : (
                      <option value="" selected disabled hidden>
                        country
                      </option>
                    )} */}
                        {allCountryList.length > 0 ? (
                          allCountryList.map((thecountry, index) => (
                            <option value={JSON.stringify(thecountry)} key={index}>
                              {thecountry.name}
                            </option>
                          ))
                        )
                          :
                          (
                            <option value="" disabled>
                              {countryArray.length === 0
                                ? "Please Select the Country."
                                : null}
                            </option>
                          )
                        }
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
                    <div className="theCountryList">
                      {countryArray.length > 0 ? (
                        countryArray.map((item, index) => {
                          return (
                            <>
                              <p className="eachCountry">{item} <span onClick={() => delCountryClick(item)} style={{ display: isEditAddress ? "" : "none" }} className="delCountry">&#10006;</span></p>
                              &nbsp;
                            </>
                          )
                        })
                      ) : <p className="error-msg" style={{ display: "none" }}>Country is Required</p>}
                    </div>
                  </div>
                </div>
                {/* <div className="logoLabel">Upload Logo</div>
              <div className="d-flex-row mb--60 gap--41">
                <div className="acc-upload-imgbox" style={{ width: "866px", height: "200px", border: isEditAddress ? "2px solid black" : "2px solid #ccc" }}>
                  <input
                    id="imgInp"
                    type="file"
                    accept="image/*,video/*"
                    onChange={onSelectFile}
                    style={{ display: "none" }}
                    ref={fileInputRef1}
                  />

                  {selectedFile ? (
                    <div
                      style={{
                        lineHeight: "1.5rem",
                        textAlign: "center",
                        padding: "15px"
                      }}
                      onClick={() => {
                        handleImageClick(fileInputRef1);
                      }}
                    >
                      {preview && <img src={preview} alt="File Preview" style={{ maxWidth: '100%', maxHeight: '200px', padding: "15px" }} />}
                    </div>
                  ) : isUploadLoading !== "fileInputRef1" ? (
                    <div
                      onClick={() => {
                        handleImageClick(fileInputRef1);
                      }}
                      style={{
                        lineHeight: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      Choose File
                      <br /> Upload to see preview
                    </div>
                  ) : (
                    <div
                      style={{
                        lineHeight: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      Uploading...
                    </div>
                  )}
                </div>
              </div> */}

                {/* <div className="d-flex-row mb--60 gap--41">
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
            </div> */}
                {/* <div>          
            </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* : 
      <p style={{ marginTop: "50px" }} className="text-center">Purchase a product to create your Business Account</p>} */}
    </>

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
