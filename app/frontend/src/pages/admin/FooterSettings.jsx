import React, { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, Upload, Palette, Share2, MapPin, Mail, Phone, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import api, { fileUrl } from "@/lib/api";
import { FaLinkedin, FaInstagram, FaYoutube, FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";

const PRESET_FOOTER_BG = [
  { name: "Dark Forest (Default)", value: "linear-gradient(180deg, #1F2A16 0%, #111827 100%)" },
  { name: "Midnight Black", value: "#111827" },
  { name: "Deep Slate", value: "#1E293B" },
  { name: "Navy Blue", value: "#0F172A" },
  { name: "Emerald Dark", value: "#064E3B" },
  { name: "Dark Purple", value: "#1E1B4B" },
];

const PRESET_FOOTER_TEXT = [
  { name: "Light Slate", value: "#CBD5E1" },
  { name: "Pure White", value: "#FFFFFF" },
  { name: "Mint Light", value: "#ECFDF5" },
  { name: "Light Gray", value: "#94A3B8" },
];

const PLATFORM_OPTIONS = [
  { value: "linkedin", label: "LinkedIn", icon: <FaLinkedin className="w-4 h-4" /> },
  { value: "instagram", label: "Instagram", icon: <FaInstagram className="w-4 h-4" /> },
  { value: "youtube", label: "YouTube", icon: <FaYoutube className="w-4 h-4" /> },
  { value: "x", label: "X (Twitter)", icon: <FaTwitter className="w-4 h-4" /> },
  { value: "facebook", label: "Facebook", icon: <FaFacebook className="w-4 h-4" /> },
  { value: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp className="w-4 h-4" /> },
];

export default function FooterSettings({ value = {}, onChange }) {
  const [socialList, setSocialList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState(null);
  const [socialForm, setSocialForm] = useState({
    platform: "",
    url: "",
    active: true,
    display_order: 0,
    open_in_new_tab: true,
    nofollow: false,
    icon_url: "",
  });
  const socialFileRef = useRef(null);

  const loadSocial = async () => {
    try {
      const { data } = await api.get("/social-media");
      const sorted = (data || []).sort((a, b) => a.display_order - b.display_order);
      setSocialList(sorted);
      updateField("social_links", sorted);
    } catch (err) {
      console.error("Failed to load social media", err);
    }
  };

  useEffect(() => {
    loadSocial();
  }, []);

  const updateField = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const renderIcon = (platform) => {
    const opt = PLATFORM_OPTIONS.find((o) => o.value === platform?.toLowerCase());
    return opt ? opt.icon : null;
  };

  const openNewSocial = () => {
    setEditingSocialId(null);
    setSocialForm({
      platform: "linkedin",
      url: "",
      active: true,
      display_order: socialList.length,
      open_in_new_tab: true,
      nofollow: false,
      icon_url: "",
    });
    setOpenModal(true);
  };

  const openEditSocial = (item) => {
    setEditingSocialId(item.id);
    setSocialForm({
      platform: item.platform,
      url: item.url || "",
      active: item.active ?? true,
      display_order: item.display_order,
      open_in_new_tab: item.open_in_new_tab ?? true,
      nofollow: item.nofollow ?? false,
      icon_url: item.icon_url || "",
    });
    setOpenModal(true);
  };

  const handleIconUpload = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSocialForm((f) => ({ ...f, icon_url: data.url }));
      toast.success("Social icon uploaded");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Icon upload failed");
    }
  };

  const submitSocial = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!socialForm.platform) {
      toast.error("Platform is required");
      return;
    }
    try {
      if (editingSocialId) {
        await api.put(`/social-media/${editingSocialId}`, socialForm);
        toast.success("Social link updated");
      } else {
        await api.post("/social-media", socialForm);
        toast.success("Social link created");
      }
      setOpenModal(false);
      await loadSocial();
      window.dispatchEvent(new CustomEvent("site-settings-updated"));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save social link failed");
    }
  };

  const deleteSocial = async (item) => {
    if (!window.confirm(`Delete ${item.platform} link?`)) return;
    try {
      await api.delete(`/social-media/${item.id}`);
      toast.success("Social link deleted");
      await loadSocial();
      window.dispatchEvent(new CustomEvent("site-settings-updated"));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="space-y-6" data-testid="admin-footer-settings">
      {/* Live Footer Preview */}
      <section className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Footer Preview
          </div>
          <span className="text-xs text-slate-400">Updates as you edit below</span>
        </div>

        <div
          className="rounded-lg p-6 border border-slate-700 space-y-6 overflow-hidden"
          style={{
            background: value.footer_bg_color || "linear-gradient(180deg, #1F2A16 0%, #111827 100%)",
            color: value.footer_text_color || "#CBD5E1",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            {/* Col 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src={value.logo_url ? fileUrl(value.logo_url) : "/logo.png"}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <div className="font-bold text-white text-sm">{value.company_name || "Wellicon Pharma"}</div>
                  <div className="text-[9px] uppercase tracking-wider text-[#D7F171]">
                    {value.brand_motto || "WAY TO HEALTHINESS"}
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {value.company_tagline || "Caring Health · Curing Lives"}
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <div className="font-semibold text-white mb-2">{value.footer_quick_links_title || "Quick Links"}</div>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>{value.nav_home || "Home"}</li>
                <li>{value.nav_about || "About"}</li>
                <li>{value.nav_products || "Products"}</li>
                <li>{value.nav_contact || "Contact"}</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <div className="font-semibold text-white mb-2">{value.footer_contact_title || "Contact"}</div>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#D7F171]" />
                  <span>{value.contact_address || "Chandigarh, India"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#D7F171]" />
                  <span>{value.contact_email || "info@welliconpharma.com"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#D7F171]" />
                  <span>{value.contact_phone || "+91 98765 43210"}</span>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <div className="font-semibold text-white mb-2">
                {value.footer_social_media_title || "Social Media"}
              </div>
              <div className="flex items-center gap-2">
                {socialList
                  .filter((s) => s.active)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="w-6 h-6 rounded bg-slate-800/80 flex items-center justify-center text-white"
                      title={s.platform}
                    >
                      {s.icon_url ? (
                        <img src={fileUrl(s.icon_url)} alt={s.platform} className="w-3.5 h-3.5 object-contain" />
                      ) : (
                        renderIcon(s.platform)
                      )}
                    </div>
                  ))}
                {socialList.filter((s) => s.active).length === 0 && (
                  <span className="text-[10px] text-slate-400">No active social links</span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/60 pt-3 flex flex-col sm:flex-row justify-between gap-2 text-[10px] text-slate-400">
            <span>
              © {new Date().getFullYear()} {value.company_name || "Wellicon Pharma"}.{" "}
              {value.footer_rights_suffix || "All rights reserved."}
            </span>
            <span>{value.footer_disclaimer || "For healthcare professional use."}</span>
          </div>
        </div>
      </section>

      {/* 1. Footer Background & Text Styling */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Palette className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900">Footer Background & Styling</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Background Color */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-700">Footer Background Color / Gradient</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={value.footer_bg_color?.startsWith("#") ? value.footer_bg_color : "#111827"}
                onChange={(e) => updateField("footer_bg_color", e.target.value)}
                className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={value.footer_bg_color || ""}
                onChange={(e) => updateField("footer_bg_color", e.target.value)}
                placeholder="e.g. #111827 or linear-gradient(...)"
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_FOOTER_BG.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => updateField("footer_bg_color", preset.value)}
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
            <label className="block text-xs font-medium text-slate-700">Footer Default Text Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={value.footer_text_color?.startsWith("#") ? value.footer_text_color : "#CBD5E1"}
                onChange={(e) => updateField("footer_text_color", e.target.value)}
                className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={value.footer_text_color || ""}
                onChange={(e) => updateField("footer_text_color", e.target.value)}
                placeholder="e.g. #CBD5E1"
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_FOOTER_TEXT.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => updateField("footer_text_color", preset.value)}
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
      </section>

      {/* 2. Column Titles & Content */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900">Column Headers & Content</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Subtitle / Tagline (Col 1)</label>
            <input
              type="text"
              value={value.company_tagline || ""}
              onChange={(e) => updateField("company_tagline", e.target.value)}
              placeholder="e.g. Caring Health · Curing Lives"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quick Links Title (Col 2)</label>
            <input
              type="text"
              value={value.footer_quick_links_title || ""}
              onChange={(e) => updateField("footer_quick_links_title", e.target.value)}
              placeholder="e.g. Quick Links"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Section Title (Col 3)</label>
            <input
              type="text"
              value={value.footer_contact_title || ""}
              onChange={(e) => updateField("footer_contact_title", e.target.value)}
              placeholder="e.g. Contact"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Social Media Title (Col 4)</label>
            <input
              type="text"
              value={value.footer_social_media_title || ""}
              onChange={(e) => updateField("footer_social_media_title", e.target.value)}
              placeholder="e.g. Social Media"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>
        </div>

        {/* Contact Info details shown in Col 3 */}
        <div className="pt-3 border-t border-slate-100 space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">Contact Info Shown in Footer</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Footer Email</label>
              <input
                type="email"
                value={value.contact_email || ""}
                onChange={(e) => updateField("contact_email", e.target.value)}
                placeholder="info@welliconpharma.com"
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Footer Phone</label>
              <input
                type="text"
                value={value.contact_phone || ""}
                onChange={(e) => updateField("contact_phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Footer Address</label>
              <input
                type="text"
                value={value.contact_address || ""}
                onChange={(e) => updateField("contact_address", e.target.value)}
                placeholder="Chandigarh, India"
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Social Media Links & Icons Manager */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-sky-600" />
            <h3 className="font-semibold text-slate-900">Social Media Links & Custom Icons</h3>
          </div>
          <button
            type="button"
            onClick={openNewSocial}
            className="inline-flex items-center gap-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Social Icon
          </button>
        </div>

        {socialList.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No social media entries found. Click "Add Social Icon" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5 text-left">Icon</th>
                  <th className="px-4 py-2.5 text-left">Platform</th>
                  <th className="px-4 py-2.5 text-left">URL Link</th>
                  <th className="px-4 py-2.5 text-left">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {socialList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {item.icon_url ? (
                          <img src={fileUrl(item.icon_url)} alt={item.platform} className="w-4 h-4 object-contain" />
                        ) : (
                          renderIcon(item.platform)
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 capitalize font-medium text-slate-900">{item.platform}</td>
                    <td className="px-4 py-2.5 text-slate-600 truncate max-w-xs" title={item.url}>
                      {item.url || <span className="text-slate-400 italic">No link</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      {item.active ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditSocial(item)}
                        className="text-sky-700 hover:text-sky-900 font-medium"
                      >
                        <Pencil className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSocial(item)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 4. Bottom Legal & Copyright Bar */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-slate-900">Bottom Copyright & Disclaimer Bar</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rights Suffix</label>
            <input
              type="text"
              value={value.footer_rights_suffix || ""}
              onChange={(e) => updateField("footer_rights_suffix", e.target.value)}
              placeholder="All rights reserved."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Medical / Usage Disclaimer</label>
            <textarea
              rows={2}
              value={value.footer_disclaimer || ""}
              onChange={(e) => updateField("footer_disclaimer", e.target.value)}
              placeholder="For healthcare professional use. Not for self-medication."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none resize-none"
            />
          </div>
        </div>
      </section>

      {/* Social Media Add/Edit Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-900">
                {editingSocialId ? "Edit Social Media Link" : "Add Social Media Link"}
              </h3>
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform *</label>
                <select
                  required
                  value={socialForm.platform}
                  onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none bg-white"
                >
                  {PLATFORM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profile URL / Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={socialForm.url}
                  onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={socialForm.active}
                    onChange={(e) => setSocialForm({ ...socialForm, active: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-600"
                  />
                  Active (show in footer)
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={socialForm.open_in_new_tab}
                    onChange={(e) => setSocialForm({ ...socialForm, open_in_new_tab: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-600"
                  />
                  Open in new tab
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Custom Icon Image (optional)</label>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {socialForm.icon_url ? (
                      <img src={fileUrl(socialForm.icon_url)} alt="Custom Icon" className="max-w-full max-h-full object-contain" />
                    ) : (
                      renderIcon(socialForm.platform)
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <input
                      ref={socialFileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleIconUpload(e.target.files?.[0])}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => socialFileRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-md text-xs font-medium transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Custom Icon
                    </button>
                    <input
                      type="text"
                      value={socialForm.icon_url || ""}
                      onChange={(e) => setSocialForm({ ...socialForm, icon_url: e.target.value })}
                      placeholder="Or paste Icon image URL..."
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 rounded-md border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitSocial}
                  className="px-4 py-2 rounded-md bg-sky-700 text-white text-sm hover:bg-sky-600 font-medium"
                >
                  Save Social Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
