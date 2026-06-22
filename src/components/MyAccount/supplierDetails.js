import React, { useEffect, useState, useRef } from "react";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { IoIosClose, IoIosArrowRoundUp, IoIosCheckmark } from "react-icons/io";
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
import {
  MdCheck,
  MdContentCopy,
  MdInfoOutline,
  MdDelete,
} from "react-icons/md";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { QRCode } from "react-qrcode-logo";
import CountrySelector from "./elements/CountrySelector";
import {
  getBusinessEvent,
  addBusinessProduct,
  removeBusinessUser,
  addBusinessEvent,
  getSingleBusinessEvent,
  EditBusinessEvent,
  businessProductSlugCheck,
  businessProductNameCheck,
  businessProductCodeCheck,
  keepUpdatedBusiness,
  getSupplyChain,
  confirmPartner,
  deleteSupplyChain,
} from "../../apiClient/business";
import { ButtonGroup, Col, Container, Row, Spinner } from "react-bootstrap";
import { validatePhoneNumber } from "src/helpers/phoneValidation";
import { returnPhoneDetails } from "src/helpers/returnPhoneDetails";
import ToggleButton from "react-bootstrap/ToggleButton";
import LezadaBackdrop from "../lezadaBackdrop";
import { Tooltip } from "react-tippy";
import { useMyContext } from "src/Context";
import SliderCustom from "src/components/calculator/slider";
import Switch from "./elements/Switch";
import PhoneInputJSX from "../Stripe/phoneInput";
import { interpolateAs } from "next/dist/shared/lib/router/router";
// import AddEventIcon from "src/assets/images/addEventIcon.jsx";
import EditIcon from "public/assets/images/editicon.png";
import EyeIcon from "public/assets/images/eyeicon-grey.svg";
import LeafIcon from "src/assets/images/leafIcon.jsx";
// import SupplyChainImg from "public/assets/images/productchain.png"
import { useRouter } from "next/router";
import Pagination from "react-js-pagination";
import MultipleFileUpload from "./elements/multipleFileUpload";
import NewFileUpload from "./elements/newFileUpload";
import NewMultipleFileUpload from "./elements/newMultipleFileUpload";
import {
  getBusinessProduct,
  getSingleBusinessProduct,
  editBusinessProductPage,
  deleteBusinessProductPage,
  slugChange,
  getPartnerDetails,
  getSinglePartnerDetails,
} from "src/apiClient/business";
import { countryNameToISO3 } from "src/data/countryNameToISO3";
import AddSupplier from "./addSupplier";
import AddDistributor from "./addDistributor";
import { AnimatedTree, Tree } from "react-tree-graph";
import MultiLevelTreeDiagram from "./multiTreeDiagram";
import CurrencySelect from "../helpers/currencySelect";
const INVALID_INPUT_LOW_CHAR = "INVALID_INPUT_LOW_CHAR";
const INVALID_INPUT_HIGH_CHAR = "INVALID_INPUT_HIGH_CHAR";
const INVALID_SLUG_REGEX_MATCH = "INVALID_SLUG_REGEX_MATCH";
const INVALID_CONTACT_FIELD = "INVALID_CONTACT_FIELD";
const INVALID_TOGGLE_OPERATION_NO_CHAR = "INVALID_TOGGLE_OPERATION_NO_CHAR";
const INVALID_FIELD_EMPTY = "INVALID_FIELD_EMPTY";
const SLUG_AVAILABLE = "SLUG_AVAILABLE";
const SLUG_UNAVAILABLE = "SLUG_UNAVAILABLE";
const SLUG_UNTOUCHED = "SLUG_UNTOUCHED";

const data = {
  businessName: "Tata Consultancy",
  primaryName: 34,
  chain: [
    {
      _id: "67f5080557e2f3be8b54ad1f",
      userId: "6690f90f74868046c0f6c7a3",
      chainBusinessId: "6690fb5574868046c0f6e9fe",
      chainUserId: "6690f90f74868046c0f6c7a3",
      businessName: "value textiles",
      relationship: "supplier",
      primaryName: "jack",
      primaryEmail: "jack@gmail.com",
      alternateName: "dawson",
      alternateEmail: "dawson@gmail.com",
      status: "active",
      createdAt: "2025-04-08T11:27:01.381Z",
      updatedAt: "2025-04-08T11:27:01.381Z",
      __v: 0,
      chain: [],
      position: "left",
    },
    {
      _id: "67f5108e57e2f3be8b54ad4e",
      userId: "6690f90f74868046c0f6c7a3",
      chainBusinessId: "6690fb5574868046c0f6e9fe",
      chainUserId: "6690f90f74868046c0f6c7a3",
      businessName: "Tata consultant",
      relationship: "supplier",
      primaryName: "roop",
      primaryEmail: "roop@gmail.com",
      alternateName: "ram",
      alternateEmail: "ram@gmail.com",
      status: "active",
      createdAt: "2025-04-08T12:03:26.948Z",
      updatedAt: "2025-04-08T12:03:26.948Z",
      __v: 0,
      chain: [],
      position: "left",
    },
    {
      _id: "67fe4bfd28ec4f98839c69f8",
      userId: "6690f90f74868046c0f6c7a3",
      chainBusinessId: "6690fb5574868046c0f6e9fe",
      chainUserId: "6690f90f74868046c0f6c7a3",
      businessName: "PQR TEXTILES",
      relationship: "supplier",
      primaryName: "john smith",
      primaryEmail: "john@gmail.com",
      alternateName: "jake",
      alternateEmail: "jake@gmail.com",
      status: "active",
      createdAt: "2025-04-15T12:07:25.317Z",
      updatedAt: "2025-04-15T12:07:25.317Z",
      __v: 0,
      chain: [],
      position: "left",
    },
    {
      _id: "67fe4c3028ec4f98839c6a17",
      userId: "6690f90f74868046c0f6c7a3",
      chainBusinessId: "6690fb5574868046c0f6e9fe",
      chainUserId: "6690f90f74868046c0f6c7a3",
      businessName: "JKL Textiles",
      relationship: "supplier",
      primaryName: "bane",
      primaryEmail: "bane@gmail.com",
      alternateName: "drake",
      alternateEmail: "drake@gmail.com",
      status: "active",
      createdAt: "2025-04-15T12:08:16.698Z",
      updatedAt: "2025-04-15T12:08:16.698Z",
      __v: 0,
      chain: [],
      position: "left",
    },
    {
      _id: "67f4fe7957e2f3be8b54aa34",
      userId: "6690f90f74868046c0f6c7a3",
      chainBusinessId: "6690fb5574868046c0f6e9fe",
      chainUserId: "6690f90f74868046c0f6c7a3",
      businessName: "Oracle",
      relationship: "distributor",
      primaryName: "john smith",
      primaryEmail: "johnsmith@gmail.com",
      alternateName: "sachin",
      alternateEmail: "sachin@gmail.com",
      status: "active",
      createdAt: "2025-04-08T10:46:17.324Z",
      updatedAt: "2025-04-08T10:46:17.324Z",
      __v: 0,
      chain: [],
      position: "right",
    },
    {
      _id: "67fe4c6c28ec4f98839c6a3f",
      userId: "6690f90f74868046c0f6c7a3",
      chainBusinessId: "6690fb5574868046c0f6e9fe",
      chainUserId: "6690f90f74868046c0f6c7a3",
      businessName: "TCS",
      relationship: "distributor",
      primaryName: "bob",
      primaryEmail: "bob@gmail.com",
      alternateName: "jake",
      alternateEmail: "jake@gmail.com",
      status: "active",
      createdAt: "2025-04-15T12:09:16.215Z",
      updatedAt: "2025-04-15T12:09:16.215Z",
      __v: 0,
      chain: [],
      position: "right",
    },
  ],
};

let toastId;
let link = process.env.NEXT_PUBLIC_UI_URL + "/?conferenceCode=Ram123";
const Suppliers = ({
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
  const validationItemOnLength = {
    title: { min: 10, max: 50 },
    description: { min: 10, max: 1000 },
    aboutUs: { min: 10, max: 1000 },
    name: { min: 3, max: 100 },
  };
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
  const [startDataFetched, setStartDataFetched] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [clearFields, setClearFields] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [allUsersData, setAllUsersData] = useState([]);
  const [shouldEditEvent, setShouldEditEvent] = useState(false);
  const [selectEditEvent, setSelectEditEvent] = useState("");
  const [eventType, setEventType] = useState("Conference");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [userCountry, setUserCountry] = useState({});
  const [addProductPopup, setAddProductPopup] = useState(false);
  const [addSupplierBox, setAddSupplierBox] = useState(false);
  const [addDistributorBox, setAddDistributorBox] = useState(false);
  const [countryCodeISO3, setCountryCodeISO3] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [productName, setProductName] = useState("");
  const [shouldCallAPI, setShouldCallAPI] = useState(false);
  const [selectCountryRoom, setSelectCountryRoom] = useState();
  const [showCapitalCarbon, setShowCapitalCarbon] = useState();
  const [showCapitalName, setCapitalName] = useState();
  const [totalCarbon, setTotalCarbon] = useState("");
  const [storeCountryShortName, setStoreCountryShortName] = useState("");
  const [selectCountry, setSelectCountry] = useState();
  const [peopleAttending, setPeopleAttending] = useState("over10000people");
  const [venueType, setVenueType] = useState("indoor");
  const [constSlug, setConstSlug] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [imageLogo, setImageLogo] = useState("");
  const firstRender = useRef();
  const [location, setLocation] = useState("");
  const [initialCode, setInitalCode] = useState("");
  const [peopleNum, setPeopleNum] = useState(1);
  const [isGroup, setIsGroup] = useState("no");
  const [businessPage, setBusinessPage] = useState("");
  const [showBusinessPage, setShowBusinessPage] = useState(false);
  const [conferenceName, setConferenceName] = useState("");
  const [refreshEvents, setRefreshEvents] = useState("");
  const [allEventsData, setAllEventsData] = useState([]);
  const [sustainabilityDataChanged, setSustainabilityDataChanged] =
    useState(false);
  const [singleEvent, setSingleEvent] = useState("");
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [totalPowerConsumption, setTotalPowerConsumption] = useState(0);
  const [totalWaterConsumption, setTotalWaterConsumption] = useState(0);
  const [totalRecycledMaterial, setTotalRecycledMaterial] = useState(0);
  const [totalUpcycleddMaterial, setTotalUpcycledMaterial] = useState(0);
  const [partnerDetails, setPartnerDetails] = useState([]);
  const [distributorDetails, setDistributorDetails] = useState([]);
  const [image, setImage] = useState("");
  const [previews, setPreviews] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const slugInputRef = useRef(null);
  const [inputSlugSelected, setInputSlugSelected] = useState(false);
  const [initSlug, setInitSlug] = useState("");
  const [chainSwitch, setChainSwitch] = useState(false);
  const [searchEvent, setSearchEvent] = useState("");
  const [haveGroups, setHaveGroups] = useState("no");
  const [selectedGroup, setSelectedGroup] = useState("designer");
  const [ghgData, setGhgData] = useState("");
  const [totalGHGDataCount, setTotalGHGDataCount] = useState(0);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [allEventStats, setAllEventStats] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [count, setCount] = useState("");
  const [yearlyEvents, setYearlyEvents] = useState([]);
  const [selectedYearlyEvent, setSelectedYearlyEvent] = useState("");
  const [yearlyActivePage, setYearlyActivePage] = useState(1);
  const [yearlyCount, setYearlyCount] = useState(15);
  const [themeSelected, setThemeSelected] = useState("white");
  const [allProducts, setAllProducts] = useState([]);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [showName, setShowName] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showLinkedin, setShowLinkedin] = useState(false);
  const [showTwitter, setShowTwitter] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);
  const [showFacebook, setShowFacebook] = useState(false);
  const [productTag, setProductTag] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [email, setEmail] = useState("");
  const [formalName, setFormalName] = useState("");
  const [publishCount, setPublishCount] = useState(0);
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedIn] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneInfo, setPhoneInfo] = useState("");
  const [singleProduct, setSingleProduct] = useState(false);
  const [editDisabled, setEditDisabled] = useState(true);
  const [editDisabledProduct, setEditDisabledProduct] = useState(true);
  const [displaySlug, setDisplaySlug] = useState(true);
  const [showSingleProduct, setShowSingleProduct] = useState(false);
  const [theVisual, setTheVisual] = useState({});
  const [aboutUs, setAboutUs] = useState("");
  const [title, setTitle] = useState("");
  const [highlight1, setHighlight1] = useState("");
  const [highlight2, setHighlight2] = useState("");
  const [highlight3, setHighlight3] = useState("");
  const [highlight4, setHighlight4] = useState("");
  const [signature, setSignature] = useState("");
  const [chainData, setChainData] = useState([
    { custodyType: "", date: "", address: "", linkName: "", link: "" },
  ]);
  const [certData, setCertData] = useState([{ name: "", link: "" }]);
  const [description, setDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [sustainabilityActionStates, setSustainabilityActionStates] = useState({
    slugChanged: false,
    slugAvailable: SLUG_UNTOUCHED,
    slugStatusChangedToTrue: false,
  });
  const [productCode, setProductCode] = useState("");
  const [defaultPopup, setDefaultPopup] = useState(false);
  const [triggerDefault, setTriggerDefault] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [carbonEmission, setCarbonEmission] = useState("");
  const [showEmission, setShowEmission] = useState(false);
  const [consumption, setConsumption] = useState("");
  const [showConsumption, setShowConsumption] = useState(false);
  const [waterUsage, setWaterUsage] = useState("");
  const [showWaterUsage, setShowWaterUsage] = useState(false);
  const [recycledMaterial, setRecycledMaterial] = useState("");
  const [showRecycledMaterial, setShowRecycledMaterial] = useState(false);
  const [upcycledMaterial, setUpcycledMaterial] = useState("");
  const [showUpcycledMaterial, setShowUpcycledMaterial] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmAccept, setConfirmAccept] = useState(false);
  const [deleteChainId, setdeleteChainId] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [aboutLink, setAboutLink] = useState("");
  const [showAboutLink, setShowAboutLink] = useState(false);
  const [storeLink, setStoreLink] = useState("");
  const [showStoreLink, setShowStoreLink] = useState(false);
  const [address, setAddress] = useState("");
  const [showAddress, setShowAddress] = useState(false);
  const [contact, setContact] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [ordertrack, setOrdertrack] = useState("");
  const [showOrdertrack, setShowOrdertrack] = useState(false);
  const [returns, setReturns] = useState("");
  const [showReturns, setShowReturns] = useState(false);
  const [policy, setPolicy] = useState("");
  const [showPolicy, setShowPolicy] = useState(false);
  const [sizeGuide, setSizeGuide] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [faq, setFaq] = useState("");
  const [showFaq, setShowFaq] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    numericCode: "",
    number: "",
    countryCode: returnCorrectCode("+1"),
  });
  const [usefulKey1, setUserfulKey1] = useState("");
  const [usefulValue1, setUserfulValue1] = useState("");
  const [showUsefulValue1, setShowUsefulValue1] = useState(false);
  const [usefulKey2, setUserfulKey2] = useState("");
  const [usefulValue2, setUserfulValue2] = useState("");
  const [showUsefulValue2, setShowUsefulValue2] = useState(false);
  const [usefulKey3, setUserfulKey3] = useState("");
  const [usefulValue3, setUserfulValue3] = useState("");
  const [showUsefulValue3, setShowUsefulValue3] = useState(false);
  const [usefulKey4, setUserfulKey4] = useState("");
  const [usefulValue4, setUserfulValue4] = useState("");
  const [showUsefulValue4, setShowUsefulValue4] = useState(false);
  const [duplicatePopup, setDuplicatePopup] = useState(false);
  const [uniqueValue, setUniqueValue] = useState("");
  const [openQr, setOpenQr] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [uniqueName, setUniqueName] = useState("");
  const [uniqueCode, setUniqueCode] = useState("");
  const [scrollTrigger, setScrollTrigger] = useState(false);
  const treeData = {
    name: "Parent",
    children: [
      {
        name: "Child One",
      },
      {
        name: "Child Two",
      },
    ],
  };

  const [selectedPartnerName, setSelectedPartnerName] = useState("");
  const [selectedPrimaryEmail, setSelectedPrimaryEmail] = useState("");
  const [selectedPrimaryName, setSelectedPrimaryName] = useState("");
  const [selectedAlternateName, setSelectedAlternateName] = useState("");
  const [selectedAlternateEmail, setSelectedAlternateEmail] = useState("");
  const [selectedRelation, setSelectedRelation] = useState("");
  const [viewVisual, setViewVisual] = useState(false);
  const [supplyTreeData, setSupplyTreeData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");

  let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"));
  let BuyerProfileDetails = BusinessDetails?.buyerprofiles;
  let chainCode = BusinessDetails?.businessRefCode;
  console.log(BuyerProfileDetails, "buyerdetails");
  let emailId = localStorage.getItem("email");
  let businessCode = BusinessDetails?.businessCode;
  let businessName = BusinessDetails?.name;
  let oldbusinessName = BusinessDetails?.oldName;
  let oldBusinessSlugName = BusinessDetails?.oldBusinessSlugName;
  let businessSlugName = BusinessDetails?.businessSlugName;
  let ownerAcknowledgement = BusinessDetails?.ownerAcknowledgement;
  let businessId = BusinessDetails?._id;

  const router = useRouter();

  const handleShowStartAgainModal = (val) => {
    setShowStartAgainModal({ val: true, type: val });
  };

  const handleKeyDown = (e) => {
    if (e?.key == "Enter")
      handleSaveSettings({ displaySlug }).catch((err) => console.log(err));
  };

  const handleImage = (selectedImage) => {
    const updatedPreview = previews.filter((item) => item !== selectedImage);
    setPreviews(updatedPreview);
  };

  const handleSwitch = () => {
    setChainSwitch((prev) => !prev);
    // console.log(eventSwitch, "switch")
    // if (!eventSwitch) {
    //   getEventDetails()
    // }
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

  async function urlToFile(url, fileName) {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  }

  // const { refetchBusiness, setRefetchBusiness } = useMyContext();

  // useEffect(() => {
  //     if (inputSlugSelected) slugInputRef.current.focus();
  // }, [inputSlugSelected]);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleMakePublic = (value) => {
    if (displaySlug === false)
      setSustainabilityActionStates({
        ...sustainabilityActionStates,
        slugStatusChangedToTrue: true,
      });
    setDisplaySlug((prev) => !prev);
  };

  const handleSelect = async (e) => {
    setSelectedCurrency(e?.target?.value);
  };

  const handleContactChange = (e) => {
    setContact(e.target.value);
  };

  const handleSingleProduct = async (productId) => {
    let theimagefiles = [];
    let eachPartnerDetail = await getSinglePartnerDetails(productId);
    // console.log(getProductDetail , "single-product")
    if (eachPartnerDetail.status === 200) {
      setShowSingleProduct(true);
      console.log(eachPartnerDetail.data.data, "single-product");
      let singlePartner = eachPartnerDetail.data.data;
      setSelectedPartnerName(singlePartner?.businessName);
      setSelectedPrimaryEmail(singlePartner?.primaryEmail);
      setSelectedPrimaryName(singlePartner?.primaryName);
      setSelectedAlternateName(singlePartner?.alternateName);
      setSelectedAlternateEmail(singlePartner?.alternateEmail);
      setSelectedRelation(singlePartner?.relationship);
    } else {
      addToast("something went wrong", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const handleDeleteProduct = async () => {
    console.log(deleteChainId, "theId");
    let deleteProduct = await deleteSupplyChain(deleteChainId);
    console.log(deleteProduct.data, "abcd");
    if (deleteProduct.data.success) {
      setConfirmDelete(false);
      setRefreshList(true);
      return addToast(`Business has been deleted successfully`, {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      return addToast(deleteProduct.data.message || `Something went wrong`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const isValuePresent = async (value) => {
    try {
      let slugCheck = await businessProductSlugCheck(value);
      console.log(constSlug + "/" + newSlug, slugCheck, "slug-check");
      return slugCheck.data.productPageSlug;
    } catch (error) {
      console.error("Error fetching data from API:", error);
      return false;
    }
  };

  const isNamePresent = async (value) => {
    try {
      let nameCheck = await businessProductNameCheck(value);
      return nameCheck.data.productName;
    } catch (error) {
      console.error("Error fetching data from API:", error);
      return false;
    }
  };

  const isCodePresent = async (value) => {
    try {
      let codeCheck = await businessProductCodeCheck(value);
      return codeCheck.data.productCode;
    } catch (error) {
      console.error("Error fetching data from API:", error);
      return false;
    }
  };

  const handleSaveSettings = async ({ displaySlug, pageStatus }) => {
    // if(productSlug === "default"){
    //     return addToast(`Product Page Name cannot be ${businessCode}-default`, {
    //         appearance: "error",
    //         autoDismiss: true,
    //     });
    // }
    // return console.log(displaySlug, pageStatus, "settings-page")
    let currencySymbol;
    if (selectedCurrency === "USD") {
      currencySymbol = "USD $";
    } else if (selectedCurrency === "CAD") {
      currencySymbol = "CAD $";
    } else if (selectedCurrency === "INR") {
      currencySymbol = "INR ₹";
    } else if (selectedCurrency === "GBP") {
      currencySymbol = "GBP £";
    } else if (selectedCurrency === "EUR") {
      currencySymbol = "EUR €";
    } else if (selectedCurrency === "JPY") {
      currencySymbol = "JPY ¥";
    } else {
      currencySymbol = "CNY ¥";
    }
    const urlRegex = /https:\/\//;
    const numRegex = /^\d+$/;
    console.log(newSlug, initSlug, "slugg");
    if (initSlug !== newSlug) {
      let slugCheck = await businessProductSlugCheck(
        constSlug + "/" + initSlug
      );
      console.log(constSlug + "/" + initSlug, slugCheck, "slug-check");
      if (!slugCheck.data.productPageSlug) {
        return addToast(`Product Page had already been taken`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
    if (initSlug === "default") {
      return addToast(`Product Page Name cannot be ${constSlug}/default`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (!productName) {
      return addToast(`Product Name is required`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (!productCode) {
      return addToast(`Product Code is required`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (!productCategory) {
      return addToast(`Product Category is required`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (!productSubCategory) {
      return addToast(`Product Sub Category is required`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (!productTag) {
      return addToast(`Product Tag is required`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (certData.length == 0) {
      return addToast(`Please add atleast one certificate"`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (chainData.length == 0) {
      return addToast(`Please add atleast one chain of custody"`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (certLink1) {
      if (!urlRegex.test(certLink1)) {
        return addToast(`Certificate Links should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
    if (certLink2) {
      if (!urlRegex.test(certLink2)) {
        return addToast(`Certificate Links should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
    if (certLink3) {
      if (!urlRegex.test(certLink3)) {
        return addToast(`Certificate Links should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
    if (certLink4) {
      if (!urlRegex.test(certLink4)) {
        return addToast(`Certificate Links should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
    if (aboutLink) {
      if (!urlRegex.test(aboutLink)) {
        return addToast(`About Us should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }

    if (contact) {
      if (!urlRegex.test(contact)) {
        return addToast(`Contact should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }

    if (address) {
      if (!urlRegex.test(address)) {
        return addToast(`Address should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }

    if (faq) {
      if (!urlRegex.test(faq)) {
        return addToast(`FAQ should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }

    if (usefulValue1) {
      if (!urlRegex.test(usefulValue1)) {
        return addToast(`useful link should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }

    if (usefulValue2) {
      if (!urlRegex.test(usefulValue2)) {
        return addToast(`useful link should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }

    if (usefulValue3) {
      if (!urlRegex.test(usefulValue3)) {
        return addToast(`useful link should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }

    if (usefulValue4) {
      if (!urlRegex.test(usefulValue4)) {
        return addToast(`useful link should have "https://"`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }

    if (previews.length === 0) {
      return addToast(`please upload atleast one product image"`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    // if (carbonEmission) {
    //     if (!numRegex.test(carbonEmission)) {
    //         return addToast(`CO2 Emission should be a number`, {
    //             appearance: "error",
    //             autoDismiss: true,
    //         });
    //     }
    // }
    // if (consumption) {
    //     if (!numRegex.test(consumption)) {
    //         return addToast(`Energy Consumption should be a number"`, {
    //             appearance: "error",
    //             autoDismiss: true,
    //         });
    //     }
    // }
    // if (waterUsage) {
    //     if (!numRegex.test(waterUsage)) {
    //         return addToast(`Water Usage should be a number"`, {
    //             appearance: "error",
    //             autoDismiss: true,
    //         });
    //     }
    // }
    // if (recycledMaterial) {
    //     if (!numRegex.test(recycledMaterial)) {
    //         return addToast(`Recycled Material should be a number"`, {
    //             appearance: "error",
    //             autoDismiss: true,
    //         });
    //     }
    // }
    // if (upcycledMaterial) {
    //     if (!numRegex.test(upcycledMaterial)) {
    //         return addToast(`Upcycled Material should be a number"`, {
    //             appearance: "error",
    //             autoDismiss: true,
    //         });
    //     }
    // }
    const validationResult = runValidation();
    console.log(validationResult, "validation");
    // if (!validationResult?.result) return;
    // setAPIOperationsState({ ...apiOperationsStates, saveInProgress: true });

    // if (!runFromPopup && sustainabilityActionStates?.slugStatusChangedToTrue) {
    //     return handleShowStartAgainModal("SAVE_PUBLISH");
    // }
    // await promisedSetState(setDisplaySlug, displaySlug);

    // handleSaveSettingsToAPI({ slug: initSlug, displaySlug, runFromPopup });
    // let body = {
    //     productSlug,
    //     productCode,
    //     productHeading,
    //     productDescription,
    //     aboutUs,
    //     selectedCountry,
    //     image,
    //     themeSelected,
    //     name,
    //     showName,
    //     phone,
    //     showPhone,
    //     email,
    //     showEmail,
    //     twitter,
    //     showTwitter,
    //     linkedin,
    //     showLinkedin,
    //     instagram,
    //     showInstagram,
    //     facebook,
    //     showFacebook
    // }
    // console.log(body , "productfields")
    console.log(previews, "imagesss");
    console.log(phone, "phone");

    const dataForm = new FormData();
    // let randomWholeNum = Math.floor(Math.random() * 1001);
    // dataForm.append("id", randomWholeNum);
    let slug = constSlug + "/" + initSlug;
    dataForm.append("country", selectedCountry);
    dataForm.append("aboutUs", aboutUs);

    if (phone && phone !== `+${phoneInfo?.numericCode}` && phone.length > 2) {
      const phoneDetails = returnPhoneDetails(phoneInfo);
      dataForm.append("number", phoneDetails?.number);
      dataForm.append("countryCode", `${phoneDetails?.countryCode}`);
      dataForm.append("numericCode", `+${phoneDetails?.numericCode}`);
    }
    // dataForm.append("productCode", productCode);
    dataForm.append("title", title);
    dataForm.append("name", name);
    dataForm.append("shortDescription", title);
    dataForm.append("status", displaySlug);
    dataForm.append("longDescription", description);
    dataForm.append("description", description);
    dataForm.append("selectedCountry", selectedCountry);
    // dataForm.append("formalName", productName);
    // dataForm.append("productCode", productCode);
    dataForm.append("Category", productCategory);
    dataForm.append("subCategory", productSubCategory);
    dataForm.append("themeSelected", themeSelected);
    function hasAllEmptyProperties(obj) {
      return Object.values(obj).every((value) => value === "");
    }
    chainData = chainData.filter((obj) => !hasAllEmptyProperties(obj));
    for (let i = 0; i < chainData.length; i++) {
      dataForm.append(
        `custodyChain[${i}][custodyType]`,
        chainData[i].custodyType
      );
      dataForm.append(`custodyChain[${i}][date]`, chainData[i].date);
      dataForm.append(`custodyChain[${i}][address]`, chainData[i].address);
      dataForm.append(
        `custodyChain[${i}][linkName]`,
        chainData[i].linkName ? chainData[i].linkName : "Transaction Cert"
      );
      dataForm.append(`custodyChain[${i}][link]`, chainData[i].link);
    }
    for (let i = 0; i < previews.length; i++) {
      dataForm.append(`productImages[${i}]`, previews[i]);
    }
    dataForm.append(`companyLogo`, imageLogo);
    dataForm.append(`keyPoints[0]`, highlight1);
    dataForm.append(`keyPoints[1]`, highlight2);
    dataForm.append(`keyPoints[2]`, highlight3);
    dataForm.append(`keyPoints[3]`, highlight4);
    dataForm.append(`authorSign`, signature);
    dataForm.append(`traceability`, businessPage);
    dataForm.append(`showTraceability`, showBusinessPage);
    // certName1 ? dataForm.append(`docLinks[0][name]`, certName1) : "";
    // certLink1 ? dataForm.append(`docLinks[0][link]`, certLink1) : "";
    // certName2 ? dataForm.append(`docLinks[1][name]`, certName2) : "";
    // certLink2 ? dataForm.append(`docLinks[1][link]`, certLink2) : "";
    // certName3 ? dataForm.append(`docLinks[2][name]`, certName3) : ""
    // certLink3 ? dataForm.append(`docLinks[2][link]`, certLink3) : ""
    // certName4 ? dataForm.append(`docLinks[3][name]`, certName4) : ""
    // certLink4 ? dataForm.append(`docLinks[3][link]`, certLink4) : ""
    certData = certData.filter((obj) => !hasAllEmptyProperties(obj));
    for (let i = 0; i < certData.length; i++) {
      dataForm.append(`docLinks[${i}][name]`, certData[i].name);
      dataForm.append(`docLinks[${i}][link]`, certData[i].link);
    }
    // for (let i = 0; i < files.length; i++) {
    //     dataForm.append(`images`, files[i]);
    // }
    // for (let i = 0; i < previews.length; i++) {
    //     dataForm.append(`images`, previews[i]);
    // }
    // dataForm.append("image", previews);
    dataForm.append("showName", showName);
    dataForm.append("email", email);
    dataForm.append("tag", productTag);
    dataForm.append("colorPaletteCode", colorPalette);
    dataForm.append("price", productPrice);
    dataForm.append("currencySymbol", currencySymbol);
    dataForm.append("showEmail", showEmail);
    dataForm.append("showPhone", showPhone);
    dataForm.append("twitter", twitter);
    dataForm.append("showTwitter", showTwitter);
    dataForm.append("facebook", facebook);
    dataForm.append("showFacebook", showFacebook);
    dataForm.append("linkedin", linkedin);
    dataForm.append("showLinkedin", showLinkedin);
    dataForm.append("instagram", instagram);
    dataForm.append("showInstagram", showInstagram);
    dataForm.append("isPublic", displaySlug);
    dataForm.append("co2Emission", carbonEmission);
    dataForm.append("powerConsuption", consumption);
    dataForm.append("waterConsuption", waterUsage);
    dataForm.append("recycleMaterial", recycledMaterial);
    dataForm.append("upcycleMaterial", upcycledMaterial);
    dataForm.append("showCo2Emission", showEmission);
    dataForm.append("showPowerConsuption", showConsumption);
    dataForm.append("showWaterConsuption", showWaterUsage);
    dataForm.append("showRecycleMaterial", showRecycledMaterial);
    dataForm.append("showUpcycleMaterial", showUpcycledMaterial);
    dataForm.append("aboutField", aboutLink);
    dataForm.append("showAboutField", showAboutLink);
    dataForm.append("contact", contact);
    dataForm.append("showContact", showContact);
    dataForm.append("faq", faq);
    dataForm.append("showFaq", showFaq);
    dataForm.append("businessUrl", address);
    dataForm.append("showBusinessUrl", showAddress);
    dataForm.append("usefullKey1", usefulKey1);
    dataForm.append("usefullVal1", usefulValue1);
    dataForm.append("showUsefullKey1", showUsefulValue1);
    dataForm.append("usefullKey2", usefulKey2);
    dataForm.append("usefullVal2", usefulValue2);
    dataForm.append("showUsefullKey2", showUsefulValue2);
    dataForm.append("usefullKey3", usefulKey3);
    dataForm.append("usefullVal3", usefulValue3);
    dataForm.append("showUsefullKey3", showUsefulValue3);
    dataForm.append("usefullKey4", usefulKey4);
    dataForm.append("usefullVal4", usefulValue4);
    dataForm.append("showUsefullKey4", showUsefulValue4);
    if (pageStatus === "duplicatepage") {
      let slugCheck = await businessProductSlugCheck(constSlug + "/" + newSlug);
      // console.log(constSlug + "/" + newSlug, slugCheck, "slug-check")
      if (!slugCheck.data.productPageSlug) {
        let baseValue = constSlug + "/" + newSlug;
        let currentValue = baseValue;
        let counter = 1;
        while ((await isValuePresent(currentValue)) === false) {
          currentValue = `${baseValue}${counter}`;
          counter++;
        }

        setUniqueValue(currentValue);
        dataForm.append("businessSlugName", constSlug);
        dataForm.append("slug", currentValue.split("/")[1]);
      } else {
        dataForm.append("businessSlugName", constSlug);
        dataForm.append("slug", newSlug);
      }

      let nameCheck = await businessProductNameCheck(productName);
      if (!nameCheck.data.productName) {
        let baseName = productName;
        let currentName = baseName;
        let counter = 1;
        while ((await isNamePresent(currentName)) === false) {
          currentName = `${baseName}${counter}`;
          counter++;
        }

        setUniqueName(currentName);
        dataForm.append("formalName", currentName);
      } else {
        dataForm.append("formalName", productName);
      }

      let codeCheck = await businessProductCodeCheck(productCode);
      if (!codeCheck.data.productCode) {
        let baseCode = productCode;
        let currentCode = baseCode;
        let counter = 1;
        while ((await isCodePresent(currentCode)) === false) {
          currentCode = `${baseCode}${counter}`;
          counter++;
        }

        setUniqueCode(currentCode);
        dataForm.append("productCode", currentCode);
      } else {
        dataForm.append("productCode", productCode);
      }

      let addEventToBusiness = await addBusinessProduct(dataForm);
      if (addEventToBusiness.data.success) {
        setEditDisabled(true);
        setShowSingleProduct(false);
        setRefreshList(true);
        addToast("DPP page has been duplicated", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast(addEventToBusiness.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      if (initSlug === newSlug) {
        dataForm.append("businessSlugName", constSlug);
        dataForm.append("slug", newSlug);
      } else {
        // let theNewSlug = constSlug + "/" + newSlug
        dataForm.append("businessSlugName", constSlug);
        dataForm.append("slug", newSlug);
        dataForm.append("newSlug", initSlug);
      }
      dataForm.append("productCode", productCode);
      dataForm.append("formalName", productName);
      let editProductToBusiness = await editBusinessProductPage(
        dataForm,
        singleProduct?.businessProductId
      );
      console.log(editProductToBusiness);
      if (editProductToBusiness.data.success) {
        setEditDisabled(true);
        setShowSingleProduct(false);
        setRefreshList(true);
        addToast("DPP page with the given name has been updated", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast(editProductToBusiness.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  let userJoinSVG = (
    <span
      className="circle-icon--header"
      style={{ fontWeight: "bold", backgroundColor: "green" }}
    >
      <IoIosCheckmark />
    </span>
  );

  const clearToSystemDefaultsFunc = (message) => {
    setProductCode("");
    setDescription(
      "We are reducing our greenhouse gas emissions everyday by wasting less, buying green, saving energy and by being conscientious consumers. But we can make only limited lifestyle changes. For our remaining emissions, we are buying carbon offsets to have a zero emission footprint. Each carbon offset we purchase goes into certified projects like planting new trees, reforestation, methane sequestration, ocean cleanup, and other such initiatives that help combat climate change today. We decided not to wait and do something today."
    );
    setAboutUs(
      "This is a paragraph about us. We are a family of five, living in Miami, Florida We are interested in playing our part in saving the environment and our planet. Living in a city that is on the front line of climate change gives us a front row-seat to the impending loom. Often during high tides or occasional torrential rains, we are inundated with a flooded downtown where spotting a fish is commonplace. We are not waiting for 2030 or 2050 for NetZero. Yes the government and businesses have to play their part, but we as individuals can make a much bigger difference. If you can spread the word, that now there is a way, we have a chance.The world you and I have inherited is not just ours, but we are mere beneficiaries of its wonders. It is our responsibility to take care of it so that we can pass it on to our future."
    );
    setPreviews([]);
    setProductName("");
    setProductCategory("");
    setProductSubCategory("");
    setProductTag("");
    setProductPrice("");
    setName(businessName);
    setPhone(
      userData?.billingAddress?.phone?.numericCode ||
        "1" + userData?.billingAddress?.phone?.number ||
        "1234567890"
    );
    setPhoneInfo({
      numericCode: userData?.billingAddress?.phone?.numericCode || "1",
      number: userData?.billingAddress?.phone?.number || "1234567890",
      countryCode: returnCorrectCode(
        userData?.billingAddress?.phone?.countryCode || "USA"
      ),
    });

    setEmail(userData?.user?.email);
    setImage("");

    setSelectedCountry(
      countryNameToISO3(userData?.billingAddress?.country || "India")
    );
    setPreviews([]);
    setImageLogo("");
    setShowName(false); // need to do it after the field is added
    setShowEmail(false);
    setTwitter("");
    setLinkedIn("");
    setFacebook("");
    setInstagram("");
    setShowPhone(false);
    setShowTwitter(false);
    setShowLinkedin(false);
    setShowInstagram(false);
    setShowFacebook(false);
    setStartDataFetched(true);
    setDisplaySlug(false);
    setThemeSelected("white");
    setCarbonEmission("");
    setConsumption("");
    setWaterUsage("");
    setRecycledMaterial("");
    setUpcycledMaterial("");
    setShowEmission(false);
    setShowConsumption(false);
    setShowWaterUsage(false);
    setShowRecycledMaterial(false);
    setShowUpcycledMaterial(false);
    setEditDisabled(true);
    setUserfulKey1("");
    setUserfulValue1("");
    setShowUsefulValue1(false);
    setUserfulKey2("");
    setUserfulValue2("");
    setShowUsefulValue2(false);
    setUserfulKey3("");
    setUserfulValue3("");
    setShowUsefulValue3(false);
    setUserfulKey4("");
    setUserfulValue4("");
    setShowUsefulValue4(false);
    setShowBusinessPage(false);
    console.log(message, "aaaaddd");
  };

  const handleBusinessSlugName = async (field) => {
    let formData = new FormData();
    formData.set("ownerAcknowledgement", true);
    if ((field = "yes")) {
      await keepUpdatedBusiness(formData, businessId)
        .then((response) => {
          if (response.status === 200) {
            addToast("business name updation confirmed", {
              appearance: "success",
              autoDismiss: true,
            });
            setTimeout(() => {
              window.location.reload();
            }, 100);
          } else {
            addToast(
              response?.data?.message || "Failed to update business profile",
              {
                appearance: "error",
                autoDismiss: true,
              }
            );
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      let body = {
        businessSlugName: oldBusinessSlugName,
        name: field == oldbusinessName,
        ownerAcknowledgement: true,
      };
      await slugChange(body, businessId)
        .then((response) => {
          if (response.status === 200) {
            addToast("business name reverted back", {
              appearance: "success",
              autoDismiss: true,
            });
            setTimeout(() => {
              window.location.reload();
            }, 100);
          } else {
            addToast(
              response?.data?.message || "Failed to update business profile",
              {
                appearance: "error",
                autoDismiss: true,
              }
            );
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  let doughnutData = {
    labels: [
      "CO2 Emission",
      "Energy Consumption",
      "Water Usage",
      "Recycled Material",
      "Upcycled Material",
    ],
    // displayText: ['venue ', 'travel', 'food & snacks', 'lodging', 'waste', "sales & marketing"],
    datasets: [
      {
        data: [
          totalEmissions,
          totalPowerConsumption,
          totalWaterConsumption,
          totalRecycledMaterial,
          totalUpcycleddMaterial,
        ],
        backgroundColor: [
          "rgba(228 , 231, 246, 1)",
          "rgba(189 , 232, 239, 1)",
          "rgba(117 , 177, 120, 0.5)",
          "rgba(236 , 155, 170, 0.5)",
          "rgba(236 , 155, 170, 0.5)",
        ],
      },
    ],
  };

  let countryCode;

  useEffect(() => {
    userCountry.code &&
      countryList.length > 0 &&
      handleSelectCountry_1({ target: { value: userCountry.code } });
  }, [countryList, userCountry]);

  let limit = 10;
  const pageRangeDisplayed = 5;

  let Yearlylimit = 15;
  const pageYearlyRangeDisplayed = 5;

  const handlePageChange = (pageNumber) => {
    console.log(`Active page is ${pageNumber}`);
    setActivePage(pageNumber);
  };

  const checkFieldValidation = (name, type) => {
    const validationObject = {};
    validationObject["type"] = type;
    validationObject["name"] = name;
    validationObject["error"] = true;
    return validationObject;
  };

  const toggleButton = (setValue, data, fieldName) => {
    setValue((prev) => {
      if (prev === true) return false;
      if (!data) {
        const validatedObject = checkFieldValidation(
          fieldName,
          INVALID_CONTACT_FIELD
        );
        const localValidationObject = {};
        localValidationObject[fieldName] = validatedObject;
        setValidationErrors({ ...validationErrors, ...localValidationObject });
        console.log("here is validation errors", validationErrors);
        return false;
      }
      const validationResult = runValidation();

      if (!validationResult?.values[fieldName]?.error) return true;
      return false;
    });
  };

  function checkHttpUrl(string) {
    let givenURL;

    try {
      givenURL = new URL(string);
    } catch (error) {
      console.log("Invalid URL");
      return false;
    }

    return givenURL.protocol === "http:" || givenURL.protocol === "https:";
  }

  const generateInvalidMessage = ({ name, type, quote }) => {
    if (name === "slug" && type === INVALID_SLUG_REGEX_MATCH) {
      return "The URL can only contain letters and numbers";
    }

    if (name === "slug" && type === INVALID_INPUT_HIGH_CHAR) {
      return "The URL cannot have more than 12 characters";
    }

    if (name === "productName" && type === INVALID_INPUT_HIGH_CHAR) {
      return "Name cannot be empty";
    }

    if (name === "emission" && type === INVALID_CONTACT_FIELD) {
      return "CO2 Emissions cannot be empty";
    }

    if (name === "consumption" && type === INVALID_CONTACT_FIELD) {
      return "Energy consumption cannot be empty";
    }

    if (name === "waterUsage" && type === INVALID_CONTACT_FIELD) {
      return "Water usage cannot be empty";
    }

    if (name === "recycledMaterial" && type === INVALID_CONTACT_FIELD) {
      return "Recycled Material cannot be empty";
    }

    if (name === "upcycledMaterial" && type === INVALID_CONTACT_FIELD) {
      return "Upcycled material cannot be empty";
    }

    if (name === "businessPage" && type === INVALID_INPUT_HIGH_CHAR) {
      return "Business Page cannot be empty";
    }

    if (type === INVALID_CONTACT_FIELD && name === "aboutLink") {
      return `About Us cannot be empty`;
    }

    if (
      (name === "usefulValue1" ||
        name === "usefulValue2" ||
        name === "usefulValue3" ||
        name === "usefulValue4") &&
      type === INVALID_CONTACT_FIELD
    ) {
      return "Name and Value Cannot be empty";
    }

    let textName;
    if (name === "aboutUs") textName = "About Us";
    else textName = name[0]?.toUpperCase() + name?.substring(1);

    if (type === INVALID_INPUT_LOW_CHAR) {
      return `${quote ? `'${textName}'` : textName} must have at least ${
        validationItemOnLength[name]?.min
      } characters`;
    }

    if (type === INVALID_INPUT_HIGH_CHAR) {
      return `${quote ? `'${textName}'` : textName} cannot have more than ${
        validationItemOnLength[name]?.max
      } characters`;
    }

    if (
      type === INVALID_CONTACT_FIELD &&
      (name === "name" || name === "Phone Number")
    ) {
      return `Please enter a valid ${textName} `;
    }

    if (type === INVALID_CONTACT_FIELD) {
      return `Please enter a valid ${textName}`;
    }
  };

  const runValidation = () => {
    const validationObject = {};
    const alphaRegex = /^[A-Za-z\s]*$/;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validationItems = [title, description, aboutUs, name];
    const validationItemsName = [
      "title",
      "description",
      "aboutUs",
      "name",
      "phone",
    ];

    // validationOfSlug(validationObject, initSlug);

    if (phone) {
      const phoneValidationResults = validatePhoneNumber(phone);
      if (!phoneValidationResults) {
        setShowPhone(false);
        validationObject["phone"] = {
          error: true,
          name: "Phone Number",
          type: INVALID_CONTACT_FIELD,
        };
      }
    }

    for (let i = 0; i < validationItems.length; i++) {
      let item;
      const validationItem = validationItems[i];
      const validationName = validationItemsName[i];

      if (validationItem.length < validationItemOnLength[validationName]?.min) {
        item = checkFieldValidation(validationName, INVALID_INPUT_LOW_CHAR);
      } else if (
        validationItem.length > validationItemOnLength[validationName]?.max
      ) {
        item = checkFieldValidation(validationName, INVALID_INPUT_HIGH_CHAR);
      }
      if (item) validationObject[validationName] = item;
    }

    if (!name && validationObject?.name?.error) {
      delete validationObject?.name;
    }

    if (validationObject?.name?.error) {
      setShowName(false);
    }
    if (!validationObject?.name && name && !name.match(alphaRegex)) {
      setShowName(false);
      validationObject["name"] = {
        error: true,
        name: "name",
        type: INVALID_CONTACT_FIELD,
      };
    }
    if (!selectedCountry) {
      validationObject["country"] = {
        error: true,
        name: "country",
        type: INVALID_FIELD_EMPTY,
      };
    }

    if (email && !email.match(emailRegex)) {
      setShowEmail(false);
      validationObject["email"] = {
        error: true,
        name: "email",
        type: INVALID_CONTACT_FIELD,
      };
    }
    if (twitter && (!twitter.includes("x.com") || !checkHttpUrl(twitter))) {
      setShowTwitter(false);
      validationObject["twitter"] = {
        error: true,
        name: "twitter",
        type: INVALID_CONTACT_FIELD,
      };
    }
    if (
      linkedin &&
      (!linkedin.includes("linkedin.com") || !checkHttpUrl(linkedin))
    ) {
      setShowLinkedin(false);
      validationObject["linkedin"] = {
        error: true,
        name: "linkedin",
        type: INVALID_CONTACT_FIELD,
      };
    }
    if (
      instagram &&
      (!instagram.includes("instagram.com") || !checkHttpUrl(instagram))
    ) {
      setShowInstagram(false);

      validationObject["instagram"] = {
        error: true,
        name: "instagram",
        type: INVALID_CONTACT_FIELD,
      };
    }
    if (
      facebook &&
      (!facebook.includes("facebook.com") || !checkHttpUrl(facebook))
    ) {
      setShowFacebook(false);
      validationObject["facebook"] = {
        error: true,
        name: "facebook",
        type: INVALID_CONTACT_FIELD,
      };
    }

    setValidationErrors(validationObject);

    if (Object.values(validationObject).length > 0) {
      return { result: false, values: validationObject };
    }
    return { result: true, values: validationObject };
  };

  const convertStringToBoolean = (string, itemName = "Not Required") => {
    if (!string || !string === "true" || !string === "false") {
      return false;
    }

    const item = JSON.parse(string);

    return item;
  };

  const convertISOToDate = (isoString) => {
    // Create a new Date object from the ISO string
    var date = new Date(isoString);

    // Get the day, month, and year
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    // Return the formatted date
    return year + "-" + month + "-" + day;
  };

  const getBusinessProducts = async () => {
    let theProducts = await getBusinessProduct();
    if (theProducts.data.success) {
      setAllProducts(theProducts.data.data);
      setTotalCount(theProducts.data.metadata.count);
      setTotalEmissions(
        theProducts.data.sumValue
          ? theProducts.data.sumValue?.total_co2Emission
          : "0"
      );
      setTotalPowerConsumption(
        theProducts.data.sumValue
          ? theProducts.data.sumValue?.total_powerConsuption
          : "0"
      );
      setTotalWaterConsumption(
        theProducts.data.sumValue
          ? theProducts.data.sumValue?.total_waterConsuption
          : "0"
      );
      setTotalRecycledMaterial(
        theProducts.data.sumValue
          ? theProducts.data.sumValue?.total_recycleMaterial
          : "0"
      );
      setTotalUpcycledMaterial(
        theProducts.data.sumValue
          ? theProducts.data.sumValue?.total_upcycleMaterial
          : "0"
      );
      let count = 0;
      theProducts.data.data.forEach((item) => {
        console.log(item.isPublic, "isPublic");
        if (item.isPublic) {
          count = count + 1;
        }
      });
      setPublishCount(count);
    }
  };

  const getPartnerData = async () => {
    let partnerCode = chainSwitch ? "distributor" : "supplier";
    let acceptanceCode;
    let requestedCode;
    if (selectedTab === "sent") {
      acceptanceCode = "pending";
    }
    if (selectedTab === "received") {
      requestedCode = "true";
    }
    let partnerData = await getPartnerDetails(
      partnerCode,
      acceptanceCode,
      requestedCode
    );
    console.log(partnerData, "partnerDetails");
    if (partnerData.data.success) {
      setPartnerDetails(partnerData.data.data);
    }
  };

  // Function to refresh pending requests data specifically
  const refreshPendingRequests = async () => {
    let partnerCode = chainSwitch ? "distributor" : "supplier";
    let acceptanceCode = "pending";
    let partnerData = await getPartnerDetails(
      partnerCode,
      acceptanceCode,
      undefined
    );
    console.log(partnerData, "refreshed partnerDetails");
    if (partnerData.data.success) {
      setPartnerDetails(partnerData.data.data);
    }
  };

  // Function to refresh all suppliers/distributors data
  const refreshAllSuppliers = async () => {
    let partnerCode = chainSwitch ? "distributor" : "supplier";
    let partnerData = await getPartnerDetails(
      partnerCode,
      undefined,
      undefined
    );
    console.log(partnerData, "refreshed all suppliers");
    if (partnerData.data.success) {
      setPartnerDetails(partnerData.data.data);
    }
  };

  // Function to refresh requests received data
  const refreshRequestsReceived = async () => {
    let partnerCode = chainSwitch ? "distributor" : "supplier";
    let requestedCode = "true";
    let partnerData = await getPartnerDetails(
      partnerCode,
      undefined,
      requestedCode
    );
    console.log(partnerData, "refreshed requests received");
    if (partnerData.data.success) {
      setPartnerDetails(partnerData.data.data);
    }
  };

  // Function to get the appropriate refresh function based on selected tab
  const getRefreshFunction = () => {
    switch (selectedTab) {
      case "sent":
        return refreshPendingRequests;
      case "received":
        return refreshRequestsReceived;
      case "all":
      default:
        return refreshAllSuppliers;
    }
  };

  // Function to get the appropriate button text based on selected tab
  const getRefreshButtonText = () => {
    switch (selectedTab) {
      case "sent":
        return "Refresh Pending Requests";
      case "received":
        return "Refresh Requests Received";
      case "all":
      default:
        return chainSwitch ? "Refresh All Distributors" : "Refresh All Suppliers";
    }
  };
  let visualdisplay = [];
  const supplyChainData = async () => {
    let supplyData = await getSupplyChain();
    if (supplyData.data.success) {
      console.log(supplyData.data.data, "supplyData");
      setSupplyTreeData(supplyData.data.data);
      visualdisplay.push({
        businessName: supplyData.data.data.businessData.name,
        primaryName: supplyData.data.data.businessData.buyerprofiles.ghgReduced,
        children: [
          ...supplyData.data.data.treeDataSupplier,
          ...supplyData.data.data.treeDataDistributor,
        ],
      });
      console.log(visualdisplay[0], "visual");
      setTheVisual(visualdisplay[0]);
    }
  };

  useEffect(() => {
    getPartnerData();
    supplyChainData();
    setRefreshList(false);
  }, [chainSwitch, refreshList, selectedTab]);

  useEffect(() => {
    getBusinessProducts();
    setRefreshList(false);
  }, [refreshList]);

  useEffect(() => {
    getCountryList();

    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        setUserCountry({
          name: res?.data ? res.data?.country_name : "India",
          code: res?.data ? res.data?.country_code_iso3 : "IND",
        });
        setInitalCode(res.data.country_code.toLowerCase());
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
    setSelectCountryRoom(
      Number(countryShortName.carbonCountryRoomStayPerCapita)
    );

    setShowCapitalCarbon(Number(countryShortName.carbonCountryPerCapita));
    setCapitalName(countryShortName.entity);
  };

  const handleSelectCountry = (e) => {
    console.log("theCode", e.target.value.toLocaleLowerCase());
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
    setSelectCountryRoom(
      Number(countryShortName.carbonCountryRoomStayPerCapita)
    );

    setShowCapitalCarbon(Number(countryShortName.carbonCountryPerCapita));
    setCapitalName(countryShortName.entity);
  };

  const options = {
    maintainAspectRatio: false, // This option maintains the chart's aspect ratio
    responsive: true,
    width: 300, // Custom width
    height: 300, // Custom height
    plugins: {
      legend: {
        display: true,
        position: "right",
        align: "center",
        labels: {
          fontColor: "black",
        },
      },
      legend: {
        position: "right",
        labels: {
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map(function (label, i) {
                const value = data.datasets[0].data[i];
                return {
                  text: label + ": " + value,
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

  // useEffect(() => {
  //     fetchData();
  // }, []);

  // const fetchData = async () => {
  //     BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
  //     businessCode = BusinessDetails?.businessCode
  //     const response = await axios.get(`/v1/business-events/stats/${businessCode}`);
  //     const { data } = response.data;
  //     console.log(data, "yearlydata")
  //     setGhgData(data);
  //     let ghgCount = 0;
  //     let userCount = 0;

  //     data.forEach(event => {
  //         console.log(event, "valueee")
  //         ghgCount += event?.totalAnnualghgReduced;
  //         userCount += event?.uniqueUserCount;
  //     });

  //     setTotalGHGDataCount(ghgCount);
  //     setTotalUserCount(userCount);
  // };

  // console.log(ghgData,"GHG DATA SET on variable")

  // function to get ghg reduced for particular event

  // function for the badges

  // modal for view details

  // const EventDetailsModal = ({ selectedEvent, closeModal }) => {
  //     return (
  //         <div className="change--email--wrapper" >
  //             <div className="table--popup">
  //                 <div className="table--form" style={{ width: "40vw", height: "50vh", marginTop: "-75px" }}>
  //                     <div className="popup--head">
  //                         <div className="popup--title">Event Details</div>
  //                         <button className="cart-overlay__close-icon"
  //                             onClick={() => {
  //                                 closeModal(false)
  //                                 setSelectedEvent("")
  //                             }}
  //                         ><IoIosClose /></div>
  //                     </div>
  //                     <hr />
  //                     <br />
  //                     <div className="popup--form">
  //                         <div className="select--title">Event Name</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.conferanceName}</div>
  //                     </div>
  //                     <div className="popup--form">
  //                         <div className="select--title">Event Code</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.conferanceCode}</div>
  //                     </div>
  //                     <div className="popup--form">
  //                         <div className="select--title">Event Location</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.location}</div>
  //                     </div>
  //                     <div className="popup--form">
  //                         <div className="select--title">Event Type</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.venueType}</div>
  //                     </div>
  //                     <hr />
  //                     <div className="popup--head">
  //                         <div className="popup--title">Carbon Calculations</div>
  //                     </div>
  //                     <hr />
  //                     <div className="popup--form">
  //                         <div className="select--title">Waste</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.carbonCalculations?.Waste}</div>
  //                     </div>
  //                     {/* <div className="popup--form">
  //           <div className="select--title">Estimated Carbon Emissions Per Exhibitor</div>
  //           <div>:</div>
  //           <div className="select--value">{selectedEvent?.carbonCalculations?.estimatedCarbonEmissionsPerExhibitor}</div>
  //         </div>
  //         <div className="popup--form">
  //           <div className="select--title">Estimated Carbon Emissions Per User</div>
  //           <div>:</div>
  //           <div className="select--value">{selectedEvent?.carbonCalculations?.estimatedCarbonEmissionsPerUser}</div>
  //         </div> */}
  //                     <div className="popup--form">
  //                         <div className="select--title">Food</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.carbonCalculations?.food}</div>
  //                     </div>
  //                     <div className="popup--form">
  //                         <div className="select--title">Lodging</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.carbonCalculations?.lodging}</div>
  //                     </div>
  //                     <div className="popup--form">
  //                         <div className="select--title">Sales Marketing</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.carbonCalculations?.salesMarketing}</div>
  //                     </div>
  //                     <div className="popup--form">
  //                         <div className="select--title">Travel</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.carbonCalculations?.travel}</div>
  //                     </div>
  //                     <div className="popup--form">
  //                         <div className="select--title">Venue Carbon Emission</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.carbonCalculations?.venueCarbonEmission}</div>
  //                     </div>
  //                     <div className="popup--form">
  //                         <div className="select--title">Total Emission</div>
  //                         <div>:</div>
  //                         <div className="select--value">{selectedEvent?.totalEmissions}</div>
  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //     );
  // };

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

  const handleSlugSummit = (e) => {
    if (!inputSlugSelected) return;
    console.log(e?.event?.relatedTarget?.name === "slug--main--element");
    if (e?.event?.relatedTarget?.name === "slug--main--element") return;
    if (
      e.key === "Enter" &&
      (sustainabilityActionStates?.slugAvailable === SLUG_AVAILABLE ||
        sustainabilityActionStates?.slugAvailable === SLUG_UNTOUCHED) &&
      !validationErrors?.slug?.error
    ) {
      setInputSlugSelected(false);
      setSustainabilityActionStates({
        ...sustainabilityActionStates,
        slugChanged: true,
        slugAvailable: SLUG_UNTOUCHED,
      });
    }
  };

  const handleSlugChange = async (value) => {
    //setCurrentSlug({ value: value.toLowerCase() });
    setInitSlug(value.toLowerCase());
    const validationObject = {};
    const validationErrorLocal = {};
    // validationOfSlug(validationObject, value);
    !validationObject?.slug?.error && delete validationErrors.slug;
    if (validationObject?.slug?.error)
      validationErrorLocal.slug = validationObject.slug;
    setValidationErrors(validationErrorLocal);
    if (validationObject?.slug?.error) return;
    // if (value && value !== fixedSlug) {
    //     const res = await checkBusinessSlug(value);
    //     setSustainabilityActionStates({
    //         ...sustainabilityActionStates,
    //         slugAvailable:
    //             res.data.userSlug == true ? SLUG_AVAILABLE : SLUG_UNAVAILABLE,
    //     });
    // }
  };

  useEffect(() => {
    if (profileRelatedData) {
      console.log(profileRelatedData, "ljkwhckjwlebdwed");
    }
  }, [profileRelatedData]);

  const downloadCode = (id) => {
    let displayName = !chainSwitch ? "Supplier Code: " : "Distributor Code: ";
    console.log(id, "idd");
    setDownloading(true);
    const canvas = document.getElementById(id);
    console.log(canvas, "canvass");
    if (canvas) {
      // Create a new canvas to combine QR code and text
      const combinedCanvas = document.createElement("canvas");
      const ctx = combinedCanvas.getContext("2d");

      // Set the dimensions of the new canvas
      const qrCodeWidth = canvas.width;
      const qrCodeHeight = canvas.height;
      const textHeight = 50; // Height for the text
      combinedCanvas.width = qrCodeWidth;
      combinedCanvas.height = qrCodeHeight + textHeight;

      // Draw the QR code on the new canvas
      ctx.drawImage(canvas, 0, 0, qrCodeWidth, qrCodeHeight);

      // Draw a white background for the text
      ctx.fillStyle = "#FFFFFF"; // White background
      ctx.fillRect(0, qrCodeHeight, qrCodeWidth, textHeight); // Rectangle covering the text area

      // Draw the text below the QR code
      const fontFamily = "Work Sans"; // Add your desired font family
      const fontSize = 13;
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = "#000000"; // Set the text color
      ctx.textAlign = "center"; // Center the text horizontally
      ctx.fillText(displayName + chainCode, qrCodeWidth / 2, qrCodeHeight + 35); // Adjust the y-coordinate as needed

      // Convert the combined canvas to an image and trigger the download
      const pngUrl = combinedCanvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      console.log(pngUrl, "pngurll");
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

  const getDisplayDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const suffix = getOrdinalSuffix(day);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate.replace(/\d+/, `${day}`);
  };

  const getDisplayTime = (time) => {
    const dateObj = new Date(time);
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZone: "Asia/Kolkata",
    };
    const formattedTime = dateObj.toLocaleTimeString("en-US", timeOptions);
    return formattedTime;
  };

  const toPurchase = (item, eventCode, eventId) => {
    localStorage.setItem("conferenceCode", eventCode);
    localStorage.setItem("BusinessOrderSelection", "yes");
    localStorage.setItem("eventOwnerOrder", true);
    // localStorage.setItem("userEventId", eventId)
    console.log(eventId, "codee");
    item = Math.ceil(item);
    localStorage.setItem("carbonroute", "eventOffset");
    router.push({
      pathname: "/circular",
      query: { tons: item },
    });
  };

  let qrCodeField = !chainSwitch
    ? process.env.NEXT_PUBLIC_UI_URL + "?supplierCode=" + chainCode
    : process.env.NEXT_PUBLIC_UI_URL + "?distributorCode=" + chainCode;

  const handleCalculateCarbonTrans = (item, value) => {
    if (item === "eventType") {
      setEventType(value);
    }
    if (item === "eventStartDate") {
      console.log(value, "eventDate");
      if (value > eventEndDate) {
        setEventEndDate("");
      }
      setEventStartDate(value);
    }
    if (item === "eventEndDate") {
      setEventEndDate(value);
    }
    if (item === "peopleAttending") {
      setPeopleAttending(value);
    }
    if (item === "venueType") {
      setVenueType(value);
    }
    if (item === "peopleData") {
      setPeopleNum(value);
    }
    if (item === "isGroup") {
      setIsGroup(value);
    }
    if (item === "haveGroups") {
      setHaveGroups(value);
    }
    if (item === "selectedGroup") {
      setSelectedGroup(value);
    }
  };

  const handleAddChain = (e) => {
    e.preventDefault();
    if (chainData.length === 1) {
      setChainData([
        ...chainData,
        {
          custodyType: "Raw Materials",
          date: "2023-04-01",
          address: "Makati, Philippines",
          linkName: "Transaction Cert",
          link: "https://www.textileinfomedia.com/business/philippines/apparel-and-garments",
        },
      ]);
    } else if (chainData.length === 2) {
      setChainData([
        ...chainData,
        {
          custodyType: "Manufacturing",
          date: "2023-04-01",
          address: "Haining, China",
          linkName: "Transaction Cert",
          link: "https://mmsclothing.com/",
        },
      ]);
    } else if (chainData.length === 3) {
      setChainData([
        ...chainData,
        {
          custodyType: "Assembling & Packaging",
          date: "2024-04-01",
          address: "Haryana, India",
          linkName: "Transaction Cert",
          link: "https://www.smsindia.com/",
        },
      ]);
    } else if (chainData.length === 4) {
      setChainData([
        ...chainData,
        {
          custodyType: "Retail",
          date: "2025-04-01",
          address: "USA , Europe, Canada",
          linkName: "Transaction Cert",
          link: "https://www.amazon.com/b/ref=fs_xg_xgl_lp_surl?node=7141123011",
        },
      ]);
    } else {
      setChainData([
        ...chainData,
        { custodyType: "", date: "", address: "", linkName: "", link: "" },
      ]);
    }
    console.log(chainData, "newchain");
  };

  const handleChange = (index, event) => {
    const newChain = chainData.slice();
    newChain[index][event.target.name] = event.target.value;
    setChainData(newChain);
  };

  const handleDeleteChain = (e, index) => {
    e.preventDefault();
    const newChain = chainData.filter((_, i) => i !== index);
    setChainData(newChain);
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (certData.length === 1) {
      setCertData([
        ...certData,
        {
          name: "Fair Trade Certified™",
          link: "https://www.fairtradecertified.org/",
        },
      ]);
    } else if (certData.length === 2) {
      setCertData([
        ...certData,
        {
          name: "Global Organic Textile Standard",
          link: "https://global-standard.org/",
        },
      ]);
    } else {
      setCertData([...certData, { name: "", link: "" }]);
    }
  };

  const handleChangeCert = (index, event) => {
    const newCert = certData.slice();
    newCert[index][event.target.name] = event.target.value;
    setCertData(newCert);
  };

  const handleDeleteCert = (e, index) => {
    e.preventDefault();
    const newCert = certData.filter((_, i) => i !== index);
    setCertData(newCert);
  };

  let businessnamewarning = (
    <div
      style={{
        textAlign: "center",
        display: ownerAcknowledgement
          ? "none"
          : businessName === oldbusinessName
          ? "none"
          : "",
        color: "red",
      }}
    >
      <div style={{ fontSize: "15px" }}>
        You have recently changed business name from "{oldbusinessName}" to "
        {businessName}"
      </div>
      <div style={{ fontSize: "15px", color: "red" }}>
        Do you want to keep it ?
      </div>
      <br />
      <div className="sustainability--popup-button-holder">
        <button
          className="sustainability--edit-button sustainability-save"
          onClick={() => handleBusinessSlugName("yes")}
        >
          YES
        </button>
        <button
          className="sustainability--edit-button sustainability-start-again button--white"
          onClick={() => handleBusinessSlugName("no")}
        >
          NO
        </button>
      </div>
    </div>
  );

  function formatTimestampToGMT(timestamp) {
    const date = new Date(timestamp);

    // Options for formatting the date and time in GMT with AM/PM
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC",
    };

    // Format the date and time
    const formattedDate = date
      .toLocaleString("en-US", options)
      .replace("at ", "")
      .replace(",", "");

    return formattedDate;
  }

  useEffect(() => {
    console.log("aaa", scrollTrigger);
    document.getElementById("popup").scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [scrollTrigger]);

  const handleAccept = async (theid) => {
    let body = {
      acceptanceStatus: "accepted",
    };
    let acceptData = await confirmPartner(theid, body);
    console.log(acceptData);
    if (acceptData.data.success) {
      // Refresh the requests received data after successful acceptance
      refreshRequestsReceived();
      return addToast(`Request has been accepted`, {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      return addToast(acceptData.data.message || `Something went wrong`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <>
      <div
        className="backdrop-popup"
        style={{ display: confirmDelete ? "" : "none" }}
      >
        <div className="sustainability--confirm-popup-holder">
          <button
            className="cart-overlay__close-icon"
            onClick={() => setConfirmDelete(false)}
          >
            <IoIosClose />
          </button>
          <div>
            <img src="/assets/images/sustainability-popup.png" />
          </div>
          <div>
            <h3 className={`sustainability--popup-sure-text`}>
              Confirm Delete ?
            </h3>
            <p style={{ textAlign: "center", fontSize: "20px" }}>
              Business page will be deleted
            </p>
          </div>
          <div className="sustainability--popup-button-holder">
            <button
              className="sustainability--popup-button-white button--white"
              onClick={() => [setConfirmDelete(false), handleDeleteProduct()]}
            >
              YES
            </button>
            <button
              className="sustainability--popup-button-black button--black button--cursor"
              onClick={() => setConfirmDelete(false)}
            >
              NO
            </button>
          </div>
        </div>
      </div>
      <div
        className="backdrop-popup"
        style={{ display: deletePopup ? "" : "none" }}
      >
        <div className="sustainability--confirm-popup-holder">
          <button
            className="cart-overlay__close-icon"
            onClick={() => setDeletePopup(false)}
          >
            <IoIosClose />
          </button>
          <div>
            <img src="/assets/images/sustainability-popup.png" />
          </div>
          <div>
            <h3 className={`sustainability--popup-sure-text`}>
              Are you Sure you want to delete?
            </h3>
            <p style={{ textAlign: "center", fontSize: "20px" }}>
              Business will be removed
            </p>
          </div>
          <div className="sustainability--popup-button-holder">
            <button
              className="sustainability--popup-button-white button--white"
              onClick={() => [setDeletePopup(false), setConfirmDelete(true)]}
            >
              YES
            </button>
            <button
              className="sustainability--popup-button-black button--black button--cursor"
              onClick={() => setDeletePopup(false)}
            >
              NO
            </button>
          </div>
        </div>
      </div>
      <div
        className="backdrop-popup"
        style={{ display: duplicatePopup ? "" : "none" }}
      >
        <div className="sustainability--confirm-popup-holder">
          <button
            className="cart-overlay__close-icon"
            onClick={() => setDuplicatePopup(false)}
          >
            <IoIosClose />
          </button>
          <div>
            <img src="/assets/images/sustainability-popup.png" />
          </div>
          <div>
            <h3 className={`sustainability--popup-sure-text`}>Are you Sure?</h3>
            <p style={{ textAlign: "center", fontSize: "20px" }}>
              This Page will be duplicated
            </p>
          </div>
          <div className="sustainability--popup-button-holder">
            <button
              className="sustainability--popup-button-white button--white"
              onClick={() => [
                setDuplicatePopup(false),
                handleSaveSettings({
                  displaySlug: false,
                  pageStatus: "duplicatepage",
                }),
              ]}
            >
              YES
            </button>
            <button
              className="sustainability--popup-button-black button--black button--cursor"
              onClick={() => setDuplicatePopup(false)}
            >
              NO
            </button>
          </div>
        </div>
      </div>
      <div
        className="backdrop-popup"
        style={{ display: defaultPopup ? "" : "none" }}
      >
        <div className="sustainability--confirm-popup-holder">
          <button
            className="cart-overlay__close-icon"
            onClick={() => setDefaultPopup(false)}
          >
            <IoIosClose />
          </button>
          <div>
            <img src="/assets/images/sustainability-popup.png" />
          </div>
          <div>
            <h3 className={`sustainability--popup-sure-text`}>Are you Sure?</h3>
            <p style={{ textAlign: "center", fontSize: "20px" }}>
              All your edits will be lost
            </p>
          </div>
          <div className="sustainability--popup-button-holder">
            <button
              className="sustainability--popup-button-white button--white"
              onClick={() => [setDefaultPopup(false), setTriggerDefault(true)]}
            >
              YES
            </button>
            <button
              className="sustainability--popup-button-black button--black button--cursor"
              onClick={() => setDefaultPopup(false)}
            >
              NO
            </button>
          </div>
        </div>
      </div>

      <div
        className="table--popup"
        style={{ display: addProductPopup ? "" : "none" }}
      >
        <div
          className="table--form"
          id="popup"
          style={{ width: "95%", height: "700px", maxWidth: "1450px" }}
        >
          <div className="popup--head">
            <div className="popup--title">Add Product</div>
            <button
              className="cart-overlay__close-icon"
              onClick={() => setAddProductPopup(false)}
            >
              <IoIosClose />
            </button>
          </div>
          <hr />
          <br />
          {/* {!isPreview ? */}

          <AddSupplier
            handleShowStartAgainModal={handleShowStartAgainModal}
            dataChanged={sustainabilityDataChanged}
            setDataChanged={setSustainabilityDataChanged}
            editDisabled={editDisabledProduct}
            setEditDisabled={setEditDisabledProduct}
            defaultPopup={defaultPopup}
            setDefaultPopup={setDefaultPopup}
            triggerDefault={triggerDefault}
            setTriggerDefault={setTriggerDefault}
            clearFields={clearFields}
            setClearFields={setClearFields}
            refreshList={refreshList}
            setRefreshList={setRefreshList}
            addProductPopup={addProductPopup}
            setAddProductPopup={setAddProductPopup}
          />
          {/* } */}
          <br />
          <hr />
          {/* <div className="event-btn-grp">
                    <div className="add-event-btn" onClick={addEventAction}>Add Product </div>
                </div> */}
        </div>
        <div style={{ position: "relative" }}>
          {/* Your popup content here */}

          {/* Arrow button */}
          <button
            onClick={() => setScrollTrigger(!scrollTrigger)}
            style={{
              position: "fixed", // Fixed position for button
              bottom: "15%",
              right: "15%",
              borderRadius: "50%",
              backgroundColor: "#000",
              width: "50px",
              height: "50px",
              color: "#fff",
              fontSize: "25px",
              textAlign: "center",
              border: "none",
              cursor: "pointer",
              zIndex: "1001", // Ensure it appears above the popup content
            }}
          >
            <IoIosArrowRoundUp />
          </button>
        </div>
      </div>
      <div
        className="table--popup"
        style={{ display: showSingleProduct ? "" : "none" }}
      >
        <div
          className="table--form"
          style={{ width: "95%", height: "700px", maxWidth: "1450px" }}
        >
          <div className="popup--head">
            <div className="popup--title">
              {chainSwitch ? "Distributor Details" : "Supplier Details"}
            </div>
            <button
              className="cart-overlay__close-icon"
              onClick={() => [
                setShowSingleProduct(false),
                clearToSystemDefaultsFunc(),
              ]}
            >
              <IoIosClose />
            </button>
          </div>

          <div className="sustainability--page--main-3-holder">
            <div
              className="sustainability--page-box-holder"
              style={{ display: shouldEditEvent ? "" : "none" }}
            >
              {/* <div style={{ padding: "0px 30px 0px", width: "100%" }}>
                    <div className="profile-line" style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                        <p className="orders--orderNumber-Holder" style={{ display: localStorage.getItem("MyBusinessDetails") ? "" : "none" }}>Business Name:  <b>{JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}</b></p>
                        <p className="profile-head"></p>
                    </div>
                </div> */}

              <>
                <div
                  className="sustainability--page-heading-input-holder--heading"
                  style={editDisabled ? { pointerEvents: "none" } : {}}
                >
                  <div className="sustainability--page-text-holder">
                    <p>Supplier Name:</p>
                  </div>
                  <div className="heading--input--holder">
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(e) => setSelectedPartnerName(e.target.value)}
                      value={selectedPartnerName}
                      className="sustainability--page-input-holder"
                    />
                    <div className="sustainability--invalid-message-holder position-absolute">
                      {validationErrors?.productName?.error &&
                        generateInvalidMessage({
                          name: validationErrors?.selectedPartnerName?.name,
                          type: validationErrors?.selectedPartnerName?.type,
                        })}
                    </div>
                  </div>
                </div>
              </>
              <>
                <div
                  className="sustainability--page-heading-input-holder--heading"
                  style={editDisabled ? { pointerEvents: "none" } : {}}
                >
                  <div className="sustainability--page-text-holder">
                    <p>Primary Email:</p>
                  </div>
                  <div className="heading--input--holder">
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(e) => setSelectedPrimaryEmail(e.target.value)}
                      value={selectedPrimaryEmail}
                      className="sustainability--page-input-holder"
                    />
                    <div className="sustainability--invalid-message-holder position-absolute">
                      {validationErrors?.primaryEmail?.error &&
                        generateInvalidMessage({
                          name: validationErrors?.selectedPrimaryEmail?.name,
                          type: validationErrors?.selectedPrimaryEmail?.type,
                        })}
                    </div>
                  </div>
                </div>
              </>
              <>
                <div
                  className="sustainability--page-heading-input-holder--heading"
                  style={editDisabled ? { pointerEvents: "none" } : {}}
                >
                  <div className="sustainability--page-text-holder">
                    <p>Primary Name:</p>
                  </div>
                  <div className="heading--input--holder">
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(e) => setSelectedPrimaryName(e.target.value)}
                      value={selectedPrimaryName}
                      className="sustainability--page-input-holder"
                    />
                    <div className="sustainability--invalid-message-holder position-absolute">
                      {validationErrors?.selectedPrimaryName?.error &&
                        generateInvalidMessage({
                          name: validationErrors?.selectedPrimaryName?.name,
                          type: validationErrors?.selectedPrimaryName?.type,
                        })}
                    </div>
                  </div>
                </div>
              </>
              <>
                <div
                  className="sustainability--page-heading-input-holder--heading"
                  style={editDisabled ? { pointerEvents: "none" } : {}}
                >
                  <div className="sustainability--page-text-holder">
                    <p>Alternate Name:</p>
                  </div>
                  <div className="heading--input--holder">
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(e) => setSelectedAlternateName(e.target.value)}
                      value={selectedAlternateName}
                      className="sustainability--page-input-holder"
                    />
                    <div className="sustainability--invalid-message-holder position-absolute">
                      {validationErrors?.selectedAlternateName?.error &&
                        generateInvalidMessage({
                          name: validationErrors?.selectedAlternateName?.name,
                          type: validationErrors?.selectedAlternateName?.type,
                        })}
                    </div>
                  </div>
                </div>
              </>
              <>
                <div
                  className="sustainability--page-heading-input-holder--heading"
                  style={editDisabled ? { pointerEvents: "none" } : {}}
                >
                  <div className="sustainability--page-text-holder">
                    <p>Alternate Email:</p>
                  </div>
                  <div className="heading--input--holder">
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(e) =>
                        setSelectedAlternateEmail(e.target.value)
                      }
                      value={selectedAlternateEmail}
                      className="sustainability--page-input-holder"
                    />
                    <div className="sustainability--invalid-message-holder position-absolute">
                      {validationErrors?.selectedAlternateEmail?.error &&
                        generateInvalidMessage({
                          name: validationErrors?.selectedAlternateEmail?.name,
                          type: validationErrors?.selectedAlternateEmail?.type,
                        })}
                    </div>
                  </div>
                </div>
              </>
              <>
                <div
                  className="sustainability--page-heading-input-holder--heading"
                  style={editDisabled ? { pointerEvents: "none" } : {}}
                >
                  <div className="sustainability--page-text-holder">
                    <p>Relationship:</p>
                  </div>
                  <div className="heading--input--holder">
                    <input
                      // onKeyDown={handleKeyDown}
                      onChange={(e) => setSelectedRelation(e.target.value)}
                      value={selectedRelation}
                      className="sustainability--page-input-holder"
                    />
                    <div className="sustainability--invalid-message-holder position-absolute">
                      {validationErrors?.selectedRelation?.error &&
                        generateInvalidMessage({
                          name: validationErrors?.selectedRelation?.name,
                          type: validationErrors?.selectedRelation?.type,
                        })}
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
      {localStorage.getItem("MyBusinessDetails") ? (
        // allProducts.length > 0 ?
        <div className="change--email--wrapper">
          <div
            className="profile-line"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "30px",
            }}
          >
            <p
              className="orders--orderNumber-Holder"
              style={{
                display: localStorage.getItem("MyBusinessDetails")
                  ? ""
                  : "none",
              }}
            >
              Business Name:{" "}
              <b>
                {JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}
              </b>
            </p>
            <p className="profile-head"></p>
          </div>

          <div className="business--link--display">
            <div>
              <div className="supply--head">
                <b>{chainSwitch ? "Distributor Link" : "Supplier Link"}</b>
              </div>
              <div
                className="business--link--head"
                style={{ marginTop: "10px" }}
              >
                <h5>
                  Share or Scan this link with{" "}
                  {chainSwitch ? "distributors" : "suppliers"} so they can be
                  part of the business
                </h5>
              </div>
              <div className="business--link--text">
                <div>
                  <a
                    href={`${process.env.NEXT_PUBLIC_UI_URL}?supplierCode=${chainCode}`}
                    style={{ textDecoration: "underline" }}
                    target="_blank"
                  >
                    {!chainSwitch
                      ? process.env.NEXT_PUBLIC_UI_URL +
                        "?supplierCode=" +
                        chainCode
                      : process.env.NEXT_PUBLIC_UI_URL +
                        "?distributorCode=" +
                        chainCode}
                  </a>
                </div>
                <div className="sustainability--information-holder">
                  <Tooltip
                    className="iconHover"
                    title={!chainSwitch ? "Supplier Link" : "Distributor Link"}
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
                  title={
                    !chainSwitch
                      ? "Copy Supplier Link"
                      : "Copy Distributor Link"
                  }
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
                          `${
                            !chainSwitch
                              ? process.env.NEXT_PUBLIC_UI_URL +
                                "?supplierCode=" +
                                chainCode
                              : process.env.NEXT_PUBLIC_UI_URL +
                                "?distributorCode=" +
                                chainCode
                          }`
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
                      onClick={(e) => downloadCode("qrSupplyID")}
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
                    value={`${
                      !chainSwitch
                        ? process.env.NEXT_PUBLIC_UI_URL +
                          "?supplierCode=" +
                          chainCode
                        : process.env.NEXT_PUBLIC_UI_URL +
                          "?distributorCode=" +
                          chainCode
                    }`} // here you should keep the link/value(string) for which you are generation promocode
                    size={250} // the dimension of the QR code (number)
                    logoImage="/assets/images/ecostance-qr-logo.png" // URL of the logo you want to use, make sure it is a dynamic url
                    logoHeight={40}
                    logoWidth={40}
                    logoOpacity={1}
                    enableCORS={true} // enabling CORS, this is the thing that will bypass that DOM check
                    qrStyle="dots" // type of qr code, wether you want dotted ones or the square ones
                    eyeRadius={10} // radius of the promocode eye
                    id={"qrSupplyID"}
                  />
                </div>
              </div>
            </div>
            <div style={{ marginLeft: "10px" }}>
              <QRCode
                value={qrCodeField} // here you should keep the link/value(string) for which you are generation promocode
                logoImage="/assets/images/ecostance-qr-logo.png"
                size={100}
              />
            </div>
          </div>
          {/* <div className="add--product--btn" style={{ marginBottom: "20px" }} onClick={() => setViewVisual(!viewVisual)}>{viewVisual ? "Close" : "View"} Visual Representation</div> */}

          {/* <p style={{ fontSize: "25px", fontWeight: 600, display: chainSwitch ? "" : "none" }}>{singleEvent?.conferanceName}, {singleEvent?.location}, {getDisplayDate(singleEvent?.conferanceStartDate)}</p> */}
          {viewVisual ? (
            <MultiLevelTreeDiagram
              viewVisual={viewVisual}
              setViewVisual={setViewVisual}
              visualData={theVisual}
            />
          ) : (
            <>
              <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                  <div style={{ display: "flex" }}>
                    <div className="card--boxes event-box">
                      <div className="card--event--title">
                        {partnerDetails?.length}
                      </div>
                      <div className="event--subtitle">
                        Total Number Of{" "}
                        {chainSwitch ? "Distributors" : "Suppliers"}
                      </div>
                    </div>
                    <div className="card--boxes  event-box">
                      <div className="card--event--title">
                        {addCommas(totalEmissions)}
                      </div>
                      <div className="event--subtitle">
                        Total Emissions (in Metric Tons) from all{" "}
                        {chainSwitch ? "Distributors" : "Suppliers"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", marginTop: "10px" }}>
                    <div className="card--boxes  event-box">
                      <div className="card--event--title">
                        {partnerDetails?.length}
                      </div>
                      <div className="event--subtitle">Verified Users</div>
                    </div>
                    <div className="card--boxes  event-box">
                      <div className="card--event--title">0</div>
                      <div className="event--subtitle">
                        Total GHG reduced (in metric tons)
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ width: "50%" }}>
                  <div
                    className="card--boxes  event-circular-box"
                    style={{ padding: "0px", position: "relative" }}
                  >
                    <div
                      className="add--product--btn view-disp-btn"
                      style={{ marginBottom: "20px" }}
                      onClick={() => setViewVisual(true)}
                    >
                      View
                    </div>
                    {/* <div className='charts-disp doughnut-chart-title'>Emissions&nbsp;breakdown&nbsp;by&nbsp;Category</div> */}
                    {/* <br /> */}
                    {/* <Pie data={doughnutData} options={options} /> */}
                    {/* <Tree
                                            data={treeData}
                                            height={400}
                                            width={400} /> */}
                    <img src="/assets/images/productchain.png" width="550px" />
                  </div>
                </div>
              </div>
              <br />

              <div className="table--box">
                <div className="table--align">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* <div className="add--btn" onClick={() => setAddProductPopup(true)}> */}
                    {!chainSwitch ? (
                      <div
                        className="add--product--btn"
                        onClick={() => [
                          // setClearFields(true),
                          setAddSupplierBox(!addSupplierBox),
                          setAddDistributorBox(!addDistributorBox),
                        ]}
                      >
                        {!addSupplierBox ? "Add Supplier" : "View Suppliers"}
                      </div>
                    ) : (
                      <div
                        className="add--product--btn"
                        onClick={() => [
                          // setClearFields(true),
                          setAddDistributorBox(!addDistributorBox),
                          setAddSupplierBox(!addSupplierBox),
                        ]}
                      >
                        {!addDistributorBox
                          ? "Add Distributor"
                          : "View Distributors"}
                      </div>
                    )}
                    {/* </div> */}
                  </div>
                  {/* <div style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}>
                                <div style={{ fontSize: "18px", fontWeight: "700", color: "#000" }}>{addSupplierBox ? "Add Supplier" : addDistributorBox ? "Add Distributor" : "Supplier Details"}</div>

                            </div> */}
                  <div
                    style={{
                      marginLeft: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        color: !chainSwitch ? "#333" : "#7E7E7E",
                        marginRight: "10px",
                        fontWeight: !chainSwitch ? "bolder" : "normal",
                      }}
                    >
                      {/* {addSupplierBox ? "Add Supplier" : "Supplier Details"} */}
                      Supplier
                    </div>
                    <div className="big-switch">
                      <Switch
                        className=""
                        height={24}
                        width={46}
                        display={chainSwitch}
                        setDisplay={(value) => handleSwitch(value)}
                        bgcolor={true}
                        handleColor={"#000"}
                      />
                    </div>
                    <div
                      style={{
                        color: chainSwitch ? "#333" : "#7E7E7E",
                        marginLeft: "10px",
                        fontWeight: chainSwitch ? "bolder" : "normal",
                      }}
                    >
                      {/* {addDistributorBox ? "Add Distributor" : "Distributor Details"} */}
                      Distributor
                    </div>
                  </div>
                  <div className="search--box" style={{ height: "45px" }}>
                    &nbsp;&nbsp;
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      height="1.5em"
                      width="1.5em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="search..."
                      className="input--search"
                      value={inputSearch}
                      onChange={(e) => setInputSearch(e.target.value)}
                    />
                  </div>
                </div>

                <hr style={{ margin: 0 }} />
                <div className="table--align">
                  <div
                    style={{
                      display: addSupplierBox ? "none" : "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px" }}>
                      {/* <div className="add--btn" onClick={() => setAddProductPopup(true)}> */}
                      <div
                        className="add--product--btn"
                        style={{
                          background: selectedTab === "all" ? "white" : "black",
                          color: selectedTab === "all" ? "black" : "white",
                        }}
                        onClick={() => setSelectedTab("all")}
                      >
                        {chainSwitch ? "All Distributors" : "All Suppliers"}
                      </div>
                      <div
                        className="add--product--btn"
                        style={{
                          background: selectedTab === "sent" ? "white" : "black",
                          color: selectedTab === "sent" ? "black" : "white",
                        }}
                        onClick={() => setSelectedTab("sent")}
                      >
                        Pending Requests
                      </div>
                      <div
                        className="add--product--btn"
                        style={{
                          background:
                            selectedTab === "received" ? "white" : "black",
                          color: selectedTab === "received" ? "black" : "white",
                        }}
                        onClick={() => setSelectedTab("received")}
                      >
                        Requests Received
                      </div>
                      {/* </div> */}
                    </div>
                    
                    {/* Refresh button positioned at full right corner */}
                    <div style={{ marginLeft: "auto" }}>
                      <button
                        onClick={getRefreshFunction()}
                        style={{
                          backgroundColor: "#000",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "500",
                          minWidth: "120px"
                        }}
                        onMouseOver={(e) => {e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000"; e.target.style.border = "1px solid #000"}}
                        onMouseOut={(e) => {e.target.style.backgroundColor = "#000"; e.target.style.color = "#fff"; e.target.style.border = "none"}}
                      >
                        {getRefreshButtonText()}
                      </button>
                    </div>
                  </div>
                </div>

                <hr style={{ margin: 0 }} />
                {addSupplierBox ? (
                  <div>
                    <p className="chain--form">
                      {chainSwitch ? "Add Distributor" : "Add Supplier"}
                    </p>
                    <AddSupplier
                      handleShowStartAgainModal={handleShowStartAgainModal}
                      dataChanged={sustainabilityDataChanged}
                      setDataChanged={setSustainabilityDataChanged}
                      editDisabled={editDisabledProduct}
                      setEditDisabled={setEditDisabledProduct}
                      defaultPopup={defaultPopup}
                      setDefaultPopup={setDefaultPopup}
                      triggerDefault={triggerDefault}
                      setTriggerDefault={setTriggerDefault}
                      clearFields={clearFields}
                      setClearFields={setClearFields}
                      refreshList={refreshList}
                      setRefreshList={setRefreshList}
                      addProductPopup={addProductPopup}
                      setSelectedTab={setSelectedTab}
                      setAddProductPopup={setAddProductPopup}
                      chainSwitch={chainSwitch}
                      setChainSwitch={setChainSwitch}
                      refreshPendingRequests={refreshPendingRequests}
                      setAddSupplierBox={setAddSupplierBox}
                    />
                  </div>
                ) : (
                  // : addDistributorBox ? <AddDistributor
                  //     handleShowStartAgainModal={handleShowStartAgainModal}
                  //     dataChanged={sustainabilityDataChanged}
                  //     setDataChanged={setSustainabilityDataChanged}
                  //     editDisabled={editDisabledProduct}
                  //     setEditDisabled={setEditDisabledProduct}
                  //     defaultPopup={defaultPopup}
                  //     setDefaultPopup={setDefaultPopup}
                  //     triggerDefault={triggerDefault}
                  //     setTriggerDefault={setTriggerDefault}
                  //     clearFields={clearFields}
                  //     setClearFields={setClearFields}
                  //     refreshList={refreshList}
                  //     setRefreshList={setRefreshList}
                  //     addProductPopup={addProductPopup}
                  //     setAddProductPopup={setAddProductPopup}

                  // />
                  <div>
                    <div>
                      <div>
                        <div
                          className="chain--group--head"
                          style={
                            selectedTab === "sent"
                              ? {
                                  gridTemplateColumns:
                                    "0.1fr 0.4fr 0.25fr 0.4fr 0.2fr",
                                }
                              : selectedTab === "received"
                              ? {
                                  gridTemplateColumns:
                                    "0.1fr 0.3fr 0.2fr 0.3fr 0.3fr 0.2fr",
                                }
                              : {
                                  gridTemplateColumns:
                                    "0.1fr 0.3fr 0.2fr 0.3fr 0.3fr 0.2fr 0.2fr",
                                }
                          }
                        >
                          <div>No.</div>
                          <div>
                            {chainSwitch ? "Distributor Name" : "Supplier Name"}
                          </div>
                          <div>Primary Name</div>
                          <div>Primary Email</div>
                          {selectedTab !== "sent" && (
                            <div>
                              {selectedTab === "received"
                                ? "Request received on"
                                : chainSwitch
                                ? "Distributor Added On"
                                : "Supplier Added On"}
                            </div>
                          )}
                          {selectedTab !== "sent" &&
                            selectedTab !== "received" && (
                              <div>User Joined</div>
                            )}
                          {/* <div>QR code</div> */}
                          <div>
                            {selectedTab === "received" ? "Accept" : "Actions"}
                          </div>
                        </div>
                        <hr style={{ margin: 0 }} />
                        <>
                          {partnerDetails
                            .filter((item) =>
                              item?.primaryEmail
                                ?.toLowerCase()
                                .includes(inputSearch.toLowerCase())
                            )
                            .map((item, index) => {
                              return (
                                <div
                                  className="chain--group--data"
                                  style={{
                                    cursor: "pointer",
                                    ...(selectedTab === "sent"
                                      ? {
                                          gridTemplateColumns:
                                            "0.1fr 0.4fr 0.25fr 0.4fr 0.2fr",
                                        }
                                      : selectedTab === "received"
                                      ? {
                                          gridTemplateColumns:
                                            "0.1fr 0.3fr 0.2fr 0.3fr 0.3fr 0.2fr",
                                        }
                                      : {
                                          gridTemplateColumns:
                                            "0.1fr 0.3fr 0.2fr 0.3fr 0.3fr 0.2fr 0.2fr",
                                        }),
                                  }}
                                >
                                  <div>{index + 1}.</div>
                                  <div>
                                    {selectedTab === "received"
                                      ? item?.businessName
                                      : item?.chainBusinessName}
                                  </div>
                                  <div>
                                    {item?.primaryName === "undefined undefined"
                                      ? ""
                                      : item?.primaryName}
                                  </div>
                                  <div>{item?.primaryEmail}</div>

                                  {selectedTab !== "sent" && (
                                    <div>
                                      {formatTimestampToGMT(item?.updatedAt)}{" "}
                                      GMT
                                    </div>
                                  )}
                                  {selectedTab !== "sent" &&
                                    selectedTab !== "received" && (
                                      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        {item?.acceptanceStatus ===
                                          "accepted" && (
                                          <span
                                            className="green-circle"
                                            style={{
                                              fontWeight: "bold",
                                              backgroundColor: "green",
                                            }}
                                          >
                                            <IoIosCheckmark />
                                          </span>
                                        )}
                                        {item?.acceptanceStatus ===
                                          "pending" && (
                                          <span
                                            className="green-circle"
                                            style={{
                                              fontWeight: "bold",
                                              backgroundColor: "red",
                                              color: "white",
                                              fontWeight: "400",
                                            }}
                                          >
                                            x
                                          </span>
                                        )}
                                      </div>
                                    )}

                                  {selectedTab === "received" ? (
                                    //if the acceptance status is pending, then show the button
                                    item?.acceptanceStatus === "pending" ? (
                                    <div
                                      style={{ margin: "0px" }}
                                      className="table-old-edit"
                                      onClick={() => handleAccept(item?._id)}
                                    >
                                      Yes
                                    </div>
                                    ) : (
                                      <div>Accepted</div>
                                    )
                                  ) : (
                                    <div
                                      className="product-head-padding"
                                      style={{
                                        display: "flex",
                                        gap: "10px",
                                        paddingLeft: "0px",
                                      }}
                                    >
                                      {selectedTab !== "sent" && (
                                        <div
                                          className="btnview"
                                          onClick={() =>
                                            handleSingleProduct(
                                              item?._id,
                                              "view"
                                            )
                                          }
                                        >
                                          <img
                                            src="/assets/images/eyeicon-grey.png"
                                            alt="viewdetails"
                                            className="iconview"
                                          />
                                        </div>
                                      )}
                                      <div
                                        className="btnview"
                                        onClick={() => [
                                          setDeletePopup(true),
                                          setdeleteChainId(item?._id),
                                        ]}
                                      >
                                        <img
                                          src="/assets/images/deleteicon.png"
                                          alt="viewdetails"
                                          className="icondelete"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </>
                      </div>
                    </div>
                    <div
                      style={{ borderBottom: "1px solid rgba(233,233,233)" }}
                    ></div>
                    <div className="pagination--box">
                      <div className="pagination--title--text">
                        Showing <span style={{ fontWeight: 800 }}>{limit}</span>{" "}
                        results in each page
                      </div>
                      <Pagination
                        activePage={activePage}
                        itemsCountPerPage={limit}
                        totalItemsCount={count}
                        pageRangeDisplayed={pageRangeDisplayed}
                        onChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        // : <div className="sustainability--page-no-order-error" style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        //     <p>
        //         Add a product to view all your products
        //     </p>
        //     <div style={{ display: "flex", justifyContent: "center" }}>
        //         <div className="add--product--btn" onClick={() => setAddProductPopup(true)}>Add Product</div>
        //     </div>
        // </div>
        <div>
          <p style={{ marginTop: "50px" }} className="text-center">
            Create a Business to add digital product passport
          </p>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
    sustainData: state.sustainabilityData,
  };
};
export default connect(mapStateToProps)(Suppliers);
// export default SocialSharing;
