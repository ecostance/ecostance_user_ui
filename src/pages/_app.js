import { Fragment, useState, useEffect } from "react";
import App from "next/app";
import Head from "next/head";
import withReduxStore from "../lib/with-redux-store";
import { Provider } from "react-redux";
import { ToastProvider } from "react-toast-notifications";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import fetchProducts from "../redux/actions/productActions";
import React from "react";
// import products from "../data/products.json";
import "../assets/scss/styles.scss";
import Preloader from "../components/Preloader";
import { getProducts, getdeeplink } from "../apiClient/product";
import "../../styles/global.css";
import "react-vertical-timeline-component/style.min.css";
import "./../../styles/global.css";
import {
  setUserCurrency,
  validateUser,
  setIsEmailChangeAttemptLeft,
  setUserCurrencyPreference,
  CURRENCY_ADDRESS_COUNTRY_LOW,
  removeCurrentUser,
} from "src/redux/actions/userAction";
import { timeZoneToCurrency } from "src/data/timeZoneToCurrency";
import { getGeoDataFromIP, setCurrency } from "src/apiClient/auth";
import RegistrationSuccessPopup from "src/components/registrationSuccessPopup";

import ShowPopup from "src/components/showPopup";
import { removeRegistationSuccess } from "src/redux/actions/popupActions";
import { getCart } from "src/apiClient/cart";
import {
  addAPIDataToCart,
  deleteAllFromCart,
  setCartCurrency,
} from "src/redux/actions/cartActions";
import { withRouter } from "next/router";
import { addToast, nextInterceptorWrapper } from "src/apiClient/request";
import { getCookie, deleteCookie } from "cookies-next";
import Router from "next/router";
import {
  logoutCheckoutCurrencyAction,
  setUniqueVisitInformation,
} from "src/helpers/currencyActionHelper";
import { removeAllItemsFromSustainabilityPage } from "src/redux/actions/sustainabilityActions";
import { removeAllItemsFromBusinessSustainabilityPage } from "src/redux/actions/businessSustainabilityActions";

const dummyToast = ({ appearance, children }) => (
  <div style={{ background: appearance === "error" ? "black" : "black" }}>
    {children}
  </div>
);

class MyApp extends App {
  constructor(props) {
    super(props);
    this.persistor = persistStore(props.reduxStore);
    const ISSERVER = typeof window === "undefined";
    let theData;
    if (!ISSERVER) {
      if (!localStorage.getItem("email")) {
        deleteCookie("JWTToken");
        deleteCookie("checkout");
        deleteCookie("stripeSession");
        deleteCookie("userSlug", {
          domain: `${process.env.COOKIE_URL}`,
        });
      }
      theData = localStorage.getItem("verifyPass");
      if (window.location.href.includes("refId")) {
        localStorage.setItem(
          "ReferralID",
          window.location.href.split("refId=")[1],
        );
        this.deeplinkapi().catch((err) => console.log(err));
      }
      nextInterceptorWrapper(
        props.router,
        () => this.validateCurrentUser(props),
        () => this.resetIsEmailChangeAttemptLeft(props),
        () =>
          props.reduxStore?.dispatch(removeAllItemsFromSustainabilityPage()),
        () =>
          props.reduxStore?.dispatch(
            removeAllItemsFromBusinessSustainabilityPage(),
          ),
        () => props.reduxStore?.dispatch(removeCurrentUser()),
      );
      props.reduxStore.dispatch(removeRegistationSuccess());
      Router.events.on("routeChangeStart", () => {
        const currentPath = window.location.pathname;
        const isCheckoutPage =
          currentPath.includes("/checkout") ||
          currentPath.includes("/other/checkout");
        const isInCheckoutProcess =
          localStorage.getItem("modulepurchase") === "true" ||
          localStorage.getItem("checkoutCartBackup");

        if (!isCheckoutPage && !isInCheckoutProcess) {
          this.syncLocalCart(props).catch((err) => console.log(err));
          setTimeout(() => {
            this.validateUserRouteChange(props);
          }, 100);
        }
      });
      if (!props.reduxStore.getState()?.userData?.isLoggedIn) {
        setUniqueVisitInformation({
          userCurrencyPreference: (currencyType, currency) =>
            props.reduxStore.dispatch(
              setUserCurrencyPreference(currencyType, currency),
            ),
          setCartCurrency: (currency) =>
            props.reduxStore.dispatch(setCartCurrency(currency)),
        });
      }
      // this.loadCurrency(props).catch((err) => console.log(err))
      this.loadProducts(props).catch((err) => console.log(err));
      this.syncLocalCart(props).catch((err) => console.log(err));
      setTimeout(() => {
        const isInCheckoutProcess =
          localStorage.getItem("modulepurchase") === "true" ||
          localStorage.getItem("checkoutCartBackup");
        if (!isInCheckoutProcess) {
          this.validateUserRouteChange(props);
        }
      }, 1);
    }

    this.state = {
      pass1: "",
      pass2: "",
      isDevMode: true,
      enterPass: "",
      verifyPass: theData || false,
      // ... other state properties
    };

    // this.geoData(props)
    // this.loadCart(props);
  }

  // componentDidMount(props) {

  // }

  validateCurrentUser = (props) => {
    props.reduxStore.dispatch(validateUser());
  };

  validateUserRouteChange = (props) => {
    const currentPath = window.location.pathname;
    const isCheckoutPage =
      currentPath.includes("/checkout") ||
      currentPath.includes("/other/checkout");
    const hasModuleProducts =
      props.reduxStore.getState()?.cartData?.moduleProducts &&
      props.reduxStore.getState()?.cartData?.moduleProducts.length > 0;
    const isInCheckoutProcess =
      localStorage.getItem("modulepurchase") === "true" ||
      localStorage.getItem("checkoutCartBackup");

    if (
      typeof window !== "undefined" &&
      !getCookie("JWTToken") &&
      props.reduxStore.getState()?.userData?.isLoggedIn &&
      !isCheckoutPage &&
      !hasModuleProducts &&
      !isInCheckoutProcess
    ) {
      deleteCookie("JWTToken");
      deleteCookie("checkout");
      deleteCookie("stripeSession");
      deleteCookie("user-slug", {
        domain: `${process.env.COOKIE_URL}`,
      });

      props.reduxStore.dispatch(validateUser());
      logoutCheckoutCurrencyAction();
      props.reduxStore.dispatch(deleteAllFromCart());
      props.reduxStore.dispatch(removeAllItemsFromSustainabilityPage());
      props.reduxStore.dispatch(removeAllItemsFromBusinessSustainabilityPage());
      props.reduxStore.dispatch(removeCurrentUser());
    }
  };

  resetIsEmailChangeAttemptLeft = (props) => {
    props.reduxStore.dispatch(setIsEmailChangeAttemptLeft(true));
  };

  loadProducts = async (props) => {
    try {
      const products = (await getProducts()).data;

      props.reduxStore.dispatch(
        fetchProducts(products?.map((d) => ({ ...d, id: d._id })) || []),
      );
    } catch (e) {
      console.log(e);
    }
  };

  deeplinkapi = async () => {
    // let deeplinkdata = await axios.get("/auth/referral/deeplink")
    // console.log("deeplink",deeplinkdata)
    try {
      const deeplinkdata = (await getdeeplink()).data;
      console.log(deeplinkdata, "deeplink");
      window.location.href = deeplinkdata.url;
    } catch (e) {
      console.log(e);
    }
  };

  // loadCart = async (props) => {
  //   try {
  //     const res = await getCart();
  //     if (res.status === 200) {
  //       props.reduxStore.dispatch(addAPIDataToCart(res.data.products));
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  syncLocalCart = async (props) => {
    try {
      // Skip cart sync if we're in a checkout process
      const isInCheckoutProcess =
        localStorage.getItem("modulepurchase") === "true" ||
        localStorage.getItem("checkoutCartBackup");
      if (isInCheckoutProcess) return;

      if (
        getCookie("JWTToken")
        // &&
        // window.location.search != '?loggedIn=true' &&
        // window.location.path !== '/login-register'
      ) {
        console.log("here is window", window);
        const cartData = await getCart();
        if (
          cartData?.data?.data &&
          ((cartData.data.data.products &&
            cartData.data.data.products.length > 0) ||
            (cartData.data.data.moduleProducts &&
              cartData.data.data.moduleProducts.length > 0))
        ) {
          props.reduxStore.dispatch(addAPIDataToCart(cartData?.data?.data));
        }
        if (
          props.reduxStore.getState()?.cartData?.currency !==
          cartData?.data?.data?.temporaryCheckoutCurrency
        )
          props.reduxStore.dispatch(
            setCartCurrency(cartData?.data?.data?.temporaryCheckoutCurrency),
          );
      }
    } catch (err) {
      console.log(err);
    }
  };

  loadCurrency = async (props) => {
    const currency =
      timeZoneToCurrency[Date()?.split("(")[1]?.split(")")[0].toString()];
    // console.log("inside load currency");

    props.reduxStore.dispatch(setUserCurrency(currency));
    // const res = await setCurrency(currency);
    // console.log("here is currency res", res);
  };
  geoData = async (props) => {
    try {
      const res = await getGeoDataFromIP();
      if (res?.currency?.code)
        props.reduxStore.dispatch(setUserCurrency(res.currency.code));
    } catch (error) {
      console.log(error);
    }
  };
  // loadWishlist = async (props) => {
  //   try {
  //     const res = await getWishlist();
  //     props.reduxStore.dispatch(addAPIDataToWishlist(res.data.products));
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    const { pass1, pass2, isDevMode } = this.state;

    const handleSubmit = () => {
      if (process.env.PASS_ONE === pass1 && process.env.PASS_TWO === pass2) {
        this.setState({ isDevMode: true });
      } else {
        this.setState({ isDevMode: false });
      }
    };

    const handleInputChange = (event) => {
      const { name, value } = event.target;

      // Updating state using the setState method
      this.setState({
        [name]: value,
      });
    };

    const handleKeyDown = (e) => {
      // Check if the pressed key is Enter (key code 13)
      if (e.key === "Enter") {
        if (
          process.env.PASS_ONE === this.pass1 &&
          process.env.PASS_TWO === this.pass2
        ) {
          this.setState({ isDevMode: true });
        } else {
          this.setState({ isDevMode: false });
        }
      }
    };

    // const [enterPass, setEnterPass] = useState("")

    const ActionSubmit = (value) => {
      if (this.state.enterPass === "SkyMetroBox@246") {
        this.setState({ verifyPass: true });
        if (typeof window !== "undefined") {
          // Perform sessionStorage action
          localStorage.setItem("verifyPass", true);
        }
      }
    };

    return (
      <Fragment>
        {true ? (
          <>
            <Head>
              <title>ECOSTANCE</title>
              <link rel="icon" href={process.env.PUBLIC_URL + "/favicon.ico"} />
              <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/css/flag-icons.min.css"
              />
              <script src="https://unpkg.com/@ungap/custom-elements-builtin"></script>
              {/* <script type="module" src="https://unpkg.com/x-frame-bypass"></script> */}
              <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
              />
              <link
                href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
              ></link>
              <script
                type="text/javascript"
                src="https://cdn.ywxi.net/js/1.js"
                async
              ></script>
            </Head>
            <ToastProvider
              components={{ toast: dummyToast }}
              placement="bottom-left"
            >
              <Provider store={reduxStore}>
                <PersistGate loading={<Preloader />} persistor={this.persistor}>
                  {/* <RegistrationSuccessPopup> */}
                  <Component {...pageProps} />
                  {/* </RegistrationSuccessPopup> */}
                </PersistGate>
              </Provider>
            </ToastProvider>
          </>
        ) : (
          <div
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <div style={{ paddingBottom: "20px" }}>
              The site is not available
            </div>
            <form>
              <div style={{ paddingBottom: "10px" }}>
                <input
                  type="text"
                  value={pass1}
                  onChange={(e) => this.setState({ pass1: e.target.value })}
                  // onChange={(e) => setPass1(e.target.value)}
                />
              </div>
              <div>
                <input
                  onKeyDown={handleKeyDown}
                  type="text"
                  value={pass2}
                  onChange={(e) => this.setState({ pass2: e.target.value })}
                  // onChange={(e) => setPass2(e.target.value)}
                />
              </div>
            </form>
          </div>
        )}
      </Fragment>
    );
  }
}

export default withRouter(withReduxStore(MyApp));
