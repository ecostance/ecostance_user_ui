import React from "react";
import { ButtonGroup } from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";

export default function MobileStepLocal({
  transportMode,
  distTravel,
  theStay,
  expenses,
  handleCalculateCarbonTrans,
}) {
  return (
    <div className="mobile-step-content">
      {/* Local Transportation */}
      <div className="field-group">
        <label>Local Transportation</label>
        <div className="calculator--radio-button-holder">
          <ButtonGroup
            aria-label="house"
            name="transportMode"
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
                checked={transportMode === val}
                onClick={() =>
                  handleCalculateCarbonTrans("transportMode", val)
                }
                className={
                  transportMode === val
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

      {/* Local Distance Traveled Per Day */}
      <div className="field-group">
        <label>Local Distance Traveled Per day</label>
        <div className="calculator--radio-button-holder">
          <ButtonGroup
            aria-label="house"
            className="houseisrent"
          >
            {[
              "1\u201325 Km",
              "26-50 Km",
              "51-100 Km",
              "101-200 Km",
              "Over 201 Km",
            ].map((dist) => (
              <ToggleButton
                key={dist}
                type="radio"
                checked={distTravel === dist}
                onClick={() =>
                  handleCalculateCarbonTrans("distTravel", dist)
                }
                className={
                  distTravel === dist
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

      {/* Stay */}
      <div className="field-group">
        <label>Stay</label>
        <div className="calculator--radio-button-holder">
          <ButtonGroup
            aria-label="house"
            name="theStay"
            className="houseisrent"
          >
            {[
              { val: "Hotel", label: "Hotel" },
              { val: "VacationRental", label: "VacationRental" },
              { val: "Guesthouse", label: "Guesthouse" },
              { val: "Apartment", label: "Apartment" },
              { val: "Motel", label: "Motel" },
              { val: "Home", label: "My Home" },
            ].map(({ val, label }) => (
              <ToggleButton
                key={val}
                type="radio"
                checked={theStay === val}
                onClick={() =>
                  handleCalculateCarbonTrans("theStay", val)
                }
                className={
                  theStay === val
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

      {/* Food Cost per day */}
      <div className="field-group">
        <label>Food Cost per day</label>
        <div className="calculator--radio-button-holder">
          <ButtonGroup
            aria-label="house"
            name="userExpense"
            className="houseisrent"
          >
            {[
              "Less than $50",
              "$51-$100",
              "$101-$200",
              "More than $201",
            ].map((cost) => (
              <ToggleButton
                key={cost}
                type="radio"
                checked={expenses === cost}
                onClick={() =>
                  handleCalculateCarbonTrans("userExpense", cost)
                }
                className={
                  expenses === cost
                    ? "active form-control-label"
                    : "form-control-label"
                }
              >
                {cost}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
