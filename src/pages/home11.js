import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import {
    IoIosCalendar,
    IoIosArrowBack,
    IoIosArrowForward
} from "react-icons/io";
import { LayoutTwo } from "src/components/Layout";
import Swiper from "react-id-swiper";

const Home11 = () => {
    let spaceBottomClass
    let title = "Sustainability, powered by trust"
    let subtitle = "Measure, reduce and offset your carbon footprint with end-to-end traceability and transparency."
    let subtitle1 = "Impactful stakeholder engagement enables unprecedented environmental leadership, trust and compliance with global regulations. Accelerate your journey to NetZero and sustainability with confidence and credibility with all stakeholders, without greenwashing or greenhushing."
    let column = 2
    let blogData = [
        {
            "id": "1",
            "title": "Climate Change Report",
            "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a…",
            "image": "/assets/images/banners/370-200.jpg",
            "url": "/blog/post-left-sidebar",
            "date": "june 5, 2020"
        },
        {
            "id": "2",
            "title": "Shirt Color Picking Guide",
            "text": "Michele seemed to say, was the 21st-century Gucci girl, an eccentric, fresh-faced weirdo who wasn’t afraid to wear backless fur-lined loafers, to personify the idea of “ugly pretty.",
            "image": "/assets/images/banners/370-200-2.png",
            "url": "/blog/post-left-sidebar",
            "date": "june 5, 2020"
        },
        {
            "id": "3",
            "title": "Chic Fashion Phenomenon",
            "text": "Michele seemed to say, was the 21st-century Gucci girl, an eccentric, fresh-faced weirdo who wasn’t afraid to wear backless fur-lined loafers, to personify the idea of “ugly pretty.",
            "image": "/assets/images/banners/370-200-3.png",
            "url": "/blog/post-left-sidebar",
            "date": "june 5, 2020"
        },
        {
            "id": "4",
            "title": "T-Shirts as Minimalist Style",
            "text": "Michele seemed to say, was the 21st-century Gucci girl, an eccentric, fresh-faced weirdo who wasn’t afraid to wear backless fur-lined loafers, to personify the idea of “ugly pretty.",
            "image": "/assets/images/banners/370-200-4.png",
            "url": "/blog/post-left-sidebar",
            "date": "june 5, 2020"
        }
    ]
    const params = {
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
        <LayoutTwo>
            <div className="content-wrapper space-mb--r100 space-mt--r100">
                <Container className="wide">
                    <Row>
                        <Col lg={1} xl={2} className="d-none d-xl-block">
                            <p className="rotate-title rotate-title--left">
                                SS-2020 <span className="line">84</span>
                            </p>
                        </Col>
                        <Col lg={10} xl={8} className="ml-auto mr-auto">
                            {/* <SectionTitleThree
                title="Best selling products"
                subtitle="Lorem ipsum dolor sit amet, consectetur cing elit. Suspe ndisse suscipit sagittis leo estibulum issim Lorem ipsum dolor sit amet, consectetur cing elit."
              /> */}
                            <div className="section-title-container text-center space-mb--r80">
                                <h2 className={`section-title ${subtitle ? "space-mb--20" : ""}`}>
                                    {title}
                                </h2>
                                {subtitle ? (
                                    <>
                                        <h4 className="section-title--secondary section-title--secondary--style2">
                                            {subtitle}
                                        </h4>
                                        <h4 className="section-title--secondary section-title--secondary--style2">
                                            {subtitle1}
                                        </h4>
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                        </Col>
                        <Col lg={1} xl={2} className="d-none d-xl-block">
                            <p className="rotate-title rotate-title--right">
                                BASIC <br /> MINIMALISM
                            </p>
                        </Col>
                    </Row>
                </Container>

                <Container>
                    <Row className="align-items-center" style={{ justifyContent: "center" }}>
                        <Col
                            lg={5}
                            md={10}
                            className="offset-lg-1 offset-md-2 space-mb--r100"
                        >
                            <div className="accessories-single-category">
                                <Link
                                    href="/"
                                    as={process.env.PUBLIC_URL + "/"}
                                >
                                    <a className="banner-hover"></a>
                                </Link>
                                <span className="number">01/</span>
                                <img
                                    src={process.env.PUBLIC_URL + "/assets/images/home-images/individuals1.png"}
                                    className="img-fluid"
                                    alt=""
                                />
                                <div className="accessories-single-category__content">
                                    <p className="name">Individuals & Employees</p>
                                    <p className="price">
                                        <span className="main-price">LET'S GO  &#11166;</span>
                                        {/* <span className="discounted-price">$80.00</span> */}
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={5} md={10} className="offset-lg-1 offset-md-2 space-mb--r100">
                            <div className="accessories-single-category">
                                <Link
                                    href="/biz"
                                    as={process.env.PUBLIC_URL + "/biz"}
                                >
                                    <a className="banner-hover"></a>
                                </Link>
                                <span className="number">02/</span>
                                <img
                                    src={
                                        process.env.PUBLIC_URL + "/assets/images/home-images/business-1.png"
                                    }
                                    className="img-fluid"
                                    alt=""
                                />
                                <div className="accessories-single-category__content">
                                    <p className="name">Businesses</p>
                                    <p className="price">
                                        <span className="main-price">LET'S GO  &#11166;</span>
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <div className="image-text-content-area space-mb--50" style={{marginTop:"50px"}}>
                    <Container>
                        <Row className="align-items-center">
                            <Col md={6}>
                                <div className="cosmetics-home-intro mb-4 mb-md-0">
                                    <p className="label">BECOME CARBON NEUTRAL TODAY /</p>
                                    <h2 className="title">
                                        Individuals & Employees
                                    </h2>
                                    <p className="description cosmetic_desc">
                                        Measure, reduce and offset your and your family’s carbon footprint today.
                                    </p>
                                    <p className="description cosmetic_desc" >
                                        Our superpower is our tech that enables end-to-end carbon traceability (like tracking packages) and 100% guarantee of authenticity for carbon offsets purchased. You are empowered to easily publish your “EcoStance” page with readymade templates and showcase your environmental leadership with one-click social media integration. It’s remarkably simple, easy and fun! Act now and become sustainable today.
                                    </p>
                                    <p className="description cosmetic_desc">
                                        Get our mobile app or click below to get started here.
                                    </p>
                                    <Link
                                        href="/other/about"
                                        as={process.env.PUBLIC_URL + "/other/about"}
                                    >
                                        <a className="lezada-shop-link">LET'S GO  &#11166;</a>
                                    </Link>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="single-banner-image text-center text-md-right">
                                    <img
                                        src={
                                            "https://wp.marketsverse.com/wp-content/uploads/2024/02/mobileapp3.png"
                                        }
                                        className="img-fluid"
                                        alt=""
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Container style={{ marginTop: "100px", marginBottom: "125px" }}>
                    <Row>
                        <Col lg={4} md={6} className="offset-lg-1 space-mb--30">
                            <div className="single-category single-category--one">
                                <div className="single-category__image single-category__image--one">
                                    <img
                                        src={
                                            "https://wp.marketsverse.com/wp-content/uploads/2024/02/mountainpink.png"
                                        }
                                        className="img-fluid"
                                        alt=""
                                    />
                                </div>
                                <div className="single-category__content single-category__content--one space-mt--25 space-mb--25">
                                    <div className="title">
                                        <p>New</p>
                                        <Link
                                            href="/shop/left-sidebar"
                                            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                        >
                                            <a>+ Online store</a>
                                        </Link>
                                    </div>
                                    <p className="product-count">18</p>
                                </div>
                                <Link
                                    href="/shop/left-sidebar"
                                    as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                >
                                    <a className="banner-link" />
                                </Link>
                            </div>
                        </Col>
                        <Col md={6} className="offset-lg-1 space-mb--30">
                            <div className="single-banner single-banner--style-two" style={{ justifyContent: "center" }}>
                                <div className="single-banner__image">
                                    <img
                                        src={
                                            "https://wp.marketsverse.com/wp-content/uploads/2024/02/flamingoimg.png"
                                        }
                                        alt=""
                                    />
                                </div>
                                {/* <div className="single-banner__content">
                                    <h3 className="title">
                                        Organic <br /> Cosmetology
                                    </h3>
                                    <Link
                                        href="/shop/left-sidebar"
                                        as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                                    >
                                        <a className="link">Shop Now</a>
                                    </Link>
                                </div> */}
                            </div>
                        </Col>
                    </Row>
                </Container>
                <div className="image-text-content-area space-mb--50">
                    <Container>
                        <Row className="align-items-center">
                            <Col md={6}>
                                <div className="cosmetics-home-intro mb-4 mb-md-0">
                                    <p className="label">THE SUSTAINABILITY TRUST COMPANY /</p>
                                    <h2 className="title">
                                        Businesses
                                    </h2>
                                    <p className="description cosmetic_desc">
                                        We help plan, prepare and engage with your stakeholders. Then measure, reduce and publish your ESG/Climate disclosure reports with human-rights and Scope 1, 2 and 3 emissions.
                                    </p>
                                    <p className="description cosmetic_desc">
                                        Regulations mandate transparency and truth to eliminate greenwashing. For e.g. EU’s CSRD mandates stakeholder engagement with traceability for “Materiality Assessment” while California’s AB 1305 applies to those making climate-based claims such as “Net zero emissions” and “climate neutral” to disclose the factual basis for their claims in disclosure reporting.  “EcoStance” disclosure templates provide full transparency and traceability for trust to eliminate greenwashing.
                                    </p>
                                    <p className="description cosmetic_desc">
                                        Our Sustainability platform enables you to comply with your regional regulations and apply disclosure standards such as GRI, EU’s ESRS/CSRD, IFRS, TCFD, SASB and CDP, with confidence and trust.
                                    </p>
                                    <Link
                                        href="/other/about"
                                        as={process.env.PUBLIC_URL + "/other/about"}
                                    >
                                        <a className="lezada-shop-link">LET'S GO  &#11166;</a>
                                    </Link>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="single-banner-image text-center text-md-right">
                                    <img
                                        src={
                                            "https://wp.marketsverse.com/wp-content/uploads/2024/02/quote7.png"
                                        }
                                        className="img-fluid"
                                        alt=""
                                    />
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
            </div>
        </LayoutTwo>
    );
};

export default Home11;