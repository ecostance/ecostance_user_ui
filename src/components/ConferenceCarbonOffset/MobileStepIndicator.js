import React from "react";

const steps = ["Event Info", "Traveling To", "Local"];

export default function MobileStepIndicator({ currentStep }) {
  return (
    <div className="m-stepper">
      {steps.map((label, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <div className="m-stepper__track">
              <div
                className={
                  "m-stepper__track-fill" +
                  (idx <= currentStep ? " m-stepper__track-fill--done" : "")
                }
              />
            </div>
          )}
          <span
            className={
              "m-stepper__label" +
              (idx === currentStep
                ? " m-stepper__label--active"
                : idx < currentStep
                ? " m-stepper__label--done"
                : "")
            }
          >
            {label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
