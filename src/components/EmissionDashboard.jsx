import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

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
  const [methane, setMethane] = useState(0);
  const [diesel, setDiesel] = useState(0);
  const [electricity, setElectricity] = useState(0);
  const [explosives, setExplosives] = useState(0);

  // ✅ Fetch Mine Name
  useEffect(() => {
    const fetchMine = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMineName(docSnap.data().mineInfo?.name);
      }
    };

    fetchMine();
  }, []);

  const downloadPDF = async () => {
  const element = document.querySelector(".dashboard-container");

  // ✅ Apply PDF mode temporarily
  element.classList.add("pdf-mode");

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("Emission_Report.pdf");

  // ❌ Remove PDF mode after download
  element.classList.remove("pdf-mode");
};

  // ✅ Fetch Latest Emission (if no location.state)
  useEffect(() => {
    const fetchLatestEmission = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // If coming from form, use location.state
      if (location.state) {
        setMethane(location.state.methane || 0);
        setDiesel(location.state.diesel || 0);
        setElectricity(location.state.electricity || 0);
        setExplosives(location.state.explosives || 0);
        return;
      }

      // Otherwise fetch latest from Firestore
      const emissionsRef = collection(db, "users", user.uid, "emissions");
      const q = query(emissionsRef, orderBy("createdAt", "desc"), limit(1));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setMethane(data.methane || 0);
        setDiesel(data.diesel || 0);
        setElectricity(data.electricity || 0);
        setExplosives(data.explosives || 0);
      }
    };

    fetchLatestEmission();
  }, [location.state]);

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

  const maxEmission =
    chartData.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    ) || chartData[0];

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2 className="logo">
          Emission Summary - {mineName || "Loading..."}
        </h2>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </nav>

      {/* Re-enter Button */}
      <button
        className="predict-btn"
        onClick={() => navigate("/profile")}
        style={{ marginBottom: "20px" }}
      >
        Re-enter Emission Values
      </button>

      {/* Summary Cards */}
      <div id="report-section">
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

      {/* Graph Section */}
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

      {/* Insights */}
      <div className="insight-box">
        <h3>Insights</h3>
        <p>
          {maxEmission.name} contributes the highest emissions.
          Consider optimizing operations in this area.
        </p>
      </div>
      </div>
      {/* Prediction */}
      <button className="pdf-btn" onClick={downloadPDF}>
         Download Emission Report
      </button>
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