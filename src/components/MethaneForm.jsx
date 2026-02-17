import React, { useState } from "react";
import "./profile.css";

const MethaneForm = () => {
  const [coal, setCoal] = useState("");

  const emissionFactor = 15; // m3/tonne
  const density = 0.67; // kg/m3

  const methane =
    coal ? coal * emissionFactor * density : 0;

  return (
    <div className="form-card">

      <h2>Fugitive Methane Emission</h2>

      <p className="form-info">
        Emission Factor = 15 m³/tonne  
        <br />
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
          Methane Emission = <strong>{methane} kg</strong>
        </p>
      )}

      <button className="next-btn">
        Next
      </button>

    </div>
  );
};

export default MethaneForm;
