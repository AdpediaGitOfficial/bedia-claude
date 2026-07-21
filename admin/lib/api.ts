import axios, { AxiosError } from 'axios';
import { getStoredToken, clearStoredAuth } from './auth';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL && typeof window !== 'undefined') {
  // Surfaced in the console; requests will fail fast below.
  console.error('NEXT_PUBLIC_API_BASE_URL is not set.');
}

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach the admin JWT to every request.
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401/403, clear the session and bounce to login.
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;
    if ((status === 401 || status === 403) && typeof window !== 'undefined') {
      clearStoredAuth();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

/** Normalize an axios error into a human-readable message. */
export function apiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; errors?: unknown } | undefined;
    if (data?.message) return data.message;
    if (err.message) return err.message;
  }
  return 'Something went wrong. Please try again.';
}
