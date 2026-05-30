"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { LogoutButton } from "@/dashboard/logout-button";
import { SessionProfile } from "@/dashboard/session-profile";
import { saveSession } from "@/auth/session";
import * as api from "@/lib/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

export type DashboardRole = "useradmin" | "superadmin";
export type UserAdminView =
  | "dashboard"
  | "inventaris"
  | "transaksi"
  | "forecasting"
  | "import-data"
  | "laporan"
  | "pengaturan"
  | "kategori";
export type SuperAdminView = "dashboard" | "pengguna" | "monitoring" | "pengaturan";
export type DashboardView = UserAdminView | SuperAdminView;
export type DashboardAction = "tambah" | "detail" | "edit" | "hapus";

type MetricTone = "teal" | "amber" | "red" | "blue";

type Metric = {
  label: string;
  value: string | number;
  helper: string;
  tone: MetricTone;
};

type NavItem = {
  label: string;
  href: string;
  view: DashboardView;
};

const toneStyles: Record<MetricTone, string> = {
  teal: "border-[#a7d8cf] bg-[#edf8f6] text-[#0f8276]",
  amber: "border-[#f0cf8a] bg-[#fff7e6] text-[#9a6500]",
  red: "border-[#f0a8a8] bg-[#fff1f1] text-[#b42318]",
  blue: "border-[#a8c7f0] bg-[#edf4ff] text-[#1d5fa7]",
};

const userAdminNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/useradmin", view: "dashboard" },
  { label: "Inventaris", href: "/dashboard/useradmin/inventaris", view: "inventaris" },
  { label: "Transaksi", href: "/dashboard/useradmin/transaksi", view: "transaksi" },
  { label: "Forecasting", href: "/dashboard/useradmin/forecasting", view: "forecasting" },
  { label: "Import Data", href: "/dashboard/useradmin/import-data", view: "import-data" },
  { label: "Laporan", href: "/dashboard/useradmin/laporan", view: "laporan" },
  { label: "Kategori", href: "/dashboard/useradmin/kategori", view: "kategori" },
  { label: "Pengaturan", href: "/dashboard/useradmin/pengaturan", view: "pengaturan" },
];

const superAdminNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/superadmin", view: "dashboard" },
  { label: "Manajemen Pengguna", href: "/dashboard/superadmin/pengguna", view: "pengguna" },
  { label: "Monitoring Sistem", href: "/dashboard/superadmin/monitoring", view: "monitoring" },
  { label: "Pengaturan Sistem", href: "/dashboard/superadmin/pengaturan", view: "pengaturan" },
];

const pageTitles: Record<string, { eyebrow: string; title: string; cta: string; ctaHref?: string }> = {
  "useradmin-dashboard": { eyebrow: "Dashboard Operasional", title: "Ringkasan stok dan restock", cta: "Prediksi Restock", ctaHref: "/dashboard/useradmin/forecasting" },
  "useradmin-inventaris": { eyebrow: "Inventaris", title: "Kelola produk dan level stok", cta: "Tambah Produk", ctaHref: "/dashboard/useradmin/inventaris/tambah" },
  "useradmin-transaksi": { eyebrow: "Transaksi", title: "Catat stok masuk dan keluar", cta: "Tambah Transaksi", ctaHref: "/dashboard/useradmin/transaksi/tambah" },
  "useradmin-forecasting": { eyebrow: "Forecasting", title: "Prediksi kebutuhan restock", cta: "Jalankan Prediksi", ctaHref: "/dashboard/useradmin/forecasting/tambah" },
  "useradmin-import-data": { eyebrow: "Import Data", title: "Validasi dan unggah data awal", cta: "Upload Dataset", ctaHref: "/dashboard/useradmin/import-data/tambah" },
  "useradmin-laporan": { eyebrow: "Laporan", title: "Insight bisnis dan ringkasan performa", cta: "Export Laporan", ctaHref: "/dashboard/useradmin/laporan/tambah" },
  "useradmin-kategori": { eyebrow: "Kategori", title: "Kelola kategori produk", cta: "Tambah Kategori", ctaHref: "/dashboard/useradmin/kategori/tambah" },
  "useradmin-pengaturan": { eyebrow: "Pengaturan", title: "Konfigurasi toko dan integrasi", cta: "Edit Pengaturan", ctaHref: "/dashboard/useradmin/pengaturan/edit" },
  "superadmin-dashboard": { eyebrow: "Dashboard Super Admin", title: "Pantau kesehatan platform", cta: "Export Ringkasan", ctaHref: "/dashboard/superadmin/monitoring" },
  "superadmin-pengguna": { eyebrow: "Manajemen Pengguna", title: "Kelola akun UMKM", cta: "Tambah Akun", ctaHref: "/dashboard/superadmin/pengguna/tambah" },
  "superadmin-monitoring": { eyebrow: "Monitoring Sistem", title: "Status API, AI, dan integrasi data", cta: "Refresh Status", ctaHref: "/dashboard/superadmin/monitoring" },
  "superadmin-pengaturan": { eyebrow: "Pengaturan Sistem", title: "Konfigurasi global platform", cta: "Tambah Konfigurasi", ctaHref: "/dashboard/superadmin/pengaturan/tambah" },
};

export function DashboardShell({ role, view = "dashboard", action }: { role: DashboardRole; view?: DashboardView; action?: DashboardAction }) {
  const isSuperAdmin = role === "superadmin";
  const navItems = isSuperAdmin ? superAdminNav : userAdminNav;
  const page = pageTitles[`${role}-${view}`] ?? pageTitles[`${role}-dashboard`];
  const [shellPlan, setShellPlan] = useState<string>("free");
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem("stockcerdas_session");
    if (!sessionStr) return;

    try {
      const session = JSON.parse(sessionStr);
      if (session.plan) setShellPlan(session.plan);
    } catch (e) {}
  }, []);

  return (
    <main className="min-h-screen bg-[#eef1f4] text-[#172033]">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-[260px] shrink-0 border-r border-[#d5dbe3] bg-white px-5 py-6 lg:block">
          <div>
            <Image src="/assets/logo-text.svg" alt="Logo StokCerdas" width={190} height={40} priority className="h-auto w-[170px]" />
            <p className="mt-1 text-xs font-semibold uppercase text-[#7b8796]">{isSuperAdmin ? "Super Admin" : "Admin UMKM"}</p>
          </div>
          <nav className="mt-8 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`block rounded-lg px-4 py-3 text-sm font-bold transition ${item.view === view ? "bg-[#0f8276] text-white shadow-[0_10px_24px_rgba(15,130,118,0.22)]" : "text-[#526072] hover:bg-[#edf8f6] hover:text-[#0f8276]"}`}>{item.label}</Link>
            ))}
          </nav>
          <div className="mt-8 space-y-4 border-t border-[#e0e5ec] pt-5">
            <SessionProfile />
            <LogoutButton />
          </div>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[#d5dbe3] bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#0f8276]">{page.eyebrow}</p>
                <h1 className="mt-1 text-2xl font-extrabold leading-tight text-[#172033] sm:text-3xl">{page.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="hidden sm:block"><SessionProfile compact /></div>
                {!isSuperAdmin && (
                  shellPlan === "pro" ? (
                    <span className="hidden h-[38px] items-center justify-center rounded-lg border border-[#cfd6df] bg-white px-4 text-sm font-extrabold uppercase text-[#0f8276] sm:inline-flex">
                      Pro
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowUpgradePrompt(true)}
                      className="hidden h-[38px] items-center justify-center rounded-lg border border-[#cfd6df] bg-white px-4 text-sm font-extrabold text-[#334155] transition hover:border-[#0f8276] hover:text-[#0f8276] sm:inline-flex"
                    >
                      Upgrade
                    </button>
                  )
                )}
                <Link href={page.ctaHref ?? "#"} className="inline-flex h-[38px] items-center justify-center rounded-lg border border-transparent bg-[#0f8276] px-4 text-sm font-extrabold text-white transition hover:bg-[#0b6f66]">{page.cta}</Link>
                <LogoutButton compact />
              </div>
            </div>
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:hidden scrollbar-hide">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-extrabold ${item.view === view ? "bg-[#0f8276] text-white" : "bg-[#eef1f4] text-[#526072]"}`}>{item.label}</Link>
              ))}
            </nav>
          </header>
          <div className="w-full px-4 pb-12 pt-6 sm:px-6 lg:px-8">
            {action ? (
              <ActionPage role={role} view={view} action={action} />
            ) : isSuperAdmin ? (
              <SuperAdminContent view={view as SuperAdminView} />
            ) : (
              <UserAdminContent view={view as UserAdminView} />
            )}
          </div>
        </section>
      </div>
      {showUpgradePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[420px] rounded-2xl border border-[#d8dde5] bg-white p-6 shadow-[0_24px_70px_rgba(17,24,39,0.22)]">
            <p className="text-sm font-extrabold uppercase text-[#0f8276]">Upgrade Paket</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#172033]">Aktifkan fitur Pro</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-[#657181]">
              Paket Pro membuka akses forecasting 30 hari, multi-toko, import XLSX, sinkronisasi API, dan rekomendasi restock otomatis.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowUpgradePrompt(false)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#cfd6df] px-4 text-sm font-extrabold text-[#334155] transition hover:border-[#0f8276] hover:text-[#0f8276]"
              >
                Nanti saja
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentConfirm(true)}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0f8276] px-4 text-sm font-extrabold text-white transition hover:bg-[#0b6f66]"
              >
                Lihat Paket Pro
              </button>
            </div>
            {showPaymentConfirm && (
              <div className="mt-6 rounded-xl border border-[#d8dde5] bg-[#f8fafc] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-extrabold text-[#172033]">Paket Pro</p>
                    <p className="mt-1 text-3xl font-extrabold text-[#0f8276]">Rp 150K<span className="text-sm text-[#657181]">/30 hari</span></p>
                  </div>
                  <span className="rounded-full bg-[#edf8f6] px-3 py-1 text-xs font-extrabold uppercase text-[#0f8276]">Popular</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm font-semibold text-[#526072]">
                  <li>Forecasting AI sampai 30 hari</li>
                  <li>Multi-toko hingga 3 cabang</li>
                  <li>Import CSV/XLSX dan sinkronisasi API</li>
                </ul>
                <button
                  type="button"
                  className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0f8276] px-4 text-sm font-extrabold text-white transition hover:bg-[#0b6f66]"
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function LoadingSpinner() {
  return <div className="flex justify-center p-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0f8276] border-t-transparent"></div></div>;
}

function UserAdminContent({ view }: { view: UserAdminView }) {
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<number | null>(null);

  useEffect(() => {
    const savedStoreId = localStorage.getItem("stockcerdas_active_store");
    if (savedStoreId) setActiveStoreId(Number(savedStoreId));
  }, []);
  const [loading, setLoading] = useState(true);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>("free");
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem("stockcerdas_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setAccount(session);
        setTenantId(session.tenant_id);
        if (session.plan) setPlan(session.plan);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    async function loadStores() {
      if (tenantId) {
        try {
          const [storesRes, catRes] = await Promise.all([
            api.getStores(tenantId),
            api.getCategories(tenantId)
          ]);
          const storesData = storesRes.data || [];
          setStores(storesData);
          setCategories(catRes.data || []);
          
          let validStoreId = activeStoreId;
          if (activeStoreId && !storesData.some((s: any) => s.id === activeStoreId)) {
            validStoreId = null;
          }

          if (storesData.length > 0 && !validStoreId) {
            setActiveStoreId(storesData[0].id);
            localStorage.setItem("stockcerdas_active_store", String(storesData[0].id));
            localStorage.setItem("stockcerdas_active_store_name", storesData[0].store_name);
            window.dispatchEvent(new Event("storeNameChanged"));
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    loadStores();
  }, [tenantId]);

  useEffect(() => {
    async function loadData() {
      if (!tenantId) return; // wait for tenantId to load
      try {
        setLoading(true);
        const params: any = { tenant_id: tenantId };
        if (activeStoreId) {
          // Hanya fetch menggunakan store_id jika store-nya benar-benar milik tenant ini
          if (stores.some(s => s.id === activeStoreId)) {
            params.store_id = activeStoreId;
          } else {
            return; // Tunggu effect loadStores menyelesaikan perbaikan activeStoreId
          }
        }
        
        const [prodRes, transRes, predRes] = await Promise.all([
          api.getProducts(params),
          api.getTransactions(params),
          api.getPredictions(params)
        ]);
        
        setProducts(prodRes.data || []);
        setTransactions(transRes.data || []);
        setPredictions(predRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeStoreId, tenantId, stores]);

  if (loading) return <LoadingSpinner />;

  let totalProducts = products.length;
  let lowStock = products.filter(p => p.current_stock > 0 && p.current_stock <= p.minimum_stock).length;
  let highRisk = predictions.filter(p => p.risk_level === "high").length;
  let totalValue = products.reduce((acc, p) => acc + (Number(p.price) * p.current_stock), 0);

  const userMetrics: Metric[] = [
    { label: "Total Produk", value: totalProducts, helper: "Produk terdaftar", tone: "teal" },
    { label: "Stok Menipis", value: lowStock, helper: "Butuh cek hari ini", tone: "amber" },
    { label: "Risiko Understock", value: highRisk, helper: "Berdasarkan AI", tone: "red" },
    { label: "Nilai Inventaris", value: `Rp${totalValue.toLocaleString("id-ID")}`, helper: "Total kapitalisasi", tone: "blue" },
  ];

  const StoreSelector = () => (
    <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm border border-[#eef1f4]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef1f4] text-[#0f8276]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <div>
          <p className="text-xs font-bold text-[#657181] uppercase tracking-wider">Cabang Aktif</p>
          <select 
            className="mt-1 block w-full rounded-md border-gray-300 py-1 pl-0 pr-8 text-base font-extrabold text-[#172033] focus:border-[#0f8276] focus:outline-none focus:ring-[#0f8276] sm:text-sm bg-transparent"
            value={activeStoreId || ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              setActiveStoreId(val);
              localStorage.setItem("stockcerdas_active_store", String(val));
              const activeStoreName = stores.find(s => s.id === val)?.store_name || "";
              localStorage.setItem("stockcerdas_active_store_name", activeStoreName);
              window.dispatchEvent(new Event("storeNameChanged"));
            }}
          >
            {stores.map(s => <option key={s.id} value={s.id}>{s.store_name}</option>)}
          </select>
        </div>
      </div>
      <div className="hidden sm:block text-right">
        <span className="inline-flex items-center rounded-full bg-[#eef1f4] px-2.5 py-0.5 text-xs font-medium text-[#526072]">
          {stores.find(s => s.id === activeStoreId)?.location || "Lokasi tidak diset"}
        </span>
      </div>
    </div>
  );

  if (view === "inventaris") return (
    <div className="grid gap-6">
      <StoreSelector />
      <MetricGrid metrics={userMetrics.slice(0, 3)} />
      <Panel title="Daftar Produk" action="Tambah produk" actionHref={`/dashboard/useradmin/inventaris/tambah${activeStoreId ? `?store_id=${activeStoreId}` : ''}`}>
        <ProductTable data={products} actionBase="/dashboard/useradmin/inventaris" />
      </Panel>
    </div>
  );
  if (view === "transaksi") return (
    <div className="grid gap-6">
      <StoreSelector />
      <Panel title="Riwayat Transaksi" action="Tambah transaksi" actionHref={`/dashboard/useradmin/transaksi/tambah${activeStoreId ? `?store_id=${activeStoreId}` : ''}`}>
        <TransactionList data={transactions} />
      </Panel>
    </div>
  );
  if (view === "forecasting") return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="col-span-full"><StoreSelector /></div>
      <Panel title="Jalankan Prediksi Baru" action="Buat Prediksi" actionHref={`/dashboard/useradmin/forecasting/tambah${activeStoreId ? `?store_id=${activeStoreId}` : ''}`}>
        <p className="text-sm text-[#657181]">
          {plan === "pro" ? "Prediksi AI Pro (30 Hari) diaktifkan." : "Paket Free Anda mendukung Prediksi AI maksimal 7 Hari. Upgrade ke Pro untuk fitur lebih lanjut."}
        </p>
      </Panel>
      <Panel title="Hasil Prediksi Terbaru" action="Lihat semua" actionHref="/dashboard/useradmin/forecasting">
        <RecommendationList data={predictions} />
      </Panel>
    </div>
  );
  if (view === "import-data") {
    const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setImportStatus("Uploading...");
      try {
        const formData = new FormData(e.currentTarget);
        const file = formData.get("file") as File;
        if (!file) return;
        const fileName = file.name;
        const fileExt = fileName.split('.').pop() || "csv";
        const fileContent = await file.text();
        const res = await api.uploadData({ tenant_id: tenantId!, store_id: activeStoreId!, file_name: fileName, file_type: fileExt, file_content: fileContent }); {/* ada merah diminiamp */}
        setImportStatus(res.message || "Upload berhasil diproses"); {/* ada merah di minimap */}
      } catch (err: any) {
        setImportStatus(err.message);
      }
    };

    const handleSync = async () => {
      setIsSyncing(true);
      setImportStatus("Sinkronisasi sedang berjalan...");
      try {
        const res = await api.syncApiData();
        setImportStatus(res.message || "Sinkronisasi selesai diproses"); {/* ada merah di minimap */}
      } catch (err: any) {
        setImportStatus(err.message);
      } finally {
        setIsSyncing(false);
      }
    };

    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="col-span-full"><StoreSelector /></div>
        <Panel title="Upload File Dataset" action="Pilih File">
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div className="rounded-lg border-2 border-dashed border-[#e0e5ec] p-6 text-center">
              <input type="file" name="file" accept={plan === "pro" ? ".csv,.xlsx" : ".csv"} className="mb-2 w-full text-sm" required />
              <p className="text-xs text-[#657181]">
                {plan === "pro" ? "Format .csv atau .xlsx (Tanpa Batas Baris)" : "Hanya format .csv (Maksimal 500 Baris). Upgrade ke Pro untuk .xlsx."}
              </p>
            </div>
            <button type="submit" className="rounded-lg bg-[#0f8276] px-4 py-2 text-sm font-extrabold text-white">Upload File</button>
          </form>
          {importStatus && <div className="mt-4 rounded bg-[#eef1f4] p-3 text-sm text-[#172033]">{importStatus}</div>}
        </Panel>

        <Panel title="Sinkronisasi API E-Commerce">  {/* ada merah di minimap  */}
          <div className="flex h-full flex-col justify-between gap-4 rounded-lg bg-[#f8fafb] p-6">
            <div>
              <h4 className="font-extrabold text-[#172033] mb-2">Integrasi Tokopedia & Shopee</h4>
              <p className="text-sm text-[#526072]">Tarik data penjualan dan sisa stok secara otomatis tanpa input manual.</p>
            </div>
            {plan === "pro" ? (
              <button onClick={handleSync} disabled={isSyncing} className={`rounded-lg px-4 py-3 text-sm font-extrabold text-white ${isSyncing ? "bg-gray-400" : "bg-[#172033]"}`}>
                {isSyncing ? "Sedang Menyinkronkan..." : "Mulai Sinkronisasi"}
              </button>
            ) : (
              <button disabled className="rounded-lg bg-gray-300 px-4 py-3 text-sm font-extrabold text-[#657181]">Terkunci (Khusus Pro)</button>
            )}
          </div>
        </Panel>
      </div>
    );
  }
  if (view === "laporan") {
    const groupedTx = transactions.reduce((acc: any, t: any) => {
      const date = new Date(t.transaction_date).toLocaleDateString("id-ID");
      acc[date] = (acc[date] || 0) + Number(t.quantity);
      return acc;
    }, {});
    
    const txDates = Object.keys(groupedTx).slice(-7);
    const txQuantities = txDates.map(d => groupedTx[d]);

    const lineData = {
      labels: txDates.length ? txDates : ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
      datasets: [
        {
          label: "Volume Transaksi",
          data: txQuantities.length ? txQuantities : [12, 19, 3, 5, 2, 3, 9],
          borderColor: "#0f8276",
          backgroundColor: "rgba(15, 130, 118, 0.2)",
          tension: 0.4,
          fill: true
        }
      ]
    };
    
    const categories: Record<string, number> = {};
    products.forEach(p => { categories[p.category || "Lainnya"] = (categories[p.category || "Lainnya"] || 0) + p.current_stock; });
    
    const doughnutData = {
      labels: Object.keys(categories).length ? Object.keys(categories) : ["Minuman", "Snack", "Bahan Pokok"],
      datasets: [
        {
          data: Object.keys(categories).length ? Object.values(categories) : [300, 50, 100],
          backgroundColor: ["#0f8276", "#f0cf8a", "#a8c7f0", "#f0a8a8", "#a7d8cf"],
          borderWidth: 0,
        }
      ]
    };

    return (
      <div className="grid gap-6">
        <StoreSelector />
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Statistik Transaksi" action="Export laporan">
             <div className="p-4 h-[300px] flex items-center justify-center">
               <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
             </div>
          </Panel>
          <Panel title="Proporsi Stok Kategori" action="Detail">
             <div className="p-4 h-[300px] flex items-center justify-center">
               <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
             </div>
          </Panel>
        </div>
      </div>
    );
  }
  
  if (view === "kategori") {
    return (
      <div className="grid gap-6">
        <Panel title="Manajemen Kategori Produk" action="Tambah Kategori" actionHref="/dashboard/useradmin/kategori/tambah">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#e0e5ec] text-xs uppercase text-[#657181]">
                  <th className="py-3 pr-4">Nama Kategori</th>
                  <th className="py-3 pr-4">Deskripsi</th>
                  <th className="py-3 pr-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? categories.map(cat => (
                  <tr key={cat.id} className="border-b border-[#eef1f4]">
                    <td className="py-4 pr-4 font-extrabold text-[#172033]">{cat.name}</td>
                    <td className="py-4 pr-4 text-[#526072]">{cat.description || "-"}</td>
                    <td className="py-4 pr-4 flex items-center gap-2">
                      <button onClick={async () => {
                        if (confirm("Hapus kategori ini?")) {
                          await api.deleteCategory(cat.id);
                          setCategories(categories.filter(c => c.id !== cat.id));
                        }
                      }} className="text-xs text-red-500 underline">Hapus</button>
                    </td>
                  </tr>
                )) : (
                  <tr className="border-b border-[#eef1f4]">
                    <td colSpan={3} className="py-4 pr-4 text-[#526072] italic">Belum ada kategori terdaftar</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    );
  }

  if (view === "pengaturan") return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Profil Akun" action="Edit profil" actionHref="/dashboard/useradmin/pengaturan/edit">
          <div className="flex flex-wrap items-start gap-4 rounded-xl border border-[#e0e5ec] bg-[#f8fafb] p-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0f8276] text-xl font-extrabold text-white shadow-[0_10px_24px_rgba(15,130,118,0.22)]">
              {account?.profile_image_url ? <Image src={account.profile_image_url} alt={account?.name || "Profil"} width={96} height={96} unoptimized className="h-full w-full object-cover" /> : (account?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#0f8276]">Admin UMKM</p>
              <h3 className="mt-1 text-2xl font-extrabold text-[#172033]">{account?.name || "Admin UMKM"}</h3>
              <p className="mt-1 text-sm font-semibold text-[#657181]">{account?.email || "Email belum tersedia"}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SmallStat label="Nama usaha" value={account?.business_name || "-"} />
                <SmallStat label="Cabang aktif" value={stores.find(s => s.id === activeStoreId)?.store_name || "-"} />
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Paket Berlangganan" action={plan === "pro" ? "Paket aktif" : "Upgrade"} actionHref={plan === "pro" ? "#" : "/paket"}>
          <div className="rounded-xl border border-[#e0e5ec] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-[#657181]">Paket saat ini</p>
                <h3 className="mt-2 text-3xl font-extrabold text-[#172033]">{plan === "pro" ? "Pro" : "Free Trial"}</h3>
              </div>
              <StatusBadge status={plan === "pro" ? "Aktif" : "Free"} />
            </div>
            <div className="mt-5 grid gap-3">
              <DetailRow label="Kuota toko" value={plan === "pro" ? "3 toko" : "1 toko"} />
              <DetailRow label="Forecasting" value={plan === "pro" ? "30 hari" : "7 hari"} />
              <DetailRow label="Import data" value={plan === "pro" ? "CSV/XLSX" : "CSV maks. 500 baris"} />
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Integrasi & Batas Akun" action="Simpan perubahan">
        <FeatureGrid items={
          [["Status API", "Terhubung ke endpoint inventaris dan prediksi."], ["Limitasi Toko", plan === "pro" ? "3 Toko Tersedia" : "1 Toko Tersedia (Maksimal untuk Free)"]]
        } />
      </Panel>

      <Panel title="Cabang Toko" action={plan === "pro" ? "Tambah Toko" : "Upgrade ke Pro"} actionHref={plan === "pro" ? "/dashboard/useradmin/pengaturan/tambah" : "#"}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#e0e5ec] text-xs uppercase text-[#657181]">
                <th className="py-3 pr-4">Nama Toko</th>
                <th className="py-3 pr-4">Lokasi</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {stores.length > 0 ? stores.map(store => (
                <tr key={store.id} className="border-b border-[#eef1f4]">
                  <td className="py-4 pr-4 font-extrabold text-[#172033]">{store.store_name}</td>
                  <td className="py-4 pr-4 text-[#526072]">{store.location || "-"}</td>
                  <td className="py-4 pr-4 flex items-center gap-2">
                    <StatusBadge status={store.status} />
                    <button onClick={async () => {
                      if (confirm("Hapus toko ini?")) {
                        await api.deleteStore(store.id);
                        setStores(stores.filter(s => s.id !== store.id));
                      }
                    }} className="text-xs text-red-500 underline ml-2">Hapus</button>
                  </td>
                </tr>
              )) : (
                <tr className="border-b border-[#eef1f4]">
                  <td colSpan={3} className="py-4 pr-4 text-[#526072] italic">Belum ada cabang terdaftar</td>
                </tr>
              )}
              {plan === "free" && (
                <tr><td colSpan={3} className="py-4 text-center text-[#657181]">Upgrade ke Pro untuk menambah cabang toko (Maksimal 3 Toko)</td></tr>
              )}
              {plan === "pro" && (
                <tr><td colSpan={3} className="py-4 text-center text-[#657181]">Anda menggunakan {stores.length} dari 3 kuota toko.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );

  return (
    <>
      <MetricGrid metrics={userMetrics} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Transaksi Terbaru" action="Lihat semua" actionHref="/dashboard/useradmin/transaksi">
          <TransactionList data={transactions.slice(0, 4)} compact />
        </Panel>
        <Panel title="Rekomendasi Restock" action="Lihat semua" actionHref="/dashboard/useradmin/forecasting">
          <RecommendationList data={predictions.slice(0, 3)} />
        </Panel>
        <Panel title="Inventaris" action="Buka inventaris" actionHref="/dashboard/useradmin/inventaris" className="xl:col-span-2">
          <ProductTable data={products.slice(0, 4)} compact />
        </Panel>
      </div>
    </>
  );
}

function SuperAdminContent({ view }: { view: SuperAdminView }) {
  const [tenants, setTenants] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tenRes, srvRes, usrRes] = await Promise.all([
          api.getTenants(),
          api.getSystemServices(),
          api.getDashboardUsers()
        ]);
        setTenants(tenRes.data || []);
        setServices(srvRes.data || []);
        setUsers(usrRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  let activeUsers = users.filter(u => u.last_login_at).length;
  let totalProducts = tenants.reduce((acc, t) => acc + Number(t.product_count || 0), 0);

  const platformMetrics: Metric[] = [
    { label: "UMKM Terdaftar", value: tenants.length, helper: "Total tenant", tone: "teal" },
    { label: "Pengguna Aktif", value: activeUsers, helper: "Pernah login", tone: "blue" },
    { label: "Produk Tercatat", value: totalProducts, helper: "Lintas akun UMKM", tone: "amber" },
    { label: "Status Sistem", value: "Online", helper: "API uptime", tone: "teal" },
  ];

  if (view === "pengguna") return (
    <div className="grid gap-6">
      <MetricGrid metrics={platformMetrics.slice(0, 3)} />
      <Panel title="Daftar Akun UMKM" action="Tambah akun" actionHref="/dashboard/superadmin/pengguna/tambah">
        <TenantTable data={tenants} actionBase="/dashboard/superadmin/pengguna" />
      </Panel>
    </div>
  );
  if (view === "monitoring") return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Panel title="Status Service" action="Refresh status" actionHref="/dashboard/superadmin/monitoring">
        <ServiceList data={services} />
      </Panel>
      <Panel title="Log Pengguna" action="Lihat semua">
         <p className="p-4 text-sm text-[#657181]">Total {users.length} pengguna terdaftar di sistem.</p>
      </Panel>
    </div>
  );
  if (view === "pengaturan") return (
    <div className="grid gap-6">
      <Panel title="Konfigurasi Global" action="Tambah konfigurasi" actionHref="/dashboard/superadmin/pengaturan/tambah">
        <FeatureGrid items={[["Periode prediksi default", "7 hari"], ["Format import aktif", "CSV dan XLSX"]]} withActions />
      </Panel>
    </div>
  );

  return (
    <>
      <MetricGrid metrics={platformMetrics} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Panel title="UMKM Terdaftar" action="Lihat akun" actionHref="/dashboard/superadmin/pengguna">
          <TenantTable data={tenants.slice(0, 4)} compact actionBase="/dashboard/superadmin/pengguna" />
        </Panel>
        <Panel title="Monitoring Sistem" action="Refresh" actionHref="/dashboard/superadmin/monitoring">
          <ServiceList data={services} />
        </Panel>
      </div>
    </>
  );
}

function ActionPage({ role, view, action }: { role: DashboardRole; view: DashboardView; action: DashboardAction }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const storeIdParam = searchParams.get("store_id");
  const backHref = `/dashboard/${role}/${view}`;
  
  const [data, setData] = useState<any>(null);
  const [optionsData, setOptionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(action === "edit" || action === "detail" || action === "hapus");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>("free");
  const [account, setAccount] = useState<any>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");

  useEffect(() => {
    const sessionStr = localStorage.getItem("stockcerdas_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setAccount(session);
        if (session.plan) setPlan(session.plan);
        if (session.profile_image_url) setProfilePreview(session.profile_image_url);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (view === "forecasting" || view === "transaksi") {
      api.getProducts().then(res => {
         const sessionStr = localStorage.getItem("stockcerdas_session");
         let pData = res.data || [];
         if (sessionStr) {
           try {
             const session = JSON.parse(sessionStr);
             if (session.tenant_id) {
               pData = pData.filter((p: any) => p.tenant_id === session.tenant_id);
             }
           } catch (e) {}
         }
         setOptionsData(pData);
      }).catch(console.error);
    } else if (view === "inventaris") {
      const sessionStr = localStorage.getItem("stockcerdas_session");
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session.tenant_id) {
            api.getCategories(session.tenant_id).then(res => {
               setOptionsData(res.data || []);
            });
          }
        } catch(e) {}
      }
    }
  }, [view]);

  useEffect(() => {
    if (view === "pengaturan" && role === "useradmin" && action === "edit") {
      const sessionStr = localStorage.getItem("stockcerdas_session");
      const session = JSON.parse(sessionStr || "{}");
      setData({
        owner_name: session.name || "",
        email: session.email || "",
        business_name: session.business_name || "",
        profile_image_url: session.profile_image_url || "",
      });
      setProfilePreview(session.profile_image_url || "");
      setLoading(false);
      return;
    }

    if ((action === "edit" || action === "detail" || action === "hapus") && id) {
      const fetchData = async () => {
        try {
          if (view === "inventaris") {
            const res = await api.getProductById(id);
            setData(res.data);
          } else if (view === "transaksi") {
            const res = await api.getTransactions();
            const tx = res.data?.find((t: any) => t.id.toString() === id);
            setData(tx);
          } else if (view === "kategori") {
            const sessionStr = localStorage.getItem("stockcerdas_session");
            const session = JSON.parse(sessionStr || "{}");
            const res = await api.getCategories(session.tenant_id);
            const cat = res.data?.find((c: any) => c.id.toString() === id);
            setData(cat);
          } else if (view === "pengguna") {
            const res = await api.getTenants();
            const tn = res.data?.find((t: any) => t.id.toString() === id);
            setData(tn);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [action, id, role, view]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    if (view === "forecasting" && String(payload.forecast_period).startsWith("pro_only")) {
       setError("Prediksi 14 Hari dan 30 Hari khusus untuk Paket Pro. Silakan upgrade paket Anda.");
       setIsSubmitting(false);
       return;
    }

    const sessionStr = localStorage.getItem("stockcerdas_session");
    if (sessionStr) {
       try {
         const session = JSON.parse(sessionStr);
         if (session.tenant_id) payload.tenant_id = session.tenant_id;
       } catch (e) {}
    }

    if (storeIdParam) {
      payload.store_id = storeIdParam;
    }

    try {
      if (view === "inventaris") {
        payload.price = payload.price ? Number(payload.price) : 0 as any;
        payload.current_stock = payload.current_stock ? Number(payload.current_stock) : 0 as any;
        payload.minimum_stock = payload.minimum_stock ? Number(payload.minimum_stock) : 0 as any;
        
        if (action === "tambah") await api.createProduct(payload);
        else if (action === "edit") await api.updateProduct(id!, payload);
      } else if (view === "transaksi") {
        payload.product_id = Number(payload.product_id) as any;
        payload.quantity = Number(payload.quantity) as any;
        if (!payload.transaction_date) delete payload.transaction_date;
        if (action === "tambah") await api.createTransaction(payload);
      } else if (view === "forecasting") {
        payload.product_id = Number(payload.product_id) as any;
        if (action === "tambah") await api.createPrediction({ product_id: Number(payload.product_id), forecast_period: String(payload.forecast_period || "7_days") });
      } else if (view === "kategori") {
        if (action === "tambah") await api.createCategory(payload as any);
        else if (action === "edit") await api.updateCategory(id!, payload as any);
      } else if (view === "pengguna") {
        if (action === "tambah") await api.createTenant(payload);
        else if (action === "edit") await api.updateTenant(id!, payload);
      } else if (view === "pengaturan" && role === "useradmin") {
        if (action === "edit") {
          if (!account?.tenant_id) {
            setError("Tenant akun tidak ditemukan. Silakan login ulang.");
            setIsSubmitting(false);
            return;
          }

          const updated = await api.updateTenant(account.tenant_id, {
            owner_name: payload.owner_name,
            email: payload.email,
            business_name: payload.business_name,
            profile_image_url: profilePreview || undefined,
          });
          const updatedSession = {
            ...account,
            name: updated.data?.owner_name || payload.owner_name,
            email: updated.data?.email || payload.email,
            business_name: updated.data?.business_name || payload.business_name,
            profile_image_url: updated.data?.profile_image_url || profilePreview || null,
          };
          saveSession(updatedSession);
          setAccount(updatedSession);
        } else {
        if (plan !== "pro") {
           setError("Hanya akun Pro yang bisa menambah cabang toko.");
           setIsSubmitting(false);
           return;
        }
        if (action === "tambah") await api.createStore(payload);
        }
      }
      
      router.push(backHref);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (view === "inventaris") await api.deleteProduct(id!);
      else if (view === "transaksi") await api.deleteTransaction(id!);
      else if (view === "kategori") await api.deleteCategory(id!);
      else if (view === "pengguna") await api.deleteTenant(id!);
      router.push(backHref);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfilePreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  if (loading) return <LoadingSpinner />;

  if (action === "detail") {
    return (
      <Panel title={`Detail ${view}`} action="Kembali" actionHref={backHref}>
        {error && <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">{error}</div>}
        {view === "inventaris" ? (
          <ProductDetail data={data} />
        ) : view === "pengguna" ? (
          <TenantDetail data={data} />
        ) : (
          <pre className="bg-[#f8fafb] p-4 rounded-lg overflow-auto text-sm text-[#172033]">{JSON.stringify(data, null, 2)}</pre>
        )}
      </Panel>
    );
  }

  if (action === "hapus") {
    return (
      <Panel title={`Hapus ${view}`} action="Kembali" actionHref={backHref}>
        <div className="rounded-lg border border-[#f0a8a8] bg-[#fff1f1] p-5">
          <p className="text-lg font-extrabold text-[#b42318]">Konfirmasi hapus data</p>
          {error && <div className="mt-2 text-sm text-red-700">{error}</div>}
          <div className="mt-5 flex flex-wrap gap-3">
          <Link href={backHref} className={`rounded-lg border border-[#cfd6df] bg-white px-4 py-2 font-extrabold text-[#334155] ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>Batal</Link>
          <button onClick={handleDelete} disabled={isSubmitting} className={`rounded-lg bg-[#b42318] px-4 py-2 font-extrabold text-white transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isSubmitting ? 'Menghapus...' : 'Hapus'}
          </button>
          </div>
        </div>
      </Panel>
    );
  }

  if (view === "pengaturan" && role === "useradmin" && action === "edit") {
    const initial = String(data?.owner_name || account?.name || "U").charAt(0).toUpperCase();

    return (
      <Panel title="Edit Profil Akun" action="Kembali" actionHref={backHref}>
        {error && <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="flex flex-wrap items-center gap-5 rounded-xl border border-[#e0e5ec] bg-[#f8fafb] p-5">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0f8276] text-3xl font-extrabold text-white shadow-[0_10px_24px_rgba(15,130,118,0.22)]">
              {profilePreview ? <Image src={profilePreview} alt="Preview profil" width={96} height={96} unoptimized className="h-full w-full object-cover" /> : initial}
            </div>
            <div className="min-w-[220px] flex-1">
              <p className="text-sm font-extrabold text-[#172033]">Foto Profil</p>
              <p className="mt-1 text-sm font-medium text-[#657181]">Gunakan gambar persegi agar avatar tampil rapi di dashboard.</p>
              <label className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-[#cfd6df] bg-white px-4 text-sm font-extrabold text-[#0f8276] transition hover:border-[#0f8276] hover:bg-[#edf8f6]">
                Pilih gambar
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
              </label>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase text-[#657181]">Nama Admin</span>
              <input name="owner_name" required defaultValue={data?.owner_name || account?.name || ""} className="h-11 w-full rounded-lg border border-[#cfd6df] bg-white px-3 text-sm font-bold text-[#172033] outline-none transition focus:border-[#0f8276] focus:ring-2 focus:ring-[#0f8276]/15" />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase text-[#657181]">Email</span>
              <input name="email" type="email" required defaultValue={data?.email || account?.email || ""} className="h-11 w-full rounded-lg border border-[#cfd6df] bg-white px-3 text-sm font-bold text-[#172033] outline-none transition focus:border-[#0f8276] focus:ring-2 focus:ring-[#0f8276]/15" />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-bold uppercase text-[#657181]">Nama Usaha</span>
              <input name="business_name" required defaultValue={data?.business_name || account?.business_name || ""} className="h-11 w-full rounded-lg border border-[#cfd6df] bg-white px-3 text-sm font-bold text-[#172033] outline-none transition focus:border-[#0f8276] focus:ring-2 focus:ring-[#0f8276]/15" />
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className={`rounded-lg bg-[#0f8276] px-4 py-2 text-sm font-extrabold text-white transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0b6f66]'}`}>
            {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </form>
      </Panel>
    );
  }

  let fields: any[] = [];
  if (view === "inventaris") {
    fields = [
      { name: "sku", label: "SKU", required: true, type: "text" },
      { name: "name", label: "Nama Produk", required: true, type: "text" },
      { name: "category", label: "Kategori", required: true, type: "select", options: optionsData.map(c => ({ value: c.name, label: c.name })) },
      { name: "price", label: "Harga Jual", required: false, type: "number" },
      { name: "current_stock", label: "Stok Saat Ini", required: false, type: "number" },
      { name: "minimum_stock", label: "Minimum Stok", required: false, type: "number" },
    ];
  } else if (view === "transaksi") {
    fields = [
      { name: "product_id", label: "Produk", required: true, type: "select", options: optionsData.map(p => ({ value: p.id, label: `${p.sku} - ${p.name}` })) },
      { name: "transaction_type", label: "Tipe", required: true, type: "select", options: [{value: "in", label: "Stok Masuk"}, {value: "out", label: "Stok Keluar"}] },
      { name: "quantity", label: "Jumlah", required: true, type: "number" },
      { name: "transaction_date", label: "Waktu Transaksi (Opsional)", required: false, type: "datetime-local" },
      { name: "note", label: "Catatan", required: false, type: "text" },
    ];
  } else if (view === "pengguna") {
    fields = [
      { name: "business_name", label: "Nama Usaha", required: true, type: "text" },
      { name: "owner_name", label: "Nama Pemilik", required: true, type: "text" },
      { name: "email", label: "Email", required: true, type: "email" },
      { name: "status", label: "Status (active/review)", required: false, type: "text" },
      { name: "plan", label: "Paket (free/pro)", required: false, type: "text" },
    ];
  } else if (view === "forecasting") {
    const forecastOptions = [{value: "7_days", label: "7 Hari"}];
    if (plan === "pro") {
      forecastOptions.push({value: "14_days", label: "14 Hari"}, {value: "30_days", label: "30 Hari"});
    } else {
      forecastOptions.push({value: "pro_only_14", label: "14 Hari (Khusus Pro)"}, {value: "pro_only_30", label: "30 Hari (Khusus Pro)"});
    }

    fields = [
      { name: "product_id", label: "Produk", required: true, type: "select", options: optionsData.map(p => ({ value: p.id, label: `${p.sku} - ${p.name}` })) },
      { name: "forecast_period", label: "Periode Prediksi", required: true, type: "select", options: forecastOptions },
    ];
  } else if (view === "kategori") {
    fields = [
      { name: "name", label: "Nama Kategori", required: true, type: "text" },
      { name: "description", label: "Deskripsi (Opsional)", required: false, type: "text" },
    ];
  } else if (view === "pengaturan" && role === "useradmin") {
    fields = [
      { name: "store_name", label: "Nama Cabang Toko", required: true, type: "text" },
      { name: "location", label: "Lokasi", required: true, type: "text" },
    ];
  }

  return (
    <Panel title={`${action === "tambah" ? "Tambah" : "Edit"} ${view}`} action="Kembali" actionHref={backHref}>
      {error && <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">{error}</div>}
      {isSubmitting && view === "forecasting" && (
        <div className="mb-4 rounded border border-[#0f8276] bg-[#0f8276]/10 p-4 text-[#0f8276] font-medium flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0f8276] border-t-transparent"></div>
          AI sedang menganalisis data Anda. Tunggu sebentar...
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-5">
        {fields.map((f) => (
          <label key={f.name} className="grid gap-2">
            <span className="text-xs font-bold uppercase text-[#657181]">{f.label}</span>
            {f.type === "select" ? (
              <select
                name={f.name}
                required={f.required}
                defaultValue={data ? data[f.name] : ""}
                className="h-11 w-full rounded-lg border border-[#cfd6df] bg-white px-3 text-sm font-bold text-[#172033] outline-none transition focus:border-[#0f8276] focus:ring-2 focus:ring-[#0f8276]/15"
              >
                <option value="" disabled>Pilih {f.label}</option>
                {f.options?.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                name={f.name}
                type={f.type}
                required={f.required}
                defaultValue={data ? data[f.name] : ""}
                className="h-11 w-full rounded-lg border border-[#cfd6df] bg-white px-3 text-sm font-bold text-[#172033] outline-none transition placeholder:text-[#9aa4b2] focus:border-[#0f8276] focus:ring-2 focus:ring-[#0f8276]/15"
              />
            )}
          </label>
        ))}
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
          <button type="submit" disabled={isSubmitting} className={`rounded-lg bg-[#0f8276] px-4 py-2 text-sm font-extrabold text-white transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0b6f66]'}`}>
            {isSubmitting ? 'Memproses...' : 'Simpan'}
          </button>
        </div>
      </form>
    </Panel>
  );
}

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className={`rounded-lg border p-5 ${toneStyles[metric.tone]}`}>
          <p className="text-sm font-bold opacity-80">{metric.label}</p>
          <p className="mt-3 text-3xl font-extrabold text-[#172033]">{metric.value}</p>
          <p className="mt-2 text-sm font-semibold opacity-90">{metric.helper}</p>
        </article>
      ))}
    </div>
  );
}

function Panel({ title, action, actionHref, className = "", children }: { title: string; action?: string; actionHref?: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-lg border border-[#d8dde5] bg-white p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-[#172033]">{title}</h2>
        {action && (
          <Link href={actionHref ?? "#"} className="rounded-lg border border-[#cfd6df] px-3 py-2 text-xs font-extrabold text-[#0f8276] transition hover:border-[#0f8276] hover:bg-[#edf8f6]">
            {action}
          </Link>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ProductTable({ data, compact = false, actionBase }: { data: any[]; compact?: boolean; actionBase?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[940px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#e0e5ec] text-xs uppercase text-[#657181]">
            <th className="py-3 pr-4">ID</th>
            <th className="py-3 pr-4">SKU</th>
            <th className="py-3 pr-4">Produk</th>
            <th className="py-3 pr-4">Kategori</th>
            <th className="py-3 pr-4">Stok</th>
            <th className="py-3 pr-4">Min</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => {
            const status = product.current_stock === 0 ? "Kosong" : product.current_stock <= product.minimum_stock ? "Menipis" : "Aman";
            return (
              <tr key={product.id} className="border-b border-[#eef1f4]">
                <td className="py-4 pr-4">{product.id}</td>
                <td className="py-4 pr-4 font-bold text-[#526072]">{product.sku}</td>
                <td className="py-4 pr-4 font-extrabold text-[#172033]">{product.name}</td>
                <td className="py-4 pr-4 text-[#526072]">{product.category}</td>
                <td className="py-4 pr-4 font-bold">{product.current_stock}</td>
                <td className="py-4 pr-4 text-[#526072]">{product.minimum_stock}</td>
                <td className="py-4 pr-4"><StatusBadge status={status} /></td>
                <td className="py-4 pr-4">
                  {actionBase && <ActionButtons baseHref={actionBase} id={product.id} />}
                </td>
              </tr>
            );
          })}
          {data.length === 0 && <tr><td colSpan={8} className="py-4 text-center text-[#657181]">Belum ada produk</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function ProductDetail({ data }: { data: any }) {
  if (!data) {
    return <p className="text-sm font-semibold text-[#657181]">Data produk tidak ditemukan.</p>;
  }

  const currentStock = Number(data.current_stock || 0);
  const minimumStock = Number(data.minimum_stock || 0);
  const status = currentStock === 0 ? "Kosong" : currentStock <= minimumStock ? "Menipis" : "Aman";
  const price = Number(data.price || 0);
  const createdAt = data.created_at ? new Date(data.created_at).toLocaleDateString("id-ID") : "-";
  const updatedAt = data.updated_at ? new Date(data.updated_at).toLocaleDateString("id-ID") : "-";

  return (
    <div className="grid gap-5">
      <div className="rounded-xl border border-[#e0e5ec] bg-[#f8fafb] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#0f8276]">{data.sku || `Produk #${data.id}`}</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#172033]">{data.name || "Produk tanpa nama"}</h2>
            <p className="mt-1 text-sm font-semibold text-[#657181]">Kategori: {data.category || "-"}</p>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SmallStat label="Stok saat ini" value={`${currentStock} unit`} />
        <SmallStat label="Minimum stok" value={`${minimumStock} unit`} />
        <SmallStat label="Harga" value={`Rp${price.toLocaleString("id-ID")}`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#e0e5ec] bg-white p-4">
          <p className="text-xs font-extrabold uppercase text-[#657181]">Identitas Produk</p>
          <div className="mt-4 grid gap-3 text-sm">
            <DetailRow label="ID Produk" value={data.id || "-"} />
            <DetailRow label="Tenant ID" value={data.tenant_id || "-"} />
            <DetailRow label="Store ID" value={data.store_id || "-"} />
          </div>
        </div>
        <div className="rounded-xl border border-[#e0e5ec] bg-white p-4">
          <p className="text-xs font-extrabold uppercase text-[#657181]">Riwayat Data</p>
          <div className="mt-4 grid gap-3 text-sm">
            <DetailRow label="Dibuat" value={createdAt} />
            <DetailRow label="Diperbarui" value={updatedAt} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#eef1f4] pb-2 last:border-b-0 last:pb-0">
      <span className="font-semibold text-[#657181]">{label}</span>
      <span className="text-right font-extrabold text-[#172033]">{value}</span>
    </div>
  );
}

function TransactionList({ data, compact = false }: { data: any[]; compact?: boolean }) {
  return (
    <div className="space-y-3">
      {data.map((tx) => (
        <article key={tx.id} className="rounded-lg border border-[#e0e5ec] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-[#172033]">{tx.product_name || `Product ID: ${tx.product_id}`}</p>
              <p className="mt-1 text-xs font-semibold text-[#657181]">Tanggal: {new Date(tx.transaction_date).toLocaleDateString("id-ID")}</p>
            </div>
            <StatusBadge status={tx.transaction_type === "in" ? "Stok Masuk" : "Stok Keluar"} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SmallStat label="Jumlah" value={`${tx.quantity} unit`} />
            <SmallStat label="Catatan" value={tx.note || "-"} />
          </div>
          {!compact && (
            <div className="mt-4">
              <ActionButtons baseHref="/dashboard/useradmin/transaksi" id={tx.id} hideEdit />
            </div>
          )}
        </article>
      ))}
      {data.length === 0 && <p className="text-[#657181]">Belum ada transaksi</p>}
    </div>
  );
}

function TenantTable({ data, compact = false, actionBase }: { data: any[]; compact?: boolean; actionBase?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#e0e5ec] text-xs uppercase text-[#657181]">
            <th className="py-3 pr-4">ID</th>
            <th className="py-3 pr-4">Nama Usaha</th>
            <th className="py-3 pr-4">Pemilik</th>
            <th className="py-3 pr-4">Email</th>
            <th className="py-3 pr-4">Produk</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tenant) => (
            <tr key={tenant.id} className="border-b border-[#eef1f4]">
              <td className="py-4 pr-4">{tenant.id}</td>
              <td className="py-4 pr-4 font-extrabold text-[#172033]">{tenant.business_name}</td>
              <td className="py-4 pr-4 text-[#526072]">{tenant.owner_name}</td>
              <td className="py-4 pr-4 text-[#526072]">{tenant.email}</td>
              <td className="py-4 pr-4 font-bold">{tenant.product_count}</td>
              <td className="py-4 pr-4"><StatusBadge status={tenant.status === "active" ? "Aktif" : tenant.status} /></td>
              <td className="py-4 pr-4">
                {actionBase && <ActionButtons baseHref={actionBase} id={tenant.id} />}
              </td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={7} className="py-4 text-center text-[#657181]">Belum ada UMKM terdaftar</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function TenantDetail({ data }: { data: any }) {
  if (!data) {
    return <p className="text-sm font-semibold text-[#657181]">Data pengguna tidak ditemukan.</p>;
  }

  const status = data.status === "active" ? "Aktif" : data.status || "review";
  const plan = data.plan === "pro" ? "Pro" : "Free Trial";
  const createdAt = data.created_at ? new Date(data.created_at).toLocaleDateString("id-ID") : "-";
  const productCount = Number(data.product_count || 0);

  return (
    <div className="grid gap-5">
      <div className="rounded-xl border border-[#e0e5ec] bg-[#f8fafb] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#0f8276]">Tenant #{data.id}</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#172033]">{data.business_name || "Nama usaha belum tersedia"}</h2>
            <p className="mt-1 text-sm font-semibold text-[#657181]">Pemilik: {data.owner_name || "-"}</p>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SmallStat label="Paket" value={plan} />
        <SmallStat label="Total produk" value={`${productCount} produk`} />
        <SmallStat label="Status akun" value={status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#e0e5ec] bg-white p-4">
          <p className="text-xs font-extrabold uppercase text-[#657181]">Kontak & Identitas</p>
          <div className="mt-4 grid gap-3 text-sm">
            <DetailRow label="Email" value={data.email || "-"} />
            <DetailRow label="Owner" value={data.owner_name || "-"} />
            <DetailRow label="Tenant ID" value={data.id || "-"} />
          </div>
        </div>
        <div className="rounded-xl border border-[#e0e5ec] bg-white p-4">
          <p className="text-xs font-extrabold uppercase text-[#657181]">Langganan</p>
          <div className="mt-4 grid gap-3 text-sm">
            <DetailRow label="Paket" value={plan} />
            <DetailRow label="Limit toko" value={data.plan === "pro" ? "3 toko" : "1 toko"} />
            <DetailRow label="Terdaftar" value={createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceList({ data }: { data: any[] }) {
  return (
    <div className="space-y-3">
      {data.map((service) => (
        <article key={service.id} className="rounded-lg border border-[#e0e5ec] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-[#172033]">{service.service_name}</p>
              <p className="mt-1 text-xs font-semibold text-[#657181]">{service.endpoint}</p>
            </div>
            <StatusBadge status={service.status === "online" ? "Online" : "Perlu cek"} />
          </div>
          <p className="mt-3 text-sm font-bold text-[#526072]">Latency {service.latency_ms} ms</p>
        </article>
      ))}
      {data.length === 0 && <p className="text-[#657181]">Memuat status layanan...</p>}
    </div>
  );
}

function RecommendationList({ data }: { data: any[] }) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <article key={item.id} className="rounded-lg border border-[#e0e5ec] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-[#172033]">{item.product_name}</p>
              <p className="mt-1 text-xs font-semibold text-[#657181]">{item.forecast_period}</p>
            </div>
            <StatusBadge status={item.risk_level === "high" ? "Tinggi" : item.risk_level === "medium" ? "Sedang" : "Aman"} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <SmallStat label="Stok" value={`${item.current_stock}`} />
            <SmallStat label="Prediksi" value={`${item.predicted_demand}`} />
            <SmallStat label="Restock" value={`${item.recommended_restock}`} />
          </div>
        </article>
      ))}
      {data.length === 0 && <p className="text-[#657181]">Belum ada data prediksi</p>}
    </div>
  );
}

function FeatureGrid({ items, withActions = false }: { items: Array<[string, string]>; withActions?: boolean }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(([title, description]) => (
        <article key={title} className="rounded-lg border border-[#e0e5ec] bg-[#f8fafb] p-4">
          <p className="text-sm font-extrabold text-[#172033]">{title}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#657181]">{description}</p>
        </article>
      ))}
    </div>
  );
}

function ActionButtons({ baseHref, id, hideEdit }: { baseHref: string, id: string | number, hideEdit?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`${baseHref}/detail?id=${id}`} className="rounded-md border border-[#cfd6df] px-3 py-1.5 text-xs font-extrabold text-[#334155] hover:border-[#0f8276] hover:text-[#0f8276]">Detail</Link>
      {!hideEdit && <Link href={`${baseHref}/edit?id=${id}`} className="rounded-md border border-[#a8c7f0] px-3 py-1.5 text-xs font-extrabold text-[#1d5fa7] hover:bg-[#edf4ff]">Edit</Link>}
      <Link href={`${baseHref}/hapus?id=${id}`} className="rounded-md border border-[#f0a8a8] px-3 py-1.5 text-xs font-extrabold text-[#b42318] hover:bg-[#fff1f1]">Hapus</Link>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#f4f7fa] p-3">
      <p className="text-xs font-bold text-[#657181]">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-[#172033]">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const warningStatuses = ["Menipis", "Perlu cek", "Review", "Stok Keluar", "Sedang"];
  const dangerStatuses = ["Kosong", "Tinggi", "offline", "error"];
  const className = dangerStatuses.includes(status)
    ? "bg-[#fff1f1] text-[#b42318]"
    : warningStatuses.includes(status)
      ? "bg-[#fff7e6] text-[#9a6500]"
      : "bg-[#edf8f6] text-[#0f8276]";

  return <span className={`rounded-md px-2 py-1 text-xs font-extrabold ${className}`}>{status}</span>;
}
