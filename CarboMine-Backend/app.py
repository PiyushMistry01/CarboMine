from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from forecast import process_and_predict
import os
from dotenv import load_dotenv
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

# ==============================
# Load Environment Variables
# ==============================
load_dotenv()

# ==============================
# Initialize Flask App
# ==============================
app = Flask(__name__)
CORS(app)

# ==============================
# Upload + Prediction Route
# ==============================
@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["file"]
    path = "uploaded.csv"
    file.save(path)

    future, anomalies = process_and_predict(path)

    return jsonify({
        "future_prediction": future.to_dict(orient="records"),
        "anomalies": anomalies.to_dict(orient="records")
    })


# ==============================
# Ask AI Route
# ==============================
import requests

@app.route("/ask-ai", methods=["POST"])
def ask_ai():
    try:
        data = request.json

        predictions = data.get("predictions", [])
        anomalies = data.get("anomalies", [])
        raw_data = data.get("rawData", [])

        # Reduce dataset size drastically
        raw_sample = raw_data[:10]
        pred_sample = predictions[:10]
        anom_sample = anomalies[:5]

        avg_pred = sum(p["Total_Emissions (tCO2e)"] for p in predictions) / len(predictions) if predictions else 0
        max_pred = max(p["Total_Emissions (tCO2e)"] for p in predictions) if predictions else 0
        min_pred = min(p["Total_Emissions (tCO2e)"] for p in predictions) if predictions else 0

        prompt = f"""
        You are an ESG sustainability analyst for mining operations.

        Dataset summary:

        Average predicted emissions: {avg_pred:.2f} tCO2e
        Maximum predicted emissions: {max_pred:.2f} tCO2e
        Minimum predicted emissions: {min_pred:.2f} tCO2e
        Number of anomalies detected: {len(anomalies)}

        Return only these sections:
        Overall Emission Trend
        Risk Level
        ESG Risk Score
        Anomaly Analysis
        Business & Compliance Risks
        Sustainability Recommendations
        Executive Summary

        Limit the response upto 250 words.
        Do not include any other instructions or tasks.

        """

        # 🔥 LOCAL AI CALL
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "phi3:mini",
                "prompt": prompt,
                "stream": False
            }
        )

        result = response.json()

        return jsonify({
            "analysis": result["response"]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==============================
# Generate PDF Report Route
# ==============================
@app.route("/generate-report", methods=["POST"])
def generate_report():
    try:
        data = request.json
        analysis_text = data.get("analysis")

        file_path = "CarboMine_AI_Report.pdf"

        doc = SimpleDocTemplate(file_path)
        styles = getSampleStyleSheet()
        elements = []

        elements.append(
            Paragraph("CarboMine AI Emission Analysis Report", styles['Heading1'])
        )
        elements.append(Spacer(1, 0.5 * inch))

        # Split text into paragraphs
        for line in analysis_text.split("\n"):
            if line.strip():
                elements.append(Paragraph(line, styles['Normal']))
                elements.append(Spacer(1, 0.2 * inch))

        doc.build(elements)

        return send_file(file_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==============================
# Run App
# ==============================
if __name__ == "__main__":
    app.run(debug=True)