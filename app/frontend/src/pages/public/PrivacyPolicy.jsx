import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ShieldCheck, ChevronRight, Lock } from "lucide-react";

export default function PrivacyPolicy() {
  const { settings } = useOutletContext() || {};

  const defaultContent = `
    <h1>Privacy Policy</h1>
    <p>At <strong>Wellicon Pharmaceuticals</strong>, protecting your privacy and personal data is our utmost priority. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website.</p>
    
    <h2>1. Information We Collect</h2>
    <p>We may collect personal information that you voluntarily provide to us when submitting inquiries, contact forms, or franchise applications, including your name, email address, phone number, and organization details.</p>
    
    <h2>2. How We Use Your Information</h2>
    <p>Information collected is strictly used to process your inquiries, provide customer support, improve our website functionality, and communicate relevant product updates or franchise opportunities.</p>
    
    <h2>3. Data Protection & Security</h2>
    <p>We implement robust administrative, technical, and physical security measures to prevent unauthorized access, alteration, or disclosure of your personal data.</p>
    
    <h2>4. Third-Party Sharing</h2>
    <p>Wellicon Pharmaceuticals does not sell, trade, or rent personal information to third parties. We may share information only with authorized service providers who assist us in operating our services under strict confidentiality agreements.</p>
    
    <h2>5. Contact Us</h2>
    <p>If you have any questions or concerns regarding this Privacy Policy, please contact us at info@welliconpharma.com.</p>
  `;

  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-[#7FA60F] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Privacy Policy</span>
        </div>

        {/* Page Hero Title Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F9E8] border border-lime-200 text-[#7FA60F] flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            {settings?.privacy_title || "Privacy Policy"}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Main Formatted Rich Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
          <article
            className="prose prose-slate prose-headings:font-display prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:text-slate-900 prose-h2:mt-8 prose-h2:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-sm prose-strong:text-slate-900 max-w-none"
            dangerouslySetInnerHTML={{ __html: settings?.privacy_content || defaultContent }}
          />
        </div>

        {/* Contact Footer Note */}
        <div className="bg-[#F4F9E8] border border-lime-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-900">Have questions about your privacy?</div>
            <div className="text-xs text-slate-600">Reach out to our compliance officer for any data requests.</div>
          </div>
          <Link
            to="/contact"
            className="bg-[#7FA60F] hover:bg-[#6C8E0D] text-white font-semibold rounded-full px-6 py-2.5 text-xs transition-all shadow-xs shrink-0"
          >
            Contact Privacy Team
          </Link>
        </div>
      </div>
    </div>
  );
}
