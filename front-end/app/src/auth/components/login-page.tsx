import Image from "next/image";
import Link from "next/link";
import { AuthField } from "@/auth/components/auth-field";

export function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] px-5 py-8 text-[#111827] sm:py-10">
      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center">
        <Link href="/" aria-label="Kembali ke beranda">
          <Image
            src="/assets/logo-text.svg"
            alt="Logo StockCerdas"
            width={360}
            height={76}
            priority
            className="h-auto w-[210px] sm:w-[245px]"
          />
        </Link>

        <section className="mt-7 w-full rounded-xl bg-white px-7 py-9 shadow-[8px_10px_16px_rgba(17,24,39,0.22)] sm:px-12 sm:py-11">
          <div className="text-center">
            <h1 className="text-[30px] font-extrabold leading-tight sm:text-[38px]">
              Masuk ke akun Anda
            </h1>
            <p className="mt-4 text-base font-medium text-[#657181] sm:text-xl">
              Selamat datang kembali di StokCerdas
            </p>
          </div>

          <form className="mt-7 space-y-4">
            <AuthField label="Email" name="email" type="email" />
            <AuthField label="Password" name="password" type="password" />

            <button
              type="submit"
              className="mt-5 h-11 w-full rounded-lg bg-[#0f8276] text-lg font-extrabold text-white transition hover:bg-[#0b6f66] focus:outline-none focus:ring-2 focus:ring-[#0f8276] focus:ring-offset-2"
            >
              Masuk
            </button>
          </form>

          <p className="mt-8 text-center text-base font-medium text-[#657181] sm:text-lg">
            Belum punya akun?{" "}
            <Link href="/register" className="font-extrabold text-[#0f8276] hover:underline">
              Daftar Gratis
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
