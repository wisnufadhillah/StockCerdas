"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, type SessionUser } from "@/auth/session";

export function SessionProfile({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStoreName, setActiveStoreName] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const s = getSession();
    setSession(s);
    
    const storeName = localStorage.getItem("stockcerdas_active_store_name");
    if (storeName) setActiveStoreName(storeName);

    const handleStoreChange = () => {
      setActiveStoreName(localStorage.getItem("stockcerdas_active_store_name"));
    };
    window.addEventListener("storeNameChanged", handleStoreChange);

    if (!s) {
      router.push("/login");
    }

    return () => window.removeEventListener("storeNameChanged", handleStoreChange);
  }, [router]);

  if (!mounted) return null;

  const name = session?.name || "Guest";
  const email = session?.email || "Belum login";
  const role = session?.role === "superadmin" ? "Super Admin" : "Admin UMKM";
  const businessName = session?.business_name || null;
  const profileImageUrl = session?.profile_image_url || null;
  const initial = name.charAt(0).toUpperCase();

  const renderAvatar = (className: string) => (
    <div className={`${className} overflow-hidden`}>
      {profileImageUrl ? <Image src={profileImageUrl} alt={name} width={64} height={64} unoptimized className="h-full w-full object-cover" /> : initial}
    </div>
  );

  if (compact) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-3 rounded-lg border border-[#d8dde5] bg-white px-3 py-2 transition hover:border-[#0f8276] hover:shadow-[0_4px_12px_rgba(15,130,118,0.12)]"
        >
          {/* Profile Avatar */}
          {renderAvatar("flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0f8276] to-[#0b6f66] text-sm font-extrabold text-white shadow-[0_2px_8px_rgba(15,130,118,0.3)]")}
          {/* User Icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#526072" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-extrabold text-[#172033]">{name}</p>
            <p className="truncate text-[11px] font-semibold text-[#657181]">{role}</p>
          </div>
          {/* Chevron */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9aa4b2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-[#d8dde5] bg-white p-4 shadow-[0_16px_48px_rgba(17,24,39,0.14)]">
              <div className="flex items-center gap-3">
                {renderAvatar("flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0f8276] to-[#0b6f66] text-lg font-extrabold text-white shadow-[0_4px_12px_rgba(15,130,118,0.3)]")}
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-[#172033]">{name}</p>
                  <p className="truncate text-xs font-semibold text-[#657181]">{email}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 border-t border-[#e0e5ec] pt-3">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f8276" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  <span className="rounded-md bg-[#edf8f6] px-2 py-0.5 text-xs font-extrabold uppercase text-[#0f8276]">
                    {role}
                  </span>
                </div>
                {businessName && (
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#526072" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span className="text-xs font-semibold text-[#526072]">{activeStoreName || businessName}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#d8dde5] bg-[#f8fafb] p-4">
      <div className="flex items-center gap-3">
        {/* Profile Avatar with icon */}
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#0f8276] to-[#0b6f66] text-sm font-extrabold text-white shadow-[0_4px_12px_rgba(15,130,118,0.3)]">
          {profileImageUrl ? <Image src={profileImageUrl} alt={name} width={64} height={64} unoptimized className="h-full w-full object-cover" /> : initial}
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#22c55e]" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-[#172033]">{name}</p>
          <p className="truncate text-xs font-semibold text-[#657181]">{email}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#e0e5ec] pt-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f8276" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="rounded-md bg-[#edf8f6] px-2 py-0.5 text-xs font-extrabold uppercase text-[#0f8276]">
          {role}
        </span>
        {businessName && (
          <>
            <span className="text-[#d5dbe3]">•</span>
            <span className="text-xs font-semibold text-[#526072]">{activeStoreName || businessName}</span>
          </>
        )}
      </div>
    </div>
  );
}
