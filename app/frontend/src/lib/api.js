import axios from "axios";

/**
 * Backend base URL from Vite env (no trailing slash).
 * Set VITE_BACKEND_URL in:
 * - app/frontend/.env (local)
 * - Vercel Project Settings → Environment Variables (production)
 *
 * Local DEV only: falls back to http://localhost:8000 if unset.
 * Production builds never use a localhost fallback.
 */
const raw =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV ? "http://localhost:8000" : "");

export const BACKEND_URL = String(raw).replace(/\/$/, "");

if (!BACKEND_URL) {
  console.error(
    "[api] VITE_BACKEND_URL is not set. Configure it in Vercel env vars " +
      "(e.g. https://your-app.up.railway.app) and redeploy."
  );
}

export const API = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wp_token");

  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export const fileUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  if (path.startsWith("/api/")) {
    return BACKEND_URL ? `${BACKEND_URL}${path}` : path;
  }

  return `${API}/files/${path}`;
};

export default api;
