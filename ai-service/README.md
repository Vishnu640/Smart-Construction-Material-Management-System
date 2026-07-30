# AI Demand Prediction Service

Python Flask microservice that predicts next-month material requirements using linear regression on historical usage data.

## Setup

```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

Runs on: `http://localhost:5000`

## How it works

1. Spring Boot `/api/ai/predict` fetches all usage records from MySQL
2. Sends them to this service at `POST /predict`
3. Service groups usage by material + month, runs linear regression
4. Returns predicted quantity for next month per material

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Run demand prediction |
| GET | `/health` | Health check |
