import { useLocation } from "react-router-dom";
import "./AISummary.css";

const AISummary = () => {
  const location = useLocation();
  const analysis = location.state?.analysis;

  const downloadPDF = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CarboMine_AI_Report.pdf";
      a.click();
    } catch (error) {
      alert("Error generating report");
      console.error(error);
    }
  };

  return (
    <div className="ai-summary-container">
      <div className="ai-summary-card">
        <h2 className="ai-title">Emission Analysis Report</h2>

        {analysis ? (
          <div className="analysis-box">
            <p>{analysis}</p>
          </div>
        ) : (
          <p className="no-data">No analysis data available.</p>
        )}

        <button className="download-btn" onClick={downloadPDF}>
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default AISummary;