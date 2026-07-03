import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAllOrders } from "src/apiClient/orders";
import router, { useRouter } from "next/router";
import {
  publishPage,
  updateUserSettingInfo,
} from "src/apiClient/sustainability";
import { getMetric } from "src/apiClient/user";
import { greenTemplate } from "./greenTemplate";
import { blueTemplate } from "./blueTemplate";
import { whiteTemplate } from "./whiteTemplate";
import { grayTemplate } from "./grayTemplate";
import { pinkTemplate } from "./pinkTemplate";
import { beigeTemplate } from "./beigeTemplate";
import { beigeLogoTemplate } from "./beigeLogoTemplate"
import { whiteLogoTemplate } from "./whiteLogoTemplate";
import { uniqhorTemplate } from "../businessSustainabilityPage/uniqhorTemplate";
import { useToasts } from "react-toast-notifications";
import { Spinner } from "react-bootstrap";
import { returnPhoneDetails } from "src/helpers/returnPhoneDetails";

const evaluateCertSide = (val) => {
  return val % 2 === 0;
};

const returnShortenParagraph = (para) => {
  const limit = 120;
  let returnPara = "";
  let counter = 0;
  const splitChars = para?.split("");
  if (!splitChars) return "";
  for (let i = 0; i < splitChars.length; i++) {
    if (counter >= limit) {
      break;
    }
    returnPara += splitChars[i];
    counter += 1;
  }
  return returnPara + "...";
};

const Cancel = ({
  sustainData,
  userData,
  main,
  userSettings,
  previewPageData,
  // metricData,
  allProductData,
}) => {
  const [backToEditClicked, setBackToEditClicked] = useState(false);
  const [publishPageClicked, setPublishPageClicked] = useState(false);
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [metricData , setMetricData] = useState("")
  const { addToast } = useToasts();

  useEffect(() => {
    filteredProductData();
    metricDetails();
  }, [])

  useEffect(() => {
    const handleMouseHover = (e) => {
      const item = e.currentTarget;
      const items = document.querySelectorAll('#uq-method-list .uq-method-item');
      const images = document.querySelectorAll('.uq-method-visual img');
      if (!items.length || !images.length) return;

      const idx = item.getAttribute('data-index');
      items.forEach((el) => el.classList.remove('uq-active'));
      item.classList.add('uq-active');
      images.forEach((img) => {
        if (img.getAttribute('data-img') === idx) {
          img.classList.remove('uq-img-hidden');
          img.classList.add('uq-img-visible');
        } else {
          img.classList.remove('uq-img-visible');
          img.classList.add('uq-img-hidden');
        }
      });
    };

    const attachListeners = () => {
      const items = document.querySelectorAll('#uq-method-list .uq-method-item');
      items.forEach((item) => {
        item.addEventListener('mouseenter', handleMouseHover);
        item.addEventListener('focus', handleMouseHover);
      });
    };

    attachListeners();
    const timer = setTimeout(attachListeners, 500);

    return () => {
      clearTimeout(timer);
      const items = document.querySelectorAll('#uq-method-list .uq-method-item');
      items.forEach((item) => {
        item.removeEventListener('mouseenter', handleMouseHover);
        item.removeEventListener('focus', handleMouseHover);
      });
    };
  });

  const filteredProductData = async () => {
    const response = await getAllOrders(1);
    const allOrders = response?.data?.data || [];
    let allProducts = [];
    for (const each of allOrders) {
      allProducts = [...allProducts, ...each.products];
    }
    const allProjects = [];
    const projectHash = {};

    allProducts.map((each) => {
      if (!projectHash[each?.product?.name]) {
        allProjects.push(each?.product?.name);
        projectHash[each?.product?.name] = true;
      }
    });
    console.log(allOrders,allProjects, "previeworder")
    setProducts(allOrders)
    setProjects(allProjects)
  };

  const metricDetails = async () => {
    try {
      const res = await getMetric();
      console.log(res, "metricsss")
      setMetricData({ fetched: true, ...res.data })
    } catch (err) {
      console.log(err);
    }
  }

  // const setAllOrders = async () => {
  //   await getAllOrders(1)
  //     .then((response) => {
  //       if (response.status == 200) {
  //         const allOrders = response.data?.data || [];
  //         let allProducts = [];
  //         let counter = 0;
  //         for (const each of allOrders) {
  //           counter += each.products.length;
  //           allProducts = [...allProducts, ...each.products];
  //         }
  //         console.log('HERE ARE ALL THE PRODUCTS', allProducts);
  //         setProducts(allProducts);

  //         const allProjects = [];
  //         const projectHash = {};

  //         allProducts.map((each) => {
  //           if (!projectHash[each?.product?.name]) {
  //             projectHash[each?.product?.name] = true;
  //             allProjects.push(each?.product?.name);
  //           }
  //         });
  //         setProjects(allProjects);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('error', err);
  //     });
  // };
  // // const [metricData, setMetricData] = useState(metricData);

  // const fetchMetrics = async () => {
  //   try {
  //     const res = await getMetric();
  //     setMetricData({ fetched: true, ...res.data });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   if (!main) {
  //     // fetchMetrics().catch((err) => console.log(err));
  //     // setAllOrders().catch((err) => console.log(err));
  //   }
  // }, []);

  const generateTextWithSpaces = (text) => {
    if (!text) return "";
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += text[i].toUpperCase();
      if (i == text.length - 1) break;
      result += " ";
    }
    return result;
  };

  const newProjects = (projects) => {
    return projects
      ?.map((project) => {
        return `<div> 
            ${project}
            </div>`;
      })
      .join("");
  };

  const showSocialText = (text) => {
    return `<p>${text}</p>`;
  };

  const showSocial = (socialImg, SocialLink, show, mail = false) => {
    if (!show || !eval(show) || !SocialLink) {
      return ``;
    }
    return `
        <a
        href=${mail ? `mailto:${SocialLink}` : SocialLink}
        style="
            color: #9d9d9d;
            text-decoration: none;
            z-index: 9999;
            position: relative;
        "
        target="_blank"
        >
        <img
align="center"
alt=""
class="icon"
style="max-height: 32px; max-width: 32px;"
src=${socialImg}
style="
    display: block;
    height: auto;
    margin: 0 auto;
    border: 0;
"
width="125"
/></a
    >`;
  };

  const handlePublishPage = async () => {
    const res = await publishPage(await returnAppendFormData());
    setPublishPageClicked(false);
    if (res?.status == 200) {
      return addToast("Your changes have been published", {
        appearance: "success",
        autoDismiss: true,
      });
    } else if (res?.status != 500) {
      return addToast(res?.data?.message, {
        appearance: "error",
        autoDismiss: true,
      });
    } else {
      return addToast("Something went wrong, please try again later", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const router = useRouter();

  const returnAppendFormData = async () => {
    const dataForm = new FormData();
    // checkDataItem(name);
    const slug = router.query.slug;
    if (sustainData?.imageURL) {
      const image = await returnBase64Image();
      dataForm.append("profilePicURL", image);
    }
    if (slug != userData?.slug?.slug) {
      dataForm.append("slug", userData?.slug?.slug);
      dataForm.append("newSlug", slug);
    }
    const phoneDetails = returnPhoneDetails(sustainData?.phoneInfo);
    dataForm.append("number", phoneDetails?.number);
    dataForm.append("countryCode", `${phoneDetails?.countryCode}`);
    dataForm.append("numericCode", `+${phoneDetails?.numericCode}`);
    dataForm.append("name", sustainData?.name);
    dataForm.append("showName", sustainData?.showName);
    dataForm.append("email", sustainData?.email);
    dataForm.append("showEmail", sustainData?.showEmail);
    // dataForm.append('phone', sustainData?.phoneInfo)

    dataForm.append("showPhone", sustainData?.showPhone);
    dataForm.append("twitter", sustainData?.twitter);
    dataForm.append("showTwitter", sustainData?.showTwitter);
    dataForm.append("facebook", sustainData?.facebook);
    dataForm.append("showFacebook", sustainData?.showFacebook);
    dataForm.append("linkedin", sustainData?.linkedin);
    dataForm.append("showLinkedin", sustainData?.showLinkedin);
    dataForm.append("instagram", sustainData?.instagram);
    dataForm.append("showInstagram", sustainData?.showInstagram);
    dataForm.append("country", sustainData?.selectedCountry);
    dataForm.append("aboutUs", sustainData?.aboutUs);
    dataForm.append("description", sustainData?.description);
    dataForm.append("title", sustainData?.title);
    dataForm.append("isPublic", sustainData?.displaySlug);
    dataForm.append("themeSelected", sustainData?.themeSelected?.toLowerCase());
    return dataForm;
  };

  async function dataUrlToFile(dataUrl, fileName) {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: "image/png" });
  }

  const returnBase64Image = async () => {
    try {
      return await dataUrlToFile(
        sustainData?.imageURL,
        `${userData?.slug?.slug || ""}${Math.random() * 1000
        }${new Date()?.toUTCString()}.png`
      );
    } catch (err) {
      console.log("image build error", err);
    }
  };

  const countryPictureHandler = (country) => {
    if (!country) {
      return false;
    }

    return `<span class="fi fi-${country}"></span>`;
  };

  const mapTemplate = {
    blue: blueTemplate,
    gray: grayTemplate,
    white: whiteTemplate,
    green: greenTemplate,
    pink: pinkTemplate,
    beige: beigeTemplate,
    beigelogo: beigeLogoTemplate,
    whitelogo: whiteLogoTemplate,
    uniqhor: uniqhorTemplate
  };

  const returnCorrectBackgroundColor = (template) => {
    switch (template) {
      case "blue":
        return "#133C55";
      case "green":
        return "#8BB573";
      default:
        return "#000";
    }
  };

  const returnCorrectTemplate = (Func, type = "") => {
    let currentUserSettings;
    let userCertificates;
    if (userSettings) {
      currentUserSettings = userSettings?.published;
    }

    if (type === "local") {
      userCertificates = products;
      userCertificates = products
        .map((each) => {
          return each.products;
        })
        .flat();
    } else {
      userCertificates = userSettings?.userCertificates;
      userCertificates?.forEach((cert) => {
        const res = cert?.order?.products.find(
          (product) =>
            (product?.certificate?.originNumber ||
              product?.certificateNumber) === cert?.originNumber
        );
        cert.certificate = {
          originNumber: res?.certificate?.originNumber,
          certificateURL: res?.certificate?.certificateURL,
        };
      });
    }

    if (type === "local") {
      return Func({
        logo: sustainData?.imageURL,
        countryPicture: countryPictureHandler(sustainData?.selectedCountry),
        ourPart: false,
        totalOffset: metricData?.ghgReduced,
        totalProjects: metricData?.projectsSupportedCount,
        allProjects: projects,
        metricTons: metricData?.treesPlanted,
        timeLine: false,
        projectsList: false,
        aboutUs: sustainData?.aboutUs,
        description: sustainData?.description,
        title: sustainData?.title,
        certData: userCertificates,
        name: sustainData?.name,
        phone: sustainData?.phone,
        email: sustainData?.email,
        twitter: sustainData?.twitter,
        linkedin: sustainData?.linkedin,
        instagram: sustainData?.instagram,
        facebook: sustainData?.facebook,
        newProjects: newProjects,
        showName: sustainData?.showName,
        showPhone: sustainData?.showPhone,
        showEmail: sustainData?.showEmail,
        showTwitter: sustainData?.showTwitter,
        showLinkedin: sustainData?.showLinkedin,
        showInstagram: sustainData?.showInstagram,
        showFacebook: sustainData?.showFacebook,
        showSocial: showSocial,
        companyName: process.env.COMPANY_NAME,
        UI_URL: process.env.NEXT_PUBLIC_UI_URL,
        generateTextWithSpaces: generateTextWithSpaces,
        evaluateCertSide: evaluateCertSide,
        returnShortenParagraph: returnShortenParagraph,
      });
    } else {
      return Func({
        logo: currentUserSettings?.profilePicURL || null,
        countryPicture: countryPictureHandler(currentUserSettings?.country),
        ourPart: false,
        totalOffset: userSettings?.ghgReduced,
        totalProjects: userSettings?.projectsSupportedCount,
        metricTons: userSettings?.treesPlanted,
        allProjects: userSettings?.projectNames,
        timeLine: false,
        projectsList: false,
        aboutUs: currentUserSettings?.aboutUs,
        description: currentUserSettings?.description,
        title: currentUserSettings?.title,
        certData: userSettings?.userCertificates,
        name: currentUserSettings?.name,
        phone: currentUserSettings?.phone,
        email: currentUserSettings?.email,
        twitter: currentUserSettings?.twitter,
        linkedin: currentUserSettings?.linkedin,
        instagram: currentUserSettings?.instagram,
        facebook: currentUserSettings?.facebook,
        showName: currentUserSettings?.showName === "true" ? true : false,
        showPhone: currentUserSettings?.showPhone === "true" ? true : false,
        showEmail: currentUserSettings?.showEmail === "true" ? true : false,
        showTwitter: currentUserSettings?.showTwitter === "true" ? true : false,
        showLinkedin:
          currentUserSettings?.showLinkedin === "true" ? true : false,
        showInstagram:
          currentUserSettings?.showInstagram === "true" ? true : false,
        showFacebook:
          currentUserSettings?.showFacebook === "true" ? true : false,
        newProjects: newProjects,
        showSocial: showSocial,
        generateTextWithSpaces: generateTextWithSpaces,
        evaluateCertSide: evaluateCertSide,
        returnShortenParagraph: returnShortenParagraph,
        companyName: process.env.COMPANY_NAME,
        UI_URL: process.env.NEXT_PUBLIC_UI_URL,
      });
    }
  };

  const Render = () => {
    if (main) {
      return (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: `${returnCorrectTemplate(
                mapTemplate[userSettings?.published?.themeSelected]
              )}`,
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <div
            className="sustainability--page-button-holder "
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button className="preview--button">PREVIEW MODE</button>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: `${returnCorrectTemplate(
                mapTemplate[sustainData?.themeSelected],
                "local"
              )}`,
            }}
          />
          <div
            className="sustainability--page-button-holder"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => [
                setBackToEditClicked(true),
                router.push({
                  pathname: "/other/my-account",
                  query: { sustainability: true },
                }),
              ]}
            >
              {backToEditClicked ? (
                <Spinner size="sm" animation="border" role="status" />
              ) : (
                "Back To Edit Page"
              )}
            </button>
            <button
              onClick={() => [setPublishPageClicked(true), handlePublishPage()]}
            >
              {" "}
              {publishPageClicked ? (
                <Spinner size="sm" animation="border" role="status" />
              ) : (
                "Publish Page"
              )}
            </button>
          </div>
        </>
      );
    }
  };

  return <Render />;
};

export default Cancel;
