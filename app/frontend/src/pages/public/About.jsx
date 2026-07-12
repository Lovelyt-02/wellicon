import React from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Globe, Award, Users } from "lucide-react";
import { fileUrl } from "@/lib/api";

export default function About() {
  const { settings } = useOutletContext() || {};

  const badges = [
    { icon: ShieldCheck, label: settings?.about_badge1 || "WHO-GMP Certified" },
    { icon: Award, label: settings?.about_badge2 || "ISO 9001:2015" },
    { icon: Globe, label: settings?.about_badge3 || "Pan-India Distribution" },
    { icon: Users, label: settings?.about_badge4 || "200+ Healthcare Partners" },
  ];

  return (
    <>
      <section className="hero-gradient" data-testid="about-hero">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-24">
          <div className="overline mb-4">{settings?.about_overline || "ABOUT US"}</div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-light tracking-tight text-slate-900 leading-tight"
          >
            {settings?.about_title || "About Wellicon Pharma"}
          </motion.h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line">
              {settings?.about_body}
            </p>
            {settings?.about_image_url && (
              <img
                src={fileUrl(settings.about_image_url)}
                alt={settings?.about_title || "About"}
                className="rounded-xl object-cover w-full max-h-80"
              />
            )}
          </div>
          <aside className="space-y-4">
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.label}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-4"
                >
                  <div className="w-10 h-10 bg-sky-50 text-sky-700 rounded-md flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium text-slate-900">{b.label}</div>
                </div>
              );
            })}
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200" data-testid="about-mission">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-20 grid md:grid-cols-2 gap-10">
          <div>
            <div className="overline mb-3">{settings?.about_mission_overline || "OUR MISSION"}</div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-slate-900 leading-snug">
              {settings?.about_mission ||
                "To deliver innovative, affordable and trusted pharmaceutical solutions that improve lives."}
            </h2>
          </div>
          <div>
            <div className="overline mb-3">{settings?.about_vision_overline || "OUR VISION"}</div>
            <p className="text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {settings?.about_vision ||
                "To be recognised globally as a benchmark for quality, integrity and innovation in pharmaceuticals."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
