"use client";

import { useRouter } from "next/navigation";
import { clearSession } from "@/auth/session";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        compact
          ? "rounded-lg border border-[#f0a8a8] bg-white px-4 py-2 text-sm font-extrabold text-[#b42318] transition hover:bg-[#fff1f1]"
          : "w-full rounded-lg border border-[#f0a8a8] px-4 py-3 text-left text-sm font-extrabold text-[#b42318] transition hover:bg-[#fff1f1]"
      }
    >
      Logout
    </button>
  );
}
