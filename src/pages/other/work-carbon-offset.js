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
import { getJoinedBusiness, getCarbonCalculations } from "src/apiClient/employer"
import { getUserBusinessCalculations } from "src/apiClient/business";
import axios from "axios";
import ToggleButton from "react-bootstrap/ToggleButton";
import NoSSR from "react-no-ssr";
import SliderCustom from "src/components/calculator/slider";
import { useRouter } from "next/router";
import _debounce, { _newDebounce } from "src/helpers/debounce";
import { saveCalculatedFields } from "src/apiClient/carbon";
import { useToasts } from "react-toast-notifications";
import {
  resetCircleDataIndex,
  saveCarbonAPIUpdated,
  saveCarbonCalculations,
} from "src/redux/actions/carbonCalculatorActions";
import { saveWorkCalculatedFields } from "src/apiClient/business"
import { connect } from "react-redux";
import { me } from "src/apiClient/auth";
import * as cookie from "cookie";
import { returnCorrectImage } from "src/components/helpers/returnCorrectImage";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Travel from "../../pages/other/travel";
import Basic from "../../pages/other/basic";
// import Conference from "./conference-carbon-offset";
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
const { setDebounce, removeDebounce } = _newDebounce();

function WorkCarbonOffset(props) {
  console.log("props", props);
  const setWindowBeforeUnload = () => {
    console.log("changee", dataChanged, loggedIn)
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

  // const [businessCode, setBusinessCode] = useState("")

  // useEffect(() => {
  //   BusinessDetails()
  // }, [])

  // const BusinessDetails = async () => {
  //   let JoinedBusinessDetails = await getJoinedBusiness()
  //   if (JoinedBusinessDetails?.data?.success) {
  //     console.log("JoinedBusiness", JoinedBusinessDetails?.data?.data?.[0])
  //     setBusinessCode(JoinedBusinessDetails?.data?.data?.[0]?.businessCode)
  //   }
  // }



  const { addToast } = useToasts();



  const [shouldCallAPI, setShouldCallAPI] = useState(false);
  const router = useRouter();
  const [averageCarbon, setAverageCarbon] = useState(0);
  const [selectCountry, setSelectCountry] = useState();
  const [showCapitalCarbon, setShowCapitalCarbon] = useState();
  const [showCapitalName, setCapitalName] = useState();
  const [countryList, setCountryList] = useState([]);

  const [totalCarbon, setTotalCarbon] = useState("");
  const [totalTravel, setTotalTravel] = useState(0);
  const [storeCountryShortName, setStoreCountryShortName] = useState("");
  const [houseHoldCarbon, setHouseHoldCarbon] = useState("");
  const [privateCarbon, setPrivateCarbon] = useState("");
  const [publicCarbon, setPublicCarbon] = useState("");
  const [userCountry, setUserCountry] = useState({});
  const [countryCodeISO3, setCountryCodeISO3] = useState("");
  const [continueClicked, setContinueClicked] = useState(false);
  const [airTravel, setAirTravel] = useState(0);
  const [airTravelTime, setAirTravelTime] = useState(0)
  const [carTravel, setCarTravel] = useState(0);
  const [carTravelDistance, setCarTravelDistance] = useState(0)
  const [trainTravel, setTrainTravel] = useState(0);
  const [trainTravelDistance, setTrainTravelDistance] = useState(0)
  const [otherTravel, setOtherTravel] = useState(0);
  const [otherTravelDistance, setOtherTravelDistance] = useState(0)
  const firstRender = useRef();
  const [TabActive, setTabActive] = useState(false);
  const [oneWayTravel, setOneWayTravel] = useState(10)
  const [remoteData, setRemoteData] = useState(2)
  const [onSiteData, setOnSiteData] = useState(3)
  const [transportMode, setTransportMode] = useState("car")
  const [expenses, setExpenses] = useState("Less than $50")
  const [tripsperyear, setTripsPerYear] = useState(10)
  const [activeTab, setActiveTab] = useState("basic")
  const [unitScale, setUnitScale] = useState("KM")
  const [travelForWork, setTravelForWork] = useState("yes")
  const [businessCode, setBusinessCode] = useState(JSON.parse(localStorage.getItem("JoinedBusinessDetails"))?.businessCode || "")
  const [businessName, setBusinessName] = useState(JSON.parse(localStorage.getItem("JoinedBusinessDetails"))?.businessId?.name || "")
  const [businessUser, setBusinessUser] = useState("")
  const [carbonCompare, setCarbonCompare] = useState("")
  const [navigateLink , setNavigateLink] = useState(false)

  const returnCarbonConsumptionObject = () => {
    // let pullObject;

    // if (!props?.userData?.isLoggedIn) {
    //   pullObject = props?.circleSliderData;
    // } else {
    //   pullObject = props?.carbonCalculations?.carbonCalculations;
    // }

    const returnObject = {
      unitScale,
      officeDistance: oneWayTravel,
      remoteWorkDayCount: remoteData,
      officeWorkDayCount: onSiteData,
      totalTripsAnnually: tripsperyear,
      transportationMode: transportMode,
      totalCarbonEmissions: totalCarbon,
      countryCode: countryCode,
      travelforWork: travelForWork,
      expenses: expenses,
      totalAirTripCount: airTravel,
      avgAirTripHour: airTravelTime,
      totalCarTripCount: carTravel,
      avgCarTripDistance: carTravelDistance,
      totalTrainTripCount: trainTravel,
      avgTrainTripDistance: trainTravelDistance,
      totalOtherTripCount: otherTravel,
      avgOtherTripDistance: otherTravelDistance,
      businessCode: businessCode,
      businessName: businessName
    };
    fetchAPI = true;
    return returnObject;
  };

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



  const returnMappedReduxData = () => {
    return {
      unitScale,
      officeDistance: oneWayTravel,
      remoteWorkDayCount: remoteData,
      officeWorkDayCount: onSiteData,
      totalTripsAnnually: tripsperyear,
      transportationMode: transportMode,
      totalCarbonEmissions: totalCarbon,
      countryCode: countryCode,
      travelforWork: travelForWork,
      expenses: expenses,
      totalAirTripCount: airTravel,
      avgAirTripHour: airTravelTime,
      totalCarTripCount: carTravel,
      avgCarTripDistance: carTravelDistance,
      totalTrainTripCount: trainTravel,
      avgTrainTripDistance: trainTravelDistance,
      totalOtherTripCount: otherTravel,
      avgOtherTripDistance: otherTravelDistance,
      businessCode: businessCode,
      businessName: businessName
    };
  };

  const returnMappedCarbonData = () => {
    return {
      unitScale,
      officeDistance: oneWayTravel,
      remoteWorkDayCount: remoteData,
      officeWorkDayCount: onSiteData,
      totalTripsAnnually: tripsperyear,
      transportationMode: transportMode,
      totalCarbonEmissions: totalCarbon,
      countryCode: countryCode,
      travelforWork: travelForWork,
      expenses: expenses,
      totalAirTripCount: airTravel,
      avgAirTripHour: airTravelTime,
      totalCarTripCount: carTravel,
      avgCarTripDistance: carTravelDistance,
      totalTrainTripCount: trainTravel,
      avgTrainTripDistance: trainTravelDistance,
      totalOtherTripCount: otherTravel,
      avgOtherTripDistance: otherTravelDistance,
      businessCode: businessCode,
      businessName: businessName
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
    selectCountry
  ]);

  useEffect(() => {
    console.log("activeTab ", activeTab)
  }, [
    activeTab
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

  }, [totalCarbon, countryCodeISO3]);

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

  // useEffect(() => {
  //   if (JSON.parse(localStorage.getItem("carbonCalculations"))?.basic?.totalCarbonEmissions == (Number(totalCarbon) + Number(totalTravel)).toFixed(2)) return;
  //   let carbonFields = {
  //     unitScale: unitScale == "Miles" ? "mile" : unitScale?.toLowerCase(),
  //     // userId: localStorage.getItem("userId"),
  //     officeDistance: oneWayTravel,
  //     remoteWorkDayCount: remoteData,
  //     officeWorkDayCount: onSiteData,
  //     totalTripsAnnually: tripsperyear,
  //     transportationMode: transportMode == "ev_car" ? 'ev-car' : transportMode == 'twoWheel' ? '2-wheeler' : transportMode == "public" ? 'public-transport' : transportMode == 'bicycle' ? 'bicycle-or-walk' : transportMode,
  //     totalCarbonEmissions: parseFloat((Number(totalCarbon) + Number(totalTravel)).toFixed(2)),
  //     countryCode: countryCode,
  //     travelforWork: travelForWork === "yes" ? true : false,
  //     avgExpenses: expenses == "Less than $50" ? 1 : expenses == "$51-$100" ? 2 : expenses == "$101-$200" ? 3 : expenses == "$201-$300" ? 4 : 5,
  //     totalAirTripCount: travelForWork === "no" ? 0 : airTravel,
  //     avgAirTripHour: travelForWork === "no" ? 0 : airTravelTime,
  //     totalCarTripCount: travelForWork === "no" ? 0 : carTravel,
  //     avgCarTripDistance: travelForWork === "no" ? 0 : carTravelDistance,
  //     totalTrainTripCount: travelForWork === "no" ? 0 : trainTravel,
  //     avgTrainTripDistance: travelForWork === "no" ? 0 : trainTravelDistance,
  //     totalOtherTripCount: travelForWork === "no" ? 0 : otherTravel,
  //     avgOtherTripDistance: travelForWork === "no" ? 0 : otherTravelDistance,
  //     businessCode: businessCode
  //   }
  //   const fetchData = async () => {
  //     try {
  //       const res = await saveWorkCalculatedFields(carbonFields)
  //       if (res.status === 200 || res.status === 201) {
  //         true &&
  //           addToast(res.data.data, {
  //             appearance: "success",
  //             autoDismiss: true,
  //           });
  //         getCarbonCalculations().then(carbondata => {
  //           if (carbondata.data.success) {
  //             console.log(carbondata.data.data?.carbonCalculations, "carbonData")
  //             localStorage.setItem("carbonCalculations", JSON.stringify(carbondata?.data?.data?.carbonCalculations))
  //           }
  //         })
  //       } else {
  //         true &&
  //           addToast(res.data.message, {
  //             appearance: "error",
  //             autoDismiss: true,
  //           });
  //       }
  //       return { success: false };
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();

  //   const interval = setInterval(fetchData, 10000);

  //   return () => clearInterval(interval);
  // }, [totalCarbon,totalTravel, countryCodeISO3]);

  const handleContinue = (e = "") => {
    if (businessCode.length !== 8) {
      setNavigateLink(true)
      return addToast("Invalid Business Code", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (!localStorage.getItem("email")) {
      router.push('/login-register');
    }
    let carbonFields
    setContinueClicked(true);
    // const carbonData = returnMappedCarbonData();
    if (props?.userData?.isLoggedIn) {
      carbonFields = {
        unitScale: unitScale == "Miles" ? "mile" : unitScale?.toLowerCase(),
        // userId: localStorage.getItem("userId"),
        officeDistance: oneWayTravel,
        remoteWorkDayCount: remoteData,
        officeWorkDayCount: onSiteData,
        totalTripsAnnually: tripsperyear,
        transportationMode: transportMode == "ev_car" ? 'ev-car' : transportMode == 'twoWheel' ? '2-wheeler' : transportMode == "public" ? 'public-transport' : transportMode == 'bicycle' ? 'bicycle-or-walk' : transportMode,
        totalCarbonEmissions: parseFloat((Number(totalCarbon) + Number(totalTravel)).toFixed(2)),
        countryCode: countryCode,
        travelforWork: travelForWork === "yes" ? true : false,
        avgExpenses: expenses == "Less than $50" ? 1 : expenses == "$51-$100" ? 2 : expenses == "$101-$200" ? 3 : expenses == "$201-$300" ? 4 : 5,
        totalAirTripCount: travelForWork === "no" ? 0 : airTravel,
        avgAirTripHour: travelForWork === "no" ? 0 : airTravelTime,
        totalCarTripCount: travelForWork === "no" ? 0 : carTravel,
        avgCarTripDistance: travelForWork === "no" ? 0 : carTravelDistance,
        totalTrainTripCount: travelForWork === "no" ? 0 : trainTravel,
        avgTrainTripDistance: travelForWork === "no" ? 0 : trainTravelDistance,
        totalOtherTripCount: travelForWork === "no" ? 0 : otherTravel,
        avgOtherTripDistance: travelForWork === "no" ? 0 : otherTravelDistance,
        businessCode: businessCode,
        businessName: businessName
      }
      if (!businessCode) {
        setContinueClicked(false)
        return addToast("Please join a business or enter a valid business name", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      console.log(carbonFields, "carbonFields")
      if (localStorage.getItem("email")) {
        saveCalculatedFieldsToDB(carbonFields);
      } else {
        router.push('/login-register');
      }
    }
    const currentTotalCarbon = 0
    if (travelForWork === "yes") {
      currentTotalCarbon = Math.ceil(Number(totalCarbon) + Number(totalTravel));
    } else {
      currentTotalCarbon = Math.ceil(Number(totalCarbon));
    }
    if (props.circleSliderData?.dataIndex > currentTotalCarbon) {
      props.resetCircleDataIndex();
    }
    if (localStorage.getItem("userId") === businessUser) {
      localStorage.setItem("carbonroute", "workcarbonoffset")
      router.push({
        pathname: "/circular",
        query: { tons: currentTotalCarbon },
      });
    }
  };
  const handleCalculateCarbon = (name, value) => {
    if (name === "houseHold") {
      const complementValue = 7 - value; // Calculate complement for remote work
      setCarbonConsumption((prevState) => ({
        ...prevState,
        [name]: value,
        transport: complementValue, // Update transport with complement
      }));
    }

    if (name === "transport") {
      // Check if the condition is met to allow changes to the onsite value
      if (carbonConsumption.houseHold === 7) {
        // If houseHold is 7, onsite is readonly
        return;
      }

      setCarbonConsumption((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // const handleTravelair = (name, value) => {
  //   console.log("value", value)
  //   const complementValue = 10 - value; // Calculate travel by air
  //   if (name === "travel") {
  //     setCarbonConsumption((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //       transportbyCar: complementValue, // Update transport with complement
  //     }));
  //   }
  //   if (name === "transportbyCar") {
  //     setCarbonConsumption((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //       transportbyTrain: complementValue, // Update transport with complement
  //     }));
  //   }
  //   if (name === "transportbyTrain") {
  //     setCarbonConsumption((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   }
  // };

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
    setShouldCallAPI(true);
    if (
      (name == "houseHold" && value == 0) ||
      (name == "transport" && value == -1)
    ) {
      return;
    }

    if (name == "houseHold") {
      if (value < carbonConsumption?.transport) {
        carbonConsumption.transport = value;
      }
    }
    setCarbonConsumption((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    const lifeStyle = 0
    // (carbonConsumption.income == "high"
    //   ? 1.15
    //   : carbonConsumption.income == "low"
    //     ? 0.85
    //     : carbonConsumption.income == "medium"
    //       ? 1.0
    //       : 0) *
    // (carbonConsumption.travelforWork == "yes"
    //   ? 1.15
    //   : carbonConsumption.travelforWork == "no"
    //     ? 0.85
    //     : 0) *
    // (carbonConsumption.airTravel == "high"
    //   ? 1.15
    //   : carbonConsumption.airTravel == "low"
    //     ? 0.85
    //     : carbonConsumption.airTravel == "medium"
    //       ? 1.0
    //       : 0) *
    // (carbonConsumption.houseSize == "high"
    //   ? 1.15
    //   : carbonConsumption.houseSize == "low"
    //     ? 0.85
    //     : carbonConsumption.houseSize == "medium"
    //       ? 1.0
    //       : carbonConsumption.houseSize == "more"
    //         ? 1.5
    //         : 0) *
    // (carbonConsumption.consumeFood == "high"
    //   ? 1.15
    //   : carbonConsumption.consumeFood == "low"
    //     ? 0.85
    //     : carbonConsumption.consumeFood == "medium"
    //       ? 1.0
    //       : 0);
    const transportation =
      (Number(carbonConsumption.houseHold) -
        0.15 * Number(carbonConsumption.transport)) *
      Number(selectCountry) *
      lifeStyle;

    const calc = transportation;
    if (
      totalCarbon &&
      totalCarbon != calc &&
      !firstRender.current &&
      selectCountry
    ) {
      dataChanged = true;
      setWindowBeforeUnload();
    }

    if (selectCountry && firstRender.current) firstRender.current = false;

    calc && setTotalCarbon(calc?.toFixed(2));

    setAverageCarbon((calc / carbonConsumption.houseHold)?.toFixed(2));
    setHouseHoldCarbon(
      (selectCountry * carbonConsumption.houseHold).toFixed(2)
    );
    setPrivateCarbon(
      (selectCountry * carbonConsumption.privateTransport * 0.1).toFixed(2)
    );
    setPublicCarbon(
      (selectCountry * carbonConsumption.publicTransport * 0.1).toFixed(2)
    );
  };

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
        unitScale,
        officeDistance: oneWayTravel,
        remoteWorkDayCount: remoteData,
        officeWorkDayCount: onSiteData,
        totalTripsAnnually: tripsperyear,
        transportationMode: transportMode,
        totalCarbonEmissions: totalCarbon,
        countryCode: countryCode,
        travelforWork: travelForWork,
        expenses: expenses,
        totalAirTripCount: airTravel,
        avgAirTripHour: airTravelTime,
        totalCarTripCount: carTravel,
        avgCarTripDistance: carTravelDistance,
        totalTrainTripCount: trainTravel,
        avgTrainTripDistance: trainTravelDistance,
        totalOtherTripCount: otherTravel,
        avgOtherTripDistance: otherTravelDistance,
        businessCode: businessCode,
        businessName: businessName
      }
      props?.userData?.isLoggedIn &&
        (await saveCalculatedFieldsToDB(
          data,
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

  useEffect(() => {
    if (businessCode.length === 8 || localStorage.getItem("JoinedBusinessDetails")) {
      theBusinessDetail()
    }
    setNavigateLink(false)
  }, [businessCode])

  useEffect(() => {
    setNavigateLink(false)
  }, [businessName])



  const theBusinessDetail = async () => {
    let getCalculations = await getUserBusinessCalculations(businessCode)
    if (getCalculations?.data?.data?.length > 0) {
      let latestCalculation = getCalculations.data.data[getCalculations.data.data.length - 1]
      console.log(latestCalculation, "carbonFetch")
      latestCalculation?.unitScale == "mile" ? setUnitScale("Miles") : setUnitScale("KM")
      latestCalculation?.transportationMode == 'car' ? setTransportMode("car") : latestCalculation?.transportationMode == 'ev-car' ? setTransportMode("ev_car") : latestCalculation?.transportationMode == '2-wheeler' ? setTransportMode('twoWheel') : latestCalculation?.transportationMode == 'carpooling' ? setTransportMode("carpooling") : latestCalculation?.transportationMode == 'public-transport' ? setTransportMode("public") : setTransportMode('bicycle')
      latestCalculation?.avgExpenses == 1 ? setExpenses("Less than $50") : latestCalculation?.avgExpenses == 2 ? setExpenses("$51-$100") : latestCalculation?.avgExpenses == 3 ? setExpenses("$101-$200") : latestCalculation?.avgExpenses == 4 ? setExpenses("$201-$300") : setExpenses("More than $301")
      latestCalculation?.travelforWork ? setTravelForWork("yes") : setTravelForWork("no")
      setOneWayTravel(latestCalculation?.officeDistance)
      setRemoteData(latestCalculation?.remoteWorkDayCount)
      setOnSiteData(latestCalculation?.officeWorkDayCount)
      setTripsPerYear(latestCalculation?.totalTripsAnnually)
      // setTransportMode(latestCalculation?.transportationMode)
      // setTotalCarbon(latestCalculation?.totalCarbonEmissions)
      setUserCountry({ code: latestCalculation?.countryCode })
      // setTravelForWork(latestCalculation?.travelforWork)
      // setExpenses(latestCalculation?.expenses)
      setAirTravel(latestCalculation?.totalAirTripCount)
      setAirTravelTime(latestCalculation?.avgAirTripHour)
      setCarTravel(latestCalculation?.totalCarTripCount)
      setCarTravelDistance(latestCalculation?.avgCarTripDistance)
      setTrainTravel(latestCalculation?.totalTrainTripCount)
      setTrainTravelDistance(latestCalculation?.avgTrainTripDistance)
      setOtherTravel(latestCalculation?.totalOtherTripCount)
      setOtherTravelDistance(latestCalculation?.avgOtherTripDistance)
      setBusinessName(latestCalculation?.businessName)
    }
  }

  const saveCalculatedFieldsToDB = async (payload, showToast = true) =>
    saveWorkCalculatedFields(payload)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setContinueClicked(false)
          getCarbonCalculations().then(carbondata => {
            if (carbondata.data.success) {
              console.log(carbondata.data.data?.carbonCalculations, "carbonData")
              localStorage.setItem("carbonCalculations", JSON.stringify(carbondata?.data?.data?.carbonCalculations))
            }
          })
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
        setNavigateLink(true)
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
        pageTitle="CO2 Footprint Calculator (Individuals Work)"
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

          <li>INDIVIDUAL WORK CALCULATOR</li>
        </ul>
      </BreadcrumbOne>
      <div className="checkout-area space-mt--r130 space-mb--r130" >
        <div className="calculator--container">
          <div className="carbon-calculator">
            <div className="carbon-calculator-content">
              <div className="carbon-calculator-content-from">
                <div className="carbon-calculator-content-from calculator--household-info-holder">
                  <div style={{ marginBottom: "30px" }}>
                    <div className="calculator--title-holder">
                      <span
                        style={{
                          color: "#333333",
                        }}
                      >
                        Individual Work Calculator
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

                  <div className="my-account-area" >
                    <Container className="orders-container" style={{ padding: "0px" }}>
                      <Tab.Container
                        defaultActiveKey={
                          "basic"
                        }
                      >
                        <Nav
                          variant="pills"
                          className="my-account-area__navigation"
                          style={{ display: "flex" }}
                        >
                          <Nav.Item onClick={() => { [setTabActive(false)], setActiveTab("basic") }} style={{ marginLeft: "25px" }}>
                            <Nav.Link className={`navbar-item nav-tab-links` + (activeTab === "basic" ? " active-nav" : "")} eventKey="basic" >
                              Basic
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item onClick={() => { [setTabActive(false)], setActiveTab("travel") }}>
                            <Nav.Link className={`navbar-item nav-tab-links` + (activeTab === "travel" ? " active-nav" : "")} eventKey="travel">
                              Travel
                            </Nav.Link>
                          </Nav.Item>
                          {/* <Nav.Item onClick={() => { [setTabActive(false)], setActiveTab("conference") }}>
                            <Nav.Link className={`navbar-item nav-tab-links` + (activeTab === "conference" ? " active-nav" : "")} eventKey="conference">
                              Conference
                            </Nav.Link>
                          </Nav.Item> */}
                        </Nav>
                        <Tab.Content style={{ marginTop: "0px" }}>
                          <Tab.Pane eventKey="basic">
                            <Basic totalCarbon={totalCarbon} setTotalCarbon={setTotalCarbon} oneWayTravel={oneWayTravel} setOneWayTravel={setOneWayTravel} remoteData={remoteData} setRemoteData={setRemoteData} onSiteData={onSiteData} setOnSiteData={setOnSiteData} transportMode={transportMode} setTransportMode={setTransportMode} expenses={expenses} setExpenses={setExpenses} tripsperyear={tripsperyear} setTripsPerYear={setTripsPerYear} businessCode={businessCode} setBusinessCode={setBusinessCode} businessName={businessName} setBusinessName={setBusinessName} unitScale={unitScale} setUnitScale={setUnitScale} totalTravel={totalTravel} setTotalTravel={setTotalTravel} airTravel={airTravel} setAirTravel={setAirTravel} airTravelTime={airTravelTime} setAirTravelTime={setAirTravelTime} carTravel={carTravel} setCarTravel={setCarTravel} carTravelDistance={carTravelDistance} setCarTravelDistance={setCarTravelDistance} trainTravel={trainTravel} setTrainTravel={setTrainTravel} trainTravelDistance={trainTravelDistance} setTrainTravelDistance={setTrainTravelDistance} otherTravel={otherTravel} setOtherTravel={setOtherTravel} otherTravelDistance={otherTravelDistance} setOtherTravelDistance={setOtherTravelDistance} travelForWork={travelForWork} setTravelForWork={setTravelForWork} businessUser={businessUser} setBusinessUser={setBusinessUser} />
                          </Tab.Pane>
                          <Tab.Pane eventKey="travel">
                            <Travel totalTravel={totalTravel} setTotalTravel={setTotalTravel} airTravel={airTravel} setAirTravel={setAirTravel} airTravelTime={airTravelTime} setAirTravelTime={setAirTravelTime} carTravel={carTravel} setCarTravel={setCarTravel} carTravelDistance={carTravelDistance} setCarTravelDistance={setCarTravelDistance} trainTravel={trainTravel} setTrainTravel={setTrainTravel} trainTravelDistance={trainTravelDistance} setTrainTravelDistance={setTrainTravelDistance} otherTravel={otherTravel} setOtherTravel={setOtherTravel} otherTravelDistance={otherTravelDistance} setOtherTravelDistance={setOtherTravelDistance} travelForWork={travelForWork} setTravelForWork={setTravelForWork} expenses={expenses} setExpenses={setExpenses} tripsperyear={tripsperyear} setTripsPerYear={setTripsPerYear} />
                          </Tab.Pane>
                          {/* <Tab.Pane eventKey="conference">
                            <Conference totalCarbon={totalCarbon} setTotalCarbon={setTotalCarbon} />
                          </Tab.Pane> */}
                        </Tab.Content>
                      </Tab.Container>
                    </Container>
                  </div>
                </div>
              </div>
              <div className="carbon-calculator-content-output">
                <div className="main-holder">
                  <div className="top-header-calculator">
                    <img src={"/assets/images/small-calculator-image.png"} />
                    <div className="content">
                      <div className="empty-div"></div>
                      <div className="main-content">
                        <h3>{isNaN(totalCarbon) ? "0.00" : travelForWork === "yes" ? (Number(totalCarbon) + Number(totalTravel)).toFixed(2) : (Number(totalCarbon)).toFixed(2)}</h3>
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
                          <b>My Household</b>
                        </span>

                        <div className="total-household--holder">
                          <div className="per-person-holder">
                            <p>
                              {isNaN(totalCarbon) ? "0.00" : totalCarbon}
                            </p>
                            <span className="carbon--total-household">
                              Per Person
                            </span>
                          </div>
                          <div className="my-household-total-holder">
                            <p>{isNaN(totalTravel) ? "0.00" : Number(totalTravel).toFixed(2)}</p>
                            <span className="carbon--total-household">
                              My Household Total
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
                            localStorage.getItem("userId") === businessUser ? "Continue" : "Save"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="navigate-text" style={{display : navigateLink ? "" : "none"}}>
                  <p className="navigate-title">Unable to Find a Business ?</p>
                  <p>No Problem , Try our <span className="navigate-link" onClick={()=> router.push("/other/carbon-offset")}>Individual Calculator</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="carbon-calculator"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkCarbonOffset);
