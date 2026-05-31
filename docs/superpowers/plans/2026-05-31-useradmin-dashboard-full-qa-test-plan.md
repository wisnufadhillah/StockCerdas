# Useradmin Dashboard Full QA Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Test every useradmin dashboard feature, CTA, navigation path, form submission, detail action, delete action, and package-gated behavior from the browser.

**Architecture:** This is a manual end-to-end QA plan supported by API/build verification. Execute it against the existing Next.js frontend at `http://localhost:3000` and Express backend at `http://localhost:5000`, using the seeded/local database state and one useradmin account.

**Tech Stack:** Next.js dashboard UI, browser DevTools, Express REST API, PostgreSQL-backed local data, existing `npm.cmd run build` and backend `npm.cmd test` commands.

---

## Test Environment

**Files To Reference:**
- UI behavior: `front-end/app/src/dashboard/dashboard-shell.tsx`
- API client: `front-end/app/src/lib/api.ts`
- Session helper: `front-end/app/src/auth/session.ts`
- Backend routes: `back-end/src/routes/index.js`
- Product routes: `back-end/src/routes/products-routes.js`
- Transaction routes: `back-end/src/routes/transactions-routes.js`
- Prediction routes: `back-end/src/routes/predictions-routes.js`
- Import routes: `back-end/src/routes/import-routes.js`
- Store routes: `back-end/src/routes/stores-routes.js`
- Category routes: `back-end/src/routes/categories-routes.js`
- Tenant/profile route: `back-end/src/routes/tenants-routes.js`

**Required Local Services:**
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- Optional AI service if available: endpoint configured by backend env for `/api/predictions`

**Known Useradmin Routes:**
- `/dashboard/useradmin`
- `/dashboard/useradmin/inventaris`
- `/dashboard/useradmin/transaksi`
- `/dashboard/useradmin/forecasting`
- `/dashboard/useradmin/import-data`
- `/dashboard/useradmin/laporan`
- `/dashboard/useradmin/kategori`
- `/dashboard/useradmin/pengaturan`

**Pass Criteria:**
- Every sidebar nav item opens the correct page without blank content.
- Every header CTA opens the expected page or performs the expected action.
- Every panel CTA opens the expected page or performs the expected action.
- Every form shows clear validation or submits successfully.
- Success submissions return to the correct list page and new data appears.
- Failed submissions show a user-readable error and do not crash the dashboard.
- Package gating for Free vs Pro works as designed.
- Browser console has no uncaught runtime errors during the tested flow.

**Confirmed Bug Breakdown From Manual Testing:**
- `/dashboard/useradmin/forecasting`: CTA `Lihat semua` tidak berfungsi.
- `/dashboard/useradmin/import-data`: UI upload dataset membingungkan; CTA `Pilih file` tidak langsung membuka file picker dan user harus klik area lain berkali-kali.
- `/dashboard/useradmin/import-data/tambah`: user bingung harus menekan apa untuk menambah/import data.
- `/dashboard/useradmin/laporan`: banyak bug; `Export Laporan` harus mengunduh laporan CSV dan aksi `Detail` tidak jelas/bermasalah.
- `/dashboard/useradmin/pengaturan`: CTA `Upgrade` keluar dari dashboard, harus disamakan dengan modal upgrade navbar.
- `/dashboard/useradmin/pengaturan`: panel `Integrasi & Batas Akun` tidak jelas fungsinya; hapus jika tidak ada fungsi nyata.
- `/dashboard/useradmin/pengaturan`: CTA `Upgrade ke Pro` pada `Cabang Toko` tidak berfungsi.

**Fix Scope For This Plan:**
- Keep fixes frontend-first unless a feature already has a backend API.
- Remove or disable CTAs that do not map to real behavior.
- Prefer in-dashboard modal/inline states over navigating users away to unclear routes.
- Every fixed bug must be retested in the same browser session after frontend rebuild/restart.

---

### Task 1: Start Services And Verify Baseline Health

**Files:**
- Reference: `back-end/src/server.js`
- Reference: `front-end/package.json`

- [ ] **Step 1: Start backend**

Run from `back-end`:

```powershell
npm.cmd start
```

Expected output includes:

```text
StockCerdas API berjalan di http://localhost:5000
```

- [ ] **Step 2: Start frontend**

Run from `front-end` in another terminal:

```powershell
npm.cmd run dev
```

Expected output includes a local URL at `http://localhost:3000`.

- [ ] **Step 3: Check backend health**

Open or run:

```powershell
curl.exe http://localhost:5000/api/health
```

Expected: JSON response with `status` indicating success/healthy service.

- [ ] **Step 4: Check frontend loads**

Open:

```text
http://localhost:3000/login
```

Expected: login page renders without a blank screen.

---

### Task 2: Login And Session Smoke Test

**Files:**
- Reference: `front-end/app/src/auth/components/login-page.tsx`
- Reference: `front-end/app/src/auth/session.ts`
- Reference: `back-end/src/routes/auth-routes.js`

- [ ] **Step 1: Login as useradmin**

Open:

```text
http://localhost:3000/login
```

Enter a valid useradmin email/password from the local seed or registered account.

Expected: redirected to `/dashboard/useradmin`.

- [ ] **Step 2: Verify session state**

Open browser DevTools Console and run:

```js
JSON.parse(localStorage.getItem("stockcerdas_session"))
```

Expected:

```js
{
  role: "useradmin",
  tenant_id: /* number */,
  email: /* current user email */
}
```

- [ ] **Step 3: Verify protected route guard**

Manually open:

```text
http://localhost:3000/dashboard/superadmin
```

Expected: redirected away from superadmin route, normally back to `/dashboard/useradmin`.

---

### Task 3: Dashboard Overview CTAs

**Files:**
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:83`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:659-665`

- [ ] **Step 1: Open dashboard overview**

Open:

```text
http://localhost:3000/dashboard/useradmin
```

Expected: metrics render, recent transactions panel renders, restock recommendation panel renders, inventory panel renders.

- [ ] **Step 2: Test header CTA `Prediksi Restock`**

Click `Prediksi Restock`.

Expected: URL becomes `/dashboard/useradmin/forecasting` and forecasting content appears.

- [ ] **Step 3: Return to overview**

Open:

```text
http://localhost:3000/dashboard/useradmin
```

Expected: overview loads again.

- [ ] **Step 4: Test panel CTA `Lihat semua` in Transaksi Terbaru**

Click `Lihat semua` on `Transaksi Terbaru`.

Expected: URL becomes `/dashboard/useradmin/transaksi` and transaction table/list appears.

- [ ] **Step 5: Test panel CTA `Lihat semua` in Rekomendasi Restock**

Return to overview, click `Lihat semua` on `Rekomendasi Restock`.

Expected: URL becomes `/dashboard/useradmin/forecasting`.

- [ ] **Step 6: Test panel CTA `Buka inventaris`**

Return to overview, click `Buka inventaris` on `Inventaris`.

Expected: URL becomes `/dashboard/useradmin/inventaris` and product list appears.

---

### Task 3A: Fix Confirmed Useradmin CTA Bugs Before Full Retest

**Files:**
- Modify: `front-end/app/src/dashboard/dashboard-shell.tsx`
- Reference: `front-end/app/src/lib/api.ts`

- [ ] **Step 1: Fix forecasting `Lihat semua` CTA**

In the forecasting page panel `Hasil Prediksi Terbaru`, replace any no-op/self-link action with a useful behavior. If the page already displays all predictions, remove the `Lihat semua` action from that panel. If only a preview is shown, make the action navigate to `/dashboard/useradmin/forecasting` and confirm it does not block clicks.

Expected fixed behavior:

```text
Clicking `Lihat semua` either disappears because it is redundant, or keeps user on `/dashboard/useradmin/forecasting` with the full prediction list visible. It must not do nothing while still looking actionable.
```

- [ ] **Step 2: Fix import page file picker CTA**

On `/dashboard/useradmin/import-data`, make `Pilih file` a real `<label>` tied to the hidden file input with `htmlFor`, or make the visible button call `fileInputRef.current?.click()`.

Expected fixed behavior:

```text
One click on `Pilih file` opens the OS file picker immediately.
```

- [ ] **Step 3: Fix `/import-data/tambah` confusion**

Do not show a generic blank `Simpan` form on `/dashboard/useradmin/import-data/tambah`. Redirect this route back to `/dashboard/useradmin/import-data`, or render an explicit upload panel with the same `Pilih file`, selected file name, and `Upload Dataset` submit action.

Recommended minimal behavior:

```text
Opening `/dashboard/useradmin/import-data/tambah` shows an explanatory card: "Upload dataset dilakukan dari halaman Import Data" with CTA `Buka Import Data` linking to `/dashboard/useradmin/import-data`.
```

- [ ] **Step 4: Fix laporan `Export Laporan` CTA**

Implement a real frontend CSV export if no backend export endpoint exists. The export must include product summary and transaction summary data already loaded by the dashboard/API.

Expected fixed behavior:

```text
Clicking `Export Laporan` opens a clear export page or action that downloads a `.csv` file. User must not land on a blank generic form.
```

- [ ] **Step 5: Fix laporan `Detail` action**

Inspect all report cards/tables on `/dashboard/useradmin/laporan`. If `Detail` does not have a real detail view, remove the action. If it should show detail, render a clear detail panel with formatted report information and a `Kembali` action.

Expected fixed behavior:

```text
Clicking `Detail` never shows raw JSON, blank content, or a generic unrelated form.
```

- [ ] **Step 6: Fix pengaturan `Upgrade` CTA**

On `/dashboard/useradmin/pengaturan`, make the `Paket Berlangganan` CTA use the same in-dashboard upgrade modal behavior as the navbar `Upgrade`. It must not navigate the user out to `/paket` from inside dashboard.

Expected fixed behavior:

```text
Clicking `Upgrade` opens a dashboard modal with Pro price/benefits and `Konfirmasi Pembayaran`, matching the navbar upgrade flow.
```

- [ ] **Step 7: Remove unclear `Integrasi & Batas Akun` panel if non-functional**

If the panel has no connected settings, no CTA, and no actionable user value, remove it from `/dashboard/useradmin/pengaturan`. Keep package limits only if they are directly useful in the `Paket Berlangganan` or `Cabang Toko` panel.

Expected fixed behavior:

```text
The settings page contains only useful panels: `Profil Akun`, `Paket Berlangganan`, and `Cabang Toko`, unless integration controls are implemented for real.
```

- [ ] **Step 8: Fix `Upgrade ke Pro` CTA in `Cabang Toko`**

For Free accounts, make `Upgrade ke Pro` open the same dashboard upgrade modal as navbar/paket panel. For Pro accounts, keep `Tambah Toko` linking to `/dashboard/useradmin/pengaturan/tambah`.

Expected fixed behavior:

```text
Free: clicking `Upgrade ke Pro` opens upgrade modal.
Pro: clicking `Tambah Toko` opens add-store form.
```

- [ ] **Step 9: Run targeted frontend build after fixes**

Run from `front-end`:

```powershell
npm.cmd run build
```

Expected: Next.js build completes successfully.

---

### Task 4: Sidebar And Mobile Navigation Coverage

**Files:**
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:64-72`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:123-164`

- [ ] **Step 1: Test desktop sidebar navigation**

At desktop width, click each sidebar item in order:

```text
Dashboard
Inventaris
Transaksi
Forecasting
Import Data
Laporan
Kategori
Pengaturan
```

Expected: each click changes the route to the matching `/dashboard/useradmin/...` page and highlights the active menu item.

- [ ] **Step 2: Test mobile top navigation**

Resize browser to mobile width or use DevTools device toolbar.

Click each horizontal nav item in order:

```text
Dashboard
Inventaris
Transaksi
Forecasting
Import Data
Laporan
Kategori
Pengaturan
```

Expected: each route loads, active item styling updates, no layout overlap blocks the content.

---

### Task 5: Inventaris Feature And CTAs

**Files:**
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:376-383`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:921-927`
- Reference: `back-end/src/routes/products-routes.js`

- [ ] **Step 1: Open inventaris page**

Open:

```text
http://localhost:3000/dashboard/useradmin/inventaris
```

Expected: store selector appears if stores exist, product table/list appears, header CTA `Tambah Produk` appears.

- [ ] **Step 2: Test header CTA `Tambah Produk`**

Click `Tambah Produk`.

Expected: URL becomes `/dashboard/useradmin/inventaris/tambah` and form fields appear:

```text
SKU
Nama Produk
Kategori
Harga Jual
Stok Saat Ini
Minimum Stok
```

- [ ] **Step 3: Submit invalid empty product form**

Click `Simpan` with required fields empty.

Expected: browser validation prevents submit or required-field message appears. No API error should crash the page.

- [ ] **Step 4: Submit valid product form**

Fill:

```text
SKU: QA-USERADMIN-001
Nama Produk: Produk QA Useradmin
Kategori: pilih kategori yang tersedia
Harga Jual: 15000
Stok Saat Ini: 25
Minimum Stok: 5
```

Click `Simpan`.

Expected: redirected to `/dashboard/useradmin/inventaris`, product appears in list.

- [ ] **Step 5: Test panel CTA `Tambah produk`**

From `/dashboard/useradmin/inventaris`, click panel action `Tambah produk`.

Expected: opens the same add-product route. If an active store exists, URL may include `?store_id=<id>`.

- [ ] **Step 6: Test product detail action**

Click detail/view action on `Produk QA Useradmin`.

Expected: detail page renders formatted product information, not raw JSON.

- [ ] **Step 7: Test product edit action**

Open edit action for `Produk QA Useradmin`, change `Stok Saat Ini` from `25` to `30`, click `Simpan`.

Expected: redirected to inventory list and product stock shows `30`.

- [ ] **Step 8: Test product delete action**

Open delete action for `Produk QA Useradmin`, confirm delete.

Expected: redirected to inventory list and product no longer appears.

---

### Task 6: Transaksi Feature And CTAs

**Files:**
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:385-391`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:928-932`
- Reference: `back-end/src/routes/transactions-routes.js`

- [ ] **Step 1: Open transaksi page**

Open:

```text
http://localhost:3000/dashboard/useradmin/transaksi
```

Expected: transaction list appears and header CTA `Tambah Transaksi` appears.

- [ ] **Step 2: Test header CTA `Tambah Transaksi`**

Click `Tambah Transaksi`.

Expected: URL becomes `/dashboard/useradmin/transaksi/tambah` and form fields appear:

```text
Produk
Tipe
Jumlah
Waktu Transaksi (Opsional)
Catatan
```

- [ ] **Step 3: Submit invalid empty transaction form**

Click `Simpan` without selecting product/type/quantity.

Expected: browser validation prevents submit or required-field message appears.

- [ ] **Step 4: Submit valid stok masuk transaction**

Fill:

```text
Produk: pilih produk yang tersedia
Tipe: Stok Masuk
Jumlah: 3
Catatan: QA stok masuk
```

Click `Simpan`.

Expected: redirected to `/dashboard/useradmin/transaksi`, new transaction appears.

- [ ] **Step 5: Submit valid stok keluar transaction**

Click `Tambah Transaksi` again and fill:

```text
Produk: pilih produk yang tersedia
Tipe: Stok Keluar
Jumlah: 1
Catatan: QA stok keluar
```

Expected: redirected to transaction list and new out transaction appears.

- [ ] **Step 6: Test transaction delete action**

Open delete action for a QA transaction and confirm delete.

Expected: transaction no longer appears in list.

---

### Task 7: Forecasting Feature, CTA, And Package Gate

**Files:**
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:393-403`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:902-905`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:933-935`
- Reference: `back-end/src/routes/predictions-routes.js`

- [ ] **Step 1: Open forecasting page**

Open:

```text
http://localhost:3000/dashboard/useradmin/forecasting
```

Expected: prediction panel and prediction result list render.

- [ ] **Step 2: Test header CTA `Jalankan Prediksi`**

Click `Jalankan Prediksi`.

Expected: URL becomes `/dashboard/useradmin/forecasting/tambah` and prediction form appears.

- [ ] **Step 3: Test panel CTA `Buat Prediksi`**

Return to `/dashboard/useradmin/forecasting`, click `Buat Prediksi`.

Expected: opens the same add-prediction route. If an active store exists, URL may include `?store_id=<id>`.

- [ ] **Step 4: Test Free plan gated periods**

If the logged-in account has plan `free`, open prediction form and choose `14 Hari (Khusus Pro)` or `30 Hari (Khusus Pro)`.

Click `Simpan`.

Expected error message:

```text
Prediksi 14 Hari dan 30 Hari khusus untuk Paket Pro. Silakan upgrade paket Anda.
```

- [ ] **Step 5: Test valid 7-day prediction**

Choose:

```text
Produk: pilih produk yang tersedia
Periode Prediksi: 7 Hari
```

Click `Simpan`.

Expected: loading message `AI sedang menganalisis data Anda. Tunggu sebentar...` appears while submitting, then page redirects to `/dashboard/useradmin/forecasting`. New prediction appears or a readable backend/AI error appears if AI service is unavailable.

- [ ] **Step 6: Test Pro plan periods if account is Pro**

If logged-in account has plan `pro`, confirm options include:

```text
7 Hari
14 Hari
30 Hari
```

Submit `14 Hari` and `30 Hari` using any available product.

Expected: no Pro-gate error. Submission either succeeds or shows a readable AI/backend error.

- [ ] **Step 7: Retest confirmed bug: `Lihat semua` CTA**

On `/dashboard/useradmin/forecasting`, click `Lihat semua` in the prediction results panel if it is still visible.

Expected after fix:

```text
The CTA is either removed as redundant, or it visibly scrolls/navigates to the full prediction list. It must not remain as a clickable-looking control that does nothing.
```

---

### Task 8: Import Data Feature And CTAs

**Files:**
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:406-469`
- Reference: `back-end/src/routes/import-routes.js`

- [ ] **Step 1: Open import page**

Open:

```text
http://localhost:3000/dashboard/useradmin/import-data
```

Expected: import panel renders with CSV/XLSX guidance, upload controls, and sync action if present.

- [ ] **Step 2: Test header CTA `Upload Dataset`**

Click `Upload Dataset`.

Expected after fix: route opens `/dashboard/useradmin/import-data/tambah` with a clear instruction card or upload workflow. It must not show a generic empty form with only `Simpan`.

- [ ] **Step 2A: Retest confirmed bug: one-click `Pilih file`**

On `/dashboard/useradmin/import-data`, click `Pilih file` exactly once.

Expected after fix:

```text
The OS file picker opens immediately from a single click.
```

- [ ] **Step 2B: Retest confirmed bug: `/import-data/tambah` guidance**

Open:

```text
http://localhost:3000/dashboard/useradmin/import-data/tambah
```

Expected after fix:

```text
The page clearly tells the user how to upload/import data, with either a working upload UI or a CTA back to `/dashboard/useradmin/import-data`.
```

- [ ] **Step 3: Test CSV upload**

Use a small CSV file with representative product rows. If no local test file exists, create one outside the repo with this content:

```csv
sku,name,category,price,current_stock,minimum_stock
QA-CSV-001,Produk CSV QA,Sembako,12000,10,3
```

Upload it via the import UI.

Expected: success message indicates uploaded/parsed products and imported product appears in inventory.

- [ ] **Step 4: Test XLSX gating**

If logged-in account is `free`, upload an `.xlsx` file.

Expected: readable error that XLSX is Pro-only.

- [ ] **Step 5: Test API sync action**

Click sync action for external marketplace/API data if visible.

Expected: readable success message from backend, such as sync completed, or readable backend error. No blank page or uncaught console error.

---

### Task 9: Laporan Feature And Export CTA

**Files:**
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:471-526`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:88`

- [ ] **Step 1: Open laporan page**

Open:

```text
http://localhost:3000/dashboard/useradmin/laporan
```

Expected: report/insight cards render without blank state crash.

- [ ] **Step 2: Test header CTA `Export Laporan`**

Click `Export Laporan`.

Expected after fix: opens a clear export/download workflow and downloads a `.csv` report. It must not open a generic empty form.

- [ ] **Step 3: Verify export route behavior**

Observe `/dashboard/useradmin/laporan/tambah`.

Expected after fix: an actual export/download workflow runs and the downloaded CSV contains product and transaction summaries. It must not show only a blank generic form with `Simpan`.

- [ ] **Step 4: Retest confirmed bug: laporan `Detail` action**

Click every `Detail` action visible on `/dashboard/useradmin/laporan`.

Expected after fix:

```text
Each `Detail` action opens a real formatted detail view, or no `Detail` action is rendered when there is no real detail feature.
```

---

### Task 10: Kategori Feature And CTAs

**Files:**
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:528-566`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:936-938`
- Reference: `back-end/src/routes/categories-routes.js`

- [ ] **Step 1: Open kategori page**

Open:

```text
http://localhost:3000/dashboard/useradmin/kategori
```

Expected: category management list appears and header CTA `Tambah Kategori` appears.

- [ ] **Step 2: Test header CTA `Tambah Kategori`**

Click `Tambah Kategori`.

Expected: URL becomes `/dashboard/useradmin/kategori/tambah` with fields:

```text
Nama Kategori
Deskripsi (Opsional)
```

- [ ] **Step 3: Submit invalid empty category form**

Click `Simpan` without name.

Expected: browser validation prevents submit.

- [ ] **Step 4: Submit valid category**

Fill:

```text
Nama Kategori: QA Kategori Useradmin
Deskripsi: Dibuat untuk QA dashboard useradmin
```

Click `Simpan`.

Expected: redirected to `/dashboard/useradmin/kategori`, category appears.

- [ ] **Step 5: Test panel CTA `Tambah Kategori`**

Return to category list, click panel action `Tambah Kategori`.

Expected: opens `/dashboard/useradmin/kategori/tambah`.

- [ ] **Step 6: Test category edit**

Edit `QA Kategori Useradmin` and change description to:

```text
Deskripsi setelah edit QA
```

Expected: redirected to category list and updated description appears.

- [ ] **Step 7: Test category delete**

Delete `QA Kategori Useradmin`.

Expected: redirected to category list and category no longer appears.

---

### Task 11: Pengaturan Feature, Profile Edit, Upgrade CTA, And Store Gate

**Files:**
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:568-625`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:942-972`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx:1056-1098`
- Reference: `front-end/app/src/auth/session.ts`
- Reference: `back-end/src/routes/tenants-routes.js`
- Reference: `back-end/src/routes/stores-routes.js`

- [ ] **Step 1: Open pengaturan page**

Open:

```text
http://localhost:3000/dashboard/useradmin/pengaturan
```

Expected panels render:

```text
Profil Akun
Paket Berlangganan
Cabang Toko
```

If `Integrasi & Batas Akun` still renders, it must have real user value. If it remains informational-only and non-functional, record it as unfixed.

- [ ] **Step 2: Test header CTA `Edit Pengaturan`**

Click `Edit Pengaturan`.

Expected: URL becomes `/dashboard/useradmin/pengaturan/edit` and edit profile form appears.

- [ ] **Step 3: Test panel CTA `Edit profil`**

Return to `/dashboard/useradmin/pengaturan`, click panel action `Edit profil`.

Expected: opens the same edit profile route.

- [ ] **Step 4: Test profile image upload**

On edit profile page, upload a normal JPG/PNG photo.

Expected: avatar preview appears. Browser console must not show:

```text
Failed to execute 'setItem' on 'Storage'
```

- [ ] **Step 5: Save edited profile**

Change:

```text
Nama Admin: QA Admin Updated
Email: keep a valid email owned by the account
Nama Usaha: QA Business Updated
```

Click `Simpan Profil`.

Expected: redirected to `/dashboard/useradmin/pengaturan`, updated name/business/avatar appear in profile areas after refresh.

- [ ] **Step 6: Verify local session size after image save**

Open browser console and run:

```js
localStorage.getItem("stockcerdas_session").length
```

Expected: value stays well below browser quota, preferably below `250000` characters.

- [ ] **Step 7: Test Free package CTA**

If account plan is `free`, click `Upgrade` in `Paket Berlangganan`.

Expected after fix: opens the same dashboard upgrade modal used by the navbar `Upgrade`, with Pro price/benefits and `Konfirmasi Pembayaran`. It must not navigate out to `/paket`.

- [ ] **Step 8: Test Pro package CTA**

If account plan is `pro`, confirm action reads `Paket aktif` and does not navigate to an empty route.

- [ ] **Step 9: Test Free store gate**

If account plan is `free`, click `Upgrade ke Pro` in `Cabang Toko`.

Expected after fix: opens the same dashboard upgrade modal used by navbar and package panel. It must not be a no-op and must not open an empty add-store form.

- [ ] **Step 10: Test Pro add store**

If account plan is `pro`, click `Tambah Toko`.

Expected: URL becomes `/dashboard/useradmin/pengaturan/tambah` with fields:

```text
Nama Cabang Toko
Lokasi
```

Fill:

```text
Nama Cabang Toko: QA Cabang Useradmin
Lokasi: Yogyakarta
```

Click `Simpan`.

Expected: redirected to `/dashboard/useradmin/pengaturan`, new store appears in `Cabang Toko`.

---

### Task 12: Logout And Session Cleanup

**Files:**
- Reference: `front-end/app/src/auth/session.ts`
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx`

- [ ] **Step 1: Click compact header Logout**

Click `Logout` in the top header.

Expected: redirected to `/login`.

- [ ] **Step 2: Verify storage cleanup**

Open browser console and run:

```js
localStorage.getItem("stockcerdas_session")
```

Expected:

```js
null
```

- [ ] **Step 3: Verify dashboard protection after logout**

Open:

```text
http://localhost:3000/dashboard/useradmin
```

Expected: redirected to `/login`.

---

### Task 13: Cross-Feature Regression Checks

**Files:**
- Reference: `front-end/app/src/dashboard/dashboard-shell.tsx`
- Reference: `front-end/app/src/lib/api.ts`

- [ ] **Step 1: Check browser console during full run**

Open DevTools Console while navigating all useradmin pages.

Expected: no uncaught React/runtime exceptions.

- [ ] **Step 2: Check Network tab failures**

Open DevTools Network, filter by `Fetch/XHR`, then revisit every useradmin page.

Expected: normal `200` responses for list endpoints. Any `400/403/404/500` must match the intentionally tested failure case and show a readable UI error.

- [ ] **Step 3: Run backend unit tests**

Run from `back-end`:

```powershell
npm.cmd test
```

Expected: all backend tests pass.

- [ ] **Step 4: Run frontend session regression test**

Run from `front-end`:

```powershell
node --experimental-strip-types --test app/src/auth/session.test.mjs
```

Expected: all session tests pass.

- [ ] **Step 5: Run frontend production build**

Run from `front-end`:

```powershell
npm.cmd run build
```

Expected: Next.js build completes successfully.

---

### Task 14: Record Bugs Found During Manual QA

**Files:**
- Create if needed: `docs/superpowers/plans/2026-05-31-useradmin-dashboard-qa-findings.md`

- [ ] **Step 1: Create findings document when a bug is found**

For every bug, add an entry in `docs/superpowers/plans/2026-05-31-useradmin-dashboard-qa-findings.md` using this exact format:

```markdown
## [Severity] [Feature] Short bug title

Route: `/dashboard/useradmin/...`

Steps:
1. Step one
2. Step two
3. Step three

Expected:
Describe expected behavior.

Actual:
Describe actual behavior.

Evidence:
- Screenshot: path or filename if available
- Console error: exact message if present
- Network response: endpoint and status if relevant
```

- [ ] **Step 2: Classify severity**

Use one of these labels:

```text
Critical: blocks login, crashes dashboard, or corrupts data
High: main CTA/form unusable
Medium: feature works but confusing, missing feedback, or wrong route
Low: copy/layout polish issue
```

- [ ] **Step 3: Summarize final QA status**

At the top of the findings document, add:

```markdown
# Useradmin Dashboard QA Findings

Date: 2026-05-31
Tester: Manual QA
Environment: localhost frontend/backend

Summary:
- Total Critical:
- Total High:
- Total Medium:
- Total Low:
- Overall Status: Pass / Pass with issues / Fail
```

---

## Self-Review Checklist

- [ ] Covers every useradmin sidebar route.
- [ ] Covers every useradmin header CTA.
- [ ] Covers every useradmin panel CTA visible in the dashboard shell.
- [ ] Covers create/edit/delete/detail flows where current UI exposes them.
- [ ] Covers Free/Pro package-gated behavior.
- [ ] Covers profile image quota regression.
- [ ] Covers build and backend test verification.
- [ ] Provides an exact bug-reporting format for issues found during QA.
