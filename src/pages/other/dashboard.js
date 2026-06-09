import React, { useEffect, useState } from 'react'

import { LayoutTwo } from '../../components/Layout'
import { BreadcrumbOne } from '../../components/Breadcrumb'
import { Col, Container, Row } from 'react-bootstrap'
import { getMetric, getRefferalData, getEarningData, getAllRefferalLogs, getGraphicMetricData, getAnnualGraph } from 'src/apiClient/user'
import { getAllProducts } from 'src/apiClient/product'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  elements,
} from 'chart.js';
import { Bar, Doughnut, HorizontalBar } from 'react-chartjs-2';
import { getFormattedDate, getFormattedTime } from "src/helpers/formatDateTime";
import Timeline from '../timelineData'
import HorizontalBarChart from './horizantalChart'
import Pagination from "react-js-pagination";

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







const Dashboard = () => {
  const [metricData, setMetricData] = useState({ fetched: false })
  const [graphMetricData, setGraphMetricData] = useState([])
  const [selectedFilter, setSelectedFilter] = useState("month")
  const [thedata1, setTheData1] = useState([])
  const [thedata2, setTheData2] = useState([])
  const [labels, setLabels] = useState([])
  const [refferalData, setRefferalData] = useState([])
  const [EarningData, setEarningData] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false);
  const [toolTipMonthData, setTootTipMonthData] = useState([{ USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }])
  const [toolTipMonthEarnData, setTootTipMonthEarnData] = useState([{ USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }])
  const [toolTipWeekData, setTootTipWeekData] = useState([{ USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }])
  const [toolTipWeekEarnData, setTootTipWeekEarnData] = useState([{ USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }, { USD: 0 }])
  const [refferalLogs, setRefferalLogs] = useState([])
  const [themonthsData, setTheMonthsData] = useState([])
  const [annualData, setAnnualData] = useState({ data: [] })
  let [theTimeline, setTheTimeline] = useState([])
  const [myPurchases, setMyPurchases] = useState([])
  const [activePage, setActivePage] = useState(1);
  const [count, setCount] = useState("")
  const pageRangeDisplayed = 5;
  let limit = 15
  // const [doughNutData, setDoughNutData] = useState([])





  const fetchMetrics = async () => {
    try {
      const res = await getMetric()
      setMetricData({ fetched: true, ...res.data })
      const products = await getAllProducts()
      console.log(products.data.data, "products")
      let theSupportedData = []
      products.data.data.forEach(element => {
        Object.keys(res.data.projectsSupportedIndividualCount).forEach(projectData => {
          if (projectData === element.details.project.id) {
            theSupportedData.push({ image: element.image, shortDescription: element.shortDescription, name: element.name })
          }
        })

        console.log(theSupportedData, "supported1")
        setTheTimeline(theSupportedData)
        // if(Object.keys(res.data.projectsSupportedIndividualCount) === element.details.project._id){
        //    console.log(element , "supported1")
        // }
      })
    } catch (err) {
      console.log(err)
    }
  }


  const fetchGraphMetric = async () => {
    // const lastEightMonthsArray = [];
    // const lastEightMonthsArrayNums = []
    // let currentMonth = currentDate.getMonth();
    // for (let i = 0; i < 8; i++) {
    //   const lastMonth = new Date(currentDate);
    //   lastMonth.setMonth(currentDate.getMonth() - i);
    //   lastEightMonthsArray.push(lastMonth.toLocaleString('default', { month: 'short', year: 'numeric' }));
    //   let monthIndex = (currentMonth - i + 12) % 12;

    //   lastEightMonthsArrayNums.push(monthIndex + 1);
    // }

    try {
      const res = await getGraphicMetricData()
      if (res.data.success) {
        setGraphMetricData(res.data)
        setTheMonthsData(lastEightMonthsArray)
        console.log(res.data.data, "metricss")
      }
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    fetchMetrics().catch((err) => console.log(err))
    fetchGraphMetric().catch((err) => console.log(err))
    getAnnualData()
  }, [])


  useEffect(() => {
    getTransactions()
  }, [activePage, setActivePage])





  useEffect(() => {
    getRefferal()
  }, [selectedFilter])

  let tooltipMonths = []
  let tooltipMonthEarnings = []
  let tooltipWeeks = []
  let tooltipWeeksEarnings = []


  const getTransactions = async () => {
    let transactionData = await getAllRefferalLogs(activePage, limit)
    if (transactionData.data.success) {
      setRefferalLogs(transactionData.data.data)
      setCount(transactionData.data.metadata.total)
      console.log(transactionData.data.data, "transactions")
    }
  }


  const handlePageChange = (pageNumber) => {
    console.log(`Active page is ${pageNumber}`);
    setActivePage(pageNumber);
    // Add logic to fetch new data here if needed
  };

  const getAnnualData = async () => {
    let annualData = await getAnnualGraph()
    if (annualData.data.success) {
      console.log(annualData.data, "annualData")
      setAnnualData(annualData.data)
    }
  }

  const getRefferal = async () => {
    let referralData = await getRefferalData(selectedFilter)
    let EarningsData = await getEarningData(selectedFilter)
    console.log(referralData.data.data, "refferalData")
    if (referralData.data.success && EarningsData.data.success) {
      setRefferalData(referralData.data.data)
      setDataLoaded(true)
      // console.log(selectedFilter)

      const currentYear = new Date().getFullYear();
      const currentDate = new Date();

      const lastSevenDaysArray = [];
      const lastSevenWeekArray = [];
      const lastSevenWeekArrayNums = [];
      const lastSevenMonthsArray = [];
      const lastSevenMonthsArrayNums = []


      Date.prototype.getWeek = function () {
        const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
        const pastDaysOfYear = (this - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      };

      function getFirstDateOfWeek(year, week) {
        const date = new Date(year, 0, 1 + (week - 1) * 7);
        const dayOfWeek = date.getDay();
        const firstDateOfWeek = date.getDate() - dayOfWeek - 1 + (dayOfWeek === 0 ? -6 : 1);
        console.log(firstDateOfWeek, "dateee")
        return new Date(date.setDate(firstDateOfWeek));
      }

      function formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      }

      function getLast7Weeks() {
        const currentDate = new Date();
        const last7Weeks = [];

        for (let i = 0; i < 7; i++) {
          const weekStartDate = getFirstDateOfWeek(currentDate.getFullYear(), currentDate.getWeek() - i);
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
          pastDate.setDate(today.getDate() - (i * 7)); // Subtract i weeks

          // Get the week number for the past date
          var weekNumber = getWeekNumber(pastDate);

          // Add week number to the array
          weekNumbers.push("Week " + (weekNumber));
        }

        return weekNumbers;
      }

      function getWeekNumber(date) {
        var d = new Date(date);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNumber;
      }


      lastSevenWeekArray = getLastSevenWeekData();
      console.log(lastSevenWeekArray, "weeks");
      // let theApiData = []
      let monthsArray = []
      let monthEarnings = []
      if (selectedFilter === "month") {
        let currentMonth = currentDate.getMonth();
        for (let i = 0; i < 7; i++) {
          const lastMonth = new Date(currentDate);
          lastMonth.setMonth(currentDate.getMonth() - i);
          lastSevenMonthsArray.push(lastMonth.toLocaleString('default', { month: 'short', year: 'numeric' }));
          let monthIndex = (currentMonth - i + 12) % 12;

          lastSevenMonthsArrayNums.push(monthIndex + 1);
        }

        // referralData.data.data.forEach(item => {
        //   theApiData.push({ month: item?.month, amount: item?.TotalUSDAmt })
        // });

        console.log(lastSevenMonthsArray, lastSevenMonthsArrayNums, "months")




        lastSevenMonthsArrayNums.forEach(monthNum => {
          var found = referralData.data.data.find(item => item?.month == monthNum)
          var foundEarning = EarningsData.data.data.find(item => item?.month == monthNum)
          monthsArray.push(found ? found.TotalUSDAmt : 0)
          monthEarnings.push(foundEarning ? (foundEarning.TotalUSDAmt) : 0)
          tooltipMonths.push(found ? { ...{ "Total USD": found.TotalUSDAmt }, ...found.totalAmt } : { USD: 0 })
          tooltipMonthEarnings.push(foundEarning ? { ...{ "Total USD": foundEarning.TotalUSDAmt }, ...foundEarning.totalAmt } : { USD: 0 })
        })
        tooltipMonths = tooltipMonths.reverse()
        tooltipMonthEarnings = tooltipMonthEarnings.reverse()

        console.log(tooltipMonths, "RESULTT");
        setTootTipMonthData(tooltipMonths)
        setTootTipMonthEarnData(tooltipMonthEarnings)
      }
      let weeksArray = []
      let weekEarnings = []
      if (selectedFilter === "week") {
        console.log(lastSevenWeekArray, "weeks")
        lastSevenWeekArray.forEach(weekNum => {
          var found = referralData.data.data.find(item => item?.week + 1 == weekNum.split(" ")[1])
          var foundEarning = EarningsData.data.data.find(item => item?.week + 1 == weekNum.split(" ")[1])
          weeksArray.push(found ? found.TotalUSDAmt : 0)
          weekEarnings.push(foundEarning ? (foundEarning.TotalUSDAmt) : 0)
          tooltipWeeks.push(found ? { ...{ "Total USD": found.TotalUSDAmt }, ...found.totalAmt } : { USD: 0 })
          tooltipWeeksEarnings.push(foundEarning ? { ...{ "Total USD": foundEarning.TotalUSDAmt }, ...foundEarning.totalAmt } : { USD: 0 })
        })
        tooltipWeeks = tooltipWeeks.reverse()
        tooltipWeeksEarnings = tooltipWeeksEarnings.reverse()

        console.log(tooltipWeeks, "RESULTT-week");
        setTootTipWeekData(tooltipWeeks)
        setTootTipWeekEarnData(tooltipWeeksEarnings)
      }

      // for (let i = 0; i < 7; i++) {
      //   const lastDay = new Date(currentDate);
      //   lastDay.setDate(currentDate.getDate() - i);
      //   const formattedDate = `${(lastDay.getMonth() + 1).toString().padStart(2, '0')}/${lastDay.getDate().toString().padStart(2, '0')}/${lastDay.getFullYear()}`;
      //   lastSevenDaysArray.push(formattedDate);
      // }


      // let DaysArray = []
      // let EarningsDayArray = []
      // if (selectedFilter === "day") {
      //   console.log('Last 7 days:', lastSevenDaysArray, refferalData);
      //   for (let i = 0; i < 7; i++) {
      //     console.log(lastSevenDaysArray[i].split("/")[1], referralData.data.data[i]?._id?.day, "fields")
      //     if (lastSevenDaysArray[i].split("/")[1] == referralData.data.data[i]?._id?.day) {
      //       DaysArray.push(referralData.data.data[i]?.totalSubTotal)
      //       EarningsDayArray.push(referralData.data.data[i]?.totalSubTotal / 100)
      //     } else {
      //       DaysArray.push(0)
      //       EarningsDayArray.push(0)
      //     }
      //   }
      //   console.log(DaysArray, EarningsDayArray, "dayss")
      // }

      // let WeeksArray = []
      // let EarningsWeekArray = []
      // let finalWeeks = []
      // if (selectedFilter === "week") {
      //   lastSevenWeekArray.forEach(obj1 => {
      //     referralData.data.data.forEach(obj2 => {
      //       console.log(obj1.split(" ")[1], obj2?._id?.week, "weekss")
      //       if (obj1.split(" ")[1] == obj2?._id?.week) {
      //         WeeksArray.push({ week: obj1, amount: obj2?.totalSubTotal });
      //       }
      //     });
      //   });
      //   lastSevenWeekArray.forEach(weekName => {
      //     var found = WeeksArray.find(item => item.week === weekName);

      //     finalWeeks.push(found ? found.amount : 0);
      //     EarningsWeekArray.push(found ? found.amount / 100 : 0)
      //   });
      //   console.log(finalWeeks, "week-final")
      // }


      if (refferalData)

        // if (selectedFilter === "day") {
        //   setTheData1([300, 200, 400, 650, 400, 570, 460, 680, 490])
        //   setTheData2([30, 20, 40, 65, 40, 57, 46, 68, 49])
        //   setLabels(lastSevenDaysArray.reverse())
        // }
        if (selectedFilter === "week") {
          setTheData1(weeksArray.reverse())
          setTheData2(weekEarnings.reverse())
          setLabels(last7WeeksData.reverse())
        }
      if (selectedFilter === "month") {
        setTheData1(monthsArray.reverse())
        setTheData2(monthEarnings.reverse())
        setLabels(lastSevenMonthsArray.reverse())
      }
    }
    setRefferalData(referralData.data.data)
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
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return formattedDate.replace(/\d+/, `${day}${suffix}`);
  }

  let data = {
    labels,
    datasets: [
      {
        label: 'Total Purchases (in USD)',
        data: thedata1,
        backgroundColor: 'rgba(97, 166, 13, 0.5)',
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataIndex = context.dataIndex;
            const tooltipValues = selectedFilter === "week" ? toolTipWeekData[dataIndex] : toolTipMonthData[dataIndex];
            let tooltipText = '';

            // Loop through tooltip values and combine them into tooltip text
            Object.keys(tooltipValues).forEach(key => {
              tooltipText = [...tooltipText, `Purchases (in ${key}) : ${tooltipValues[key]?.toFixed(2)}`];
            });

            return tooltipText;
          },
        },
      },
    },
  };

  const options1 = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataIndex = context.dataIndex;
            const tooltipValues = selectedFilter === "week" ? toolTipWeekEarnData[dataIndex] : toolTipMonthEarnData[dataIndex];
            let tooltipText = '';

            // Loop through tooltip values and combine them into tooltip text
            Object.keys(tooltipValues).forEach(key => {
              tooltipText = [...tooltipText, `Earnings (in ${key}) : ${(tooltipValues[key])?.toFixed(2)}`];
            });

            return tooltipText;
          },
        },
      },
    },
  };

  let data1 = {
    labels,
    datasets: [
      {
        label: 'Total Earnings (in USD)',
        data: thedata2,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },

    ],
  };
  const currentDate = new Date(localStorage.getItem("userCreated"));
  const lastEightMonthsArray = [];
  const lastEightMonthsArrayNums = []
  const lastFiveYears = []
  let monthTrees = []
  let ghgData = []
  let emittedData = []
  let currentMonth = currentDate.getMonth();
  let currentYear = new Date().getFullYear();
  let yearEmitted = []
  let yearReduced = []
  let currentYearReduced = 0
  let currentYearEmitted = 0
  let thisYear = new Date().getFullYear()
  let yearLabels = []
  let monthlyPurchaseData = []
  let transformedData = []

  for (let i = 0; i <= 1; i++) {
    yearLabels.push("Jan-Dec" + " " + (currentYear - i))
    lastFiveYears.push(currentYear - i);
    let yearLoop = lastFiveYears[i]
    if (annualData.data.length > 0) {
      var found = annualData.data.find(item => item?._id?.year == yearLoop)
      var foundEmitted = annualData.dataEmitCalc.find(item => item?._id?.year == yearLoop)
      var currentYearData = annualData.data.find(item => item?._id?.year == thisYear)
      var currentYearEmittedData = annualData.dataEmitCalc.find(item => item?._id?.year == thisYear)
      yearReduced.push(found ? found.ghgReduced.toFixed(2) : 0)
      currentYearReduced = currentYearData ? currentYearData.ghgReduced : 0
      currentYearEmitted = currentYearEmittedData ? currentYearEmittedData.totalCarbonEmissions : 0
      yearEmitted.push(foundEmitted ? (foundEmitted.totalCarbonEmissions)?.toFixed(2) : 0)
    }
  }

  console.log("yearlyData", yearLabels)

  for (let i = 0; i < 12; i++) {
    const lastMonth = new Date(currentDate);
    lastMonth.setMonth(currentDate.getMonth() + i);
    lastEightMonthsArray.push(lastMonth.toLocaleString('default', { month: 'short', year: 'numeric' }).split(" ")[0] + " " + lastMonth.toLocaleString('default', { month: 'short', year: 'numeric' }).split(" ")[1].slice(-2));
    let monthIndex = lastMonth.getMonth()

    lastEightMonthsArrayNums.push(monthIndex + 1);
  }
  console.log(lastEightMonthsArrayNums, "numss")


  if (graphMetricData?.data?.length > 0) {

    transformedData = graphMetricData.data.map(item => {
      const transformedItem = { ...item };
      transformedItem["Total Purchased"] = `${transformedItem.ghgReduced?.toFixed(2)} CO2 tons`;
      transformedItem.OrderValue.forEach(value => {
        if (value.currency === "USD" || value.currency === "INR" || value.currency === "EUR" || value.currency === "GBP" || value.currency === "CAD" || value.currency === "JPY") {
          transformedItem[`Total Purchases (in ${value.currency})`] = value.amountValue;
        } else {
          transformedItem[value.currency] = value.amountValue;
        }
      });
      delete transformedItem.ghgReduced;
      delete transformedItem.orderCount;
      delete transformedItem.OrderValue;
      return transformedItem;
    });

    lastEightMonthsArrayNums.forEach(monthNum => {
      var found = transformedData.find(item => item?._id?.month == monthNum)
      // var foundEmitted = graphMetricData.dataEmitCalc.find(item => item?.month == monthNum)
      monthTrees.push(found ? found.treesPlanted / 12 : 0)

      ghgData.push(found ? found.ghgReduced : 0)

      monthlyPurchaseData.push(found ? found : { _id: 0, ghgReduced: 0, treesPlanted: 0, orderCount: 0 })


    })
  }

  if (monthlyPurchaseData.length > 0) {
    monthlyPurchaseData = monthlyPurchaseData.map(item => {
      delete item._id
      delete item.ghgReduced;
      delete item.treesPlanted;
      return item;
    });
  }
  console.log(monthlyPurchaseData, "newData")



  // if (annualData.data.length > 0) {
  //   console.log(annualData.data , "monthly-order")
  //   lastEightMonthsArrayNums.forEach(monthNum => {
  //     var found = annualData.data.find(item => item?.monthlyOrderCount?.month == monthNum)
  //     monthlyPurchaseData.push(found ? { "Total Purchased": `${found.orderCount} CO2 Tons`, "Total Amount": `${found.orderValue[0].currency}` `${found.orderValue[0].amountValue}` } : { "Total Purchased": "0" })
  //   })
  // }
  console.log(monthlyPurchaseData, "monthlyPurchases")
  if (graphMetricData?.dataEmitCalc?.length > 0) {
    lastEightMonthsArrayNums.forEach(monthNum => {
      var foundEmitted = graphMetricData.dataEmitCalc.find(item => item?.month == monthNum)
      emittedData.push(foundEmitted ? foundEmitted.totalCarbonEmissions : 0)
    })
  }
  console.log(monthTrees, "treesMonthly")
  let finalMonthTrees = [];

  monthTrees.forEach((element, index) => {
    let sum = element;
    monthTrees.slice(index + 1).forEach(nextElement => {
      sum += nextElement;
    });
    finalMonthTrees.push(sum);
  });
  let eightmonthsdata = lastEightMonthsArray
  let barTreeData = {
    labels: eightmonthsdata,
    datasets: [
      {
        label: 'My Purchases Of Carbon Offsets (Tons)',
        data: monthTrees,
        backgroundColor: 'rgba(0 , 196, 243, 0.4)'
      }
    ],
  };



  let purchaseOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {

            const dataIndex = context.dataIndex;
            const tooltipValues = monthlyPurchaseData[dataIndex];
            let tooltipText = '';

            // Loop through tooltip values and combine them into tooltip text
            Object.keys(tooltipValues).forEach(key => {
              tooltipText = [...tooltipText, `${key} : ${tooltipValues[key]}`];
            });

            return tooltipText;
          },
        },
      },
    },
  }


  let doughnutRemainEmitted = Math.ceil(currentYearEmitted) - Math.ceil(currentYearReduced) > 0 ? Math.ceil(currentYearEmitted) - Math.ceil(currentYearReduced) : 0

  const doughNutData = {
    labels: ['My Carbon Footprint', 'Carbon Footprint Reduced'],
    datasets: [
      {
        data: [doughnutRemainEmitted, Math.ceil(currentYearReduced)],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
        hoverBackgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)'],
        borderWidth: 0,
      },
    ],
  };

  const reversedData = {
    ...doughNutData,
    labels: [...doughNutData.labels].reverse(), // Reverse the order of labels
  };

  const doughnutOptions = {

    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };


  const horizantalData = {
    labels: ['My Emissions', 'My Emissions Reduced'],
    datasets: [
      {
        label: "",
        fill: false,
        backgroundColor: ['rgba(236 , 155, 170, 0.5)', 'rgba(117 , 177, 120, 0.5)'],
        borderColor: ['rgba(236 , 155, 170, 0)', 'rgba(117 , 177, 120, 0)'],
        borderWidth: 1,
        hoverBackgroundColor: ['rgba(236 , 155, 170, 0.5)', 'rgba(117 , 177, 120, 0.5)'],
        hoverBorderColor: ['rgba(236 , 155, 170, 0.5)', 'rgba(117 , 177, 120, 0.5)'],
        data: [Math.ceil(currentYearEmitted?.toFixed(2)), Math.ceil(currentYearReduced?.toFixed(2))],
        datalabels: {
          display: false, // This line removes the labels inside the dataset
        },
      }
    ]
  }

  let toolTipData = [{ 'My Emissions': Math.ceil(currentYearEmitted?.toFixed(2)) }, { 'My Emissions Reduced':  Math.ceil(currentYearReduced?.toFixed(2)) }]

  const horizantalOptions = {
    indexAxis: 'y',
    plugins: {
      datalabels: {
        display: false,
      },
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
            let tooltipText = '';
            // Loop through tooltip values and combine them into tooltip text
            Object.keys(tooltipValues).forEach(key => {
              tooltipText = [`${tooltipValues[key]}`];
            });

            return tooltipText;
          },
        },
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
    },
  };






  // let barData = {
  //   labels: lastEightMonthsArray.slice(3, 8),
  //   datasets: [
  //     {
  //       label: 'Total CO2 Emitted (Tons)',
  //       data: emittedData.reverse().slice(3, 8),
  //       backgroundColor: 'rgba(117 , 177, 120, 0.5)',
  //     },
  //     {
  //       label: 'Total CO2 Reduced (Tons)',
  //       data: ghgData.reverse().slice(3, 8),
  //       backgroundColor: 'rgba(236 , 155, 170, 0.5)',
  //     },
  //   ],
  // };


  let barData = {
    labels: yearLabels.reverse(),
    datasets: [
      {
        label: 'Total CO2 Emitted (Tons)',
        data: yearEmitted.reverse(),
        backgroundColor: 'rgba(236 , 155, 170, 0.5)',
      },
      {
        label: 'Total CO2 Reduced (Tons)',
        data: yearReduced.reverse(),
        backgroundColor: 'rgba(117 , 177, 120, 0.5)',
      },
    ],
  };

  const reductionSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="59"
      height="59"
      fill="none"
      viewBox="0 0 59 59"
    >
      <circle cx="29.851" cy="29.159" r="29.144" fill="#61A60E"></circle>
      <path
        fill="#fff"
        d="M32.637 34.417c-1.12 0-2.027.88-2.027 1.964 0 1.085.908 1.965 2.027 1.965h10.137c1.12 0 2.028-.88 2.028-1.965v-9.82c0-1.084-.908-1.964-2.028-1.964s-2.027.88-2.027 1.964v5.079l-8.704-8.432a2.074 2.074 0 00-2.867 0l-4.648 4.504-8.704-8.432a2.074 2.074 0 00-2.867 0 1.92 1.92 0 000 2.778l10.137 9.82a2.074 2.074 0 002.867 0l4.649-4.503 7.27 7.042h-5.243z"
      ></path>
    </svg>
  )

  const treePlantedSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="59"
      height="59"
      fill="none"
      viewBox="0 0 59 59"
    >
      <circle cx="29.491" cy="29.694" r="29.144" fill="#61A60E"></circle>
      <g fill="#fff" clipPath="url(#clip0_1493_2756)">
        <path d="M40.108 25a6.44 6.44 0 001.206-3.755c0-3.576-2.9-6.476-6.477-6.476-.053 0-.104.007-.157.008a6.186 6.186 0 00-5.193-2.824 6.193 6.193 0 00-5.658 3.681c-3.871 1.012-6.731 4.521-6.731 8.709 0 2.302.87 4.396 2.291 5.989a7.884 7.884 0 007.846 8.653c.474 0 2.364-.042 2.815-.123l.191-1.952A7.884 7.884 0 0040.107 25z"></path>
        <path d="M30.05 36.022a4.255 4.255 0 01-2.973-.28c-1.448-.684-2.498-2.075-2.64-3.67a4.502 4.502 0 01.197-1.784.558.558 0 00-.197-.596 6.174 6.174 0 01-2.27-4.786 6.188 6.188 0 013.628-5.632.566.566 0 00.343-.568 5.557 5.557 0 01-.03-.558 6.193 6.193 0 014.78-6.026 6.175 6.175 0 00-1.4-.169 6.193 6.193 0 00-5.66 3.681c-3.87 1.012-6.73 4.521-6.73 8.709 0 2.302.87 4.396 2.291 5.989a7.884 7.884 0 007.846 8.653c.474 0 2.364-.042 2.815-.123V36.02z"></path>
        <path d="M28.922 36.17c-.018 0-.035-.003-.053-.004l-.51 10.703h3.38l-.5-10.472c-.017-.375-.393-.646-.744-.513a4.457 4.457 0 01-1.573.285z"></path>
        <path d="M31.24 36.397c-.018-.375-.394-.646-.745-.513a4.457 4.457 0 01-1.573.285l-.053-.002-.51 10.702h1.69v-9.168c0-.242.155-.457.385-.534l.83-.276-.024-.494z"></path>
      </g>
      <defs>
        <clipPath id="clip0_1493_2756">
          <path
            fill="#fff"
            d="M0 0H35.48V35.48H0z"
            transform="translate(11.746 11.953)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  )

  const projectSupportingSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="59"
      height="59"
      fill="none"
      viewBox="0 0 59 59"
    >
      <circle cx="29.39" cy="29.694" r="29.144" fill="#61A60E"></circle>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M44.255 20.15a2.027 2.027 0 010 2.867l-16.22 16.219a2.027 2.027 0 01-2.867 0l-8.11-8.11a2.027 2.027 0 112.868-2.867l6.676 6.676L41.387 20.15a2.027 2.027 0 012.868 0z"
        clipRule="evenodd"
      ></path>
    </svg>
  )

  const EachContainer = (svg, unit, text) => (
    <div className="dashboard--container">
      <div className="dashboard--main-holder">
        <div className="dashboard--icon-text-holder">
          {svg}
          <h3>{unit}</h3>
        </div>
        <p>{text}</p>
      </div>
    </div>
  )

  let PercentageData = currentYearReduced ? Math.ceil(currentYearReduced) / Math.ceil(currentYearEmitted) * 100 : 0

  const DashboardContainer = (
    <>
      {/* {metricData.fetched && (
        
        <div className="orders-order-box" style={{ marginTop: '60px' }}>
          <div
            className="checkout-area space-mt--r130 space-mb--r130"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div className="dashboard--info-holder">
              {EachContainer(
                reductionSvg,
                metricData?.ghgReduced || 0,
                'GHG Reduced (Metric Tons)'
              )}
              {EachContainer(
                treePlantedSvg,
                metricData?.treesPlanted || 0,
                'Trees Planted'
              )}
              {EachContainer(
                projectSupportingSvg,
                metricData?.projectsSupportedCount || 0,
                'Projects Supporting'
              )}
            </div>
          </div>
        </div>
      )} */}
      <div className="orders-order-box" style={{ marginTop: '60px' }}>
        <div className="charts-align-title" style={{ paddingTop: "30px" }}>
          {/* <div className='charts-disp doughnut-chart-title'>Total Trees Planted: {isNaN(finalMonthTrees[finalMonthTrees.length - 1]) ? "0" : Math.ceil(finalMonthTrees[finalMonthTrees.length - 1])}</div> */}
          <div className='charts-disp doughnut-chart-title'>My Purchases</div>
          <div className='charts-disp doughnut-chart-title'>Carbon Footprint: Emitted vs Reduced</div>
        </div>
        <div className="charts-align" style={{ padding: "40px 25px 80px" }}>
          <div className='charts-disp' >
            <Bar data={barTreeData} options={purchaseOptions} />
          </div>
          <div className='charts-disp'>
            <Bar data={barData} />
          </div>

        </div>
        <div className="charts-align-title">
          <div className='charts-disp doughnut-chart-title'>My&nbsp;Emission&nbsp;Reduction&nbsp;Percentage&nbsp;({Math.ceil(PercentageData)}%)</div>
          <div className='charts-disp doughnut-chart-title'>
            <p>Total Trees Planted: {Math.ceil(currentYearReduced) * 12}</p>
            <h3 style={{ fontSize: "18px" }}>Planting 12 trees reduces 1 ton of CO2</h3>
          </div>

        </div>
        <div className="charts-align" style={{ padding: "40px 25px 160px" }}>
          <div className='charts-disp' style={{ width: "590px", height: "590px" }}>
            <Bar data={horizantalData} options={horizantalOptions} />
            {/* <br />
            <br />
            <h3 className="refferalText">Total Emissions (Tons):  <span className="refferalNumber">{Math.ceil(currentYearEmitted)}</span></h3>
            <h3 className="refferalText"> Emissions Reduced (Tons):  <span className="refferalNumber">{Math.ceil(currentYearReduced)}</span></h3>
            <h3 className="refferalText">Remaining Emissions (Tons):  <span className="refferalNumber">{doughnutRemainEmitted}</span></h3> */}
          </div>
          <div className='charts-disp' style={{ width: "516px", height: "516px", overflow: "scroll", scrollbarWidth: "none" }}>
            {Array(Math.ceil(doughnutRemainEmitted)).fill("").map((e) => {
              return (
                <img src="/images/whitetreeiconobg.png" width="35px" height="40px" />
              )
            })}
            {Array(Math.ceil(currentYearReduced)).fill("").map((e) => {
              return (
                <img src="/images/greensvgnobg.png" width="35px" height="40px" />
              )
            })}
          </div>
          {/* <div className='charts-disp'>
        
            <Bar data={barData} />
          </div> */}

        </div>
      </div>
      {theTimeline.length > 0 && (
        <div className="orders-order-box" style={{ marginTop: '60px' }}>
          <p className='doughnut-chart-title' style={{ marginTop: "25px" }}>Total Projects Supported: {theTimeline.length}</p>
          <Timeline items={theTimeline} />
        </div>
      )}
      {/* <div className="orders-order-box tree-box" style={{ marginTop: '60px' }}>
        <p className='doughnut-chart-title' style={{ marginTop: "25px" }}>Total Trees Planted: {finalMonthTrees[finalMonthTrees.length - 1]}</p>
        <div className='tree-charts-disp'>
          <Bar data={barTreeData} />
        </div>
      </div> */}
      <div className="orders-order-box" style={{ marginTop: '60px', padding: "30px" }}>
        <div className="bar-line">
          <h3 className='bar-head'>Refferal Earnings</h3>
          <p className='bar-head'>Filter By: <select className='bar-dropdown' name="date" id="date" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
            {/* <option value="day">Day</option> */}
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select></p>
        </div>

        <div className="charts-align">
          <div className='charts-disp'>
            {dataLoaded && <Bar data={data} options={options} />}
            <br />
            <br />
            {refferalData.filter(order => order?.TotalUSDAmt !== 0).length > 0 ? <h3 className="refferalText">Total Refferal Purchases in last 7 {selectedFilter}'s (IN USD) : <span className="refferalNumber">USD ${thedata1.reduce((acc, current) => acc + current, 0).toFixed(2)}</span></h3> : <div></div>}
          </div>
          <div className='charts-disp'>
            <Bar options={options1} data={data1} />
            <br />
            <br />
            {refferalData.filter(order => order?.TotalUSDAmt !== 0).length > 0 ? <h3 className="refferalText">Total Refferal Earnings in last 7 {selectedFilter}'s (IN USD) : <span className="refferalNumber">USD ${(thedata2.reduce((acc, current) => acc + current, 0)).toFixed(2)}</span> </h3> : <div></div>}
          </div>
        </div>
        {refferalData.filter(order => order?.TotalUSDAmt !== 0).length > 0 ? <div></div> : <h3 className='refferal-data-check'>No Refferal Earnings  in last 7 {selectedFilter}'s</h3>}
      </div>
      <div className="orders-order-box" style={{ marginTop: '60px', padding: "30px" }}>
        <div className="bar-line">
          <h3 className='bar-head'>Refferal Transactions</h3>
        </div>
        {refferalLogs.length > 0 ?
          <div className="table--box">
            <div className="table--align" style={{ display: "none" }}>
              <div className="add--btn">Details</div>
              <div className="search--box">
                &nbsp;&nbsp;
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path></svg>
                <input type="text" placeholder="search..." className="input--search" />
              </div>
            </div>
            <hr style={{ margin: 0, display: "none" }} />
            <div className="earnings--table--head">
              <div>Num</div>
              <div>Name</div>
              <div>Email</div>
              <div>Location</div>
              <div>Date / Time</div>
              <div>Purchased Amount</div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>Earned&nbsp;Amount</div>
            </div>

            <hr style={{ margin: 0 }} />
            {refferalLogs.map((item, index) => {
              return <div className="earnings--table--data">
                <div>{index + 1 + activePage * limit - limit}.</div>
                <div>{item?.orderId?.billingAddress?.firstName + " " + item?.orderId?.billingAddress?.lastName}</div>
                <div>{item?.orderId?.customer?.user?.email}</div>
                <div>{item?.orderId?.billingAddress?.state} , {item?.orderId?.billingAddress?.country}</div>
                <div>{getDisplayDate(item?.createdAt)} / {getFormattedTime(item?.createdAt).slice(0, 9)}</div>
                <div>{item?.currency}&nbsp;&nbsp;{item?.currencySymbol}{(item?.orderId?.orderTotal)?.toFixed(2)}</div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>{item?.currency}&nbsp;&nbsp;{item?.currencySymbol}{(item?.amount).toFixed(2)}</div>
              </div>
            })}
            < hr style={{ margin: 0 }} />
            {/* <div className="pagination--box">
              <div className="pagination--title--text">Showing <span style={{ fontWeight: 800 }}>1-25</span> from <span style={{ fontWeight: 800 }}>150</span></div>
              <div className="pagination--numbers">
                <div style={{ marginLeft: "15px" }}>&lsaquo;</div>
                <div className="verticalLine"></div>
                {Array(3).fill("").map((item, index) => {
                  return (
                    <>
                      <div style={{ marginLeft: "15px" }}>{index + 1}</div>
                      <div className="verticalLine"></div>
                    </>
                  )
                })}
                <div style={{ marginLeft: "15px" }}>...</div>
                <div className="verticalLine"></div>
                <div style={{ marginLeft: "15px" }}>100</div>
                <div className="verticalLine"></div>
                <div style={{ marginLeft: "15px" }}>&rsaquo;</div>
                <div className="verticalLine" style={{ height: "0px" }}></div>
              </div>
            </div> */}
            <div className="pagination--box">
              <div className="pagination--title--text">Showing <span style={{ fontWeight: 800 }}>{limit}</span> results in each page</div>
              <Pagination
                activePage={activePage}
                itemsCountPerPage={limit}
                totalItemsCount={count}
                pageRangeDisplayed={pageRangeDisplayed}
                onChange={handlePageChange}
              />
            </div>
          </div> : <div className='refferal-data-check'>No Transactions Found</div>}
      </div>
    </>
  )

  return <div>{DashboardContainer}</div>
}

export default Dashboard
