import {
  ArrowRight,
  Handshake,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { useState } from "react";
import Button from "../shared/Button";

const PartnerFormSection = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setStatusMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Collect all fields for the formspree submission
    const submitData = new FormData();
    formData.forEach((value, key) => {
      if (key === 'areasOfInterest' || key === 'supportType') {
        // Handle checkboxes later or just let them append
      } else {
        submitData.set(key, value);
      }
    });

    // Special handling for checkboxes to join them into strings
    const areasOfInterest = formData.getAll("areasOfInterest").join(", ");
    const supportType = formData.getAll("supportType").join(", ");
    
    submitData.set("areasOfInterest", areasOfInterest);
    submitData.set("supportType", supportType);
    submitData.set("_subject", "New Partnership Application");

    try {
      const response = await fetch(import.meta.env.VITE_FORMSPREE_PARTNER_URL || "https://formspree.io/f/xpqjaolz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: submitData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const errorMessage =
          data?.error ||
          data?.errors?.map?.((e: { message?: string }) => e?.message).filter(Boolean).join(", ") ||
          "Unable to submit the form.";
        throw new Error(errorMessage);
      }

      setStatus("sent");
      setStatusMessage(
        "Application submitted successfully! Our team will contact you shortly.",
      );
      form.reset();
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to submit the form.",
      );
    }
  };

  return (
    <section className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Handshake className="w-3 h-3" />
                Partner With Us
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">
                Become a <span className="text-yellow-500">Partner</span>
              </h1>
              <p className="text-gray-500 text-lg font-medium">
                Thank you for your interest in partnering with our NGO. Please fill out the form below and our team will contact you shortly.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] border border-neutral-100 bg-neutral-50">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-100 p-3 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-neutral-900">
                  Our Commitment
                </h3>
              </div>
              <p className="text-neutral-600 font-semibold text-sm">
                We value every partnership and are committed to creating lasting community impact together through transparency, collaboration, and shared goals.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-neutral-950 text-white shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-400 p-3 rounded-2xl">
                  <Building2 className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight">
                  Who Can Partner?
                </h3>
              </div>
              <ul className="space-y-3 text-sm font-semibold text-neutral-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                  Individuals & Professionals
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                  Corporations & Businesses
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                  NGOs & Schools
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                  Faith-Based Organizations
                </li>
              </ul>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <form 
              onSubmit={handleFormSubmit} 
              action={import.meta.env.VITE_FORMSPREE_PARTNER_URL || "https://formspree.io/f/xpqjaolz"}
              method="POST"
              className="space-y-10"
            >
              {/* Section 1: Personal / Organization Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <span className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">1</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-neutral-900">Personal / Organization Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name*"
                    required
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                  />
                  <input
                    type="text"
                    name="organizationName"
                    placeholder="Organization / Company Name"
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="position"
                    placeholder="Position / Role"
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                    required
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number*"
                    required
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Country & City*"
                    required
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                  />
                </div>
                <input
                  type="text"
                  name="socialLinks"
                  placeholder="Website or Social Media Links"
                  className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                />
              </div>

              {/* Section 2: Partnership Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <span className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">2</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-neutral-900">Partnership Information</h3>
                </div>
                
                <div className="bg-neutral-50 border border-neutral-100 rounded-[1.5rem] p-8">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">What type of partner are you?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm font-bold text-neutral-700">
                    {[
                      "Individual", "Business/Company", "NGO/Community Organization", 
                      "School/University", "Faith-Based Organization", 
                      "Healthcare Professional", "Volunteer", "Other"
                    ].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="partnerType" 
                          value={type} 
                          required
                          className="w-5 h-5 accent-yellow-400"
                        />
                        <span className="group-hover:text-black transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Areas of Interest */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <span className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">3</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-neutral-900">Areas of Interest</h3>
                </div>
                
                <div className="bg-neutral-50 border border-neutral-100 rounded-[1.5rem] p-8">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Which programs would you like to support?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold text-neutral-700">
                    {[
                      "Homeless Support", "Mental Health Programs", "Community Feeding Initiatives",
                      "Shelter Support", "Women Empowerment Programs", "Youth Programs",
                      "Therapy & Wellness Programs", "Fundraising Campaigns", "Other"
                    ].map((area) => (
                      <label key={area} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          name="areasOfInterest" 
                          value={area} 
                          className="w-5 h-5 accent-yellow-400 rounded"
                        />
                        <span className="group-hover:text-black transition-colors">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 4: Type of Support */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <span className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">4</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-neutral-900">Type of Support</h3>
                </div>
                
                <div className="bg-neutral-50 border border-neutral-100 rounded-[1.5rem] p-8">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">How would you like to offer support?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold text-neutral-700">
                    {[
                      "Financial Support/Sponsorship", "Volunteering", "Professional Services",
                      "Donations/In-Kind Support", "Training & Workshops", "Media/Publicity Support",
                      "Event Collaboration", "Other"
                    ].map((support) => (
                      <label key={support} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          name="supportType" 
                          value={support} 
                          className="w-5 h-5 accent-yellow-400 rounded"
                        />
                        <span className="group-hover:text-black transition-colors">{support}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 5: Additional Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <span className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">5</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-neutral-900">Additional Information</h3>
                </div>
                
                <div className="space-y-4">
                  <textarea
                    name="whyPartner"
                    placeholder="Why would you like to partner with us?*"
                    required
                    rows={4}
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all resize-none"
                  />
                  
                  <div className="bg-neutral-50 border border-neutral-100 rounded-[1.5rem] p-8">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 mb-4">Do you have previous partnership or volunteer experience?</p>
                    <div className="flex gap-8 mb-6">
                      <label className="flex items-center gap-3 cursor-pointer font-bold">
                        <input type="radio" name="hasExperience" value="Yes" className="w-5 h-5 accent-yellow-400" /> Yes
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer font-bold">
                        <input type="radio" name="hasExperience" value="No" className="w-5 h-5 accent-yellow-400" /> No
                      </label>
                    </div>
                    <textarea
                      name="experienceDetails"
                      placeholder="If yes, please explain..."
                      rows={3}
                      className="w-full px-6 py-5 bg-white border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Availability & Commitment */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <span className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">6</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-neutral-900">Availability & Commitment</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    name="duration"
                    required
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                  >
                    <option value="" disabled selected>Preferred Partnership Duration*</option>
                    <option value="One-Time Support">One-Time Support</option>
                    <option value="Short-Term Partnership">Short-Term Partnership</option>
                    <option value="Long-Term Partnership">Long-Term Partnership</option>
                  </select>
                  
                  <select
                    name="contactMethod"
                    required
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                  >
                    <option value="" disabled selected>Preferred Contact Method*</option>
                    <option value="Email">Email</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
              </div>

              {/* Section 7: Consent */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <span className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">7</span>
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-neutral-900">Consent</h3>
                </div>
                
                <label className="flex items-start gap-4 cursor-pointer group p-4 bg-neutral-50 rounded-[1.5rem] border border-neutral-100">
                  <input 
                    type="checkbox" 
                    name="consent" 
                    required 
                    className="mt-1 w-5 h-5 accent-yellow-400 rounded"
                  />
                  <span className="text-sm font-bold text-neutral-600 leading-relaxed group-hover:text-black transition-colors">
                    I confirm that the information provided is accurate and I agree to be contacted regarding partnership opportunities.
                  </span>
                </label>
              </div>

              {status !== "idle" && (
                <div
                  className={`rounded-[1.5rem] px-6 py-5 text-sm font-bold border ${
                    status === "sent"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-8 bg-black text-white hover:bg-neutral-800 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 group/btn shadow-2xl shadow-black/10 transition-all active:scale-[0.98]"
                >
                  {status === "sending" ? "Submitting Application..." : "Submit Application"}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
                <p className="text-center text-xs text-neutral-400 mt-6 font-bold uppercase tracking-widest">
                  Thank you for choosing to partner with us to create lasting community impact.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerFormSection;
