import React, { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, Sparkles, Globe, Search } from "lucide-react";
import { toast } from "sonner";
import api, { fileUrl } from "@/lib/api";

const empty = {
  name: "",
  category_id: "",
  composition: "",
  description: "",
  packaging: "",
  image_url: "",
  is_active: true,
  slug: "",
  focus_keyword: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  canonical: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    const [p, c] = await Promise.all([
      api.get("/products", { params: { only_active: false } }),
      api.get("/categories"),
    ]);
    setProducts(p.data || []);
    setCategories(c.data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category_id: p.category_id,
      composition: p.composition || "",
      description: p.description || "",
      packaging: p.packaging || "",
      image_url: p.image_url || "",
      is_active: p.is_active !== false,
      slug: p.slug || "",
      focus_keyword: p.focus_keyword || "",
      meta_title: p.meta_title || "",
      meta_description: p.meta_description || "",
      meta_keywords: p.meta_keywords || "",
      canonical: p.canonical || "",
    });
    setOpen(true);
  };

  const autoGenerateSeo = () => {
    if (!form.name) {
      toast.error("Please enter a product name first");
      return;
    }
    const catObj = categories.find((c) => c.id === form.category_id);
    const catName = catObj ? catObj.name : "Pharmaceuticals";

    const generatedSlug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const generatedTitle = `${form.name} ${form.composition ? `(${form.composition})` : ""} - ${catName} | Wellicon Pharma`;
    const generatedDesc = `${form.name} ${form.composition ? `containing ${form.composition}` : ""}. High quality product in ${catName} category by Wellicon Pharmaceuticals. Available in ${form.packaging || "standard packaging"}.`;
    const generatedKeywords = `${form.name}, ${form.composition}, ${catName}, Wellicon Pharmaceuticals, PCD Pharma`;

    setForm((f) => ({
      ...f,
      slug: f.slug || generatedSlug,
      focus_keyword: f.focus_keyword || form.name,
      meta_title: f.meta_title || generatedTitle,
      meta_description: f.meta_description || generatedDesc,
      meta_keywords: f.meta_keywords || generatedKeywords,
    }));
    toast.success("Product SEO details generated!");
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, image_url: data.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.category_id) {
      toast.error("Please choose a category");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        toast.success("Product updated");
      } else {
        await api.post("/products", form);
        toast.success("Product created");
      }
      setOpen(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save failed");
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    await api.delete(`/products/${p.id}`);
    toast.success("Deleted");
    await load();
  };

  return (
    <div className="space-y-6" data-testid="admin-products">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your pharmaceutical product catalogue.</p>
        </div>
        <button
          onClick={openNew}
          data-testid="add-product-btn"
          className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-600 text-white rounded-md px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-6 py-3">Image</th>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Category</th>
                <th className="text-left px-6 py-3">Composition</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No products yet.</td></tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="border-t border-slate-100" data-testid={`product-row-${p.id}`}>
                  <td className="px-6 py-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-md flex items-center justify-center overflow-hidden">
                      {p.image_url ? (
                        <img src={fileUrl(p.image_url)} alt={p.name} className="max-w-full max-h-full object-contain" />
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-6 py-3 text-slate-600">{p.category?.name || "—"}</td>
                  <td className="px-6 py-3 text-slate-600 max-w-xs truncate">{p.composition}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${p.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(p)} data-testid={`edit-${p.id}`} className="inline-flex items-center gap-1 text-sm text-sky-700 hover:text-sky-900">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(p)} data-testid={`delete-${p.id}`} className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" data-testid="product-modal">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-display font-semibold text-lg">{editingId ? "Edit product" : "Add product"}</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    data-testid="form-name"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                  <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    data-testid="form-category"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none bg-white">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Composition</label>
                <input value={form.composition} onChange={(e) => setForm({ ...form, composition: e.target.value })}
                  data-testid="form-composition"
                  placeholder="e.g. Paracetamol 650mg"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Packaging</label>
                <input value={form.packaging} onChange={(e) => setForm({ ...form, packaging: e.target.value })}
                  data-testid="form-packaging"
                  placeholder="e.g. 10x10 Alu-Alu Strip"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  data-testid="form-description"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Image</label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-slate-50 rounded-md flex items-center justify-center overflow-hidden border border-slate-200">
                    {form.image_url ? <img src={fileUrl(form.image_url)} alt="" className="max-w-full max-h-full object-contain" /> : <span className="text-xs text-slate-400">No image</span>}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      data-testid="form-image-upload"
                      className="block text-sm w-full file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                    />
                    {uploading && <div className="text-xs text-slate-500">Uploading…</div>}
                    <input
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="Or paste image URL"
                      data-testid="form-image-url"
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
                    />
                  </div>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  data-testid="form-active" />
                Active (visible on public site)
              </label>

              {/* ──────────────── PRODUCT SEO SETTINGS SECTION ──────────────── */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-sky-600" />
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Product SEO & Google Search Indexing</h4>
                  </div>
                  <button
                    type="button"
                    onClick={autoGenerateSeo}
                    className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-md border border-sky-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Auto-Generate SEO
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Focus SEO Keyword</label>
                    <input
                      type="text"
                      value={form.focus_keyword || ""}
                      onChange={(e) => setForm({ ...form, focus_keyword: e.target.value })}
                      placeholder="e.g. Paracetamol 650mg"
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={form.slug || ""}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="e.g. paracetamol-650mg-tablets"
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Meta Title Tag <span className="text-slate-400 font-normal">({form.meta_title?.length || 0}/60 chars)</span>
                    </label>
                    <input
                      type="text"
                      value={form.meta_title || ""}
                      onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                      placeholder="e.g. Paracetamol 650mg Tablets - Anti-pyretic | Wellicon Pharma"
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Meta Description Tag <span className="text-slate-400 font-normal">({form.meta_description?.length || 0}/160 chars)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={form.meta_description || ""}
                      onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                      placeholder="e.g. Inquire about Paracetamol 650mg tablets manufactured by Wellicon Pharmaceuticals with high purity..."
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Meta Keywords <span className="text-slate-400 font-normal">(Comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={form.meta_keywords || ""}
                      onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                      placeholder="e.g. Paracetamol 650mg, Analgesic, PCD Pharma Product, Wellicon"
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                    />
                  </div>
                </div>

                {/* Google Search Live Result Preview */}
                <div className="bg-slate-100 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5 text-sky-600" /> Live Google Search Result Preview
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs space-y-0.5">
                    <div className="text-xs text-[#202124] font-medium truncate">
                      https://welliconpharma.com/products/{form.slug || form.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "product-name"}
                    </div>
                    <div className="text-sm font-semibold text-[#1a0dab] line-clamp-1 hover:underline cursor-pointer">
                      {form.meta_title || `${form.name || "Product Name"} ${form.composition ? `(${form.composition})` : ""} | Wellicon Pharmaceuticals`}
                    </div>
                    <div className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                      {form.meta_description || form.description || form.composition || "High quality pharmaceutical formulation by Wellicon Pharmaceuticals."}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md border border-slate-300 text-sm hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" data-testid="form-submit" className="px-5 py-2 rounded-md bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium">
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
