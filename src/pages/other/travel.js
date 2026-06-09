import { connect } from "react-redux";
import { LayoutTwo } from "../../components/Layout";
import { ButtonGroup, Col, Container, Row, Spinner } from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";
import NoSSR from "react-no-ssr";
import SliderCustom from "src/components/calculator/slider";
import _debounce, { _newDebounce } from "src/helpers/debounce";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useToasts } from "react-toast-notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { createTheme } from "@material-ui/core";
import axios from "axios";
import { getCountries } from "src/apiClient/country";
import { returnCorrectCode } from "src/data/countryCodeToISO3";
import { BreadcrumbOne } from "src/components/Breadcrumb";
import { Link } from "react-scroll";

let countryCode;
let carbonConsumptions;
let dataChanged = false;
let loggedIn = false;
let fetchAPI = true;
const { setDebounce, removeDebounce } = _newDebounce();

function Travel({ tripsperyear, setTripsPerYear, totalTravel, setTotalTravel, airTravel, setAirTravel, airTravelTime, setAirTravelTime, carTravel, setCarTravel, carTravelDistance, setCarTravelDistance, trainTravel, setTrainTravel, setExpenses, trainTravelDistance, setTrainTravelDistance, otherTravel, setOtherTravel, otherTravelDistance, setOtherTravelDistance, travelForWork, setTravelForWork, expenses, ...props }) {
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
      travel: pullObject?.travel || 1,
      transport: pullObject?.publicTransportationMembers || 0,
      income: pullObject?.income || "medium",
      airTravel: pullObject?.airTravel || "medium",
      houseSize: pullObject?.houseSize || "medium",
      travelforWork: pullObject?.travelForWork || "no",
      consumeFood: pullObject?.meatConsumption || "medium",
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
  // const [airTravel, setAirTravel] = useState(1);
  // const [airTravelTime, setAirTravelTime] = useState(1)
  // const [carTravel, setCarTravel] = useState(1);
  // const [carTravelDistance, setCarTravelDistance] = useState(1)
  // const [trainTravel, setTrainTravel] = useState(1);
  // const [trainTravelDistance, setTrainTravelDistance] = useState(1)
  // const [publicTravel, setPublicTravel] = useState(1);
  // const [publicTravelDistance, setPublicTravelDistance] = useState(1)
  // const [otherTravel, setOtherTravel] = useState(1);
  // const [otherTravelDistance, setOtherTravelDistance] = useState(1)
  const firstRender = useRef();
  const [TabActive, setTabActive] = useState(false);

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
      totalCarbonEmissions: "",
      countryCode: countryCodeISO3 || storeCountryShortName,
    };
  };

  useEffect(() => {
    handleShowAverageCarbonUsage();
  }, [
    airTravel,
    airTravelTime,
    carTravel,
    carTravelDistance,
    trainTravel,
    trainTravelDistance,
    otherTravel,
    otherTravelDistance,
    expenses,
    travelForWork
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
  }, [countryCodeISO3]);



  const travelData = (item, value) => {
    console.log(travelForWork, "workkk")
    if (item === "airTravel") {
      console.log("travell", value, carTravel, trainTravel)
      if (value + carTravel + trainTravel > tripsperyear) {
        return addToast(`total trips cannot exceed ${tripsperyear}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setAirTravel(value);
    }
    if (item === "carTravel") {
      if (airTravel + value + trainTravel > tripsperyear) {
        return addToast(`total trips cannot exceed ${tripsperyear}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setCarTravel(value);
    }
    if (item === "trainTravel") {
      if (airTravel + carTravel + value > tripsperyear) {
        return addToast(`total trips cannot exceed ${tripsperyear}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setTrainTravel(value);
    }
    // if (item === "publicTravel") {
    //   if (airTravel + carTravel + trainTravel + value + otherTravel > 10) {
    //     return addToast("total trips cannot exceed 10", {
    //       appearance: "error",
    //       autoDismiss: true,
    //     });
    //   }
    //   setPublicTravel(value);
    // }
    if (item === "otherTravel") {
      if (airTravel + carTravel + trainTravel > tripsperyear) {
        return addToast(`total trips cannot exceed ${tripsperyear}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setOtherTravel(value);
    }
  };

  const DistanceData = (item, value) => {
    if (item === "airTravelDistance") {
      setAirTravelTime(value);
    }
    if (item === "carTravelDistance") {
      setCarTravelDistance(value);
    }
    if (item === "trainTravelDistance") {
      setTrainTravelDistance(value);
    }
    if (item === "otherTravelDistance") {
      setOtherTravelDistance(value);
    }
  }

  // mode of transportion //

  const handleCalculateCarbonTrans = (name, value) => {
    if (name === "travelForWork") {
      console.log("travelForWork", value)
      setTravelForWork(value)
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

  const handletripsperyear = (name, value) => {
    setTripsPerYear(value)
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

  const handleShowAverageCarbonUsage = () => {
    if (travelForWork === "no") {
      setAirTravel(0)
      setCarTravel(0)
      setTrainTravel(0)
      setOtherTravel(0)
      setAirTravelTime(0)
      setCarTravelDistance(0)
      setTrainTravelDistance(0)
      setOtherTravelDistance(0)
      setTotalTravel(0)
      return;
    }

    const selectExpense = expenses == "Less than $50" ? 0.75 : expenses == "$51-$100" ? 1 : expenses == "$101-$200" ? 1.5 : expenses == "$201-$300" ? 2 : 4

    const airTravelData = 90 * Number(airTravelTime) * Number(airTravel)
    const carTravelData = Number(carTravel) * Number(carTravelDistance) * 100 * 2 * 0.3
    const trainTravelData = Number(trainTravel) * Number(trainTravelDistance) * 100 * 2 * 0.1
    const otherTravelData = Number(otherTravel) * Number(otherTravelDistance) * 100 * 2 * 0.1
    const expensesData = Number(airTravel + carTravel + trainTravel) * 3 * 5 * selectExpense
    const calc = airTravelData + carTravelData + trainTravelData + expensesData;
    setTotalTravel(calc.toFixed(2) / 1000)
    console.log("only travel", airTravel, airTravelTime, carTravel, carTravelDistance, trainTravel, trainTravelDistance, otherTravel, otherTravelDistance)
    console.log("total total trips", expensesData, selectExpense, expenses, (calc / 1000).toFixed(2))
    // if (
    //   totalCarbon &&
    //   totalCarbon != calc &&
    //   !firstRender.current &&
    //   selectCountry
    // ) {
    //   dataChanged = true;
    //   setWindowBeforeUnload();
    // }

    // if (selectCountry && firstRender.current) firstRender.current = false;

    // calc && setTotalCarbon(calc?.toFixed(2));

    // setAverageCarbon((calc / carbonConsumption.houseHold)?.toFixed(2));
    // setHouseHoldCarbon(
    //   (selectCountry * carbonConsumption.houseHold).toFixed(2)
    // );
    // setPrivateCarbon(
    //   (selectCountry * carbonConsumption.privateTransport * 0.1).toFixed(2)
    // );
    // setPublicCarbon(
    //   (selectCountry * carbonConsumption.publicTransport * 0.1).toFixed(2)
    // );
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
    // <LayoutTwo>
    <>
      <div className="checkout-area space-mb--r130 checkout-width" style={{ border: "1px solid lightgray", width: "690px", padding: "1rem", marginTop: "-1px" }}>
        <div className="calculator--container">
          <div
            className="carbon-calculator"

          >
            <div>
              <div>
                <div className="carbon-calculator-content-from calculator--household-info-holder"></div>

                <div className="mb-40 life-style-section">
                  <div className="lifestyle--section-holder">
                    <div className="work-title-margin">
                      <span className="work-text-title">Travel for Work</span>
                    </div>
                    <div className="d-flex ">
                      <div className="calculator--radio-button-holder">
                        <ButtonGroup
                          aria-label="house"
                          name="travelForWork"
                          className="houseisrent"
                        >

                          <ToggleButton
                            type="radio"
                            checked={travelForWork === "no"}
                            label="Medium"
                            onClick={() =>
                              handleCalculateCarbonTrans("travelForWork", "no")
                            }
                            className={
                              travelForWork === "no"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            No
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            checked={travelForWork === "yes"}
                            label="travelForWork"
                            onClick={() =>
                              handleCalculateCarbonTrans("travelForWork", "yes")
                            }
                            className={
                              travelForWork === "yes"
                                ? "active form-control-label"
                                : "form-control-label"
                            }
                          >
                            Yes
                          </ToggleButton>
                        </ButtonGroup>
                      </div>
                    </div>
                  </div>
                </div>
                {travelForWork === "yes" && (
                  <div className="mb-40 work-title-margin">
                    <span className="work-text-title">Trips per year:</span>
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
                  </div>
                )}



                {travelForWork === "yes" && (

                  <div className="mb-40 work-title-margin">
                    <span className="work-text-title">Num of trips travelled by Airline:</span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={tripsperyear}
                        initValue={airTravel}
                        onChange={travelData}
                        item="airTravel"
                      />
                      <p>{tripsperyear}</p>
                    </div>
                  </div>
                )}
                {travelForWork === "yes" && (
                  <div className="mb-40 work-title-margin" style={{ marginLeft: "40px" }}>
                    <span className="work-text-title">Average hours travelled by Airline:</span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={10}
                        initValue={airTravelTime}
                        onChange={DistanceData}
                        item="airTravelDistance"
                      />
                      <p>10</p>
                    </div>
                  </div>
                )}

                {travelForWork === "yes" && (
                  <div className="mb-40 work-title-margin">
                    <span className="work-text-title">Num of trips travelled by Car:</span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={parseInt(tripsperyear - airTravel)}
                        initValue={carTravel}
                        onChange={travelData}
                        item="carTravel"
                      />

                      <p>{tripsperyear - airTravel}</p>
                    </div>
                  </div>
                )}

                {travelForWork === "yes" && (
                  <div className="mb-40 work-title-margin" style={{ marginLeft: "40px" }}>
                    <span className="work-text-title">Average distance travelled by Car: (in multiples of 100)</span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={10}
                        initValue={carTravelDistance}
                        onChange={DistanceData}
                        item="carTravelDistance"
                      />
                      <p>10</p>
                    </div>
                  </div>
                )}

                {travelForWork === "yes" && (
                  <div className="mb-40 work-title-margin">
                    <span className="work-text-title">
                      Num of trips travelled by Train / Public Transport:
                    </span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={tripsperyear - airTravel - carTravel <= 0 ? 0 : parseInt(tripsperyear - airTravel - carTravel)}
                        initValue={trainTravel}
                        onChange={travelData}
                        item="trainTravel"
                      />

                      <p>{tripsperyear - airTravel - carTravel <= 0 ? 0 : tripsperyear - airTravel - carTravel}</p>
                    </div>
                  </div>
                )}

                {travelForWork === "yes" && (
                  <div className="mb-40 work-title-margin" style={{ marginLeft: "40px" }}>
                    <span className="work-text-title">
                      Average distance travelled by Train / Public
                      Transport: (in multiples of 100)
                    </span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={10}
                        initValue={trainTravelDistance}
                        onChange={DistanceData}
                        item="trainTravelDistance"
                      />

                      <p>{10}</p>
                    </div>
                  </div>
                )}
                {/* 
                {carbonConsumption.travelforWork === "yes" && (
                  <div className="mb-40 people--public-transport-holder">
                    <span>
                      Num of trips travelled by Public Transportation / :
                    </span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={10 - airTravel - carTravel - trainTravel}
                        initValue={publicTravel}
                        onChange={travelData}
                        item="publicTravel"
                      />

                      <p>{10 - airTravel - carTravel - trainTravel}</p>
                    </div>
                  </div>
                )} */}
                {travelForWork === "yes" && (
                  <div className="mb-40 life-style-section">
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
                  </div>
                )}

                {carbonConsumption.travelforWork === "yes" && (
                  <div className="mb-40 people--public-transport-holder">
                    <span>Travel by other modes</span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={
                          tripsperyear - airTravel - carTravel - trainTravel <= 0 ? 0 : parseInt(tripsperyear -
                            airTravel -
                            carTravel -
                            trainTravel)
                        }
                        initValue={otherTravel}
                        onChange={travelData}
                        item="otherTravel"
                      />

                      <p>
                        {tripsperyear - airTravel - carTravel - trainTravel <= 0 ? 0 : tripsperyear -
                          airTravel -
                          carTravel -
                          trainTravel}
                      </p>
                    </div>

                  </div>
                )}
                {carbonConsumption.travelforWork === "yes" && (
                  <div className="mb-40 people--public-transport-holder">
                    <span>Average distance travelled by other modes:: (in multiples of 100)</span>
                    <div className="transport-slider-holder">
                      <p>0</p>
                      <SliderCustom
                        min={0}
                        max={10}
                        initValue={otherTravelDistance}
                        onChange={DistanceData}
                        item="otherTravelDistance"
                      />
                      <p>
                        10
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="carbon-calculator-content-output">
                <div className="main-holder"></div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="carbon-calculator"></div>
    </>

    // </LayoutTwo>
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

export default connect(mapStateToProps, mapDispatchToProps)(Travel);
