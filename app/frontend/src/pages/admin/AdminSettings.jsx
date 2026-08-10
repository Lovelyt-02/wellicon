import React, { useEffect, useState, useRef } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import api, { fileUrl } from "@/lib/api";
import { FiChevronUp, FiChevronDown } from "react-icons/fi"; // for up/down buttons
// Import new admin sections (placeholders for now)
import SocialMediaSettings from "./SocialMediaSettings";
import BackgroundSettings from "./BackgroundSettings";
import GlobalSeoSettings from "./GlobalSeoSettings";
import ProductSeoSettings from "./ProductSeoSettings";
import ThemeSettings from "./ThemeSettings";
import FooterSettings from "./FooterSettings";
import SiteSettings from "./SiteSettings";
import HeaderSettings from "./HeaderSettings";
import HomePageSettings from "./HomePageSettings";
import AboutPageSettings from "./AboutPageSettings";
import RichTextEditor from "@/components/RichTextEditor";
import PageSeoSection from "@/components/PageSeoSection";

const TABS = [
  { id: "siteSettings", label: "Site Setting" },
  { id: "header", label: "Header" },
  { id: "footer", label: "Footer" },
  { id: "home", label: "Home Page" },
  { id: "about", label: "About Us Page" },
  { id: "products", label: "Products Page" },
  { id: "contact", label: "Contact Us Page" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms & Conditions" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("siteSettings");
  const heroRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    api.get("/settings").then((r) => setSettings(r.data));
  }, []);

  if (!settings) return <div className="text-slate-500">Loading…</div>;

  const change = (k) => (e) => setSettings({ ...settings, [k]: e.target.value });

  const upload = async (file, key) => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSettings({ ...settings, [key]: data.url });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Upload failed");
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, ...payload } = settings;
      await api.put("/settings", payload);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6 w-full max-w-none" data-testid="admin-settings">
      <div>
        <h2 className="text-2xl font-display font-semibold text-slate-900">Site Content CMS</h2>
        <p className="text-sm text-slate-500 mt-1">
          Edit every title, label, and text shown on the public website.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-sky-700 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      
      {tab === "siteSettings" && (
        <SiteSettings value={settings} onChange={(nextSettings) => setSettings(nextSettings)} />
      )}

      {tab === "header" && (
        <HeaderSettings value={settings} onChange={(nextSettings) => setSettings(nextSettings)} onUpload={upload} />
      )}

      {tab === "footer" && (
        <FooterSettings value={settings} onChange={(nextSettings) => setSettings(nextSettings)} />
      )}

      {tab === "social" && (
        <SocialMediaSettings />
      )}
      
      {tab === "company" && (
        <div className="space-y-6">
          <Section title="Company & Layout">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Company name" value={settings.company_name} onChange={change("company_name")} />
              <Field label="Tagline" value={settings.company_tagline} onChange={change("company_tagline")} />
              <Field label="Brand motto (under logo)" value={settings.brand_motto} onChange={change("brand_motto")} />
              <Field label="Header CTA button" value={settings.header_cta} onChange={change("header_cta")} />
            </div>
          </Section>
          <Section title="Navigation labels">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Home" value={settings.nav_home} onChange={change("nav_home")} />
              <Field label="About" value={settings.nav_about} onChange={change("nav_about")} />
              <Field label="Products" value={settings.nav_products} onChange={change("nav_products")} />
              <Field label="Contact" value={settings.nav_contact} onChange={change("nav_contact")} />
            </div>
          </Section>
          <Section title="Footer">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Quick links title" value={settings.footer_quick_links_title} onChange={change("footer_quick_links_title")} />
              <Field label="Contact title" value={settings.footer_contact_title} onChange={change("footer_contact_title")} />
              <Field label="Admin title" value={settings.footer_admin_title} onChange={change("footer_admin_title")} />
              <Field label="Admin link text" value={settings.footer_admin_link} onChange={change("footer_admin_link")} />
              <Field label="Disclaimer" value={settings.footer_disclaimer} onChange={change("footer_disclaimer")} textarea rows={2} />
              <Field label="Rights suffix" value={settings.footer_rights_suffix} onChange={change("footer_rights_suffix")} />
            </div>
          </Section>
        </div>
      )}

      {tab === "home" && (
        <HomePageSettings
          value={settings}
          onChange={(nextSettings) => setSettings(nextSettings)}
          onUpload={upload}
        />
      )}

      {tab === "about" && (
        <AboutPageSettings
          value={settings}
          onChange={(nextSettings) => setSettings(nextSettings)}
        />
      )}

      {tab === "products" && (
        <div className="space-y-6">
          <Section title="Products catalogue">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Overline" value={settings.products_overline} onChange={change("products_overline")} />
              <Field label="All products title" value={settings.products_title_all} onChange={change("products_title_all")} />
              <Field label="All categories filter" value={settings.products_all_categories} onChange={change("products_all_categories")} />
              <Field label="Search placeholder" value={settings.products_search_placeholder} onChange={change("products_search_placeholder")} />
              <Field label="Empty title" value={settings.products_empty_title} onChange={change("products_empty_title")} />
              <Field label="Empty subtitle" value={settings.products_empty_subtitle} onChange={change("products_empty_subtitle")} />
            </div>
          </Section>
          <Section title="Product detail labels">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Composition label" value={settings.product_label_composition} onChange={change("product_label_composition")} />
              <Field label="Packaging label" value={settings.product_label_packaging} onChange={change("product_label_packaging")} />
              <Field label="Description label" value={settings.product_label_description} onChange={change("product_label_description")} />
              <Field label="Inquire CTA" value={settings.product_inquire_cta} onChange={change("product_inquire_cta")} />
              <Field label="Loading text" value={settings.product_loading} onChange={change("product_loading")} />
              <Field label="Not found text" value={settings.product_not_found} onChange={change("product_not_found")} />
            </div>
          </Section>
          <PageSeoSection
            pageName="Products Page"
            pageUrl="https://welliconpharma.com/products"
            titleValue={settings.seo_products_title}
            descriptionValue={settings.seo_products_description}
            keywordsValue={settings.seo_products_keywords}
            onTitleChange={change("seo_products_title")}
            onDescriptionChange={change("seo_products_description")}
            onKeywordsChange={change("seo_products_keywords")}
          />
        </div>
      )}

      {tab === "contact" && (
        <div className="space-y-6">
          <Section title="Contact page">
            <Field label="Overline" value={settings.contact_overline} onChange={change("contact_overline")} />
            <Field label="Title" value={settings.contact_title} onChange={change("contact_title")} />
            <Field label="Intro text" value={settings.contact_intro} onChange={change("contact_intro")} textarea rows={4} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Address label" value={settings.contact_label_address} onChange={change("contact_label_address")} />
              <Field label="Email label" value={settings.contact_label_email} onChange={change("contact_label_email")} />
              <Field label="Phone label" value={settings.contact_label_phone} onChange={change("contact_label_phone")} />
            </div>
          </Section>
          <Section title="Contact details">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Contact email" value={settings.contact_email} onChange={change("contact_email")} />
              <Field label="Contact phone" value={settings.contact_phone} onChange={change("contact_phone")} />
            </div>
            <Field label="Contact address" value={settings.contact_address} onChange={change("contact_address")} textarea rows={2} />
          </Section>
          <Section title="Contact form labels">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name field" value={settings.contact_form_name} onChange={change("contact_form_name")} />
              <Field label="Email field" value={settings.contact_form_email} onChange={change("contact_form_email")} />
              <Field label="Phone field" value={settings.contact_form_phone} onChange={change("contact_form_phone")} />
              <Field label="Subject field" value={settings.contact_form_subject} onChange={change("contact_form_subject")} />
              <Field label="Message field" value={settings.contact_form_message} onChange={change("contact_form_message")} />
              <Field label="Submit button" value={settings.contact_form_submit} onChange={change("contact_form_submit")} />
              <Field label="Submitting text" value={settings.contact_form_submitting} onChange={change("contact_form_submitting")} />
              <Field label="Success message" value={settings.contact_success} onChange={change("contact_success")} />
            </div>
          </Section>
          <PageSeoSection
            pageName="Contact Us Page"
            pageUrl="https://welliconpharma.com/contact"
            titleValue={settings.seo_contact_title}
            descriptionValue={settings.seo_contact_description}
            keywordsValue={settings.seo_contact_keywords}
            onTitleChange={change("seo_contact_title")}
            onDescriptionChange={change("seo_contact_description")}
            onKeywordsChange={change("seo_contact_keywords")}
          />
        </div>
      )}

      {tab === "privacy" && (
        <div className="space-y-6">
          <Section title="Privacy Policy Page Content">
            <div className="space-y-4">
              <Field
                label="Page Headline / Title"
                value={settings.privacy_title}
                onChange={change("privacy_title")}
              />
              <RichTextEditor
                label="Privacy Policy Body Content (Rich Text Editor)"
                value={settings.privacy_content}
                onChange={(html) => setSettings({ ...settings, privacy_content: html })}
                placeholder="Type or paste Privacy Policy content..."
              />
            </div>
          </Section>
          <PageSeoSection
            pageName="Privacy Policy Page"
            pageUrl="https://welliconpharma.com/privacy"
            titleValue={settings.seo_privacy_title}
            descriptionValue={settings.seo_privacy_description}
            keywordsValue={settings.seo_privacy_keywords}
            onTitleChange={change("seo_privacy_title")}
            onDescriptionChange={change("seo_privacy_description")}
            onKeywordsChange={change("seo_privacy_keywords")}
          />
        </div>
      )}

      {tab === "terms" && (
        <div className="space-y-6">
          <Section title="Terms & Conditions Page Content">
            <div className="space-y-4">
              <Field
                label="Page Headline / Title"
                value={settings.terms_title}
                onChange={change("terms_title")}
              />
              <RichTextEditor
                label="Terms & Conditions Body Content (Rich Text Editor)"
                value={settings.terms_content}
                onChange={(html) => setSettings({ ...settings, terms_content: html })}
                placeholder="Type or paste Terms & Conditions content..."
              />
            </div>
          </Section>
          <PageSeoSection
            pageName="Terms & Conditions Page"
            pageUrl="https://welliconpharma.com/terms"
            titleValue={settings.seo_terms_title}
            descriptionValue={settings.seo_terms_description}
            keywordsValue={settings.seo_terms_keywords}
            onTitleChange={change("seo_terms_title")}
            onDescriptionChange={change("seo_terms_description")}
            onKeywordsChange={change("seo_terms_keywords")}
          />
        </div>
      )}

      <div className="sticky bottom-0 bg-slate-50 -mx-8 px-8 py-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={saving}
          data-testid="settings-save"
          className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-600 disabled:opacity-50 text-white rounded-md px-6 py-2.5 text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save all changes"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
      <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, textarea, rows = 2 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          rows={rows}
          value={value || ""}
          onChange={onChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none resize-none"
        />
      ) : (
        <input
          value={value || ""}
          onChange={onChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
        />
      )}
    </div>
  );
}

function ImageField({ label, value, onChange, onUpload, inputRef }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="flex gap-4 items-start">
        <div className="w-32 h-20 bg-slate-50 rounded-md flex items-center justify-center border border-slate-200 overflow-hidden">
          {value ? (
            <img src={fileUrl(value)} alt="" className="max-w-full max-h-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400">No image</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            className="block text-sm w-full file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
          />
          <input
            value={value || ""}
            onChange={onChange}
            placeholder="or paste URL"
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-600 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
