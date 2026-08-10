import React, { useState, useEffect, useRef } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { Upload, Globe, Search, Image as ImageIcon } from "lucide-react";

// ─── tiny helpers ──────────────────────────────────────────────────────────────
function Field({ label, id, value, onChange, placeholder, textarea, rows = 3, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={rows}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder || ""}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none resize-none transition"
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder || ""}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
        />
      )}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function SectionCard({ icon: Icon, title, color = "sky", children }) {
  const colors = {
    sky: "border-sky-100 bg-sky-50/40",
    violet: "border-violet-100 bg-violet-50/40",
    emerald: "border-emerald-100 bg-emerald-50/40",
  };
  const iconColors = {
    sky: "text-sky-600 bg-sky-100",
    violet: "text-violet-600 bg-violet-100",
    emerald: "text-emerald-600 bg-emerald-100",
  };
  return (
    <div className={`rounded-xl border p-5 space-y-4 ${colors[color]}`}>
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${iconColors[color]}`}>
          <Icon size={16} />
        </span>
        <h3 className="font-semibold text-slate-800 text-sm tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

const buildFormState = (settings = {}) => ({
  site_name: settings.site_name || "",
  site_url: settings.site_url || "",
  site_title: settings.site_title || "",
  site_description: settings.site_description || "",
  favicon_url: settings.favicon_url || "",
  meta_keywords: settings.meta_keywords || "",
  og_image_url: settings.og_image_url || "",
});

// ─── Main component ────────────────────────────────────────────────────────────
export default function SiteSettings({ value, onChange }) {
  const [form, setForm] = useState(null);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const faviconRef = useRef(null);
  const ogRef = useRef(null);

  const loadSettings = async () => {
    try {
      const { data } = await api.get("/settings");
      setForm(buildFormState(data));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Unable to load settings");
    }
  };

  // Load current settings
  useEffect(() => {
    loadSettings();
  }, []);

  const change = (key) => (e) => {
    const nextValue = e.target.value;
    setForm((f) => {
      const updated = { ...f, [key]: nextValue };
      onChange?.(updated);
      return updated;
    });
  };

  // Upload favicon via dedicated endpoint
  const uploadFavicon = async (file) => {
    if (!file) return;
    setUploadingFavicon(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/site-settings/favicon", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => {
        const updated = { ...f, favicon_url: data.url };
        onChange?.(updated);
        return updated;
      });
      window.dispatchEvent(new Event("site-settings-updated"));
      toast.success("Favicon uploaded");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Favicon upload failed");
    } finally {
      setUploadingFavicon(false);
    }
  };

  // Upload OG image via standard upload endpoint
  const uploadOgImage = async (file) => {
    if (!file) return;
    setUploadingOg(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => {
        const updated = { ...f, og_image_url: data.url };
        onChange?.(updated);
        return updated;
      });
      window.dispatchEvent(new Event("site-settings-updated"));
      toast.success("OG image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.detail || "OG image upload failed");
    } finally {
      setUploadingOg(false);
    }
  };

  useEffect(() => {
    if (value) {
      setForm(buildFormState(value));
    }
  }, [value]);

  if (!form) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
        Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl" data-testid="admin-site-settings">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Site Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure your site identity, browser metadata, and SEO defaults.
        </p>
      </div>

      {/* ── Section 1: Company / Site Identity ── */}
      <SectionCard icon={Globe} title="Company & Site Identity" color="sky">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            id="site_name"
            label="Site / Company Name"
            value={form.site_name}
            onChange={change("site_name")}
            placeholder="Wellicon Pharma"
            hint="Used in browser tab, emails, and across the site"
          />
          <Field
            id="site_url"
            label="Site URL"
            value={form.site_url}
            onChange={change("site_url")}
            placeholder="https://www.welliconpharma.com"
            hint="Canonical base URL — include https://"
          />
          <Field
            id="site_title"
            label="Homepage Browser Title"
            value={form.site_title}
            onChange={change("site_title")}
            placeholder="Wellicon Pharma — Trusted Pharmaceutical Solutions"
            hint="Shown in browser tab and search results"
          />
          <Field
            id="site_description"
            label="Default Site Description"
            value={form.site_description}
            onChange={change("site_description")}
            placeholder="WHO-GMP certified pharmaceutical company..."
            hint="Used as default meta description for pages"
          />
        </div>
      </SectionCard>

      {/* ── Section 2: Favicon ── */}
      <SectionCard icon={ImageIcon} title="Favicon" color="violet">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Preview */}
          <div className="flex-shrink-0">
            {form.favicon_url ? (
              <div className="w-16 h-16 rounded-xl border-2 border-violet-200 bg-white p-2 shadow-sm flex items-center justify-center">
                <img
                  src={form.favicon_url}
                  alt="Favicon preview"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-violet-200 bg-white flex items-center justify-center text-violet-300">
                <ImageIcon size={24} />
              </div>
            )}
          </div>

          {/* Upload controls */}
          <div className="flex-1 space-y-3">
            <div>
              <button
                type="button"
                onClick={() => faviconRef.current?.click()}
                disabled={uploadingFavicon}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-60 transition shadow-sm"
              >
                <Upload size={14} />
                {uploadingFavicon ? "Uploading…" : "Upload Favicon"}
              </button>
              <input
                ref={faviconRef}
                type="file"
                accept="image/png,image/svg+xml,image/x-icon,image/gif,image/webp,image/jpeg"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadFavicon(e.target.files[0])}
              />
            </div>
            <p className="text-xs text-slate-500">
              Accepted: PNG, SVG, ICO, GIF, WebP, JPEG &mdash; max 2 MiB.
              Recommended size: 32×32 px or 64×64 px.
            </p>
            <Field
              id="favicon_url"
              label="Or paste favicon URL"
              value={form.favicon_url}
              onChange={change("favicon_url")}
              placeholder="https://example.com/favicon.png"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Section 3: SEO ── */}
      <SectionCard icon={Search} title="SEO & Open Graph" color="emerald">
        <div className="space-y-4">
          <Field
            id="meta_keywords"
            label="Meta Keywords"
            value={form.meta_keywords}
            onChange={change("meta_keywords")}
            placeholder="pharma, medicine, WHO-GMP, pharmaceutical manufacturer"
            hint="Comma-separated keywords (minor SEO signal — keep concise)"
          />

          {/* OG Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Open Graph / Social Share Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {form.og_image_url && (
                <div className="flex-shrink-0 w-32 h-20 rounded-lg border border-emerald-200 bg-white overflow-hidden shadow-sm">
                  <img
                    src={form.og_image_url}
                    alt="OG preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => ogRef.current?.click()}
                  disabled={uploadingOg}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 transition shadow-sm"
                >
                  <Upload size={14} />
                  {uploadingOg ? "Uploading…" : "Upload OG Image"}
                </button>
                <input
                  ref={ogRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadOgImage(e.target.files[0])}
                />
                <Field
                  id="og_image_url"
                  label="Or paste OG image URL"
                  value={form.og_image_url}
                  onChange={change("og_image_url")}
                  placeholder="https://example.com/og-image.jpg"
                  hint="Recommended: 1200×630 px. Shown when link is shared on social media."
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

    </div>
  );
}
