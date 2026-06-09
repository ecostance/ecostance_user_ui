import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import ModalVideo from "react-modal-video";
import { LayoutTwo } from "../components/Layout";
import { BreadcrumbOne } from "../components/Breadcrumb";
import { TestimonialOne } from "../components/Testimonial";
import { BrandLogoOne } from "../components/BrandLogo";
import testimonialData from "../data/testimonials/testimonial-one.json";
import brandLogoData from "../data/brand-logos/brand-logo-one.json";
import axios from "axios";
import Head from "next/head";

const About = () => {
  const [modalStatus, isOpen] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    axios
      .get(process.env.PUBLIC_BLOG_URL + `/wp-json/wp/v2/pages?slug=about-us-3`)
      .then(({ data }) => {
        // const dataFiltered = data.find((item) => item.slug === "business");
        setPageData(data[0]);
        getVideoId(data[0]?.acf?.video_url);
      });
  }, []);

  // const getVideoId = (url) => {
  //   if (!url) return;
  //   const urlParts = url.split("v=");
  //   console.log(urlParts, "kwjgfkwjefbew");
  //   setVideoUrl(urlParts[1]);
  // };

  const getVideoId = (url) => {
    const match = url.match(
      /(?:v=|v\/|embed\/|youtu.be\/|\/v\/|\/e\/|watch\?v=|&v=)([\w-]+)/
    );
    if (match) {
      setVideoUrl(match[1]);
      // return match[1];
    }
    // return null;
  };

  return (
    <LayoutTwo>
      <Head>
        <title>About - ECOSTANCE</title>
      </Head>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={pageData?.title?.rendered}
        backgroundImage={pageData?.x_metadata?.lezada_page_title_bg_image}
        className="bg--3"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>{pageData?.title?.rendered}</li>
        </ul>
      </BreadcrumbOne>
      {/* about content */}
      <div className="about-content space-mt--r130 space-mb--r130">
        <div className="section-title-container space-mb--40">
          <Container>
            <Row>
              <Col lg={12} className="ml-auto mr-auto">
                {/* section title */}
                <div className="about-title-container text-center">
                  <p className="dark-title space-mb--35">ABOUT US</p>
                  <h2 className="title space-mb--25">
                    Bold vision to combat climate crisis
                  </h2>
                  <div
                    className="about-us"
                    dangerouslySetInnerHTML={{
                      __html: pageData?.content?.rendered,
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* about video content */}
        <div className="about-video-content space-mb--r100">
          <Container>
            <Row>
              <Col lg={10} className="ml-auto mr-auto">
                {/*=======  about video area  =======*/}
                <div
                  className="about-video-bg space-mb--60"
                  style={{
                    backgroundImage: `url(${pageData?.acf?.video_thumbnail?.url})`,
                  }}
                >
                  <p className="video-text video-text-left">
                    <Link
                      href="/shop/left-sidebar"
                      as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                    >
                      <a>ECOSTANCE STORE</a>
                    </Link>
                  </p>

                  <div className="about-video-content__text-icon d-flex flex-column h-100 justify-content-center">
                    <div className="play-icon text-center space-mb--40">
                      <ModalVideo
                        channel="youtube"
                        isOpen={modalStatus}
                        // https://www.youtube.com/watch?v=7E-cA_zEHZM
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
                  <p className="video-text video-text-right">
                    <Link href="/about" as={process.env.PUBLIC_URL + "/about"}>
                      <a>CLIMATE CHANGE</a>
                    </Link>
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={10} className="ml-auto mr-auto">
                <Row>
                  <Col md={6}>
                    {/* <div className="about-widget space-mb--35">
                      <h2 className="widget-title space-mb--25">ADDRESS</h2>
                      <p className="widget-content">
                        20 E. Thomas Road, Suite 2200, Century Link Tower,
                        Phoenix, Arizona 85012, USA
                      </p>
                    </div>
                    <div className="about-widget space-mb--35">
                      <h2 className="widget-title space-mb--25">PHONE</h2>
                      <p className="widget-content">
                        Mobile: (+1) 407.951.0510
                      </p>
                    </div>
                    <div className="about-widget">
                      <h2 className="widget-title space-mb--25">EMAIL</h2>
                      <p className="widget-content">info@ecostance.com</p>
                    </div> */}
                    <div
                      className="page-content-section"
                      dangerouslySetInnerHTML={{
                        __html: pageData?.acf?.section_2,
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <div className="about-page-text">
                      <div className="space-mb--35">
                        <div
                          className="page-content-section"
                          dangerouslySetInnerHTML={{
                            __html: pageData?.acf?.section_3,
                          }}
                        />
                      </div>
                      {/* <p >
                        We take pride in providing a frictionless experience in
                        buying carbon offsets and credits. Review our certified
                        Carbon Offset projects, and purchase what you like. Pay
                        with credit card in any one of our supported global
                        currencies. Immediately receive your Eco Stance
                        sustainability page that you can edit and post on social
                        media to demonstrate your climate leadership.
                      </p> */}
                      <Link
                        href="/shop/left-sidebar"
                        as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                      >
                        <a className="lezada-button lezada-button--medium lezada-button--icon--left">
                          <IoMdAdd /> online store
                        </a>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
        {/* testimonial */}
        <TestimonialOne
          testimonialData={testimonialData}
          backgroundImage="/assets/images/backgrounds/testimonials-bg.png"
        />
        <div className="space-mb--r100"></div>
        {/* brand logo */}
        <BrandLogoOne brandLogoData={brandLogoData} />
      </div>
    </LayoutTwo>
  );
};

export default About;
