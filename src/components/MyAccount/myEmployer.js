import React, { useEffect, useState } from "react";

import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { Col, Container, Spinner } from "react-bootstrap";
import { getMetric } from "src/apiClient/user";
import {
  getBusinessDetails,
  JoinBusiness,
  getJoinedBusiness,
  leaveBusiness,
} from "src/apiClient/employer";
import { useMyContext } from "src/Context";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useToasts } from "react-toast-notifications";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
};

const MyEmployer = ({ refreshData, setRefreshData }) => {
  let JoinBusinessCode = localStorage.getItem("JoinBusinessCode");
  const { addToast } = useToasts();
  const [metricData, setMetricData] = useState({ fetched: false });
  const [selectedFilter, setSelectedFilter] = useState("date");
  const [thedata1, setTheData1] = useState([]);
  const [thedata2, setTheData2] = useState([]);
  const [labels, setLabels] = useState([]);
  const [theBusinessDetails, setTheBusinessDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theCode, setTheCode] = useState(
    JoinBusinessCode
      ? JoinBusinessCode
      : window.location.href.includes("businessCode")
      ? window.location.href.split("businessCode=")[1]
      : ""
  );
  const { refetchEmployees, setRefetchEmployees } = useMyContext();

  // const fetchMetrics = async () => {
  //     try {
  //         const res = await getMetric()
  //         setMetricData({ fetched: true, ...res.data })
  //     } catch (err) {
  //         console.log(err)
  //     }
  // }

  useEffect(() => {
    // fetchMetrics().catch((err) => console.log(err))
    if (window.location.href.includes("businessCode")) {
      localStorage.setItem(
        "JoinBusinessCode",
        window.location.href.split("businessCode=")[1]
      );
    }
    getBusiness();
    // setRefetchEmployees(!refetchEmployees)
  }, [refetchEmployees]);

  const getBusiness = async () => {
    let businessData = await getJoinedBusiness();
    console.log(businessData.data, "dataaa");
    if (businessData.data.success) {
      setTheBusinessDetails(businessData.data.data);
      localStorage.setItem(
        "JoinedBusinessDetails",
        JSON.stringify(businessData?.data?.data?.[0])
      );
    } else {
      if (localStorage.getItem("JoinBusinessCode")) {
        BusinessJoin({
          preventDefault: () => {
            console.log("");
          },
        });
      }
    }
  };

  const ActionLeave = async (item) => {
    console.log(item, "the-itemm");
    let body = {
      businessId: item?.businessId?._id,
    };
    const removeBusiness = await leaveBusiness(body);
    console.log(item?.businessId, removeBusiness, "remove-business");

    if (removeBusiness?.data?.success) {
      setRefetchEmployees(!refetchEmployees);
      addToast("Leaved the business successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      localStorage.removeItem("JoinedBusinessDetails");
      localStorage.removeItem("JoinBusinessCode");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      addToast(removeBusiness?.data?.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    // getBusiness()
  };

  const BusinessJoin = async () => {
    if (!theCode) {
      addToast("Code cannot be empty", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    setIsLoading(true);
    const businessData = await getBusinessDetails(theCode);
    console.log(businessData.data, JoinBusinessCode);
    if (!businessData.data.success) {
      setIsLoading(false);
      addToast(businessData.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    if (localStorage.getItem("businessCode") === theCode) {
      setIsLoading(false);
      addToast("Cannot Join Your Own Business", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    let data = {
      name: localStorage.getItem("email"),
      businessCode: theCode,
      businessId: businessData.data.data._id,
      userId: localStorage.getItem("userId"),
    };
    console.log(data);
    const joinBusiness = await JoinBusiness(data);
    if (joinBusiness?.data?.success) {
      setIsLoading(false);
      addToast("Joined Business Successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      localStorage.setItem("JoinBusinessCode", theCode);
      setRefetchEmployees(!refetchEmployees);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setIsLoading(false);
      addToast("Something went wrong", {
        appearance: "error",
        autoDismiss: true,
      });
    }

    // setTimeout(()=>{
    //     setIsLoading(false)
    // },2000)
  };

  // const reductionSvg = (
  //   <svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     width="59"
  //     height="59"
  //     fill="none"
  //     viewBox="0 0 59 59"
  //   >
  //     <circle cx="29.851" cy="29.159" r="29.144" fill="#61A60E"></circle>
  //     <path
  //       fill="#fff"
  //       d="M32.637 34.417c-1.12 0-2.027.88-2.027 1.964 0 1.085.908 1.965 2.027 1.965h10.137c1.12 0 2.028-.88 2.028-1.965v-9.82c0-1.084-.908-1.964-2.028-1.964s-2.027.88-2.027 1.964v5.079l-8.704-8.432a2.074 2.074 0 00-2.867 0l-4.648 4.504-8.704-8.432a2.074 2.074 0 00-2.867 0 1.92 1.92 0 000 2.778l10.137 9.82a2.074 2.074 0 002.867 0l4.649-4.503 7.27 7.042h-5.243z"
  //     ></path>
  //   </svg>
  // );

  // const treePlantedSvg = (
  //   <svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     width="59"
  //     height="59"
  //     fill="none"
  //     viewBox="0 0 59 59"
  //   >
  //     <circle cx="29.491" cy="29.694" r="29.144" fill="#61A60E"></circle>
  //     <g fill="#fff" clipPath="url(#clip0_1493_2756)">
  //       <path d="M40.108 25a6.44 6.44 0 001.206-3.755c0-3.576-2.9-6.476-6.477-6.476-.053 0-.104.007-.157.008a6.186 6.186 0 00-5.193-2.824 6.193 6.193 0 00-5.658 3.681c-3.871 1.012-6.731 4.521-6.731 8.709 0 2.302.87 4.396 2.291 5.989a7.884 7.884 0 007.846 8.653c.474 0 2.364-.042 2.815-.123l.191-1.952A7.884 7.884 0 0040.107 25z"></path>
  //       <path d="M30.05 36.022a4.255 4.255 0 01-2.973-.28c-1.448-.684-2.498-2.075-2.64-3.67a4.502 4.502 0 01.197-1.784.558.558 0 00-.197-.596 6.174 6.174 0 01-2.27-4.786 6.188 6.188 0 013.628-5.632.566.566 0 00.343-.568 5.557 5.557 0 01-.03-.558 6.193 6.193 0 014.78-6.026 6.175 6.175 0 00-1.4-.169 6.193 6.193 0 00-5.66 3.681c-3.87 1.012-6.73 4.521-6.73 8.709 0 2.302.87 4.396 2.291 5.989a7.884 7.884 0 007.846 8.653c.474 0 2.364-.042 2.815-.123V36.02z"></path>
  //       <path d="M28.922 36.17c-.018 0-.035-.003-.053-.004l-.51 10.703h3.38l-.5-10.472c-.017-.375-.393-.646-.744-.513a4.457 4.457 0 01-1.573.285z"></path>
  //       <path d="M31.24 36.397c-.018-.375-.394-.646-.745-.513a4.457 4.457 0 01-1.573.285l-.053-.002-.51 10.702h1.69v-9.168c0-.242.155-.457.385-.534l.83-.276-.024-.494z"></path>
  //     </g>
  //     <defs>
  //       <clipPath id="clip0_1493_2756">
  //         <path
  //           fill="#fff"
  //           d="M0 0H35.48V35.48H0z"
  //           transform="translate(11.746 11.953)"
  //         ></path>
  //       </clipPath>
  //     </defs>
  //   </svg>
  // );

  // const projectSupportingSvg = (
  //   <svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     width="59"
  //     height="59"
  //     fill="none"
  //     viewBox="0 0 59 59"
  //   >
  //     <circle cx="29.39" cy="29.694" r="29.144" fill="#61A60E"></circle>
  //     <path
  //       fill="#fff"
  //       fillRule="evenodd"
  //       d="M44.255 20.15a2.027 2.027 0 010 2.867l-16.22 16.219a2.027 2.027 0 01-2.867 0l-8.11-8.11a2.027 2.027 0 112.868-2.867l6.676 6.676L41.387 20.15a2.027 2.027 0 012.868 0z"
  //       clipRule="evenodd"
  //     ></path>
  //   </svg>
  // );

  // const EachContainer = (svg, unit, text) => (
  //   <div className="dashboard--container">
  //     <div className="dashboard--main-holder">
  //       <div className="dashboard--icon-text-holder">
  //         {svg}
  //         <h3>{unit}</h3>
  //       </div>
  //       <p>{text}</p>
  //     </div>
  //   </div>
  // );

  const handleCode = (e) => {
    setTheCode(e.target.value);
  };

  const DashboardContainer = (
    <div
      className="orders-order-box"
      style={{ marginTop: "60px", padding: "30px" }}
    >
      <h3 className="common--heading">
        {theBusinessDetails.length > 0 ? "Joined" : "Join"} Business
      </h3>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div style={{ width: "48%" }}>
          {theBusinessDetails.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }} >
              <tbody>
                {[theBusinessDetails[theBusinessDetails.length - 1]].map(
                  (item, index) => (
                    <>
                      <tr>
                        <td
                          style={{
                            fontWeight: 700,
                            color: "black",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                            height: "60px"
                          }}
                        >
                          Business Name:
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                            height: "60px"
                          }}
                        >
                          {item?.businessId?.name}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            height: "60px",
                            fontWeight: 700,
                            color: "black",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Business Website:
                        </td>
                        <td
                          style={{
                            height: "60px",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {item?.businessId?.companyWebsite}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            height: "60px",
                            fontWeight: 700,
                            color: "black",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Industry Type:
                        </td>
                        <td
                          style={{
                            height: "60px",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {item?.businessId?.industryType}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            height: "60px",
                            fontWeight: 700,
                            color: "black",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Business Code:
                        </td>
                        <td
                          style={{
                            height: "60px",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {item?.businessId?.businessCode}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            height: "60px",
                            fontWeight: 700,
                            color: "black",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Organization Type:
                        </td>
                        <td
                          style={{
                            height: "60px",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {item?.businessId?.organizationType}
                        </td>
                      </tr>
                      <tr>
                      <td
                          style={{
                            height: "60px",
                            fontWeight: 700,
                            color: "black",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Current Membership:
                        </td>
                        <td>
                        
                        <div
                      onClick={() => ActionLeave(item)}
                      className="sustainability--edit-button sustainability-save"
                      // style={{display:"flex",alignItems:"center",marginLeft: "20px"}}
                    >
                      Leave Business
                    </div>
                        </td>
                      </tr>
                    </>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div>Join a Business to view the business details</div>
          )}
        </div>

        {/* <div className="joinInput">
          <style>
            {`
            .code--input::placeholder {
                color: #ccc; 
                opacity: 1; 
            }
        `}
          </style>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>Enter Code to Join Business</div>
            <div style={{ marginLeft: "20px" }}>:</div>
            <div>
            <div style={{
              display: "flex",
              flexDirection:"column"
            }}>
              <input
                type="text"
                placeholder="Enter Business Code"
                value={theCode}
                onChange={handleCode}
                className="code--input"
                width="157px"
              />
            </div>
            <div className="join--btn" onClick={BusinessJoin}>
              Join {isLoading ? <Spinner animation="border" size="sm" /> : ""}
            </div>
            </div>
            
          </div>
        </div> */}
        <div className="membership-card" >
        <h3>
            {theBusinessDetails.length > 0?"Join other Business":"Join Business"}
        </h3>
        <div className="membership-card__content">
        <div className="membership-card__input-group">
            <label htmlFor="businessCode" className="membership-card__label">
              Business Code
            </label>
            <input
              id="businessCode"
              type="text"
              value={theCode}
              onChange={handleCode}
              placeholder="Enter business code"
              className="membership-card__input"
            />
          </div>
          <button onClick={BusinessJoin} className={`sustainability--edit-button sustainability-save`}>
            Join {isLoading ? <Spinner animation="border" size="sm" /> : ""}
          </button>
        </div>
        </div>


      </div>
    </div>
  );

  return <div>{DashboardContainer}</div>;
};

export default MyEmployer;
