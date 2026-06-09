import { connect } from "react-redux";
import React, { createContext, useState, useContext } from 'react';
import { BreadcrumbOne } from "src/components/Breadcrumb";
import { SectionTitleOne } from "src/components/SectionTitle";
// import { TestimonialTwo } from "src/components/Testimonial";
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
import { Accordion, Card, Header } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import TestimonialOne from "src/components/Testimonial/TestimonialOne";
import TestimonialTwo from "src/components/Testimonial/TestimonialTwo";
import brandLogoData from "src/data/brand-logos/brand-logo-one.json";


const Fashion = ({spaceBottomClass}) => {
    const { setDebounce, removeDebounce } = _newDebounce();
    const [modalStatus, isOpen] = useState(false);
    let heroSliderData = [
        {
            "id": "1",
            "subtitle": "01/",
            "title": "Simplicity <br /> freedom <br /> comfort",
            "url": "/shop/left-sidebar",
            "image": "/assets/images/banners/1275-860-1.webp"
        },
        {
            "id": "2",
            "subtitle": "02/",
            "title": "The Spring <br /> racing <br /> edition",
            "url": "/shop/left-sidebar",
            "image": "/assets/images/banners/1275-860-2.webp"
        },
        {
            "id": "3",
            "subtitle": "03/",
            "title": "New <br /> arrivals <br /> ss-2020",
            "url": "/shop/left-sidebar",
            "image": "/assets/images/banners/1275-860-3.webp"
        }
    ]

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
            {/* <HeroSliderTwelve
                sliderData={heroSliderData}
                spaceBottomClass="space-mb--r130"
            /> */}
            <div className="about-content space-mt--r130 space-mb--r130">
                <div className="section-title-container space-mb--40">
                    <Container>
                        <Row>
                            <Col lg={8} className="ml-auto mr-auto">
                                {/* section title */}
                                <div className="about-title-container text-center">
                                    {/* <p className="dark-title space-mb--35">SIMPLY OR WHITE</p> */}
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

                {/* about video content */}
                <div className="about-video-content space-mb--r100">
                    <Container>
                        <Row>
                            <Col lg={10} className="ml-auto mr-auto">
                                {/*=======  about video area  =======*/}
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
                                                videoId="feOScd2HdiU"
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
                </div>
                {/* testimonial */}
                <TestimonialOne
                    testimonialData={testimonialData}
                    backgroundImage="/assets/images/backgrounds/testimonials-bg.png"
                />
                <div className="space-mb--r100"></div>
                <div className="about-page-content">
                    <div className="section-title-container space-mb--40">
                        <Container>
                            <Row>
                                <Col lg={8} className="ml-auto mr-auto">
                                    {/* section title */}
                                    <div className="about-title-container text-center">
                                        {/* <p className="dark-title space-mb--35">SIMPLY OR WHITE</p> */}
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

                    {/* about video content */}
                    <div className="about-video-content space-mb--r100">
                        <Container>
                            <Row>
                                <Col lg={10} className="ml-auto mr-auto">
                                    {/*=======  about video area  =======*/}
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
                                                    videoId="feOScd2HdiU"
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
                            {/* <Row>
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
                            </Row> */}
                        </Container>
                    </div>
                    <Container>
                        <Row>
                            <Col md={3} className="space-mb-mobile-only--50">
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
                            <Col md={3}>
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
                            <Col md={3} className="space-mb-mobile-only--50">
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
                            <Col md={3}>
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
                    <TestimonialTwo testimonialData={testimonialData} />
                </div>
                {/* brand logo */}
                {/* <BrandLogoOne brandLogoData={brandLogoData} /> */}
            </div>
            <div className="element-wrapper space-mt--r130 space-mb--r130">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="faq-wrapper">
                                <div className="single-faq space-mb--r100">
                                    <h2 className="faq-title space-mb--20">
                                        Shipping Information
                                    </h2>
                                    <Accordion defaultActiveKey="0">
                                        <Card className="single-my-account space-mb--20">
                                            <Card.Header className="panel-heading">
                                                <Accordion.Toggle variant="link" eventKey="0">
                                                    <h3 className="panel-title">
                                                        What Shipping Methods are Available?
                                                    </h3>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <p>
                                                        Depending on the item(s) you purchase here and the
                                                        location to which the item(s) will be delivered,
                                                        different shipping methods will be available. At
                                                        checkout, you will be prompted to choose a variety
                                                        of shipping methods.
                                                    </p>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card className="single-my-account space-mb--20">
                                            <Card.Header className="panel-heading">
                                                <Accordion.Toggle variant="link" eventKey="1">
                                                    <h3 className="panel-title">
                                                        Do You Ship Internationally?
                                                    </h3>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                                <Card.Body>
                                                    <p>
                                                        At the moment, we only ship to Canada and the United
                                                        States. For international orders, please contact
                                                        internationalorders@dynamite.ca. If you have any
                                                        questions, please don’t hesitate to contact our
                                                        Customer Experience Department by mail or by phone
                                                        at 1-888-882-1138 (Canada) and 1-888-342-7243 (USA).
                                                    </p>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card className="single-my-account space-mb--20">
                                            <Card.Header className="panel-heading">
                                                <Accordion.Toggle variant="link" eventKey="2">
                                                    <h3 className="panel-title">
                                                        How to Track My Order?
                                                    </h3>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="2">
                                                <Card.Body>
                                                    <p>
                                                        Once your order has been shipped, you will receive
                                                        an email with your tracking and shipping
                                                        information. Simply click on the link in the email
                                                        or select the ‘track order’ option here and enter
                                                        your order number and email address or sign into
                                                        your account.
                                                    </p>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card className="single-my-account space-mb--20">
                                            <Card.Header className="panel-heading">
                                                <Accordion.Toggle variant="link" eventKey="3">
                                                    <h3 className="panel-title">
                                                        How Long Will It Take To Get My Package?
                                                    </h3>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="3">
                                                <Card.Body>
                                                    <p>
                                                        We ship only on business days. Business days are
                                                        from Monday to Friday, excluding holidays. Any order
                                                        placed after 12 P.M. ET will be processed the
                                                        following business day. Due to a high volume period,
                                                        your order may take longer than anticipated. For
                                                        remote locations, please add an additional 2-5
                                                        business day to each shipping method’s expected
                                                        delivery time. If you are not sure whether your
                                                        location is remote, please click here for all the
                                                        details.
                                                    </p>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                </div>

                                {/* <div className="single-faq space-mb--r100">
                                        <h2 className="faq-title space-mb--20">
                                            Payment information
                                        </h2>
                                        <Accordion defaultActiveKey="0">
                                            <Card className="single-my-account space-mb--20">
                                                <Card.Header className="panel-heading">
                                                    <Accordion.Toggle variant="link" eventKey="0">
                                                        <h3 className="panel-title">
                                                            What Payment Methods Are Accepted?
                                                        </h3>
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="0">
                                                    <Card.Body>
                                                        <p>
                                                            We gladly accept Visa, MasterCard and American
                                                            Express. If your card has been issued outside the
                                                            U.S. or Canada, please note that your order may need
                                                            additional verification before it can be processed.
                                                            Unfortunately, we cannot accept COD orders and all
                                                            orders must be paid in full once submitted online.
                                                        </p>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>

                                            <Card className="single-my-account space-mb--20">
                                                <Card.Header className="panel-heading">
                                                    <Accordion.Toggle variant="link" eventKey="1">
                                                        <h3 className="panel-title">
                                                            What Happens If There Is A Pricing Error?
                                                        </h3>
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="1">
                                                    <Card.Body>
                                                        <p>
                                                            We do our best to provide accuracy in the pricing
                                                            and other product information displayed on our
                                                            website, but mistakes sometimes happen. In such
                                                            cases, Furniture.ca expressly reserves the right not
                                                            to honor pricing errors found on this website when
                                                            accepting an online order. If an error occurs, we’ll
                                                            let you know and cancel the order. Any authorized
                                                            payments for that order will be immediately
                                                            refunded. If you find an error once your order is
                                                            delivered, please contact our Customer Care team or
                                                            refer to our return policy.
                                                        </p>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>

                                            <Card className="single-my-account space-mb--20">
                                                <Card.Header className="panel-heading">
                                                    <Accordion.Toggle variant="link" eventKey="2">
                                                        <h3 className="panel-title">
                                                            What Do You Do With My Information?
                                                        </h3>
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="2">
                                                    <Card.Body>
                                                        <p>
                                                            We use your info to fulfil your order accurately and
                                                            quickly and to improve your shopping experience. We
                                                            respect your privacy and never share this
                                                            information with anyone, except in connection with
                                                            your order. If you want to know more, take a look at
                                                            our Private Policy.
                                                        </p>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                    </div>

                                    <div className="single-faq">
                                        <h2 className="faq-title space-mb--20">Orders and returns</h2>
                                        <Accordion defaultActiveKey="0">
                                            <Card className="single-my-account space-mb--20">
                                                <Card.Header className="panel-heading">
                                                    <Accordion.Toggle variant="link" eventKey="0">
                                                        <h3 className="panel-title">
                                                            How do I place an Order?
                                                        </h3>
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="0">
                                                    <Card.Body>
                                                        <p>
                                                            Click on a Product Photo or Product Name to see more
                                                            detailed information. To place your order, choose
                                                            the specification you want and enter the quantity,
                                                            and click ‘Buy Now’.Please enter the required
                                                            information such as Delivery Address, Quantity Type
                                                            etc. Before clicking “Place Order”, please check
                                                            your Order Details carefully. If you want to add a
                                                            new Delivery Address, click ” Add a new address”. If
                                                            you want to edit a current Delivery Address, click
                                                            ‘Edit this address’. After confirming your Order,
                                                            you will be automatically taken to the Payment page
                                                        </p>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>

                                            <Card className="single-my-account space-mb--20">
                                                <Card.Header className="panel-heading">
                                                    <Accordion.Toggle variant="link" eventKey="1">
                                                        <h3 className="panel-title">
                                                            How Can I Cancel Or Change My Order?
                                                        </h3>
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="1">
                                                    <Card.Body>
                                                        <p>
                                                            Go to Your Orders. Click Cancel Items. Note: Select
                                                            the checkbox next to each item you wish to remove
                                                            from the order. If you want to cancel the entire
                                                            order, select all of the items. Click Cancel checked
                                                            items when finished.
                                                        </p>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>

                                            <Card className="single-my-account space-mb--20">
                                                <Card.Header className="panel-heading">
                                                    <Accordion.Toggle variant="link" eventKey="2">
                                                        <h3 className="panel-title">
                                                            Who Should I Contact If I Have Any Queries?
                                                        </h3>
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="2">
                                                    <Card.Body>
                                                        <p>
                                                            You can contact our customer support team by
                                                            provided email or mobile phone. In case, it’s not
                                                            convenient to talk, you can come to our store to
                                                            make your request.
                                                        </p>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                    </div> */}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="about-page-wrapper space-mt--r130 space-mb--r130">
                {/* primary content */}
                <div className="about-content space-mb--r100">
                    <Container className="wide">
                        <SectionTitleOne
                            title="Basic minimalism"
                        // subtitle="LEZADA STORE - SIMPLY AND BASIC"
                        />
                        <Row>
                            <Col xl={6} lg={6}>
                                <div className="about-page-2-image space-mb-mobile-only--50">
                                    <img
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/assets/images/backgrounds/about-bg.png"
                                        }
                                        className="img-fluid"
                                        alt=""
                                    />
                                </div>
                            </Col>
                            <Col xl={5} lg={6} className="ml-auto">
                                <div className="about-page-text space-mb--30 mt-0">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur cing elit. Suspe
                                        ndisse suscipit sagittis leo sit estibulum issim Lorem ipsum
                                        dolor sit amet, consectetur cing elit. ipsum dolor sit amet,
                                        consectetur cing elit. Suspe ndisse suscipit sagittis leo
                                        sit es
                                    </p>
                                </div>
                                <div className="about-widget space-mb--35">
                                    <h2 className="widget-title space-mb--25">ADDRESS</h2>
                                    <p className="widget-content">
                                        1800 Abbot Kinney Blvd. Unit D &amp; E Venice
                                    </p>
                                </div>
                                <div className="about-widget space-mb--35">
                                    <h2 className="widget-title space-mb--25">PHONE</h2>
                                    <p className="widget-content">Mobile: (+88) – 1990</p>
                                    <p className="widget-content">Hotline: 1800 – 1102</p>
                                </div>
                                <div className="about-widget">
                                    <h2 className="widget-title space-mb--25">EMAIL</h2>
                                    <p className="widget-content">contact@lezadastore.com</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
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
             
             
            </div>


        </LayoutTwo>
    )
}


export default Fashion;