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
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-yellow-500/30 bg-neutral-950 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full bg-neutral-900 border border-white/10 p-2 text-white/70 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-white">Service Request Received!</h3>
            <p className="mt-3 text-sm text-white/70 max-w-md mx-auto">
              Thank you, <span className="text-yellow-300 font-bold">{name || "Valued Client"}</span>. Our service dispatch team will contact you within 2 hours to confirm details for <span className="text-white font-semibold">{service.name}</span>.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                onClick={handleWhatsAppInquiry}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-xl flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp Now
              </Button>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400">
                  Uburu Services Dispatch
                </span>
                <h3 className="text-xl font-black text-white leading-tight mt-0.5">
                  {service.name}
                </h3>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs text-white/80 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-yellow-200/90">
                <span className="rounded-lg bg-yellow-400/15 border border-yellow-400/30 px-2.5 py-1 text-yellow-300">
                  Estimated Base: KES {service.price.toLocaleString("en-KE")} {service.unit ? `(${service.unit})` : ""}
                </span>
                <span className="inline-flex items-center gap-1 text-white/60">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" /> Fast Response (Within 2 hrs)
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-yellow-200/80 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Mwangi"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-yellow-200/80 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +254 7XX XXX XXX"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-yellow-200/80 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jane@example.com"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-yellow-200/80 mb-1.5">
                    Preferred Date & Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      placeholder="e.g. Tomorrow 10:00 AM"
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                    <Calendar className="absolute right-3.5 top-3.5 h-4 w-4 text-white/40 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-yellow-200/80 mb-1.5">
                  Job Description / Specific Location Details
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe what needs fixing, apartment size, area (e.g., Kilimani, Westlands, Rongai), or any specific requirements..."
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-[0.2em] py-3.5 rounded-xl shadow-lg"
                >
                  Confirm Service Request
                </Button>
                <Button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp Direct
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-white/50">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-yellow-400" /> +254 714 138 139
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-yellow-400" /> info@uburumultimotive.org
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
