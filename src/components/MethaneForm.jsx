import React, { useState } from "react";
import "./profile.css";

const MethaneForm = ({ step,setStep }) => {

  // -------- Fugitive Methane --------
  const [coal, setCoal] = useState("");
  const emissionFactor = 15;
  const density = 0.67;

  const methane =
    coal ? (coal * emissionFactor * density) / 1000 : 0;

  // -------- Diesel --------
  const [diesel, setDiesel] = useState("");
  const dieselEF = 2.68;
  const dieselEmission =
    diesel ? (diesel * dieselEF) / 1000 : 0;

  // -------- Electricity --------
  const [electricity, setElectricity] = useState("");
  const electricityEF = 0.82; // kg CO2 per kWh (India avg)
  const electricityEmission =
    electricity ? (electricity * electricityEF) / 1000 : 0;

  // -------- Explosives --------
  const [explosives, setExplosives] = useState("");
  const explosiveEF = 0.0005; // tonne CO2 per kg (approx)
  const explosiveEmission =
    explosives ? explosives * explosiveEF : 0;

  return (
    <div className="form-card">

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h2>Fugitive Methane Emission</h2>

          <p className="form-info">
            Emission Factor = 15 m³/tonne |
            Methane Density = 0.67 kg/m³
          </p>

          <div className="form-input">
            <input
              type="number"
              placeholder="Total Coal Produced (tonnes)"
              value={coal}
              onChange={(e) => setCoal(e.target.value)}
            />
          </div>

          {coal && (
            <p className="result">
              Methane Emission = <strong>{methane.toFixed(2)} tonnes CO₂e</strong>
            </p>
          )}

          <button
            className="next-btn"
            disabled={!coal}
            onClick={() => setStep(2)}
          >
            Next
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h2>Operational Fuel (Diesel)</h2>

          <p className="form-info">
            Emission Factor = 2.68 kg CO₂ / Liter
          </p>

          <div className="form-input">
            <input
              type="number"
              placeholder="Diesel Consumed (Liters)"
              value={diesel}
              onChange={(e) => setDiesel(e.target.value)}
            />
          </div>

          {diesel && (
            <p className="result">
              Diesel Emission = <strong>{dieselEmission.toFixed(2)} tonnes CO₂e</strong>
            </p>
          )}

          <div className="form-buttons">
            <button className="prev-btn" onClick={() => setStep(1)}>Previous</button>
            <button className="next-btn" disabled={!diesel} onClick={() => setStep(3)}>Next</button>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <h2>Electricity Consumption</h2>

          <p className="form-info">
            Emission Factor = 0.82 kg CO₂ / kWh
          </p>

          <div className="form-input">
            <input
              type="number"
              placeholder="Electricity Used (kWh)"
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
            />
          </div>

          {electricity && (
            <p className="result">
              Electricity Emission = <strong>{electricityEmission.toFixed(2)} tonnes CO₂e</strong>
            </p>
          )}

          <div className="form-buttons">
            <button className="prev-btn" onClick={() => setStep(2)}>Previous</button>
            <button className="next-btn" disabled={!electricity} onClick={() => setStep(4)}>Next</button>
          </div>
        </>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <>
          <h2>Explosives Used</h2>

          <p className="form-info">
            Emission Factor ≈ 0.0005 tonnes CO₂ per kg
          </p>

          <div className="form-input">
            <input
              type="number"
              placeholder="Explosives Used (kg)"
              value={explosives}
              onChange={(e) => setExplosives(e.target.value)}
            />
          </div>

          {explosives && (
            <p className="result">
              Explosive Emission = <strong>{explosiveEmission.toFixed(2)} tonnes CO₂e</strong>
            </p>
          )}

          <div className="form-buttons">
            <button className="prev-btn" onClick={() => setStep(3)}>Previous</button>
            <button className="next-btn" disabled={!explosives}>
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MethaneForm;