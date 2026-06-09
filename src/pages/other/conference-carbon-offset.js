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
import {
  getAirportsList,
  getBusinessDetailsByCode,
} from "src/apiClient/business";
import axios from "axios";
import ToggleButton from "react-bootstrap/ToggleButton";
import NoSSR from "react-no-ssr";
import SliderCustom from "src/components/calculator/slider";
import { useRouter } from "next/router";
import _debounce, { _newDebounce } from "src/helpers/debounce";
import { saveCalculatedFields } from "src/apiClient/carbon";
import {
  saveEventCalculatedFields,
  getParticularBusinessEvent,
  getEventDataForUser
} from "src/apiClient/business";
import { useToasts } from "react-toast-notifications";
import {
  resetCircleDataIndex,
  saveCarbonAPIUpdated,
  saveCarbonCalculations,
} from "src/redux/actions/carbonCalculatorActions";
import { connect } from "react-redux";
import { me } from "src/apiClient/auth";
import * as cookie from "cookie";
import { returnCorrectImage } from "src/components/helpers/returnCorrectImage";
import airportList from "src/data/airportsList.json";
import { Value } from "sass";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import MobileView from "src/components/ConferenceCarbonOffset/MobileView";


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
let totalCarbons;
let carbonConsumptions;
let dataChanged = false;
let loggedIn = false;
let fetchAPI = true;
let kmsData;
let distanceData;
let distanceEventData;
const { setDebounce, removeDebounce } = _newDebounce();

function ConferenceCarbonOffset(props) {
  console.log(countryCode, "countryCode1");
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
      totalCarbonEmissions: props?.circleSliderData?.totalCarbonEmissions,
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
      transport: pullObject?.publicTransportationMembers || 0,
      income: pullObject?.income || "medium",
      airTravel: pullObject?.airTravel || "medium",
      houseSize: pullObject?.houseSize || "medium",
      consumeFood: pullObject?.meatConsumption || "medium",
      publicTransport: 0,
      isRent: "rent",
    };
    fetchAPI = true;
    return returnObject;
  };

  const { addToast } = useToasts();

  const [carbonConsumption, setCarbonConsumption] = useState({
    // houseHold:
    //   props?.carbonCalculations?.carbonCalculations?.houseHoldMembers ||
    //   props?.circleSliderData?.houseHoldMembers ||
    //   1,
    // transport:
    //   props?.carbonCalculations?.carbonCalculations
    //     ?.publicTransportationMembers ||
    //   props?.circleSliderData?.publicTransportationMembers ||
    //   0,
    // publicTransport: 0,
    // isRent: 'rent',
    // income:
    //   props?.carbonCalculations?.carbonCalculations?.income ||
    //   props?.circleSliderData?.income ||
    //   'medium',
    // airTravel:
    //   props?.carbonCalculations?.carbonCalculations?.airTravel ||
    //   props?.circleSliderData?.airTravel ||
    //   'medium',
    // houseSize:
    //   props?.carbonCalculations?.carbonCalculations?.houseSize ||
    //   props?.circleSliderData?.houseSize ||
    //   'medium',
    // consumeFood:
    //   props?.carbonCalculations?.carbonCalculations?.meatConsumption ||
    //   props?.circleSliderData?.meatConsumption ||
    //   'medium',
    ...returnCarbonConsumptionObject(),
  });

  const [shouldCallAPI, setShouldCallAPI] = useState(false);
  const router = useRouter();
  const [averageCarbon, setAverageCarbon] = useState(0);
  const [selectCountry, setSelectCountry] = useState();
  const [selectCountryRoom, setSelectCountryRoom] = useState();
  const [showCapitalCarbon, setShowCapitalCarbon] = useState();
  const [showCapitalName, setCapitalName] = useState();
  const [countryList, setCountryList] = useState([]);

  const [totalCarbon, setTotalCarbon] = useState("");
  const [storeCountryShortName, setStoreCountryShortName] = useState("");
  const [houseHoldCarbon, setHouseHoldCarbon] = useState("");
  const [privateCarbon, setPrivateCarbon] = useState("");
  const [publicCarbon, setPublicCarbon] = useState("");
  const [userCountry, setUserCountry] = useState({});
  const [countryCodeISO3, setCountryCodeISO3] = useState("");
  const [continueClicked, setContinueClicked] = useState(false);
  const [conferenceName, setConferenceName] = useState("");
  const [conferenceDate, setConferenceDate] = useState("");
  const [conferenceEndDate, setConferenceEndDate] = useState("")
  const [conferenceLocation, setConferenceLocation] = useState("");
  const [conferenceCode, setConferenceCode] = useState(
    localStorage.getItem("conferenceCode") || ""
  );
  const [businessCode, setBusinessCode] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [remoteData, setRemoteData] = useState(2);
  const [onSiteData, setOnSiteData] = useState(3);
  const [transportMode, setTransportMode] = useState("RentalCar");
  const [eventTransportMode, setEventTransportMode] = useState("RentalCar");
  const [expenses, setExpenses] = useState("Less than $50");
  const [validText, setValidText] = useState("");
  const [airportsData, setAirportsData] = useState([]);
  const [airportsDataDest, setAirportsDataDest] = useState([]);
  const [airportsDataTrans1, setAirportsDataTrans1] = useState([]);
  const [airportsDataTrans2, setAirportsDataTrans2] = useState([]);
  const [loadingAirports, setLoadingAirports] = useState(false)
  const [searchAirport, setSearchAirport] = useState("");
  const [searchAirportDest, setSearchAirportDest] = useState("");
  const [searchAirportTrans1, setSearchAirportTrans1] = useState("");
  const [searchAirportTrans2, setSearchAirportTrans2] = useState("");
  const [clickedDrop, setClickedDrop] = useState(false);
  const [clickedDropDest, setClickedDropDest] = useState(false);
  const [clickedDropTrans1, setClickedDropTrans1] = useState(false);
  const [clickedDropTrans2, setClickedDropTrans2] = useState(false);
  const [trans1err, setTrans1Err] = useState("");
  const [trans2err, setTrans2Err] = useState("");
  const [eventType, setEventType] = useState("Conference");
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [airlineOrigin, setAirlineOrigin] = useState("");
  const [airlineDest, setAirlineDest] = useState("");
  const [airlineTrans1, setAirlineTrans1] = useState("");
  const [airlineTrans2, setAirlineTrans2] = useState("");
  const [seatType, setSeatType] = useState("Economy");
  const [distTravel, setDistTravel] = useState("1–25 Km");
  const [distEventTravel, setDistEventTravel] = useState("1–200 Km");
  const [theStay, setTheStay] = useState("Hotel");
  const [originLat, setOriginLat] = useState("");
  const [originLong, setOriginLong] = useState("");
  const [trans1Lat, setTrans1Lat] = useState("");
  const [trans1Long, setTrans1Long] = useState("");
  const [trans2Lat, setTrans2Lat] = useState("");
  const [trans2Long, setTrans2Long] = useState("");
  const [destLat, setDestLat] = useState("");
  const [destLong, setDestLong] = useState("");
  const firstRender = useRef();
  const [TabActive, setTabActive] = useState(false);
  const [activeTab, setActiveTab] = useState("ConferenceInfo");
  const [travelSelection, setTravelSelection] = useState("ByRoad");
  const [exhibitSpace, setExhibitSpace] = useState(50);
  const [peopleNum, setPeopleNum] = useState(10);
  const [peopleByAir, setPeopleByAir] = useState(5);
  const [peopleByRoad, setPeopleByRoad] = useState(3);
  const [eventSelection, setEventSelection] = useState("Attendie");
  const [theEventDetails, setTheEventDetails] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [theValidField, setTheValidField] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("designer");
  const [perAttendieEmission, setPerAttendieEmission] = useState(0)
  const inputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  let conferenceData;

  useEffect(() => {
    console.log("conlength", conferenceCode.length);
    if (conferenceCode.length === 10) {
      getEventDetails();
    } else {
      setValidText(false);
      setConferenceName("");
      setConferenceDate("");
      setConferenceEndDate("");
      setEventType("Conference");
      setTransportMode("RentalCar")
      setEventTransportMode("RentalCar")
      setExpenses("Less than $50")
      setAirportsData([])
      setAirportsDataDest([])
      setAirportsDataTrans1([])
      setAirportsDataTrans2([])
      setSearchAirport("")
      setSearchAirportDest("")
      setSearchAirportTrans1("")
      setSearchAirportTrans2("")
      setClickedDrop(false)
      setClickedDropDest(false)
      setClickedDropTrans1(false)
      setClickedDropTrans2(false)
      setTrans1Err("")
      setTrans2Err("")
      setDepartureDate("")
      setArrivalDate("")
      setSeatType("Economy")
      setDistTravel("1–25 Km");
      setDistEventTravel("1–200 Km")
      setTheStay("Hotel")
      setOriginLat("")
      setOriginLong("")
      setTrans1Lat("")
      setTrans1Long("")
      setTrans2Lat("")
      setTrans2Long("")
      setDestLat("")
      setDestLong("")
      setTabActive(false)
      setActiveTab("ConferenceInfo")
      setTravelSelection("ByRoad")
      setExhibitSpace(50)
      setPeopleNum(10)
      setPeopleByAir(5)
      setPeopleByRoad(3)
      setEventSelection("Attendie")
      setInputValue("")
      setCompanyCode("")
      setCompanyName("")
      setTheValidField(false)
      setSelectedGroup("designer")
    }
  }, [conferenceCode]);

  useEffect(() => {
    if (companyCode?.length === 8) {
      FetchBusinessName();
    } else {
      setCompanyName("");
      //   setDataDisplay(false)
    }
  }, [companyCode]);

  const FetchBusinessName = async () => {
    let getBusinessDetails = await getBusinessDetailsByCode(companyCode);
    if (getBusinessDetails?.data?.success) {
      //   setDataDisplay(true)
      console.log("businessDetails", getBusinessDetails);
      setCompanyName(getBusinessDetails?.data?.data?.name);
      setTheValidField(true);
    } else {
      addToast(getBusinessDetails?.data?.message, {
        appearance: "error",
        autoDismiss: true,
      });
      setTheValidField(false);
    }
  };

  const getEventDetails = async () => {
    let conferenceDetails = await getParticularBusinessEvent(conferenceCode);
    if (conferenceDetails?.data?.data) {
      localStorage.setItem("conferenceCode", conferenceCode)
      console.log("detailsss", conferenceDetails?.data?.data);
      setPerAttendieEmission(conferenceDetails?.data?.data?.carbonCalculations?.per_attendee)
      let fetchUserEvent = await getEventDataForUser(conferenceCode, conferenceDetails?.data?.data?.businessCode)
      if (fetchUserEvent?.data?.data) {
        let eventData = fetchUserEvent?.data?.data
        console.log("eventCalculations", fetchUserEvent?.data?.data)
        let differenceInDays = 1;
        if (eventData?.departureDate?.split("T")[0] && eventData?.returnDate?.split("T")[0]) {
          const start = new Date(eventData?.departureDate?.split("T")[0]);
          const end = new Date(eventData?.returnDate?.split("T")[0]);
          const differenceInTime = end.getTime() - start.getTime();
          differenceInDays = (differenceInTime / (1000 * 3600 * 24)) + 1;
        }
        console.log(eventData?.localTransportationTavelPerDay / differenceInDays, "valueee")
        parseInt(eventData?.localTransportationTavelPerDay) / differenceInDays == 25 ? setDistTravel("1–25 Km") : parseInt(eventData?.localTransportationTavelPerDay) / differenceInDays == 50 ? setDistTravel("26-50 Km") : parseInt(eventData?.localTransportationTavelPerDay) / differenceInDays == 100 ? setDistTravel("51-100 Km") : parseInt(eventData?.localTransportationTavelPerDay) / differenceInDays == 200 ? setDistTravel("101-200 Km") : setDistTravel("Over 201 Km")
        console.log("usertype", eventData?.usertype)
        setUserCountry({ code: eventData?.countryCode })
        eventData?.usertype === "group" ? setEventSelection("Exhibitor") : setEventSelection("Attendie")
        if (eventData?.usertype === "group") {
          setCompanyCode(eventData?.companyCode)
          setExhibitSpace(parseInt(eventData?.exhibitSpaceSize))
          setPeopleNum(eventData?.peopleAttendingCount)
          setSelectedGroup(eventData?.grouptype)
          setPeopleByAir(eventData?.travelByAirCount)
          setPeopleByRoad(eventData?.travelByRoadCount)
          setEventType(eventData?.eventType)
        }
        if (eventData?.travelType === "by-air") {
          setOriginLat(parseFloat(eventData?.originLat))
          setOriginLong(parseFloat(eventData?.originLong))
          setDestLat(parseFloat(eventData?.destLat))
          setDestLong(parseFloat(eventData?.destLong))
          setTrans1Lat(parseFloat(eventData?.trans1Lat))
          setTrans1Long(parseFloat(eventData?.trans1Long))
          setTrans2Lat(parseFloat(eventData?.trans2Lat))
          setTrans2Long(parseFloat(eventData?.trans2Long))
          setSeatType(eventData?.airLineSeatType)
        }
        console.log("savedeventcalc", fetchUserEvent)
        setDepartureDate(eventData?.departureDate?.split("T")[0])
        setArrivalDate(eventData?.returnDate?.split("T")[0])


        // setArrivalDate(eventData?.returnDate?.split("T")[0])
        eventData?.usertype === "group" ? setTravelSelection("") : eventData?.travelType == "by-air" ? setTravelSelection("ByAir") : setTravelSelection("ByRoad")
        setSearchAirport(eventData?.airLineOrigin)
        setSearchAirportDest(eventData?.airLineDestination)
        setSearchAirportTrans1(eventData?.airLineTransfer1)
        setSearchAirportTrans2(eventData?.airLineTransfer2)
        setEventTransportMode(eventData?.roadTransportationType)
        eventData?.distanceCovered == 400 ? setDistEventTravel("1–200 Km") : eventData?.distanceCovered == 700 ? setDistEventTravel("201-350 Km") : eventData?.distanceCovered == 1000 ? setDistEventTravel("351-500 Km") : eventData?.distanceCovered == 1300 ? setDistEventTravel("501-650 Km") : setDistEventTravel("Over 650 Km")
        setTransportMode(eventData?.localTransportationType)

        eventData?.stay == 1 ? setTheStay("Hotel") : eventData?.stay == 2 ? setTheStay("VacationRental") : eventData?.stay == 3 ? setTheStay("Guesthouse") : eventData?.stay == 4 ? setTheStay("Apartment") : eventData?.stay == 5 ? setTheStay("Motel") : setTheStay("Home")
        eventData?.foodCost == 1 ? setExpenses("Less than $50") : eventData?.foodCost == 2 ? setExpenses("$51-$100") : eventData?.foodCost == 3 ? setExpenses("$101-$200") : setExpenses("More than $201")
        setTotalCarbon(eventData?.totalCarbonEmissions)
      } else {
        setDepartureDate(conferenceDetails?.data?.data?.conferanceStartDate?.split("T")[0])
        setArrivalDate(conferenceDetails?.data?.data?.conferanceEndDate?.split("T")[0])
      }
      setConferenceName(conferenceDetails?.data?.data?.conferanceName);
      setConferenceDate(
        conferenceDetails?.data?.data?.conferanceStartDate?.split("T")[0]
      );
      setConferenceEndDate(
        conferenceDetails?.data?.data?.conferanceEndDate?.split("T")[0]
      );
      setValidText(true);
      setEventType(conferenceDetails?.data?.data?.conferanceType);
      setConferenceLocation(conferenceDetails?.data?.data?.location);
    } else {
      setValidText(false);
      setConferenceName("");
      setConferenceDate("");
      setConferenceEndDate("");
      setEventType("Conference");
      setTransportMode("RentalCar")
      setEventTransportMode("RentalCar")
      setExpenses("Less than $50")
      setAirportsData([])
      setAirportsDataDest([])
      setAirportsDataTrans1([])
      setAirportsDataTrans2([])
      setSearchAirport("")
      setSearchAirportDest("")
      setSearchAirportTrans1("")
      setSearchAirportTrans2("")
      setClickedDrop(false)
      setClickedDropDest(false)
      setClickedDropTrans1(false)
      setClickedDropTrans2(false)
      setTrans1Err("")
      setTrans2Err("")
      setDepartureDate("")
      setArrivalDate("")
      setSeatType("Economy")
      setDistTravel("1–25 Km");
      setDistEventTravel("1–200 Km")
      setTheStay("Hotel")
      setOriginLat("")
      setOriginLong("")
      setTrans1Lat("")
      setTrans1Long("")
      setTrans2Lat("")
      setTrans2Long("")
      setDestLat("")
      setDestLong("")
      setTabActive(false)
      setActiveTab("ConferenceInfo")
      setTravelSelection("ByRoad")
      setExhibitSpace(50)
      setPeopleNum(10)
      setPeopleByAir(5)
      setPeopleByRoad(3)
      setEventSelection("Attendie")
      setInputValue("")
      setCompanyCode("")
      setCompanyName("")
      setTheValidField(false)
      setSelectedGroup("designer")
    }
  };

  useEffect(() => {
    handleDisplayCarbonData();
    // handleCalculateCarbonTrans()
  }, [
    departureDate,
    arrivalDate,
    seatType,
    transportMode,
    eventTransportMode,
    distTravel,
    distEventTravel,
    theStay,
    expenses,
    selectCountryRoom,
    originLat,
    originLong,
    destLat,
    destLong,
    trans1Lat,
    trans1Long,
    trans2Lat,
    trans2Long,
    travelSelection,
    exhibitSpace,
    peopleNum,
    peopleByAir,
    peopleByRoad,
    eventSelection,
  ]);

  const returnMappedCarbonData = () => {
    return {
      houseHoldMembers: carbonConsumption.houseHold,
      publicTransportationMembers: carbonConsumption.transport,
      income: carbonConsumption.income,
      houseSize: carbonConsumption.houseSize,
      airTravel: carbonConsumption.airTravel,
      meatConsumption: carbonConsumption.consumeFood,
      totalCarbonEmissions: totalCarbon,
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

  const handleChangeCode = (e) => {
    if (e.target.value.length <= 10) {
      setConferenceCode(e.target.value);
    }
    setInputValue(e.target.value);
    if (e.target.value.length >= 10) {
      inputRef.current.blur(); // Unfocus the input field
    }
  };

  // useEffect(() => {
  //     handleShowAverageCarbonUsage();
  // }, [
  //     carbonConsumption?.houseHold,
  //     carbonConsumption?.transport,
  //     carbonConsumption?.publicTransport,
  //     carbonConsumption?.income,
  //     carbonConsumption?.airTravel,
  //     carbonConsumption?.consumeFood,
  //     carbonConsumption?.houseSize,
  //     selectCountry,
  // ]);

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

  useEffect(() => {
    console.log("activeTab ", activeTab);
  }, [activeTab]);

  // const saveValuesToRedux = useCallback(
  //   _debounce((carbonData, saveCalculatedFieldsToDB, saveCarbonAPIUpdated) => {

  //   }, 10),
  //   []
  // )

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
    totalCarbons = totalCarbon;
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
    // saveCalculatedFieldsToDB({
    //   houseHoldMembers: carbonConsumption.houseHold,
    //   publicTransportationMembers: carbonConsumption.transport,
    //   income: carbonConsumption.income,
    //   houseSize: carbonConsumption.houseSize,
    //   airTravel: carbonConsumption.airTravel,
    //   meatConsumption: carbonConsumption.consumeFood,
    //   totalCarbonEmissions: totalCarbon,
    //   countryCode: countryCodeISO3 || storeCountryShortName,
    // });
  }, [totalCarbon, countryCodeISO3]);


  const handleContinue = (e = "") => {
    // setContinueClicked(true);
    let eventFields;
    const carbonData = returnMappedCarbonData();
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"));
    let businessCodeField = BusinessDetails?.businessCode;
    if (travelSelection === "ByAir") {
      if (!searchAirport) {
        return addToast("Origin Airport Cannot be empty", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      if (!searchAirportDest) {
        return addToast("Destination Airport Cannot be empty", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
    if (props?.userData?.isLoggedIn) {
      // if (eventSelection === "Attendie") {
      eventFields = {
        usertype: eventSelection === "Attendie" ? "individual" : "group",
        conferanceCode: conferenceCode,
        businessCode: businessCodeField,
        countryCode: countryCode,
        eventType: eventType,
        departureDate: departureDate,
        returnDate: arrivalDate,
        travelType: travelSelection === "ByAir" ? "by-air" : "by-road",
        distanceCovered:
          travelSelection === "ByAir"
            ? parseFloat(kmsData?.toFixed(2))
            : distanceEventData,
        roadTransportationType: eventTransportMode,
        airLineSeatType: travelSelection === "ByAir" ? seatType : "",
        airLineOrigin: travelSelection === "ByAir" ? searchAirport : "",
        airLineDestination: travelSelection === "ByAir" ? searchAirportDest : "",
        airLineTransfer1: travelSelection === "ByAir" ? searchAirportTrans1 : "",
        airLineTransfer2: travelSelection === "ByAir" ? searchAirportTrans2 : "",
        originLat: travelSelection === "ByAir" ? originLat : "",
        originLong: travelSelection === "ByAir" ? originLong : "",
        destLat: travelSelection === "ByAir" ? destLat : "",
        destLong: travelSelection === "ByAir" ? destLong : "",
        trans1Lat: travelSelection === "ByAir" && airlineTrans1 ? trans1Lat : "",
        trans1Long: travelSelection === "ByAir" && airlineTrans1 ? trans1Long : "",
        trans2Lat: travelSelection === "ByAir" && airlineTrans2 ? trans2Lat : "",
        trans2Long: travelSelection === "ByAir" && airlineTrans2 ? trans2Long : "",
        localTransportationType: transportMode,
        foodCost:
          expenses == "Less than $50"
            ? 1
            : expenses == "$51-$100"
              ? 2
              : expenses == "$101-$200"
                ? 3
                : 4,
        stay:
          theStay == "Hotel"
            ? 1
            : theStay == "VacationRental"
              ? 2
              : theStay == "Guesthouse"
                ? 3
                : theStay == "Apartment"
                  ? 4
                  : theStay == "Motel" ? 5 : 6,
        localTransportationTavelPerDay: distanceData?.toString(),
        totalCarbonEmissions: totalCarbon,
        email: localStorage.getItem("email"),
      };
      console.log(eventSelection, "selectedEvent")
      if (eventSelection === "Exhibitor") {
        eventFields = {
          ...eventFields,
          companyName: companyName,
          companyCode: companyCode,
          exhibitSpaceSize: exhibitSpace,
          grouptype: selectedGroup,
          peopleAttendingCount: peopleNum,
          travelByAirCount: peopleByAir,
          travelByRoadCount: peopleByRoad
        }
      }
      // } else {
      //   eventFields = {
      //     conferanceCode: conferenceCode,
      //     businessCode: businessCodeField,
      //     companyCode: companyCode,
      //     companyName: companyName,
      //     countryCode: countryCode,
      //     eventType: eventType,
      //     departureDate: departureDate,
      //     returnDate: arrivalDate,
      //     exhibitorSpaceSize: exhibitSpace,
      //     peopleAttendingCount: peopleNum,
      //     peopleTravelByAirCount: peopleByAir,
      //     peopleTravelByRoadCount: peopleByRoad,
      //     localTransportationType: transportMode,
      //     foodCost:
      //       expenses == "Less than $50"
      //         ? 1
      //         : expenses == "$51-$100"
      //           ? 2
      //           : expenses == "$51-$100"
      //             ? 3
      //             : 4,
      //     stay:
      //       theStay == "Hotel"
      //         ? 1
      //         : theStay == "VacationRental"
      //           ? 2
      //           : theStay == "Guesthouse"
      //             ? 3
      //             : theStay == "Apartment"
      //               ? 4
      //               : 5,
      //     localTransportationTavelPerDay: distanceData?.toString(),
      //     totalCarbonEmissions: totalCarbon,
      //     email: localStorage.getItem("email"),
      //   };
      // }
      if (!conferenceCode) {
        setContinueClicked(false);
        return addToast("Please enter a valid conference code", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      console.log(eventFields, "eventFields");
      if (localStorage.getItem("email")) {
        saveCalculatedFieldsToDB(eventFields);
      }
    }
    const currentTotalCarbon = Math.ceil(totalCarbon);
    if (props.circleSliderData?.dataIndex > currentTotalCarbon) {
      props.resetCircleDataIndex();
    }
    localStorage.setItem("carbonroute", "eventcarbonoffset");
    router.push({
      pathname: "/circular",
      query: { tons: currentTotalCarbon },
    });
  };

  const handleCalculateCarbon = (name, value) => {
    setShouldCallAPI(true);
    if (
      (name == "houseHold" && value == 0) ||
      (name == "transport" && value == -1)
    ) {
      return;
    }



    const getEventDetails = async () => {
      let conferenceDetails = await getParticularBusinessEvent(conferenceCode)
      if (conferenceDetails?.data?.data) {
        console.log("detailsss", conferenceDetails?.data?.data)
        setConferenceName(conferenceDetails?.data?.data?.conferanceName)
        localStorage.setItem("conferenceCode", conferenceCode)
        setConferenceDate(conferenceDetails?.data?.data?.conferanceStartDate?.split("T")[0])
        setEventType(conferenceDetails?.data?.data?.conferanceType);
        setConferenceLocation(conferenceDetails?.data?.data?.location);
        setValidText(true)
      } else {
        setValidText(false)
        setConferenceName("")
        setConferenceDate("")
      }
    }
    setCarbonConsumption((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePeople = (item, value) => {
    if (item === "peopleData") {
      // if (peopleByAir + peopleByRoad > value) {
      //     setPeopleByAir(1)
      //     setPeopleByRoad(1)
      // }
      setPeopleNum(value);
    }
    if (item === "airData") {
      if (value + peopleByRoad > peopleNum) {
        return addToast(`Cannot exceed ${peopleNum}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setPeopleByAir(value);
    }
    if (item === "roadData") {
      if (value + peopleByAir > peopleNum) {
        return addToast(`Cannot exceed ${peopleNum}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setPeopleByRoad(value);
    }
  };

  const handleClickedAirport = (field, item) => {
    console.log(item, "airportData");
    if (field == "origin") {
      setClickedDrop(false);
      setOriginLat(item?.lat);
      setOriginLong(item?.lon);
      console.log(item?.lat, item?.lon, "latlong");
      if (item?.iata) {
        setSearchAirport(item?.iata + " - " + item?.name);
      } else {
        setSearchAirport(item?.name);
      }
    }
    if (field == "dest") {
      setClickedDropDest(false);
      setDestLat(item?.lat);
      setDestLong(item?.lon);
      if (item?.iata) {
        setSearchAirportDest(item?.iata + " - " + item?.name);
      } else {
        setSearchAirportDest(item?.name);
      }
    }
    if (field == "trans1") {
      setClickedDropTrans1(false);
      setTrans1Lat(item?.lat);
      setTrans1Long(item?.lon);
      if (item?.iata) {
        setSearchAirportTrans1(item?.iata + " - " + item?.name);
      } else {
        setSearchAirportTrans1(item?.name);
      }
    }
    if (field == "trans2") {
      setClickedDropTrans2(false);
      setTrans2Lat(item?.lat);
      setTrans2Long(item?.lon);
      if (item?.iata) {
        setSearchAirportTrans2(item?.iata + " - " + item?.name);
      } else {
        setSearchAirportTrans2(item?.name);
      }
    }
  };

  function formatDate(date) {
    if (!date) return ""; // Handle empty date
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return [month, day, year].join("-");
  }

  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; // Radius of the earth in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c; // Distance in kilometers

    return distance;
  };

  const handleCalculateCarbonTrans = (item, value) => {
    console.log(item, "itemmm")
    let transportData;
    let DistanceTravel;
    let stayData = 16;
    let expenseData;
    let differenceInDays;
    if (item === "eventSelection") {
      console.log(value, "eventSelection");
      if (value !== "Attendie") {
        setTravelSelection("");
      } else {
        setTravelSelection("ByRoad");
      }
      setEventSelection(value);
    }
    if (item === "eventType") {
      setEventType(value);
    }
    if (item === "travelSelection") {
      setTravelSelection(value);
      if (value == "ByRoad" && !eventTransportMode) {
        setEventTransportMode("RentalCar")
      }
    }
    if (item === "seatType") {
      setSeatType(value);
    }
    if (item === "transportMode") {
      setTransportMode(value);
    }
    if (item === "eventTransportMode") {
      setEventTransportMode(value);
    }
    if (item === "distTravel") {
      setDistTravel(value);
      DistanceTravel =
        value == "1–25 Km"
          ? 25
          : "26-50 Km"
            ? 50
            : "51-100 Km"
              ? 100
              : "101-200 Km"
                ? 200
                : 201;
    }
    if (item === "distEventTravel") {
      setDistEventTravel(value);
      // DistanceTravel = value == "1–25 Km" ? 25 : "26-50 Km" ? 50 : "51-100 Km" ? 100 : "101-200 Km" ? 200 : 201
    }
    if (item === "theStay") {
      setTheStay(value);
    }
    if (item === "userExpense") {
      setExpenses(value);
      expenseData =
        value == "Less than $50" ? 1 : "$51-$100" ? 2 : "$101-$200" ? 4 : 6;
    }
    if (item === "departureDate") {
      const formattedDate = formatDate(value);
      setDepartureDate(value);
      console.log(item, formattedDate, "date");
    }
    if (item === "arrivalDate") {
      const formattedDate = formatDate(value);
      setArrivalDate(value);
      console.log(item, formattedDate, "date");
    }
    if (item === "exhibitSpace") {
      setExhibitSpace(value);
    }
    if (departureDate && arrivalDate) {
      const start = new Date(departureDate);
      const end = new Date(arrivalDate);
      const differenceInTime = end.getTime() - start.getTime();
      differenceInDays = (differenceInTime / (1000 * 3600 * 24)) + 1;
    }
    if (item === "selectedGroup") {
      setSelectedGroup(value);
    }
    // console.log("differenceInDays", differenceInDays, departureDate, arrivalDate)
    // let carbonCalculation = differenceInDays * transportData * DistanceTravel
    // console.log("carbonCalculation", carbonCalculation, differenceInDays, transportData, DistanceTravel)
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

  const handleDisplayCarbonData = () => {
    let differenceInDays = 1;
    if (departureDate && arrivalDate && departureDate !== arrivalDate) {
      const start = new Date(departureDate);
      const end = new Date(arrivalDate);
      const differenceInTime = end.getTime() - start.getTime();
      differenceInDays = (differenceInTime / (1000 * 3600 * 24)) + 1;
    }
    let transportData =
      transportMode == "RentalCar"
        ? 0.17
        : transportMode == "Cars"
          ? 0.17
          : transportMode == "Taxi"
            ? 0.22
            : transportMode == "EV"
              ? 0.047
              : transportMode == "RideShare"
                ? 0.2
                : transportMode == "PublicTransport"
                  ? 0.097
                  : 0.15;

    let transportEventData =
      eventTransportMode == "RentalCar"
        ? 0.17
        : eventTransportMode == "Cars"
          ? 0.17
          : eventTransportMode == "Taxi"
            ? 0.22
            : eventTransportMode == "EV"
              ? 0.047
              : eventTransportMode == "RideShare"
                ? 0.2
                : eventTransportMode == "PublicTransport"
                  ? 0.097
                  : 0.15;

    distanceData =
      (distTravel == "1–25 Km"
        ? 25
        : distTravel == "26-50 Km"
          ? 50
          : distTravel == "51-100 Km"
            ? 100
            : distTravel == "101-200 Km"
              ? 200
              : 500) * differenceInDays;

    distanceEventData =
      (distEventTravel == "1–200 Km"
        ? 200
        : distEventTravel == "201-350 Km"
          ? 350
          : distEventTravel == "351-500 Km"
            ? 500
            : distEventTravel == "501-650 Km"
              ? 650
              : 800) * 2;

    let expenseData =
      expenses == "Less than $50"
        ? 1
        : expenses == "$51-$100"
          ? 2
          : expenses == "$101-$200"
            ? 4
            : 6;

    let stayDataFields =
      theStay == "Hotel"
        ? 1.15
        : theStay == "VacationRental"
          ? 1.1
          : theStay == "Guesthouse"
            ? 1.05
            : theStay == "Apartment"
              ? 1
              : theStay == "Motel"
                ? 1
                : 0.95

    let exhibitPlaceEmission = exhibitSpace * 0.01;
    let exhibitAirEmission = peopleByAir * peopleNum * 1500 * 0.077;
    let exhibitRoadEmission =
      peopleByRoad * peopleNum * 200 * 2 * 0.2 * differenceInDays;

    // console.log("conference123", transportData * distanceData  , selectCountryRoom * differenceInDays , differenceInDays * 15 * expenseData)
    let airlineCarbonData = 0;
    if (
      (originLat,
        originLong,
        destLat,
        destLong,
        trans1Lat,
        trans1Long,
        trans2Lat,
        trans2Long)
    ) {
      let T1 = calculateDistance(originLat, originLong, trans1Lat, trans1Long);
      let T2 = calculateDistance(trans1Lat, trans1Lat, trans2Lat, trans2Long);
      let T3 = calculateDistance(trans2Lat, trans2Lat, destLat, destLong);
      kmsData = parseFloat(T1) + parseFloat(T2) + parseFloat(T3);
    } else if (
      (originLat, originLong, destLat, destLong, trans1Lat, trans1Long)
    ) {
      let T1 = calculateDistance(originLat, originLong, trans1Lat, trans1Long);
      let T2 = calculateDistance(trans1Lat, trans1Lat, destLat, destLong);
      kmsData = parseFloat(T1) + parseFloat(T2);
    } else if ((originLat, originLong, destLat, destLong)) {
      kmsData = calculateDistance(originLat, originLong, destLat, destLong);
    } else {
      kmsData = 0;
    }

    if (kmsData < 500) {
      airlineCarbonData = kmsData * 0.145;
    } else if (kmsData > 500 && kmsData < 4000) {
      airlineCarbonData = kmsData * 0.077;
    } else {
      airlineCarbonData = kmsData * 0.065;
    }

    console.log(seatType, "Seat");
    if (seatType === "Economy") {
      airlineCarbonData = airlineCarbonData * 1;
    } else if (seatType === "Premium") {
      airlineCarbonData = airlineCarbonData * 2.5;
    } else {
      airlineCarbonData = airlineCarbonData * 4;
    }
    if (travelSelection === "ByAir") {
      conferenceData =
        transportData * distanceData +
        selectCountryRoom * differenceInDays +
        differenceInDays * 15 * expenseData +
        airlineCarbonData;
    } else if (travelSelection === "ByRoad") {
      conferenceData =
        transportData * distanceData +
        selectCountryRoom * differenceInDays +
        differenceInDays * 15 * expenseData +
        transportEventData * distanceEventData;
    } else {
      conferenceData =
        transportData * distanceData +
        selectCountryRoom * differenceInDays +
        differenceInDays * 15 * expenseData +
        exhibitPlaceEmission +
        exhibitAirEmission +
        exhibitRoadEmission;
    }
    console.log("kms", parseFloat(kmsData?.toFixed(2)));
    console.log(differenceInDays, "differenceInDays");
    console.log(
      "conference123",
      transportData * distanceData,
      selectCountryRoom * differenceInDays,
      differenceInDays * 15 * expenseData,
      airlineCarbonData
    );
    setTotalCarbon(((conferenceData / 1000) * stayDataFields).toFixed(2));
  };

  const handleAirport = async (event) => {
    setSearchAirport(event.target.value);
    if (event.target.value.length >= 3) {
      setClickedDrop(true);
      // Filter data based on search term
      let airportsData = await getAirportsList();
      // let airportsData
      if (airportsData) {
        setLoadingAirports(false)
      } else {
        setLoadingAirports(true)
      }
      // const results = airportsData.data.filter(
      //   (item) =>
      //     item?.iata
      //       ?.toLowerCase()
      //       .includes(event.target.value.toLowerCase()) ||
      //     item.name.toLowerCase().includes(event.target.value.toLowerCase())
      // );
      const results = airportsData?.data?.filter(
        (item) =>
          item?.iata?.toLowerCase().includes(event.target.value.toLowerCase()) ||
          item.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
        .sort((a, b) => {
          const searchValue = event.target.value.toLowerCase();
          const aMatchesIATA = a?.iata?.toLowerCase().includes(searchValue);
          const bMatchesIATA = b?.iata?.toLowerCase().includes(searchValue);

          // Prioritize IATA matches first
          if (aMatchesIATA && !bMatchesIATA) return -1;
          if (!aMatchesIATA && bMatchesIATA) return 1;
          return 0; // Maintain relative order otherwise
        });
      setAirportsData(results);
    } else {
      setAirportsData([]);
      setClickedDrop(false);
    }
  };

  const handleAirportDest = async (event) => {
    setSearchAirportDest(event.target.value);
    if (event.target.value.length >= 3) {
      setClickedDropDest(true);
      // Filter data based on search term
      let airportsData = await getAirportsList();
      if (airportsData) {
        setLoadingAirports(false)
      } else {
        setLoadingAirports(true)
      }
      // const results = airportsData.data.filter(
      //   (item) =>
      //     item?.iata
      //       ?.toLowerCase()
      //       .includes(event.target.value.toLowerCase()) ||
      //     item.name.toLowerCase().includes(event.target.value.toLowerCase())
      // );
      const results = airportsData?.data?.filter(
        (item) =>
          item?.iata?.toLowerCase().includes(event.target.value.toLowerCase()) ||
          item.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
        .sort((a, b) => {
          const searchValue = event.target.value.toLowerCase();
          const aMatchesIATA = a?.iata?.toLowerCase().includes(searchValue);
          const bMatchesIATA = b?.iata?.toLowerCase().includes(searchValue);

          // Prioritize IATA matches first
          if (aMatchesIATA && !bMatchesIATA) return -1;
          if (!aMatchesIATA && bMatchesIATA) return 1;
          return 0; // Maintain relative order otherwise
        });
      setAirportsDataDest(results);
    } else {
      setAirportsDataDest([]);
      setClickedDropDest(false);
    }
  };

  const handleAirportTrans1 = async (event) => {
    if (!searchAirport) {
      setTrans1Err("please select source airport");
      setSearchAirportTrans1("");
      setSearchAirportTrans2("");
      return;
    }
    if (!searchAirportDest) {
      setTrans1Err("please select destination airport");
      setSearchAirportTrans1("");
      setSearchAirportTrans2("");
      return;
    }
    if (!searchAirportTrans1) {
      setSearchAirportTrans2("");
    }
    setSearchAirportTrans1(event.target.value);
    if (event.target.value.length >= 3) {
      setClickedDropTrans1(true);
      // Filter data based on search term
      let airportsData = await getAirportsList();
      if (airportsData) {
        setLoadingAirports(false)
      } else {
        setLoadingAirports(true)
      }
      // const results = airportsData.data.filter(
      //   (item) =>
      //     item?.iata
      //       ?.toLowerCase()
      //       .includes(event.target.value.toLowerCase()) ||
      //     item.name.toLowerCase().includes(event.target.value.toLowerCase())
      // );
      const results = airportsData?.data?.filter(
        (item) =>
          item?.iata?.toLowerCase().includes(event.target.value.toLowerCase()) ||
          item.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
        .sort((a, b) => {
          const searchValue = event.target.value.toLowerCase();
          const aMatchesIATA = a?.iata?.toLowerCase().includes(searchValue);
          const bMatchesIATA = b?.iata?.toLowerCase().includes(searchValue);

          // Prioritize IATA matches first
          if (aMatchesIATA && !bMatchesIATA) return -1;
          if (!aMatchesIATA && bMatchesIATA) return 1;
          return 0; // Maintain relative order otherwise
        });
      setAirportsDataTrans1(results);
    } else {
      setAirportsDataTrans1([]);
      setClickedDropTrans1(false);
      setTrans1Err("");
    }
  };

  const handleAirportTrans2 = async (event) => {
    if (!searchAirport) {
      setTrans2Err("please select source airport");
      setSearchAirportTrans1("");
      setSearchAirportTrans2("");
      return;
    }
    if (!searchAirportDest) {
      setTrans2Err("please select destination airport");
      setSearchAirportTrans1("");
      setSearchAirportTrans2("");
      return;
    }
    if (!searchAirportTrans1) {
      setTrans2Err("please select transfer airport 1");
      setSearchAirportTrans2("");
      return;
    }
    setSearchAirportTrans2(event.target.value);
    if (event.target.value.length >= 3) {
      setClickedDropTrans2(true);
      // Filter data based on search term
      let airportsData = await getAirportsList();
      if (airportsData) {
        setLoadingAirports(false)
      } else {
        setLoadingAirports(true)
      }
      // const results = airportsData.data.filter(
      //   (item) =>
      //     item?.iata
      //       ?.toLowerCase()
      //       .includes(event.target.value.toLowerCase()) ||
      //     item.name.toLowerCase().includes(event.target.value.toLowerCase())
      // );
      const results = airportsData?.data?.filter(
        (item) =>
          item?.iata?.toLowerCase().includes(event.target.value.toLowerCase()) ||
          item.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
        .sort((a, b) => {
          const searchValue = event.target.value.toLowerCase();
          const aMatchesIATA = a?.iata?.toLowerCase().includes(searchValue);
          const bMatchesIATA = b?.iata?.toLowerCase().includes(searchValue);

          // Prioritize IATA matches first
          if (aMatchesIATA && !bMatchesIATA) return -1;
          if (!aMatchesIATA && bMatchesIATA) return 1;
          return 0; // Maintain relative order otherwise
        });
      setAirportsDataTrans2(results);
    } else {
      setAirportsDataTrans2([]);
      setClickedDropTrans2(false);
      setTrans2Err("");
    }
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
    setSelectCountryRoom(
      Number(countryShortName.carbonCountryRoomStayPerCapita)
    );

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
    setSelectCountryRoom(
      Number(countryShortName.carbonCountryRoomStayPerCapita)
    );

    setShowCapitalCarbon(Number(countryShortName.carbonCountryPerCapita));
    setCapitalName(countryShortName.entity);
  };

  // const handleShowAverageCarbonUsage = () => {
  //     const lifeStyle =
  //         (carbonConsumption.income == "high"
  //             ? 1.15
  //             : carbonConsumption.income == "low"
  //                 ? 0.85
  //                 : carbonConsumption.income == "medium"
  //                     ? 1.0
  //                     : 0) *
  //         (carbonConsumption.airTravel == "high"
  //             ? 1.15
  //             : carbonConsumption.airTravel == "low"
  //                 ? 0.85
  //                 : carbonConsumption.airTravel == "medium"
  //                     ? 1.0
  //                     : 0) *
  //         (carbonConsumption.houseSize == "high"
  //             ? 1.15
  //             : carbonConsumption.houseSize == "low"
  //                 ? 0.85
  //                 : carbonConsumption.houseSize == "medium"
  //                     ? 1.0
  //                     : 0) *
  //         (carbonConsumption.consumeFood == "high"
  //             ? 1.15
  //             : carbonConsumption.consumeFood == "low"
  //                 ? 0.85
  //                 : carbonConsumption.consumeFood == "medium"
  //                     ? 1.0
  //                     : 0);
  //     const transportation =
  //         (Number(carbonConsumption.houseHold) -
  //             0.15 * Number(carbonConsumption.transport)) *
  //         Number(selectCountry) *
  //         lifeStyle;

  //     const calc = transportation;
  //     if (
  //         totalCarbon &&
  //         totalCarbon != calc &&
  //         !firstRender.current &&
  //         selectCountry
  //     ) {
  //         dataChanged = true;
  //         setWindowBeforeUnload();
  //     }

  //     if (selectCountry && firstRender.current) firstRender.current = false;

  //     calc && setTotalCarbon(calc?.toFixed(2));

  //     setAverageCarbon((calc / carbonConsumption.houseHold)?.toFixed(2));
  //     setHouseHoldCarbon(
  //         (selectCountry * carbonConsumption.houseHold).toFixed(2)
  //     );
  //     setPrivateCarbon(
  //         (selectCountry * carbonConsumption.privateTransport * 0.1).toFixed(2)
  //     );
  //     setPublicCarbon(
  //         (selectCountry * carbonConsumption.publicTransport * 0.1).toFixed(2)
  //     );
  // };

  const iOSBoxShadow =
    "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

  const theme = createTheme({
    status: {
      danger: "#e53e3e",
    },
    palette: {
      primary: {
        main: "#0971f1",
        darker: "#053e85",
      },
      neutral: {
        main: "#64748B",
        contrastText: "#fff",
      },
    },
  });
  // const saveCalculatedFieldsToDB = useCallback(
  //   _debounce((payload) => {
  //     saveCalculatedFields(payload)
  //       .then((res) => {
  //         if (res.status === 200 || res.status === 201)
  //           return addToast(res.data.data, {
  //             appearance: 'success',
  //             autoDismiss: true,
  //           });
  //         addToast(res.data.message, {
  //           appearance: 'error',
  //           autoDismiss: true,
  //         });
  //       })
  //       .catch((err) => {
  //         addToast('Something went wrong. Please try again', {
  //           appearance: 'error',
  //           autoDismiss: true,
  //         });
  //       });
  //   }),
  //   []
  // );

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
            totalCarbonEmissions: totalCarbons,
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
    saveEventCalculatedFields(payload, eventSelection)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          console.log(
            res.data,
            "eventDetail"
          );
          localStorage.setItem(
            "userEventId",
            res.data.data._id
          );
          showToast &&
            addToast("Event Carbon Footprint saved successfully", {
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
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="CO2 Footprint Calculator (Event)"
        className="bg--6"
      // backgroundImage={
      //   '/assets/images/backgrounds/' +
      //   returnCorrectImage('breadcrumb-bg-6', window.innerWidth)
      // }
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>EVENT CALCULATOR</li>
        </ul>
      </BreadcrumbOne>
      <NoSSR>
      {isMobile ? (
        <MobileView
          countryList={countryList}
          userCountry={userCountry}
          showCapitalName={showCapitalName}
          showCapitalCarbon={showCapitalCarbon}
          countryCodeISO3={countryCodeISO3}
          handleSelectCountry={handleSelectCountry}
          eventSelection={eventSelection}
          conferenceCode={conferenceCode}
          validText={validText}
          eventType={eventType}
          conferenceName={conferenceName}
          conferenceDate={conferenceDate}
          conferenceEndDate={conferenceEndDate}
          conferenceLocation={conferenceLocation}
          handleChangeCode={handleChangeCode}
          inputRef={inputRef}
          setConferenceName={setConferenceName}
          setConferenceDate={setConferenceDate}
          setConferenceEndDate={setConferenceEndDate}
          departureDate={departureDate}
          arrivalDate={arrivalDate}
          travelSelection={travelSelection}
          seatType={seatType}
          eventTransportMode={eventTransportMode}
          distEventTravel={distEventTravel}
          searchAirport={searchAirport}
          searchAirportDest={searchAirportDest}
          searchAirportTrans1={searchAirportTrans1}
          searchAirportTrans2={searchAirportTrans2}
          airportsData={airportsData}
          airportsDataDest={airportsDataDest}
          airportsDataTrans1={airportsDataTrans1}
          airportsDataTrans2={airportsDataTrans2}
          clickedDrop={clickedDrop}
          clickedDropDest={clickedDropDest}
          clickedDropTrans1={clickedDropTrans1}
          clickedDropTrans2={clickedDropTrans2}
          handleAirport={handleAirport}
          handleAirportDest={handleAirportDest}
          handleAirportTrans1={handleAirportTrans1}
          handleAirportTrans2={handleAirportTrans2}
          handleClickedAirport={handleClickedAirport}
          loadingAirports={loadingAirports}
          trans1err={trans1err}
          trans2err={trans2err}
          transportMode={transportMode}
          distTravel={distTravel}
          theStay={theStay}
          expenses={expenses}
          companyCode={companyCode}
          companyName={companyName}
          theValidField={theValidField}
          exhibitSpace={exhibitSpace}
          peopleNum={peopleNum}
          peopleByAir={peopleByAir}
          peopleByRoad={peopleByRoad}
          selectedGroup={selectedGroup}
          handlePeople={handlePeople}
          setCompanyCode={setCompanyCode}
          handleCalculateCarbonTrans={handleCalculateCarbonTrans}
          totalCarbon={totalCarbon}
          perAttendieEmission={perAttendieEmission}
          handleContinue={handleContinue}
          continueClicked={continueClicked}
          setActiveTab={setActiveTab}
        />
      ) : (
      <>
      <div className="checkout-area space-mb--r130">
        <div className="calculator--container">
          <div className="carbon-calculator">
            <div className="carbon-calculator-content">
              <div className="carbon-calculator-content-from">
                <div className="carbon-calculator-content-from calculator--household-info-holder">
                  <div style={{ marginBottom: "30px", paddingTop: "20px" }}>
                    <div className="calculator--title-holder">
                      <span
                        style={{
                          color: "#333333",
                        }}
                      >
                        Event Calculator
                      </span>
                    </div>
                  </div>
                  <div className="country-holder">
                    <div className="filter-section">
                      <select
                        className="w-100 offset--input-holder"
                        onChange={(e) => handleSelectCountry(e)}
                      >
                        <option hidden>
                          {countryList.some(
                            (item) =>
                              item.entity === userCountry.name ||
                              showCapitalName
                          )
                            ? `${userCountry.name || showCapitalName
                            } | ${Number(
                              Number(showCapitalCarbon).toFixed(2)
                            )?.toFixed(2)}`
                            : Location}
                        </option>
                        {countryList &&
                          countryList.map((item, index) => {
                            return (
                              <>
                                <option key={index} value={item.countryCode}>
                                  {item.entity} |{" "}
                                  {Number(
                                    item?.carbonCountryPerCapita
                                  )?.toFixed(2)}
                                </option>
                              </>
                            );
                          })}
                      </select>
                      <div className="filter-section-image">
                        <span class={`fi fi-${countryCodeISO3}`}></span>{" "}
                        {/* <span class="fi fi-gr fis"></span> */}
                        {/* <Image
                          src={calculatorOneIMG}
                          layout="fixed"
                          width={12}
                          height={17}
                          style={{ position: "absolute" }}
                        /> */}
                      </div>
                      <div className={"calculator--svg-arrow"}>
                        <svg
                          width="12"
                          height="7"
                          viewBox="0 0 12 7"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 7L3.41715e-07 9.53989e-08L12 -9.53674e-07L6 7Z"
                            fill="#333333"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="metricton-per-person">
                      Metric tons of carbon emission per person
                    </p>
                  </div>
                  <div className="life-style-section mb-40">
                    <div className="lifestyle--section-holder">
                      <div className="lifeStyle-span">
                        <span>Are you an Individual or Business</span>
                      </div>
                      <div className="d-flex ">
                        <div className="calculator--radio-button-holder">
                          <ButtonGroup
                            aria-label="house"
                            name="eventSelection"
                            className="houseisrent"
                          >
                            <ToggleButton
                              type="radio"
                              checked={eventSelection === "Attendie"}
                              label="eventSelection"
                              onClick={() =>
                                handleCalculateCarbonTrans(
                                  "eventSelection",
                                  "Attendie"
                                )
                              }
                              className={
                                eventSelection === "Attendie"
                                  ? "active form-control-label"
                                  : "form-control-label"
                              }
                            >
                              Individual
                            </ToggleButton>

                            {conferenceCode.length === 10 &&
                              validText &&
                              eventType === "Fashion" ? (
                              <ToggleButton
                                type="radio"
                                checked={eventSelection === "Exhibitor"}
                                label="eventSelection"
                                onClick={() =>
                                  handleCalculateCarbonTrans(
                                    "eventSelection",
                                    "Exhibitor"
                                  )
                                }
                                className={
                                  eventSelection === "Exhibitor"
                                    ? "active form-control-label"
                                    : "form-control-label"
                                }
                              >
                                Business
                              </ToggleButton>
                            ) : (
                              <ToggleButton
                                type="radio"
                                checked={eventSelection === "Exhibitor"}
                                label="eventSelection"
                                onClick={() =>
                                  handleCalculateCarbonTrans(
                                    "eventSelection",
                                    "Exhibitor"
                                  )
                                }
                                className={
                                  eventSelection === "Exhibitor"
                                    ? "active form-control-label"
                                    : "form-control-label"
                                }
                              >
                                Business
                              </ToggleButton>
                            )}
                          </ButtonGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="checkout-area space-mb--r130 checkout-width" style={{ border: "none" }}>
                    <div className="calculator--container">
                      <div className="carbon-calculator">
                        <div>
                          <div>
                            <div className="carbon-calculator-content-from calculator--household-info-holder">
                              {/* <div className="mb-40" style={{ marginTop: "20px" }}>
                                                                <span className="employee-code">Conference Code:</span>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Conference Code"
                                                                    class="code--input"
                                                                    value={businessCode}
                                                                />&nbsp;<span style={{ display: businessCode.length === 8 ? "none" : "" }}>(optional)</span><span style={{ display: businessCode.length === 8 ? "" : "none" }}> {validText ? <span style={{ color: "green" }}>Valid Code</span> : <span style={{ color: "red" }}>Invalid Code</span>}</span>
                                                            </div>
                                                            <div className="mb-40">
                                                                <span className="employee-code">Conference Name:</span>
                                                                <input type="text" placeholder="Enter Conference Name" class="code--input" value={businessName}
                                                                />
                                                            </div>
                                                            <div className="mb-40">
                                                                <span className="employee-code">Conference Date:</span>
                                                                <input type="text" placeholder="Enter Conference Name" class="code--input" value={businessName}
                                                                />
                                                            </div> */}
                            </div>
                            <div className="my-account-area">
                              <Container
                                className="orders-container"
                                style={{ padding: "0px" }}
                              >
                                <Tab.Container
                                  defaultActiveKey={"ConferenceInfo"}
                                >
                                  <Nav
                                    variant="pills"
                                    className="my-account-area__navigation"
                                    style={{ display: "flex" }}
                                  >
                                    <Nav.Item
                                      onClick={() => {
                                        [setTabActive(false)],
                                          setActiveTab("ConferenceInfo");
                                      }}
                                      style={{ marginLeft: "25px" }}
                                    >
                                      <Nav.Link
                                        className={
                                          `navbar-item nav-tab-links` +
                                          (activeTab === "ConferenceInfo"
                                            ? " active-nav"
                                            : "")
                                        }
                                        eventKey="ConferenceInfo"
                                      >
                                        Event Info
                                      </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item
                                      onClick={() => {
                                        [setTabActive(false)],
                                          setActiveTab("TravelTo");
                                      }}
                                    >
                                      <Nav.Link
                                        className={
                                          `navbar-item nav-tab-links` +
                                          (activeTab === "TravelTo"
                                            ? " active-nav"
                                            : "")
                                        }
                                        eventKey="TravelTo"
                                      >
                                        Traveling To
                                      </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item
                                      onClick={() => {
                                        [setTabActive(false)],
                                          setActiveTab("Local");
                                      }}
                                    >
                                      <Nav.Link
                                        className={
                                          `navbar-item nav-tab-links` +
                                          (activeTab === "Local"
                                            ? " active-nav"
                                            : "")
                                        }
                                        eventKey="Local"
                                      >
                                        Local
                                      </Nav.Link>
                                    </Nav.Item>
                                    {/* <Nav.Item onClick={() => { [setTabActive(false)], setActiveTab("Exhibit/Company") }}>
                                                                            <Nav.Link className={`navbar-item nav-tab-links` + (activeTab === "Exhibit/Company" ? " active-nav" : "")} eventKey="Exhibit/Company">
                                                                                Exhibitor/Group
                                                                            </Nav.Link>
                                                                        </Nav.Item> */}
                                  </Nav>
                                  <Tab.Content style={{ marginTop: "0px" }}>
                                    <Tab.Pane eventKey="ConferenceInfo">
                                      <div
                                        className="checkout-area space-mb--r130 checkout-width"
                                      // style={{
                                      //   border: "1px solid lightgray",
                                      //   width: "690px",
                                      //   padding: "1rem",
                                      //   marginTop: "-1px",
                                      // }}
                                      >
                                        <div className="mb-40 life-style-section">
                                          <div
                                            className="lifestyle--section-holder"
                                            style={{ marginTop: "20px" }}
                                          >

                                            {conferenceCode.length === 10 &&
                                              validText ? (
                                              <div className="conference-box">
                                                <h2
                                                  style={{ fontWeight: "bold" }}
                                                >
                                                  Event Details
                                                </h2>
                                                <div className="field">
                                                  <span className="label ">
                                                    Conference Code:{" "}
                                                  </span>
                                                  <span
                                                    className="value"
                                                    style={{
                                                      fontWeight: "bold",
                                                      fontSize: "16px",
                                                    }}
                                                  >
                                                    {conferenceCode}
                                                  </span>
                                                </div>
                                                <div className="field">
                                                  <span className="label">
                                                    Conference Name:{" "}
                                                  </span>
                                                  <span
                                                    className="value"
                                                    style={{
                                                      fontWeight: "bold",
                                                      fontSize: "16px",
                                                    }}
                                                  >
                                                    {conferenceName}
                                                  </span>
                                                </div>
                                                <div className="field">
                                                  <span className="label">
                                                    Conference Dates:{" "}
                                                  </span>
                                                  <span
                                                    className="value"
                                                    style={{
                                                      fontWeight: "bold",
                                                      fontSize: "16px",
                                                    }}
                                                  >
                                                    {conferenceDate} to {conferenceEndDate}
                                                  </span>
                                                </div>
                                                <div className="field">
                                                  <span className="label">
                                                    Conference Location:{" "}
                                                  </span>
                                                  <span
                                                    className="value"
                                                    style={{
                                                      fontWeight: "bold",
                                                      fontSize: "16px",
                                                    }}
                                                  >
                                                    {conferenceLocation}
                                                  </span>
                                                </div>
                                                <div className="field">
                                                  <span className="label">
                                                    Event Type:{" "}
                                                  </span>
                                                  <span
                                                    className="value"
                                                    style={{
                                                      fontWeight: "bold",
                                                      fontSize: "16px",
                                                    }}
                                                  >
                                                    {eventType}
                                                  </span>
                                                </div>
                                              </div>
                                            ) : <>  </>}
                                            <>
                                              <div className="work-text-title">
                                                <span className="employee-code " style={{ fontSize: "18px", fontWeight: "500" }} >
                                                  Conference Code:
                                                </span>
                                                <input
                                                  type="text"
                                                  placeholder="Enter Conference Code"
                                                  class="code--input"
                                                  ref={inputRef}
                                                  value={conferenceCode}
                                                  onChange={handleChangeCode}
                                                />
                                                &nbsp;
                                                <span
                                                  style={{
                                                    display:
                                                      conferenceCode.length ===
                                                        10
                                                        ? "none"
                                                        : "",
                                                  }}
                                                >
                                                  (optional)
                                                </span>
                                                <span
                                                  style={{
                                                    display:
                                                      conferenceCode.length ===
                                                        10
                                                        ? ""
                                                        : "none",
                                                  }}
                                                >
                                                  {" "}
                                                  {validText ? (
                                                    <span
                                                      style={{
                                                        color: "green",
                                                      }}
                                                    >
                                                      Valid Code
                                                    </span>
                                                  ) : (
                                                    <span
                                                      style={{ color: "red" }}
                                                    >
                                                      Invalid Code
                                                    </span>
                                                  )}
                                                </span>
                                              </div>
                                              {conferenceCode.length === 10 &&
                                                validText ? ("") : (<>
                                                  <div className="work-text-title"
                                                    style={{ marginTop: "20px" }}
                                                  >
                                                    <span className="employee-code" style={{ fontSize: "18px", fontWeight: "500" }}>
                                                      Conference Name:
                                                    </span>
                                                    <input
                                                      type="text"
                                                      placeholder="Enter Conference Name"
                                                      class="code--input"
                                                      value={conferenceName}
                                                      onChange={(e) =>
                                                        setConferenceName(
                                                          e.target.value
                                                        )
                                                      }
                                                      readOnly={validText}
                                                    />
                                                  </div>
                                                  <div className="work-text-title"
                                                    style={{
                                                      marginTop: "20px",
                                                    }}
                                                  >
                                                    <span className="employee-code " style={{ fontSize: "18px", fontWeight: "500" }}>
                                                      Conference Start Date:
                                                    </span>
                                                    <input
                                                      type="date"
                                                      placeholder="Enter Conference date"
                                                      class="code--input"
                                                      value={conferenceDate}
                                                      onChange={(e) =>
                                                        setConferenceDate(
                                                          e.target.value
                                                        )
                                                      }
                                                      readOnly={validText}
                                                    />
                                                  </div>
                                                  <div className="work-text-title"
                                                    style={{
                                                      marginTop: "20px",
                                                      marginBottom: "20px",
                                                    }}
                                                  >
                                                    <span className="employee-code " style={{ fontSize: "18px", fontWeight: "500" }}>
                                                      Conference End Date:
                                                    </span>
                                                    <input
                                                      type="date"
                                                      placeholder="Enter Conference date"
                                                      class="code--input"
                                                      value={conferenceEndDate}
                                                      onChange={(e) =>
                                                        setConferenceEndDate(
                                                          e.target.value
                                                        )
                                                      }
                                                      readOnly={validText}
                                                    />
                                                  </div>
                                                  <div className="work-title-margin">
                                                    <span className="work-text-title"
                                                      style={{ color: "#000" }}
                                                    >
                                                      Event Type
                                                    </span>
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
                                                          checked={
                                                            eventType ===
                                                            "Conference"
                                                          }
                                                          label="eventType"
                                                          onClick={() =>
                                                            handleCalculateCarbonTrans(
                                                              "eventType",
                                                              "Conference"
                                                            )
                                                          }
                                                          className={
                                                            eventType ===
                                                              "Conference"
                                                              ? "active form-control-label"
                                                              : "form-control-label"
                                                          }
                                                        >
                                                          Conference
                                                        </ToggleButton>
                                                        <ToggleButton
                                                          type="radio"
                                                          checked={
                                                            eventType === "Event"
                                                          }
                                                          label="eventType"
                                                          onClick={() =>
                                                            handleCalculateCarbonTrans(
                                                              "eventType",
                                                              "Event"
                                                            )
                                                          }
                                                          className={
                                                            eventType === "Event"
                                                              ? "active form-control-label"
                                                              : "form-control-label"
                                                          }
                                                        >
                                                          Event&nbsp;or&nbsp;Meeting
                                                        </ToggleButton>
                                                        <ToggleButton
                                                          type="radio"
                                                          checked={
                                                            eventType === "Concert"
                                                          }
                                                          label="eventType"
                                                          onClick={() =>
                                                            handleCalculateCarbonTrans(
                                                              "eventType",
                                                              "Concert"
                                                            )
                                                          }
                                                          className={
                                                            eventType === "Concert"
                                                              ? "active form-control-label"
                                                              : "form-control-label"
                                                          }
                                                        >
                                                          Concert
                                                        </ToggleButton>
                                                        <ToggleButton
                                                          type="radio"
                                                          checked={
                                                            eventType === "Sport"
                                                          }
                                                          label="eventType"
                                                          onClick={() =>
                                                            handleCalculateCarbonTrans(
                                                              "eventType",
                                                              "Sport"
                                                            )
                                                          }
                                                          className={
                                                            eventType === "Sport"
                                                              ? "active form-control-label"
                                                              : "form-control-label"
                                                          }
                                                        >
                                                          Sporting&nbsp;Event
                                                        </ToggleButton>
                                                        <ToggleButton
                                                          type="radio"
                                                          checked={
                                                            eventType === "Trade"
                                                          }
                                                          label="eventType"
                                                          onClick={() =>
                                                            handleCalculateCarbonTrans(
                                                              "eventType",
                                                              "Trade"
                                                            )
                                                          }
                                                          className={
                                                            eventType === "Trade"
                                                              ? "active form-control-label"
                                                              : "form-control-label"
                                                          }
                                                        >
                                                          Trade&nbsp;Show
                                                        </ToggleButton>
                                                        <ToggleButton
                                                          type="radio"
                                                          checked={
                                                            eventType === "Fashion"
                                                          }
                                                          label="eventType"
                                                          onClick={() =>
                                                            handleCalculateCarbonTrans(
                                                              "eventType",
                                                              "Fashion"
                                                            )
                                                          }
                                                          className={
                                                            eventType === "Fashion"
                                                              ? "active form-control-label"
                                                              : "form-control-label"
                                                          }
                                                        >
                                                          Fashion Runway
                                                        </ToggleButton>

                                                      </ButtonGroup>
                                                    </div>
                                                  </div>
                                                </>)}

                                            </>
                                          </div>
                                        </div>
                                        <div className="mb-40">
                                          <span
                                            style={{
                                              color: "#000",
                                              fontWeight: 500,
                                            }}
                                          >
                                            Departure Date
                                          </span>
                                          <input
                                            type="date"
                                            class="code--input"
                                            placeholderText="mm-dd-yyyy"
                                            dateFormat="mm-dd-yyyy"
                                            value={departureDate}
                                            onChange={(e) =>
                                              handleCalculateCarbonTrans(
                                                "departureDate",
                                                e.target.value
                                              )
                                            }
                                            pattern="\d{4}-\d{2}-\d{2}"
                                          />
                                        </div>
                                        <div className="mb-40">
                                          <span
                                            style={{
                                              color: "#000",
                                              fontWeight: 500,
                                            }}
                                          >
                                            Return Date
                                          </span>
                                          <input
                                            type="date"
                                            class="code--input"
                                            placeholder="mm-dd-yyyy"
                                            value={arrivalDate}
                                            min={departureDate}
                                            onChange={(e) =>
                                              handleCalculateCarbonTrans(
                                                "arrivalDate",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="TravelTo">
                                      {eventSelection === "Attendie" ? (
                                        <div
                                          className="checkout-area space-mb--r130 checkout-width"
                                        // style={{
                                        //   border: "1px solid lightgray",
                                        //   width: "690px",
                                        //   padding: "1rem",
                                        //   marginTop: "-1px",
                                        // }}
                                        >
                                          <div className="mb-40 life-style-section">
                                            <div className="lifestyle--section-holder">
                                              <div
                                                className="work-title-margin"
                                                style={{ marginTop: "20px" }}
                                              >
                                                <span className="work-text-title">
                                                  How are you traveling to the
                                                  event
                                                </span>
                                              </div>
                                              <div className="d-flex ">
                                                <div className="calculator--radio-button-holder">
                                                  <ButtonGroup
                                                    aria-label="house"
                                                    name="travelSelection"
                                                    className="houseisrent"
                                                  >
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        travelSelection ===
                                                        "ByRoad"
                                                      }
                                                      label="travelSelection"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "travelSelection",
                                                          "ByRoad"
                                                        )
                                                      }
                                                      className={
                                                        travelSelection ===
                                                          "ByRoad"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      By Road
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        travelSelection ===
                                                        "ByAir"
                                                      }
                                                      label="travelSelection"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "travelSelection",
                                                          "ByAir"
                                                        )
                                                      }
                                                      className={
                                                        travelSelection ===
                                                          "ByAir"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      By Airline
                                                    </ToggleButton>
                                                  </ButtonGroup>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              display:
                                                travelSelection === "ByRoad"
                                                  ? "none"
                                                  : "",
                                              marginBottom: "13px",
                                            }}
                                          >
                                            <span
                                              style={{
                                                color: "#000",
                                                fontWeight: 500,
                                              }}
                                            >
                                              Air Travel
                                            </span>
                                          </div>
                                          <div
                                            style={{
                                              position: "relative",
                                              display:
                                                travelSelection === "ByRoad"
                                                  ? "none"
                                                  : "",
                                            }}
                                          >
                                            <input
                                              type="text"
                                              placeholder="Origin Airport"
                                              value={searchAirport}
                                              onChange={handleAirport}
                                              style={{
                                                width: "100%",
                                                border: "none",
                                                borderBottom:
                                                  "1px solid lightgray",
                                                marginBottom: "20px",
                                              }}
                                              className="w-100 offset--input-holder"
                                            />
                                            <div
                                              className="dropdown-box"
                                              style={{
                                                display:
                                                  searchAirport?.length > 2 &&
                                                    clickedDrop
                                                    ? ""
                                                    : "none",
                                              }}
                                            >
                                              {airportsData.length > 0 && !loadingAirports ?
                                                (airportsData.map((item) => {
                                                  return (
                                                    <div
                                                      onClick={() =>
                                                        handleClickedAirport(
                                                          "origin",
                                                          item
                                                        )
                                                      }
                                                      className="airport-names"
                                                    >
                                                      {item?.iata}{" "}
                                                      <span
                                                        style={{
                                                          display: item?.iata
                                                            ? ""
                                                            : "none",
                                                        }}
                                                      >
                                                        -
                                                      </span>{" "}
                                                      {item?.name} ,{" "}
                                                      {item?.state} ,{" "}
                                                      {item?.country}
                                                    </div>
                                                  );
                                                })) : (
                                                  <div className="airports-loader">
                                                    {loadingAirports ? <Spinner size="sm" animation="border" /> : "No airport found"}
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                          {/* <br /> */}
                                          <div
                                            style={{
                                              position: "relative",
                                              display:
                                                travelSelection === "ByRoad"
                                                  ? "none"
                                                  : "",
                                            }}
                                          >
                                            <input
                                              type="text"
                                              placeholder="Destination Airport"
                                              value={searchAirportDest}
                                              onChange={handleAirportDest}
                                              style={{
                                                width: "100%",
                                                border: "none",
                                                borderBottom:
                                                  "1px solid lightgray",
                                                marginBottom: "20px",
                                              }}
                                              className="w-100 offset--input-holder"
                                            />
                                            <div
                                              className="dropdown-box"
                                              style={{
                                                display:
                                                  searchAirportDest?.length >
                                                    2 && clickedDropDest
                                                    ? ""
                                                    : "none",
                                              }}
                                            >
                                              {airportsDataDest.length > 0 && !loadingAirports ?
                                                (airportsDataDest.map((item) => {
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
                                                      {item?.iata}{" "}
                                                      <span
                                                        style={{
                                                          display: item?.iata
                                                            ? ""
                                                            : "none",
                                                        }}
                                                      >
                                                        -
                                                      </span>{" "}
                                                      {item?.name} ,{" "}
                                                      {item?.state} ,{" "}
                                                      {item?.country}
                                                    </div>
                                                  );
                                                })) : (
                                                  <div className="airports-loader">
                                                    {loadingAirports ? <Spinner size="sm" animation="border" /> : "No airport found"}
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              justifyContent: "space-between",
                                              display:
                                                travelSelection === "ByRoad"
                                                  ? "none"
                                                  : "flex",
                                            }}
                                          >
                                            <div style={{ width: "48%" }}>
                                              <div
                                                style={{
                                                  position: "relative",
                                                  width: "100%",
                                                }}
                                              >
                                                <input
                                                  type="text"
                                                  placeholder="Transfer Airport 1"
                                                  value={
                                                    searchAirportTrans1?.length >
                                                      40
                                                      ? searchAirportTrans1.slice(
                                                        0,
                                                        40
                                                      ) + "..."
                                                      : searchAirportTrans1
                                                  }
                                                  onChange={handleAirportTrans1}
                                                  style={{
                                                    width: "100%",
                                                    border: "none",
                                                    borderBottom:
                                                      "1px solid lightgray",
                                                    marginBottom: "5px",
                                                  }}
                                                  className="w-100 offset--input-holder"
                                                />
                                                <div
                                                  className="dropdown-box"
                                                  style={{
                                                    display:
                                                      searchAirportTrans1?.length >
                                                        2 && clickedDropTrans1
                                                        ? ""
                                                        : "none",
                                                  }}
                                                >
                                                  {airportsDataTrans1.length > 0 && !loadingAirports ?
                                                    airportsDataTrans1.map(
                                                      (item) => {
                                                        return (
                                                          <div
                                                            onClick={() =>
                                                              handleClickedAirport(
                                                                "trans1",
                                                                item
                                                              )
                                                            }
                                                            className="airport-names"
                                                          >
                                                            {item?.iata}{" "}
                                                            <span
                                                              style={{
                                                                display:
                                                                  item?.iata
                                                                    ? ""
                                                                    : "none",
                                                              }}
                                                            >
                                                              -
                                                            </span>{" "}
                                                            {item?.name} ,{" "}
                                                            {item?.state} ,{" "}
                                                            {item?.country}
                                                          </div>
                                                        );
                                                      }) : (
                                                      <div className="airports-loader">
                                                        {loadingAirports ? <Spinner size="sm" animation="border" /> : "No airport found"}
                                                      </div>
                                                    )}
                                                </div>
                                              </div>
                                              <p className="error-msg-calc">
                                                {trans1err}
                                              </p>
                                            </div>
                                            <div style={{ width: "48%" }}>
                                              <div
                                                style={{
                                                  position: "relative",
                                                  width: "100%",
                                                }}
                                              >
                                                <input
                                                  type="text"
                                                  placeholder="Transfer Airport 2"
                                                  value={
                                                    searchAirportTrans2?.length >
                                                      40
                                                      ? searchAirportTrans2.slice(
                                                        0,
                                                        40
                                                      ) + "..."
                                                      : searchAirportTrans2
                                                  }
                                                  onChange={handleAirportTrans2}
                                                  style={{
                                                    width: "100%",
                                                    border: "none",
                                                    borderBottom:
                                                      "1px solid lightgray",
                                                    marginBottom: "5px",
                                                  }}
                                                  className="w-100 offset--input-holder"
                                                />
                                                <div
                                                  className="dropdown-box"
                                                  style={{
                                                    display:
                                                      searchAirportTrans2?.length >
                                                        2 && clickedDropTrans2
                                                        ? ""
                                                        : "none",
                                                  }}
                                                >
                                                  {airportsDataTrans2.length > 0 && !loadingAirports ?
                                                    (airportsDataTrans2.map(
                                                      (item) => {
                                                        return (
                                                          <div
                                                            onClick={() =>
                                                              handleClickedAirport(
                                                                "trans2",
                                                                item
                                                              )
                                                            }
                                                            className="airport-names"
                                                          >
                                                            {item?.iata}{" "}
                                                            <span
                                                              style={{
                                                                display:
                                                                  item?.iata
                                                                    ? ""
                                                                    : "none",
                                                              }}
                                                            >
                                                              -
                                                            </span>{" "}
                                                            {item?.name} ,{" "}
                                                            {item?.state} ,{" "}
                                                            {item?.country}
                                                          </div>
                                                        );
                                                      })) : (
                                                      <div className="airports-loader">
                                                        {loadingAirports ? <Spinner size="sm" animation="border" /> : "No airport found"}
                                                      </div>
                                                    )}
                                                </div>
                                              </div>
                                              <p className="error-msg-calc">
                                                {trans2err}
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            className="mb-40 life-style-section"
                                            style={{
                                              display:
                                                travelSelection === "ByRoad"
                                                  ? "none"
                                                  : "",
                                            }}
                                          >
                                            <div
                                              className="lifestyle--section-holder"
                                              style={{ marginTop: "20px" }}
                                            >
                                              <div className="lifeStyle-span">
                                                {/* <span>House Size</span> */}
                                                <span>Seat Type</span>
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
                                                      checked={
                                                        seatType === "Economy"
                                                      }
                                                      label="seatType"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "seatType",
                                                          "Economy"
                                                        )
                                                      }
                                                      className={
                                                        seatType === "Economy"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Economy
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        seatType === "Premium"
                                                      }
                                                      label="seatType"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "seatType",
                                                          "Premium"
                                                        )
                                                      }
                                                      className={
                                                        seatType === "Premium"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Premium
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        seatType ===
                                                        "FirstClass"
                                                      }
                                                      label="seatType"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "seatType",
                                                          "FirstClass"
                                                        )
                                                      }
                                                      className={
                                                        seatType ===
                                                          "FirstClass"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      First Class
                                                    </ToggleButton>
                                                  </ButtonGroup>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            className="mb-40 life-style-section"
                                            style={{
                                              display:
                                                travelSelection === "ByAir"
                                                  ? "none"
                                                  : "",
                                            }}
                                          >
                                            <div className="lifestyle--section-holder">
                                              <div className="work-title-margin">
                                                <span className="work-text-title">
                                                  Transportation to the event
                                                </span>
                                              </div>
                                              <div className="d-flex ">
                                                <div className="calculator--radio-button-holder">
                                                  <ButtonGroup
                                                    aria-label="house"
                                                    name="transportMode"
                                                    className="houseisrent"
                                                  >
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        eventTransportMode ===
                                                        "RentalCar"
                                                      }
                                                      label="eventTransportMode"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "eventTransportMode",
                                                          "RentalCar"
                                                        )
                                                      }
                                                      className={
                                                        eventTransportMode ===
                                                          "RentalCar"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Rental Car
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        eventTransportMode ===
                                                        "Taxi"
                                                      }
                                                      label="eventTransportMode"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "eventTransportMode",
                                                          "Taxi"
                                                        )
                                                      }
                                                      className={
                                                        eventTransportMode ===
                                                          "Taxi"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Taxi
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        eventTransportMode ===
                                                        "EV"
                                                      }
                                                      label="eventTransportMode"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "eventTransportMode",
                                                          "EV"
                                                        )
                                                      }
                                                      className={
                                                        eventTransportMode ===
                                                          "EV"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      EV
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        eventTransportMode ===
                                                        "RideShare"
                                                      }
                                                      label="eventTransportMode"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "eventTransportMode",
                                                          "RideShare"
                                                        )
                                                      }
                                                      className={
                                                        eventTransportMode ===
                                                          "RideShare"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Ride Share
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        eventTransportMode ===
                                                        "Cars"
                                                      }
                                                      label="low"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "eventTransportMode",
                                                          "Cars"
                                                        )
                                                      }
                                                      className={
                                                        eventTransportMode ===
                                                          "Cars"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Cars
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        eventTransportMode ===
                                                        "PublicTransport"
                                                      }
                                                      label="low"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "eventTransportMode",
                                                          "PublicTransport"
                                                        )
                                                      }
                                                      className={
                                                        eventTransportMode ===
                                                          "PublicTransport"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Public Transport
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        eventTransportMode ===
                                                        "Mix"
                                                      }
                                                      label="low"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "eventTransportMode",
                                                          "Mix"
                                                        )
                                                      }
                                                      className={
                                                        eventTransportMode ===
                                                          "Mix"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Mix
                                                    </ToggleButton>
                                                  </ButtonGroup>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div
                                            className="mb-40 life-style-section"
                                            style={{
                                              display:
                                                travelSelection === "ByAir"
                                                  ? "none"
                                                  : "",
                                            }}
                                          >
                                            <div className="lifestyle--section-holder">
                                              <div className="work-title-margin">
                                                <span className="work-text-title">
                                                  Distance To The Destination
                                                </span>
                                              </div>
                                              <div className="d-flex ">
                                                <div className="calculator--radio-button-holder">
                                                  <ButtonGroup
                                                    aria-label="distanceDest"
                                                    name=""
                                                    className="houseisrent"
                                                  >
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        distEventTravel ===
                                                        "1–200 Km"
                                                      }
                                                      label="distEventTravel"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "distEventTravel",
                                                          "1–200 Km"
                                                        )
                                                      }
                                                      className={
                                                        distEventTravel ===
                                                          "1–200 Km"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      1–200 Km
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        distEventTravel ===
                                                        "201-350 Km"
                                                      }
                                                      label="distEventTravel"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "distEventTravel",
                                                          "201-350 Km"
                                                        )
                                                      }
                                                      className={
                                                        distEventTravel ===
                                                          "201-350 Km"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      201-350 Km
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        distEventTravel ===
                                                        "351-500 Km"
                                                      }
                                                      label="distEventTravel"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "distEventTravel",
                                                          "351-500 Km"
                                                        )
                                                      }
                                                      className={
                                                        distEventTravel ===
                                                          "351-500 Km"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      351-500 Km
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        distEventTravel ===
                                                        "501-650 Km"
                                                      }
                                                      label="low"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "distEventTravel",
                                                          "501-650 Km"
                                                        )
                                                      }
                                                      className={
                                                        distEventTravel ===
                                                          "501-650 Km"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      501-650 Km
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        distEventTravel ===
                                                        "Over 650 Km"
                                                      }
                                                      label="low"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "distEventTravel",
                                                          "Over 650 Km"
                                                        )
                                                      }
                                                      className={
                                                        distEventTravel ===
                                                          "Over 650 Km"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Over 650 Km
                                                    </ToggleButton>
                                                  </ButtonGroup>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          className="checkout-area space-mb--r130 checkout-width"
                                        // style={{
                                        //   border:
                                        //     "1px solid rgb(233, 233, 233)",
                                        //   width: "690px",
                                        //   padding: "1rem",
                                        //   marginTop: "-1px",
                                        // }}
                                        >
                                          <div className="mb-40 life-style-section">
                                            <div
                                              className="lifestyle--section-holder"
                                              style={{ marginTop: "20px" }}
                                            >
                                              <div style={{ textAlign: "left" }}>
                                                <span className="employee-code" style={{ textAlign: "left", fontSize: "18px", fontWeight: "500" }}>
                                                  Company Code:
                                                </span>
                                                <input
                                                  type="text"
                                                  placeholder="Enter Company Code"
                                                  class="code--input"
                                                  value={companyCode}
                                                  onChange={(e) =>
                                                    setCompanyCode(
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                &nbsp;
                                                <span
                                                  style={{
                                                    display:
                                                      companyCode?.length === 8
                                                        ? "none"
                                                        : "",
                                                  }}
                                                >
                                                  (optional)
                                                </span>
                                                <span
                                                  style={{
                                                    display:
                                                      companyCode?.length === 8
                                                        ? ""
                                                        : "none",
                                                  }}
                                                >
                                                  {" "}
                                                  {theValidField ? (
                                                    <span
                                                      style={{ color: "green" }}
                                                    >
                                                      Valid Code
                                                    </span>
                                                  ) : (
                                                    <span
                                                      style={{ color: "red" }}
                                                    >
                                                      Invalid Code
                                                    </span>
                                                  )}
                                                </span>
                                              </div>
                                              <div
                                                style={{
                                                  marginTop: "20px",
                                                  marginBottom: "20px",
                                                  textAlign: "left"
                                                }}
                                              >
                                                <span className="employee-code" style={{ textAlign: "left", fontSize: "18px", fontWeight: "500" }}>
                                                  Company Name:
                                                </span>
                                                <input
                                                  type="text"
                                                  placeholder="Enter Company Name"
                                                  class="code--input"
                                                  value={companyName}
                                                />
                                              </div>
                                              <div className="work-title-margin">
                                                <span className="work-text-title">
                                                  Exhibit Space Size (sq ft)
                                                </span>
                                              </div>
                                              <div className="d-flex ">
                                                <div className="calculator--radio-button-holder">
                                                  <ButtonGroup
                                                    aria-label="house"
                                                    name="exhibitSpace"
                                                    className="houseisrent"
                                                  >
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        exhibitSpace === 50
                                                      }
                                                      label="RentalCar"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "exhibitSpace",
                                                          50
                                                        )
                                                      }
                                                      className={
                                                        exhibitSpace === 50
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      50
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        exhibitSpace === 100
                                                      }
                                                      label="exhibitSpace"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "exhibitSpace",
                                                          100
                                                        )
                                                      }
                                                      className={
                                                        exhibitSpace === 100
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      100
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        exhibitSpace === 200
                                                      }
                                                      label="exhibitSpace"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "exhibitSpace",
                                                          200
                                                        )
                                                      }
                                                      className={
                                                        exhibitSpace === 200
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      200
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        exhibitSpace === 400
                                                      }
                                                      label="exhibitSpace"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "exhibitSpace",
                                                          400
                                                        )
                                                      }
                                                      className={
                                                        exhibitSpace === 400
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      400
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        exhibitSpace === 600
                                                      }
                                                      label="low"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "exhibitSpace",
                                                          600
                                                        )
                                                      }
                                                      className={
                                                        exhibitSpace === 600
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      600
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        exhibitSpace === 900
                                                      }
                                                      label="low"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "exhibitSpace",
                                                          900
                                                        )
                                                      }
                                                      className={
                                                        exhibitSpace === 900
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      900
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        exhibitSpace === 1500
                                                      }
                                                      label="low"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "exhibitSpace",
                                                          1500
                                                        )
                                                      }
                                                      className={
                                                        exhibitSpace === 1500
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      1500+
                                                    </ToggleButton>
                                                  </ButtonGroup>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          {eventType === "Fashion" ? (

                                            <div className="mb-40 lifestyle--section-holder">
                                              <div className="lifeStyle-span" >
                                                <span>
                                                  Please Specify Group
                                                </span>
                                              </div>
                                              <div className="d-flex">
                                                <div className="calculator--radio-button-holder">
                                                  <ButtonGroup
                                                    aria-label="house"
                                                    name="selectedGroup"
                                                    className="houseisrent"
                                                    style={{ width: "100%" }}
                                                  >
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        selectedGroup ===
                                                        "designer"
                                                      }
                                                      label="selectedGroup"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "selectedGroup",
                                                          "designer"
                                                        )
                                                      }
                                                      className={
                                                        selectedGroup ===
                                                          "designer"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Designer Group
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        selectedGroup ===
                                                        "brand"
                                                      }
                                                      label="selectedGroup"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "selectedGroup",
                                                          "brand"
                                                        )
                                                      }
                                                      className={
                                                        selectedGroup ===
                                                          "brand"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Brand Group
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        selectedGroup ===
                                                        "buyer"
                                                      }
                                                      label="eventType"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "selectedGroup",
                                                          "buyer"
                                                        )
                                                      }
                                                      className={
                                                        selectedGroup ===
                                                          "buyer"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Buyer Group
                                                    </ToggleButton>
                                                    <ToggleButton
                                                      type="radio"
                                                      checked={
                                                        selectedGroup ===
                                                        "press"
                                                      }
                                                      label="eventType"
                                                      onClick={() =>
                                                        handleCalculateCarbonTrans(
                                                          "selectedGroup",
                                                          "press"
                                                        )
                                                      }
                                                      className={
                                                        selectedGroup ===
                                                          "press"
                                                          ? "active form-control-label"
                                                          : "form-control-label"
                                                      }
                                                    >
                                                      Press
                                                    </ToggleButton>
                                                  </ButtonGroup>
                                                </div>
                                              </div>
                                            </div>



                                          ) : null}

                                          <div className="mb-40 life-style-section">
                                            <div className="lifestyle--section-holder">
                                              <div className="work-title-margin">
                                                <span className="work-text-title">
                                                  Num of People Attending the
                                                  party
                                                </span>
                                              </div>
                                              <div className="transport-slider-holder">
                                                <p>0</p>
                                                <SliderCustom
                                                  min={0}
                                                  max={50}
                                                  initValue={peopleNum}
                                                  onChange={handlePeople}
                                                  item="peopleData"
                                                />
                                                <p>50</p>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="mb-40 life-style-section">
                                            <div className="lifestyle--section-holder">
                                              <div className="work-title-margin">
                                                {/* <span>House Size</span> */}
                                                <span className="work-text-title">
                                                  People travelling by air
                                                </span>
                                              </div>

                                              <div className="transport-slider-holder">
                                                <p>0</p>
                                                <SliderCustom
                                                  min={0}
                                                  max={peopleNum}
                                                  initValue={peopleByAir}
                                                  onChange={handlePeople}
                                                  item="airData"
                                                />
                                                <p>{peopleNum}</p>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="mb-40 life-style-section">
                                            <div className="lifestyle--section-holder">
                                              <div className="work-title-margin">
                                                <span className="work-text-title">
                                                  People travelling by road
                                                </span>
                                              </div>

                                              <div className="transport-slider-holder">
                                                <p>0</p>
                                                <SliderCustom
                                                  min={0}
                                                  max={peopleNum - peopleByAir}
                                                  initValue={peopleByRoad}
                                                  onChange={handlePeople}
                                                  item="roadData"
                                                />
                                                <p>{peopleNum - peopleByAir}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="Local">
                                      <div
                                        className="checkout-area space-mb--r130 checkout-width"
                                      // style={{
                                      //   border: "1px solid lightgray",
                                      //   width: "690px",
                                      //   padding: "1rem",
                                      //   marginTop: "-1px",
                                      // }}
                                      >
                                        <div className="mb-40 life-style-section">
                                          <div className="lifestyle--section-holder">
                                            <div
                                              className="work-title-margin"
                                              style={{ marginTop: "20px" }}
                                            >
                                              <span className="work-text-title">Local Transportation</span>
                                            </div>
                                            <div className="d-flex ">
                                              <div className="calculator--radio-button-holder">
                                                <ButtonGroup
                                                  aria-label="house"
                                                  name="transportMode"
                                                  className="houseisrent"
                                                >
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      transportMode ===
                                                      "RentalCar"
                                                    }
                                                    label="RentalCar"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "transportMode",
                                                        "RentalCar"
                                                      )
                                                    }
                                                    className={
                                                      transportMode ===
                                                        "RentalCar"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Rental Car
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      transportMode === "Taxi"
                                                    }
                                                    label="transportMode"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "transportMode",
                                                        "Taxi"
                                                      )
                                                    }
                                                    className={
                                                      transportMode === "Taxi"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Taxi
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      transportMode === "EV"
                                                    }
                                                    label="transportMode"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "transportMode",
                                                        "EV"
                                                      )
                                                    }
                                                    className={
                                                      transportMode === "EV"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    EV
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      transportMode ===
                                                      "RideShare"
                                                    }
                                                    label="transportMode"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "transportMode",
                                                        "RideShare"
                                                      )
                                                    }
                                                    className={
                                                      transportMode ===
                                                        "RideShare"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Ride Share
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      transportMode === "Cars"
                                                    }
                                                    label="low"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "transportMode",
                                                        "Cars"
                                                      )
                                                    }
                                                    className={
                                                      transportMode === "Cars"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Cars
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      transportMode ===
                                                      "PublicTransport"
                                                    }
                                                    label="low"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "transportMode",
                                                        "PublicTransport"
                                                      )
                                                    }
                                                    className={
                                                      transportMode ===
                                                        "PublicTransport"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Public Transport
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      transportMode === "Mix"
                                                    }
                                                    label="low"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "transportMode",
                                                        "Mix"
                                                      )
                                                    }
                                                    className={
                                                      transportMode === "Mix"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Mix
                                                  </ToggleButton>
                                                </ButtonGroup>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="mb-40 life-style-section">
                                          <div className="lifestyle--section-holder">
                                            <div className="work-title-margin">
                                              <span className="work-text-title">
                                                Local Distance Traveled Per day
                                              </span>
                                            </div>
                                            <div className="d-flex ">
                                              <div className="calculator--radio-button-holder">
                                                <ButtonGroup
                                                  aria-label="house"
                                                  name=""
                                                  className="houseisrent"
                                                >
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      distTravel === "1–25 Km"
                                                    }
                                                    label="distTravel"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "distTravel",
                                                        "1–25 Km"
                                                      )
                                                    }
                                                    className={
                                                      distTravel === "1–25 Km"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    1–25 Km
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      distTravel === "26-50 Km"
                                                    }
                                                    label="distTravel"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "distTravel",
                                                        "26-50 Km"
                                                      )
                                                    }
                                                    className={
                                                      distTravel === "26-50 Km"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    26-50 Km
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      distTravel === "51-100 Km"
                                                    }
                                                    label="distTravel"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "distTravel",
                                                        "51-100 Km"
                                                      )
                                                    }
                                                    className={
                                                      distTravel === "51-100 Km"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    51-100 Km
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      distTravel ===
                                                      "101-200 Km"
                                                    }
                                                    label="low"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "distTravel",
                                                        "101-200 Km"
                                                      )
                                                    }
                                                    className={
                                                      distTravel ===
                                                        "101-200 Km"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    101-200 Km
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      distTravel ===
                                                      "Over 201 Km"
                                                    }
                                                    label="low"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "distTravel",
                                                        "Over 201 Km"
                                                      )
                                                    }
                                                    className={
                                                      distTravel ===
                                                        "Over 201 Km"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Over 201 Km
                                                  </ToggleButton>
                                                </ButtonGroup>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="mb-40 life-style-section">
                                          <div className="lifestyle--section-holder">
                                            <div className="work-title-margin">
                                              {/* <span>House Size</span> */}
                                              <span className="work-text-title">Stay</span>
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
                                                    checked={
                                                      theStay === "Hotel"
                                                    }
                                                    label="theStay"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "theStay",
                                                        "Hotel"
                                                      )
                                                    }
                                                    className={
                                                      expenses === "Hotel"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Hotel
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      theStay ===
                                                      "VacationRental"
                                                    }
                                                    label="theStay"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "theStay",
                                                        "VacationRental"
                                                      )
                                                    }
                                                    className={
                                                      theStay ===
                                                        "VacationRental"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    VacationRental
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      theStay === "Guesthouse"
                                                    }
                                                    label="Medium"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "theStay",
                                                        "Guesthouse"
                                                      )
                                                    }
                                                    className={
                                                      theStay === "Guesthouse"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Guesthouse
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    // value="high"
                                                    checked={
                                                      theStay === "Apartment"
                                                    }
                                                    label="theStay"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "theStay",
                                                        "Apartment"
                                                      )
                                                    }
                                                    className={
                                                      theStay === "Apartment"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Apartment
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    // value="high"
                                                    checked={
                                                      theStay === "Motel"
                                                    }
                                                    label="theStay"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "theStay",
                                                        "Motel"
                                                      )
                                                    }
                                                    className={
                                                      expenses === "Motel"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    {/* Low */}
                                                    Motel
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    // value="high"
                                                    checked={
                                                      theStay === "Home"
                                                    }
                                                    label="theStay"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "theStay",
                                                        "Home"
                                                      )
                                                    }
                                                    className={
                                                      theStay === "Home"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    My Home
                                                  </ToggleButton>
                                                </ButtonGroup>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="mb-40 life-style-section">
                                          <div className="lifestyle--section-holder">
                                            <div className="work-title-margin">
                                              {/* <span>House Size</span> */}
                                              <span className="work-text-title">Food Cost per day</span>
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
                                                    checked={
                                                      expenses ===
                                                      "Less than $50"
                                                    }
                                                    label="Less than $50"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "userExpense",
                                                        "Less than $50"
                                                      )
                                                    }
                                                    className={
                                                      expenses ===
                                                        "Less than $50"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    Less than $50
                                                  </ToggleButton>
                                                  <ToggleButton
                                                    type="radio"
                                                    checked={
                                                      expenses === "$51-$100"
                                                    }
                                                    label="$51-$100"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "userExpense",
                                                        "$51-$100"
                                                      )
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
                                                    checked={
                                                      expenses === "$101-$200"
                                                    }
                                                    label="Medium"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "userExpense",
                                                        "$101-$200"
                                                      )
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
                                                    // value="high"
                                                    checked={
                                                      expenses ===
                                                      "More than $201"
                                                    }
                                                    label="low"
                                                    onClick={() =>
                                                      handleCalculateCarbonTrans(
                                                        "userExpense",
                                                        "More than $201"
                                                      )
                                                    }
                                                    className={
                                                      expenses ===
                                                        "More than $201"
                                                        ? "active form-control-label"
                                                        : "form-control-label"
                                                    }
                                                  >
                                                    {/* Low */}
                                                    More than $201
                                                  </ToggleButton>
                                                </ButtonGroup>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Tab.Pane>
                                  </Tab.Content>
                                </Tab.Container>
                              </Container>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="carbon-calculator"></div>
                </div>
              </div>
              <div className="carbon-calculator-content-output" style={{ position: "sticky", top: "80px", alignSelf: "flex-start", paddingTop: "20px" }}>
                <div className="main-holder">
                  <div className="top-header-calculator">
                    <img src={"/assets/images/small-calculator-image.png"} />
                    <div className="content">
                      <div className="empty-div"></div>
                      <div className="main-content">
                        <h3>{isNaN(totalCarbon) ? "0.00" : totalCarbon}</h3>
                        <p>My annual carbon footprint Metric tons of carbon</p>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="annual--carbon--box">
                      <div className="carbon-calculator-content-output-title">
                        <span className="annual-box-p--16px annual-box-country">
                          Per Person In {showCapitalName}
                        </span>
                        <span className="annual-box-p--16px annual-box-quantity">
                          {!showCapitalCarbon
                            ? "0.00"
                            : Number(showCapitalCarbon).toFixed(2)}
                        </span>
                      </div>
                      <div className="my-household-holder">
                        <span>
                          <b>Event Emissions</b>
                        </span>

                        <div className="total-household--holder">
                          <div className="per-person-holder">
                            <p>
                              {isNaN(perAttendieEmission) || perAttendieEmission === 0 ? "0.00" : perAttendieEmission}
                            </p>
                            <span className="carbon--total-household">
                              Per Attendee Emissions
                            </span>
                          </div>
                          <div className="my-household-total-holder">
                            <p>{isNaN(totalCarbon) ? "0.00" : totalCarbon}</p>
                            <span className="carbon--total-household">
                              {eventSelection == "Attendie" ? "My Event Emissions" : "Our Event Emissions"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleContinue}
                          className="continue-button"
                          disabled={continueClicked}
                        >
                          {continueClicked ? (
                            <Spinner size="sm" animation="border" />
                          ) : (
                            "Continue"
                          )}
                        </button>
                      </div>
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
      )}
      </NoSSR>
    </LayoutTwo>
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

// export async function getServerSideProps(context) {
//   const localCookie = context?.req?.headers?.cookie;
//   if (!localCookie) {
//     return { props: { carbonCalculations: { success: false } } };
//   }
//   const JWTToken = cookie.parse(localCookie)?.JWTToken;
//   if (!JWTToken) {
//     return { props: { carbonCalculations: { success: false } } };
//   }
//   let meData;
//   try {
//     meData = await me(JWTToken);
//   } catch (err) {
//     console.log("error while getting carbon saved calculations", err);
//   }

//   let returnData = {};

//   if (meData?.success) {
//     returnData = {
//       success: true,
//       carbonCalculations: meData?.carbonCalculations || {},
//     };
//   } else {
//     returnData = {
//       success: false,
//     };
//   }

//   return { props: { carbonCalculations: returnData } };
// }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConferenceCarbonOffset);
