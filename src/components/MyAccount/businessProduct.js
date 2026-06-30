import React, { useEffect, useState, useRef } from "react";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { IoIosClose, IoIosArrowRoundUp } from 'react-icons/io'
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
import { MdCheck, MdContentCopy, MdInfoOutline, MdDelete } from "react-icons/md";
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { QRCode } from "react-qrcode-logo";
import CountrySelector from "./elements/CountrySelector";
import { getBusinessEvent, addBusinessProduct, removeBusinessUser, addBusinessEvent, getSingleBusinessEvent, EditBusinessEvent, businessProductSlugCheck, businessProductNameCheck, businessProductCodeCheck, keepUpdatedBusiness } from "../../apiClient/business";
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
import { useRouter } from "next/router";
import Pagination from "react-js-pagination";
import MultipleFileUpload from "./elements/multipleFileUpload";
import businessProductEdit from "./businessProductEdit";
import NewFileUpload from "./elements/newFileUpload"
import NewMultipleFileUpload from "./elements/newMultipleFileUpload"
import { getBusinessProduct, getSingleBusinessProduct, editBusinessProductPage, deleteBusinessProductPage, slugChange } from "src/apiClient/business";
import { countryNameToISO3 } from "src/data/countryNameToISO3";
import BusinessProductEdit from "./businessProductEdit";
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

let toastId;
let link = process.env.NEXT_PUBLIC_UI_URL + "/?conferenceCode=Ram123";
const BusinessProduct = ({
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
    const [selectedCountry, setSelectedCountry] = useState("us")
    const [clearFields, setClearFields] = useState(false)
    const [linkHovered, setLinkHovered] = useState(false);
    const [inputSearch, setInputSearch] = useState("")
    const [allUsersData, setAllUsersData] = useState([])
    const [shouldEditEvent, setShouldEditEvent] = useState(false)
    const [selectEditEvent, setSelectEditEvent] = useState("")
    const [eventType, setEventType] = useState("Conference")
    const [eventStartDate, setEventStartDate] = useState("")
    const [eventEndDate, setEventEndDate] = useState("")
    const [userCountry, setUserCountry] = useState({});
    const [addProductPopup, setAddProductPopup] = useState(false)
    const [countryCodeISO3, setCountryCodeISO3] = useState("");
    const [countryList, setCountryList] = useState([]);
    const [productName, setProductName] = useState("")
    const [shouldCallAPI, setShouldCallAPI] = useState(false);
    const [selectCountryRoom, setSelectCountryRoom] = useState();
    const [showCapitalCarbon, setShowCapitalCarbon] = useState();
    const [showCapitalName, setCapitalName] = useState();
    const [totalCarbon, setTotalCarbon] = useState("");
    const [storeCountryShortName, setStoreCountryShortName] = useState("");
    const [selectCountry, setSelectCountry] = useState();
    const [peopleAttending, setPeopleAttending] = useState("over10000people")
    const [venueType, setVenueType] = useState("indoor")
    const [constSlug, setConstSlug] = useState("")
    const [newSlug, setNewSlug] = useState("")
    const [imageLogo, setImageLogo] = useState("")
    const firstRender = useRef();
    const [location, setLocation] = useState("")
    const [initialCode, setInitalCode] = useState("")
    const [peopleNum, setPeopleNum] = useState(1)
    const [isGroup, setIsGroup] = useState("no")
    const [businessPage, setBusinessPage] = useState("")
    const [showBusinessPage, setShowBusinessPage] = useState(false)
    const [conferenceName, setConferenceName] = useState("")
    const [refreshEvents, setRefreshEvents] = useState("")
    const [allEventsData, setAllEventsData] = useState([])
    const [sustainabilityDataChanged, setSustainabilityDataChanged] =
        useState(false);
    const [singleEvent, setSingleEvent] = useState("")
    const [totalEmissions, setTotalEmissions] = useState(0)
    const [totalPowerConsumption, setTotalPowerConsumption] = useState(0)
    const [totalWaterConsumption, setTotalWaterConsumption] = useState(0)
    const [totalRecycledMaterial, setTotalRecycledMaterial] = useState(0)
    const [totalUpcycleddMaterial, setTotalUpcycledMaterial] = useState(0)
    const [totalSalesEmissions, setTotalSalesEmissions] = useState(0)
    const [image, setImage] = useState("");
    const [previews, setPreviews] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("USD")
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
    const [showStartAgainModal, setShowStartAgainModal] = useState({
        val: false,
        type: "",
    });
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
    const [themeSelected, setThemeSelected] = useState("white");
    const [allProducts, setAllProducts] = useState([])
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
    const [formalName, setFormalName] = useState("")
    const [publishCount, setPublishCount] = useState(0);
    const [twitter, setTwitter] = useState("");
    const [linkedin, setLinkedIn] = useState("");
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");
    const [phone, setPhone] = useState("")
    const [phoneInfo, setPhoneInfo] = useState("")
    const [singleProduct, setSingleProduct] = useState(false)
    const [editDisabled, setEditDisabled] = useState(true)
    const [editDisabledProduct, setEditDisabledProduct] = useState(true)
    const [displaySlug, setDisplaySlug] = useState(true)
    const [showSingleProduct, setShowSingleProduct] = useState(false)
    const [aboutUs, setAboutUs] = useState("")
    const [title, setTitle] = useState("")
    const [highlight1, setHighlight1] = useState("");
    const [highlight2, setHighlight2] = useState("");
    const [highlight3, setHighlight3] = useState("");
    const [highlight4, setHighlight4] = useState("");
    const [signature, setSignature] = useState("");
    const [certName1, setCertName1] = useState("");
    const [certName2, setCertName2] = useState("");
    const [certName3, setCertName3] = useState("");
    const [certName4, setCertName4] = useState("");
    const [certLink1, setCertLink1] = useState("");
    const [certLink2, setCertLink2] = useState("");
    const [certLink3, setCertLink3] = useState("");
    const [certLink4, setCertLink4] = useState("");
    const [chainData, setChainData] = useState([{ custodyType: '', date: '', address: '', linkName: '', link: '' }])
    const [certData, setCertData] = useState([{ name: "", link: "" }])
    const [description, setDescription] = useState("")
    const [validationErrors, setValidationErrors] = useState({});
    const [productCategory, setProductCategory] = useState("")
    const [productSubCategory, setProductSubCategory] = useState("")
    const [sustainabilityActionStates, setSustainabilityActionStates] = useState({
        slugChanged: false,
        slugAvailable: SLUG_UNTOUCHED,
        slugStatusChangedToTrue: false,
    });
    const [productCode, setProductCode] = useState("")
    const [defaultPopup, setDefaultPopup] = useState(false)
    const [triggerDefault, setTriggerDefault] = useState(false)
    const [refreshList, setRefreshList] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [carbonEmission, setCarbonEmission] = useState("")
    const [showEmission, setShowEmission] = useState(false)
    const [consumption, setConsumption] = useState("")
    const [showConsumption, setShowConsumption] = useState(false)
    const [waterUsage, setWaterUsage] = useState("")
    const [showWaterUsage, setShowWaterUsage] = useState(false)
    const [recycledMaterial, setRecycledMaterial] = useState("")
    const [showRecycledMaterial, setShowRecycledMaterial] = useState(false)
    const [upcycledMaterial, setUpcycledMaterial] = useState("")
    const [showUpcycledMaterial, setShowUpcycledMaterial] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleteProductId, setDeleteProductId] = useState("")
    const [totalCount, setTotalCount] = useState(0)
    const [aboutLink, setAboutLink] = useState("")
    const [showAboutLink, setShowAboutLink] = useState(false)
    const [storeLink, setStoreLink] = useState("")
    const [showStoreLink, setShowStoreLink] = useState(false)
    const [address, setAddress] = useState("")
    const [showAddress, setShowAddress] = useState(false)
    const [contact, setContact] = useState("")
    const [showContact, setShowContact] = useState(false)
    const [ordertrack, setOrdertrack] = useState("")
    const [showOrdertrack, setShowOrdertrack] = useState(false)
    const [returns, setReturns] = useState("")
    const [showReturns, setShowReturns] = useState(false)
    const [policy, setPolicy] = useState("")
    const [showPolicy, setShowPolicy] = useState(false)
    const [sizeGuide, setSizeGuide] = useState("")
    const [showSizeGuide, setShowSizeGuide] = useState(false)
    const [faq, setFaq] = useState("")
    const [showFaq, setShowFaq] = useState(false)
    const [contactInfo, setContactInfo] = useState({
        numericCode: "",
        number: "",
        countryCode: returnCorrectCode(
            "+1"
        ),
    });
    const [usefulKey1, setUserfulKey1] = useState("")
    const [usefulValue1, setUserfulValue1] = useState("")
    const [showUsefulValue1, setShowUsefulValue1] = useState(false)
    const [usefulKey2, setUserfulKey2] = useState("")
    const [usefulValue2, setUserfulValue2] = useState("")
    const [showUsefulValue2, setShowUsefulValue2] = useState(false)
    const [usefulKey3, setUserfulKey3] = useState("")
    const [usefulValue3, setUserfulValue3] = useState("")
    const [showUsefulValue3, setShowUsefulValue3] = useState(false)
    const [usefulKey4, setUserfulKey4] = useState("")
    const [usefulValue4, setUserfulValue4] = useState("")
    const [showUsefulValue4, setShowUsefulValue4] = useState(false)
    const [duplicatePopup, setDuplicatePopup] = useState(false)
    const [uniqueValue, setUniqueValue] = useState('');
    const [openQr, setOpenQr] = useState(false)
    const [qrCodeValue, setQrCodeValue] = useState("")
    const [uniqueName, setUniqueName] = useState("")
    const [uniqueCode, setUniqueCode] = useState("")
    const [scrollTrigger, setScrollTrigger] = useState(false)


    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let emailId = localStorage.getItem("email")
    let businessCode = BusinessDetails?.businessCode
    let businessName = BusinessDetails?.name
    let oldbusinessName = BusinessDetails?.oldName
    let oldBusinessSlugName = BusinessDetails?.oldBusinessSlugName
    let businessSlugName = BusinessDetails?.businessSlugName
    let ownerAcknowledgement = BusinessDetails?.ownerAcknowledgement
    let businessId = BusinessDetails?._id

    const router = useRouter();

    const handleShowStartAgainModal = (val) => {
        setShowStartAgainModal({ val: true, type: val });
    };

    const handleKeyDown = (e) => {
        if (e?.key == "Enter")
            handleSaveSettings({ displaySlug }).catch((err) => console.log(err));
    };


    const handleImage = (selectedImage) => {
        const updatedPreview = previews.filter(item => item !== selectedImage);
        setPreviews(updatedPreview)
    }


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
    }

    const handleContactChange = (e) => {
        setContact(e.target.value);
    };



    const handleSingleProduct = async (productId, iconfield) => {
        let theimagefiles = []
        iconfield === "duplicate" ? setShowSingleProduct(false) : setShowSingleProduct(true)
        iconfield === "edit" ? setShowEdit(true) : setShowEdit(false)
        let getProductDetail = await getSingleBusinessProduct(productId)
        // console.log(getProductDetail , "single-product")
        if (getProductDetail.status === 200) {
            console.log(getProductDetail.data.data, "single-product")
            setSingleProduct(getProductDetail.data.data)
            setDisplaySlug(getProductDetail.data.data.isPublic)
            setConstSlug(getProductDetail.data.data.businessSlugName)
            setInitSlug(getProductDetail.data.data.slug)
            setNewSlug(getProductDetail.data.data.slug)
            if (getProductDetail.data.data.isPublic) {
                setTitle(getProductDetail.data.data?.published?.title)
                setDescription(getProductDetail.data.data?.published?.description)
                setAboutUs(getProductDetail.data.data?.published?.aboutUs)
                setProductTag(getProductDetail.data.data?.published?.tag)
                setColorPalette(getProductDetail.data.data?.published?.colorPaletteCode)
                setProductPrice(getProductDetail.data.data?.published?.price)
                setSelectedCurrency(getProductDetail.data.data?.published?.currencySymbol?.slice(0, 3))
                setSelectedCountry(getProductDetail.data.data?.published?.country)
                getProductDetail.data.data?.published?.productImages ? setPreviews(getProductDetail.data.data?.published?.productImages) : setPreviews([])
                setImageLogo(getProductDetail.data.data?.published?.companyLogo)
                setChainData(getProductDetail.data.data?.published?.custodyChain)
                setCertData(getProductDetail.data.data?.published?.docLinks)
                setThemeSelected(getProductDetail.data.data?.published?.themeSelected)
                setProductCode(getProductDetail.data.data?.productCode)
                setProductCategory(getProductDetail.data.data?.published?.Category)
                setProductSubCategory(getProductDetail.data.data?.published?.subCategory)
                setPhone(getProductDetail?.data?.data?.published?.phone?.numericCode || "1" + getProductDetail?.data?.data?.published?.phone?.number || "1234567890")
                setPhoneInfo({
                    numericCode: getProductDetail?.data?.data?.published?.phone?.numericCode || "1",
                    number: getProductDetail?.data?.data?.published?.phone?.number || "1234567890",
                    countryCode: returnCorrectCode(
                        getProductDetail?.data?.data?.published?.phone?.countryCode || "USA"
                    ),
                })
                setShowPhone(convertStringToBoolean(getProductDetail.data.data?.published?.showPhone, "phone"))
                setProductName(getProductDetail.data.data?.published?.formalName)
                setName(getProductDetail.data.data?.published?.name)
                setEmail(getProductDetail.data.data?.published?.email)
                setTwitter(getProductDetail.data.data?.published?.twitter)
                setLinkedIn(getProductDetail.data.data?.published?.linkedin)
                setInstagram(getProductDetail.data.data?.published?.instagram)
                setFacebook(getProductDetail.data.data?.published?.facebook)
                setShowName(convertStringToBoolean(getProductDetail.data.data?.published?.showName, "Name"))
                setShowEmail(convertStringToBoolean(getProductDetail.data.data?.published?.showEmail, "Email"))
                setShowTwitter(convertStringToBoolean(getProductDetail.data.data?.published?.showTwitter, "Twitter"))
                setShowLinkedin(convertStringToBoolean(getProductDetail.data.data?.published?.showLinkedin, "LinkedIn"))
                setShowInstagram(convertStringToBoolean(getProductDetail.data.data?.published?.showInstagram, "Instagram"))
                setShowFacebook(convertStringToBoolean(getProductDetail.data.data?.published?.showFacebook, "Facebook"))
                if (getProductDetail.data.data?.published?.image.length > 0) {
                    getProductDetail.data.data?.published?.image.forEach((item, index) => {
                        console.log(item, item?.split("product/")[1], "abcd")
                        theimagefiles.push(urlToFile(item, item.split("/product/")[1]))
                    })
                    setFiles(theimagefiles)
                }
                setCarbonEmission(getProductDetail.data.data?.published?.co2Emission)
                setConsumption(getProductDetail.data.data?.published?.powerConsuption)
                setWaterUsage(getProductDetail.data.data?.published?.waterConsuption)
                setRecycledMaterial(getProductDetail.data.data?.published?.recycleMaterial)
                setUpcycledMaterial(getProductDetail.data.data?.published?.upcycleMaterial)
                setShowEmission(convertStringToBoolean(getProductDetail.data.data?.published?.showCo2Emission, "emission"))
                setShowConsumption(convertStringToBoolean(getProductDetail.data.data?.published?.showPowerConsuption, "consumption"))
                setShowWaterUsage(convertStringToBoolean(getProductDetail.data.data?.published?.showWaterConsuption, "waterUsage"))
                setShowRecycledMaterial(convertStringToBoolean(getProductDetail.data.data?.published?.showRecycleMaterial, "recycleMaterial"))
                setShowUpcycledMaterial(convertStringToBoolean(getProductDetail.data.data?.published?.showUpcycleMaterial, "upcycleMaterial"))
                setHighlight1(getProductDetail.data.data?.published?.keyPoints?.[0])
                setHighlight2(getProductDetail.data.data?.published?.keyPoints?.[1])
                setHighlight3(getProductDetail.data.data?.published?.keyPoints?.[2])
                setHighlight4(getProductDetail.data.data?.published?.keyPoints?.[3])
                setBusinessPage(getProductDetail.data.data?.published?.traceability)
                setShowBusinessPage(convertStringToBoolean(getProductDetail.data.data?.published?.showTraceability, "businessPage"))
                // setCertName1(getProductDetail.data.data?.published?.docLinks?.[0]?.name)
                // setCertName2(getProductDetail.data.data?.published?.docLinks?.[1]?.name)
                // setCertName3(getProductDetail.data.data?.published?.docLinks?.[2]?.name)
                // setCertName4(getProductDetail.data.data?.published?.docLinks?.[3]?.name)
                // setCertLink1(getProductDetail.data.data?.published?.docLinks?.[0]?.link)
                // setCertLink2(getProductDetail.data.data?.published?.docLinks?.[1]?.link)
                // setCertLink3(getProductDetail.data.data?.published?.docLinks?.[2]?.link)
                // setCertLink4(getProductDetail.data.data?.published?.docLinks?.[3]?.link)
                setSignature(getProductDetail.data.data?.published?.authorSign)
                setUserfulKey1(getProductDetail.data.data?.published?.usefullKey1)
                setUserfulValue1(getProductDetail.data.data?.published?.usefullVal1)
                setUserfulKey2(getProductDetail.data.data?.published?.usefullKey2)
                setUserfulValue2(getProductDetail.data.data?.published?.usefullVal2)
                setUserfulKey3(getProductDetail.data.data?.published?.usefullKey3)
                setUserfulValue3(getProductDetail.data.data?.published?.usefullVal3)
                setUserfulKey4(getProductDetail.data.data?.published?.usefullKey4)
                setUserfulValue4(getProductDetail.data.data?.published?.usefullVal4)
                setShowUsefulValue1(convertStringToBoolean(getProductDetail.data.data?.published?.showUsefullKey1, "usefulValue1"))
                setShowUsefulValue2(convertStringToBoolean(getProductDetail.data.data?.published?.showUsefullKey2, "usefulValue2"))
                setShowUsefulValue3(convertStringToBoolean(getProductDetail.data.data?.published?.showUsefullKey3, "usefulValue3"))
                setShowUsefulValue4(convertStringToBoolean(getProductDetail.data.data?.published?.showUsefullKey4, "usefulValue4"))
                setAboutLink(getProductDetail.data.data?.published?.aboutField)
                setAddress(getProductDetail.data.data?.published?.businessUrl)
                setShowAddress(getProductDetail.data.data?.published?.showBusinessUrl)
                setContact(getProductDetail.data.data?.published?.contact)
                setFaq(getProductDetail.data.data?.published?.faq)
                setShowAboutLink(convertStringToBoolean(getProductDetail.data.data?.published?.showAboutField, "aboutLink"))
                setShowAddress(convertStringToBoolean(getProductDetail.data.data?.published?.showBusinessUrl, "businessUrl"))
                setShowContact(convertStringToBoolean(getProductDetail.data.data?.published?.showContact, "contact"))
                setShowFaq(convertStringToBoolean(getProductDetail.data.data?.published?.showFaq, "faq"))
            } else {
                setTitle(getProductDetail.data.data?.draft?.title)
                setDescription(getProductDetail.data.data?.draft?.description)
                setAboutUs(getProductDetail.data.data?.draft?.aboutUs)
                setProductCode(getProductDetail.data.data?.productCode)
                setProductTag(getProductDetail.data.data?.draft?.tag)
                setColorPalette(getProductDetail.data.data?.published?.colorPaletteCode)
                setProductPrice(getProductDetail.data.data?.draft?.price)
                setSelectedCurrency(getProductDetail.data.data?.draft?.currencySymbol?.slice(0, 3))
                setSelectedCountry(getProductDetail.data.data?.draft?.country)
                getProductDetail.data.data?.draft?.productImages ? setPreviews(getProductDetail.data.data?.draft?.productImages) : setPreviews([])
                setChainData(getProductDetail.data.data?.draft?.custodyChain)
                setCertData(getProductDetail.data.data?.draft?.docLinks)
                setImageLogo(getProductDetail.data.data?.draft?.companyLogo)
                setThemeSelected(getProductDetail.data.data?.draft?.themeSelected)
                setProductCategory(getProductDetail.data.data?.draft?.Category)
                setProductSubCategory(getProductDetail.data.data?.draft?.subCategory)
                setPhone(getProductDetail?.data?.data?.draft?.phone?.numericCode || "1" + getProductDetail?.data?.data?.draft?.phone?.number || "1234567890",)
                setPhoneInfo({
                    numericCode: getProductDetail?.data?.data?.draft?.phone?.numericCode || "1",
                    number: getProductDetail?.data?.data?.draft?.phone?.number || "1234567890",
                    countryCode: returnCorrectCode(
                        getProductDetail?.data?.data?.draft?.phone?.countryCode || "USA"
                    ),
                })
                setShowPhone(convertStringToBoolean(getProductDetail.data.data?.draft?.showPhone, "phone"))
                setProductName(getProductDetail.data.data?.draft?.formalName)
                setName(getProductDetail.data.data?.draft?.name)
                setEmail(getProductDetail.data.data?.draft?.email)
                setTwitter(getProductDetail.data.data?.draft?.twitter)
                setLinkedIn(getProductDetail.data.data?.draft?.linkedin)
                setInstagram(getProductDetail.data.data?.draft?.instagram)
                setFacebook(getProductDetail.data.data?.draft?.facebook)
                setShowName(convertStringToBoolean(getProductDetail.data.data?.draft?.showName, "Name"))
                setShowEmail(convertStringToBoolean(getProductDetail.data.data?.draft?.showEmail, "Email"))
                setShowTwitter(convertStringToBoolean(getProductDetail.data.data?.draft?.showTwitter, "Twitter"))
                setShowLinkedin(convertStringToBoolean(getProductDetail.data.data?.draft?.showLinkedin, "LinkedIn"))
                setShowInstagram(convertStringToBoolean(getProductDetail.data.data?.draft?.showInstagram, "Instagram"))
                setShowFacebook(convertStringToBoolean(getProductDetail.data.data?.draft?.showFacebook, "Facebook"))
                if (getProductDetail.data.data?.draft?.image.length > 0) {
                    getProductDetail.data.data?.draft?.image.forEach((item, index) => {
                        theimagefiles.push(urlToFile(item, item.split("/product")[1]))
                    })
                    setFiles(theimagefiles)
                }
                setCarbonEmission(getProductDetail.data.data?.draft?.co2Emission)
                setConsumption(getProductDetail.data.data?.draft?.powerConsuption)
                setWaterUsage(getProductDetail.data.data?.draft?.waterConsuption)
                setRecycledMaterial(getProductDetail.data.data?.draft?.recycleMaterial)
                setUpcycledMaterial(getProductDetail.data.data?.draft?.upcycleMaterial)
                setShowEmission(convertStringToBoolean(getProductDetail.data.data?.draft?.showCo2Emission, "emission"))
                setShowConsumption(convertStringToBoolean(getProductDetail.data.data?.draft?.showPowerConsuption, "consumption"))
                setShowWaterUsage(convertStringToBoolean(getProductDetail.data.data?.draft?.showWaterConsuption, "waterUsage"))
                setShowRecycledMaterial(convertStringToBoolean(getProductDetail.data.data?.draft?.showRecycleMaterial, "recycleMaterial"))
                setShowUpcycledMaterial(convertStringToBoolean(getProductDetail.data.data?.draft?.showUpcycleMaterial, "upcycleMaterial"))
                setHighlight1(getProductDetail.data.data?.draft?.keyPoints?.[0])
                setHighlight2(getProductDetail.data.data?.draft?.keyPoints?.[1])
                setHighlight3(getProductDetail.data.data?.draft?.keyPoints?.[2])
                setHighlight4(getProductDetail.data.data?.draft?.keyPoints?.[3])
                setBusinessPage(getProductDetail.data.data?.draft?.traceability)
                setShowBusinessPage(convertStringToBoolean(getProductDetail.data.data?.draft?.showTraceability, "businessPage"))
                // setCertName1(getProductDetail.data.data?.draft?.docLinks?.[0]?.name)
                // setCertName2(getProductDetail.data.data?.draft?.docLinks?.[1]?.name)
                // setCertName3(getProductDetail.data.data?.draft?.docLinks?.[2]?.name)
                // setCertName4(getProductDetail.data.data?.draft?.docLinks?.[3]?.name)
                // setCertLink1(getProductDetail.data.data?.draft?.docLinks?.[0]?.link)
                // setCertLink2(getProductDetail.data.data?.draft?.docLinks?.[1]?.link)
                // setCertLink3(getProductDetail.data.data?.draft?.docLinks?.[2]?.link)
                // setCertLink4(getProductDetail.data.data?.draft?.docLinks?.[3]?.link)
                setSignature(getProductDetail.data.data?.draft?.authorSign)
                setUserfulKey1(getProductDetail.data.data?.draft?.usefullKey1)
                setUserfulValue1(getProductDetail.data.data?.draft?.usefullVal1)
                setUserfulKey2(getProductDetail.data.data?.draft?.usefullKey2)
                setUserfulValue2(getProductDetail.data.data?.draft?.usefullVal2)
                setUserfulKey3(getProductDetail.data.data?.draft?.usefullKey3)
                setUserfulValue3(getProductDetail.data.data?.draft?.usefullVal3)
                setUserfulKey4(getProductDetail.data.data?.draft?.usefullKey4)
                setUserfulValue4(getProductDetail.data.data?.draft?.usefullVal4)
                setShowUsefulValue1(convertStringToBoolean(getProductDetail.data.data?.draft?.showUsefullKey1, "usefulValue1"))
                setShowUsefulValue2(convertStringToBoolean(getProductDetail.data.data?.draft?.showUsefullKey2, "usefulValue2"))
                setShowUsefulValue3(convertStringToBoolean(getProductDetail.data.data?.draft?.showUsefullKey3, "usefulValue3"))
                setShowUsefulValue4(convertStringToBoolean(getProductDetail.data.data?.draft?.showUsefullKey4, "usefulValue4"))
                setAboutLink(getProductDetail.data.data?.draft?.aboutField)
                setAddress(getProductDetail.data.data?.draft?.businessUrl)
                setContact(getProductDetail.data.data?.draft?.contact)
                setFaq(getProductDetail.data.data?.draft?.faq)
                setShowAboutLink(convertStringToBoolean(getProductDetail.data.data?.draft?.showAboutField, "aboutLink"))
                setShowAddress(convertStringToBoolean(getProductDetail.data.data?.draft?.showBusinessUrl, "businessUrl"))
                setShowContact(convertStringToBoolean(getProductDetail.data.data?.draft?.showContact, "contact"))
                setShowFaq(convertStringToBoolean(getProductDetail.data.data?.draft?.showFaq, "faq"))
            }
        } else {
            addToast("something went wrong", {
                appearance: "error",
                autoDismiss: true,
            });
        }
    }


    const handleDeleteProduct = async () => {
        console.log(deleteProductId, "theId")
        let deleteProduct = await deleteBusinessProductPage(deleteProductId)
        console.log(deleteProduct.data, "abcd")
        if (deleteProduct.data.success) {
            setConfirmDelete(false)
            setRefreshList(true)
            return addToast(`Product Page has been deleted successfully`, {
                appearance: "success",
                autoDismiss: true,
            });
        } else {
            return addToast(deleteProduct.data.message || `Something went wrong`, {
                appearance: "error",
                autoDismiss: true,
            });
        }
    }

    const isValuePresent = async (value) => {
        try {
            let slugCheck = await businessProductSlugCheck(value)
            console.log(constSlug + "/" + newSlug, slugCheck, "slug-check")
            return slugCheck.data.productPageSlug;
        } catch (error) {
            console.error('Error fetching data from API:', error);
            return false;
        }
    };

    const isNamePresent = async (value) => {
        try {
            let nameCheck = await businessProductNameCheck(value)
            return nameCheck.data.productName;
        } catch (error) {
            console.error('Error fetching data from API:', error);
            return false;
        }
    };

    const isCodePresent = async (value) => {
        try {
            let codeCheck = await businessProductCodeCheck(value)
            return codeCheck.data.productCode;
        } catch (error) {
            console.error('Error fetching data from API:', error);
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
        let currencySymbol
        if (selectedCurrency === "USD") {
            currencySymbol = "USD $"
        } else if (selectedCurrency === "CAD") {
            currencySymbol = "CAD $"
        } else if (selectedCurrency === "INR") {
            currencySymbol = "INR ₹"
        } else if (selectedCurrency === "GBP") {
            currencySymbol = "GBP £"
        } else if (selectedCurrency === "EUR") {
            currencySymbol = "EUR €"
        } else if (selectedCurrency === "JPY") {
            currencySymbol = "JPY ¥"
        } else {
            currencySymbol = "CNY ¥"
        }
        const urlRegex = /https:\/\//
        const numRegex = /^\d+$/;
        console.log(newSlug, initSlug, "slugg")
        if (initSlug !== newSlug) {
            let slugCheck = await businessProductSlugCheck(constSlug + "/" + initSlug)
            console.log(constSlug + "/" + initSlug, slugCheck, "slug-check")
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
        console.log(validationResult, "validation")
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
        console.log(previews, "imagesss")
        console.log(phone, "phone")

        const dataForm = new FormData();
        // let randomWholeNum = Math.floor(Math.random() * 1001);
        // dataForm.append("id", randomWholeNum);
        let slug = constSlug + "/" + initSlug
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
            return Object.values(obj).every(value => value === '');
        }
        chainData = chainData.filter(obj => !hasAllEmptyProperties(obj));
        for (let i = 0; i < chainData.length; i++) {
            dataForm.append(`custodyChain[${i}][custodyType]`, chainData[i].custodyType);
            dataForm.append(`custodyChain[${i}][date]`, chainData[i].date);
            dataForm.append(`custodyChain[${i}][address]`, chainData[i].address);
            dataForm.append(`custodyChain[${i}][linkName]`, chainData[i].linkName ? chainData[i].linkName : "Transaction Cert");
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
        certData = certData.filter(obj => !hasAllEmptyProperties(obj));
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
            let slugCheck = await businessProductSlugCheck(constSlug + "/" + newSlug)
            // console.log(constSlug + "/" + newSlug, slugCheck, "slug-check")
            if (!slugCheck.data.productPageSlug) {
                let baseValue = constSlug + "/" + newSlug;
                let currentValue = baseValue;
                let counter = 1;
                while (await isValuePresent(currentValue) === false) {
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

            let nameCheck = await businessProductNameCheck(productName)
            if (!nameCheck.data.productName) {
                let baseName = productName;
                let currentName = baseName;
                let counter = 1;
                while (await isNamePresent(currentName) === false) {
                    currentName = `${baseName}${counter}`;
                    counter++;
                }

                setUniqueName(currentName);
                dataForm.append("formalName", currentName);
            } else {
                dataForm.append("formalName", productName);
            }

            let codeCheck = await businessProductCodeCheck(productCode)
            if (!codeCheck.data.productCode) {
                let baseCode = productCode;
                let currentCode = baseCode;
                let counter = 1;
                while (await isCodePresent(currentCode) === false) {
                    currentCode = `${baseCode}${counter}`;
                    counter++;
                }

                setUniqueCode(currentCode);
                dataForm.append("productCode", currentCode);
            } else {
                dataForm.append("productCode", productCode);
            }


            let addEventToBusiness = await addBusinessProduct(dataForm)
            if (addEventToBusiness.data.success) {
                setEditDisabled(true)
                setShowSingleProduct(false)
                setRefreshList(true)
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
            let editProductToBusiness = await editBusinessProductPage(dataForm, singleProduct?.businessProductId)
            console.log(editProductToBusiness)
            if (editProductToBusiness.data.success) {
                setEditDisabled(true)
                setShowSingleProduct(false)
                setRefreshList(true)
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


    const clearToSystemDefaultsFunc = (message) => {
        setProductCode("")
        setDescription(
            "We are reducing our greenhouse gas emissions everyday by wasting less, buying green, saving energy and by being conscientious consumers. But we can make only limited lifestyle changes. For our remaining emissions, we are buying carbon offsets to have a zero emission footprint. Each carbon offset we purchase goes into certified projects like planting new trees, reforestation, methane sequestration, ocean cleanup, and other such initiatives that help combat climate change today. We decided not to wait and do something today."
        );
        setAboutUs(
            "This is a paragraph about us. We are a family of five, living in Miami, Florida We are interested in playing our part in saving the environment and our planet. Living in a city that is on the front line of climate change gives us a front row-seat to the impending loom. Often during high tides or occasional torrential rains, we are inundated with a flooded downtown where spotting a fish is commonplace. We are not waiting for 2030 or 2050 for NetZero. Yes the government and businesses have to play their part, but we as individuals can make a much bigger difference. If you can spread the word, that now there is a way, we have a chance.The world you and I have inherited is not just ours, but we are mere beneficiaries of its wonders. It is our responsibility to take care of it so that we can pass it on to our future."
        );
        setPreviews([])
        setProductName("")
        setProductCategory("")
        setProductSubCategory("")
        setProductTag("")
        setProductPrice("")
        setName(
            businessName
        );
        setPhone(
            userData?.billingAddress?.phone?.numericCode || "1" +
            userData?.billingAddress?.phone?.number || "1234567890",
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
        setPreviews([])
        setImageLogo("")
        setShowName(false); // need to do it after the field is added
        setShowEmail(false);
        setTwitter("")
        setLinkedIn("")
        setFacebook("")
        setInstagram("")
        setShowPhone(false);
        setShowTwitter(false);
        setShowLinkedin(false);
        setShowInstagram(false);
        setShowFacebook(false);
        setStartDataFetched(true);
        setDisplaySlug(false);
        setThemeSelected("white");
        setCarbonEmission("")
        setConsumption("")
        setWaterUsage("")
        setRecycledMaterial("")
        setUpcycledMaterial("")
        setShowEmission(false)
        setShowConsumption(false)
        setShowWaterUsage(false)
        setShowRecycledMaterial(false)
        setShowUpcycledMaterial(false)
        setEditDisabled(true)
        setUserfulKey1("")
        setUserfulValue1("")
        setShowUsefulValue1(false)
        setUserfulKey2("")
        setUserfulValue2("")
        setShowUsefulValue2(false)
        setUserfulKey3("")
        setUserfulValue3("")
        setShowUsefulValue3(false)
        setUserfulKey4("")
        setUserfulValue4("")
        setShowUsefulValue4(false)
        setShowBusinessPage(false)
        console.log(message, "aaaaddd")

    };

    const handleBusinessSlugName = async (field) => {
        let formData = new FormData();
        formData.set("ownerAcknowledgement", true)
        if (field = "yes") {
            await keepUpdatedBusiness(formData, businessId)
                .then((response) => {
                    if (response.status === 200) {
                        addToast("business name updation confirmed", {
                            appearance: "success",
                            autoDismiss: true,
                        });
                        setTimeout(() => {
                            window.location.reload()
                        }, 100)
                    } else {
                        addToast(response?.data?.message || "Failed to update business profile", {
                            appearance: "error",
                            autoDismiss: true,
                        });
                    }
                })
                .catch((error) => {
                    console.log("error", error)
                })
        } else {
            let body = {
                businessSlugName: oldBusinessSlugName,
                name: field == oldbusinessName,
                ownerAcknowledgement: true
            }
            await slugChange(body, businessId)
                .then((response) => {
                    if (response.status === 200) {
                        addToast("business name reverted back", {
                            appearance: "success",
                            autoDismiss: true,
                        });
                        setTimeout(() => {
                            window.location.reload()
                        }, 100)
                    } else {
                        addToast(response?.data?.message || "Failed to update business profile", {
                            appearance: "error",
                            autoDismiss: true,
                        });
                    }
                })
                .catch((error) => {
                    console.log("error", error)
                })
        }
    }







    let doughnutData = {
        labels: ["CO2 Emission", "Energy Consumption", "Water Usage", "Recycled Material", "Upcycled Material"],
        // displayText: ['venue ', 'travel', 'food & snacks', 'lodging', 'waste', "sales & marketing"],
        datasets: [
            {
                data: [totalEmissions, totalPowerConsumption, totalWaterConsumption, totalRecycledMaterial, totalUpcycleddMaterial],
                backgroundColor: ['rgba(228 , 231, 246, 1)', 'rgba(189 , 232, 239, 1)', 'rgba(117 , 177, 120, 0.5)', 'rgba(236 , 155, 170, 0.5)', 'rgba(236 , 155, 170, 0.5)'],
            },
        ],
    };

    let countryCode



    useEffect(() => {
        userCountry.code &&
            countryList.length > 0 &&
            handleSelectCountry_1({ target: { value: userCountry.code } });
    }, [countryList, userCountry]);



    let limit = 10
    const pageRangeDisplayed = 5;

    let Yearlylimit = 15
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

        if ((name === "usefulValue1" || name === "usefulValue2" || name === "usefulValue3" || name === "usefulValue4") && type === INVALID_CONTACT_FIELD) {
            return "Name and Value Cannot be empty";
        }

        let textName;
        if (name === "aboutUs") textName = "About Us";
        else textName = name[0]?.toUpperCase() + name?.substring(1);

        if (type === INVALID_INPUT_LOW_CHAR) {
            return `${quote ? `'${textName}'` : textName} must have at least ${validationItemOnLength[name]?.min
                } characters`;
        }

        if (type === INVALID_INPUT_HIGH_CHAR) {
            return `${quote ? `'${textName}'` : textName} cannot have more than ${validationItemOnLength[name]?.max
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
        if (
            twitter &&
            (!twitter.includes("x.com") || !checkHttpUrl(twitter))
        ) {
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
    }


    const getBusinessProducts = async () => {
        let theProducts = await getBusinessProduct()
        if (theProducts.data.success) {
            setAllProducts(theProducts.data.data)
            setTotalCount(theProducts.data.metadata.count)
            setTotalEmissions(theProducts.data.sumValue ? theProducts.data.sumValue?.total_co2Emission : "0")
            setTotalPowerConsumption(theProducts.data.sumValue ? theProducts.data.sumValue?.total_powerConsuption : "0")
            setTotalWaterConsumption(theProducts.data.sumValue ? theProducts.data.sumValue?.total_waterConsuption : "0")
            setTotalRecycledMaterial(theProducts.data.sumValue ? theProducts.data.sumValue?.total_recycleMaterial : "0")
            setTotalUpcycledMaterial(theProducts.data.sumValue ? theProducts.data.sumValue?.total_upcycleMaterial : "0")
            let count = 0
            theProducts.data.data.forEach((item) => {
                console.log(item.isPublic, "isPublic")
                if (item.isPublic) {
                    count = count + 1
                }
            })
            setPublishCount(count);
        }
    }

    useEffect(() => {
        getBusinessProducts()
        setRefreshList(false)
    }, [refreshList])


    useEffect(() => {
        getCountryList();

        axios
            .get("https://ipapi.co/json/")
            .then((res) => {
                setUserCountry({
                    name: res?.data ? res.data?.country_name : "India",
                    code: res?.data ? res.data?.country_code_iso3 : "IND",
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
        setInitSlug(value.toLowerCase())
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

    const downloadCode = async (id) => {
        console.log(id, "idd");
        setDownloading(true);

        const canvas = document.getElementById(id);
        if (canvas) {
            await document.fonts.ready;

            const combinedCanvas = document.createElement("canvas");
            const ctx = combinedCanvas.getContext("2d");

            const qrCodeWidth = canvas.width;
            const qrCodeHeight = canvas.height;

            // Find the bounding box of the non-white pixels of the QR code to strip its built-in margins
            const sourceCtx = canvas.getContext("2d");
            let minX = qrCodeWidth;
            let maxX = 0;
            let minY = qrCodeHeight;
            let maxY = 0;

            try {
                const imgData = sourceCtx.getImageData(0, 0, qrCodeWidth, qrCodeHeight);
                const data = imgData.data;
                for (let y = 0; y < qrCodeHeight; y++) {
                    for (let x = 0; x < qrCodeWidth; x++) {
                        const idx = (y * qrCodeWidth + x) * 4;
                        const r = data[idx];
                        const g = data[idx + 1];
                        const b = data[idx + 2];
                        const a = data[idx + 3];

                        // If pixel is not white (threshold: R, G, B less than 240) and has opacity
                        if (a > 50 && (r < 240 || g < 240 || b < 240)) {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }
            } catch (e) {
                console.error("Error calculating QR bounds:", e);
            }

            // Fallback if no pixels found or error occurred
            if (minX >= maxX || minY >= maxY) {
                minX = 40;
                maxX = qrCodeWidth - 40;
                minY = 40;
                maxY = qrCodeHeight - 40;
            }

            const croppedWidth = maxX - minX + 1;
            const croppedHeight = maxY - minY + 1;

            // Scale up the entire drawing canvas by a factor of 3 to produce a high-resolution crisp image (including the logo details)
            const scaleFactor = 3;
            const scaledWidth = croppedWidth * scaleFactor;
            const scaledHeight = croppedHeight * scaleFactor;

            // Define margins around the cropped QR code (increased left/right padding for 5px text-to-QR gap)
            const leftPadding = 40 * scaleFactor;
            const rightPadding = 40 * scaleFactor;
            const topPadding = 40 * scaleFactor; // Increased top padding to add space above Traceable
            const bottomPadding = 35 * scaleFactor;

            combinedCanvas.width = scaledWidth + leftPadding + rightPadding;
            combinedCanvas.height = scaledHeight + topPadding + bottomPadding;

            // Fill the entire canvas with a solid white background
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

            // Disable image smoothing temporarily to keep the scaled QR code modules pixel-perfect and sharp
            ctx.imageSmoothingEnabled = false;

            // Draw the cropped QR code (bypassing the built-in white border)
            ctx.drawImage(canvas, minX, minY, croppedWidth, croppedHeight, leftPadding, topPadding, scaledWidth, scaledHeight);

            // Re-enable image smoothing for drawing the logo and text elements smoothly
            ctx.imageSmoothingEnabled = true;

            // Draw the custom logo at the center of the QR code
            const logoImg = new Image();
            logoImg.src = "/assets/images/ecostance-qr-logo.png";
            await new Promise((resolve) => {
                logoImg.onload = () => {
                    const centerX = leftPadding + scaledWidth / 2;
                    const centerY = topPadding + scaledHeight / 2;
                    const logoSize = Math.min(scaledWidth, scaledHeight) * 0.22;
                    const logoX = centerX - logoSize / 2;
                    const logoY = centerY - logoSize / 2;

                    // Draw a white background square behind the logo (scaled margin of 6px)
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(logoX - 6, logoY - 6, logoSize + 12, logoSize + 12);

                    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                    resolve();
                };
                logoImg.onerror = () => {
                    console.error("Failed to load center logo");
                    resolve();
                };
            });

            const fontFamily = "Work Sans, Arial, sans-serif";
            const fontSize = 25 * scaleFactor; // Optimized font size for better legibility on small product packages

            // Draw a black border around the QR code, leaving a 3px margin so it does not touch the finder patterns
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2 * scaleFactor;
            ctx.strokeRect(leftPadding - (3 * scaleFactor), topPadding - (3 * scaleFactor), scaledWidth + (6 * scaleFactor), scaledHeight + (6 * scaleFactor));

            // 1. Draw "Traceable" at the top-left edge of the QR code (aligned with left border and 5px above top border)
            ctx.font = `normal ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            ctx.fillText("Traceable", leftPadding - (3 * scaleFactor), topPadding - (8 * scaleFactor));

            // 2. Draw "100%" vertically on the left side of the border (with a 5px gap)
            ctx.save();
            ctx.font = `normal ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.translate(leftPadding - (21 * scaleFactor), topPadding + (scaledHeight * 0.12));
            ctx.rotate(-Math.PI / 2);
            ctx.fillText("100%", 0, 0);
            ctx.restore();

            // 3. Draw the product name at the bottom of the QR code (centered, 5px below bottom border)
            ctx.font = `normal ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(productName, leftPadding + (scaledWidth / 2), topPadding + scaledHeight + (8 * scaleFactor));

            // 4. Draw the business name vertically on the right side of the border (with a 5px gap)
            const businessNameText = profileRelatedData?.name || (typeof window !== "undefined" && JSON.parse(localStorage.getItem("MyBusinessDetails") || "{}")?.name) || "EcoStance";
            ctx.save();
            ctx.font = `normal ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.translate(leftPadding + scaledWidth + (21 * scaleFactor), topPadding + (scaledHeight / 2));
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(businessNameText, 0, 0);
            ctx.restore();

            const pngUrl = combinedCanvas
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

    const getDisplayTime = (time) => {
        const dateObj = new Date(time);
        const timeOptions = { hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Kolkata' };
        const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);
        return formattedTime;
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


    const handleAddChain = (e) => {
        e.preventDefault()
        if (chainData.length === 1) {
            setChainData([...chainData, {
                custodyType: 'Raw Materials',
                date: '2023-04-01',
                address: 'Makati, Philippines',
                linkName: "Transaction Cert",
                link: 'https://www.textileinfomedia.com/business/philippines/apparel-and-garments'
            }]);
        } else if (chainData.length === 2) {
            setChainData([...chainData, {
                custodyType: 'Manufacturing',
                date: '2023-04-01',
                address: 'Haining, China',
                linkName: "Transaction Cert",
                link: 'https://mmsclothing.com/'
            }]);
        } else if (chainData.length === 3) {
            setChainData([...chainData, {
                custodyType: 'Assembling & Packaging',
                date: '2024-04-01',
                address: 'Haryana, India',
                linkName: "Transaction Cert",
                link: 'https://www.smsindia.com/'
            }]);
        } else if (chainData.length === 4) {
            setChainData([...chainData, {
                custodyType: 'Retail',
                date: '2025-04-01',
                address: 'USA , Europe, Canada',
                linkName: "Transaction Cert",
                link: 'https://www.amazon.com/b/ref=fs_xg_xgl_lp_surl?node=7141123011'
            }]);
        } else {
            setChainData([...chainData, { custodyType: '', date: '', address: '', linkName: '', link: '' }]);
        }
        console.log(chainData, "newchain")
    };

    const handleChange = (index, event) => {
        const newChain = chainData.slice();
        newChain[index][event.target.name] = event.target.value;
        setChainData(newChain);
    };

    const handleDeleteChain = (e, index) => {
        e.preventDefault()
        const newChain = chainData.filter((_, i) => i !== index);
        setChainData(newChain);
    };

    const handleAddCert = (e) => {
        e.preventDefault()
        if (certData.length === 1) {
            setCertData([...certData, {
                name: 'Fair Trade Certified™',
                link: 'https://www.fairtradecertified.org/'
            }]);
        } else if (certData.length === 2) {
            setCertData([...certData, {
                name: 'Global Organic Textile Standard',
                link: 'https://global-standard.org/'
            }]);
        } else {
            setCertData([...certData, { name: '', link: '' }]);
        }
    };

    const handleChangeCert = (index, event) => {
        const newCert = certData.slice();
        newCert[index][event.target.name] = event.target.value;
        setCertData(newCert);
    };

    const handleDeleteCert = (e, index) => {
        e.preventDefault()
        const newCert = certData.filter((_, i) => i !== index);
        setCertData(newCert);
    };




    let businessnamewarning = <div style={{ textAlign: "center", display: ownerAcknowledgement ? "none" : businessName === oldbusinessName ? "none" : "", color: "red" }}>
        <div style={{ fontSize: "15px" }}>You have recently changed business name from "{oldbusinessName}" to  "{businessName}"</div>
        <div style={{ fontSize: "15px", color: "red" }}>Do you want to keep it ?</div>
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



    function formatTimestampToGMT(timestamp) {
        const date = new Date(timestamp);

        // Options for formatting the date and time in GMT with AM/PM
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'UTC'
        };

        // Format the date and time
        const formattedDate = date.toLocaleString('en-US', options).replace('at ', '').replace(',', '');

        return formattedDate;
    }

    useEffect(() => {
        console.log("aaa", scrollTrigger)
        document.getElementById('popup').scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [scrollTrigger])




    return <>
        <div className="backdrop-popup" style={{ display: confirmDelete ? "" : "none" }}>
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
                        Product Page once deleted cannot be deleted
                    </p>
                </div>
                <div className="sustainability--popup-button-holder">
                    <button
                        className="sustainability--popup-button-white button--white"
                        onClick={() => [
                            setConfirmDelete(false),
                            handleDeleteProduct()
                        ]}
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
        <div className="backdrop-popup" style={{ display: deletePopup ? "" : "none" }}>
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
                        The product page create will be lost
                    </p>
                </div>
                <div className="sustainability--popup-button-holder">
                    <button
                        className="sustainability--popup-button-white button--white"
                        onClick={() => [
                            setDeletePopup(false),
                            setConfirmDelete(true)
                        ]}
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
        <div className="backdrop-popup" style={{ display: duplicatePopup ? "" : "none" }}>
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
                    <h3 className={`sustainability--popup-sure-text`}>
                        Are you Sure?
                    </h3>
                    <p style={{ textAlign: "center", fontSize: "20px" }}>
                        This Page will be duplicated
                    </p>
                </div>
                <div className="sustainability--popup-button-holder">
                    <button
                        className="sustainability--popup-button-white button--white"
                        onClick={() => [
                            setDuplicatePopup(false),
                            handleSaveSettings({ displaySlug: false, pageStatus: "duplicatepage" })
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
        <div className="backdrop-popup" style={{ display: defaultPopup ? "" : "none" }}>
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
                    <h3 className={`sustainability--popup-sure-text`}>
                        Are you Sure?
                    </h3>
                    <p style={{ textAlign: "center", fontSize: "20px" }}>
                        All your edits will be lost
                    </p>
                </div>
                <div className="sustainability--popup-button-holder">
                    <button
                        className="sustainability--popup-button-white button--white"
                        onClick={() => [
                            setDefaultPopup(false),
                            setTriggerDefault(true)
                        ]}
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
                        <h5>Share or Scan this link so that the users can view the business product</h5>
                    </div>
                    <div className="business--link--text" style={{ marginTop: "10px" }}>
                        <div>
                            Your Product Link :{" "}
                            <a
                                href={`${process.env.NEXT_PUBLIC_UI_URL}/dpp/${constSlug}/${initSlug}`}
                                style={{ textDecoration: "underline" }}
                                target="_blank"
                            >
                                {process.env.NEXT_PUBLIC_UI_URL}/dpp/{constSlug}/{initSlug}
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
                                            `${process.env.NEXT_PUBLIC_UI_URL}/dpp/${constSlug}/${initSlug}`
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
                                    onClick={(e) => downloadCode("productQrID")}
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
                                value={`${process.env.NEXT_PUBLIC_UI_URL}/dpp/${constSlug}/${initSlug}`} // here you should keep the link/value(string) for which you are generation promocode
                                size={250} // the dimension of the QR code (number)
                                logoImage="/assets/images/logo.png" // URL of the logo you want to use, make sure it is a dynamic url
                                logoHeight={40}
                                logoWidth={40}
                                logoOpacity={1}
                                enableCORS={true} // enabling CORS, this is the thing that will bypass that DOM check
                                qrStyle="dots" // type of qr code, wether you want dotted ones or the square ones
                                eyeRadius={10} // radius of the promocode eye
                                id={"productQrID"}
                            />
                        </div>
                    </div>
                </div>
                <div className="qrbox" style={{ marginLeft: "10px" }}>

                    {/* <div className="tracetext">Traceable</div> */}
                    {/* <div class="rotated-text">
                        100%
                    </div> */}
                    <QRCode
                        value={`${process.env.NEXT_PUBLIC_UI_URL}/dpp/${constSlug}/${initSlug}`}
                        logoImage="/assets/images/logo.png"
                        size={100}

                    />

                    <p style={{ textAlign: "center" }}>{productName}</p>
                </div>
                {/* {businessnamewarning} */}



            </div>
        </div>
        <div className="table--popup" style={{ display: addProductPopup ? "" : "none" }}>
            <div className="table--form" id="popup" style={{ width: "95%", height: "700px", maxWidth: "1450px" }}>
                <div className="popup--head">
                    <div className="popup--title">Add Product</div>
                    <button className="cart-overlay__close-icon" onClick={() => setAddProductPopup(false)}><IoIosClose /></button>
                </div>
                <hr />
                <br />
                {/* {!isPreview ? */}

                <BusinessProductEdit handleShowStartAgainModal={handleShowStartAgainModal}
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
            <div style={{ position: 'relative' }}>
                {/* Your popup content here */}

                {/* Arrow button */}
                <button
                    onClick={() => setScrollTrigger(!scrollTrigger)}
                    style={{
                        position: 'fixed', // Fixed position for button
                        bottom: '15%',
                        right: '15%',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        width: '50px',
                        height: "50px",
                        color: '#fff',
                        fontSize: "25px",
                        textAlign: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: '1001' // Ensure it appears above the popup content
                    }}
                >
                    <IoIosArrowRoundUp />

                </button>
            </div>
        </div>
        <div className="table--popup" style={{ display: showSingleProduct ? "" : "none" }}>

            <div className="table--form" style={{ width: "95%", height: "700px", maxWidth: "1450px" }}>
                <div className="popup--head">
                    <div className="popup--title">Product Details</div>
                    <button className="cart-overlay__close-icon" onClick={() => [
                        setShowSingleProduct(false),
                        clearToSystemDefaultsFunc()
                    ]
                    }><IoIosClose /></button>
                </div>

                <div className="sustainability--page--main-3-holder">
                    <div className="sustainability--page-box-holder" style={{ display: shouldEditEvent ? "" : "none" }}>
                        {/* <div style={{ padding: "0px 30px 0px", width: "100%" }}>
                    <div className="profile-line" style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                        <p className="orders--orderNumber-Holder" style={{ display: localStorage.getItem("MyBusinessDetails") ? "" : "none" }}>Business Name:  <b>{JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}</b></p>
                        <p className="profile-head"></p>
                    </div>
                </div> */}
                        <div className="productButtons">
                            {editDisabled ? (
                                <div style={{ display: showEdit ? "" : "none" }}
                                    onClick={() => setEditDisabled(false)}
                                    className="sustainability--edit-button sustainability-start-again button--black"
                                >
                                    Edit
                                </div>
                            ) : ("")
                            }
                            {!editDisabled ? (
                                <>
                                    <div
                                        onClick={() => {
                                            setEditDisabled(true)
                                            // handleSingleProduct(singleProduct?.businessProductId, "view")
                                        }}
                                        // onClick={() => didValuesChanged()}
                                        className="sustainability--edit-button sustainability-start-again button--white"
                                    >
                                        Cancel
                                    </div>
                                    &nbsp;
                                    <div
                                        className="sustainability--edit-button sustainability-save" style={{ lineHeight: "23px" }}
                                        onClick={() => handleSaveSettings({ displaySlug })}
                                    >

                                        Save{" "}
                                        {/* {apiOperationsStates?.saveInProgress ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            ""
                                        )} */}
                                    </div>
                                </>
                            ) : ("")}
                        </div>
                        <div
                            className="sustainability--page-slug-toggleText-holder main--slug-sustainabilty"
                            style={editDisabled ? { pointerEvents: "none" } : {}}
                        >
                            <div className="sustainability--page-slug-text-input-holder">
                                <div
                                    className="sustainability--page-text-holder sustainability--page-text-holder--info"
                                    style={{ display: "flex", justifyContent: "space-between" }}
                                >
                                    <div className="sustainability--label--icon--wrapper">
                                        <p>Product Page:* </p>
                                        <div
                                            className="sustainability--information-holder"
                                            style={{ marginLeft: "-15px" }}
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
                                                title="This is your Product Page web site link that can be
                          advertised by you and/or your company on your own web
                          site, your social media profiles, your social media
                          posts, so that your friends and customers can access
                          this link directly from anywhere"
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
                                            title="Copy Product Page Link"
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
                                                            `${process.env.NEXT_PUBLIC_UI_URL}/dpp/${constSlug}/${initSlug}`
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
                                                    onClick={(e) => downloadCode("productQrID")}
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
                                                value={`${process.env.NEXT_PUBLIC_UI_URL}/dpp/${constSlug}/${initSlug}`} // here you should keep the link/value(string) for which you are generation promocode
                                                size={250} // the dimension of the QR code (number)
                                                logoImage="/assets/images/logo.png" // URL of the logo you want to use, make sure it is a dynamic url
                                                logoHeight={40}
                                                logoWidth={40}
                                                logoOpacity={1}
                                                enableCORS={true} // enabling CORS, this is the thing that will bypass that DOM check
                                                qrStyle="dots" // type of qr code, wether you want dotted ones or the square ones
                                                eyeRadius={10} // radius of the promocode eye
                                                id={"productQrID"}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p>Publish Status: </p>
                                    </div>
                                </div>

                                <div className="sustainability--input--slug--holder--main">

                                    <div className="sustainability--page-input-slug-holder">
                                        <div className="sustainability--page-input-holder">
                                            <div
                                                className="sustainability-slug-preURL-user-holder"
                                                onClick={() => setInputSlugSelected(true)}
                                            >
                                                <div
                                                    className="sustainability-slug-preURL"
                                                    onBlur={(e) =>
                                                        handleSlugSummit({ key: "Enter", event: e })
                                                    }
                                                    name="slug--main--element"
                                                    tabIndex={0}
                                                >
                                                    {/* https://netcarbons.rayabharitechnologies.com/b/ */}
                                                    {`${process.env.NEXT_PUBLIC_UI_URL}/dpp/${constSlug}/`}
                                                </div>
                                                {!inputSlugSelected ? (
                                                    <div>
                                                        <div className="sustainability--slug--pencil--holder--main">
                                                            <div className="sustainability--slug--pencil--holder">
                                                                <p className="sustainability-slug-user">
                                                                    {initSlug}
                                                                </p>
                                                                <div
                                                                    className="sustainability--slug--edit--slug--holder"
                                                                // onClick={() => setInputSlugSelected(true)}
                                                                >
                                                                    <svg
                                                                        width="20"
                                                                        height="21"
                                                                        viewBox="0 0 20 21"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M18.2677 1.73223L18.9748 1.02513V1.02513L18.2677 1.73223ZM4.5 19.0355V20.0355C4.76522 20.0355 5.01957 19.9301 5.20711 19.7426L4.5 19.0355ZM1 19.0355H0C0 19.5878 0.447715 20.0355 1 20.0355L1 19.0355ZM1 15.4644L0.292893 14.7573C0.105357 14.9448 0 15.1992 0 15.4644H1ZM15.4393 2.43934C16.0251 1.85355 16.9748 1.85355 17.5606 2.43934L18.9748 1.02513C17.608 -0.341709 15.3919 -0.341709 14.0251 1.02513L15.4393 2.43934ZM17.5606 2.43934C18.1464 3.02513 18.1464 3.97487 17.5606 4.56066L18.9748 5.97487C20.3417 4.60804 20.3417 2.39196 18.9748 1.02513L17.5606 2.43934ZM17.5606 4.56066L3.79289 18.3284L5.20711 19.7426L18.9748 5.97487L17.5606 4.56066ZM4.5 18.0355H1V20.0355H4.5V18.0355ZM14.0251 1.02513L0.292893 14.7573L1.70711 16.1715L15.4393 2.43934L14.0251 1.02513ZM0 15.4644V19.0355H2V15.4644H0ZM12.5251 3.93934L16.0606 7.47487L17.4748 6.06066L13.9393 2.52513L12.5251 3.93934Z"
                                                                            fill="#333333"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <input
                                                            className="sustainability-slug-user sustainability-slug-user-input"
                                                            value={initSlug}
                                                            onBlur={(e) =>
                                                                handleSlugSummit({ key: "Enter", event: e })
                                                            }
                                                            ref={slugInputRef}
                                                            name="slug--main--element"
                                                            onKeyDown={handleSlugSummit}
                                                            onChange={(e) =>
                                                                handleSlugChange(e.target.value)
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                            {/* {!inputSlugSelected && (
                       
                      )} */}
                                        </div>

                                        <div className="sustainability--switch-button-holder--primary--slug">
                                            <p
                                                style={
                                                    displaySlug
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={displaySlug}
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
                                                    disabled={editDisabled}
                                                    display={displaySlug}
                                                    setDisplay={(value) => handleMakePublic(value)}
                                                />
                                            </div>
                                            <p
                                                style={
                                                    !displaySlug
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                            {displaySlug ? (
                                                <div className="sustainability--slug-information-box">
                                                    Your Digital Product Page is published and is currently
                                                    accessible to anyone from the Internet
                                                </div>
                                            ) : (
                                                <div className="sustainability--slug-information-box">
                                                    Your Digital Product Page is not published and is
                                                    currently not accessible to anyone from the
                                                    Internet
                                                </div>
                                            )}
                                        </div>
                                        <p className="error-msg position-absolute">
                                            {/* {sustainabilityActionStates?.slugAvailable ===
                            SLUG_AVAILABLE &&
                            currentSlug?.length !== 0 &&
                            !validationErrors?.slug?.error &&
                            "This URL is Available"} */}
                                            {/* {sustainabilityActionStates?.slugAvailable ===
                                                                SLUG_UNAVAILABLE &&
                                                                initSlug?.length !== 0 &&
                                                                !validationErrors?.slug?.error &&
                                                                "The link name has already been taken"}
                                                            {initSlug?.length === 0 &&
                                                                !validationErrors?.slug?.error &&
                                                                "Please provide a link name"}
                                                            {validationErrors?.slug?.error &&
                                                                generateInvalidMessage({
                                                                    name: validationErrors?.slug?.name,
                                                                    type: validationErrors?.slug?.type,
                                                                })} */}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="sustainability--page-slug-toggleText-holder main--slug-sustainabilty--mobile">
                            <div className="sustainability--page-slug-text-input-holder">
                                <div className="sustainability--page-text-holder sustainability--page-text-holder--info">
                                    <p> Product Page: </p>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-input--mobile-holder">
                                {/* {userData?.slug?.slug ? ( */}
                                <div className="sustainability--page-input-slug-holder">
                                    <div className="sustainability--page-input-holder">
                                        <div
                                            className="sustainability-slug-preURL-user-holder"
                                            onClick={() => setInputSlugSelected(true)}
                                        >
                                            <div className="sustainability-slug-preURL">
                                                {`${process.env.NEXT_PUBLIC_UI_URL}/b/`}
                                            </div>
                                            {!inputSlugSelected ? (
                                                <div className="sustainability-slug-user">
                                                    {initSlug}
                                                </div>
                                            ) : (
                                                <input
                                                    className="sustainability-slug-user sustainability-slug-user-input"
                                                    value={initSlug}
                                                    onKeyDown={handleSlugSummit}
                                                    onChange={(e) => handleSlugChange(e.target.value)}
                                                />
                                            )}
                                        </div>
                                        <div
                                            style={{ cursor: "pointer", paddingTop: "10px" }}
                                            onClick={() => setInputSlugSelected(true)}
                                        >
                                            <svg
                                                width="20"
                                                height="21"
                                                viewBox="0 0 20 21"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M18.2677 1.73223L18.9748 1.02513V1.02513L18.2677 1.73223ZM4.5 19.0355V20.0355C4.76522 20.0355 5.01957 19.9301 5.20711 19.7426L4.5 19.0355ZM1 19.0355H0C0 19.5878 0.447715 20.0355 1 20.0355L1 19.0355ZM1 15.4644L0.292893 14.7573C0.105357 14.9448 0 15.1992 0 15.4644H1ZM15.4393 2.43934C16.0251 1.85355 16.9748 1.85355 17.5606 2.43934L18.9748 1.02513C17.608 -0.341709 15.3919 -0.341709 14.0251 1.02513L15.4393 2.43934ZM17.5606 2.43934C18.1464 3.02513 18.1464 3.97487 17.5606 4.56066L18.9748 5.97487C20.3417 4.60804 20.3417 2.39196 18.9748 1.02513L17.5606 2.43934ZM17.5606 4.56066L3.79289 18.3284L5.20711 19.7426L18.9748 5.97487L17.5606 4.56066ZM4.5 18.0355H1V20.0355H4.5V18.0355ZM14.0251 1.02513L0.292893 14.7573L1.70711 16.1715L15.4393 2.43934L14.0251 1.02513ZM0 15.4644V19.0355H2V15.4644H0ZM12.5251 3.93934L16.0606 7.47487L17.4748 6.06066L13.9393 2.52513L12.5251 3.93934Z"
                                                    fill="#333333"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* <h4 className="slugUpdate--message">
                                                        {sustainabilityActionStates?.slugAvailable ===
                                                            SLUG_AVAILABLE && "This URL is Available"}
                                                        {!sustainabilityActionStates?.slugAvailable ===
                                                            SLUG_UNAVAILABLE &&
                                                            "The link name has already been taken"}
                                                    </h4> */}
                                </div>
                                {/* ) : (
                                                ""
                                            )} */}

                                <div className="sustainability--switch-button-holder--primary--slug">
                                    <p
                                        style={
                                            displaySlug ? { color: "#7E7E7E" } : { color: "#333" }
                                        }
                                    >
                                        Off
                                    </p>
                                    <label class="switch">
                                        <input type="checkbox" />
                                        <span class="slider round"></span>
                                    </label>
                                    <div className="big-switch">
                                        <Switch
                                            height={24}
                                            width={46}
                                            disabled={editDisabled}
                                            display={displaySlug}
                                            setDisplay={(value) => handleMakePublic(value)}
                                        />
                                    </div>
                                    <div className="small-switch" style={{ display: "none" }}>
                                        <Switch
                                            height={12.93}
                                            width={24.73}
                                            display={displaySlug}
                                            setDisplay={(value) => handleMakePublic(value)}
                                        />
                                    </div>
                                    <p
                                        style={
                                            !displaySlug ? { color: "#7E7E7E" } : { color: "#333" }
                                        }
                                        className="sustainability--toggle-switched"
                                    >
                                        On
                                    </p>

                                    {displaySlug ? (
                                        <div className="sustainability--slug-information-box">
                                            Your Digital Product Page is published and is currently
                                            accessible to anyone from the Internet
                                        </div>
                                    ) : (
                                        <div className="sustainability--slug-information-box">
                                            Your Digital Product Page is not published and is currently
                                            not accessible to anyone from the Internet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* <>
                            <div className="sustainability--page-heading-input-holder--heading"
                                style={{ display: ownerAcknowledgement ? "none" : businessName === oldbusinessName ? "none" : "", pointerEvents: editDisabled ? "none" : "" }}>
                                {businessnamewarning}
                            </div>
                        </> */}
                        <>
                            <div
                                className="sustainability--page-heading-input-holder--heading"
                                style={editDisabled ? { pointerEvents: "none" } : {}}
                            >
                                <div className="sustainability--page-text-holder">
                                    <p>Product Name:*</p>
                                </div>
                                <div className="heading--input--holder">
                                    <input
                                        // onKeyDown={handleKeyDown}
                                        onChange={(e) => setProductName(e.target.value)}
                                        value={productName}
                                        className="sustainability--page-input-holder"
                                    />
                                    <div className="sustainability--invalid-message-holder position-absolute">
                                        {validationErrors?.productName?.error &&
                                            generateInvalidMessage({
                                                name: validationErrors?.productName?.name,
                                                type: validationErrors?.productName?.type,
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
                                    <p>Product Code/SKU:*</p>
                                </div>
                                <div className="heading--input--holder">
                                    <input
                                        // onKeyDown={handleKeyDown}
                                        onChange={(e) => setProductCode(e.target.value)}
                                        value={productCode}
                                        className="sustainability--page-input-holder"
                                    />
                                    <div className="sustainability--invalid-message-holder position-absolute">
                                        {validationErrors?.title?.error &&
                                            generateInvalidMessage({
                                                name: validationErrors?.title?.name,
                                                type: validationErrors?.title?.type,
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
                                    <p>Product Category:*</p>
                                </div>
                                <div className="heading--input--holder">
                                    <input
                                        // onKeyDown={handleKeyDown}
                                        onChange={(e) => setProductCategory(e.target.value)}
                                        value={productCategory}
                                        className="sustainability--page-input-holder"
                                    />
                                    <div className="sustainability--invalid-message-holder position-absolute">
                                        {validationErrors?.title?.error &&
                                            generateInvalidMessage({
                                                name: validationErrors?.title?.name,
                                                type: validationErrors?.title?.type,
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
                                    <p>Product Sub Category:*</p>
                                </div>
                                <div className="heading--input--holder">
                                    <input
                                        // onKeyDown={handleKeyDown}
                                        onChange={(e) => setProductSubCategory(e.target.value)}
                                        value={productSubCategory}
                                        className="sustainability--page-input-holder"
                                    />
                                    <div className="sustainability--invalid-message-holder position-absolute">
                                        {validationErrors?.title?.error &&
                                            generateInvalidMessage({
                                                name: validationErrors?.title?.name,
                                                type: validationErrors?.title?.type,
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
                                    <p>Product Tags:*</p>
                                </div>
                                <div className="heading--input--holder">
                                    <input
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) => setProductTag(e.target.value)}
                                        value={productTag}
                                        className="sustainability--page-input-holder"
                                    />
                                    {/* <div className="sustainability--invalid-message-holder position-absolute">
                                                        {validationErrors?.title?.error &&
                                                            generateInvalidMessage({
                                                                name: validationErrors?.title?.name,
                                                                type: validationErrors?.title?.type,
                                                            })}
                                                    </div> */}
                                </div>
                            </div>
                        </>

                        <>
                            <div
                                className="sustainability--page-heading-input-holder--heading"
                                style={editDisabled ? { pointerEvents: "none" } : {}}
                            >
                                <div className="sustainability--page-text-holder">
                                    <p>Product Price:</p>
                                </div>
                                <div className="heading--input--holder" style={{ display: "flex" }}>
                                    <div className="border-box-align-dpp">
                                        <CurrencySelect
                                            handleSelect={handleSelect}
                                            selectedCurrency={selectedCurrency}
                                            className="dropselectdpp"
                                        />
                                        <div className="border--select--dpp"></div>
                                        <svg
                                            width="21"
                                            height="21"
                                            viewBox="0 0 21 21"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M5.70876 7.37478C6.1017 6.98184 6.73877 6.98184 7.1317 7.37478L10.4449 10.688L13.7581 7.37478C14.1511 6.98184 14.7881 6.98184 15.1811 7.37478C15.574 7.76771 15.574 8.40479 15.1811 8.79772L11.1564 12.8224C10.7635 13.2153 10.1264 13.2153 9.73345 12.8224L5.70876 8.79772C5.31583 8.40479 5.31583 7.76771 5.70876 7.37478Z"
                                                fill="#111827"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        value={productPrice}
                                        className="sustainability--page-input-holder"
                                        type="number"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </>
                        <>
                            <div
                                className="sustainability--page-heading-input-holder--heading"
                                style={editDisabled ? { pointerEvents: "none" } : {}}
                            >
                                <div className="sustainability--page-text-holder">
                                    <p>Heading:</p>
                                </div>
                                <div className="heading--input--holder">
                                    <input
                                        // onKeyDown={handleKeyDown}
                                        onChange={(e) => setTitle(e.target.value)}
                                        value={title}
                                        className="sustainability--page-input-holder"
                                    />
                                    <div className="sustainability--invalid-message-holder position-absolute">
                                        {validationErrors?.title?.error &&
                                            generateInvalidMessage({
                                                name: validationErrors?.title?.name,
                                                type: validationErrors?.title?.type,
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
                                    <p>Product Highlights:</p>
                                </div>
                                <div className="heading--input--holder">
                                    <input
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) => setHighlight1(e.target.value)}
                                        value={highlight1}
                                        className="sustainability--page-input-holder"
                                    />
                                </div>
                                <div className="heading--input--holder">
                                    <input
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) => setHighlight2(e.target.value)}
                                        value={highlight2}
                                        className="sustainability--page-input-holder"
                                    />
                                </div>
                                <div className="heading--input--holder">
                                    <input
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) => setHighlight3(e.target.value)}
                                        value={highlight3}
                                        className="sustainability--page-input-holder"
                                    />
                                </div>
                                <div className="heading--input--holder">
                                    <input
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) => setHighlight4(e.target.value)}
                                        value={highlight4}
                                        className="sustainability--page-input-holder"
                                    />
                                </div>
                            </div>
                        </>
                        <>
                            <div className="sustainability--page-heading-input-holder--description">
                                <div className="sustainability--page-text-holder">
                                    <p>Description:</p>
                                </div>
                                <div className="sustainability--page--error--textarea--wrapper">
                                    <div className="sustainability--page-input-wrapper">
                                        <textarea
                                            // onKeyDown={handleKeyDown}
                                            maxLength={1000}
                                            style={{ resize: "none" }}
                                            onChange={(e) => setDescription(e.target.value)}
                                            value={description}
                                            disabled={editDisabled}
                                            className="sustainability--page-input-holder--description"
                                        />
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div className="sustainability--invalid-message-holder">
                                                {validationErrors?.description?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.description?.name,
                                                        type: validationErrors?.description?.type,
                                                    })}
                                            </div>
                                            <p
                                                className={`counter-text--sustainability ${description?.length >= 1000 && `char-disallow`
                                                    }`}
                                            >{`${description?.length}/ 1000`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                        <>
                            <div className="sustainability--page-heading-input-holder--aboutUs">
                                <div className="sustainability--page-text-holder">
                                    <p>About us:</p>
                                </div>
                                <div className="sustainability--page--error--textarea--wrapper">
                                    <div className="sustainability--page-input-wrapper">
                                        <textarea
                                            maxLength={1000}
                                            disabled={editDisabled}
                                            // onKeyDown={handleKeyDown}
                                            style={{ resize: "none" }}
                                            onChange={(e) => setAboutUs(e.target.value)}
                                            className="sustainability--page-input-holder--aboutUs"
                                            value={aboutUs}
                                        />
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div className="sustainability--invalid-message-holder">
                                                {validationErrors?.aboutUs?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.aboutUs?.name,
                                                        type: validationErrors?.aboutUs?.type,
                                                        quote: true,
                                                    })}
                                            </div>
                                            <p
                                                className={`counter-text--sustainability ${aboutUs?.length >= 1000 && `char-disallow`
                                                    }`}
                                            >{`${aboutUs?.length}/ 1000`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                        <div
                            style={editDisabled ? { pointerEvents: "none" } : {}}
                            className="sustainability--country-main"
                        >
                            <div className="sustainability--page-country-holder">
                                <div className="sustainability--page-text-holder--country">
                                    <p>Country:</p>
                                </div>
                                <div style={{ width: "100%" }}>
                                    <div className="sustainability--page-input-holder--country" style={{ maxWidth: "100%" }}>
                                        <CountrySelector
                                            selectedCountry={selectedCountry}
                                            setSelectedCountry={setSelectedCountry}
                                            hideCarbon={true}
                                        />
                                        <div className="country--dropdown--arrow">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="30"
                                                height="29"
                                                fill="none"
                                                viewBox="0 0 30 29"
                                            >
                                                <path
                                                    stroke="#333"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2.372"
                                                    d="M23.38 10.674l-8.303 8.302-8.302-8.302"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                    {/* {validationErrors?.country && "Please select a country"} */}
                                </div>
                            </div>
                        </div>
                        <>
                            <div
                                className="sustainability--page-heading-input-holder--heading"
                                style={editDisabled ? { pointerEvents: "none" } : {}}
                            >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div className="sustainability--page-text-holder">
                                        <div style={{ color: "#333", fontWeight: 500 }}>Product Certifications:*</div>
                                    </div>
                                    <div
                                        className="sustainability--information-holder"
                                    >

                                        <span><Tooltip
                                            className="iconHover"
                                            title="Product Certifications"
                                            position="bottom"
                                            trigger="mouseenter"
                                            animation="shift"
                                            arrow={true}
                                            duration={200}
                                        >
                                            <MdInfoOutline
                                                style={{
                                                    pointerEvents: "all",
                                                    width: "20px",
                                                    height: "20px",
                                                }}
                                            />
                                        </Tooltip></span>
                                    </div>
                                </div>
                                {certData?.map((form, index) => (
                                    <div className="heading--input--holder" key={index} style={{ border: "1px solid lightgray", position: "relative", marginBottom: "25px", borderBottom: "none" }}>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            value={form.name}
                                            name="name"
                                            className="sustainability--page-input-holder"
                                            placeholder="Certificate Name"
                                            onChange={(e) => handleChangeCert(index, e)}
                                        />
                                        <input
                                            onKeyDown={handleKeyDown}
                                            name="link"
                                            onChange={(e) => handleChangeCert(index, e)}
                                            value={form.link}
                                            className="sustainability--page-input-holder"
                                            placeholder="Certificate Link"
                                        />

                                        <div className="delete-img" style={{ display: certData.length == 1 && "none", top: "-15px", right: "-15px" }} onClick={(e) => handleDeleteCert(e, index)}>&#x2715;</div>
                                    </div>
                                ))}
                                <button style={editDisabled ? { display: "none" } : { width: "200px" }} className="sustainability--edit-button sustainability-save" onClick={handleAddCert}>Add&nbsp;New</button>
                                <br />

                            </div>
                        </>
                        <>
                            <div
                                className="sustainability--page-heading-input-holder--heading"
                                style={editDisabled ? { pointerEvents: "none" } : {}}
                            >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div className="sustainability--page-text-holder">
                                        <div style={{ color: "#333", fontWeight: 500 }}>Chain of Custody:*</div>
                                    </div>
                                    <div
                                        className="sustainability--information-holder"
                                    >

                                        <span><Tooltip
                                            className="iconHover"
                                            title="Chain Of Custody"
                                            position="bottom"
                                            trigger="mouseenter"
                                            animation="shift"
                                            arrow={true}
                                            duration={200}
                                        >
                                            <MdInfoOutline
                                                style={{
                                                    pointerEvents: "all",
                                                    width: "20px",
                                                    height: "20px",
                                                }}
                                            />
                                        </Tooltip></span>
                                    </div>
                                </div>
                                {chainData?.map((form, index) => (
                                    <div className="heading--input--holder" key={index} style={{ border: "1px solid lightgray", position: "relative", marginBottom: "25px", borderBottom: "none" }}>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            value={form.custodyType}
                                            name="custodyType"
                                            className="sustainability--page-input-holder"
                                            placeholder="Name"
                                            onChange={(e) => handleChange(index, e)}
                                        />
                                        <input
                                            onKeyDown={handleKeyDown}
                                            type="date"
                                            name="date"
                                            onChange={(e) => handleChange(index, e)}
                                            value={form.date}
                                            className="sustainability--page-input-holder"
                                            placeholder="Date"
                                        />
                                        <input
                                            onKeyDown={handleKeyDown}
                                            name="address"
                                            onChange={(e) => handleChange(index, e)}
                                            value={form.address}
                                            className="sustainability--page-input-holder"
                                            placeholder="Address"
                                        />
                                        <input
                                            onKeyDown={handleKeyDown}
                                            name="linkName"
                                            onChange={(e) => handleChange(index, e)}
                                            value={form.linkName}
                                            className="sustainability--page-input-holder"
                                            placeholder="Label"
                                        />
                                        <input
                                            onKeyDown={handleKeyDown}
                                            name="link"
                                            onChange={(e) => handleChange(index, e)}
                                            value={form.link}
                                            className="sustainability--page-input-holder"
                                            placeholder="Link"
                                        />
                                        <div className="delete-img" style={{ display: chainData.length == 1 && "none", top: "-15px", right: "-15px" }} onClick={(e) => handleDeleteChain(e, index)}>&#x2715;</div>
                                    </div>
                                ))}
                                <button style={editDisabled ? { display: "none" } : { width: "200px" }} className="sustainability--edit-button sustainability-save" onClick={handleAddChain}>Add&nbsp;New</button>
                                <br />
                            </div>
                        </>
                        <div
                            className="sustainability--page-profilePicture-holder"
                            style={editDisabled ? { pointerEvents: "none" } : {}}
                        >
                            <div className="sustainability--page-text-holder--profilePicture">
                                <p>Company Logo:</p>
                            </div>
                            <div className="sustainability--page-profilePicture-input-holder--wrapper">
                                <div className="sustainability--page-profilePicture-input-holder">
                                    <NewFileUpload
                                        previews={imageLogo}
                                        setPreviews={setImageLogo}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="sustainability--page-profilePicture-holder"
                            style={editDisabled ? { pointerEvents: "none" } : {}}
                        >
                            <div className="sustainability--page-text-holder--profilePicture">
                                <p>CEO Signature (Optional):</p>
                            </div>
                            <div className="sustainability--page-profilePicture-input-holder--wrapper">
                                <div className="sustainability--page-profilePicture-input-holder">
                                    <NewFileUpload
                                        previews={signature}
                                        setPreviews={setSignature}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div
                            className="sustainability--page-profilePicture-holder"
                            style={editDisabled ? { pointerEvents: "none" } : {}}
                        >
                            <div className="sustainability--page-text-holder--profilePicture">
                                <p>Product Images:</p>
                            </div>
                            <div className="sustainability--page-profilePicture-input-holder--wrapper">
                                <div className="sustainability--page-profilePicture-input-holder">
                                    <NewMultipleFileUpload
                                        previews={previews}
                                        setPreviews={setPreviews}
                                    />
                                </div>
                            </div>
                        </div> */}
                        <div
                            className="sustainability--page-profilePicture-holder"
                            style={editDisabled ? { pointerEvents: "none" } : {}}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div className="sustainability--page-text-holder">
                                    <div style={{ color: "#333", fontWeight: 500 }}>Product Images:*</div>
                                </div>
                                <div
                                    className="sustainability--information-holder"
                                >

                                    <span><Tooltip
                                        className="iconHover"
                                        title="Product Images"
                                        position="bottom"
                                        trigger="mouseenter"
                                        animation="shift"
                                        arrow={true}
                                        duration={200}
                                    >
                                        <MdInfoOutline
                                            style={{
                                                pointerEvents: "all",
                                                width: "20px",
                                                height: "20px",
                                            }}
                                        />
                                    </Tooltip></span>
                                </div>
                            </div>
                            <div className="sustainability--page-profilePicture-input-holder--wrapper">
                                <div className="sustainability--page-profilePicture-input-holder">
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "150px" }}>
                                        {previews.map((preview, index) => (
                                            <div style={{ position: "relative" }}>
                                                <img key={index} src={preview} alt="preview" style={{ height: "140px", width: "140px", border: "1px solid lightgrey" }} />
                                                <div className="delete-img" onClick={() => handleImage(preview)}>&#x2715;</div>
                                                <br />
                                            </div>
                                        ))}
                                        <div className="sustainability--page-profilePicture-input-holder--wrapper" style={{ display: previews.length >= 5 && "none" }}>
                                            <div className="sustainability--page-profilePicture-input-holder">
                                                <NewMultipleFileUpload
                                                    previews={previews}
                                                    setPreviews={setPreviews}
                                                // fileInputRef={multipleFileInputRef}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        style={editDisabled ? { pointerEvents: "none" } : {}}
                        className="sustainability--template-section-holder"
                    >
                        <h3>Select a Template</h3>
                        <div className="sustainability--template--selection-holder">
                            <div
                                className="sustainability--each-template"
                                onClick={() => setThemeSelected("blue")}
                            >
                                <div className="sustainability--each-template-image-holder">
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_UI_URL +
                                            "/assets/images/sustainability/blue.png"
                                        }
                                        className="img-responsive"
                                    />
                                </div>
                                <div className="sustainability--each-template-text-select-holder">
                                    <p>Template1</p>
                                    <div
                                        className={`sustainability--each-template-check-holder ${themeSelected === "blue" ? "template-clicked" : ""
                                            }`}
                                    >
                                        <div className="big-checkmark">
                                            <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="small-checkmark">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    fill="#fff"
                                                    fillRule="evenodd"
                                                    d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="sustainability--each-template"
                                onClick={() => setThemeSelected("gray")}
                            >
                                <div className="sustainability--each-template-image-holder">
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_UI_URL +
                                            "/assets/images/sustainability/template2.png"
                                        }
                                        className="img-responsive"
                                    />
                                </div>
                                <div className="sustainability--each-template-text-select-holder">
                                    <p>Template 2</p>
                                    <div
                                        className={`sustainability--each-template-check-holder ${themeSelected === "gray" ? "template-clicked" : ""
                                            }`}
                                    >
                                        <div className="big-checkmark">
                                            <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="small-checkmark">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    fill="#fff"
                                                    fillRule="evenodd"
                                                    d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="sustainability--each-template"
                                onClick={() => setThemeSelected("white")}
                            >
                                <div className={`sustainability--each-template-image-holder`}>
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_UI_URL +
                                            "/assets/images/sustainability/template3.png"
                                        }
                                        className="img-responsive"
                                    />
                                </div>
                                <div className="sustainability--each-template-text-select-holder">
                                    <p>Template 3</p>
                                    <div
                                        className={`sustainability--each-template-check-holder ${themeSelected === "white" ? "template-clicked" : ""
                                            }`}
                                    >
                                        <div className="big-checkmark">
                                            <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="small-checkmark">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    fill="#fff"
                                                    fillRule="evenodd"
                                                    d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="sustainability--each-template"
                                onClick={() => setThemeSelected("template4")}
                            >
                                <div className="sustainability--each-template-image-holder">
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_UI_URL +
                                            "/assets/images/sustainability/template4.png"
                                        }
                                        className="img-responsive"
                                    />
                                </div>
                                <div className="sustainability--each-template-text-select-holder">
                                    <p>Template 4</p>
                                    <div
                                        className={`sustainability--each-template-check-holder ${themeSelected === "template4" ? "template-clicked" : ""
                                            }`}
                                    >
                                        {" "}
                                        <div className="big-checkmark">
                                            <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="small-checkmark">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    fill="#fff"
                                                    fillRule="evenodd"
                                                    d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>{" "}
                            <div
                                className="sustainability--each-template"
                                onClick={() => setThemeSelected("beige")}
                            // onClick={
                            //   () =>
                            //     addToast("Theme not available yet!", {
                            //       // appearance: "error",
                            //       autoDismiss: true,
                            //     })

                            //   // addToast("Theme not available yet!")
                            // }
                            >
                                <div className="sustainability--each-template-image-holder">
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_UI_URL +
                                            "/assets/images/sustainability/template5.png"
                                        }
                                        className="img-responsive"
                                    />
                                </div>
                                <div className="sustainability--each-template-text-select-holder">
                                    <p>Template 5</p>
                                    <div
                                        className={`sustainability--each-template-check-holder ${themeSelected === "beige" ? "template-clicked" : ""
                                            }`}
                                    >
                                        <div className="big-checkmark">
                                            <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="small-checkmark">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    fill="#fff"
                                                    fillRule="evenodd"
                                                    d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="sustainability--each-template"
                                onClick={() => setThemeSelected("pink")}
                            // onClick={
                            //   () =>
                            //     addToast("Theme not available yet!", {
                            //       // appearance: "error",
                            //       autoDismiss: true,
                            //     })

                            //   // addToast("Theme not available yet!")
                            // }
                            >
                                <div className="sustainability--each-template-image-holder">
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_UI_URL +
                                            "/assets/images/sustainability/template6.png"
                                        }
                                        className="img-responsive"
                                    />
                                </div>
                                <div className="sustainability--each-template-text-select-holder">
                                    <p>Template 6</p>
                                    <div
                                        className={`sustainability--each-template-check-holder ${themeSelected === "pink" ? "template-clicked" : ""
                                            }`}
                                    >
                                        <div className="big-checkmark">
                                            <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="small-checkmark">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    fill="#fff"
                                                    fillRule="evenodd"
                                                    d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="sustainability--each-template"
                                onClick={() => setThemeSelected("white2")}
                            >
                                <div className="sustainability--each-template-image-holder">
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_UI_URL +
                                            "/assets/images/sustainability/template3.png"
                                        }
                                        className="img-responsive"
                                    />
                                </div>
                                <div className="sustainability--each-template-text-select-holder">
                                    <p>Template 7</p>
                                    <div
                                        className={`sustainability--each-template-check-holder ${themeSelected === "white2" ? "template-clicked" : ""
                                            }`}
                                    >
                                        <div className="big-checkmark">
                                            <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="small-checkmark">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    fill="#fff"
                                                    fillRule="evenodd"
                                                    d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="sustainability--each-template"
                                onClick={() => setThemeSelected("template8")}
                            >
                                <div className="sustainability--each-template-image-holder">
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_UI_URL +
                                            "/assets/images/sustainability/template8.png"
                                        }
                                        className="img-responsive"
                                    />
                                </div>
                                <div className="sustainability--each-template-text-select-holder">
                                    <p>Template 8</p>
                                    <div
                                        className={`sustainability--each-template-check-holder ${themeSelected === "template8" ? "template-clicked" : ""
                                            }`}
                                    >
                                        <div className="big-checkmark">
                                            <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="small-checkmark">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    fill="#fff"
                                                    fillRule="evenodd"
                                                    d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div
                                className="sustainability--each-template"
                            onClick={() => setThemeSelected("beigelogo")}

                            >
                                <div className="sustainability--each-template-image-holder">
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_UI_URL +
                                            "/assets/images/sustainability/beige.png"
                                        }
                                        className="img-responsive"
                                    />
                                </div>
                                <div className="sustainability--each-template-text-select-holder">
                                    <p>Beige Logo</p>
                                    <div
                                        className={`sustainability--each-template-check-holder ${themeSelected === "beigelogo" ? "template-clicked" : ""
                                            }`}
                                    >
                                        <div className="big-checkmark">
                                            <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="small-checkmark">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    fill="#fff"
                                                    fillRule="evenodd"
                                                    d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="sustainability--each-template"
                            onClick={() => setThemeSelected("whitelogo")}
                            >
                                <div className={`sustainability--each-template-image-holder`}>
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_UI_URL +
                                            "/assets/images/sustainability/white.png"
                                        }
                                        className="img-responsive"
                                    />
                                </div>
                                <div className="sustainability--each-template-text-select-holder">
                                    <p>White Logo</p>
                                    <div
                                        className={`sustainability--each-template-check-holder ${themeSelected === "whitelogo" ? "template-clicked" : ""
                                            }`}
                                    >
                                        <div className="big-checkmark">
                                            <svg
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="small-checkmark">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    fill="#fff"
                                                    fillRule="evenodd"
                                                    d="M11.011 4.3a.628.628 0 010 .889l-5.026 5.027a.628.628 0 01-.89 0L2.583 7.702a.628.628 0 01.89-.888L5.54 8.883 10.123 4.3a.628.628 0 01.889 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <>
                        <div
                            className="sustainability--page-heading-input-holder--heading"
                            style={editDisabled ? { pointerEvents: "none", margin: "auto" } : { margin: "auto" }}
                        >
                            <div className="sustainability--page-text-holder">
                                <p>Color Palette:</p>
                            </div>
                            <div className="heading--input--holder" style={{ display: "flex" }}>
                                <input style={{ width: "50px" }}
                                    type="color"
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setColorPalette(e.target.value)}
                                    value={colorPalette}
                                    className="colorpalette"
                                />
                                <input type="text" value={colorPalette} className="sustainability--page-input-holder" />
                                {/* <div className="sustainability--invalid-message-holder position-absolute">
                                                        {validationErrors?.title?.error &&
                                                            generateInvalidMessage({
                                                                name: validationErrors?.title?.name,
                                                                type: validationErrors?.title?.type,
                                                            })}
                                                    </div> */}
                            </div>
                        </div>
                    </>
                    <div
                        className="sustainability--template-section-holder"
                        style={editDisabled ? { pointerEvents: "none" } : {}}
                    >
                        <h3>Environmental impact (optional)</h3>
                        <div className="contact-info-holder">
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-text-holder--contact">
                                    <p>CO2 Emission (in Kg): </p>
                                </div>
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                onChange={(e) => [
                                                    setCarbonEmission(e.target.value),
                                                    !e.target.value ? setShowEmission(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                value={carbonEmission}
                                                onKeyDown={handleKeyDown}
                                                type="number"
                                                step="0.01"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.emission?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.emission?.name,
                                                        type: validationErrors?.emission?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showEmission ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showEmission}
                                                    setDisplay={() =>
                                                        toggleButton(setShowEmission, carbonEmission, "emission")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showEmission}
                                                    setDisplay={() =>
                                                        toggleButton(setShowEmission, carbonEmission, "emission")
                                                    }
                                                />
                                            </div>
                                            <p
                                                style={
                                                    !showEmission ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>Energy Consumption (in KWh): </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                onChange={(e) => [
                                                    setConsumption(e.target.value),
                                                    !e.target.value ? setShowConsumption(false) : "",
                                                ]}
                                                value={consumption}
                                                onKeyDown={handleKeyDown}
                                                className="sustainability--page-input-holder--contact"
                                                type="number"
                                                step="0.01"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.consumption?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.consumption?.name,
                                                        type: validationErrors?.consumption?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showConsumption ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>

                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showConsumption}
                                                    setDisplay={() =>
                                                        toggleButton(setShowConsumption, consumption, "consumption")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showConsumption}
                                                    setDisplay={() =>
                                                        toggleButton(setShowConsumption, consumption, "consumption")
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showConsumption
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>Water Usage (in L): </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                onChange={(e) => [
                                                    setWaterUsage(e.target.value),
                                                    !e.target.value ? setShowWaterUsage(false) : "",
                                                ]}
                                                value={waterUsage}
                                                onKeyDown={handleKeyDown}
                                                className="sustainability--page-input-holder--contact"
                                                type="number"
                                                step="0.01"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.waterUsage?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.waterUsage?.name,
                                                        type: validationErrors?.waterUsage?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showWaterUsage
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showWaterUsage}
                                                    setDisplay={() =>
                                                        toggleButton(setShowWaterUsage, waterUsage, "waterUsage")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={waterUsage}
                                                    setDisplay={() =>
                                                        toggleButton(setShowWaterUsage, waterUsage, "waterUsage")
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showTwitter
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>Recycled Material (in %): </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                value={recycledMaterial}
                                                onKeyDown={handleKeyDown}
                                                onChange={(e) => [
                                                    setRecycledMaterial(e.target.value),
                                                    !e.target.value ? setShowRecycledMaterial(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                type="number"
                                                step="0.01"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.recycledMaterial?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.recycledMaterial?.name,
                                                        type: validationErrors?.recycledMaterial?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showRecycledMaterial
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>

                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showRecycledMaterial}
                                                    setDisplay={() =>
                                                        toggleButton(
                                                            setShowRecycledMaterial,
                                                            recycledMaterial,
                                                            "recycledMaterial"
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showRecycledMaterial}
                                                    setDisplay={() =>
                                                        toggleButton(
                                                            setShowRecycledMaterial,
                                                            recycledMaterial,
                                                            "recycledMaterial"
                                                        )
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showRecycledMaterial
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>Upcycled Material (in %): </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                value={upcycledMaterial}
                                                onKeyDown={handleKeyDown}
                                                onChange={(e) => [
                                                    setUpcycledMaterial(e.target.value),
                                                    !e.target.value ? setShowUpcycledMaterial(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                type="number"
                                                step="0.01"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.upcycledMaterial?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.upcycledMaterial?.name,
                                                        type: validationErrors?.upcycledMaterial?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showUpcycledMaterial
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>

                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showUpcycledMaterial}
                                                    setDisplay={() =>
                                                        toggleButton(
                                                            setShowUpcycledMaterial,
                                                            upcycledMaterial,
                                                            "upcycledMaterial"
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showUpcycledMaterial}
                                                    setDisplay={() =>
                                                        toggleButton(
                                                            setShowUpcycledMaterial,
                                                            upcycledMaterial,
                                                            "upcycledMaterial"
                                                        )
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showUpcycledMaterial
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="sustainability--template-section-holder"
                        style={editDisabled ? { pointerEvents: "none" } : {}}
                    >
                        <h3>Contact info (optional)</h3>
                        <div className="contact-info-holder">
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability" style={{ display: businessPage?.split("/")[4] == "undefined" ? "none" : "" }}>
                                <div className="sustainability--page-text-holder--contact">
                                    <p>Business Ecostance Page: </p>
                                </div>
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div style={{ pointerEvents: "none" }}>
                                            <input
                                                onChange={(e) => [
                                                    setBusinessPage(e.target.value),
                                                    !e.target.value ? setShowBusinessPage(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                value={businessPage}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.businessPage?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.businessPage?.name,
                                                        type: validationErrors?.businessPage?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showBusinessPage ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showBusinessPage}
                                                    setDisplay={() =>
                                                        toggleButton(setShowBusinessPage, businessPage, "businessPage")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showBusinessPage}
                                                    setDisplay={() =>
                                                        toggleButton(setShowBusinessPage, businessPage, "businessPage")
                                                    }
                                                />
                                            </div>
                                            <p
                                                style={
                                                    !showBusinessPage ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-text-holder--contact">
                                    <p>Business Name: </p>
                                </div>
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div style={{ pointerEvents: "none" }}>
                                            <input
                                                onChange={(e) => [
                                                    setName(e.target.value),
                                                    !e.target.value ? setShowName(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                value={name}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.name?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.name?.name,
                                                        type: validationErrors?.name?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showName ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showName}
                                                    setDisplay={() =>
                                                        toggleButton(setShowName, name, "name")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showName}
                                                    setDisplay={() =>
                                                        toggleButton(setShowName, name, "name")
                                                    }
                                                />
                                            </div>
                                            <p
                                                style={
                                                    !showName ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability" style={{ display: businessPage?.split("/")[4] == "undefined" ? "none" : "" }}>
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>Contact Phone: </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div style={editDisabled ? { pointerEvents: "none" } : {}}>
                                            <PhoneInputJSX
                                                handleChangeValue={handlePhoneChange}
                                                number={phone}
                                                country={"us"}
                                                name={"phone"}
                                                handleKeyPressSubmit={() => console.log("Key")}
                                                handleOnBlur={() => console.log("onBlured")}
                                                setPhoneInfo={setPhoneInfo}
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.contact?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.phone?.name,
                                                        type: validationErrors?.phone?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showPhone ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>

                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showPhone}
                                                    setDisplay={() =>
                                                        toggleButton(setShowPhone, phone, "phone")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showPhone}
                                                    setDisplay={() =>
                                                        toggleButton(setShowPhone, phone, "phone")
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showPhone
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>Contact Email: </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div style={{ pointerEvents: "none" }}>
                                            <input
                                                onChange={(e) => [
                                                    setEmail(e.target.value),
                                                    !e.target.value ? setShowEmail(false) : "",
                                                ]}
                                                value={email}
                                                onKeyDown={handleKeyDown}
                                                className="sustainability--page-input-holder--contact"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.email?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.email?.name,
                                                        type: validationErrors?.email?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showEmail ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>

                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showEmail}
                                                    setDisplay={() =>
                                                        toggleButton(setShowEmail, email, "email")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showEmail}
                                                    setDisplay={() =>
                                                        toggleButton(setShowEmail, email, "email")
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showEmail
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div
                        className="sustainability--template-section-holder"
                        style={editDisabled ? { pointerEvents: "none" } : {}}
                    >
                        <h3>Footer</h3>
                        <h4 style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>About Section
                            <Tooltip style={{ marginLeft: "4px" }}
                                className="iconHover"
                                html={
                                    <div style={{ whiteSpace: "pre-line", textAlign: "center" }}>
                                        This is about the  <br /> company section. <br /> This section will <br /> be displayed on the <br /> the footer of the page.
                                    </div>
                                }
                                position="bottom"
                                trigger="mouseenter"
                                animation="shift"
                                arrow={true}
                                duration={200}
                            >
                                <MdInfoOutline
                                    style={{
                                        pointerEvents: "all",
                                        width: "20px",
                                        height: "20px",
                                    }}
                                />
                            </Tooltip>
                        </h4>
                        <div className="contact-info-holder">
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-text-holder--contact">
                                    <p>About Us: </p>
                                </div>
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                onChange={(e) => [
                                                    setAboutLink(e.target.value),
                                                    !e.target.value ? setShowAboutLink(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                value={aboutLink}
                                                onKeyDown={handleKeyDown}
                                                placeholder="https://www.company.com/about"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.aboutLink?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.aboutLink?.name,
                                                        type: validationErrors?.aboutLink?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showAboutLink ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showAboutLink}
                                                    setDisplay={() =>
                                                        toggleButton(setShowAboutLink, aboutLink, "aboutLink")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showAboutLink}
                                                    setDisplay={() =>
                                                        toggleButton(setShowAboutLink, aboutLink, "aboutLink")
                                                    }
                                                />
                                            </div>
                                            <p
                                                style={
                                                    !showAboutLink ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>Contact: </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                onChange={(e) => [
                                                    setContact(e.target.value),
                                                    !e.target.value ? setShowContact(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                value={contact}
                                                onKeyDown={handleKeyDown}
                                                placeholder="https://www.company.com/contact"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.contact?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.contact?.name,
                                                        type: validationErrors?.contact?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showContact ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>

                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showContact}
                                                    setDisplay={() =>
                                                        toggleButton(setShowContact, contact, "contact")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showContact}
                                                    setDisplay={() =>
                                                        toggleButton(setShowContact, contact, "contact")
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showContact
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-text-holder--contact">
                                    <p>Business Address: </p>
                                </div>
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                onChange={(e) => [
                                                    setAddress(e.target.value),
                                                    !e.target.value ? setShowAddress(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                value={address}
                                                onKeyDown={handleKeyDown}
                                                placeholder="https://www.company.com/address"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.address?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.address?.name,
                                                        type: validationErrors?.address?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showAddress ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showAddress}
                                                    setDisplay={() =>
                                                        toggleButton(setShowAddress, address, "address")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showAddress}
                                                    setDisplay={() =>
                                                        toggleButton(setShowAddress, address, "address")
                                                    }
                                                />
                                            </div>
                                            <p
                                                style={
                                                    !showAddress ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>FAQ's: </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                onChange={(e) => [
                                                    setFaq(e.target.value),
                                                    !e.target.value ? setShowFaq(false) : "",
                                                ]}
                                                value={faq}
                                                onKeyDown={handleKeyDown}
                                                className="sustainability--page-input-holder--contact"
                                                placeholder="https://www.company.com/faq"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.faq?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.faq?.name,
                                                        type: validationErrors?.faq?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showFaq ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>

                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showFaq}
                                                    setDisplay={() =>
                                                        toggleButton(setShowFaq, faq, "faq")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showFaq}
                                                    setDisplay={() =>
                                                        toggleButton(setShowFaq, faq, "faq")
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showFaq
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h4 style={{ marginTop: "100px", display: "flex", alignItems: "center" }}>Useful Links Section
                            <Tooltip style={{ marginLeft: "4px" }}
                                className="iconHover"
                                html={
                                    <div style={{ whiteSpace: "pre-line", textAlign: "center" }}>
                                        This is useful  <br /> links section. <br /> This section will <br /> be displayed on the <br /> the footer of the page.
                                    </div>
                                }
                                position="bottom"
                                trigger="mouseenter"
                                animation="shift"
                                arrow={true}
                                duration={200}
                            >
                                <MdInfoOutline
                                    style={{
                                        pointerEvents: "all",
                                        width: "20px",
                                        height: "20px",
                                    }}
                                />
                            </Tooltip>
                        </h4>
                        <div className="contact-info-holder">
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-text-holder--contact">
                                </div>
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <div style={{ display: "flex" }}>
                                                <input style={{ width: "25%" }}
                                                    onChange={(e) => [
                                                        setUserfulKey1(e.target.value),
                                                    ]}
                                                    className="sustainability--page-input-holder--contact"
                                                    value={usefulKey1}
                                                    placeholder="Returns"
                                                    onKeyDown={handleKeyDown}
                                                />

                                                <input style={{ marginLeft: "30px", width: "70%" }}
                                                    onChange={(e) => [
                                                        setUserfulValue1(e.target.value),
                                                        !e.target.value ? setShowUsefulValue1(false) : "",
                                                    ]}
                                                    placeholder="https://www.company.com/returns"
                                                    className="sustainability--page-input-holder--contact"
                                                    value={usefulValue1}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </div>
                                            <div className="sustainability--invalid-message-holder position-absolute" style={{ display: "flex", width: "100%" }}>
                                                <div>{validationErrors?.usefulValue1?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.usefulValue1?.name,
                                                        type: validationErrors?.usefulValue1?.type,
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showUsefulValue1 ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showUsefulValue1}
                                                    setDisplay={() =>
                                                        toggleButton(setShowUsefulValue1, usefulValue1, "usefulValue1")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showUsefulValue1}
                                                    setDisplay={() =>
                                                        toggleButton(setShowUsefulValue1, usefulValue1, "usefulValue1")
                                                    }
                                                />
                                            </div>
                                            <p
                                                style={
                                                    !showUsefulValue1 ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-text-holder--contact">
                                </div>
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <div style={{ display: "flex" }}>
                                                <input style={{ width: "25%" }}
                                                    onChange={(e) => [
                                                        setUserfulKey2(e.target.value),
                                                    ]}
                                                    className="sustainability--page-input-holder--contact"
                                                    value={usefulKey2}
                                                    placeholder="Support Policy"
                                                    onKeyDown={handleKeyDown}
                                                />

                                                <input style={{ marginLeft: "30px", width: "70%" }}
                                                    onChange={(e) => [
                                                        setUserfulValue2(e.target.value),
                                                        !e.target.value ? setShowUsefulValue2(false) : "",
                                                    ]}
                                                    placeholder="https://www.company.com/supportpolicy"
                                                    className="sustainability--page-input-holder--contact"
                                                    value={usefulValue2}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </div>
                                            <div className="sustainability--invalid-message-holder position-absolute" style={{ display: "flex", width: "100%" }}>
                                                <div>{validationErrors?.usefulValue2?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.usefulValue2?.name,
                                                        type: validationErrors?.usefulValue2?.type,
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showUsefulValue2 ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showUsefulValue2}
                                                    setDisplay={() =>
                                                        toggleButton(setShowUsefulValue2, usefulValue2, "usefulValue2")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showUsefulValue2}
                                                    setDisplay={() =>
                                                        toggleButton(setShowUsefulValue2, usefulValue2, "usefulValue2")
                                                    }
                                                />
                                            </div>
                                            <p
                                                style={
                                                    !showUsefulValue2 ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-text-holder--contact">
                                </div>
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <div style={{ display: "flex" }}>
                                                <input style={{ width: "25%" }}
                                                    onChange={(e) => [
                                                        setUserfulKey3(e.target.value),
                                                    ]}
                                                    className="sustainability--page-input-holder--contact"
                                                    value={usefulKey3}
                                                    placeholder="Size guide"
                                                    onKeyDown={handleKeyDown}
                                                />

                                                <input style={{ marginLeft: "30px", width: "70%" }}
                                                    onChange={(e) => [
                                                        setUserfulValue3(e.target.value),
                                                        !e.target.value ? setShowUsefulValue3(false) : "",
                                                    ]}
                                                    placeholder="https://www.company.com/size"
                                                    className="sustainability--page-input-holder--contact"
                                                    value={usefulValue3}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </div>
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.usefulValue3?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.usefulValue3?.name,
                                                        type: validationErrors?.usefulValue3?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showUsefulValue3 ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showUsefulValue3}
                                                    setDisplay={() =>
                                                        toggleButton(setShowUsefulValue3, usefulValue3, "usefulValue3")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showUsefulValue3}
                                                    setDisplay={() =>
                                                        toggleButton(setShowUsefulValue3, usefulValue3, "usefulValue3")
                                                    }
                                                />
                                            </div>
                                            <p
                                                style={
                                                    !showUsefulValue3 ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-text-holder--contact">
                                </div>
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <div style={{ display: "flex" }}>
                                                <input style={{ width: "25%" }}
                                                    onChange={(e) => [
                                                        setUserfulKey4(e.target.value),
                                                    ]}
                                                    className="sustainability--page-input-holder--contact"
                                                    value={usefulKey4}
                                                    placeholder="Store location"
                                                    onKeyDown={handleKeyDown}
                                                />

                                                <input style={{ marginLeft: "30px", width: "70%" }}
                                                    onChange={(e) => [
                                                        setUserfulValue4(e.target.value),
                                                        !e.target.value ? setShowUsefulValue4(false) : "",
                                                    ]}
                                                    placeholder="https://www.company.com/store"
                                                    className="sustainability--page-input-holder--contact"
                                                    value={usefulValue4}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </div>
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.usefulValue4?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.usefulValue4?.name,
                                                        type: validationErrors?.usefulValue4?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showUsefulValue4 ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showUsefulValue4}
                                                    setDisplay={() =>
                                                        toggleButton(setShowUsefulValue4, usefulValue4, "usefulValue4")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showUsefulValue4}
                                                    setDisplay={() =>
                                                        toggleButton(setShowUsefulValue4, usefulValue4, "usefulValue4")
                                                    }
                                                />
                                            </div>
                                            <p
                                                style={
                                                    !showUsefulValue4 ? { color: "#7E7E7E" } : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h4 style={{ marginTop: "100px", display: "flex", alignItems: "center" }}>Follow Us Section
                            <Tooltip style={{ marginLeft: "4px" }}
                                className="iconHover"
                                html={
                                    <div style={{ whiteSpace: "pre-line", textAlign: "center" }}>
                                        This is follow  <br /> us section. <br /> This section will <br /> be displayed on the <br /> the footer of the page.
                                    </div>
                                }
                                position="bottom"
                                trigger="mouseenter"
                                animation="shift"
                                arrow={true}
                                duration={200}
                            >
                                <MdInfoOutline
                                    style={{
                                        pointerEvents: "all",
                                        width: "20px",
                                        height: "20px",
                                    }}
                                />
                            </Tooltip>
                        </h4>
                        <div className="contact-info-holder">
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>Twitter: </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                onChange={(e) => [
                                                    setTwitter(e.target.value),
                                                    !e.target.value ? setShowTwitter(false) : "",
                                                ]}
                                                value={twitter}
                                                onKeyDown={handleKeyDown}
                                                className="sustainability--page-input-holder--contact"
                                                placeholder="https://x.com/name"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.twitter?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.twitter?.name,
                                                        type: validationErrors?.twitter?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showTwitter
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showTwitter}
                                                    setDisplay={() =>
                                                        toggleButton(setShowTwitter, twitter, "twitter")
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showTwitter}
                                                    setDisplay={() =>
                                                        toggleButton(setShowTwitter, twitter, "twitter")
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showTwitter
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>LinkedIn: </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                value={linkedin}
                                                onKeyDown={handleKeyDown}
                                                onChange={(e) => [
                                                    setLinkedIn(e.target.value),
                                                    !e.target.value ? setShowLinkedin(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                placeholder="https://linkedin.com/name"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.linkedin?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.linkedin?.name,
                                                        type: validationErrors?.linkedin?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showLinkedin
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>

                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showLinkedin}
                                                    setDisplay={() =>
                                                        toggleButton(
                                                            setShowLinkedin,
                                                            linkedin,
                                                            "linkedin"
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showLinkedin}
                                                    setDisplay={() =>
                                                        toggleButton(
                                                            setShowLinkedin,
                                                            linkedin,
                                                            "linkedin"
                                                        )
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showLinkedin
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>Instagram: </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                value={instagram}
                                                onKeyDown={handleKeyDown}
                                                onChange={(e) => [
                                                    setInstagram(e.target.value),
                                                    !e.target.value ? setShowInstagram(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                placeholder="https://instagram.com/name"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.instagram?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.instagram?.name,
                                                        type: validationErrors?.instagram?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showInstagram
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>

                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showInstagram}
                                                    setDisplay={() =>
                                                        toggleButton(
                                                            setShowInstagram,
                                                            instagram,
                                                            "instagram"
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showInstagram}
                                                    setDisplay={() =>
                                                        toggleButton(
                                                            setShowInstagram,
                                                            instagram,
                                                            "instagram"
                                                        )
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showInstagram
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                <div className="sustainability--page-slug-text-input-holder--contact">
                                    <div className="sustainability--page-text-holder--contact">
                                        <p>Facebook: </p>
                                    </div>
                                    <div className="sustainability--contact--error-input-wrapper">
                                        <div>
                                            <input
                                                value={facebook}
                                                onKeyDown={handleKeyDown}
                                                onChange={(e) => [
                                                    setFacebook(e.target.value),
                                                    !e.target.value ? setShowFacebook(false) : "",
                                                ]}
                                                className="sustainability--page-input-holder--contact"
                                                placeholder="https://facebook.com/name"
                                            />
                                            <div className="sustainability--invalid-message-holder position-absolute">
                                                {validationErrors?.facebook?.error &&
                                                    generateInvalidMessage({
                                                        name: validationErrors?.facebook?.name,
                                                        type: validationErrors?.facebook?.type,
                                                    })}
                                            </div>
                                        </div>
                                        <div className="sustainability--switch-button-holder">
                                            <p
                                                style={
                                                    showFacebook
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                            >
                                                Off
                                            </p>
                                            <div className="big-switch">
                                                <Switch
                                                    height={24}
                                                    width={46}
                                                    disabled={editDisabled}
                                                    display={showFacebook}
                                                    setDisplay={() =>
                                                        toggleButton(
                                                            setShowFacebook,
                                                            facebook,
                                                            "facebook"
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                className="small-switch"
                                                style={{ display: "none" }}
                                            >
                                                <Switch
                                                    height={12.93}
                                                    width={24.73}
                                                    display={showFacebook}
                                                    setDisplay={() =>
                                                        toggleButton(
                                                            setShowFacebook,
                                                            facebook,
                                                            "facebook"
                                                        )
                                                    }
                                                />
                                            </div>

                                            <p
                                                style={
                                                    !showFacebook
                                                        ? { color: "#7E7E7E" }
                                                        : { color: "#333" }
                                                }
                                                className="sustainability--toggle-switched"
                                            >
                                                On
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
        {
            localStorage.getItem("MyBusinessDetails") ? (
                // allProducts.length > 0 ?
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
                                    title="Copy Product Link"
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
                                        value={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`} // here you should keep the link/value(string) for which you are generation promocode
                                        size={250} // the dimension of the QR code (number)
                                        logoImage="/assets/images/logo.png" // URL of the logo you want to use, make sure it is a dynamic url
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
                                value={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
                                logoImage="/assets/images/logo.png"
                                size={100}

                            />
                        </div>
                    </div>

                    <p style={{ fontSize: "25px", fontWeight: 600, display: eventSwitch ? "" : "none" }}>{singleEvent?.conferanceName}, {singleEvent?.location}, {getDisplayDate(singleEvent?.conferanceStartDate)}</p>
                    <div style={{ display: "flex" }}>

                        <div style={{ width: "50%" }}>
                            <div style={{ display: "flex" }}>
                                <div className="card--boxes event-box">
                                    <div className="card--event--title">{totalCount}</div>
                                    <div className="event--subtitle">Total Number Of Products</div>
                                </div>
                                <div className="card--boxes  event-box">
                                    <div className="card--event--title">{addCommas(totalEmissions)}</div>
                                    <div className="event--subtitle">Total Emissions (in Metric Tons) from all Products</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", marginTop: "10px" }}>
                                <div className="card--boxes  event-box">
                                    <div className="card--event--title">{publishCount}</div>
                                    <div className="event--subtitle">Digital Product Pages Published</div>
                                </div>
                                <div className="card--boxes  event-box">
                                    <div className="card--event--title">0</div>
                                    <div className="event--subtitle">Total GHG reduced (in metric tons)</div>
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
                                {/* <div className="add--btn" onClick={() => setAddProductPopup(true)}> */}
                                <div className="add--product--btn" onClick={() => [
                                    setClearFields(true),
                                    setAddProductPopup(true)
                                ]}>Add Product</div>
                                {/* </div> */}
                                <div style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}>
                                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#000" }}>Product Details</div>

                                </div>
                            </div>
                            <div className="search--box" style={{ height: "45px" }}>
                                &nbsp;&nbsp;
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path></svg>
                                <input type="text" placeholder="search..." className="input--search" value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} />
                            </div>
                        </div>

                        <hr style={{ margin: 0 }} />
                        <div>
                            <div>
                                <div className="product--group--head">
                                    <div>No.</div>
                                    <div>Product Name</div>
                                    <div>Product Code</div>
                                    <div>Last Updated On</div>
                                    {/* <div>QR code</div> */}
                                    <div>Status</div>
                                    <div>QR Code</div>
                                    <div>Actions</div>
                                </div>
                                <hr style={{ margin: 0 }} />
                                <>
                                    {allProducts.filter(
                                        (item) =>
                                            item.formalName
                                                ?.toLowerCase()
                                                .includes(inputSearch.toLowerCase())
                                    ).map((item, index) => {

                                        return <div className="product--group--data" style={{ cursor: "pointer" }}>
                                            <div>{index + 1}.</div>
                                            <div>{item?.formalName}</div>
                                            <div>{item?.productCode}</div>
                                            <div>{formatTimestampToGMT(item?.updatedAt)} GMT</div>
                                            {/* <div style={{ marginTop: "-7px" }}>
                                                <QRCode
                                                    value={`${process.env.NEXT_PUBLIC_UI_URL}?conferenceCode=${singleEvent?.conferanceCode}`}
                                                    size={20}
                                                    enableCORS={true}
                                                    qrStyle="dots"
                                                    eyeRadius={10}
                                                    id={"qrID"}
                                                />
                                            </div> */}
                                            <div>{item?.isPublic ? "Published" : "Not Published"}</div>
                                            {/* <div><button style={{ display: !item?.isPublic && "none" }} className="purchaseBtn" 
                                            onClick={() => [handleSingleProduct(item?._id, "duplicate"), setOpenQr(true)]}>View</button></div> */}
                                            <div>
                                                <img src="/images/qr-code-img.png" alt="qrcode" width="25px"
                                                    onClick={() => [handleSingleProduct(item?._id, "duplicate"), setOpenQr(true)]} />
                                            </div>
                                            <div className="product-head-padding" style={{ display: "flex", gap: "10px", paddingLeft: "0px" }}>
                                                {/* <div className="actionBtn" onClick={() => handleSingleProduct(item?._id)}>
                                                        <p>Actions</p>
                                                    </div> */}
                                                <div className="btnview" onClick={() => handleSingleProduct(item?._id, "view")}>
                                                    <img src="/assets/images/eyeicon-grey.png" alt="viewdetails" className="iconview" />
                                                </div>
                                                <div className="btnview" onClick={() => handleSingleProduct(item?._id, "edit")}>
                                                    <img src="/images/editicon.png" alt="viewdetails" className="iconedit" />
                                                </div>
                                                <div className="btnview" onClick={() => [setDuplicatePopup(true), handleSingleProduct(item?._id, "duplicate")]}>
                                                    <img src="/assets/images/duplicateicon.svg" alt="viewdetails" className="iconduplicate" />
                                                </div>
                                                <div className="btnview" onClick={() => [setDeletePopup(true), setDeleteProductId(item?._id)]}>
                                                    <img src="/assets/images/deleteicon.png" alt="viewdetails" className="icondelete" />
                                                </div>
                                            </div>
                                        </div>
                                    })}

                                </>
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



                </div >
                // : <div className="sustainability--page-no-order-error" style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                //     <p>
                //         Add a product to view all your products
                //     </p>
                //     <div style={{ display: "flex", justifyContent: "center" }}>
                //         <div className="add--product--btn" onClick={() => setAddProductPopup(true)}>Add Product</div>
                //     </div>
                // </div>
            ) : (
                <div>
                    <p style={{ marginTop: "50px" }} className="text-center">
                        Create a Business to add digital product passport
                    </p>

                </div>
            )
        }
    </>;
};

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        sustainData: state.sustainabilityData,
    };
};
export default connect(mapStateToProps)(BusinessProduct);
// export default SocialSharing;
