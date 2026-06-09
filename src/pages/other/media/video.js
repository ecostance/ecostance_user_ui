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

const Video = () => {
  const [modalStatus, isOpen] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    axios
      .get(process.env.PUBLIC_BLOG_URL + `/wp-json/wp/v2/pages?slug=business`)
      .then(({ data }) => {
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
      setVideoUrl("feOScd2HdiU");
    }
    // return null;
  };

  return (
    <LayoutTwo>
      <Head>
        <title>Video - ECOSTANCE</title>
      </Head>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Video"
        // backgroundImage={pageData?.x_metadata?.lezada_page_title_bg_image}
        className="bg--3"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>
          <li>Video</li>
        </ul>
      </BreadcrumbOne>
      <div className="about-page-wrapper space-mt--r130 space-mb--r130">
        {/* primary content */}
        <div className="about-content space-mb--r100">
          <Container className="wide">
            <SectionTitleOne title="Video" subtitle="Video Overview" />
            <Row>
              {/* <div
                  // className="single-blog-post-section"
                  dangerouslySetInnerHTML={{
                    __html: pageData?.content?.rendered,
                  }}
                /> */}
              <Col xl={6} lg={6}>
                <div className="about-page-2-image space-mb-mobile-only--50">
                  <img
                    src={pageData?.x_featured_media_original}
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </Col>
              <Col xl={5} lg={6} className="ml-auto">
                {/* <div
                  className="page-content-section"
                  dangerouslySetInnerHTML={{
                    __html: pageData?.content?.rendered,
                  }}
                /> */}
                <div>This is Video Overview</div>
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
                    <h1>OUR STORY</h1>
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
                  <p className="subtitle">On at oders over $99</p>
                  <h1>Free shipping &amp; return</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur cing elit. Suspe
                    ndisse suscipit sagittis leo sit met condimentum estibulum
                    issim Lorem ipsum dolor sit amet, consectetur cing elit.
                  </p>
                  <Link href="/about" as={process.env.PUBLIC_URL + "/about"}>
                    <a>LEARN MORE</a>
                  </Link>
                </div>
              </Col>
              <Col md={6}>
                {/*=======  about single block  =======*/}
                <div className="about-single-block">
                  <p className="subtitle">Support 24/7</p>
                  <h1>Money back</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur cing elit. Suspe
                    ndisse suscipit sagittis leo sit met condimentum estibulum
                    issim Lorem ipsum dolor sit amet, consectetur cing elit.
                  </p>
                  <Link href="/about" as={process.env.PUBLIC_URL + "/about"}>
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

export default Video;
