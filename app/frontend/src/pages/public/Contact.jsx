import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function Contact() {
  const { settings } = useOutletContext() || {};
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: params.get("product") ? `Inquiry: ${params.get("product")}` : "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.get("product")) {
      setForm((f) => ({ ...f, subject: `Inquiry: ${params.get("product")}` }));
    }
  }, [params]);

  const handleChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/inquiries", form);
      toast.success(settings?.contact_success || "Thank you! We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20" data-testid="contact-page">
      <div className="overline mb-3">{settings?.contact_overline || "CONTACT US"}</div>
      <h1 className="text-4xl sm:text-5xl font-display font-light text-slate-900 tracking-tight mb-12">
        {settings?.contact_title || "Get in touch with us"}
      </h1>

      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <p className="text-lg text-slate-600 leading-relaxed mb-10 whitespace-pre-line">
            {settings?.contact_intro ||
              "Whether you're a healthcare professional, distributor, or partner — we'd love to hear from you."}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-sky-50 text-sky-700 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  {settings?.contact_label_address || "Address"}
                </div>
                <div className="text-base text-slate-900 mt-1">{settings?.contact_address}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-sky-50 text-sky-700 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  {settings?.contact_label_email || "Email"}
                </div>
                <a
                  href={`mailto:${settings?.contact_email}`}
                  className="text-base text-slate-900 hover:text-sky-700 mt-1 block"
                >
                  {settings?.contact_email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-sky-50 text-sky-700 rounded-lg flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  {settings?.contact_label_phone || "Phone"}
                </div>
                <a
                  href={`tel:${settings?.contact_phone}`}
                  className="text-base text-slate-900 hover:text-sky-700 mt-1 block"
                >
                  {settings?.contact_phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
          data-testid="contact-form"
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {settings?.contact_form_name || "Full Name *"}
              </label>
              <input
                required
                value={form.name}
                onChange={handleChange("name")}
                data-testid="contact-name"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {settings?.contact_form_email || "Email *"}
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                data-testid="contact-email"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {settings?.contact_form_phone || "Phone"}
              </label>
              <input
                value={form.phone}
                onChange={handleChange("phone")}
                data-testid="contact-phone"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {settings?.contact_form_subject || "Subject"}
              </label>
              <input
                value={form.subject}
                onChange={handleChange("subject")}
                data-testid="contact-subject"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {settings?.contact_form_message || "Message *"}
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={handleChange("message")}
              data-testid="contact-message"
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            data-testid="contact-submit"
            className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-600 disabled:opacity-50 text-white rounded-md px-6 py-3 text-sm font-medium transition-colors"
          >
            <Send className="w-4 h-4" />
            {submitting
              ? settings?.contact_form_submitting || "Sending…"
              : settings?.contact_form_submit || "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
