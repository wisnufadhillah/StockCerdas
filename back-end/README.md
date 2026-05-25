# StockCerdas Backend

RESTful API Express.js untuk dashboard StockCerdas.

## Setup

1. Buat file `.env` dari `.env.example`.
2. Sesuaikan kredensial PostgreSQL untuk database `stockcerdas_db`.
3. Install dependency:

```bash
npm install
```

4. Inisialisasi tabel dan data demo:

```bash
npm run db:init
```

Jika database sudah pernah diinisialisasi dan hanya perlu menambahkan tabel baru, jalankan:

```bash
npm run db:migrate
```

File migrasi berada di `src/db/migrations` dan dipisah per tabel/perubahan agar mudah dirawat.

5. Jalankan API:

```bash
npm run dev
```

## Integrasi AI

Folder `../AI/app.py` menyediakan FastAPI dengan endpoint `POST /predict`.

Jalankan service AI dari folder `AI`:

```bash
uvicorn app:app --reload --port 8000
```

Backend Express akan memanggil `AI_SERVICE_URL/predict` saat endpoint `POST /api/predictions` menerima field `features`.

## Endpoint Utama

| Method | Endpoint                         | Fungsi                                   |
| ------ | -------------------------------- | ---------------------------------------- |
| GET    | `/api/health`                    | Cek status API                           |
| POST   | `/api/auth/login`                | Login dari tabel `users`                 |
| POST   | `/api/auth/register`             | Register tenant dan useradmin baru       |
| GET    | `/api/products`                  | Ambil daftar produk                      |
| GET    | `/api/products/:id`              | Ambil detail produk                      |
| POST   | `/api/products`                  | Tambah produk                            |
| PUT    | `/api/products/:id`              | Update produk                            |
| DELETE | `/api/products/:id`              | Hapus produk                             |
| GET    | `/api/transactions`              | Ambil riwayat stok masuk/keluar          |
| POST   | `/api/transactions`              | Tambah transaksi dan update stok         |
| DELETE | `/api/transactions/:id`          | Hapus transaksi                          |
| GET    | `/api/tenants`                   | Ambil daftar akun UMKM untuk Super Admin |
| POST   | `/api/tenants`                   | Tambah akun UMKM                         |
| PUT    | `/api/tenants/:id`               | Update akun UMKM                         |
| DELETE | `/api/tenants/:id`               | Hapus akun UMKM                          |
| GET    | `/api/predictions`               | Ambil riwayat prediksi                   |
| POST   | `/api/predictions`               | Buat prediksi restock                    |
| GET    | `/api/dashboard/users`           | Ambil daftar user internal               |
| GET    | `/api/dashboard/categories`      | Ambil kategori produk                    |
| GET    | `/api/dashboard/imports`         | Ambil riwayat import data                |
| GET    | `/api/dashboard/reports`         | Ambil laporan insight                    |
| GET    | `/api/dashboard/store-settings`  | Ambil pengaturan toko                    |
| GET    | `/api/dashboard/system-settings` | Ambil konfigurasi sistem                 |
| GET    | `/api/dashboard/system-services` | Ambil monitoring service                 |

## Contoh Request

Tambah produk:

```json
{
  "tenant_id": 1,
  "sku": "SKU-060",
  "name": "Brownies Cokelat",
  "category": "Roti",
  "price": 18000,
  "current_stock": 32,
  "minimum_stock": 12
}
```

Tambah transaksi:

```json
{
  "product_id": 1,
  "transaction_type": "out",
  "quantity": 8,
  "transaction_date": "2026-05-25",
  "note": "Penjualan harian"
}
```

Buat prediksi:

```json
{
  "product_id": 1,
  "forecast_period": "7_days",
  "features": [1, 2, 3, 4, 5, 6, 7, 8]
}
```

Jika service AI belum berjalan, backend tetap mengembalikan prediksi fallback agar demo dashboard tidak buntu.
