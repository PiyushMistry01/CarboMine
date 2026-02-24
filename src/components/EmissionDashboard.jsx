import React from "react";
import "./dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import { auth,db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const EmissionDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mineName, setMineName] = useState("");

  useEffect(() => {
  const fetchMine = async () => {
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMineName(docSnap.data().mineInfo?.name);
      }
    }
  };

  fetchMine();
}, []);

  const { methane = 0, diesel = 0, electricity = 0, explosives = 0,} =
    location.state || {};

  const total = methane + diesel + electricity + explosives;

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const chartData = [
    { name: "Methane", value: methane },
    { name: "Diesel", value: diesel },
    { name: "Electricity", value: electricity },
    { name: "Explosives", value: explosives },
  ];

  const COLORS = ["#FBAF00", "#FFD639", "#FFA3AF", "#007CBE"];

  const maxEmission = chartData.reduce((prev, current) =>
    prev.value > current.value ? prev : current
  );

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2 className="logo">Emission Summary - {mineName}</h2>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </nav>

      {/* ---------- Summary Cards ---------- */}
      <div className="card-grid">
        {chartData.map((item, index) => (
          <div className="emission-card1" key={index}>
            <h2>{item.name}</h2>
            <p>{item.value.toFixed(2)} T</p>
          </div>
        ))}

        <div className="emission-card2">
          <h2>Total</h2>
          <p>{total.toFixed(2)} T</p>
        </div>
      </div>

      {/* ---------- Graph Section ---------- */}
      <h2 className="analytics">Analytics</h2>
      <div className="graph-section">
        <div className="graph-box">
          <h3>Emission Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="graph-box">
          <h3>Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FBAF00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------- Insights ---------- */}
      <div className="insight-box">
        <h3>Insights</h3>
        <p>
          {maxEmission.name} contributes the highest emissions.
          Consider optimizing operations in this area.
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