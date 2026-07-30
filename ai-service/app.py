from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from collections import defaultdict
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

def predict_next_month(usage_data):
    """
    usage_data: list of {"material": str, "usedQuantity": int, "usedDate": "YYYY-MM-DD"}
    Returns predictions for each material.
    """
    # Group usage by material and month
    monthly = defaultdict(lambda: defaultdict(int))
    for record in usage_data:
        try:
            date = datetime.strptime(record["usedDate"], "%Y-%m-%d")
            month_key = date.strftime("%Y-%m")
            monthly[record["material"]][month_key] += record["usedQuantity"]
        except (KeyError, ValueError):
            continue

    predictions = []
    for material, month_data in monthly.items():
        sorted_months = sorted(month_data.keys())
        values = [month_data[m] for m in sorted_months]

        if len(values) < 2:
            predicted = int(values[0] * 1.1) if values else 0
        else:
            # Simple linear regression
            x = np.arange(len(values), dtype=float)
            y = np.array(values, dtype=float)
            slope = np.polyfit(x, y, 1)[0]
            predicted = max(0, int(y[-1] + slope))

        avg = int(np.mean(values))
        trend = "📈 Increasing" if len(values) >= 2 and values[-1] > values[-2] else \
                "📉 Decreasing" if len(values) >= 2 and values[-1] < values[-2] else "➡️ Stable"

        predictions.append({
            "material": material,
            "predictedNextMonth": predicted,
            "averageMonthly": avg,
            "trend": trend,
            "monthsAnalyzed": len(values),
        })

    return sorted(predictions, key=lambda x: x["predictedNextMonth"], reverse=True)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "usageRecords" not in data:
        return jsonify({"error": "usageRecords required"}), 400
    result = predict_next_month(data["usageRecords"])
    return jsonify({"predictions": result, "generatedAt": datetime.now().isoformat()})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(port=5000, debug=False)
