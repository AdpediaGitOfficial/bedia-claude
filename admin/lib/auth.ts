'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  userId: string;
  name: string | null;
  email: string | null;
}

interface AuthState {
  token: string | null;
  role: string | null;
  user: AdminUser | null;
  setAuth: (data: { token: string; role: string; user: AdminUser }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

/**
 * Auth state persisted to localStorage. The backend /auth/login returns
 * { token, role, user }. The token is attached to every API request by the
 * axios interceptor in lib/api.ts.
 */
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      role: null,
      user: null,
      setAuth: ({ token, role, user }) => set({ token, role, user }),
      logout: () => set({ token: null, role: null, user: null }),
      isAuthenticated: () => Boolean(get().token),
    }),
    { name: 'bedia-admin-auth' },
  ),
);

/** Read the token outside React (for the axios interceptor). */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('bedia-admin-auth');
    if (!raw) return null;
    return JSON.parse(raw)?.state?.token ?? null;
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('bedia-admin-auth');
}
