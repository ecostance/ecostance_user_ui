import React, { useRef, useEffect, useState } from "react";

import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { Col, Container, Row } from "react-bootstrap";
import {
  getMetric,
  getRefferalData,
  getEarningData,
  getAllRefferalLogs,
} from "src/apiClient/user";
import {
  getAllCarbonFootPrint,
  getAllBusinessCarbonCalculations,
  getAnnualBusinessGraph,
  getBusinessOrdersData,
} from "src/apiClient/business";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Timeline from "../timelineData";
import treeImg from "../../../public/images/treepng.png";
import CustomBarChart from "../customBarChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Tooltip as TooltipBox } from "react-tippy";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import { getFormattedDate, getFormattedTime } from "src/helpers/formatDateTime";
import "chartjs-plugin-datalabels";
import Chart from "chart.js/auto";
import SliderCustom from "src/components/calculator/slider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// export const options = {
//   responsive: true,
// };

const BusinessDashboard = () => {
  // const [metricData, setMetricData] = useState({ fetched: false })
  const [selectedFilter, setSelectedFilter] = useState("week");
  const [thedata1, setTheData1] = useState([]);
  const [thedata2, setTheData2] = useState([]);
  const [labels, setLabels] = useState([]);
  const [refferalData, setRefferalData] = useState([]);
  const [EarningData, setEarningData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [toolTipMonthData, setTootTipMonthData] = useState([
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
  ]);
  const [toolTipMonthEarnData, setTootTipMonthEarnData] = useState([
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
  ]);
  const [toolTipWeekData, setTootTipWeekData] = useState([
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
  ]);
  const [toolTipWeekEarnData, setTootTipWeekEarnData] = useState([
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
    { USD: 0 },
  ]);
  const [refferalLogs, setRefferalLogs] = useState([]);
  const [carbonFootprintData, setCarbonFootPrintData] = useState("");
  const [doughNutData, setDoughNutData] = useState([]);
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [allProjects, setAllProjects] = useState([]);
  const [totalGHCReduced, setTotalGHCreduced] = useState("");
  const [theBarData, setTheBarData] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const [totalBusinessUsers, setTotalBusinessUsers] = useState(0);
  const [calculatedUsers, setCalculatedUsers] = useState(0);
  const [annualData, setAnnualData] = useState({ data: [] });
  const [slideScope1, setSlideScope1] = useState(50);
  const [slideScope2, setSlideScope2] = useState(50);
  const [slideScope3, setSlideScope3] = useState(50);
  const [ordersData, setOrdersData] = useState([]);
  const chartRef = useRef(null);
  const [gHGData, setGHGData] = useState("");
  const [totalGHGDataCount, setTotalGHGDataCount] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalGrossEventEmissions, setTotalGrossEventEmissions] = useState(0);
  const [isTooltipOpen1, setIsTooltipOpen1] = useState(false);
  const [isTooltipOpen2, setIsTooltipOpen2] = useState(false);
  const [isTooltipOpen3, setIsTooltipOpen3] = useState(false);
  const [isTooltipOpen4, setIsTooltipOpen4] = useState(false);
  const [isTooltipOpen5, setIsTooltipOpen5] = useState(false);
  const [isTooltipOpen6, setIsTooltipOpen6] = useState(false);
  const [isTooltipOpen7, setIsTooltipOpen7] = useState(false);
  const [isTooltipOpen8, setIsTooltipOpen8] = useState(false);
  const [isTooltipOpen9, setIsTooltipOpen9] = useState(false);
  const [isTooltipOpen10, setIsTooltipOpen10] = useState(false);
  const [isTooltipOpen11, setIsTooltipOpen11] = useState(false);
  const [isTooltipOpen12, setIsTooltipOpen12] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"));
    let businessCode = BusinessDetails?.businessCode;
    const response = await axios.get(
      `https://api.ecostance.com/v1/business-events/stats/${businessCode}`
    );
    const { data } = response.data;
    console.log(data, "yearlydataa1");
    setGHGData(data);
    let ghgCount = 0;
    // let userCount = 0;
    let totalEvents = 0;
    let totalgrossCarbonEmissions = 0;

    data.forEach((event) => {
      console.log(event, "valueee1");
      ghgCount += event?.totalAnnualghgReduced;
      //   userCount += event?.uniqueUserCount;
      totalEvents += event?.eventCount;
      totalgrossCarbonEmissions += event?.totalGrossCarbonEmission;
    });
    console.log(
      ghgCount,
      "ghgcounttotal",
      totalEvents,
      "totalEvents",
      totalgrossCarbonEmissions
    );

    setTotalGHGDataCount(ghgCount);
    // setTotalUserCount(userCount);
    setTotalEvents(totalEvents);
    setTotalGrossEventEmissions(totalgrossCarbonEmissions);
  };

  function addCommas(number) {
    // Convert number to string and add commas
    let formattedNumber = number?.toLocaleString("en-US");

    // Replace the comma for lakhs with double comma
    formattedNumber = formattedNumber?.replace(/,(?=\d{3},)/g, ",");

    // Split the number into integer and decimal parts
    let parts = formattedNumber?.split(".");
    let integerPart = parts?.[0];
    let decimalPart = parts?.length > 1 ? "." + parts?.[1].slice(0, 2) : "";

    // Concatenate integer and truncated decimal parts
    formattedNumber =
      parseInt(number) > 100 ? integerPart : integerPart + decimalPart;

    return formattedNumber;
  }

  let b;
  const currentDate = new Date(
    JSON.parse(localStorage.getItem("MyBusinessDetails"))?.createdAt
  );
  const lastEightMonthsArray = [];
  const lastEightMonthsArrayNums = [];
  let monthTrees = [];
  let ghgData = [];
  let emittedData = [];
  let finalMonthTrees = [];
  let currentMonth = currentDate.getMonth();
  let monthlyPurchaseData = [];
  let transformedData = [];

  useEffect(() => {
    fetchMetrics();
    getTransactions();
    getAllFootPrint();
    getAnnualBusinessData();
    // getAllListedProducts()
    getOrdersData();
  }, []);

  const fetchMetrics = async () => {
    let res = await getAllBusinessCarbonCalculations();
    if (res.data.success) {
      console.log("metrics", res.data);
      setMetricsData(res.data);
      setCalculatedUsers(res.data.businessUserCalculatedCount);
    }
  };

  const getOrdersData = async () => {
    let res = await getBusinessOrdersData();
    if (res.data.success) {
      console.log("new-business-orders", res.data);
      setOrdersData(res.data);
      setAllProjects(res?.data?.supportedProduct);
    }
  };

  useEffect(() => {
    getRefferal();
  }, [selectedFilter]);

  const getAnnualBusinessData = async () => {
    let annualData = await getAnnualBusinessGraph();
    if (annualData.data.success) {
      console.log(annualData.data, "annualDataBusiness");
      setAnnualData(annualData.data);
    }
  };

  let tooltipMonths = [];
  let tooltipMonthEarnings = [];
  let tooltipWeeks = [];
  let tooltipWeeksEarnings = [];
  let totalTreesPlanted = 0;
  let ghcReduced = 0;
  let userFootprintCalculated = 0;

  const getAllFootPrint = async () => {
    let footprintData = await getAllCarbonFootPrint();
    if (footprintData.data.success) {
      totalTreesPlanted = footprintData?.data?.businessAggregate.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.UserCarbonFootPrint.treesPlanted;
        },
        0
      );
      // const allProjects = footprintData?.data?.businessAggregate.flatMap(obj => obj.UserCarbonFootPrint.projectsSupported);
      ghcReduced = footprintData?.data?.businessAggregate.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.UserCarbonFootPrint.ghgReduced;
        },
        0
      );
      setTotalGHCreduced(ghcReduced);
      // Remove duplicates using Set
      // const uniqueProjects = [...new Set(allProjects)];
      // setAllProjects(footprintData?.data?.supportedProduct)
      setCarbonFootPrintData(footprintData.data);
      setTreesPlanted(totalTreesPlanted);
      console.log(footprintData.data, "footPrint");
      setDoughNutData([
        footprintData.data.businessAggregate.length -
          footprintData.data.carbonCalculationCount,
        footprintData.data.carbonCalculationCount,
      ]);
      setTotalBusinessUsers(footprintData.data.businessAggregate.length);
      setTheBarData([
        footprintData?.data?.totalCarbonEmissionsCount?.toFixed(2),
        ghcReduced,
      ]);
    }
  };

  // const getAllListedProducts = async () => {
  //     let listedData = await getAllSupportedProducts()
  //     if (listedData.data.success) {
  //         console.log("supported data", listedData.data.supportedProduct)
  //     }
  // }

  // Sample data

  for (let i = 0; i < 12; i++) {
    const lastMonth = new Date(currentDate);
    lastMonth.setMonth(currentDate.getMonth() + i);
    lastEightMonthsArray.push(
      lastMonth
        .toLocaleString("default", { month: "short", year: "numeric" })
        .split(" ")[0] +
        " " +
        lastMonth
          .toLocaleString("default", { month: "short", year: "numeric" })
          .split(" ")[1]
          .slice(-2)
    );
    let monthIndex = lastMonth.getMonth();

    lastEightMonthsArrayNums.push(monthIndex + 1);
  }
  console.log(lastEightMonthsArrayNums, "numss");
  if (metricsData?.data?.length > 0) {
    transformedData = metricsData.data.map((item) => {
      const transformedItem = { ...item };
      transformedItem[
        "Total Purchased"
      ] = `${transformedItem.ghgReduced} CO2 tons`;
      transformedItem.OrderValue.forEach((value) => {
        if (
          value.currency === "USD" ||
          value.currency === "INR" ||
          value.currency === "EUR" ||
          value.currency === "GBP" ||
          value.currency === "CAD" ||
          value.currency === "JPY"
        ) {
          transformedItem[`Total Purchases (in ${value.currency})`] =
            value.amountValue;
        } else {
          transformedItem[value.currency] = value.amountValue;
        }
      });
      delete transformedItem.ghgReduced;
      delete transformedItem.orderCount;
      delete transformedItem.OrderValue;
      return transformedItem;
    });
    console.log("transss", transformedData);
    lastEightMonthsArrayNums.forEach((monthNum) => {
      var found = transformedData.find((item) => item?._id?.month == monthNum);
      // var foundEmitted = metricsData.dataEmitCalc.find(item => item?._id?.month == monthNum)
      monthTrees.push(found ? found.treesPlanted / 12 : 0);
      ghgData.push(found ? found.ghgReduced : 0);
      monthlyPurchaseData.push(
        found
          ? found
          : { _id: 0, ghgReduced: 0, treesPlanted: 0, orderCount: 0 }
      );
      // emittedData.push(foundEmitted ? foundEmitted.totalCarbonEmissions : 0)
      // setCalculatedUsers(metricsData?.businessUserCalculatedCount)
    });
  }

  if (monthlyPurchaseData.length > 0) {
    monthlyPurchaseData = monthlyPurchaseData.map((item) => {
      delete item._id;
      delete item.ghgReduced;
      delete item.treesPlanted;
      return item;
    });
  }
  console.log(monthlyPurchaseData, "newData");

  if (metricsData?.dataEmitCalc?.length > 0) {
    lastEightMonthsArrayNums.forEach((monthNum) => {
      var foundEmitted = metricsData.dataEmitCalc.find(
        (item) => item?._id?.month == monthNum
      );
      emittedData.push(foundEmitted ? foundEmitted.totalCarbonEmissions : 0);
    });
  }
  console.log(monthTrees, ghgData, emittedData, "businessData");
  monthTrees.forEach((element, index) => {
    let sum = element;
    monthTrees.slice(index + 1).forEach((nextElement) => {
      sum += nextElement;
    });
    finalMonthTrees.push(sum);
  });

  let barData = {
    labels: lastEightMonthsArray,
    datasets: [
      {
        label: "Business Purchases Of Carbon Offsets (Tons)",
        data: monthTrees,
        backgroundColor: "rgba(0 , 196, 243, 0.4)",
      },
    ],
  };

  let purchaseOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataIndex = context.dataIndex;
            const tooltipValues = monthlyPurchaseData[dataIndex];
            let tooltipText = "";

            // Loop through tooltip values and combine them into tooltip text
            Object.keys(tooltipValues).forEach((key) => {
              tooltipText = [...tooltipText, `${key} : ${tooltipValues[key]}`];
            });

            return tooltipText;
          },
        },
      },
    },
  };

  const lastFiveYears = [];
  let yearEmitted = [];
  let yearReduced = [];
  let currentYearReduced = 0;
  let currentYearEmitted = 0;
  let thisYear = new Date().getFullYear();
  let yearLabels = [];

  for (let i = 0; i <= 1; i++) {
    yearLabels.push("Jan-Dec" + " " + (thisYear - i));
    lastFiveYears.push(thisYear - i);
    let yearLoop = lastFiveYears[i];
    if (annualData.data.length > 0) {
      var found = annualData.data.find((item) => item?._id?.year == yearLoop);
      var foundEmitted = annualData.dataEmitCalc.find(
        (item) => item?._id?.year == yearLoop
      );
      var currentYearData = annualData.data.find(
        (item) => item?._id?.year == thisYear
      );
      var currentYearEmittedData = annualData.dataEmitCalc.find(
        (item) => item?._id?.year == thisYear
      );
      yearReduced.push(found ? found.ghgReduced.toFixed(2) : 0);
      currentYearReduced = currentYearData ? currentYearData.ghgReduced : 0;
      currentYearEmitted = currentYearEmittedData
        ? currentYearEmittedData.totalCarbonEmissions
        : 0;
      yearEmitted.push(
        foundEmitted ? foundEmitted.totalCarbonEmissions?.toFixed(2) : 0
      );
    }
  }

  let barCompareData = {
    labels: yearLabels.reverse(),
    datasets: [
      {
        label: "Total CO2 Emitted (Tons)",
        data: yearEmitted.reverse(),
        backgroundColor: "rgba(236 , 155, 170, 0.5)",
      },
      {
        label: "Total CO2 Reduced (Tons)",
        data: yearReduced.reverse(),
        backgroundColor: "rgba(117 , 177, 120, 0.5)",
      },
    ],
  };

  const data = {
    labels: [
      "Members who have not calculated carbon footprint",
      "Members who have calculated carbon footprint",
    ],
    displayText: ["have not calculated ", "have calculated"],
    datasets: [
      {
        data: [totalBusinessUsers - calculatedUsers, calculatedUsers],
        backgroundColor: ["rgba(228 , 231, 246, 1)", "rgba(189 , 232, 239, 1)"],
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          title: function () {
            return ""; // Empty string to remove the title/label
          },
          label: function (context) {
            const dataIndex = context.dataIndex;
            const label = data.displayText[dataIndex];
            const value = data.datasets[0].data[dataIndex];
            return `${value} ${label}`;
          },
        },
        bodyFontSize: 26, // Change the font size as required
      },
    },
  };

  const groupedData = {
    labels: ["Current / Actual", "Future Projected Emissions"],
    datasets: [
      {
        label: "Scope 1",
        data: [
          carbonFootprintData?.data?.scope1 * 0.75,
          (
            (carbonFootprintData?.data?.scope1 * 0.75 * slideScope1) /
            100
          )?.toFixed(2),
        ],
        backgroundColor: [
          "rgba(255, 206, 86, 0.4)",
          "rgba(168 , 219, 171, 0.5)",
        ],
      },
      {
        label: "Scope 2",
        data: [
          carbonFootprintData?.data?.scope2 * 0.75,
          (
            (carbonFootprintData?.data?.scope2 * 0.75 * slideScope2) /
            100
          )?.toFixed(2),
        ],
        backgroundColor: [
          "rgba(255, 206, 86, 0.4)",
          "rgba(168 , 219, 171, 0.5)",
        ],
      },
      {
        label: "Scope 3",
        data: [
          carbonFootprintData?.data?.scope3 * 0.75,
          (
            (carbonFootprintData?.data?.scope3 * 0.75 * slideScope3) /
            100
          )?.toFixed(2),
        ],
        backgroundColor: [
          "rgba(255, 206, 86, 0.4)",
          "rgba(168 , 219, 171, 0.5)",
        ],
      },
    ],
  };

  const baseactualdata = {
    labels: ["Baseline", "Current / Actual"],
    datasets: [
      {
        label: "Scope 1",
        data: [
          carbonFootprintData?.data?.scope1,
          carbonFootprintData?.data?.scope1 * 0.75,
        ],
        backgroundColor: [
          "rgba(119 , 119, 119, 0.4)",
          "rgba(255, 206, 86, 0.4)",
        ],
      },
      {
        label: "Scope 2",
        data: [
          carbonFootprintData?.data?.scope2,
          carbonFootprintData?.data?.scope2 * 0.75,
        ],
        backgroundColor: [
          "rgba(119 , 119, 119, 0.4)",
          "rgba(255, 206, 86, 0.4)",
        ],
      },
      {
        label: "Scope 3",
        data: [
          carbonFootprintData?.data?.scope3,
          carbonFootprintData?.data?.scope3 * 0.75,
        ],
        backgroundColor: [
          "rgba(119 , 119, 119, 0.4)",
          "rgba(255, 206, 86, 0.4)",
        ],
      },
    ],
  };

  let nextYearsEmissions = [currentYearEmitted.toFixed(2)];
  let initialEmission = parseFloat(currentYearEmitted.toFixed(2));
  if (currentYearEmitted) {
    Array(5)
      .fill("")
      .forEach((item) => {
        initialEmission += initialEmission * 0.1;
        nextYearsEmissions.push(initialEmission.toFixed(2));
      });
    let nextYearPrediction =
      parseFloat(
        (
          (carbonFootprintData?.data?.scope1 * 0.75 * slideScope1) /
          100
        )?.toFixed(2)
      ) +
      parseFloat(
        (
          (carbonFootprintData?.data?.scope2 * 0.75 * slideScope2) /
          100
        )?.toFixed(2)
      ) +
      parseFloat(
        (
          (carbonFootprintData?.data?.scope3 * 0.75 * slideScope3) /
          100
        )?.toFixed(2)
      );
    console.log("next-year-prediction", nextYearPrediction);
    nextYearsEmissions[1] = nextYearPrediction;
  }

  let currentEmissions = {
    labels: ["Current Year", 2025, 2026, 2027, 2028, 2029],
    datasets: [
      {
        label: "Current & Next Five Year Emissions",
        data: nextYearsEmissions,
        // backgroundColor: ,
        backgroundColor: [
          "rgba(255, 206, 86, 0.4)",
          "rgba(168 , 219, 171, 0.5)",
          "rgba(160 , 32, 240, 0.5)",
          "rgba(160 , 32, 240, 0.5)",
          "rgba(160 , 32, 240, 0.5)",
          "rgba(160 , 32, 240, 0.5)",
        ],
      },
    ],
  };

  const projectionOptions = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  const getTransactions = async () => {
    let transactionData = await getAllRefferalLogs();
    if (transactionData.data.success) {
      setRefferalLogs(transactionData.data.data);
      console.log(transactionData.data.data, "transactions");
    }
  };

  const getRefferal = async () => {
    let referralData = await getRefferalData(selectedFilter);
    let EarningsData = await getEarningData(selectedFilter);
    // console.log(referralData.data.data, "refferalData")
    if (referralData?.data?.success && EarningsData?.data?.success) {
      setRefferalData(referralData?.data?.data);
      setDataLoaded(true);
      // console.log(selectedFilter)

      const currentYear = new Date().getFullYear();
      const currentDate = new Date();

      const lastSevenDaysArray = [];
      const lastSevenWeekArray = [];
      const lastSevenWeekArrayNums = [];
      const lastSevenMonthsArray = [];
      const lastSevenMonthsArrayNums = [];

      Date.prototype.getWeek = function () {
        const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
        const pastDaysOfYear = (this - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      };

      function getFirstDateOfWeek(year, week) {
        const date = new Date(year, 0, 1 + (week - 1) * 7);
        const dayOfWeek = date.getDay();
        const firstDateOfWeek =
          date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(date.setDate(firstDateOfWeek));
      }

      function formatDate(date) {
        const options = { month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
      }

      function getLast7Weeks() {
        const currentDate = new Date();
        const last7Weeks = [];

        for (let i = 0; i < 7; i++) {
          const weekStartDate = getFirstDateOfWeek(
            currentDate.getFullYear(),
            currentDate.getWeek() - i
          );
          const formattedDate = formatDate(weekStartDate);
          last7Weeks.push("Week of " + formattedDate);
        }

        return last7Weeks;
      }

      let last7WeeksData = getLast7Weeks();

      function getLastSevenWeekData() {
        var today = new Date();
        var weekNumbers = [];

        // Loop through the last 7 weeks
        for (var i = 0; i < 7; i++) {
          var pastDate = new Date(today);
          pastDate.setDate(today.getDate() - i * 7); // Subtract i weeks

          // Get the week number for the past date
          var weekNumber = getWeekNumber(pastDate);

          // Add week number to the array
          weekNumbers.push("Week " + weekNumber);
        }

        return weekNumbers;
      }

      function getWeekNumber(date) {
        var d = new Date(date);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
        return weekNumber;
      }

      lastSevenWeekArray = getLastSevenWeekData();
      console.log(lastSevenWeekArray, "weeks");
      // let theApiData = []
      let monthsArray = [];
      let monthEarnings = [];
      if (selectedFilter === "month") {
        let currentMonth = currentDate.getMonth();
        for (let i = 0; i < 7; i++) {
          const lastMonth = new Date(currentDate);
          lastMonth.setMonth(currentDate.getMonth() - i);
          lastSevenMonthsArray.push(
            lastMonth.toLocaleString("default", {
              month: "short",
              year: "numeric",
            })
          );
          let monthIndex = (currentMonth - i + 12) % 12;

          lastSevenMonthsArrayNums.push(monthIndex + 1);
        }

        // referralData.data.data.forEach(item => {
        //   theApiData.push({ month: item?.month, amount: item?.TotalUSDAmt })
        // });

        console.log(lastSevenMonthsArray, lastSevenMonthsArrayNums, "months");

        lastSevenMonthsArrayNums.forEach((monthNum) => {
          var found = referralData.data.data.find(
            (item) => item?.month == monthNum
          );
          var foundEarning = EarningsData.data.data.find(
            (item) => item?.month == monthNum
          );
          monthsArray.push(found ? found.TotalUSDAmt : 0);
          monthEarnings.push(foundEarning ? foundEarning.TotalUSDAmt : 0);
          tooltipMonths.push(
            found
              ? { ...{ "Total USD": found.TotalUSDAmt }, ...found.totalAmt }
              : { USD: 0 }
          );
          tooltipMonthEarnings.push(
            foundEarning
              ? {
                  ...{ "Total USD": foundEarning.TotalUSDAmt },
                  ...foundEarning.totalAmt,
                }
              : { USD: 0 }
          );
        });
        tooltipMonths = tooltipMonths.reverse();
        tooltipMonthEarnings = tooltipMonthEarnings.reverse();

        console.log(tooltipMonths, "RESULTT");
        setTootTipMonthData(tooltipMonths);
        setTootTipMonthEarnData(tooltipMonthEarnings);
      }
      let weeksArray = [];
      let weekEarnings = [];
      if (selectedFilter === "week") {
        console.log(lastSevenWeekArray, "weeks");
        lastSevenWeekArray.forEach((weekNum) => {
          var found = referralData.data.data.find(
            (item) => item?.week + 1 == weekNum.split(" ")[1]
          );
          var foundEarning = EarningsData.data.data.find(
            (item) => item?.week + 1 == weekNum.split(" ")[1]
          );
          weeksArray.push(found ? found.TotalUSDAmt : 0);
          weekEarnings.push(foundEarning ? foundEarning.TotalUSDAmt : 0);
          tooltipWeeks.push(
            found
              ? { ...{ "Total USD": found.TotalUSDAmt }, ...found.totalAmt }
              : { USD: 0 }
          );
          tooltipWeeksEarnings.push(
            foundEarning
              ? {
                  ...{ "Total USD": foundEarning.TotalUSDAmt },
                  ...foundEarning.totalAmt,
                }
              : { USD: 0 }
          );
        });
        tooltipWeeks = tooltipWeeks.reverse();
        tooltipWeeksEarnings = tooltipWeeksEarnings.reverse();

        console.log(tooltipWeeks, "RESULTT-week");
        setTootTipWeekData(tooltipWeeks);
        setTootTipWeekEarnData(tooltipWeeksEarnings);
      }

      if (refferalData)
        if (selectedFilter === "week") {
          setTheData1(weeksArray.reverse());
          setTheData2(weekEarnings.reverse());
          setLabels(last7WeeksData.reverse());
        }
      if (selectedFilter === "month") {
        setTheData1(monthsArray.reverse());
        setTheData2(monthEarnings.reverse());
        setLabels(lastSevenMonthsArray.reverse());
      }
    }
    setRefferalData(referralData.data.data);
  };

  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }

    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  let doughnutRemainEmitted =
    Math.ceil(currentYearEmitted) - Math.ceil(currentYearReduced) > 0
      ? Math.ceil(currentYearEmitted) - Math.ceil(currentYearReduced)
      : 0;

  let PercentageData = Math.ceil(
    (currentYearReduced / currentYearEmitted) * 100
  );

  let totalEmittedEstimate =
    totalBusinessUsers *
    (parseFloat(currentYearEmitted) / calculatedUsers).toFixed(2);
  let percentageEstimate = currentYearReduced / totalEmittedEstimate;
  let estimatedEmissionPerPerson = (
    currentYearEmitted / calculatedUsers
  ).toFixed(2);
  let estimateEmissions = (
    (currentYearEmitted / calculatedUsers) *
    totalBusinessUsers
  ).toFixed(2);
  console.log(calculatedUsers, "estimate");

  const doughNutDataBusiness = {
    labels: ["My Carbon Footprint", "Carbon Footprint Reduced"],
    datasets: [
      {
        data: [doughnutRemainEmitted, Math.ceil(currentYearReduced)],
        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)"],
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptionsBusiness = {
    cutoutPercentage: 80, // Adjust the cutoutPercentage to control the size of the hole in the middle
    maintainAspectRatio: false, // Ensure the chart fits its container without maintaining aspect ratio
    legend: {
      display: false, // Hide the legend
    },
  };

  const horizantalData = {
    labels: ["Business  Emissions", "Business Emissions Reduced"],
    datasets: [
      {
        label: ["Business Emissions"],
        backgroundColor: [
          "rgba(236 , 155, 170, 0.5)",
          "rgba(117 , 177, 120, 0.5)",
        ],
        borderColor: ["rgba(236 , 155, 170, 0.5)", "rgba(117 , 177, 120, 0.5)"],
        borderWidth: 1,
        hoverBackgroundColor: [
          "rgba(236 , 155, 170, 0.5)",
          "rgba(117 , 177, 120, 0.5)",
        ],
        hoverBorderColor: [
          "rgba(236 , 155, 170, 0.5)",
          "rgba(117 , 177, 120, 0.5)",
        ],
        data: [currentYearEmitted?.toFixed(2), currentYearReduced?.toFixed(2)],
      },
    ],
  };
  let toolTipData = [
    { "My Emissions": currentYearEmitted?.toFixed(2) },
    { "My Emissions Reduced": currentYearReduced?.toFixed(2) },
  ];

  const horizantalOptions = {
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataIndex = context.dataIndex;
            const tooltipValues = toolTipData[dataIndex];
            let tooltipText = "";
            // Loop through tooltip values and combine them into tooltip text
            Object.keys(tooltipValues).forEach((key) => {
              tooltipText = [`${tooltipValues[key]}`];
            });

            return tooltipText;
          },
        },
      },
    },
  };

  const handleSlideScope = (item, value) => {
    if (item === "scope1") {
      setSlideScope1(value);
    }
    if (item === "scope2") {
      setSlideScope2(value);
    }
    if (item === "scope3") {
      setSlideScope3(value);
    }
  };

  const DashboardContainer = (
    <>
      <div className="orders-order-box" style={{ marginTop: "60px" }}>
        <div style={{ display: "flex" }}>
          {/* <div style={{ width: "50%" }}>
              <div className="card--boxes  event-circular-box">
                <div className='charts-disp doughnut-chart-title'>Emissions&nbsp;breakdown&nbsp;by&nbsp;Category</div>
                <br />
                <Pie data={doughnutData} options={options} />
              </div>
            </div> */}
        </div>
        <div style={{ padding: "0px 30px 0px", width: "100%" }}>
          <div
            className="profile-line"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "30px",
              marginTop: "25px",
            }}
          >
            {/* <p class="orders--orderNumber-Holder">Order #: <b>1000 0001 16896</b></p> */}
            <p
              className="orders--orderNumber-Holder"
              style={{
                display: localStorage.getItem("MyBusinessDetails")
                  ? ""
                  : "none",
              }}
            >
              Business name:{" "}
              <b>
                {JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}
              </b>
            </p>
            <p className="profile-head"></p>
          </div>
        </div>
        <div style={{ display: "flex", padding: "40px 25px 80px" }}>
          <div className="business-boxes">
            <div style={{ display: "flex", margin: "auto" }}>
              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen1(true)}
                onMouseLeave={() => setIsTooltipOpen1(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Total number of members
                      <br />
                      in the company
                    </div>
                  }
                  position="top"
                  animation="shift"
                  arrow={true}
                  duration={200}
                  open={isTooltipOpen1}
                >
                  <div className="card--event--title">
                    {ordersData?.totalMemberCount}
                  </div>
                  <div className="event--subtitle">
                    Employees in Company (Actual)
                  </div>
                </TooltipBox>
              </div>

              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen2(true)}
                onMouseLeave={() => setIsTooltipOpen2(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Number of employees who <br /> calculated their emissions
                    </div>
                  }
                  position="top"
                  animation="shift"
                  arrow={true}
                  duration={200}
                  open={isTooltipOpen2}
                >
                  <div className="card--event--title">
                    {ordersData?.carbonCalculationCount}
                  </div>
                  <div className="event--subtitle">
                    Employees calculated their Emissions (Actual)
                  </div>
                </TooltipBox>
              </div>

              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen3(true)}
                onMouseLeave={() => setIsTooltipOpen3(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Total tons of emissions <br /> reduced for the business
                    </div>
                  }
                  position="top"
                  animation="shift"
                  arrow={true}
                  duration={200}
                  open={isTooltipOpen3}
                >
                  <div className="card--event--title">
                    {ordersData?.businessProfileAggregate?.ghgReduced -
                      ordersData?.businessProfileAggregate?.ghgReducedEvent}
                  </div>
                  <div className="event--subtitle">
                    Tons of Emissions reduced for Business (Actual)
                  </div>
                </TooltipBox>
              </div>

              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen4(true)}
                onMouseLeave={() => setIsTooltipOpen4(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Emissions reduced <br />
                      per employee in tons
                    </div>
                  }
                  position="top"
                  animation="shift"
                  arrow={true}
                  duration={200}
                  open={isTooltipOpen4}
                >
                  <div className="card--event--title">
                    {(
                      (ordersData?.businessProfileAggregate?.ghgReduced -
                        ordersData?.businessProfileAggregate?.ghgReducedEvent) /
                      ordersData?.totalMemberCount
                    ).toFixed(2)}
                  </div>
                  <div className="event--subtitle">
                    Tons of Emissions reduced per Employee (Actual)
                  </div>
                </TooltipBox>
              </div>
            </div>

            <div style={{ display: "flex", marginTop: "10px" }}>
              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen5(true)}
                onMouseLeave={() => setIsTooltipOpen5(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Percentage of employees participating <br /> in carbon
                      calculations
                    </div>
                  }
                  position="top"
                  open={isTooltipOpen5}
                  animation="shift"
                  arrow={true}
                  duration={200}
                >
                  <div className="card--event--title">
                    {Math.ceil(
                      (ordersData?.carbonCalculationCount /
                        ordersData?.totalMemberCount) *
                        100
                    )}
                    %
                  </div>
                  <div className="event--subtitle">Employee Participation</div>
                </TooltipBox>
              </div>

              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen6(true)}
                onMouseLeave={() => setIsTooltipOpen6(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Estimated total tons of <br />
                      emissions from all employees
                    </div>
                  }
                  position="top"
                  open={isTooltipOpen6}
                  animation="shift"
                  arrow={true}
                  duration={200}
                >
                  <div className="card--event--title">
                    {ordersData?.totalCarbonEmissionsCount
                      ? (
                          (ordersData?.totalCarbonEmissionsCount /
                            ordersData?.carbonCalculationCount) *
                          ordersData?.totalMemberCount
                        ).toFixed(2)
                      : 0}
                  </div>
                  <div className="event--subtitle">
                    Tons of Emissions of all Employees (Estimate)
                  </div>
                </TooltipBox>
              </div>

              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen7(true)}
                onMouseLeave={() => setIsTooltipOpen7(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Estimated tons of <br />
                      emissions per employee
                    </div>
                  }
                  position="top"
                  open={isTooltipOpen7}
                  animation="shift"
                  arrow={true}
                  duration={200}
                >
                  <div className="card--event--title">
                    {ordersData?.totalCarbonEmissionsCount
                      ? (
                          ordersData?.totalCarbonEmissionsCount /
                          ordersData?.carbonCalculationCount
                        )?.toFixed(2)
                      : 0}
                  </div>
                  <div className="event--subtitle">
                    Tons of Emissions per Employee (Estimate)
                  </div>
                </TooltipBox>
              </div>

              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen8(true)}
                onMouseLeave={() => setIsTooltipOpen8(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Percentage of emissions reduced
                      <br />
                      based on calculations
                    </div>
                  }
                  position="top"
                  open={isTooltipOpen8}
                  animation="shift"
                  arrow={true}
                  duration={200}
                >
                  <div className="card--event--title">
                    {ordersData?.businessProfileAggregate?.ghgReduced === 0
                      ? "0%"
                      : ordersData?.totalCarbonEmissionsCount === 0
                      ? "100%"
                      : (
                          ((ordersData?.businessProfileAggregate?.ghgReduced -
                            ordersData?.businessProfileAggregate
                              ?.ghgReducedEvent) /
                            ((ordersData?.totalCarbonEmissionsCount /
                              ordersData?.carbonCalculationCount) *
                              ordersData?.totalMemberCount)) *
                          100
                        ).toFixed(2) + "%"}
                  </div>

                  <div className="event--subtitle">
                    Percent of Emissions Reduced (Estimate)
                  </div>
                </TooltipBox>
              </div>
            </div>

            <div style={{ display: "flex", marginTop: "10px" }}>
              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen9(true)}
                onMouseLeave={() => setIsTooltipOpen9(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Total number of events
                    </div>
                  }
                  position="top"
                  open={isTooltipOpen9}
                  animation="shift"
                  arrow={true}
                  duration={200}
                >
                  <div className="card--event--title">{totalEvents}</div>
                  <div className="event--subtitle">Total Events</div>
                </TooltipBox>
              </div>

              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen10(true)}
                onMouseLeave={() => setIsTooltipOpen10(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Total emissions in KiloTon
                      <br />
                      from all events
                    </div>
                  }
                  position="top"
                  open={isTooltipOpen10}
                  animation="shift"
                  arrow={true}
                  duration={200}
                >
                  <div className="card--event--title">
                    {addCommas(totalGrossEventEmissions / 1000)}
                  </div>
                  <div className="event--subtitle">
                    Total emissions (in KiloTon) from all events
                  </div>
                </TooltipBox>
              </div>

              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen11(true)}
                onMouseLeave={() => setIsTooltipOpen11(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Total GHG reduced in KiloTon
                    </div>
                  }
                  position="top"
                  open={isTooltipOpen11}
                  animation="shift"
                  arrow={true}
                  duration={200}
                >
                  <div className="card--event--title">
                    {addCommas(totalGHGDataCount / 1000)}
                  </div>
                  <div className="event--subtitle">
                    Total GHG reduced (in KiloTon)
                  </div>
                </TooltipBox>
              </div>

              <div
                className="card--boxes event-box pop-up-animation"
                style={{ width: "259px" }}
                onMouseEnter={() => setIsTooltipOpen12(true)}
                onMouseLeave={() => setIsTooltipOpen12(false)}
              >
                <TooltipBox
                  html={
                    <div
                      style={{ whiteSpace: "pre-line", textAlign: "center" }}
                    >
                      Percentage of emissions reduced
                      <br />
                      based on total emissions
                    </div>
                  }
                  position="top"
                  open={isTooltipOpen12}
                  animation="shift"
                  arrow={true}
                  duration={200}
                >
                  <div className="card--event--title">
                    {totalGHGDataCount
                      ? (
                          (totalGHGDataCount / totalGrossEventEmissions) *
                          100
                        ).toFixed(3)
                      : 0}
                    %
                  </div>
                  <div className="event--subtitle">
                    Percentage of emission reduced
                  </div>
                </TooltipBox>
              </div>
            </div>
          </div>
          {/* <div style={{ width: "50%" }}>
                        <div style={{ display: "flex" }}>
                            <div className="card--boxes event-box">
                                <div className="card--event--title">67%</div>
                                <div className="event--subtitle">Percentage of Reduction</div>
                            </div>
                            <div className="card--boxes  event-box">
                                <div className="card--event--title">10</div>
                                <div className="event--subtitle">Total Emissions (in Metric Tons) from all events</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", marginTop: "10px" }}>
                            <div className="card--boxes  event-box">
                                <div className="card--event--title">10</div>
                                <div className="event--subtitle">Total Users Attending the Event</div>
                            </div>
                            <div className="card--boxes  event-box">
                                <div className="card--event--title">10</div>
                                <div className="event--subtitle">Total Emissions Per Person (in Metric Tons)</div>
                            </div>
                        </div>
                    </div> */}
        </div>

        {/* <div className='carbon-data'>A Total of {carbonFootprintData?.totalCarbonEmissionsCount?.toFixed(2)} metric tons of carbon is emitted</div> */}
        {/* <div className="charts-align-title">
                    <div className='charts-disp doughnut-chart-title'>Num.&nbsp;of&nbsp;Employees&nbsp;who&nbsp;Calculated&nbsp;their&nbsp;Carbon&nbsp;Footprint</div>
                    <div className='charts-disp doughnut-chart-title'>Carbon Footprint: Emitted vs Reduced</div>
                </div> */}
        <div className="charts-align-title">
          {/* <div className='charts-disp doughnut-chart-title'>Total Trees Planted: {isNaN(finalMonthTrees[finalMonthTrees.length - 1]) ? "0" : Math.ceil(finalMonthTrees[finalMonthTrees.length - 1])}</div> */}
          <div className="charts-disp doughnut-chart-title">
            Business Purchases
          </div>
          <div className="charts-disp doughnut-chart-title">
            Carbon Footprint: Emitted vs Reduced
          </div>
        </div>

        <div className="charts-align" style={{ padding: "40px 25px 80px" }}>
          <div className="charts-disp">
            {/* <p className='doughnut-chart-title'>Num.&nbsp;of&nbsp;Employees&nbsp;who&nbsp;calculated&nbsp;the&nbsp;Carbon&nbsp;Footprint</p> */}
            <Bar data={barData} options={purchaseOptions} />
          </div>
          <div className="charts-disp">
            {/* <p className='doughnut-chart-title'>Companies Carbon Footprint : (total emitted and reduced)</p> */}
            <Bar data={barCompareData} />
          </div>
        </div>
        <div className="charts-align-title">
          <div className="charts-disp doughnut-chart-title">
            Business&nbsp;Emission&nbsp;Reduction&nbsp;Percentage&nbsp;(
            {currentYearEmitted ? Math.ceil(PercentageData) : "0"}%)
          </div>
          <div className="charts-disp doughnut-chart-title">
            <p>Total Trees Planted: {Math.ceil(currentYearReduced) * 12}</p>
            <h3 style={{ fontSize: "18px" }}>
              Planting 12 trees reduces 1 ton of CO2
            </h3>
          </div>
        </div>
        <div className="charts-align" style={{ padding: "40px 25px 80px" }}>
          <div
            className="charts-disp"
            style={{ width: "590px", height: "300px" }}
          >
            <Bar data={horizantalData} options={horizantalOptions} />
          </div>
          <div
            className="charts-disp"
            style={{
              width: "516px",
              height: "300px",
              overflow: "scroll",
              scrollbarWidth: "none",
            }}
          >
            {Array(Math.ceil(doughnutRemainEmitted))
              .fill("")
              .map((e) => {
                return (
                  <img
                    src="/images/whitetreeiconobg.png"
                    width="35px"
                    height="40px"
                  />
                );
              })}
            {Array(Math.ceil(currentYearReduced))
              .fill("")
              .map((e) => {
                return (
                  <img
                    src="/images/greensvgnobg.png"
                    width="35px"
                    height="40px"
                  />
                );
              })}
          </div>
        </div>
        {/* <div>
          <div className="charts-align-title">
            <div className="charts-disp doughnut-chart-title">
              Forecast And Planning
            </div>
          </div>
          <br />
        </div> */}
        {/* <div
          className="table--box"
          style={{ width: "95%", margin: "20px auto" }}
        >
          <div className="charts-align-title" style={{ marginTop: "20px" }}>
            <div className="charts-disp doughnut-chart-title">
              Projected Emission Reductions
            </div>
            <div className="charts-disp doughnut-chart-title">
              Baseline & Actual
            </div>
          </div>
          <div className="charts-align" style={{ padding: "40px 25px 80px" }}>
            <div className="charts-disp">
              <div>
                <p>
                  <b>Scope1 Reduction:</b>
                </p>
                <div className="transport-slider-holder">
                  <p>0%</p>
                  <SliderCustom
                    min={0}
                    max={100}
                    initValue={slideScope1}
                    onChange={handleSlideScope}
                    item="scope1"
                  />
                  <p>100%</p>
                </div>
                <p style={{ marginTop: "40px" }}>
                  <b>Scope2 Reduction:</b>
                </p>
                <div
                  className="transport-slider-holder"
                  style={{ marginBottom: "40px" }}
                >
                  <p>0%</p>
                  <SliderCustom
                    min={0}
                    max={100}
                    initValue={slideScope2}
                    onChange={handleSlideScope}
                    item="scope2"
                  />
                  <p>100%</p>
                </div>
                <p>
                  <b>Scope3 Reduction:</b>
                </p>
                <div className="transport-slider-holder">
                  <p>0%</p>
                  <SliderCustom
                    min={0}
                    max={100}
                    initValue={slideScope3}
                    onChange={handleSlideScope}
                    item="scope3"
                  />
                  <p>100%</p>
                </div>
              </div>
            </div>
            <div className="charts-disp">
              <Bar data={baseactualdata} />
            </div>
          </div>
          <div className="charts-align-title">
            <div className="charts-disp doughnut-chart-title">
              Next Year Projection
            </div>
            <div className="charts-disp doughnut-chart-title">
              Current & Next Five Year Projections
            </div>
          </div>
          <div className="charts-align" style={{ padding: "40px 25px 50px" }}>
            <div className="charts-disp">
              <Bar data={groupedData} />
            </div>
            <div className="charts-disp">
              <Bar data={currentEmissions} options={projectionOptions} />
            </div>
          </div>
        </div> */}
      </div>
      {/* <div className="orders-order-box tree-box" style={{ marginTop: '60px' }}>
                <p className='doughnut-chart-title' style={{ marginTop: "25px" }}>Total Trees Planted:  {isNaN(finalMonthTrees[finalMonthTrees.length - 1]) ? "0" : Math.ceil(finalMonthTrees[finalMonthTrees.length - 1])}</p>
                <div className='tree-charts-disp'>
                    <Bar ref={chartRef} data={barTreeData} options={treeOptions} plugins={[ChartDataLabels]} />
                </div>
            </div> */}
      <div className="orders-order-box" style={{ marginTop: "60px" }}>
        <p className="doughnut-chart-title" style={{ marginTop: "25px" }}>
          Total Projects Supported: {allProjects.length}
        </p>
        <Timeline items={allProjects} />
        {/* <div
                    className="checkout-area"
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <div className="dashboard--info-holder">
                        {EachContainer(
                            reductionSvg,
                            totalGHCReduced || 0,
                            'GHG Reduced (Metric Tons)'
                        )}
                        {EachContainer(
                            treePlantedSvg,
                            treesPlanted || 0,
                            'Trees Planted'
                        )}
                        {EachContainer(
                            projectSupportingSvg,
                            allProjects?.length || 0,
                            'Projects Supporting'
                        )}
                    </div>
                </div> */}
      </div>
    </>
  );

  return (
    <div>
      {localStorage.getItem("MyBusinessDetails") ? (
        DashboardContainer
      ) : (
        <div className="text-center" style={{ marginTop: "50px" }}>
          <p style={{ marginTop: "50px" }} className="text-center">
            Create a business to view the dashboard
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;
