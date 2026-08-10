import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api, { fileUrl } from "@/lib/api";
import { FaLinkedin, FaYoutube, FaInstagram, FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";

const applySiteMeta = (siteSettings) => {
  if (!siteSettings) return;

  const nextTitle = siteSettings.site_title || siteSettings.site_name || "Wellicon Pharma";
  document.title = nextTitle;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", siteSettings.site_description || "");
  }

  const iconLink = document.querySelector("link[rel='icon']") || document.createElement("link");
  iconLink.rel = "icon";
  iconLink.href = siteSettings.favicon_url ? fileUrl(siteSettings.favicon_url) : "/favicon.svg";
  if (!iconLink.parentNode) {
    document.head.appendChild(iconLink);
  }
};

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const { pathname } = useLocation();
  const [socialMedia, setSocialMedia] = useState([]);

  useEffect(() => {
    const loadSiteSettings = () => {
      api
        .get("/settings")
        .then((r) => {
          setSettings(r.data);
          applySiteMeta(r.data);
        })
        .catch(() => { });
      api
        .get("/social-media")
        .then((r) => setSocialMedia(r.data))
        .catch(() => { });
    };

    loadSiteSettings();
    const handleSettingsUpdated = () => loadSiteSettings();
    window.addEventListener("site-settings-updated", handleSettingsUpdated);

    return () => window.removeEventListener("site-settings-updated", handleSettingsUpdated);
  }, []);

  useEffect(() => {
    if (settings) {
      applySiteMeta(settings);
    }
  }, [settings]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
  }, [pathname]);

  const navLinks = [
    { to: "/", label: settings?.nav_home || "Home" },
    { to: "/about", label: settings?.nav_about || "About" },
    { to: "/products", label: settings?.nav_products || "Products" },
    { to: "/contact", label: settings?.nav_contact || "Contact" },
  ];
  const renderIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <FaLinkedin className="w-5 h-5 text-white" />;
      case "youtube":
        return <FaYoutube className="w-5 h-5 text-white" />;
      case "instagram":
        return <FaInstagram className="w-5 h-5 text-white" />;
      case "x":
      case "twitter":
        return <FaTwitter className="w-5 h-5 text-white" />;
      case "facebook":
        return <FaFacebook className="w-5 h-5 text-white" />;
      case "whatsapp":
        return <FaWhatsapp className="w-5 h-5 text-white" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF4]">
      <header
        className="glass sticky top-0 z-50 border-b border-[#E7EDDA]"
        data-testid="public-header"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <img src={settings?.logo_url ? fileUrl(settings.logo_url) : "/logo.png"} alt={settings?.company_name || "Wellicon Pharma"} className="w-14 h-14 object-contain" />
            <div className="leading-tight">
              <div className="font-display font-bold text-[#1E293B] text-lg">
                {settings?.company_name || "Wellicon Pharma"}
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#7FA60F] font-semibold">
                {settings?.brand_motto || "Way To Healthiness"}
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={`nav-${l.to === "/" ? "home" : l.to.slice(1)}`}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? "text-[#7FA60F]" : "text-[#475569] hover:text-[#1E293B]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to={settings?.header_cta_url || "/contact"}
              data-testid="header-cta"
              className="hidden md:inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all shadow-lg hover:scale-[1.02]"
              style={{
                background: settings?.header_cta_bg_color || "linear-gradient(135deg, #A7D614 0%, #7FA60F 100%)",
                color: settings?.header_cta_text_color || "#FFFFFF",
              }}
            >
              <Phone className="w-4 h-4" />
              {settings?.header_cta || "Get in touch"}
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-md hover:bg-[#EEF7D0]"
              data-testid="mobile-menu-toggle"
            >
              {open ? <X className="w-5 h-5 text-[#1E293B]" /> : <Menu className="w-5 h-5 text-[#1E293B]" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[#E7EDDA] bg-white overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {navLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `text-sm font-medium py-2 ${isActive ? "text-[#7FA60F]" : "text-[#334155]"}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <Outlet context={{ settings }} />
      </main>

      <footer
        className="text-white"
        style={{
          background: settings?.footer_bg_color || "linear-gradient(180deg, #1F2A16 0%, #111827 100%)",
          color: settings?.footer_text_color || "#CBD5E1",
        }}
        data-testid="public-footer"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={settings?.logo_url ? fileUrl(settings.logo_url) : "/logo.png"} alt={settings?.company_name || "Wellicon Pharma"} className="w-14 h-14 object-contain" />
              <div>
                <div className="font-display font-semibold text-white text-lg">
                  {settings?.company_name || "Wellicon Pharma"}
                </div>
                <div className="text-xs text-[#D7F171] uppercase tracking-[0.2em]">
                  {settings?.brand_motto || "Way To Healthiness"}
                </div>
              </div>
            </div>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              {settings?.company_tagline || "Caring Health · Curing Lives"}
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mt-4">
              {socialMedia
                .filter((sm) => sm.active && sm.url)
                .map((sm) => (
                  <a
                    key={sm.id}
                    href={sm.url}
                    target={sm.open_in_new_tab ? "_blank" : "_self"}
                    rel={sm.nofollow ? "nofollow" : undefined}
                    className="text-white hover:text-[#D7F171] transition-colors"
                  >
                    {sm.icon_url ? (
                      <img
                        src={fileUrl(sm.icon_url)}
                        alt={sm.platform}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      renderIcon(sm.platform)
                    )}
                  </a>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">
              {settings?.footer_quick_links_title || "Quick Links"}
            </h4>
            <ul className="space-y-2 text-sm text-[#CBD5E1]">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-[#D7F171] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">
              {settings?.footer_contact_title || "Contact"}
            </h4>
            <ul className="space-y-3 text-sm text-[#CBD5E1]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[#D7F171] shrink-0" />
                <span>{settings?.contact_address || "Chandigarh, India"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D7F171]" />
                <a href={`mailto:${settings?.contact_email}`} className="hover:text-white">
                  {settings?.contact_email || "info@welliconpharma.com"}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D7F171]" />
                <a href={`tel:${settings?.contact_phone}`} className="hover:text-white">
                  {settings?.contact_phone || "+91 98765 43210"}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">
              {settings?.footer_social_media_title || "Social Media"}
            </h4>
            <div className="flex space-x-4">
              {socialMedia
                .filter((item) => item.active && item.url)
                .sort((a, b) => a.display_order - b.display_order)
                .map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target={item.open_in_new_tab ? "_blank" : "_self"}
                    rel={item.nofollow ? "nofollow" : undefined}
                    className="hover:opacity-80"
                  >
                    {item.icon_url ? (
                      <img src={item.icon_url} alt={item.platform} className="w-5 h-5" />
                    ) : (
                      renderIcon(item.platform)
                    )}
                  </a>
                ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#334155]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 text-xs text-[#94A3B8] flex flex-col md:flex-row justify-between gap-2">
            <span>
              © {new Date().getFullYear()} {settings?.company_name || "Wellicon Pharma"}.{" "}
              {settings?.footer_rights_suffix || "All rights reserved."}
            </span>
            <span>
              {settings?.footer_disclaimer ||
                "For healthcare professional use. Not for self-medication."}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
