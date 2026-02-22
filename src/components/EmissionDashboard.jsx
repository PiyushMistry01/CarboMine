import React from "react";
import { useLocation } from "react-router-dom";
import "./profile.css";

const EmissionDashboard = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) return <h2>No Data</h2>;

  const {
    methane,
    diesel,
    electricity,
    explosives
  } = data;

  const total =
    methane + diesel + electricity + explosives;

  return (
    <div className="profile-container">

      <h1 style={{ margin: "30px" }}>Emission Dashboard</h1>

      {/* Cards */}
      <div style={{ display: "flex", gap: "20px", margin: "30px" }}>
        <div className="form-card">
          <h3>Total Emission</h3>
          <h2>{total.toFixed(2)} tonnes CO₂e</h2>
        </div>

        <div className="form-card">
          <h3>Methane</h3>
          <p>{methane.toFixed(2)}</p>
        </div>

        <div className="form-card">
          <h3>Diesel</h3>
          <p>{diesel.toFixed(2)}</p>
        </div>

        <div className="form-card">
          <h3>Electricity</h3>
          <p>{electricity.toFixed(2)}</p>
        </div>

        <div className="form-card">
          <h3>Explosives</h3>
          <p>{explosives.toFixed(2)}</p>
        </div>
      </div>

    </div>
  );
};

export default EmissionDashboard;