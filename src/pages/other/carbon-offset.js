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
import { connect } from "react-redux";
import { me } from "src/apiClient/auth";
import * as cookie from "cookie";
import { returnCorrectImage } from "src/components/helpers/returnCorrectImage";

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

function CarbonOffset(props) {
  console.log(props , "propsss")
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
    console.log("propss", props?.circleSliderData)
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
    console.log("initialProps", pullObject)
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
  const firstRender = useRef();

  const returnMappedCarbonData = () => {
    console.log("totalCarbon", totalCarbon, carbonConsumption)
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

  useEffect(() => {
    handleShowAverageCarbonUsage();
  }, [
    carbonConsumption?.houseHold,
    carbonConsumption?.transport,
    carbonConsumption?.publicTransport,
    carbonConsumption?.income,
    carbonConsumption?.airTravel,
    carbonConsumption?.consumeFood,
    carbonConsumption?.houseSize,
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
    console.log("firstLoad", firstRender, totalCarbon, carbonConsumption, dataChanged)
    console.log("loggedIn", props?.userData?.isLoggedIn)
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
    const currentTotalCarbon = Math.ceil(totalCarbon);
    if (props.circleSliderData?.dataIndex > currentTotalCarbon) {
      props.resetCircleDataIndex();
    }
    localStorage.setItem("carbonroute", "carbonoffset")
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
      (carbonConsumption.income == "high"
        ? 1.15
        : carbonConsumption.income == "low"
          ? 0.85
          : carbonConsumption.income == "medium"
            ? 1.0
            : 0) *
      (carbonConsumption.airTravel == "high"
        ? 1.15
        : carbonConsumption.airTravel == "low"
          ? 0.85
          : carbonConsumption.airTravel == "medium"
            ? 1.0
            : 0) *
      (carbonConsumption.houseSize == "high"
        ? 1.15
        : carbonConsumption.houseSize == "low"
          ? 0.85
          : carbonConsumption.houseSize == "medium"
            ? 1.0
            : 0) *
      (carbonConsumption.consumeFood == "high"
        ? 1.15
        : carbonConsumption.consumeFood == "low"
          ? 0.85
          : carbonConsumption.consumeFood == "medium"
            ? 1.0
            : 0);
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
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="CO2 Footprint Calculator (Individuals)"
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

          <li>INDIVIDUAL CALCULATOR</li>
        </ul>
      </BreadcrumbOne>
      <div className="checkout-area space-mt--r130 space-mb--r130">
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
                        Individual Calculator
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
                  <div className="mb-40 people--household-holder">
                    <span>Members in your household</span>
                    {/* <RangeSlider
                      value={parseFloat(carbonConsumption["houseHold"])}
                      max={7}
                      min={1}
                      onChange={(changeEvent) =>
                        handleCalculateCarbon(
                          "houseHold",
                          changeEvent.target.value
                        )
                      }
                    /> */}
                    <div className="transport-slider-holder">
                      <p>1</p>
                      <SliderCustom
                        min={0}
                        max={10}
                        initValue={parseFloat(carbonConsumption["houseHold"])}
                        onChange={handleCalculateCarbon}
                        item="houseHold"
                      />
                      {/* <Slider
                        min={1}
                        max={7}
                        value={parseFloat(carbonConsumption["houseHold"])}
                        onChange={(val) =>
                          handleCalculateCarbon("houseHold", val)
                        }
                        // marks={marks}
                        // dots={true}
                        className="calculator--rc-slider"
                      /> */}
                      <p>10</p>
                    </div>

                    {/* <Slider
                      // defaultValue={props.footprintCarbonData.isCarbon["houseHold"]}
                      getAriaValueText={valuetext}
                      name="houseHold"
                      className=""
                      aria-labelledby="discrete-slider-always"
                      step={1}
                      value={parseFloat(carbonConsumption["houseHold"])}
                      onChange={(e, value) =>
                        handleCalculateCarbon("houseHold", value)
                      }
                      max={7}
                      min={1}
                      marks={marks}
                    /> */}
                  </div>
                  <div className="mb-40 people--public-transport-holder">
                    <span>Members using public transportation</span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={-1}
                        max={
                          carbonConsumption.houseHold != ""
                            ? Number(carbonConsumption.houseHold)
                            : 1
                        }
                        initValue={carbonConsumption?.transport}
                        onChange={handleCalculateCarbon}
                        item="transport"
                      />
                      {/* <Slider
                        min={0}
                        max={
                          carbonConsumption.houseHold != ""
                            ? Number(carbonConsumption.houseHold)
                            : 1
                        }
                        // dots={true}
                        value={parseFloat(carbonConsumption["transport"])}
                        onChange={(val) =>
                          handleCalculateCarbon("transport", val)
                        }
                        className="calculator--rc-slider"
                      /> */}

                      {/* <Slider
                        // defaultValue={0}
                        getAriaValueText={valuetext}
                        className="slider--main"
                        name="privateTransport"
                        aria-labelledby="discrete-slider-always"
                        // step={1}
                        max={
                          carbonConsumption.houseHold != ""
                            ? Number(carbonConsumption.houseHold)
                            : 7
                        }
                        onChange={(e, value) =>
                          handleCalculateCarbon("transport", value)
                        }
                        marks={
                          carbonConsumption.houseHold != ""
                            ? marksHouseHold.filter((item, index) => {
                                return (
                                  item.value <=
                                  Number(carbonConsumption.houseHold)
                                );
                              })
                            : marksHouseHold
                        }
                      /> */}
                      <p>
                        {carbonConsumption.houseHold != ""
                          ? Number(carbonConsumption.houseHold)
                          : 1}
                        {/* 7 */}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="empty-breaker mb-40" />
                <div className="life-style-section">
                  <div className="lifestyle--section-holder">
                    <div className="lifeStyle-span">
                      <span>Income</span>
                    </div>
                    <div className="d-flex ">
                      <div className="calculator--radio-button-holder">
                        <ButtonGroup
                          aria-label="house"
                          name="income"
                          className="houseisrent"
                        // onChange={(e) =>
                        //   handleCalculateCarbon(e.target.name, e.target.value)
                        // }
                        >
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.income === "high"}
                            label="High"
                            onClick={() =>
                              handleCalculateCarbon("income", "high")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     income: "high",
                            //   }))
                            // }
                            className={
                              carbonConsumption.income === "high"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            High
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.income === "medium"}
                            label="Medium"
                            onClick={() =>
                              handleCalculateCarbon("income", "medium")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     income: "medium",
                            //   }))
                            // }
                            className={
                              carbonConsumption.income === "medium"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Medium
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.income === "low"}
                            label="low"
                            onClick={() =>
                              handleCalculateCarbon("income", "low")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     income: "low",
                            //   }))
                            // }
                            className={
                              carbonConsumption.income === "low"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Low
                          </ToggleButton>
                        </ButtonGroup>
                        {/* <RadioGroup
                          aria-label="house"
                          name="income"
                          className="houseisrent"
                          onChange={(e) =>
                            handleCalculateCarbon(e.target.name, e.target.value)
                          }
                        >
                          <FormControlLabel
                            className={
                              carbonConsumption.income === "high"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="high"
                            checked={carbonConsumption.income === "high"}
                            control={<Radio />}
                            label="High"
                          />
                          <FormControlLabel
                            className={
                              carbonConsumption.income === "medium"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="medium"
                            checked={carbonConsumption.income === "medium"}
                            control={<Radio />}
                            label="Medium"
                          />
                          <FormControlLabel
                            className={
                              carbonConsumption.income === "low"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="low"
                            checked={carbonConsumption.income === "low"}
                            control={<Radio />}
                            label="Low"
                          />
                        </RadioGroup> */}
                      </div>
                    </div>
                  </div>

                  <div className="lifestyle--section-holder">
                    <div className="lifeStyle-span">
                      <span>House Size</span>
                    </div>
                    <div className="d-flex ">
                      <div className="calculator--radio-button-holder">
                        <ButtonGroup
                          aria-label="house"
                          name="houseSize"
                          className="houseisrent"
                        // onChange={(e) =>
                        //   handleCalculateCarbon(e.target.name, e.target.value)
                        // }
                        >
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.houseSize === "high"}
                            label="High"
                            onClick={() =>
                              handleCalculateCarbon("houseSize", "high")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     houseSize: "high",
                            //   }))
                            // }
                            className={
                              carbonConsumption.houseSize === "high"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            High
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.houseSize === "medium"}
                            label="Medium"
                            onClick={() =>
                              handleCalculateCarbon("houseSize", "medium")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     houseSize: "medium",
                            //   }))
                            // }
                            className={
                              carbonConsumption.houseSize === "medium"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Medium
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.houseSize === "low"}
                            label="low"
                            onClick={() =>
                              handleCalculateCarbon("houseSize", "low")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     houseSize: "low",
                            //   }))
                            // }
                            className={
                              carbonConsumption.houseSize === "low"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Low
                          </ToggleButton>
                        </ButtonGroup>
                        {/* <RadioGroup
                          aria-label="house"
                          name="houseSize"
                          className="houseisrent"
                          onChange={(e) =>
                            handleCalculateCarbon(e.target.name, e.target.value)
                          }
                        >
                          <FormControlLabel
                            className={
                              carbonConsumption.houseSize === "high"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="high"
                            checked={carbonConsumption.houseSize === "high"}
                            control={<Radio />}
                            label="High"
                          />
                          <FormControlLabel
                            className={
                              carbonConsumption.houseSize === "medium"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="medium"
                            checked={carbonConsumption.houseSize === "medium"}
                            control={<Radio />}
                            label="Medium"
                          />
                          <FormControlLabel
                            className={
                              carbonConsumption.houseSize === "low"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="low"
                            checked={carbonConsumption.houseSize === "low"}
                            control={<Radio />}
                            label="Low"
                          />
                        </RadioGroup> */}
                      </div>
                    </div>
                  </div>

                  <div className="lifestyle--section-holder">
                    <div className="lifeStyle-span">
                      <span>Air Travel</span>
                    </div>
                    <div className="d-flex">
                      <div className="calculator--radio-button-holder">
                        <ButtonGroup
                          aria-label="house"
                          name="airTravel"
                          className="houseisrent"
                        // onChange={(e) =>
                        //   handleCalculateCarbon(e.target.name, e.target.value)
                        // }
                        >
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.airTravel === "high"}
                            label="High"
                            onClick={() =>
                              handleCalculateCarbon("airTravel", "high")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     airTravel: "high",
                            //   }))
                            // }
                            className={
                              carbonConsumption.airTravel === "high"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            High
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.airTravel === "medium"}
                            label="Medium"
                            onClick={() =>
                              handleCalculateCarbon("airTravel", "medium")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     airTravel: "medium",
                            //   }))
                            // }
                            className={
                              carbonConsumption.airTravel === "medium"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Medium
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.airTravel === "low"}
                            label="low"
                            onClick={() =>
                              handleCalculateCarbon("airTravel", "low")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     airTravel: "low",
                            //   }))
                            // }
                            className={
                              carbonConsumption.airTravel === "low"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Low
                          </ToggleButton>
                        </ButtonGroup>
                        {/* <RadioGroup
                          aria-label="house"
                          name="airTravel"
                          className="houseisrent"
                          onChange={(e) =>
                            handleCalculateCarbon(e.target.name, e.target.value)
                          }
                        >
                          <FormControlLabel
                            className={
                              carbonConsumption.airTravel === "high"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="high"
                            checked={carbonConsumption.airTravel === "high"}
                            control={<Radio />}
                            label="High"
                          />
                          <FormControlLabel
                            className={
                              carbonConsumption.airTravel === "medium"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="medium"
                            checked={carbonConsumption.airTravel === "medium"}
                            control={<Radio />}
                            label="Medium"
                          />
                          <FormControlLabel
                            className={
                              carbonConsumption.airTravel === "low"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="low"
                            checked={carbonConsumption.airTravel === "low"}
                            control={<Radio />}
                            label="Low"
                          />
                        </RadioGroup> */}
                      </div>
                    </div>
                  </div>

                  <div className="lifestyle--section-holder">
                    <div className="lifeStyle-span">
                      <span>Meat/Fish/Egg Consumption</span>
                    </div>
                    <div className="d-flex ">
                      <div className="calculator--radio-button-holder">
                        <ButtonGroup
                          aria-label="house"
                          name="consumeFood"
                          className="houseisrent"
                        // onChange={(e) =>
                        //   handleCalculateCarbon(e.target.name, e.target.value)
                        // }
                        >
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.consumeFood === "high"}
                            label="High"
                            onClick={() =>
                              handleCalculateCarbon("consumeFood", "high")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     consumeFood: "high",
                            //   }))
                            // }
                            className={
                              carbonConsumption.consumeFood === "high"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            High
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.consumeFood === "medium"}
                            label="Medium"
                            onClick={() =>
                              handleCalculateCarbon("consumeFood", "medium")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     consumeFood: "medium",
                            //   }))
                            // }
                            className={
                              carbonConsumption.consumeFood === "medium"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Medium
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            // value="high"
                            checked={carbonConsumption.consumeFood === "low"}
                            label="low"
                            onClick={() =>
                              handleCalculateCarbon("consumeFood", "low")
                            }
                            // onClick={() =>
                            //   setCarbonConsumption((prev) => ({
                            //     ...prev,
                            //     consumeFood: "low",
                            //   }))
                            // }
                            className={
                              carbonConsumption.consumeFood === "low"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Low
                          </ToggleButton>
                        </ButtonGroup>
                        {/* <RadioGroup
                          aria-label="house"
                          name="consumeFood"
                          className="houseisrent"
                          onChange={(e) =>
                            handleCalculateCarbon(e.target.name, e.target.value)
                          }
                        >
                          <FormControlLabel
                            className={
                              carbonConsumption.consumeFood === "high"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="high"
                            checked={carbonConsumption.consumeFood === "high"}
                            control={<Radio />}
                            label="High"
                          />
                          <FormControlLabel
                            className={
                              carbonConsumption.consumeFood === "medium"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="medium"
                            checked={carbonConsumption.consumeFood === "medium"}
                            control={<Radio />}
                            label="Medium"
                          />
                          <FormControlLabel
                            className={
                              carbonConsumption.consumeFood === "low"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                            value="low"
                            checked={carbonConsumption.consumeFood === "low"}
                            control={<Radio />}
                            label="Low"
                          />
                        </RadioGroup> */}
                      </div>
                    </div>
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
                          <b>My Household</b>
                        </span>

                        <div className="total-household--holder">
                          <div className="per-person-holder">
                            <p>
                              {isNaN(averageCarbon) ? "0.00" : averageCarbon}
                            </p>
                            <span className="carbon--total-household">
                              Per Person
                            </span>
                          </div>
                          <div className="my-household-total-holder">
                            <p>{isNaN(totalCarbon) ? "0.00" : totalCarbon}</p>
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

export async function getServerSideProps(context) {
  const localCookie = context?.req?.headers?.cookie;
  if (!localCookie) {
    return { props: { carbonCalculations: { success: false } } };
  }
  const JWTToken = cookie.parse(localCookie)?.JWTToken;
  if (!JWTToken) {
    return { props: { carbonCalculations: { success: false } } };
  }
  let meData;
  try {
    // console.log(JWTToken , "JWT-token")
    meData = await me(JWTToken);
  } catch (err) {
    console.log("error while getting carbon saved calculations", err);
  }

  let returnData = {};

  // console.log(meData , "meData")

  if (meData?.success) {
    returnData = {
      success: true,
      carbonCalculations: meData?.carbonCalculations || {},
    };
  } else {
    returnData = {
      success: false,
    };
  }

  return { props: { carbonCalculations: returnData } };
}

export default connect(mapStateToProps, mapDispatchToProps)(CarbonOffset);
