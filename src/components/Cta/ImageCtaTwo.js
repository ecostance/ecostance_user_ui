import { Container, Row, Col, Spinner } from "react-bootstrap";
import Link from "next/link";
import { IoIosCart } from "react-icons/io";
import { useCallback, useEffect, useState } from "react";
import regionPrice from "src/helpers/regionPrice";
import { updateCartBulk } from "src/helpers/updateCartBulk";
import { useToasts } from "react-toast-notifications";
import _debounce, { _newDebounce } from "src/helpers/debounce";
import { getProductCartQuantity } from "../../lib/product";
import CartOverlay from "../Header/elements/CartOverlay";

const DELETE_FROM_CART_PRODUCT = "DELETE_FROM_CART_PRODUCT";
const ADD_TO_CART_PRODUCT_INITIAL = "ADD_TO_CART_PRODUCT_INITIAL";
const REDUCE_QUANTITY_TO_CART = "REDUCE_QUANTITY_TO_CART";
const ADD_QUANTITY_TO_CART = "ADD_QUANTITY_TO_CART";

const ImageCtaTwo = ({
  spaceBottomClass,
  featuredProduct,
  userData,
  cartItems,
  addToast,
  addToCart,
  deleteFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateLocalCartCount,
  addItemToCart,
}) => {
  let regionPricing;
  featuredProduct?.success
    ? (regionPricing = regionPrice(featuredProduct?.data?.[0], userData))
    : "";

  if (cartItems?.products instanceof Array) {
    cartItem = cartItems?.products?.filter(
      (cartItem) => cartItem.cartItemId === featuredProduct?.data?.[0]._id
    )[0];
  }
  const [selectedProductColor, setSelectedProductColor] = useState(
    featuredProduct?.data?.[0].variation
      ? featuredProduct?.data?.[0].variation[0].color
      : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    featuredProduct?.data?.[0].variation
      ? featuredProduct?.data?.[0].variation[0].size[0].name
      : ""
  );
  const [productStock, setProductStock] = useState(
    featuredProduct?.data?.[0].variation
      ? featuredProduct?.data?.[0].variation[0].size[0].stock
      : featuredProduct?.data?.[0].stock
  );
  const productCartQty = getProductCartQuantity(
    cartItems?.products,
    featuredProduct?.data?.[0],
    selectedProductColor,
    selectedProductSize
  );

  useEffect(() => {
    const item = cartItems?.products?.filter(
      (item) => item.cartItemId === featuredProduct?.data?.[0]._id
    )[0];
    setCartItem(item);
    setQuantityCount(item?.quantity || 0);
    if (!item?.quantity || item?.quantity === 0) {
      setShowPlusMinus(false)
    }
    setQuantityChangeLoading(false);
  }, [cartItems?.products]);

  const imageData = [
    "/assets/images/bottomLogos/americanlogo.png",
    "/assets/images/bottomLogos/climateaction.png",
    "/assets/images/bottomLogos/unccf.png",
    "/assets/images/bottomLogos/goldstandard.png",
    "/assets/images/bottomLogos/verra.png",
    "/assets/images/bottomLogos/planviv.png",
    "/assets/images/bottomLogos/cercarbano.png",
    "/assets/images/bottomLogos/jnredd.png",
    "/assets/images/bottomLogos/climatecommunity.png",
  ]

  const [cartItem, setCartItem] = useState({});
  const [quantityCount, setQuantityCount] = useState(cartItem?.quantity || 0);
  const [quantityChangeLoading, setQuantityChangeLoading] = useState(false);
  const [showPlusMinus, setShowPlusMinus] = useState(false);
  const [offCanvasCartActive, setOffCanvasCartActive] = useState(false);
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
        featuredProduct?.data?.[0],
        0,
        cartItems,
        DELETE_FROM_CART_PRODUCT,
        // setQuantityChangeLoading,
        setShowPlusMinus(false),
        setQuantityChangeLoading(false)
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
        featuredProduct?.data?.[0],
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
          cartItemId: featuredProduct?.data?.[0]?._id,
          quantity: quantityCount - 1,
          _id: featuredProduct?.data?.[0]?._id,
          product: featuredProduct?.data?.[0],
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
          cartItemId: featuredProduct?.data?.[0]?._id,
          quantity: quantityCount + 1,
          _id: featuredProduct?.data?.[0]?._id,
          product: featuredProduct?.data?.[0],
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

  const loremText =
    "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  return (
    <>
      <div
        className={`image-cta-two ${spaceBottomClass ? spaceBottomClass : ""}`}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="image-cta-two__content space-mb-mobile-only--40">
                <h3 className="subtitle space-mb--30">FEATURED PRODUCT</h3>
                <h2 className="title space-mb--30">
                  {/* {featuredProduct?.success
                  ? featuredProduct?.data?.[0]?.name
                  : "Montana Shelf Collection"} */}
                  Pacajai REDD+ Brazil
                </h2>
                <p className="text space-mb--30">
                  {/* {returnShortenParagraph(
                  featuredProduct?.success
                    ? featuredProduct?.data?.[0]?.shortDescription
                    : loremText,
                  163
                )} */}
                  Special REDD+ project located at the edge of the deforestation
                  frontier in Brazil is preventing unplanned deforestation due to
                  illegal logging, weak law enforcement, and severe poverty.
                  Ongoing funding will prevent net emissions of 10.6 million
                  metric tons of carbon while managing the land as a “private
                  conservation reserve” with regeneration, continuous surveillance
                  and better forest management.
                </p>
                {/* <Link
                href={
                  featuredProduct?.success
                    ? `/shop/product-basic/${featuredProduct?.data?.[0]?.slug}`
                    : "/shop/left-sidebar"
                }
                as={
                  featuredProduct?.success
                    ? process.env.PUBLIC_URL +
                      `/shop/product-basic/${featuredProduct?.data?.[0]?.slug}`
                    : "/shop/left-sidebar"
                }
              > */}
                {!showPlusMinus ? (
                  <div
                    onClick={(e) => {
                      // if (login) {
                      //   addItemToCart(featuredProduct.data[0]);
                      // } else {
                      // handleQuantityChange(quantityCount - 1, true);
                      handleQuantityChange(quantityCount + 1);
                      // }
                      setShowPlusMinus(true);
                      setOffCanvasCartActive(true);
                    }}
                    className="lezada-button lezada-button--medium lezada-button--icon--left"
                    style={{ cursor: "pointer" }}
                  >
                    <IoIosCart /> Only{" "}
                    {featuredProduct?.success
                      ? regionPricing?.currencySymbol
                      : "$"}
                    {featuredProduct?.success
                      ? regionPricing?.productPrice
                      : "15.00"}
                    &nbsp;
                    {quantityChangeLoading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <div className="product-content__quantity">
                    {/* <div className="product-content__quantity__title">
                    Quantity
                  </div> */}
                    <div className="cart-plus-minus bgStyle">
                      <button
                        onClick={() =>
                          handleQuantityChange(quantityCount - 1, true)
                        }
                        className="qtybutton"
                        style={{ color: "white" }}
                      >
                        -
                      </button>
                      <input
                        className="cart-plus-minus-box"
                        type="text"
                        value={quantityCount}
                        readOnly
                        style={{ background: "transparent", color: "white" }}
                      />
                      <button
                        onClick={() => [
                          quantityCount < productStock - productCartQty
                            ? handleQuantityChange(quantityCount + 1)
                            : "",
                        ]}
                        className="qtybutton"
                        style={{ color: "white" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                {/* </Link> */}
              </div>
            </Col>
            <Col lg={6}>
              <div className="image-cta-two__image d-flex featured--image">
                <img
                  src={
                    "/assets/images/cta/cabinet2.webp"
                    // featuredProduct?.success
                    //   ? featuredProduct?.data?.[0]?.image[0]
                    //   : process.env.PUBLIC_URL +
                    //     "/assets/images/cta/cabinet2.webp"
                  }
                  alt=""
                />
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
      <div>
        <Container>
          <p className="bottom-home-title">Certified Climate Action</p>
          <div className="images-bottom-horizantal">
            {imageData.map((theimg) => {
              console.log(theimg)
              return <div className="each-image-dist">
                <img src={theimg} alt="standards" width="150" />
              </div>
            })}
          </div>
        </Container>
      </div>
    </>
  );
};

export default ImageCtaTwo;
