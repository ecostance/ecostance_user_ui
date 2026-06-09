import Link from "next/link";
import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";
import bottomLogos from "public/assets/images/logosbottom.png"

const HeroSliderFive = ({ sliderData, spaceBottomClass }) => {
  const params = {
    loop: true,
    speed: 1000,
    autoplay: false,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    effect: "fade",
    watchSlidesVisibility: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav"></button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav"></button>
    ),
  };
  return (
    <div
      className={`hero-slider-five ${spaceBottomClass ? spaceBottomClass : ""}`} style={{position:"relative"}}
    >
      <Container className="wide">
        <div className="hero-slider-five__wrapper">
          <Swiper {...params}>
            {sliderData &&
              sliderData.map((single, i) => {
                console.log(single.url.slice(0, 2))
                let theurl
                theurl = single.url.slice(0, 3) === "biz" ? `${single.url}` : `/blog/${single.url}`
                return (
                  <div
                    className="hero-slider-five__slide bg-img"
                    style={{ backgroundImage: `url(${single.bgImage})` }}
                    key={i}
                  >
                    <Container className="h-100">
                      <Row className="align-items-center flex-column flex-lg-row justify-content-center justify-content-lg-start h-100">
                        <Col lg={8} className="order-2 order-lg-1">
                          <div className="hero-slider-five__content">
                            <h1
                              className="title"
                              dangerouslySetInnerHTML={{ __html: single.title }}
                              style={{
                                lineHeight: 1.2,
                                // fontSize: i === 3 || i === 2 ? "50px" : "52px",
                                fontSize: "50px",
                              }}
                            />
                            <div
                              className="sub-title"
                              style={{
                                fontSize: "1.4rem",
                                lineHeight: "1.5",
                                // fontWeight: i !== 3 ? 300 : 400,
                                fontWeight: 400,
                                color: "#333",
                              }}
                            >
                              {single.subtitle}
                            </div>
                            <div className="slider-link">
                              <Link
                                href={theurl}
                              // as={process.env.PUBLIC_BLOG_URL + single.url}
                              >
                                <span
                                  className="lezada-button lezada-button--medium"
                                  style={{ cursor: "pointer" }}
                                >
                                  learn how
                                </span>
                              </Link>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Container>
                    <div className="home-bottom-imgs">
                      <img src="/assets/images/logosbottom.png" alt="logos" />
                    </div>
                  </div>
                );
              })}
          </Swiper>
        </div>
      </Container>
    </div>
  );
};

export default HeroSliderFive;
