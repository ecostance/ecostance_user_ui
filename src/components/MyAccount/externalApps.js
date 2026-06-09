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
import { getAllUsersForMyBusiness, getAllUsersCountForMyBusiness, removeBusinessUser, changeRole } from "../../apiClient/business";
import LezadaBackdrop from "../lezadaBackdrop";
import { Tooltip } from "react-tippy";
import { useMyContext } from "src/Context"
import Pagination from "react-js-pagination";

let toastId;
let link = process.env.NEXT_PUBLIC_UI_URL + "/?businessCode=Ram123";
const ExternalApps = ({
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
    const profileRelatedData = meData?.meData?.data;
    const [allUsersData, setAllUsersData] = useState([])
    const [selectedUser, setSelectedUser] = useState("")
    const [pageNum, setPageNum] = useState(1)
    const [thePageData, setThePageData] = useState("")
    const [count, setCount] = useState("")
    const [pageCount, setPageCount] = useState([])
    const [activePage, setActivePage] = useState(1);
    const [userRoles, setUserRoles] = useState("")

    let transactionData = [
        { date: "29-07-2024", offsets: "7", amount: "100", currency: "USD", status: "Paid", transactionid: "123456" },
        { date: "30-07-2024", offsets: "11", amount: "120", currency: "CAD", status: "Collected", transactionid: "135678" },
        { date: "01-08-2024", offsets: "9", amount: "370", currency: "GBP", status: "In Progress", transactionid: "246780" },
        { date: "02-08-2024", offsets: "15", amount: "10,000", currency: "INR", status: "To Be Paid", transactionid: "987654" }
    ]





    let BusinessDetails = localStorage.getItem("MyBusinessDetails")
    useEffect(() => {
        getAllUsers();
    }, [activePage, setActivePage])

    let limit = 15

    const getAllUsers = async () => {
        console.log(pageNum, "nummm")
        let usersData = await getAllUsersForMyBusiness(activePage, limit)
        if (usersData.data.success) {
            setThePageData(usersData.data.metadata)
            setCount(usersData.data.metadata.count)
            setAllUsersData(usersData.data.data)
        }
        let userCount = await getAllUsersCountForMyBusiness()
        if (userCount?.data?.success) {
            console.log("counttt", userCount?.data?.metadata)
            setUserRoles(userCount?.data?.metadata)
        }
        console.log(usersData?.data?.data)
    }


    const itemsCountPerPage = 10;
    const pageRangeDisplayed = 5;

    const handlePageChange = (pageNumber) => {
        console.log(`Active page is ${pageNumber}`);
        setActivePage(pageNumber);
    };

    let pageNumbers = []

    useEffect(() => {
        if (Math.ceil(count / limit) < 4) {
            Array(Math.ceil(count / limit)).fill("").forEach((e, index) => {
                pageNumbers.push(index + 1)
            });
        } else {
            pageNumbers.push(1, 2, 3)
        }
        console.log(pageNumbers, "pagee")
        setPageCount(pageNumbers)
    }, [count])

    let lastPageData = []


    const forwardAction = (e) => {
        console.log(pageCount[pageCount.length - 1], pageNum + 1, "aaaa")
        if (pageNum !== Math.ceil(count / limit)) {
            setPageNum(pageNum + 1)
            if (pageCount[pageCount.length - 1] < pageNum + 1) {
                console.log(thePageData.count, thePageData.currentPage * limit, "pageee")
                if (thePageData.count - thePageData.currentPage * limit > 3) {
                    setPageCount(pageCount.map(x => x + 3))
                } else {
                    // pageCount.splice(0, pageCount.length);
                    Array(thePageData.count - thePageData.currentPage * limit).fill("").forEach((e, index) => {
                        lastPageData.push(limit + 2)
                    });
                    setPageCount(lastPageData)
                }
            }
        }
    }

    const backwardAction = () => {
        if (pageNum !== 1) {
            setPageNum(pageNum - 1)
        }
        if (pageNum > 1) {
            if (pageCount[0] > pageNum - 1) {
                setPageCount(pageCount.map(x => x - 3))
            }
        }
    }

    useEffect(() => {
        if (profileRelatedData) {
            console.log(profileRelatedData, "ljkwhckjwlebdwed");
        }
    }, [profileRelatedData]);
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
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        return formattedDate.replace(/\d+/, `${day}${suffix}`);
    }


    const MemberDetails = () => {
        return (
            <>
                {transactionData.map((e, index) => {
                    return <>
                        <div className="business--apps--table--data">
                            <div>{index + 1}.</div>
                            <div>{e?.date}</div>
                            <div>{e.offsets} MtCo2e</div>
                            <div>{e?.amount}</div>
                            <div>{e?.currency}</div>
                            <div>{e?.status}</div>
                            <div>{e?.transactionid}</div>
                        </div>
                    </>
                })}
            </>
        )
    }


    return <>
        {localStorage.getItem("MyBusinessDetails") ? (
            <div className="change--email--wrapper">
                <div className="profile-line" style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                    <p className="orders--orderNumber-Holder" style={{ display: localStorage.getItem("MyBusinessDetails") ? "" : "none" }}>Business Name:  <b>{JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}</b></p>
                    <p className="profile-head"></p>
                </div>
                <div className="table--box">
                    <hr style={{ margin: 0 }} />
                    <div className="business--apps--table--head">
                        <div>No.</div>
                        <div>Date</div>
                        <div>CO2 offsets</div>
                        <div>Amount</div>
                        <div>Currency</div>
                        <div>Status</div>
                        <div style={{ display: "flex", justifyContent: "center" }}>TransactionId</div>
                    </div>
                    <hr style={{ margin: 0 }} />
                    <MemberDetails />
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
                </div>
            </div >
        ) : (
            <div>
                <p style={{ marginTop: "50px" }} className="text-center">
                    The page will be auto enabled after you have created your business profile
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
export default connect(mapStateToProps)(ExternalApps);
// export default SocialSharing;
