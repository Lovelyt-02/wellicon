import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, List, Inbox, Settings, LogOut, Pill } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: List },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/settings", label: "Site Content", icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 flex flex-col" data-testid="admin-sidebar">
        <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-sky-500 text-white flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-display font-semibold text-sm">Wellicon CMS</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-sky-400">Admin Console</div>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                data-testid={`sidebar-link-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                className={({ isActive }) =>
                  `sidebar-link flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${isActive ? "active text-sky-400" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-slate-800 px-5 py-4">
          <div className="text-xs text-slate-500 mb-2">Logged in as</div>
          <div className="text-sm text-white font-medium truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            data-testid="logout-btn"
            className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-sky-700 font-semibold">Wellicon Pharma</div>
            <h1 className="text-lg font-display font-semibold text-slate-900">Admin Dashboard</h1>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="text-sm text-sky-700 hover:underline" data-testid="view-site-link">
            View public site →
          </a>
        </header>
        <main className="p-8 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
