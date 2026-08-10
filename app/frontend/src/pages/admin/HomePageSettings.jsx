import React, { useRef } from "react";
import { Upload, Image as ImageIcon, Palette, Sparkles, Layout, ShieldCheck, Award } from "lucide-react";
import { fileUrl } from "@/lib/api";
import PageSeoSection from "@/components/PageSeoSection";

const PRESET_BG_COLORS = [
  { name: "Pure White", value: "#FFFFFF" },
  { name: "Soft Sage", value: "#F8FAF4" },
  { name: "Mint Light", value: "#ECFDF5" },
  { name: "Sky Tint", value: "#F0F9FF" },
  { name: "Dark Slate", value: "#0F172A" },
  { name: "Gradient Hero", value: "linear-gradient(135deg, #F8FAF4 0%, #EEF7D0 100%)" },
];

export default function HomePageSettings({ value = {}, onChange, onUpload }) {
  const heroImgRef = useRef(null);
  const heroBgRef = useRef(null);
  const portfolioBgRef = useRef(null);
  const featuredBgRef = useRef(null);
  const featuredImgRef = useRef(null);
  const trustBgRef = useRef(null);
  const aboutImgRef = useRef(null);
  const aboutBgRef = useRef(null);

  const updateField = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const handleFileUpload = (file, key) => {
    if (file && onUpload) {
      onUpload(file, key);
    }
  };

  return (
    <div className="space-y-8" data-testid="admin-home-settings">
      <div>
        <h2 className="text-2xl font-display font-semibold text-slate-900">Home Page Section Management</h2>
        <p className="text-sm text-slate-500 mt-1">
          Customize all 5 home page sections, text content, media images, background colors, and background images.
        </p>
      </div>

      {/* ──────────────── 1. HERO SECTION ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 1: Hero Banner</h3>
        </div>

        {/* Hero Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Section 1 (Hero) Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Background Color */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.hero_bg_color?.startsWith("#") ? value.hero_bg_color : "#F8FAF4"}
                  onChange={(e) => updateField("hero_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={value.hero_bg_color || ""}
                  onChange={(e) => updateField("hero_bg_color", e.target.value)}
                  placeholder="e.g. #F8FAF4 or linear-gradient(...)"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("hero_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Image */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Hero Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.hero_bg_image_url ? (
                    <img src={fileUrl(value.hero_bg_image_url)} alt="Hero BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={heroBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "hero_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => heroBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.hero_bg_image_url || ""}
                    onChange={(e) => updateField("hero_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hero Overline</label>
            <input
              type="text"
              value={value.hero_overline || ""}
              onChange={(e) => updateField("hero_overline", e.target.value)}
              placeholder="PHARMACEUTICAL EXCELLENCE"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hero Main Title</label>
            <input
              type="text"
              value={value.hero_title || ""}
              onChange={(e) => updateField("hero_title", e.target.value)}
              placeholder="Caring Health, Curing Lives"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none font-semibold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
            <textarea
              rows={2}
              value={value.hero_subtitle || ""}
              onChange={(e) => updateField("hero_subtitle", e.target.value)}
              placeholder="Wellicon Pharmaceuticals — innovating quality medicines for a healthier tomorrow."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Primary CTA Button Label</label>
            <input
              type="text"
              value={value.hero_cta_primary || ""}
              onChange={(e) => updateField("hero_cta_primary", e.target.value)}
              placeholder="Explore products"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Secondary CTA Button Label</label>
            <input
              type="text"
              value={value.hero_cta_secondary || ""}
              onChange={(e) => updateField("hero_cta_secondary", e.target.value)}
              placeholder="About us"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>
        </div>

        {/* Hero Image & Badge */}
        <div className="grid md:grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Hero Main Image</label>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={value.hero_image_active !== false}
                  onChange={(e) => updateField("hero_image_active", e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-600 w-4 h-4"
                />
                <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${value.hero_image_active !== false ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {value.hero_image_active !== false ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-24 h-28 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                {value.hero_image_url ? (
                  <img src={fileUrl(value.hero_image_url)} alt="Hero" className="max-w-full max-h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400">No Image</span>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <input
                  ref={heroImgRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "hero_image_url")}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => heroImgRef.current?.click()}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Image
                </button>
                <input
                  type="text"
                  value={value.hero_image_url || ""}
                  onChange={(e) => updateField("hero_image_url", e.target.value)}
                  placeholder="Or paste image URL..."
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Image Floating Badge</h4>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={value.hero_badge_active !== false}
                  onChange={(e) => updateField("hero_badge_active", e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-600 w-4 h-4"
                />
                <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${value.hero_badge_active !== false ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {value.hero_badge_active !== false ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Badge Label</label>
                <input
                  type="text"
                  value={value.hero_badge_label || ""}
                  onChange={(e) => updateField("hero_badge_label", e.target.value)}
                  placeholder="Quality Assured"
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Badge Value</label>
                <input
                  type="text"
                  value={value.hero_badge_value || ""}
                  onChange={(e) => updateField("hero_badge_value", e.target.value)}
                  placeholder="ISO 9001:2015"
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Hero Section 3 Key Stats</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg">
              <input
                type="text"
                value={value.hero_stat1_value || ""}
                onChange={(e) => updateField("hero_stat1_value", e.target.value)}
                placeholder="Stat 1 Value (e.g. 200+)"
                className="w-full rounded border border-slate-300 px-2.5 py-1 text-xs font-bold"
              />
              <input
                type="text"
                value={value.hero_stat1_label || ""}
                onChange={(e) => updateField("hero_stat1_label", e.target.value)}
                placeholder="Stat 1 Label (e.g. Formulations)"
                className="w-full rounded border border-slate-300 px-2.5 py-1 text-xs"
              />
            </div>

            <div className="space-y-2 bg-slate-50 p-3 rounded-lg">
              <input
                type="text"
                value={value.hero_stat2_value || ""}
                onChange={(e) => updateField("hero_stat2_value", e.target.value)}
                placeholder="Stat 2 Value (e.g. WHO-GMP)"
                className="w-full rounded border border-slate-300 px-2.5 py-1 text-xs font-bold"
              />
              <input
                type="text"
                value={value.hero_stat2_label || ""}
                onChange={(e) => updateField("hero_stat2_label", e.target.value)}
                placeholder="Stat 2 Label (e.g. Certified)"
                className="w-full rounded border border-slate-300 px-2.5 py-1 text-xs"
              />
            </div>

            <div className="space-y-2 bg-slate-50 p-3 rounded-lg">
              <input
                type="text"
                value={value.hero_stat3_value || ""}
                onChange={(e) => updateField("hero_stat3_value", e.target.value)}
                placeholder="Stat 3 Value (e.g. 15+)"
                className="w-full rounded border border-slate-300 px-2.5 py-1 text-xs font-bold"
              />
              <input
                type="text"
                value={value.hero_stat3_label || ""}
                onChange={(e) => updateField("hero_stat3_label", e.target.value)}
                placeholder="Stat 3 Label (e.g. Years)"
                className="w-full rounded border border-slate-300 px-2.5 py-1 text-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 2. PORTFOLIO / CATEGORIES SECTION ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layout className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 2: Therapeutic Portfolio / Categories</h3>
        </div>

        {/* Section 2 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Section 2 Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Background Color */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Section 2 Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.home_portfolio_bg_color?.startsWith("#") ? value.home_portfolio_bg_color : "#FFFFFF"}
                  onChange={(e) => updateField("home_portfolio_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={value.home_portfolio_bg_color || ""}
                  onChange={(e) => updateField("home_portfolio_bg_color", e.target.value)}
                  placeholder="e.g. #FFFFFF, #F8FAF4, or linear-gradient(...)"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("home_portfolio_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Image */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Section 2 Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.home_portfolio_bg_image_url ? (
                    <img src={fileUrl(value.home_portfolio_bg_image_url)} alt="Section 2 BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={portfolioBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "home_portfolio_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => portfolioBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.home_portfolio_bg_image_url || ""}
                    onChange={(e) => updateField("home_portfolio_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio Overline</label>
            <input
              type="text"
              value={value.home_portfolio_overline || ""}
              onChange={(e) => updateField("home_portfolio_overline", e.target.value)}
              placeholder="OUR PORTFOLIO"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio Title</label>
            <input
              type="text"
              value={value.home_portfolio_title || ""}
              onChange={(e) => updateField("home_portfolio_title", e.target.value)}
              placeholder="Therapeutic divisions"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">View All Link Text</label>
            <input
              type="text"
              value={value.home_portfolio_link || ""}
              onChange={(e) => updateField("home_portfolio_link", e.target.value)}
              placeholder="View all products →"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
      </section>

      {/* ──────────────── 3. FEATURED PRODUCTS SECTION ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ImageIcon className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 3: Featured Products Range</h3>
        </div>

        {/* Section 3 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Section 3 Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Background Color */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Section 3 Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.home_featured_bg_color?.startsWith("#") ? value.home_featured_bg_color : "#FFFFFF"}
                  onChange={(e) => updateField("home_featured_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={value.home_featured_bg_color || ""}
                  onChange={(e) => updateField("home_featured_bg_color", e.target.value)}
                  placeholder="e.g. #FFFFFF or linear-gradient(...)"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("home_featured_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Image */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Section 3 Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.home_featured_bg_image_url ? (
                    <img src={fileUrl(value.home_featured_bg_image_url)} alt="Section 3 BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={featuredBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "home_featured_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => featuredBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.home_featured_bg_image_url || ""}
                    onChange={(e) => updateField("home_featured_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Featured Overline</label>
            <input
              type="text"
              value={value.home_featured_overline || ""}
              onChange={(e) => updateField("home_featured_overline", e.target.value)}
              placeholder="FEATURED RANGE"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Featured Title</label>
            <input
              type="text"
              value={value.home_featured_title || ""}
              onChange={(e) => updateField("home_featured_title", e.target.value)}
              placeholder="Trusted formulations"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Featured Subtitle / Description</label>
            <textarea
              rows={2}
              value={value.home_featured_subtitle || ""}
              onChange={(e) => updateField("home_featured_subtitle", e.target.value)}
              placeholder="Scientific excellence and advanced manufacturing come together..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none resize-none"
            />
          </div>
        </div>

        {/* Section 3 Graphic / Header Side Image */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">Section 3 Top-Right Graphic / Side Image</label>
            <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={value.home_featured_image_active !== false}
                onChange={(e) => updateField("home_featured_image_active", e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-600 w-4 h-4"
              />
              <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${value.home_featured_image_active !== false ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                {value.home_featured_image_active !== false ? "Active" : "Inactive"}
              </span>
            </label>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-28 h-28 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {value.home_featured_image_url ? (
                <img src={fileUrl(value.home_featured_image_url)} alt="Featured Graphic" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-xs text-slate-400">No Image</span>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <input
                ref={featuredImgRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "home_featured_image_url")}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => featuredImgRef.current?.click()}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Side Graphic Image
              </button>
              <input
                type="text"
                value={value.home_featured_image_url || ""}
                onChange={(e) => updateField("home_featured_image_url", e.target.value)}
                placeholder="Or paste graphic URL..."
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3 Product Cards Colors Customization */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Section 3 Product Cards Styling</h4>
            <span className="text-[11px] text-slate-500">Image Container & Text Area BG Colors</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Card Image Area BG */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Product Card Image Container BG Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.home_featured_card_img_bg_color?.startsWith("#") ? value.home_featured_card_img_bg_color : "#F1F5F9"}
                  onChange={(e) => updateField("home_featured_card_img_bg_color", e.target.value)}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={value.home_featured_card_img_bg_color || ""}
                  onChange={(e) => updateField("home_featured_card_img_bg_color", e.target.value)}
                  placeholder="e.g. #F1F5F9"
                  className="flex-1 rounded border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
              </div>
            </div>

            {/* Card Text Area BG */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Product Card Text Details Area BG Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.home_featured_card_text_bg_color?.startsWith("#") ? value.home_featured_card_text_bg_color : "#FFFFFF"}
                  onChange={(e) => updateField("home_featured_card_text_bg_color", e.target.value)}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={value.home_featured_card_text_bg_color || ""}
                  onChange={(e) => updateField("home_featured_card_text_bg_color", e.target.value)}
                  placeholder="e.g. #FFFFFF"
                  className="flex-1 rounded border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 Action Button Controls */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Section 3 Action Button</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Button Text</label>
              <input
                type="text"
                value={value.home_featured_cta_btn_text || ""}
                onChange={(e) => updateField("home_featured_cta_btn_text", e.target.value)}
                placeholder="View All Products"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Button Target Link</label>
              <input
                type="text"
                value={value.home_featured_cta_btn_link || ""}
                onChange={(e) => updateField("home_featured_cta_btn_link", e.target.value)}
                placeholder="/products"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 4. TRUST & QUALITY SECTION ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 4: Trust & Quality Cards</h3>
        </div>

        {/* Section 4 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Section 4 Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Background Color */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Section 4 Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.trust_bg_color?.startsWith("#") ? value.trust_bg_color : "#0F172A"}
                  onChange={(e) => updateField("trust_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={value.trust_bg_color || ""}
                  onChange={(e) => updateField("trust_bg_color", e.target.value)}
                  placeholder="e.g. #0F172A or linear-gradient(...)"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("trust_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Image */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Section 4 Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.trust_bg_image_url ? (
                    <img src={fileUrl(value.trust_bg_image_url)} alt="Section 4 BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={trustBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "trust_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => trustBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.trust_bg_image_url || ""}
                    onChange={(e) => updateField("trust_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Card 1</h4>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Card 1 Title</label>
              <input
                type="text"
                value={value.trust1_title || ""}
                onChange={(e) => updateField("trust1_title", e.target.value)}
                placeholder="R&D Driven"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Card 1 Description</label>
              <textarea
                rows={3}
                value={value.trust1_body || ""}
                onChange={(e) => updateField("trust1_body", e.target.value)}
                placeholder="In-house formulation..."
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs resize-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Card 2</h4>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Card 2 Title</label>
              <input
                type="text"
                value={value.trust2_title || ""}
                onChange={(e) => updateField("trust2_title", e.target.value)}
                placeholder="Quality First"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Card 2 Description</label>
              <textarea
                rows={3}
                value={value.trust2_body || ""}
                onChange={(e) => updateField("trust2_body", e.target.value)}
                placeholder="WHO-GMP compliant..."
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs resize-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Card 3</h4>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Card 3 Title</label>
              <input
                type="text"
                value={value.trust3_title || ""}
                onChange={(e) => updateField("trust3_title", e.target.value)}
                placeholder="Patient Focused"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Card 3 Description</label>
              <textarea
                rows={3}
                value={value.trust3_body || ""}
                onChange={(e) => updateField("trust3_body", e.target.value)}
                placeholder="Affordable medicines..."
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs resize-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 5. ABOUT TEASER SECTION ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 5: About Us Teaser</h3>
        </div>

        {/* Section 5 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Section 5 Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Background Color */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Section 5 Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.home_about_bg_color?.startsWith("#") ? value.home_about_bg_color : "#FFFFFF"}
                  onChange={(e) => updateField("home_about_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={value.home_about_bg_color || ""}
                  onChange={(e) => updateField("home_about_bg_color", e.target.value)}
                  placeholder="e.g. #FFFFFF or linear-gradient(...)"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("home_about_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Image */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Section 5 Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.home_about_bg_image_url ? (
                    <img src={fileUrl(value.home_about_bg_image_url)} alt="Section 5 BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={aboutBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "home_about_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => aboutBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.home_about_bg_image_url || ""}
                    onChange={(e) => updateField("home_about_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Overline</label>
            <input
              type="text"
              value={value.home_about_overline || ""}
              onChange={(e) => updateField("home_about_overline", e.target.value)}
              placeholder="WHO WE ARE"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={value.about_title || ""}
              onChange={(e) => updateField("about_title", e.target.value)}
              placeholder="About Wellicon Pharma"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none font-semibold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">About Body Copy</label>
            <textarea
              rows={4}
              value={value.about_body || ""}
              onChange={(e) => updateField("about_body", e.target.value)}
              placeholder="Founded with a single purpose..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Read More Link Text</label>
            <input
              type="text"
              value={value.home_about_link || ""}
              onChange={(e) => updateField("home_about_link", e.target.value)}
              placeholder="Read more about us"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        {/* About Image & Stats */}
        <div className="grid md:grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">About Teaser Image</label>
            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                {value.about_image_url ? (
                  <img src={fileUrl(value.about_image_url)} alt="About" className="max-w-full max-h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400">No Image</span>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <input
                  ref={aboutImgRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "about_image_url")}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => aboutImgRef.current?.click()}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Image
                </button>
                <input
                  type="text"
                  value={value.about_image_url || ""}
                  onChange={(e) => updateField("about_image_url", e.target.value)}
                  placeholder="Or paste image URL..."
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Side Stats Cards & Colors</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-sky-50 p-3 rounded-lg space-y-2">
                <span className="text-[11px] font-bold text-slate-800">Quality Stat Card</span>
                <input
                  type="text"
                  value={value.home_quality_stat_value || ""}
                  onChange={(e) => updateField("home_quality_stat_value", e.target.value)}
                  placeholder="98%"
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold"
                />
                <input
                  type="text"
                  value={value.home_quality_stat_label || ""}
                  onChange={(e) => updateField("home_quality_stat_label", e.target.value)}
                  placeholder="Quality Score"
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                />
                <div>
                  <label className="block text-[10px] text-slate-600 mb-1 font-medium">Card 1 BG Color</label>
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="color"
                      value={value.home_about_card1_bg_color?.startsWith("#") ? value.home_about_card1_bg_color : "#F4F9E8"}
                      onChange={(e) => updateField("home_about_card1_bg_color", e.target.value)}
                      className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={value.home_about_card1_bg_color || ""}
                      onChange={(e) => updateField("home_about_card1_bg_color", e.target.value)}
                      placeholder="e.g. #F4F9E8"
                      className="flex-1 rounded border border-slate-300 px-2 py-1 text-[11px] bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 p-3 rounded-lg space-y-2">
                <span className="text-[11px] font-bold text-slate-800">Therapy Stat Card</span>
                <input
                  type="text"
                  value={value.home_therapy_stat_value || ""}
                  onChange={(e) => updateField("home_therapy_stat_value", e.target.value)}
                  placeholder="12+"
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold"
                />
                <input
                  type="text"
                  value={value.home_therapy_stat_label || ""}
                  onChange={(e) => updateField("home_therapy_stat_label", e.target.value)}
                  placeholder="Therapy Areas"
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                />
                <div>
                  <label className="block text-[10px] text-slate-600 mb-1 font-medium">Card 2 BG Color</label>
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="color"
                      value={value.home_about_card2_bg_color?.startsWith("#") ? value.home_about_card2_bg_color : "#F4F9E8"}
                      onChange={(e) => updateField("home_about_card2_bg_color", e.target.value)}
                      className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={value.home_about_card2_bg_color || ""}
                      onChange={(e) => updateField("home_about_card2_bg_color", e.target.value)}
                      placeholder="e.g. #F4F9E8"
                      className="flex-1 rounded border border-slate-300 px-2 py-1 text-[11px] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── PAGE SEO SETTINGS ──────────────── */}
      <PageSeoSection
        pageName="Home Page"
        pageUrl="https://welliconpharma.com"
        titleValue={value.seo_home_title}
        descriptionValue={value.seo_home_description}
        keywordsValue={value.seo_home_keywords}
        onTitleChange={(e) => updateField("seo_home_title", e.target.value)}
        onDescriptionChange={(e) => updateField("seo_home_description", e.target.value)}
        onKeywordsChange={(e) => updateField("seo_home_keywords", e.target.value)}
      />
    </div>
  );
}
