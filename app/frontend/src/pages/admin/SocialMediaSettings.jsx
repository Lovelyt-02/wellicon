import React, { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import api, { fileUrl } from "@/lib/api";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { FaLinkedin, FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";

const PLATFORM_OPTIONS = [
  { value: "linkedin", label: "LinkedIn", icon: <FaLinkedin className="w-5 h-5" /> },
  { value: "instagram", label: "Instagram", icon: <FaInstagram className="w-5 h-5" /> },
  { value: "youtube", label: "YouTube", icon: <FaYoutube className="w-5 h-5" /> },
  { value: "x", label: "X (Twitter)", icon: <FaTwitter className="w-5 h-5" /> },
  { value: "facebook", label: "Facebook", icon: <FaFacebook className="w-5 h-5" /> },
  { value: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp className="w-5 h-5" /> },
];

export default function SocialMediaSettings() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    platform: "",
    url: "",
    active: true,
    display_order: 0,
    open_in_new_tab: true,
    nofollow: false,
    icon_url: "",
  });
  const [editingId, setEditingId] = useState(null);
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const { data } = await api.get("/social-media");
      const sorted = (data || []).sort((a, b) => a.display_order - b.display_order);
      setItems(sorted);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to load social media");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm({
      platform: "",
      url: "",
      active: true,
      display_order: items.length,
      open_in_new_tab: true,
      nofollow: false,
      icon_url: "",
    });
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      platform: item.platform,
      url: item.url || "",
      active: item.active ?? true,
      display_order: item.display_order,
      open_in_new_tab: item.open_in_new_tab ?? true,
      nofollow: item.nofollow ?? false,
      icon_url: item.icon_url || "",
    });
    setOpen(true);
  };

  const handleIconUpload = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, icon_url: data.url }));
      toast.success("Icon uploaded");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Upload failed");
    }
  };

  const validate = () => {
    if (!form.platform) { toast.error("Platform is required"); return false; }
    if (form.active && !form.url) { toast.error("URL is required for active entries"); return false; }
    if (form.url && !/^https?:\/\/.+/.test(form.url)) { toast.error("Invalid URL format"); return false; }
    return true;
  };

  const submit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!validate()) return;
    try {
      if (editingId) { await api.put(`/social-media/${editingId}`, form); toast.success("Social media entry updated"); }
      else { await api.post("/social-media", form); toast.success("Social media entry created"); }
      setOpen(false);
      await load();
      window.dispatchEvent(new CustomEvent("site-settings-updated"));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save failed");
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.platform}?`)) return;
    try { await api.delete(`/social-media/${item.id}`); toast.success("Deleted"); await load(); }
    catch (err) { toast.error(err.response?.data?.detail || "Delete failed"); }
  };

  const move = async (id, direction) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= items.length) return;
    const newItems = [...items];
    const a = newItems[idx];
    const b = newItems[newIdx];
    const temp = a.display_order;
    a.display_order = b.display_order;
    b.display_order = temp;
    setItems(newItems);
    try { await Promise.all([api.put(`/social-media/${a.id}`, { ...a }), api.put(`/social-media/${b.id}`, { ...b })]); }
    catch (err) { toast.error("Failed to reorder"); await load(); }
  };

  const defaultIcon = (platform) => {
    const opt = PLATFORM_OPTIONS.find((o) => o.value === platform);
    return opt ? opt.icon : null;
  };

  return (
    <div className="space-y-6" data-testid="admin-social-media">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-slate-900">Social Media</h2>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-600 text-white rounded-md px-4 py-2.5 text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add social link
        </button>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider"><tr>
          <th className="px-6 py-3 text-left">Icon</th><th className="px-6 py-3 text-left">Platform</th><th className="px-6 py-3 text-left">URL</th><th className="px-6 py-3 text-left">Active</th><th className="px-6 py-3 text-left">Order</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
        <tbody>
          {items.length===0 && (<tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No social media entries yet.</td></tr>)}
          {items.map(item => (
            <tr key={item.id} className="border-t border-slate-100" data-testid={`social-row-${item.id}`}>
              <td className="px-6 py-3">{item.icon_url ? (<img src={fileUrl(item.icon_url)} alt={item.platform} className="w-6 h-6 object-contain" />) : defaultIcon(item.platform)}</td>
              <td className="px-6 py-3 capitalize text-slate-900">{item.platform}</td>
              <td className="px-6 py-3 text-slate-600 truncate max-w-xs" title={item.url}>{item.url}</td>
              <td className="px-6 py-3">{item.active ? (<span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700">Active</span>) : (<span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-500">Inactive</span>)}</td>
              <td className="px-6 py-3 flex items-center gap-2">
                <button onClick={() => move(item.id, -1)} disabled={items[0].id===item.id} className="p-1 hover:bg-slate-100 rounded"><FiChevronUp className="w-4 h-4" /></button>
                <button onClick={() => move(item.id, 1)} disabled={items[items.length-1].id===item.id} className="p-1 hover:bg-slate-100 rounded"><FiChevronDown className="w-4 h-4" /></button>
                <span className="text-xs text-slate-500">{item.display_order}</span>
              </td>
              <td className="px-6 py-3 text-right space-x-2">
                <button onClick={() => openEdit(item)} className="inline-flex items-center gap-1 text-sm text-sky-700 hover:text-sky-900"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(item)} className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" data-testid="social-modal">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-display font-semibold text-lg">{editingId ? "Edit social link" : "Add social link"}</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Platform *</label>
                  <select required value={form.platform} onChange={e=>setForm({...form, platform:e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none bg-white"><option value="">Select platform</option>{PLATFORM_OPTIONS.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Profile URL {form.active && "*"}</label>
                  <input type="url" placeholder="https://..." value={form.url} onChange={e=>setForm({...form, url:e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"/></div>
                <div className="flex items-center"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form, active:e.target.checked})} className="mr-2"/><label className="text-sm text-slate-700">Active (visible on site)</label></div>
                <div className="flex items-center"><input type="checkbox" checked={form.open_in_new_tab} onChange={e=>setForm({...form, open_in_new_tab:e.target.checked})} className="mr-2"/><label className="text-sm text-slate-700">Open in new tab</label></div>
                <div className="flex items-center"><input type="checkbox" checked={form.nofollow} onChange={e=>setForm({...form, nofollow:e.target.checked})} className="mr-2"/><label className="text-sm text-slate-700">NoFollow (SEO)</label></div>
                <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1.5">Custom Icon (optional)</label>
                  <div className="flex items-start gap-4"><div className="w-12 h-12 bg-slate-50 rounded-md flex items-center justify-center overflow-hidden border border-slate-200">
                    {form.icon_url ? (<img src={fileUrl(form.icon_url)} alt="icon" className="max-w-full max-h-full object-contain" />) : (form.platform && defaultIcon(form.platform))}
                  </div><div className="flex-1 space-y-2"><input ref={fileRef} type="file" accept="image/*" onChange={e=>handleIconUpload(e.target.files?.[0])} className="block text-sm w-full file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>{form.icon_url && (<input value={form.icon_url} onChange={e=>setForm({...form, icon_url:e.target.value})} placeholder="Or paste icon URL" className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"/>)}</div></div></div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100"><button type="button" onClick={()=>setOpen(false)} className="px-4 py-2 rounded-md border border-slate-300 text-sm hover:bg-slate-50">Cancel</button><button type="button" onClick={submit} className="px-4 py-2 rounded-md bg-sky-700 text-white hover:bg-sky-600">Save</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
