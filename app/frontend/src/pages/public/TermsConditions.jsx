import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ShieldCheck, ChevronRight, FileText } from "lucide-react";

export default function TermsConditions() {
  const { settings } = useOutletContext() || {};

  const defaultContent = `
    <h1>Terms & Conditions</h1>
    <p>Welcome to <strong>Wellicon Pharmaceuticals</strong>. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>
    
    <h2>1. General Information</h2>
    <p>Wellicon Pharmaceuticals provides information regarding generic and OTC pharmaceutical products for general awareness and educational purposes. Content provided on this website does not constitute medical advice or diagnosis.</p>
    
    <h2>2. Intellectual Property</h2>
    <p>All trademarks, logos, texts, graphics, and product names on this website are the property of Wellicon Pharmaceuticals. Unauthorized reproduction or commercial use without express written permission is strictly prohibited.</p>
    
    <h2>3. Product Information & Disclaimer</h2>
    <p>Product details, compositions, and therapeutic specifications are subject to regulatory standards and healthcare provider discretion. Patients should consult qualified medical practitioners prior to consuming any pharmaceutical product.</p>
    
    <h2>4. Limitation of Liability</h2>
    <p>Wellicon Pharmaceuticals shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our website or reliance on information provided herein.</p>
    
    <h2>5. Governing Law</h2>
    <p>These terms and conditions are governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Chandigarh, India.</p>
  `;

  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-[#7FA60F] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Terms & Conditions</span>
        </div>

        {/* Page Hero Title Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F9E8] border border-lime-200 text-[#7FA60F] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            {settings?.terms_title || "Terms & Conditions"}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Main Formatted Rich Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
          <article
            className="prose prose-slate prose-headings:font-display prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:text-slate-900 prose-h2:mt-8 prose-h2:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-sm prose-strong:text-slate-900 max-w-none"
            dangerouslySetInnerHTML={{ __html: settings?.terms_content || defaultContent }}
          />
        </div>

        {/* Contact Footer Note */}
        <div className="bg-[#F4F9E8] border border-lime-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-900">Have questions regarding our terms?</div>
            <div className="text-xs text-slate-600">Our customer support team is here to help with any inquiries.</div>
          </div>
          <Link
            to="/contact"
            className="bg-[#7FA60F] hover:bg-[#6C8E0D] text-white font-semibold rounded-full px-6 py-2.5 text-xs transition-all shadow-xs shrink-0"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
