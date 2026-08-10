import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pill, LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

function formatError(detail) {
  if (!detail) return "Login failed";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  return String(detail);
}

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Admin");
      navigate("/admin");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-sky-700 text-white mb-4">
            <Pill className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-slate-900">Wellicon CMS</h1>
          <p className="text-sm text-slate-500 mt-1">Admin Console — sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="off"
              data-testid="login-email"
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                data-testid="login-password"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            data-testid="login-submit"
            className="w-full bg-sky-700 hover:bg-sky-600 disabled:opacity-50 text-white rounded-md px-4 py-2.5 text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Default credentials: admin@wellicon.com / Admin@123
        </p>
      </div>
    </div>
  );
}

