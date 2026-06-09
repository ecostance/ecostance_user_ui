import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

const HoverBannerOne = ({ spaceBottomClass, hoverBannerOneList }) => {
  

  const hoverBannerOne = hoverBannerOneList.map((bannerOne, index) => (
    <Col key={index} md={4} className="space-mb--30">
      <div className="single-category single-category--three">
        <div className="single-category__image single-category__image--three single-category__image--three--creativehome single-category__image--three--banner">
          <img
            src={process.env.PUBLIC_URL + bannerOne?.imgUrl?.src}
            className="img-fluid"
            alt=""
          />
        </div>
        <div className="single-category__content single-category__content--three single-category__content--three--creativehome  single-category__content--three--banner space-mt--25 space-mb--25">
          <div className="title">
            <p>
              <Link
                href={bannerOne.link}
                as={process.env.PUBLIC_URL + bannerOne.link}
              >
                <a>
                  {bannerOne.title} <span>{bannerOne.subTitle}</span>
                </a>
              </Link>
            </p>
            <Link
              href={bannerOne.link}
            // as={process.env.PUBLIC_URL + bannerOne.link}
            >
              <a>{bannerOne.linkTitle}</a>
            </Link>
          </div>
        </div>
        <Link
          href={bannerOne.link}
        // as={process.env.PUBLIC_URL + "/other/my-account"}
        >
          <a className="banner-link" />
        </Link>
      </div>
    </Col>
  ));

  return (
    <div
      className={`hover-banner-area ${spaceBottomClass ? spaceBottomClass : ""
        }`}
    >
      <Container className="wide">
        <Row className="space-mb--m30">{hoverBannerOne}</Row>
      </Container>
    </div>
  );
};

export default HoverBannerOne;
