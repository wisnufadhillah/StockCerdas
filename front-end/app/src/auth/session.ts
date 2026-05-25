export type SessionUser = {
  id?: number;
  tenant_id?: number | null;
  name: string;
  email: string;
  role: "superadmin" | "useradmin";
  business_name?: string | null;
  plan?: string;
};

const SESSION_KEY = "stockcerdas_session";

export function saveSession(session: SessionUser) {
  const value = JSON.stringify(session);
  localStorage.setItem(SESSION_KEY, value);
  document.cookie = `${SESSION_KEY}=${encodeURIComponent(value)}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("stockcerdas_active_store");
  localStorage.removeItem("stockcerdas_active_store_name");
  document.cookie = `${SESSION_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null") as SessionUser | null;
  } catch {
    return null;
  }
}
