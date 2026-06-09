import React from "react";
import { ButtonGroup, Spinner } from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";
import SliderCustom from "src/components/calculator/slider";

export default function MobileStepTravelingTo({
  eventSelection,
  travelSelection,
  seatType,
  eventTransportMode,
  distEventTravel,
  handleCalculateCarbonTrans,
  // Airport props
  searchAirport,
  searchAirportDest,
  searchAirportTrans1,
  searchAirportTrans2,
  airportsData,
  airportsDataDest,
  airportsDataTrans1,
  airportsDataTrans2,
  clickedDrop,
  clickedDropDest,
  clickedDropTrans1,
  clickedDropTrans2,
  handleAirport,
  handleAirportDest,
  handleAirportTrans1,
  handleAirportTrans2,
  handleClickedAirport,
  loadingAirports,
  trans1err,
  trans2err,
  // Exhibitor props
  companyCode,
  companyName,
  theValidField,
  exhibitSpace,
  peopleNum,
  peopleByAir,
  peopleByRoad,
  selectedGroup,
  handlePeople,
  setCompanyCode,
  eventType,
}) {
  if (eventSelection === "Attendie") {
    return (
      <div className="mobile-step-content">
        {/* By Road / By Air Toggle */}
        <div className="field-group">
          <label>How are you traveling to the event</label>
          <div className="calculator--radio-button-holder">
            <ButtonGroup
              aria-label="house"
              name="travelSelection"
              className="houseisrent"
            >
              <ToggleButton
                type="radio"
                checked={travelSelection === "ByRoad"}
                onClick={() =>
                  handleCalculateCarbonTrans("travelSelection", "ByRoad")
                }
                className={
                  travelSelection === "ByRoad"
                    ? "active form-control-label"
                    : "form-control-label"
                }
              >
                By Road
              </ToggleButton>
              <ToggleButton
                type="radio"
                checked={travelSelection === "ByAir"}
                onClick={() =>
                  handleCalculateCarbonTrans("travelSelection", "ByAir")
                }
                className={
                  travelSelection === "ByAir"
                    ? "active form-control-label"
                    : "form-control-label"
                }
              >
                By Airline
              </ToggleButton>
            </ButtonGroup>
          </div>
        </div>

        {/* ByAir Section */}
        {travelSelection === "ByAir" && (
          <>
            <div className="field-group">
              <label>Air Travel</label>
              {/* Origin Airport */}
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="Origin Airport"
                  value={searchAirport}
                  onChange={handleAirport}
                />
                {searchAirport?.length > 2 && clickedDrop && (
                  <div className="dropdown-box">
                    {airportsData.length > 0 && !loadingAirports ? (
                      airportsData.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleClickedAirport("origin", item)}
                          className="airport-names"
                        >
                          {item?.iata}
                          {item?.iata && <span> - </span>}
                          {item?.name}, {item?.state}, {item?.country}
                        </div>
                      ))
                    ) : (
                      <div className="airports-loader">
                        {loadingAirports ? (
                          <Spinner size="sm" animation="border" />
                        ) : (
                          "No airport found"
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Destination Airport */}
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="Destination Airport"
                  value={searchAirportDest}
                  onChange={handleAirportDest}
                />
                {searchAirportDest?.length > 2 && clickedDropDest && (
                  <div className="dropdown-box">
                    {airportsDataDest.length > 0 && !loadingAirports ? (
                      airportsDataDest.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleClickedAirport("dest", item)}
                          className="airport-names"
                        >
                          {item?.iata}
                          {item?.iata && <span> - </span>}
                          {item?.name}, {item?.state}, {item?.country}
                        </div>
                      ))
                    ) : (
                      <div className="airports-loader">
                        {loadingAirports ? (
                          <Spinner size="sm" animation="border" />
                        ) : (
                          "No airport found"
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Transfer Airports */}
              <div className="transfer-airports-row">
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Transfer 1"
                    value={
                      searchAirportTrans1?.length > 20
                        ? searchAirportTrans1.slice(0, 20) + "..."
                        : searchAirportTrans1
                    }
                    onChange={handleAirportTrans1}
                  />
                  {searchAirportTrans1?.length > 2 && clickedDropTrans1 && (
                    <div className="dropdown-box">
                      {airportsDataTrans1.length > 0 && !loadingAirports ? (
                        airportsDataTrans1.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              handleClickedAirport("trans1", item)
                            }
                            className="airport-names"
                          >
                            {item?.iata}
                            {item?.iata && <span> - </span>}
                            {item?.name}, {item?.state}, {item?.country}
                          </div>
                        ))
                      ) : (
                        <div className="airports-loader">
                          {loadingAirports ? (
                            <Spinner size="sm" animation="border" />
                          ) : (
                            "No airport found"
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {trans1err && (
                    <p className="error-msg-calc">{trans1err}</p>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Transfer 2"
                    value={
                      searchAirportTrans2?.length > 20
                        ? searchAirportTrans2.slice(0, 20) + "..."
                        : searchAirportTrans2
                    }
                    onChange={handleAirportTrans2}
                  />
                  {searchAirportTrans2?.length > 2 && clickedDropTrans2 && (
                    <div className="dropdown-box">
                      {airportsDataTrans2.length > 0 && !loadingAirports ? (
                        airportsDataTrans2.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              handleClickedAirport("trans2", item)
                            }
                            className="airport-names"
                          >
                            {item?.iata}
                            {item?.iata && <span> - </span>}
                            {item?.name}, {item?.state}, {item?.country}
                          </div>
                        ))
                      ) : (
                        <div className="airports-loader">
                          {loadingAirports ? (
                            <Spinner size="sm" animation="border" />
                          ) : (
                            "No airport found"
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {trans2err && (
                    <p className="error-msg-calc">{trans2err}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Seat Type */}
            <div className="field-group">
              <label>Seat Type</label>
              <div className="calculator--radio-button-holder">
                <ButtonGroup
                  aria-label="house"
                  name="seatType"
                  className="houseisrent"
                >
                  {["Economy", "Premium", "FirstClass"].map((type) => (
                    <ToggleButton
                      key={type}
                      type="radio"
                      checked={seatType === type}
                      onClick={() =>
                        handleCalculateCarbonTrans("seatType", type)
                      }
                      className={
                        seatType === type
                          ? "active form-control-label"
                          : "form-control-label"
                      }
                    >
                      {type === "FirstClass" ? "First Class" : type}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </div>
            </div>
          </>
        )}

        {/* ByRoad Section */}
        {travelSelection === "ByRoad" && (
          <>
            {/* Transport Mode */}
            <div className="field-group">
              <label>Transportation to the event</label>
              <div className="calculator--radio-button-holder">
                <ButtonGroup
                  aria-label="house"
                  name="eventTransportMode"
                  className="houseisrent"
                >
                  {[
                    { val: "RentalCar", label: "Rental Car" },
                    { val: "Taxi", label: "Taxi" },
                    { val: "EV", label: "EV" },
                    { val: "RideShare", label: "Ride Share" },
                    { val: "Cars", label: "Cars" },
                    { val: "PublicTransport", label: "Public Transport" },
                    { val: "Mix", label: "Mix" },
                  ].map(({ val, label }) => (
                    <ToggleButton
                      key={val}
                      type="radio"
                      checked={eventTransportMode === val}
                      onClick={() =>
                        handleCalculateCarbonTrans("eventTransportMode", val)
                      }
                      className={
                        eventTransportMode === val
                          ? "active form-control-label"
                          : "form-control-label"
                      }
                    >
                      {label}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </div>
            </div>

            {/* Distance to destination */}
            <div className="field-group">
              <label>Distance To The Destination</label>
              <div className="calculator--radio-button-holder">
                <ButtonGroup
                  aria-label="distanceDest"
                  className="houseisrent"
                >
                  {[
                    "1\u2013200 Km",
                    "201-350 Km",
                    "351-500 Km",
                    "501-650 Km",
                    "Over 650 Km",
                  ].map((dist) => (
                    <ToggleButton
                      key={dist}
                      type="radio"
                      checked={distEventTravel === dist}
                      onClick={() =>
                        handleCalculateCarbonTrans("distEventTravel", dist)
                      }
                      className={
                        distEventTravel === dist
                          ? "active form-control-label"
                          : "form-control-label"
                      }
                    >
                      {dist}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Exhibitor view
  return (
    <div className="mobile-step-content">
      {/* Company Code */}
      <div className="field-group">
        <label>Company Code</label>
        <input
          type="text"
          placeholder="Enter Company Code"
          value={companyCode}
          onChange={(e) => setCompanyCode(e.target.value)}
        />
        {companyCode?.length !== 8 && (
          <span className="optional-text">(optional)</span>
        )}
        {companyCode?.length === 8 && (
          <>
            {theValidField ? (
              <span className="valid-text">Valid Code</span>
            ) : (
              <span className="invalid-text">Invalid Code</span>
            )}
          </>
        )}
      </div>

      {/* Company Name */}
      <div className="field-group">
        <label>Company Name</label>
        <input
          type="text"
          placeholder="Enter Company Name"
          value={companyName}
          readOnly
        />
      </div>

      {/* Exhibit Space Size */}
      <div className="field-group">
        <label>Exhibit Space Size (sq ft)</label>
        <div className="calculator--radio-button-holder">
          <ButtonGroup
            aria-label="house"
            name="exhibitSpace"
            className="houseisrent"
          >
            {[50, 100, 200, 400, 600, 900, 1500].map((size) => (
              <ToggleButton
                key={size}
                type="radio"
                checked={exhibitSpace === size}
                onClick={() =>
                  handleCalculateCarbonTrans("exhibitSpace", size)
                }
                className={
                  exhibitSpace === size
                    ? "active form-control-label"
                    : "form-control-label"
                }
              >
                {size === 1500 ? "1500+" : size}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>
      </div>

      {/* Group selection (Fashion only) */}
      {eventType === "Fashion" && (
        <div className="field-group">
          <label>Please Specify Group</label>
          <div className="calculator--radio-button-holder">
            <ButtonGroup
              aria-label="house"
              name="selectedGroup"
              className="houseisrent"
            >
              {[
                { val: "designer", label: "Designer Group" },
                { val: "brand", label: "Brand Group" },
                { val: "buyer", label: "Buyer Group" },
                { val: "press", label: "Press" },
              ].map(({ val, label }) => (
                <ToggleButton
                  key={val}
                  type="radio"
                  checked={selectedGroup === val}
                  onClick={() =>
                    handleCalculateCarbonTrans("selectedGroup", val)
                  }
                  className={
                    selectedGroup === val
                      ? "active form-control-label"
                      : "form-control-label"
                  }
                >
                  {label}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>
        </div>
      )}

      {/* People sliders */}
      <div className="field-group">
        <label>Num of People Attending the party</label>
        <div className="transport-slider-holder">
          <p>0</p>
          <SliderCustom
            min={0}
            max={50}
            initValue={peopleNum}
            onChange={handlePeople}
            item="peopleData"
          />
          <p>50</p>
        </div>
      </div>

      <div className="field-group">
        <label>People travelling by air</label>
        <div className="transport-slider-holder">
          <p>0</p>
          <SliderCustom
            min={0}
            max={peopleNum}
            initValue={peopleByAir}
            onChange={handlePeople}
            item="airData"
          />
          <p>{peopleNum}</p>
        </div>
      </div>

      <div className="field-group">
        <label>People travelling by road</label>
        <div className="transport-slider-holder">
          <p>0</p>
          <SliderCustom
            min={0}
            max={peopleNum - peopleByAir}
            initValue={peopleByRoad}
            onChange={handlePeople}
            item="roadData"
          />
          <p>{peopleNum - peopleByAir}</p>
        </div>
      </div>
    </div>
  );
}
