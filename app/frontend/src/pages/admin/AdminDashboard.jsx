import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, List, Inbox, Bell, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";

const StatCard = ({
  icon: Icon, label, value, color = "sky", testid }) => (
    <div className ="bg-white rounded-lg border border-slate-200 p-6 shadow-sm" data-testid={testid}>
    <div className ="flex items-center justify-between">
    <div className = {`w-10 h-10 rounded-lg bg-${color}-50 text-${color}-700 flex items-center justify-center`}>
      <Icon className="w-5 h-5" />
      </div >
    </div >
  <div className="mt-5">
    < div className ="text-3xl font-display font-semibold text-slate-900">{value}</div>
      < div className ="text-xs text-slate-500 uppercase tracking-wider mt-1">{label}</div>
    </div >
  </div >
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data));
    api.get("/inquiries").then((r) => setInquiries((r.data || []).slice(0, 5)));
  }, []);

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      < div >
      <h2 className="text-2xl font-display font-semibold text-slate-900">Overview</h2>
        < p className ="text-sm text-slate-500 mt-1">Snapshot of catalogue, divisions, and incoming inquiries.</p>
      </div >

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      < StatCard icon = { Package } label ="Total products" value={stats?.products ?? "—"} color="sky" testid="stat-products" />
        < StatCard icon = { List } label ="Categories" value={stats?.categories ?? "—"} color="emerald" testid="stat-categories" />
          < StatCard icon = { Inbox } label ="Inquiries" value={stats?.inquiries ?? "—"} color="violet" testid="stat-inquiries" />
            < StatCard icon = { Bell } label ="Unread" value={stats?.unread_inquiries ?? "—"} color="amber" testid="stat-unread" />
      </div >

    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      < div className ="px-6 py-4 flex items-center justify-between border-b border-slate-200">
        < div >
        <h3 className="font-semibold text-slate-900">Recent inquiries</h3>
          < p className ="text-xs text-slate-500">Last 5 submissions from the public contact form</p>
          </div >
    <Link to="/admin/inquiries" className="text-sm text-sky-700 hover:text-sky-900 inline-flex items-center gap-1">
            View all < ArrowUpRight className ="w-3 h-3" />
          </Link >
        </div >
    {
      inquiries.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-slate-500">No inquiries yet.</div>
        ) : (
          <div className="overflow-x-auto">
        < table className ="w-full text-sm">
        < thead className ="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
        < tr >
        <th className="text-left px-6 py-3">Name</th>
        < th className ="text-left px-6 py-3">Email</th>
        < th className ="text-left px-6 py-3">Subject</th>
        < th className ="text-left px-6 py-3">When</th>
                </tr >
              </thead >
              <tbody>
                {inquiries.map((i) => (
                  <tr key={i.id} className="border-t border-slate-100">
                    <td className="px-6 py-3 font-medium text-slate-900">{i.name}</td>
                    <td className="px-6 py-3 text-slate-600">{i.email}</td>
        < td className ="px-6 py-3 text-slate-600">{i.subject || "—"}</td>
        < td className ="px-6 py-3 text-slate-500">{new Date(i.created_at).toLocaleDateString()}</td>
                  </tr >
                ))
}
              </tbody >
            </table >
          </div >
        )}
      </div >
    </div >
  );
}
