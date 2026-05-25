"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthField } from "@/auth/components/auth-field";
import { saveSession, type SessionUser } from "@/auth/session";

const registerBenefits = [
  "Prediksi restock otomatis",
  "Monitoring stok real-time",
  "Dashboard inventaris modern",
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") || "").trim();
    const businessName = String(formData.get("businessName") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const businessType = String(formData.get("businessType") || "").trim();

    if (!fullName || !businessName || !email || !password || !businessType) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (email === "superadmin@gmail.com") {
      setError("Email ini khusus untuk Super Admin.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("stockcerdas_users") || "[]") as Array<{
      email: string;
    }>;

    if (users.some((user) => user.email.toLowerCase() === email)) {
      setError("Email sudah terdaftar. Silakan login.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, businessName, email, password, businessType }),
      });

      const result = await response.json();

      if (response.ok) {
        saveSession(result.data);
        router.push("/dashboard/useradmin");
      } else {
        setError(result.message || "Gagal melakukan registrasi");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan saat mencoba mendaftar.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#111827] lg:grid lg:grid-cols-2">
      <section className="hidden min-h-[560px] flex-col bg-[#0f8276] px-8 py-8 text-white sm:px-12 lg:flex lg:min-h-screen lg:px-12 lg:py-10 xl:px-14">
        <Link href="/" aria-label="Kembali ke beranda">
          <Image
            src="/assets/logo-text-white.svg"
            alt="Logo StockCerdas"
            width={320}
            height={68}
            priority
            className="h-auto w-[210px] sm:w-[245px]"
          />
        </Link>

        <div className="mt-12 max-w-[650px] lg:mt-14">
          <h1 className="text-[28px] font-extrabold leading-tight sm:text-[32px]">
            Kelola stok UMKM lebih cerdas dengan AI
          </h1>
          <p className="mt-9 max-w-[600px] text-[22px] font-medium leading-tight sm:text-[26px]">
            Pantau inventaris, prediksi restock otomatis, dan optimalkan pengelolaan stok dalam
            satu dashboard modern.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Image
            src="/assets/stock.png"
            alt="Ilustrasi dashboard manajemen stok"
            width={560}
            height={430}
            className="h-auto w-full max-w-[330px] xl:max-w-[385px]"
          />
        </div>

        <ul className="mt-auto space-y-3 pt-8 text-lg font-medium sm:text-xl">
          {registerBenefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3">
              <Image
                src="/assets/icon-circle-check.svg"
                alt=""
                width={24}
                height={24}
                className="brightness-0 invert"
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-14 lg:min-h-0 lg:px-14 xl:px-20">
        <div className="w-full max-w-[520px]">
          <div className="text-center">
            <h2 className="text-[32px] font-extrabold leading-tight sm:text-[38px]">
              Buat akun gratis
            </h2>
            <p className="mt-4 text-lg font-medium text-[#657181] sm:text-xl">
              Mulai kelola stok bisnis Anda hari ini
            </p>
          </div>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <AuthField label="Nama Lengkap" name="fullName" />
            <AuthField label="Nama Usaha" name="businessName" />
            <AuthField label="Email" name="email" type="email" />
            <AuthField label="Password" name="password" type="password" />
            <AuthField 
              label="Jenis Usaha Anda" 
              name="businessType" 
              type="select"
              options={[
                { label: "Pilih jenis usaha", value: "" },
                { label: "Ritel / Sembako", value: "Ritel / Sembako" },
                { label: "F&B / Warung Makan", value: "F&B / Warung Makan" },
                { label: "Minimarket", value: "Minimarket" },
                { label: "Toko Online", value: "Toko Online" }
              ]}
            />

            {error ? (
              <p className="rounded-lg bg-[#fff1f1] px-4 py-3 text-sm font-bold text-[#b42318]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-3 h-11 w-full rounded-lg bg-[#0f8276] text-lg font-extrabold text-white transition hover:bg-[#0b6f66] focus:outline-none focus:ring-2 focus:ring-[#0f8276] focus:ring-offset-2"
            >
              Buat Akun
            </button>
          </form>

          <p className="mt-4 text-center text-sm font-medium leading-6 text-[#657181] sm:text-base">
            Dengan mendaftar, Anda menyetujui{" "}
            <a href="#syarat" className="text-[#0f8276] hover:underline">
              Syarat & Ketentuan
            </a>{" "}
            dan{" "}
            <a href="#privasi" className="text-[#0f8276] hover:underline">
              Kebijakan Privasi
            </a>
          </p>
          <p className="mt-2 text-center text-sm font-medium text-[#657181] sm:text-base">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-extrabold text-[#0f8276] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
