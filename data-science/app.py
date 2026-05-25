
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib

app = FastAPI(title="Retail Demand Forecasting API", version="1.0")

# Input Schema disesuaikan dengan dimensi data X (misal data memiliki 18 fitur setelah engineering)
class InferenceRequest(BaseModel):
    features: list # List bertipe float dengan panjang sesuai jumlah kolom fitur X

# Load Model dengan custom_objects
try:
    model = tf.keras.models.load_model(
        "retail_prediction_model.keras",
        custom_objects={"CustomActivationLayer": CustomActivationLayer if 'CustomActivationLayer' in globals() else None, "custom_loss": custom_loss}
    )
except Exception:
    # Fallback jika di luar environment notebook utama
    @tf.keras.utils.register_keras_serializable()
    class CustomActivationLayer(tf.keras.layers.Layer):
        def call(self, inputs): return tf.nn.swish(inputs)

    @tf.keras.utils.register_keras_serializable()
    def custom_loss(y_true, y_pred): return tf.reduce_mean(tf.abs(y_true - y_pred))

    model = tf.keras.models.load_model(
        "retail_prediction_model.keras",
        custom_objects={"CustomActivationLayer": CustomActivationLayer, "custom_loss": custom_loss}
    )

@app.get("/")
def home():
    return {"status": "API is Running", "model": "Retail_Optimization_Model"}

@app.post("/predict")
def predict(request: InferenceRequest):
    try:
        input_data = np.array([request.features], dtype=np.float32)
        prediction_scaled = model.predict(input_data)

        # Catatan: Di produksi, pastikan membawa file y_scaler.bin untuk inverse_transform.
        # Output di bawah ini mengembalikan hasil prediksi dalam bentuk float mentah.
        return {
            "prediction_scaled": float(prediction_scaled[0][0]),
            "message": "Gunakan y_scaler inversi untuk mengembalikan nilai asli kuantitas unit."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
