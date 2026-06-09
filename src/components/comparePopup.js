import React, { useEffect, useRef, useState } from "react";
import { div, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import formatCurrency from "src/helpers/formatCurrency";
import regionPrice from "src/helpers/regionPrice";
import { addToCart } from "src/redux/actions/cartActions";
import { deleteFromCompare } from "src/redux/actions/compareActions";

const CarouselArrow = ({
  direction,
  scrollProductsHandler,
  canScrollLeft,
  canScrollRight,
}) => {
  return (
    <>
      {direction === "right" ? (
        <svg
          style={{ cursor: `${canScrollRight ? "pointer" : "not-allowed"}` }}
          xmlns="http://www.w3.org/2000/svg"
          width="37"
          height="37"
          fill="none"
          viewBox="0 0 37 37"
          onClick={() => scrollProductsHandler("right")}
        >
          <circle cx="18.5" cy="18.5" r="18" stroke="#D7D7D7"></circle>
          <path
            stroke={canScrollRight ? "#333" : "#7E7E7E"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.125 12.959l5.542 5.541-5.542 5.542"
          ></path>
        </svg>
      ) : (
        <svg
          style={{ cursor: `${canScrollLeft ? "pointer" : "not-allowed"}` }}
          className="carousel-left"
          xmlns="http://www.w3.org/2000/svg"
          width="37"
          height="37"
          fill="none"
          viewBox="0 0 37 37"
          onClick={() => scrollProductsHandler("left")}
        >
          <circle
            r="18"
            stroke="#D7D7D7"
            transform="matrix(-1 0 0 1 18.5 18.5)"
          ></circle>
          <path
            stroke={canScrollLeft ? "#333" : "#7E7E7E"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.125 12.959l5.542 5.541-5.542 5.542"
          ></path>
        </svg>
      )}
    </>
  );
};

const ComparePopup = ({
  showComparePopup,
  setShowComparePopup,
  compareData,
  userData,
  deleteFromCompare,
  addToCart,
  cartItems,
}) => {
  const productsContainerRef = useRef();
  const { addToast } = useToasts();

  useEffect(() => {
    if (
      productsContainerRef.current?.clientWidth <
      productsContainerRef.current?.scrollWidth
    )
      setShouldShowCaresoul(true);
  }, []);

  useEffect(() => {
    setTempData(compareData);
    if (compareData?.length === 0) {
      return setShowComparePopup(false);
    }
  }, [compareData]);

  const [tempData, setTempData] = useState([]);
  const [shouldShowCaresoul, setShouldShowCaresoul] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleProductDelete = (product) => {
    deleteFromCompare(product, addToast);
    setTimeout(() => {
      if (
        productsContainerRef.current?.clientWidth <
        productsContainerRef.current?.scrollWidth
      )
        setShouldShowCaresoul(true);
      else setShouldShowCaresoul(false);
    });
  };

  const headings = [
    "Remove",
    "Image",
    "Title",
    "Price",
    "Add to Cart",
    "Description",
    "Country",
    "Availability",
    "Project Validity Date",
    "Standard Certification Authority",
    "Category",
    "Sdgs",
    "Tags",
  ];

  const headingContainerElements = headings.map((heading) => {
    if (heading === "Image")
      return (
        <div className="heading-container_row center-vertical row-md">
          <span />
        </div>
      );
    if (heading === "Remove" || heading === "Add to Cart")
      return (
        <div className="heading-container_row center-vertical row-sm">
          <span />
        </div>
      );
    if (heading === "Description")
      return (
        <div className="heading-container_row center-vertical row-lg">
          <span>{heading}</span>
        </div>
      );
    if (heading === "Price")
      return (
        <div className="heading-container_row b-pricing center-vertical b-left row-sm">
          <span>{heading}</span>
        </div>
      );
    if (heading === "Standard Certification Authority") {
      <div className="heading-container_row center-vertical row-md">
        <span style={{ height: "200px" }}>{heading}</span>
      </div>;
    }
    return (
      <div className="heading-container_row center-vertical row-sm">
        <span>{heading}</span>
      </div>
    );
  });

  const getProductTags = (tags) => {
    if (tags == null || tags.length === 0) return "-";
    if (tags.length === 1) return tags[0] || "-";
    return tags?.join(", ");
  };

  const getFormattedDescription = (description) => {
    if (description == null || description === "") return "-";
    return description.split(".").map((point, index) => {
      if (point.trim())
        return (
          <li className="desc-points" key={index}>
            {" "}
            <span>{point}.</span>
          </li>
        );
    });
  };

  const addToCartHandler = (product) => {
    addToCart(
      product,
      addToast,
      1,
      product?.variation?.[0]?.color || "",
      product?.variation?.[0]?.size?.[0]?.name || "",
      cartItems
    );
  };
  const checkScroll = () => {
    productsContainerRef.current?.scrollLeft > 0
      ? setCanScrollLeft(true)
      : setCanScrollLeft(false);

    if (
      Math.floor(
        productsContainerRef.current?.scrollWidth -
          productsContainerRef.current?.scrollLeft
      ) <= productsContainerRef.current?.clientWidth
    )
      setCanScrollRight(false);
    else setCanScrollRight(true);
  };
  const scrollProductsHandler = (direction) => {
    if (direction === "left") productsContainerRef.current.scrollLeft -= 400;
    if (direction === "right") productsContainerRef.current.scrollLeft += 400;
    checkScroll();
  };

  const compareProducts =
    compareData?.length > 0
      ? compareData.map((product, index) => {
          const { productPrice, currencyCode, currencySymbol } = regionPrice(
            product,
            userData
          );
          return (
            <article key={index} className="product-container">
              <div
                onClick={() => handleProductDelete(product)}
                className="remove-product center row-sm"
              >
                <svg
                  style={{ marginRight: "9px" }}
                  xmlns="http://www.w3.org/2000/svg"
                  className="remove-product-icon"
                  fill="none"
                  viewBox="0 0 15 15"
                >
                  <path
                    fill="#7E7E7E"
                    fillRule="evenodd"
                    d="M3.22 3.22a.75.75 0 011.06 0L7.5 6.44l3.22-3.22a.75.75 0 111.06 1.06L8.56 7.5l3.22 3.22a.75.75 0 11-1.06 1.06L7.5 8.56l-3.22 3.22a.75.75 0 01-1.06-1.06L6.44 7.5 3.22 4.28a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="row-text">remove</span>
              </div>

              <div className="product-img-container center row-md">
                <div className="product-img-wrapper">
                  <img
                    className="product-img"
                    src={product?.image?.[0]}
                    alt={"product-image"}
                  />
                </div>
              </div>

              <div className="product-title center row-sm">
                <span className="row-text product-name">
                  {product?.name || "-"}
                </span>
              </div>

              <div className="product-title b-pricing center row-sm">
                <span
                  style={{ color: "#333333" }}
                  className="row-text product-name"
                >
                  {currencyCode} {currencySymbol}
                  {formatCurrency(productPrice, currencyCode)}
                </span>
              </div>

              <div className="add-to-cart center row-sm">
                <button
                  onClick={() => addToCartHandler(product)}
                  className="add-to-cart-btn button--black"
                  disabled={product?.actualStock <= 0}
                >
                  {product?.actualStock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>

              <div className="product-description row-lg">
                <span className="row-text">
                  <ul className="desc-list">
                    {getFormattedDescription(product?.shortDescription)}
                  </ul>
                </span>
              </div>

              <div className="product-title center row-sm">
                <span className="row-text">{product?.country || "-"}</span>
              </div>

              <div className="product-title center row-sm">
                <span
                  className="row-text"
                  style={{
                    color: `${
                      product?.actualStock > 0 ? "#7BA986" : "##B7323B"
                    }`,
                  }}
                >
                  {product?.actualStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="product-title center row-sm">
                <span className="row-text">kariba redd+</span>
              </div>
              <div className="product-title center row-sm">
                {product?.details?.standards?.length ? (
                  product?.details?.standards?.map((data, index) => (
                    <img className="sca-img" key={index} src={data?.logo} />
                  ))
                ) : (
                  <span className="sca-img row-text">-</span>
                )}
              </div>
              <div className="product-title center row-sm">
                {/* <span className="row-text">{product?.category || "-"}</span> */}

                <span className="row-text">
                  {product?.categoryList?.length > 0
                    ? product?.categoryList.map((item) => item.category)
                    : "-"}
                </span>
              </div>
              <div className="product-title center row-sm">
                {product?.details?.sdgs?.length ? (
                  product?.details?.sdgs?.map((data, index) => (
                    <img
                      className="sdg-img"
                      key={index}
                      src={data?.sdg?.image}
                    />
                  ))
                ) : (
                  <span className="row-text">-</span>
                )}
              </div>
              <div className="product-title center row-sm">
                <span className="row-text">
                  {getProductTags(product?.tags)}
                </span>
              </div>
            </article>
          );
        })
      : null;

  const mainComparePopup = (
    <div className="compare-popup-holder">
      <div className="compare-products">
        <div className="compare-popup-heading">
          <h1>Compare Products</h1>
          {shouldShowCaresoul && (
            <div className="carousel-container">
              <CarouselArrow
                scrollProductsHandler={scrollProductsHandler}
                direction={"left"}
                canScrollLeft={canScrollLeft}
              />
              <CarouselArrow
                scrollProductsHandler={scrollProductsHandler}
                direction={"right"}
                canScrollRight={canScrollRight}
              />
            </div>
          )}
        </div>
        <div className="compare-popup_content-wrapper">
          <div className="content-wrapper_heading-container">
            {headingContainerElements}
          </div>
          <div
            onScroll={checkScroll}
            ref={productsContainerRef}
            className="content-wrapper_products-container"
          >
            {compareProducts}
          </div>
        </div>
        <div
          className="cross-icon-svg-holder"
          onClick={() => setShowComparePopup(false)}
        >
          <svg
            className="close-popup-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            fill="none"
            viewBox="0 0 25 24"
          >
            <path
              fill="#333"
              fillRule="evenodd"
              d="M1.582.585a2 2 0 012.828 0l8.586 8.586L21.582.585a2 2 0 112.828 2.828L15.825 12l8.585 8.586a2 2 0 11-2.828 2.828l-8.586-8.586-8.586 8.586a2 2 0 11-2.828-2.828l8.586-8.586-8.586-8.586a2 2 0 010-2.828z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );

  return <>{showComparePopup && mainComparePopup}</>;
};
const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    userData: state.userData,
    compareData: state.compareData,
    cartItems: state.cartData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    validateUser: () => {
      dispatch(validateUser());
    },
    deleteFromCompare: (product, addToast) => {
      dispatch(deleteFromCompare(product, addToast));
    },
    addToCart: (
      product,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize,
      cartItems
    ) => {
      dispatch(
        addToCart(
          product,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize,
          cartItems
        )
      );
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ComparePopup);
