import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { me, sendResetPasswordLink } from "src/apiClient/auth";
import { connect } from "react-redux";
import { useRef, useState } from "react";
import { useToasts } from "react-toast-notifications";
import Sustainability from "../../components/MyAccount/Sustainability";
import Orders from "src/components/MyAccount/orders";
import Address from "../../components/MyAccount/Address";
import { useEffect } from "react";
import { verifyLoggedIn } from "src/apiClient/user";
import router from "next/router";
import Popup from "./popup";
import Dashboard from "./dashboard";
import ReviewPopup from "src/components/ReviewPopup";
import ChangePassword from "src/components/MyAccount/ChangePassword";
import Profile from "src/components/MyAccount/profile";
import { returnCorrectImage } from "src/components/helpers/returnCorrectImage";
import ChangeEmail from "src/components/MyAccount/changeEmail";
import SocialSharing from "src/components/MyAccount/socialSharing";
import BusinessSharing from "src/components/MyAccount/businessSharing"
import PrimaryEmailChangePopup from "src/components/primaryEmailChangePopup";
import RecoveryEmailChangePopup from "src/components/recoveryEmailChangePopup";
import { updateRecoveryEmail, updatePrimaryEmail } from "src/apiClient/auth";
import { setIsEmailChangeAttemptLeft } from "src/redux/actions/userAction";
import { MyProvider, useMyContext } from "src/Context"
import * as cookie from "cookie";
import Resetpasswordflow from "../resetpasswordflow";
import Business from "src/components/MyAccount/Business";
import Refferal from "src/components/MyAccount/Refferal";
import MyEmployer from "src/components/MyAccount/myEmployer";
import EmployerBusiness from "src/components/MyEmployerAccount/employerBusiness"
import EmployerBusinessSustainability from "src/components/MyAccount/employerBusinessSustainability";
import EmployerDashboard from "./employerDashboard";

const MyEmployerAccount = ({ userData, meData, setIsEmailChangeAttemptLeft }) => {
    const [meResponse, setMeResponse] = useState(meData);
    const { addToast } = useToasts();
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [showReviewPopUp, setShowReviewPopUp] = useState(false);
    const [reviewProduct, setReviewProduct] = useState();
    const [pageReadyToShow, setPageReadyToShow] = useState(false);
    const [sustainabilityDataChanged, setSustainabilityDataChanged] =
        useState(false);
    const [showPrimaryEmailPopup, setShowPrimaryEmailPopup] = useState(false);
    const [showRecoveryEmailPopup, setShowRecoveryEmailPopup] = useState(false);
    const [changedEmail, setChangedEmail] = useState("");
    const [isRecoveryCodeSent, setIsRecoveryCodeSent] = useState(false);
    const [isPrimaryEmailCodeSent, setIsPrimaryEmailCodeSent] = useState(false);
    const [refreshData, setRefreshData] = useState(false)
    const emailEditEnabledRef = useRef();
    let sustainabilityFuncs;
    // const [isAttemptLeft, setIsAttemptLeft] = useState(true)

    const reviewPopUpHandler = ({ products, orderId, currency }) => {
        setShowReviewPopUp(true);
        setReviewProduct({ products, orderId, currency });
    };

    const handleUserLoggedIn = async () => {
        const res = await verifyLoggedIn();
        const loggedIn = res?.data?.isLoggedIn;
        if (!loggedIn) {
            router.push("/login-register");
        } else {
            setPageReadyToShow(true);
        }
    };

    // useEffect(() => {
    //   handleUserLoggedIn().catch((err) => console.log(err))
    // }, [])

    useEffect(() => {
        if (!userData?.isLoggedIn) return router.push("/login-register");
        if (userData?.user?.emailVerificationStatus === "UNVERIFIED") {
          return router.push("/login-register?loggedIn=true");
        }
        verifyLoggedIn();
        setPageReadyToShow(true);
    }, []);

    const [showStartAgainModal, setShowStartAgainModal] = useState({
        val: false,
        type: "",
    });
    const [clearSustainabilityData, setClearSustainabilityData] = useState(false);
    const [clearToSystemDefaults, setClearToSystemDefaults] = useState(false);
    const [resetToPageEnter, setResetToPageEnter] = useState(false);
    const [editDisabled, setEditDisabled] = useState(true);
    // router.query.sustainability != "true"
    const [isPasswordTabActive, setIsPasswordTabActive] = useState(false);
    const [isChangeEmailActive, setIsChangeEmailActive] = useState(false);
    const [isSocialSharingActive, setIsSocialSharingActive] = useState(false);
    const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
    const [primaryEmailChangeTo, setPrimaryEmailChangeTo] = useState("");

    const handleShowStartAgainModal = (val) => {
        setShowStartAgainModal({ val: true, type: val });
    };

    const setSustainabilityHelperFunctions = (functions) => {
        sustainabilityFuncs = functions;
    };

    const resetSustainabilityPageToDefaults = () => {
        sustainabilityFuncs?.resetToDefault();
    };

    const handleSustainabilityCancel = async () => {
        await sustainabilityFuncs?.fetchDataFromAPIInitial();
        sustainabilityFuncs?.setDataChanged(false);
        sustainabilityFuncs?.setEditDisabled(true);
    };

    const resetSustainabilityPageToPreviousVersion = async () => {
        sustainabilityFuncs?.setLoading(true);
        await sustainabilityFuncs?.resetToPreviousVersion();
        sustainabilityFuncs?.setDataChanged(true);
    };

    const saveSustainabilityPageToAPI = async (data) => {
        if (data?.exit) {
            await sustainabilityFuncs?.setSlug(false);
            return sustainabilityFuncs?.setLoading(false);
        }
        if (data?.slug) {
            await sustainabilityFuncs?.setSlugStatusChanged(false);
            return sustainabilityFuncs?.saveSettingsFunc({
                displaySlug: true,
                runFromPopup: true,
            });
        } else {
            await sustainabilityFuncs?.setSlugStatusChanged(false);
            await sustainabilityFuncs?.setSlug(false);
            return sustainabilityFuncs?.saveSettingsFunc({
                displaySlug: false,
                runFromPopup: true,
            });
        }
    };

    // const triggerSaveSustainabilityPage = (value) => {
    //   const object = { value: () => func() }
    // }

    const secondUpdateV2 = useRef(true);

    const handleChangePassword = async (event) => {
        event.preventDefault();
        setIsEmailLoading(true);
        await sendResetPasswordLink({ email: userData.user?.email })
            .then((response) => {
                addToast(response.data?.message, {
                    appearance: response.status == 200 ? "success" : "error",
                    autoDismiss: true,
                });
            })
            .catch((error) => {
                addToast("Failed to Send Email, Please Try Again!", {
                    appearance: "error",
                    autoDismiss: true,
                });
            })
            .finally(() => setIsEmailLoading(false));
    };

    const sendRecoveryEmailCode = async (recoveryEmail) => {
        let response;
        try {
            setIsRecoveryCodeSent(false);
            response = await updateRecoveryEmail({ email: recoveryEmail });
            if (response?.status == 200) {
                setIsRecoveryCodeSent(true);
                addToast(
                    `A six-digit code has been sent to ${recoveryEmail}. It will expire within 5 minutes.`,
                    {
                        appearance: "success",
                        autoDismiss: true,
                    }
                );
            } else {
                addToast(response?.data?.message, {
                    appearance: "error",
                    autoDismiss: true,
                });
            }
        } catch (error) {
            addToast(error?.message, {
                appearance: "error",
                autoDismiss: true,
            });
        } finally {
            return response?.status;
        }
    };

    const sendPrimaryEmailCode = async (primaryEmail = primaryEmailChangeTo) => {
        let response;
        try {
            setIsPrimaryEmailCodeSent(false);
            setPrimaryEmailChangeTo(primaryEmail);
            response = await updatePrimaryEmail({ email: primaryEmail });
            if (response?.status == 200) {
                setIsPrimaryEmailCodeSent(true);
                addToast(
                    `A six-digit code has been sent to ${primaryEmail}. It will expire within 5 minutes.`,
                    {
                        appearance: "success",
                        autoDismiss: true,
                    }
                );
            } else {
                addToast(response?.data?.message, {
                    appearance: "error",
                    autoDismiss: true,
                });
            }
        } catch (error) {
            addToast(error?.message, {
                appearance: "error",
                autoDismiss: true,
            });
        } finally {
            return response?.status;
        }
    };

    const getMeData = async () => {
        try {
            const res = await me();
            if (res?.success) {
                setMeResponse({
                    success: true,
                    meData: res || {},
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleForgotPasswordPopup = () => {
        setShowPrimaryEmailPopup(false);
        setShowForgotPasswordPopup(true);
    };

    const MyEmployerAccount = () => (
        <MyProvider>
            <>
                {pageReadyToShow && (
                    <div>
                        {showForgotPasswordPopup ? (
                            <Resetpasswordflow
                                setShowForgotPasswordPopup={setShowForgotPasswordPopup}
                                setShowPreviousPopup={setShowPrimaryEmailPopup}
                                sendPrimaryEmailCode={sendPrimaryEmailCode}
                                origin={"CHANGE_EMAIL"}
                            />
                        ) : (
                            ""
                        )}
                        {showStartAgainModal?.val && (
                            <Popup
                                setClearToSystemDefaults={setClearToSystemDefaults}
                                setClearSustainabilityData={setClearSustainabilityData}
                                showStartAgainModal={showStartAgainModal}
                                setShowStartAgainModal={setShowStartAgainModal}
                                editDisabled={editDisabled}
                                setEditDisabled={setEditDisabled}
                                setResetToPageEnter={setResetToPageEnter}
                                sustainabilityDataChanged={sustainabilityDataChanged}
                                setSustainabilityDataChanged={setSustainabilityDataChanged}
                                secondUpdateV2={secondUpdateV2}
                                saveSustainabilityPageToAPI={saveSustainabilityPageToAPI}
                                resetSustainabilityPageToDefaults={
                                    resetSustainabilityPageToDefaults
                                }
                                resetSustainabilityPageToPreviousVersion={
                                    resetSustainabilityPageToPreviousVersion
                                }
                                handleSustainabilityCancel={handleSustainabilityCancel}
                            />
                        )}

                        {showReviewPopUp && (
                            <ReviewPopup
                                setShowReviewPopUp={setShowReviewPopUp}
                                reviewProduct={reviewProduct}
                            />
                        )}
                        {showPrimaryEmailPopup && (
                            <PrimaryEmailChangePopup
                                email={changedEmail}
                                setShowPrimaryEmailPopup={setShowPrimaryEmailPopup}
                                isPrimaryEmailCodeSent={isPrimaryEmailCodeSent}
                                setIsPrimaryEmailCodeSent={setIsPrimaryEmailCodeSent}
                                sendPrimaryEmailCode={sendPrimaryEmailCode}
                                getMeData={getMeData}
                                emailEditEnabledRef={emailEditEnabledRef}
                                isAttemptLeft={userData?.isEmailChangeAttemptLeft}
                                setIsAttemptLeft={setIsEmailChangeAttemptLeft}
                                handleForgotPasswordPopup={handleForgotPasswordPopup}
                            />
                        )}
                        {showRecoveryEmailPopup && (
                            <RecoveryEmailChangePopup
                                email={changedEmail}
                                setShowRecoveryEmailPopup={setShowRecoveryEmailPopup}
                                isRecoveryCodeSent={isRecoveryCodeSent}
                                setIsRecoveryCodeSent={setIsRecoveryCodeSent}
                                sendRecoveryEmailCode={sendRecoveryEmailCode}
                                getMeData={getMeData}
                                emailEditEnabledRef={emailEditEnabledRef}
                            />
                        )}
                        <LayoutTwo>
                            {/* breadcrumb */}
                            <BreadcrumbOne
                                pageTitle="My Employer Account"
                                className="bg--2"
                            // backgroundImage={
                            //   '/assets/images/backgrounds/' +
                            //   returnCorrectImage('breadcrumb-bg-2', window.innerWidth)
                            // }
                            >
                                <ul className="breadcrumb__list">
                                    <li>
                                        <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                                            <a>Home</a>
                                        </Link>
                                    </li>

                                    <li>My Employer Account</li>
                                </ul>
                            </BreadcrumbOne>
                            <div className="my-account-area space-mt--r130 space-mb--r130">
                                <Container className="orders-container">
                                    <Tab.Container
                                        defaultActiveKey={"myemployer"}
                                    >
                                        <Nav
                                            variant="pills"
                                            className="my-account-area__navigation"
                                            style={{ display: "flex", gap: "47px" }}
                                        >
                                            <Nav.Item
                                                onClick={() => [
                                                    setIsPasswordTabActive(false),
                                                    setIsChangeEmailActive(false),
                                                ]}
                                            >
                                                <Nav.Link className="navbar-item" eventKey="dashboard">
                                                    Employer's Dashboard
                                                </Nav.Link>
                                            </Nav.Item>
                                            {/* <Nav.Item
                                            onClick={() => [
                                                setIsPasswordTabActive(false),
                                                setIsChangeEmailActive(false),
                                            ]}
                                        >
                                            <Nav.Link className="navbar-item" eventKey="business">
                                                Employee Profile
                                            </Nav.Link>
                                        </Nav.Item> */}
                                            {/* <Nav.Item
                                            onClick={() => [
                                                setIsPasswordTabActive(false),
                                                setIsChangeEmailActive(false),
                                            ]}
                                        >
                                            <Nav.Link className="navbar-item" eventKey="orders">
                                                Employer Orders
                                            </Nav.Link>
                                        </Nav.Item> */}
                                            <Nav.Item
                                                onClick={() => [
                                                    setIsPasswordTabActive(false),
                                                    setIsChangeEmailActive(false),
                                                ]}
                                            >
                                                <Nav.Link className="navbar-item" eventKey="myemployer">
                                                    My Employer
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item
                                                onClick={() => [
                                                    setIsPasswordTabActive(false),
                                                    setIsChangeEmailActive(false),
                                                ]}
                                            >
                                                <Nav.Link className="navbar-item" eventKey="EmployerBusiness">
                                                    My Employer's Employees
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item
                                                onClick={() => [
                                                    setIsPasswordTabActive(false),
                                                    setIsChangeEmailActive(false),
                                                ]}
                                            >
                                                <Nav.Link className="navbar-item" eventKey="employerSustainabilityPage">
                                                    My Employer's Business Ecostance Page
                                                </Nav.Link>
                                            </Nav.Item>


                                            {/* <Nav.Item
                                            onClick={() => [
                                                setIsPasswordTabActive(false),
                                                setIsChangeEmailActive(false),
                                            ]}
                                        >
                                            <Nav.Link
                                                className="navbar-item"
                                                eventKey="sustainabilityPage"
                                            >
                                                Business Employee Page
                                            </Nav.Link>
                                        </Nav.Item> */}
                                            {/* <Nav.Item
                                            onClick={() => [
                                                setIsPasswordTabActive(false),
                                                setIsChangeEmailActive(false),
                                            ]}
                                        >
                                            <Nav.Link
                                                className="navbar-item"
                                                eventKey="socialSharing"
                                            >
                                                Share Business Link
                                            </Nav.Link>
                                        </Nav.Item> */}
                                            {/* <Nav.Item
                      onClick={() => [
                        setIsPasswordTabActive(false),
                        setIsChangeEmailActive(false),
                      ]}
                    >
                      <Nav.Link className="navbar-item" eventKey="address">
                        Address
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                      onClick={() => [
                        setIsPasswordTabActive(true),
                        setIsChangeEmailActive(false),
                      ]}
                    >
                      <Nav.Link
                        className="navbar-item"
                        eventKey="changePassword"
                      >
                        Password
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                      onClick={() => [
                        setIsPasswordTabActive(false),
                        setIsChangeEmailActive(true),
                      ]}
                    >
                      <Nav.Link className="navbar-item" eventKey="changeEmail">
                        Email
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                      onClick={() => [
                        setIsPasswordTabActive(false),
                        setIsChangeEmailActive(false),
                        setIsSocialSharingActive(true),
                      ]}
                    >
                      <Nav.Link
                        className="navbar-item"
                        eventKey="socialSharing"
                      >
                        Share
                      </Nav.Link>
                    </Nav.Item> */}
                                            {/* <Nav.Item>
                      <Nav.Link className="navbar-item" eventKey="refferal">
                        Refferal
                      </Nav.Link>
                    </Nav.Item> */}
                                            {/* <Nav.Item>
                      <Nav.Link className="navbar-item" eventKey="business">
                        Business
                      </Nav.Link>
                    </Nav.Item> */}
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="dashboard">
                                                <EmployerDashboard />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="business">
                                                <div className="my-account-area__content no--border">
                                                    <Business />
                                                </div>
                                            </Tab.Pane>
                                            {/* <Tab.Pane eventKey="profile">
                      <Profile />
                    </Tab.Pane> */}
                                            <Tab.Pane eventKey="orders">
                                                <Orders reviewPopUpHandler={reviewPopUpHandler} />
                                            </Tab.Pane>
                                            <Tab.Pane
                                                className="tabPage-sustainability"
                                                eventKey="employerSustainabilityPage"
                                            >
                                                <EmployerBusinessSustainability
                                                    handleShowStartAgainModal={handleShowStartAgainModal}
                                                    clearSustainabilityData={clearSustainabilityData}
                                                    clearToSystemDefaults={clearToSystemDefaults}
                                                    showStartAgainModal={showStartAgainModal}
                                                    setClearSustainabilityData={setClearSustainabilityData}
                                                    editDisabled={editDisabled}
                                                    setEditDisabled={setEditDisabled}
                                                    resetToPageEnter={resetToPageEnter}
                                                    setResetToPageEnter={setResetToPageEnter}
                                                    dataChanged={sustainabilityDataChanged}
                                                    setDataChanged={setSustainabilityDataChanged}
                                                    secondUpdateV2={secondUpdateV2}
                                                    setSustainabilityHelperFunctions={
                                                        setSustainabilityHelperFunctions
                                                    }
                                                />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="changePassword">
                                                {/* <div
                        style={{ marginTop: "50px" }}
                        className="my-account-area__content"
                      >
                        <h3>Change Password</h3>
                        <div className="account-details-form">
                          <form>
                            <div className="single-input-item">
                              <button
                                className="change--password--button"
                                onClick={handleChangePassword}
                              >
                                Change Password{" "}
                                {isEmailLoading && (
                                  <Spinner size="sm" animation="border" />
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div> */}
                                                <ChangePassword
                                                    isPasswordTabActive={isPasswordTabActive}
                                                />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="changeEmail">
                                                <ChangeEmail
                                                    meData={meResponse}
                                                    setChangedEmail={setChangedEmail}
                                                    setShowRecoveryEmailPopup={setShowRecoveryEmailPopup}
                                                    setShowPrimaryEmailPopup={setShowPrimaryEmailPopup}
                                                    sendRecoveryEmailCode={sendRecoveryEmailCode}
                                                    sendPrimaryEmailCode={sendPrimaryEmailCode}
                                                    emailEditEnabledRef={emailEditEnabledRef}
                                                    isChangeEmailActive={isChangeEmailActive}
                                                    isAttemptLeft={userData?.isEmailChangeAttemptLeft}
                                                />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="address">
                                                <div className="my-account-area__content no--border">
                                                    <Address />
                                                </div>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="socialSharing">
                                                <BusinessSharing meData={meResponse} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="myemployer">
                                                <MyEmployer refreshData={refreshData} setRefreshData={setRefreshData} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="EmployerBusiness">
                                                <EmployerBusiness refreshData={refreshData} setRefreshData={setRefreshData} />
                                            </Tab.Pane>
                                            {/* <Tab.Pane eventKey="refferal">
                        <Refferal />
                    </Tab.Pane> */}
                                            {/* <Tab.Pane eventKey="business">
                      <div className="my-account-area__content no--border">
                        <Business />
                      </div>
                    </Tab.Pane> */}
                                        </Tab.Content>
                                    </Tab.Container>
                                </Container>
                            </div>
                        </LayoutTwo>
                    </div>
                )}
            </>
        </MyProvider>
    );

    return <>{MyEmployerAccount()}</>;
};

const returnResponseFailed = () => {
    return { props: { meData: { success: false } } };
};

export async function getServerSideProps(context) {
    const localCookie = context?.req?.headers?.cookie;
    if (!localCookie) {
        return returnResponseFailed();
    }

    const JWTToken = cookie.parse(localCookie)?.JWTToken;
    if (!JWTToken) {
        return returnResponseFailed();
    }

    let meData;
    try {
        meData = await me(JWTToken);
    } catch (err) {
        console.log("error while getting carbon saved calculations", err);
    }

    let returnData = {};

    if (meData?.success) {
        returnData = {
            success: true,
            meData: meData || {},
        };
    } else {
        returnData = {
            success: false,
        };
    }

    return { props: { meData: returnData } };
}

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setIsEmailChangeAttemptLeft: (isEmailChangeAttemptLeft) => {
            dispatch(setIsEmailChangeAttemptLeft(isEmailChangeAttemptLeft));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyEmployerAccount);
