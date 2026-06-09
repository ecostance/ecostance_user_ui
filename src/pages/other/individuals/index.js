import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import ModalVideo from "react-modal-video";
import { LayoutTwo } from "../../../components/Layout";
import { BreadcrumbOne } from "../../../components/Breadcrumb";
import { SectionTitleOne } from "../../../components/SectionTitle";
import { TestimonialTwo } from "../../../components/Testimonial";
import testimonialTwoData from "../../../data/testimonials/testimonial-two.json";
import axios from "axios";
import Head from "next/head";

import { IoIosPhonePortrait, IoIosPin, IoIosMail } from "react-icons/io";
import {
  FaMoneyBillAlt,
  FaShoppingBasket,
  FaRegLifeRing,
} from "react-icons/fa";

const Individuals = () => {
  const [modalStatus, isOpen] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [showDesign, setShowDesign] = useState(1);

  useEffect(() => {
    axios
      .get(
        process.env.PUBLIC_BLOG_URL + `/wp-json/wp/v2/pages?slug=individual-2`
      )
      .then(({ data }) => {
        console.log(data[0], "lkwehflkwehlfkwef");
        // const dataFiltered = data.find((item) => item.slug === "business");
        setPageData(data[0]);
        getVideoId(data[0]?.acf?.video_url);
      });
  }, []);

  const getVideoId = (url) => {
    const match = url?.match(
      /(?:v=|v\/|embed\/|youtu.be\/|\/v\/|\/e\/|watch\?v=|&v=)([\w-]+)/
    );
    if (match) {
      setVideoUrl(match[1]);
      // return match[1];
    } else {
      setVideoUrl("qzmeul4nW7E");
    }
    // return null;
  };

  const conditionalRender = () => {
    // if (showDesign === 1) {
    //   return (
    //     <div
    //       className="icon-box-area space-mb--r100 border-bottom--grey"
    //       style={{ paddingBottom: "60px" }}
    //     >
    //       <Container>
    //         <Row className="space-mb-mobile-only--m30">
    //           <Col
    //             md={4}
    //             className="space-mb-mobile-only--30"
    //             onClick={(e) => setShowDesign(1)}
    //           >
    //             <div className="icon-box icon-box--grey-center">
    //               <div className="icon-box--grey-center__icon">
    //                 {/* <IoIosPhonePortrait /> */}1
    //               </div>
    //               <div className="icon-box--grey-center__content">
    //                 <h3 className="title">CALCULATE</h3>
    //                 <p className="content">
    //                   Calculate your individual or your family’s carbon
    //                   footprint using our easy AI-driven simplified one-page
    //                   global calculator.
    //                 </p>
    //               </div>
    //             </div>
    //           </Col>
    //           <Col
    //             md={4}
    //             className="space-mb-mobile-only--30"
    //             onClick={(e) => setShowDesign(2)}
    //           >
    //             <div className="icon-box icon-box--grey-center">
    //               <div className="icon-box--grey-center__icon">
    //                 {/* <IoIosPin /> */}2
    //               </div>
    //               <div className="icon-box--grey-center__content">
    //                 <h3 className="title">SELECT & PURCHASE</h3>
    //                 <p className="content">
    //                   Select one or more of our certified Carbon offsetting
    //                   projects that you want to buy. Then select the quantity
    //                   and make a purchase using your credit card in any one of
    //                   the supported global currencies. Pay as a one-time payment
    //                   or spread them over 12 months.
    //                 </p>
    //               </div>
    //             </div>
    //           </Col>
    //           <Col
    //             md={4}
    //             className="space-mb-mobile-only--30"
    //             onClick={(e) => setShowDesign(3)}
    //           >
    //             <div className="icon-box icon-box--grey-center">
    //               <div className="icon-box--grey-center__icon">
    //                 {/* <IoIosMail /> */}3
    //               </div>
    //               <div className="icon-box--grey-center__content">
    //                 <h3 className="title">PUBLISH</h3>
    //                 <p className="content">
    //                   Receive your own EcoStance™ page with a QR code that can
    //                   be customized by you and published. You can link it to
    //                   your resume and social media profiles. You also receive a
    //                   sustainability certificate with carbon chain of custody
    //                   showing traceability of the carbon offsets you purchased
    //                   along with a guarantee of authenticity.
    //                 </p>
    //               </div>
    //             </div>
    //           </Col>
    //         </Row>
    //       </Container>
    //     </div>
    //   );
    // } else if (showDesign === 2) {
    //   return (
    //     <div
    //       className="icon-box-area border-bottom--grey space-mb--r100  space-pb--30"
    //       style={{ paddingBottom: "60px" }}
    //     >
    //       <Container>
    //         <Row className="space-mb-mobile-only--m30">
    //           <Col
    //             md={4}
    //             className="space-mb-mobile-only--30"
    //             onClick={(e) => setShowDesign(1)}
    //           >
    //             <div className="icon-box icon-box--feature-icon">
    //               <div className="icon-box--feature-icon__icon">1</div>
    //               <div className="icon-box--feature-icon__content">
    //                 <h3 className="title">CALCULATE</h3>
    //                 <p className="content">
    //                   Calculate your individual or your family’s carbon
    //                   footprint using our easy AI-driven simplified one-page
    //                   global calculator.
    //                 </p>
    //               </div>
    //             </div>
    //           </Col>
    //           <Col
    //             md={4}
    //             className="space-mb-mobile-only--30"
    //             onClick={(e) => setShowDesign(2)}
    //           >
    //             <div className="icon-box icon-box--feature-icon">
    //               <div className="icon-box--feature-icon__icon">2</div>
    //               <div className="icon-box--feature-icon__content">
    //                 <h3 className="title">SELECT &amp; PURCHASE</h3>
    //                 <p className="content">
    //                   Select one or more of our certified Carbon offsetting
    //                   projects that you want to buy. Then select the quantity
    //                   and make a purchase using your credit card in any one of
    //                   the supported global currencies. Pay as a one-time payment
    //                   or spread them over 12 months.
    //                 </p>
    //               </div>
    //             </div>
    //           </Col>
    //           <Col
    //             md={4}
    //             className="space-mb-mobile-only--30"
    //             onClick={(e) => setShowDesign(3)}
    //           >
    //             <div className="icon-box icon-box--feature-icon">
    //               <div className="icon-box--feature-icon__icon">3</div>
    //               <div className="icon-box--feature-icon__content">
    //                 <h3 className="title">PUBLISH</h3>
    //                 <p className="content">
    //                   Receive your own EcoStance™ page with a QR code that can
    //                   be customized by you and published. You can link it to
    //                   your resume and social media profiles. You also receive a
    //                   sustainability certificate with carbon chain of custody
    //                   showing traceability of the carbon offsets you purchased
    //                   along with a guarantee of authenticity.
    //                 </p>
    //               </div>
    //             </div>
    //           </Col>
    //         </Row>
    //       </Container>
    //     </div>
    //   );
    // } else if (showDesign === 3) {
    //   return (
    //     <div className="icon-box-area" style={{ paddingBottom: "80px" }}>
    //       <Container className="wide">
    //         <Row className="no-gutters">
    //           <Col md={4} className="d-flex" onClick={(e) => setShowDesign(1)}>
    //             <div className="icon-box icon-box--color-center icon-box--color-center--green flex-fill">
    //               <div className="icon-box--color-center__icon icon-box--color-center--green__icon">
    //                 {/* <IoIosPhonePortrait /> */}1
    //               </div>
    //               <div className="icon-box--color-center__content">
    //                 <h3 className="title">CALCULATE</h3>
    //                 <p className="content">
    //                   Calculate your individual or your family’s carbon
    //                   footprint using our easy AI-driven simplified one-page
    //                   global calculator.
    //                 </p>
    //               </div>
    //             </div>
    //           </Col>
    //           <Col md={4} className="d-flex" onClick={(e) => setShowDesign(2)}>
    //             <div className="icon-box icon-box--color-center icon-box--color-center--yellow flex-fill">
    //               <div className="icon-box--color-center__icon icon-box--color-center--yellow__icon">
    //                 {/* <IoIosPin /> */}2
    //               </div>
    //               <div className="icon-box--color-center__content">
    //                 <h3 className="title">SELECT & PURCHASE</h3>
    //                 <p className="content">
    //                   Select one or more of our certified Carbon offsetting
    //                   projects that you want to buy. Then select the quantity
    //                   and make a purchase using your credit card in any one of
    //                   the supported global currencies. Pay as a one-time payment
    //                   or spread them over 12 months.
    //                 </p>
    //               </div>
    //             </div>
    //           </Col>
    //           <Col md={4} className="d-flex" onClick={(e) => setShowDesign(3)}>
    //             <div className="icon-box icon-box--color-center icon-box--color-center--blue flex-fill">
    //               <div className="icon-box--color-center__icon icon-box--color-center--blue__icon">
    //                 {/* <IoIosMail /> */}3
    //               </div>
    //               <div className="icon-box--color-center__content">
    //                 <h3 className="title">PUBLISH</h3>
    //                 <p className="content" style={{ paddingBottom: "50px" }}>
    //                   Receive your own EcoStance™ page with a QR code that can
    //                   be customized by you and published. You can link it to
    //                   your resume and social media profiles. You also receive a
    //                   sustainability certificate with carbon chain of custody
    //                   showing traceability of the carbon offsets you purchased
    //                   along with a guarantee of authenticity.
    //                 </p>
    //               </div>
    //             </div>
    //           </Col>
    //         </Row>
    //       </Container>
    //     </div>
    //   );
    // }
    return (
      <div className="icon-box-area" style={{ paddingBottom: "80px" }}>
        <Container className="wide">
          <Row className="no-gutters">
            <Col md={4} className="d-flex" onClick={(e) => setShowDesign(1)}>
              <div className="icon-box icon-box--color-center icon-box--color-center--green flex-fill">
                <div className="icon-box--color-center__icon icon-box--color-center--green__icon">
                  {/* <IoIosPhonePortrait /> */}1
                </div>
                <div className="icon-box--color-center__content">
                  <h3 className="title">CALCULATE</h3>
                  <p className="content">
                    Calculate your individual or your family’s carbon footprint
                    using our easy AI-driven simplified one-page global
                    calculator.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="d-flex" onClick={(e) => setShowDesign(2)}>
              <div className="icon-box icon-box--color-center icon-box--color-center--yellow flex-fill">
                <div className="icon-box--color-center__icon icon-box--color-center--yellow__icon">
                  {/* <IoIosPin /> */}2
                </div>
                <div className="icon-box--color-center__content">
                  <h3 className="title">SELECT & PURCHASE</h3>
                  <p className="content">
                    Select one or more of our certified Carbon offsetting
                    projects that you want to buy. Then select the quantity and
                    make a purchase using your credit card in any one of the
                    supported global currencies. Pay as a one-time payment or
                    spread them over 12 months.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="d-flex" onClick={(e) => setShowDesign(3)}>
              <div className="icon-box icon-box--color-center icon-box--color-center--blue flex-fill">
                <div className="icon-box--color-center__icon icon-box--color-center--blue__icon">
                  {/* <IoIosMail /> */}3
                </div>
                <div className="icon-box--color-center__content">
                  <h3 className="title">PUBLISH</h3>
                  <p className="content" style={{ paddingBottom: "50px" }}>
                    Receive your own EcoStance™ page with a QR code that can be
                    customized by you and published. You can link it to your
                    resume and social media profiles. You also receive a
                    sustainability certificate with carbon chain of custody
                    showing traceability of the carbon offsets you purchased
                    along with a guarantee of authenticity.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  return (
    <LayoutTwo>
      <Head>
        <title>Individual - ECOSTANCE</title>
      </Head>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Individuals"
        // backgroundImage={pageData?.x_metadata?.lezada_page_title_bg_image}
        className="bg--3"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>
          <li>Individuals</li>
        </ul>
      </BreadcrumbOne>
      <div className="about-page-wrapper space-mt--r100 space-mb--r130">
        <div className="element-wrapper space-mt--r100 ">
          {conditionalRender()}

          {/* <div className="icon-box-area">
            <Container>
              <Row className="no-gutters">
                <Col md={4}>
                  <div className="icon-box icon-box--color-center icon-box--color-center--green">
                    <div className="icon-box--color-center__icon icon-box--color-center--green__icon">
                      <IoIosPhonePortrait />
                    </div>
                    <div className="icon-box--color-center__content">
                      <h3 className="title">PHONE</h3>
                      <p className="content">Phone 01: +84 01122000</p>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="icon-box icon-box--color-center icon-box--color-center--yellow">
                    <div className="icon-box--color-center__icon icon-box--color-center--yellow__icon">
                      <IoIosPin />
                    </div>
                    <div className="icon-box--color-center__content">
                      <h3 className="title">ADDRESS</h3>
                      <p className="content">
                        1800 Abbot Kinney Blvd. <br /> Unit D, Venice
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="icon-box icon-box--color-center icon-box--color-center--blue">
                    <div className="icon-box--color-center__icon icon-box--color-center--blue__icon">
                      <IoIosMail />
                    </div>
                    <div className="icon-box--color-center__content">
                      <h3 className="title">EMAIL</h3>
                      <p className="content">lezadastore@gmail.com</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div> */}
        </div>
        {/* primary content */}
        <div className="about-content space-mb--r100">
          <Container className="wide">
            {/* <SectionTitleOne
              title={pageData?.x_metadata?.lezada_custom_page_title}
              subtitle={pageData?.x_metadata?.lezada_subtitle}
            /> */}
            <Row>
              <Col xl={6} lg={6}>
                <div
                  className="about-page-2-image space-mb-mobile-only--50"
                  style={{
                    border: "5px solid white",
                    // width: "35rem",
                    height: "30rem",
                    // boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                    // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/qzmeul4nW7E?si=epeQ_IRL_qhQVUtT&rel=0&loop=1"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  ></iframe>
                </div>
              </Col>
              <Col xl={5} lg={6} className="ml-auto">
                {/* <div
                  className="page-content-section"
                  dangerouslySetInnerHTML={{
                    __html: pageData?.content?.rendered,
                  }}
                /> */}
                <div className="image-cta-two__content space-mb-mobile-only--40">
                  <h3 className="subtitle space-mb--30">INTRO VIDEO</h3>
                  <h2 className="title1 space-mb--30">
                    {/* {featuredProduct?.success
                  ? featuredProduct?.data[0]?.name
                  : "Montana Shelf Collection"} */}
                    What is Climate Change?
                  </h2>
                  <p
                    className="text space-mb--30"
                    style={{ lineHeight: "1.7rem" }}
                  >
                    Climate change refers to long term shifts in temperature and
                    alteration of the earth’s weather patterns. It’s driven by a
                    variety of factors but the primary cause is the increase in
                    carbon dioxide and other greenhouse gases in the atmosphere
                    due to human activities.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* testimonial */}
        <TestimonialTwo
          testimonialData={testimonialTwoData}
          backgroundImage="/assets/images/backgrounds/testimonials-bg.png"
        />
        <div className="space-mb--r100"></div>

        <div className="about-video-popup">
          <Container className="wide">
            <Row>
              <Col lg={12}>
                <div
                  className="about-video-bg space-mb--60"
                  style={{
                    // backgroundImage: `url(${
                    //   process.env.PUBLIC_URL +
                    //   "/assets/images/backgrounds/bg-video-about-us-large.png"
                    // })`,
                    backgroundImage: pageData?.acf?.video_thumbnail?.url
                      ? `url(${pageData?.acf?.video_thumbnail?.url})`
                      : `url(${process.env.PUBLIC_BLOG_URL}/wp-content/uploads/2023/08/bg-video-about-us-large.png)`,
                    backgroundPosition: "center center",
                  }}
                >
                  <div className="about-video-content__text-icon d-flex flex-column h-100 justify-content-center">
                    <div className="play-icon text-center space-mb--40">
                      <ModalVideo
                        channel="youtube"
                        isOpen={modalStatus}
                        videoId={videoUrl}
                        onClose={() => isOpen(false)}
                      />
                      <button onClick={() => isOpen(true)}>
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "/assets/images/icon/icon-play-100x100.png"
                          }
                          className="img-fluid"
                          alt=""
                        />
                      </button>
                    </div>
                    <h1>CLIMATE CHANGE</h1>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="about-page-content">
          <Container>
            <Row>
              <Col md={6} className="space-mb-mobile-only--50">
                {/*=======  about single block  =======*/}
                <div className="about-single-block">
                  <p className="subtitle">Climate Leadership</p>
                  <h1>EcoStance Page</h1>
                  <p>
                    Instantly receive your very own EcoStance page, with a
                    customizable URL and personalized QR code. Share your
                    climate leadership by putting a link on your resume,
                    LinkedIn page, web site and social media profiles. You will
                    also receive a Sustainability certificate for each carbon
                    offset product & project you purchase with its unique
                    Tracking number and Carbon Chain of Custody Certificate with
                    Guarantee of Authenticity.
                  </p>
                  <Link
                    href="/login-register"
                    as={process.env.PUBLIC_URL + "/login-register"}
                  >
                    <a>LEARN MORE</a>
                  </Link>
                </div>
              </Col>
              <Col md={6}>
                {/*=======  about single block  =======*/}
                <div className="about-single-block">
                  <p className="subtitle">Global Support 24/7</p>
                  <h1>Money back</h1>
                  <p>
                    We provide money back guarantee and global support. You can
                    choose to pay as a one-time payment or in 12 equal monthly
                    subscription payments spread over one year. We support
                    multiple currencies including USD, GBP, EUR, INR, JPY and
                    CNY. We process financial transactions with Stripe and do
                    not store credit cards. We provide 100% safe and spam free
                    user experience backed by SSL/TLS security. Our site and
                    company is certified by “TrustedSite”.
                  </p>
                  <Link
                    href="/privacy"
                    as={process.env.PUBLIC_URL + "/privacy"}
                  >
                    <a>LEARN MORE</a>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </LayoutTwo>
  );
};

export default Individuals;
