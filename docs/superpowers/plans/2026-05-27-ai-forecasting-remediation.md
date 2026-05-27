# AI Forecasting Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat bagian AI stock forecasting benar-benar siap dinilai dan dipakai aplikasi: model, scaler, REST API mandiri, inference, integrasi backend/frontend, Generative AI insight, TensorBoard logs, dan laporan evaluasi tersedia jelas di repository akhir.

**Architecture:** Model TensorFlow tetap berada di folder `AI`, dengan training script sebagai sumber utama artefak produksi. FastAPI AI service menjadi REST API mandiri untuk melayani model machine learning: menerima fitur mentah/terstruktur, melakukan preprocessing yang sama dengan training, lalu mengembalikan prediksi dalam unit asli agar backend tidak menebak dengan `prediction_scaled * 100`. Backend tetap punya fallback untuk demo, tetapi request dari UI harus mengirim atau membentuk fitur yang valid agar jalur AI benar-benar terpakai. Generative AI via OpenRouter dipakai sebagai fitur sekunder untuk menghasilkan rekomendasi restock/insight bisnis berdasarkan output model, bukan menggantikan model forecasting TensorFlow.

**Tech Stack:** TensorFlow/Keras, scikit-learn, joblib, FastAPI, Express.js, Next.js/React, PostgreSQL, OpenRouter API.

---

## Current Findings

- `AI/notebook_code.py` sudah memakai Keras Functional API, custom layer, custom loss, custom callback, custom loop `tf.GradientTape`, TensorBoard scalar logs, dan export `.keras`/SavedModel.
- `AI/retail_prediction_model.keras`, `AI/saved_model_prod/`, dan `AI/logs/` ada di lokal, tetapi ignored oleh `AI/.gitignore`, sehingga belum masuk repository akhir.
- `x_scaler` dan `y_scaler` belum disimpan sebagai artefak. Inference produksi tidak bisa melakukan scaling input dan inverse transform output dengan benar.
- `AI/app.py` mengembalikan `prediction_scaled`, bukan prediksi unit asli.
- `AI/app.py` sudah memakai FastAPI, tetapi perlu ditegaskan sebagai REST API mandiri untuk model ML dengan endpoint health dan predict yang jelas.
- `AI/notebook_code.py` sudah memiliki contoh persiapan Generative AI menggunakan Google GenAI/Gemini, tetapi project sekarang akan diarahkan memakai OpenRouter karena API key OpenRouter sudah dibuat.
- `back-end/src/controllers/predictions-controller.js` mengubah output scaled dengan `* 100`, sehingga nilai stok bisa tidak valid.
- `front-end/app/src/dashboard/dashboard-shell.tsx` memanggil `api.createPrediction({ product_id, forecast_period })` tanpa `features`, sehingga backend tidak memanggil model dan memakai fallback.
- Bukti performa belum tersimpan sebagai file evaluasi yang bisa direview, misalnya `AI/evaluation_report.json` atau `AI/MODEL_CARD.md`.

## File Map

- Modify: `AI/.gitignore` untuk mengizinkan artefak final yang memang wajib dikumpulkan.
- Modify: `AI/notebook_code.py` untuk menyimpan scaler, metadata fitur, evaluation report, dan inference smoke test.
- Modify: `AI/app.py` untuk load model/scaler/metadata dan mengembalikan prediksi unit asli.
- Create: `AI/MODEL_CARD.md` untuk dokumentasi model, dataset, metrik, dan cara menjalankan TensorBoard.
- Create: `AI/artifacts/feature_columns.json` berisi urutan fitur training.
- Create: `AI/artifacts/x_scaler.joblib` dan `AI/artifacts/y_scaler.joblib` dari hasil training.
- Create: `AI/artifacts/evaluation_report.json` dari hasil evaluasi training.
- Modify: `back-end/src/services/ai-service.js` untuk validasi request/response AI service.
- Create: `back-end/src/services/generative-ai-service.js` untuk fitur sekunder rekomendasi restock memakai OpenRouter.
- Modify: `back-end/src/controllers/predictions-controller.js` agar memakai `prediction_quantity`, bukan `prediction_scaled * 100`.
- Modify: `back-end/src/config/env.js` untuk membaca `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`, dan `OPENROUTER_MODEL`.
- Modify: `back-end/package.json` tidak diperlukan jika memakai native `fetch` dari Node.js.
- Modify: `back-end/.env.example` untuk dokumentasi environment variable Generative AI.
- Modify: `front-end/app/src/dashboard/dashboard-shell.tsx` jika fitur tetap dikirim dari UI.
- Modify: `front-end/app/src/lib/api.ts` jika payload prediksi perlu diperluas.
- Modify: `back-end/README.md` untuk menjelaskan cara menjalankan AI service dan artefak yang wajib ada.

## Decision Points Before Implementation

- Pilihan A: Backend membentuk fitur dari data produk/transaksi di database. Ini lebih benar untuk produk nyata karena user tidak perlu mengisi 19 fitur manual.
- Pilihan B: Frontend mengirim fitur manual/hidden. Ini lebih cepat, tetapi rawan tidak konsisten dengan training dan kurang cocok untuk produksi.
- Rekomendasi: Pilihan A. Backend mengambil produk, transaksi historis, periode forecast, lalu membentuk payload fitur untuk AI service.
- Untuk Generative AI, provider yang dipakai adalah OpenRouter dengan model gratis `openai/gpt-oss-120b:free`. OpenRouter memakai endpoint OpenAI-compatible sehingga integrasi bisa dilakukan dengan native `fetch` tanpa SDK tambahan.

---

### Task 1: Make AI Artifacts Trackable

**Files:**

- Modify: `AI/.gitignore`
- Create directory: `AI/artifacts/`

- [ ] **Step 1: Update ignore rules**

Replace `AI/.gitignore` with:

```gitignore
__pycache__/
*.pyc
best_model_weights.weights.h5

# Keep production model artifacts in the final repository for assessment.
!retail_prediction_model.keras
!saved_model_prod/
!saved_model_prod/**
!logs/
!logs/**
!artifacts/
!artifacts/**
```

- [ ] **Step 2: Verify git sees required artifacts**

Run:

```bash
git status --short --ignored AI
```

Expected:

```text
?? AI/retail_prediction_model.keras
?? AI/saved_model_prod/
?? AI/logs/
```

There may also be `!! AI/__pycache__/`, which is acceptable.

---

### Task 2: Persist Scalers, Feature Metadata, and Evaluation Report

**Files:**

- Modify: `AI/notebook_code.py`
- Create output: `AI/artifacts/x_scaler.joblib`
- Create output: `AI/artifacts/y_scaler.joblib`
- Create output: `AI/artifacts/feature_columns.json`
- Create output: `AI/artifacts/evaluation_report.json`

- [ ] **Step 1: Add imports**

At the top of `AI/notebook_code.py`, add:

```python
import json
import joblib
```

- [ ] **Step 2: Create artifacts directory**

After `BASE_DIR = os.path.dirname(os.path.abspath(__file__))`, add:

```python
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)
```

- [ ] **Step 3: Store feature column order before scaling**

Before `X_train, X_test, y_train, y_test = train_test_split(...)`, add:

```python
feature_columns = X.columns.tolist()
with open(os.path.join(ARTIFACTS_DIR, "feature_columns.json"), "w", encoding="utf-8") as f:
    json.dump(feature_columns, f, indent=2)
```

- [ ] **Step 4: Save fitted scalers**

After `y_test_scaled = y_scaler.transform(y_test.values.reshape(-1, 1))`, add:

```python
joblib.dump(x_scaler, os.path.join(ARTIFACTS_DIR, "x_scaler.joblib"))
joblib.dump(y_scaler, os.path.join(ARTIFACTS_DIR, "y_scaler.joblib"))
```

- [ ] **Step 5: Save evaluation report**

After final metrics are calculated, add:

```python
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
```

- [ ] **Step 6: Run training script**

Run:

```bash
python notebook_code.py
```

Expected:

```text
[INFO] Model berhasil diekspor ke format .keras dan SavedModel!
```

Also verify these files exist:

```text
AI/artifacts/x_scaler.joblib
AI/artifacts/y_scaler.joblib
AI/artifacts/feature_columns.json
AI/artifacts/evaluation_report.json
```

---

### Task 3: Fix AI Service Inference Output

**Files:**

- Modify: `AI/app.py`

- [ ] **Step 1: Replace `AI/app.py` with production inference code**

Use this implementation:

```python
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
```

- [ ] **Step 2: Verify AI service imports**

Run from `AI`:

```bash
python -c "import app; print(app.model.input_shape); print(len(app.feature_columns))"
```

Expected:

```text
(None, 19)
19
```

---

### Task 4: Update Backend to Consume Real AI Quantity

**Files:**

- Modify: `back-end/src/services/ai-service.js`
- Modify: `back-end/src/controllers/predictions-controller.js`

- [ ] **Step 1: Make AI service response validation explicit**

Modify `back-end/src/services/ai-service.js` so `requestAiPrediction` ends with:

```js
const data = await response.json();

if (typeof data.prediction_quantity !== "number") {
  throw new Error("AI service response missing prediction_quantity");
}

return data;
```

- [ ] **Step 2: Use `prediction_quantity` in controller**

Replace this block in `back-end/src/controllers/predictions-controller.js`:

```js
if (aiRawResponse?.prediction_scaled !== undefined) {
  predictedDemand = Math.max(1, Math.round(Number(aiRawResponse.prediction_scaled) * 100));
} else {
  const fallbackBase = forecast_period === "30_days" ? 52 : forecast_period === "14_days" ? 32 : 18;
  predictedDemand = Math.max(fallbackBase, Number(product.current_stock) + 8);
}
```

With:

```js
if (typeof aiRawResponse?.prediction_quantity === "number") {
  predictedDemand = Math.max(1, Math.round(aiRawResponse.prediction_quantity));
} else {
  const fallbackBase = forecast_period === "30_days" ? 52 : forecast_period === "14_days" ? 32 : 18;
  predictedDemand = Math.max(fallbackBase, Number(product.current_stock) + 8);
}
```

- [ ] **Step 3: Verify backend still starts**

Run from `back-end`:

```bash
npm start
```

Expected:

```text
Server running
```

Stop the server after startup verification.

---

### Task 5: Ensure Forecast Requests Send Valid Features

**Files:**

- Modify: `back-end/src/controllers/predictions-controller.js`
- Optional Modify: `front-end/app/src/dashboard/dashboard-shell.tsx`
- Optional Modify: `front-end/app/src/lib/api.ts`

- [ ] **Step 1: Prefer backend-side feature construction**

Add a helper near the top of `back-end/src/controllers/predictions-controller.js`:

```js
function buildFallbackFeatureVector(product, forecastPeriod) {
  const periodDays = forecastPeriod === "30_days" ? 30 : forecastPeriod === "14_days" ? 14 : 7;
  const currentStock = Number(product.current_stock || 0);

  return [
    currentStock,
    periodDays,
    currentStock <= 0 ? 1 : 0,
    currentStock < 10 ? 1 : 0,
    Math.max(currentStock, 0),
    Math.max(currentStock / Math.max(periodDays, 1), 0),
    periodDays === 7 ? 1 : 0,
    periodDays === 14 ? 1 : 0,
    periodDays === 30 ? 1 : 0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ];
}
```

Note: This keeps integration working, but the stronger implementation is to map these 19 values to the exact `feature_columns.json` semantics. After reviewing `feature_columns.json`, replace placeholder zero values with real database-derived values.

- [ ] **Step 2: Pass generated features when UI does not send features**

Replace:

```js
aiRawResponse = await requestAiPrediction(features);
```

With:

```js
const normalizedPeriod = normalizePeriod(forecast_period);
const aiFeatures =
  Array.isArray(features) && features.length > 0
    ? features
    : buildFallbackFeatureVector(product, normalizedPeriod);

aiRawResponse = await requestAiPrediction(aiFeatures);
```

Then remove the duplicate later declaration of `const normalizedPeriod = normalizePeriod(forecast_period);` and reuse the existing variable.

- [ ] **Step 3: Better follow-up after feature metadata is reviewed**

Replace `buildFallbackFeatureVector` with a real `buildFeatureVector(product, transactions, forecastPeriod, featureColumns)` implementation after confirming exact columns in `AI/artifacts/feature_columns.json`.

---

### Task 6: Add Generative AI Secondary Insight Feature

**Files:**

- Create: `back-end/src/services/generative-ai-service.js`
- Modify: `back-end/src/config/env.js`
- Modify: `back-end/.env.example`
- Modify: `back-end/.env`
- Modify: `back-end/src/controllers/predictions-controller.js`

- [ ] **Step 1: Add OpenRouter environment variables**

Modify `back-end/.env.example` and `back-end/.env` by adding:

```env
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-oss-120b:free
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_NAME=StockCerdas
```

Do not commit a real OpenRouter API key. Keep `OPENROUTER_API_KEY` empty in repository files and fill it only in local/private deployment environment.

- [ ] **Step 2: Expose OpenRouter config to backend**

Modify `back-end/src/config/env.js` so the exported `env` object includes:

```js
  openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openRouterBaseUrl: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  openRouterModel: process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free",
  openRouterSiteUrl: process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
  openRouterAppName: process.env.OPENROUTER_APP_NAME || "StockCerdas",
```

- [ ] **Step 3: Create OpenRouter recommendation service**

Create `back-end/src/services/generative-ai-service.js`:

```js
const { env } = require("../config/env");

async function generateRestockRecommendation({
  productName,
  currentStock,
  predictedDemand,
  recommendedRestock,
  riskLevel,
  forecastPeriod,
}) {
  if (!env.openRouterApiKey) {
    return null;
  }

  const prompt = [
    "Kamu adalah asisten inventory untuk UMKM.",
    "Buat rekomendasi singkat dalam Bahasa Indonesia berdasarkan prediksi stok berikut.",
    `Produk: ${productName}`,
    `Stok saat ini: ${currentStock}`,
    `Prediksi kebutuhan: ${predictedDemand}`,
    `Rekomendasi restock: ${recommendedRestock}`,
    `Level risiko: ${riskLevel}`,
    `Periode prediksi: ${forecastPeriod}`,
    "Jawab maksimal 3 bullet pendek: tindakan restock, alasan, dan catatan risiko.",
  ].join("\n");

  const response = await fetch(`${env.openRouterBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "HTTP-Referer": env.openRouterSiteUrl,
      "X-OpenRouter-Title": env.openRouterAppName,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openRouterModel,
      messages: [
        {
          role: "system",
          content: "Kamu adalah asisten inventory yang menjawab singkat dan praktis.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

module.exports = { generateRestockRecommendation };
```

Note: Dokumentasi OpenRouter menunjukkan endpoint `https://openrouter.ai/api/v1/chat/completions`, autentikasi `Authorization: Bearer <OPENROUTER_API_KEY>`, header opsional `HTTP-Referer` dan `X-OpenRouter-Title`, serta payload `model` dan `messages` yang kompatibel dengan OpenAI Chat Completions.

- [ ] **Step 4: Call Generative AI after ML prediction**

At the top of `back-end/src/controllers/predictions-controller.js`, add:

```js
const { generateRestockRecommendation } = require("../services/generative-ai-service");
```

Before inserting the prediction row, add:

```js
let generativeRecommendation = null;

try {
  generativeRecommendation = await generateRestockRecommendation({
    productName: product.name,
    currentStock,
    predictedDemand,
    recommendedRestock,
    riskLevel,
    forecastPeriod: normalizedPeriod,
  });
} catch (error) {
  generativeRecommendation = null;
}
```

Replace the final insert value for `aiRawResponse`:

```js
      aiRawResponse || { mode: "fallback" },
```

With:

```js
      {
        ...(aiRawResponse || { mode: "fallback" }),
        generative_recommendation: generativeRecommendation,
      },
```

Add `generative_recommendation` to the response payload:

```js
      generative_recommendation: generativeRecommendation,
```

- [ ] **Step 5: Keep Generative AI secondary and optional**

Verify behavior when `OPENROUTER_API_KEY` is empty:

```bash
npm start
```

Expected: backend starts and predictions still work. `generative_recommendation` may be `null`, but ML prediction/fallback must not fail.

---

### Task 7: Add Model Documentation for Assessment

**Files:**

- Create: `AI/MODEL_CARD.md`
- Modify: `back-end/README.md`

- [ ] **Step 1: Create model card**

Create `AI/MODEL_CARD.md`:

````markdown
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
````

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

````

- [ ] **Step 2: Update backend README AI section**

Replace `back-end/README.md` lines 35-45 with:

```markdown
## Integrasi AI

Folder `../AI` menyediakan model TensorFlow dan FastAPI inference service.

Artefak wajib sebelum menjalankan service:

- `../AI/retail_prediction_model.keras`
- `../AI/artifacts/x_scaler.joblib`
- `../AI/artifacts/y_scaler.joblib`
- `../AI/artifacts/feature_columns.json`

Jalankan service AI dari folder `AI`:

```bash
uvicorn app:app --reload --port 8000
````

Backend Express akan memanggil `AI_SERVICE_URL/predict` saat endpoint `POST /api/predictions` dibuat. AI service mengembalikan `prediction_quantity` dalam unit asli, bukan angka scaled.

Generative AI bersifat fitur sekunder. Jika `OPENROUTER_API_KEY` tersedia, backend dapat membuat rekomendasi restock berbasis hasil prediksi memakai model `openai/gpt-oss-120b:free`. Jika key tidak tersedia, prediksi stok tetap berjalan tanpa rekomendasi teks.

````

---

### Task 8: End-to-End Verification

**Files:**
- No code changes unless verification reveals an issue.

- [ ] **Step 1: Verify AI import and artifact loading**

Run from `AI`:

```bash
python -c "import app; print('ok', app.model.input_shape, len(app.feature_columns))"
````

Expected:

```text
ok (None, 19) 19
```

- [ ] **Step 2: Start AI service**

Run from `AI`:

```bash
uvicorn app:app --port 8000
```

Expected:

```text
Uvicorn running on http://127.0.0.1:8000
```

- [ ] **Step 3: Smoke test AI endpoint**

In a second terminal, run:

```bash
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d "{\"features\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}"
```

Expected JSON contains:

```json
{
  "prediction_quantity": 0,
  "prediction_scaled": 0,
  "feature_count": 19
}
```

Exact numeric values may differ; keys must exist and `prediction_quantity` must be a number.

- [ ] **Step 4: Start backend**

Run from `back-end`:

```bash
npm start
```

Expected backend starts without syntax errors.

- [ ] **Step 5: Verify repository includes required files**

Run from repository root:

```bash
git status --short AI back-end front-end docs
```

Expected includes changed/tracked candidates for:

```text
AI/retail_prediction_model.keras
AI/saved_model_prod/
AI/logs/
AI/artifacts/
AI/MODEL_CARD.md
back-end/src/services/generative-ai-service.js
docs/superpowers/plans/2026-05-27-ai-forecasting-remediation.md
```

---

## GitHub Repo Note

Kamu sudah pernah push project ke GitHub. Setelah implementasi disetujui, jangan hanya push script; pastikan artefak final yang dibutuhkan evaluator tidak lagi ignored. Sebelum commit/push, jalankan:

```bash
git status --short --ignored AI
```

Jika model/log masih muncul sebagai `!!`, berarti masih ignored dan belum akan masuk GitHub.

## Self-Review

- Checklist TensorFlow covered: Functional API, custom layer/loss/callback, `.keras`, SavedModel, inference, `GradientTape`, TensorBoard logs.
- Checklist REST API mandiri covered: `AI/app.py` uses FastAPI with health and prediction endpoints for model serving.
- Checklist Generative AI covered: OpenRouter with `openai/gpt-oss-120b:free` is documented as an optional secondary insight feature, separate from the TensorFlow forecasting model.
- Checklist integrasi aplikasi covered: backend consumes `prediction_quantity`, frontend/backend no longer depend on missing `features` from UI only.
- Checklist repository akhir covered: `.gitignore` updated so production artifacts can be committed.
- Remaining risk: `buildFallbackFeatureVector` must be replaced with exact feature mapping from `feature_columns.json` for production-quality prediction. This should be reviewed after artifacts are regenerated.
