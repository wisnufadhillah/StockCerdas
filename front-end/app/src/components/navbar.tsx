import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";

const navLinks = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/paket", label: "Paket" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#a9adb5] bg-[#f4f5f7]/95 backdrop-blur">
      <nav className="relative mx-auto flex h-[58px] w-full max-w-[1180px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo-text.svg"
            alt="Logo StockCerdas"
            width={228}
            height={48}
            priority
            className="h-9 w-auto max-w-[145px] sm:h-11 sm:max-w-none"
          />
        </Link>

        <div className="hidden items-center gap-8 text-[15px] font-semibold text-[#0f8276] md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#0b6f66]">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink href="/login" variant="secondary">
            Login
          </ButtonLink>
          <ButtonLink href="/register">Mulai Gratis</ButtonLink>
        </div>

        <details className="group md:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-[#4b5563] text-[#111827] transition hover:border-[#0f8276] hover:text-[#0f8276] [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Buka menu navigasi</span>
            <span className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 rounded-full bg-current transition group-open:translate-y-2 group-open:rotate-45" />
              <span className="h-0.5 w-5 rounded-full bg-current transition group-open:opacity-0" />
              <span className="h-0.5 w-5 rounded-full bg-current transition group-open:-translate-y-2 group-open:-rotate-45" />
            </span>
          </summary>

          <div className="absolute left-4 right-4 top-[66px] rounded-lg border border-[#d8dde5] bg-white p-4 shadow-[0_16px_40px_rgba(17,24,39,0.14)]">
            <div className="flex flex-col gap-3 text-base font-semibold text-[#0f8276]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-2 transition hover:bg-[#eef7f5]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <ButtonLink href="/login" variant="secondary">
                Login
              </ButtonLink>
              <ButtonLink href="/register">Mulai Gratis</ButtonLink>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
