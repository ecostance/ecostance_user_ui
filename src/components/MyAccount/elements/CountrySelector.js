import React, { useState } from "react";
import { useEffect } from "react";
import { getCountries } from "src/apiClient/country";
import {
  returnCorrectCode,
  returnReverseCode,
} from "src/data/countryCodeToISO3";
import { countryNameToISO3 } from "src/data/countryNameToISO3";

const CountrySelector = ({ selectedCountry, setSelectedCountry, reRender }) => {
  const [countryList, setCountryList] = useState([]);
  const [userCountry, setUserCountry] = useState({});
  const [countryCodeISO3, setCountryCodeISO3] = useState("");

  useEffect(() => {
    getCountryList().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (typeof selectedCountry === "object") {
      selectedCountry = selectedCountry?.name;
      selectedCountry = countryNameToISO3(selectedCountry);
    }

    const countryCode = returnReverseCode(selectedCountry);
    const countryName = countryList.find(
      (each) => each?.countryCode === countryCode
    )?.entity;

    setUserCountry({ name: countryName, value: countryCode });
    setCountryCodeISO3(selectedCountry);
  }, [selectedCountry, countryList]);

  const getCountryList = async () => {
    await getCountries({ show: "yes", limit: 255 })
      .then((data) => {
        // setCountryList(data.countries);

        // #################################################################
        // This this needs to happen in the backend or the main data need to be modified,
        // This is a temp fix.
        const newCountries = data?.data?.filter(
          (each) => each.carbonCountryPerCapita !== "0" && each.countryCode
        );

        newCountries.sort((a, b) =>
          a.entity.localeCompare(b.entity, "es", { sensitivity: "base" })
        );
        // ##################################################################

        setCountryList(newCountries);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSelectCountry = (e) => {
    setCountryCodeISO3(returnCorrectCode(e?.target?.value).toLocaleLowerCase());
    setSelectedCountry(returnCorrectCode(e?.target?.value).toLocaleLowerCase());
  };

  return (
    <div
      className="sustainability--country-holder--main"
      style={{ display: "flex", flexDirection: "row-reverse", gap: "10px" }}
    >
      <select
        className="w-100 country--select-sustaintainability"
        onChange={(e) => handleSelectCountry(e)}
        value={userCountry?.value}
      >
        <option hidden>
          {countryList.some((item) => item.entity === userCountry.name)
            ? `${userCountry.name}`
            : `${userCountry.name === undefined ? "" : userCountry.name}`}
        </option>
        {countryList &&
          countryList.map((item, index) => {
            return (
              <>
                <option key={index} value={item.countryCode}>
                  {item.entity}
                </option>
              </>
            );
          })}
      </select>
      <div className="sustainability--flag-holder">
        <span class={`fi fi-${countryCodeISO3}`}></span>{" "}
      </div>
    </div>
  );
};

export default CountrySelector;
