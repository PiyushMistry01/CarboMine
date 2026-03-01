from flask import Flask, request, jsonify
from flask_cors import CORS
from forecast import process_and_predict

app = Flask(__name__)

# ✅ THIS LINE FIXES CORS
CORS(app)

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

if __name__ == "__main__":
    app.run(debug=True)