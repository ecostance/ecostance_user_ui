import { connect } from "react-redux";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../components/Layout";
import { HeroSliderFive } from "../components/HeroSlider";
import { _newDebounce } from "src/helpers/debounce";
import heroSliderData from "../data/hero-sliders/hero-slider-business.json";
import Swiper from "react-id-swiper";
import { IoIosArrowBack, IoIosArrowForward, IoIosCalendar } from "react-icons/io";
import hoverBannerImageOne from "src/assets/images/hover/hover-banner-image1.webp";
import hoverBannerImageTwo from "src/assets/images/hover/hover-banner-image2.webp";
import hoverBannerImageThree from "src/assets/images/hover/hover-banner-image3.webp";


const BusinessHome = () => {
    const { setDebounce, removeDebounce } = _newDebounce();
    let title = "Sustainability, powered by trust"
    let subtitle = "Be empowered to become a sustainable and NetZero business with confidence and trust. Engage with your stakeholders for materiality determination & carbon measurement and publish your ESG disclosure reports with end-to-end traceability. Reduce your carbon footprint with carbon offsets, circular economy and other strategies."
    let subtitle2 = "EcoStance Sustainability Engagement & Action Platform is based on AI+Blockchain technologies to expediate your journey to NetZero and Sustainability while eliminating the fear of greenwashing or greenhushing. Now implement, engage, act and communicate your sustainability information with confidence and trust."
    let spaceBottomClass = "space-mb--r100"
    let imageSliderData = [
        {
            "id": "1",
            "image": "/assets/images/banners/640-640.avif",
            "url": "/"
        },
        {
            "id": "2",
            "image": "/assets/images/banners/640-640-2.avif",
            "url": "/"
        },
        {
            "id": "3",
            "image": "/assets/images/banners/640-640-3.avif",
            "url": "/"
        },
        {
            "id": "4",
            "image": "/assets/images/banners/640-640-4.avif",
            "url": "/"
        },
        {
            "id": "5",
            "image": "/assets/images/banners/640-640-5.avif",
            "url": "/"
        },
        {
            "id": "6",
            "image": "/assets/images/banners/640-640-6.avif",
            "url": "/"
        }
    ]
    let blogData = [
        {
            "id": "1",
            "title": "What is carbon footprint and how do I calculate & reduce my carbon footprint?",
            "text": "Carbon footprint or CO2 footprint is the total amount of greenhouse gases emitted in the atmosphere by any person or entity such as an individual, a family, a business, a…",
            "image": "/assets/images/banners/370-200.jpg",
            "url": "/blog/post-left-sidebar",
            "date": "December 4, 2023"
        },
        {
            "id": "2",
            "title": "New Report",
            "text": "jwgekwhlefkjehwehflwefhw",
            "image": "/assets/images/banners/370-200-2.png",
            "url": "/blog/post-left-sidebar",
            "date": "November 14, 2023"
        },
        {
            "id": "3",
            "title": "Climate Change Report",
            "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a…",
            "image": "/assets/images/banners/370-200-3.png",
            "url": "/blog/post-left-sidebar",
            "date": "November 10, 2023"
        },
        {
            "id": "4",
            "title": "What is Climate Change?",
            "text": "  Climate change refers to long term shifts in temperature and alteration of the earth’s weather patterns. It’s driven by a variety of factors but the primary cause is the…",
            "image": "/assets/images/banners/370-200-4.png",
            "url": "/blog/post-left-sidebar",
            "date": "November 9, 2023"
        }
    ]
    const Followparams = {
        loop: false,
        slidesPerView: 3,
        spaceBetween: 30,
        grabCursor: true,
        // autoplay: {
        //   delay: 5000,
        //   disableOnInteraction: false,
        // },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
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
                slidesPerView: 3
            },
            768: {
                slidesPerView: 3
            },
            576: {
                slidesPerView: 2
            },
            320: {
                slidesPerView: 1
            }
        }
    };
    const Blogparams = {
        loop: false,
        slidesPerView: 2,
        spaceBetween: 30,
        grabCursor: true,
        // autoplay: {
        //   delay: 5000,
        //   disableOnInteraction: false,
        // },
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
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2,
            },
            640: {
                slidesPerView: 2,
            },
            320: {
                slidesPerView: 1,
            },
        },
    };
    return (
        <LayoutTwo
            setDebounce={setDebounce}
            removeDebounce={removeDebounce}
            aboutOverlay={false}
        >
            <HeroSliderFive
                sliderData={heroSliderData}
                spaceBottomClass="space-mb--50"
            />
            <div className="section-title-container text-center space-mb--r80">
                <h2 className={`section-title ${subtitle ? "space-mb--20" : ""}`}>
                    {title}
                </h2>
                {subtitle ? <p style={{ maxWidth: "1170px", margin: "auto", textAlign: "center", letterSpacing: "0.5px", color: "#7e7e7e", lineHeight: "26px" }} >{subtitle}</p> : ""}
                <p style={{ marginBottom: "0px" }}>&nbsp;</p>
                {subtitle2 ? <p style={{ maxWidth: "1170px", margin: "auto", textAlign: "center", letterSpacing: "0.5px", color: "#7e7e7e", lineHeight: "26px" }} >{subtitle2}</p> : ""}
            </div>
            <div
                className={`product-category-container ${spaceBottomClass ? spaceBottomClass : ""
                    }`}
            >
                <Container>
                    <Row className="row-5 space-mb--n10">
                        <Col lg={6}>
                            <Row className="row-5">
                                <Col lg={12}>
                                    <div className="single-category single-category--three space-mb--10">
                                        <div className="single-category__image single-category__image--three">
                                            <img
                                                src={
                                                    process.env.PUBLIC_URL +
                                                    "/assets/images/banners/580-580-1.jpg"
                                                }
                                                className="img-fluid"
                                                alt=""
                                            />
                                        </div>
                                        <div className="single-category__content single-category__content--three">
                                            <div className="title">
                                                <p>Stakeholder </p>
                                                <p>Engagement </p>
                                                <Link
                                                    href="/biz/engagement"
                                                    as={process.env.PUBLIC_URL + "/biz/engagement"}
                                                >
                                                    <a>+ Store</a>
                                                </Link>
                                            </div>
                                        </div>
                                        <Link
                                            href="/biz/engagement"
                                            as={process.env.PUBLIC_URL + "/biz/engagement"}
                                        >
                                            <a className="banner-link" />
                                        </Link>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="single-category single-category--three space-mb--10">
                                        <div className="single-category__image single-category__image--three" style={{ width: "285px", height: "285px" }}>
                                            <img style={{ height: "100%", objectFit: "cover" }}
                                                src={
                                                    process.env.PUBLIC_URL + hoverBannerImageTwo?.src
                                                }
                                                className="img-fluid"
                                                alt=""
                                            />
                                        </div>
                                        <div className="single-category__content single-category__content--three">
                                            <div className="title-2">
                                                <p>Buy CO2 Offset Projects</p>
                                                <Link
                                                    href="/shop/left-sidebar"
                                                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                                >
                                                    <a>+ Store</a>
                                                </Link>
                                            </div>
                                        </div>
                                        <Link
                                            href="/shop/left-sidebar"
                                            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                        >
                                            <a className="banner-link" />
                                        </Link>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="single-category single-category--three space-mb--10">
                                        <div className="single-category__image single-category__image--three">
                                            <img
                                                src={
                                                    process.env.PUBLIC_URL +
                                                    "/assets/images/banners/285-285-2.jpg"
                                                }
                                                className="img-fluid"
                                                alt=""
                                            />
                                        </div>
                                        <div className="single-category__content single-category__content--three">
                                            <div className="title-2">
                                                <p>Circular Economy</p>
                                                <Link
                                                    href="/shop/left-sidebar"
                                                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                                >
                                                    <a>+ Store</a>
                                                </Link>
                                            </div>
                                        </div>
                                        <Link
                                            href="/shop/left-sidebar"
                                            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                        >
                                            <a className="banner-link" />
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6}>
                            <Row className="row-5">
                                <Col lg={12}>
                                    <div className="single-category single-category--three space-mb--10">
                                        <div className="single-category__image single-category__image--three" style={{ width: "580px", height: "285px" }}>
                                            <img
                                                src={
                                                    process.env.PUBLIC_URL +
                                                    hoverBannerImageOne?.src
                                                }
                                                className="img-fluid"
                                                alt=""
                                            />
                                        </div>
                                        <div className="single-category__content single-category__content--three">
                                            <div className="title">
                                                <p>Carbon </p>
                                                <p>Footprint</p>
                                                <Link
                                                    href="/shop/left-sidebar"
                                                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                                >
                                                    <a>+ Store</a>
                                                </Link>
                                            </div>
                                        </div>
                                        <Link
                                            href="/shop/left-sidebar"
                                            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                        >
                                            <a className="banner-link" />
                                        </Link>
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="single-category single-category--three space-mb--10">
                                        <div className="single-category__image single-category__image--three" style={{ width: "580px", height: "580px" }}>
                                            <img style={{width:"100%" , height:"100%" , objectFit:"cover"}}
                                                src={
                                                    process.env.PUBLIC_URL +
                                                    hoverBannerImageThree?.src
                                                }
                                                className="img-fluid"
                                                alt=""
                                            />
                                        </div>
                                        <div className="single-category__content single-category__content--three">
                                            <div className="title">
                                                <p>Disclosure</p>
                                                <p>Reporting</p>
                                                <Link
                                                    href="/shop/left-sidebar"
                                                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                                >
                                                    <a>+ Store</a>
                                                </Link>
                                            </div>
                                        </div>
                                        <Link
                                            href="/shop/left-sidebar"
                                            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                        >
                                            <a className="banner-link" />
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="image-text-content-area space-mb--50">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <div className="cosmetics-home-intro mb-4 mb-md-0">
                                <p className="label">STEP 1 /</p>
                                <h2 className="title titleAdj">
                                    ESG Strategy & <br /> Stakeholder <br /> Engagement
                                </h2>
                                <p className="description widthAdjust">
                                    Identify materiality issues from our industry templates that apply to your business and industry. Automate engagement with stakeholders by collecting and aggregating input from employees, customers, partners, vendors, shareholders and other stakeholders via web interface. Pre-configured industry-specific materiality assessment templates and carbon calculators, that conform to GRI, IFRS, ESRS and other standards, simplify and expedite materiality assessment, a pre-requisite for all disclosure report, and provide the foundation for Scope 1, 2 & 3 carbon calculations.
                                </p>
                                <Link
                                    href="/biz/engagement"
                                    as={process.env.PUBLIC_URL + "/biz/engagement"}
                                >
                                    <a className="lezada-shop-link">LEARN MORE</a>
                                </Link>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="single-banner-image text-center text-md-right">
                                <img
                                    src={
                                        process.env.PUBLIC_URL +
                                        "/assets/images/banners/470-570.jpg"
                                    }
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <div className="single-banner-image text-center text-md-left">
                                <img
                                    src={
                                        process.env.PUBLIC_URL +
                                        "/assets/images/banners/470-570.jpg"
                                    }
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="cosmetics-home-intro mb-4 mb-md-0">
                                <p className="label">STEP 2 /</p>
                                <h2 className="title titleAdj">
                                    Baseline & Target <br /> Setting
                                </h2>
                                <p className="description widthAdjust">
                                    Automation enables calculation of GHG emissions for Scope 1, Scope 2 and Scope 3 emissions based on data gathered from stakeholder engagement. AI enabled materiality assessment engine collates materiality issues from stakeholder engagement. Baseline is defined for GHG emissions and ESG metrics and future targets and pathways are recommended to meet your business ambitions.
                                </p>
                                <Link
                                    href="/other/about"
                                    as={process.env.PUBLIC_URL + "/other/about"}
                                >
                                    <a className="lezada-shop-link">LEARN MORE</a>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <div className="cosmetics-home-intro mb-4 mb-md-0">
                                <p className="label">STEP 3 /</p>
                                <h2 className="title titleAdj">
                                    Act and Mitigate
                                </h2>
                                <p className="description widthAdjust">
                                    Act to mitigate greenhouse gas emissions and ESG performance using various approaches. Start with reducing carbon footprint by purchasing carbon offsets and credits from our E-Commerce store. Per California and European regulations EcoStance provides carbon chain of custody and 100% guarantee of authenticity certificate for end-to-end traceability for offsets and credits purchased. Other approaches include Circular Economy, Extended producer responsibility, Product redesign, Natural capital accounting and other strategies.
                                </p>
                                <Link
                                    href="/biz/engagement"
                                    as={process.env.PUBLIC_URL + "/biz/engagement"}
                                >
                                    <a className="lezada-shop-link">LEARN MORE</a>
                                </Link>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="single-banner-image text-center text-md-right">
                                <img
                                    src={
                                        process.env.PUBLIC_URL +
                                        "/assets/images/banners/470-570.jpg"
                                    }
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <div className="single-banner-image text-center text-md-left">
                                <img
                                    src={
                                        process.env.PUBLIC_URL +
                                        "/assets/images/banners/470-570.jpg"
                                    }
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="cosmetics-home-intro mb-4 mb-md-0">
                                <p className="label">STEP 4 /</p>
                                <h2 className="title titleAdj">
                                    ESG Disclosure <br /> Reporting
                                </h2>
                                <p className="description widthAdjust">
                                    ESG disclosure reporting is simplified with “EcoStance page” which is a ready set of templates that can be applied for disclosure reporting. Data in the reports is pre-populated from stakeholder engagement, materiality assessment, and carbon calculators. Sections of the Disclosure Reports can be personalized with corporate commentary and narrative while other sections are immutable like certificate numbers, carbon chain of custody and timeline to foster trust and confidence in the report and to meet strong regulatory mandates — such as California AB 1305 and EU’s ESRS, both beginning Jan 2024.
                                </p>
                                <Link
                                    href="/other/about"
                                    as={process.env.PUBLIC_URL + "/other/about"}
                                >
                                    <a className="lezada-shop-link">LEARN MORE</a>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="image-slider-area space-mb--r130">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={8} className="order-2 order-lg-1">
                            <div className="image-slider-wrapper">
                                <Swiper {...Followparams}>
                                    {imageSliderData &&
                                        imageSliderData.map((single, i) => {
                                            return (
                                                <div className="single-image text-center" key={i}>
                                                    <a href={single.url} target="_blank">
                                                        <img
                                                            src={process.env.PUBLIC_URL + single.image}
                                                            className="img-fluid"
                                                            alt=""
                                                        />
                                                    </a>
                                                </div>
                                            );
                                        })}
                                </Swiper>
                            </div>
                        </Col>
                        <Col lg={4} className="order-1 order-lg-2">
                            <div className="image-slider-text">
                                <a href="#">@customer_quote</a>

                                <h3>Customer Quotes</h3>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div
                className={`blog-post-slider ${spaceBottomClass ? spaceBottomClass : ""}`}
            >
                <Container>
                    <Row className="align-items-center">
                        <Col lg={4}>
                            <div className="blog-intro space-mb-mobile-only--30">
                                <h2>From our blog</h2>
                                <p>
                                    Lorem ipsum dolor sit amet, consecte tur cing elit. Suspe ndisse
                                    suscipit sagittis leo sit met condim entum.
                                </p>
                                <Link
                                    href="/blog/standard-left-sidebar"
                                    as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
                                >
                                    <a className="lezada-button lezada-button--medium">view all</a>
                                </Link>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className="blog-post-slider-container">
                                <Swiper {...Blogparams}>
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
                                                                    className="img-fluid"
                                                                    alt=""
                                                                />
                                                            </a>
                                                        </Link>
                                                    </div>
                                                    <div className="blog-grid-post__content">
                                                        <div className="post-date">
                                                            <IoIosCalendar />
                                                            {single.date}
                                                        </div>
                                                        <h2 className="post-title">
                                                            <Link
                                                                href={single.url}
                                                                as={process.env.PUBLIC_URL + single.url}
                                                            >
                                                                <a>{single.title}</a>
                                                            </Link>
                                                        </h2>
                                                        <p className="post-excerpt">{single.text}</p>
                                                        <Link
                                                            href={single.url}
                                                            as={process.env.PUBLIC_URL + single.url}
                                                        >
                                                            <a className="blog-readmore-btn">read more</a>
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
        </LayoutTwo >
    )
}


export default BusinessHome;