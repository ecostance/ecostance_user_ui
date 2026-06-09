import React, { useEffect, useState, useRef } from "react";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import {
  returnCorrectCode,
  returnReverseCode,
} from "src/data/countryCodeToISO3";
import { getCountries } from "src/apiClient/country";
import axios from "axios";
import { BsCloudDownload } from "react-icons/bs";
import { MdCheck, MdContentCopy, MdInfoOutline } from "react-icons/md";
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { QRCode } from "react-qrcode-logo";
import { getBusinessEvent, getBusinessStatsEvent, removeBusinessUser, addBusinessEvent, getSingleBusinessEvent, EditBusinessEvent } from "../../apiClient/business";
import { ButtonGroup, Col, Container, Row, Spinner } from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";
import LezadaBackdrop from "../lezadaBackdrop";
import { Tooltip } from "react-tippy";
import { useMyContext } from "src/Context";
import SliderCustom from "src/components/calculator/slider";
import Switch from "./elements/Switch";
import { interpolateAs } from "next/dist/shared/lib/router/router";
// import AddEventIcon from "src/assets/images/addEventIcon.jsx";
import EditIcon from "public/assets/images/editicon.png";
import EyeIcon from "public/assets/images/eyeicon-grey.svg";
import LeafIcon from "src/assets/images/leafIcon.jsx";
import { useRouter } from "next/router";
import Pagination from "react-js-pagination";
import { IoIosClose, IoIosArrowRoundUp } from 'react-icons/io'
import travel from "src/pages/other/travel";

let toastId;
let link = process.env.NEXT_PUBLIC_UI_URL + "/?conferenceCode=Ram123";
const BusinessEvent = ({
  userData,
  sustainData,
  meData,
  setChangedEmail,
  setShowRecoveryEmailPopup,
  setShowPrimaryEmailPopup,
  sendRecoveryEmailCode,
  sendPrimaryEmailCode,
  emailEditEnabledRef,
  isChangeEmailActive,
  isAttemptLeft
}) => {
  const { addToast, removeAllToasts, removeToast } = useToasts();
  const [socialHover, setSocialHover] = useState("");
  const profileRelatedData = meData?.meData?.data;
  const [currentSlug, setCurrentSlug] = useState({
    isValid: true,
    value: userData?.slug?.slug,
  });
  const [socialMediaData, setSocialMediaData] = useState([]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [qrCode, setQrCode] = useState(
    `${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`
  );
  const [linkHovered, setLinkHovered] = useState(false);
  const [allUsersData, setAllUsersData] = useState([])
  const [shouldAddEvent, setShouldAddEvent] = useState(false)
  const [shouldEditEvent, setShouldEditEvent] = useState(false)
  const [selectEditEvent, setSelectEditEvent] = useState("")
  const [eventType, setEventType] = useState("Conference")
  const [eventStartDate, setEventStartDate] = useState("")
  const [eventEndDate, setEventEndDate] = useState("")
  const [userCountry, setUserCountry] = useState({});
  const [countryCodeISO3, setCountryCodeISO3] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [shouldCallAPI, setShouldCallAPI] = useState(false);
  const [selectCountryRoom, setSelectCountryRoom] = useState();
  const [showCapitalCarbon, setShowCapitalCarbon] = useState();
  const [showCapitalName, setCapitalName] = useState();
  const [totalCarbon, setTotalCarbon] = useState("");
  const [storeCountryShortName, setStoreCountryShortName] = useState("");
  const [selectCountry, setSelectCountry] = useState();
  const [peopleAttending, setPeopleAttending] = useState("over10000people")
  const [venueType, setVenueType] = useState("indoor")
  const firstRender = useRef();
  const [location, setLocation] = useState("")
  const [initialCode, setInitalCode] = useState("")
  const [peopleNum, setPeopleNum] = useState(1)
  const [isGroup, setIsGroup] = useState("no")
  const [conferenceName, setConferenceName] = useState("")
  const [refreshEvents, setRefreshEvents] = useState("")
  const [allEventsData, setAllEventsData] = useState([])
  const [singleEvent, setSingleEvent] = useState("")
  const [totalEventEmissions, setTotalEventEmissions] = useState(0)
  const [totalVenueEmissions, setTotalVenueEmissions] = useState(0)
  const [totalTravelEmissions, setTotalTravelEmissions] = useState(0)
  const [totalFoodEmissions, setTotalFoodEmissions] = useState(0)
  const [totalLodgingEmissions, setTotalLodgingEmissions] = useState(0)
  const [totalWasteEmissions, setTotalWasteEmissions] = useState(0)
  const [totalSalesEmissions, setTotalSalesEmissions] = useState(0)
  const [totalPeople, setTotalPeople] = useState(0)
  const [theAvgUserEmission, setTheAvgUserEmission] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [saveEventCalculation, setSaveEventCalculation] = useState(0)
  const [saveVenueCalculation, setSaveVenueCalculation] = useState(0)
  const [saveTravelCalculation, setSaveTravelCalculation] = useState(0)
  const [saveFoodCalculation, setSaveFoodCalculation] = useState(0)
  const [saveLodgingCalculation, setSaveLodgingCalculation] = useState(0)
  const [saveWastelCalculation, setSaveWasteCalculation] = useState(0)
  const [saveSalesCalculation, setSaveSalesCalculation] = useState(0)
  const [perAttendieCalculation, setPerAttendieCalculation] = useState(0)
  const [totalEmissionPerAttendie, setTotalEmissionPerAttendie] = useState(0)
  const [openGroupModal, setOpenGroupModal] = useState(false)
  const [saveAttendie, setSaveAttendie] = useState(29)
  const [eventView, setEventView] = useState("individual")
  const slugInputRef = useRef(null);
  const [inputSlugSelected, setInputSlugSelected] = useState(false);
  const [initSlug, setInitSlug] = useState("")
  const [eventSwitch, setEventSwitch] = useState(false)
  const [searchEvent, setSearchEvent] = useState("")
  const [haveGroups, setHaveGroups] = useState("no")
  const [selectedGroup, setSelectedGroup] = useState("designer")
  const [ghgData, setGhgData] = useState("")
  const [totalGHGDataCount, setTotalGHGDataCount] = useState(0);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [openModal, setOpenModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState("")
  const [allEventStats, setAllEventStats] = useState([])
  const [activePage, setActivePage] = useState(1);
  const [count, setCount] = useState("")
  const [yearlyEvents, setYearlyEvents] = useState([])
  const [selectedYearlyEvent, setSelectedYearlyEvent] = useState("")
  const [yearlyActivePage, setYearlyActivePage] = useState(1)
  const [yearlyCount, setYearlyCount] = useState(15)
  const [openQr, setOpenQr] = useState(false)
  const router = useRouter();


  function addCommas(number) {
    // Convert number to string and add commas
    let formattedNumber = number?.toLocaleString('en-US');

    // Replace the comma for lakhs with double comma
    formattedNumber = formattedNumber?.replace(/,(?=\d{3},)/g, ',');

    // Split the number into integer and decimal parts
    let parts = formattedNumber?.split('.');
    let integerPart = parts?.[0];
    let decimalPart = parts?.length > 1 ? '.' + parts?.[1].slice(0, 2) : '';

    // Concatenate integer and truncated decimal parts
    formattedNumber = parseInt(number) > 100 ? integerPart : integerPart + decimalPart;

    return formattedNumber;
  }

  // const { refetchBusiness, setRefetchBusiness } = useMyContext();

  useEffect(() => {
    previewEvent()
  }, [eventType, eventStartDate, eventEndDate, peopleAttending, venueType, peopleNum, isGroup, selectCountry]);

  useEffect(() => {
    if (inputSlugSelected) slugInputRef.current.focus();
  }, [inputSlugSelected]);





  let venueSingle = singleEvent?.carbonCalculations?.venueCarbonEmission ? singleEvent?.carbonCalculations?.venueCarbonEmission : totalVenueEmissions?.toFixed(2)
  let travelSingle = singleEvent?.carbonCalculations?.travel ? singleEvent?.carbonCalculations?.travel : totalTravelEmissions?.toFixed(2)
  let foodSingle = singleEvent?.carbonCalculations?.food ? singleEvent?.carbonCalculations?.food : totalFoodEmissions?.toFixed(2)
  let lodgingSingle = singleEvent?.carbonCalculations?.lodging ? singleEvent?.carbonCalculations?.lodging : totalLodgingEmissions?.toFixed(2)
  let wasteSingle = singleEvent?.carbonCalculations?.Waste ? singleEvent?.carbonCalculations?.Waste : totalWasteEmissions?.toFixed(2)
  let salesSingle = singleEvent?.carbonCalculations?.salesMarketing ? singleEvent?.carbonCalculations?.salesMarketing : totalSalesEmissions?.toFixed(2)
  let perAttendieSingle = singleEvent?.carbonCalculations?.per_attendee ? singleEvent?.carbonCalculations?.per_attendee : totalEmissionPerAttendie?.toFixed(2)

  let doughnutData = {
    labels: ["Per Attendee", "Venue", "Lodging", "Travel", "Food & Snacks", "Waste"],
    // displayText: ['venue ', 'travel', 'food & snacks', 'lodging', 'waste', "sales & marketing"],
    datasets: [
      {
        data: [perAttendieSingle, venueSingle, lodgingSingle, travelSingle, foodSingle, wasteSingle],
        backgroundColor: ['rgba(228 , 231, 246, 1)', 'rgba(189 , 232, 239, 1)', 'rgba(117 , 177, 120, 0.5)', 'rgba(236 , 155, 170, 0.5)', 'rgba(236 , 155, 170, 0.5)', 'rgba(150 , 155, 170, 0.5)'],
      },
    ],
  };

  let countryCode



  useEffect(() => {
    userCountry.code &&
      countryList.length > 0 &&
      handleSelectCountry_1({ target: { value: userCountry.code } });
  }, [countryList, userCountry]);

  useEffect(() => {
    getEventDetails()
    getYearlyEvents()
  }, [refreshEvents, activePage, setActivePage]);

  let limit = 15
  const pageRangeDisplayed = 5;

  let Yearlylimit = 15
  const pageYearlyRangeDisplayed = 5;

  const handlePageChange = (pageNumber) => {
    console.log(`Active page is ${pageNumber}`);
    setActivePage(pageNumber);
  };


  function sumByKey(array, key) {
    let sum = 0;
    for (let i = 0; i < array?.length; i++) {
      if (array[i].carbonCalculations?.hasOwnProperty(key)) {
        const value = parseFloat(array[i].carbonCalculations[key]); // Convert string to number
        sum += isNaN(value) ? 0 : value; // Check if it's NaN, if so, add 0
      }
    }
    return sum;
  }

  function totalByKey(array, key) {
    let sum = 0;
    for (let i = 0; i < array?.length; i++) {
      if (array[i].hasOwnProperty(key)) {
        const value = parseFloat(array[i][key]); // Convert string to number
        sum += isNaN(value) ? 0 : value; // Check if it's NaN, if so, add 0
      }
    }
    return sum;
  }

  function mergeArrays(arr1, arr2, key) {
    // Create a map for quick lookup
    const map = new Map(arr1.map(item => [item[key], item]));

    // Iterate through the second array
    arr2.forEach(item2 => {
      const keyValue = item2[key];
      if (map.has(keyValue)) {
        // Merge objects if the key exists in arr1
        Object.assign(map.get(keyValue), item2);
      } else {
        // Add new object if the key does not exist in arr1
        arr1.push(item2);
      }
    });

    return arr1;
  }

  const calculateTotal = (property, eventData) => {
    let total = 0;
    for (let event of eventData) {
      console.log(parseFloat(event[property])?.toFixed(2), "fieldss")
      total += parseFloat(event[property]);
    }
    console.log(total, "totall")
    return total;
  }


  const getEventDetails = async () => {
    let theEvents = await getBusinessEvent(activePage, limit)
    if (theEvents?.data?.success) {
      setCount(theEvents?.data?.metadata?.count)
      console.log(theEvents?.data?.data, "eventStats")
      setAllEventsData(theEvents?.data?.data)
      // if (eventStats.data.data[0].eventDetail.length > 0) {
      //   const mergedArray = mergeArrays(theEvents?.data?.data, eventStats.data.data[0].eventDetail, 'conferanceCode');
      //   console.log(mergedArray, "mergedArrayData")
      // }

      const venueKey = 'venueCarbonEmission';
      const travelKey = 'travel';
      const salesKey = 'salesMarketing';
      const lodgingKey = 'lodging';
      const foodKey = 'food';
      const wasteKey = 'Waste';
      const perAttendieKey = 'per_attendee';
      const totalKey = 'conferanceSize'
      const userEmission = 'estimatedCarbonEmissionsPerUser'
      console.log(theEvents?.data?.data, "AllEvents")
      // setAllEventsData(theEvents?.data?.data)
      const totalvenueData = sumByKey(theEvents?.data?.data, venueKey);
      const totaltravelData = sumByKey(theEvents?.data?.data, travelKey);
      const totalsalesData = sumByKey(theEvents?.data?.data, salesKey);
      const totalfoodData = sumByKey(theEvents?.data?.data, foodKey);
      const totalwasteData = sumByKey(theEvents?.data?.data, wasteKey);
      const totallodgingData = sumByKey(theEvents?.data?.data, lodgingKey);
      const totalPerAttendieData = sumByKey(theEvents?.data?.data, perAttendieKey);
      const totalConferencePeople = totalByKey(theEvents?.data?.data, totalKey);
      const totalEmissions = theEvents?.data?.data?.[0]?.carbonCalculations?.Waste +
        theEvents?.data?.data?.[0]?.carbonCalculations?.food +
        theEvents?.data?.data?.[0]?.carbonCalculations?.lodging +
        theEvents?.data?.data?.[0]?.carbonCalculations?.salesMarketing +
        theEvents?.data?.data?.[0]?.carbonCalculations?.travel +
        theEvents?.data?.data?.[0]?.carbonCalculations?.venueCarbonEmission
      const avgUserEmission = sumByKey(theEvents?.data?.data, userEmission) / (theEvents?.data?.data.length);
      setTotalVenueEmissions(totalvenueData)
      setTotalTravelEmissions(totaltravelData)
      setTotalFoodEmissions(totalfoodData)
      setTotalSalesEmissions(totalsalesData)
      setTotalWasteEmissions(totalwasteData)
      setTotalLodgingEmissions(totallodgingData)
      setTotalPeople(totalConferencePeople)
      setTotalEmissionPerAttendie(totalPerAttendieData)
      setTheAvgUserEmission(avgUserEmission)
      setTotalEventEmissions(totalvenueData + totaltravelData + totalsalesData + totalfoodData + totalwasteData + totallodgingData)
      setSingleEvent({ ...theEvents?.data?.data?.[0], totalEmissions })
      console.log("totalVenue", totalvenueData)
    }
  }

  const getYearlyEvents = async () => {
    let eventStats = await getBusinessStatsEvent(yearlyActivePage, Yearlylimit)
    if (eventStats?.data?.success && eventStats?.data?.data?.length > 0) {
      let totalVenueEmissions = calculateTotal('venueCarbonEmission', eventStats?.data?.data?.[0]?.eventDetail);
      let totalLodge = calculateTotal('lodging', eventStats?.data?.data?.[0]?.eventDetail);
      let totalTravel = calculateTotal('travel', eventStats?.data?.data?.[0]?.eventDetail);
      let totalSalesMarketing = calculateTotal('salesMarketing', eventStats?.data?.data?.[0]?.eventDetail);
      let totalFood = calculateTotal('food', eventStats?.data?.data?.[0]?.eventDetail);
      let totalWaste = calculateTotal('Waste', eventStats?.data?.data?.[0]?.eventDetail);


      let theTotalEmission = totalVenueEmissions + totalLodge + totalTravel + totalSalesMarketing + totalFood + totalWaste
      setYearlyEvents(eventStats?.data?.data)
      setSelectedYearlyEvent({ ...eventStats?.data?.data?.[0], theTotalEmission })
    }
    console.log(eventStats?.data?.data, "yearlyy")
  }

  const convertISOToDate = (isoString) => {
    // Create a new Date object from the ISO string
    var date = new Date(isoString);

    // Get the day, month, and year
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    // Return the formatted date
    return year + "-" + month + "-" + day;
  }

  const fetchSelectedEvent = async (code) => {
    let eventSelected = await getSingleBusinessEvent(code)
    if (eventSelected?.data?.success) {
      console.log(eventSelected?.data?.data, "dataaa")
      let fetchedEventData = eventSelected?.data?.data?.[0]
      setSelectEditEvent(eventSelected?.data?.data)
      setConferenceName(fetchedEventData?.conferanceName)
      setEventType(fetchedEventData?.conferanceType)
      setEventStartDate(convertISOToDate(fetchedEventData?.conferanceStartDate))
      setEventEndDate(convertISOToDate(fetchedEventData?.conferanceEndDate))
      fetchedEventData?.conferanceSize == 10000 ? setPeopleAttending("over10000people") : fetchedEventData?.conferanceSize == 7500 ? setPeopleAttending("5000-9999") :
        fetchedEventData?.conferanceSize == 3000 ? setPeopleAttending("1000-4999") :
          fetchedEventData?.conferanceSize == 300 ? setPeopleAttending("100-499") :
            fetchedEventData?.conferanceSize == 65 ? setPeopleAttending("30-99") :
              setPeopleAttending("2-29")
      setLocation(fetchedEventData?.location)
      setVenueType(fetchedEventData?.venueType)
      fetchedEventData?.hasExhibitor ? setIsGroup("yes") : setIsGroup("no")
    }
  }

  const emptyFields = () => {
    setConferenceName("")
    setEventType("Conference")
    setEventStartDate("")
    setEventEndDate("")
    setPeopleAttending("over10000people")
    setLocation("")
    setVenueType("indoor")
    setIsGroup("no")
  }
  useEffect(() => {
    getCountryList();
    // if (props?.carbonCalculations?.carbonCalculations?.countryCode) {
    //   return setUserCountry({
    //     code: props?.carbonCalculations?.carbonCalculations?.countryCode,
    //   });
    // }
    // if (props?.circleSliderData?.countryCode) {
    //   return setUserCountry({
    //     code: props?.circleSliderData?.countryCode,
    //   });
    // }
    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        setUserCountry({
          name: res.data.country_name,
          code: res.data.country_code_iso3,
        });
        setInitalCode(res.data.country_code.toLowerCase())
      })
      .catch((data, status) => {
        console.log("Request failed:", data);
      });
  }, []);

  useEffect(() => {
    if (firstRender?.current) return;
    if (countryCodeISO3 || storeCountryShortName) {
      countryCode = countryCodeISO3 || storeCountryShortName;
    }
  }, [totalCarbon, countryCodeISO3]);


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
    setSelectCountryRoom(Number(countryShortName.carbonCountryRoomStayPerCapita));

    setShowCapitalCarbon(Number(countryShortName.carbonCountryPerCapita));
    setCapitalName(countryShortName.entity);
  };

  const handleSelectCountry = (e) => {
    console.log("theCode", e.target.value.toLocaleLowerCase())
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
    setSelectCountryRoom(Number(countryShortName.carbonCountryRoomStayPerCapita));

    setShowCapitalCarbon(Number(countryShortName.carbonCountryPerCapita));
    setCapitalName(countryShortName.entity);
  };


  const handleMakePublic = () => {
    setSingleEvent("")
    setEventSwitch((prev) => !prev);
    console.log(eventSwitch, "switch")
    if (!eventSwitch) {
      getEventDetails()
    }
  };

  const groupModalSelect = (item, theTotalEmission) => {
    console.log(openGroupModal, "modalselect")
    setSelectedYearlyEvent({ ...item, theTotalEmission })
    handleMakePublic();
  }




  const options = {
    maintainAspectRatio: false, // This option maintains the chart's aspect ratio
    responsive: true,
    width: 300, // Custom width
    height: 300, // Custom height
    plugins: {
      legend: {
        display: true,
        position: 'right',
        align: 'center',
        labels: {
          fontColor: 'black',
        },
      },
      legend: {
        position: 'right',
        labels: {
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map(function (label, i) {
                const value = data.datasets[0].data[i];
                return {
                  text: label + ': ' + value,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: isNaN(value),
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
    },

  };

  let BusinessDetails = localStorage.getItem("MyBusinessDetails")

  useEffect(() => {
    axios
      .get(`https://wp.marketsverse.com/wp-json/wp/v2/socialmessage`)
      .then(({ data }) => {
        console.log(data, "social media data");
        setSocialMediaData(data);
      });
  }, []);
  // useEffect(() => {
  //   getAllUsers();
  // }, [])

  // const getAllUsers = async () => {
  //   let usersData = await getAllUsersForMyBusiness()
  //   if (usersData.data.success) {

  //     setAllUsersData(usersData.data.data)
  //     const owners = usersData.data.data.filter(user => user.role === 'owner');
  //     setAllOwners(owners)
  //     const superadmins = usersData.data.data.filter(user => user.role === 'superadmin');
  //     setAllSuperAdmins(superadmins)
  //     const admins = usersData.data.data.filter(user => user.role === 'admin');
  //     setAllAdmins(admins)
  //     const users = usersData.data.data.filter(user => user.role === 'user');
  //     setAllUsers(users)
  //   }
  //   console.log(usersData.data.data)
  // }

  // GHG Data fetching using Api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await getBusinessStatsEvent(1, 255);
    const { data } = response.data;
    console.log(data, "yearlydata")
    setGhgData(data);
    let ghgCount = 0;
    let userCount = 0;

    data.forEach(event => {
      console.log(event, "valueee")
      ghgCount += event?.totalAnnualghgReduced;
      userCount += event?.uniqueUserCount;
    });

    setTotalGHGDataCount(ghgCount);
    setTotalUserCount(userCount);
  };



  // console.log(ghgData,"GHG DATA SET on variable")

  // function to get ghg reduced for particular event

  const particularEventGhgReduced = () => {
    if (ghgData && ghgData.length > 0 && singleEvent) {
      const eventData = ghgData[0].eventDetail.filter(e => e.conferanceCode == singleEvent.conferanceCode)
      if (eventData) {
        return eventData[0].orderDetail.totalghgReduced
      }
    }
    return 0;
  };

  // function to get user count for particular event

  const particularEventUsers = () => {
    if (ghgData && ghgData.length > 0 && singleEvent) {
      const eventData = ghgData[0].eventDetail.filter(e => e.conferanceCode == singleEvent.conferanceCode)
      if (eventData) {
        return eventData[0].orderDetail.userCount
      }
    }
    return 0;
  };

  // Function to send userCount for each event

  const usersCalculatedCF = (e) => {
    if (ghgData && ghgData.length > 0 && e?.conferanceCode) {
      const eventData = ghgData[0].eventDetail.filter(event => event.conferanceCode == e?.conferanceCode)
      if (eventData) {
        return eventData[0].orderDetail.userCount
      }
    }
    return 0;
  }

  // function for the badges

  const badgeColorCode = (userCount, conferanceSize, index) => {
    const attendancePercentage = (userCount / conferanceSize) * 100;

    if (index === 1) {
      return <>
        <div className="badges" ><LeafIcon color={"#FFFFCC"} /></div>
        <div className="badges" ><LeafIcon color={"#b2e26a"} /></div>
        <div className="badges" ><LeafIcon color={"#8fd848"} /></div>
        <div className="badges" ><LeafIcon color={"#7fc112"} /></div>
        <div className="badges" ><LeafIcon color={"#38a000"} /></div>
      </>

    }

    else if (index === 2) {
      return <>
        <div className="badges" ><LeafIcon color={"#FFFFCC"} /></div>
        <div className="badges" ><LeafIcon color={"#b2e26a"} /></div>
        <div className="badges" ><LeafIcon color={"#8fd848"} /></div>
        <div className="badges" ><LeafIcon color={"#7fc112"} /></div>
        {/* <div className="badges" ><LeafIcon color={"#38a000"}/></div> */}
      </>
    }
    else if (index === 3) {
      return <>
        <div className="badges" ><LeafIcon color={"#FFFFCC"} /></div>
        <div className="badges" ><LeafIcon color={"#b2e26a"} /></div>
        <div className="badges" ><LeafIcon color={"#8fd848"} /></div>
        {/* <div className="badges" ><LeafIcon color={"#7fc112"}/></div>
       <div className="badges" ><LeafIcon color={"#38a000"}/></div> */}
      </>
    }
    else if (index === 4) {
      return <>
        <div className="badges" ><LeafIcon color={"#FFFFCC"} /></div>
        <div className="badges" ><LeafIcon color={"#b2e26a"} /></div>
        {/* <div className="badges" ><LeafIcon color={"#8fd848"}/></div>
       <div className="badges" ><LeafIcon color={"#7fc112"}/></div>
       <div className="badges" ><LeafIcon color={"#38a000"}/></div> */}
      </>
    }
    else if (index === 5) {
      return <>
        <div className="badges" ><LeafIcon color={"#FFFFCC"} /></div>
        {/* <div className="badges" ><LeafIcon color={"#b2e26a"}/></div>
       <div className="badges" ><LeafIcon color={"#8fd848"}/></div>
       <div className="badges" ><LeafIcon color={"#7fc112"}/></div>
       <div className="badges" ><LeafIcon color={"#38a000"}/></div> */}
      </>
    }
    else {
      return null
    }
  }

  // modal for view details

  const EventDetailsModal = ({ selectedEvent, closeModal }) => {
    return (
      <div className="change--email--wrapper" >
        <div className="table--popup">
          <div className="table--form" style={{ width: "50vw", height: "50vh", marginTop: "-75px" }}>
            <div className="popup--head">
              <div className="popup--title">Event Details</div>
              <button
                className="cart-overlay__close-icon"
                onClick={() => {
                  closeModal(false)
                  setSelectedEvent("")
                }}
              >
                <IoIosClose />
              </button>
              {/* <div className="popup--close"
                onClick={() => {
                  closeModal(false)
                  setSelectedEvent("")
                }}
              >X</div> */}
            </div>
            <hr />
            <br />
            <div className="business--link--head">
              <h5>Share or Scan this link with users so they can be part of the event</h5>
            </div>
            <div className="business--link--text" style={{ marginTop: "10px" }}>
              <div>
                Your Event Link :{" "}
                <a
                  href={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
                  style={{ textDecoration: "underline" }}
                  target="_blank"
                >
                  {process.env.NEXT_PUBLIC_UI_URL}?conferenceCode={singleEvent?.conferanceCode}
                </a>
              </div>
              <div
                className="sustainability--information-holder"
              >

                <Tooltip
                  className="iconHover"
                  title="Product Link"
                  position="bottom"
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
                    }}
                  />
                </Tooltip>

                {/* <div className="sustainability--information-box">
                                              This is your EcoStance Page web site link that can be
                                              advertised by you and/or your company on your own web
                                              site, your social media profiles, your social media
                                              posts, so that your friends and customers can access
                                              this link directly from anywhere
                                            </div> */}
              </div>
              <Tooltip
                className="iconHover"
                title="Copy Event Link"
                position="top"
                trigger="mouseenter"
                animation="shift"
                arrow={true}
                duration={200}
              // style={{ marginTop: "15px" }}
              >
                {!copied ? (
                  <MdContentCopy
                    onClick={(e) =>
                      handleCopy(
                        `${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`
                      )
                    }
                    style={{
                      pointerEvents: "all",
                      width: "18px",
                      height: "18px",
                      // marginLeft: "15px",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <div className="iconHover">
                    <MdCheck
                      style={{
                        pointerEvents: "all",
                        width: "18px",
                        height: "18px",
                        marginLeft: "-15px",
                        cursor: "pointer",
                        color: "green",
                      }}
                    />
                  </div>
                )}
              </Tooltip>
              <Tooltip
                className="iconHover"
                title="Download QR Code"
                position="right"
                trigger="mouseenter"
                animation="shift"
                arrow={true}
                duration={200}
              // style={{ marginTop: "15px" }}
              >
                {!downloading ? (
                  <BsCloudDownload
                    onClick={(e) => downloadCode("eventQrID")}
                    style={{
                      pointerEvents: "all",
                      width: "18px",
                      height: "18px",
                      // marginLeft: "15px",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <Spinner
                    animation="border"
                    variant="success"
                    style={{
                      width: "18px",
                      height: "18px",
                      // marginLeft: "15px",
                      borderWidth: "2px",
                    }}
                  />
                )}
              </Tooltip>
              <div style={{ display: "none" }}>
                <QRCode
                  value={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
                  size={400}
                  logoImage="/assets/images/ecostance-qr-logo.png"
                  qrStyle="squares"
                  enableCORS={true}
                  id={"eventQrID"}
                />
              </div>

            </div>
            <br />
            <div className="qrbox" style={{ marginLeft: "10px", width: "125px", margin: "auto" }}>

              {/* <div className="tracetext">Traceable</div> */}
              <div class="rotated-text">
                {singleEvent?.conferanceName?.slice(0, 13)}
              </div>
              <QRCode
                value={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
                logoImage="/assets/images/ecostance-qr-logo.png"
                size={100}

              />
              <p style={{ textAlign: "center", marginTop: "-7px" }}>{singleEvent?.conferanceCode}</p>
            </div>
            <br />
            <br />
            <div className="popup--form">
              <div className="select--title">Event Name</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.conferanceName}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Event Code</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.conferanceCode}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Event Location</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.location}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Event Type</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.venueType}</div>
            </div>
            <hr />
            <div className="popup--head">
              <div className="popup--title">Carbon Calculations</div>
            </div>
            <hr />
            <div className="popup--form">
              <div className="select--title">Waste</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.carbonCalculations?.Waste}</div>
            </div>
            {/* <div className="popup--form">
              <div className="select--title">Estimated Carbon Emissions Per Exhibitor</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.carbonCalculations?.estimatedCarbonEmissionsPerExhibitor}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Estimated Carbon Emissions Per User</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.carbonCalculations?.estimatedCarbonEmissionsPerUser}</div>
            </div> */}
            <div className="popup--form">
              <div className="select--title">Food</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.carbonCalculations?.food}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Lodging</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.carbonCalculations?.lodging}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Sales Marketing</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.carbonCalculations?.salesMarketing}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Travel</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.carbonCalculations?.travel}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Venue Carbon Emission</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.carbonCalculations?.venueCarbonEmission}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Total Emission</div>
              <div>:</div>
              <div className="select--value">{selectedEvent?.totalEmissions}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const EventDetailsYearlyModal = ({ selectedYearlyEvent, closeYearlyModal }) => {
    // let totalVenueEmissions = calculateTotal('venueCarbonEmission', selectedYearlyEvent?.eventDetail)?.toFixed(2);
    // let totalLodge = calculateTotal('lodging', selectedYearlyEvent?.eventDetail)?.toFixed(2);
    // let totalTravel = calculateTotal('travel', selectedYearlyEvent?.eventDetail)?.toFixed(2);
    // let totalSalesMarketing = calculateTotal('salesMarketing', selectedYearlyEvent?.eventDetail)?.toFixed(2);
    // let totalFood = calculateTotal('food', selectedYearlyEvent?.eventDetail)?.toFixed(2);
    // let totalWaste = calculateTotal('Waste', selectedYearlyEvent?.eventDetail)?.toFixed(2);
    return (
      <div className="change--email--wrapper" >
        <div className="table--popup">
          <div className="table--form" style={{ width: "50vw", height: "50vh", marginTop: "-75px" }}>
            <div className="popup--head">
              <div className="popup--title">Yearly Event Details</div>
              <button
                className="cart-overlay__close-icon"
                onClick={() => {
                  closeYearlyModal(false)
                  // setSelectedYearlyEvent("")
                }}
              >
                <IoIosClose />
              </button>
              {/* <div className="popup--close"
                onClick={() => {
                  closeModal(false)
                  setSelectedEvent("")
                }}
              >X</div> */}
            </div>
            <hr />
            <br />
            <div className="popup--form">
              <div className="select--title">Total Events</div>
              <div>:</div>
              <div className="select--value">{selectedYearlyEvent?.eventCount}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Total Emissions</div>
              <div>:</div>
              <div className="select--value">{addCommas(selectedYearlyEvent?.theTotalEmission)}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Total Users</div>
              <div>:</div>
              <div className="select--value">{addCommas(selectedYearlyEvent?.userAttended)}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Total GHG Reduced</div>
              <div>:</div>
              <div className="select--value">{addCommas(selectedYearlyEvent?.totalAnnualghgReduced)}</div>
            </div>

            <br />
            <div className="popup--head">
              <div className="popup--title">Carbon Calculations</div>
            </div>
            <hr />
            <div className="popup--form">
              <div className="select--title">Waste</div>
              <div>:</div>
              <div className="select--value">{calculateTotal('Waste', selectedYearlyEvent?.eventDetail)?.toFixed(2)}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Food</div>
              <div>:</div>
              <div className="select--value">{calculateTotal('food', selectedYearlyEvent?.eventDetail)?.toFixed(2)}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Lodging</div>
              <div>:</div>
              <div className="select--value">{calculateTotal('lodging', selectedYearlyEvent?.eventDetail)?.toFixed(2)}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Travel</div>
              <div>:</div>
              <div className="select--value">{calculateTotal('travel', selectedYearlyEvent?.eventDetail)?.toFixed(2)}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Venue Carbon Emission</div>
              <div>:</div>
              <div className="select--value">{calculateTotal('venueCarbonEmission', selectedYearlyEvent?.eventDetail)?.toFixed(2)}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Total Emission</div>
              <div>:</div>
              <div className="select--value">{selectedYearlyEvent?.theTotalEmission?.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };



  const handleCopy = (url) => {
    setCopied(true);
    navigator.clipboard.writeText(url);
    addToast("Link copied to clipboard", {
      appearance: "success",
      autoDismiss: true,
    });
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    if (profileRelatedData) {
      console.log(profileRelatedData, "ljkwhckjwlebdwed");
    }
  }, [profileRelatedData]);

  const downloadCode = async (id) => {
    console.log(id, "idd");
    setDownloading(true);

    const canvas = document.getElementById(id);
    if (canvas) {
      await document.fonts.ready;

      // Get QR code dimensions
      const qrCodeWidth = canvas.width;
      const qrCodeHeight = canvas.height;
      const textHeight = 50; // Space for text below the QR code
      const additionalWidth = 50; // Space for "100%" on the left

      // Set combined canvas dimensions
      const combinedCanvas = document.createElement("canvas");
      combinedCanvas.width = qrCodeWidth + additionalWidth; // Add space for "100%" on the left
      combinedCanvas.height = qrCodeHeight + textHeight + 20; // QR code + bottom text

      const ctx = combinedCanvas.getContext("2d");

      // Draw a white background for the entire canvas
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      // Draw the QR code on the canvas
      ctx.drawImage(canvas, additionalWidth, 20, qrCodeWidth, qrCodeHeight);

      const fontFamily = "Work Sans, Arial, sans-serif";
      const fontSize = 18;

      // Add rotated "100%" text on the left side
      ctx.save();
      const textOne = singleEvent?.conferanceName?.slice(0, 13);

      // Position for the rotated "100%" text
      const rotationX = additionalWidth / 2; // Center the text in the left margin
      const rotationY = qrCodeHeight / 2 + 20; // Vertically center the text alongside the QR code

      // Rotate and draw the text
      ctx.translate(rotationX, rotationY); // Move to the center of the text
      ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise

      // Draw white background matching the QR code width
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(
        -qrCodeWidth / 2, // Center the background horizontally
        -fontSize / 2 - 5, // Add padding for vertical centering
        qrCodeWidth, // Match the QR code width
        fontSize + 10 // Background height with padding
      );

      // Render the "100%" text
      ctx.fillStyle = "#000000";
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center"; // Center-align the text within the background
      ctx.fillText(textOne, 0, fontSize / 2); // Render the text at the center
      ctx.restore();

      // Add white padding below QR code for text
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(additionalWidth, qrCodeHeight + 20, qrCodeWidth, textHeight);

      // Add text below the QR code
      ctx.font = "20px Work Sans, Arial, sans-serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText(
        singleEvent?.conferanceCode,
        qrCodeWidth / 2 + additionalWidth,
        qrCodeHeight + 55
      );

      // Generate the PNG and trigger the download
      const pngUrl = combinedCanvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `ecostance.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setTimeout(() => {
        setDownloading(false);
      }, 2000);
    }
  };







  let userBusinessCode = JSON.parse(BusinessDetails)?.businessCode
  let businessId = localStorage.getItem("businessId")

  const removeUser = async (item) => {
    let body = {
      user_id: item?._id
    }
    const removeBusiness = await removeBusinessUser(item?.businessId, body)
    console.log(item?.businessId, removeBusiness, "remove-business")

    if (removeBusiness?.data?.success) {
      addToast("User removed from business successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      window.location.reload();
    } else {
      addToast(removeBusiness?.data?.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }

    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  const getDisplayDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const suffix = getOrdinalSuffix(day);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return formattedDate.replace(/\d+/, `${day}`);
  }

  const getDisplayDateRange = (startDate, endDate) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const startDay = String(start.getDate()).padStart(2, '0');
    const startYear = start.getFullYear();
    if (!end) return `${startMonth} ${startDay}, ${startYear}`;
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const endDay = String(end.getDate()).padStart(2, '0');
    const endYear = end.getFullYear();
    if (startMonth === endMonth && startYear === endYear) {
      return `${startMonth} ${startDay}-${endDay}, ${startYear}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
  }

  const toPurchase = (item, eventCode, eventId) => {
    localStorage.setItem("conferenceCode", eventCode)
    localStorage.setItem("BusinessOrderSelection", "yes")
    localStorage.setItem("eventOwnerOrder", true)
    // localStorage.setItem("userEventId", eventId)
    console.log(eventId, "codee")
    item = Math.ceil(item)
    localStorage.setItem("carbonroute", "eventOffset")
    router.push({
      pathname: "/circular",
      query: { tons: item },
    });
  }


  const MemberDetails = ({ theData, theNum }) => {

    return (
      <>
        {allEventsData.map((e, index) => {
          let venueData = e.carbonCalculations?.venueCarbonEmission ? e.carbonCalculations?.venueCarbonEmission : "0"
          console.log(venueData, "venuee")
          let totalEmissions = parseFloat(e?.carbonCalculations?.venueCarbonEmission) + parseFloat(e?.carbonCalculations?.lodging) + parseFloat(e?.carbonCalculations?.travel) + parseFloat(e?.carbonCalculations?.salesMarketing) + parseFloat(e?.carbonCalculations?.food) + parseFloat(e?.carbonCalculations?.Waste)
          console.log(totalEmissions, "totalEmissions")
          let leafColor
          let leafpercentage = e?.totalghgReduced != 0 ? Math.ceil(parseFloat(e?.totalghgReduced / totalEmissions) * 100) : 0
          if (leafpercentage <= 20) {
            leafColor = "#FFFFCC"
          } else if (leafpercentage > 20 && leafpercentage <= 40) {
            leafColor = "#b2e26a"
          } else if (leafpercentage > 40 && leafpercentage <= 60) {
            leafColor = "#8fd848"
          } else if (leafpercentage > 60 && leafpercentage <= 80) {
            leafColor = "#7fc112"
          } else {
            leafColor = "#38a000"
          }
          console.log(leafpercentage, leafColor, "percentt")
          console.log(e?.users.includes(e?.eventOwnerOrder?.user_id), "includes")
          return <>
            <div className="event--table--data" style={{ cursor: "pointer", background: e?.conferanceCode === singleEvent?.conferanceCode ? "#eeeeee" : 'white', borderLeft: e?.conferanceCode === singleEvent?.conferanceCode ? "3px solid #bdbdbd" : "3px solid transparent" }} onClick={() => setSingleEvent({ ...e, totalEmissions })}>
              <div className="event-head-padding" style={{ width: "40px" }}>{theNum + index + 1 + activePage * limit - limit}.</div>
              <div className="event-head-padding" style={{ width: "120px" }}>{e?.conferanceCode}</div>
              <div className="event-head-padding" >{e?.conferanceName}</div>
              <div className="event-head-padding" >{e?.location}</div>
              <div className="event-head-padding event-justify-center" style={{ width: "230px" }}>{getDisplayDate(e?.conferanceStartDate)} - {getDisplayDate(e?.conferanceEndDate)}</div>
              <div className="event-head-padding event-justify-center">{isNaN(totalEmissions) ? "0" : addCommas(totalEmissions)}</div>
              <div className="event-head-padding event-justify-center">{addCommas(e?.conferanceSize)}</div>
              <div className="event-head-padding event-justify-center">{e?.users.includes(e?.eventOwnerOrder?.user_id) ? addCommas(e?.userCount - 1) : addCommas(e?.userCount)}</div>
              <div className="event-head-padding event-justify-center">{addCommas(e?.totalghgReduced)}</div>
              <div className="event-head-padding event-justify-center">{totalEmissions - e?.totalghgReduced > 0 ? addCommas(totalEmissions - e?.totalghgReduced) : 0}</div>
              <div className="event-head-padding event-justify-center"><button className="purchaseBtn" onClick={() => toPurchase(totalEmissions - e?.totalghgReduced, e?.conferanceCode, e?._id)}>Purchase</button></div>
              {/* <div className="event-head-padding">{e?.eventOwnerOrder?.userghgReduced ? e?.eventOwnerOrder?.userghgReduced : 0}</div> */}
              {/* <div className="event-head-padding">{addCommas(totalEmissions - e?.totalghgReduced - (e?.eventOwnerOrder?.userghgReduced ? e?.eventOwnerOrder?.userghgReduced : 0))}</div> */}
              <div className="event-head-padding event-justify-center"><LeafIcon color={leafColor} /></div>
              <div className="event-head-padding event-justify-center"><img src="/images/qr-code-img.png" alt="qrcode" width="25px" onClick={() => { setSingleEvent({ ...e, totalEmissions }), setOpenQr(true) }} /></div>
              {/* <div className="event-head-padding" style={{ display: "flex", justifyContent: "center" }}>{badgeColorCode(usersCalculatedCF(e), e?.conferanceSize, theNum + index + 1)}</div> */}
              <div className="event-head-padding event-justify-center" style={{ display: "flex", gap: "10px" }}>
                {/* <div className="view-details"
                  onClick={() => {
                    setOpenModal(true)
                    setSelectedEvent({ ...e, totalEmissions: isNaN(totalEmissions) ? "0" : addCommas(totalEmissions) });
                  }}

                > */}
                <div className="btnview">
                  <img src="/assets/images/eyeicon-grey.png" alt="viewdetails" onClick={() => {
                    setOpenModal(true)
                    setSelectedEvent({ ...e, totalEmissions: isNaN(totalEmissions) ? "0" : addCommas(totalEmissions) });
                  }} className="iconview" />
                </div>
                <div className="btnview">
                  <img src="/images/editicon.png" alt="viewdetails" onClick={() => {
                    setShouldEditEvent(true)
                    fetchSelectedEvent(e?.conferanceCode)
                  }} className="iconedit" />
                </div>
                {/* <EyeIcon /> */}
                {/* {console.log("openModal",openModal,"selectedEvent",selectedEvent)} */}
                {/* </div> */}

                {/* <div className="table--edit" ><EditIcon /></div> */}
              </div>

            </div>
            {/* <hr style={{ margin: 0 }} /> */}
          </>
        })}
        {openModal && <EventDetailsModal selectedEvent={selectedEvent} closeModal={setOpenModal} />}
      </>
    )
  }





  const handleCalculateCarbonTrans = (item, value) => {
    if (item === "eventType") {
      setEventType(value)
    }
    if (item === "eventStartDate") {
      console.log(value, "eventDate")
      if (value > eventEndDate) {
        setEventEndDate("")
      }
      setEventStartDate(value)
    }
    if (item === "eventEndDate") {
      setEventEndDate(value)
    }
    if (item === "peopleAttending") {
      setPeopleAttending(value)
    }
    if (item === "venueType") {
      setVenueType(value)
    }
    if (item === "peopleData") {
      setPeopleNum(value)
    }
    if (item === "isGroup") {
      setIsGroup(value)
    }
    if (item === "haveGroups") {
      setHaveGroups(value)
    }
    if (item === "selectedGroup") {
      setSelectedGroup(value)
    }
  }


  let differenceInDays
  let attendieData
  let venueData
  let lodgingData
  let travelData
  let foodData
  let salesData
  let wasteData
  let totalCarbonEventEmission
  let eventTypeData
  let countryData
  let eachAttendie

  const previewEvent = () => {

    if (eventStartDate && eventEndDate) {
      const start = new Date(eventStartDate);
      const end = new Date(eventEndDate);
      const differenceInTime = end.getTime() - start.getTime();
      differenceInDays = (differenceInTime / (1000 * 3600 * 24)) + 1;
      console.log(differenceInDays, "dayss")
    }
    console.log(selectCountry, "countryprint")

    countryData = selectCountry > 15.241 ? 1.1 : selectCountry === 15.241 ? 1 : 0.9

    eventTypeData = (eventType === "Conference" ? 1 : eventType === "Event" ? 0.95 : eventType === "Concert" ? 0.9 : eventType === "Sport" ? 0.85 : eventType === "Trade" ? 1.1 : 1.1)

    attendieData = (peopleAttending === "over10000people" ? 10000 : peopleAttending === "5000-9999" ? 7500 : peopleAttending === "1000-4999" ? 3000 : peopleAttending === "100-499" ? 300 : peopleAttending === "30-99" ? 65 : 15)

    totalCarbonEventEmission = 0.166 * attendieData * differenceInDays * eventTypeData * countryData * (venueType === "outdoor" ? 0.9 : 1)

    venueData = 0.4 * totalCarbonEventEmission
    lodgingData = 0.15 * totalCarbonEventEmission
    travelData = 0.23 * totalCarbonEventEmission
    foodData = 0.11 * totalCarbonEventEmission
    salesData = 0.04 * totalCarbonEventEmission
    wasteData = 0.07 * totalCarbonEventEmission
    eachAttendie = perAttendieCalculation = 0 ? 0 : totalCarbonEventEmission / attendieData

    // venueData = attendieData * differenceInDays * selectCountry * (venueType === "outdoor" ? 0.5 : 1)
    // lodgingData = attendieData * differenceInDays * (selectCountryRoom / 1000)
    // travelData = attendieData * differenceInDays * 0.051
    // foodData = attendieData * differenceInDays * 15
    // salesData = 0.05 * lodgingData
    // wasteData = 0.2 * foodData

    // totalCarbonEventEmission = venueData + lodgingData + travelData + foodData + salesData + wasteData
    console.log(venueData, lodgingData, travelData, foodData, salesData, wasteData, totalCarbonEventEmission, "event-emission")
    setSaveAttendie(attendieData?.toFixed(2))
    setPerAttendieCalculation(eachAttendie)
    setSaveVenueCalculation(venueData)
    setSaveTravelCalculation(travelData)
    setSaveFoodCalculation(foodData)
    setSaveLodgingCalculation(lodgingData)
    setSaveWasteCalculation(wasteData)
    setSaveSalesCalculation(salesData)
    setSaveEventCalculation(totalCarbonEventEmission)
    // setIsPreview(true)
  }

  const editEventAction = async (eventid) => {
    const dataForm = new FormData();
    if (!conferenceName) {
      return addToast(`Event Name cannot be empty`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    if (!eventStartDate) {
      return addToast(`Event Start Date cannot be empty`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    if (!eventEndDate) {
      return addToast(`Event End Date cannot be empty`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    if (!location) {
      return addToast(`Location cannot be empty`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    const date = new Date();
    let timeOffset = new Date()
      .toLocaleDateString([], { day: "2-digit", timeZoneName: "long" })
      .substring(4)
      .match(/\b(\w)/g)
      .join("")
    let groupField = isGroup === "yes" ? true : false
    let data = {
      businessCode,
      userId: localStorage.getItem("userId"),
      conferanceType: eventType,
      conferanceSize: parseFloat(saveAttendie),
      location,
      venueType,
      conferanceStartDate: eventStartDate,
      conferanceEndDate: eventEndDate,
      conferanceName: conferenceName,
      timeZone: date.getTimezoneOffset(),
      timeAbbrevation: timeOffset,
      hasExhibitor: groupField,
      exhibitorCount: peopleNum,
      estimatedCarbonEmissionsPerUser: selectCountry,
      venueCarbonEmission: parseFloat(saveVenueCalculation?.toFixed(2)),
      lodging: parseFloat(saveLodgingCalculation?.toFixed(2)),
      travel: parseFloat(saveTravelCalculation?.toFixed(2)),
      salesMarketing: parseFloat(saveSalesCalculation?.toFixed(2)),
      food: parseFloat(saveFoodCalculation?.toFixed(2)),
      Waste: parseFloat(saveWastelCalculation?.toFixed(2)),
      per_attendee: parseFloat(perAttendieCalculation?.toFixed(2)),
      estimatedCarbonEmissionsPerExhibitor: selectCountry * 1.5,
      countryCode: countryCodeISO3
    }

    let EditEventToBusiness = await EditBusinessEvent(data, eventid)
    if (EditEventToBusiness?.data.success) {
      setRefreshEvents(!refreshEvents)
      setShouldEditEvent(false)
      setEventStartDate("")
      setEventEndDate("")
      setPeopleAttending("over10000people")
      setEventType("Conference")
      setVenueType("indoor")
      setIsGroup("no")
      setPeopleNum(1)
      setConferenceName("")
      setLocation("")
      setSaveAttendie(29)
      setSaveEventCalculation(0)
      setSaveVenueCalculation(0)
      setSaveTravelCalculation(0)
      setSaveFoodCalculation(0)
      setSaveLodgingCalculation(0)
      setSaveWasteCalculation(0)
      setSaveSalesCalculation(0)
      setPerAttendieCalculation(0)
      return addToast(`Event Updated Successfully`, {
        appearance: 'success',
        autoDismiss: true,
      });
    } else {
      return addToast(`Something went wrong , please try again`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  }


  const addEventAction = async () => {
    if (!conferenceName) {
      return addToast(`Event Name cannot be empty`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    if (!eventStartDate) {
      return addToast(`Event Start Date cannot be empty`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    if (!eventEndDate) {
      return addToast(`Event End Date cannot be empty`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    if (!location) {
      return addToast(`Location cannot be empty`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    console.log("venueData", countryCodeISO3)
    const dataForm = new FormData();

    // let eventFields = {
    //   countryCode: countryCodeISO3,
    //   eventType,
    //   eventStartDate,
    //   eventEndDate,
    //   peopleAttending,
    //   location,
    //   venueType
    // }
    // console.log(eventFields, "eventFields")
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    const date = new Date();
    let timeOffset = new Date()
      .toLocaleDateString([], { day: "2-digit", timeZoneName: "long" })
      .substring(4)
      .match(/\b(\w)/g)
      .join("")
    let groupField = isGroup === "yes" ? true : false
    dataForm.append("businessCode", businessCode);
    dataForm.append("userId", localStorage.getItem("userId"));
    dataForm.append("conferanceType", eventType);
    dataForm.append("conferanceSize", saveAttendie);
    dataForm.append("discription", "");
    dataForm.append("location", location);
    dataForm.append("venueType", venueType);
    dataForm.append("conferanceStartDate", eventStartDate);
    dataForm.append("conferanceEndDate", eventEndDate);
    dataForm.append("conferanceName", conferenceName);
    dataForm.append("timeZone", date.getTimezoneOffset());
    dataForm.append("timeAbbrevation", timeOffset);
    dataForm.append("hasExhibitor", groupField);
    dataForm.append("exhibitorCount", peopleNum);
    dataForm.append("estimatedCarbonEmissionsPerUser", selectCountry);
    dataForm.append("venueCarbonEmission", (saveVenueCalculation)?.toFixed(2));
    dataForm.append("lodging", (saveLodgingCalculation)?.toFixed(2));
    dataForm.append("travel", (saveTravelCalculation)?.toFixed(2));
    dataForm.append("salesMarketing", (saveSalesCalculation)?.toFixed(2));
    dataForm.append("per_attendee", (perAttendieCalculation)?.toFixed(2));
    dataForm.append("food", (saveFoodCalculation)?.toFixed(2));
    dataForm.append("Waste", (saveWastelCalculation)?.toFixed(2));
    dataForm.append("estimatedCarbonEmissionsPerExhibitor", selectCountry * 1.5);
    dataForm.append("countryCode", countryCodeISO3);

    let addEventToBusiness = await addBusinessEvent(dataForm)
    console.log(addEventToBusiness, "eventAdd")
    if (addEventToBusiness?.data.success) {
      setRefreshEvents(!refreshEvents)
      setShouldAddEvent(false)
      setEventStartDate("")
      setEventEndDate("")
      setPeopleAttending("over10000people")
      setEventType("Conference")
      setVenueType("indoor")
      setIsGroup("no")
      setPeopleNum(1)
      setConferenceName("")
      setLocation("")
      setSaveAttendie(29)
      setSaveEventCalculation(0)
      setSaveVenueCalculation(0)
      setSaveTravelCalculation(0)
      setSaveFoodCalculation(0)
      setSaveLodgingCalculation(0)
      setSaveWasteCalculation(0)
      setSaveSalesCalculation(0)
      perAttendieCalculation(0)
      return addToast(`Event Added Successfully`, {
        appearance: 'success',
        autoDismiss: true,
      });
    } else {
      return addToast(`Something went wrong , please try again`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }

  }

  return <>
    <div className="table--popup" style={{ display: shouldAddEvent ? "" : "none" }}>
      <div className="table--form" style={{ width: "95%", height: "700px", maxWidth: "1450px" }}>
        <div className="popup--head">
          <div className="popup--title">Add New Event</div>
          {/* <div className="popup--close" onClick={() => setShouldAddEvent(false)}></div> */}
          <button
            className="cart-overlay__close-icon"
            onClick={() => setShouldAddEvent(false)}
          >
            <IoIosClose />
          </button>
        </div>
        <hr />
        <br />
        {/* {!isPreview ? */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0px 25px" }}>
          <div className="checkout-area space-mt--r130" style={{ border: "1px solid lightgray", padding: "1rem", marginTop: "-1px", width: "100%", maxWidth: "840px" }}>
            <div className="country-holder">
              <div className="filter-section">
                <select
                  className="w-100 offset--input-holder"
                  style={{ padding: "15px 45px" }}
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
                <div className="filter-section-image" style={{ marginTop: "2px" }}>
                  <span class={`fi fi-${countryCodeISO3}`}></span>{" "}

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
            <div style={{ marginTop: "30px", marginBottom: "20px" }}>
              <div className="employee-code" style={{ color: "#000", fontWeight: 500, fontSize: "18px" }}>Event Name:</div>
              <div style={{ position: "relative" }}>
                <input type="text" placeholder="Eg: XYZ Conference..." class="event--input" value={conferenceName} onChange={(e) => setConferenceName(e.target.value)} />
              </div>
            </div>

            <div className="mb-40 life-style-section">
              <div className="lifestyle--section-holder" style={{ marginTop: "20px" }}>



                <div className="lifeStyle-span">
                  <span style={{ color: "#000" }}>Event Type</span>
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
                        checked={eventType === "Conference"}
                        label="eventType"
                        onClick={() =>
                          handleCalculateCarbonTrans("eventType", "Conference")
                        }
                        className={
                          eventType === "Conference"
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
                        Event or Meeting
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
                        Sporting Event
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
                        Trade Show
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
                {/* <div className="fashion-specifications" style={{ display: eventType === "Fashion" ? "block" : "none" }}>
                <div className="lifeStyle-span" style={{ marginTop: "30px" }}>
                  <span style={{ color: "#000" }}>Do you have Designers , Buyers , Brands or Other Groups</span>
                </div>
                <div className="d-flex">
                  <div className="calculator--radio-button-holder">
                    <ButtonGroup
                      aria-label="house"
                      name="haveGroups"
                      className="houseisrent"
                    >

                      <ToggleButton
                        type="radio"
                        checked={
                          haveGroups === "yes"
                        }
                        label="haveGroups"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "haveGroups",
                            "yes"
                          )
                        }
                        className={
                          eventType === "yes"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Yes
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={haveGroups === "no"}
                        label="eventType"
                        onClick={() =>
                          handleCalculateCarbonTrans("haveGroups", "no")
                        }
                        className={
                          haveGroups === "no"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        No
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
                <div className="lifeStyle-span" style={{ marginTop: "30px", display: haveGroups == "yes" ? "" : "none" }}>
                  <span style={{ color: "#000" }}>Please Specify Group</span>
                </div>
                <div className="d-flex">
                  <div className="calculator--radio-button-holder" style={{ display: haveGroups == "yes" ? "" : "none" }}>
                    <ButtonGroup
                      aria-label="house"
                      name="selectedGroup"
                      className="houseisrent"
                    >
                      <ToggleButton
                        type="radio"
                        checked={
                          selectedGroup === "designer"
                        }
                        label="selectedGroup"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "selectedGroup",
                            "designer"
                          )
                        }
                        className={
                          selectedGroup === "designer"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Designer Group
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          selectedGroup === "brand"
                        }
                        label="selectedGroup"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "selectedGroup",
                            "brand"
                          )
                        }
                        className={
                          selectedGroup === "brand"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Brand Group
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={selectedGroup === "buyer"}
                        label="eventType"
                        onClick={() =>
                          handleCalculateCarbonTrans("selectedGroup", "buyer")
                        }
                        className={
                          selectedGroup === "buyer"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Buyer Group
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={selectedGroup === "press"}
                        label="eventType"
                        onClick={() =>
                          handleCalculateCarbonTrans("selectedGroup", "press")
                        }
                        className={
                          selectedGroup === "press"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Press
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
                </div> */}
              </div>
            </div>
            <div className="mb-40" style={{ marginTop: "30px" }}>
              <span style={{ color: "#000", fontWeight: 500, fontSize: "18px" }}>Event Start Date</span>
              <input type="date" class="code--input" placeholderText="mm-dd-yyyy" dateFormat="mm-dd-yyyy" value={eventStartDate} onChange={(e) => handleCalculateCarbonTrans("eventStartDate", e.target.value)}
                pattern="\d{4}-\d{2}-\d{2}" />
            </div>
            <div className="mb-40 " style={{ marginTop: "30px" }}>
              <span style={{ color: "#000", fontWeight: 500, fontSize: "18px" }}>Event End Date</span>
              <input type="date" class="code--input" placeholder="mm-dd-yyyy" value={eventEndDate} min={eventStartDate} onChange={(e) => handleCalculateCarbonTrans("eventEndDate", e.target.value)} pattern="\d{4}-\d{2}-\d{2}"
              />
            </div>
            <div className="mb-40 life-style-section">
              <div className="lifestyle--section-holder" style={{ marginTop: "30px" }}>



                <div className="lifeStyle-span">
                  <span style={{ color: "#000" }}>Num of people attending the event</span>
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
                        checked={peopleAttending === "over10000people"}
                        label="peopleAttending"
                        onClick={() =>
                          handleCalculateCarbonTrans("peopleAttending", "over10000people")
                        }
                        className={
                          peopleAttending === "over10000people"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Over 10,000 people
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          peopleAttending === "5000-9999"
                        }
                        label="peopleAttending"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "peopleAttending",
                            "5000-9999"
                          )
                        }
                        className={
                          peopleAttending === "5000-9999"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        5000-9999
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          peopleAttending === "1000-4999"
                        }
                        label="two_wheel"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "peopleAttending",
                            "1000-4999"
                          )
                        }
                        className={
                          peopleAttending === "1000-4999"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        1000-4999
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          peopleAttending === "100-499"
                        }
                        label="peopleAttending"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "peopleAttending",
                            "100-499"
                          )
                        }
                        className={
                          peopleAttending === "100-499"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        100-499
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          peopleAttending === "30-99"
                        }
                        label="peopleAttending"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "peopleAttending",
                            "30-99"
                          )
                        }
                        className={
                          peopleAttending === "30-99"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        30-99
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          peopleAttending === "2-29"
                        }
                        label="peopleAttending"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "peopleAttending",
                            "2-29"
                          )
                        }
                        className={
                          peopleAttending === "2-29"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        2-29
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "30px", marginBottom: "20px" }}>
              <div className="employee-code" style={{ color: "#000", fontWeight: 500, fontSize: "18px" }}>Location:</div>
              <input type="text" placeholder="Enter Location" class="event--input" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="mb-40 life-style-section">
              <div className="lifestyle--section-holder" style={{ marginTop: "30px" }}>
                <div className="lifeStyle-span">
                  <span style={{ color: "#000" }}>Venue Type</span>
                </div>
                <div className="d-flex ">
                  <div className="calculator--radio-button-holder">
                    <ButtonGroup
                      aria-label="house"
                      name="venueType"
                      className="houseisrent"
                    >

                      <ToggleButton
                        type="radio"
                        checked={
                          venueType === "indoor"
                        }
                        label="venueType"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "venueType",
                            "indoor"
                          )
                        }
                        className={
                          eventType === "indoor"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Indoor
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={venueType === "outdoor"}
                        label="eventType"
                        onClick={() =>
                          handleCalculateCarbonTrans("venueType", "outdoor")
                        }
                        className={
                          venueType === "outdoor"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Outdoor
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-40 life-style-section">
              <div className="lifestyle--section-holder" style={{ marginTop: "30px" }}>
                <div className="lifeStyle-span">
                  {/* Modified code */}
                  <span style={{ color: "#000" }}>{eventType === "Fashion" ? "Do you have Designers , Buyers , Brands or Other Groups" : "Any Exhibitor / Groups"}</span>
                </div>
                <div className="d-flex ">
                  <div className="calculator--radio-button-holder">
                    <ButtonGroup
                      aria-label="house"
                      name="isGroup"
                      className="houseisrent"
                    >
                      <ToggleButton
                        type="radio"
                        checked={isGroup === "yes"}
                        label="isGroup"
                        onClick={() =>
                          handleCalculateCarbonTrans("isGroup", "yes")
                        }
                        className={
                          venueType === "yes"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Yes
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          isGroup === "no"
                        }
                        label="isGroup"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "isGroup",
                            "no"
                          )
                        }
                        className={
                          isGroup === "no"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        No
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carbon-calculator-content-output" style={{ background: "white", position: "sticky", top: "0", alignSelf: "flex-start" }}>
            <div className="main-holder" style={{ margin: "auto", background: "#f2f2f2" }}>
              <div className="top-header-calculator">
                <img src={"/assets/images/small-calculator-image.png"} />
                <div className="content">
                  <div className="empty-div"></div>
                  <div className="main-content">
                    <h3>{isNaN(saveEventCalculation) ? "0.00" : addCommas(saveEventCalculation)}</h3>
                    <p>Event carbon footprint Metric tons of carbon</p>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="annual--carbon--box" style={{ paddingBottom: "20px" }}>
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
                      <b>My Event Emissions</b>
                    </span>

                    {/* <div className="total-household--holder">
                      <div className="per-person-holder">
                        <p>
                          {isNaN(perAttendieCalculation) ? "0.00" : addCommas(perAttendieCalculation)}
                        </p>
                        <span className="carbon--total-household">
                          Per Attendie
                        </span>
                      </div>
                      <div className="my-household-total-holder">
                        <p>{isNaN(saveVenueCalculation) ? "0.00" : addCommas(saveVenueCalculation)}</p>
                        <span className="carbon--total-household">
                          Venue
                        </span>
                      </div>
                    </div>
                    <div className="total-household--holder">
                      <div className="per-person-holder">
                        <p>
                          {isNaN(saveLodgingCalculation) ? "0.00" : addCommas(saveLodgingCalculation)}
                        </p>
                        <span className="carbon--total-household">
                          Lodging
                        </span>
                      </div>
                      <div className="my-household-total-holder">
                        <p>{isNaN(saveTravelCalculation) ? "0.00" : addCommas(saveTravelCalculation)}</p>
                        <span className="carbon--total-household">
                          Travel
                        </span>
                      </div>
                    </div>
                    <div className="total-household--holder">
                      <div className="per-person-holder">
                        <p>
                          {isNaN(saveFoodCalculation) ? "0.00" : addCommas(saveFoodCalculation)}
                        </p>
                        <span className="carbon--total-household">
                          Food
                        </span>
                      </div>
                      <div className="my-household-total-holder">
                        <p>{isNaN(saveWastelCalculation) ? "0.00" : addCommas(saveWastelCalculation)}</p>
                        <span className="carbon--total-household">
                          Waste
                        </span>
                      </div>
                    </div> */}
                    {/* <button
                        onClick={addEventAction}
                        className="continue-button"
                      >
                        Add 
                      </button> */}
                  </div>
                  <table className="tableclass" border="0">
                    <tr>
                      <td className="tdclass emissionNums"> <p>
                        {isNaN(perAttendieCalculation) ? "0.00" : addCommas(perAttendieCalculation)}
                      </p></td>
                      <td className="tdclass emissionNums">
                        <p>{isNaN(saveVenueCalculation) ? "0.00" : addCommas(saveVenueCalculation)}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="tdclass nobg emissionNames">Per Attendee Emission</td>
                      <td className="tdclass nobg emissionNames">Venue Emissions</td>
                    </tr>
                    <tr style={{ marginTop: "40px" }}>
                      <td className="tdclass extraspace emissionNums"><p>
                        {isNaN(saveLodgingCalculation) ? "0.00" : addCommas(saveLodgingCalculation)}
                      </p></td>
                      <td className="tdclass extraspace emissionNums">
                        <p>{isNaN(saveTravelCalculation) ? "0.00" : addCommas(saveTravelCalculation)}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="tdclass nobg emissionNames">Lodging Emissions</td>
                      <td className="tdclass nobg emissionNames">Travel Emissions</td>
                    </tr>
                    <tr style={{ marginTop: "40px" }}>
                      <td className="tdclass extraspace emissionNums"> <p>
                        {isNaN(saveFoodCalculation) ? "0.00" : addCommas(saveFoodCalculation)}
                      </p>
                      </td>
                      <td className="tdclass extraspace emissionNums">
                        <p>{isNaN(saveWastelCalculation) ? "0.00" : addCommas(saveWastelCalculation)}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="tdclass nobg emissionNames">Food Emissions</td>
                      <td className="tdclass nobg emissionNames">Waste Emissions</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* } */}
        <br />
        <hr />
        <div className="event-btn-grp">
          <div className="add-event-btn" onClick={addEventAction}>Add Event </div>
        </div>
      </div>
    </div>
    <div className="table--popup" style={{ display: shouldEditEvent ? "" : "none" }}>
      <div className="table--form" style={{ width: "95%", height: "700px", maxWidth: "1450px" }}>
        <div className="popup--head">
          <div className="popup--title">Edit Event</div>
          {/* <div className="popup--close" onClick={() => {
            setShouldEditEvent(false)
            emptyFields()
          }
          }>X</div> */}
          <button
            className="cart-overlay__close-icon"
            onClick={() => {
              setShouldEditEvent(false)
              emptyFields()
            }}
          >
            <IoIosClose />
          </button>
        </div>
        <hr />
        <br />
        {/* {!isPreview ? */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0px 25px" }}>
          <div className="checkout-area space-mt--r130" style={{ border: "1px solid lightgray", padding: "1rem", marginTop: "-1px", width: "100%", maxWidth: "840px" }}>
            <div className="country-holder">
              <div className="filter-section">
                <select
                  className="w-100 offset--input-holder"
                  style={{ padding: "15px 45px" }}
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
                <div className="filter-section-image" style={{ marginTop: "2px" }}>
                  <span class={`fi fi-${countryCodeISO3}`}></span>{" "}

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
            <div style={{ marginTop: "30px", marginBottom: "20px" }}>
              <div className="employee-code" style={{ color: "#000", fontWeight: 500, fontSize: "18px" }}>Event Name:</div>
              <div style={{ position: "relative" }}>
                <input type="text" placeholder="Eg: XYZ Conference..." class="event--input" value={conferenceName} onChange={(e) => setConferenceName(e.target.value)} />
              </div>
            </div>

            <div className="mb-40 life-style-section">
              <div className="lifestyle--section-holder" style={{ marginTop: "20px" }}>



                <div className="lifeStyle-span">
                  <span style={{ color: "#000" }}>Event Type</span>
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
                        checked={eventType === "Conference"}
                        label="eventType"
                        onClick={() =>
                          handleCalculateCarbonTrans("eventType", "Conference")
                        }
                        className={
                          eventType === "Conference"
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
                        Event or Meeting
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
                        Sporting Event
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
                        Trade Show
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
              </div>
            </div>
            <div className="mb-40" style={{ marginTop: "30px" }}>
              <span style={{ color: "#000", fontWeight: 500, fontSize: "18px" }}>Event Start Date</span>
              <input type="date" class="code--input" placeholderText="mm-dd-yyyy" dateFormat="mm-dd-yyyy" value={eventStartDate} onChange={(e) => handleCalculateCarbonTrans("eventStartDate", e.target.value)}
                pattern="\d{4}-\d{2}-\d{2}" />
            </div>
            <div className="mb-40 " style={{ marginTop: "30px" }}>
              <span style={{ color: "#000", fontWeight: 500, fontSize: "18px" }}>Event End Date</span>
              <input type="date" class="code--input" placeholder="mm-dd-yyyy" value={eventEndDate} min={eventStartDate} onChange={(e) => handleCalculateCarbonTrans("eventEndDate", e.target.value)}
              />
            </div>
            <div className="mb-40 life-style-section">
              <div className="lifestyle--section-holder" style={{ marginTop: "30px" }}>



                <div className="lifeStyle-span">
                  <span style={{ color: "#000" }}>Num of people attending the event</span>
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
                        checked={peopleAttending === "over10000people"}
                        label="peopleAttending"
                        onClick={() =>
                          handleCalculateCarbonTrans("peopleAttending", "over10000people")
                        }
                        className={
                          peopleAttending === "over10000people"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Over 10,000 people
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          peopleAttending === "5000-9999"
                        }
                        label="peopleAttending"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "peopleAttending",
                            "5000-9999"
                          )
                        }
                        className={
                          peopleAttending === "5000-9999"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        5000-9999
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          peopleAttending === "1000-4999"
                        }
                        label="two_wheel"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "peopleAttending",
                            "1000-4999"
                          )
                        }
                        className={
                          peopleAttending === "1000-4999"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        1000-4999
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          peopleAttending === "100-499"
                        }
                        label="peopleAttending"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "peopleAttending",
                            "100-499"
                          )
                        }
                        className={
                          peopleAttending === "100-499"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        100-499
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          peopleAttending === "30-99"
                        }
                        label="peopleAttending"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "peopleAttending",
                            "30-99"
                          )
                        }
                        className={
                          peopleAttending === "30-99"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        30-99
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          peopleAttending === "2-29"
                        }
                        label="peopleAttending"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "peopleAttending",
                            "2-29"
                          )
                        }
                        className={
                          peopleAttending === "2-29"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        2-29
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "30px", marginBottom: "20px" }}>
              <div className="employee-code" style={{ color: "#000", fontWeight: 500, fontSize: "18px" }}>Location:</div>
              <input type="text" placeholder="Enter Location" class="event--input" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="mb-40 life-style-section">
              <div className="lifestyle--section-holder" style={{ marginTop: "30px" }}>
                <div className="lifeStyle-span">
                  <span style={{ color: "#000" }}>Venue Type</span>
                </div>
                <div className="d-flex ">
                  <div className="calculator--radio-button-holder">
                    <ButtonGroup
                      aria-label="house"
                      name="venueType"
                      className="houseisrent"
                    >

                      <ToggleButton
                        type="radio"
                        checked={
                          venueType === "indoor"
                        }
                        label="venueType"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "venueType",
                            "indoor"
                          )
                        }
                        className={
                          eventType === "indoor"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Indoor
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={venueType === "outdoor"}
                        label="eventType"
                        onClick={() =>
                          handleCalculateCarbonTrans("venueType", "outdoor")
                        }
                        className={
                          venueType === "outdoor"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Outdoor
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-40 life-style-section">
              <div className="lifestyle--section-holder" style={{ marginTop: "30px" }}>
                <div className="lifeStyle-span">
                  {/* Modified code */}
                  <span style={{ color: "#000" }}>{eventType === "Fashion" ? "Do you have Designers , Buyers , Brands or Other Groups" : "Any Exhibitor / Groups"}</span>
                </div>
                <div className="d-flex ">
                  <div className="calculator--radio-button-holder">
                    <ButtonGroup
                      aria-label="house"
                      name="isGroup"
                      className="houseisrent"
                    >
                      <ToggleButton
                        type="radio"
                        checked={isGroup === "yes"}
                        label="isGroup"
                        onClick={() =>
                          handleCalculateCarbonTrans("isGroup", "yes")
                        }
                        className={
                          venueType === "yes"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        Yes
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        checked={
                          isGroup === "no"
                        }
                        label="isGroup"
                        onClick={() =>
                          handleCalculateCarbonTrans(
                            "isGroup",
                            "no"
                          )
                        }
                        className={
                          isGroup === "no"
                            ? "active form-control-label"
                            : "form-control-label"
                        }
                      >
                        No
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carbon-calculator-content-output" style={{ background: "white", position: "sticky", top: "0", alignSelf: "flex-start" }}>
            <div className="main-holder" style={{ margin: "auto", background: "#f2f2f2" }}>
              <div className="top-header-calculator">
                <img src={"/assets/images/small-calculator-image.png"} />
                <div className="content">
                  <div className="empty-div"></div>
                  <div className="main-content">
                    <h3>{isNaN(saveEventCalculation) ? "0.00" : addCommas(saveEventCalculation)}</h3>
                    <p>Event carbon footprint Metric tons of carbon</p>
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
                      <b>My Event Emissions</b>
                    </span>

                    {/* <div className="total-household--holder">
                      <div className="per-person-holder">
                        <p>
                          {isNaN(perAttendieCalculation) ? "0.00" : addCommas(perAttendieCalculation)}
                        </p>
                        <span className="carbon--total-household">
                          Per Attendie
                        </span>
                      </div>
                      <div className="my-household-total-holder">
                        <p>{isNaN(saveVenueCalculation) ? "0.00" : addCommas(saveVenueCalculation)}</p>
                        <span className="carbon--total-household">
                          Venue
                        </span>
                      </div>
                    </div>
                    <div className="total-household--holder">
                      <div className="per-person-holder">
                        <p>
                          {isNaN(saveLodgingCalculation) ? "0.00" : addCommas(saveLodgingCalculation)}
                        </p>
                        <span className="carbon--total-household">
                          Lodging
                        </span>
                      </div>
                      <div className="my-household-total-holder">
                        <p>{isNaN(saveTravelCalculation) ? "0.00" : addCommas(saveTravelCalculation)}</p>
                        <span className="carbon--total-household">
                          Travel
                        </span>
                      </div>
                    </div>
                    <div className="total-household--holder">
                      <div className="per-person-holder">
                        <p>
                          {isNaN(saveFoodCalculation) ? "0.00" : addCommas(saveFoodCalculation)}
                        </p>
                        <span className="carbon--total-household">
                          Food
                        </span>
                      </div>
                      <div className="my-household-total-holder">
                        <p>{isNaN(saveWastelCalculation) ? "0.00" : addCommas(saveWastelCalculation)}</p>
                        <span className="carbon--total-household">
                          Waste
                        </span>
                      </div>
                    </div> */}
                    <table className="tableclass" border="0">
                      <tr>
                        <td className="tdclass emissionNums"> <p>
                          {isNaN(perAttendieCalculation) ? "0.00" : addCommas(perAttendieCalculation)}
                        </p></td>
                        <td className="tdclass emissionNums">
                          <p>{isNaN(saveVenueCalculation) ? "0.00" : addCommas(saveVenueCalculation)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="tdclass nobg emissionNames">Per Attendee Emission</td>
                        <td className="tdclass nobg emissionNames">Venue Emissions</td>
                      </tr>
                      <tr style={{ marginTop: "40px" }}>
                        <td className="tdclass extraspace emissionNums"><p>
                          {isNaN(saveLodgingCalculation) ? "0.00" : addCommas(saveLodgingCalculation)}
                        </p></td>
                        <td className="tdclass extraspace emissionNums">
                          <p>{isNaN(saveTravelCalculation) ? "0.00" : addCommas(saveTravelCalculation)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="tdclass nobg emissionNames">Lodging Emissions</td>
                        <td className="tdclass nobg emissionNames">Travel Emissions</td>
                      </tr>
                      <tr style={{ marginTop: "40px" }}>
                        <td className="tdclass extraspace emissionNums"> <p>
                          {isNaN(saveFoodCalculation) ? "0.00" : addCommas(saveFoodCalculation)}
                        </p>
                        </td>
                        <td className="tdclass extraspace emissionNums">
                          <p>{isNaN(saveWastelCalculation) ? "0.00" : addCommas(saveWastelCalculation)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="tdclass nobg emissionNames">Food Emissions</td>
                        <td className="tdclass nobg emissionNames">Waste Emissions</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <hr />
        <div className="event-btn-grp">
          <div className="add-event-btn" onClick={() => editEventAction(selectEditEvent?.[0]?._id)}>Edit Event </div>
        </div>
      </div>
    </div>
    <div className="backdrop-popup" style={{ display: openQr ? "" : "none" }}>
      <div className="sustainability--confirm-popup-holder">
        <button
          className="cart-overlay__close-icon"
          onClick={() => setOpenQr(false)}
        >
          <IoIosClose />
        </button>
        <div>
          <div className="business--link--head">
            <h5>Share or Scan this link with users so they can be part of the event</h5>
          </div>
          <div className="business--link--text" style={{ marginTop: "10px" }}>
            <div>
              Your Event Link :{" "}
              <a
                href={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
                style={{ textDecoration: "underline" }}
                target="_blank"
              >
                {process.env.NEXT_PUBLIC_UI_URL}?conferenceCode={singleEvent?.conferanceCode}
              </a>
            </div>
            <div
              className="sustainability--information-holder"
            >

              <Tooltip
                className="iconHover"
                title="Product Link"
                position="bottom"
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
                  }}
                />
              </Tooltip>

              {/* <div className="sustainability--information-box">
                                              This is your EcoStance Page web site link that can be
                                              advertised by you and/or your company on your own web
                                              site, your social media profiles, your social media
                                              posts, so that your friends and customers can access
                                              this link directly from anywhere
                                            </div> */}
            </div>
            <Tooltip
              className="iconHover"
              title="Copy Event Link"
              position="top"
              trigger="mouseenter"
              animation="shift"
              arrow={true}
              duration={200}
            // style={{ marginTop: "15px" }}
            >
              {!copied ? (
                <MdContentCopy
                  onClick={(e) =>
                    handleCopy(
                      `${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`
                    )
                  }
                  style={{
                    pointerEvents: "all",
                    width: "18px",
                    height: "18px",
                    // marginLeft: "15px",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <div className="iconHover">
                  <MdCheck
                    style={{
                      pointerEvents: "all",
                      width: "18px",
                      height: "18px",
                      marginLeft: "-15px",
                      cursor: "pointer",
                      color: "green",
                    }}
                  />
                </div>
              )}
            </Tooltip>
            <Tooltip
              className="iconHover"
              title="Download QR Code"
              position="right"
              trigger="mouseenter"
              animation="shift"
              arrow={true}
              duration={200}
            // style={{ marginTop: "15px" }}
            >
              {!downloading ? (
                <BsCloudDownload
                  onClick={(e) => downloadCode("eventQrID")}
                  style={{
                    pointerEvents: "all",
                    width: "18px",
                    height: "18px",
                    // marginLeft: "15px",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <Spinner
                  animation="border"
                  variant="success"
                  style={{
                    width: "18px",
                    height: "18px",
                    // marginLeft: "15px",
                    borderWidth: "2px",
                  }}
                />
              )}
            </Tooltip>
            <div style={{ display: "none" }}>
              <QRCode
                value={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
                size={400}
                logoImage="/assets/images/ecostance-qr-logo.png"
                qrStyle="squares"
                enableCORS={true}
                id={"eventQrID"}
              />
            </div>
          </div>
        </div>
        <div className="qrbox" style={{ marginLeft: "10px" }}>

          {/* <div className="tracetext">Traceable</div> */}
          <div class="rotated-text">
            {singleEvent?.conferanceName?.slice(0, 13)}
          </div>
          <QRCode
            value={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
            logoImage="/assets/images/ecostance-qr-logo.png"
            size={100}

          />
          <p style={{ textAlign: "center", marginTop: "-7px" }}>{singleEvent?.conferanceCode}</p>
          {/* <p style={{ textAlign: "center" }}>{productName}</p> */}
        </div>
        {/* {businessnamewarning} */}



      </div>
    </div>
    {localStorage.getItem("MyBusinessDetails") ? (

      allEventsData?.length > 0 ?
        <div className="change--email--wrapper">

          <div className="profile-line" style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
            <p className="orders--orderNumber-Holder" style={{ display: localStorage.getItem("MyBusinessDetails") ? "" : "none" }}>Business Name:  <b>{JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}</b></p>
            <p className="profile-head"></p>
          </div>

          <div className="business--link--display" style={{ display: eventSwitch ? "" : "none" }}>
            <div>
              <div className="business--link--head">
                <h5>Share or Scan this link with users so they can be part of the event</h5>
              </div>
              <div className="business--link--text" style={{ marginTop: "10px" }}>
                <div>
                  Your Event Link :{" "}
                  <a
                    href={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
                    style={{ textDecoration: "underline" }}
                    target="_blank"
                  >
                    {process.env.NEXT_PUBLIC_UI_URL}?conferenceCode={singleEvent?.conferanceCode}
                  </a>
                </div>
                <div
                  className="sustainability--information-holder"
                >

                  <Tooltip
                    className="iconHover"
                    title="Event Link"
                    position="bottom"
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
                      }}
                    />
                  </Tooltip>

                  {/* <div className="sustainability--information-box">
                          This is your EcoStance Page web site link that can be
                          advertised by you and/or your company on your own web
                          site, your social media profiles, your social media
                          posts, so that your friends and customers can access
                          this link directly from anywhere
                        </div> */}
                </div>
                <Tooltip
                  className="iconHover"
                  title="Copy Event Link"
                  position="top"
                  trigger="mouseenter"
                  animation="shift"
                  arrow={true}
                  duration={200}
                // style={{ marginTop: "15px" }}
                >
                  {!copied ? (
                    <MdContentCopy
                      onClick={(e) =>
                        handleCopy(
                          `${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`
                        )
                      }
                      style={{
                        pointerEvents: "all",
                        width: "18px",
                        height: "18px",
                        // marginLeft: "15px",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <div className="iconHover">
                      <MdCheck
                        style={{
                          pointerEvents: "all",
                          width: "18px",
                          height: "18px",
                          marginLeft: "-15px",
                          cursor: "pointer",
                          color: "green",
                        }}
                      />
                    </div>
                  )}
                </Tooltip>
                <Tooltip
                  className="iconHover"
                  title="Download QR Code"
                  position="right"
                  trigger="mouseenter"
                  animation="shift"
                  arrow={true}
                  duration={200}
                // style={{ marginTop: "15px" }}
                >
                  {!downloading ? (
                    <BsCloudDownload
                      onClick={(e) => downloadCode("eventQrID")}
                      style={{
                        pointerEvents: "all",
                        width: "18px",
                        height: "18px",
                        // marginLeft: "15px",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <Spinner
                      animation="border"
                      variant="success"
                      style={{
                        width: "18px",
                        height: "18px",
                        // marginLeft: "15px",
                        borderWidth: "2px",
                      }}
                    />
                  )}
                </Tooltip>
                <div style={{ display: "none" }}>
                  <QRCode
                    value={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
                    size={400}
                    logoImage="/assets/images/ecostance-qr-logo.png"
                    qrStyle="squares"
                    enableCORS={true}
                    id={"eventQrID"}
                  />
                </div>
              </div>
            </div>
            <div className="qrbox" style={{ marginLeft: "10px" }}>
              <div class="rotated-text">
                {singleEvent?.conferanceName?.slice(0, 13)}
              </div>
              <QRCode
                value={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
                logoImage="/assets/images/ecostance-qr-logo.png"
                size={100}

              />
              <p style={{ textAlign: "center", marginTop: "-7px" }}>{singleEvent?.conferanceCode}</p>
            </div>
          </div>

          <p style={{ fontSize: "25px", fontWeight: 600, display: eventSwitch ? "" : "none" }}>{singleEvent?.conferanceName}, {singleEvent?.location}, {getDisplayDateRange(singleEvent?.conferanceStartDate, singleEvent?.conferanceEndDate)}</p>
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>
              <div style={{ display: "flex" }}>
                <div className="card--boxes event-box">
                  <div className="card--event--title">{eventSwitch ? addCommas(singleEvent?.conferanceSize ? singleEvent?.conferanceSize : "0") : addCommas(selectedYearlyEvent?.eventCount ? selectedYearlyEvent?.eventCount : "0")}</div>
                  <div className="event--subtitle">{eventSwitch ? "Expected Attendees" : "Total Number Of Events"}</div>
                </div>
                <div className="card--boxes  event-box">
                  <div className="card--event--title">{eventSwitch ? addCommas(singleEvent?.totalEmissions ? singleEvent?.totalEmissions : "0") : addCommas(selectedYearlyEvent?.theTotalEmission ? selectedYearlyEvent?.theTotalEmission : "0")}</div>
                  <div className="event--subtitle">Total Emissions (in Metric Tons) from all events</div>
                </div>
              </div>
              <div style={{ display: "flex", marginTop: "10px" }}>
                <div className="card--boxes  event-box">
                  <div className="card--event--title">{

                    eventSwitch ? singleEvent?.users?.includes(singleEvent?.eventOwnerOrder?.user_id) ? singleEvent?.userCount : singleEvent?.userCount :
                      selectedYearlyEvent?.uniqueUserCount ? selectedYearlyEvent?.uniqueUserCount : "0"}</div>
                  <div className="event--subtitle">Users who have reduced carbon footprint</div>
                </div>
                <div className="card--boxes  event-box">
                  <div className="card--event--title">{
                    eventSwitch ?
                      (() => {
                        const reduced = singleEvent?.totalghgReduced || 0;
                        const total = singleEvent?.totalEmissions || 0;
                        const pct = total > 0 ? ((reduced / total) * 100).toFixed(1) : "0";
                        return `${addCommas(reduced)} / ${pct}%`;
                      })()
                      :
                      (() => {
                        const reduced = selectedYearlyEvent?.totalAnnualghgReduced || 0;
                        const total = selectedYearlyEvent?.theTotalEmission || 0;
                        const pct = total > 0 ? ((reduced / total) * 100).toFixed(1) : "0";
                        return `${addCommas(reduced)} / ${pct}%`;
                      })()
                  }</div>
                  <div className="event--subtitle">Total GHG reduced (in metric tons / %)</div>
                </div>
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <div className="card--boxes  event-circular-box">
                <div className='charts-disp doughnut-chart-title'>Emissions&nbsp;breakdown&nbsp;by&nbsp;Category</div>
                <br />
                <Pie data={doughnutData} options={options} />
              </div>
            </div>
          </div>
          <br />

          <div className="table--box">
            <div className="table--align">
              <div style={{ display: "flex", alignItems: "center", width: "50%", justifyContent: "space-between" }}>
                <div className="add--product--btn" onClick={() => setShouldAddEvent(true)}>Add Event</div>
                {/* <div className="add--btn" onClick={() => setShouldAddEvent(true)}>
                  <img src="/images/addeventicon.png" alt="addEvent" width="35px" />
                </div> */}
                {/* <div className="add--btn" onClick={() => setShouldAddEvent(true)}>
                  <AddEventIcon/>
                </div> */}
                {/* <div className="add--btn" style={{ marginLeft: "20px", display: singleEvent ? "" : "none" }} onClick={() => setSingleEvent("")}>Clear Selection</div> */}
                <div style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}>
                  <div style={{ color: !eventSwitch ? "#333" : "#7E7E7E", marginRight: "10px", fontWeight: !eventSwitch ? "bolder" : "normal" }}>
                    Yearly
                  </div>
                  <div className="big-switch">
                    <Switch
                      className=""
                      height={24}
                      width={46}
                      display={eventSwitch}
                      setDisplay={(value) => handleMakePublic(value)}
                      bgcolor={true}
                      handleColor={"#000"}
                    />
                  </div>
                  {/* <div
                    className="small-switch"
                    style={{ display: "none" }}
                  >
                    <Switch
                      height={19.72}
                      width={37.81}
                      display={eventSwitch}
                      setDisplay={(value) => handleMakePublic(value)}
                    />
                  </div> */}

                  <div style={{ color: eventSwitch ? "#333" : "#7E7E7E", marginLeft: "10px", fontWeight: eventSwitch ? "bolder" : "normal" }}>
                    All Events
                  </div>
                </div>
              </div>
              <div className="search--box">
                &nbsp;&nbsp;
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path></svg>
                <input type="text" placeholder="search..." className="input--search" />
              </div>
            </div>
            {/* <div className="event-group-tab">
              <div className={"event--head " + (eventView === "individual" ? "event-active" : "")} onClick={() => setEventView("individual")}>Individuals</div>
              <div className={"event--head " + (eventView === "yearly" ? "event-active" : "")} onClick={() => { setEventView("yearly"), setSingleEvent("") }}>Yearly</div>
            </div> */}
            {/* <div className="sustainability--input--slug--holder--main">
              <div className="sustainability--page-input-slug-holder">


                <div className="sustainability--switch-button-holder--primary--slug">

                  <div className="big-switch">
                    <Switch
                      height={24}
                      width={46}
                      display={eventSwitch}
                      setDisplay={(value) => handleMakePublic(value)}
                    />
                  </div>
                  <div
                    className="small-switch"
                    style={{ display: "none" }}
                  >
                    <Switch
                      height={19.72}
                      width={37.81}
                      display={eventSwitch}
                      setDisplay={(value) => handleMakePublic(value)}
                    />
                  </div>


                </div>
              </div>
            </div> */}
            <hr style={{ margin: 0 }} />
            <div className="event-tables-scroll">
              <div className="event-table-width">
                {!eventSwitch ?
                  <div className="event--group--head">
                    <div>No.</div>
                    <div>Year</div>
                    <div className="event-center">Total Events</div>
                    <div className="event-center">Emissions</div>
                    <div className="event-center">Users Attending</div>
                    <div className="event-center">Actions</div>
                    {/* <div>Emissions Per User</div> */}
                  </div> :
                  <div className="event--table--head">
                    <div className="event-head-padding" style={{ width: "40px" }}>No.</div>
                    <div className="event-head-padding" style={{ width: "120px" }}>Event Code</div>
                    <div className="event-head-padding" >Event Name</div>
                    <div className="event-head-padding" >Location</div>
                    <div className="event-head-padding event-justify-center" style={{ width: "230px" }}>Dates</div>
                    <div className="event-head-padding event-justify-center">Emission Estimate</div>
                    {/* Emission Estimate of Event(MtCO2e) */}
                    <div className="event-head-padding event-justify-center">Expected Attendees</div>
                    <div className="event-head-padding event-justify-center">Attendees Participation</div>
                    {/* Num Of Attendees Reduced */}
                    <div className="event-head-padding event-justify-center">Emission Reduced</div>
                    {/* GHG Reduced(MtCO2e) */}
                    <div className="event-head-padding event-justify-center">Remaining Footprint</div>
                    {/* Carbon Footprint Remaining(MtCO2e) */}
                    <div className="event-head-padding event-justify-center">Purchase Offsets</div>
                    {/* <div className="event-head-padding">Offsets Reduced(MtCO2e)</div> */}
                    {/* <div className="event-head-padding">Remaining(MtCO2e)</div> */}
                    <div className="event-head-padding event-justify-center">Badge</div>
                    <div className="event-head-padding event-justify-center">QR Code</div>
                    <div className="event-head-padding event-justify-center">Actions</div>
                  </div>
                }
                <hr style={{ margin: 0 }} />
                {!eventSwitch ? <>
                  {yearlyEvents.map((item, index) => {
                    let totalVenueEmissions = calculateTotal('venueCarbonEmission', item?.eventDetail);
                    let totalLodge = calculateTotal('lodging', item?.eventDetail);
                    let totalTravel = calculateTotal('travel', item?.eventDetail);
                    let totalSalesMarketing = calculateTotal('salesMarketing', item?.eventDetail);
                    let totalFood = calculateTotal('food', item?.eventDetail);
                    let totalWaste = calculateTotal('Waste', item?.eventDetail);

                    console.log(totalFood, "valuese")


                    let theTotalEmission = totalVenueEmissions + totalLodge + totalTravel + totalSalesMarketing + totalFood + totalWaste
                    return <div className="event--group--data" style={{ cursor: "pointer", background: item?._id === selectedYearlyEvent?._id ? "#eeeeee" : 'white', borderLeft: item?._id === selectedYearlyEvent?._id ? "3px solid #bdbdbd" : "3px solid transparent" }} onClick={() => groupModalSelect(item, theTotalEmission)}>
                      <div>{index + 1}.</div>
                      <div>{item?._id}</div>
                      <div className="event-center">{item?.eventCount}</div>
                      <div className="event-center">{addCommas(theTotalEmission)}</div>
                      <div className="event-center">{addCommas(item?.userAttended)}</div>
                      <div className="event-center">
                        <div className="btnview" style={{ width: "30px", margin: "auto" }}>
                          <img src="/assets/images/eyeicon-grey.png" alt="viewdetails" onClick={(e) => {
                            e.stopPropagation();
                            setOpenGroupModal(true)
                            setSelectedYearlyEvent({ ...item, theTotalEmission });
                          }} className="iconview" />
                        </div>
                      </div>
                    </div>
                  })}
                  {openGroupModal && <EventDetailsYearlyModal selectedYearlyEvent={selectedYearlyEvent} closeYearlyModal={setOpenGroupModal} />}
                </> : <MemberDetails theNum={0} />

                }
              </div>
            </div>
            <div style={{ borderBottom: "1px solid rgba(233,233,233)" }}></div>
            <div className="pagination--box">
              <div className="pagination--title--text">Showing <span style={{ fontWeight: 800 }}>{limit}</span> results in each page</div>
              <Pagination
                activePage={eventSwitch ? activePage : yearlyActivePage}
                itemsCountPerPage={eventSwitch ? limit : Yearlylimit}
                totalItemsCount={eventSwitch ? count : yearlyCount}
                pageRangeDisplayed={eventSwitch ? pageRangeDisplayed : pageYearlyRangeDisplayed}
                onChange={handlePageChange}
              />
            </div>
          </div>



        </div>
        :
        <div className="sustainability--page-no-order-error" style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <p>
            Create an event to view all your events
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="add-event-btn" onClick={() => setShouldAddEvent(true)}>Add Event</div>
          </div>
        </div>
    ) : (
      <div>
        <p style={{ marginTop: "50px" }} className="text-center">
          Create a Business to add events
        </p>

      </div>
    )}
  </>;
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
    sustainData: state.sustainabilityData,
  };
};
export default connect(mapStateToProps)(BusinessEvent);
// export default SocialSharing;
