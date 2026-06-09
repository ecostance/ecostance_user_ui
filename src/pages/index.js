import { connect } from "react-redux";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { CountdownTimerFour } from "../components/Countdown";
import { LayoutTwo } from "../components/Layout";
import { HeroSliderFive } from "../components/HeroSlider";
import { SectionTitleOne } from "../components/SectionTitle";
import { ProductGridWrapper } from "../components/ProductThumb";
import { TestimonialOne } from "../components/Testimonial";
import { ImageCtaTwo, ImageCtaThree } from "../components/Cta";
import { HoverBannerOne } from "../components/Banner";
import ShowPopup from "../components/showPopup";
import heroSliderData from "../data/hero-sliders/hero-slider-five.json";
import testimonialOneData from "../data/testimonials/testimonial-one.json";
import SignupConnect from "../components/signupconnectpopup";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import {
  validateUser,
  setIsVerifyPopupShown,
  markEmailAsVerified,
} from "src/redux/actions/userAction";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import { getCookie, setCookie } from "cookies-next";
import {
  checkEmailVerificationStatus,
  resendVerificationOTP,
} from "src/apiClient/auth";
import {
  getFeaturedProduct,
  getOfferedProduct,
  getProducts,
} from "src/apiClient/product";
import { _newDebounce } from "src/helpers/debounce";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { updateCartBulk } from "src/helpers/updateCartBulk";
import hoverBannerImageOne from "src/assets/images/hover/hover-banner-image1.webp";
import hoverBannerImageTwo from "src/assets/images/hover/hover-banner-image2.webp";
import hoverBannerImageThree from "src/assets/images/hover/hover-banner-image3.webp";

import {
  addAPIDataToCart,
  // addBulkItemsToCart,
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
  updateLocalCartCount,
} from "../redux/actions/cartActions";
import CartOverlay from "src/components/Header/elements/CartOverlay";
import axios from "axios";
<script
  type="text/javascript"
  src="https://cdn.ywxi.net/js/1.js"
  async
></script>;

const Furniture = ({
  products,
  userData,
  validateUser,
  compareData,
  setIsVerifyPopupShown,
  markEmailAsVerified,
  featuredProductData,
  offeredProductData,
  popularProducts,
  cartItems,
  addToCart,
  addAPIDataToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
}) => {
  const { addToast } = useToasts();
  const [allProductsAddedToCart, setAllProductsAddedToCart] = useState([]);
  const [isVerifyEmailSent, setIsVerifyEmailSent] = useState(false);
  const [showNewUserPopup, setShowNewUserPopup] = useState(false);
  const [showComparePopup, setShowComparePopup] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const { setDebounce, removeDebounce } = _newDebounce();
  const [offCanvasCartActive, setOffCanvasCartActive] = useState(false);
  const router = useRouter();

  const saveCartItems = useCallback(
    setDebounce(async (updateCartToRedux, localAllProducts) => {
      updateCartToRedux(localAllProducts);
    }, 700),
    []
  );

  let userId = localStorage.getItem("userId");

  useEffect(() => {
    if (localStorage.getItem('showVerifyLogoutToast')) {
      localStorage.removeItem('showVerifyLogoutToast')
      addToast('Please verify your email to complete registration and login', {
        appearance: 'info',
        autoDismiss: true,
      })
    }
    console.log("dede");
    if (window.location.href.includes("refId")) {
      localStorage.setItem(
        "ReferralID",
        window.location.href.split("refId=")[1]
      );
      // deeplinkapi()
    }

    // if (localStorage.getItem("JoinBusinessCode")) {
    //   router.push('/other/my-employer-account');
    // }

    if (window.location.href.includes("businessCode")) {
      localStorage.setItem(
        "JoinBusinessCode",
        window.location.href.split("businessCode=")[1]
      );
      router.push("/other/my-employer-account");
    }

    if (window.location.href.includes("supplierCode")) {
      //https://dev1.ebcopen.com/?supplierCode=TUR2UDHPXA&rid=68c941e41866010b8792eb3c
      // Extract supplierCode and rid from the URL and save to localStorage
      const url = window.location.href;
      const supplierCodeMatch = url.match(/supplierCode=([^&]+)/);
      const ridMatch = url.match(/rid=([^&]+)/);

      if (supplierCodeMatch && supplierCodeMatch[1]) {
        localStorage.setItem("JoinSupplierCode", supplierCodeMatch[1]);
      }
      if (ridMatch && ridMatch[1]) {
        localStorage.setItem("RID", ridMatch[1]);
      }
      
      router.push("/other/my-business-account");
    }

   

    if (window.location.href.includes("distributorCode")) {
      //https://dev1.ebcopen.com/?distributorCode=TUR2UDHPXA&rid=68c941e41866010b8792eb3c
      // Extract distributorCode and rid from the URL and save to localStorage
      const url = window.location.href;
      const distributorCodeMatch = url.match(/distributorCode=([^&]+)/);
      const ridMatch = url.match(/rid=([^&]+)/);

      if (distributorCodeMatch && distributorCodeMatch[1]) {
        localStorage.setItem("JoinDistributorCode", distributorCodeMatch[1]);
      }
      if (ridMatch && ridMatch[1]) {
        localStorage.setItem("RID", ridMatch[1]);
      }
      
      router.push("/other/my-business-account");
    }

    if (window.location.href.includes("conferenceCode")) {
      localStorage.setItem(
        "conferenceCode",
        window.location.href.split("conferenceCode=")[1]
      );
      router.push("/other/conference-carbon-offset");
    }

  
  }, [userId]);

  // let deeplinkapi = async()=>{
  //   let deeplinkdata = await axios.get("/auth/referral/deeplink")
  //   console.log("deeplink",deeplinkdata)
  // }

  useEffect(() => {
    setAllProductsAddedToCart(cartItems?.products);
  }, [cartItems?.products]);

  const hoverBannerOneList = [
    {
      id: 1,
      title: "Carbon",
      subTitle: "Footprint",
      linkTitle: "calculate",
      link: "/other/carbon-offset",
      imgUrl: hoverBannerImageOne,
    },
    {
      id: 2,
      title: "Select & Buy",
      subTitle: "Products",
      linkTitle: "shop now",
      link: "/shop/left-sidebar",
      imgUrl: hoverBannerImageTwo,
    },
    {
      id: 3,
      title: "EcoStance",
      subTitle: "Page",
      linkTitle: "publish",
      link: "/other/my-account?sustainability=true",
      imgUrl: hoverBannerImageThree,
    },
  ];

  useEffect(() => {
    if (
      router?.query?.loggedIn === "true" ||
      getCookie("subscribe_popup_shown")
    ) {
      return;
    }
    if (!userData.isLoggedIn && !getCookie("subscribe_popup_shown")) {
      setShowNewUserPopup(true);
      setCookie("subscribe_popup_shown", true, { maxAge: 172800 });
    }
  }, []);

  const addItemToCart = (item) => {
    updateCartBulk({
      item,
      allProductsAddedToCart,
      setAllProductsAddedToCart,
      addAPIDataToCart,
      saveCartItems,
      cartItems,
      addToast,
    });
  };

  // useEffect(() => {
  //   if (cartItems?.localCartCount === 1) {
  //     setOffCanvasCartActive(true);
  //   }
  // }, [cartItems]);

  useEffect(() => {
    if (userData.isLoggedIn && router?.query?.loggedIn === "true") {
      if (userData?.user?.emailVerificationStatus === "UNVERIFIED") {
        setShowVerifyPopup(true);
        if (router?.query?.register === "success")
          return setIsVerifyEmailSent(true);
        reSendRegistrationMail();
      }
    }
  }, [userData.isLoggedIn]);

  const reSendRegistrationMail = async () => {
    try {
      setIsVerifyEmailSent(false);
      const res = await resendVerificationOTP(userData?.user?.email);
      if (res?.status === 200) {
        setIsVerifyEmailSent(true);
        addToast(
          `A six-digit code has been sent to ${userData?.user?.email}. It will expire within 5 minutes.`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
      } else {
        addToast(res?.data?.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      addToast(error?.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const handleProductNav = (navType) => {};

  return (
    <ShowPopup
      setShowComparePopup={setShowComparePopup}
      showComparePopup={showComparePopup}
      setShowNewUserPopup={setShowNewUserPopup}
      showNewUserPopup={showNewUserPopup}
      compareData={compareData}
      isVerifyEmailSent={isVerifyEmailSent}
      setIsVerifyEmailSent={setIsVerifyEmailSent}
      showVerifyPopup={showVerifyPopup}
      setShowVerifyPopup={setShowVerifyPopup}
      email={userData?.user?.email}
      reSendRegistrationMail={reSendRegistrationMail}
      onEmailVerified={markEmailAsVerified}
    >
      <>
        <LayoutTwo
          setDebounce={setDebounce}
          removeDebounce={removeDebounce}
          aboutOverlay={false}
        >
          {/* hero slider */}
          <HeroSliderFive
            sliderData={heroSliderData}
            spaceBottomClass="space-mb--50"
          />

          {/* hover banner */}
          <HoverBannerOne
            spaceBottomClass="space-mb--r100"
            hoverBannerOneList={hoverBannerOneList}
          />

          {/* product grid */}
          <div className="section-title-container">
            <Container>
              <Row>
                <div className="col-lg-12">
                  <SectionTitleOne title="Certified projects for purchase" />
                </div>
              </Row>
            </Container>
          </div>

          <div className="product-grid-container space-mb--r100">
            <Container>
              <Row className="space-mb--rm50">
                {/* <div>{JSON.stringify(products)}</div> */}
                <ProductGridWrapper
                  setShowComparePopup={setShowComparePopup}
                  products={popularProducts}
                  userData={userData}
                  bottomSpace="space-mb--r50"
                  column={4}
                  setDebounce={setDebounce}
                  removeDebounce={removeDebounce}
                />
              </Row>
            </Container>
          </div>

          <div
            style={{
              marginTop: "-100px",
              marginBottom: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ paddingRight: "10px", textTransform: "uppercase" }}>
              <Link href="/shop/left-sidebar">More</Link>
            </span>
            <Link href="/shop/left-sidebar">
              <BsArrowRight
                className="productNavArrow"
                // onClick={(e) => handleProductNav("next")}
              />
            </Link>
          </div>

          {/* countdown timer */}
          {/* <CountdownTimerFour
            title="Special Deal"
            image="/assets/images/countdown/countdown-4.webp"
            dateTime="July 25, 2023	01:12:00"
            url="/shop/left-sidebar"
            buttonText="Only $9.00"
            userData={userData}
            backgroundColorClass="bg-color--grey-two"
            offeredProductData={offeredProductData}
            addToCart={addToCart}
            addToast={addToast}
            // cartItem={cartItem}
            cartItems={cartItems}
            addItemToCart={addItemToCart}
            updateLocalCartCount={updateLocalCartCount}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
          /> */}

          <ImageCtaThree
            featuredProduct={featuredProductData}
            // spaceBottomClass="space-mb--r100"
            userData={userData}
            addToCart={addToCart}
            addToast={addToast}
            // cartItem={cartItem}
            cartItems={cartItems}
            addItemToCart={addItemToCart}
            updateLocalCartCount={updateLocalCartCount}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
          />
          {/* testimonial */}
          <TestimonialOne
            testimonialData={testimonialOneData}
            spaceBottomClass="space-mb--r100"
          />

          {/* image cta */}
          <ImageCtaTwo
            featuredProduct={featuredProductData}
            spaceBottomClass="space-mb--r100"
            userData={userData}
            addToCart={addToCart}
            addToast={addToast}
            deleteFromCart={deleteFromCart}
            // cartItem={cartItem}
            cartItems={cartItems}
            addItemToCart={addItemToCart}
            updateLocalCartCount={updateLocalCartCount}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
          />
        </LayoutTwo>
      </>
    </ShowPopup>
  );
};

const mapStateToProps = (state) => {
  const products = state.productData;
  //
  return {
    products: products,
    userData: state.userData,
    compareData: state.compareData,
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    validateUser: () => {
      dispatch(validateUser());
    },
    setIsVerifyPopupShown: (isShown) => {
      dispatch(setIsVerifyPopupShown(isShown));
    },
    markEmailAsVerified: () => {
      dispatch(markEmailAsVerified());
    },
    deleteFromCart: (item, addToast, cartItems) => {
      dispatch(deleteFromCart(item, addToast, cartItems));
    },
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
    addAPIDataToCart: (items) => {
      dispatch(addAPIDataToCart(items));
    },
    updateLocalCartCount: (count) => {
      dispatch(updateLocalCartCount(count));
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
  };
};

const returnFormattedData = (data) => {
  if (data?.data?.success == true && data?.data?.data.length > 0) {
    return { ...data?.data };
  } else {
    return { success: false };
  }
};

export async function getStaticProps() {
  const paginateFields = "page=1&size=8&shouldPaginate=1";
  const popularProducts = await getProducts(paginateFields);
  const featuredProduct = await getFeaturedProduct();
  const offeredProduct = await getOfferedProduct();
  const featuredProductData = returnFormattedData(featuredProduct);
  const offeredProductData = returnFormattedData(offeredProduct);
  return {
    props: {
      featuredProductData,
      offeredProductData,
      popularProducts: popularProducts?.data || [],
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Furniture);
