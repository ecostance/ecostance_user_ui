import { useRouter } from "next/router";
import React from "react";
import LezadaBackdrop from "./lezadaBackdrop";

const CarbonOffsetPopup = ({
  handleRedirect,
  setShowPopup,
  remainingAmount,
  totalAmount,
}) => {
  const router = useRouter();
  return (
    <LezadaBackdrop>
      <div className="standard-popup-holder carbon--offset-popup--main">
        <div
          className="standard-popup-cross-icon"
          onClick={() => setShowPopup(false)}
        >
          <img src="/assets/images/cross-sustainability.png" />
        </div>
        <div className="carbon--svg">
          <img src="/assets/images/flamingo--carbon-calculator.png" />
        </div>

        <p>
          You have {totalAmount - remainingAmount} carbon offsets in your cart,
          but you had chosen {totalAmount} carbon offsets to reduce your carbon
          footprint by. Do you want to add {remainingAmount} more units?
        </p>
        <div className="carbon--button-holder">
          <button
            className="button--black"
            onClick={() => router.push("/shop/left-sidebar")}
          >
            OK I’ll add more
          </button>
          <button className="button--white" onClick={handleRedirect}>
            No, just checkout now
          </button>
        </div>
        <div></div>
      </div>
    </LezadaBackdrop>
  );
};

export default CarbonOffsetPopup;
