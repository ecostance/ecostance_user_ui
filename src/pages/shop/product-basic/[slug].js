import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { LayoutTwo } from "../../../components/Layout";
import { getDiscountPrice } from "../../../lib/product";
import { BreadcrumbOne } from "../../../components/Breadcrumb";
import {
  getProducts,
  getProductBySlug,
  getProductReview,
} from "../../../apiClient/product";
import {
  ImageGalleryBottomThumb,
  ProductDescription,
  ProductDescriptionTab,
} from "../../../components/ProductDetails";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
  updateLocalCartCount,
} from "../../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist,
} from "../../../redux/actions/wishlistActions";
import {
  addToCompare,
  deleteFromCompare,
} from "../../../redux/actions/compareActions";
import router from "next/router";
import regionPrice from "src/helpers/regionPrice";
import ShowPopup from "src/components/showPopup";

const ProductBasic = ({
  product,
  cartItems,
  wishlistItems,
  compareItems,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare,
  userData,
  deleteFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateLocalCartCount,
}) => {
  useEffect(() => {
    const { pid } = router.query;
    document.querySelector("body").classList.remove("overflow-hidden");
  }, []);

  const [showComparePopup, setShowComparePopup] = useState(false);

  const [productReviews, setProductReviews] = useState([]);

  const setProductReview = async () => {
    try {
      const res = await getProductReview(product._id);

      if (res.status === 200) {
        // setProductReviews(res?.data?.data);
        setProductReviews(res?.data?.data);
      }
    } catch (err) {
      console.log("error while fetching reviews");
    }
  };

  useEffect(() => {
    setProductReview().catch((err) => console.log(err));
  }, [product]);

  const { addToast } = useToasts();

  const regionPricing = regionPrice(product, userData);

  const productPrice = regionPricing.productPrice;
  const currencySymbol = regionPricing.currencySymbol;
  const oldPrice = regionPricing.oldPrice;
  const currencyCode = regionPricing.currencyCode;
  const discount = product?.discount;

  const discountedPrice = regionPricing.productPrice;

  const cartItem = cartItems?.products?.filter(
    (cartItem) => cartItem?.cartItemId === product?._id
  )[0];
  const wishlistItem = wishlistItems.filter(
    (wishlistItem) => wishlistItem.id === product.id
  )[0];
  const compareItem = compareItems.filter(
    (compareItem) => compareItem.id === product.id
  )[0];

  return (
    <ShowPopup
      showComparePopup={showComparePopup}
      setShowComparePopup={setShowComparePopup}
    >
      <LayoutTwo>
        {/* breadcrumb */}
        <BreadcrumbOne
          pageTitle={product.name}
          // backgroundImage={'/assets/images/backgrounds/breadcrumb-bg-3.png'}
          className="bg--3"
        >
          <ul className="breadcrumb__list">
            <li>
              <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a>Shop</a>
              </Link>
            </li>
            <li>{product.name}</li>
          </ul>
        </BreadcrumbOne>

        {/* product details */}
        <div className="product-details space-mt--r100 space-mb--r100">
          <Container>
            <Row>
              <Col lg={6} className="space-mb-mobile-only--50">
                {/* image gallery bottom thumb */}
                <ImageGalleryBottomThumb
                  product={product}
                  oldPrice={oldPrice}
                  discountedPrice={discountedPrice}
                  wishlistItem={wishlistItem}
                  addToast={addToast}
                  wishlistItems={wishlistItems}
                  addToWishlist={addToWishlist}
                  deleteFromWishlist={deleteFromWishlist}
                />
              </Col>

              <Col lg={6}>
                {/* product description */}
                <ProductDescription
                  setShowComparePopup={setShowComparePopup}
                  discount={discount}
                  currencySymbol={currencySymbol}
                  currencyCode={currencyCode}
                  wishlistItems={wishlistItems}
                  product={product}
                  productPrice={productPrice}
                  oldPrice={oldPrice}
                  discountedPrice={discountedPrice}
                  cartItems={cartItems}
                  cartItem={cartItem}
                  wishlistItem={wishlistItem}
                  compareItem={compareItem}
                  addToast={addToast}
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                  deleteFromWishlist={deleteFromWishlist}
                  addToCompare={addToCompare}
                  deleteFromCompare={deleteFromCompare}
                  deleteFromCart={deleteFromCart}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  userData={userData}
                  updateLocalCartCount={updateLocalCartCount}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                {/* product description tab */}
                <ProductDescriptionTab
                  product={product}
                  productReviews={productReviews}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </LayoutTwo>
    </ShowPopup>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData,
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize,
      cartItems
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize,
          cartItems
        )
      );
    },
    addToWishlist: (item, addToast, wishlistItems) => {
      dispatch(addToWishlist(item, addToast, wishlistItems));
    },
    deleteFromWishlist: (item, addToast, wishlistItems) => {
      dispatch(deleteFromWishlist(item, addToast, wishlistItems));
    },
    deleteFromCart: (item, addToast, cartItems) => {
      dispatch(deleteFromCart(item, addToast, cartItems));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
    increaseQuantity: (
      item,
      addToast,
      quantityCount,
      cartItems,
      wholeItem,
      loggedIn
    ) => {
      dispatch(
        increaseQuantity(
          item,
          addToast,
          quantityCount,
          (cartItems = cartItems),
          wholeItem,
          loggedIn
        )
      );
    },
    decreaseQuantity: (
      item,
      addToast,
      cartItems,
      specifyQuantity,
      quantity,
      wholeItem,
      loggedIn
    ) => {
      dispatch(
        decreaseQuantity(
          item,
          addToast,
          cartItems,
          specifyQuantity,
          quantity,
          wholeItem,
          loggedIn
        )
      );
    },
    deleteFromCompare: (item, addToast) => {
      dispatch(deleteFromCompare(item, addToast));
    },
    updateLocalCartCount: (count) => {
      dispatch(updateLocalCartCount(count));
    },
  };
};

// export default ProductBasic;
export default connect(mapStateToProps, mapDispatchToProps)(ProductBasic);

export async function getStaticPaths() {
  // get the paths we want to pre render based on products
  const products = (await getProducts()).data;
  const paths = products
    ?.map((product) => {
      if (product.slug) {
        return {
          params: { slug: product.slug },
        };
      }
    })
    .filter((path) => path !== undefined);
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // get product data based on slug
  // const res = await getProductBySlug(params.slug);
  return { props: { product: (await getProductBySlug(params.slug)).data } };
}
