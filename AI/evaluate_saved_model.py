import json
import os

import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder

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


def load_dataset():
    file_path = os.path.join(BASE_DIR, "..", "data-science", "retail_feature_engineered.csv")
    df = pd.read_csv(file_path, sep=";")

    for col in ["YearMonth", "Status_Stok", "Product"]:
        if col in df.columns:
            df.drop(columns=[col], inplace=True)

    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.dropna(inplace=True)

    if "Month" in df.columns:
        df["Month_Sin"] = np.sin(2 * np.pi * df["Month"] / 12)
        df["Month_Cos"] = np.cos(2 * np.pi * df["Month"] / 12)

    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = LabelEncoder().fit_transform(df[col].astype(str))

    return df


def main():
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    df = load_dataset()

    target_column = "Qty_Sold"
    X = df.drop(columns=[target_column])
    y = df[target_column]
    feature_columns = X.columns.tolist()

    with open(os.path.join(ARTIFACTS_DIR, "feature_columns.json"), "w", encoding="utf-8") as f:
        json.dump(feature_columns, f, indent=2)

    x_scaler = joblib.load(os.path.join(ARTIFACTS_DIR, "x_scaler.joblib"))
    y_scaler = joblib.load(os.path.join(ARTIFACTS_DIR, "y_scaler.joblib"))
    model = tf.keras.models.load_model(
        os.path.join(BASE_DIR, "retail_prediction_model.keras"),
        custom_objects={"CustomActivationLayer": CustomActivationLayer, "custom_loss": custom_loss},
    )

    X_scaled = x_scaler.transform(X).astype(np.float32)
    y_scaled = y_scaler.transform(y.values.reshape(-1, 1))
    pred_scaled = model.predict(X_scaled, verbose=0)
    pred_real = y_scaler.inverse_transform(pred_scaled)

    mae_scaled = mean_absolute_error(y_scaled, pred_scaled)
    mae_real = mean_absolute_error(y, pred_real)
    rmse_real = np.sqrt(mean_squared_error(y, pred_real))
    r2 = r2_score(y, pred_real)

    evaluation_report = {
        "mae_scaled": float(mae_scaled),
        "mae_original_qty": float(mae_real),
        "rmse_original_qty": float(rmse_real),
        "r2_score": float(r2),
        "r2_percent": float(r2 * 100),
        "meets_r2_85_percent": bool(r2 >= 0.85),
        "meets_mae_scaled_0_02": bool(mae_scaled <= 0.02),
        "target_column": target_column,
        "feature_count": len(feature_columns),
        "feature_columns": feature_columns,
    }

    with open(os.path.join(ARTIFACTS_DIR, "evaluation_report.json"), "w", encoding="utf-8") as f:
        json.dump(evaluation_report, f, indent=2)

    print(json.dumps(evaluation_report, indent=2))


if __name__ == "__main__":
    main()
