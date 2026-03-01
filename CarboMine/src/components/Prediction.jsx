import React, { useState } from "react";
import "./prediction.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useLocation, useNavigate } from "react-router-dom";


const Prediction = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [futureData, setFutureData] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Upload CSV file");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const future = Object.values(data.future_prediction);
      const anomalyRows = Object.values(data.anomalies);

      setFutureData(future);
      setAnomalies(anomalyRows);
    } catch (err) {
      console.error(err);
      alert("Error in prediction");
    }

    setLoading(false);
  };

  const weeklyData = futureData.map((item, index) => ({
  ...item,
  week: Math.floor(index / 7) + 1,
}));

  const handleAskAI = async () => {
  console.log("Ask AI clicked");

  setAiLoading(true);

  try {
    if (futureData.length === 0) {
      return alert("Please run prediction first");
    }

    const response = await fetch("http://127.0.0.1:5000/ask-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        predictions: futureData.slice(0, 100),  // reduce size
        anomalies: anomalies,
      })
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    navigate("/ai-summary", { state: { analysis: data.analysis } });

  } catch (error) {
    console.error(error);
    alert("AI analysis failed");
  }

  setAiLoading(false);
};

  return (
    <div className="prediction-container">
      <h2>Prediction & Anomaly Detection</h2>

      <div className="upload-box">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload}>
          {loading ? "Processing..." : "Upload & Predict"}
        </button>
      </div>

      {/* Forecast Graph */}
      {futureData.length > 0 && (
        <div className="graph-box">
          <h3>Next Year Emission Forecast</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weeklyData}>
              <XAxis
                dataKey="week"
                label={{ value: "Weeks", position: "insideBottom", offset: -5 }}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(label, payload) => {
                    if (payload && payload.length) {
                    return `Date: ${new Date(payload[0].payload.Date).toDateString()}`;
                    }
                    return "";
                }}
                />
              <Line
                type="monotone"
                dataKey="Total_Emissions (tCO2e)"
                stroke="#00E5FF"
                dot={false}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Anomaly Table */}
      {anomalies.length > 0 && (
        <div className="anomaly-box">
          <h3>Detected Anomalies</h3>
          <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Emission</th>
                <th>Cause</th>
            </tr>
            </thead>
            <tbody>
            {anomalies.map((row, index) => (
                <tr key={index}>
                <td>{row.Date}</td>
                <td>{row["Total_Emissions (tCO2e)"]}</td>
                <td style={{ color: "#ff5252" }}>{row.Cause}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}

        {futureData.length > 0 && (
          <button onClick={handleAskAI} className="ask-ai-btn">
            {aiLoading ? "Generating..." : "Ask AI"}
          </button>
        )}
    </div>
  );
};

export default Prediction;

