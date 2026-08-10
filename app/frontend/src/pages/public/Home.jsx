import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, FlaskConical, Pill, Award, ArrowRight, Heart, Sparkles } from "lucide-react";
import api, { fileUrl } from "@/lib/api";

export default function Home() {
  const { settings } = useOutletContext() || {};
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data || []));
    api.get("/products").then((r) => setProducts((r.data || []).slice(0, 6)));
  }, []);

  useEffect(() => {
    if (!settings) return;
    const bgImages = [
      settings.hero_bg_image_url,
      settings.home_cat_bg_image_url,
      settings.home_featured_bg_image_url,
      settings.trust_bg_image_url,
      settings.home_about_bg_image_url,
      settings.hero_image_url,
      settings.about_image_url,
    ].filter(Boolean);

    bgImages.forEach((img) => {
      const i = new Image();
      i.src = fileUrl(img);
    });
  }, [settings]);

  const stats = [
    { k: settings?.hero_stat1_value || "200+", v: settings?.hero_stat1_label || "Formulations" },
    { k: settings?.hero_stat2_value || "WHO-GMP", v: settings?.hero_stat2_label || "Certified" },
    { k: settings?.hero_stat3_value || "15+", v: settings?.hero_stat3_label || "Years" },
  ];

  const trust = [
    {
      icon: FlaskConical,
      title: settings?.trust1_title || "R&D Driven",
      body: settings?.trust1_body || "In-house formulation development and validation laboratories.",
    },
    {
      icon: ShieldCheck,
      title: settings?.trust2_title || "Quality First",
      body: settings?.trust2_body || "WHO-GMP compliant manufacturing with stringent QC protocols.",
    },
    {
      icon: Heart,
      title: settings?.trust3_title || "Patient Focused",
      body: settings?.trust3_body || "Affordable medicines that reach every corner of the country.",
    },
  ];

  const showHeroImage = settings?.hero_image_active !== false;
  const showHeroBadge = settings?.hero_badge_active !== false;
  const showFeaturedImage = settings?.home_featured_image_active !== false && Boolean(settings?.home_featured_image_url);

  return (
    <>
      {/* 1. Hero Section */}
      <section
        className="hero-gradient relative lg:min-h-[calc(100vh-5rem)] flex items-center w-full"
        style={{
          background: settings?.hero_bg_color || undefined,
          backgroundImage: settings?.hero_bg_image_url ? `url(${fileUrl(settings.hero_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="home-hero"
      >
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 grid lg:grid-cols-12 gap-12 items-center relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={showHeroImage ? "lg:col-span-7" : "lg:col-span-12 text-center lg:text-left"}
          >
            <div className="overline mb-5">{settings?.hero_overline || "PHARMACEUTICAL EXCELLENCE"}</div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-light text-slate-900 leading-[1.05] tracking-tight">
              {settings?.hero_title || "Caring Health, Curing Lives"}
            </h1>
            <p className={`mt-6 text-lg text-slate-600 leading-relaxed ${showHeroImage ? "max-w-xl" : "max-w-3xl"}`}>
              {settings?.hero_subtitle ||
                "Wellicon Pharmaceuticals — innovating quality medicines for a healthier tomorrow."}
            </p>
            <div className={`mt-9 flex flex-wrap items-center gap-4 ${showHeroImage ? "" : "justify-center lg:justify-start"}`}>
              <Link
                to="/products"
                data-testid="hero-explore-products"
                className="inline-flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white rounded-md px-6 py-3 text-sm font-medium transition-colors shadow-sm"
              >
                {settings?.hero_cta_primary || "Explore products"} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                data-testid="hero-about-link"
                className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-900 rounded-md px-6 py-3 text-sm font-medium transition-colors"
              >
                {settings?.hero_cta_secondary || "About us"}
              </Link>
            </div>

            <div className={`mt-12 grid grid-cols-3 gap-6 ${showHeroImage ? "max-w-lg" : "max-w-xl"}`}>
              {stats.map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-display font-semibold text-slate-900">{s.k}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {showHeroImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 flex justify-center w-full"
            >
              <div className="relative w-full max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-sky-100 rounded-3xl rotate-2 -z-0" />
                <img
                  src={fileUrl(settings?.hero_image_url)}
                  alt={settings?.company_name || "Wellicon laboratory"}
                  className="relative rounded-3xl shadow-2xl w-full h-auto max-h-[540px] object-cover aspect-[4/5]"
                />

                {showHeroBadge && (
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 max-w-[240px] hidden md:block z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">{settings?.hero_badge_label || "Quality Assured"}</div>
                        <div className="text-sm font-semibold text-slate-900">
                          {settings?.hero_badge_value || "ISO 9001:2015"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 2. Portfolio / Categories Section */}
      <section
        className="w-full py-20 lg:py-24"
        style={{
          background: settings?.home_portfolio_bg_color || undefined,
          backgroundImage: settings?.home_portfolio_bg_image_url ? `url(${fileUrl(settings.home_portfolio_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="home-categories"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="overline mb-3">{settings?.home_portfolio_overline || "OUR PORTFOLIO"}</div>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-slate-900 tracking-tight">
                {settings?.home_portfolio_title || "Therapeutic divisions"}
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-medium text-lime-700 hover:text-lime-900"
              data-testid="categories-view-all"
            >
              {settings?.home_portfolio_link || "View all products →"}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${c.slug}`}
                data-testid={`home-cat-${c.slug}`}
                className="group bg-lime-50/60 hover:bg-lime-100 border border-slate-100 hover:border-lime-200 rounded-xl p-5 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:border-lime-300">
                  <Pill className="w-5 h-5 text-lime-700" />
                </div>
                <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* 3. Featured Products Section */}
      <section
        className="w-full py-20 lg:py-12 relative overflow-hidden"
        style={{
          background: settings?.home_featured_bg_color || undefined,
          backgroundImage: settings?.home_featured_bg_image_url ? `url(${fileUrl(settings.home_featured_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="home-featured"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          {/* Header Layout */}
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="overline text-lime-700 font-bold tracking-widest mb-3">
                {settings?.home_featured_overline || "FEATURED RANGE"}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-display font-medium text-slate-900 tracking-tight">
                {settings?.home_featured_title || "Trusted formulations"}
              </h2>
              <p className="mt-4 text-slate-600 text-base max-w-2xl leading-relaxed">
                {settings?.home_featured_subtitle ||
                  "Scientific excellence and advanced manufacturing come together to deliver safe, effective and reliable pharmaceutical solutions."}
              </p>
            </div>
            <Link
              to={settings?.home_featured_cta_btn_link || "/products"}
              className="inline-flex items-center gap-2 bg-white hover:bg-lime-50 text-lime-800 border-2 border-lime-600/40 hover:border-lime-600 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-xs shrink-0"
              data-testid="featured-view-all-cta"
            >
              {settings?.home_featured_cta_btn_text || "View All Products"} <ArrowRight className="w-4 h-4 text-lime-700" />
            </Link>
          </div>

          {/* 3-Column Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="product-card group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                data-testid={`home-product-${p.id}`}
              >
                <div
                  className="aspect-[16/10] bg-slate-100/70 overflow-hidden flex items-center justify-center relative"
                  style={{ background: settings?.home_featured_card_img_bg_color || undefined }}
                >
                  <img
                    src={fileUrl(p.image_url)}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div
                  className="p-5 bg-white flex items-center justify-between gap-4 border-t border-slate-100 flex-1"
                  style={{ background: settings?.home_featured_card_text_bg_color || undefined }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold tracking-wider text-lime-700 uppercase border-b-2 border-lime-600 pb-0.5 inline-block">
                      {p.category?.name || "TABLETS"}
                    </span>
                    <h3 className="font-display font-bold text-slate-900 text-base mt-2 truncate group-hover:text-lime-700 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 truncate">{p.composition}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-lime-200 text-lime-700 flex items-center justify-center group-hover:bg-lime-600 group-hover:text-white group-hover:border-lime-600 transition-all shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trust Strip Section */}
      <section
        className="w-full py-20 lg:py-24"
        style={{
          background: settings?.trust_bg_color || undefined,
          backgroundImage: settings?.trust_bg_image_url ? `url(${fileUrl(settings.trust_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="home-trust"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-10">
          {trust.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-lime-100/90 text-lime-700 border border-lime-200/80 flex items-center justify-center mb-5 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. About Teaser Section */}
      <section
        className="w-full pt-20 pb-16 lg:pt-28 lg:pb-20 relative overflow-hidden mb-0"
        style={{
          background: settings?.home_about_bg_color || undefined,
          backgroundImage: settings?.home_about_bg_image_url ? `url(${fileUrl(settings.home_about_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="home-about-teaser"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column Text Content */}
          <div className="lg:col-span-5">
            <div className="overline text-lime-700 font-bold tracking-widest mb-3">
              {settings?.home_about_overline || "WHO WE ARE"}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-display font-medium text-slate-900 tracking-tight leading-tight">
              {settings?.about_title || "Our Brand Identity Reflects Our Values"}
            </h2>
            <p className="mt-6 text-base text-slate-600 leading-relaxed">
              {settings?.about_body ||
                "With over 7 years of excellence, Wellicon Pharmaceuticals stands as a trusted name in the world of generic and OTC healthcare solutions. We specialize in a wide range of therapeutic segments including Inflammatory, Gastro, Antibacterial, Anti-Allergic, Nutraceuticals, Injectables, Dermatological, and Pediatric medicines. Our commitment is to deliver high-quality, affordable, and effective products that meet the highest standards of safety and care."}
            </p>
            <Link
              to="/about"
              data-testid="about-read-more"
              className="mt-8 inline-flex items-center gap-2 border-2 border-lime-600/50 hover:border-lime-600 text-lime-800 hover:bg-lime-50 bg-white/80 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-xs"
            >
              {settings?.home_about_link || "Read More"} <ArrowRight className="w-4 h-4 text-lime-700" />
            </Link>
          </div>

          {/* Middle Column Main Image */}
          <div className="lg:col-span-4 flex justify-center">
            <img
              src={fileUrl(settings?.about_image_url)}
              alt={settings?.about_title || "Wellicon laboratory & formulations"}
              className="rounded-3xl object-cover h-[380px] w-full shadow-md border border-slate-200/60 max-w-md lg:max-w-none hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          {/* Right Column 2 Stat Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {/* Card 1 */}
            <div
              className="rounded-2xl p-6 flex flex-col justify-between border border-lime-100/80 shadow-xs hover:shadow-md transition-all"
              style={{ background: settings?.home_about_card1_bg_color || "#F4F9E8" }}
            >
              <div className="w-10 h-10 rounded-xl bg-lime-100/90 text-lime-700 flex items-center justify-center border border-lime-200/80 mb-6">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-slate-900">
                  {settings?.home_quality_stat_value || "98%"}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                  {settings?.home_quality_stat_label || "QUALITY SCORE"}
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="rounded-2xl p-6 flex flex-col justify-between border border-lime-100/80 shadow-xs hover:shadow-md transition-all"
              style={{ background: settings?.home_about_card2_bg_color || "#F4F9E8" }}
            >
              <div className="w-10 h-10 rounded-xl bg-lime-100/90 text-lime-700 flex items-center justify-center border border-lime-200/80 mb-6">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-slate-900">
                  {settings?.home_therapy_stat_value || "12+"}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                  {settings?.home_therapy_stat_label || "THERAPY AREAS"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
