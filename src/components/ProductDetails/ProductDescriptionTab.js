import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import ReactMap from "./ReactMap";
import { useState } from "react";
import { createReview } from "src/apiClient/product";
import { useRouter } from "next/router";

const ProductDescriptionTab = ({ product, productReviews }) => {
  const router = useRouter();

  const [showAddReview, setShowAddReview] = useState(false);
  const [starSelected, setStarSelected] = useState(0);
  const [comment, setComment] = useState("");
  const [zeroStarSelected, setZeroStarSelected] = useState(false);
  const [noComment, setNoComment] = useState(false);
  const [starArray, setStarArray] = useState([
    <IoIosStarOutline size={35} onClick={() => createReviewStars(1)} />,
    <IoIosStarOutline size={35} onClick={() => createReviewStars(2)} />,
    <IoIosStarOutline size={35} onClick={() => createReviewStars(3)} />,
    <IoIosStarOutline size={35} onClick={() => createReviewStars(4)} />,
    <IoIosStarOutline size={35} onClick={() => createReviewStars(5)} />,
  ]);

  const publishReview = async (e) => {
    e.preventDefault();
    if (comment.length === 0) {
      setNoComment(true);
      return setZeroStarSelected(false);
    }
    if (starSelected > 0) {
      setNoComment(false);
      setZeroStarSelected(false);
      const res = await createReview(
        product._id,
        "63455bb1b7db776087224745",
        starSelected,
        comment
      );

      if (res.status === 200) {
        router.reload(window.location.pathname);
      }
    } else {
      setZeroStarSelected(true);
      setNoComment(false);
    }
  };

  const returnStars = (val, createReview = false) => {
    const starArray = [];
    let fullfilledStars = val;

    for (let i = 0; i < 5; i++) {
      if (fullfilledStars > 0) {
        if (createReview) {
          starArray.push(
            <IoIosStar key={i} onClick={() => createReviewStars(i + 1)} />
          );
        } else {
          starArray.push(<IoIosStar />);
        }
        fullfilledStars -= 1;
      } else {
        if (createReview) {
          starArray.push(
            <IoIosStarOutline
              key={i}
              size={35}
              onClick={() => createReviewStars(i + 1)}
            />
          );
        } else {
          starArray.push(
            <IoIosStarOutline
              key={i}
              onClick={() => createReviewStars(i + 1)}
            />
          );
        }
      }
    }
    return starArray;
  };

  const createReviewStars = (val = 0) => {
    setStarSelected(val);
    if (val === 0) {
      return;
    } else {
      // const currentStarArray = [];
      // let fullfilledStars = val;

      // for (let i = 0; i < 5; i++) {
      //   if (fullfilledStars > 0) {
      //     currentStarArray.push(
      //       <IoIosStar onClick={() => createReviewStars(i + 1)} />
      //     );
      //     fullfilledStars -= 1;
      //   } else {
      //     currentStarArray.push(
      //       <IoIosStarOutline onClick={() => createReviewStars(i + 1)} />
      //     );
      //   }
      // }
      setStarArray(returnStars(val, true));
    }
  };

  const MakeTableRow = ({
    firstItem,
    secondItem,
    link = false,
    key,
    files = false,
  }) => {
    return (
      <tr style={{ height: files ? "50px" : null }}>
        <th style={{ paddingRight: "20px", fontWeight: "400" }}>
          {firstItem}:
        </th>
        <th>
          <strong>
            {link ? (
              <a
                target="_blank"
                href={secondItem}
                style={{
                  textDecoration: "underline",
                  textWrap: "wrap",
                }}
              >
                {secondItem}
              </a>
            ) : (
              secondItem
            )}
          </strong>
        </th>
      </tr>
    );
  };

  const googleMaps = (location) => {
    const validLocations = [];
    location?.map((each) => {
      if (
        typeof each?.degreeDecimal?.coordinates[0] === "number" &&
        typeof each?.degreeDecimal?.coordinates[1] === "number"
      ) {
        validLocations.push({
          lat: each?.degreeDecimal?.coordinates[0],
          lng: each?.degreeDecimal?.coordinates[1],
        });
      }
    });
    return <ReactMap location={validLocations} />;
  };

  return (
    <div className="product-description-tab space-pt--r100 space-mt--r100 border-top--grey">
      <Tab.Container defaultActiveKey="description">
        <Nav
          variant="pills"
          className="product-description-tab__navigation text-center justify-content-center space-mb--50"
        >
          <Nav.Item>
            <Nav.Link eventKey="description">Description</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="additionalInfo">
              Sustainable Development Goals
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="files">
              Files{" "}
              {product?.details?.documents?.length
                ? // product.ratingCount
                  `(${product?.details?.documents?.length})`
                : `(0)`}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="reviews">
              Reviews {productReviews ? `(${productReviews?.length})` : ""}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="location">Location</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="description">
            <div className="product-description-tab__details">
              {/* {product.longDescription || product.shortDescription} */}
              {product?.longDescription ||
                "akdkwd wekdhwoed wqieofhwoeif. This dummy text is showing up because long description is not available"}
              <table style={{ margin: "10px 0px" }}>
                <tbody>
                  <MakeTableRow
                    firstItem={"Project id"}
                    secondItem={product.id}
                  />

                  <MakeTableRow
                    firstItem={"Type"}
                    secondItem={product?.details?.stdMethod?.type}
                  />
                  <MakeTableRow
                    firstItem={"Estimated annual emission reduction"}
                    secondItem={
                      product?.details?.estimatedAnnualEmissionReduction
                    }
                  />
                  <MakeTableRow
                    firstItem={"Term start"}
                    secondItem={product?.details?.termStart?.split("T")[0]}
                  />
                  <MakeTableRow
                    firstItem={"Term end"}
                    secondItem={product?.details?.termEnd?.split("T")[0]}
                  />
                  <MakeTableRow
                    firstItem={"Validator"}
                    secondItem={product?.details?.project?.validator}
                  />
                  <MakeTableRow
                    firstItem={"Validator link"}
                    secondItem={
                      window.innerWidth > 600
                        ? product?.details?.project?.validatorLink
                        : product?.details?.project?.validatorLink?.substring(
                            0,
                            20
                          ) + "..."
                    }
                    link={true}
                  />
                </tbody>
              </table>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="files">
            <div
              className="product-description-tab__details"
              style={{ padding: 0, display: "flex", justifyContent: "center" }}
            >
              <table>
                {product?.details?.documents?.map((each, index) => {
                  return (
                    <MakeTableRow
                      firstItem={each?.name}
                      secondItem={
                        window.innerWidth > 600
                          ? each?.link
                          : each?.link?.substring(0, 20) + "..."
                      }
                      link={true}
                      key={index}
                      files={true}
                    />

                    // <tr key={index}>
                    //   {/* <th style={{ width: "5%" }}></th> */}
                    //   <a
                    //     target="_blank"
                    //     style={{ textDecoration: "underline" }}
                    //     href={each?.link}
                    //   >
                    //     <strong>{each?.name}</strong>
                    //   </a>
                    // </tr>
                  );
                })}
              </table>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="location">
            <div>
              {product?.details?.location &&
                googleMaps(product?.details?.location)}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="additionalInfo">
            <div className="product-description-tab__additional-info">
              <div className="product-description-tab__details">
                <div style={{ display: "flex", marginBottom: 10  }}>
                  {/* {product.sdgs.map((d) => {
                    return (
                      <div key={d.sdg._id}>
                        <img
                          src={d.sdg.image}
                          style={{ height: 80, width: 80, margin: 1 }}
                          alt=""
                        />
                      </div>
                    );
                  })} */}
                </div>
                {product?.details?.sdgs?.map((d, index) => {
                  if (d?.fulFilled)
                    return (
                      <div key={index}>
                        <div style={{ padding: 5, display: "flex" }}>
                          <div>
                            <img
                              src={d?.sdg?.image}
                              style={{ height: 80, width: 80, margin: 1 }}
                              alt=""
                            />
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: 15,
                                paddingLeft: 10,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                // paddingTop: 25,
                              }}
                            >
                              <p>{d?.sdg?.description}</p>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    );
                })}
              </div>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="reviews">
            <div className="product-description-tab__review">
              <h2 className="review-title space-mb--20">
                {productReviews ? productReviews.length : ""} reviews on{" "}
                {product.name}
              </h2>
              {/*=======  single review  =======*/}
              {productReviews.map((each, index) => {
                return (
                  <div key={index} className="single-review">
                    <div className="single-review__image">
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/user/user1.jpeg"
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </div>

                    <div className="single-review__content">
                      {/* =======  rating  ======= */}
                      <div
                        className="single-review__rating"
                        style={{ display: "flex" }}
                      >
                        {returnStars(Math.round(each?.approvedRating)).map(
                          (each, index) => {
                            return <div key={index}>{each}</div>;
                          }
                        )}
                      </div>

                      {/*=======  username and date  =======*/}
                      <p className="username">
                        {each?.customer?.user?.firstName}{" "}
                        {each?.customer?.user?.lastName}{" "}
                        <span className="date">
                          {new Date(each.updatedAt).toLocaleDateString()}
                        </span>
                      </p>

                      {/*=======  message  =======*/}
                      <p className="message">{each?.approvedComment}</p>
                      {/*=======  End of message  =======*/}
                    </div>
                  </div>
                );
              })}

              {/*=======  End of single review  =======*/}

              {/*=======  single review  =======*/}
              {/* <div className="single-review">
                <div className="single-review__image">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/assets/images/user/user3.jpeg"
                    }
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="single-review__content">
                  <div className="single-review__rating">
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStarOutline />
                  </div>
                 
                  <p className="username">
                    Edna Watson <span className="date">/ April 5, 2020</span>
                  </p>
                
                  <p className="message">
                    Can’t wait to start mixin’ with this one!
                    Irba-irr-Up-up-up-up-date your theme!
                  </p>
                </div>
              </div> */}
              {/*=======  End of single review  =======*/}
              {showAddReview && (
                <>
                  <h2 className="review-title space-mb--20">Add a review</h2>
                  {/* <p className="text-center">
                    Your email address will not be published. Required fields
                    are marked *
                  </p> */}
                  <p className="text-center">Required fields are marked *</p>
                  {/*=======  review form  =======*/}
                  <div className="lezada-form lezada-form--review">
                    <form onSubmit={publishReview}>
                      <div className="row">
                        <div className="col-lg-6 space-mb--20">
                          {/* <input type="text" placeholder="Name *" required /> */}
                        </div>
                        <div className="col-lg-6 space-mb--20">
                          {/* <input type="email" placeholder="Email *" required /> */}
                        </div>
                        <div className="col-lg-12 space-mb--20">
                          <span className="rating-title space-mr--20">
                            YOUR RATING
                          </span>
                          <span
                            className="product-rating"
                            style={{ display: "flex" }}
                          >
                            {starArray.map((each, index) => {
                              return <div key={index}>{each}</div>;
                            })}
                          </span>
                        </div>
                        <div className="col-lg-12 space-mb--20">
                          <textarea
                            cols={30}
                            rows={10}
                            placeholder="Your review *"
                            defaultValue={""}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-12 text-center">
                          <button
                            type="submit"
                            className="lezada-button lezada-button--medium"
                          >
                            submit
                          </button>
                        </div>
                        {zeroStarSelected && (
                          <div
                            style={{
                              textAlign: "center",
                              width: "100%",
                              marginTop: "20px",
                            }}
                          >
                            Please enter your rating for the above product
                          </div>
                        )}
                        {noComment && (
                          <div
                            style={{
                              textAlign: "center",
                              width: "100%",
                              marginTop: "20px",
                            }}
                          >
                            Please enter your review for the above product
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </>
              )}
              {/*=======  End of review form  =======*/}
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default ProductDescriptionTab;
