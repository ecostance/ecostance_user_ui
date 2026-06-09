import { useState, Fragment, useEffect, useCallback } from "react";
import { IoIosHeartEmpty, IoIosShuffle } from "react-icons/io";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { ProductRating } from "../Product";
import { getProductCartQuantity } from "../../lib/product";
import formatCurrency from "src/helpers/formatCurrency";
import _debounce from "src/helpers/debounce";
import { Spinner } from "react-bootstrap";
const DELETE_FROM_CART_PRODUCT = "DELETE_FROM_CART_PRODUCT";
const ADD_TO_CART_PRODUCT_INITIAL = "ADD_TO_CART_PRODUCT_INITIAL";
const REDUCE_QUANTITY_TO_CART = "REDUCE_QUANTITY_TO_CART";
const ADD_QUANTITY_TO_CART = "ADD_QUANTITY_TO_CART";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { Country, State, City } from "country-state-city";
import ReactCountryFlag from "react-country-flag";
const ProductDescription = ({
  product,
  discount,
  productPrice,
  currencyCode,
  discountedPrice,
  cartItems,
  wishlistItem,
  compareItem,
  addToast,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare,
  wishlistItems,
  currencySymbol,
  oldPrice,
  setShowComparePopup,
  deleteFromCart,
  increaseQuantity,
  decreaseQuantity,
  userData,
  updateLocalCartCount,
}) => {
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.stock
  );

  const [selectedCountry, setSelectedCountry] = useState([]);

  const getAllCountries = () => {
    const countryList = Country.getAllCountries();

    const found = countryList.find(
      (o) => o.name.toLowerCase() === product.country.toLowerCase()
    );
    setSelectedCountry(found.isoCode);
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  const productCartQty = getProductCartQuantity(
    cartItems?.products,
    product,
    selectedProductColor,
    selectedProductSize
  );

  useEffect(() => {
    const item = cartItems?.products?.filter(
      (item) => item.cartItemId === product._id
    )[0];
    setCartItem(item);
    setQuantityCount(item?.quantity || 0);
    setQuantityChangeLoading(false);
  }, [cartItems?.products]);

  const [cartItem, setCartItem] = useState({});
  const [quantityCount, setQuantityCount] = useState(cartItem?.quantity || 0);
  const [quantityChangeLoading, setQuantityChangeLoading] = useState(false);
  // const debounceAddQuantityToCart = useCallback(
  //   _debounce((func, id, quantity) => {
  //     func({ _id: id }, addToast, quantity, cartItems);
  //   }, 1000),
  //   []
  // );

  const debounceQuantityChange = useCallback(
    _debounce(
      (func, item, quantity, cartItems, type, setQuantityChangeLoading) => {
        if (type === ADD_QUANTITY_TO_CART) {
          return func(
            item,
            addToast,
            quantity,
            cartItems,
            true,
            userData?.isLoggedIn
          );
        }

        if (type === REDUCE_QUANTITY_TO_CART) {
          return func(
            item,
            addToast,
            cartItems,
            true,
            quantity,
            true,
            userData?.isLoggedIn
          );
        }

        if (type === ADD_TO_CART_PRODUCT_INITIAL) {
          return func(item, addToast, 1, "", "", cartItems);
        }

        if (type === DELETE_FROM_CART_PRODUCT) {
          return func(item, addToast, cartItems);
        }
      },
      userData?.isLoggedIn ? 3000 : 1
    ),
    []
  );

  // const debounceReduceQuantityToCart = useCallback(
  //   _debounce((func, id, quantity) => {
  //     func({ _id: id }, addToast, cartItems, true, quantity);
  //   }, 1000),
  //   []
  // );

  const handleQuantityChange = (quantity, decreasing = false) => {
    if (quantity < 0) {
      return;
    }
    setQuantityChangeLoading(true);
    if (quantity === 0) {
      debounceQuantityChange(
        deleteFromCart,
        product,
        0,
        cartItems,
        DELETE_FROM_CART_PRODUCT,
        setQuantityChangeLoading
      );
      updateLocalCartCount(cartItems?.localCartCount - 1);
      // deleteFromCart(product, addToast, cartItems);
    } else if (quantity === 1 && !decreasing) {
      // addToCart(
      //   product,
      //   addToast,
      //   1,
      //   selectedProductColor,
      //   selectedProductSize,
      //   cartItems
      // );
      debounceQuantityChange(
        addToCart,
        product,
        1,
        cartItems,
        ADD_TO_CART_PRODUCT_INITIAL,
        setQuantityChangeLoading
      );
      updateLocalCartCount(cartItems?.localCartCount + 1);
    } else if (decreasing) {
      // console.log('decreasing quantity', quantity);
      // debounceReduceQuantityToCart(
      //   decreaseQuantity,
      //   product?._id,
      //   quantityCount - 1
      // );
      debounceQuantityChange(
        decreaseQuantity,
        {
          cartItemId: product?._id,
          quantity: quantityCount - 1,
          _id: product?._id,
          product,
        },
        quantityCount - 1,
        cartItems,
        REDUCE_QUANTITY_TO_CART,
        setQuantityChangeLoading
      );
      updateLocalCartCount(cartItems?.localCartCount - 1);
    } else {
      // console.log('addExec');
      // debounceAddQuantityToCart(
      //   increaseQuantity,
      //   product?._id,
      //   quantityCount + 1
      // );

      debounceQuantityChange(
        increaseQuantity,
        {
          cartItemId: product?._id,
          quantity: quantityCount + 1,
          _id: product?._id,
          product,
        },
        quantityCount + 1,
        cartItems,
        ADD_QUANTITY_TO_CART,
        setQuantityChangeLoading
      );
      updateLocalCartCount(cartItems?.localCartCount + 1);
    }
    setQuantityCount(quantity);
  };

  const handleProductNav = (navType) => {
    // get all products and find the index of current product. then get the next product
    const temp = JSON.parse(localStorage.getItem("persist:primary"));
    const allProducts = JSON.parse(temp?.productData);
    console.log("allProducts", allProducts);
    const currentProductIndex = allProducts.findIndex(
      (p) => p._id === product._id
    );
    const nextProduct = null;
    if (navType === "prev") {
      nextProduct = allProducts[currentProductIndex - 1];
    } else {
      nextProduct = allProducts[currentProductIndex + 1];
    }
    if (nextProduct) {
      window.location.href = `/shop/product-basic/${nextProduct.slug}`;
    } else {
      // window.location.href = `/shop/product-basic/${allProducts[0].slug}`;
    }
  };

  return (
    <div className="product-content">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {product.avgRating && product.avgRating > 0 ? (
          <div className="product-content__rating-wrap d-block d-sm-flex space-mb--20">
            <div className="product-content__rating space-mr--20">
              <ProductRating ratingValue={product.avgRating} />
            </div>
            <div className="product-content__rating-count">
              <a href="#">( {product.ratingCount} customer reviews )</a>
            </div>
          </div>
        ) : (
          <div className="product-content__rating-wrap d-block d-sm-flex space-mb--20">
            <div className="product-content__rating space-mr--20">
              <ProductRating ratingValue={0} />
            </div>
            <div className="product-content__rating-count">
              <a href="#">( 0 customer reviews )</a>
            </div>
          </div>
        )}
        <div style={{ marginBottom: "20px" }}>
          <BsArrowLeft
            className="productNavArrow"
            onClick={(e) => handleProductNav("prev")}
          />
          <BsArrowRight
            className="productNavArrow"
            onClick={(e) => handleProductNav("next")}
          />
        </div>
      </div>
      <h2 className="product-content__title space-mb--20">{product.name}</h2>
      <div className="product-content__price space-mb--20">
        <span className="main-price" style={{ marginRight: "8px" }}>
          {currencyCode}
        </span>
        {discount > 0 ? (
          <Fragment>
            <span className="main-price discounted">
              {currencySymbol}
              {formatCurrency(oldPrice, currencyCode)}
            </span>
            <span style={{ fontSize: "15px", marginRight: "5px" }}>/</span>
            <span className="main-price">
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
      <div className="product-content__description space-mb--30">
        <p>{product.shortDescription}</p>
      </div>

      {product.variation ? (
        <div className="product-content__size-color">
          <div className="product-content__size space-mb--20">
            <div className="product-content__size__title">Size</div>
            <div className="product-content__size__content">
              {product.variation &&
                product.variation.map((single) => {
                  return single.color === selectedProductColor
                    ? single.size.map((singleSize, i) => {
                        return (
                          <Fragment key={i}>
                            <input
                              type="radio"
                              value={singleSize.name}
                              checked={
                                singleSize.name === selectedProductSize
                                  ? "checked"
                                  : ""
                              }
                              id={singleSize.name}
                              onChange={() => {
                                setSelectedProductSize(singleSize.name);
                                setProductStock(singleSize.stock);
                                setQuantityCount(1);
                              }}
                            />
                            <label htmlFor={singleSize.name}>
                              {singleSize.name}
                            </label>
                          </Fragment>
                        );
                      })
                    : "";
                })}
            </div>
          </div>
          <div className="product-content__color space-mb--20">
            <div className="product-content__color__title">Color</div>
            <div className="product-content__color__content">
              {product.variation.map((single, i) => {
                return (
                  <Fragment key={i}>
                    <input
                      type="radio"
                      value={single.color}
                      name="product-color"
                      id={single.color}
                      checked={
                        single.color === selectedProductColor ? "checked" : ""
                      }
                      onChange={() => {
                        setSelectedProductColor(single.color);
                        setSelectedProductSize(single.size[0].name);
                        setProductStock(single.size[0].stock);
                        setQuantityCount(1);
                      }}
                    />
                    <label
                      htmlFor={single.color}
                      style={{ backgroundColor: single.colorCode }}
                    ></label>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {product.affiliateLink ? (
        <div className="product-content__quality">
          <div className="product-content__cart btn-hover">
            <a
              href={product.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
              className="lezada-button lezada-button--medium"
            >
              Buy Now
            </a>
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="product-content__quantity space-mb--40">
            <div className="product-content__quantity__title">Quantity</div>
            <div className="cart-plus-minus">
              <button
                onClick={() => handleQuantityChange(quantityCount - 1, true)}
                className="qtybutton"
              >
                -
              </button>
              <input
                className="cart-plus-minus-box"
                type="text"
                value={quantityCount}
                readOnly
              />
              <button
                onClick={() => [
                  quantityCount < productStock - productCartQty
                    ? handleQuantityChange(quantityCount + 1)
                    : "",
                ]}
                className="qtybutton"
              >
                +
              </button>
            </div>
          </div>

          <div className="product-content__button-wrapper d-flex align-items-center">
            {productStock && productStock > 0 ? (
              <button
                onClick={() => handleQuantityChange(quantityCount + 1)}
                disabled={productCartQty >= productStock}
                className="lezada-button lezada-button--medium product-content__cart space-mr--10 button--black d-flex"
                style={{ gap: "5px", alignItems: "center" }}
              >
                Add To Cart
                {quantityChangeLoading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  ""
                )}
              </button>
            ) : (
              <button
                className="lezada-button lezada-button--medium product-content__cart space-mr--10 button--black"
                disabled
              >
                Out of Stock
              </button>
            )}

            <button
              className={`product-content__wishlist space-mr--10 ${
                wishlistItem !== undefined ? "active" : ""
              }`}
              title={
                wishlistItem !== undefined
                  ? "Added to wishlist"
                  : "Add to wishlist"
              }
              onClick={
                wishlistItem !== undefined
                  ? () => deleteFromWishlist(product, addToast, wishlistItems)
                  : () => addToWishlist(product, addToast, wishlistItems)
              }
            >
              <IoIosHeartEmpty />
            </button>

            <button
              className={`product-content__compare space-mr--10 ${
                compareItem !== undefined ? "active" : ""
              }`}
              title={
                compareItem !== undefined
                  ? "Added to compare"
                  : "Add to compare"
              }
              onClick={
                compareItem !== undefined
                  ? () => deleteFromCompare(product, addToast)
                  : () => [
                      addToCompare(product, addToast),
                      setShowComparePopup(true),
                    ]
              }
            >
              <IoIosShuffle />
            </button>
          </div>

          <div className="product-content__other-info space-mt--50">
            <table>
              <tbody>
                <tr className="single-info" height="60px">
                  <td className="title">SDG: </td>
                  <td className="value">
                    <div
                      style={{
                        display: "flex",
                        // marginBottom: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {product?.details?.sdgs
                        .sort((a, b) => a.sdg.index - b.sdg.index)
                        .map((d, i) => {
                          return (
                            <div key={d?.sdg?._id}>
                              <img
                                src={d?.sdg?.image}
                                style={{
                                  height: 38,
                                  width: 38,
                                  margin: 1,
                                  opacity: d.fulFilled ? 1 : 0.2,
                                }}
                                alt=""
                              />
                            </div>
                          );
                        })}
                    </div>
                  </td>
                </tr>
                <tr className="single-info" height="60px">
                  <td className="title">Standards: </td>
                  <td className="value">
                    <div
                      className="productPage standards--section"
                      style={{
                        display: "flex",
                        // marginBottom: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {/* {JSON.stringify(product.standards)} */}
                      {product?.details?.standards.map((d, i) => {
                        return (
                          <div
                            className="each--product--standard"
                            // style={{ display: "flex", alignItems: "center" }}
                            key={i}
                          >
                            <img
                              src={d?.logo}
                              style={{ maxHeight: "38px", marginRight: "10px" }}
                              alt=""
                            />
                            <div>{d?.methodology}</div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
                <tr className="single-info" height="60px">
                  <td className="title">Project Type: </td>
                  <td className="value">
                    <div
                      className="productPage standards--section"
                      style={{
                        display: "flex",
                        // marginBottom: 10,
                        flexWrap: "wrap",
                        lineHeight: "1.5",
                      }}
                    >
                      {product?.productType}
                      {/* {JSON.stringify(product.standards)} */}
                      {/* {product?.details?.standards.map((d, i) => {
                        return (
                          <div
                            className="each--product--standard"
                            // style={{ display: "flex", alignItems: "center" }}
                            key={i}
                          >
                            <img
                              src={d?.logo}
                              style={{ maxHeight: "70px", marginRight: "10px" }}
                              alt=""
                            />
                            <div>{d?.methodology}</div>
                          </div>
                        );
                      })} */}
                    </div>
                  </td>
                </tr>
                <tr className="single-info" height="60px">
                  <td className="title">Country: </td>
                  <td className="value">
                    <div
                      className="productPage standards--section1"
                      style={{
                        display: "flex",
                        // flexDirection: "row !important",
                        alignItems: "center",
                        // marginBottom: 10,
                        // flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          border: "1px solid #e7e7e7",
                          width: "40px",
                          height: "40px",
                          fontSize: "35px",
                          // display: "flex",
                          // alignItems: "center",
                          // justifyContent: "center",
                          marginRight: "10px",
                        }}
                      >
                        <ReactCountryFlag countryCode={selectedCountry} svg />
                        {/* {selectedCountry?.flag} */}
                      </span>{" "}
                      {product?.country}
                      {/* {JSON.stringify(product.standards)} */}
                      {/* {product?.details?.standards.map((d, i) => {
                        return (
                          <div
                            className="each--product--standard"
                            // style={{ display: "flex", alignItems: "center" }}
                            key={i}
                          >
                            <img
                              src={d?.logo}
                              style={{ maxHeight: "70px", marginRight: "10px" }}
                              alt=""
                            />
                            <div>{d?.methodology}</div>
                          </div>
                        );
                      })} */}
                    </div>
                  </td>
                </tr>
                {/* <tr className="single-info">
                  <td className="title">Share on: </td>
                  <td className="value">
                    <ul className="social-icons">
                      <li>
                        <a href="https://www.x.com">
                          <FaTwitter />
                        </a>
                      </li>
                      <li>
                        <a href="https://www.facebook.com">
                          <FaFacebookF />
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com">
                          <FaInstagram />
                        </a>
                      </li>
                      <li>
                        <a href="https://www.youtube.com">
                          <FaYoutube />
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ProductDescription;
