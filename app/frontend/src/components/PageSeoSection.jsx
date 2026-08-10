import React from "react";
import { Search, Globe, Sparkles } from "lucide-react";

export default function PageSeoSection({
  pageName = "Page",
  pageUrl = "https://welliconpharma.com",
  titleValue = "",
  descriptionValue = "",
  keywordsValue = "",
  onTitleChange,
  onDescriptionChange,
  onKeywordsChange,
}) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Search className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">{pageName} SEO & Meta Tags</h3>
            <p className="text-xs text-slate-500">
              Optimize search engine visibility, meta titles, descriptions, and keywords for search results.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> SEO Optimized
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Inputs Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meta Title Tag <span className="text-slate-400 font-normal">({titleValue?.length || 0}/60 chars)</span>
            </label>
            <input
              type="text"
              value={titleValue || ""}
              onChange={onTitleChange}
              placeholder={`e.g. ${pageName} | Wellicon Pharmaceuticals`}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">Recommended length: 50–60 characters.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meta Description Tag <span className="text-slate-400 font-normal">({descriptionValue?.length || 0}/160 chars)</span>
            </label>
            <textarea
              rows={3}
              value={descriptionValue || ""}
              onChange={onDescriptionChange}
              placeholder={`Write a concise summary of the ${pageName} for search engines...`}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Recommended length: 120–160 characters.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meta Keywords <span className="text-slate-400 font-normal">(Comma separated)</span>
            </label>
            <input
              type="text"
              value={keywordsValue || ""}
              onChange={onKeywordsChange}
              placeholder="e.g. Wellicon Pharma, PCD Franchise, Quality Medicine"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Right Column: Google Search Result Live Preview Card */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Globe className="w-3.5 h-3.5 text-sky-600" /> Google Search Result Preview
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#202124]">
              <span className="w-4 h-4 rounded-full bg-lime-600 text-white flex items-center justify-center text-[9px] font-bold">W</span>
              <span className="text-xs text-[#202124] font-medium truncate">{pageUrl}</span>
            </div>

            <div className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer tracking-tight leading-snug line-clamp-1">
              {titleValue || `${pageName} | Wellicon Pharmaceuticals`}
            </div>

            <div className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
              {descriptionValue || `Explore ${pageName} on Wellicon Pharmaceuticals. Premium quality formulations, healthcare products, and trusted pharma services.`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
