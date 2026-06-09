import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { setCurrency } from "src/apiClient/auth";
import { calculateExpress, getCart, updateCart } from "src/apiClient/cart";
import formatCurrency from "src/helpers/formatCurrency";
import { CURRENCY_CHECKOUT_TOP } from "src/redux/actions/userAction";
import CurrencySelect from "../helpers/currencySelect";

const CurrencyOption = ({
  setShowCurrencyOverlay,
  prevTotal,
  currencySymbol,
  userData,
  setUserCurrencyForce,
  saveCoupon,
  couponCode,
  addCoupon,
  addToCart,
  cartItems,
  updateCartForCurrency,
  expressPriceData,
  express,
  addExpressPriceData,
  localTotal,
  isLoggedIn,
  setUserCurrencyPreference,
  setCheckoutCurrency,
  setCartCurrency,
}) => {
  const [newCurrencyLoading, setNewCurrencyLoading] = useState(false);
  const [currentCurrencyCartRes, setCurrentCurrencyCartRes] = useState({});
  const [previousPriceData, setPreviousPriceData] = useState({
    symbol: currencySymbol,
    currencyName: userData?.currency,
    total: prevTotal,
  });
  const [selectedCurrency, setSelectedCurrency] = useState(userData?.currency);
  const [currentConvertedTotal, setCurrentConvertedTotal] = useState(0);
  const [saveNewCurrencyToUI, setSaveNewCurrencyToUI] = useState(false);
  const handleConfirmCurrency = async (e) => {
    e.preventDefault();
    setSaveNewCurrencyToUI(true);
    // setUserCurrencyForce(selectedCurrency)
    // setUserCurrencyPreference(CURRENCY_CHECKOUT_TOP, selectedCurrency)
    // setCheckoutCurrency(selectedCurrency)
    setCartCurrency(selectedCurrency);
    if (!userData?.isLoggedIn) {
      return setShowCurrencyOverlay(false);
    }
    if (!express) {
      const getStripe = window.location.pathname === "/other/checkout";
      const data = await updateCart([], selectedCurrency, false, getStripe);
      updateCartForCurrency(selectedCurrency, "CART_PAGE", data?.data?.data);
      setSaveNewCurrencyToUI(false);
    } else {
      const res = await calculateExpress(
        cartItems?.hiddenProducts[0]?.cartData?._id,
        cartItems?.hiddenProducts[0]?.cartData?.quantity,
        couponCode,
        selectedCurrency,
        true
      );
      addExpressPriceData(res?.data?.data);
      setSaveNewCurrencyToUI(false);
    }
    // saveCoupon(couponCode, addCoupon);
    // addToCart("", "", "", "", "", cartItems);
    setShowCurrencyOverlay(false);
  };

  const handleSelect = async (e) => {
    setNewCurrencyLoading(true);
    setSelectedCurrency(e?.target?.value);
    // await setCurrency(e?.target?.value);
    let cartRes;
    if (!userData?.isLoggedIn) {
      if (!express) {
        calculatePriceBasedOnCurrency(cartItems?.products, e?.target?.value);
      } else {
        calculatePriceBasedOnCurrency(
          [
            {
              quantity: cartItems?.hiddenProducts[0]?.cartData?.quantity,
              product: cartItems?.hiddenProducts[0]?.cartData,
            },
          ],
          e?.target?.value
        );
      }
    } else {
      if (!express) {
        cartRes = await updateCart([], e?.target?.value);
      } else {
        cartRes = await calculateExpress(
          cartItems?.hiddenProducts[0]?.cartData?._id,
          cartItems?.hiddenProducts[0]?.cartData?.quantity,
          couponCode,
          e?.target?.value,
          false
        );
      }
      setCurrentConvertedTotal(cartRes?.data?.data?.orderTotal);
    }
    // setCurrentCurrencyCartRes(cartRes?.data?.data)
    setNewCurrencyLoading(false);
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    await setCurrency(previousPriceData?.currencyName);
    setShowCurrencyOverlay(false);
  };

  const calculatePriceBasedOnCurrency = (items, currency) => {
    let total = 0;
    items?.forEach((eachItem) => {
      const priceOfItem = eachItem?.product?.priceList?.find(
        (price) => price?.currency === currency
      );
      if (!eachItem) {
        return;
      } else {
        total += priceOfItem?.price * eachItem?.quantity;
      }
    });

    setCurrentConvertedTotal(total);
  };

  useEffect(() => {
    console.log("here is localTotal", localTotal);
    // calculatePriceBasedOnCurrency(
    //   !express
    //     ? cartItems?.products
    //     : [
    //         {
    //           quantity: cartItems?.hiddenProducts[0]?.cartData?.quantity,
    //           product: cartItems?.hiddenProducts[0]?.cartData,
    //         },
    //       ],
    //   userData?.currency
    // );
    handleSelect({ target: { value: cartItems?.currency } });
  }, []);

  return (
    <div className="main--currency-option">
      <div className="title-cross-holder">
        <div className="title">Change currency of your choice for payment</div>
        <div className="svg-holder-currency" onClick={handleCancel}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.506757 0.507733C0.916807 0.0976827 1.58163 0.0976827 1.99168 0.507733L6.49922 5.01527L11.0068 0.507733C11.4168 0.0976827 12.0816 0.0976827 12.4917 0.507733C12.9017 0.917784 12.9017 1.58261 12.4917 1.99266L7.98414 6.5002L12.4917 11.0077C12.9017 11.4178 12.9017 12.0826 12.4917 12.4927C12.0816 12.9027 11.4168 12.9027 11.0068 12.4927L6.49922 7.98512L1.99168 12.4927C1.58163 12.9027 0.916807 12.9027 0.506757 12.4927C0.0967061 12.0826 0.0967061 11.4178 0.506757 11.0077L5.0143 6.5002L0.506757 1.99266C0.0967061 1.58261 0.0967061 0.917784 0.506757 0.507733Z"
              fill="#333333"
            />
          </svg>
        </div>
      </div>
      <div className="currency-change-option-values-holder">
        <div className="currency-change-first-column">
          <div className="first-price-option-holder">
            <p className="first-price">
              {previousPriceData?.currencyName} {previousPriceData?.symbol}
              {formatCurrency(
                previousPriceData?.total?.toFixed(2) || localTotal?.toFixed(2),
                userData?.currency
              )}
            </p>
          </div>
          <button className="button--white" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        <div className="currency-change-second-column">
          <div className="price-option-holder">
            <div className="border--select-last-price-holder">
              <div className="border--select-holder">
                {!newCurrencyLoading ? (
                  <>
                    <CurrencySelect
                      handleSelect={handleSelect}
                      selectedCurrency={selectedCurrency}
                    />
                    <div className="border--select"></div>
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.70876 7.37478C6.1017 6.98184 6.73877 6.98184 7.1317 7.37478L10.4449 10.688L13.7581 7.37478C14.1511 6.98184 14.7881 6.98184 15.1811 7.37478C15.574 7.76771 15.574 8.40479 15.1811 8.79772L11.1564 12.8224C10.7635 13.2153 10.1264 13.2153 9.73345 12.8224L5.70876 8.79772C5.31583 8.40479 5.31583 7.76771 5.70876 7.37478Z"
                        fill="#111827"
                      />
                    </svg>
                  </>
                ) : (
                  <Spinner animation="border" role="status"></Spinner>
                )}
              </div>
              <p className="last-price">{currentConvertedTotal?.toFixed(2)}</p>
            </div>
          </div>
          <button
            disabled={saveNewCurrencyToUI}
            onClick={handleConfirmCurrency}
          >
            {!saveNewCurrencyToUI ? (
              "Select New Currency"
            ) : (
              <Spinner animation="border" size="sm" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyOption;
