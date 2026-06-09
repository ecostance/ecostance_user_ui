import { Suspense, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { getCertificates } from "src/apiClient/user";
import MultipleFileUpload from "./elements/multipleFileUpload";
import NewFileUpload from "./elements/newFileUpload"
import NewMultipleFileUpload from "./elements/newMultipleFileUpload"
import { addItemsToSustainabilityPage } from "../../redux/actions/sustainabilityActions";
import { returnCorrectCode } from "src/data/countryCodeToISO3";
import { getCountries } from "src/apiClient/country";
import { addBusinessProduct, uploadImage, businessProductSlugCheck } from "src/apiClient/business"
import LezadaBackdrop from "../lezadaBackdrop";
import CurrencySelect from "../helpers/currencySelect";
import { animateScroll } from "react-scroll";


import Switch from "./elements/Switch";
import { ToastProvider, useToasts } from "react-toast-notifications";
import {
    IoIosCopy,
    IoIosDownload,
    IoIosInformation,
    IoIosInformationCircleOutline,
    IoIosShareAlt,
    IoMdCopy,
    IoIosArrowRoundUp
} from "react-icons/io";

import {
    checkBusinessSlug,
    businessSlugData,
    getCurrentBusinessSustainabilityPage,
    getPreviousBusinessSustainabilityPage,
    getUserSettings,
    publishBusinessPage,
    updateSlug,
    updateUserBusinessSettingInfo,
} from "src/apiClient/businessSustainability";
import { validateUser } from "src/redux/actions/userAction";
import CountrySelector from "./elements/CountrySelector";
import Popup from "../popup";
import { useMyContext } from "src/Context";
import { countryNameToISO3 } from "src/data/countryNameToISO3";
import { me } from "src/apiClient/auth";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import PhoneInputJSX from "../Stripe/phoneInput";
import { returnPhoneDetails } from "src/helpers/returnPhoneDetails";
import { validatePhoneNumber } from "src/helpers/phoneValidation";
import { Tooltip } from "react-tippy";
import { BsCloudDownload } from "react-icons/bs";
import { MdCheck, MdContentCopy, MdInfoOutline } from "react-icons/md";
import { QRCode } from "react-qrcode-logo";
const INVALID_INPUT_LOW_CHAR = "INVALID_INPUT_LOW_CHAR";
const INVALID_INPUT_HIGH_CHAR = "INVALID_INPUT_HIGH_CHAR";
const INVALID_SLUG_REGEX_MATCH = "INVALID_SLUG_REGEX_MATCH";
const INVALID_CONTACT_FIELD = "INVALID_CONTACT_FIELD";
const INVALID_TOGGLE_OPERATION_NO_CHAR = "INVALID_TOGGLE_OPERATION_NO_CHAR";
const INVALID_FIELD_EMPTY = "INVALID_FIELD_EMPTY";
const SLUG_AVAILABLE = "SLUG_AVAILABLE";
const SLUG_UNAVAILABLE = "SLUG_UNAVAILABLE";
const SLUG_UNTOUCHED = "SLUG_UNTOUCHED";


const BusinessProductEdit = ({
    userData,
    sustainData,
    validateUser,
    triggerDefault,
    setTriggerDefault,
    clearFields,
    setClearFields,
    clearSustainabilityData,
    clearToSystemDefaults,
    addItemsToSustainabilityPage,
    editDisabled,
    setEditDisabled,
    resetToPageEnter,
    dataChanged,
    setDataChanged,
    secondUpdateV2,
    setSustainabilitySave,
    setSustainabilityHelperFunctions,
    defaultPopup,
    setDefaultPopup,
    refreshList,
    setRefreshList,
    addProductPopup,
    setAddProductPopup
}) => {
    const validationItemOnLength = {
        title: { min: 10, max: 50 },
        description: { min: 10, max: 1000 },
        aboutUs: { min: 10, max: 1000 },
        name: { min: 3, max: 100 },
        businessPage: { min: 3, max: 100 },
    };
    const slugRegex = /^[A-Za-z0-9]*$/;
    const { addToast } = useToasts();

    const router = useRouter();
    const slugInputRef = useRef(null);
    const [startDataFetched, setStartDataFetched] = useState(false);
    const [sustainabilityActionStates, setSustainabilityActionStates] = useState({
        slugChanged: false,
        slugAvailable: SLUG_UNTOUCHED,
        slugStatusChangedToTrue: false,
    });
    const [showStartAgainModal, setShowStartAgainModal] = useState({
        val: false,
        type: "",
    });

    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let emailId = localStorage.getItem("email")
    let businessCode = BusinessDetails?.businessCode
    let businessName = BusinessDetails?.name
    let defaultchain = [
        {
            custodyType: 'Design & Concept',
            date: '2022-04-01',
            address: 'Paris, France',
            linkName: "Transaction Cert",
            link: 'https://fhcm.paris/en/paris-fashion-week'
        },
        {
            custodyType: 'Raw Materials',
            date: '2023-04-01',
            address: 'Makati, Philippines',
            linkName: "Transaction Cert",
            link: 'https://www.textileinfomedia.com/business/philippines/apparel-and-garments'
        },
        {
            custodyType: 'Manufacturing',
            date: '2023-04-01',
            address: 'Haining, China',
            linkName: "Transaction Cert",
            link: 'https://mmsclothing.com/'
        },
        {
            custodyType: 'Assembling & Packaging',
            date: '2024-04-01',
            address: 'Haryana, India',
            linkName: "Transaction Cert",
            link: 'https://www.smsindia.com/'
        },
        {
            custodyType: 'Retail',
            date: '2025-04-01',
            address: 'USA , Europe, Canada',
            linkName: "Transaction Cert",
            link: 'https://www.amazon.com/b/ref=fs_xg_xgl_lp_surl?node=7141123011'
        }
    ]
    let defaultcert = [
        {
            name: 'Cradle to Cradle Certified™',
            link: 'https://c2ccertified.org/'
        },
        {
            name: 'Fair Trade Certified™',
            link: 'https://www.fairtradecertified.org/'
        },
        {
            name: 'Global Organic Textile Standard',
            link: 'https://global-standard.org/'
        }
    ]
    const [displaySlug, setDisplaySlug] = useState(false);
    const [title, setTitle] = useState("");
    const [highlight1, setHighlight1] = useState("Eco-friendly Materials");
    const [highlight2, setHighlight2] = useState("Low Carbon Footprint");
    const [highlight3, setHighlight3] = useState("Ethical Sourcing");
    const [highlight4, setHighlight4] = useState("Minimal Packaging");
    const [signature, setSignature] = useState("");
    const [certName1, setCertName1] = useState("Cradle to Cradle Certified™");
    const [certName2, setCertName2] = useState("Fair Trade Certified™");
    const [certName3, setCertName3] = useState("Global Organic Textile Standard");
    const [certName4, setCertName4] = useState("");
    const [certLink1, setCertLink1] = useState("https://c2ccertified.org/");
    const [certLink2, setCertLink2] = useState("https://www.fairtradecertified.org/");
    const [certLink3, setCertLink3] = useState("https://global-standard.org/");
    const [certLink4, setCertLink4] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("USD")
    const [chainData, setChainData] = useState(defaultchain)
    const [certData, setCertData] = useState(defaultcert)
    const [businessPage, setBusinessPage] = useState("")
    const [showBusinessPage, setShowBusinessPage] = useState(false)
    const [description, setDescription] = useState("We are reducing our greenhouse gas emissions everyday by wasting less, buying green, saving energy and by being conscientious consumers. But we can make only limited lifestyle changes. For our remaining emissions, we are buying carbon offsets to have a zero emission footprint. Each carbon offset we purchase goes into certified projects like planting new trees, reforestation, methane sequestration, ocean cleanup, and other such initiatives that help combat climate change today. We decided not to wait and do something today.");
    const [aboutUs, setAboutUs] = useState("We are a passionate team of environmental advocates, committed to making a meaningful impact through our sustainable product. Living in a world increasingly affected by climate change, we understand the urgency of taking immediate action. Our journey began in a place where we experienced firsthand the realities of rising sea levels and frequent flooding. This inspired us to create a solution that not only meets our needs but also contributes to a healthier planet.");
    const [name, setName] = useState(businessName);
    const [initSlug, setInitSlug] = useState("")
    const [fixedSlug, setFixedSlug] = useState("")
    const [phone, setPhone] = useState(
        sustainData?.phone ||
        userData?.billingAddress?.phone?.numericCode || "1" +
        userData?.billingAddress?.phone?.number || "1234567890"
    );
    const [email, setEmail] = useState(emailId);
    const [twitter, setTwitter] = useState("https://x.com/Microsoft");
    const [linkedin, setLinkedIn] = useState("https://www.linkedin.com/company/microsoft");
    const [instagram, setInstagram] = useState("https://www.instagram.com/microsoft/");
    const [facebook, setFacebook] = useState("https://www.facebook.com/MicrosoftIndia/");
    const [firstSlug, setFirstSlug] = useState("")
    const [image, setImage] = useState("");
    const [imageLogo, setImageLogo] = useState("")

    const [selectedCountry, setSelectedCountry] = useState(
        sustainData?.selectedCountry
    );

    const [showName, setShowName] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [showLinkedin, setShowLinkedin] = useState(false);
    const [showTwitter, setShowTwitter] = useState(false);
    const [showInstagram, setShowInstagram] = useState(false);
    const [showFacebook, setShowFacebook] = useState(false);
    const [productTag, setProductTag] = useState("Comfort, Casual");
    const [colorPalette, setColorPalette] = useState("");
    const [productPrice, setProductPrice] = useState("11.00");
    const [themeSelected, setThemeSelected] = useState("white");
    const [apiOperationsStates, setAPIOperationsState] = useState({
        saveInProgress: false,
        publishInProgress: false,
        previousVersionInProgress: false,
    });
    const [inputSlugSelected, setInputSlugSelected] = useState(false);
    const [currentSlug, setCurrentSlug] = useState({
        isValid: true,
        value: fixedSlug,
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [loadCompleted, setLoadCompleted] = useState(false);
    const [phoneInfo, setPhoneInfo] = useState({
        numericCode: userData?.billingAddress?.phone || "1",
        number: userData?.billingAddress?.phone?.number || "1234567890",
        countryCode: returnCorrectCode(
            userData?.billingAddress?.phone?.countryCode || "USA"
        ),
    });

    const [contactInfo, setContactInfo] = useState({
        numericCode: "",
        number: "",
        countryCode: returnCorrectCode(
            "+1"
        ),
    });

    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [files, setFiles] = useState([]);
    const [noReduxOperation, setNoReduxOperation] = useState(false);
    const [addProductMessage, setAddProductMessage] = useState(false)
    const { refetchBusiness, setRefetchBusiness } = useMyContext();

    const [productSlug, setProductSlug] = useState("product1")
    const [productCode, setProductCode] = useState("A1B2C3")
    const [productHeading, setProductHeading] = useState("We are doing our part in combating climate change")
    const [productDescription, setProductDescription] = useState("Discover a new era of responsible consumption with our range of eco-friendly products, designed with the environment in mind. Crafted from sustainable materials and engineered for durability, our offerings minimize waste and reduce your carbon footprint. Whether you're looking to make a small change or a big impact, our products empower you to make a positive difference every day. Choose sustainability, choose a better future.")
    const [previews, setPreviews] = useState([]);
    const [productName, setProductName] = useState("Shirt")
    const [productCategory, setProductCategory] = useState("Shirt")
    const [productSubCategory, setProductSubCategory] = useState("T-Shirt")
    const [carbonEmission, setCarbonEmission] = useState("12")
    const [showEmission, setShowEmission] = useState(false)
    const [consumption, setConsumption] = useState("34")
    const [showConsumption, setShowConsumption] = useState(false)
    const [waterUsage, setWaterUsage] = useState("56")
    const [showWaterUsage, setShowWaterUsage] = useState(false)
    const [recycledMaterial, setRecycledMaterial] = useState("47")
    const [showRecycledMaterial, setShowRecycledMaterial] = useState(false)
    const [upcycledMaterial, setUpcycledMaterial] = useState("53")
    const [showUpcycledMaterial, setShowUpcycledMaterial] = useState(false)
    const [aboutLink, setAboutLink] = useState("https://www.yourcompany.com/about")
    const [showAboutLink, setShowAboutLink] = useState(false)
    const [address, setAddress] = useState("https://www.yourcompany.com/address")
    const [showAddress, setShowAddress] = useState(false)
    const [contact, setContact] = useState("https://www.yourcompany.com/contact")
    const [showContact, setShowContact] = useState(false)
    const [returns, setReturns] = useState("")
    const [showReturns, setShowReturns] = useState(false)
    const [policy, setPolicy] = useState("")
    const [showPolicy, setShowPolicy] = useState(false)
    const [sizeGuide, setSizeGuide] = useState("")
    const [showSizeGuide, setShowSizeGuide] = useState(false)
    const [faq, setFaq] = useState("https://www.yourcompany.com/faq")
    const [showFaq, setShowFaq] = useState(false)
    const [usefulKey1, setUserfulKey1] = useState("Returns")
    const [usefulValue1, setUserfulValue1] = useState("https://www.yourcompany.com/returns")
    const [showUsefulKey1, setShowUsefulKey1] = useState(false)
    const [showUsefulValue1, setShowUsefulValue1] = useState(false)
    const [usefulKey2, setUserfulKey2] = useState("Support Policy")
    const [usefulValue2, setUserfulValue2] = useState("https://www.yourcompany.com/supportpolicy")
    const [showUsefulValue2, setShowUsefulValue2] = useState(false)
    const [usefulKey3, setUserfulKey3] = useState("Blog")
    const [usefulValue3, setUserfulValue3] = useState("https://www.yourcompany.com/blog")
    const [showUsefulValue3, setShowUsefulValue3] = useState(false)
    const [usefulKey4, setUserfulKey4] = useState("Privacy Policy")
    const [usefulValue4, setUserfulValue4] = useState("https://www.yourcompany.com/privacypolicy")
    const [showUsefulValue4, setShowUsefulValue4] = useState(false)


    useEffect(() => {
        console.log(userData, sustainData, "usereditdata")
    }, [])

    



    const extraClass =
        showStartAgainModal?.type === "SAVE_PUBLISH" ? "changeSlug" : "";



    let businessNameSlug = BusinessDetails?.name?.toLowerCase()?.split(" ").join("")

    let userRefferalId = localStorage.getItem("userId")

    const handleSelect = async (e) => {
        setSelectedCurrency(e?.target?.value);
    }

    const handleShowStartAgainModal = (val) => {
        setShowStartAgainModal({ val: true, type: val });
    };

    const handleImage = (selectedImage) => {
        const updatedPreview = previews.filter(item => item !== selectedImage);
        setPreviews(updatedPreview)
    }


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

    const convertStringToBoolean = (string, itemName = "Not Required") => {
        if (!string || !string === "true" || !string === "false") {
            return false;
        }

        const item = JSON.parse(string);

        return item;
    };

    const secondUpdate = useRef(true);

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null)
    const multipleFileInputRef = useRef(null);

    const clearFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            console.log('Signature File input cleared.');
        }
    };

    const clearImageInput = () => {
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
            console.log('Image File input cleared.');
        }
    };


    const clearMultipleFileInput = () => {
        if (multipleFileInputRef.current) {
            multipleFileInputRef.current.value = '';
            console.log('Mutliple File input cleared.');
        }
    };

    const clearToSystemDefaultsFunc = (message) => {
        setProductSlug("product1")
        setProductCode("A1B2C3")
        setProductHeading("We are doing our part in combating climate change");
        setProductDescription(
            "Discover a new era of responsible consumption with our range of eco-friendly products, designed with the environment in mind. Crafted from sustainable materials and engineered for durability, our offerings minimize waste and reduce your carbon footprint. Whether you're looking to make a small change or a big impact, our products empower you to make a positive difference every day. Choose sustainability, choose a better future."
        );
        setAboutUs(
            "We are a passionate team of environmental advocates, committed to making a meaningful impact through our sustainable product. Living in a world increasingly affected by climate change, we understand the urgency of taking immediate action. Our journey began in a place where we experienced firsthand the realities of rising sea levels and frequent flooding. This inspired us to create a solution that not only meets our needs but also contributes to a healthier planet."
        );
        setPreviews([])
        setProductName("Shirt")
        setProductCategory("Shirt")
        setProductSubCategory("T-Shirt")
        setProductTag("Comfort, Casual")
        setColorPalette("")
        setProductPrice("11.00")
        setName(
            businessName
        );
        setPhone(
            userData?.billingAddress?.phone?.numericCode || "1" +
            userData?.billingAddress?.phone?.number || '1234567890'
        );
        setPhoneInfo({
            numericCode: userData?.billingAddress?.phone?.numericCode || "1",
            number: userData?.billingAddress?.phone?.number || "1234567890",
            countryCode: returnCorrectCode(
                userData?.billingAddress?.phone?.countryCode || "USA"
            ),
        });

        setEmail(userData?.user?.email);

        // setCountry(
        //   currentUserSettings?.country && currentUserSettings?.country !== ""
        //     ? currentUserSettings?.country
        //     : userData?.billingAddress?.country
        // );

        setSelectedCountry(
            countryNameToISO3(userData?.billingAddress?.country || "India")
        );
        setPreviews([])
        setImageLogo("")
        setImage("")
        setTwitter("https://x.com/Microsoft")
        setLinkedIn("https://www.linkedin.com/company/microsoft")
        setFacebook("https://www.facebook.com/MicrosoftIndia/")
        setInstagram("https://www.instagram.com/microsoft/")
        setShowName(false); // need to do it after the field is added
        setShowEmail(false);
        setShowPhone(false);
        setShowTwitter(false);
        setShowLinkedin(false);
        setShowInstagram(false);
        setShowFacebook(false);
        setStartDataFetched(true);
        setDisplaySlug(false);
        setThemeSelected("white");
        setCarbonEmission("12")
        setConsumption("34")
        setWaterUsage("56")
        setRecycledMaterial("47")
        setUpcycledMaterial("53")
        setShowEmission(false)
        setShowConsumption(false)
        setShowWaterUsage(false)
        setShowRecycledMaterial(false)
        setShowUpcycledMaterial(false)
        setHighlight1("Eco-friendly Materials")
        setHighlight2("Low Carbon Footprint")
        setHighlight3("Ethical Sourcing")
        setHighlight4("Minimal Packaging")
        setCertName1("Cradle to Cradle Certified™")
        setCertName2("Fair Trade Certified™")
        setCertName3("Global Organic Textile Standard (GOTS)")
        setCertName4("")
        setCertLink1("https://c2ccertified.org/")
        setCertLink2("https://www.fairtradecertified.org/")
        setCertLink3("https://global-standard.org/")
        setCertLink4("")
        setChainData(defaultchain)
        setCertData(defaultcert)
        setSignature("")
        setAboutLink("https://www.yourcompany.com/about")
        setShowAboutLink(false)
        setAddress("https://www.yourcompany.com/address")
        setShowAddress(false)
        setContact("https://www.yourcompany.com/contact")
        setShowContact(false)
        setContactInfo({
            numericCode: "",
            number: "",
            countryCode: returnCorrectCode(
                "+1"
            ),
        })
        setReturns("")
        setShowReturns(false)
        setPolicy("")
        setShowPolicy(false)
        setSizeGuide("")
        setShowSizeGuide(false)
        setFaq("https://www.yourcompany.com/faq")
        setShowFaq(false)
        setUserfulKey1("Returns")
        setUserfulValue1("https://www.yourcompany.com/returns")
        setShowUsefulValue1(false)
        setUserfulKey2("Support Policy")
        setUserfulValue2("https://www.yourcompany.com/supportpolicy")
        setShowUsefulValue2(false)
        setUserfulKey3("Blog")
        setUserfulValue3("https://www.yourcompany.com/blog")
        setShowUsefulValue3(false)
        setUserfulKey4("Privacy Policy")
        setUserfulValue4("https://www.yourcompany.com/privacypolicy")
        setShowUsefulValue4(false)
        setShowBusinessPage(false)
        clearFileInput()
        clearImageInput()
        clearMultipleFileInput()


        // addItemsToSustainabilityPage({
        //     title,
        //     description,
        //     aboutUs,
        //     selectedCountry,
        //     image,
        //     name,
        //     phone,
        //     email,
        //     twitter,
        //     linkedin,
        //     instagram,
        //     facebook,
        //     showName,
        //     showPhone,
        //     showEmail,
        //     showTwitter,
        //     showLinkedin,
        //     showInstagram,
        //     showFacebook,
        //     imageURL: "",
        //     themeSelected,
        //     displaySlug,
        //     phoneInfo,
        // });
        setEditDisabled(true)
        console.log(message, "aaaaddd")
        if (message) {
            addToast("Your Digital Product Page has been reset to system defaults", {
                appearance: "success",
                autoDismiss: true,
            });
        }
        setAddProductMessage(false)
        setTriggerDefault(false)
        setClearFields(false)
    };

    // const fetchDataFromAPIInitial = async () => {
    //     try {
    //         await fetchDataFromAPI();
    //     } catch (err) {
    //         console.log(err);
    //     }

    //     if (!selectedCountry)
    //         setSelectedCountry(countryNameToISO3(userData?.billingAddress?.country));

    //     addItemsToSustainabilityPage({
    //         title,
    //         description,
    //         aboutUs,
    //         selectedCountry,
    //         image,
    //         name,
    //         phone,
    //         email,
    //         twitter,
    //         linkedin,
    //         instagram,
    //         facebook,
    //         showName,
    //         showPhone,
    //         showEmail,
    //         showTwitter,
    //         showLinkedin,
    //         showInstagram,
    //         showFacebook,
    //         imageURL: image,
    //         themeSelected,
    //         displaySlug,
    //         phoneInfo,
    //     });
    //     if (selectedCountry || countryNameToISO3(userData?.billingAddress?.country))
    //         setLoadCompleted(true);
    // };

    // const execValidateUserTimeout = setTimeout(() => {
    //   validateUser()
    // }, 1000)

    // useEffect(() => {
    //   if (userData?.billingAddress?.firstName && !selectedCountry) {
    //     fetchDataFromAPIInitial()
    //   }
    // }, [userData?.billingAddress?.firstName])

    useEffect(() => {
        console.log("trigger")
        if (triggerDefault) {
            clearToSystemDefaultsFunc(true)
        }
    }, [triggerDefault])

    useEffect(() => {
        console.log("clearfields")
        if (clearFields) {
            clearToSystemDefaultsFunc(false)
        }
    }, [clearFields])

    useEffect(() => {
        getInitalSlugData()
    }, [refetchBusiness])

    const getInitalSlugData = async () => {
        let slugValues = await businessSlugData();
        setInitSlug(slugValues?.data?.data?.slug)
        setFirstSlug(slugValues?.data?.data?.slug)
        setFixedSlug(slugValues?.data?.data?.slug)
        setBusinessPage(`${process.env.NEXT_PUBLIC_UI_URL}/b/${slugValues?.data?.data?.slug}`)
        console.log(`${process.env.NEXT_PUBLIC_UI_URL}/b/${slugValues?.data?.data?.slug}`.split("/")[4], "sluggg")
    };

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

    // useEffect(() => {
    //     fetchDataFromAPIInitial()
    //         .then(() => {
    //             setDataChanged(false);
    //         })
    //         .catch((err) => console.log(err));
    // }, []);

    useEffect(() => {
        if (inputSlugSelected) slugInputRef.current.focus();
    }, [inputSlugSelected]);

    const resetToPreviousVersion = async () => {
        try {
            setAPIOperationsState({
                ...apiOperationsStates,
                previousVersionInProgress: true,
            });
            const res = await getPreviousBusinessSustainabilityPage();
            updateAPIDataToPage(res?.data?.data, res?.data?.data?.isPublic);
            setAPIOperationsState({
                ...apiOperationsStates,
                previousVersionInProgress: false,
            });
            setEditDisabled(true)
            addToast(
                "Your changes made to the Product Page have been reset to its previous version",
                {
                    appearance: "success",
                    autoDismiss: true,
                }
            );
            console.log(apiOperationsStates, "operationState")
        } catch (err) {
            console.log(err);
        }
    };

    // useEffect(() => {
    //     if (secondUpdate.current) {
    //         secondUpdate.current = false;
    //     } else {
    //         if (!noReduxOperation) {
    //             !dataChanged && setDataChanged(true);

    //             const validationResult = runValidation();

    //             if (typeof image != "string") {
    //                 getBase64(image, (base64Image) => {
    //                     return addItemsToSustainabilityPage({
    //                         title,
    //                         description,
    //                         aboutUs,
    //                         selectedCountry,
    //                         image,
    //                         name,
    //                         phone,
    //                         email,
    //                         twitter,
    //                         linkedin,
    //                         instagram,
    //                         facebook,
    //                         showName,
    //                         showPhone,
    //                         showEmail,
    //                         showTwitter,
    //                         showLinkedin,
    //                         showInstagram,
    //                         showFacebook,
    //                         imageURL: base64Image,
    //                         themeSelected,
    //                         displaySlug,
    //                         phoneInfo,
    //                     });
    //                 });
    //             }

    //             addItemsToSustainabilityPage({
    //                 title,
    //                 description,
    //                 aboutUs,
    //                 selectedCountry,
    //                 image,
    //                 name,
    //                 phone,
    //                 email,
    //                 twitter,
    //                 linkedin,
    //                 instagram,
    //                 facebook,
    //                 showName,
    //                 showPhone,
    //                 showEmail,
    //                 showTwitter,
    //                 showLinkedin,
    //                 showInstagram,
    //                 showFacebook,
    //                 imageURL: image,
    //                 themeSelected,
    //                 displaySlug,
    //                 phoneInfo,
    //             });
    //         }
    //     }
    // }, [
    //     title,
    //     description,
    //     aboutUs,
    //     selectedCountry,
    //     image,
    //     name,
    //     phone,
    //     email,
    //     twitter,
    //     linkedin,
    //     instagram,
    //     facebook,
    //     showName,
    //     showPhone,
    //     showEmail,
    //     showTwitter,
    //     showLinkedin,
    //     showInstagram,
    //     showFacebook,
    //     noReduxOperation,
    //     themeSelected,
    //     displaySlug,
    // ]);
    let imagesarray = []

    const handleFileChange = async (event) => {
        // console.log("item" , item)
        if (previews.length === 6) {
            return addToast("Cannot upload more than 6 images!", {
                appearance: "error",
                autoDismiss: true,
            })
        }
        if (!event?.target?.files) {
            console.log("Aaaabbb")
            return;
        }
        console.log("imghghg", event?.target?.files[0])
        const uploadedImg = event?.target?.files[0];
        let dataImgs = new FormData()
        dataImgs.append(`galleryFile`, uploadedImg);
        let imageURL = await uploadImage(dataImgs)
        console.log(imageURL)
        if (imageURL?.data?.success) {
            imagesarray.push(imageURL?.data?.data?.urlLink)
        }
        console.log("arr-img", imagesarray)
        setPreviews(prevArray => [...prevArray, imageURL?.data?.data?.urlLink]);
        // if (selectedFiles.length > 3) {
        //     return addToast("Cannot upload more than 3 images", {
        //         appearance: "error",
        //         autoDismiss: true,
        //     });
        // }
        // setFiles(selectedFiles);

        // const filePreviews = selectedFiles.map(file => URL.createObjectURL(file));
        // setPreviews(filePreviews);
    };



    const getBase64 = (file, cb) => {
        if (!file) return "";
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result);
        };
        reader.onerror = function (error) {
            console.log("Error in image load: ", error);
        };
    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleContactChange = (e) => {
        setContact(e.target.value);
    };

    const returnFormattedDataForPage = (currentUserSettings) => {
        const formattedData = {
            title:
                currentUserSettings?.title && currentUserSettings?.title !== ""
                    ? currentUserSettings?.title
                    : "We are doing our part in combating climate change",
            description:
                currentUserSettings?.description &&
                    currentUserSettings?.description !== ""
                    ? currentUserSettings?.description
                    : "We are reducing our greenhouse gas emissions everyday by wasting less, buying green, saving energy and by being conscientious consumers. But we can make only limited lifestyle changes. For our remaining emissions, we are buying carbon offsets to have a zero emission footprint. Each carbon offset we purchase goes into certified projects like planting new trees, reforestation, methane sequestration, ocean cleanup, and other such initiatives that help combat climate change today. We decided not to wait and do something today.",
            aboutUs:
                currentUserSettings?.aboutUs && currentUserSettings?.aboutUs !== ""
                    ? currentUserSettings?.aboutUs
                    : "This is a paragraph about us. We are a family of five, living in Miami, Florida We are interested in playing our part in saving the environment and our planet. Living in a city that is on the front line of climate change gives us a front row-seat to the impending loom. Often during high tides or occasional torrential rains, we are inundated with a flooded downtown where spotting a fish is commonplace. We are not waiting for 2030 or 2050 for NetZero. Yes the government and businesses have to play their part, but we as individuals can make a much bigger difference. If you can spread the word, that now there is a way, we have a chance.The world you and I have inherited is not just ours, but we are mere beneficiaries of its wonders. It is our responsibility to take care of it so that we can pass it on to our future.",
            name:
                currentUserSettings?.name && currentUserSettings?.name !== ""
                    ? currentUserSettings?.name
                    : userData?.billingAddress?.firstName +
                    " " +
                    userData?.billingAddress?.lastName,
            phone:
                currentUserSettings?.phone && currentUserSettings?.phone !== ""
                    ? currentUserSettings?.phone
                    : userData?.billingAddress?.contactNo,
            email:
                currentUserSettings?.email && currentUserSettings?.email !== ""
                    ? currentUserSettings?.email
                    : userData?.user?.email,
            twitter: currentUserSettings?.twitter || "",
            linkedin: currentUserSettings?.linkedin || "",
            instagram: currentUserSettings?.instagram || "",
            facebook: currentUserSettings?.facebook || "",
            image: currentUserSettings?.profilePicURL || "",
            selectedCountry:
                currentUserSettings?.country && currentUserSettings?.country !== ""
                    ? currentUserSettings?.country
                    : countryNameToISO3(userData?.billingAddress?.country),
            showName: currentUserSettings?.showName || false,
            showEmail: currentUserSettings?.showEmail || false,
            showPhone: currentUserSettings?.showPhone || false,
            showTwitter: currentUserSettings?.showTwitter || false,
            showLinkedin: currentUserSettings?.showLinkedin || false,
            showInstagram: currentUserSettings?.showInstagram || false,
            showFacebook: currentUserSettings?.showFacebook || false,
            themeSelected: currentUserSettings?.themeSelected || "white",
        };
        return formattedData;
    };

    const updateAPIDataToPage = (
        currentUserSettings,
        isPublicURL = displaySlug
    ) => {
        const data = returnFormattedDataForPage(currentUserSettings);
        // setDisplaySlug(isPublicURL);
        // setTitle(data?.title);
        // setDescription(data?.description);
        // setAboutUs(data?.aboutUs);
        setName(businessName);
        data?.phone && setPhone(data?.phone?.numericCode + data?.phone?.number);
        data?.phone &&
            setPhoneInfo({
                numericCode: data?.phone?.numericCode?.slice(1),
                number: data?.phone?.number,
                countryCode: returnCorrectCode(data?.phone?.countryCode),
            });
        // setEmail(data?.email);
        // setTwitter(data?.twitter);
        // setLinkedIn(data?.linkedin);
        // setInstagram(data?.instagram);
        // setFacebook(data?.facebook);
        // setImage(data?.image);
        // setCountry(
        //   currentUserSettings?.country && currentUserSettings?.country !== ""
        //     ? currentUserSettings?.country
        //     : userData?.billingAddress?.country
        // );

        setSelectedCountry(data?.selectedCountry);

        // setShowName(convertStringToBoolean(data?.showName, "Name"));
        // setShowEmail(convertStringToBoolean(data?.showEmail, "Email"));
        // setShowPhone(convertStringToBoolean(data?.showPhone, "Phone"));
        // setShowTwitter(convertStringToBoolean(data?.showTwitter, "Twitter"));
        // setShowLinkedin(convertStringToBoolean(data?.showLinkedin, "LinkedIn"));
        // setShowInstagram(convertStringToBoolean(data?.showInstagram, "Instagram"));
        // setShowFacebook(convertStringToBoolean(data?.showFacebook, "Facebook"));
        // setThemeSelected(data?.themeSelected || "blue");
    };

    // const fetchDataFromAPI = async (publish = false) => {
    //     try {
    //         setNoReduxOperation(true);
    //         const res = await getCurrentBusinessSustainabilityPage();

    //         let currentUserSettings;
    //         if (publish) {
    //             currentUserSettings = res?.data?.data;
    //         } else {
    //             currentUserSettings = res?.data?.data?.draft;
    //         }

    //         updateAPIDataToPage(currentUserSettings, res?.data?.data?.isPublic);

    //         setStartDataFetched(true);
    //         setNoReduxOperation(false);
    //         return res;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const [userBio, setUserBio] = useState("");

    // const selectTemplate = (item) => {
    //     const allTemplates = [
    //         setBlueSelected,
    //         setGraySelected,
    //         setWhiteSelected,
    //         setGreenSelected,
    //         setBeigeSelected,
    //         setPinkSelected,
    //     ];
    //     allTemplates.forEach((each) => {
    //         if (item !== each) {
    //             each(false);
    //         } else {
    //             each(true);
    //         }
    //     });
    // };

    // const themeSelectCSS = (val) => {
    //     let border;
    //     if (val) {
    //         border = "1px solid blue";
    //     }
    //     return {
    //         width: "120px",
    //         height: "200px",
    //         cursor: "pointer",
    //         border: border,
    //     };
    // };

    // const handlepublishBusinessPage = async () => {
    //     const validationResult = runValidation();
    //     setAPIOperationsState({ ...apiOperationsStates, publishInProgress: true });
    //     const dataForm = returnAppendedFormData();
    //     setDisplaySlug(true);

    //     const res = await publishBusinessPage(dataForm);
    //     if (res.status === 200) {
    //         if (sustainabilityActionStates?.slugChanged) {
    //             setSustainabilityActionStates({
    //                 ...sustainabilityActionStates,
    //                 slugChanged: false,
    //             });
    //         }
    //         validateUser();

    //         setDataChanged(false);
    //         setAPIOperationsState({
    //             ...apiOperationsStates,
    //             publishInProgress: false,
    //         });
    //         addToast(
    //             "Your changes made to the product page have been saved and published",
    //             {
    //                 appearance: "success",
    //                 autoDismiss: true,
    //             }
    //         );
    //         setEditDisabled(true);
    //     } else {
    //         addToast("Something went wrong, please try again later.", {
    //             appearance: "error",
    //             autoDismiss: true,
    //         });
    //     }
    // };

    const generateInvalidMessage = ({ name, type, quote }) => {
        console.log(name, type, quote, "aaaa")
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

    const checkFieldValidation = (name, type) => {
        const validationObject = {};
        validationObject["type"] = type;
        validationObject["name"] = name;
        validationObject["error"] = true;
        return validationObject;
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

    const validationOfSlug = (validationObject, slug) => {
        if (slug && !slug.match(slugRegex)) {
            validationObject["slug"] = {
                error: true,
                name: "slug",
                type: INVALID_SLUG_REGEX_MATCH,
            };
        }
        if (slug && slug.length > 32) {
            validationObject["slug"] = {
                error: true,
                name: "slug",
                type: INVALID_INPUT_HIGH_CHAR,
            };
        }
    };

    const handleMakePublic = (value) => {
        if (displaySlug === false)
            setSustainabilityActionStates({
                ...sustainabilityActionStates,
                slugStatusChangedToTrue: true,
            });
        setDisplaySlug((prev) => !prev);
    };

    const runValidation = () => {
        const validationObject = {};
        const alphaRegex = /^[A-Za-z\s]*$/;
        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const validationItems = [title, description, aboutUs, name, businessPage];
        const validationItemsName = [
            "title",
            "description",
            "aboutUs",
            "name",
            "phone",
            "businessPage",
        ];

        validationOfSlug(validationObject, initSlug);

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
        console.log(validationObject, "valid")
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

    const promisedSetState = (setState, newState) =>
        new Promise((resolve) => {
            setState(newState),
                setTimeout(() => {
                    resolve();
                }, 1);
        });

    const handleSaveSettings = async ({ displaySlug, runFromPopup }) => {
        console.log(selectedCurrency, "currency")
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
        let slugCheck = await businessProductSlugCheck(businessNameSlug + "/" + productSlug)
        console.log(slugCheck, "slug-check")
        if (!slugCheck.data.productPageSlug) {
            return addToast(`Product Page had already been taken`, {
                appearance: "error",
                autoDismiss: true,
            });
        }
        if (productSlug === "product1") {
            return addToast(`Product Page Name cannot be ${businessNameSlug}/product1`, {
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

        const validationResult = runValidation();
        console.log(validationResult, "validation")

        console.log(previews, "imagesss")
        console.log(phone, "phone")
        console.log(phoneInfo, "phoneInfo")


        const dataForm = new FormData();
        let randomWholeNum = Math.floor(Math.random() * 1001);
        dataForm.append("id", randomWholeNum);
        if (phone && phone !== `+${phoneInfo?.numericCode}` && phone?.length > 2) {
            const phoneDetails = returnPhoneDetails(phoneInfo);
            dataForm.append("number", phoneDetails?.number);
            dataForm.append("countryCode", `${phoneDetails?.countryCode}`);
            dataForm.append("numericCode", `+${phoneDetails?.numericCode}`);
        }
        dataForm.append("country", selectedCountry);
        dataForm.append("aboutUs", aboutUs);
        dataForm.append("businessSlugName", businessNameSlug);
        dataForm.append("slug", productSlug);
        // dataForm.append("slug", businessNameSlug + "-" + productSlug);
        dataForm.append("productCode", productCode);
        dataForm.append("title", productHeading);
        dataForm.append("shortDescription", productHeading);
        dataForm.append("status", displaySlug);
        dataForm.append("longDescription", productDescription);
        dataForm.append("description", productDescription);
        dataForm.append("selectedCountry", selectedCountry);
        dataForm.append("formalName", productName);
        dataForm.append("name", name);
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
        // for (let i = 0; i < files.length; i++) {
        //     dataForm.append('images[]', files[i]);
        // }
        for (let i = 0; i < previews.length; i++) {
            dataForm.append(`productImages[${i}]`, previews[i]);
        }

        // dataForm.append('productImages', previews)
        // dataForm.append('images[]' , imageLogo)
        // previews.forEach((item, index) => {
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
        // })
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
        let addEventToBusiness = await addBusinessProduct(dataForm)
        console.log(addEventToBusiness)
        if (addEventToBusiness.data.success) {
            setEditDisabled(true)
            addToast("DPP page with the given name has been created", {
                appearance: "success",
                autoDismiss: true,
            });
            setRefreshList(true)
            setAddProductPopup(false)
            setAddProductMessage(true)
            clearToSystemDefaultsFunc(false)
        } else {
            addToast(addEventToBusiness.data.message, {
                appearance: "error",
                autoDismiss: true,
            });
        }
    };

    // const handleSaveSettingsToAPI = async (data) => {
    //     console.log(validationErrors, sustainabilityActionStates?.slugAvailable, "slugerror")
    //     if (sustainabilityActionStates?.slugAvailable === SLUG_UNAVAILABLE) {
    //         setAPIOperationsState({ ...apiOperationsStates, saveInProgress: false });
    //         return addToast("Link name has already been taken", {
    //             appearance: "error",
    //             autoDismiss: true,
    //         });
    //     }
    //     if (!initSlug) {
    //         setAPIOperationsState({ ...apiOperationsStates, saveInProgress: false });
    //         return addToast("Link name cannot be empty", {
    //             appearance: "error",
    //             autoDismiss: true,
    //         });
    //     }
    //     const res = await saveSustainabilityPageToAPI(data);
    //     if (res?.status === 200) {
    //         validateUser();
    //         setDataChanged(false);
    //         if (sustainabilityActionStates?.slugChanged) {
    //             setSustainabilityActionStates({
    //                 ...sustainabilityActionStates,
    //                 slugChanged: false,
    //             });
    //         }
    //         setAPIOperationsState({ ...apiOperationsStates, saveInProgress: false });
    //         setRefetchBusiness(!refetchBusiness)
    //         setEditDisabled(true)
    //         addToast("Your changes made to the product page have been saved", {
    //             appearance: "success",
    //             autoDismiss: true,
    //         });
    //     } else {
    //         setAPIOperationsState({ ...apiOperationsStates, saveInProgress: false });
    //         addToast("Something went wrong, please try again later.", {
    //             appearance: "error",
    //             autoDismiss: true,
    //         });
    //     }
    // };

    // setSustainabilityHelperFunctions({
    //     saveSettingsFunc: handleSaveSettings,
    //     resetToDefault: clearToSystemDefaultsFunc,
    //     resetToPreviousVersion: resetToPreviousVersion,
    //     fetchDataFromAPIInitial: fetchDataFromAPIInitial,
    //     setDataChanged: setDataChanged,
    //     setEditDisabled: setEditDisabled,
    //     setLoading: (value) =>
    //         setAPIOperationsState({ ...apiOperationsStates, saveInProgress: value }),

    //     setSlug: async (value) => [await promisedSetState(setDisplaySlug, value)],
    //     setSlugStatusChanged: async (value) =>
    //         await promisedSetState(setSustainabilityActionStates, {
    //             ...sustainabilityActionStates,
    //             slugStatusChangedToTrue: value,
    //         }),
    // });

    const onKeyDown = async (e) => {
        e.preventDefault();
        await handleSaveSettings();
    };


    // const returnAppendedFormData = () => {
    //     const dataForm = new FormData();
    //     console.log(
    //         "3 vals",

    //         fixedSlug !== initSlug,
    //         sustainabilityActionStates?.slugAvailable === SLUG_UNTOUCHED ||
    //         sustainabilityActionStates?.slugAvailable === SLUG_AVAILABLE
    //     );
    //     if (
    //         fixedSlug !== initSlug &&
    //         (sustainabilityActionStates?.slugAvailable === SLUG_UNTOUCHED ||
    //             sustainabilityActionStates?.slugAvailable === SLUG_AVAILABLE)
    //     ) {
    //         dataForm.append("slug", fixedSlug);
    //         dataForm.append("newSlug", initSlug);
    //     }
    //     if (phone && phone !== `+${phoneInfo?.numericCode}` && phone.length > 2) {
    //         const phoneDetails = returnPhoneDetails(phoneInfo);
    //         dataForm.append("number", phoneDetails?.number);
    //         dataForm.append("countryCode", `${phoneDetails?.countryCode}`);
    //         dataForm.append("numericCode", `+${phoneDetails?.numericCode}`);
    //     }
    //     // dataForm.append("name", businessName);
    //     dataForm.append("showName", showName);
    //     dataForm.append("email", email);
    //     dataForm.append("showEmail", showEmail);
    //     dataForm.append("showPhone", showPhone);
    //     dataForm.append("twitter", twitter);
    //     dataForm.append("showTwitter", showTwitter);
    //     dataForm.append("facebook", facebook);
    //     dataForm.append("showFacebook", showFacebook);
    //     dataForm.append("linkedin", linkedin);
    //     dataForm.append("showLinkedin", showLinkedin);
    //     dataForm.append("instagram", instagram);
    //     dataForm.append("showInstagram", showInstagram);
    //     dataForm.append("country", selectedCountry);
    //     dataForm.append("aboutUs", aboutUs);
    //     dataForm.append("description", description);
    //     dataForm.append("title", title);
    //     dataForm.append("profilePicURL", image);
    //     dataForm.append("isPublic", displaySlug);
    //     dataForm.append("businessCode", businessCode);
    //     dataForm.append("themeSelected", themeSelected?.toLowerCase() || "white");
    //     return dataForm;
    // };

    // const saveSustainabilityPageToAPI = async ({ displaySlug, runFromPopup }) => {
    //     const validationResult = runValidation();
    //     const dataForm = returnAppendedFormData();
    //     try {
    //         if (runFromPopup)
    //             [dataForm.delete("isPublic"), dataForm.append("isPublic", displaySlug)];
    //         return await updateUserBusinessSettingInfo(dataForm);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const handleSlugChange = async (value) => {
        //setCurrentSlug({ value: value.toLowerCase() });
        setProductSlug(value.toLowerCase())
        const validationObject = {};
        const validationErrorLocal = {};
        validationOfSlug(validationObject, value);
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

    // const currentSlugChange = (value) => {
    //   setCurrentSlug(value)
    //   handleSlugChange(value)
    // }

    const handleKeyDown = (e) => {
        if (e?.key == "Enter")
            handleSaveSettings({ displaySlug }).catch((err) => console.log(err));
    };

    const handleOptionalContact = (validateValue, field) => {
        if (!validateValue) {
            addToast(`Please add ${field} Before enabling it`);
        }
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

    const downloadCode = (id) => {
        setDownloading(true);
        const canvas = document.getElementById(id);
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `your_name.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            setTimeout(() => {
                setDownloading(false);
            }, 2000);
        }
    };

    const handleCancel = () => {
        setEditDisabled(true)
        setInitSlug(firstSlug)
        setSustainabilityActionStates({
            ...sustainabilityActionStates,
            slugAvailable: SLUG_UNTOUCHED,
        });
        setProductSlug("product1")
        clearToSystemDefaultsFunc(false)
    }

    return (
        <>
            {localStorage.getItem("MyBusinessDetails") ?
                <>
                    {/* {initSlug ? ( */}
                    <>
                        <form
                            className={`sustainability--edit-main-holder ${editDisabled ? "edit--disabled" : ""
                                }`}
                        >

                            <div className="sustainability--page--main-3-holder">
                                <div className="sustainability--page-box-holder">
                                    <div className="productButtons">
                                        <div className="main--sustainability--edit-button-holder">
                                            <div className="sustainability--edit-buttons-holder">
                                                {editDisabled ? (
                                                    <div
                                                        onClick={() => setEditDisabled(false)}
                                                        className="sustainability--edit-button sustainability-start-again button--black"
                                                    >
                                                        EDIT
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                                {!editDisabled ? (
                                                    <>
                                                        <div
                                                            onClick={() =>
                                                                handleCancel()
                                                            }
                                                            // onClick={() => didValuesChanged()}
                                                            className="sustainability--edit-button sustainability-start-again button--white"
                                                        >
                                                            Cancel
                                                        </div>
                                                        {/* <div
                                                            onClick={() => setDefaultPopup(true)}
                                                            className="sustainability--edit-button sustainability-start-again button--white"
                                                        >
                                                            DEFAULT VALUES
                                                        </div> */}
                                                        {/* <div
                                                onClick={() => handleShowStartAgainModal("START_AGAIN")}
                                                className={`sustainability--edit-button sustainability-start-again button--white previous-version ${apiOperationsStates?.previousVersionInProgress
                                                    ? "saveInProgress"
                                                    : ""
                                                    }`}
                                            >
                                                PREVIOUS VERSION{" "}
                                                {apiOperationsStates?.previousVersionInProgress ? (
                                                    <Spinner animation="border" size="sm" />
                                                ) : (
                                                    ""
                                                )}
                                            </div> */}
                                                        {/* <a
                                                target="_blank"
                                                href={`${process.env.NEXT_PUBLIC_UI_URL}/preview/${sustainabilityActionStates?.slugAvailable ===
                                                    SLUG_UNTOUCHED ||
                                                    sustainabilityActionStates?.slugAvailable ===
                                                    SLUG_AVAILABLE
                                                    ? initSlug
                                                    : fixedSlug
                                                    }`}
                                            >
                                                <div className="sustainability--edit-button sustainability-preview button--white">
                                                    Preview
                                                </div>
                                            </a> */}

                                                        {/* <div
                                                                className="sustainability--edit-button sustainability-publish"
                                                                onClick={handlepublishBusinessPage}
                                                            >
                                                                <div className="sustainability--svg-big">
                                                                    <svg
                                                                        width="14"
                                                                        height="14"
                                                                        viewBox="0 0 14 14"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M8 0C7.44772 0 7 0.447715 7 1C7 1.55228 7.44772 2 8 2H10.5858L4.29289 8.29289C3.90237 8.68342 3.90237 9.31658 4.29289 9.70711C4.68342 10.0976 5.31658 10.0976 5.70711 9.70711L12 3.41421V6C12 6.55228 12.4477 7 13 7C13.5523 7 14 6.55228 14 6V1C14 0.447715 13.5523 0 13 0H8Z"
                                                                            fill="white"
                                                                        />
                                                                        <path
                                                                            d="M2 2C0.895431 2 0 2.89543 0 4V12C0 13.1046 0.89543 14 2 14H10C11.1046 14 12 13.1046 12 12V9C12 8.44772 11.5523 8 11 8C10.4477 8 10 8.44772 10 9V12H2V4L5 4C5.55228 4 6 3.55228 6 3C6 2.44772 5.55228 2 5 2H2Z"
                                                                            fill="white"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <div className="sustainability--svg-small">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="13"
                                                                        height="13"
                                                                        fill="none"
                                                                        viewBox="0 0 13 13"
                                                                    >
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M7.218 2.546a.568.568 0 100 1.136h1.47L5.11 7.258a.568.568 0 10.804.804l3.576-3.576v1.47a.568.568 0 001.136 0V3.113a.568.568 0 00-.568-.568H7.218z"
                                                                        ></path>
                                                                        <path
                                                                            fill="#fff"
                                                                            d="M3.808 3.682c-.627 0-1.136.51-1.136 1.137v4.546c0 .628.509 1.136 1.136 1.136h4.546c.628 0 1.137-.508 1.137-1.136V7.66a.568.568 0 00-1.137 0v1.705H3.808V4.819h1.705a.568.568 0 000-1.137H3.808z"
                                                                        ></path>
                                                                    </svg>
                                                                </div>
                                                                Publish{" "}
                                                                {apiOperationsStates?.publishInProgress ? (
                                                                    <Spinner animation="border" size="sm" />
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div> */}
                                                        <div
                                                            className="sustainability--edit-button sustainability-save"
                                                            onClick={() => handleSaveSettings({ displaySlug })}
                                                        >
                                                            <div className="sustainability--svg-big">
                                                                <svg
                                                                    width="14"
                                                                    height="16"
                                                                    viewBox="0 0 14 16"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M0 15C-2.41411e-08 14.4477 0.447715 14 1 14H13C13.5523 14 14 14.4477 14 15C14 15.5523 13.5523 16 13 16H1C0.447715 16 2.41411e-08 15.5523 0 15ZM3.29289 7.29289C3.68342 6.90237 4.31658 6.90237 4.70711 7.29289L6 8.58579L6 1C6 0.447716 6.44771 2.41411e-08 7 0C7.55228 -2.41411e-08 8 0.447715 8 1L8 8.58579L9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289C11.0976 7.68342 11.0976 8.31658 10.7071 8.70711L7.70711 11.7071C7.51957 11.8946 7.26522 12 7 12C6.73478 12 6.48043 11.8946 6.29289 11.7071L3.29289 8.70711C2.90237 8.31658 2.90237 7.68342 3.29289 7.29289Z"
                                                                        fill="white"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="sustainability--svg-small">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="12"
                                                                    height="13"
                                                                    fill="none"
                                                                    viewBox="0 0 12 13"
                                                                >
                                                                    <path
                                                                        fill="#fff"
                                                                        fillRule="evenodd"
                                                                        d="M1.865 10.501c0-.313.255-.568.568-.568h6.82a.568.568 0 110 1.137h-6.82a.568.568 0 01-.568-.569zm1.871-4.38a.568.568 0 01.804 0l.735.735v-4.31a.568.568 0 011.136 0v4.31l.735-.734a.568.568 0 01.804.803L6.245 8.63a.568.568 0 01-.804 0L3.736 6.925a.568.568 0 010-.803z"
                                                                        clipRule="evenodd"
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                            Save{" "}
                                                            {apiOperationsStates?.saveInProgress ? (
                                                                <Spinner animation="border" size="sm" />
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
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
                                                            title="This is your product page web site link that can be
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
                          This is your product page web site link that can be
                          advertised by you and/or your company on your own web
                          site, your social media profiles, your social media
                          posts, so that your friends and customers can access
                          this link directly from anywhere
                        </div> */}
                                                    </div>
                                                    <Tooltip
                                                        className="iconHover"
                                                        title="Copy product page Link"
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
                                                                        `${process.env.NEXT_PUBLIC_UI_URL}/dpp/${businessNameSlug}/${productSlug}`
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
                                                            value={`${process.env.NEXT_PUBLIC_UI_URL}/dpp/${businessNameSlug}/${productSlug}`} // here you should keep the link/value(string) for which you are generation promocode
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
                                                                // onBlur={(e) =>
                                                                //   handleSlugSummit({ key: "Enter", event: e })
                                                                // }
                                                                name="slug--main--element"
                                                                tabIndex={0}
                                                            >
                                                                {/* https://netcarbons.rayabharitechnologies.com/b/ */}
                                                                {`${process.env.NEXT_PUBLIC_UI_URL}/dpp/${businessNameSlug}/`}
                                                            </div>
                                                            {!inputSlugSelected ? (
                                                                <div>
                                                                    <div className="sustainability--slug--pencil--holder--main">
                                                                        <div className="sustainability--slug--pencil--holder">
                                                                            <p className="sustainability-slug-user">
                                                                                {productSlug}
                                                                            </p>
                                                                            <div
                                                                                className="sustainability--slug--edit--slug--holder"
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
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <input
                                                                        className="sustainability-slug-user sustainability-slug-user-input"
                                                                        value={productSlug}
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
                                                        {sustainabilityActionStates?.slugAvailable ===
                                                            SLUG_UNAVAILABLE &&
                                                            initSlug?.length !== 0 &&
                                                            !validationErrors?.slug?.error &&
                                                            "The link name has already been taken"}
                                                        {/* {initSlug?.length === 0 &&
                                                                    !validationErrors?.slug?.error &&
                                                                    "Please provide a link name"} */}
                                                        {validationErrors?.slug?.error &&
                                                            generateInvalidMessage({
                                                                name: validationErrors?.slug?.name,
                                                                type: validationErrors?.slug?.type,
                                                            })}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="sustainability--page-slug-toggleText-holder main--slug-sustainabilty--mobile">
                                        <div className="sustainability--page-slug-text-input-holder">
                                            <div className="sustainability--page-text-holder sustainability--page-text-holder--info">
                                                <p> product page: </p>
                                            </div>
                                        </div>
                                        <div className="sustainability--page-slug-input--mobile-holder">
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
                                                <h4 className="slugUpdate--message">
                                                    {sustainabilityActionStates?.slugAvailable ===
                                                        SLUG_AVAILABLE && "This URL is Available"}
                                                    {!sustainabilityActionStates?.slugAvailable ===
                                                        SLUG_UNAVAILABLE &&
                                                        "The link name has already been taken"}
                                                </h4>
                                            </div>


                                            <div className="sustainability--switch-button-holder--primary--slug">
                                                <p
                                                    style={
                                                        displaySlug ? { color: "#7E7E7E" } : { color: "#333" }
                                                    }
                                                >
                                                    Off
                                                </p>
                                                {/* <label class="switch">
                <input type="checkbox" />
                <span class="slider round"></span>
              </label> */}
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
                                                        Your product page is published and is currently
                                                        accessible to anyone from the Internet
                                                    </div>
                                                ) : (
                                                    <div className="sustainability--slug-information-box">
                                                        Your product page is not published and is currently
                                                        not accessible to anyone from the Internet
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <>
                                        {/* <div
                                            className="sustainability--page-heading-input-holder--heading"
                                            style={editDisabled ? { pointerEvents: "none" } : {}}
                                        >
                                            <div
                                                className="sustainability--page-text-holder"
                                                style={{ display: "flex", alignItems: "center" }}
                                            >
                                                <p>Refferal Link:</p>
                                                <Tooltip
                                                    className="iconHover"
                                                    title="Copy Refferal Link"
                                                    position="top"
                                                    trigger="mouseenter"
                                                    animation="shift"
                                                    arrow={true}
                                                    duration={200}
                                                    style={{ marginTop: "-9px" }}
                                                >
                                                    {!copied ? (
                                                        <MdContentCopy
                                                            onClick={(e) =>
                                                                handleCopy(
                                                                    `${process.env.NEXT_PUBLIC_UI_URL}?refId=${userRefferalId}`
                                                                )
                                                            }
                                                            style={{
                                                                pointerEvents: "all",
                                                                width: "18px",
                                                                height: "18px",
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
                                            </div>
                                            <div className="heading--input--holder">
                                                <input
                                                    disabled
                                                  
                                                    value={
                                                        process.env.NEXT_PUBLIC_UI_URL +
                                                        "?refId=" +
                                                        userRefferalId
                                                    }
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
                                        </div> */}
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
                                                    onKeyDown={handleKeyDown}
                                                    onChange={(e) => setProductCode(e.target.value)}
                                                    value={productCode}
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
                                                <p>Heading:</p>
                                            </div>
                                            <div className="heading--input--holder">
                                                <input
                                                    onKeyDown={handleKeyDown}
                                                    onChange={(e) => setProductHeading(e.target.value)}
                                                    value={productHeading}
                                                    className="sustainability--page-input-holder"
                                                />
                                                <div className="sustainability--invalid-message-holder position-absolute">
                                                    {validationErrors?.productHeading?.error &&
                                                        generateInvalidMessage({
                                                            name: validationErrors?.productHeading?.name,
                                                            type: validationErrors?.productHeading?.type,
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
                                                <p>Product Name:*</p>
                                            </div>
                                            <div className="heading--input--holder">
                                                <input
                                                    onKeyDown={handleKeyDown}
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
                                                <p>Product Category:*</p>
                                            </div>
                                            <div className="heading--input--holder">
                                                <input
                                                    onKeyDown={handleKeyDown}
                                                    onChange={(e) => setProductCategory(e.target.value)}
                                                    value={productCategory}
                                                    className="sustainability--page-input-holder"
                                                />
                                                <div className="sustainability--invalid-message-holder position-absolute">
                                                    {validationErrors?.productCategory?.error &&
                                                        generateInvalidMessage({
                                                            name: validationErrors?.productCategory?.name,
                                                            type: validationErrors?.productCategory?.type,
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
                                                    onKeyDown={handleKeyDown}
                                                    onChange={(e) => setProductSubCategory(e.target.value)}
                                                    value={productSubCategory}
                                                    className="sustainability--page-input-holder"
                                                />
                                                <div className="sustainability--invalid-message-holder position-absolute">
                                                    {validationErrors?.productSubCategory?.error &&
                                                        generateInvalidMessage({
                                                            name: validationErrors?.productSubCategory?.name,
                                                            type: validationErrors?.productSubCategory?.type,
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
                                                    min="0"
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
                                                        onKeyDown={handleKeyDown}
                                                        maxLength={1000}
                                                        style={{ resize: "none" }}
                                                        onChange={(e) => setProductDescription(e.target.value)}
                                                        value={productDescription}
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
                                                            className={`counter-text--sustainability ${description.length >= 1000 && `char-disallow`
                                                                }`}
                                                        >{`${description.length}/ 1000`}</p>
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
                                                        onKeyDown={handleKeyDown}
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
                                                            className={`counter-text--sustainability ${aboutUs.length >= 1000 && `char-disallow`
                                                                }`}
                                                        >{`${aboutUs.length}/ 1000`}</p>
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
                                            <div>
                                                <div className="sustainability--page-input-holder--country">
                                                    <CountrySelector
                                                        selectedCountry={selectedCountry}
                                                        setSelectedCountry={setSelectedCountry}
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
                                                {validationErrors?.country && "Please select a country"}
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
                                                <div className="heading--input--holder" key={index} style={{ border: "1px solid lightgray", position: "relative", marginBottom: "25px", borderBottom: editDisabled ? "1px solid lightgray" : "none" }}>
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
                                            {/* <div className="heading--input--holder" style={{ border: "1px solid lightgray", borderBottom:"none" }}>
                                                <input
                                                    onKeyDown={handleKeyDown}
                                                    onChange={(e) => setCertName1(e.target.value)}
                                                    value={certName1}
                                                    className="sustainability--page-input-holder"
                                                    placeholder="Certificate Name"

                                                />
                                                <input
                                                    onKeyDown={handleKeyDown}
                                                    onChange={(e) => setCertLink1(e.target.value)}
                                                    value={certLink1}
                                                    className="sustainability--page-input-holder"
                                                    placeholder="Certificate Link"
                                                />
                                            </div>
                                            <br />
                                            <div className="heading--input--holder" style={{ border: "1px solid lightgray", borderBottom:"none" }}>
                                                <input
                                                    onKeyDown={handleKeyDown}
                                                    onChange={(e) => setCertName2(e.target.value)}
                                                    value={certName2}
                                                    className="sustainability--page-input-holder"
                                                    placeholder="Certificate Name"
                                                />
                                                <input
                                                    onKeyDown={handleKeyDown}
                                                    onChange={(e) => setCertLink2(e.target.value)}
                                                    value={certLink2}
                                                    className="sustainability--page-input-holder"
                                                    placeholder="Certificate Link"
                                                />
                                            </div>
                                            <br />
                                            <div className="heading--input--holder" style={{ border: "1px solid lightgray", borderBottom:"none" }}>
                                                <input
                                                    onKeyDown={handleKeyDown}
                                                    onChange={(e) => setCertName3(e.target.value)}
                                                    value={certName3}
                                                    className="sustainability--page-input-holder"
                                                    placeholder="Certificate Name"
                                                />
                                                <input
                                                    onKeyDown={handleKeyDown}
                                                    onChange={(e) => setCertLink3(e.target.value)}
                                                    value={certLink3}
                                                    className="sustainability--page-input-holder"
                                                    placeholder="Certificate Link"
                                                />
                                            </div> */}

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
                                                <div className="heading--input--holder" key={index} style={{ border: "1px solid lightgray", position: "relative", marginBottom: "25px", borderBottom: editDisabled ? "1px solid lightgray" : "none" }}>
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
                                                    fileInputRef={imageInputRef}
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
                                                    fileInputRef={fileInputRef}
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
                                                        fileInputRef={multipleFileInputRef}
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
                                                            <img key={index} src={preview} alt="preview" style={{ height: "140px", width: "140px", border: "1px solid lightgray" }} />
                                                            <div className="delete-img" onClick={() => handleImage(preview)}>&#x2715;</div>
                                                            <br />
                                                        </div>
                                                    ))}
                                                    <div className="sustainability--page-profilePicture-input-holder--wrapper" style={{ display: previews.length >= 5 && "none" }}>
                                                        <div className="sustainability--page-profilePicture-input-holder">
                                                            <NewMultipleFileUpload
                                                                previews={previews}
                                                                setPreviews={setPreviews}
                                                                fileInputRef={multipleFileInputRef}
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
                                                <p>Template 1</p>
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
                                            onClick={() => setThemeSelected("green")}
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
                                                    className={`sustainability--each-template-check-holder ${themeSelected === "green" ? "template-clicked" : ""
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
                                        <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability" style={{ display: businessPage.split("/")[4] == "undefined" ? "none" : "" }}>
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
                                        <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability" style={{ display: businessPage.split("/")[4] == "undefined" ? "none" : "" }}>
                                            <div className="sustainability--page-slug-text-input-holder--contact">
                                                <div className="sustainability--page-text-holder--contact">
                                                    <p>Contact Phone: </p>
                                                </div>
                                                <div className="sustainability--contact--error-input-wrapper">
                                                    <div >
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
                                            position="bottom"
                                            html={
                                                <div style={{ whiteSpace: "pre-line", textAlign: "center" }}>
                                                    This is about the  <br /> company section. <br /> This section will <br /> be displayed on the <br /> the footer of the page.
                                                </div>
                                            }
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
                                                <div className="sustainability--page-slug-text-input-holder--contact">
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
                                                                    !showContact ? { color: "#7E7E7E" } : { color: "#333" }
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
                        </form>
                        
                    </>
                    {/* ) : (
                        ""
                    )} */}
                    {/* {!initSlug ? (
                        <div className="sustainability--page-no-order-error">
                            <p>
                                product page is a web page that you can publish to tell the world
                                that you are making an effort to save the environment by reducing
                                your carbon footprint
                            </p>
                            <p>
                                The page will be auto enabled after you have purchased one or more
                                carbon offsets to offset your footprint.
                            </p>
                        </div>
                    ) : (
                        ""
                    )} */}
                    {/* {!loadCompleted && userData?.slug?.slug && (
        <Spinner animation="border" size="sm" />
      )} */}
                </>
                : <p style={{ marginTop: "50px" }} className="text-center">
                    Create a business to view business sustainability page
                </p>}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        sustainData: state.sustainabilityData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        validateUser: () => {
            dispatch(validateUser());
        },
        addItemsToSustainabilityPage: (items) => {
            dispatch(addItemsToSustainabilityPage(items));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessProductEdit);
