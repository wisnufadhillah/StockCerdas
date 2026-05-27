# StockCerdas AI Model Card

## Purpose

Model ini memprediksi kebutuhan penjualan/restock produk berdasarkan dataset retail yang sudah melalui feature engineering.

## Model

- Framework: TensorFlow/Keras
- API: Keras Functional API
- Custom Layer: `CustomActivationLayer`
- Custom Loss: `custom_loss`
- Custom Callback: `TrainingLoggerCallback`
- Training Loop: custom loop dengan `tf.GradientTape`
- Output training: `retail_prediction_model.keras` dan `saved_model_prod/`

## Artifacts

- `retail_prediction_model.keras`: model Keras untuk inference FastAPI
- `saved_model_prod/`: SavedModel export
- `artifacts/x_scaler.joblib`: scaler input
- `artifacts/y_scaler.joblib`: scaler target untuk inverse transform
- `artifacts/feature_columns.json`: urutan fitur input
- `artifacts/evaluation_report.json`: metrik final
- `logs/fit/`: TensorBoard event logs

## REST API

- Framework: FastAPI
- File: `AI/app.py`
- Health endpoint: `GET /`
- Prediction endpoint: `POST /predict`
- Output utama: `prediction_quantity` dalam unit asli

## Generative AI Secondary Feature

Generative AI tidak dipakai sebagai model forecasting utama. Model utama tetap TensorFlow. OpenRouter dipakai sebagai fitur tambahan untuk membuat rekomendasi restock atau insight bisnis dari hasil prediksi model.

- Provider rekomendasi awal: OpenRouter
- Model default: `openai/gpt-oss-120b:free`
- Environment variable: `OPENROUTER_API_KEY`
- Contoh output: rekomendasi tindakan restock, alasan singkat, dan catatan risiko

## Metrics

Lihat `artifacts/evaluation_report.json` untuk nilai final:

- `r2_percent`: dipakai sebagai akurasi regresi
- `mae_scaled`: MAE pada data target ternormalisasi
- `mae_original_qty`: MAE dalam unit kuantitas asli
- `meets_r2_85_percent`: status minimal 85%
- `meets_mae_scaled_0_02`: status MAE maksimal 0,02

## Run Training

```bash
cd AI
python notebook_code.py
```

## Run Inference API

```bash
cd AI
uvicorn app:app --reload --port 8000
```

## Open TensorBoard

```bash
cd AI
tensorboard --logdir logs/fit
```
