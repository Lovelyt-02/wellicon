import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, FlaskConical, Pill, Award, ArrowRight, Heart } from "lucide-react";
import api, { fileUrl } from "@/lib/api";

export default function Home() {
  const { settings } = useOutletContext() || {};
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data || []));
    api.get("/products").then((r) => setProducts((r.data || []).slice(0, 6)));
  }, []);

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

  return (
    <>
      <section className="hero-gradient relative" data-testid="home-hero">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 grid lg:grid-cols-12 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="overline mb-5">{settings?.hero_overline || "PHARMACEUTICAL EXCELLENCE"}</div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-light text-slate-900 leading-[1.05] tracking-tight">
              {settings?.hero_title || "Caring Health, Curing Lives"}
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
              {settings?.hero_subtitle ||
                "Wellicon Pharmaceuticals — innovating quality medicines for a healthier tomorrow."}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
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

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
              {stats.map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-display font-semibold text-slate-900">{s.k}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-sky-100 rounded-3xl rotate-2 -z-0" />
              <img
                src={fileUrl(settings?.hero_image_url)}
                alt={settings?.company_name || "Wellicon laboratory"}
                className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/5]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 max-w-[240px] hidden md:block">
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
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24" data-testid="home-categories">
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
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24" data-testid="home-featured">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="overline mb-3">{settings?.home_featured_overline || "FEATURED RANGE"}</div>
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-slate-900 tracking-tight">
              {settings?.home_featured_title || "Trusted formulations"}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="product-card group bg-white rounded-xl border border-slate-200 overflow-hidden"
              data-testid={`home-product-${p.id}`}
            >
              <div className="aspect-square bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                <img
                  src={fileUrl(p.image_url)}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="overline text-[10px] mb-2">{p.category?.name || "Product"}</div>
                <div className="font-display font-semibold text-slate-900">{p.name}</div>
                <div className="text-sm text-slate-500 mt-1 line-clamp-2">{p.composition}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white" data-testid="home-trust">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid md:grid-cols-3 gap-10">
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
                <div className="w-12 h-12 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section
        className="max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-16 items-center"
        data-testid="home-about-teaser"
      >
        <div>
          <div className="overline mb-3">{settings?.home_about_overline || "WHO WE ARE"}</div>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-slate-900 tracking-tight">
            {settings?.about_title || "About Wellicon Pharma"}
          </h2>
          <p className="mt-6 text-base text-slate-600 leading-relaxed line-clamp-6">{settings?.about_body}</p>
          <Link
            to="/about"
            data-testid="about-read-more"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-lime-700 hover:text-lime-900"
          >
            {settings?.home_about_link || "Read more about us"} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            src={fileUrl(settings?.about_image_url)}
            alt="About"
            className="rounded-xl object-cover h-72 w-full"
          />
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-sky-50 rounded-xl p-6 flex flex-col justify-between">
              <Award className="w-7 h-7 text-lime-700" />
              <div>
                <div className="text-3xl font-display font-semibold text-slate-900">
                  {settings?.home_quality_stat_value || "98%"}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">
                  {settings?.home_quality_stat_label || "Quality Score"}
                </div>
              </div>
            </div>
            <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col justify-between">
              <FlaskConical className="w-7 h-7 text-sky-400" />
              <div>
                <div className="text-3xl font-display font-semibold">
                  {settings?.home_therapy_stat_value || "12+"}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  {settings?.home_therapy_stat_label || "Therapy Areas"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
