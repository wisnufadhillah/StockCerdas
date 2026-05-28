# 📦 StockCerdas - AI-Powered Inventory Management

![StockCerdas Logo](front-end/public/assets/logo-text.svg)

**StockCerdas** adalah platform manajemen inventaris (SaaS) cerdas yang dirancang khusus untuk membantu UMKM memantau stok, mencatat transaksi, dan memprediksi kebutuhan restock barang menggunakan teknologi **Kecerdasan Buatan (AI/ML)** dan **Generative AI**.

Proyek ini dibangun sebagai bagian dari Capstone Project / submission Dicoding dengan standar pengembangan perangkat lunak modern.

---

## ✨ Fitur Utama

- **🤖 AI Demand Forecasting:** Memprediksi kebutuhan restock barang di masa depan (7 hari, 14 hari, 30 hari) menggunakan model _Deep Learning_ (Keras/TensorFlow) yang dilatih dengan data riwayat transaksi retail.
- **💬 Generative AI Recommendations:** Memberikan analisis dan saran restock menggunakan bahasa natural yang dihasilkan oleh LLM (OpenRouter AI) berdasarkan hasil prediksi ML.
- **📊 Interactive Dashboard:** Ringkasan analitik visual berbasis grafik (Chart.js) untuk memantau performa inventaris, status stok (Aman, Menipis, Kosong), dan performa penjualan.
- **🏢 Multi-Tenant (SaaS Architecture):** Mendukung banyak toko/UMKM secara mandiri dengan arsitektur basis data berbasis _tenant_id_.
- **👥 Role-Based Access Control:** Fitur yang dibedakan secara aman untuk **Super Admin** (pengelola platform) dan **User Admin** (pemilik toko/UMKM).
- **📱 Responsive Mobile-First Design:** Antarmuka pengguna (UI) modern yang dibangun menggunakan Tailwind CSS v4, berjalan mulus di perangkat _mobile_ maupun _desktop_.
- **📥 CSV Bulk Import:** Unggah data inventaris lama ke sistem baru dengan mudah melalui format CSV.

---

## 🏗️ Struktur Proyek (Folder Architecture)

Proyek ini dipisahkan menjadi beberapa _micro-monorepo_ (beberapa layanan dalam satu repositori) agar mudah dikelola:

```text
StockSmart/
│
├── 🧠 AI/                # Model Machine Learning & API Inference (Python/FastAPI)
│   ├── app.py            # Entry point FastAPI untuk melayani prediksi AI
│   ├── artifacts/        # Data scaler & pipeline preprocessing (.joblib)
│   └── retail_prediction_model.keras # File bobot (weights) Neural Network
│
├── ⚙️ back-end/          # RESTful API Server (Node.js/Express.js)
│   ├── src/              # Logic Utama (Controllers, Routes, Services, Middleware)
│   ├── src/db/           # Konfigurasi Database (PostgreSQL) & Skema SQL
│   └── scripts/          # Script pembantu (Database seeder, utilitas perbaikan)
│
├── 💻 front-end/         # Aplikasi Web Klien (Next.js/React)
│   ├── app/              # Konfigurasi App Router Next.js (Halaman, Layout, CSS)
│   ├── app/src/          # Komponen UI, Dashboard Shell, & API Client
│   └── public/           # Aset statis (Gambar, SVG, Ilustrasi)
│
├── 📊 data-science/      # Dataset mentah & Eksperimen Model (Jupyter Notebooks)
│   ├── Terbaru(fix).ipynb # Notebook eksperimen pemodelan data & training model
│   └── *.csv             # Dataset yang digunakan untuk melatih AI
│
└── 📄 PRD.md             # Product Requirements Document (Dokumen Spesifikasi)
```

---

## 🛠️ Tech Stack (Teknologi yang Digunakan)

### Front-End:

- **Framework:** Next.js (v16) dengan App Router
- **Library UI:** React (v19)
- **Styling:** Tailwind CSS (v4)
- **Grafik/Charts:** Chart.js & react-chartjs-2
- **Networking:** Native `fetch` API (`api.ts`)

### Back-End:

- **Runtime:** Node.js
- **Framework:** Express.js (v4.21)
- **Database:** PostgreSQL (Driver `pg`)
- **Integrasi LLM:** OpenRouter API (Model `openai/gpt-oss-120b:free`)

### AI & Data Science:

- **Pemodelan ML:** TensorFlow & Keras
- **Web Framework ML:** FastAPI
- **Data Processing:** Pandas, NumPy, Scikit-learn (Joblib)

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal (Local Setup)

Untuk menjalankan StockCerdas di komputer Anda, Anda perlu menyalakan ketiga layanan secara bersamaan (Database, Backend, Frontend, dan AI Inference).

### Persyaratan Sistem:

- **Node.js** (v18 atau lebih baru)
- **Python** (v3.9 atau lebih baru)
- **PostgreSQL** (berjalan di port 5432)

---

### Langkah 1: Setup Database & Backend Server

1. Buka terminal dan masuk ke folder `back-end`:
   ```bash
   cd back-end
   ```
2. Instal dependensi Node.js:
   ```bash
   npm install
   ```
3. Buat file `.env` (salin dari `.env.example`) dan sesuaikan dengan konfigurasi PostgreSQL dan OpenRouter API Anda:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=password_anda
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=stockcerdas_db
   AI_SERVICE_URL=http://localhost:8000
   OPENROUTER_API_KEY=kunci_api_openrouter_anda
   ```
4. Inisialisasi Database (Membuat tabel dan _seed data_ admin):
   ```bash
   npm run db:init
   ```
5. Jalankan server backend (dengan mode _watch_/development):
   ```bash
   npm run dev
   ```
   _Server akan berjalan di `http://localhost:5000`_

---

### Langkah 2: Setup Server AI (FastAPI Inference)

1. Buka terminal **baru** dan masuk ke folder `AI`:
   ```bash
   cd AI
   ```
2. (Opsional namun disarankan) Buat dan aktifkan _Virtual Environment_:
   ```bash
   python -m venv venv
   # Di Windows:
   .\venv\Scripts\activate
   # Di Mac/Linux:
   source venv/bin/activate
   ```
3. Instal dependensi Python:
   ```bash
   pip install fastapi uvicorn tensorflow scikit-learn pandas numpy joblib pydantic
   ```
4. Jalankan server FastAPI:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```
   _Server AI akan berjalan di `http://localhost:8000`_

---

### Langkah 3: Setup Frontend (Next.js Client)

1. Buka terminal **baru** dan masuk ke folder `front-end`:
   ```bash
   cd front-end
   ```
2. Instal dependensi Node.js:
   ```bash
   npm install
   ```
3. Jalankan aplikasi web Next.js:
   ```bash
   npm run dev
   ```
   _Aplikasi web akan berjalan di `http://localhost:3000`_

---

### Langkah 4: Mulai Menggunakan Aplikasi

Buka browser Anda dan akses `http://localhost:3000`.
Anda dapat login menggunakan kredensial _default_ yang telah di-_seed_ ke dalam database:

**Akun Super Admin:**

- **Email:** `superadmin@gmail.com`
- **Password:** `admin`

_(Anda bisa mendaftarkan akun UMKM/User Admin baru melalui dashboard Super Admin atau melalui halaman registrasi)_.

---

## 📝 Lisensi

Proyek ini dikembangkan secara internal untuk penyelesaian kelas dan portofolio pengembangan perangkat lunak (SaaS). Semua _source code_, model AI, dan hak kekayaan intelektual terkait menjadi bagian dari proyek tertutup, kecuali dinyatakan sebaliknya.

**Dibangun dengan ☕ dan Inovasi oleh Tim StockCerdas**
