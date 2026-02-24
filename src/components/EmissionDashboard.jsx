import React from "react";
import "./dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";

const EmissionDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { methane, diesel, electricity, explosives } =
    location.state || {};

  const total =
    methane + diesel + electricity + explosives;

  const handleSignOut = async () => {
      await signOut(auth);
      navigate("/login");
    };  

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2 className="logo">Emission Summary</h2>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </nav>

      {/* ---------- Summary Cards ---------- */}
      <div className="card-grid">

        <div className="emission-card1">
          <h2>Methane</h2>
          <p>{methane?.toFixed(2)} T</p>
        </div>

        <div className="emission-card1">
          <h2>Diesel</h2>
          <p>{diesel?.toFixed(2)} T</p>
        </div>

        <div className="emission-card1">
          <h2>Electricity</h2>
          <p>{electricity?.toFixed(2)} T</p>
        </div>

        <div className="emission-card1">
          <h2>Explosives</h2>
          <p>{explosives?.toFixed(2)} T</p>
        </div>

        <div className="emission-card2">
          <h2>Total</h2>
          <p>{total?.toFixed(2)} T</p>
        </div>

      </div>

      {/* ---------- Graph Section ---------- */}
      <div className="graph-section">

        <div className="graph-box">
          <h3>Emission Distribution</h3>
          {/* Pie chart later */}
        </div>

        <div className="graph-box">
          <h3>Comparison</h3>
          {/* Bar chart later */}
        </div>

      </div>

      {/* ---------- Insights ---------- */}
      <div className="insight-box">
        <h3>Insights</h3>
        <p>
          Diesel contributes the highest emissions.
          Focus on fuel efficiency and optimization.
        </p>
      </div>

      {/* ---------- Prediction ---------- */}
      <button
        className="predict-btn"
        onClick={() => navigate("/prediction")}
      >
        Go to Prediction & Anomaly Detection
      </button>

    </div>
  );
};

export default EmissionDashboard;