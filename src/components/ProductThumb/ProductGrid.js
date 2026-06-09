import { Fragment, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import Link from "next/link";
import {
  IoIosHeartEmpty,
  IoIosShuffle,
  IoIosSearch,
  IoIosInformation,
  IoIosAnalytics,
  IoIosEyeOff,
  IoIosEye,
  IoIosAdd,
} from "react-icons/io";
import { Tooltip } from "react-tippy";
import ProductModal from "./ProductModal";
import formatCurrency from "src/helpers/formatCurrency";
import { Country, State, City } from "country-state-city";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";

const ProductGrid = ({
  product,
  oldPrice,
  currencyCode,
  discount,
  discountedPrice,
  productPrice,
  cartItem,
  wishlistItem,
  compareItem,
  bottomSpace,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare,
  addToast,
  cartItems,
  column,
  currencySymbol,
  wishlistItems,
  setShowComparePopup,
  addItemToCart,
  userData,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState([]);

  const getAllCountries = () => {
    const countryList = Country.getAllCountries();
    console.log(countryList, "countryList");
    const found = countryList.find(
      (o) => o.name.toLowerCase() === product.country.toLowerCase()
    );
    setSelectedCountry(found.isoCode);
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  const conditionalImage = (productType) => {
    if (productType === "Renewable Energy") {
      return (
        <img
          src="/assets/images/renewable.svg"
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
        />
      );
    } else if (productType === "REDD+") {
      return (
        <img
          src="/assets/images/reddplus.svg"
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
        />
      );
    } else if (productType === "CORSIA") {
      return (
        <img
          src="/assets/images/corsia.svg"
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
          // style={{ width: "100px !important", height: "100px !important" }}
        />
      );
    } else if (productType === "Gas Abatement") {
      return (
        <img
          src="/assets/images/co2.svg"
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
          // style={{ width: "42px", height: "42px" }}
        />
      );
    }
  };

  return (
    <Fragment>
      <Col
        lg={column && column === 4 ? 3 : 4}
        md={6}
        className={bottomSpace ? bottomSpace : ""}
      >
        <div className="product-grid">
          {/*=======  single product image  =======*/}
          <div className="product-grid__image">
            <Link
              href={`/shop/product-basic/[slug]?slug=${product.slug}`}
              as={
                process.env.PUBLIC_URL + "/shop/product-basic/" + product.slug
              }
            >
              <a className="product-grid--image-wrapper image-wrap">
                <img
                  src={product.thumbImage[0]}
                  className="img-fluid"
                  alt={product.name}
                />

                {/* {product.thumbImage.length > 1 ? (
                  <img
                    src={process.env.PUBLIC_URL + product.thumbImage[1]}
                    className="img-fluid"
                    alt={product.name}
                  />
                ) : (
                  ""
                )} */}
              </a>
            </Link>
            <Link
              href={`/shop/product-basic/[slug]?slug=${product.slug}`}
              as={
                process.env.PUBLIC_URL + "/shop/product-basic/" + product.slug
              }
            >
              <>
                <div
                  className="product-grid__floating-badges"
                  style={{
                    paddingBottom: "20px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Tooltip
                      title={`${product?.productType}`}
                      position="right"
                      trigger="mouseenter"
                      animation="shift"
                      arrow={true}
                      duration={200}
                      distance={-10}
                      offset={0}
                      style={{ marginBottom: "10px" }}
                    >
                      {/* <span className="fivestar" style={{ background: "gray" }}>
                        <IoIosAdd style={{ width: "20px", height: "20px" }} />
                      </span> */}
                      <div
                        className="fivestar"
                        style={{
                          width: "50px",
                          height: "50px",
                          // border: "1px solid #e7e7e7",
                          // borderRadius: "50%",
                        }}
                      >
                        {conditionalImage(product?.productType)}
                      </div>
                    </Tooltip>

                    {discount && discount > 0 ? (
                      <Tooltip
                        title="Discount"
                        position="right"
                        trigger="mouseenter"
                        animation="shift"
                        arrow={true}
                        duration={200}
                        distance={-10}
                        offset={0}
                        style={{ marginBottom: "10px" }}
                      >
                        <span className="onsale">
                          {discount}%
                          {/* {Math.floor(100 - (discountedPrice * 100) / oldPrice)} */}
                          {/* % */}
                        </span>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                    {product.tag.includes("new") ? (
                      <Tooltip
                        title="New Product"
                        position="right"
                        trigger="mouseenter"
                        animation="shift"
                        arrow={true}
                        duration={200}
                        distance={-10}
                        offset={0}
                        style={{ marginBottom: "10px" }}
                      >
                        <span
                          className={`hot ${
                            product.tag?.includes("5star") ? "fivestar" : ""
                          }`}
                        >
                          New
                        </span>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                    {product.tag.includes("5star") ? (
                      <Tooltip
                        title="Star Product"
                        position="right"
                        trigger="mouseenter"
                        animation="shift"
                        arrow={true}
                        duration={200}
                        distance={-10}
                        offset={0}
                        style={{
                          marginBottom: "10px",
                          borderRadius: "50%",
                          // border: "1px solid #e7e7e7",
                        }}
                      >
                        <span className="fivestar">
                          <img src="/assets/images/star.png" />
                        </span>
                      </Tooltip>
                    ) : (
                      ""
                    )}

                    {product?.stock < 1 ? (
                      <Tooltip
                        title="Out of stock"
                        position="right"
                        trigger="mouseenter"
                        animation="shift"
                        arrow={true}
                        duration={200}
                        distance={-10}
                        offset={0}
                        style={{ marginBottom: "10px" }}
                      >
                        <span className="out-of-stock">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ionicon"
                            viewBox="0 0 512 512"
                          >
                            <circle cx="184" cy="232" r="24"></circle>
                            <path d="M256 288c45.42 0 83.62 29.53 95.71 69.83a8 8 0 01-7.87 10.17H168.15a8 8 0 01-7.82-10.17C172.32 317.53 210.53 288 256 288z"></path>
                            <circle cx="328" cy="232" r="24"></circle>
                            <circle
                              cx="256"
                              cy="256"
                              r="208"
                              fill="none"
                              stroke="currentColor"
                              strokeMiterlimit="10"
                              strokeWidth="32"
                            ></circle>
                          </svg>
                        </span>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="product-grid__floating-icons">
                  {/* add to wishlist */}
                  <Tooltip
                    title={
                      wishlistItem !== undefined
                        ? "Added to wishlist"
                        : "Add to wishlist"
                    }
                    position="left"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <button
                      onClick={
                        wishlistItem !== undefined
                          ? () =>
                              deleteFromWishlist(
                                product,
                                addToast,
                                wishlistItems
                              )
                          : () =>
                              addToWishlist(product, addToast, wishlistItems)
                      }
                      className={
                        wishlistItem !== undefined
                          ? "active postion-relative"
                          : ""
                      }
                    >
                      <div
                        class={`heart ${
                          wishlistItem !== undefined ? "is-active" : ""
                        }`}
                      ></div>
                    </button>
                  </Tooltip>

                  {/* add to compare */}
                  <Tooltip
                    title={
                      compareItem !== undefined
                        ? "Added to compare"
                        : "Add to compare"
                    }
                    position="left"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <button
                      onClick={
                        compareItem !== undefined
                          ? () => deleteFromCompare(product, addToast)
                          : () => [
                              addToCompare(product, addToast),
                              setShowComparePopup(true),
                            ]
                      }
                      className={compareItem !== undefined ? "active" : ""}
                    >
                      <IoIosShuffle />
                    </button>
                  </Tooltip>

                  {/* quick view */}
                  <Tooltip
                    title="Quick view"
                    position="left"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <button
                      onClick={() => setModalShow(true)}
                      className="d-none d-lg-block"
                    >
                      <IoIosSearch />
                    </button>
                  </Tooltip>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 5,
                    right: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Image
                    src={product?.details?.standards[0]?.logo}
                    width={
                      product?.details?.standards[0]?.name === "Verra"
                        ? 95
                        : product?.details?.standards[0]?.name ===
                          "Gold Standard"
                        ? 70
                        : 50
                    }
                    height={40}
                    // layout="fill"
                    objectFit="contain"
                    // add shadow behind image
                    // className="shadow"
                    style={
                      {
                        // Add shadow behind image
                        // filter: "drop-shadow(0 0 0.75rem grey)",
                      }
                    }
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 20,
                    display: "flex",
                    alignItems: "flex-start",
                    paddingBottom: "10px",
                    flexDirection: "column",
                  }}
                >
                  {/* {product?.productType === "CORSIA" && (
                    <Tooltip
                      title={`${product?.productType}`}
                      position="right"
                      trigger="mouseenter"
                      animation="shift"
                      arrow={true}
                      duration={200}
                      distance={-10}
                      offset={0}
                      style={{ marginBottom: "10px" }}
                    >
                     
                      <span className="fivestar">
                        {conditionalImage(product?.productType)}
                      </span>
                    </Tooltip>
                  )} */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        fontSize: "20px",
                        background: "white",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ReactCountryFlag countryCode={selectedCountry} svg />
                      {/* {selectedCountry?.flag} */}
                    </div>
                    <div
                      style={{
                        color: "white",
                        marginBottom: "2px",
                        paddingLeft: "5px",
                      }}
                    >
                      {product?.country}
                    </div>
                  </div>
                </div>
              </>
            </Link>
          </div>

          {/*=======  single product content  =======*/}
          <div className="product-grid__content">
            <div className="title">
              <h3>
                <Link
                  href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                  as={
                    process.env.PUBLIC_URL +
                    "/shop/product-basic/" +
                    product.slug
                  }
                >
                  <a>{product.name}</a>
                </Link>
              </h3>
              {/* add to cart */}
              {product.affiliateLink ? (
                <a href={product.affiliateLink} target="_blank">
                  Buy now
                </a>
              ) : product.variation && product.variation.length >= 1 ? (
                <Link
                  href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                  as={
                    process.env.PUBLIC_URL +
                    "/shop/product-basic/" +
                    product.slug
                  }
                >
                  <a>Select Option</a>
                </Link>
              ) : product.stock && product.stock > 0 ? (
                <button
                  onClick={() => {
                    userData?.isLoggedIn
                      ? addItemToCart(product)
                      : addToCart(product, addToast, 1, "", "", cartItems);
                  }}
                  disabled={
                    cartItem !== undefined &&
                    cartItem.quantity >= cartItem.stock
                  }
                >
                  {cartItem !== undefined ? "Added to cart" : "Add to cart"}
                </button>
              ) : (
                <button disabled>Out of Stock</button>
              )}
            </div>
            <div className="price">
              <span className="main-price">
                {currencyCode}
                {""}
              </span>
              {discount > 0 ? (
                <Fragment>
                  <span className="main-price discounted">
                    {currencySymbol}
                    {formatCurrency(oldPrice, currencyCode)}
                  </span>
                  <span style={{ fontSize: "12px", marginRight: "5px" }}>
                    /
                  </span>
                  <span className="discounted-price">
                    {currencySymbol}
                    {formatCurrency(discountedPrice, currencyCode)}
                  </span>
                </Fragment>
              ) : (
                <span className="main-price">
                  {currencySymbol}
                  {formatCurrency(productPrice, currencyCode)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Col>
      {/* product modal */}
      <ProductModal
        setShowComparePopup={setShowComparePopup}
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        discount={discount}
        oldPrice={oldPrice}
        currencyCode={currencyCode}
        currencySymbol={currencySymbol}
        discountedprice={discountedPrice}
        productprice={productPrice}
        cartitems={cartItems}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        compareitem={compareItem}
        addtocart={addToCart}
        addtowishlist={addToWishlist}
        deletefromwishlist={deleteFromWishlist}
        addtocompare={addToCompare}
        deletefromcompare={deleteFromCompare}
        addtoast={addToast}
        wishlistItems={wishlistItems}
      />
    </Fragment>
  );
};

export default ProductGrid;
