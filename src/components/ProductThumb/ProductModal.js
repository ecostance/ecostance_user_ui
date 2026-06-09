import { useState, Fragment, useCallback } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { IoIosHeartEmpty, IoIosShuffle } from "react-icons/io";
import Swiper from "react-id-swiper";
import CustomScroll from "react-custom-scroll";
import { getProductCartQuantity } from "../../lib/product";
import { ProductRating } from "../Product";
import formatCurrency from "src/helpers/formatCurrency";
import _debounce from "src/helpers/debounce";

import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
  updateLocalCartCount,
} from "../../redux/actions/cartActions";

const ProductModal = (props) => {
  const {
    product,
    discountedprice,
    productprice,
    cartitems,
    wishlistitem,
    compareitem,
    addtocart,
    addtowishlist,
    deletefromwishlist,
    addtocompare,
    deletefromcompare,
    addtoast,
    discount,
    oldPrice,
    setShowComparePopup,
    wishlistItems,
    currencyCode,
    currencySymbol,
    onHide,
    cartItem,
    productReviews,
    userData,

    cartItems,
  } = props;
  const DELETE_FROM_CART_PRODUCT = "DELETE_FROM_CART_PRODUCT";
  const ADD_TO_CART_PRODUCT_INITIAL = "ADD_TO_CART_PRODUCT_INITIAL";
  const REDUCE_QUANTITY_TO_CART = "REDUCE_QUANTITY_TO_CART";
  const ADD_QUANTITY_TO_CART = "ADD_QUANTITY_TO_CART";
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product?.variation[0]?.color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0]?.size[0]?.name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product?.variation[0]?.size[0]?.stock : product.stock
  );
  // const [cartItem, setCartItem] = useState({});
  const [quantityCount, setQuantityCount] = useState(cartItem?.quantity || 0);
  const [quantityChangeLoading, setQuantityChangeLoading] = useState(false);

  const productCartQty = getProductCartQuantity(
    cartitems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  const gallerySwiperParams = {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };

  const debounceQuantityChange = useCallback(
    _debounce(
      (func, item, quantity, cartItems, type, setQuantityChangeLoading) => {
        if (type === ADD_QUANTITY_TO_CART) {
          return func(
            item,
            addtoast,
            quantity,
            cartItems,
            true,
            userData?.isLoggedIn
          );
        }

        if (type === REDUCE_QUANTITY_TO_CART) {
          return func(
            item,
            addtoast,
            cartItems,
            true,
            quantity,
            true,
            userData?.isLoggedIn
          );
        }

        if (type === ADD_TO_CART_PRODUCT_INITIAL) {
          return func(item, addtoast, 1, "", "", cartItems);
        }

        if (type === DELETE_FROM_CART_PRODUCT) {
          return func(item, addtoast, cartItems);
        }
      },
      userData?.isLoggedIn ? 3000 : 1
    ),
    []
  );

  const handleQuantityChange = (quantity, decreasing = false) => {
    console.log("quantity", quantity);
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
      // deleteFromCart(product, addtoast, cartItems);
    } else if (quantity === 1 && !decreasing) {
      // addToCart(
      //   product,
      //   addtoast,
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

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      className="product-quickview"
      centered
    >
      <Modal.Body>
        <Modal.Header>
          <div
            className="cross-icon-svg-holder product-modal-cross"
            onClick={() => onHide()}
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
        </Modal.Header>
        <div className="product-quickview__image-wrapper">
          <Swiper {...gallerySwiperParams}>
            {product.image &&
              product.image.map((single, key) => {
                return (
                  <div key={key}>
                    <div className="single-image">
                      <img src={single} className="img-fluid" alt="" />
                    </div>
                  </div>
                );
              })}
          </Swiper>
        </div>
        <Row>
          <Col md={7} sm={12} className="ml-auto">
            <CustomScroll allowOuterScroll={true}>
              <div className="product-quickview__content">
                <h2 className="product-quickview__title space-mb--20">
                  {product.name}
                </h2>
                <div className="product-quickview__price space-mb--20">
                  <span className="main-price">{currencyCode}</span>{" "}
                  {discount > 0 ? (
                    <Fragment>
                      <span className="main-price discounted">
                        {currencySymbol}
                        {formatCurrency(productprice, currencyCode)}
                      </span>
                      <span style={{ fontSize: "15px", marginRight: "5px" }}>
                        /
                      </span>
                      <span className="main-price">
                        {currencySymbol}
                        {formatCurrency(discountedprice, currencyCode)}
                      </span>
                    </Fragment>
                  ) : (
                    <span className="main-price">
                      {currencySymbol}
                      {formatCurrency(productprice, currencyCode)}{" "}
                    </span>
                  )}
                </div>
                {product.rating && product.rating > 0 ? (
                  <div className="product-quickview__rating-wrap space-mb--20">
                    <div className="product-quickview__rating">
                      <ProductRating ratingValue={product.rating} />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="product-quickview__description space-mb--30">
                  <p>{product.shortDescription}</p>
                </div>
                <div style={{ display: "flex", marginBottom: 10 }}>
                  {product?.details?.sdgs?.map((d) => {
                    return (
                      <div key={d?.sdg?._id}>
                        <img
                          src={d?.sdg?.image}
                          style={{ height: 80, width: 80, margin: 1 }}
                          alt=""
                        />
                      </div>
                    );
                  })}
                </div>
                {/* {product.details.sdgs.map((d) => {
                  return (
                    <div key={d?.sdg?._id}>
                      <div style={{ padding: 5 }}>
                        <span style={{ fontSize: 16, color: "#333" }}>
                          {d?.sdg?.name}:
                        </span>
                        <div style={{ fontSize: 15, paddingLeft: 30 }}>
                          <p>{d?.details}</p>
                        </div>
                      </div>
                    </div>
                  );
                })} */}
                {/* {product.variation ? (
                  <div className="product-quickview__size-color">
                    <div className="product-quickview__size space-mb--20">
                      <div className="product-quickview__size__title">Size</div>
                      <div className="product-quickview__size__content">
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
                                          singleSize.name ===
                                          selectedProductSize
                                            ? "checked"
                                            : ""
                                        }
                                        id={singleSize.name}
                                        onChange={() => {
                                          setSelectedProductSize(
                                            singleSize.name
                                          );
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
                    <div className="product-quickview__color space-mb--20">
                      <div className="product-quickview__color__title">
                        Color
                      </div>
                      <div className="product-quickview__color__content">
                        {product.variation.map((single, i) => {
                          return (
                            <Fragment key={i}>
                              <input
                                type="radio"
                                value={single.color}
                                name="product-color"
                                id={single.color}
                                checked={
                                  single.color === selectedProductColor
                                    ? "checked"
                                    : ""
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
                )} */}
                {product.affiliateLink ? (
                  <div className="product-quickview__quality">
                    <div className="product-quickview__cart btn-hover">
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
                    <div className="product-quickview__quantity space-mb--20">
                      <div className="product-quickview__quantity__title">
                        Quantity
                      </div>
                      <div className="cart-plus-minus">
                        <button
                          onClick={() =>
                            handleQuantityChange(quantityCount - 1, true)
                          }
                          // onClick={() =>
                          //   setQuantityCount(
                          //     quantityCount > 1 ? quantityCount - 1 : 1
                          //   )
                          // }
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
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuantityChange(quantityCount + 1);
                          }}
                          // onClick={() =>
                          //   setQuantityCount(
                          //     quantityCount < productStock - productCartQty
                          //       ? quantityCount + 1
                          //       : quantityCount
                          //   )
                          // }
                          className="qtybutton"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="product-quickview__button-wrapper d-flex align-items-center">
                      {productStock && productStock > 0 ? (
                        <button
                          onClick={() =>
                            addtocart(
                              product,
                              addtoast,
                              quantityCount,
                              selectedProductColor,
                              selectedProductSize,
                              cartitems
                            )
                          }
                          disabled={productCartQty >= productStock}
                          className="lezada-button lezada-button--medium product-quickview__cart space-mr--10"
                        >
                          Add To Cart
                        </button>
                      ) : (
                        <button
                          className="lezada-button lezada-button--medium product-quickview__ofs space-mr--10"
                          disabled
                        >
                          Out of Stock
                        </button>
                      )}

                      <button
                        className={`product-quickview__wishlist space-mr--10 ${
                          wishlistitem !== undefined ? "active" : ""
                        }`}
                        title={
                          wishlistitem !== undefined
                            ? "Added to wishlist"
                            : "Add to wishlist"
                        }
                        onClick={
                          wishlistitem !== undefined
                            ? () =>
                                deletefromwishlist(
                                  product,
                                  addtoast,
                                  wishlistItems
                                )
                            : () =>
                                addtowishlist(product, addtoast, wishlistItems)
                        }
                      >
                        <IoIosHeartEmpty />
                      </button>

                      <button
                        className={`product-quickview__compare space-mr--10 ${
                          compareitem !== undefined ? "active" : ""
                        }`}
                        title={
                          compareitem !== undefined
                            ? "Added to compare"
                            : "Add to compare"
                        }
                        onClick={
                          compareitem !== undefined
                            ? () => deletefromcompare(product, addtoast)
                            : () => [
                                addtocompare(product, addtoast),
                                setShowComparePopup(true),
                              ]
                        }
                      >
                        <IoIosShuffle />
                      </button>
                    </div>
                  </Fragment>
                )}
              </div>
            </CustomScroll>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
