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
import { MdContentCopy } from "react-icons/md";
import { QRCode } from "react-qrcode-logo";

let toastId;
let link = process.env.NEXT_PUBLIC_UI_URL + "/?refId=Ram123";
const SocialMediaSharing = ({
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
    `${process.env.NEXT_PUBLIC_UI_URL}/c/${currentSlug?.value}`
  );
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    axios
      .get(`https://wp.marketsverse.com/wp-json/wp/v2/socialmessage`)
      .then(({ data }) => {
        console.log(data, "social media data");
        setSocialMediaData(data);
      });
  }, []);

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

  let userRefferalId = localStorage.getItem("userId")

  return currentSlug?.value ? (
    <>
      <div className="change--email--wrapper">
        {/* <h3 className="common--heading">Share Your Business EcoStance Profile</h3> */}

        {/* <div className="profile-line" style={{ display: "flex", justifyContent: "space-between" }}>
          <p className="profile-head">Share Your Business EcoStance Profile</p>
          <p className="profile-head" style={{ display: localStorage.getItem("MyBusinessDetails") ? "" : "none" }}>Business Name : {JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}</p>
        </div> */}

        <div className="profile-line" style={{ display: "flex", justifyContent: "space-between" }}>
        <p className="orders--orderNumber-Holder" style={{ display: localStorage.getItem("MyBusinessDetails") ? "" : "none" }}>Business Name:  <b>{JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}</b></p>
          <p className="profile-head"></p>
        </div>
         {/* <div className="profile-line" style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
          <p className="orders--orderNumber-Holder" style={{ display: localStorage.getItem("MyBusinessDetails") ? "" : "none" }}>Business Name :  <b>{JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name}</b></p>
          <p className="profile-head"></p>
        </div> */}
        {/* <div className="socialButtonWrapper">
        <div
          className="socialButtons"
          onMouseEnter={(e) => setSocialHover("Twitter")}
          onMouseLeave={(e) => setSocialHover("")}
          style={{
            backgroundColor: socialHover === "Twitter" ? "#00aced" : "",
          }}
        >
          <TwitterShareButton
            className="shareBtn"
            title={socialMediaData[0]?.acf?.description}
            url={
              // process.env.NEXT_PUBLIC_UI_URL +
              "https://ecostance.com" + "/c/" + currentSlug?.value
            }
            // hashtags={["Saveplanet", "MakeTheWorldSustainable"]}
          >
            <TwitterIcon size={40} round={true} />
            <div>Twitter</div>
          </TwitterShareButton>
        </div>
        <div
          className="socialButtons"
          onMouseEnter={(e) => setSocialHover("Facebook")}
          onMouseLeave={(e) => setSocialHover("")}
          style={{
            backgroundColor: socialHover === "Facebook" ? "#3B5998" : "",
          }}
        >
          <FacebookShareButton
            className="shareBtn"
            // title="Hello there #Saveplanet #MakeTheWorldSustainable"
            quote={socialMediaData[0]?.acf?.title}
            url={
              "https://ecostance.com" + "/c/" + currentSlug?.value
            }
          >
            <FacebookIcon size={40} round={true} />
            <div>Facebook</div>
          </FacebookShareButton>
        </div>
        <div
          className="socialButtons"
          onMouseEnter={(e) => setSocialHover("WhatsApp")}
          onMouseLeave={(e) => setSocialHover("")}
          style={{
            backgroundColor: socialHover === "WhatsApp" ? "#25D366" : "",
          }}
        >
          <WhatsappShareButton
            className="shareBtn"
            title={socialMediaData[0]?.acf?.title}
            url={
              // process.env.NEXT_PUBLIC_UI_URL +
              "https://ecostance.com" + "/c/" + currentSlug?.value
            }
          >
            <WhatsappIcon size={40} round={true} />
            <div>WhatsApp</div>
          </WhatsappShareButton>
        </div>
        <div
          className="socialButtons"
          onMouseEnter={(e) => setSocialHover("LinkedIn")}
          onMouseLeave={(e) => setSocialHover("")}
          style={{
            backgroundColor: socialHover === "LinkedIn" ? "#007FB1" : "",
          }}
        >
          <LinkedinShareButton
            className="shareBtn"
            title={socialMediaData[0]?.acf?.title}
            summary={socialMediaData[0]?.acf?.description}
            url={
              "https://ecostance.com" + "/c/" + currentSlug?.value
            }
            source="https://ecostance.com"
          >
            <LinkedinIcon size={40} round={true} />
            <div>LinkedIn</div>
          </LinkedinShareButton>
        </div>
      </div> */}
        <div
          className="order__success__media-container"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          <div
            style={{
              border: "1px solid rgba(51, 51, 51, 0.2)",
              width: "48%",
              padding: "10px",
              minHeight: "12rem",
              minWidth: "15rem",
            }}
          >
            <div
              style={{
                fontSize: "15.74px",
                fontWeight: 500,
                color: "#333333",
                justifyContent: "center",
                display: "flex",
                marginTop: "-18px",
                paddingBottom: "10px",
                // width: "100%",
              }}
            >
              <p
                style={{
                  width: "220px",
                  background: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                EcoStance Business Page
              </p>
            </div>

            {currentSlug?.value && (
              <div className="order__success__qr-container">
                <a
                  on
                  onMouseEnter={(e) => setLinkHovered(true)}
                  onMouseLeave={(e) => setLinkHovered(false)}
                  className="order__success__qr-img-wrapper"
                  style={{
                    boxShadow: linkHovered
                      ? "0px 4px 4px rgba(0, 0, 0, 0.25)"
                      : "",
                  }}
                  // onClick={(e) => downloadCode("qrID")}
                  href={
                    process.env.NEXT_PUBLIC_UI_URL + "/c/" + currentSlug?.value
                  }
                  target="_blank"
                >
                  {qrCode && (
                    <QRCode
                      value={`${process.env.NEXT_PUBLIC_UI_URL}/c/${currentSlug?.value}`}
                      logoImage="/assets/images/ecostance-qr-logo.png"
                      size={120}
                    />
                  )}
                  <div style={{ display: "none" }}>
                    {qrCode && (
                      <QRCode
                        value={`${process.env.NEXT_PUBLIC_UI_URL}/c/${currentSlug?.value}`}
                        logoImage="/assets/images/ecostance-qr-logo.png"
                        size={400}
                        logoWidth={100}
                        id={"qrID"}
                      />
                    )}
                  </div>
                </a>
                <div>
                  <p className="order__success__profile-link">
                    <a
                      onMouseEnter={(e) => setLinkHovered(true)}
                      onMouseLeave={(e) => setLinkHovered(false)}
                      style={{
                        color: linkHovered ? "#333333" : "",
                      }}
                      href={
                        process.env.NEXT_PUBLIC_UI_URL +
                        "/c/" +
                        currentSlug?.value
                      }
                      target="_blank"
                    >
                      {process.env.NEXT_PUBLIC_UI_URL +
                        "/c/" +
                        currentSlug?.value}
                    </a>
                  </p>
                  <div
                    style={{
                      paddingTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      // marginLeft: "-5px",
                    }}
                  >
                    <div style={{ width: "130px" }}>
                      <button
                        className="copyButton"
                        onClick={(e) =>
                          handleCopy(
                            process.env.NEXT_PUBLIC_UI_URL +
                            "/c/" +
                            currentSlug?.value
                          )
                        }
                      >
                        <div className="copyButtonSvg">
                          <MdContentCopy
                            style={{
                              pointerEvents: "all",
                              width: "18px",
                              height: "18px",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        <span>{copied ? "Link Copied" : "Copy Link"}</span>
                      </button>
                    </div>
                    <div>
                      <button
                        className="copyButton"
                        onClick={(e) => downloadCode("qrID")}
                      >
                        <div className="copyButtonSvg">
                          <BsCloudDownload
                            style={{
                              pointerEvents: "all",
                              width: "18px",
                              height: "18px",
                              // marginRight: "10px",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          />
                        </div>
                        <span>
                          {downloading ? "Downloading..." : "Download QR Code"}
                        </span>
                      </button>
                    </div>
                  </div>
                  <p
                    style={{
                      width: "80%",
                      lineHeight: 1.2,
                      fontSize: "14px",
                      fontWeight: 300,
                      color: "red",
                      paddingTop: "10px",
                    }}
                  >
                    {/* Your EcoStance page will be updated with the new
                    certificates within 5 to 10 minutes. */}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              border: "1px solid rgba(51, 51, 51, 0.2)",
              width: "48%",
              padding: "10px",
              minHeight: "12rem",
              paddingTop: "15px",
              paddingLeft: "15px",
              minWidth: "15rem",
            }}
          >
            <div
              style={{
                fontSize: "15.74px",
                fontWeight: 500,
                color: "#333333",
                justifyContent: "center",
                display: "flex",
                marginTop: "-23px",
                paddingBottom: "10px",
                width: "100%",
              }}
            >
              <p
                style={{
                  width: "270px",
                  background: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Share Business EcoStance Page
              </p>
            </div>
            <div>
              <p className="order__success__share-txt">
                Show this on your social networks:{" "}
              </p>
              {/* <SlBadge /> */}
            </div>
            <div
              className="order__success__share-container share-holder-success"
              style={{
                paddingTop: "1.6rem",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {currentSlug?.value && (
                <>
                  <TwitterShareButton
                    title="Hi friends, I have a zero carbon footprint now and I am helping solve the climate crisis. Visit my EcoStance Page."
                    url={
                      process.env.NEXT_PUBLIC_UI_URL +
                      // "https://ecostance.com" +
                      "/c/" +
                      currentSlug?.value
                    }
                  // hashtags={[
                  //   "Saveplanet",
                  //   "MakeTheWorldSustainable",
                  // ]}
                  >
                    <TwitterIcon size={40} round={true} />
                  </TwitterShareButton>
                  <FacebookShareButton
                    title="Hello there #Saveplanet #MakeTheWorldSustainable"
                    quote="Hi friends, I have a zero carbon footprint now and I am helping solve the climate crisis. Visit my EcoStance Page."
                    url={
                      // "https://ecostance.com" +
                      process.env.NEXT_PUBLIC_UI_URL +
                      "/c/" +
                      currentSlug?.value
                    }
                  >
                    <FacebookIcon size={40} round={true} />
                  </FacebookShareButton>
                  <WhatsappShareButton
                    title="Hi friends, I have a zero carbon footprint now and I am helping solve the climate crisis. Visit my EcoStance Page."
                    url={
                      process.env.NEXT_PUBLIC_UI_URL +
                      // "https://ecostance.com" +
                      "/c/" +
                      currentSlug?.value
                    }
                  >
                    <WhatsappIcon size={40} round={true} />
                  </WhatsappShareButton>
                  {/* <LinkedinShareButton
                            title="Test Title for LinkedIn"
                            summary="Test Summary for LinkedIn"
                            url={
                              "https://ecostance.com" +
                              "/c/" +
                              currentSlug?.value
                            }
                            source="https://ecostance.com"
                          >
                            <LinkedinIcon size={40} round={true} />
                          </LinkedinShareButton> */}
                  <a
                    target="_blank"
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${process.env.NEXT_PUBLIC_UI_URL +
                      // "https://ecostance.com" +
                      "/c/" +
                      currentSlug?.value
                      }`}
                    url={
                      process.env.NEXT_PUBLIC_UI_URL +
                      "/c/" +
                      currentSlug?.value
                    }
                  >
                    <LinkedinIcon size={40} round={true} />
                  </a>
                  <div className="linkedInAddToProfile">
                    <a
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                      target="_blank"
                      href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=My%20EcoStance%20Certificate&organizationId=98574720&issueYear=2023
&issueMonth=10&expirationYear=2024&expirationMonth=10&certUrl=
${process.env.NEXT_PUBLIC_UI_URL}/c/${currentSlug?.value}`}
                    >
                      {/* <img
                                  src="https://download.linkedin.com/desktop/add2profile/buttons/en_US.png "
                                  alt="LinkedIn Add to Profile button"
                                /> */}
                      <LinkedinIcon size={40} round={true} />
                      <div
                        style={{
                          paddingLeft: "5px",
                          paddingRight: "10px",
                        }}
                      >
                        Add to profile
                      </div>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* <h3 className="common--heading" style={{ paddingTop: "40px" }}>
          Refferal
        </h3>
        <div className="change--email--main">
          <h5>Share your refferal link and earn</h5>
        </div>
        <div className="change--email--main" style={{ marginTop: "10px" }}>
          <p>
            Your Refferal Link :{" "}
            <a
              href={`${process.env.NEXT_PUBLIC_UI_URL}?refId=${userRefferalId}`}
              style={{ textDecoration: "underline" }}
              target="_blank"
            >
              {process.env.NEXT_PUBLIC_UI_URL}?refId={userRefferalId}
            </a>
          </p>
        </div> */}
        {/* <div
          className="order__success__share-container share-holder-success"
          style={{
            paddingTop: "1.6rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {currentSlug?.value && (
            <>
              <TwitterShareButton
                title="Hi friends, I have a zero carbon footprint now and I am helping solve the climate crisis. Join EcoStance with my Refferal Link."
                url={
                  process.env.NEXT_PUBLIC_UI_URL +
                  "?refId=" +
                  currentSlug?.value
                }
             
              >
                <TwitterIcon size={40} round={true} />
              </TwitterShareButton>
              <FacebookShareButton
                title="Hello there #Saveplanet #MakeTheWorldSustainable"
                quote="Hi friends, I have a zero carbon footprint now and I am helping solve the climate crisis. Visit my EcoStance Page."
                url={
                  process.env.NEXT_PUBLIC_UI_URL +
                  "?refId=" +
                  currentSlug?.value
                }
              >
                <FacebookIcon size={40} round={true} />
              </FacebookShareButton>
              <WhatsappShareButton
                title="Hi friends, I have a zero carbon footprint now and I am helping solve the climate crisis. Visit my EcoStance Page."
                url={
                  process.env.NEXT_PUBLIC_UI_URL +
                  "?refId=" +
                  currentSlug?.value
                }
              >
                <WhatsappIcon size={40} round={true} />
              </WhatsappShareButton>
              
              <a
                target="_blank"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${
                  process.env.NEXT_PUBLIC_UI_URL +
                  "?refId=" +
                  currentSlug?.value
                }`}
                url={
                  process.env.NEXT_PUBLIC_UI_URL +
                  "?refId=" +
                  currentSlug?.value
                }
              >
                <LinkedinIcon size={40} round={true} />
              </a>
              <div className="linkedInAddToProfile">
                <a
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  target="_blank"
                  href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=My%20EcoStance%20Certificate&organizationId=98574720&issueYear=2023
&issueMonth=10&expirationYear=2024&expirationMonth=10&certUrl=
${process.env.NEXT_PUBLIC_UI_URL}?refId="${currentSlug?.value}`}
                >
                
                  <LinkedinIcon size={40} round={true} />
                  <div
                    style={{
                      paddingLeft: "5px",
                      paddingRight: "10px",
                    }}
                  >
                    Add to profile
                  </div>
                </a>
              </div>
            </>
          )}
        </div> */}
      </div>
    </>
  ) : (
    <div className="sustainability--page-no-order-error">
      <p>
        The page will be auto enabled after you have purchased one or more
        carbon offsets to offset your footprint.
      </p>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
    sustainData: state.sustainabilityData,
  };
};
export default connect(mapStateToProps)(SocialMediaSharing);
// export default SocialSharing;
