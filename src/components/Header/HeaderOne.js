import { useState, useEffect, Fragment } from "react";
import { Container } from "react-bootstrap";
import Link from "next/link";
import { connect } from "react-redux";
import {
  IoIosSearch,
  IoMdPerson,
  IoIosHeartEmpty,
  IoIosCart,
  IoIosMenu,
  IoIosHeart,
  IoIosCheckmark,
} from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";

import Navigation from "./elements/Navigation";
import AboutOverlay from "./elements/AboutOverlay";
import SearchOverlay from "./elements/SearchOverlay";
import CartOverlay from "./elements/CartOverlay";
import WishlistOverlay from "./elements/WishlistOverlay";
import AccountOverlay from "./elements/AccountOverlay";
import MobileMenu from "./elements/MobileMenu";
// import ClearsessionStorageOnClose from "./ClearsessionStorageOnClose"; // Import the new component
import {
  validateUser,
  setIsVerifyPopupShown,
  removeCurrentUser,
} from "src/redux/actions/userAction";
import { getCookie, deleteCookie } from "cookies-next";
import { addOrder } from "src/redux/actions/orderActions";
import { useRouter } from "next/router";
import { deleteAllFromCart } from "src/redux/actions/cartActions";
import { deleteAllFromWishlist } from "src/redux/actions/wishlistActions";
import TrackOverlay from "./elements/TrackOverlay";
import {
  logoutCheckoutCurrencyAction,
  runValidateUserProcessSync,
} from "src/helpers/currencyActionHelper";
import { removeAllItemsFromSustainabilityPage } from "src/redux/actions/sustainabilityActions";
import { removeAllItemsFromBusinessSustainabilityPage } from "src/redux/actions/businessSustainabilityActions";

const HeaderOne = ({
  aboutOverlay,
  cartItems,
  wishlistItems,
  validateUser,
  userData,
  addOrder,
  deleteAllFromCart,
  deleteAllFromWishlist,
  setIsVerifyPopupShown,
  removeAllItemsFromSustainabilityPage,
  removeCurrentUser,
  removeDebounce,
  setDebounce,
}) => {
  const Router = useRouter();
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [offCanvasAboutActive, setOffCanvasAboutActive] = useState(false);
  const [offCanvasSearchActive, setOffCanvasSearchActive] = useState(false);
  const [offCanvasTrackActive, setOffCanvasTrackActive] = useState(false);
  const [offCanvasCartActive, setOffCanvasCartActive] = useState(false);
  const [offCanvasWishlistActive, setOffCanvasWishlistActive] = useState(false);
  const [offCanvasMobileMenuActive, setOffCanvasMobileMenuActive] =
    useState(false);
  const [offCanvasAccountActive, setOffCanvasAccountActive] = useState(false);
  console.log(userData, "userdatttaaa")


  useEffect(() => {
    console.log(Router.pathname, "kjegdkjwgedkjgwkedwk");
    runValidateUserProcessSync();
    const header = document.querySelector("header");
    setHeaderTop(header.offsetTop);
    setHeaderHeight(header.offsetHeight);
    window.addEventListener("scroll", handleScroll);
    scroll > headerTop
      ? (document.body.style.paddingTop = `${headerHeight}px`)
      : (document.body.style.paddingTop = 0);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  const handleTrackWindow = () => {
    setOffCanvasTrackActive(true);
  };

  useEffect(() => {
    const keyToKeep = 'JoinBusinessCode';
    const valueToKeep = localStorage.getItem("JoinBusinessCode");

    const keepSupplyKey = 'JoinSupplierCode';
    const valueSupplyKey = localStorage.getItem("JoinSupplierCode");
  
    const keepDistKey = 'JoinDistributorCode';
    const valueDistKey = localStorage.getItem("JoinDistributorCode");

    const keepRefKey = "ReferralID";
    const valueRefKey = localStorage.getItem("ReferralID");

    const keepConfKey = "conferenceCode";
    const valueConfKey = localStorage.getItem("conferenceCode");

    const keepRIDKey = 'RID';
    const valueRIDKey = localStorage.getItem("RID");

    if (!localStorage.getItem("email")) {
      deleteCookie("JWTToken");
      deleteCookie("checkout");
      deleteCookie("stripeSession");
      deleteCookie("userSlug", {
        domain: `${process.env.COOKIE_URL}`,
      });
      localStorage.clear();
      if (valueToKeep !== null) {
        localStorage.setItem(keyToKeep, valueToKeep);
      }
      if (valueRefKey !== null) {
        localStorage.setItem(keepRefKey, valueRefKey);
      }
      if (valueConfKey !== null) {
        localStorage.setItem(keepConfKey, valueConfKey);
      }
      if (valueSupplyKey !== null) {
        localStorage.setItem(keepSupplyKey, valueSupplyKey);
      }
      if (valueDistKey !== null) {
        localStorage.setItem(keepDistKey, valueDistKey);
      }
      if (valueRIDKey !== null) {
        localStorage.setItem(keepRIDKey, valueRIDKey);
      }
      removeAllItemsFromSustainabilityPage();
      removeAllItemsFromBusinessSustainabilityPage();
      logoutCheckoutCurrencyAction();
      setIsVerifyPopupShown(false);
      removeCurrentUser();
      addOrder(false, {});
      deleteAllFromWishlist();
    }
  }, []);

  const handleLogout = () => {

    // Clearing cookies
    deleteCookie("JWTToken");
    deleteCookie("checkout");
    deleteCookie("stripeSession");
    deleteCookie("userSlug", {
      domain: `${process.env.COOKIE_URL}`,
    });
    localStorage.removeItem("TotalOrders")
    localStorage.removeItem("userId")
    localStorage.removeItem("businessCode")
    localStorage.removeItem("businessId")
    localStorage.removeItem("JoinBusinessCode")
    localStorage.removeItem("email")
    localStorage.removeItem("JoinedBusinessDetails")
    localStorage.removeItem("MyBusinessDetails")
    localStorage.removeItem("BusinessOrderSelection")
    localStorage.removeItem("JoinedBusinessDetails")
    localStorage.removeItem("name")
    localStorage.removeItem("conferenceCode")
    localStorage.removeItem("lowestProduct")
    localStorage.removeItem("userEventId")
    localStorage.removeItem("userCreated")
    localStorage.removeItem("eventOwnerOrder")
    localStorage.clear();


    removeAllItemsFromSustainabilityPage();
    logoutCheckoutCurrencyAction();
    setIsVerifyPopupShown(false);
    removeCurrentUser();
    addOrder(false, {});
    deleteAllFromWishlist();

    console.log('Redirecting to login page');
    Router.push(process.env.PUBLIC_URL + "/login-register");
  };

  return (
    <Fragment>
      <header
        className={`topbar-shadow ${scroll > headerTop ? "is-sticky" : ""}`}
      >
        <Container className="wide main-header">
          <div className="header-content d-flex align-items-center justify-content-between position-relative space-py-mobile-only--30">
            {/* logo */}
            <div className="header-content__logo d-flex align-items-center space-pr--15">
              <button
                onClick={() => {
                  setOffCanvasAboutActive(true);
                  document
                    .querySelector("body")
                    .classList.add("overflow-hidden");
                }}
                className={`${aboutOverlay === false
                  ? "d-none"
                  : "about-overlay-trigger d-none d-lg-block"
                  }`}
              >
                <IoIosMenu />
              </button>
              <div>
                <Link href={process.env.PUBLIC_URL + "/"}>
                  <a>
                    <img
                      src={
                        process.env.PUBLIC_URL + "/assets/images/logo_big2.png"
                      }
                      className="img-fluid logo-img img-display"
                      // style={{ width: "13.95vw" }}
                      alt=""
                    />
                  </a>
                </Link>
              </div>
            </div>

            {/* navigation */}
            <Navigation handleTrackWindow={handleTrackWindow} userData={userData} />
            {/* icons */}
            <div className="header-content__icons space-pl--15">
              <ul className="d-none d-xl-block">
                {userData.isLoggedIn &&
                  Router.pathname !== "/other/change-password" ? (
                  <li className="my--account--header">
                    <span
                      className="circle-icon--header"
                      style={{ fontWeight: "bold" }}
                    >
                      <IoIosCheckmark />
                    </span>
                    <button
                      onClick={() => {
                        setOffCanvasAccountActive(true);
                        document.querySelector("body");
                      }}
                    >
                      <p
                        className="header_my_account"
                        style={{
                          color: "#333333",
                          fontSize: "14px",
                          fontWeight: "500",
                          letterSpacing: ".01em",
                          textTransform: "uppercase",
                          borderBottom: "1px solid #ccc",
                          paddingBottom: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Account
                      </p>
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/login-register"
                      as={process.env.PUBLIC_URL + "/login-register"}
                    >
                      <p
                        className="header_login"
                        style={{
                          color: "#333333",
                          fontSize: "14px",
                          fontWeight: "500",
                          letterSpacing: ".01em",
                          borderBottom: "1px solid #ccc",
                          paddingBottom: "6px",
                          cursor: "pointer",
                        }}
                      >
                        LOG IN
                      </p>
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      setOffCanvasSearchActive(true);
                      document
                        .querySelector("body")
                        .classList.add("overflow-hidden");
                    }}
                  >
                    <IoIosSearch />
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => {
                      setOffCanvasWishlistActive(true);
                      document
                        .querySelector("body")
                        .classList.add("overflow-hidden");
                    }}
                  >
                    {wishlistItems.length >= 1 ? (
                      <>
                        <IoIosHeart />
                        <span className="count" style={{ fontWeight: "bold" }}>
                          {wishlistItems.length ? wishlistItems.length : ""}
                        </span>
                      </>
                    ) : (
                      <>
                        <IoIosHeartEmpty />
                      </>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOffCanvasCartActive(true);
                    }}
                  >
                    {cartItems?.localCartCount >= 1 ? (
                      <>
                        <IoIosCart />
                        <span className="count" style={{ fontWeight: "bold" }}>
                          {cartItems?.localCartCount
                            ? cartItems?.localCartCount
                            : ""}
                        </span>
                      </>
                    ) : (
                      <AiOutlineShoppingCart />
                    )}
                  </button>
                </li>
              </ul>

              <ul className="d-block d-xl-none" style={{ minWidth: "89px" }}>
                <li>
                  <Link
                    href="/other/wishlist"
                    as={process.env.PUBLIC_URL + "/other/wishlist"}
                  >
                    <a>
                      <IoIosHeartEmpty />
                      {wishlistItems.length >= 1 ? (
                        <span className="count" style={{ fontWeight: "bold" }}>
                          {wishlistItems.length ? wishlistItems.length : ""}
                        </span>
                      ) : (
                        ""
                      )}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/other/cart"
                    as={process.env.PUBLIC_URL + "/other/cart"}
                  >
                    <a>
                      {cartItems?.localCartCount >= 1 ? (
                        <>
                          <IoIosCart />
                          <span
                            className="count"
                            style={{ fontWeight: "bold" }}
                          >
                            {cartItems?.localCartCount
                              ? cartItems?.localCartCount
                              : ""}
                          </span>
                        </>
                      ) : (
                        <AiOutlineShoppingCart />
                      )}
                    </a>
                  </Link>
                </li>
                <li>
                  <button onClick={() => setOffCanvasMobileMenuActive(true)}>
                    <IoIosMenu />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </header>

      {/* about overlay */}
      {aboutOverlay === false ? (
        ""
      ) : (
        <AboutOverlay
          activeStatus={offCanvasAboutActive}
          getActiveStatus={setOffCanvasAboutActive}
        />
      )}
      {/* search overlay */}
      <SearchOverlay
        placeholder={"Search Products..."}
        activeStatus={offCanvasSearchActive}
        getActiveStatus={setOffCanvasSearchActive}
      />
      <TrackOverlay
        placeholder={"Document or Certificate..."}
        activeStatus={offCanvasTrackActive}
        getActiveStatus={setOffCanvasTrackActive}
      />
      {/* cart overlay */}
      <CartOverlay
        activeStatus={offCanvasCartActive}
        getActiveStatus={setOffCanvasCartActive}
        totalItemsInCart={cartItems?.localCartCount}
      />

      {/* wishlist overlay */}
      <WishlistOverlay
        activeStatus={offCanvasWishlistActive}
        getActiveStatus={setOffCanvasWishlistActive}
      />
      {/* Mobile Menu */}
      <MobileMenu
        activeStatus={offCanvasMobileMenuActive}
        getActiveStatus={setOffCanvasMobileMenuActive}
        handleLogout={handleLogout}
        loggedInUserInfo={userData}
        userData={userData}
      />
      <AccountOverlay
        activeStatus={offCanvasAccountActive}
        getActiveStatus={setOffCanvasAccountActive}
        loggedInUserInfo={userData.user}
        // loggedInUserSlugInfo={userData.slug}
        handleLogout={handleLogout}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    validateUser: () => {
      dispatch(validateUser());
    },
    removeAllItemsFromSustainabilityPage: () => {
      dispatch(removeAllItemsFromSustainabilityPage());
    },
    addOrder: (isOrder, item) => {
      dispatch(addOrder(isOrder, item));
    },

    deleteAllFromCart: (addToast) => {
      dispatch(deleteAllFromCart());
    },
    deleteAllFromWishlist: (addToast) => {
      dispatch(deleteAllFromWishlist());
    },
    setIsVerifyPopupShown: (isShown) => {
      dispatch(setIsVerifyPopupShown(isShown));
    },
    removeCurrentUser: () => {
      dispatch(removeCurrentUser());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderOne);
