import React, { useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Award, FlaskConical, Stethoscope, ArrowRight, Heart, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, UserCheck, Users, Globe, Sprout, TrendingUp, Target, Eye, Tag, Handshake, Star, ZoomIn, Check, X, PhoneCall } from "lucide-react";
import { fileUrl } from "@/lib/api";

const THERAPEUTIC_SEGMENTS_DATA = [
  {
    id: "gastro",
    name: "Gastro",
    title: "Gastro",
    description: "Our gastro range includes safe and effective solutions for various gastrointestinal disorders, ensuring better digestive health and overall well-being.",
    points: [
      "High quality APIs",
      "Clinically proven formulations",
      "Safe & effective for all age groups"
    ],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "antibacterial",
    name: "Antibacterial",
    title: "Antibacterial & Antibiotics",
    description: "Advanced anti-infective formulations designed to effectively combat bacterial infections with high efficacy and patient safety.",
    points: [
      "Broad-spectrum efficacy",
      "WHO-GMP compliant manufacturing",
      "Optimal bioavailability and stability"
    ],
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "dermatology",
    name: "Dermatology",
    title: "Dermatological Care",
    description: "Comprehensive skin care and topical therapeutic solutions for eczema, psoriasis, acne, and anti-fungal treatments.",
    points: [
      "Dermatologically tested",
      "Fast-acting topical delivery",
      "Non-irritating, gentle formulations"
    ],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "pediatric",
    name: "Pediatric",
    title: "Pediatric Formulations",
    description: "Child-friendly oral drops and palatable suspensions formulated specifically for infant and child health and wellness.",
    points: [
      "Child-safe precise dosing",
      "Palatable taste profiles",
      "Pediatrician trusted quality"
    ],
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1cdb?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "injectables",
    name: "Injectables",
    title: "Sterile Injectables",
    description: "High-purity sterile liquid and dry powder injectables produced under strict aseptic environmental controls.",
    points: [
      "Class 100 cleanroom manufacturing",
      "Endotoxin free testing",
      "Rapid systemic onset"
    ],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "nutraceuticals",
    name: "Nutraceuticals",
    title: "Nutraceuticals & Vitamins",
    description: "Essential multivitamins, dietary minerals, and wellness supplements supporting holistic daily health.",
    points: [
      "High potency active ingredients",
      "Enhanced nutrient absorption",
      "Daily vitality & immunity support"
    ],
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "anti-allergic",
    name: "Anti-Allergic",
    title: "Anti-Allergic & Respiratory",
    description: "Fast-acting antihistamines and anti-inflammatory respiratory formulations for allergy relief.",
    points: [
      "Non-drowsy options available",
      "Quick seasonal allergy relief",
      "Targeted symptom control"
    ],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "inflammatory",
    name: "Inflammatory",
    title: "Anti-Inflammatory & Analgesics",
    description: "Targeted pain management and anti-inflammatory therapies for musculoskeletal and joint conditions.",
    points: [
      "Rapid onset pain relief",
      "Gastro-protective buffering",
      "Proven safety profile"
    ],
    image: "https://images.unsplash.com/photo-1550572017-edf97d545893?w=800&auto=format&fit=crop&q=80"
  }
];

export default function About() {
  const { settings } = useOutletContext() || {};
  const [activeSegmentIndex, setActiveSegmentIndex] = React.useState(0);
  const [activeFilter, setActiveFilter] = React.useState("All");
  const [showCertModal, setShowCertModal] = React.useState(false);

  const activeSegment = THERAPEUTIC_SEGMENTS_DATA[activeSegmentIndex];

  // Preload background images if available
  useEffect(() => {
    if (!settings) return;
    const bgImages = [
      settings.about_hero_bg_image_url,
      settings.about_journey_bg_image_url,
      settings.about_purpose_bg_image_url,
      settings.about_quality_bg_image_url,
      settings.about_expertise_bg_image_url,
      settings.about_cta_bg_image_url,
      settings.about_hero_image_url,
      settings.about_journey_image_url,
    ].filter(Boolean);

    bgImages.forEach((img) => {
      const i = new Image();
      i.src = fileUrl(img);
    });
  }, [settings]);

  // Parse therapeutic segment tags
  const defaultTags = "Gastroenterology, Antibacterials, Anti-Allergic, Injectables, Dermatological, Pediatric Care, Nutraceuticals, Pain Management";
  const segmentList = (settings?.about_expertise_tags || defaultTags)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const showRightImage = settings?.about_hero_image_active !== false;
  const showPopupBadge = settings?.about_hero_badge_active !== false;

  // Title formatter to highlight "Better Health" in green if present
  const rawTitle = settings?.about_hero_title || "Driven by Science. Built on Trust. Focused on Better Health.";
  const renderFormattedTitle = () => {
    if (rawTitle.includes("Better Health")) {
      const parts = rawTitle.split("Better Health");
      return (
        <>
          {parts[0]}
          <span className="text-[#7FA60F]">Better Health</span>
          {parts[1]}
        </>
      );
    }
    return rawTitle;
  };

  return (
    <>
      {/* ──────────────── 1. ABOUT HERO BANNER ──────────────── */}
      <section
        className="w-full py-16 lg:py-24 relative overflow-hidden bg-[#F8FAF4]"
        style={{
          background: settings?.about_hero_bg_color || "#F8FAF4",
          backgroundImage: settings?.about_hero_bg_image_url ? `url(${fileUrl(settings.about_hero_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="about-hero"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className={showRightImage ? "lg:col-span-6 space-y-6" : "lg:col-span-12 space-y-6"}>
              {/* Overline Tag */}
              <div className="overline text-[#7FA60F] font-bold tracking-widest text-xs uppercase">
                {settings?.about_hero_overline || "ABOUT US"}
              </div>

              {/* Major Display Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight leading-[1.15]"
              >
                {renderFormattedTitle()}
              </motion.h1>

              {/* Subtitle / Paragraph Description */}
              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                {settings?.about_hero_subtitle ||
                  "With over 7 years of experience, Wellicon Pharmaceuticals delivers quality generic and OTC healthcare solutions designed around the evolving needs of doctors, patients and healthcare providers."}
              </p>

              {/* Explore Products Button */}
              <div className="pt-2">
                <Link
                  to={settings?.about_hero_btn_link || "/products"}
                  className="bg-[#7FA60F] hover:bg-[#6e920d] text-white font-semibold rounded-full px-7 py-3.5 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 text-sm"
                  data-testid="hero-explore-products"
                >
                  <span>{settings?.about_hero_btn_text || "Explore Our Products"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 3 Bottom Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-100/80 text-[#7FA60F] flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-display font-bold text-slate-900 leading-tight">
                      {settings?.about_stat1_value || "7+"}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 leading-snug">
                      {settings?.about_stat1_label || "Years of Excellence"}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-100/80 text-[#7FA60F] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-display font-bold text-slate-900 leading-tight">
                      {settings?.about_stat2_value || "200+"}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 leading-snug">
                      {settings?.about_stat2_label || "Healthcare Partners"}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-100/80 text-[#7FA60F] flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-display font-bold text-slate-900 leading-tight">
                      {settings?.about_stat3_value || "Pan-India"}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 leading-snug">
                      {settings?.about_stat3_label || "Distribution Network"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Main Image & Pop-up Badge */}
            {showRightImage && (
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 aspect-[4/3] lg:aspect-auto lg:h-[480px]">
                  <img
                    src={
                      settings?.about_hero_image_url
                        ? fileUrl(settings.about_hero_image_url)
                        : "https://static.prod-images.emergentagent.com/jobs/83ef7e25-6729-485c-a277-13adf6b5bae2/images/c8e9ea12b401d8b4340e8a29134972a32009a205b35612418ecc97cafd2086c2.png"
                    }
                    alt="Wellicon Building"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Floating Pop-Up Badge Card */}
                {showPopupBadge && (
                  <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-xl flex items-center gap-3 max-w-xs">
                    <div className="w-11 h-11 rounded-xl bg-lime-100 text-[#7FA60F] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        {settings?.about_hero_badge_text || "WHO-GMP Certified"}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">Quality & Compliance Assured</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ──────────────── 2. OUR STORY & TIMELINE ──────────────── */}
      <section
        className="w-full py-20 lg:py-28 relative overflow-hidden bg-white"
        style={{
          background: settings?.about_journey_bg_color || "#FFFFFF",
          backgroundImage: settings?.about_journey_bg_image_url ? `url(${fileUrl(settings.about_journey_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="about-journey"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          {/* Header Layout: Title Left, Paragraph Right */}
          <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
            <div className="lg:col-span-6 space-y-3">
              <div className="overline text-[#7FA60F] font-bold tracking-widest text-xs uppercase">
                {settings?.about_journey_overline || "OUR STORY"}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                {settings?.about_journey_title || "A Journey of Commitment and Growth"}
              </h2>
            </div>

            <div className="lg:col-span-6">
              <p className="text-base text-slate-600 leading-relaxed pt-2">
                {settings?.about_journey_body ||
                  "From our beginnings to becoming a trusted name in the pharmaceutical industry, our journey has been guided by innovation, quality, and a deep commitment to health and well-being."}
              </p>
            </div>
          </div>

          {/* Timeline Layout matching Mockup */}
          <div className="relative pt-6 pb-4">
            {/* Horizontal Timeline Line connecting nodes */}
            <div className="hidden md:block absolute top-[52px] left-[6%] right-[6%] h-[2px] bg-gradient-to-r from-lime-200 via-[#7FA60F] to-lime-200 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 rounded-full bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-[#7FA60F] group-hover:text-white transition-all duration-300 relative z-10">
                  <Sprout className="w-7 h-7" />
                </div>

                <div className="w-3.5 h-3.5 rounded-full bg-[#7FA60F] border-2 border-white shadow-xs hidden md:block" />

                <div className="space-y-1.5 pt-1">
                  <div className="text-sm font-bold text-[#7FA60F]">
                    {settings?.about_story_m1_year || "2017"}
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-900">
                    {settings?.about_story_m1_title || "The Beginning"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {settings?.about_story_m1_desc ||
                      "Wellicon Pharmaceuticals was founded with a vision to make quality healthcare accessible to all."}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 rounded-full bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-[#7FA60F] group-hover:text-white transition-all duration-300 relative z-10">
                  <TrendingUp className="w-7 h-7" />
                </div>

                <div className="w-3.5 h-3.5 rounded-full bg-[#7FA60F] border-2 border-white shadow-xs hidden md:block" />

                <div className="space-y-1.5 pt-1">
                  <div className="text-sm font-bold text-[#7FA60F]">
                    {settings?.about_story_m2_year || "2019"}
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-900">
                    {settings?.about_story_m2_title || "Expanding Horizons"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {settings?.about_story_m2_desc ||
                      "Strengthened our product portfolio and entered new therapeutic segments."}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 rounded-full bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-[#7FA60F] group-hover:text-white transition-all duration-300 relative z-10">
                  <ShieldCheck className="w-7 h-7" />
                </div>

                <div className="w-3.5 h-3.5 rounded-full bg-[#7FA60F] border-2 border-white shadow-xs hidden md:block" />

                <div className="space-y-1.5 pt-1">
                  <div className="text-sm font-bold text-[#7FA60F]">
                    {settings?.about_story_m3_year || "2022"}
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-900">
                    {settings?.about_story_m3_title || "Strengthening Quality"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {settings?.about_story_m3_desc ||
                      "Achieved WHO-GMP certification and enhanced our quality management systems."}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 rounded-full bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-[#7FA60F] group-hover:text-white transition-all duration-300 relative z-10">
                  <Users className="w-7 h-7" />
                </div>

                <div className="w-3.5 h-3.5 rounded-full bg-[#7FA60F] border-2 border-white shadow-xs hidden md:block" />

                <div className="space-y-1.5 pt-1">
                  <div className="text-sm font-bold text-[#7FA60F]">
                    {settings?.about_story_m4_year || "Today"}
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-900">
                    {settings?.about_story_m4_title || "Growing Together"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {settings?.about_story_m4_desc ||
                      "Continuously expanding our reach and building healthier communities across India."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 3. OUR PURPOSE (MISSION & VISION MATCHING MOCKUP) ──────────────── */}
      <section
        className="w-full py-20 lg:py-28 relative overflow-hidden bg-[#F8FAF4]"
        style={{
          background: settings?.about_purpose_bg_color || "#F8FAF4",
          backgroundImage: settings?.about_purpose_bg_image_url ? `url(${fileUrl(settings.about_purpose_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="about-purpose"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left Title Area */}
            <div className="lg:col-span-4 space-y-3">
              <div className="overline text-[#7FA60F] font-bold tracking-widest text-xs uppercase">
                {settings?.about_purpose_overline || "OUR PURPOSE"}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                {settings?.about_purpose_title || "Our Mission and Vision"}
              </h2>
            </div>

            {/* Right Cards Area */}
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
              {/* Mission Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-b-4 border-b-[#7FA60F]">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="overline text-[#7FA60F] font-bold tracking-widest text-xs uppercase">
                    {settings?.about_mission_overline || "OUR MISSION"}
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 leading-snug">
                    {settings?.about_mission_title ||
                      "To deliver innovative, affordable and trusted pharmaceutical solutions that improve lives."}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {settings?.about_mission_body ||
                      "We are dedicated to combining innovation, research, and compassion to meet the evolving healthcare needs of patients and communities worldwide."}
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-b-4 border-b-[#7FA60F]">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center shrink-0">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div className="overline text-[#7FA60F] font-bold tracking-widest text-xs uppercase">
                    {settings?.about_vision_overline || "OUR VISION"}
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 leading-snug">
                    {settings?.about_vision_title ||
                      "To be recognised globally as a benchmark for quality, integrity and innovation in pharmaceuticals."}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {settings?.about_vision_body ||
                      "We aim to empower healthcare professionals and patients with reliable formulations across every therapeutic segment."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 4. OUR PROMISE OF QUALITY AND CARE ──────────────── */}
      <section
        className="w-full py-20 lg:py-28 relative overflow-hidden bg-white"
        style={{
          background: settings?.about_promise_bg_color || "#FFFFFF",
          backgroundImage: settings?.about_promise_bg_image_url ? `url(${fileUrl(settings.about_promise_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="about-promise"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left Title Area */}
            <div className="lg:col-span-4 space-y-3">
              <div className="overline text-[#7FA60F] font-bold tracking-widest text-xs uppercase">
                {settings?.about_promise_overline || "WHAT OUR CUSTOMERS CAN COUNT ON"}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                {settings?.about_promise_title || "Our Promise of Quality and Care"}
              </h2>
            </div>

            {/* 4 Cards Grid Right Area */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Quality Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-slate-900">
                    {settings?.about_promise_c1_title || "Quality"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {settings?.about_promise_c1_desc ||
                      "Consistent quality standards across every step of manufacturing and delivery."}
                  </p>
                </div>
              </div>

              {/* Affordability Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center shrink-0">
                    <Tag className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-slate-900">
                    {settings?.about_promise_c2_title || "Affordability"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {settings?.about_promise_c2_desc ||
                      "Cost-effective products that ensure healthcare remains accessible to all."}
                  </p>
                </div>
              </div>

              {/* Innovation Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center shrink-0">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-slate-900">
                    {settings?.about_promise_c3_title || "Innovation"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {settings?.about_promise_c3_desc ||
                      "Continuous improvement through research and advanced manufacturing capabilities."}
                  </p>
                </div>
              </div>

              {/* Trust Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center shrink-0">
                    <Handshake className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-slate-900">
                    {settings?.about_promise_c4_title || "Trust"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {settings?.about_promise_c4_desc ||
                      "Built strong relationships through transparency, ethics, and reliability."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 5. CERTIFICATIONS & REGISTRATION (MATCHING MOCKUP) ──────────────── */}
      <section
        className="w-full py-20 lg:py-28 relative overflow-hidden bg-white"
        style={{
          background: settings?.about_cert_bg_color || "#FFFFFF",
          backgroundImage: settings?.about_cert_bg_image_url ? `url(${fileUrl(settings.about_cert_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="about-certifications"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="overline text-[#7FA60F] font-bold tracking-widest text-xs uppercase">
                  {settings?.about_cert_overline || "QUALITY THAT YOU CAN TRUST"}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                  {settings?.about_cert_title || "Certified for Your Safety and Well-being"}
                </h2>
                <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                  {settings?.about_cert_subtitle ||
                    "Our global certifications ensure that every product we deliver meets the highest standards of quality, safety, and efficacy."}
                </p>
              </div>

              {/* Action Button & 4 Circular Badges */}
              <div className="space-y-8">
                <div>
                  <Link
                    to={settings?.about_cert_btn_link || "#certifications"}
                    onClick={(e) => {
                      if (!settings?.about_cert_btn_link || settings?.about_cert_btn_link === "#certifications") {
                        e.preventDefault();
                        setShowCertModal(true);
                      }
                    }}
                    className="inline-flex items-center gap-2 bg-[#F4F9E8] hover:bg-[#7FA60F] text-[#7FA60F] hover:text-white border border-[#7FA60F]/40 font-semibold rounded-full px-6 py-2.5 text-xs tracking-wide transition-all duration-300 shadow-xs"
                  >
                    {settings?.about_cert_btn_text || "View All Certifications"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* 4 Badges Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="flex flex-col items-center text-center space-y-2 group">
                    <div className="w-14 h-14 rounded-full bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#7FA60F] group-hover:text-white transition-all duration-300">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900">
                        {settings?.about_cert_b1_title || "WHO-GMP"}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {settings?.about_cert_b1_sub || "Certified"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-2 group">
                    <div className="w-14 h-14 rounded-full bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#7FA60F] group-hover:text-white transition-all duration-300">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900">
                        {settings?.about_cert_b2_title || "ISO 9001:2015"}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {settings?.about_cert_b2_sub || "Certified"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-2 group">
                    <div className="w-14 h-14 rounded-full bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#7FA60F] group-hover:text-white transition-all duration-300">
                      <Star className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900">
                        {settings?.about_cert_b3_title || "Quality"}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {settings?.about_cert_b3_sub || "Assurance"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-2 group">
                    <div className="w-14 h-14 rounded-full bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#7FA60F] group-hover:text-white transition-all duration-300">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900">
                        {settings?.about_cert_b4_title || "Safety &"}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {settings?.about_cert_b4_sub || "Compliance"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Certificate Frame & Lightbox Button */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative p-3 rounded-3xl bg-white border-2 border-lime-200/90 shadow-xl max-w-sm w-full group">
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 relative">
                  <img
                    src={
                      settings?.about_cert_image_url
                        ? fileUrl(settings.about_cert_image_url)
                        : "https://static.prod-images.emergentagent.com/jobs/83ef7e25-6729-485c-a277-13adf6b5bae2/images/c8e9ea12b401d8b4340e8a29134972a32009a205b35612418ecc97cafd2086c2.png"
                    }
                    alt="Certificate of Registration"
                    className="w-full h-auto object-cover rounded-2xl group-hover:scale-102 transition-transform duration-500"
                  />
                </div>

                {/* Floating Lightbox Zoom Button */}
                <button
                  type="button"
                  onClick={() => setShowCertModal(true)}
                  className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-white border border-lime-200 text-[#7FA60F] shadow-lg flex items-center justify-center hover:bg-[#7FA60F] hover:text-white transition-all duration-300 cursor-pointer"
                  title="Zoom Certificate"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 6. THERAPEUTIC EXPERTISE (MATCHING MOCKUP) ──────────────── */}
      <section
        className="w-full py-20 lg:py-28 relative overflow-hidden bg-[#F8FAF4]"
        style={{
          background: settings?.about_segment_bg_color || "#F8FAF4",
          backgroundImage: settings?.about_segment_bg_image_url ? `url(${fileUrl(settings.about_segment_bg_image_url)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="about-expertise"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 space-y-12">
          {/* Header & Horizontal Scrollable Category Filter Pills */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-3 lg:max-w-md">
              <div className="overline text-[#7FA60F] font-bold tracking-widest text-xs uppercase">
                {settings?.about_segment_overline || "THERAPEUTIC EXPERTISE"}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                {settings?.about_segment_title || "Wide Range of Therapeutic Segments"}
              </h2>
            </div>

            {/* Filter Pills Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("All");
                  setActiveSegmentIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeFilter === "All"
                    ? "bg-[#7FA60F] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:border-lime-300"
                }`}
              >
                All
              </button>
              {THERAPEUTIC_SEGMENTS_DATA.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(item.name);
                    setActiveSegmentIndex(idx);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeSegmentIndex === idx
                      ? "bg-[#7FA60F] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:border-lime-300"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Segment Interactive Showcase Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm grid lg:grid-cols-12 gap-8 items-center relative">
            {/* Left Image */}
            <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-slate-100 shadow-xs h-64 sm:h-72">
              <img
                src={activeSegment.image}
                alt={activeSegment.title}
                className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Right Details */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-bold text-slate-900">
                  {activeSegment.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeSegment.description}
                </p>

                {/* Bullet Points */}
                <div className="space-y-2 pt-1">
                  {activeSegment.points.map((pt, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-[#F4F9E8] text-[#7FA60F] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Buttons Row: Explore Button Left, Prev/Next Arrows Right */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Link
                  to={`/products?category=${encodeURIComponent(activeSegment.name)}`}
                  className="inline-flex items-center gap-2 bg-[#7FA60F] hover:bg-[#6C8E0D] text-white font-semibold rounded-full px-6 py-2.5 text-xs transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Explore Products <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Circular Slider Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSegmentIndex((prev) => (prev === 0 ? THERAPEUTIC_SEGMENTS_DATA.length - 1 : prev - 1))
                    }
                    className="w-10 h-10 rounded-full bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center hover:bg-[#7FA60F] hover:text-white transition-all duration-300 cursor-pointer"
                    title="Previous Segment"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSegmentIndex((prev) => (prev === THERAPEUTIC_SEGMENTS_DATA.length - 1 ? 0 : prev + 1))
                    }
                    className="w-10 h-10 rounded-full bg-[#F4F9E8] border border-lime-200/80 text-[#7FA60F] flex items-center justify-center hover:bg-[#7FA60F] hover:text-white transition-all duration-300 cursor-pointer"
                    title="Next Segment"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── CERTIFICATE ZOOM LIGHTBOX MODAL ──────────────── */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-slate-900 text-lg">
                Certificate of Registration (WHO-GMP / ISO)
              </h3>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl max-h-[75vh] flex justify-center bg-slate-50 border border-slate-200">
              <img
                src={
                  settings?.about_cert_image_url
                    ? fileUrl(settings.about_cert_image_url)
                    : "https://static.prod-images.emergentagent.com/jobs/83ef7e25-6729-485c-a277-13adf6b5bae2/images/c8e9ea12b401d8b4340e8a29134972a32009a205b35612418ecc97cafd2086c2.png"
                }
                alt="Certificate Document"
                className="max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── 7. GET IN TOUCH CTA (MATCHING MOCKUP - FULL SCREEN WIDTH BG) ──────────────── */}
      <section
        className="w-full relative overflow-hidden text-white group"
        style={{
          background: settings?.about_cta_bg_color
            ? settings.about_cta_bg_color
            : "linear-gradient(135deg, #1F3A10 0%, #3B6323 50%, #5B8933 100%)",
        }}
        data-testid="about-cta"
      >
        {/* Edge-to-Edge Full Screen Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img
            src={
              settings?.about_cta_bg_image_url
                ? fileUrl(settings.about_cta_bg_image_url)
                : "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&auto=format&fit=crop&q=80"
            }
            alt="Background Formulations"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000"
          />
          {/* Gradient Dark Overlay for 100% Text Visibility & High Contrast */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#152B0B]/95 via-[#254617]/85 to-[#3D6623]/70 backdrop-brightness-90" />
        </div>

        {/* Content Container aligned with site grid max-w-7xl */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 sm:py-20 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Headline & Subtitle with Crisp High Visibility */}
          <div className="space-y-3 lg:max-w-2xl text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight drop-shadow-md">
              {settings?.about_cta_title || "Building Better Health, Together."}
            </h2>
            <p className="text-sm sm:text-base text-white/95 leading-relaxed font-medium drop-shadow-xs">
              {settings?.about_cta_subtitle ||
                "From quality formulations to trusted partnerships, our journey continues with one goal – delivering healthcare solutions that make a meaningful difference."}
            </p>
          </div>

          {/* Right Dual Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {/* Button 1: Solid White Pill */}
            <Link
              to={settings?.about_cta_btn1_link || "/products"}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-[#2B4B1B] font-bold rounded-full px-7 py-3.5 text-xs sm:text-sm transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              <span>{settings?.about_cta_btn1_text || "Explore Our Products"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Button 2: Outline Pill */}
            <Link
              to={settings?.about_cta_btn_link || "/contact"}
              className="inline-flex items-center gap-2 border-2 border-white/80 bg-black/20 hover:bg-white/20 text-white font-bold rounded-full px-7 py-3.5 text-xs sm:text-sm transition-all duration-300 backdrop-blur-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              data-testid="about-cta-button"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{settings?.about_cta_btn_text || "Get in Touch"}</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
