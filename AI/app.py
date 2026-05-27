import json
import os

import joblib
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")


@tf.keras.utils.register_keras_serializable()
class CustomActivationLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.nn.swish(inputs)


@tf.keras.utils.register_keras_serializable()
def custom_loss(y_true, y_pred):
    huber = tf.keras.losses.Huber(delta=1.0)(y_true, y_pred)
    mae = tf.reduce_mean(tf.abs(y_true - y_pred))
    return huber + (0.1 * mae)


class InferenceRequest(BaseModel):
    features: list[float] = Field(..., min_length=1)


app = FastAPI(title="Retail Demand Forecasting API", version="1.1")

model = tf.keras.models.load_model(
    os.path.join(BASE_DIR, "retail_prediction_model.keras"),
    custom_objects={"CustomActivationLayer": CustomActivationLayer, "custom_loss": custom_loss},
)
x_scaler = joblib.load(os.path.join(ARTIFACTS_DIR, "x_scaler.joblib"))
y_scaler = joblib.load(os.path.join(ARTIFACTS_DIR, "y_scaler.joblib"))

with open(os.path.join(ARTIFACTS_DIR, "feature_columns.json"), "r", encoding="utf-8") as f:
    feature_columns = json.load(f)


@app.get("/")
def home():
    return {
        "status": "ok",
        "model": "Retail_Optimization_Model",
        "feature_count": len(feature_columns),
        "output": "prediction_quantity",
    }


@app.post("/predict")
def predict(request: InferenceRequest):
    if len(request.features) != len(feature_columns):
        raise HTTPException(
            status_code=400,
            detail=f"Expected {len(feature_columns)} features, got {len(request.features)}",
        )

    try:
        raw_features = np.array([request.features], dtype=np.float32)
        scaled_features = x_scaler.transform(raw_features).astype(np.float32)
        prediction_scaled = model.predict(scaled_features, verbose=0)
        prediction_quantity = y_scaler.inverse_transform(prediction_scaled)[0][0]

        return {
            "prediction_quantity": max(0, float(prediction_quantity)),
            "prediction_scaled": float(prediction_scaled[0][0]),
            "feature_count": len(feature_columns),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
