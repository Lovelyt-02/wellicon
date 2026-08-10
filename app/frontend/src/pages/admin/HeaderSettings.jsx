import React, { useRef } from "react";
import { Upload, Image as ImageIcon, Link as LinkIcon, Palette, Phone } from "lucide-react";
import { fileUrl } from "@/lib/api";

const PRESET_BG_COLORS = [
  { name: "Default Olive", value: "linear-gradient(135deg, #A7D614 0%, #7FA60F 100%)" },
  { name: "Solid Green", value: "#7FA60F" },
  { name: "Sky Blue", value: "#0284C7" },
  { name: "Emerald", value: "#059669" },
  { name: "Indigo", value: "#4F46E5" },
  { name: "Crimson", value: "#DC2626" },
  { name: "Dark Slate", value: "#1E293B" },
];

const PRESET_TEXT_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Dark Slate", value: "#1E293B" },
  { name: "Gold", value: "#F59E0B" },
  { name: "Lime Light", value: "#F7FEE7" },
];

export default function HeaderSettings({ value = {}, onChange, onUpload }) {
  const logoInputRef = useRef(null);

  const updateField = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file, "logo_url");
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Header Preview */}
      <section className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Header Preview
          </div>
          <span className="text-xs text-slate-400">Updates as you edit below</span>
        </div>

        <div className="bg-[#F8FAF4] text-[#1E293B] rounded-lg p-4 flex items-center justify-between border border-slate-200 overflow-x-auto">
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-center overflow-hidden">
              {value.logo_url ? (
                <img src={fileUrl(value.logo_url)} alt="Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <img src="/logo.png" alt="Logo" className="max-w-full max-h-full object-contain" />
              )}
            </div>
            <div>
              <div className="font-display font-bold text-base text-[#1E293B]">
                {value.company_name || "Wellicon Pharma"}
              </div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#7FA60F] font-semibold">
                {value.brand_motto || "WAY TO HEALTHINESS"}
              </div>
            </div>
          </div>

          {/* Navigation Preview */}
          <div className="hidden sm:flex items-center gap-5 text-xs font-medium text-[#475569]">
            <span className="text-[#7FA60F] font-semibold">{value.nav_home || "Home"}</span>
            <span>{value.nav_about || "About"}</span>
            <span>{value.nav_products || "Products"}</span>
            <span>{value.nav_contact || "Contact"}</span>
          </div>

          {/* CTA Button Preview */}
          <div className="shrink-0">
            <div
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all shadow-sm"
              style={{
                background: value.header_cta_bg_color || "linear-gradient(135deg, #A7D614 0%, #7FA60F 100%)",
                color: value.header_cta_text_color || "#FFFFFF",
              }}
            >
              <Phone className="w-3.5 h-3.5" />
              {value.header_cta || "Get in touch"}
            </div>
          </div>
        </div>
      </section>

      {/* 1. Logo & Branding */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ImageIcon className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900">Company Logo & Branding</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Logo</label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-2 overflow-hidden shrink-0">
                {value.logo_url ? (
                  <img src={fileUrl(value.logo_url)} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                  <img src="/logo.png" alt="Default Logo" className="max-w-full max-h-full object-contain opacity-70" />
                )}
              </div>
              <div className="space-y-3 flex-1">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-md text-sm font-medium transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </button>
                <p className="text-xs text-slate-500">PNG, SVG or WEBP recommended. Transparent background works best.</p>
                <input
                  type="text"
                  value={value.logo_url || ""}
                  onChange={(e) => updateField("logo_url", e.target.value)}
                  placeholder="Or paste Logo Image URL..."
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Company Name & Tagline */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={value.company_name || ""}
                onChange={(e) => updateField("company_name", e.target.value)}
                placeholder="e.g. Wellicon Pharma"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Tagline / Brand Motto</label>
              <input
                type="text"
                value={value.brand_motto || ""}
                onChange={(e) => updateField("brand_motto", e.target.value)}
                placeholder="e.g. WAY TO HEALTHINESS"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Navigation Links */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <LinkIcon className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900">Header Navigation Links</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Home Link Text</label>
            <input
              type="text"
              value={value.nav_home || ""}
              onChange={(e) => updateField("nav_home", e.target.value)}
              placeholder="Home"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">About Us Link Text</label>
            <input
              type="text"
              value={value.nav_about || ""}
              onChange={(e) => updateField("nav_about", e.target.value)}
              placeholder="About"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Products Link Text</label>
            <input
              type="text"
              value={value.nav_products || ""}
              onChange={(e) => updateField("nav_products", e.target.value)}
              placeholder="Products"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Us Link Text</label>
            <input
              type="text"
              value={value.nav_contact || ""}
              onChange={(e) => updateField("nav_contact", e.target.value)}
              placeholder="Contact"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>
        </div>
      </section>

      {/* 3. Header Action Button (CTA) */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Palette className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900">Header Action Button (CTA)</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
            <input
              type="text"
              value={value.header_cta || ""}
              onChange={(e) => updateField("header_cta", e.target.value)}
              placeholder="Get in touch"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Button Redirect URL / Target</label>
            <input
              type="text"
              value={value.header_cta_url || ""}
              onChange={(e) => updateField("header_cta_url", e.target.value)}
              placeholder="/contact"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>
        </div>

        {/* Color Customization */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800">Button Colors</h4>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Background Color */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-700">Button Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.header_cta_bg_color?.startsWith("#") ? value.header_cta_bg_color : "#7FA60F"}
                  onChange={(e) => updateField("header_cta_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={value.header_cta_bg_color || ""}
                  onChange={(e) => updateField("header_cta_bg_color", e.target.value)}
                  placeholder="e.g. #7FA60F or linear-gradient(...)"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
                />
              </div>

              {/* Preset BG color pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("header_cta_bg_color", preset.value)}
                    className="px-2.5 py-1 rounded text-[11px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1.5"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300"
                      style={{ background: preset.value }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-700">Button Text Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.header_cta_text_color?.startsWith("#") ? value.header_cta_text_color : "#FFFFFF"}
                  onChange={(e) => updateField("header_cta_text_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={value.header_cta_text_color || ""}
                  onChange={(e) => updateField("header_cta_text_color", e.target.value)}
                  placeholder="e.g. #FFFFFF"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
                />
              </div>

              {/* Preset Text color pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_TEXT_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("header_cta_text_color", preset.value)}
                    className="px-2.5 py-1 rounded text-[11px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1.5"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300"
                      style={{ background: preset.value }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
