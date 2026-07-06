import axios from "axios";
import { setCookies } from "cookies-next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { calculateExpress, getCart, updateCart } from "src/apiClient/cart";
import CarbonOffsetPopup from "src/components/carbon--offset-popup";
import CircleComponent from "src/components/CirclePage/circle";
import { LayoutTwo } from "src/components/Layout";
import formatCurrency from "src/helpers/formatCurrency";
import {
  addExpressItemAddedToCart,
  addExpressPriceData,
  addHiddenProducts,
  addToCart,
  removeExpressItemAddedToCartLocal,
  removeHiddenProducts,
} from "src/redux/actions/cartActions";
import { addOrder } from "src/redux/actions/orderActions";
import { addCircleDataIndex } from "src/redux/actions/carbonCalculatorActions";
import _debounce from "src/helpers/debounce";
import { Spinner } from "react-bootstrap";

const Circular = ({
  productData,
  userData,
  addHiddenProducts,
  removeHiddenProducts,
  addOrder,
  addExpressPriceData,
  addToCart,
  cartItems,
  addExpressItemAddedToCart,
  removeExpressItemAddedToCartLocal,
  circleSliderData,
  addCircleDataIndex,
}) => {
  const { query } = useRouter();
  const router = useRouter();
  const { addToast } = useToasts();
  const [newTons, setNewTons] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [lowestPriceItem, setLowestPriceItem] = useState({});
  const [loading, setLoading] = useState(true);
  const returnExpressCalculation = async (id, quantity) => {
    const res = await calculateExpress(id, quantity);

    return res?.data;
  };

  const [buttonClicked, setButtonClicked] = useState("");

  const excecuteBuyNow = async () => {
    console.log(lowestPriceItem?.cartData?._id, "lowestItem")
    localStorage.setItem("lowestProduct", lowestPriceItem?.cartData?._id)
    lowestPriceItem.stripeData[0].quantity = newTons;
    lowestPriceItem.cartData.quantity = newTons;
    addHiddenProducts([lowestPriceItem]);
    let apiCart = cartItems?.products;
    const sameProduct = apiCart?.filter(
      (each) => each?.product?._id === lowestPriceItem?.cartData?._id
    );
    console.log("here is apiCart", apiCart);
    if (sameProduct?.length === 0) {
      try {
        addToCart(
          lowestPriceItem?.cartData,
          "",
          lowestPriceItem?.cartData?.quantity,
          "",
          "",
          cartItems
        );
        addExpressItemAddedToCart();
      } catch (err) {
        console.log("updateCart failed in circular", err);
      }
    } else {
      removeExpressItemAddedToCartLocal();
    }

    addOrder(false, {});
    returnExpressCalculation(
      lowestPriceItem?.cartData?._id,
      lowestPriceItem?.cartData?.quantity
    ).then((res) => {
      addExpressPriceData(res?.data);
    });
    // return await axios.post(
    //   "/api/checkout_sessions",
    //   {
    //     items: lowestPriceItem?.stripeData,
    //     email: userData?.user?.email,
    //     paymentMode: "payment",
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
  };

  const handleBuyNow = () => {
    if (!newTons)
      return addToast("You must select 1 or more carbon offset to checkout", {
        appearance: "error",
        autoDismiss: true,
      });
    // if (!userData?.isLoggedIn) return router.push("/login-register");
    handleButtonClickLoad("buyProductSelected");
    return handleRedirect();

    // if (newTons < Math.round(router.query.tons)) {
    //   setShowPopup(true);
    // } else {
    //   handleRedirect();
    // }
  };

  const saveOffsetTonsToRedux = useCallback(
    _debounce((val) => {
      addCircleDataIndex(val);
    }, 500)
  );

  const handleRedirect = () => {
    excecuteBuyNow().then(() => {
      router.push({
        pathname: "/other/checkout",
        query: {
          express: true,
          carbonCalculated: true,
          remainingAmount: Math.round(router.query.tons - newTons),
          totalAmount: Math.round(router.query.tons),
        },
      });
      // router.push(res.data.session.url);
    });
  };
  let textfield = localStorage.getItem("carbonroute")

  useEffect(() => {
    // if (localStorage.getItem("carbonroute") == "workcarbonoffset") {
    //   textfield = "business"
    // } else if (localStorage.getItem("carbonroute") == "eventcarbonoffset") {
    //   textfield = "event"
    // } else if (localStorage.getItem("carbonroute") == "eventOffset") {
    //   textfield = "event"
    // }
    console.log(localStorage.getItem("carbonroute"), "abcd")
    if (!query.tons) {
      return;
    }
    if (localStorage.getItem("carbonroute") != "eventOffset") {
      localStorage.removeItem("eventOwnerOrder")
    }
    let lowestPriceData = { price: Infinity, name: "", currencySymbol: "" };
    productData?.map((product) => {
      product?.priceList?.map((priceData) => {
        userData?.currency === priceData?.currency &&
          priceData?.price < lowestPriceData?.price
          ? (lowestPriceData = {
            price: priceData?.price,
            name: product?.name,
            currencySymbol: priceData?.currencySymbol,
            // quantity: Math.ceil(query.tons),
            stripeData: [
              {
                price_data: {
                  currency: priceData?.currency,
                  product_data: {
                    name: product?.formalName,
                    images: product?.image || [],
                  },
                  unit_amount_decimal: parseFloat(
                    priceData?.price * 100
                  ).toFixed(2),
                  recurring: {},
                },
              },
            ],
            cartData: product,
          })
          : "";
      });
    });

    setLowestPriceItem(lowestPriceData);
    setLoading(false);
  }, []);

  const handleButtonClickLoad = (name) => {
    setButtonClicked(name);
  };

  let percentageTons = newTons === 0 ? "0" : ((newTons / query.tons) * 100)?.toFixed(2)

  return (
    <div>
      {!loading && (
        <LayoutTwo aboutOverlay={false}>
          <div className="circle-main-holder">
            <div className="heading">Reduce my carbon footprint</div>
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <div className="circle-component--holder">
                <CircleComponent
                  offsetTons={circleSliderData?.dataIndex || 0}
                  currencySymbol={lowestPriceItem?.currencySymbol}
                  currencyCode={userData?.currency}
                  tons={query.tons}
                  price={lowestPriceItem?.price}
                  setNewTons={setNewTons}
                  newTons={newTons}
                  currency={userData?.currency}
                  saveOffsetTonsToRedux={saveOffsetTonsToRedux}
                />
              </div>
            </div>
            <div className="product-selected--holder">
              <div>Product Selected</div>
              <div style={{ height: "80px" }}>
                {lowestPriceItem?.name} - {userData?.currency}{" "}
                {lowestPriceItem?.currencySymbol}
                {formatCurrency(
                  lowestPriceItem?.price?.toFixed(2),
                  userData?.currency
                )}
              </div>
            </div>
            <div className="button--holder">
              <div onClick={() => handleButtonClickLoad("showOtherProducts")}>
                <a href="/shop/left-sidebar">
                  <button>
                    {buttonClicked === "showOtherProducts" ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Show other Products"
                    )}
                  </button>
                </a>
              </div>
              <button onClick={(e) => [handleBuyNow(e)]}>
                {buttonClicked === "buyProductSelected" ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Buy Product Selected"
                )}
              </button>
              <button
                onClick={() => [
                  handleButtonClickLoad("cancelButton"),
                  localStorage.getItem("carbonroute") === "eventOffset" ? router.push({
                    pathname: "/other/my-business-account",
                    query: { data: "event" },
                  }) : localStorage.getItem("carbonroute") === "workcarbonoffset" ? router.push("/other/work-carbon-offset") : localStorage.getItem("carbonroute") === "eventcarbonoffset" || localStorage.getItem("conferenceCode") ? router.push("/other/conference-carbon-offset") : localStorage.getItem("carbonroute") === "traveloffset" ? router.push("/other/travel-data") : router.push("/other/carbon-offset"),
                ]}
              >
                {buttonClicked === "cancelButton" ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Cancel"
                )}
              </button>
            </div>
            <div className="circular-gradiant">
              <svg
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
                height="100%"
                fill="none"
                viewBox="0 0 1440 287"
              >
                <path
                  fill="#7BA986"
                  fillOpacity="0.16"
                  d="M317.464 176.531c-165.965 32.296-295.326-50.579-339.26-96.053v206.025H1694l-484.32-30.625c-104.51 0-126.34 38.978-276.867-9.744-232.397-75.224-407.893-109.973-615.349-69.603z"
                ></path>
                <path
                  fill="#7BA986"
                  fillOpacity="0.17"
                  d="M1152.35 85.952c97.36-154.975 290.56-65.864 290.56 0v200.551H-627.001s396.349-30.43 514.41-30.43c201.191 0 1104.995 84.477 1264.941-170.12z"
                ></path>
                <path
                  fill="url(#paint0_linear_4538_3131)"
                  d="M1152.35 85.952c97.36-154.975 290.56-65.864 290.56 0v200.551H-627.001s396.349-30.43 514.41-30.43c201.191 0 1104.995 84.477 1264.941-170.12z"
                ></path>
                <defs>
                  <linearGradient
                    id="paint0_linear_4538_3131"
                    x1="1282.56"
                    x2="1281.15"
                    y1="341.6"
                    y2="206.864"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#fff"></stop>
                    <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="right-text">
              I want to purchase {newTons === 0 ? "__" : <b>{newTons}</b>} tons of carbon offsets to reduce (offset) {textfield == "workcarbonoffset" ? "business" :  textfield == "eventcarbonoffset" || textfield == "eventOffset" ? "event" : "my"} carbon footprint from {query.tons} to {newTons === 0 ? "__" : <b>{newTons}</b>} tons of carbon emissions ({percentageTons === "0" ? "__" : <b>{percentageTons}</b>} % reduction) for {userData?.currency} {lowestPriceItem?.currencySymbol}{newTons === 0 ? "___" : <b>{formatCurrency(
                lowestPriceItem?.price?.toFixed(2) *
                newTons, userData?.currency
              )}</b>}
            </div>
          </div>
        </LayoutTwo>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    productData: state.productData,
    userData: state.userData,
    cartItems: state.cartData,
    circleSliderData: state.circleSliderData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCircleDataIndex: (val) => {
      dispatch(addCircleDataIndex(val));
    },
    addHiddenProducts: (items) => {
      dispatch(addHiddenProducts(items));
    },
    removeHiddenProducts: () => {
      dispatch(removeHiddenProducts());
    },
    addOrder: (isOrder, item) => {
      dispatch(addOrder(isOrder, item));
    },
    addExpressPriceData: (data) => {
      dispatch(addExpressPriceData(data));
    },
    addExpressItemAddedToCart: () => {
      dispatch(addExpressItemAddedToCart());
    },
    removeExpressItemAddedToCartLocal: () => {
      dispatch(removeExpressItemAddedToCartLocal());
    },
    addToCart: (
      product,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize,
      cartItems
    ) => {
      dispatch(
        addToCart(
          product,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize,
          cartItems
        )
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Circular);
