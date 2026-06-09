import { Suspense, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { getCertificates } from "src/apiClient/user";
import MultipleFileUpload from "./elements/multipleFileUpload";
import NewFileUpload from "./elements/newFileUpload"
import NewMultipleFileUpload from "./elements/newMultipleFileUpload"
import { addItemsToSustainabilityPage } from "../../redux/actions/sustainabilityActions";
import { returnCorrectCode } from "src/data/countryCodeToISO3";
import { getCountries } from "src/apiClient/country";
import { addSupplierApi, getAllRegisteredBusiness, inviteUserApi } from "src/apiClient/business"
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
    IoIosArrowRoundUp,
    IoIosClose
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


const AddSupplier = ({
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
    setAddProductPopup,
    chainSwitch,
    setChainSwitch,
    setSelectedTab,
    refreshPendingRequests,
    setAddSupplierBox
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


    const [displaySlug, setDisplaySlug] = useState(false);
    const [title, setTitle] = useState("");

    const [selectedCurrency, setSelectedCurrency] = useState("USD")
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
    const [inviteBusiness, setInviteBusiness] = useState(false)

    const [selectedCountry, setSelectedCountry] = useState(
        sustainData?.selectedCountry
    );


    const [apiOperationsStates, setAPIOperationsState] = useState({
        saveInProgress: false,
        publishInProgress: false,
        previousVersionInProgress: false,
    });
    const [inputSlugSelected, setInputSlugSelected] = useState(false);

    const [validationErrors, setValidationErrors] = useState({});


    const { refetchBusiness, setRefetchBusiness } = useMyContext();
    const [previews, setPreviews] = useState([]);


    const [supplierBusinessName, setSupplierBusinessName] = useState("")
    const [relationship, setRelationship] = useState("")
    const [primaryContact, setPrimaryContact] = useState("")
    const [primaryEmail, setPrimaryEmail] = useState("")
    const [alternateContact, setAlternateContact] = useState("")
    const [alternateEmail, setAlternateEmail] = useState("")
    const [allRegisteredBusiness, setAllRegisteredBusiness] = useState([])
    const [openDropDown, setOpenDropDown] = useState(false)
    const [clickedDrop, setClickedDrop] = useState(false)
    const [loadingBusiness, setLoadingBusiness] = useState(false)
    const [inviteBusinessName, setInviteBusinessName] = useState("")
    const [inviteBusinessEmail, setInviteBusinessEmail] = useState("")
    const [selectedBusiness, setSelectedBusiness] = useState("")
    const [isBusinessSelected, setIsBusinessSelected] = useState(false)
    const [showBusinessRequiredMessage, setShowBusinessRequiredMessage] = useState(false)
    const [hoveredField, setHoveredField] = useState(null)
    const [invitePrimaryName, setInvitePrimaryName] = useState("")


    useEffect(() => {
        console.log(userData, sustainData, "usereditdata")
    }, [])

    useEffect(() => {
        console.log(openDropDown, "dropdetail")
    }, [openDropDown])


    useEffect(() => {
        if (supplierBusinessName.length > 2 && clickedDrop) {
            allTheBusinesses()
            setOpenDropDown(true)
        } else {
            setOpenDropDown(false)
        }
    }, [supplierBusinessName])

    useEffect(() => {
        // Check if a business is selected or if there are no businesses available
        if (selectedBusiness && selectedBusiness._id) {
            setIsBusinessSelected(true)
        } else if (allRegisteredBusiness.length === 0 && !loadingBusiness && supplierBusinessName.length > 2) {
            setIsBusinessSelected(false)
        }
    }, [selectedBusiness, allRegisteredBusiness, loadingBusiness, supplierBusinessName])


    const allTheBusinesses = async () => {
        let fetchBusinesses = await getAllRegisteredBusiness()
        if (fetchBusinesses.data.success) {
            let results = fetchBusinesses?.data?.data?.filter((item) => item.name.toLowerCase().includes(supplierBusinessName.toLowerCase()))
            setAllRegisteredBusiness(results)
            setLoadingBusiness(false)
        } else {
            setLoadingBusiness(true)
        }
        console.log(fetchBusinesses, "all-business")
    }





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
        setSupplierBusinessName("")
        setRelationship("")
        setPrimaryContact("")
        setPrimaryEmail("")
        setAlternateContact("")
        setAlternateEmail("")
        setSelectedBusiness("")
        setIsBusinessSelected(false)
        setShowBusinessRequiredMessage(false)
        setEditDisabled(true)
        // console.log(message, "aaaaddd")
        // if (message) {
        //     addToast("Your Digital Product Page has been reset to system defaults", {
        //         appearance: "success",
        //         autoDismiss: true,
        //     });
        // }
        // setAddProductMessage(false)
        // setTriggerDefault(false)
        // setClearFields(false)
    };



    // useEffect(() => {
    //     console.log("trigger")
    //     if (triggerDefault) {
    //         clearToSystemDefaultsFunc(true)
    //     }
    // }, [triggerDefault])

    // useEffect(() => {
    //     console.log("clearfields")
    //     if (clearFields) {
    //         clearToSystemDefaultsFunc(false)
    //     }
    // }, [clearFields])

    // useEffect(() => {
    //     getInitalSlugData()
    // }, [refetchBusiness])

    // const getInitalSlugData = async () => {
    //     let slugValues = await businessSlugData();
    //     setInitSlug(slugValues?.data?.data?.slug)
    //     setFirstSlug(slugValues?.data?.data?.slug)
    //     setFixedSlug(slugValues?.data?.data?.slug)
    //     setBusinessPage(`${process.env.NEXT_PUBLIC_UI_URL}/b/${slugValues?.data?.data?.slug}`)
    //     console.log(`${process.env.NEXT_PUBLIC_UI_URL}/b/${slugValues?.data?.data?.slug}`.split("/")[4], "sluggg")
    // };




    useEffect(() => {
        if (inputSlugSelected) slugInputRef.current.focus();
    }, [inputSlugSelected]);


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
        const validationItems = [supplierBusinessName, relationship, primaryContact, primaryEmail, alternateContact, alternateEmail];
        const validationItemsName = [
            "supplierBusinessName",
            "relationship",
            "primaryContact",
            "primaryEmail",
            "alternateContact",
            "alternateEmail",
        ];

        validationOfSlug(validationObject, initSlug);

        // if (phone) {
        //     const phoneValidationResults = validatePhoneNumber(phone);
        //     if (!phoneValidationResults) {
        //         setShowPhone(false);
        //         validationObject["phone"] = {
        //             error: true,
        //             name: "Phone Number",
        //             type: INVALID_CONTACT_FIELD,
        //         };
        //     }
        // }

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

        // if (validationObject?.name?.error) {
        //     setShowName(false);
        // }
        console.log(validationObject, "valid")
        // if (!validationObject?.name && name && !name.match(alphaRegex)) {
        //     setShowName(false);
        //     validationObject["name"] = {
        //         error: true,
        //         name: "name",
        //         type: INVALID_CONTACT_FIELD,
        //     };
        // }
        if (!selectedCountry) {
            validationObject["country"] = {
                error: true,
                name: "country",
                type: INVALID_FIELD_EMPTY,
            };
        }

        // if (email && !email.match(emailRegex)) {
        //     setShowEmail(false);
        //     validationObject["email"] = {
        //         error: true,
        //         name: "email",
        //         type: INVALID_CONTACT_FIELD,
        //     };
        // }
        // if (
        //     twitter &&
        //     (!twitter.includes("x.com") || !checkHttpUrl(twitter))
        // ) {
        //     setShowTwitter(false);
        //     validationObject["twitter"] = {
        //         error: true,
        //         name: "twitter",
        //         type: INVALID_CONTACT_FIELD,
        //     };
        // }
        // if (
        //     linkedin &&
        //     (!linkedin.includes("linkedin.com") || !checkHttpUrl(linkedin))
        // ) {
        //     setShowLinkedin(false);
        //     validationObject["linkedin"] = {
        //         error: true,
        //         name: "linkedin",
        //         type: INVALID_CONTACT_FIELD,
        //     };
        // }
        // if (
        //     instagram &&
        //     (!instagram.includes("instagram.com") || !checkHttpUrl(instagram))
        // ) {
        //     setShowInstagram(false);

        //     validationObject["instagram"] = {
        //         error: true,
        //         name: "instagram",
        //         type: INVALID_CONTACT_FIELD,
        //     };
        // }
        // if (
        //     facebook &&
        //     (!facebook.includes("facebook.com") || !checkHttpUrl(facebook))
        // ) {
        //     setShowFacebook(false);
        //     validationObject["facebook"] = {
        //         error: true,
        //         name: "facebook",
        //         type: INVALID_CONTACT_FIELD,
        //     };
        // }

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

        if (!isBusinessSelected) {
            setShowBusinessRequiredMessage(true)
            return;
        }

        if (!alternateContact) {
            setValidationErrors({
                ...validationErrors,
                alternateContact: {
                    error: true,
                    name: "alternateContact",
                    type: INVALID_FIELD_EMPTY,
                }
            })
            return;
        }

        let body = {
            businessId: BusinessDetails?._id,
            chainBusinessId: selectedBusiness?._id,
            chainUserId: selectedBusiness?.userId,
            chainBusinessName: supplierBusinessName,
            businessName: BusinessDetails?.name,
            relationship: chainSwitch ? "distributor" : "supplier",
            primaryName: primaryContact,
            primaryEmail,
            alternateName: alternateContact,
            alternateEmail,
        }
        console.log(body, "body")
        setEditDisabled(true)


        const validationResult = runValidation();
        console.log(validationResult, "validation")
        let AddSupplierData = await addSupplierApi(body)
        console.log(AddSupplierData, "supplier")
        if (AddSupplierData.data.success) {
            addToast(chainSwitch ? "Added distributor Successfully" : "Added supplier successfully", {
                appearance: "success",
                autoDismiss: true,
            });
            setRefreshList(!refreshList)
            setSupplierBusinessName("")
            setPrimaryContact("")
            setPrimaryEmail("")
            setAlternateContact("")
            setAlternateEmail("")
            setSelectedBusiness("")
            setIsBusinessSelected(false)
            setShowBusinessRequiredMessage(false)

        } else {
            addToast("something went wrong", {
                appearance: "error",
                autoDismiss: true,
            });
        }

    };

    const handleChangeBusiness = (e) => {
        setClickedDrop(true)
        setSupplierBusinessName(e.target.value)
        setSelectedBusiness("")
        setIsBusinessSelected(false)
        setShowBusinessRequiredMessage(false)
    }

    const handleFieldHover = (fieldName) => {
        if (!isBusinessSelected) {
            setHoveredField(fieldName)
            setShowBusinessRequiredMessage(true)
        }
    }

    const handleFieldLeave = () => {
        setHoveredField(null)
        // Keep the message visible for a bit longer
        setTimeout(() => {
            setShowBusinessRequiredMessage(false)
        }, 2000)
    }








    const handleKeyDown = (e) => {
        if (e?.key == "Enter")
            handleSaveSettings({ displaySlug }).catch((err) => console.log(err));
    };




    const handleCancel = () => {
        setEditDisabled(true)
        setSustainabilityActionStates({
            ...sustainabilityActionStates,
            slugAvailable: SLUG_UNTOUCHED,
        });
        clearToSystemDefaultsFunc(false)
        setInvitePrimaryName("")
        setInviteBusinessEmail("")
        setInviteBusinessName("")
    }

    const sendInvite = async () => {
        let body = {
            businessId: BusinessDetails?._id,
            relationship: chainSwitch ? "distributor" : "supplier",
            primaryEmail: inviteBusinessEmail,
            businessName: BusinessDetails?.name,
            chainBusinessName: inviteBusinessName,
            newBusiness: true,
            primaryName: invitePrimaryName,

        }

        let inviteAUser = await inviteUserApi(body)
        if (inviteAUser.data.success) {
            addToast(chainSwitch ? "invited distributor Successfully" : "invited supplier successfully", {
                appearance: "success",
                autoDismiss: true,
            });
            
            // Clear all fields in the popup form
            setInvitePrimaryName("")
            setInviteBusinessEmail("")
            setInviteBusinessName("")
            setPrimaryEmail("")
            
            // Close the popup
            setInviteBusiness(false)
            
            // Close the add supplier box to return to main view
            if (setAddSupplierBox) {
                setAddSupplierBox(false)
            }
            
            // Navigate to pending requests tab after successful invite
            if (setSelectedTab) {
                setSelectedTab("sent")
            }
            
            // Refresh pending requests data after navigation
            if (refreshPendingRequests) {
                // Add a small delay to ensure the tab has switched before refreshing
                setTimeout(() => {
                    refreshPendingRequests()
                }, 100)
            }
        } else {
            addToast("something went wrong", {
                appearance: "error",
                autoDismiss: true,
            });
        }
    }

        return (
            <>
                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
                {localStorage.getItem("MyBusinessDetails") ?
                    <>
                        {/* {initSlug ? ( */}
                        <>
                            <div className="backdrop-popup" style={{ display: inviteBusiness ? "" : "none" }}>
                                <div className="sustainability--confirm-popup-holder">
                                    <button
                                        className="cart-overlay__close-icon"
                                        onClick={() => {
                                            setInviteBusiness(false);
                                            setInviteBusinessName("");
                                            setInvitePrimaryName("");
                                            setInviteBusinessEmail("");
                                        }}
                                    >
                                        <IoIosClose />
                                    </button>
                                    <div>
                                        <img src="/assets/images/sustainability-popup.png" />
                                    </div>
                                    <div>
                                        <h3 className={`sustainability--popup-sure-text`}>
                                            Invite a Business
                                        </h3>
                                    </div>
                                    <div className="sustainability--popup-button-holder inputwidth">

                                        <div
                                            className="sustainability--page-heading-input-holder--heading"
                                        >
                                            <div className="sustainability--page-text-holder">
                                                <p>Business Name:*</p>
                                            </div>
                                            <div className="heading--input--holder">
                                                <input
                                                    onChange={(e) => setInviteBusinessName(e.target.value)}
                                                    value={inviteBusinessName}
                                                    className="sustainability--page-input-holder"
                                                />
                                                <div className="sustainability--invalid-message-holder position-absolute">
                                                    {validationErrors?.inviteBusinessName?.error &&
                                                        generateInvalidMessage({
                                                            name: validationErrors?.inviteBusinessName?.name,
                                                            type: validationErrors?.inviteBusinessName?.type,
                                                        })}
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className="sustainability--popup-button-holder inputwidth">
                                        <div
                                            className="sustainability--page-heading-input-holder--heading"
                                        >
                                            <div className="sustainability--page-text-holder">
                                                <p>Primary Name:*</p>
                                            </div>
                                            <div className="heading--input--holder">
                                                <input
                                                    onChange={(e) => setInvitePrimaryName(e.target.value)}
                                                    value={invitePrimaryName}
                                                    className="sustainability--page-input-holder"
                                                />
                                                <div className="sustainability--invalid-message-holder position-absolute">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sustainability--popup-button-holder inputwidth">
                                        <div
                                            className="sustainability--page-heading-input-holder--heading"
                                        >
                                            <div className="sustainability--page-text-holder">
                                                <p>Primary Email:*</p>
                                            </div>
                                            <div className="heading--input--holder">
                                                <input
                                                    onChange={(e) => setInviteBusinessEmail(e.target.value)}
                                                    value={inviteBusinessEmail}
                                                    className="sustainability--page-input-holder"
                                                />
                                                <div className="sustainability--invalid-message-holder position-absolute">
                                                    {validationErrors?.inviteBusinessEmail?.error &&
                                                        generateInvalidMessage({
                                                            name: validationErrors?.inviteBusinessEmail?.name,
                                                            type: validationErrors?.inviteBusinessEmail?.type,
                                                        })}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="sustainability--popup-button-holder">
                                        <button
                                            className="sustainability--popup-button-white button--black"
                                            onClick={() => sendInvite()}
                                        >
                                            Send Invite
                                        </button>

                                    </div>


                                </div>
                            </div>
                            <form
                                className={`sustainability--edit-main-holder ${editDisabled ? "edit--disabled" : ""
                                    }`}
                            >

                                <div className="sustainability--page--main-3-holder">
                                    <div className="sustainability--page-box-holder" style={{ border: "none" }}>
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
                                                                className={`sustainability--edit-button sustainability-save ${!isBusinessSelected ? 'disabled' : ''}`}
                                                                onClick={() => !isBusinessSelected ? setShowBusinessRequiredMessage(true) : handleSaveSettings({ displaySlug })}
                                                                onMouseEnter={() => !isBusinessSelected ? setShowBusinessRequiredMessage(true) : null}
                                                                style={!isBusinessSelected ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                                                title={!isBusinessSelected ? "Please select a business first" : ""}
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



                                        <>
                                            <div
                                                className="sustainability--page-heading-input-holder--heading"
                                                style={editDisabled ? { pointerEvents: "none" } : {}}
                                            >
                                                <div className="sustainability--page-text-holder">
                                                    <p>{chainSwitch ? "Distributor Name:*" : "Supplier Name:*"}</p>
                                                </div>

                                                <div className="heading--input--holder" style={{ position: "relative" }}>
                                                    <input
                                                        onKeyDown={handleKeyDown}
                                                        onChange={handleChangeBusiness}
                                                        value={supplierBusinessName}
                                                        className="sustainability--page-input-holder"
                                                    />
                                                    <div className="sustainability--invalid-message-holder position-absolute">
                                                        {validationErrors?.supplierBusinessName?.error &&
                                                            generateInvalidMessage({
                                                                name: validationErrors?.supplierBusinessName?.name,
                                                                type: validationErrors?.supplierBusinessName?.type,
                                                            })}
                                                        {!isBusinessSelected && supplierBusinessName.length > 2 && allRegisteredBusiness.length === 0 && !loadingBusiness && (
                                                            <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '5px' }}>
                                                                No businesses found. Please invite a business or select from available options.
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="dropdown-box" style={{ display: openDropDown ? "" : "none" }}>
                                                        {allRegisteredBusiness.length > 0 && !loadingBusiness ?
                                                            (allRegisteredBusiness.map((item) => {
                                                                return (
                                                                    <div
                                                                        onClick={() => [
                                                                            setOpenDropDown(false),
                                                                            setClickedDrop(false),
                                                                            setSupplierBusinessName(item?.name),
                                                                            setSelectedBusiness(item),
                                                                            setIsBusinessSelected(true)
                                                                        ]}
                                                                        className="airport-names"
                                                                    >
                                                                        {item?.name}
                                                                    </div>
                                                                );
                                                            })) : (
                                                                <div className="airports-loader">
                                                                    <div>
                                                                        {loadingBusiness ? <Spinner size="sm" animation="border" /> : "No business found"}
                                                                    </div>
                                                                    <br />
                                                                    <div onClick={() => {
                                                                        setInviteBusinessName(supplierBusinessName);
                                                                        setInviteBusiness(true);
                                                                    }}>
                                                                        <div className="add--product--btn">Invite a business</div>
                                                                    </div>
                                                                </div>
                                                            )}
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
                                                    <p>Business Relationship:*</p>
                                                </div>
                                                <div 
                                                    className="heading--input--holder" 
                                                    onMouseEnter={() => handleFieldHover('relationship')}
                                                    onMouseLeave={handleFieldLeave}
                                                    style={{ 
                                                        cursor: !isBusinessSelected ? 'not-allowed' : 'default',
                                                        opacity: !isBusinessSelected ? 0.6 : 1,
                                                        transition: 'opacity 0.3s ease'
                                                    }}
                                                >
                                                    <input
                                                        onKeyDown={handleKeyDown}
                                                        onChange={(e) => setRelationship(e.target.value)}
                                                        value={chainSwitch ? "distributor" : "supplier"}
                                                        className="sustainability--page-input-holder"
                                                        disabled={!isBusinessSelected}
                                                        style={{
                                                            backgroundColor: !isBusinessSelected ? '#f8f9fa' : 'white',
                                                            cursor: !isBusinessSelected ? 'not-allowed' : 'text'
                                                        }}
                                                    />
                                                    <div className="sustainability--invalid-message-holder position-absolute">
                                                        {validationErrors?.relationship?.error &&
                                                            generateInvalidMessage({
                                                                name: validationErrors?.relationship?.name,
                                                                type: validationErrors?.relationship?.type,
                                                            })}
                                                        {!isBusinessSelected && hoveredField === 'relationship' && (
                                                            <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '5px' }}>
                                                                Please select a business first
                                                            </div>
                                                        )}
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
                                                    <p>Primary Contact's Name:*</p>
                                                </div>
                                                <div 
                                                    className="heading--input--holder" 
                                                    onMouseEnter={() => handleFieldHover('primaryContact')}
                                                    onMouseLeave={handleFieldLeave}
                                                    style={{ 
                                                        cursor: !isBusinessSelected ? 'not-allowed' : 'default',
                                                        opacity: !isBusinessSelected ? 0.6 : 1,
                                                        transition: 'opacity 0.3s ease'
                                                    }}
                                                >
                                                    <input
                                                        onKeyDown={handleKeyDown}
                                                        onChange={(e) => setPrimaryContact(e.target.value)}
                                                        value={primaryContact}
                                                        className="sustainability--page-input-holder"
                                                        disabled={!isBusinessSelected}
                                                        style={{
                                                            backgroundColor: !isBusinessSelected ? '#f8f9fa' : 'white',
                                                            cursor: !isBusinessSelected ? 'not-allowed' : 'text'
                                                        }}
                                                    />
                                                    <div className="sustainability--invalid-message-holder position-absolute">
                                                        {validationErrors?.primaryContact?.error &&
                                                            generateInvalidMessage({
                                                                name: validationErrors?.primaryContact?.name,
                                                                type: validationErrors?.primaryContact?.type,
                                                            })}
                                                        {!isBusinessSelected && hoveredField === 'primaryContact' && (
                                                            <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '5px' }}>
                                                                Please select a business first
                                                            </div>
                                                        )}
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
                                                    <p>Primary Contact's Email:*</p>
                                                </div>
                                                <div 
                                                    className="heading--input--holder" 
                                                    onMouseEnter={() => handleFieldHover('primaryEmail')}
                                                    onMouseLeave={handleFieldLeave}
                                                    style={{ 
                                                        cursor: !isBusinessSelected ? 'not-allowed' : 'default',
                                                        opacity: !isBusinessSelected ? 0.6 : 1,
                                                        transition: 'opacity 0.3s ease'
                                                    }}
                                                >
                                                    <input
                                                        onKeyDown={handleKeyDown}
                                                        onChange={(e) => setPrimaryEmail(e.target.value)}
                                                        value={primaryEmail}
                                                        className="sustainability--page-input-holder"
                                                        disabled={!isBusinessSelected}
                                                        style={{
                                                            backgroundColor: !isBusinessSelected ? '#f8f9fa' : 'white',
                                                            cursor: !isBusinessSelected ? 'not-allowed' : 'text'
                                                        }}
                                                    />
                                                    <div className="sustainability--invalid-message-holder position-absolute">
                                                        {validationErrors?.primaryEmail?.error &&
                                                            generateInvalidMessage({
                                                                name: validationErrors?.primaryEmail?.name,
                                                                type: validationErrors?.primaryEmail?.type,
                                                            })}
                                                        {!isBusinessSelected && hoveredField === 'primaryEmail' && (
                                                            <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '5px' }}>
                                                                Please select a business first
                                                            </div>
                                                        )}
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
                                                    <p>Alternate Contact's Name:*</p>
                                                </div>
                                                <div 
                                                    className="heading--input--holder" 
                                                    onMouseEnter={() => handleFieldHover('alternateContact')}
                                                    onMouseLeave={handleFieldLeave}
                                                    style={{ 
                                                        cursor: !isBusinessSelected ? 'not-allowed' : 'default',
                                                        opacity: !isBusinessSelected ? 0.6 : 1,
                                                        transition: 'opacity 0.3s ease'
                                                    }}
                                                >
                                                    <input
                                                        onKeyDown={handleKeyDown}
                                                        onChange={(e) => setAlternateContact(e.target.value)}
                                                        value={alternateContact}
                                                        className="sustainability--page-input-holder"
                                                        disabled={!isBusinessSelected}
                                                        style={{
                                                            backgroundColor: !isBusinessSelected ? '#f8f9fa' : 'white',
                                                            cursor: !isBusinessSelected ? 'not-allowed' : 'text'
                                                        }}
                                                    />
                                                    <div className="sustainability--invalid-message-holder position-absolute">
                                                        {validationErrors?.alternateContact?.error &&
                                                            generateInvalidMessage({
                                                                name: validationErrors?.alternateContact?.name,
                                                                type: validationErrors?.alternateContact?.type,
                                                            })}
                                                        {!isBusinessSelected && hoveredField === 'alternateContact' && (
                                                            <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '5px' }}>
                                                                Please select a business first
                                                            </div>
                                                        )}
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
                                                    <p>Alternate Contact's Email:*</p>
                                                </div>
                                                <div 
                                                    className="heading--input--holder" 
                                                    onMouseEnter={() => handleFieldHover('alternateEmail')}
                                                    onMouseLeave={handleFieldLeave}
                                                    style={{ 
                                                        cursor: !isBusinessSelected ? 'not-allowed' : 'default',
                                                        opacity: !isBusinessSelected ? 0.6 : 1,
                                                        transition: 'opacity 0.3s ease'
                                                    }}
                                                >
                                                    <input
                                                        onKeyDown={handleKeyDown}
                                                        onChange={(e) => setAlternateEmail(e.target.value)}
                                                        value={alternateEmail}
                                                        className="sustainability--page-input-holder"
                                                        disabled={!isBusinessSelected}
                                                        style={{
                                                            backgroundColor: !isBusinessSelected ? '#f8f9fa' : 'white',
                                                            cursor: !isBusinessSelected ? 'not-allowed' : 'text'
                                                        }}
                                                    />
                                                    <div className="sustainability--invalid-message-holder position-absolute">
                                                        {validationErrors?.alternateEmail?.error &&
                                                            generateInvalidMessage({
                                                                name: validationErrors?.alternateEmail?.name,
                                                                type: validationErrors?.alternateEmail?.type,
                                                            })}
                                                        {!isBusinessSelected && hoveredField === 'alternateEmail' && (
                                                            <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '5px' }}>
                                                                Please select a business first
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>

                                        {/* General warning message when no business is selected */}
                                        {!isBusinessSelected && showBusinessRequiredMessage && (
                                            <div style={{ 
                                                backgroundColor: '#fff3cd', 
                                                border: '1px solid #ffeaa7', 
                                                borderRadius: '4px', 
                                                padding: '12px', 
                                                margin: '20px 0',
                                                color: '#856404',
                                                fontSize: '14px',
                                                textAlign: 'center',
                                                animation: 'fadeIn 0.3s ease-in'
                                            }}>
                                                <strong>⚠️ Please select a business first</strong><br/>
                                                {hoveredField ? 
                                                    `You need to select a business from the dropdown above before you can fill in the ${hoveredField.replace(/([A-Z])/g, ' $1').toLowerCase()} field.` :
                                                    'You need to select a business from the dropdown above before you can fill in the other details.'
                                                }
                                            </div>
                                        )}







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
                        Create a business to add a supplier
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

    export default connect(mapStateToProps, mapDispatchToProps)(AddSupplier);
