"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthField } from "@/auth/components/auth-field";
import { saveSession, type SessionUser } from "@/auth/session";

type RegisteredUser = {
  fullName: string;
  businessName: string;
  email: string;
  password: string;
  businessType: string;
  role: "useradmin";
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = (await response.json()) as { data: SessionUser };
        saveSession(result.data);
        router.push(result.data.role === "superadmin" ? "/dashboard/superadmin" : "/dashboard/useradmin");
        return;
      }

      // API responded with an error (401, 403, etc.) — show the message
      const errorResult = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(errorResult?.message || "Email atau password tidak sesuai.");
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Pastikan backend server berjalan.");
    }
  }

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

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <AuthField label="Email" name="email" type="email" />
            <AuthField label="Password" name="password" type="password" />

            {error ? (
              <p className="rounded-lg bg-[#fff1f1] px-4 py-3 text-sm font-bold text-[#b42318]">
                {error}
              </p>
            ) : null}

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
