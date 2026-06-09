import React, { useState } from "react";
import { Spinner } from "react-bootstrap";

export default function MobileBottomBar({
  currentStep,
  totalCarbon,
  onBack,
  onNext,
  onContinue,
  continueClicked,
  // Expanded card props
  showCapitalName,
  showCapitalCarbon,
  perAttendieEmission,
  eventSelection,
}) {
  const [expanded, setExpanded] = useState(false);

  const displayCarbon = isNaN(totalCarbon) ? "0.00" : totalCarbon;
  const displayCapital = !showCapitalCarbon
    ? "0.00"
    : Number(showCapitalCarbon).toFixed(2);
  const displayAttendee =
    isNaN(perAttendieEmission) || perAttendieEmission === 0
      ? "0.00"
      : perAttendieEmission;

  return (
    <>
      {/* Overlay */}
      <div
        className={
          "mobile-bottom-overlay" +
          (expanded ? " mobile-bottom-overlay--visible" : "")
        }
        onClick={() => setExpanded(false)}
      />

      <div className="mobile-bottom-bar">
        {/* Pull-up chevron */}
        <div
          className={
            "mobile-bottom-bar__toggle" +
            (expanded ? " mobile-bottom-bar__toggle--flipped" : "")
          }
          onClick={() => setExpanded(!expanded)}
        >
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path
              d="M1 7L7 1L13 7"
              stroke="#999"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Expanded card */}
        <div
          className={
            "mobile-bottom-bar__expanded" +
            (expanded ? " mobile-bottom-bar__expanded--open" : "")
          }
        >
          <div className="mobile-expanded-card">
            {/* Header with forest image */}
            <div className="mobile-expanded-card__header">
              <img
                src="/assets/images/small-calculator-image.png"
                alt="carbon"
              />
              <div className="mobile-expanded-card__header-overlay">
                <span className="mobile-expanded-card__header-value">
                  {displayCarbon}
                </span>
                <span className="mobile-expanded-card__header-text">
                  My annual carbon footprint
                  <br />
                  Metric tons of carbon
                </span>
              </div>
            </div>

            {/* Per Person */}
            <div className="mobile-expanded-card__per-person">
              <span className="mobile-expanded-card__per-person-value">
                {displayCapital}
              </span>
              <span className="mobile-expanded-card__per-person-label">
                Per Person In {showCapitalName || "---"}
              </span>
            </div>

            {/* Event Emissions */}
            <div className="mobile-expanded-card__emissions">
              <div className="mobile-expanded-card__emissions-title">
                Event Emissions
              </div>
              <div className="mobile-expanded-card__emissions-row">
                <div className="mobile-expanded-card__emissions-item">
                  <span className="mobile-expanded-card__emissions-item-value">
                    {displayAttendee}
                  </span>
                  <span className="mobile-expanded-card__emissions-item-label">
                    Per Attendee Emissions
                  </span>
                </div>
                <div className="mobile-expanded-card__emissions-item">
                  <span className="mobile-expanded-card__emissions-item-value">
                    {displayCarbon}
                  </span>
                  <span className="mobile-expanded-card__emissions-item-label">
                    {eventSelection === "Attendie"
                      ? "My Event Emissions"
                      : "Our Event Emissions"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Collapsed bar */}
        <div
          className="mobile-bottom-bar__collapsed"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="mobile-bottom-bar__carbon">
            <span className="mobile-bottom-bar__carbon-value">
              {displayCarbon}
            </span>
            <span className="mobile-bottom-bar__carbon-label">
              Metric tons CO2
            </span>
          </div>
          <div
            className="mobile-bottom-bar__actions"
            onClick={(e) => e.stopPropagation()}
          >
            {currentStep > 0 && (
              <button
                className="mobile-bottom-bar__btn mobile-bottom-bar__btn--back"
                onClick={onBack}
              >
                Back
              </button>
            )}
            {currentStep < 2 ? (
              <button
                className="mobile-bottom-bar__btn mobile-bottom-bar__btn--next"
                onClick={onNext}
              >
                Next
              </button>
            ) : (
              <button
                className="mobile-bottom-bar__btn mobile-bottom-bar__btn--continue"
                onClick={onContinue}
                disabled={continueClicked}
              >
                {continueClicked ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Continue"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
