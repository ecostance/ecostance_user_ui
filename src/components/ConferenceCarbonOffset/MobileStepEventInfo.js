import React from "react";
import { ButtonGroup } from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";

export default function MobileStepEventInfo({
  countryList,
  userCountry,
  showCapitalName,
  showCapitalCarbon,
  countryCodeISO3,
  handleSelectCountry,
  eventSelection,
  conferenceCode,
  validText,
  eventType,
  conferenceName,
  conferenceDate,
  conferenceEndDate,
  conferenceLocation,
  handleChangeCode,
  inputRef,
  setConferenceName,
  setConferenceDate,
  setConferenceEndDate,
  departureDate,
  arrivalDate,
  handleCalculateCarbonTrans,
}) {
  return (
    <div className="mobile-step-content">
      {/* Country Selector */}
      <div className="field-group">
        <label>Country</label>
        <div className="country-selector-mobile">
          <span className="country-selector-mobile__flag">
            <span className={`fi fi-${countryCodeISO3}`}></span>
          </span>
          <select onChange={(e) => handleSelectCountry(e)}>
            <option hidden>
              {countryList.some(
                (item) =>
                  item.entity === userCountry.name || showCapitalName
              )
                ? `${userCountry.name || showCapitalName} | ${Number(
                    Number(showCapitalCarbon).toFixed(2)
                  )?.toFixed(2)}`
                : "Select Country"}
            </option>
            {countryList &&
              countryList.map((item, index) => (
                <option key={index} value={item.countryCode}>
                  {item.entity} | {Number(item?.carbonCountryPerCapita)?.toFixed(2)}
                </option>
              ))}
          </select>
        </div>
        <p className="country-selector-mobile__helper">
          Metric tons of carbon emission per person
        </p>
      </div>

      {/* Individual / Business Toggle */}
      <div className="field-group">
        <label>Are you an Individual or Business</label>
        <div className="calculator--radio-button-holder">
          <ButtonGroup
            aria-label="house"
            name="eventSelection"
            className="houseisrent"
          >
            <ToggleButton
              type="radio"
              checked={eventSelection === "Attendie"}
              onClick={() =>
                handleCalculateCarbonTrans("eventSelection", "Attendie")
              }
              className={
                eventSelection === "Attendie"
                  ? "active form-control-label"
                  : "form-control-label"
              }
            >
              Individual
            </ToggleButton>
            <ToggleButton
              type="radio"
              checked={eventSelection === "Exhibitor"}
              onClick={() =>
                handleCalculateCarbonTrans("eventSelection", "Exhibitor")
              }
              className={
                eventSelection === "Exhibitor"
                  ? "active form-control-label"
                  : "form-control-label"
              }
            >
              Business
            </ToggleButton>
          </ButtonGroup>
        </div>
      </div>

      {/* Conference Code */}
      <div className="field-group">
        <label>Conference Code</label>
        <input
          type="text"
          placeholder="Enter Conference Code"
          ref={inputRef}
          value={conferenceCode}
          onChange={handleChangeCode}
        />
        {conferenceCode.length !== 10 && (
          <span className="optional-text">(optional)</span>
        )}
        {conferenceCode.length === 10 && (
          <>
            {validText ? (
              <span className="valid-text">Valid Code</span>
            ) : (
              <span className="invalid-text">Invalid Code</span>
            )}
          </>
        )}
      </div>

      {/* Event Details Box (when valid code) */}
      {conferenceCode.length === 10 && validText && (
        <div className="conference-box">
          <h2 style={{ fontWeight: "bold" }}>Event Details</h2>
          <div className="field">
            <span className="label">Conference Code:</span>
            <span className="value">{conferenceCode}</span>
          </div>
          <div className="field">
            <span className="label">Conference Name:</span>
            <span className="value">{conferenceName}</span>
          </div>
          <div className="field">
            <span className="label">Conference Dates:</span>
            <span className="value">
              {conferenceDate} to {conferenceEndDate}
            </span>
          </div>
          <div className="field">
            <span className="label">Conference Location:</span>
            <span className="value">{conferenceLocation}</span>
          </div>
          <div className="field">
            <span className="label">Event Type:</span>
            <span className="value">{eventType}</span>
          </div>
        </div>
      )}

      {/* Manual entry fields (when no valid code) */}
      {!(conferenceCode.length === 10 && validText) && (
        <>
          <div className="field-group">
            <label>Conference Name</label>
            <input
              type="text"
              placeholder="Enter Conference Name"
              value={conferenceName}
              onChange={(e) => setConferenceName(e.target.value)}
              readOnly={validText}
            />
          </div>
          <div className="field-group">
            <label>Conference Start Date</label>
            <input
              type="date"
              placeholder="Enter Conference date"
              value={conferenceDate}
              onChange={(e) => setConferenceDate(e.target.value)}
              readOnly={validText}
            />
          </div>
          <div className="field-group">
            <label>Conference End Date</label>
            <input
              type="date"
              placeholder="Enter Conference date"
              value={conferenceEndDate}
              onChange={(e) => setConferenceEndDate(e.target.value)}
              readOnly={validText}
            />
          </div>

          {/* Event Type */}
          <div className="field-group">
            <label>Event Type</label>
            <div className="calculator--radio-button-holder">
              <ButtonGroup
                aria-label="house"
                name="income"
                className="houseisrent"
              >
                {["Conference", "Event", "Concert", "Sport", "Trade", "Fashion"].map(
                  (type) => (
                    <ToggleButton
                      key={type}
                      type="radio"
                      checked={eventType === type}
                      onClick={() =>
                        handleCalculateCarbonTrans("eventType", type)
                      }
                      className={
                        eventType === type
                          ? "active form-control-label"
                          : "form-control-label"
                      }
                    >
                      {type === "Event"
                        ? "Event or Meeting"
                        : type === "Sport"
                        ? "Sporting Event"
                        : type === "Trade"
                        ? "Trade Show"
                        : type === "Fashion"
                        ? "Fashion Runway"
                        : type}
                    </ToggleButton>
                  )
                )}
              </ButtonGroup>
            </div>
          </div>
        </>
      )}

      {/* Departure Date */}
      <div className="field-group">
        <label>Departure Date</label>
        <input
          type="date"
          value={departureDate}
          onChange={(e) =>
            handleCalculateCarbonTrans("departureDate", e.target.value)
          }
        />
      </div>

      {/* Return Date */}
      <div className="field-group">
        <label>Return Date</label>
        <input
          type="date"
          value={arrivalDate}
          min={departureDate}
          onChange={(e) =>
            handleCalculateCarbonTrans("arrivalDate", e.target.value)
          }
        />
      </div>
    </div>
  );
}
