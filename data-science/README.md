# StockSmart Data Science Dashboard

Dashboard Streamlit ini dibuat untuk memenuhi checklist Data Science Dicoding dan menghubungkan hasil analisis data dengan deliverable AI forecasting.

## Jalankan Lokal

```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Data yang Digunakan

- `Retail_Transactions_Dataset.csv`: dataset mentah.
- `retail_cleaned.csv`: hasil cleaning dan data wrangling.
- `retail_feature_engineered.csv`: fitur forecasting untuk model AI.
- `../AI/artifacts/evaluation_report.json`: metrik evaluasi model AI.
- `../AI/artifacts/feature_columns.json`: daftar fitur input model AI.
- `../AI/retail_prediction_model.keras`: model TensorFlow siap produksi.
- `../AI/app.py`: FastAPI inference endpoint untuk model AI.

File CSV penuh di-ignore dari repository karena ukurannya besar. Jika CSV tidak tersedia di Streamlit Cloud, dashboard otomatis memakai sample data kecil agar reviewer tetap bisa membuka halaman dan melihat struktur insight. Untuk analisis penuh, jalankan lokal dengan `retail_cleaned.csv` dan `retail_feature_engineered.csv` di folder ini.

## Checklist yang Ditampilkan

- Problem discovery dan solusi utama.
- Data gathering, assessing, dan cleaning.
- Business questions terukur.
- EDA dan explanatory visualizations.
- Dashboard interaktif Streamlit.
- Data dictionary.
- Feature engineering.
- Koneksi ke AI: custom layer, custom loss, model export, inference API, TensorBoard logs, dan evaluation report.

## Catatan AI

Metrik `r2_percent` sudah melewati target 85%. Nilai `mae_scaled` saat ini dibaca langsung dari `../AI/artifacts/evaluation_report.json`; dashboard akan memberi peringatan jika belum mencapai batas 0.02.
