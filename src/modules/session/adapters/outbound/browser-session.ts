import { authenticate, type SessionUser } from "../../domain/authenticate.ts";

const SESSION_KEY = "ambito-session-user";

export function login(username: string, password: string): SessionUser | null {
  const session = authenticate(username, password);
  if (!session || typeof window === "undefined") return null;
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function currentUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionUser;
    if (!parsed?.id || !parsed.name || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}
