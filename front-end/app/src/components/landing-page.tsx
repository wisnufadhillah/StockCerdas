import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const clientLogos = [
  {
    src: "/assets/client-24-supermarket.svg",
    alt: "Logo client 24 SuperMarket",
  },
  {
    src: "/assets/client-fastmarket.svg",
    alt: "Logo client FastMarket",
  },
  {
    src: "/assets/client-src.svg",
    alt: "Logo client SRC",
  },
  {
    src: "/assets/client-supermarket.svg",
    alt: "Logo client Super Market",
  },
  {
    src: "/assets/client-smartshopping.svg",
    alt: "Logo client Smart Shopping",
  },
];

const features = [
  {
    icon: "/assets/icon-analysis.svg",
    iconAlt: "Ikon analisis transaksi",
    title: "Analisis Transaksi Historis",
    description:
      "Baca pola penjualan dari data historis untuk memahami tren permintaan produk Anda.",
  },
  {
    icon: "/assets/icon-brain.svg",
    iconAlt: "Ikon forecasting AI",
    title: "Forecasting Kebutuhan Stok",
    description: "AI memprediksi permintaan 7, 14, atau 30 hari ke depan berdasarkan data aktual.",
  },
  {
    icon: "/assets/icon-lightning.svg",
    iconAlt: "Ikon rekomendasi restock",
    title: "Rekomendasi Restock",
    description:
      "Dapatkan saran jumlah restock yang tepat sebelum stok kosong atau modal tertahan.",
  },
  {
    icon: "/assets/icon-stock.svg",
    iconAlt: "Ikon manajemen inventaris",
    title: "Manajemen Inventaris",
    description:
      "Catat stok masuk dan keluar, pantau level minimum, dan lacak seluruh produk dalam satu tempat.",
  },
  {
    icon: "/assets/icon-chart.svg",
    iconAlt: "Ikon multi toko",
    title: "MultiToko",
    description: "Kelola beberapa toko atau cabang dalam satu akun dengan data terpisah.",
  },
  {
    icon: "/assets/icon-trend.svg",
    iconAlt: "Ikon tren bisnis",
    title: "Dashboard Insight Bisnis",
    description:
      "Lihat kondisi bisnis secara keseluruhan: produk terlaris, risiko understock, dan modal tersimpan.",
  },
];

const steps = [
  {
    number: "01",
    title: "Import Data",
    description:
      "Upload data transaksi penjualan via CSV atau gunakan data dummy untuk langsung mencoba.",
  },
  {
    number: "02",
    title: "Sistem Membaca Tren",
    description:
      "AI menganalisis pola penjualan historis dan mengidentifikasi fluktuasi permintaan.",
  },
  {
    number: "03",
    title: "Jalankan Prediksi",
    description: "Pilih produk dan periode, lalu sistem menghasilkan forecast kebutuhan stok.",
  },
  {
    number: "04",
    title: "Ambil Keputusan Restock",
    description:
      "Dapatkan rekomendasi jumlah restock yang optimal dan simpan sebagai rencana pembelian.",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#1d2433]">
      <Navbar />

      <section className="mx-auto grid min-h-[470px] w-full max-w-[1180px] items-center gap-8 px-5 py-14 text-center sm:py-16 lg:grid-cols-[1fr_520px] lg:px-8 lg:py-20 lg:text-left">
        <div className="mx-auto max-w-[610px] lg:mx-0">
          <h1 className="text-[32px] font-extrabold leading-[1.18] tracking-normal text-[#1c2433] sm:text-[44px] lg:text-[52px]">
            Stok UMKM lebih terkendali dengan prediksi restock AI
          </h1>
          <p className="mx-auto mt-6 max-w-[570px] text-base font-semibold leading-7 text-[#657181] sm:text-lg lg:mx-0 lg:mt-7">
            Pantau inventaris, baca tren penjualan, dan dapatkan rekomendasi restock sebelum stok
            kosong atau modal tertahan.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
            <ButtonLink href="/register">Mulai Gratis</ButtonLink>
            <ButtonLink href="#fitur" variant="secondary">
              Lihat Fitur
            </ButtonLink>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src="/assets/stock.png"
            alt="Ilustrasi manajemen stok"
            width={520}
            height={360}
            priority
            className="h-auto w-full max-w-[360px] sm:max-w-[430px] lg:max-w-[500px]"
          />
        </div>
      </section>

      <section className="pb-14 text-center">
        <div className="mx-auto max-w-[760px] px-5">
          <h2 className="text-2xl font-extrabold text-[#1d2433] sm:text-[28px]">
            Dipercaya oleh UMKM & Retail
          </h2>
          <p className="mt-4 text-sm font-medium text-[#6d7785] sm:text-base">
            Membantu bisnis mengelola stok dengan lebih efisien menggunakan AI
          </p>
        </div>

        <div className="mt-8 overflow-hidden bg-[#0f8276] py-5">
          <div className="logo-track flex w-max items-center gap-10 sm:gap-16 lg:gap-20">
            {[...clientLogos, ...clientLogos, ...clientLogos].map((logo, index) => (
              <div
                key={`${logo.src}-${index}`}
                className="flex h-[90px] w-[170px] shrink-0 items-center justify-center sm:h-[118px] sm:w-[220px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={220}
                  height={118}
                  className="max-h-[82px] w-auto object-contain sm:max-h-[110px]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fitur" className="mx-auto max-w-[1180px] px-5 py-20 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#1d2433] sm:text-[30px]">
            Semua yang dibutuhkan UMKM untuk kendali stok
          </h2>
          <p className="mx-auto mt-4 max-w-[720px] text-sm font-medium leading-6 text-[#6d7785] sm:text-base">
            Dari catat stok hingga prediksi AI satu platform untuk semua kebutuhan manajemen
            inventaris Anda.
          </p>
        </div>

        <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group min-h-[166px] rounded-lg border border-[#d8dde5] bg-[#f4f5f7] p-6 shadow-[0_1px_3px_rgba(29,36,51,0.04)] transition duration-300 ease-out hover:-translate-y-2 hover:border-[#0f8276]/50 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,130,118,0.14)]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0f8276] text-white transition duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_18px_rgba(15,130,118,0.28)]">
                <Image src={feature.icon} alt={feature.iconAlt} width={20} height={20} />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-[#293142] transition-colors duration-300 group-hover:text-[#0f8276]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-6 text-[#687485]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="cara-kerja" className="mx-auto max-w-[1180px] px-5 py-16 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#1d2433] sm:text-[30px]">
            Cara kerja StokCerdas
          </h2>
          <p className="mt-4 text-sm font-medium text-[#6d7785] sm:text-base">
            Mulai dari nol hingga rekomendasi restock dalam empat langkah mudah.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article key={step.number} className="text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f8276] text-lg font-extrabold text-white">
                {step.number}
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-[#293142]">{step.title}</h3>
              <p className="mt-3 max-w-[250px] text-sm font-medium leading-6 text-[#687485]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="paket" className="px-5 py-20 text-center">
        <h2 className="text-2xl font-extrabold text-[#1d2433] sm:text-[30px]">
          Siap mengurangi stok kosong?
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-sm font-medium leading-6 text-[#6d7785] sm:text-base">
          Bergabung dengan ribuan UMKM yang telah beralih ke manajemen inventaris berbasis AI yang
          cerdas dan praktis.
        </p>
        <div id="mulai" className="mt-8">
          <ButtonLink href="/register">Mulai Gratis</ButtonLink>
        </div>
      </section>

      <Footer />
    </main>
  );
}
