import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Countdown from "react-countdown";
import { IoIosCart } from "react-icons/io";
import regionPrice from "src/helpers/regionPrice";
import Renderer from "./Renderer";
import _debounce, { _newDebounce } from "src/helpers/debounce";
import { getProductCartQuantity } from "../../lib/product";
import CartOverlay from "../Header/elements/CartOverlay";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { Tooltip } from "react-tippy";

const DELETE_FROM_CART_PRODUCT = "DELETE_FROM_CART_PRODUCT";
const ADD_TO_CART_PRODUCT_INITIAL = "ADD_TO_CART_PRODUCT_INITIAL";
const REDUCE_QUANTITY_TO_CART = "REDUCE_QUANTITY_TO_CART";
const ADD_QUANTITY_TO_CART = "ADD_QUANTITY_TO_CART";

const CountdownTimerFour = ({
  title,
  image,
  dateTime,
  url,
  buttonText,
  spaceBottomClass,
  backgroundColorClass,
  offeredProductData,
  userData,
  cartItems,
  addToCart,
  deleteFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateLocalCartCount,
  addToast,
}) => {
  let regionPricing;
  offeredProductData?.success
    ? (regionPricing = regionPrice(
        offeredProductData?.data[0]?.product,
        userData
      ))
    : "";
  const [selectedProductColor, setSelectedProductColor] = useState(
    offeredProductData?.data[0]?.product.variation
      ? offeredProductData?.data[0]?.product.variation[0].color
      : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    offeredProductData?.data[0]?.product.variation
      ? offeredProductData?.data[0]?.product.variation[0].size[0].name
      : ""
  );
  const [productStock, setProductStock] = useState(
    offeredProductData?.data[0]?.product?.variation
      ? offeredProductData?.data[0]?.product?.variation[0].size[0].stock
      : offeredProductData?.data[0]?.product?.stock
  );
  const productCartQty = getProductCartQuantity(
    cartItems?.products,
    offeredProductData?.data[0]?.product,
    selectedProductColor,
    selectedProductSize
  );
  useEffect(() => {
    const item = cartItems?.products?.filter(
      (item) => item.cartItemId === offeredProductData?.data[0].product?._id
    )[0];
    setCartItem(item);
    setQuantityCount(item?.quantity || 0);
    setQuantityChangeLoading(false);
  }, [cartItems?.products]);

  const [cartItem, setCartItem] = useState({});
  const [quantityCount, setQuantityCount] = useState(cartItem?.quantity || 0);
  const [quantityChangeLoading, setQuantityChangeLoading] = useState(false);
  const [showPlusMinus, setShowPlusMinus] = useState(false);
  const [offCanvasCartActive, setOffCanvasCartActive] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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

  const handleQuantityChange = (quantity, decreasing = false) => {
    if (quantity < 0) {
      return;
    }
    setQuantityChangeLoading(true);
    if (quantity === 0) {
      debounceQuantityChange(
        deleteFromCart,
        offeredProductData?.data[0].product,
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
        offeredProductData?.data[0]?.product,
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
          cartItemId: offeredProductData?.data[0].product?._id,
          quantity: quantityCount - 1,
          _id: offeredProductData?.data[0].product?._id,
          product: offeredProductData?.data[0].product,
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
          cartItemId: offeredProductData?.data[0]?.product?._id,
          quantity: quantityCount + 1,
          _id: offeredProductData?.data[0]?.product?._id,
          product: offeredProductData?.data[0]?.product,
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
    <div
      className={`countdown-timer-wrapper ${
        backgroundColorClass ? backgroundColorClass : ""
      } ${spaceBottomClass ? spaceBottomClass : ""}`}
    >
      <Container className="wide">
        <Row>
          <Col lg={12}>
            <div className="countdown-background space-pt--30 space-pb--30">
              <Row className="align-items-center">
                <Col lg={3} xl={5}>
                  <div className="countdown-image text-center space-mb-mobile-only--50 countdown-image">
                    {!showVideo ? (
                      <img
                        src={
                          // offeredProductData?.success
                          //   ? offeredProductData?.data[0]?.product?.image[0]
                          // :
                          image
                        }
                        className="img-fluid"
                        alt=""
                      />
                    ) : (
                      <div
                        className="img-fluid"
                        style={{
                          border: "5px solid white",
                          width: "570px",
                          // boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                          boxShadow:
                            "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                        }}
                      >
                        <iframe
                          width="560"
                          height="315"
                          src="https://www.youtube.com/embed/oNDBkvqKiHo?si=J5BnqxjJ6sYNZpip&rel=0&loop=1"
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen
                        ></iframe>
                      </div>
                    )}
                    <div
                      style={{ position: "absolute", top: "40%", left: "45%" }}
                    >
                      {!showVideo && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Tooltip
                            title="Play Video"
                            position="top"
                            trigger="mouseenter"
                            animation="shift"
                            arrow={true}
                            duration={200}
                          >
                            <AiOutlinePlayCircle
                              onClick={(e) => setShowVideo(true)}
                              style={{ color: "white", fontSize: "60px" }}
                            />
                          </Tooltip>
                          {/* <h4
                            style={{
                              fontWeight: "bold",
                              opacity: "0.5",
                              fontSize: "20px",
                              paddingTop: "10px",
                            }}
                          >
                            Watch Video
                          </h4> */}
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col lg={9} xl={7}>
                  <div className="countdown-wrapper text-center">
                    {/* <h3>{title}</h3> */}
                    <h3>
                      Special Offer:{" "}
                      {offeredProductData?.data[0]?.product?.name}
                    </h3>
                    <div className="deal-countdown">
                      <Countdown
                        date={
                          offeredProductData?.success
                            ? new Date(offeredProductData?.data[0]?.expiresAt)
                            : dateTime
                        }
                        renderer={Renderer}
                      />
                    </div>

                    {/* <Link
                      href={
                        offeredProductData?.success
                          ? process.env.PUBLIC_URL +
                            "/shop/product-basic/" +
                            offeredProductData?.data[0]?.product?.slug
                          : "/shop/left-sidebar"
                      }
                      as={
                        offeredProductData?.success
                          ? process.env.PUBLIC_URL +
                            "/shop/product-basic/" +
                            offeredProductData?.data[0]?.product?.slug
                          : "/shop/left-sidebar"
                      }
                    > */}
                    {/* <div className="lezada-button lezada-button--medium lezada-button--icon--left button--cursor button--black">
                      <IoIosCart /> Only{" "}
                      {offeredProductData?.success
                        ? regionPricing?.currencySymbol +
                          regionPricing?.productPrice
                        : "USD $9.00"}
                    </div> */}

                    {!showPlusMinus ? (
                      <div
                        onClick={(e) => {
                          handleQuantityChange(quantityCount + 1);
                          setShowPlusMinus(true);
                          setOffCanvasCartActive(true);
                        }}
                        // className="lezada-button lezada-button--medium lezada-button--icon--left"
                        className="lezada-button lezada-button--medium lezada-button--icon--left button--cursor button--black"
                        style={{ cursor: "pointer" }}
                      >
                        <IoIosCart /> Only{" "}
                        {/* {featuredProduct?.success
                          ? regionPricing?.currencySymbol
                          : "$"} */}
                        {offeredProductData?.success
                          ? regionPricing?.currencySymbol +
                            regionPricing?.productPrice
                          : "USD $9.00"}
                        &nbsp;
                        {/* {quantityChangeLoading ? (
                          <Spinner size="sm" animation="border" />
                        ) : (
                          ""
                        )} */}
                      </div>
                    ) : (
                      <div
                        className="product-content__quantity"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {/* <div className="product-content__quantity__title">
                    Quantity
                  </div> */}
                        <div className="cart-plus-minus bgStyle">
                          <button
                            onClick={() =>
                              handleQuantityChange(quantityCount - 1, true)
                            }
                            className="qtybutton"
                          >
                            -
                          </button>
                          <input
                            className="cart-plus-minus-box"
                            type="text"
                            value={quantityCount}
                            readOnly
                            style={{
                              background: "transparent",
                              color: "white",
                            }}
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
                    )}

                    {/* </Link> */}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <CartOverlay
          activeStatus={offCanvasCartActive}
          getActiveStatus={setOffCanvasCartActive}
          totalItemsInCart={cartItems?.localCartCount}
        />
      </Container>
    </div>
  );
};

export default CountdownTimerFour;
