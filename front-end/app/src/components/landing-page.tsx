import Image from "next/image";

const clientLogos = [
  {
    src: "/client-logo-permarket.svg",
    alt: "Logo client Permarket",
  },
  {
    src: "/client-logo-fastmarket.svg",
    alt: "Logo client FastMarket",
  },
  {
    src: "/client-logo-src.svg",
    alt: "Logo client SRC",
  },
  {
    src: "/client-logo-supermarket.svg",
    alt: "Logo client Super Market",
  },
  {
    src: "/client-logo-smartshopping.svg",
    alt: "Logo client Smart Shopping",
  },
];

const features = [
  {
    icon: "chart",
    title: "Analisis Transaksi Historis",
    description:
      "Baca pola penjualan dari data historis untuk memahami tren permintaan produk Anda.",
  },
  {
    icon: "ai",
    title: "Forecasting Kebutuhan Stok",
    description: "AI memprediksi permintaan 7, 14, atau 30 hari ke depan berdasarkan data aktual.",
  },
  {
    icon: "bolt",
    title: "Rekomendasi Restock",
    description:
      "Dapatkan saran jumlah restock yang tepat sebelum stok kosong atau modal tertahan.",
  },
  {
    icon: "inventory",
    title: "Manajemen Inventaris",
    description:
      "Catat stok masuk dan keluar, pantau level minimum, dan lacak seluruh produk dalam satu tempat.",
  },
  {
    icon: "cart",
    title: "MultiToko",
    description: "Kelola beberapa toko atau cabang dalam satu akun dengan data terpisah.",
  },
  {
    icon: "trend",
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

function FeatureIcon({ type }: { type: string }) {
  const commonProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (type === "ai") {
    return (
      <svg {...commonProps}>
        <path d="M9 4c0 2.8-1.7 5-4 5 2.3 0 4 2.2 4 5 0-2.8 1.7-5 4-5-2.3 0-4-2.2-4-5Z" />
        <path d="M17 11c0 1.7-1 3-2.5 3 1.5 0 2.5 1.3 2.5 3 0-1.7 1-3 2.5-3-1.5 0-2.5-1.3-2.5-3Z" />
      </svg>
    );
  }

  if (type === "bolt") {
    return (
      <svg {...commonProps}>
        <path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" />
      </svg>
    );
  }

  if (type === "inventory") {
    return (
      <svg {...commonProps}>
        <path d="M4 7h16v13H4z" />
        <path d="M7 7V4h10v3" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </svg>
    );
  }

  if (type === "cart") {
    return (
      <svg {...commonProps}>
        <path d="M5 5h2l1.3 9h8.4L19 8H8" />
        <path d="M10 19h.01" />
        <path d="M17 19h.01" />
      </svg>
    );
  }

  if (type === "trend") {
    return (
      <svg {...commonProps}>
        <path d="M4 17 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M5 19V5" />
      <path d="M5 19h14" />
      <path d="M9 16v-5" />
      <path d="M13 16V8" />
      <path d="M17 16v-3" />
    </svg>
  );
}

function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <a
      href={href}
      className={
        variant === "primary"
          ? "inline-flex h-9 items-center justify-center rounded-lg bg-[#0f8276] px-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0b6f66] focus:outline-none focus:ring-2 focus:ring-[#0f8276] focus:ring-offset-2 sm:h-10 sm:px-5 sm:text-sm"
          : "inline-flex h-9 items-center justify-center rounded-lg border-2 border-[#4b5563] px-3 text-xs font-bold text-[#1f2937] transition hover:border-[#0f8276] hover:text-[#0f8276] focus:outline-none focus:ring-2 focus:ring-[#0f8276] focus:ring-offset-2 sm:h-10 sm:px-5 sm:text-sm"
      }
    >
      {children}
    </a>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#1d2433]">
      <header className="sticky top-0 z-30 border-b border-[#a9adb5] bg-[#f4f5f7]/95 backdrop-blur">
        <nav className="mx-auto flex h-[58px] w-full max-w-[1180px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
          <a href="#" className="flex items-center">
            <Image
              src="/stockcerdas-logo.svg"
              alt="Logo StockCerdas"
              width={228}
              height={48}
              priority
              className="h-9 w-auto max-w-[145px] sm:h-11 sm:max-w-none"
            />
          </a>

          <div className="hidden items-center gap-8 text-[15px] font-semibold text-[#0f8276] md:flex">
            <a href="#fitur" className="transition hover:text-[#0b6f66]">
              Fitur
            </a>
            <a href="#cara-kerja" className="transition hover:text-[#0b6f66]">
              Cara Kerja
            </a>
            <a href="#paket" className="transition hover:text-[#0b6f66]">
              Paket
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ButtonLink href="#login" variant="secondary">
              Login
            </ButtonLink>
            <ButtonLink href="#mulai">Mulai Gratis</ButtonLink>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[470px] w-full max-w-[1180px] items-center gap-8 px-5 py-16 lg:grid-cols-[1fr_520px] lg:px-8 lg:py-20">
        <div className="max-w-[610px]">
          <h1 className="text-[34px] font-extrabold leading-[1.18] tracking-normal text-[#1c2433] sm:text-[46px] lg:text-[52px]">
            Stok UMKM lebih terkendali dengan prediksi restock AI
          </h1>
          <p className="mt-7 max-w-[570px] text-base font-semibold leading-7 text-[#657181] sm:text-lg">
            Pantau inventaris, baca tren penjualan, dan dapatkan rekomendasi restock sebelum stok
            kosong atau modal tertahan.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="#mulai">Mulai Gratis</ButtonLink>
            <ButtonLink href="#fitur" variant="secondary">
              Lihat Fitur
            </ButtonLink>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src="/hero-stock-management.svg"
            alt="Ilustrasi manajemen stok"
            width={520}
            height={360}
            priority
            className="h-auto w-full max-w-[500px]"
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
          <div className="logo-track flex w-max items-center gap-20">
            {[...clientLogos, ...clientLogos, ...clientLogos].map((logo, index) => (
              <div
                key={`${logo.src}-${index}`}
                className="flex h-[118px] w-[220px] shrink-0 items-center justify-center"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={220}
                  height={118}
                  className="max-h-[110px] w-auto object-contain"
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
              className="min-h-[166px] rounded-lg border border-[#d8dde5] bg-[#f4f5f7] p-6 shadow-[0_1px_3px_rgba(29,36,51,0.04)]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0f8276] text-white">
                <FeatureIcon type={feature.icon} />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-[#293142]">{feature.title}</h3>
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
          <ButtonLink href="#daftar">Mulai Gratis</ButtonLink>
        </div>
      </section>

      <footer className="bg-[#0f8276] px-5 py-12 text-white sm:py-14">
        <div className="mx-auto grid max-w-[1040px] gap-10 md:grid-cols-[1.5fr_0.5fr_1fr]">
          <div>
            <Image
              src="/stockcerdas-logo-footer.svg"
              alt="Logo StockCerdas"
              width={228}
              height={48}
              className="h-11 w-auto"
            />
            <p className="mt-6 max-w-[275px] text-base font-semibold leading-6 text-white/95">
              Membantu UMKM mengelola stok dan prediksi restock lebih cerdas menggunakan AI.
            </p>
            <p className="mt-14 text-sm font-bold text-white/95">
              © 2026 StokCerdas. Prediksi restock UMKM berbasis data.
            </p>
          </div>

          <div>
            <h3 className="text-base font-extrabold">Menu</h3>
            <ul className="mt-5 space-y-4 text-base font-medium">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#fitur" className="hover:underline">
                  Fitur
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:underline">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#paket" className="hover:underline">
                  Paket
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-extrabold">Kontak</h3>
            <ul className="mt-5 space-y-4 text-base font-medium">
              <li>admin@stockcerdas.id</li>
              <li>+62 857 1204 0161</li>
              <li>Yogyakarta, Indonesia</li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
