import React, { useCallback, useEffect, useRef, useState } from "react";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { ButtonGroup, Col, Container, Row, Spinner } from "react-bootstrap";
import { createTheme, withStyles } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  returnCorrectCode,
  returnReverseCode,
} from "src/data/countryCodeToISO3";
import Link from "next/link";
import calculatorOneIMG from "../../assets/images/calculatorIcon/location.png";
import { Progress } from "reactstrap";
import Image from "next/image";
import { getCountries } from "src/apiClient/country";
import { getAllBusiness } from "src/apiClient/business"
import axios from "axios";
import ToggleButton from "react-bootstrap/ToggleButton";
import NoSSR from "react-no-ssr";
import SliderCustom from "src/components/calculator/slider";
import { useRouter } from "next/router";
import _debounce, { _newDebounce } from "src/helpers/debounce";
import { saveCalculatedFields } from "src/apiClient/carbon";
import { useToasts } from "react-toast-notifications";
import { getJoinedBusiness } from "src/apiClient/employer"
import { getBusinessDetailsByCode } from "src/apiClient/business"
import {
  resetCircleDataIndex,
  saveCarbonAPIUpdated,
  saveCarbonCalculations,
} from "src/redux/actions/carbonCalculatorActions";
import { connect } from "react-redux";
import { me } from "src/apiClient/auth";
import * as cookie from "cookie";
import { returnCorrectImage } from "src/components/helpers/returnCorrectImage";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Travel from "../../pages/other/travel";
import {
  IoIosCheckmark,
} from "react-icons/io";
// const BorderLinearProgress = withStyles((theme) => ({
//   root: {
//     height: 13,
//     borderRadius: 5,
//   },
//   colorPrimary: {
//     backgroundColor: '#ADB1B4',
//   },
//   bar: {
//     borderRadius: 5,
//     backgroundColor: '#378CBF',
//   },
// }))(LinearProgress);

// function valuetext(value) {
//   return `${value}°C`;
// }

let countryCode;
let s;
let carbonConsumptions;
let dataChanged = false;
let loggedIn = false;
let fetchAPI = true;
const { setDebounce, removeDebounce } = _newDebounce();

function Basic({ businessUser, setBusinessUser, totalCarbon, setTotalCarbon, oneWayTravel, setOneWayTravel, remoteData, setRemoteData, onSiteData, setOnSiteData, transportMode, setTransportMode, expenses, setExpenses, tripsperyear, setTripsPerYear, businessCode, setBusinessCode, businessName, setBusinessName, unitScale, setUnitScale, totalTravel, setTotalTravel, airTravel, setAirTravel, airTravelTime, setAirTravelTime, carTravel, setCarTravel, carTravelDistance, setCarTravelDistance, trainTravel, setTrainTravel, trainTravelDistance, setTrainTravelDistance, otherTravel, setOtherTravel, otherTravelDistance, setOtherTravelDistance, travelForWork, setTravelForWork, ...props }) {
  console.log("totalcarbon", totalCarbon)
  const setWindowBeforeUnload = () => {
    window.onbeforeunload = async function () {
      if (dataChanged && loggedIn) {
        removeDebounce();
        const carbonData = returnMappedReduxData();
        // props.saveCarbonAPIUpdated(false)
        await saveCalculatedFieldsToDB(carbonData, false);
        // fetchAPI = true

        dataChanged = false;
      }
    };
  };

  useEffect(() => {
    console.log(remoteData, onSiteData)
  }, [remoteData])

  useEffect(() => {
    loggedIn = props.userData?.isLoggedIn;
  }, [props.userData?.isLoggedIn]);

  const returnMappedReduxData = () => {
    return {
      houseHoldMembers: props?.circleSliderData?.houseHoldMembers,
      publicTransportationMembers:
        props?.circleSliderData?.publicTransportationMembers,
      income: props?.circleSliderData?.income,
      houseSize: props?.circleSliderData?.houseSize,
      airTravel: props?.circleSliderData?.airTravel,
      meatConsumption: props?.circleSliderData?.meatConsumption,
      Emissions: props?.circleSliderData?.Emissions,
      countryCode: props?.circleSliderData?.countryCode,
    };
  };

  const returnCarbonConsumptionObject = () => {
    let pullObject;

    if (!props?.userData?.isLoggedIn) {
      pullObject = props?.circleSliderData;
    } else {
      pullObject = props?.carbonCalculations?.carbonCalculations;
    }

    const returnObject = {
      houseHold: pullObject?.houseHoldMembers || 1,
      travel: pullObject?.travel || 1,
      transport: pullObject?.publicTransportationMembers || 0,
      income: pullObject?.income || "medium",
      airTravel: pullObject?.airTravel || "medium",
      houseSize: pullObject?.houseSize || "medium",
      travelforWork: pullObject?.travelForWork || "no",
      consumeFood: pullObject?.meatConsumption || "medium",
      tripsperyear: pullObject?.tripsperyear || 0,
      distance: pullObject?.distance || 1,
      car: pullObject?.car || "car",
      publicTransport: 0,
      isRent: "rent",
    };
    fetchAPI = true;
    return returnObject;
  };

  const { addToast } = useToasts();

  const [carbonConsumption, setCarbonConsumption] = useState({
    ...returnCarbonConsumptionObject(),
  });

  const [shouldCallAPI, setShouldCallAPI] = useState(false);
  const router = useRouter();
  const [averageCarbon, setAverageCarbon] = useState(0);
  const [selectCountry, setSelectCountry] = useState();
  const [showCapitalCarbon, setShowCapitalCarbon] = useState();
  const [showCapitalName, setCapitalName] = useState();
  const [countryList, setCountryList] = useState([]);

  const [storeCountryShortName, setStoreCountryShortName] = useState("");
  const [houseHoldCarbon, setHouseHoldCarbon] = useState("");
  const [privateCarbon, setPrivateCarbon] = useState("");
  const [publicCarbon, setPublicCarbon] = useState("");
  const [userCountry, setUserCountry] = useState({});
  const [countryCodeISO3, setCountryCodeISO3] = useState("");
  const [continueClicked, setContinueClicked] = useState(false);
  // const [airTravel, setAirTravel] = useState(0);
  // const [carTravel, setCarTravel] = useState(0);
  // const [trainTravel, setTrainTravel] = useState(0);
  // const [publicTravel, setPublicTravel] = useState(0);
  // const [otherTravel, setOtherTravel] = useState(0);
  const firstRender = useRef();
  const [TabActive, setTabActive] = useState(false);
  const [total, setTotal] = useState(0);
  // const [oneWayTravel, setOneWayTravel] = useState(10)
  // const [remoteData, setRemoteData] = useState(2)
  // const [onSiteData, setOnSiteData] = useState(3)
  // const [transportMode, setTransportMode] = useState("car")
  // const [expenses, setExpenses] = useState("Less than $50")
  // const [tripsperyear, setTripsPerYear] = useState(10)
  // const [businessCode, setBusinessCode] = useState(JSON.parse(localStorage.getItem("JoinedBusinessDetails"))?.businessCode || "")
  // const [businessName, setBusinessName] = useState(JSON.parse(localStorage.getItem("JoinedBusinessDetails"))?.businessId?.name || "")
  const [isError, setIsError] = useState({});
  const [isFocus, setIsFocus] = useState({});
  const [dataDisplay, setDataDisplay] = useState(false)
  const [validText, setValidText] = useState(false)
  const [inputValue, setInputValue] = useState('');
  const [laptops, setLaptops] = useState(1)
  const [computers, setComputers] = useState(1)
  const [mobiles, setMobiles] = useState(1)
  const inputRef = useRef(null);
  const [searchBusiness, setSearchBusiness] = useState("")
  const [clickedDropDest, setClickedDropDest] = useState(false);
  const [allBusiness, setAllBusiness] = useState([])

  // useEffect(() => {
  //   BusinessDetails()
  // }, [])

  useEffect(() => {
    // if (localStorage.getItem("JoinedBusinessDetails")) return;
    if (businessCode.length === 8) {
      FetchBusinessName()
    } else {
      // setBusinessName("")
      setDataDisplay(false)
      setAirTravel(0)
      setAirTravelTime(0)
      setCarTravel(0)
      setCarTravelDistance(0)
      setTrainTravel(0)
      setTrainTravelDistance(0)
      setOneWayTravel(10)
      setRemoteData(2)
      setOnSiteData(3)
      setTransportMode('car')
      setExpenses("Less than $50")
      setTripsPerYear(10)
      setUnitScale("KM")
      setTravelForWork("yes")
    }
  }, [businessCode])

  // const BusinessDetails = async () => {
  //   let JoinedBusinessDetails = await getJoinedBusiness()
  //   if (JoinedBusinessDetails?.data?.success) {
  //     setBusinessCode(JoinedBusinessDetails?.data?.data?.[0]?.businessCode)

  //   }
  // }

  const FetchBusinessName = async () => {
    let getBusinessDetails = await getBusinessDetailsByCode(businessCode)
    if (getBusinessDetails?.data?.success) {
      setDataDisplay(true)
      console.log("businessDetails", getBusinessDetails)
      setBusinessName(getBusinessDetails?.data?.data?.name)
      setValidText(true)
      setBusinessUser(getBusinessDetails?.data?.data?.userId)
      console.log(getBusinessDetails?.data?.data?.userId, "userr")
    } else {
      addToast(getBusinessDetails?.data?.message, {
        appearance: "error",
        autoDismiss: true,
      });
      setValidText(false)
    }
  }


  const returnMappedCarbonData = () => {
    return {
      houseHoldMembers: carbonConsumption.houseHold,
      travel: carbonConsumption.travel,
      publicTransportationMembers: carbonConsumption.transport,
      income: carbonConsumption.income,
      houseSize: carbonConsumption.houseSize,
      airTravel: carbonConsumption.airTravel,
      transportbyCar: carbonConsumption.transportbyCar,
      transportbyTrain: carbonConsumption.transportbyTrain,
      meatConsumption: carbonConsumption.consumeFood,
      travelforWork: carbonConsumption.travelforWork,
      // Emissions: Number(),
      countryCode: countryCodeISO3 || storeCountryShortName,
    };
  };

  useEffect(() => {
    userCountry.code &&
      countryList.length > 0 &&
      handleSelectCountry_1({ target: { value: userCountry.code } });
  }, [countryList, userCountry]);

  useEffect(() => {
    getCountryList();
    if (props?.carbonCalculations?.carbonCalculations?.countryCode) {
      return setUserCountry({
        code: props?.carbonCalculations?.carbonCalculations?.countryCode,
      });
    }
    if (props?.circleSliderData?.countryCode) {
      return setUserCountry({
        code: props?.circleSliderData?.countryCode,
      });
    }
    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        setUserCountry({
          name: res.data.country_name,
          code: res.data.country_code_iso3,
        });
      })
      .catch((data, status) => {
        console.log("Request failed:", data);
      });
  }, []);

  useEffect(() => {
    handleShowAverageCarbonUsage();
  }, [
    oneWayTravel,
    onSiteData,
    remoteData,
    transportMode,
    expenses,
    selectCountry,
  ]);

  const saveValuesToRedux = (
    carbonData,
    saveCalculatedFieldsToDB,
    saveCarbonAPIUpdated
  ) => {
    props.saveCarbonCalculations(
      carbonData,
      saveCalculatedFieldsToDB,
      saveCarbonAPIUpdated
    );
  };

  const saveValuesToAPIDebounced = useCallback(
    setDebounce((updated, saveToAPIFunc) => {
      saveToAPIFunc().then(() => (updated = false));
    }, 10000),
    []
  );

  useEffect(() => {
    if (firstRender?.current) return;
    if (countryCodeISO3 || storeCountryShortName) {
      countryCode = countryCodeISO3 || storeCountryShortName;
    }
    // s = ;
    carbonConsumptions = carbonConsumption;
    if (!shouldCallAPI) return;
    const carbonData = returnMappedCarbonData();
    dataChanged = true;
    setWindowBeforeUnload();
    saveValuesToRedux(
      carbonData,
      saveCalculatedFieldsToDB,
      props.saveCarbonAPIUpdated
    );
    if (props?.userData?.isLoggedIn) {
      saveValuesToAPIDebounced(dataChanged, () =>
        saveCalculatedFieldsToDB(carbonData, true)
      );
    }
  }, [, countryCodeISO3]);

  const marks = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
    {
      value: 6,
      label: "6",
    },
    {
      value: 7,
      label: "7+",
    },
  ];
  const marksHouseHold = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
    {
      value: 6,
      label: "6",
    },
    {
      value: 7,
      label: "7+",
    },
  ];
  const handleContinue = (e = "") => {
    setContinueClicked(true);
    const carbonData = returnMappedCarbonData();
    if (props?.userData?.isLoggedIn)
      saveCalculatedFieldsToDB(carbonData, false);
    const current = Math.round();
    if (props.circleSliderData?.dataIndex > current) {
      props.resetCircleDataIndex();
    }

    router.push({
      pathname: "/circular",
      query: { tons: current },
    });
  };
  const handleCalculateCarbon = (name, value) => {
    if (name === "remote") {
      if (value + onSiteData > 7) {
        return addToast("work data cannot exceed 7", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setRemoteData(value)
    }

    if (name === "onSite") {
      setOnSiteData(value)
    }

    if (name === "laptops") {
      setLaptops(value)
    }
    if (name === "computers") {
      setComputers(value)
    }
    if (name === "mobiles") {
      setMobiles(value)
    }
  };

  const handleChange = async (e) => {
    setBusinessName(e.target.value)
    setSearchBusiness(e.target.value)
    if (e.target.value.length >= 3) {
      setClickedDropDest(true);
      // Filter data based on search term
      let businessData = await getAllBusiness();
      let filterBusiness = businessData.data.data.filter(
        (item) =>
          item?.name
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
      if (filterBusiness.length === 0) {
        setClickedDropDest(false)
        setBusinessCode("")
      }
      setAllBusiness(filterBusiness);
    } else {
      setAllBusiness([]);
      // setBusinessCode("")
      setClickedDropDest(false);
    }
  }

  const handleChangeCode = (e) => {
    if (e.target.value.length <= 8) {
      setBusinessCode(e.target.value)
    }
    setInputValue(e.target.value);
    if (e.target.value.length >= 8) {
      inputRef.current.blur(); // Unfocus the input field
    }
  }

  const handletripsperyear = (name, value) => {
    setTripsPerYear(value)
  };

  const handledistance = (item, value) => {
    setOneWayTravel(value)
  };

  const travelData = (item, value) => {
    console.log(item, value, "travel");
    if (item === "airTravel") {
      if (value + carTravel + trainTravel + publicTravel + otherTravel > 10) {
        return addToast("travel data cannot exceed 10", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setAirTravel(value);
    }
    if (item === "carTravel") {
      if (airTravel + value + trainTravel + publicTravel + otherTravel > 10) {
        return addToast("travel data cannot exceed 10", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setCarTravel(value);
    }
    if (item === "trainTravel") {
      if (airTravel + carTravel + value + publicTravel + otherTravel > 10) {
        return addToast("travel data cannot exceed 10", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setTrainTravel(value);
    }
    if (item === "publicTravel") {
      if (airTravel + carTravel + trainTravel + value + otherTravel > 10) {
        return addToast("travel data cannot exceed 10", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setPublicTravel(value);
    }
    if (item === "otherTravel") {
      if (airTravel + carTravel + trainTravel + trainTravel + value > 10) {
        return addToast("travel data cannot exceed 10", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setOtherTravel(value);
    }
  };

  // mode of transportion //

  const handleCalculateCarbonTrans = (name, value) => {
    console.log("name", name);
    console.log("value", value);
    // setShouldCallAPI(true);
    // if (
    //   (name == "transportMode" && value == 0) ||
    //   (name == "transport" && value == -1)
    // ) {
    //   return;
    // }

    // if (name == "transportMode") {
    //   if (value < carbonConsumption?.transport) {
    //     carbonConsumption.transport = value;
    //   }
    // }\
    if (name === "unitScale") {
      setUnitScale(value)
    }
    if (name === "transportMode") {
      setTransportMode(value)
    }
    if (name === "userExpense") {
      setExpenses(value)
    }
  };

  const handleTravelforwork = (name, value) => {
    setCarbonConsumption((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getCountryList = async () => {
    await getCountries({ show: "yes", limit: 255 })
      .then((data) => {
        // setCountryList(data.countries);

        // #################################################################
        // This this needs to happen in the backend or the main data need to be modified,
        // This is a temp fix.
        const newCountries = data?.data?.filter(
          (each) => each.carbonCountryPerCapita !== "0" && each.countryCode
        );

        newCountries.sort((a, b) =>
          a.entity.localeCompare(b.entity, "es", { sensitivity: "base" })
        );
        // ##################################################################

        setCountryList(newCountries);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSelectCountry_1 = (e) => {
    if (e.target.value.length === 2) {
      const reverseValue = returnReverseCode(e?.target?.value);
      e.target.value = reverseValue;
    }
    setCountryCodeISO3(returnCorrectCode(e?.target?.value).toLocaleLowerCase());
    let countryShortName = countryList.find(
      (x) => x.countryCode == e?.target?.value
    );

    if (!countryShortName) {
      return console.log("error, the country short name not found");
    }

    setStoreCountryShortName(e?.target?.value);
    setSelectCountry(Number(countryShortName.carbonCountryPerCapita));

    setShowCapitalCarbon(Number(countryShortName.carbonCountryPerCapita));
    setCapitalName(countryShortName.entity);
  };

  const handleSelectCountry = (e) => {
    setShouldCallAPI(true);
    setCountryCodeISO3(returnCorrectCode(e?.target?.value).toLocaleLowerCase());
    let countryShortName = countryList.find(
      (x) => x.countryCode == e?.target?.value
    );

    if (!countryShortName) {
      return console.log("error, the country short name not found");
    }

    setStoreCountryShortName(
      e?.target?.value !== "" ? e?.target?.value : storeCountryShortName
    );
    setSelectCountry(Number(countryShortName.carbonCountryPerCapita));

    setShowCapitalCarbon(Number(countryShortName.carbonCountryPerCapita));
    setCapitalName(countryShortName.entity);
  };

  const handleShowAverageCarbonUsage = () => {
    const lifeStyle =
      transportMode == "car"
        ? 0.3
        : transportMode == "ev_car"
          ? 0.1
          : transportMode == "twoWheel"
            ? 0.1
            : transportMode == "carpooling"
              ? 0.15
              : transportMode == "public"
                ? 0.1
                : transportMode == "bicycle"
                  ? 0
                  : 0;
    const transportation =
      (Number(onSiteData) * Number(oneWayTravel) * 2 * 48 * lifeStyle) / 1000;
    const calc = transportation.toFixed(2);
    setTotalCarbon(calc)

    totalCarbon = calc;
    // if (
    //   totalCarbon &&
    //   totalCarbon != calc &&
    //   !firstRender.current &&
    //   selectCountry
    // ) {
    //   dataChanged = true;
    //   setWindowBeforeUnload();
    // }


    // console.log("carbon", carbonConsumption.transport);
    console.log("lifestyle", lifeStyle);
    console.log("onSite", onSiteData);
    console.log(
      "carbon transport",
      Number(totalCarbon) + transportation.toFixed(2)
    );


  };



  useEffect(() => {
    const execFunc = async () => {
      const data = {
        houseHoldMembers: carbonConsumptions.houseHold,
        publicTransportationMembers: carbonConsumptions.transport,
        income: carbonConsumptions.income,
        houseSize: carbonConsumptions.houseSize,
        airTravel: carbonConsumptions.airTravel,
        meatConsumption: carbonConsumptions.consumeFood,
      };
      props?.userData?.isLoggedIn &&
        (await saveCalculatedFieldsToDB(
          {
            ...data,
            countryCode: countryCode,
            Emissions: s,
          },
          false
        ));
    };
    return async () => {
      if (dataChanged) {
        removeDebounce();
        await execFunc();
        dataChanged = false;
        window.onbeforeunload = null;
      }
    };
  }, []);

  const saveCalculatedFieldsToDB = (payload, showToast = true) =>
    saveCalculatedFields(payload)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          showToast &&
            addToast(res.data.data, {
              appearance: "success",
              autoDismiss: true,
            });
          // props.saveCarbonAPIUpdated(true)
          dataChanged = false;
          window.onbeforeunload = null;
          return { success: true };
        }
        showToast &&
          addToast(res.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        return { success: false };
      })
      .catch((err) => {
        showToast &&
          addToast("Something went wrong. Please try again", {
            appearance: "error",
            autoDismiss: true,
          });
        return { success: false };
      });

  const handleClickedAirport = (field, item) => {
    console.log(item, "businessData");
    setClickedDropDest(false);
    setSearchBusiness(item?.name)
    setBusinessName(item?.name)
    setBusinessCode(item?.businessCode)
  }


  return (
    <>
      <div className="checkout-area space-mb--r130 checkout-width">
        <div className="calculator--container">
          <div
            className="carbon-calculator"

          >
            <div>
              <div>
                <div className="carbon-calculator-content-from calculator--household-info-holder">
                  <div className="mb-40" style={{ marginTop: "20px" }}>
                    <span className="employee-code" style={{ fontWeight: "500" }}>Employer Code:</span>
                    {/* {localStorage.getItem("JoinedBusinessDetails") ? <span style={{ fontWeight: 600 }}>&nbsp;{businessCode}</span> : */}
                    <input
                      type="text"
                      placeholder="Enter Employer Code"
                      class="code--input"
                      value={businessCode}
                      onChange={handleChangeCode}
                      ref={inputRef}
                    />&nbsp;<span style={{ display: businessCode.length === 8 ? "none" : "" }}>(optional)</span><span style={{ display: businessCode.length === 8 ? "" : "none" }}> {validText ? <span style={{ color: "green" }}> <span
                      className="circle-green-icon--header"
                      style={{ fontWeight: "bold" }}
                    >
                      <IoIosCheckmark />
                    </span>&nbsp;Valid Code</span> : <span style={{ color: "red" }}>Invalid Code</span>}</span>
                  </div>
                  <div className="mb-40">
                    <span className="employee-code" style={{ fontWeight: "500" }}>Business Name:</span>
                    {/* {localStorage.getItem("JoinedBusinessDetails") ? <span style={{ fontWeight: 600 }}>&nbsp;{businessName}</span> : */}
                    <input type="text" placeholder="Enter Business Name" class="code--input" value={businessName} onChange={handleChange}
                    />
                  </div>
                  <div
                    className="dropdown-box"
                    style={{
                      display:
                        businessName?.length >
                          2 && clickedDropDest
                          ? ""
                          : "none",
                      maxWidth: "656px",
                      marginTop: "-25px"
                    }}
                  >
                    {allBusiness &&
                      allBusiness.map((item) => {
                        return (
                          <div
                            onClick={() =>
                              handleClickedAirport(
                                "dest",
                                item
                              )
                            }
                            className="airport-names"
                          >
                            {item?.name}
                          </div>
                        );
                      })}
                  </div>

                  <div className="mb-40 life-style-section">
                    <div className="lifestyle--section-holder">
                      {/* <div className="lifeStyle-span">
                        <span>Distance between home and office (one way)</span>
                      </div>
                      <div className="d-flex ">
                        <div className="calculator--radio-button-holder">
                          <ButtonGroup
                            aria-label="house"
                            name="houseSize"
                            className="houseisrent"
                          >
                            <ToggleButton
                              type="radio"
                              // value="high"
                              checked={carbonConsumption.houseSize === "high"}
                              label="High"
                              onClick={() =>
                                handleCalculateCarbonTrans("houseSize", "high")
                              }
                              className={
                                carbonConsumption.houseSize === "high"
                                  ? "active form-control-label"
                                  : "form-control-label"
                              }
                            >
                              Less than 10km
                            </ToggleButton>
                            <ToggleButton
                              type="radio"
                              checked={carbonConsumption.houseSize === "medium"}
                              label="Medium"
                              onClick={() =>
                                handleCalculateCarbonTrans(
                                  "houseSize",
                                  "medium"
                                )
                              }
                              className={
                                carbonConsumption.houseSize === "medium"
                                  ? "active form-control-label"
                                  : "form-control-label"
                              }
                            >
                              10km to 20km
                            </ToggleButton>
                            <ToggleButton
                              type="radio"
                              checked={carbonConsumption.houseSize === "low"}
                              label="Medium"
                              onClick={() =>
                                handleCalculateCarbonTrans("houseSize", "low")
                              }
                              className={
                                carbonConsumption.houseSize === "low"
                                  ? "active form-control-label"
                                  : "form-control-label"
                              }
                            >
                              20km to 30km
                            </ToggleButton>
                            <ToggleButton
                              type="radio"
                              checked={carbonConsumption.houseSize === "more"}
                              label="low"
                              onClick={() =>
                                handleCalculateCarbonTrans("houseSize", "more")
                              }
                              className={
                                carbonConsumption.houseSize === "more"
                                  ? "active form-control-label"
                                  : "form-control-label"
                              }
                            >
                              More than 30km
                            </ToggleButton>
                          </ButtonGroup>
                        </div>
                      </div> */}
                      <span className="d-flex basic-d-flex-cal ">
                        <span style={{ fontSize: "18px", fontWeight: "500" }}>Distance between home and office (one way):</span>
                        <div className="d-flex ">
                          <div className="basic-calculator calculator--radio-button-holder">
                            <ButtonGroup
                              aria-label="house"
                              name="unitScale"
                              className="houseisrent"
                            >
                              <ToggleButton
                                type="radio"
                                checked={unitScale === "KM"}
                                label="unitScale"
                                onClick={() =>
                                  handleCalculateCarbonTrans("unitScale", "KM")
                                }
                                className={
                                  unitScale === "KM"
                                    ? "active form-control-label"
                                    : "form-control-label"
                                }
                              >
                                KM
                              </ToggleButton>
                              <ToggleButton
                                type="radio"
                                checked={unitScale === "Miles"}
                                label="unitScale"
                                onClick={() =>
                                  handleCalculateCarbonTrans("unitScale", "Miles")
                                }
                                className={
                                  unitScale === "Miles"
                                    ? "active form-control-label"
                                    : "form-control-label"
                                }
                              >
                                Miles
                              </ToggleButton>
                            </ButtonGroup>
                          </div>
                        </div>
                      </span>

                      <div className="transport-slider-holder">
                        <p>0</p>
                        <SliderCustom
                          min={0}
                          max={75}
                          initValue={oneWayTravel}
                          onChange={handledistance}
                          item="distance"
                        />
                        <p>75</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-40 work-title-margin">
                    <span className="work-text-title">Number of days per week you work Remote:</span>
                    <div className="transport-slider-holder">
                      <p>1</p>
                      <SliderCustom
                        min={0}
                        max={7}
                        initValue={remoteData}
                        onChange={handleCalculateCarbon}
                        item="remote"
                      />
                      <p>7</p>
                    </div>
                  </div>
                  <div className="mb-40 work-title-margin">
                    <span className="work-text-title">Number of days per week you work onSite:</span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={7 - remoteData}
                        initValue={onSiteData}
                        onChange={handleCalculateCarbon}
                        item="onSite"
                      />

                      <p>
                        {7 - remoteData}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-40 life-style-section">
                  <div className="lifestyle--section-holder">
                    <div className="work-title-margin">
                      <span style={{ color: "#000" }} className="work-text-title">Mode of Transportation</span>
                    </div>
                    <div className="d-flex ">
                      <div className="calculator--radio-button-holder">
                        <ButtonGroup
                          aria-label="house"
                          name="income"
                          className="houseisrent"
                        >
                          <ToggleButton
                            type="radio"
                            checked={transportMode === "car"}
                            label="car"
                            onClick={() =>
                              handleCalculateCarbonTrans("transportMode", "car")
                            }
                            className={
                              transportMode === "car"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Car
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            checked={
                              transportMode === "ev_car"
                            }
                            label="ev_car"
                            onClick={() =>
                              handleCalculateCarbonTrans(
                                "transportMode",
                                "ev_car"
                              )
                            }
                            className={
                              transportMode === "ev_car"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Ev Car
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            checked={
                              transportMode === "twoWheel"
                            }
                            label="two_wheel"
                            onClick={() =>
                              handleCalculateCarbonTrans(
                                "transportMode",
                                "twoWheel"
                              )
                            }
                            className={
                              transportMode === "twoWheel"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            2 wheeler
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            checked={
                              transportMode === "carpooling"
                            }
                            label="carpooling"
                            onClick={() =>
                              handleCalculateCarbonTrans(
                                "transportMode",
                                "carpooling"
                              )
                            }
                            className={
                              transportMode === "four"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Carpooling
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            checked={
                              transportMode === "public"
                            }
                            label="public"
                            onClick={() =>
                              handleCalculateCarbonTrans(
                                "transportMode",
                                "public"
                              )
                            }
                            className={
                              transportMode === "public"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Public Transport
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            checked={
                              transportMode === "bicycle"
                            }
                            label="bycle"
                            onClick={() =>
                              handleCalculateCarbonTrans(
                                "transportMode",
                                "bicycle"
                              )
                            }
                            className={
                              transportMode === "bicycle"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Bicycle/Walk
                          </ToggleButton>
                        </ButtonGroup>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="mb-40">
                  <span style={{ fontWeight: "500" }}>Trips per year:</span>
                  <div className="transport-slider-holder">
                    <p>0</p>
                    <SliderCustom
                      min={0}
                      max={75}
                      initValue={tripsperyear}
                      onChange={handletripsperyear}
                      item="tripsperyear"
                    />
                    <p>75</p>
                  </div>
                </div> */}

                {/* <div className="mb-40 life-style-section">
                  <div className="lifestyle--section-holder">
                    <div className="work-title-margin">
                      <span className="work-text-title">
                        Average per day food, transport and other expenses
                      </span>
                    </div>
                    <div className="d-flex ">
                      <div className="calculator--radio-button-holder">
                        <ButtonGroup
                          aria-label="house"
                          name="userExpense"
                          className="houseisrent"
                        >
                          <ToggleButton
                            type="radio"
                            checked={expenses === "Less than $50"}
                            label="Less than $50"
                            onClick={() =>
                              handleCalculateCarbonTrans("userExpense", "Less than $50")
                            }
                            className={
                              expenses === "Less than $50"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Less than $50
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            checked={expenses === "$51-$100"}
                            label="$51-$100"
                            onClick={() =>
                              handleCalculateCarbonTrans("userExpense", "$51-$100")
                            }
                            className={
                              expenses === "$51-$100"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            $51-$100
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            checked={expenses === "$101-$200"}
                            label="Medium"
                            onClick={() =>
                              handleCalculateCarbonTrans("userExpense", "$101-$200")
                            }
                            className={
                              expenses === "$101-$200"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            $101-$200
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            checked={expenses === "$201-$300"}
                            label="low"
                            onClick={() =>
                              handleCalculateCarbonTrans("userExpense", "$201-$300")
                            }
                            className={
                              expenses === "$201-$300"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            $201-$300
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            checked={expenses === "More than $301"}
                            label="low"
                            onClick={() =>
                              handleCalculateCarbonTrans("userExpense", "More than $301")
                            }
                            className={
                              expenses === "More than $301"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            More than $301
                          </ToggleButton>
                        </ButtonGroup>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="mb-40 life-style-section">
                  <div className="lifestyle--section-holder">
                    <div className="work-title-margin">
                      {/* <span>House Size</span> */}
                      <span className="work-text-title">Office equipment you use in office or home :</span>
                    </div>
                  </div>
                </div>

                <div className="mb-40 life-style-section">
                  <div className="lifestyle--section-holder">
                    <div className="work-title-margin">
                      <span className="work-text-title">Laptop(s):</span>
                    </div>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={7}
                        initValue={laptops}
                        onChange={handleCalculateCarbon}
                        item="laptops"
                      />

                      <p>
                        7
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-40 life-style-section">
                  <div className="lifestyle--section-holder">
                    <div className="work-title-margin">
                      <span className="work-text-title">Desktop Computer(s):</span>
                    </div>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={7}
                        initValue={computers}
                        onChange={handleCalculateCarbon}
                        item="computers"
                      />

                      <p>
                        7
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-40 life-style-section">
                  <div className="lifestyle--section-holder">
                    <div className="work-title-margin">
                      <span className="work-text-title">Mobile Phone(s):</span>
                    </div>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={7}
                        initValue={mobiles}
                        onChange={handleCalculateCarbon}
                        item="mobiles"
                      />

                      <p>
                        7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="carbon-calculator"></div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    circleSliderData: state.circleSliderData,
    userData: state.userData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    resetCircleDataIndex: () => {
      dispatch(resetCircleDataIndex());
    },

    saveCarbonCalculations: (data, dataFunc, apiUpdateFunc) => {
      dispatch(saveCarbonCalculations(data, dataFunc, apiUpdateFunc));
    },
    saveCarbonAPIUpdated: (data) => {
      dispatch(saveCarbonAPIUpdated(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Basic);
