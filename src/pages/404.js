import { Fragment } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { HeaderTwo } from "../components/Header";

const NotFound = () => {
  return (
    <Fragment>
      {/* <HeaderTwo /> */}
      <div
        className="nothing-found-area bg-404"
        style={{
          backgroundImage: `url(${
            process.env.PUBLIC_URL + "/assets/images/backgrounds/404-bg.jpg"
          })`,
        }}
      >
        <Container>
          <Row>
            <Col lg={6}>
              <div className="nothing-found-content">
                <h1>Oops!</h1>
                <h1 className="space-mb--50">Page not found!</h1>
                <p className="direction-page">
                  PLEASE GO BACK TO{" "}
                  <Link href="/" as={process.env.PUBLIC_URL + "/"}>
                    <a>homepage</a>
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default NotFound;

// // import { Fragment } from "react";
// // import Link from "next/link";
// // import { Container, Row, Col } from "react-bootstrap";
// // import { HeaderTwo } from "../components/Header";

// // const NotFound = () => {
// //   return (
// //     <Fragment>
// //       {/* <HeaderTwo /> */}
// //       <div
// //         className="nothing-found-area bg-404"
// //         style={{
// //           backgroundImage: `url(${
// //             process.env.PUBLIC_URL + "/assets/images/backgrounds/404-bg.jpg"
// //           })`,
// //         }}
// //       >
// //         <Container>
// //           <Row>
// //             <Col lg={6}>
// //               <div className="nothing-found-content">
// //                 <h1>Oops!</h1>
// //                 <h1 className="space-mb--50">Page not found!</h1>
// //                 <p className="direction-page">
// //                   PLEASE GO BACK TO{" "}
// //                   <Link href="/" as={process.env.PUBLIC_URL + "/"}>
// //                     <a>homepage</a>
// //                   </Link>
// //                 </p>
// //               </div>
// //             </Col>
// //           </Row>
// //         </Container>
// //       </div>
// //     </Fragment>
// //   );
// // };

// // export default NotFound;

// import { connect } from "react-redux";
// import Link from "next/link";
// import { Container, Row, Col } from "react-bootstrap";
// import { CountdownTimerFour } from "../components/Countdown";
// import { LayoutTwo } from "../components/Layout";
// import { HeroSliderFive } from "../components/HeroSlider";
// import { SectionTitleOne } from "../components/SectionTitle";
// import { ProductGridWrapper } from "../components/ProductThumb";
// import { TestimonialOne } from "../components/Testimonial";
// import { ImageCtaTwo, ImageCtaThree, ImageCtaFour } from "../components/Cta";
// import { HoverBannerOne } from "../components/Banner";
// import ShowPopup from "../components/showPopup";
// import heroSliderData from "../data/hero-sliders/hero-slider-five.json";
// import testimonialOneData from "../data/testimonials/testimonial-one.json";
// import SignupConnect from "../components/signupconnectpopup";
// import { useCallback, useState } from "react";
// import { useEffect } from "react";
// import {
//   validateUser,
//   setIsVerifyPopupShown,
// } from "src/redux/actions/userAction";
// import { useRouter } from "next/router";
// import { useToasts } from "react-toast-notifications";
// import { getCookie, setCookie } from "cookies-next";
// import {
//   checkEmailVerificationStatus,
//   resendVerificationOTP,
// } from "src/apiClient/auth";
// import {
//   getFeaturedProduct,
//   getOfferedProduct,
//   getProducts,
// } from "src/apiClient/product";
// import { _newDebounce } from "src/helpers/debounce";
// import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
// import { updateCartBulk } from "src/helpers/updateCartBulk";

// import {
//   addAPIDataToCart,
//   // addBulkItemsToCart,
//   addToCart,
//   decreaseQuantity,
//   deleteFromCart,
//   increaseQuantity,
//   updateLocalCartCount,
// } from "../redux/actions/cartActions";
// import CartOverlay from "src/components/Header/elements/CartOverlay";
// <script
//   type="text/javascript"
//   src="https://cdn.ywxi.net/js/1.js"
//   async
// ></script>;

// const Furniture = ({
//   products,
//   userData,
//   validateUser,
//   compareData,
//   setIsVerifyPopupShown,
//   featuredProductData,
//   offeredProductData,
//   popularProducts,
//   cartItems,
//   addToCart,
//   addAPIDataToCart,
//   increaseQuantity,
//   decreaseQuantity,
//   deleteFromCart,
// }) => {
//   const { addToast } = useToasts();
//   const [allProductsAddedToCart, setAllProductsAddedToCart] = useState([]);
//   const [isVerifyEmailSent, setIsVerifyEmailSent] = useState(false);
//   const [showNewUserPopup, setShowNewUserPopup] = useState(false);
//   const [showComparePopup, setShowComparePopup] = useState(false);
//   const [showVerifyPopup, setShowVerifyPopup] = useState(false);
//   const { setDebounce, removeDebounce } = _newDebounce();
//   const [offCanvasCartActive, setOffCanvasCartActive] = useState(false);
//   const router = useRouter();

//   const saveCartItems = useCallback(
//     setDebounce(async (updateCartToRedux, localAllProducts) => {
//       updateCartToRedux(localAllProducts);
//     }, 700),
//     []
//   );

//   useEffect(() => {
//     setAllProductsAddedToCart(cartItems?.products);
//   }, [cartItems?.products]);

//   useEffect(() => {
//     if (
//       router?.query?.loggedIn === "true" ||
//       getCookie("subscribe_popup_shown")
//     ) {
//       return;
//     }
//     if (!userData.isLoggedIn && !getCookie("subscribe_popup_shown")) {
//       setShowNewUserPopup(true);
//       setCookie("subscribe_popup_shown", true, { maxAge: 172800 });
//     }
//   }, []);

//   const addItemToCart = (item) => {
//     updateCartBulk({
//       item,
//       allProductsAddedToCart,
//       setAllProductsAddedToCart,
//       addAPIDataToCart,
//       saveCartItems,
//       cartItems,
//       addToast,
//     });
//   };

//   // useEffect(() => {
//   //   if (cartItems?.localCartCount === 1) {
//   //     setOffCanvasCartActive(true);
//   //   }
//   // }, [cartItems]);

//   useEffect(() => {
//     if (userData.isLoggedIn && router?.query?.loggedIn === "true") {
//       if (
//         userData?.user?.emailVerificationStatus === "UNVERIFIED" &&
//         !userData.isVerifyPopupShown
//       ) {
//         setShowVerifyPopup(true);
//         setIsVerifyPopupShown(true);
//         if (router?.query?.register === "success")
//           return setIsVerifyEmailSent(true);
//         reSendRegistrationMail();
//       }
//     }
//   }, [userData.isLoggedIn]);

//   const reSendRegistrationMail = async () => {
//     try {
//       setIsVerifyEmailSent(false);
//       const res = await resendVerificationOTP(userData?.user?.email);
//       if (res?.status === 200) {
//         setIsVerifyEmailSent(true);
//         addToast(
//           `A six-digit code has been sent to ${userData?.user?.email}. It will expire within 5 minutes.`,
//           {
//             appearance: "success",
//             autoDismiss: true,
//           }
//         );
//       } else {
//         addToast(res?.data?.message, {
//           appearance: "error",
//           autoDismiss: true,
//         });
//       }
//     } catch (error) {
//       addToast(error?.message, {
//         appearance: "error",
//         autoDismiss: true,
//       });
//     }
//   };

//   const handleProductNav = (navType) => {};

//   return (
//     <ShowPopup
//       setShowComparePopup={setShowComparePopup}
//       showComparePopup={showComparePopup}
//       setShowNewUserPopup={setShowNewUserPopup}
//       showNewUserPopup={showNewUserPopup}
//       compareData={compareData}
//       isVerifyEmailSent={isVerifyEmailSent}
//       setIsVerifyEmailSent={setIsVerifyEmailSent}
//       showVerifyPopup={showVerifyPopup}
//       setShowVerifyPopup={setShowVerifyPopup}
//       email={userData?.user?.email}
//       reSendRegistrationMail={reSendRegistrationMail}
//     >
//       <>
//         <LayoutTwo
//           setDebounce={setDebounce}
//           removeDebounce={removeDebounce}
//           aboutOverlay={false}
//         >
//           {/* hero slider */}
//           <HeroSliderFive
//             sliderData={heroSliderData}
//             spaceBottomClass="space-mb--50"
//           />

//           {/* hover banner */}
//           <HoverBannerOne spaceBottomClass="space-mb--r100" />

//           {/* product grid */}
//           <div className="section-title-container">
//             <Container>
//               <Row>
//                 <div className="col-lg-12">
//                   <SectionTitleOne title="Certified projects for purchase" />
//                 </div>
//               </Row>
//             </Container>
//           </div>

//           <div className="product-grid-container space-mb--r100">
//             <Container>
//               <Row className="space-mb--rm50">
//                 {/* <div>{JSON.stringify(products)}</div> */}
//                 <ProductGridWrapper
//                   setShowComparePopup={setShowComparePopup}
//                   products={popularProducts}
//                   userData={userData}
//                   bottomSpace="space-mb--r50"
//                   column={4}
//                   setDebounce={setDebounce}
//                   removeDebounce={removeDebounce}
//                 />
//               </Row>
//             </Container>
//           </div>

//           <div
//             style={{
//               marginTop: "-100px",
//               marginBottom: "40px",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <span style={{ paddingRight: "10px", textTransform: "uppercase" }}>
//               <Link href="/shop/left-sidebar">More</Link>
//             </span>
//             <Link href="/shop/left-sidebar">
//               <BsArrowRight
//                 className="productNavArrow"
//                 // onClick={(e) => handleProductNav("next")}
//               />
//             </Link>
//           </div>

//           {/* countdown timer */}
//           {/* <CountdownTimerFour
//             title="Special Deal"
//             image="/assets/images/countdown/countdown-4.webp"
//             dateTime="July 25, 2023	01:12:00"
//             url="/shop/left-sidebar"
//             buttonText="Only $9.00"
//             userData={userData}
//             backgroundColorClass="bg-color--grey-two"
//             offeredProductData={offeredProductData}
//             addToCart={addToCart}
//             addToast={addToast}
//             // cartItem={cartItem}
//             cartItems={cartItems}
//             addItemToCart={addItemToCart}
//             updateLocalCartCount={updateLocalCartCount}
//             increaseQuantity={increaseQuantity}
//             decreaseQuantity={decreaseQuantity}
//           /> */}

//           <ImageCtaFour
//             featuredProduct={featuredProductData}
//             // spaceBottomClass="space-mb--r100"
//             userData={userData}
//             addToCart={addToCart}
//             addToast={addToast}
//             // cartItem={cartItem}
//             cartItems={cartItems}
//             addItemToCart={addItemToCart}
//             updateLocalCartCount={updateLocalCartCount}
//             increaseQuantity={increaseQuantity}
//             decreaseQuantity={decreaseQuantity}
//           />
//           {/* testimonial */}
//           <TestimonialOne
//             testimonialData={testimonialOneData}
//             spaceBottomClass="space-mb--r100"
//           />

//           {/* image cta */}
//           <ImageCtaTwo
//             featuredProduct={featuredProductData}
//             spaceBottomClass="space-mb--r100"
//             userData={userData}
//             addToCart={addToCart}
//             addToast={addToast}
//             // cartItem={cartItem}
//             cartItems={cartItems}
//             addItemToCart={addItemToCart}
//             updateLocalCartCount={updateLocalCartCount}
//             increaseQuantity={increaseQuantity}
//             decreaseQuantity={decreaseQuantity}
//           />
//         </LayoutTwo>
//       </>
//     </ShowPopup>
//   );
// };

// const mapStateToProps = (state) => {
//   const products = state.productData;
//   //
//   return {
//     products: products,
//     userData: state.userData,
//     compareData: state.compareData,
//     cartItems: state.cartData,
//     wishlistItems: state.wishlistData,
//     compareItems: state.compareData,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     validateUser: () => {
//       dispatch(validateUser());
//     },
//     setIsVerifyPopupShown: (isShown) => {
//       dispatch(setIsVerifyPopupShown(isShown));
//     },
//     addToCart: (
//       item,
//       addToast,
//       quantityCount,
//       selectedProductColor,
//       selectedProductSize,
//       cartItems
//     ) => {
//       dispatch(
//         addToCart(
//           item,
//           addToast,
//           quantityCount,
//           selectedProductColor,
//           selectedProductSize,
//           cartItems
//         )
//       );
//     },
//     addAPIDataToCart: (items) => {
//       dispatch(addAPIDataToCart(items));
//     },
//     updateLocalCartCount: (count) => {
//       dispatch(updateLocalCartCount(count));
//     },
//     increaseQuantity: (
//       item,
//       addToast,
//       quantityCount,
//       cartItems,
//       wholeItem,
//       loggedIn
//     ) => {
//       dispatch(
//         increaseQuantity(
//           item,
//           addToast,
//           quantityCount,
//           (cartItems = cartItems),
//           wholeItem,
//           loggedIn
//         )
//       );
//     },
//     decreaseQuantity: (
//       item,
//       addToast,
//       cartItems,
//       specifyQuantity,
//       quantity,
//       wholeItem,
//       loggedIn
//     ) => {
//       dispatch(
//         decreaseQuantity(
//           item,
//           addToast,
//           cartItems,
//           specifyQuantity,
//           quantity,
//           wholeItem,
//           loggedIn
//         )
//       );
//     },
//   };
// };

// const returnFormattedData = (data) => {
//   if (data?.data?.success == true && data?.data?.data.length > 0) {
//     return { ...data?.data };
//   } else {
//     return { success: false };
//   }
// };

// export async function getStaticProps() {
//   const paginateFields = "page=1&size=8&shouldPaginate=1";
//   const popularProducts = await getProducts(paginateFields);
//   const featuredProduct = await getFeaturedProduct();
//   const offeredProduct = await getOfferedProduct();
//   const featuredProductData = returnFormattedData(featuredProduct);
//   const offeredProductData = returnFormattedData(offeredProduct);
//   return {
//     props: {
//       featuredProductData,
//       offeredProductData,
//       popularProducts: popularProducts?.data || [],
//     },
//   };
// }
// export default connect(mapStateToProps, mapDispatchToProps)(Furniture);
