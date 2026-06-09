import React, { useRef, useState } from "react";
import CircularSlider from "@fseehawer/react-circular-slider";
import formatCurrency from "src/helpers/formatCurrency";
import { useEffect } from "react";

const characterGenerator = (text, arc, radius, className = "", scale = 1) => {
  const characters = text.split("");
  const degree = arc / characters.length;
  const fontSize = 25.76 * scale;

  return (
    <h1 className={className} style={{ fontSize: `${fontSize}px` }}>
      {characters.map((char, i) => (
        <span
          key={`heading-span-${i}`}
          style={{
            height: `${radius}px`,
            transform: `rotate(${degree * i - arc / 2}deg)`,
            transformOrigin: `0 ${radius}px 0`,
          }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
};

const returnReversedString = (str) => {
  const strArray = str.split("");

  const returnStr = "";

  for (let i = strArray.length - 1; i >= 0; i--) {
    returnStr += strArray[i];
  }

  return returnStr;
};

const Circular = ({
  tons,
  price,
  currencySymbol,
  currencyCode,
  newTons,
  setNewTons,
  currency,
  offsetTons = 0,
  saveOffsetTonsToRedux,
}) => {
  const isSingleTon = Math.round(tons) <= 1;

  const getScale = () => {
    if (typeof window === 'undefined') return 1;
    const w = window.innerWidth;
    if (w <= 480) return 0.62;
    if (w <= 768) return 0.75;
    return 1;
  };

  const [scaleFactor, setScaleFactor] = useState(getScale);

  useEffect(() => {
    const handleResize = () => setScaleFactor(getScale());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculateDataIndex = () => {
    if (isSingleTon) return 1;
    const currentTons = Math.round(tons);
    const divisionVal = currentTons;

    return Math.round((divisionVal / currentTons) * offsetTons);
  };

  const [staticDataIndex, setStaticDataIndex] = useState(calculateDataIndex());

  useEffect(() => {
    if (isSingleTon) {
      const tonsVal = Math.round(tons);
      setNewTons(tonsVal);
      setPriceValue((tonsVal * price)?.toFixed(2));
      saveOffsetTonsToRedux(tonsVal);
    }
  }, [isSingleTon]);

  const generateDataArray = () => {
    const returnArr = [];
    const currentTons = Math.round(tons);
    const data = price * currentTons;
    const spreadEnd = tons < 12 ? currentTons : 11;
    for (let i = 0; i < spreadEnd; i++) {
      if (returnArr.length === 0) {
        returnArr.push(0);
        returnArr.push(data / (spreadEnd + 1));
      } else {
        const lastItem = Number(returnArr.at(-1));
        returnArr.push(lastItem + data / (spreadEnd + 1));
      }
    }

    returnArr.pop();
    returnArr.push(data);

    return returnArr.map((each) => {
      return `${currencyCode} ${currencySymbol}${formatCurrency(
        each?.toFixed(2),
        currencyCode
      )}`;
    });
  };

  const generateTonsArray = () => {
    const returnArr = [];
    const currentTons = Math.round(tons);
    const targetNum = currentTons;
    for (let i = 0; i <= targetNum; i++) {
      if (returnArr.length === 0) {
        returnArr.push(0);
      } else {
        const lastItem = Number(returnArr.at(-1));
        returnArr.push(lastItem + currentTons / targetNum);
      }
    }
    if (targetNum === 12) {
      returnArr.pop();
      returnArr.push(currentTons);
    }
    return returnArr.map((each) => {
      return `${Math.round(each)} Tons`;
    });
  };

  const returnCorrectPricing = () => {
    return formatCurrency((price * Math.round(tons))?.toFixed(2), currencyCode);
  };

  const [value, setValue] = useState(value);

  const [priceValue, setPriceValue] = useState(0);

  const circleRef = useRef(null);

  return (
    <div
      className={`drag-circle-wrapper ${newTons == tons ? "show--knob" : ""} ${isSingleTon ? "circle-locked" : ""}`}
    >
      <div className="drag-circle-holder circle-wrapper">
        <CircularSlider
          key={scaleFactor}
          width={450.8 * scaleFactor}
          label={`${currencyCode} ${currencySymbol}${formatCurrency(
            priceValue,
            currencyCode
          )}`}
          labelColor="#333"
          knobColor="#fff"
          max={4}
          progressColorFrom="#7BA986"
          progressColorTo="#7BA986"
          progressSize={51.52 * scaleFactor}
          trackColor={isSingleTon ? "#7BA986" : "#B7323B"}
          currencyCode={currencyCode}
          trackSize={51.52 * scaleFactor}
          knobSize={51.52 * scaleFactor}
          data={generateTonsArray()}
          dataIndex={isSingleTon ? generateTonsArray().length - 1 : staticDataIndex}
          value={value}
          onChange={(value) => {
            if (isSingleTon) return;
            setNewTons(Number(value.split("Tons")[0]));
            setPriceValue((value.split("Tons")[0] * price)?.toFixed(2));
            saveOffsetTonsToRedux(Number(value.split("Tons")[0]));
          }}
        />
        {isSingleTon && (
          <div className="single-ton-value" style={{ fontSize: `${33.81 * scaleFactor}px` }}>
            {Math.round(tons)} Tons
          </div>
        )}
        {characterGenerator(
          `M y CO2 Footprint:${Number(tons)?.toFixed(0)} Tons`,
          145,
          169 * scaleFactor,
          "",
          scaleFactor
        )}
        {characterGenerator(
          returnReversedString(
            `M y Reduction Cost:${currencyCode} ${currencySymbol}${returnCorrectPricing()}`
          ),
          156,
          -140 * scaleFactor,
          "second-rotate-text",
          scaleFactor
        )}
      </div>
    </div>
  );
};

export default Circular;
