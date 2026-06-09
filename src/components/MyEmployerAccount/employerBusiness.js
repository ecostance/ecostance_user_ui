import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
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
import axios from "axios";
import { BsCloudDownload } from "react-icons/bs";
import { MdCheck, MdContentCopy, MdInfoOutline } from "react-icons/md";
import { QRCode } from "react-qrcode-logo";
import { removeBusinessUser, changeRole } from "../../apiClient/business";
import { getAllUsersForJoinedBusiness, changeEmployeRole } from "../../apiClient/employer";
import LezadaBackdrop from "../lezadaBackdrop";
import { Tooltip } from "react-tippy";
import { useMyContext } from "src/Context"
import Pagination from "react-js-pagination";

let toastId;
let link = process.env.NEXT_PUBLIC_UI_URL + "/?businessCode=Ram123";
const EmployerBusiness = ({
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
  isAttemptLeft,
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
    `${process.env.NEXT_PUBLIC_UI_URL}?businessCode=${userBusinessCode}`
  );
  const [linkHovered, setLinkHovered] = useState(false);
  const [allUsersData, setAllUsersData] = useState([])
  const [shouldModifyUser, setShouldModifyUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [allOwners, setAllOwners] = useState([])
  const [allSuperAdmins, setAllSuperAdmins] = useState([])
  const [allAdmins, setAllAdmins] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [userRole, setUserRole] = useState("")
  const [loginUser , setLoginUser] = useState("")
  const [pageNum, setPageNum] = useState(1)
  const [displayOptions, setDisplayOptions] = (["Owner", "Super Admin", "Admin", "Employee"])
  const { refetchEmployees, setRefetchEmployees } = useMyContext();
  const [count, setCount] = useState("")
  const [activePage, setActivePage] = useState(1);
  // console.log("contexttt" , value)

  let selectOptions = [
    { key: "owner", value: "Owner" },
    { key: "superadmin", value: "Super Admin" },
    { key: "admin", value: "Admin" },
    { key: "user", value: "Employee" }
  ]

  useEffect(() => {
    axios
      .get(`https://wp.marketsverse.com/wp-json/wp/v2/socialmessage`)
      .then(({ data }) => {
        console.log(data, "social media data");
        setSocialMediaData(data);
      });
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [activePage, setActivePage, refetchEmployees])

  let theData

  let limit = 15

  const getAllUsers = async () => {
    let usersData = await getAllUsersForJoinedBusiness(activePage, limit)
    if (usersData.data.success) {
      setCount(usersData.data.metadata.count)
      // for (let i = 0; i < usersData.data.data.length; i++) {
      //   usersData.data.data[i] = { theNum: i + 1, ...usersData.data.data[i] };
      // }
      let theRole = usersData.data.data.filter(user => user.name === localStorage.getItem("email"));
      console.log(theRole , "loggeduserrole")
      setLoginUser(theRole)
      setAllUsersData(usersData.data.data)
      let otherUsers = usersData.data.data.filter(user => user.name !== localStorage.getItem("email"));
      const owners = otherUsers.filter(user => user.role === 'owner');
      setAllOwners(owners)
      const superadmins = otherUsers.filter(user => user.role === 'superadmin');
      setAllSuperAdmins(superadmins)
      const admins = otherUsers.filter(user => user.role === 'admin');
      setAllAdmins(admins)
      const users = otherUsers.filter(user => user.role === 'user');
      setAllUsers(users)
      setUserRole(theRole?.[0]?.role)
      console.log(theRole?.[0]?.role, "rolee")
      if (theRole?.[0]?.role === "superadmin") {
        theData = ["Owner", "Super Admin"]
      }
    }
    console.log(usersData.data.data)
  }

  const pageRangeDisplayed = 5;

  const handlePageChange = (pageNumber) => {
    console.log(`Active page is ${pageNumber}`);
    setActivePage(pageNumber);
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
  const downloadCode = (id) => {
    console.log(id, "idd")
    setDownloading(true);
    const canvas = document.getElementById(id);
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
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
  let BusinessDetails = JSON.parse(localStorage.getItem("JoinedBusinessDetails"))
  let userBusinessCode = BusinessDetails?.businessCode
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
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return formattedDate.replace(/\d+/, `${day}${suffix}`);
  }


  const MemberDetails = ({ theData, theNum }) => {
    console.log(theData , "memberdata")
    return (
      <>

        {theData.length > 0 && theData?.map((e, index) => {
          let theRole
          let theOpacity = 1
          let theEvent
          // selectOptions.forEach((item) => {
          //   if (item?.key === e.role) {
          //     theRole = item?.value
          //   }
          // })
          if (localStorage.getItem("email") === e?.name) {
            theOpacity = 0
            theEvent = "none"
          }
          if (userRole === "superadmin") {
            if (e?.role === "owner" || e?.role === "superadmin") {
              theOpacity = 0
              theEvent = "none"
            }
          }
          if (userRole === "admin") {
            if (e?.role !== "user") {
              theOpacity = 0
              theEvent = "none"
            }
          }
          if (userRole === "user") {
            theOpacity = 0
            theEvent = "none"
          }
          selectOptions.forEach((item) => {
            if (item?.key === e.role) {
              theRole = item?.value
            }
          })
          return <>
            <div className="business--table--data">
              <div>{theNum + index + 1 + activePage * limit - limit}.</div>
              <div>{e?.userId?.firstName ? e?.userId?.firstName : ""}&nbsp;{e?.userId?.lastName ? e?.userId?.lastName : ""}</div>
              <div>{e.name}&nbsp;<span style={{ color: "black", fontWeight: 700, display: localStorage.getItem("email") === e?.name ? "" : "none" }}>(You)</span></div>
              <div>{getDisplayDate(e.createdAt)}</div>
              <div>{theRole}</div>
              <div className="table--edit" onClick={() => {
                setShouldModifyUser(true)
                setSelectedUser(e)
                setSelectedRole(theRole)
              }} style={{ opacity: theOpacity, pointerEvents: theEvent }}>Edit</div>
            </div>
            {/* <hr style={{ margin: 0 }} /> */}
          </>
        })}
      </>
    )
  }




  const ChangeStatus = async () => {
    let theRole
    selectOptions.forEach((item) => {
      if (item?.value === selectedRole) {
        theRole = item?.key
      }
    })
    let body = {
      user_id: selectedUser?._id,
      role: theRole
    }
    console.log(body, "statusss")
    let ChangeUserStatus = await changeEmployeRole(body)
    console.log(ChangeUserStatus.data, "status-change")
    if (ChangeUserStatus.data.success) {
      addToast(ChangeUserStatus.data.Message, {
        appearance: "success",
        autoDismiss: true,
      });
      getAllUsers();
      setShouldModifyUser(false);
      // setTimeout(() => {
      //   window.location.reload()
      // }, 1000)
    } else {
      addToast(ChangeUserStatus.data.Message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }





  return <>
    {localStorage.getItem("JoinedBusinessDetails") ? (
      <div className="change--email--wrapper">
        <div className="table--popup" style={{ display: shouldModifyUser ? "" : "none" }}>
          <div className="table--form">
            <div className="popup--head">
              <div className="popup--title">Selected User</div>
              <div className="popup--close" onClick={() => setShouldModifyUser(false)}>X</div>
            </div>
            <hr />
            <br />
            {/* <div className="popup--form">
            <div className="select--title">Name</div>
            <div>:</div>
            <div className="select--value">{selectedUser?.name}</div>
          </div> */}
            <div className="popup--form">
              <div className="select--title">Email</div>
              <div>:</div>
              <div className="select--value">{selectedUser?.name}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Date of Joining</div>
              <div>:</div>
              <div className="select--value">{getDisplayDate(selectedUser?.createdAt)}</div>
            </div>
            <div className="popup--form">
              <div className="select--title">Role</div>
              <div>:</div>
              {/* <div className="select--value">{selectedUser?.role}</div> */}
              <select name="roles" id="roles" className="select--roles" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                <option value={selectedRole}>{selectedRole}</option>
                {selectOptions.filter((field) => field.value !== selectedRole).map((item) => {
                  return <option style={{ display: userRole === "superadmin" ? item?.key === "superadmin" || item?.key === "owner" ? "none" : "" : userRole === "admin" ? item?.key !== "user" ? "none" : "" : "" }} value={item?.value}>{item?.value}</option>
                })}
              </select>
            </div>
            <br />
            <hr />
            <div className="btn-grps">
              <div className="close--btn" onClick={() => setShouldModifyUser(false)}>Cancel</div>
              <div className="remove--btn" onClick={() => removeUser(selectedUser)}>Remove User</div>
              <div className="save--btn" onClick={() => ChangeStatus()}>Save Changes</div>
            </div>
          </div>
        </div>
        <h3 className="common--heading" style={{ marginBottom: "30px" }}>
          Enrolled Employees
        </h3>
        <div className="business--link--display">
          <div>
            <div className="business--link--head">
              <h5>Share or Scan this link with your employees so they can be part of your Business</h5>
            </div>
            <div className="business--link--text" style={{ marginTop: "10px" }}>
              <div>
                Your Business Link :{" "}
                <a
                  href={`${process.env.NEXT_PUBLIC_UI_URL}?businessCode=${userBusinessCode}`}
                  style={{ textDecoration: "underline" }}
                  target="_blank"
                >
                  {process.env.NEXT_PUBLIC_UI_URL}?businessCode={userBusinessCode}
                </a>
              </div>
              <div
                className="sustainability--information-holder"
              >
                {/* <svg
                          width="23"
                          height="24"
                          viewBox="0 0 23 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.6165 1.70943C6.04898 1.70943 1.5356 6.22281 1.5356 11.7903C1.5356 17.3579 6.04898 21.8713 11.6165 21.8713C17.1841 21.8713 21.6974 17.3579 21.6974 11.7903C21.6974 6.22281 17.1841 1.70943 11.6165 1.70943ZM0.349609 11.7903C0.349609 5.5678 5.39398 0.523438 11.6165 0.523438C17.8391 0.523438 22.8834 5.5678 22.8834 11.7903C22.8834 18.0129 17.8391 23.0573 11.6165 23.0573C5.39398 23.0573 0.349609 18.0129 0.349609 11.7903ZM11.6165 6.45339C11.944 6.45339 12.2095 6.71888 12.2095 7.04638V11.7903C12.2095 12.1178 11.944 12.3833 11.6165 12.3833C11.289 12.3833 11.0235 12.1178 11.0235 11.7903V7.04638C11.0235 6.71888 11.289 6.45339 11.6165 6.45339ZM11.0235 16.5343C11.0235 16.2068 11.289 15.9413 11.6165 15.9413H11.6284C11.9559 15.9413 12.2214 16.2068 12.2214 16.5343C12.2214 16.8618 11.9559 17.1273 11.6284 17.1273H11.6165C11.289 17.1273 11.0235 16.8618 11.0235 16.5343Z"
                            fill="#111827"
                          />
                        </svg> */}
                <Tooltip
                  className="iconHover"
                  title="Business Join Link"
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
                title="Copy Business Link"
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
                        `${process.env.NEXT_PUBLIC_UI_URL}?businessCode=${userBusinessCode}`
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
                    onClick={(e) => downloadCode("qrID")}
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
                  value={`${process.env.NEXT_PUBLIC_UI_URL}?businessCode=${userBusinessCode}`} // here you should keep the link/value(string) for which you are generation promocode
                  size={250} // the dimension of the QR code (number)
                  logoImage="/assets/images/netcarbon-qr-logo.png" // URL of the logo you want to use, make sure it is a dynamic url
                  logoHeight={40}
                  logoWidth={40}
                  logoOpacity={1}
                  enableCORS={true} // enabling CORS, this is the thing that will bypass that DOM check
                  qrStyle="dots" // type of qr code, wether you want dotted ones or the square ones
                  eyeRadius={10} // radius of the promocode eye
                  id={"qrID"}
                />
              </div>
            </div>
          </div>
          <div style={{ marginLeft: "10px" }}>
            <QRCode
              value={`${process.env.NEXT_PUBLIC_UI_URL}?businessCode=${userBusinessCode}`}
              logoImage="/assets/images/ecostance-qr-logo.png"
              size={100}
            // logoHeight={40}
            // logoWidth={40}
            // logoOpacity={1}
            // enableCORS={true} // enabling CORS, this is the thing that will bypass that DOM check
            // qrStyle="dots" // type of qr code, wether you want dotted ones or the square ones
            // eyeRadius={10} // radius of the promocode eye
            // id={"qrID"}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="card--boxes">
            <div className="card--title">1<span className="business--user--title">Owner</span></div>
          </div>
          <div className="card--boxes">
            <div className="card--title">{allUsersData?.filter(user => user.role === 'superadmin').length}<span className="business--user--title">Super Admins</span></div>
          </div>
          <div className="card--boxes">
            <div className="card--title">{allUsersData?.filter(user => user.role === 'admin').length}<span className="business--user--title">Admins</span></div>
          </div>
          <div className="card--boxes">
            <div className="card--title">{allUsersData?.filter(user => user.role === 'user').length}<span className="business--user--title">Employees</span></div>
          </div>
        </div>
        <br />
        <div className="table--box">
          <div className="table--align">
            <div className="add--btn" style={{ opacity: 0 }}>Add Employee</div>
            <div className="search--box" style={{ padding: "10px 0px" }}>
              &nbsp;&nbsp;
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path></svg>
              <input type="text" placeholder="search..." className="input--search" />
            </div>
          </div>
          <hr style={{ margin: 0 }} />
          <div className="business--table--head">
            <div>No.</div>
            <div>Name</div>
            <div>Email</div>
            <div>Date of Joining</div>
            <div>Role</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>Actions</div>
          </div>
          {/* <hr style={{ margin: 0 }} />
        {allOwners.map((e, index) => {
          let theRole
          selectOptions.forEach((item) => {
            if (item?.key === e.role) {
              theRole = item?.value
            }
          })
          return <>
            <div className="business--table--data">
              <div>{index + 1}.</div>
              <div>{e.name}</div>
              <div>{getDisplayDate(e.createdAt)}</div>
              <div>{theRole}</div>
              <div className="table--edit" onClick={() => {
                setShouldModifyUser(true)
                setSelectedUser(e)
                setSelectedRole(theRole)
              }}>Edit</div>
            </div>
            <hr style={{ margin: 0 }} />
          </>
        })} */}

          <hr style={{ margin: 0 }} />
          <MemberDetails theData={loginUser} theNum={0} />
          <MemberDetails theData={allOwners} theNum={1} />
          <MemberDetails theData={allSuperAdmins} theNum={allOwners.length} />
          <MemberDetails theData={allAdmins} theNum={allOwners.length + allSuperAdmins.length} />
          <MemberDetails theData={allUsers} theNum={allOwners.length + allSuperAdmins.length + allAdmins.length} />
          <div className="pagination--box">
            <div className="pagination--title--text">Showing <span style={{ fontWeight: 800 }}>{limit}</span> results in each page</div>
            {/* <div className="pagination--numbers">
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
            </div> */}
            <Pagination
              activePage={activePage}
              itemsCountPerPage={limit}
              totalItemsCount={count}
              pageRangeDisplayed={pageRangeDisplayed}
              onChange={handlePageChange}
            />
          </div>
        </div>


        {/* <div className="sub-common--heading">
          Owner
        </div>
        <div>
          <table>
            <tr className="members-head">
              <th>Index</th>
              <th>Name</th>
            </tr>
            {theDisplayData.slice(0, 1).map((item, index) => {
              return <tr key={index}>      
                <td>{item?.theNum}.</td>
                <td>{item?.name}</td>
              </tr>
            })}
          </table>
        </div>
        <br />
        <br />
        <div className="sub-common--heading">
          Super Admins
        </div>
        <div>
          <table>
            <tr className="members-head">
              <th>Index</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
            {theDisplayData.slice(0, 3).map((item, index) => {
              return <tr key={index}>
                <td>{item?.theNum}.</td>
                <td>{item?.name}</td>
                <td className="btnColor" style={{ color: "red" }}>Remove As SuperAdmin</td>
              </tr>
            })}
          </table>
        </div>
        <br />
        <br />
        <div className="sub-common--heading">
          Admins
        </div>
        <div>
          <table>
            <tr className="members-head">
              <th>Index</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
            {theDisplayData.slice(0, 3).map((item, index) => {
              return <tr key={index}>
                <td>{item?.theNum}.</td>
                <td>{item?.name}</td>
                <td className="btnColor" style={{ color: "red" }}>Remove As Admin</td>
              </tr>
            })}
          </table>
        </div>
        <br />
        <br />
        <div className="sub-common--heading">
          Employees
        </div>
        <div className="usersDataDisp">
          <div>
            <table>
              <tr className="members-head">
                <th>Index</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
              {allUsersData.filter((element, index) => index % 2 === 0).map((item, index) => {
                return <tr key={index}>
                
                  <td>{item?.theNum}.</td>
                  <td>{item?.name}</td>
                  <td className="btnRemove"><span className="btnColor">Promote</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="btnColor" style={{ color: "red" }} onClick={() => removeUser(item)}>Remove</span></td>
                </tr>
              })}
            </table>
          </div>
          <div style={{ marginLeft: "20px" }}>
            <table>
              <tr className="members-head">
                <th>Index</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
              {allUsersData.filter((element, index) => index % 2 !== 0).map((item, index) => {
                return <tr key={index}>
                  
                  <td>{item?.theNum}.</td>
                  <td>{item?.name}</td>
                  <td className="btnRemove"><span className="btnColor">Promote</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="btnColor" style={{ color: "red" }} onClick={() => removeUser(item)}>Remove</span></td>
                </tr>
              })}
            </table>
          </div>
        </div> */}
      </div>
    ) : (
      <div className="text-center" style={{ marginTop: "50px" }}>
        <p style={{ marginTop: "50px" }} className="text-center">
          The page will be auto enabled after you have joined a business

        </p>
      </div>
    )}
  </>
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
    sustainData: state.sustainabilityData,
  };
};
export default connect(mapStateToProps)(EmployerBusiness);
// export default SocialSharing;
