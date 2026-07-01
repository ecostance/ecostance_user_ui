import { Suspense, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { getCertificates } from "src/apiClient/user";
import FileUpload from "./elements/fileUpload";
import { addItemsToBusinessSustainabilityPage } from "../../redux/actions/businessSustainabilityActions";
import { returnCorrectCode } from "src/data/countryCodeToISO3";
import { getCountries } from "src/apiClient/country";

import Switch from "./elements/Switch";
import { ToastProvider, useToasts } from "react-toast-notifications";
import {
    IoIosCopy,
    IoIosDownload,
    IoIosInformation,
    IoIosInformationCircleOutline,
    IoIosShareAlt,
    IoMdCopy,
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
import { getBusinessOrdersData } from "src/apiClient/business"
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

const BusinessSustainability = ({
    userData,
    sustainData,
    validateUser,
    clearSustainabilityData,
    handleShowStartAgainModal,
    clearToSystemDefaults,
    addItemsToBusinessSustainabilityPage,
    editDisabled,
    setEditDisabled,
    resetToPageEnter,
    dataChanged,
    setDataChanged,
    secondUpdateV2,
    setSustainabilitySave,
    setSustainabilityHelperFunctions,
}) => {
    const validationItemOnLength = {
        title: { min: 10, max: 50 },
        description: { min: 10, max: 1000 },
        aboutUs: { min: 10, max: 1000 },
        name: { min: 3, max: 100 },
    };
    const slugRegex = /^[A-Za-z0-9]*$/;
    const { addToast } = useToasts();
    let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
    let businessCode = BusinessDetails?.businessCode
    let businessName = BusinessDetails?.name
    const router = useRouter();
    const slugInputRef = useRef(null);
    const [startDataFetched, setStartDataFetched] = useState(false);
    const [sustainabilityActionStates, setSustainabilityActionStates] = useState({
        slugChanged: false,
        slugAvailable: SLUG_UNTOUCHED,
        slugStatusChangedToTrue: false,
    });
    const [displaySlug, setDisplaySlug] = useState(false);
    const [title, setTitle] = useState(sustainData?.title);
    const [description, setDescription] = useState(sustainData?.description);
    const [aboutUs, setAboutUs] = useState(sustainData?.aboutUs);
    const [name, setName] = useState(businessName);
    const [initSlug, setInitSlug] = useState("")
    const [fixedSlug, setFixedSlug] = useState("")
    const [phone, setPhone] = useState(
        sustainData?.phone ||
        userData?.billingAddress?.phone?.numericCode || "1" +
        userData?.billingAddress?.phone?.number || "1234567890"
    );
    const [email, setEmail] = useState(sustainData?.email);
    const [twitter, setTwitter] = useState(sustainData?.twitter);
    const [linkedin, setLinkedIn] = useState(sustainData?.linkedin);
    const [instagram, setInstagram] = useState(sustainData?.instagram);
    const [facebook, setFacebook] = useState(sustainData?.facebook);
    const [firstSlug, setFirstSlug] = useState("")
    const [hasExistingSlug, setHasExistingSlug] = useState(false)
    const [image, setImage] = useState("");
    const [businessOrders, setBusinessOrders] = useState([])

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
    const [themeSelected, setThemeSelected] = useState("blue");
    
    // Footer section state
    const [homePageURL, setHomePageURL] = useState("");
    const [aboutUsURL, setAboutUsURL] = useState("");
    const [contactPageURL, setContactPageURL] = useState("");
    const [showHomePage, setShowHomePage] = useState(false);
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [showContactUs, setShowContactUs] = useState(false);
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
        numericCode: userData?.billingAddress?.phone?.numericCode || "1",
        number: userData?.billingAddress?.phone?.number || "1234567890",
        countryCode: returnCorrectCode(
            userData?.billingAddress?.phone?.countryCode || "USA"
        ),
    });

    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const [noReduxOperation, setNoReduxOperation] = useState(false);
    const { refetchBusiness, setRefetchBusiness } = useMyContext();

    let userRefferalId = localStorage.getItem("userId")


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

    const clearToSystemDefaultsFunc = () => {
        setTitle("We are doing our part in combating climate change");
        setDescription(
            "We are reducing our greenhouse gas emissions everyday by wasting less, buying green, saving energy and by being conscientious consumers. But we can make only limited lifestyle changes. For our remaining emissions, we are buying carbon offsets to have a zero emission footprint. Each carbon offset we purchase goes into certified projects like planting new trees, reforestation, methane sequestration, ocean cleanup, and other such initiatives that help combat climate change today. We decided not to wait and do something today."
        );
        setAboutUs(
            "This is a paragraph about us. We are a family of five, living in Miami, Florida We are interested in playing our part in saving the environment and our planet. Living in a city that is on the front line of climate change gives us a front row-seat to the impending loom. Often during high tides or occasional torrential rains, we are inundated with a flooded downtown where spotting a fish is commonplace. We are not waiting for 2030 or 2050 for NetZero. Yes the government and businesses have to play their part, but we as individuals can make a much bigger difference. If you can spread the word, that now there is a way, we have a chance.The world you and I have inherited is not just ours, but we are mere beneficiaries of its wonders. It is our responsibility to take care of it so that we can pass it on to our future."
        );
        setName(
            businessName
        );
        setPhone(
            userData?.billingAddress?.phone?.numericCode || "1" +
            userData?.billingAddress?.phone?.number || "1234567890"
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

        // setCountry(
        //   currentUserSettings?.country && currentUserSettings?.country !== ""
        //     ? currentUserSettings?.country
        //     : userData?.billingAddress?.country
        // );

        setSelectedCountry(
            countryNameToISO3(userData?.billingAddress?.country || "India")
        );
        setShowName(false); // need to do it after the field is added
        setShowEmail(false);
        setShowPhone(false);
        setShowTwitter(false);
        setShowLinkedin(false);
        setShowInstagram(false);
        setShowFacebook(false);
        setStartDataFetched(true);
        setDisplaySlug(false);
        setThemeSelected("blue");
        setHomePageURL("");
        setAboutUsURL("");
        setContactPageURL("");
        setShowHomePage(false);
        setShowAboutUs(false);
        setShowContactUs(false);
        addItemsToBusinessSustainabilityPage({
            title,
            description,
            aboutUs,
            selectedCountry,
            image,
            name,
            phone,
            email,
            twitter,
            linkedin,
            instagram,
            facebook,
            showName,
            showPhone,
            showEmail,
            showTwitter,
            showLinkedin,
            showInstagram,
            showFacebook,
            imageURL: "",
            themeSelected,
            displaySlug,
            phoneInfo,
            homePageURL,
            aboutUsURL,
            contactPageURL,
            showHomePage,
            showAboutUs,
            showContactUs,
        });
        setEditDisabled(true)
        addToast("Your EcoStance Page has been reset to system defaults", {
            appearance: "success",
            autoDismiss: true,
        });
    };

    const fetchDataFromAPIInitial = async () => {
        try {
            await fetchDataFromAPI();
        } catch (err) {
            console.log(err);
        }

        if (!selectedCountry)
            setSelectedCountry(countryNameToISO3(userData?.billingAddress?.country));

        addItemsToBusinessSustainabilityPage({
            title,
            description,
            aboutUs,
            selectedCountry,
            image,
            name,
            phone,
            email,
            twitter,
            linkedin,
            instagram,
            facebook,
            showName,
            showPhone,
            showEmail,
            showTwitter,
            showLinkedin,
            showInstagram,
            showFacebook,
            imageURL: image,
            themeSelected,
            displaySlug,
            phoneInfo,
            homePageURL,
            aboutUsURL,
            contactPageURL,
            showHomePage,
            showAboutUs,
            showContactUs,
        });
        if (selectedCountry || countryNameToISO3(userData?.billingAddress?.country))
            setLoadCompleted(true);
    };

    // const execValidateUserTimeout = setTimeout(() => {
    //   validateUser()
    // }, 1000)

    // useEffect(() => {
    //   if (userData?.billingAddress?.firstName && !selectedCountry) {
    //     fetchDataFromAPIInitial()
    //   }
    // }, [userData?.billingAddress?.firstName])

    useEffect(() => {
        getInitalSlugData()
    }, [refetchBusiness])

    const getInitalSlugData = async () => {
        let slugValues = await businessSlugData();
        // console.log(slugValues.data.data.slug, "slugData12")
        const slug = slugValues?.data?.data?.slug;
        const hasSlug = !!slug;
        const defaultSlug = slug || "business";
        setInitSlug(defaultSlug)
        setFirstSlug(defaultSlug)
        setFixedSlug(defaultSlug)
        setHasExistingSlug(hasSlug)
    };

    useEffect(() => {
        fetchDataFromAPIInitial()
            .then(() => {
                setDataChanged(false);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (inputSlugSelected) slugInputRef.current.focus();
    }, [inputSlugSelected]);

    useEffect(() => {
        getOrdersData()
        console.log(userData, "userdatasustain")
    }, []);


    const getOrdersData = async () => {
        let res = await getBusinessOrdersData()
        if (res.data.success) {
            console.log("new-business-orders-1", res.data)
            setBusinessOrders(res.data)
            console.log(res.data?.businessProfileAggregate?.ghgReduced === 0, "abcs")
        }
    }

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
                "Your changes made to the EcoStance Page have been reset to its previous version",
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

    useEffect(() => {
        if (secondUpdate.current) {
            secondUpdate.current = false;
        } else {
            if (!noReduxOperation) {
                !dataChanged && setDataChanged(true);

                const validationResult = runValidation();
                // if (!validationResult?.result) return;

                if (typeof image != "string") {
                    getBase64(image, (base64Image) => {
                        return addItemsToBusinessSustainabilityPage({
                            title,
                            description,
                            aboutUs,
                            selectedCountry,
                            image,
                            name,
                            phone,
                            email,
                            twitter,
                            linkedin,
                            instagram,
                            facebook,
                            showName,
                            showPhone,
                            showEmail,
                            showTwitter,
                            showLinkedin,
                            showInstagram,
                            showFacebook,
                            imageURL: base64Image,
                            themeSelected,
                            displaySlug,
                            phoneInfo,
                            homePageURL,
                            aboutUsURL,
                            contactPageURL,
                            showHomePage,
                            showAboutUs,
                            showContactUs,
                        });
                    });
                }

                addItemsToBusinessSustainabilityPage({
                    title,
                    description,
                    aboutUs,
                    selectedCountry,
                    image,
                    name,
                    phone,
                    email,
                    twitter,
                    linkedin,
                    instagram,
                    facebook,
                    showName,
                    showPhone,
                    showEmail,
                    showTwitter,
                    showLinkedin,
                    showInstagram,
                    showFacebook,
                    imageURL: image,
                    themeSelected,
                    displaySlug,
                    phoneInfo,
                    homePageURL,
                    aboutUsURL,
                    contactPageURL,
                    showHomePage,
                    showAboutUs,
                    showContactUs,
                });
            }
        }
    }, [
        title,
        description,
        aboutUs,
        selectedCountry,
        image,
        name,
        phone,
        email,
        twitter,
        linkedin,
        instagram,
        facebook,
        showName,
        showPhone,
        showEmail,
        showTwitter,
        showLinkedin,
        showInstagram,
        showFacebook,
        noReduxOperation,
        themeSelected,
        displaySlug,
        homePageURL,
        aboutUsURL,
        contactPageURL,
        showHomePage,
        showAboutUs,
        showContactUs,
    ]);

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
            themeSelected: currentUserSettings?.themeSelected || "blue",
            homePageURL: currentUserSettings?.homePageURL || "",
            aboutUsURL: currentUserSettings?.aboutUsURL || "",
            contactPageURL: currentUserSettings?.contactPageURL || "",
            showHomePage: currentUserSettings?.showHomePage || false,
            showAboutUs: currentUserSettings?.showAboutUs || false,
            showContactUs: currentUserSettings?.showContactUs || false,
        };
        return formattedData;
    };

    const updateAPIDataToPage = (
        currentUserSettings,
        isPublicURL = displaySlug
    ) => {
        const data = returnFormattedDataForPage(currentUserSettings);
        setDisplaySlug(isPublicURL);
        setTitle(data?.title);
        setDescription(data?.description);
        setAboutUs(data?.aboutUs);
        setName(businessName);
        data?.phone && setPhone(data?.phone?.numericCode + data?.phone?.number);
        data?.phone &&
            setPhoneInfo({
                numericCode: data?.phone?.numericCode?.slice(1),
                number: data?.phone?.number,
                countryCode: returnCorrectCode(data?.phone?.countryCode),
            });
        setEmail(data?.email);
        setTwitter(data?.twitter);
        setLinkedIn(data?.linkedin);
        setInstagram(data?.instagram);
        setFacebook(data?.facebook);
        setImage(data?.image);
        // setCountry(
        //   currentUserSettings?.country && currentUserSettings?.country !== ""
        //     ? currentUserSettings?.country
        //     : userData?.billingAddress?.country
        // );

        setSelectedCountry(data?.selectedCountry);

        setShowName(convertStringToBoolean(data?.showName, "Name")); // need to do it after the field is added
        setShowEmail(convertStringToBoolean(data?.showEmail, "Email"));
        setShowPhone(convertStringToBoolean(data?.showPhone, "Phone"));
        setShowTwitter(convertStringToBoolean(data?.showTwitter, "Twitter"));
        setShowLinkedin(convertStringToBoolean(data?.showLinkedin, "LinkedIn"));
        setShowInstagram(convertStringToBoolean(data?.showInstagram, "Instagram"));
        setShowFacebook(convertStringToBoolean(data?.showFacebook, "Facebook"));
        setThemeSelected(data?.themeSelected || "blue");
        setHomePageURL(data?.homePageURL || "");
        setAboutUsURL(data?.aboutUsURL || "");
        setContactPageURL(data?.contactPageURL || "");
        setShowHomePage(convertStringToBoolean(data?.showHomePage, "HomePage"));
        setShowAboutUs(convertStringToBoolean(data?.showAboutUs, "AboutUs"));
        setShowContactUs(convertStringToBoolean(data?.showContactUs, "ContactUs"));
    };

    const fetchDataFromAPI = async (publish = false) => {
        try {
            setNoReduxOperation(true);
            const res = await getCurrentBusinessSustainabilityPage();

            // setCurrentUserSettings(res.data.data);
            let currentUserSettings;
            if (publish) {
                currentUserSettings = res?.data?.data;
            } else {
                currentUserSettings = res?.data?.data?.draft;
            }

            updateAPIDataToPage(currentUserSettings, res?.data?.data?.isPublic);

            setStartDataFetched(true);
            setNoReduxOperation(false);
            return res;
        } catch (error) {
            console.log(error);
        }
    };

    // const [userBio, setUserBio] = useState("");

    const selectTemplate = (item) => {
        const allTemplates = [
            setBlueSelected,
            setGraySelected,
            setWhiteSelected,
            setGreenSelected,
            setBeigeSelected,
            setPinkSelected,
        ];
        allTemplates.forEach((each) => {
            if (item !== each) {
                each(false);
            } else {
                each(true);
            }
        });
    };

    const themeSelectCSS = (val) => {
        let border;
        if (val) {
            border = "1px solid blue";
        }
        return {
            width: "120px",
            height: "200px",
            cursor: "pointer",
            border: border,
        };
    };

    const handlepublishBusinessPage = async () => {
        const validationResult = runValidation();
        // if (!validationResult?.result) return;
        setAPIOperationsState({ ...apiOperationsStates, publishInProgress: true });
        const dataForm = returnAppendedFormData();
        setDisplaySlug(true);

        const res = await publishBusinessPage(dataForm);
        if (res.status === 200) {
            if (sustainabilityActionStates?.slugChanged) {
                setSustainabilityActionStates({
                    ...sustainabilityActionStates,
                    slugChanged: false,
                });
            }
            validateUser();

            setDataChanged(false);
            setAPIOperationsState({
                ...apiOperationsStates,
                publishInProgress: false,
            });
            addToast(
                "Your changes made to the EcoStance Page have been saved and published",
                {
                    appearance: "success",
                    autoDismiss: true,
                }
            );
            setEditDisabled(true);
        } else {
            addToast("Something went wrong, please try again later.", {
                appearance: "error",
                autoDismiss: true,
            });
        }
    };

    const generateInvalidMessage = ({ name, type, quote }) => {
        if (name === "slug" && type === INVALID_SLUG_REGEX_MATCH) {
            return "The URL can only contain letters and numbers";
        }

        if (name === "slug" && type === INVALID_INPUT_HIGH_CHAR) {
            return "The URL cannot have more than 12 characters";
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
        const validationItems = [title, description, aboutUs, name];
        const validationItemsName = [
            "title",
            "description",
            "aboutUs",
            "name",
            "phone",
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

            if (validationItem?.length < validationItemOnLength[validationName]?.min) {
                item = checkFieldValidation(validationName, INVALID_INPUT_LOW_CHAR);
            } else if (
                validationItem?.length > validationItemOnLength[validationName]?.max
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

        // Footer URL validation
        if (homePageURL && !checkHttpUrl(homePageURL)) {
            setShowHomePage(false);
            validationObject["homePageURL"] = {
                error: true,
                name: "homePageURL",
                type: INVALID_CONTACT_FIELD,
            };
        }
        if (aboutUsURL && !checkHttpUrl(aboutUsURL)) {
            setShowAboutUs(false);
            validationObject["aboutUsURL"] = {
                error: true,
                name: "aboutUsURL",
                type: INVALID_CONTACT_FIELD,
            };
        }
        if (contactPageURL && !checkHttpUrl(contactPageURL)) {
            setShowContactUs(false);
            validationObject["contactPageURL"] = {
                error: true,
                name: "contactPageURL",
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
        const validationResult = runValidation();
        console.log(validationResult, "validation")
        // if (!validationResult?.result) return;
        setAPIOperationsState({ ...apiOperationsStates, saveInProgress: true });

        if (!runFromPopup && sustainabilityActionStates?.slugStatusChangedToTrue) {
            return handleShowStartAgainModal("SAVE_PUBLISH");
        }
        await promisedSetState(setDisplaySlug, displaySlug);

        handleSaveSettingsToAPI({ slug: initSlug, displaySlug, runFromPopup });
    };

    const handleSaveSettingsToAPI = async (data) => {
        console.log(validationErrors, sustainabilityActionStates?.slugAvailable, "slugerror")
        if (sustainabilityActionStates?.slugAvailable === SLUG_UNAVAILABLE) {
            setAPIOperationsState({ ...apiOperationsStates, saveInProgress: false });
            return addToast("Link name has already been taken", {
                appearance: "error",
                autoDismiss: true,
            });
        }
        if (!initSlug) {
            setAPIOperationsState({ ...apiOperationsStates, saveInProgress: false });
            return addToast("Link name cannot be empty", {
                appearance: "error",
                autoDismiss: true,
            });
        }
        const res = await saveSustainabilityPageToAPI(data);
        if (res?.status === 200) {
            // validateUser();
            validateUser();
            setDataChanged(false);
            if (sustainabilityActionStates?.slugChanged) {
                setSustainabilityActionStates({
                    ...sustainabilityActionStates,
                    slugChanged: false,
                });
            }
            setAPIOperationsState({ ...apiOperationsStates, saveInProgress: false });
            setRefetchBusiness(!refetchBusiness)
            setEditDisabled(true)
            addToast("Your changes made to the EcoStance Page have been saved", {
                appearance: "success",
                autoDismiss: true,
            });
        } else {
            setAPIOperationsState({ ...apiOperationsStates, saveInProgress: false });
            addToast("Something went wrong, please try again later.", {
                appearance: "error",
                autoDismiss: true,
            });
        }
    };

    setSustainabilityHelperFunctions({
        saveSettingsFunc: handleSaveSettings,
        resetToDefault: clearToSystemDefaultsFunc,
        resetToPreviousVersion: resetToPreviousVersion,
        fetchDataFromAPIInitial: fetchDataFromAPIInitial,
        setDataChanged: setDataChanged,
        setEditDisabled: setEditDisabled,
        setLoading: (value) =>
            setAPIOperationsState({ ...apiOperationsStates, saveInProgress: value }),
        // setPreviousVersionLoading: (value) =>
        //   setAPIOperationsState({
        //     ...apiOperationsStates,
        //     previousVersionInProgress: value,
        //   }),
        setSlug: async (value) => [await promisedSetState(setDisplaySlug, value)],
        setSlugStatusChanged: async (value) =>
            await promisedSetState(setSustainabilityActionStates, {
                ...sustainabilityActionStates,
                slugStatusChangedToTrue: value,
            }),
    });

    const onKeyDown = async (e) => {
        e.preventDefault();
        await handleSaveSettings();
    };

    const returnAppendedFormData = () => {
        const dataForm = new FormData();
        let BusinessDetails = JSON.parse(localStorage.getItem("MyBusinessDetails"))
        let businessCode = BusinessDetails?.businessCode
        let businessName = BusinessDetails?.name
        // checkDataItem(name);
        console.log(
            "3 vals",

            fixedSlug !== initSlug,
            sustainabilityActionStates?.slugAvailable === SLUG_UNTOUCHED ||
            sustainabilityActionStates?.slugAvailable === SLUG_AVAILABLE
        );
        if (
            fixedSlug !== initSlug &&
            (sustainabilityActionStates?.slugAvailable === SLUG_UNTOUCHED ||
                sustainabilityActionStates?.slugAvailable === SLUG_AVAILABLE)
        ) {
            if (!hasExistingSlug) {
                // First time saving - only send slug
                dataForm.append("slug", initSlug);
            } else {
                // Editing existing slug - send both current and new
                dataForm.append("slug", fixedSlug);
                dataForm.append("newSlug", initSlug);
            }
        }
        if (phone && phone !== `+${phoneInfo?.numericCode}` && phone.length > 2) {
            const phoneDetails = returnPhoneDetails(phoneInfo);
            dataForm.append("number", phoneDetails?.number);
            dataForm.append("countryCode", `${phoneDetails?.countryCode}`);
            dataForm.append("numericCode", `+${phoneDetails?.numericCode}`);
        }
        dataForm.append("name", businessName);
        dataForm.append("showName", showName);
        dataForm.append("email", email);
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
        dataForm.append("country", selectedCountry);
        dataForm.append("aboutUs", aboutUs);
        dataForm.append("description", description);
        dataForm.append("title", title);
        dataForm.append("profilePicURL", image);
        dataForm.append("isPublic", displaySlug);
        dataForm.append("businessCode", businessCode);
        dataForm.append("themeSelected", themeSelected?.toLowerCase() || "blue");
        dataForm.append("homePageURL", homePageURL);
        dataForm.append("aboutUsURL", aboutUsURL);
        dataForm.append("contactPageURL", contactPageURL);
        dataForm.append("showHomePage", showHomePage);
        dataForm.append("showAboutUs", showAboutUs);
        dataForm.append("showContactUs", showContactUs);
        return dataForm;
    };

    const saveSustainabilityPageToAPI = async ({ displaySlug, runFromPopup }) => {
        const validationResult = runValidation();
        // if (!validationResult?.result) return;
        const dataForm = returnAppendedFormData();
        try {
            if (runFromPopup)
                [dataForm.delete("isPublic"), dataForm.append("isPublic", displaySlug)];
            return await updateUserBusinessSettingInfo(dataForm);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSlugChange = async (value) => {
        //setCurrentSlug({ value: value.toLowerCase() });
        setInitSlug(value.toLowerCase())
        const validationObject = {};
        const validationErrorLocal = {};
        validationOfSlug(validationObject, value);
        !validationObject?.slug?.error && delete validationErrors.slug;
        if (validationObject?.slug?.error)
            validationErrorLocal.slug = validationObject.slug;
        setValidationErrors(validationErrorLocal);
        if (validationObject?.slug?.error) return;
        if (value && value !== fixedSlug) {
            const res = await checkBusinessSlug(value);
            setSustainabilityActionStates({
                ...sustainabilityActionStates,
                slugAvailable:
                    res.data.userSlug == true ? SLUG_AVAILABLE : SLUG_UNAVAILABLE,
            });
        }
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
    }

    return (
        <>
            {localStorage.getItem("MyBusinessDetails") ?
                <>
                    {businessOrders?.businessProfileAggregate?.ghgReduced > 0 ? (
                        <form
                            className={`sustainability--edit-main-holder ${editDisabled ? "edit--disabled" : ""
                                }`}
                        >
                            <div className="main--sustainability--edit-button-holder">
                                <div className="sustainability--edit-buttons-holder">
                                    {editDisabled ? (
                                        <div
                                            onClick={() => setEditDisabled(false)}
                                            className="sustainability--edit-button sustainability-start-again button--black"
                                        >
                                            Edit
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {!editDisabled ? (
                                        <>
                                            <div
                                                onClick={() =>
                                                    dataChanged
                                                        ? handleShowStartAgainModal("ENABLE_EDIT")
                                                        : handleCancel()
                                                }
                                                // onClick={() => didValuesChanged()}
                                                className="sustainability--edit-button sustainability-start-again button--white"
                                            >
                                                Cancel
                                            </div>
                                            <div
                                                onClick={() => handleShowStartAgainModal("SYSTEM_DEFAULTS")}
                                                className="sustainability--edit-button sustainability-start-again button--white"
                                            >
                                                DEFAULT VALUES
                                            </div>
                                            <div
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
                                            </div>
                                            <a
                                                target="_blank"
                                                href={`${process.env.NEXT_PUBLIC_UI_URL}/businesspreview/${sustainabilityActionStates?.slugAvailable ===
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
                                            </a>

                                            <div
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
                                            </div>
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
                            <div className="sustainability--page--main-3-holder">
                                <div className="sustainability--page-box-holder">
                                    <div style={{ padding: "0px 30px 0px", width: "100%" }}>
                                        <div className="profile-line" style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                                            <p className="orders--orderNumber-Holder" style={{ display: localStorage.getItem("MyBusinessDetails") ? "" : "none" }}>Business Name:  <b>{JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}</b></p>
                                            <p className="profile-head"></p>
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
                                                    <p>EcoStance Page: </p>
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
                                                            title="This is your EcoStance Page web site link that can be
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
                                                        title="Copy EcoStance Page Link"
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
                                                                        `${process.env.NEXT_PUBLIC_UI_URL}/b/${initSlug}`
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
                                                            value={`${process.env.NEXT_PUBLIC_UI_URL}/b/${initSlug}`} // here you should keep the link/value(string) for which you are generation promocode
                                                            size={250} // the dimension of the QR code (number)
                                                            logoImage="/assets/images/ecostance-qr-logo.png" // URL of the logo you want to use, make sure it is a dynamic url
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
                                                {/* {userData?.slug?.slug && ( */}
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
                                                                {`${process.env.NEXT_PUBLIC_UI_URL}/b/`}
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
                                                                Your EcoStance Page is published and is currently
                                                                accessible to anyone from the Internet
                                                            </div>
                                                        ) : (
                                                            <div className="sustainability--slug-information-box">
                                                                Your EcoStance Page is not published and is
                                                                currently not accessible to anyone from the
                                                                Internet
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="error-msg position-absolute">
                                                        {/* Slug feedback is only relevant while the user is
                                                            editing the slug; don't surface it in the default
                                                            read-only view. */}
                                                        {/* {sustainabilityActionStates?.slugAvailable ===
                            SLUG_AVAILABLE &&
                            currentSlug?.length !== 0 &&
                            !validationErrors?.slug?.error &&
                            "This URL is Available"} */}
                                                        {inputSlugSelected &&
                                                            sustainabilityActionStates?.slugAvailable ===
                                                            SLUG_UNAVAILABLE &&
                                                            initSlug?.length !== 0 &&
                                                            !validationErrors?.slug?.error &&
                                                            "The link name has already been taken"}
                                                        {inputSlugSelected &&
                                                            initSlug?.length === 0 &&
                                                            !validationErrors?.slug?.error &&
                                                            "Please provide a link name"}
                                                        {inputSlugSelected &&
                                                            validationErrors?.slug?.error &&
                                                            generateInvalidMessage({
                                                                name: validationErrors?.slug?.name,
                                                                type: validationErrors?.slug?.type,
                                                            })}
                                                    </p>
                                                </div>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sustainability--page-slug-toggleText-holder main--slug-sustainabilty--mobile">
                                        <div className="sustainability--page-slug-text-input-holder">
                                            <div className="sustainability--page-text-holder sustainability--page-text-holder--info">
                                                <p> EcoStance Page: </p>
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
                                                <h4 className="slugUpdate--message">
                                                    {sustainabilityActionStates?.slugAvailable ===
                                                        SLUG_AVAILABLE && "This URL is Available"}
                                                    {!sustainabilityActionStates?.slugAvailable ===
                                                        SLUG_UNAVAILABLE &&
                                                        "The link name has already been taken"}
                                                </h4>
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
                                                        Your EcoStance Page is published and is currently
                                                        accessible to anyone from the Internet
                                                    </div>
                                                ) : (
                                                    <div className="sustainability--slug-information-box">
                                                        Your EcoStance Page is not published and is currently
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
                                                <p>Heading:</p>
                                            </div>
                                            <div className="heading--input--holder">
                                                <input
                                                    onKeyDown={handleKeyDown}
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
                                    <div
                                        className="sustainability--page-profilePicture-holder"
                                        style={editDisabled ? { pointerEvents: "none" } : {}}
                                    >
                                        <div className="sustainability--page-text-holder--profilePicture">
                                            <p>Profile photo / Logo:</p>
                                        </div>
                                        <div className="sustainability--page-profilePicture-input-holder--wrapper">
                                            <div className="sustainability--page-profilePicture-input-holder">
                                                <FileUpload
                                                    imageURL={sustainData?.imageURL}
                                                    image={image}
                                                    setImage={setImage}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={editDisabled ? { pointerEvents: "none" } : {}}
                                    className="sustainability--template-section-holder"
                                >
                                    <h3>Select a Template</h3>
                                    <div className="sustainability--template--selection-holder" style={{overflowX:"scroll"}}>
                                        <div
                                            className="sustainability--each-template"
                                            onClick={() => setThemeSelected("blue")}
                                        >
                                            <div className="sustainability--each-template-image-holder">
                                                <img
                                                    src={
                                                        process.env.NEXT_PUBLIC_UI_URL +
                                                        "/assets/images/sustainability/sky.png"
                                                    }
                                                    className="img-responsive"
                                                />
                                            </div>
                                            <div className="sustainability--each-template-text-select-holder">
                                                <p>Blue</p>
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
                                                        "/assets/images/sustainability/gray.png"
                                                    }
                                                    className="img-responsive"
                                                />
                                            </div>
                                            <div className="sustainability--each-template-text-select-holder">
                                                <p>Gray</p>
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
                                                        "/assets/images/sustainability/white.png"
                                                    }
                                                    className="img-responsive"
                                                />
                                            </div>
                                            <div className="sustainability--each-template-text-select-holder">
                                                <p>White</p>
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
                                                        "/assets/images/sustainability/green.png"
                                                    }
                                                    className="img-responsive"
                                                />
                                            </div>
                                            <div className="sustainability--each-template-text-select-holder">
                                                <p>Green</p>
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
                                                        "/assets/images/sustainability/beige.png"
                                                    }
                                                    className="img-responsive"
                                                />
                                            </div>
                                            <div className="sustainability--each-template-text-select-holder">
                                                <p>Beige</p>
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
                                                        "/assets/images/sustainability/pink.png"
                                                    }
                                                    className="img-responsive"
                                                />
                                            </div>
                                            <div className="sustainability--each-template-text-select-holder">
                                                <p>Pink</p>
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
                                            onClick={() => setThemeSelected("beigelogo")}
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
                                        </div>
                                        <div
                                            className="sustainability--each-template"
                                            onClick={() => setThemeSelected("sample1")}
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
                                                <p>iFixit</p>
                                                <div
                                                    className={`sustainability--each-template-check-holder ${themeSelected === "sample1" ? "template-clicked" : ""
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
                                            onClick={() => setThemeSelected("sample2")}
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
                                                <p>Zebra</p>
                                                <div
                                                    className={`sustainability--each-template-check-holder ${themeSelected === "sample2" ? "template-clicked" : ""
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
                                            onClick={() => setThemeSelected("yeti")}
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
                                                <p>Yeti</p>
                                                <div
                                                    className={`sustainability--each-template-check-holder ${themeSelected === "yeti" ? "template-clicked" : ""
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
                                            onClick={() => setThemeSelected("inspiration")}
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
                                                <p>Inspiration</p>
                                                <div
                                                    className={`sustainability--each-template-check-holder ${themeSelected === "inspiration" ? "template-clicked" : ""
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
                                            onClick={() => setThemeSelected("elegant")}
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
                                                <p>Elegant</p>
                                                <div
                                                    className={`sustainability--each-template-check-holder ${themeSelected === "elegant" ? "template-clicked" : ""
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
                                    </div>
                                </div>
                                <div
                                    className="sustainability--template-section-holder"
                                    style={editDisabled ? { pointerEvents: "none" } : {}}
                                >
                                    <h3>Contact info (optional)</h3>
                                    <div className="contact-info-holder">
                                        <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                            <div className="sustainability--page-text-holder--contact">
                                                <p>Name: </p>
                                            </div>
                                            <div className="sustainability--page-slug-text-input-holder--contact">
                                                <div className="sustainability--contact--error-input-wrapper">
                                                    <div>
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
                                        <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                            <div className="sustainability--page-slug-text-input-holder--contact">
                                                <div className="sustainability--page-text-holder--contact">
                                                    <p>Phone: </p>
                                                </div>
                                                <div className="sustainability--contact--error-input-wrapper">
                                                    <div>
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
                                                            {validationErrors?.phone?.error &&
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
                                                    <p>Email: </p>
                                                </div>
                                                <div className="sustainability--contact--error-input-wrapper">
                                                    <div>
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
                                <div
                                    className="sustainability--template-section-holder"
                                    style={editDisabled ? { pointerEvents: "none" } : {}}
                                >
                                    <h3>Footer</h3>
                                    <div className="contact-info-holder">
                                        <div className="sustainability--page-slug-toggleText-holder contact--holder--sustainability">
                                            <div className="sustainability--page-slug-text-input-holder--contact">
                                                <div className="sustainability--page-text-holder--contact">
                                                    <p>Home Page:</p>
                                                </div>
                                                <div className="sustainability--contact--error-input-wrapper">
                                                    <div>
                                                        <input
                                                            onChange={(e) => [
                                                                setHomePageURL(e.target.value),
                                                                !e.target.value ? setShowHomePage(false) : "",
                                                            ]}
                                                            className="sustainability--page-input-holder--contact"
                                                            value={homePageURL}
                                                            onKeyDown={handleKeyDown}
                                                            placeholder="https://www.company.com/home"
                                                        />
                                                        <div className="sustainability--invalid-message-holder position-absolute">
                                                            {validationErrors?.homePageURL?.error &&
                                                                generateInvalidMessage({
                                                                    name: validationErrors?.homePageURL?.name,
                                                                    type: validationErrors?.homePageURL?.type,
                                                                })}
                                                        </div>
                                                    </div>
                                                    <div className="sustainability--switch-button-holder">
                                                        <p
                                                            style={
                                                                showHomePage ? { color: "#7E7E7E" } : { color: "#333" }
                                                            }
                                                        >
                                                            Off
                                                        </p>
                                                        <div className="big-switch">
                                                            <Switch
                                                                height={24}
                                                                width={46}
                                                                disabled={editDisabled}
                                                                display={showHomePage}
                                                                setDisplay={() =>
                                                                    toggleButton(setShowHomePage, homePageURL, "homePageURL")
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
                                                                display={showHomePage}
                                                                setDisplay={() =>
                                                                    toggleButton(setShowHomePage, homePageURL, "homePageURL")
                                                                }
                                                            />
                                                        </div>
                                                        <p
                                                            style={
                                                                !showHomePage ? { color: "#7E7E7E" } : { color: "#333" }
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
                                                    <p>About Us Page:</p>
                                                </div>
                                                <div className="sustainability--contact--error-input-wrapper">
                                                    <div>
                                                        <input
                                                            onChange={(e) => [
                                                                setAboutUsURL(e.target.value),
                                                                !e.target.value ? setShowAboutUs(false) : "",
                                                            ]}
                                                            value={aboutUsURL}
                                                            onKeyDown={handleKeyDown}
                                                            className="sustainability--page-input-holder--contact"
                                                            placeholder="https://www.company.com/about"
                                                        />
                                                        <div className="sustainability--invalid-message-holder position-absolute">
                                                            {validationErrors?.aboutUsURL?.error &&
                                                                generateInvalidMessage({
                                                                    name: validationErrors?.aboutUsURL?.name,
                                                                    type: validationErrors?.aboutUsURL?.type,
                                                                })}
                                                        </div>
                                                    </div>
                                                    <div className="sustainability--switch-button-holder">
                                                        <p
                                                            style={
                                                                showAboutUs ? { color: "#7E7E7E" } : { color: "#333" }
                                                            }
                                                        >
                                                            Off
                                                        </p>
                                                        <div className="big-switch">
                                                            <Switch
                                                                height={24}
                                                                width={46}
                                                                disabled={editDisabled}
                                                                display={showAboutUs}
                                                                setDisplay={() =>
                                                                    toggleButton(setShowAboutUs, aboutUsURL, "aboutUsURL")
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
                                                                display={showAboutUs}
                                                                setDisplay={() =>
                                                                    toggleButton(setShowAboutUs, aboutUsURL, "aboutUsURL")
                                                                }
                                                            />
                                                        </div>
                                                        <p
                                                            style={
                                                                !showAboutUs ? { color: "#7E7E7E" } : { color: "#333" }
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
                                                    <p>Contact Page:</p>
                                                </div>
                                                <div className="sustainability--contact--error-input-wrapper">
                                                    <div>
                                                        <input
                                                            onChange={(e) => [
                                                                setContactPageURL(e.target.value),
                                                                !e.target.value ? setShowContactUs(false) : "",
                                                            ]}
                                                            value={contactPageURL}
                                                            onKeyDown={handleKeyDown}
                                                            className="sustainability--page-input-holder--contact"
                                                            placeholder="https://www.company.com/contact"
                                                        />
                                                        <div className="sustainability--invalid-message-holder position-absolute">
                                                            {validationErrors?.contactPageURL?.error &&
                                                                generateInvalidMessage({
                                                                    name: validationErrors?.contactPageURL?.name,
                                                                    type: validationErrors?.contactPageURL?.type,
                                                                })}
                                                        </div>
                                                    </div>
                                                    <div className="sustainability--switch-button-holder">
                                                        <p
                                                            style={
                                                                showContactUs ? { color: "#7E7E7E" } : { color: "#333" }
                                                            }
                                                        >
                                                            Off
                                                        </p>
                                                        <div className="big-switch">
                                                            <Switch
                                                                height={24}
                                                                width={46}
                                                                disabled={editDisabled}
                                                                display={showContactUs}
                                                                setDisplay={() =>
                                                                    toggleButton(setShowContactUs, contactPageURL, "contactPageURL")
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
                                                                display={showContactUs}
                                                                setDisplay={() =>
                                                                    toggleButton(setShowContactUs, contactPageURL, "contactPageURL")
                                                                }
                                                            />
                                                        </div>
                                                        <p
                                                            style={
                                                                !showContactUs ? { color: "#7E7E7E" } : { color: "#333" }
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
                    ) : (
                        <div className="sustainability--page-no-order-error">
                            <p>
                                EcoStance page is a web page that you can publish to tell the world
                                that you are making an effort to save the environment by reducing
                                your carbon footprint
                            </p>
                            <p>
                                The page will be auto enabled after you have purchased one or more
                                carbon offsets to offset your footprint.
                            </p>
                        </div>
                    )}
                    {/* {!businessOrders?.businessProfileAggregate?.ghgReduced === 0 ? (
                        <div className="sustainability--page-no-order-error">
                            <p>
                                EcoStance page is a web page that you can publish to tell the world
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
        addItemsToBusinessSustainabilityPage: (items) => {
            dispatch(addItemsToBusinessSustainabilityPage(items));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessSustainability);
