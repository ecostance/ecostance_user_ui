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
    setQuantityChangeLoading(false);
  }, [cartItems?.products]);

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
    <div
      style={{ background: "#F4F4F4", padding: "50px 0px" }}
      className={`image-cta-two ${spaceBottomClass ? spaceBottomClass : ""}`}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="image-cta-two__content space-mb-mobile-only--40">
              <h3 className="subtitle space-mb--30">INTRO VIDEO</h3>
              <h2 className="title1 space-mb--30">
                {/* {featuredProduct?.success
                  ? featuredProduct?.data?.[0]?.name
                  : "Montana Shelf Collection"} */}
                What is Climate Change?
              </h2>
              <p className="text space-mb--30">
                Climate change refers to long term shifts in temperature and
                alteration of the earth’s weather patterns. It’s driven by a
                variety of factors but the primary cause is the increase in
                carbon dioxide and other greenhouse gases in the atmosphere due
                to human activities.
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <div className="image-cta-two__image d-flex featured--image">
              {/* <img
                src={
                  "/assets/images/cta/cabinet2.webp"
                  // featuredProduct?.success
                  //   ? featuredProduct?.data?.[0]?.image[0]
                  //   : process.env.PUBLIC_URL +
                  //     "/assets/images/cta/cabinet2.webp"
                }
                alt=""
              /> */}
              <div
                className="img-fluid"
                style={{
                  border: "5px solid white",
                  width: "35rem",
                  height: "19.6rem",
                  // boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/qzmeul4nW7E?si=epeQ_IRL_qhQVUtT&rel=0&loop=1"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
                {/* <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/oNDBkvqKiHo?si=J5BnqxjJ6sYNZpip&rel=0&loop=1"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe> */}
              </div>
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

export default ImageCtaTwo;
