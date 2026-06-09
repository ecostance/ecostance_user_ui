import { Container, Row, Col } from "react-bootstrap";
const BreadcrumbOne = ({
  children,
  backgroundImage,
  pageTitle,
  className,
  backgroundImageLowRes = false,
  postPage,
  pageSubtitle,
}) => {
  const showBackground = backgroundImageLowRes
    ? backgroundImageLowRes
    : backgroundImage;
  return (
    <div
      // space-pt--105 space-pb--105
      className={`breadcrumb-area 
      
      ${className ? className : ""}`}
      style={{
        backgroundImage: `url("${backgroundImage}")`,
        // paddingTop: "6.8rem",
        // paddingBottom: "6.8rem",
        paddingTop: "70px",
        paddingBottom: "70px",
      }}
    >
      <Container>
        <Row>
          <Col>
            <h1
              // className={
              //   postPage ? "breadcrumb__posttitle" : "breadcrumb__title"
              // }
              className="breadcrumb__title"
            >
              {pageTitle}
            </h1>
            {/* {postPage ? (
              <div style={{ paddingBottom: "20px" }}>{pageSubtitle}</div>
            ) : null} */}
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BreadcrumbOne;
