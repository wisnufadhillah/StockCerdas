import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0f8276] px-5 py-12 text-white sm:py-14">
      <div className="mx-auto grid max-w-[1040px] gap-10 md:grid-cols-[1.5fr_0.5fr_1fr]">
        <div>
          <Image
            src="/assets/logo-text-white.svg"
            alt="Logo StockCerdas"
            width={228}
            height={48}
            className="h-11 w-auto"
          />
          <p className="mt-6 max-w-[275px] text-base font-semibold leading-6 text-white/95">
            Membantu UMKM mengelola stok dan prediksi restock lebih cerdas menggunakan AI.
          </p>
          <p className="mt-14 text-sm font-bold text-white/95">
            &copy; 2026 StokCerdas. Prediksi restock UMKM berbasis data.
          </p>
        </div>

        <div>
          <h3 className="text-base font-extrabold">Menu</h3>
          <ul className="mt-5 space-y-4 text-base font-medium">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#fitur" className="hover:underline">
                Fitur
              </Link>
            </li>
            <li>
              <Link href="/#cara-kerja" className="hover:underline">
                Cara Kerja
              </Link>
            </li>
            <li>
              <Link href="/paket" className="hover:underline">
                Paket
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-extrabold">Kontak</h3>
          <ul className="mt-5 space-y-4 text-base font-medium">
            <li>superadmin@gmail.com</li>
            <li>+62 857 1204 0161</li>
            <li>Yogyakarta, Indonesia</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
