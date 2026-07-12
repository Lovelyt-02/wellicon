import React, { useEffect, useState } from "react";
import { Trash2, Eye, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function AdminInquiries() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);

  const load = async () => {
    const { data } = await api.get("/inquiries");
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const view = async (i) => {
    setOpen(i);
    if (!i.is_read) {
      try { await api.put(`/inquiries/${i.id}/read`); load(); } catch { }
    }
  };

  const remove = async (i) => {
    if (!window.confirm("Delete this inquiry?")) return;
    await api.delete(`/inquiries/${i.id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6" data-testid="admin-inquiries">
      <div>
        <h2 className="text-2xl font-display font-semibold text-slate-900">Contact Inquiries</h2>
        <p className="text-sm text-slate-500 mt-1">Messages submitted via the public contact form.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Subject</th>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-right px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No inquiries yet.</td></tr>}
            {items.map((i) => (
              <tr key={i.id} className="border-t border-slate-100">
                <td className="px-6 py-3">
                  <span className={`inline-flex w-2 h-2 rounded-full ${i.is_read ? "bg-slate-300" : "bg-sky-500"}`} />
                </td>
                <td className="px-6 py-3 font-medium text-slate-900">{i.name}</td>
                <td className="px-6 py-3 text-slate-600">{i.email}</td>
                <td className="px-6 py-3 text-slate-600 max-w-xs truncate">{i.subject || "—"}</td>
                <td className="px-6 py-3 text-slate-500 text-xs">{new Date(i.created_at).toLocaleString()}</td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button onClick={() => view(i)} data-testid={`view-inq-${i.id}`} className="text-sky-700 hover:text-sky-900"><Eye className="w-4 h-4 inline" /></button>
                  <button onClick={() => remove(i)} data-testid={`del-inq-${i.id}`} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-semibold text-lg text-slate-900">{open.subject || "Inquiry"}</h3>
            <p className="text-xs text-slate-500 mt-1">{new Date(open.created_at).toLocaleString()}</p>
            <div className="mt-5 space-y-3">
              <div className="text-sm"><span className="text-slate-500">From:</span> <span className="font-medium">{open.name}</span></div>
              <div className="text-sm flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /><a href={`mailto:${open.email}`} className="text-sky-700 hover:underline">{open.email}</a></div>
              {open.phone && <div className="text-sm flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /><a href={`tel:${open.phone}`} className="text-sky-700 hover:underline">{open.phone}</a></div>}
            </div>
            <div className="mt-5 p-4 bg-slate-50 rounded-md text-sm text-slate-700 whitespace-pre-line">
              {open.message}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setOpen(null)} className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
