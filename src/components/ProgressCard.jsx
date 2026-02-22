import React from "react";
import "./progress.css";

const ProgressCard = ({ currentStep = 1 }) => {
  const steps = [
    "Fugitive Methane",
    "Electricity Usage",
    "Diesel Consumption",
    "Explosives & Others"
  ];

  return (
    <div className="progress-card">
      <h3>Emission Calculation</h3>

      <div className="progress-steps">
        {steps.map((step, index) => (
          <div key={index} className="progress-item">
            <div
              className={`circle ${
                currentStep === index + 1
                  ? "active"
                  : currentStep > index + 1
                  ? "completed"
                  : ""
              }`}
            >
              {index + 1}
            </div>

            <span
              className={`step-label ${
                currentStep === index + 1 ? "active-text" : ""
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressCard;