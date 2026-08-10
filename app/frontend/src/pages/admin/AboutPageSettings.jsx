import React, { useRef } from "react";
import { Upload, Info, Heart, Award, ShieldCheck, Stethoscope, PhoneCall } from "lucide-react";
import api, { fileUrl } from "@/lib/api";
import PageSeoSection from "@/components/PageSeoSection";

const PRESET_BG_COLORS = [
  { name: "Pure White", value: "#FFFFFF" },
  { name: "Soft Sage", value: "#F8FAF4" },
  { name: "Mint Light", value: "#F4F9E8" },
  { name: "Sky Tint", value: "#F0F9FF" },
  { name: "Dark Slate", value: "#0F172A" },
];

export default function AboutPageSettings({ value = {}, onChange }) {
  const heroBgRef = useRef(null);
  const heroImgRef = useRef(null);
  const journeyBgRef = useRef(null);
  const journeyImgRef = useRef(null);
  const purposeBgRef = useRef(null);
  const qualityBgRef = useRef(null);
  const certBgRef = useRef(null);
  const certImgRef = useRef(null);
  const segmentBgRef = useRef(null);
  const expertiseBgRef = useRef(null);
  const ctaBgRef = useRef(null);

  const updateField = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  const handleFileUpload = async (file, targetField) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        updateField(targetField, res.data.url);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Info Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3 text-sky-800 text-sm">
        <Info className="w-5 h-5 shrink-0 text-sky-600 mt-0.5" />
        <div>
          <span className="font-semibold block text-sky-900">About Us Page Customization</span>
          Customize all 6 sections on the public <span className="font-semibold">/about</span> page. Every section supports custom background colors/gradients, background images, headings, and images.
        </div>
      </div>

      {/* ──────────────── 1. ABOUT HERO BANNER ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Info className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 1: About Hero Banner</h3>
        </div>

        {/* Section 1 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.about_hero_bg_color?.startsWith("#") ? value.about_hero_bg_color : "#F8FAF4"}
                  onChange={(e) => updateField("about_hero_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={value.about_hero_bg_color || ""}
                  onChange={(e) => updateField("about_hero_bg_color", e.target.value)}
                  placeholder="e.g. #F8FAF4"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("about_hero_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.about_hero_bg_image_url ? (
                    <img src={fileUrl(value.about_hero_bg_image_url)} alt="Hero BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={heroBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "about_hero_bg_image_url")}
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
                    value={value.about_hero_bg_image_url || ""}
                    onChange={(e) => updateField("about_hero_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Text Fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Overline Tag</label>
            <input
              type="text"
              value={value.about_hero_overline || ""}
              onChange={(e) => updateField("about_hero_overline", e.target.value)}
              placeholder="ABOUT US"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Title</label>
            <input
              type="text"
              value={value.about_hero_title || ""}
              onChange={(e) => updateField("about_hero_title", e.target.value)}
              placeholder="Driven by Science. Built on Trust..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle / Paragraph Description</label>
            <textarea
              rows={3}
              value={value.about_hero_subtitle || ""}
              onChange={(e) => updateField("about_hero_subtitle", e.target.value)}
              placeholder="With over 7 years of experience..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none resize-none"
            />
          </div>
        </div>

        {/* Products CTA Button */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Explore Products Button</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Button Text</label>
              <input
                type="text"
                value={value.about_hero_btn_text || ""}
                onChange={(e) => updateField("about_hero_btn_text", e.target.value)}
                placeholder="Explore Our Products"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Button Target Link</label>
              <input
                type="text"
                value={value.about_hero_btn_link || ""}
                onChange={(e) => updateField("about_hero_btn_link", e.target.value)}
                placeholder="/products"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3 Bottom Stat Cards */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Hero Bottom Stat Cards</h4>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-800">Stat Card 1</span>
              <input
                type="text"
                value={value.about_stat1_value || ""}
                onChange={(e) => updateField("about_stat1_value", e.target.value)}
                placeholder="7+"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold"
              />
              <input
                type="text"
                value={value.about_stat1_label || ""}
                onChange={(e) => updateField("about_stat1_label", e.target.value)}
                placeholder="Years of Excellence"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
              />
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-800">Stat Card 2</span>
              <input
                type="text"
                value={value.about_stat2_value || ""}
                onChange={(e) => updateField("about_stat2_value", e.target.value)}
                placeholder="200+"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold"
              />
              <input
                type="text"
                value={value.about_stat2_label || ""}
                onChange={(e) => updateField("about_stat2_label", e.target.value)}
                placeholder="Healthcare Partners"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
              />
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-800">Stat Card 3</span>
              <input
                type="text"
                value={value.about_stat3_value || ""}
                onChange={(e) => updateField("about_stat3_value", e.target.value)}
                placeholder="Pan-India"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold"
              />
              <input
                type="text"
                value={value.about_stat3_label || ""}
                onChange={(e) => updateField("about_stat3_label", e.target.value)}
                placeholder="Distribution Network"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Hero Right Main Image & Active Toggle */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">Right Side Main Image</label>
            <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={value.about_hero_image_active !== false}
                onChange={(e) => updateField("about_hero_image_active", e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-600 w-4 h-4"
              />
              <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${value.about_hero_image_active !== false ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                {value.about_hero_image_active !== false ? "Active" : "Inactive"}
              </span>
            </label>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-28 h-24 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {value.about_hero_image_url ? (
                <img src={fileUrl(value.about_hero_image_url)} alt="Hero Right Image" className="max-w-full max-h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-400">No Image</span>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <input
                ref={heroImgRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "about_hero_image_url")}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => heroImgRef.current?.click()}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Right Side Image
              </button>
              <input
                type="text"
                value={value.about_hero_image_url || ""}
                onChange={(e) => updateField("about_hero_image_url", e.target.value)}
                placeholder="Or paste image URL..."
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Hero Floating Pop-Up Badge Card & Active Toggle */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">Floating Pop-Up Badge Card</label>
            <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={value.about_hero_badge_active !== false}
                onChange={(e) => updateField("about_hero_badge_active", e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-600 w-4 h-4"
              />
              <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${value.about_hero_badge_active !== false ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                {value.about_hero_badge_active !== false ? "Active" : "Inactive"}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Pop-Up Badge Text</label>
            <input
              type="text"
              value={value.about_hero_badge_text || ""}
              onChange={(e) => updateField("about_hero_badge_text", e.target.value)}
              placeholder="WHO-GMP Certified"
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
            />
          </div>
        </div>
      </section>

      {/* ──────────────── 2. OUR JOURNEY SECTION ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 2: Our Journey & Story</h3>
        </div>

        {/* Section 2 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.about_journey_bg_color?.startsWith("#") ? value.about_journey_bg_color : "#FFFFFF"}
                  onChange={(e) => updateField("about_journey_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={value.about_journey_bg_color || ""}
                  onChange={(e) => updateField("about_journey_bg_color", e.target.value)}
                  placeholder="e.g. #FFFFFF"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("about_journey_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.about_journey_bg_image_url ? (
                    <img src={fileUrl(value.about_journey_bg_image_url)} alt="Journey BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={journeyBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "about_journey_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => journeyBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.about_journey_bg_image_url || ""}
                    onChange={(e) => updateField("about_journey_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Overline</label>
            <input
              type="text"
              value={value.about_journey_overline || ""}
              onChange={(e) => updateField("about_journey_overline", e.target.value)}
              placeholder="OUR STORY"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={value.about_journey_title || ""}
              onChange={(e) => updateField("about_journey_title", e.target.value)}
              placeholder="A Journey of Commitment and Growth"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Paragraph Description</label>
            <textarea
              rows={3}
              value={value.about_journey_body || ""}
              onChange={(e) => updateField("about_journey_body", e.target.value)}
              placeholder="From our beginnings to becoming a trusted name..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none resize-none"
            />
          </div>
        </div>

        {/* 4 Timeline Story Milestones */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Timeline Milestones (4 Steps)</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-lime-50/70 p-3 rounded-xl border border-lime-100 space-y-2">
              <span className="text-[11px] font-bold text-lime-800">Milestone 1</span>
              <input
                type="text"
                value={value.about_story_m1_year || ""}
                onChange={(e) => updateField("about_story_m1_year", e.target.value)}
                placeholder="2017"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold"
              />
              <input
                type="text"
                value={value.about_story_m1_title || ""}
                onChange={(e) => updateField("about_story_m1_title", e.target.value)}
                placeholder="The Beginning"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-semibold"
              />
              <textarea
                rows={3}
                value={value.about_story_m1_desc || ""}
                onChange={(e) => updateField("about_story_m1_desc", e.target.value)}
                placeholder="Wellicon Pharmaceuticals was founded..."
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs resize-none"
              />
            </div>

            <div className="bg-lime-50/70 p-3 rounded-xl border border-lime-100 space-y-2">
              <span className="text-[11px] font-bold text-lime-800">Milestone 2</span>
              <input
                type="text"
                value={value.about_story_m2_year || ""}
                onChange={(e) => updateField("about_story_m2_year", e.target.value)}
                placeholder="2019"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold"
              />
              <input
                type="text"
                value={value.about_story_m2_title || ""}
                onChange={(e) => updateField("about_story_m2_title", e.target.value)}
                placeholder="Expanding Horizons"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-semibold"
              />
              <textarea
                rows={3}
                value={value.about_story_m2_desc || ""}
                onChange={(e) => updateField("about_story_m2_desc", e.target.value)}
                placeholder="Strengthened our product portfolio..."
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs resize-none"
              />
            </div>

            <div className="bg-lime-50/70 p-3 rounded-xl border border-lime-100 space-y-2">
              <span className="text-[11px] font-bold text-lime-800">Milestone 3</span>
              <input
                type="text"
                value={value.about_story_m3_year || ""}
                onChange={(e) => updateField("about_story_m3_year", e.target.value)}
                placeholder="2022"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold"
              />
              <input
                type="text"
                value={value.about_story_m3_title || ""}
                onChange={(e) => updateField("about_story_m3_title", e.target.value)}
                placeholder="Strengthening Quality"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-semibold"
              />
              <textarea
                rows={3}
                value={value.about_story_m3_desc || ""}
                onChange={(e) => updateField("about_story_m3_desc", e.target.value)}
                placeholder="Achieved WHO-GMP certification..."
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs resize-none"
              />
            </div>

            <div className="bg-lime-50/70 p-3 rounded-xl border border-lime-100 space-y-2">
              <span className="text-[11px] font-bold text-lime-800">Milestone 4</span>
              <input
                type="text"
                value={value.about_story_m4_year || ""}
                onChange={(e) => updateField("about_story_m4_year", e.target.value)}
                placeholder="Today"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold"
              />
              <input
                type="text"
                value={value.about_story_m4_title || ""}
                onChange={(e) => updateField("about_story_m4_title", e.target.value)}
                placeholder="Growing Together"
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-semibold"
              />
              <textarea
                rows={3}
                value={value.about_story_m4_desc || ""}
                onChange={(e) => updateField("about_story_m4_desc", e.target.value)}
                placeholder="Continuously expanding our reach..."
                className="w-full rounded border border-slate-300 px-2 py-1 text-xs resize-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 3. OUR PURPOSE (MISSION & VISION) ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Heart className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 3: Our Purpose (Mission & Vision)</h3>
        </div>

        {/* Section 3 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.about_purpose_bg_color?.startsWith("#") ? value.about_purpose_bg_color : "#FFFFFF"}
                  onChange={(e) => updateField("about_purpose_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={value.about_purpose_bg_color || ""}
                  onChange={(e) => updateField("about_purpose_bg_color", e.target.value)}
                  placeholder="e.g. #FFFFFF"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("about_purpose_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.about_purpose_bg_image_url ? (
                    <img src={fileUrl(value.about_purpose_bg_image_url)} alt="Purpose BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={purposeBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "about_purpose_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => purposeBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.about_purpose_bg_image_url || ""}
                    onChange={(e) => updateField("about_purpose_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Section Header */}
        <div className="grid sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Overline</label>
            <input
              type="text"
              value={value.about_purpose_overline || ""}
              onChange={(e) => updateField("about_purpose_overline", e.target.value)}
              placeholder="OUR PURPOSE"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={value.about_purpose_title || ""}
              onChange={(e) => updateField("about_purpose_title", e.target.value)}
              placeholder="Our Mission and Vision"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none font-semibold"
            />
          </div>
        </div>

        {/* Mission & Vision Text Fields (matching mockup) */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-lime-50/50 p-4 rounded-xl border border-lime-100">
            <h4 className="text-sm font-bold text-lime-800 flex items-center gap-1.5">OUR MISSION Card</h4>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Mission Tag</label>
              <input
                type="text"
                value={value.about_mission_overline || ""}
                onChange={(e) => updateField("about_mission_overline", e.target.value)}
                placeholder="OUR MISSION"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-lime-700"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Mission Main Headline</label>
              <textarea
                rows={2}
                value={value.about_mission_title || ""}
                onChange={(e) => updateField("about_mission_title", e.target.value)}
                placeholder="To deliver innovative, affordable and trusted pharmaceutical..."
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Mission Description Paragraph</label>
              <textarea
                rows={3}
                value={value.about_mission_body || ""}
                onChange={(e) => updateField("about_mission_body", e.target.value)}
                placeholder="We are dedicated to combining innovation, research..."
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs resize-none"
              />
            </div>
          </div>

          <div className="space-y-3 bg-sky-50/50 p-4 rounded-xl border border-sky-100">
            <h4 className="text-sm font-bold text-sky-800 flex items-center gap-1.5">OUR VISION Card</h4>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Vision Tag</label>
              <input
                type="text"
                value={value.about_vision_overline || ""}
                onChange={(e) => updateField("about_vision_overline", e.target.value)}
                placeholder="OUR VISION"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-sky-700"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Vision Main Headline</label>
              <textarea
                rows={2}
                value={value.about_vision_title || ""}
                onChange={(e) => updateField("about_vision_title", e.target.value)}
                placeholder="To be recognised globally as a benchmark..."
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Vision Description Paragraph</label>
              <textarea
                rows={3}
                value={value.about_vision_body || ""}
                onChange={(e) => updateField("about_vision_body", e.target.value)}
                placeholder="We aim to empower healthcare professionals..."
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs resize-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 4. OUR PROMISE OF QUALITY AND CARE ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 4: Our Promise of Quality and Care</h3>
        </div>

        {/* Section 4 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.about_promise_bg_color?.startsWith("#") ? value.about_promise_bg_color : "#FFFFFF"}
                  onChange={(e) => updateField("about_promise_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={value.about_promise_bg_color || ""}
                  onChange={(e) => updateField("about_promise_bg_color", e.target.value)}
                  placeholder="e.g. #FFFFFF"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("about_promise_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.about_promise_bg_image_url ? (
                    <img src={fileUrl(value.about_promise_bg_image_url)} alt="Promise BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={qualityBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "about_promise_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => qualityBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.about_promise_bg_image_url || ""}
                    onChange={(e) => updateField("about_promise_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="grid sm:grid-cols-2 gap-4 border-b border-slate-100 pb-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Overline</label>
            <input
              type="text"
              value={value.about_promise_overline || ""}
              onChange={(e) => updateField("about_promise_overline", e.target.value)}
              placeholder="WHAT OUR CUSTOMERS CAN COUNT ON"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={value.about_promise_title || ""}
              onChange={(e) => updateField("about_promise_title", e.target.value)}
              placeholder="Our Promise of Quality and Care"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none font-semibold"
            />
          </div>
        </div>

        {/* 4 Promise Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-slate-100 pt-3">
          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Card 1 (Quality)</h4>
            <input
              type="text"
              value={value.about_promise_c1_title || ""}
              onChange={(e) => updateField("about_promise_c1_title", e.target.value)}
              placeholder="Quality"
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
            />
            <textarea
              rows={3}
              value={value.about_promise_c1_desc || ""}
              onChange={(e) => updateField("about_promise_c1_desc", e.target.value)}
              placeholder="Consistent quality standards..."
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs resize-none"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Card 2 (Affordability)</h4>
            <input
              type="text"
              value={value.about_promise_c2_title || ""}
              onChange={(e) => updateField("about_promise_c2_title", e.target.value)}
              placeholder="Affordability"
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
            />
            <textarea
              rows={3}
              value={value.about_promise_c2_desc || ""}
              onChange={(e) => updateField("about_promise_c2_desc", e.target.value)}
              placeholder="Cost-effective products..."
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs resize-none"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Card 3 (Innovation)</h4>
            <input
              type="text"
              value={value.about_promise_c3_title || ""}
              onChange={(e) => updateField("about_promise_c3_title", e.target.value)}
              placeholder="Innovation"
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
            />
            <textarea
              rows={3}
              value={value.about_promise_c3_desc || ""}
              onChange={(e) => updateField("about_promise_c3_desc", e.target.value)}
              placeholder="Continuous improvement..."
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs resize-none"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Card 4 (Trust)</h4>
            <input
              type="text"
              value={value.about_promise_c4_title || ""}
              onChange={(e) => updateField("about_promise_c4_title", e.target.value)}
              placeholder="Trust"
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
            />
            <textarea
              rows={3}
              value={value.about_promise_c4_desc || ""}
              onChange={(e) => updateField("about_promise_c4_desc", e.target.value)}
              placeholder="Built strong relationships..."
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs resize-none"
            />
          </div>
        </div>
      </section>

      {/* ──────────────── 5. CERTICATIONS (CERTIFIED FOR YOUR SAFETY) ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 5: Certifications & Registration</h3>
        </div>

        {/* Section 5 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.about_cert_bg_color?.startsWith("#") ? value.about_cert_bg_color : "#FFFFFF"}
                  onChange={(e) => updateField("about_cert_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={value.about_cert_bg_color || ""}
                  onChange={(e) => updateField("about_cert_bg_color", e.target.value)}
                  placeholder="e.g. #FFFFFF"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("about_cert_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.about_cert_bg_image_url ? (
                    <img src={fileUrl(value.about_cert_bg_image_url)} alt="Cert BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={certBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "about_cert_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => certBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.about_cert_bg_image_url || ""}
                    onChange={(e) => updateField("about_cert_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Overline</label>
            <input
              type="text"
              value={value.about_cert_overline || ""}
              onChange={(e) => updateField("about_cert_overline", e.target.value)}
              placeholder="QUALITY THAT YOU CAN TRUST"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={value.about_cert_title || ""}
              onChange={(e) => updateField("about_cert_title", e.target.value)}
              placeholder="Certified for Your Safety and Well-being"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Paragraph Subtitle</label>
            <textarea
              rows={2}
              value={value.about_cert_subtitle || ""}
              onChange={(e) => updateField("about_cert_subtitle", e.target.value)}
              placeholder="Our global certifications ensure that every product..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none resize-none"
            />
          </div>
        </div>

        {/* Certificate Image Upload */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <label className="block text-sm font-medium text-slate-700">Right Certificate Document Image</label>
          <div className="flex gap-4 items-start">
            <div className="w-24 h-28 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {value.about_cert_image_url ? (
                <img src={fileUrl(value.about_cert_image_url)} alt="Cert Doc" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-xs text-slate-400">No Image</span>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <input
                ref={certImgRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "about_cert_image_url")}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => certImgRef.current?.click()}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Certificate Image
              </button>
              <input
                type="text"
                value={value.about_cert_image_url || ""}
                onChange={(e) => updateField("about_cert_image_url", e.target.value)}
                placeholder="Or paste image URL..."
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 6. THERAPEUTIC EXPERTISE ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Stethoscope className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 6: Therapeutic Expertise</h3>
        </div>

        {/* Section 6 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.about_segment_bg_color?.startsWith("#") ? value.about_segment_bg_color : "#F8FAF4"}
                  onChange={(e) => updateField("about_segment_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={value.about_segment_bg_color || ""}
                  onChange={(e) => updateField("about_segment_bg_color", e.target.value)}
                  placeholder="e.g. #F8FAF4"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("about_segment_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.about_segment_bg_image_url ? (
                    <img src={fileUrl(value.about_segment_bg_image_url)} alt="Segment BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={segmentBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "about_segment_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => segmentBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.about_segment_bg_image_url || ""}
                    onChange={(e) => updateField("about_segment_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Overline</label>
            <input
              type="text"
              value={value.about_segment_overline || ""}
              onChange={(e) => updateField("about_segment_overline", e.target.value)}
              placeholder="THERAPEUTIC EXPERTISE"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={value.about_segment_title || ""}
              onChange={(e) => updateField("about_segment_title", e.target.value)}
              placeholder="Wide Range of Therapeutic Segments"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none font-semibold"
            />
          </div>
        </div>
      </section>

      {/* ──────────────── 6. GET IN TOUCH CTA ──────────────── */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <PhoneCall className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900 text-lg">Section 6: Get In Touch CTA Banner</h3>
        </div>

        {/* Section 6 Background Customization */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Background Customization</h4>
            <span className="text-[11px] text-slate-500">Color & Background Image</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Color / Gradient</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={value.about_cta_bg_color?.startsWith("#") ? value.about_cta_bg_color : "#0F172A"}
                  onChange={(e) => updateField("about_cta_bg_color", e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={value.about_cta_bg_color || ""}
                  onChange={(e) => updateField("about_cta_bg_color", e.target.value)}
                  placeholder="e.g. #0F172A"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BG_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateField("about_cta_bg_color", preset.value)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-1 bg-white"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ background: preset.value }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Background Image</label>
              <div className="flex items-start gap-3">
                <div className="w-20 h-14 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                  {value.about_cta_bg_image_url ? (
                    <img src={fileUrl(value.about_cta_bg_image_url)} alt="CTA BG" className="max-w-full max-h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No BG Image</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={ctaBgRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "about_cta_bg_image_url")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => ctaBgRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Background Image
                  </button>
                  <input
                    type="text"
                    value={value.about_cta_bg_image_url || ""}
                    onChange={(e) => updateField("about_cta_bg_image_url", e.target.value)}
                    placeholder="Or paste background image URL..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner Content */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">CTA Banner Headline</label>
            <input
              type="text"
              value={value.about_cta_title || ""}
              onChange={(e) => updateField("about_cta_title", e.target.value)}
              placeholder="Building Better Health, Together."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">CTA Subtitle / Paragraph Copy</label>
            <textarea
              rows={2}
              value={value.about_cta_subtitle || ""}
              onChange={(e) => updateField("about_cta_subtitle", e.target.value)}
              placeholder="From quality formulations to trusted partnerships, our journey continues..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none resize-none"
            />
          </div>

          {/* Button 1: Primary Action (White Pill) */}
          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Button 1 (Explore Products - White Pill)</h4>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Text</label>
              <input
                type="text"
                value={value.about_cta_btn1_text || ""}
                onChange={(e) => updateField("about_cta_btn1_text", e.target.value)}
                placeholder="Explore Our Products"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Link URL</label>
              <input
                type="text"
                value={value.about_cta_btn1_link || ""}
                onChange={(e) => updateField("about_cta_btn1_link", e.target.value)}
                placeholder="/products"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>

          {/* Button 2: Secondary Action (Outline Pill) */}
          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Button 2 (Get in Touch - Outline Pill)</h4>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Text</label>
              <input
                type="text"
                value={value.about_cta_btn_text || ""}
                onChange={(e) => updateField("about_cta_btn_text", e.target.value)}
                placeholder="Get in Touch"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Link URL</label>
              <input
                type="text"
                value={value.about_cta_btn_link || ""}
                onChange={(e) => updateField("about_cta_btn_link", e.target.value)}
                placeholder="/contact"
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── PAGE SEO SETTINGS ──────────────── */}
      <PageSeoSection
        pageName="About Us Page"
        pageUrl="https://welliconpharma.com/about"
        titleValue={value.seo_about_title}
        descriptionValue={value.seo_about_description}
        keywordsValue={value.seo_about_keywords}
        onTitleChange={(e) => updateField("seo_about_title", e.target.value)}
        onDescriptionChange={(e) => updateField("seo_about_description", e.target.value)}
        onKeywordsChange={(e) => updateField("seo_about_keywords", e.target.value)}
      />
    </div>
  );
}
