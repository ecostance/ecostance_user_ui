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
import BusinessSustainability from "../../components/MyAccount/BusinessSustainablility";
import { MyProvider, useMyContext } from "src/Context"
// import businessSustainability from "src/components/MyBusinessAccount/businessSustainability";
import Orders from "src/components/MyAccount/orders";
import BusinessOrders from "src/components/MyAccount/businessOrders";
import ModulePurchases from "src/components/MyAccount/modulePurchases";
import Address from "../../components/MyAccount/Address";
import { useEffect } from "react";
import { verifyLoggedIn } from "src/apiClient/user";
import router from "next/router";
import Popup from "./popup";
import Dashboard from "./dashboard";
import BusinessDashboard from "./businessDashboard";
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

import * as cookie from "cookie";
import Resetpasswordflow from "../resetpasswordflow";
import Business from "src/components/MyAccount/Business";
import Refferal from "src/components/MyAccount/Refferal";
import socialMediaSharing from "src/components/MyAccount/socialMediaSharing";
import SocialMediaSharing from "src/components/MyAccount/socialMediaSharing";
import myEmployerAccount from "./my-employer-account";
import BusinessEvent from "src/components/MyAccount/businessEvent";
import ExternalApps from "src/components/MyAccount/externalApps";
import { useRouter } from "next/router";
import BusinessProduct from "src/components/MyAccount/businessProduct";
import Suppliers from "src/components/MyAccount/supplierDetails";
import ModuleAccessGate from "src/components/ModuleAccess/ModuleAccessGate";
import ModuleLockedModal from "src/components/ModuleAccess/ModuleLockedModal";
import {
  hasModuleAccess,
  MODULE_ACCESS,
  fetchUserPurchasedModules,
  getCachedPurchasedModules,
  mergeModuleLists,
} from "src/constants/moduleAccess";
// import businessProductEdit from "src/components/MyAccount/businessProductEdit";
// import BusinessProductEdit from "src/components/MyAccount/businessProductEdit";

const MyBusinessAccount = ({ userData, meData, setIsEmailChangeAttemptLeft }) => {
  const { query } = useRouter();
  const router = useRouter();
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
  const emailEditEnabledRef = useRef();
  let sustainabilityFuncs;
  // const [isAttemptLeft, setIsAttemptLeft] = useState(true)

  const reviewPopUpHandler = ({ products, orderId, currency, businessReview }) => {
    setShowReviewPopUp(true);
    setReviewProduct({ products, orderId, currency, businessReview });
    // console.log(businessReview , "businessReview")
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
    console.log("businessuser1" , userData)
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

  const TAB_MODULE_MAP = {
    productInfo: 4,
    supplierDetails: 5,
    businessEvent: 3,
  };

  const rawProfileModules =
    meResponse?.meData?.moduleSupported ||
    meResponse?.meData?.data?.moduleSupported ||
    meResponse?.moduleSupported ||
    meResponse?.data?.moduleSupported ||
    meData?.meData?.moduleSupported ||
    meData?.meData?.data?.moduleSupported ||
    meData?.moduleSupported ||
    [];

  const [purchasedModules, setPurchasedModules] = useState(() =>
    getCachedPurchasedModules()
  );

  const moduleSupported = useMemo(() => {
    return mergeModuleLists(rawProfileModules, purchasedModules);
  }, [rawProfileModules, purchasedModules]);

  useEffect(() => {
    if (!userData?.isLoggedIn) return;
    let isMounted = true;
    fetchUserPurchasedModules(meResponse?.meData || meData?.meData || meResponse || meData)
      .then((mods) => {
        if (isMounted && Array.isArray(mods) && mods.length > 0) {
          setPurchasedModules((prev) => mergeModuleLists(prev, mods));
        }
      })
      .catch((err) => {
        console.error("Error fetching user module purchases:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [userData?.isLoggedIn, meResponse]);

  const [activeTab, setActiveTab] = useState(() => {
    const initialRequestedTab =
      query.data === "event"
        ? "businessEvent"
        : router.query?.businessSustainability === "true"
        ? "sustainabilityPage"
        : router.query?.tab || "business";

    const targetModId = TAB_MODULE_MAP[initialRequestedTab];
    if (targetModId && !hasModuleAccess(moduleSupported, targetModId)) {
      return "business";
    }
    return initialRequestedTab;
  });

  const [lockedModal, setLockedModal] = useState({
    show: false,
    moduleId: null,
    moduleName: "",
  });

  useEffect(() => {
    if (lockedModal.show && lockedModal.moduleId) {
      if (hasModuleAccess(moduleSupported, lockedModal.moduleId)) {
        setLockedModal({ show: false, moduleId: null, moduleName: "" });
        const matchingTab = Object.keys(TAB_MODULE_MAP).find(
          (k) => TAB_MODULE_MAP[k] === lockedModal.moduleId
        );
        if (matchingTab) {
          setActiveTab(matchingTab);
        }
      }
    }
  }, [moduleSupported, lockedModal.show, lockedModal.moduleId]);

  useEffect(() => {
    const hasModules = moduleSupported?.length;
    if (!hasModules && userData?.isLoggedIn) {
      getMeData();
    }
  }, [userData?.isLoggedIn]);

  useEffect(() => {
    if (!router.isReady) return;
    const requestedTab =
      query.data === "event"
        ? "businessEvent"
        : router.query?.businessSustainability === "true"
        ? "sustainabilityPage"
        : router.query?.tab || "business";

    const targetModuleId = TAB_MODULE_MAP[requestedTab];
    if (targetModuleId && !hasModuleAccess(moduleSupported, targetModuleId)) {
      setActiveTab("business");
      setLockedModal({
        show: true,
        moduleId: targetModuleId,
        moduleName: MODULE_ACCESS[targetModuleId]?.name || "Module",
      });
    } else {
      setActiveTab(requestedTab);
    }
  }, [router.isReady]);

  const handleTabSelect = (eventKey) => {
    const targetModuleId = TAB_MODULE_MAP[eventKey];
    if (targetModuleId && !hasModuleAccess(moduleSupported, targetModuleId)) {
      setLockedModal({
        show: true,
        moduleId: targetModuleId,
        moduleName: MODULE_ACCESS[targetModuleId]?.name || "Module",
      });
      return;
    }

    setActiveTab(eventKey);
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("tab", eventKey);
    if (currentUrl.searchParams.has("data")) currentUrl.searchParams.delete("data");
    if (currentUrl.searchParams.has("businessSustainability")) currentUrl.searchParams.delete("businessSustainability");
    window.history.replaceState({}, "", currentUrl.toString());
  };

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

  const MyBusinessAccount = () => (
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
                pageTitle="My Own Business Account"
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

                  <li>My Own Business Account</li>
                </ul>
              </BreadcrumbOne>
              <div className="my-account-area space-mt--r130 space-mb--r130">
                <Container className="orders-container">
                  <Tab.Container
                    activeKey={activeTab}
                    onSelect={handleTabSelect}
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
                          Business Dashboard
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item
                        onClick={() => [
                          setIsPasswordTabActive(false),
                          setIsChangeEmailActive(false),
                        ]}
                      >
                        <Nav.Link className="navbar-item" eventKey="business">
                          Business Profile
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item
                        onClick={() => [
                          setIsPasswordTabActive(false),
                          setIsChangeEmailActive(false),
                        ]}
                      >
                        <Nav.Link className="navbar-item" eventKey="orders">
                          Business Orders
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item
                        onClick={() => [
                          setIsPasswordTabActive(false),
                          setIsChangeEmailActive(false),
                        ]}
                      >
                        <Nav.Link
                          className="navbar-item"
                          eventKey="modulePurchases"
                        >
                          Module Purchases
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item
                        onClick={() => [
                          setIsPasswordTabActive(false),
                          setIsChangeEmailActive(false),
                        ]}
                      >
                        <Nav.Link
                          className="navbar-item"
                          eventKey="sustainabilityPage"
                        >
                          Business EcoStance Page
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item
                        onClick={() => [
                          setIsPasswordTabActive(false),
                          setIsChangeEmailActive(false),
                        ]}
                      >
                        <Nav.Link
                          className="navbar-item"
                          eventKey="socialSharing"
                        >
                          Our Business Employees
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
                          eventKey="socialmediashare"
                        >
                          Social media share
                        </Nav.Link>
                      </Nav.Item> */}
                      <Nav.Item
                        onClick={() => [
                          setIsPasswordTabActive(false),
                          setIsChangeEmailActive(false),
                        ]}
                      >
                        <Nav.Link
                          className="navbar-item"
                          eventKey="businessEvent"
                        >
                          Business Event
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
                          eventKey="externalApps"
                        >
                          External Apps
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
                          eventKey="productEdit"
                        >
                          Create Product
                        </Nav.Link>
                      </Nav.Item> */}
                      <Nav.Item
                        onClick={() => [
                          setIsPasswordTabActive(false),
                          setIsChangeEmailActive(false),
                        ]}
                      >
                        <Nav.Link
                          className="navbar-item"
                          eventKey="productInfo"
                        >
                          Product Info
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item
                        onClick={() => [
                          setIsPasswordTabActive(false),
                          setIsChangeEmailActive(false),
                        ]}
                      >
                        <Nav.Link
                          className="navbar-item"
                          eventKey="supplierDetails"
                        >
                          Supply Chain
                        </Nav.Link>
                      </Nav.Item>

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
                    {/* <p className="business-name">{JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}</p> */}
                    <Tab.Content>
                      <Tab.Pane eventKey="dashboard">
                        <BusinessDashboard />
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
                        <BusinessOrders reviewPopUpHandler={reviewPopUpHandler} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="modulePurchases">
                        <ModulePurchases
                          moduleSupported={moduleSupported}
                          onActiveModulesChange={(mods) => {
                            if (Array.isArray(mods) && mods.length > 0) {
                              setPurchasedModules((prev) => mergeModuleLists(prev, mods));
                            }
                          }}
                        />
                      </Tab.Pane>
                      <Tab.Pane
                        className="tabPage-sustainability"
                        eventKey="sustainabilityPage"
                      >
                        <BusinessSustainability
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
                      <Tab.Pane eventKey="socialmediashare">
                        <SocialMediaSharing meData={meResponse} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="businessEvent">
                        {hasModuleAccess(moduleSupported, 3) && <BusinessEvent />}
                      </Tab.Pane>
                      <Tab.Pane eventKey="externalApps">
                        <ExternalApps />
                      </Tab.Pane>
                      <Tab.Pane eventKey="productInfo">
                        {hasModuleAccess(moduleSupported, 4) && <BusinessProduct />}
                      </Tab.Pane>
                      <Tab.Pane eventKey="supplierDetails">
                        {hasModuleAccess(moduleSupported, 5) && <Suppliers />}
                      </Tab.Pane>
                      {/* <Tab.Pane eventKey="productEdit">
                        <BusinessProductEdit handleShowStartAgainModal={handleShowStartAgainModal}
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
                          } />
                      </Tab.Pane> */}
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
              <ModuleLockedModal
                show={lockedModal.show}
                onHide={() =>
                  setLockedModal({
                    show: false,
                    moduleId: null,
                    moduleName: "",
                  })
                }
                moduleId={lockedModal.moduleId}
                moduleName={lockedModal.moduleName}
                defaultName={
                  userData?.user?.firstName
                    ? `${userData.user.firstName} ${userData.user.lastName || ""}`.trim()
                    : ""
                }
                defaultEmail={userData?.user?.email || ""}
                defaultCompany=""
              />
            </LayoutTwo>
          </div>
        )}
      </>
    </MyProvider>
  );

  return (
    <ModuleAccessGate
      moduleIds={[1, 5]}
      moduleId={1}
      meData={meResponse?.meData || meData?.meData}
      userData={userData}
    >
      {MyBusinessAccount()}
    </ModuleAccessGate>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(MyBusinessAccount);
