# Product Requirements Document (PRD)

## Sistem Manajemen Inventaris Cerdas Berbasis AI untuk UMKM

**ID Tim Capstone:** CC26-PSU074  
**Tema Capstone:** Revolusi Teknologi Keuangan (Fintech) untuk Generasi Muda  
**Nama Proyek:** Sistem Manajemen Inventaris Cerdas Berbasis AI untuk UMKM (Smart Inventory Forecasting)  
**Sumber Dokumen:** Project Plan - CC26-PSU074.pdf  
**Basis Penyesuaian:** Project Plan tim dan checklist tech stack Dicoding untuk Front End/Back End, Artificial Intelligence, dan Data Science  
**Versi PRD:** 1.1  
**Tanggal:** 7 Mei 2026

---

## 1. Ringkasan Produk

Smart Inventory Forecasting adalah aplikasi web untuk membantu UMKM ritel dan F&B mengelola inventaris secara lebih akurat melalui pencatatan stok, analisis transaksi historis, dashboard insight bisnis, dan prediksi kebutuhan restock berbasis Artificial Intelligence.

Produk ini dirancang sebagai solusi "painkiller" bagi UMKM yang sering mengalami kerugian akibat overstock, deadstock, dan understock. Dengan forecasting berbasis time-series, sistem membantu pemilik usaha mengambil keputusan restock berdasarkan data, bukan hanya insting.

PRD ini juga disesuaikan dengan checklist Dicoding agar implementasi proyek memenuhi kebutuhan setiap learning path: Front End/Back End, Artificial Intelligence, dan Data Science.

## 2. Latar Belakang dan Problem Statement

Manajemen inventaris yang buruk masih menjadi salah satu penyebab utama terganggunya arus kas UMKM di Indonesia. Banyak pelaku UMKM melakukan restock secara manual tanpa analisis data transaksi historis, sehingga keputusan pengadaan barang sering tidak presisi.

Dampak utama masalah tersebut adalah:

- Overstock, yaitu modal tertahan pada barang yang lambat terjual atau menjadi deadstock.
- Understock, yaitu kehilangan potensi penjualan karena barang kosong saat permintaan masih tinggi.
- Kurangnya visibilitas terhadap tren penjualan, barang terlaris, dan pergerakan stok.
- Sulitnya mengambil keputusan restock yang konsisten dan berbasis data.

Produk ini menjawab masalah tersebut dengan sistem manajemen inventaris yang terintegrasi dengan model AI time-series forecasting dan dashboard analitik.

## 3. Tujuan Produk

Tujuan utama produk adalah menyediakan sistem berbasis web yang membantu UMKM:

- Mencatat dan memantau data inventaris secara terstruktur.
- Melihat insight bisnis dari data transaksi dan pergerakan stok.
- Memprediksi kebutuhan stok berdasarkan pola historis penjualan.
- Mendapat rekomendasi jumlah restock untuk mengurangi risiko understock dan overstock.
- Menjaga arus kas agar tidak terlalu banyak modal tertahan pada stok yang tidak bergerak.

## 4. Target Pengguna

Target pengguna utama adalah:

- Pemilik UMKM ritel skala mikro, kecil, dan menengah.
- Pelaku usaha F&B yang mengelola bahan baku atau produk siap jual.
- Admin toko yang bertanggung jawab pada pencatatan stok dan transaksi.
- Tim internal UMKM yang membutuhkan insight sederhana untuk keputusan operasional.

Karakteristik pengguna:

- Tidak harus memiliki kemampuan teknis atau data science.
- Membutuhkan tampilan yang sederhana, intuitif, responsive, dan mudah dipahami.
- Membutuhkan rekomendasi praktis yang langsung bisa digunakan untuk keputusan restock.

## 5. Value Proposition

Produk memberikan nilai utama berikut:

- **Prediksi stok berbasis data:** membantu pengguna memperkirakan kebutuhan restock dari riwayat transaksi.
- **Pengurangan risiko revenue loss:** custom loss function memberi penalti lebih besar pada prediksi yang berisiko menyebabkan understock.
- **Dashboard insight bisnis:** membantu pengguna melihat tren penjualan, barang terlaris, dan perbandingan barang masuk-keluar.
- **Workflow sederhana untuk UMKM:** pengguna cukup memasukkan atau mengunggah data stok/transaksi, lalu sistem menampilkan insight dan rekomendasi.
- **Integrasi web dan AI:** hasil prediksi model AI dapat dipanggil dari aplikasi web melalui RESTful API.

## 6. Ruang Lingkup MVP

MVP mencakup fitur berikut:

| Area | Kebutuhan MVP | Output |
| --- | --- | --- |
| Inventaris | Pengelolaan data barang, stok masuk, stok keluar, dan riwayat transaksi | Data inventaris terstruktur |
| Forecasting | Prediksi kebutuhan stok menggunakan model time-series | Estimasi kebutuhan restock |
| Rekomendasi | Rekomendasi jumlah restock berdasarkan hasil prediksi | Angka rekomendasi restock |
| Dashboard | Visualisasi tren penjualan dan pergerakan stok | Insight bisnis interaktif |
| Integrasi | Koneksi frontend, RESTful API, model AI, dan dashboard DS | Alur prediksi end-to-end |

Di luar scope MVP:

- Integrasi pembayaran digital.
- Integrasi langsung dengan marketplace atau POS pihak ketiga.
- Multi-cabang tingkat lanjut.
- Otomasi pembelian ke supplier.

## 7. User Journey

1. Pengguna membuka aplikasi web.
2. Pengguna memasukkan atau mengunggah data barang dan transaksi historis.
3. Sistem menyimpan dan menampilkan data inventaris.
4. Pengguna membuka dashboard untuk melihat tren penjualan dan stok.
5. Pengguna memilih barang atau periode yang ingin diprediksi.
6. Frontend Vite/React mengirim data historis ke RESTful API menggunakan Axios atau Fetch API.
7. Backend Express memvalidasi request dan memanggil fungsi inference model AI atau service inference.
8. Model TensorFlow/Keras menghasilkan prediksi kebutuhan stok.
9. Backend mengembalikan hasil prediksi dalam format JSON.
10. Frontend menampilkan rekomendasi jumlah restock dan insight pendukung.

### 7.1 User Flow Desain Website SaaS

User flow desain website dibuat untuk memastikan mockup Figma dan implementasi frontend memiliki alur yang jelas sejak pengguna pertama kali mengenal produk, melakukan registrasi atau login, lalu masuk ke dashboard sesuai role pengguna.

#### 7.1.1 Flow Landing Page

1. Pengguna membuka website publik aplikasi **StokCerdas**.
2. Landing page menampilkan penjelasan singkat tentang masalah stok UMKM, yaitu overstock, deadstock, dan understock.
3. Landing page memperkenalkan solusi utama, yaitu pencatatan stok, dashboard insight, dan rekomendasi restock berbasis AI.
4. Pengguna melihat highlight fitur seperti:
   - manajemen inventaris,
   - analisis transaksi historis,
   - prediksi kebutuhan stok,
   - rekomendasi restock,
   - dashboard insight bisnis.
5. Landing page menyediakan CTA utama **Register** dan CTA sekunder **Login**.
6. Jika pengguna belum memiliki akun, pengguna memilih **Register**.
7. Jika pengguna sudah memiliki akun, pengguna memilih **Login**.

#### 7.1.2 Flow Register dan Login

1. Pengguna membuka halaman **Register** dari landing page.
2. Pengguna mengisi data akun, seperti nama, email, password, nama usaha, dan jenis usaha.
3. Sistem membuat akun baru dengan role default **Admin/Pemilik UMKM**.
4. Setelah registrasi berhasil, pengguna diarahkan ke halaman login atau langsung masuk ke dashboard sesuai kebutuhan implementasi.
5. Pengguna membuka halaman **Login**.
6. Pengguna memasukkan email dan password.
7. Sistem memvalidasi kredensial pengguna.
8. Jika login berhasil, sistem membaca role pengguna.
9. Jika role pengguna adalah **Super Admin**, sistem mengarahkan pengguna ke dashboard super admin.
10. Jika role pengguna adalah **Admin/Pemilik UMKM**, sistem mengarahkan pengguna ke dashboard admin toko.

#### 7.1.3 Flow Super Admin

Super Admin adalah role pengelola sistem yang bertugas memantau penggunaan aplikasi secara keseluruhan.

1. Super Admin login ke aplikasi.
2. Sistem menampilkan **Dashboard Super Admin**.
3. Dashboard Super Admin menampilkan ringkasan platform, seperti jumlah UMKM terdaftar, jumlah pengguna aktif, jumlah produk tercatat, dan status sistem/API.
4. Super Admin dapat membuka menu **Manajemen Pengguna** untuk melihat daftar akun UMKM.
5. Super Admin dapat melihat detail akun, status aktif/nonaktif, dan informasi dasar usaha.
6. Super Admin dapat membuka menu **Monitoring Sistem** untuk melihat status integrasi RESTful API, service AI, dan dashboard data.
7. Super Admin dapat mengelola data referensi atau konfigurasi global yang diperlukan untuk demo MVP.

#### 7.1.4 Flow Admin/Pemilik UMKM: Dashboard Operasional

1. Admin/Pemilik UMKM login ke aplikasi.
2. Sistem menampilkan **Dashboard Admin** yang berisi ringkasan kondisi bisnis milik pengguna tersebut.
3. Dashboard menampilkan total produk, stok menipis, risiko understock, modal tertahan, tren penjualan, dan rekomendasi restock prioritas.
4. Admin dapat memilih CTA **Prediksi Restock**, **Import Data**, atau membuka detail produk dari kartu rekomendasi.
5. Semua data yang tampil pada dashboard dibatasi pada data usaha milik Admin/Pemilik UMKM yang sedang login.

#### 7.1.5 Flow Admin/Pemilik UMKM: Prediksi dan Rekomendasi Restock

1. Admin membuka halaman **Forecasting Restock** dari dashboard atau menu navigasi.
2. Admin memilih produk dan periode prediksi, misalnya 7 hari, 14 hari, atau 30 hari.
3. Admin menekan tombol **Jalankan Prediksi**.
4. Frontend mengirim data historis produk dan periode prediksi ke endpoint `/api/predictions`.
5. Backend memproses request dan memanggil model AI atau service inference.
6. Sistem menampilkan hasil prediksi dalam bentuk:
   - prediksi permintaan,
   - stok saat ini,
   - rekomendasi jumlah restock,
   - level risiko understock atau overstock,
   - grafik perbandingan data historis dan prediksi.
7. Admin dapat menyimpan rekomendasi, melihat detail produk, atau menggunakan hasilnya sebagai acuan restock manual.

#### 7.1.6 Flow Admin/Pemilik UMKM: Manajemen Inventaris

1. Admin membuka menu **Inventaris** dari sidebar atau navigasi mobile.
2. Sistem menampilkan tabel produk berisi SKU, nama produk, kategori, stok saat ini, minimum stok, status stok, dan jumlah terjual dalam periode tertentu.
3. Admin dapat mencari produk berdasarkan nama atau SKU.
4. Admin dapat memfilter produk berdasarkan kategori atau status stok, seperti semua, aman, menipis, atau kosong.
5. Admin memilih salah satu produk untuk membuka panel detail.
6. Panel detail menampilkan ringkasan stok, riwayat pergerakan stok, status risiko, dan tombol **Prediksi Produk Ini**.
7. Jika Admin memilih **Prediksi Produk Ini**, sistem membawa pengguna ke halaman forecasting dengan produk tersebut sudah terpilih.

#### 7.1.7 Flow Admin/Pemilik UMKM: Pencatatan Transaksi Stok

1. Admin membuka menu **Transaksi**.
2. Sistem menampilkan riwayat stok masuk dan stok keluar.
3. Admin dapat memfilter transaksi berdasarkan tipe transaksi, tanggal, atau produk.
4. Admin menekan tombol **Tambah Transaksi**.
5. Sistem menampilkan form atau modal input transaksi.
6. Admin memilih produk, tipe transaksi, jumlah, tanggal, dan catatan.
7. Sistem menyimpan transaksi dan memperbarui data stok.
8. Data transaksi yang tersimpan dapat digunakan sebagai input dashboard dan forecasting.

#### 7.1.8 Flow Admin/Pemilik UMKM: Import Data Awal

1. Admin baru membuka halaman **Data Import** atau memilih tombol **Import Data** dari dashboard.
2. Sistem menampilkan pilihan untuk menggunakan data dummy, mengunggah dataset sendiri, atau menghubungkan API.
3. Jika Admin memilih upload dataset, sistem menampilkan area upload file CSV atau XLSX.
4. Sistem melakukan validasi struktur data, seperti kolom tanggal, produk, jumlah, dan tipe transaksi.
5. Sistem menampilkan preview data dan daftar masalah validasi apabila ditemukan, misalnya tanggal kosong atau produk duplikat.
6. Admin memperbaiki data atau melanjutkan import jika data sudah valid.
7. Setelah import berhasil, Admin diarahkan kembali ke dashboard dengan data inventaris dan transaksi yang sudah terisi.

#### 7.1.9 Flow Dashboard Insight dan Laporan

1. Admin membuka dashboard untuk melihat kondisi bisnis secara ringkas.
2. Sistem menampilkan visualisasi tren penjualan, stok masuk-keluar, produk terlaris, produk berisiko understock, dan insight bisnis utama.
3. Admin dapat memilih periode analisis, seperti 7 hari, 30 hari, atau bulan berjalan.
4. Admin dapat membuka halaman **Laporan** untuk melihat insight yang lebih lengkap.
5. Sistem dapat menyediakan opsi export sederhana untuk kebutuhan demo, laporan internal, atau presentasi capstone.

#### 7.1.10 Flow Responsive Mobile

1. Pada perangkat mobile, pengguna melihat ringkasan dashboard dalam format kartu yang lebih ringkas.
2. Navigasi utama menggunakan bottom navigation untuk akses cepat ke Dashboard, Inventaris, Forecasting, dan Laporan.
3. Tabel inventaris berubah menjadi daftar kartu produk agar mudah dibaca di layar kecil.
4. Hasil forecasting menempatkan angka rekomendasi restock sebagai informasi paling menonjol.
5. Form transaksi dan import data menggunakan layout satu kolom agar mudah diisi.

#### 7.1.11 Struktur Navigasi Website

Struktur navigasi website dibagi menjadi tiga area utama.

Navigasi publik:

- **Landing Page:** penjelasan project StokCerdas, value proposition, fitur utama, dan CTA Register/Login.
- **Register:** pendaftaran akun Admin/Pemilik UMKM.
- **Login:** autentikasi untuk Super Admin dan Admin/Pemilik UMKM.

Navigasi Super Admin:

- **Dashboard Super Admin:** ringkasan jumlah UMKM, pengguna aktif, status sistem, dan metrik platform.
- **Manajemen Pengguna:** daftar akun UMKM dan status akun.
- **Monitoring Sistem:** status RESTful API, service AI, dan integrasi data.
- **Pengaturan Sistem:** konfigurasi global aplikasi untuk kebutuhan MVP.

Navigasi Admin/Pemilik UMKM:

- **Dashboard:** ringkasan kondisi stok, tren penjualan, insight bisnis, dan rekomendasi prioritas.
- **Inventaris:** daftar produk, status stok, filter, pencarian, dan detail produk.
- **Transaksi:** riwayat stok masuk dan stok keluar.
- **Forecasting:** input prediksi, hasil forecasting, grafik, dan rekomendasi restock.
- **Data Import:** upload dataset, validasi data, preview, dan penggunaan data dummy.
- **Laporan:** ringkasan insight bisnis untuk evaluasi dan presentasi.
- **Pengaturan:** informasi toko, status API, dan konfigurasi dasar.

## 8. Fitur Utama

| Fitur | Deskripsi | Prioritas | Acceptance Criteria |
| --- | --- | --- | --- |
| Landing Page | Website publik menjelaskan project StokCerdas, manfaat, fitur utama, dan CTA Register/Login | Must Have | Pengguna dapat memahami fungsi produk dan masuk ke halaman register atau login |
| Autentikasi Pengguna | Pengguna dapat melakukan register dan login | Must Have | Sistem dapat memvalidasi akun dan mengarahkan pengguna sesuai role |
| Role Management | Sistem membedakan akses Super Admin dan Admin/Pemilik UMKM | Must Have | Super Admin dan Admin melihat dashboard serta menu yang berbeda sesuai hak akses |
| Dashboard Super Admin | Super Admin dapat memantau akun UMKM, pengguna aktif, dan status sistem | Should Have | Super Admin dapat melihat ringkasan platform dan daftar akun UMKM |
| Manajemen Inventaris | Pengguna dapat melihat dan mengelola data barang serta stok | Must Have | Data barang dan stok dapat ditampilkan dalam tabel yang mudah dibaca |
| Riwayat Transaksi Stok | Sistem menyimpan atau membaca data stok masuk dan stok keluar | Must Have | Data transaksi dapat digunakan sebagai input forecasting |
| Forecasting Stok | Sistem memprediksi kebutuhan stok berbasis data historis | Must Have | Sistem menghasilkan prediksi untuk barang dan periode tertentu |
| Rekomendasi Restock | Sistem menampilkan kuantitas restock yang disarankan | Must Have | Pengguna melihat angka rekomendasi restock yang jelas |
| Dashboard Insight | Sistem menampilkan visualisasi tren penjualan dan stok | Must Have | Dashboard Streamlit menampilkan top-selling items, tren stok, dan kesimpulan bisnis |
| Integrasi RESTful API AI | Backend menerima request prediksi dan mengembalikan hasil JSON | Must Have | Endpoint prediksi dapat diuji secara terisolasi |
| Data Dummy untuk Demo | Sistem dapat berjalan dengan data contoh | Must Have | Demo dapat dilakukan meski belum memakai data UMKM asli |
| Mockup UI | Desain visual aplikasi dibuat sebelum slicing | Should Have | Tersedia mockup Figma sebagai acuan antarmuka |
| Deployment Web | Aplikasi web dapat diakses melalui hosting publik | Should Have | Aplikasi dideploy ke GitHub Pages, Netlify, atau Vercel |

## 9. Kebutuhan Data Science

Tim Data Science bertanggung jawab untuk:

- Mengumpulkan dataset transaksi retail atau UMKM dari sumber terbuka seperti Kaggle atau sumber relevan lain.
- Mendefinisikan pertanyaan bisnis yang dapat diukur, misalnya produk apa yang paling cepat habis, kapan permintaan meningkat, dan berapa rekomendasi restock yang ideal.
- Melakukan data wrangling end-to-end: gathering data, assessing data, cleaning data, normalisasi format tanggal/produk, dan agregasi time-series menggunakan Pandas atau Polars.
- Melakukan Exploratory Data Analysis (EDA) untuk mendapatkan insight dari pola penjualan.
- Membuat visualisasi data dan explanatory analysis untuk menjawab pertanyaan bisnis.
- Membuat dashboard Streamlit yang menampilkan tren penjualan, top-selling items, perbandingan barang masuk-keluar, dan insight bisnis utama.
- Menyediakan dataset bersih yang siap diproses model AI.
- Menyusun data dictionary agar struktur dataset, nama kolom, tipe data, dan makna setiap fitur terdokumentasi.

Dataset yang direkomendasikan:

- Supermarket Sales Dataset.
- Online Retail Dataset.
- Dataset retail/sales transaction lain yang memiliki kolom tanggal, produk, jumlah, dan transaksi.

Nilai tambah Data Science:

- Melakukan feature engineering untuk menghasilkan fitur yang lebih informatif bagi model.
- Menggunakan Polars sebagai alternatif atau pendamping Pandas untuk optimasi performa pada dataset besar, terutama pada proses filtering, grouping, join, agregasi time-series, dan feature engineering.
- Melakukan deployment dashboard ke Streamlit Cloud agar dapat diakses publik.
- Menyusun laporan teknis komprehensif dari problem discovery hingga hasil akhir dalam format PDF.

## 10. Kebutuhan Artificial Intelligence

Tim AI bertanggung jawab untuk:

- Membangun model Deep Learning menggunakan TensorFlow Functional API atau Model Subclassing sesuai checklist Dicoding.
- Mengeksplorasi arsitektur time-series forecasting seperti Long Short-Term Memory (LSTM) atau RNN.
- Melatih model berdasarkan data transaksi historis.
- Mengimplementasikan minimal satu komponen custom lanjutan, dengan prioritas custom loss function asimetris.
- Memberi penalti lebih tinggi pada prediksi yang menyebabkan understock dibandingkan overstock.
- Mengekspor model ke format TensorFlow siap produksi, yaitu `.keras` atau SavedModel, agar dapat diintegrasikan dengan backend atau service inference.
- Membuat kode sederhana untuk proses inference model.

Metrik evaluasi yang disarankan:

- MAE atau RMSE untuk mengukur error prediksi.
- Perbandingan error understock dan overstock.
- Validasi performa pada data dummy atau data uji historis.
- Target opsional Dicoding untuk eksperimen model: akurasi minimal 85% atau MAE maksimal 0,02 apabila definisi label dan skala data memungkinkan.

Nilai tambah Artificial Intelligence:

- Mengembangkan REST API mandiri menggunakan FastAPI atau Flask untuk melayani inference model.
- Mengimplementasikan training dan evaluation loop custom menggunakan `tf.GradientTape`.
- Mengintegrasikan TensorBoard untuk memantau dan memvisualisasikan metrik pelatihan.
- Menggunakan API Generative AI hanya sebagai fitur tambahan atau sekunder, bukan pengganti fitur forecasting utama.

## 11. Kebutuhan Teknis Front End dan Back End

### Frontend

- Menggunakan Vite/React sebagai module bundler dan framework frontend.
- Menggunakan networking calls untuk berinteraksi dengan API proyek.
- Menggunakan Axios atau Fetch API untuk request data inventaris dan prediksi.
- Menyediakan halaman inventaris, dashboard ringkas, dan hasil prediksi.
- Menampilkan hasil rekomendasi restock secara jelas untuk pengguna awam.
- Menyediakan layout responsive agar aplikasi dapat digunakan pada ukuran layar berbeda.
- Menggunakan Tailwind CSS atau Bootstrap sebagai tools styling yang direkomendasikan.

### Backend/API

- Menggunakan RESTful API sebagai komunikasi utama antara frontend dan backend.
- Backend utama direkomendasikan menggunakan Node.js/Express agar sesuai checklist Front End dan Back End Dicoding.
- RESTful API dapat menyimpan data dengan atau tanpa database pada MVP.
- Jika waktu memungkinkan, RESTful API menyimpan data ke database sebagai nilai tambah.
- Struktur endpoint harus mengikuti konvensi RESTful.
- Menyediakan endpoint untuk data barang, data transaksi stok, dan request prediksi.
- Mengintegrasikan kemampuan AI/ML sebagai fitur utama aplikasi, baik melalui backend aplikasi maupun service inference terpisah.
- Memanggil fungsi inference model AI atau service inference AI.
- Mengembalikan hasil prediksi dalam format JSON.
- Dapat diuji secara terisolasi menggunakan Postman atau tool sejenis.
- Memastikan fitur utama berjalan tanpa menyebabkan aplikasi crash.

Contoh endpoint RESTful:

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/api/products` | Mengambil daftar produk |
| POST | `/api/products` | Menambahkan produk |
| GET | `/api/transactions` | Mengambil riwayat transaksi stok |
| POST | `/api/transactions` | Menambahkan stok masuk atau stok keluar |
| POST | `/api/predictions` | Mengirim data historis dan menerima prediksi restock |

Contoh respons JSON:

```json
{
  "product_id": "SKU-001",
  "product_name": "Contoh Produk",
  "forecast_period": "7_days",
  "predicted_demand": 42,
  "current_stock": 15,
  "recommended_restock": 27,
  "risk_level": "medium"
}
```

## 12. Kebutuhan Dashboard Data Science

- Menggunakan Streamlit.
- Menampilkan visualisasi tren penjualan.
- Menampilkan top-selling items.
- Menampilkan perbandingan barang masuk dan keluar.
- Menampilkan insight dan kesimpulan bisnis dari hasil analisis.
- Menggunakan data bersih hasil preprocessing.
- Dapat dideploy ke Streamlit Cloud sebagai nilai tambah.

## 13. Penyesuaian Checklist Dicoding

Bagian ini memetakan PRD ke tech stack dan checklist learning path Dicoding agar implementasi proyek selaras dengan kriteria capstone.

| Learning Path | Checklist Wajib | Implementasi dalam PRD |
| --- | --- | --- |
| Front End dan Back End | Menggunakan networking calls untuk berinteraksi dengan API | Frontend Vite/React memanggil RESTful API menggunakan Axios atau Fetch API |
| Front End dan Back End | Menggunakan module bundler seperti Vite | Web app dibangun dengan Vite/React |
| Front End dan Back End | Membangun RESTful API untuk mendukung aplikasi frontend | Backend menyediakan endpoint inventaris, transaksi, dan prediksi |
| Front End dan Back End | RESTful API dapat menyimpan data dengan atau tanpa database | MVP dapat memakai database sederhana atau data dummy terstruktur |
| Front End dan Back End | URL endpoint mengikuti standar konvensi RESTful | Endpoint memakai pola seperti `/api/products`, `/api/transactions`, dan `/api/predictions` |
| Front End dan Back End | Mengintegrasikan AI/ML sebagai fitur utama aplikasi | API prediksi menghubungkan web app dengan model forecasting |
| Front End dan Back End | Fitur utama berjalan tanpa menyebabkan crash | Alur inventaris, dashboard, dan prediksi diuji dengan data dummy |
| Artificial Intelligence | Membangun model Deep Learning dengan TensorFlow Functional API atau Model Subclassing | Model forecasting dibangun dengan TensorFlow/Keras menggunakan LSTM/RNN |
| Artificial Intelligence | Mengimplementasikan komponen custom lanjutan | Custom loss function asimetris untuk penalti understock |
| Artificial Intelligence | Menyimpan dan mengekspor model siap produksi | Model diekspor ke `.keras` atau SavedModel |
| Artificial Intelligence | Membuat kode sederhana untuk inference model | Backend/service AI memiliki fungsi inference untuk prediksi restock |
| Data Science | Gathering, assessing, dan cleaning data | Dataset retail diproses melalui data wrangling end-to-end |
| Data Science | Mendefinisikan pertanyaan bisnis yang dapat diukur | Pertanyaan bisnis fokus pada tren permintaan, barang terlaris, dan kebutuhan restock |
| Data Science | Melakukan EDA dan explanatory analysis | Notebook/analisis DS menjawab pertanyaan bisnis dengan visualisasi |
| Data Science | Membuat dashboard interaktif menggunakan Streamlit | Dashboard Streamlit menampilkan insight dan kesimpulan |
| Data Science | Memastikan data siap diproses model dan membuat data dictionary | Dataset bersih dan data dictionary menjadi deliverable DS |

Checklist opsional yang direkomendasikan:

- Membuat mockup aplikasi di Figma sebagai representasi visual desain.
- Menggunakan Tailwind CSS atau Bootstrap untuk mempercepat styling responsif.
- Menyimpan data ke database jika waktu implementasi memungkinkan.
- Menggunakan Express untuk RESTful API utama.
- Menyediakan service AI mandiri dengan FastAPI atau Flask bila integrasi model lebih stabil melalui Python.
- Menggunakan `tf.GradientTape`, TensorBoard, atau API Generative AI sebagai nilai tambah bila fitur utama sudah stabil.
- Melakukan feature engineering untuk meningkatkan performa model.
- Melakukan deployment dashboard ke Streamlit Cloud.
- Membuat laporan teknis Data Science dalam format PDF.

## 14. Milestone dan Timeline

| Minggu | Periode | Fokus | Output | Penanggung Jawab |
| --- | --- | --- | --- | --- |
| Minggu 1 | 14 Apr - 20 Apr | Planning & Setup | Project plan selesai, data cleaning selesai, wireframe UI selesai, arsitektur AI ditentukan | Semua anggota |
| Minggu 2 | 21 Apr - 30 Apr | Core Development | Model AI dilatih dan diekspor, dashboard EDA selesai, UI/UX disematkan ke web | AI, DS, Fullstack |
| Minggu 3 | 1 Mei - 10 Mei | Backend & API | RESTful API Express dibuat, endpoint prediksi AI berfungsi, laporan kemajuan disubmit | Fullstack, AI |
| Minggu 4 | 11 Mei - 20 Mei | Integration & Testing | Frontend, backend, service AI/model, dan dashboard terintegrasi; bug fixing; uji coba data dummy | Fullstack, AI |
| Minggu 5 | 21 Mei - 5 Juni | Finalization & Deliverables | Video presentasi YouTube, slide presentasi, tutorial aplikasi, final review project brief selesai | Semua anggota |

## 15. Pembagian Peran

| Anggota | Role | Tanggung Jawab |
| --- | --- | --- |
| Wisnu Fadhillah | Project Manager & Full-Stack Web Developer | Mengelola timeline, frontend, RESTful API Express, dan integrasi model AI |
| Natan Gedion Van Delly | Full-Stack Web Developer & UI/UX | Merancang UI Figma, slicing UI ke Vite/React, membuat layout responsive, dan dokumen/video tutorial |
| Adinda Az-Zahra Nur Kurnia | Data Scientist | Dataset, data wrangling, pertanyaan bisnis, EDA, dashboard Streamlit, data dictionary |
| Sansan Aprilia | Data Scientist | Dataset, data wrangling, pertanyaan bisnis, EDA, dashboard Streamlit, data dictionary |
| Eliata Zefanya Irabela | AI Engineer | Model TensorFlow/Keras LSTM/RNN, custom loss function, training, inference code, ekspor model `.keras` atau SavedModel |
| Siska Rahmawati | AI Engineer | Model TensorFlow/Keras LSTM/RNN, custom loss function, training, inference code, ekspor model `.keras` atau SavedModel |

## 16. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Kualitas dataset publik buruk | Model sulit belajar pola transaksi yang representatif | Lakukan preprocessing ketat, normalisasi data, dan data augmentation bila diperlukan |
| Model overfitting | Prediksi buruk pada data baru atau anomali penjualan | Gunakan dropout, early stopping, TensorBoard, dan evaluasi berkala |
| Akurasi prediksi rendah | Rekomendasi restock kurang dapat dipercaya | Iterasi arsitektur model dan tuning custom loss function |
| Bottleneck saat backend memanggil model AI | Server lambat atau crash saat prediksi | Uji endpoint secara terisolasi dan pertimbangkan FastAPI/Flask service untuk inference |
| Ketidaksesuaian implementasi dengan checklist Dicoding | Proyek berisiko tidak memenuhi kriteria learning path | Gunakan tabel checklist Dicoding sebagai acuan acceptance sebelum final submission |
| Ketidakaktifan anggota tim | Timeline 4-5 minggu terhambat | Gunakan Linear Kanban dan laporan progres dua hari sekali |

## 17. Acceptance Criteria Produk

Produk dianggap memenuhi PRD apabila:

- Aplikasi web Vite/React dapat menampilkan data inventaris dan/atau data dummy.
- Frontend menggunakan networking calls untuk mengambil data dan mengirim request prediksi ke RESTful API.
- RESTful API Express memiliki endpoint inventaris, transaksi, dan prediksi dengan konvensi URL yang konsisten.
- RESTful API dapat menyimpan data dengan atau tanpa database.
- Sistem dapat menjalankan alur prediksi end-to-end dari frontend ke backend hingga model AI atau service inference.
- Endpoint prediksi mengembalikan respons JSON dengan hasil prediksi dan rekomendasi restock.
- Dashboard Streamlit menampilkan insight minimal berupa tren penjualan, top-selling items, dan kesimpulan bisnis.
- Dataset sudah melalui gathering, assessing, cleaning, EDA, dan memiliki data dictionary; proses wrangling dapat menggunakan Pandas atau Polars sesuai kebutuhan performa.
- Model AI dibangun menggunakan TensorFlow/Keras dengan Functional API atau Model Subclassing.
- Model AI memiliki minimal satu custom component, yaitu custom loss function asimetris.
- Model AI dapat diekspor dalam format `.keras` atau SavedModel dan dipakai untuk inference.
- Tersedia kode inference sederhana untuk memanggil model.
- Hasil rekomendasi restock dapat dipahami oleh pengguna non-teknis.
- Demo dapat dilakukan dengan data dummy yang representatif.
- Deliverables final mencakup aplikasi, dashboard, slide presentasi, video presentasi, tutorial aplikasi, dan dokumen final.

## 18. Referensi Teknologi

| Area | Teknologi |
| --- | --- |
| Frontend | Vite, React, Axios atau Fetch API, Tailwind CSS atau Bootstrap |
| Backend | Node.js, Express, RESTful API |
| AI Inference Service Opsional | FastAPI atau Flask |
| AI/ML | TensorFlow, Keras, Scikit-Learn |
| Data Science | Pandas, Polars, NumPy, Matplotlib, Seaborn |
| Dashboard | Streamlit |
| Design | Figma |
| Deployment | GitHub Pages, Netlify, Vercel, Streamlit Cloud |
| Project Management | Linear, Google Meet, WhatsApp |

## 19. Catatan Implementasi

PRD ini dibuat sebagai turunan dari project plan capstone dan disesuaikan dengan checklist tech stack Dicoding. Backend utama direkomendasikan menggunakan Node.js/Express untuk memenuhi kebutuhan Front End dan Back End. FastAPI atau Flask tetap dapat digunakan sebagai service inference AI opsional apabila integrasi model TensorFlow/Keras lebih mudah dilakukan melalui ekosistem Python.
