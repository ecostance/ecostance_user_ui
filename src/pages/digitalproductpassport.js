import { connect } from "react-redux";
import React, { createContext, useState, useContext } from 'react';
import { BreadcrumbOne } from "src/components/Breadcrumb";
import { SectionTitleOne } from "src/components/SectionTitle";
import { TestimonialTwo } from "src/components/Testimonial";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "src/components/Layout";
import { HeroSliderTwelve } from "src/components/HeroSlider";
import { HoverBannerOne } from "src/components/Banner";
import { _newDebounce } from "src/helpers/debounce";
import { IoIosArrowBack, IoIosArrowForward, IoIosCalendar } from "react-icons/io";
import testimonialData from "src/data/testimonials/testimonial-one.json";
import { BrandLogoOne } from "src/components/BrandLogo";
import ModalVideo from "react-modal-video";
import hoverBannerImageOne from "src/assets/images/hover/hover-banner-image1.webp";
import hoverBannerImageTwo from "src/assets/images/hover/hover-banner-image2.webp";
import hoverBannerImageThree from "src/assets/images/hover/hover-banner-image3.webp";
import purseimg1 from "src/assets/images/newPages/purseimg2.png";
import { Accordion, Card, Header } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import TestimonialOne from "src/components/Testimonial/TestimonialOne";
import brandLogoData from "src/data/brand-logos/brand-logo-one.json";
import Swiper from "react-id-swiper";


const DigitalProductPassport = () => {
    let spaceBottomClass
    const { setDebounce, removeDebounce } = _newDebounce();
    const [modalStatus, isOpen] = useState(false);
    let heroSliderData = [
        {
            "id": "1",
            "subtitle": "01/",
            "title": "Digital <br /> Product <br /> Passport",
            "url": "/shop/left-sidebar",
            "image": "/assets/images/purseimg3.png"
        },
        {
            "id": "2",
            "subtitle": "02/",
            "title": "Digital <br /> Product <br /> Passport",
            "url": "/shop/left-sidebar",
            "image": "/assets/images/dressimage1.png"
        },
        {
            "id": "3",
            "subtitle": "03/",
            "title": "New <br /> arrivals <br /> ss-2020",
            "url": "/shop/left-sidebar",
            "image": "/assets/images/banners/1275-860-3.webp"
        }
    ]

    let blogData = [
        {
            "id": "1",
            "title": "Climate Change Report",
            "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a…",
            "image": "/assets/images/banners/dppp1.png",
            "url": "/blog/post-left-sidebar",
            "date": "june 5, 2020"
        },
        {
            "id": "2",
            "title": "Chic Fashion Phenomenon",
            "text": "Michele seemed to say, was the 21st-century Gucci girl, an eccentric, fresh-faced weirdo who wasn’t afraid to wear backless fur-lined loafers, to personify the idea of “ugly pretty.",
            "image": "/assets/images/banners/dppp3.png",
            "url": "/blog/post-left-sidebar",
            "date": "june 5, 2020"
        },
        {
            "id": "3",
            "title": "T-Shirts as Minimalist Style",
            "text": "Michele seemed to say, was the 21st-century Gucci girl, an eccentric, fresh-faced weirdo who wasn’t afraid to wear backless fur-lined loafers, to personify the idea of “ugly pretty.",
            "image": "/assets/images/banners/dppp4.png",
            "url": "/blog/post-left-sidebar",
            "date": "june 5, 2020"
        },
        {
            "id": "4",
            "title": "T-Shirts as Minimalist Style",
            "text": "Michele seemed to say, was the 21st-century Gucci girl, an eccentric, fresh-faced weirdo who wasn’t afraid to wear backless fur-lined loafers, to personify the idea of “ugly pretty.",
            "image": "/assets/images/banners/dppp5.png",
            "url": "/blog/post-left-sidebar",
            "date": "june 5, 2020"
        }
    ]

    const params = {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 0,
        grabCursor: true,
        renderPagination: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        renderPrevButton: () => (
            <button className="swiper-button-prev ht-swiper-button-nav">
                <IoIosArrowBack />
            </button>
        ),
        renderNextButton: () => (
            <button className="swiper-button-next ht-swiper-button-nav">
                <IoIosArrowForward />
            </button>
        ),
        breakpoints: {
            1024: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 3,
            },
            640: {
                slidesPerView: 3,
            },
            320: {
                slidesPerView: 1,
            },
        },
    };

    const hoverBannerOneList = [
        {
            id: 1,
            title: "Collect Data + Calculate",
            subTitle: "Footprint",
            linkTitle: "",
            link: "/other/carbon-offset",
            imgUrl: hoverBannerImageOne,
        },
        {
            id: 2,
            title: "Buy CO2 Offsets +",
            subTitle: "Actions",
            linkTitle: "",
            link: "/shop/left-sidebar",
            imgUrl: hoverBannerImageTwo,
        },
        {
            id: 3,
            title: "Personalize &",
            subTitle: "Publish EcostancePage",
            linkTitle: "",
            link: "/other/my-account?sustainability=true",
            imgUrl: hoverBannerImageThree,
        },
    ];

    return (
        <LayoutTwo
            setDebounce={setDebounce}
            removeDebounce={removeDebounce}
            aboutOverlay={false}

        >
            <HeroSliderTwelve
                sliderData={heroSliderData}
                spaceBottomClass="space-mb--r130"
            />
            <div className="about-content space-mt--r130 space-mb--r130">
                <div className="section-title-container space-mb--40">
                    <Container>
                        <Row>
                            <Col lg={8} className="ml-auto mr-auto">
                                {/* section title */}
                                <div className="about-title-container text-center">
                                    <p className="dark-title space-mb--35">SIMPLY OR WHITE</p>
                                    <h2 className="title space-mb--15">
                                        Clever &amp; unique ideas
                                    </h2>
                                    <p className="title-text">
                                        Lorem ipsum dolor sit amet, consectetur cing elit. Suspe
                                        ndisse suscipit sagittis leo sit met condimentum estibulum
                                        is Suspe ndisse suscipit sagittis leo sit met condimentum
                                        estibulorem ipsum dolor sit amet, consectetur cing elit.
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="rotating-images-bg">
                    <div
                        className={`blog-post-slider ${spaceBottomClass ? spaceBottomClass : ""}`}
                    >
                        <Container>
                            <Row className="align-items-center">

                                <Col lg={12}>
                                    <div className="blog-post-slider-container">
                                        <Swiper {...params}>
                                            {blogData &&
                                                blogData.map((single, i) => {
                                                    return (
                                                        <div className="blog-grid-post" key={i}>
                                                            <div className="blog-grid-post__image space-mb--30">
                                                                <Link
                                                                    href={single.url}
                                                                    as={process.env.PUBLIC_URL + single.url}
                                                                >
                                                                    <a>
                                                                        <img
                                                                            src={process.env.PUBLIC_URL + single.image}
                                                                            className={`img-fluid ${single.image === "/assets/images/banners/dppp5.png" ? "img-dpp4" : "img-adjust"}`}
                                                                            alt=""
                                                                        />
                                                                    </a>
                                                                </Link>
                                                            </div>

                                                        </div>
                                                    );
                                                })}
                                        </Swiper>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
                <br />
                {/* about video content */}
                {/* <div className="about-video-content space-mb--r100" style={{marginTop:"10px"}}>
                    <Container>
                        <Row>
                            <Col lg={10} className="ml-auto mr-auto">
                                <div
                                    className="about-video-bg space-mb--60"
                                    style={{
                                        backgroundImage: `url(${process.env.PUBLIC_URL +
                                            "/assets/images/backgrounds/about-video-bg.png"
                                            })`
                                    }}
                                >
                                    <p className="video-text video-text-left">
                                        <Link
                                            href="/shop/left-sidebar"
                                            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                        >
                                            <a>LEZADA STORE</a>
                                        </Link>
                                    </p>

                                    <div className="about-video-content__text-icon d-flex flex-column h-100 justify-content-center">
                                        <div className="play-icon text-center space-mb--40">
                                            <ModalVideo
                                                channel="youtube"
                                                isOpen={modalStatus}
                                                videoId="8bGVWkYWvpg"
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
                                    <p className="video-text video-text-right">
                                        <Link
                                            href="/other/about"
                                            as={process.env.PUBLIC_URL + "/other/about"}
                                        >
                                            <a>OUR STORY</a>
                                        </Link>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={10} className="ml-auto mr-auto">
                                <Row>
                                    <Col md={6}>
                                        <div className="about-widget space-mb--35">
                                            <h2 className="widget-title space-mb--25">ADDRESS</h2>
                                            <p className="widget-content">
                                                1800 Abbot Kinney Blvd. Unit D &amp; E Venice
                                            </p>
                                        </div>
                                        <div className="about-widget space-mb--35">
                                            <h2 className="widget-title space-mb--25">PHONE</h2>
                                            <p className="widget-content">Mobile: (+88) – 1990</p>
                                        </div>
                                        <div className="about-widget">
                                            <h2 className="widget-title space-mb--25">EMAIL</h2>
                                            <p className="widget-content">contact@lezadastore.com</p>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="about-page-text">
                                            <p className="space-mb--35">
                                                Lorem ipsum dolor sit amet, consectetur cing elit. Suspe
                                                ndisse suscipit sagittis leo sit estibulum issim Lorem
                                                ipsum dolor sit amet, consectetur cing elit. ipsum dolor
                                                sit amet, consectetur cing elit. Suspe ndisse suscipit
                                                sagittis leo sit es
                                            </p>
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
                </div> */}
                {/* testimonial */}
                <TestimonialOne
                    testimonialData={testimonialData}
                    backgroundImage="/assets/images/backgrounds/testimonials-bg.png"
                />
                <div className="space-mb--r100"></div>
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
                                    <Link
                                        href="/other/about"
                                        as={process.env.PUBLIC_URL + "/other/about"}
                                    >
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
                                    <Link
                                        href="/other/about"
                                        as={process.env.PUBLIC_URL + "/other/about"}
                                    >
                                        <a>LEARN MORE</a>
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                {/* brand logo */}
                {/* <BrandLogoOne brandLogoData={brandLogoData} /> */}
            </div>


        </LayoutTwo>
    )
}


export default DigitalProductPassport;