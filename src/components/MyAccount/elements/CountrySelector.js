import React, { useState, useEffect, useRef } from "react";
import { getCountries } from "src/apiClient/country";
import {
  returnCorrectCode,
  returnReverseCode,
} from "src/data/countryCodeToISO3";
import { countryNameToISO3 } from "src/data/countryNameToISO3";

const CountrySelector = ({ selectedCountry, setSelectedCountry, reRender, hideCarbon }) => {
  const [countryList, setCountryList] = useState([]);
  const [userCountry, setUserCountry] = useState({});
  const [countryCodeISO3, setCountryCodeISO3] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    getCountryList().catch((err) => console.log(err));

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  useEffect(() => {
    let countryVal = selectedCountry;
    if (typeof countryVal === "object") {
      countryVal = countryVal?.name;
    }
    if (typeof countryVal === "string" && countryVal.length > 3) {
      countryVal = countryNameToISO3(countryVal);
    }

    const countryCode = returnReverseCode(countryVal);
    const countryName = countryList.find(
      (each) => each?.countryCode === countryCode
    )?.entity;

    setUserCountry({ name: countryName, value: countryCode });
    setCountryCodeISO3(countryVal);
  }, [selectedCountry, countryList]);

  const getCountryList = async () => {
    await getCountries({ show: "yes", limit: 255 })
      .then((data) => {
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

  const handleSelectCountry = (val) => {
    setCountryCodeISO3(returnCorrectCode(val).toLocaleLowerCase());
    setSelectedCountry(returnCorrectCode(val).toLocaleLowerCase());
    setIsOpen(false);
  };

  const selectedCountryObj = countryList.find(
    (item) => item.entity === userCountry.name
  );

  const displaySelectedText = () => {
    if (selectedCountryObj) {
      if (hideCarbon) {
        return userCountry.name;
      } else {
        return `${userCountry.name} | ${Number(
          selectedCountryObj?.carbonCountryPerCapita
        )?.toFixed(2)}`;
      }
    }
    return userCountry.name === undefined ? "" : userCountry.name;
  };

  const filteredCountries = countryList.filter((item) =>
    item.entity.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div
      ref={dropdownRef}
      className="sustainability--country-holder--main"
      style={{ display: "flex", flexDirection: "row-reverse", gap: "10px" }}
    >
      <div
        className="w-100 country--select-sustaintainability"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          minHeight: "0px",
          paddingTop: "0px",
          paddingBottom: "0px",
          userSelect: "none",
          position: "relative",
          gap: "10px"
        }}
      >
        <span className={`fi fi-${countryCodeISO3}`} style={{ flexShrink: 0 }}></span>
        {displaySelectedText()}
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #dddce1",
            borderRadius: "4px",
            maxHeight: "250px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            marginTop: "2px"
          }}
        >
          <style>{`
            .dropdown-search-input:focus::placeholder {
              color: #999 !important;
              opacity: 1 !important;
            }
            .dropdown-search-input:focus::-webkit-input-placeholder {
              color: #999 !important;
              opacity: 1 !important;
            }
            .dropdown-search-input:focus::-moz-placeholder {
              color: #999 !important;
              opacity: 1 !important;
            }
            .dropdown-search-input:focus:-ms-input-placeholder {
              color: #999 !important;
              opacity: 1 !important;
            }
          `}</style>
          <input
            type="text"
            className="dropdown-search-input"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "none",
              borderBottom: "1px solid #dddce1",
              outline: "none",
              fontSize: "14px",
              fontFamily: "Work Sans"
            }}
            autoFocus
          />
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filteredCountries &&
              filteredCountries.map((item, index) => {
                const codeISO2 = returnCorrectCode(item.countryCode).toLowerCase();
                const isSelected = item.countryCode === userCountry?.value;
                return (
                  <div
                    key={index}
                    onClick={() => handleSelectCountry(item.countryCode)}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: isSelected ? "#f3f4f6" : "#fff",
                      color: "#333",
                      fontFamily: "Work Sans",
                      fontSize: "15px"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#fff";
                    }}
                  >
                    <span className={`fi fi-${codeISO2}`} style={{ flexShrink: 0 }}></span>
                    <span>{item.entity}</span>
                    {!hideCarbon && (
                      <span style={{ color: "#999", marginLeft: "auto", fontSize: "13px" }}>
                        {Number(item?.carbonCountryPerCapita)?.toFixed(2)}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
