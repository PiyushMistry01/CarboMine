from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from forecast import process_and_predict
import os
from dotenv import load_dotenv
from google import genai
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

# ==============================
# Load Environment Variables
# ==============================
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# ✅ NEW Gemini Client (2026)
client = genai.Client(api_key=api_key)

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

        prompt = f"""
        You are an expert ESG and sustainability analyst.

        Analyze this mining carbon emission dataset.

        Historical Data:
        {raw_data}

        Future Predictions:
        {predictions}

        Detected Anomalies:
        {anomalies}

        Provide output STRICTLY in this format:

        ### Overall Emission Trend
        <content>

        ### Risk Level
        <Low / Medium / High>

        ### ESG Risk Score
        <score out of 100>

        ### Anomaly Analysis
        <content>

        ### Business & Compliance Risks
        <content>

        ### Sustainability Recommendations
        <content>

        ### Executive Summary
        <short summary>
        """

        # 🔥 LOCAL AI CALL
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
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