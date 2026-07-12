import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const empty = { name: "", slug: "", description: "" };

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await api.get("/categories");
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditingId(null); setForm(empty); setOpen(true); };
  const openEdit = (c) => { setEditingId(c.id); setForm({ name: c.name, slug: c.slug, description: c.description || "" }); setOpen(true); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        toast.success("Category updated");
      } else {
        await api.post("/categories", form);
        toast.success("Category created");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save failed");
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete ${c.name}?`)) return;
    await api.delete(`/categories/${c.id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6" data-testid="admin-categories">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-slate-900">Categories</h2>
          <p className="text-sm text-slate-500 mt-1">Organise products by therapeutic division or dosage form.</p>
        </div>
        <button onClick={openNew} data-testid="add-category-btn"
          className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-600 text-white rounded-md px-4 py-2.5 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add category
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Slug</th>
              <th className="text-left px-6 py-3">Description</th>
              <th className="text-right px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">No categories.</td></tr>}
            {items.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="px-6 py-3 font-medium text-slate-900">{c.name}</td>
                <td className="px-6 py-3 text-slate-500 font-mono text-xs">{c.slug}</td>
                <td className="px-6 py-3 text-slate-600 max-w-md truncate">{c.description}</td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(c)} data-testid={`edit-cat-${c.id}`} className="text-sky-700 hover:text-sky-900"><Pencil className="w-4 h-4 inline" /></button>
                  <button onClick={() => remove(c)} data-testid={`delete-cat-${c.id}`} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-display font-semibold text-lg">{editingId ? "Edit category" : "Add category"}</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-testid="cat-form-name"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="auto-generated if empty"
                  data-testid="cat-form-slug"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  data-testid="cat-form-description"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md border border-slate-300 text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="cat-form-submit" className="px-5 py-2 rounded-md bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium">
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
