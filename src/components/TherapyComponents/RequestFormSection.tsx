import { useState } from "react";
import Button from "../shared/Button";
import { Check, Mail, Phone, User } from "lucide-react";

const RequestFormSection = () => {
  type FormData = {
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    country: string;
    age: string;
    assistanceType: string;
    assistanceOther: string;
    practitionerGender: string;
    financialStatus: string;
    alcoholFrequency: string;
    religion: string;
    priorTherapy: string;
    assistanceReason: string[];
    assistanceReasonOther: string;
    medication: string;
    termsAccepted: boolean;
  };

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    country: "",
    age: "",
    assistanceType: "",
    assistanceOther: "",
    practitionerGender: "",
    financialStatus: "",
    alcoholFrequency: "",
    religion: "",
    priorTherapy: "",
    assistanceReason: [],
    assistanceReasonOther: "",
    medication: "",
    termsAccepted: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
      ...(name === "assistanceType" && value !== "Other"
        ? { assistanceOther: "" }
        : {}),
    });
  };

  const handleReasonToggle = (option: string) => {
    const isSelected = formData.assistanceReason.includes(option);
    const nextReasons = isSelected
      ? formData.assistanceReason.filter((reason) => reason !== option)
      : [...formData.assistanceReason, option];

    setFormData({
      ...formData,
      assistanceReason: nextReasons,
      ...(option === "Others" && isSelected ? { assistanceReasonOther: "" } : {}),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (formData.assistanceReason.length === 0) {
      setSubmitError("Please select at least one reason for assistance.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/forms/therapy.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          assistanceReason: formData.assistanceReason.join(", "),
          company: "",
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Unable to submit the request.");
      }

      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        country: "",
        age: "",
        assistanceType: "",
        assistanceOther: "",
        practitionerGender: "",
        financialStatus: "",
        alcoholFrequency: "",
        religion: "",
        priorTherapy: "",
        assistanceReason: [],
        assistanceReasonOther: "",
        medication: "",
        termsAccepted: false,
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to submit the request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Request Submitted!
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Thank you for reaching out. Our team will contact you within 24-48 hours
              to schedule your therapy session.
            </p>
            <div className="flex items-center justify-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+254 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>therapy@uburumultimove.org</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Uburu Therapy Form
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
            Uburu Therapy Form
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tell us a bit about yourself and what support you are looking for. We'll
            review your request and help match you with the right practitioner.
          </p>
          <p className="text-sm text-gray-500 mt-4">* Indicates required question</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">Privacy Notice</h3>
              <p className="text-yellow-50 mb-4">
                Your information is confidential and used only to match you with the
                right support.
              </p>
              <div className="text-sm text-yellow-50">
                Never submit passwords or financial details through this form.
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-7 shadow-lg border border-amber-100">
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div className="border-b border-dashed border-gray-200 pb-5 mb-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Client details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      What are your names ? *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                        placeholder="Full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Client email address? *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Client phone number ? *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                        placeholder="+254 123 456 789"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Country client is in ? *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                      placeholder="Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      What is Client's age? *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      min={1}
                      className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                      placeholder="Age"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Gender of Client? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Woman", "Man"].map((option) => (
                        <label
                          key={option}
                          className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                            formData.gender === option
                              ? "border-yellow-500 bg-yellow-50 text-gray-900"
                              : "border-gray-200 bg-white text-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={option}
                            checked={formData.gender === option}
                            onChange={handleChange}
                            required
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-dashed border-gray-200 pb-5 mb-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Service preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      What type of Assistance are you looking for? *
                    </label>
                    <select
                      name="assistanceType"
                      value={formData.assistanceType}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                    >
                      <option value="">Select assistance type</option>
                      <option value="Individual Therapy (For Myself)">Individual Therapy (For Myself)</option>
                      <option value="Couple Therapy (for myself and my partner)">Couple Therapy (for myself and my partner)</option>
                      <option value="Teens Therapy (For child)">Teens Therapy (For child)</option>
                      <option value="Rehab (Addiction)">Rehab (Addiction)</option>
                      <option value="Life coaching">Life coaching</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {formData.assistanceType === "Other" && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Other assistance type
                      </label>
                      <input
                        type="text"
                        name="assistanceOther"
                        value={formData.assistanceOther}
                        onChange={handleChange}
                        className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                        placeholder="Please specify"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      What Gender of practitioner do you prefer? *
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {["Male", "Female", "Any is okay"].map((option) => (
                        <label
                          key={option}
                          className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                            formData.practitionerGender === option
                              ? "border-yellow-500 bg-yellow-50 text-gray-900"
                              : "border-gray-200 bg-white text-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="practitionerGender"
                            value={option}
                            checked={formData.practitionerGender === option}
                            onChange={handleChange}
                            required
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Client financial status ? *
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {["Average", "Good", "Poor"].map((option) => (
                        <label
                          key={option}
                          className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                            formData.financialStatus === option
                              ? "border-yellow-500 bg-yellow-50 text-gray-900"
                              : "border-gray-200 bg-white text-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="financialStatus"
                            value={option}
                            checked={formData.financialStatus === option}
                            onChange={handleChange}
                            required
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-dashed border-gray-200 pb-5 mb-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Background</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      How often do you drink alcohol? *
                    </label>
                    <select
                      name="alcoholFrequency"
                      value={formData.alcoholFrequency}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                    >
                      <option value="">Select frequency</option>
                      <option value="Never">Never</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Daily">Daily</option>
                      <option value="Infrequently">Infrequently</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Which religion do you identify with *
                    </label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                    >
                      <option value="">Select religion</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Have you done Therapy or any of the above services before? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Yes", "No"].map((option) => (
                        <label
                          key={option}
                          className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                            formData.priorTherapy === option
                              ? "border-yellow-500 bg-yellow-50 text-gray-900"
                              : "border-gray-200 bg-white text-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="priorTherapy"
                            value={option}
                            checked={formData.priorTherapy === option}
                            onChange={handleChange}
                            required
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Are you currently taking medication? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Yes", "No"].map((option) => (
                        <label
                          key={option}
                          className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                            formData.medication === option
                              ? "border-yellow-500 bg-yellow-50 text-gray-900"
                              : "border-gray-200 bg-white text-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="medication"
                            value={option}
                            checked={formData.medication === option}
                            onChange={handleChange}
                            required
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                      What led you to consider our assistance? *
                    </label>
                    <p className="text-sm text-gray-500">Select all that apply.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "I've been feeling depressed",
                        "I feel anxious or overwhelmed",
                        "My mood is interfering with job/school performance",
                        "I am grieving",
                        "I am addicted",
                        "I have experienced trauma",
                        "I need to talk through a specific challenge",
                        "I need professional coaching",
                        "Just exploring",
                        "Others",
                      ].map((option) => (
                        <label
                          key={option}
                          className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                            formData.assistanceReason.includes(option)
                              ? "border-yellow-500 bg-yellow-50 text-gray-900"
                              : "border-gray-200 bg-white text-gray-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="assistanceReason"
                            value={option}
                            checked={formData.assistanceReason.includes(option)}
                            onChange={() => handleReasonToggle(option)}
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.assistanceReason.includes("Others") && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Others
                      </label>
                      <input
                        type="text"
                        name="assistanceReasonOther"
                        value={formData.assistanceReasonOther}
                        onChange={handleChange}
                        className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                        placeholder="Share a brief reason"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-b border-dashed border-gray-200 pb-5 mb-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Service consent</h3>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed">
                  By booking a therapy appointment or any other service under Uburu, you confirm that you are doing so
                  voluntarily and with full understanding of the nature of the services provided. You consent to
                  participate in sessions that may involve emotional, psychological, or personal exploration, and you
                  acknowledge that these services are intended to support your wellbeing and personal growth, not to
                  replace medical or emergency care. You understand that all information shared will be treated with
                  confidentiality in line with ethical and professional standards, except where disclosure is required
                  by law or for safety reasons. You also agree to respect the policies, fees, and scheduling guidelines
                  of Uburu, and you confirm that you have had the opportunity to ask questions and receive clarification
                  before proceeding.
                </div>
                <label className="mt-4 flex items-start gap-3 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    required
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                  />
                  I have read and accept the terms and conditions above.
                </label>
              </div>

              {submitError && (
                <p className="text-sm font-bold text-red-700 mb-4">{submitError}</p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-yellow-500 text-black hover:bg-yellow-400 py-4 text-lg"
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestFormSection;
