export type SessionUser = {
  id?: number;
  tenant_id?: number | null;
  name: string;
  email: string;
  role: "superadmin" | "useradmin";
  business_name?: string | null;
  profile_image_url?: string | null;
  plan?: string;
};

const SESSION_KEY = "stockcerdas_session";
const MAX_STORED_PROFILE_IMAGE_LENGTH = 200_000;

export function createStoredSession(session: SessionUser): SessionUser {
  const profileImageUrl = session.profile_image_url || null;

  return {
    ...session,
    profile_image_url: profileImageUrl && profileImageUrl.length <= MAX_STORED_PROFILE_IMAGE_LENGTH ? profileImageUrl : null,
  };
}

export function createCookieSession(session: SessionUser): SessionUser {
  return {
    ...session,
    profile_image_url: null,
  };
}

export function saveSession(session: SessionUser) {
  const storedValue = JSON.stringify(createStoredSession(session));
  const cookieValue = JSON.stringify(createCookieSession(session));

  try {
    localStorage.setItem(SESSION_KEY, storedValue);
  } catch (error) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(createStoredSession({ ...session, profile_image_url: null })));
  }

  document.cookie = `${SESSION_KEY}=${encodeURIComponent(cookieValue)}; path=/; max-age=86400; SameSite=Lax`;
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
