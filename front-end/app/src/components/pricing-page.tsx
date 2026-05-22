import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PricingCard } from "@/components/pricing-card";

const freeTrialFeatures = [
  { label: "Produk & Transaksi Unlimited", included: true },
  { label: "1 Toko", included: true },
  { label: "Catat transaksi manual & bulk", included: true },
  { label: "Laporan stok & transaksi", included: true },
  { label: "Import CSV (maks. 500 baris)", included: true },
  { label: "Forecasting AI 7 hari", included: true },
  { label: "Notifikasi stok menipis", included: true },
  { label: "Rekomendasi restock otomatis", included: false },
  { label: "Multi-toko", included: false },
  { label: "Akses API", included: false },
];

const proFeatures = [
  { label: "Produk & Transaksi Unlimited", included: true },
  { label: "3 Toko", included: true },
  { label: "Catat transaksi manual & bulk", included: true },
  { label: "Laporan stok & transaksi", included: true },
  { label: "Import CSV/XLSX + sinkronisasi API", included: true },
  { label: "Forecasting AI 30 hari", included: true },
  { label: "Notifikasi stok menipis", included: true },
  { label: "Rekomendasi restock otomatis", included: false },
  { label: "Multi-toko", included: false },
  { label: "Akses API", included: false },
];

export function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#1d2433]">
      <Navbar />

      <section className="px-5 pb-20 pt-20 sm:pt-24 lg:pb-36 lg:pt-32">
        <div className="mx-auto max-w-[1120px]">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold leading-tight text-[#1d2433] sm:text-[32px]">
              Semua yang dibutuhkan UMKM untuk kendali stok
            </h1>
            <p className="mx-auto mt-5 max-w-[780px] text-base font-medium leading-7 text-[#657181] sm:text-lg">
              Dari catat stok hingga prediksi AI satu platform untuk semua kebutuhan manajemen
              inventaris Anda.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-[860px] justify-items-center gap-10 sm:mt-20 lg:mt-28 lg:grid-cols-2 lg:gap-24">
            <PricingCard
              title="Free Trial"
              description="Coba gratis selama 7 hari"
              price="Rp 0"
              period="7 hari"
              features={freeTrialFeatures}
            />
            <PricingCard
              title="Pro"
              description="Untuk UMKM berkembang yang butuh prediksi akurat dan kendali penuh atas stok"
              price="Rp 150K"
              period="30 hari"
              features={proFeatures}
              badge="Popular"
              highlighted
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
