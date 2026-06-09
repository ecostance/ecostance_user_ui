import { connect } from "react-redux";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { HeroSliderTwelve } from "../../components/HeroSlider";
import { _newDebounce } from "src/helpers/debounce";
import heroSliderData from "../../data/hero-sliders/hero-slider-five.json";
import Swiper from "react-id-swiper";
import { IoIosArrowBack, IoIosArrowForward, IoIosCalendar } from "react-icons/io";


const Engagement = () => {
    const { setDebounce, removeDebounce } = _newDebounce();
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
            <div className="image-text-content-area space-mb--50">
                {window.innerWidth > 500 ? (
                    <>
                        {Array(4).fill("").map((_, index) => (
                            <>
                                <Container>
                                    <Row className="align-items-center">
                                        <Col md={6}>
                                            <div className="cosmetics-home-intro mb-4 mb-md-0">
                                                <p className="label">NEW COLLECTION /</p>
                                                <h2 className="title">
                                                    Professional <br /> skin care for you
                                                </h2>
                                                <p className="description">
                                                    Lorem ipsum dolor sit amet, consectetur cing elit. Suspe ndisse
                                                    suscipit sagittis leo sit met condimentum estibulum issim Lorem
                                                    ipsum dolor sit amet, consectetur cing elit.
                                                </p>
                                                <Link
                                                    href="/other/about"
                                                    as={process.env.PUBLIC_URL + "/other/about"}
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
                                                <p className="label">NEW COLLECTION /</p>
                                                <h2 className="title">
                                                    Professional <br /> skin care for you
                                                </h2>
                                                <p className="description">
                                                    Lorem ipsum dolor sit amet, consectetur cing elit. Suspe ndisse
                                                    suscipit sagittis leo sit met condimentum estibulum issim Lorem
                                                    ipsum dolor sit amet, consectetur cing elit.
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
                            </>
                        ))}
                    </>
                ) : (
                    <>
                        {Array(8).fill("").map((_, index) => (
                            <>
                                <Container>
                                    <Row className="align-items-center">
                                        <Col md={6}>
                                            <div className="cosmetics-home-intro mb-4 mb-md-0">
                                                <p className="label">NEW COLLECTION /</p>
                                                <h2 className="title">
                                                    Professional <br /> skin care for you
                                                </h2>
                                                <p className="description">
                                                    Lorem ipsum dolor sit amet, consectetur cing elit. Suspe ndisse
                                                    suscipit sagittis leo sit met condimentum estibulum issim Lorem
                                                    ipsum dolor sit amet, consectetur cing elit.
                                                </p>
                                                <Link
                                                    href="/other/about"
                                                    as={process.env.PUBLIC_URL + "/other/about"}
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
                                <br/>
                                {/* <Container>
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
                                        <p className="label">NEW COLLECTION /</p>
                                        <h2 className="title">
                                            Professional <br /> skin care for you
                                        </h2>
                                        <p className="description">
                                            Lorem ipsum dolor sit amet, consectetur cing elit. Suspe ndisse
                                            suscipit sagittis leo sit met condimentum estibulum issim Lorem
                                            ipsum dolor sit amet, consectetur cing elit.
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
                        </Container> */}
                            </>
                        ))}
                    </>
                )}
            </div>
        </LayoutTwo>
    )
}


export default Engagement;