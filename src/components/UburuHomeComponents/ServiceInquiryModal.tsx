import React, { useState } from "react";
import { X, CheckCircle2, Phone, MessageSquare, Mail, Calendar, Clock, Wrench } from "lucide-react";
import Button from "../shared/Button";
import { type HomeCategoryItem } from "../../data/homeCategories";

interface ServiceInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: HomeCategoryItem | null;
}

export const ServiceInquiryModal: React.FC<ServiceInquiryModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate booking submission
    setSubmitted(true);
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello Uburu Home, I would like to inquire about "${service.name}".\nName: ${name || "Client"}\nPhone: ${phone || "N/A"}\nNotes: ${notes || "Standard inquiry"}`
    );
    window.open(`https://wa.me/254714138139?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl text-neutral-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full bg-neutral-100 border border-neutral-200 p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50 border border-yellow-300 text-amber-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-neutral-900">Service Request Received!</h3>
            <p className="mt-3 text-sm text-neutral-600 max-w-md mx-auto">
              Thank you, <span className="text-amber-800 font-bold">{name || "Valued Client"}</span>. Our service dispatch team will contact you within 2 hours to confirm details for <span className="text-neutral-900 font-semibold">{service.name}</span>.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                onClick={handleWhatsAppInquiry}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp Now
              </Button>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl border border-neutral-200"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 border border-yellow-300 text-amber-800">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-800">
                  Uburu Services Dispatch
                </span>
                <h3 className="text-xl font-black text-neutral-900 leading-tight mt-0.5">
                  {service.name}
                </h3>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs text-neutral-600 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-700">
                <span className="rounded-lg bg-yellow-50 border border-yellow-300 px-2.5 py-1 text-amber-900">
                  Estimated Base: KES {service.price.toLocaleString("en-KE")} {service.unit ? `(${service.unit})` : ""}
                </span>
                <span className="inline-flex items-center gap-1 text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Fast Response (Within 2 hrs)
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Mwangi"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +254 7XX XXX XXX"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jane@example.com"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Preferred Date & Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      placeholder="e.g. Tomorrow 10:00 AM"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                    <Calendar className="absolute right-3.5 top-3.5 h-4 w-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Job Description / Specific Location Details
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe what needs fixing, apartment size, area (e.g., Kilimani, Westlands, Rongai), or any specific requirements..."
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-[0.2em] py-3.5 rounded-xl shadow-md"
                >
                  Confirm Service Request
                </Button>
                <Button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp Direct
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-neutral-400">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600" /> +254 714 138 139
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-600" /> info@uburumultimotive.org
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
