import { useState } from "react";
import Button from "../shared/Button";
import { Mail, Phone, User } from "lucide-react";

type TherapyPricingOption = {
  id: string;
  category: "Individual" | "Couples";
  mode: "Online" | "Physical";
  sessions: number;
  amount: number;
  label: string;
};

const THERAPY_PRICING_OPTIONS: TherapyPricingOption[] = [
  {
    id: "individual-online-1",
    category: "Individual",
    mode: "Online",
    sessions: 1,
    amount: 1600,
    label: "Online individual - 1 session (KES 1,600)",
  },
  {
    id: "individual-online-4",
    category: "Individual",
    mode: "Online",
    sessions: 4,
    amount: 5000,
    label: "Online individual - 4 sessions (KES 5,000)",
  },
  {
    id: "individual-online-6",
    category: "Individual",
    mode: "Online",
    sessions: 6,
    amount: 7500,
    label: "Online individual - 6 sessions (KES 7,500)",
  },
  {
    id: "individual-online-8",
    category: "Individual",
    mode: "Online",
    sessions: 8,
    amount: 10000,
    label: "Online individual - 8 sessions (KES 10,000)",
  },
  {
    id: "individual-physical-1",
    category: "Individual",
    mode: "Physical",
    sessions: 1,
    amount: 1800,
    label: "Physical individual - 1 session (KES 1,800)",
  },
  {
    id: "individual-physical-4",
    category: "Individual",
    mode: "Physical",
    sessions: 4,
    amount: 6500,
    label: "Physical individual - 4 sessions (KES 6,500)",
  },
  {
    id: "couples-online-1",
    category: "Couples",
    mode: "Online",
    sessions: 1,
    amount: 3000,
    label: "Couples online - 1 session (KES 3,000)",
  },
  {
    id: "couples-physical-1",
    category: "Couples",
    mode: "Physical",
    sessions: 1,
    amount: 3500,
    label: "Couples physical - 1 session (KES 3,500)",
  },
];

const getFriendlyPaymentErrorMessage = (message: string) => {
  const normalizedMessage = message.trim().toLowerCase();
  if (normalizedMessage.includes("invalid amount")) {
    return "Your selected package amount is invalid. Please reselect the package and try again.";
  }
  if (normalizedMessage.includes("unsupported currency")) {
    return "This payment currency is not supported right now.";
  }
  if (normalizedMessage.includes("missing payment url")) {
    return "We could not start the payment. Please try again.";
  }
  return message.trim() || "Unable to start payment. Please try again.";
};

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
    pricingOptionId: string;
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
    pricingOptionId: "",
    termsAccepted: false,
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

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
    if (status === "sending") return;

    const selectedPricingOption = THERAPY_PRICING_OPTIONS.find(
      (option) => option.id === formData.pricingOptionId,
    );

    if (formData.assistanceReason.length === 0) {
      setStatus("error");
      setStatusMessage("Please select at least one reason for assistance.");
      return;
    }

    if (!selectedPricingOption) {
      setStatus("error");
      setStatusMessage("Please select a therapy package before continuing.");
      return;
    }

    setStatus("sending");
    setStatusMessage("");

    try {
      const submitData = new FormData();
      submitData.set("_subject", "Website: Therapy request");
      submitData.set("email", formData.email);
      submitData.set("_replyto", formData.email);
      submitData.set("fullName", formData.fullName);
      submitData.set("phone", formData.phone);
      submitData.set("gender", formData.gender);
      submitData.set("country", formData.country);
      submitData.set("age", formData.age);
      submitData.set("assistanceType", formData.assistanceType);
      submitData.set("assistanceOther", formData.assistanceOther);
      submitData.set("practitionerGender", formData.practitionerGender);
      submitData.set("financialStatus", formData.financialStatus);
      submitData.set("alcoholFrequency", formData.alcoholFrequency);
      submitData.set("religion", formData.religion);
      submitData.set("priorTherapy", formData.priorTherapy);
      submitData.set("assistanceReason", formData.assistanceReason.join(", "));
      submitData.set("assistanceReasonOther", formData.assistanceReasonOther);
      submitData.set("medication", formData.medication);
      submitData.set("sessionPackage", selectedPricingOption.label);
      submitData.set("sessionCategory", selectedPricingOption.category);
      submitData.set("sessionMode", selectedPricingOption.mode);
      submitData.set("sessionCount", String(selectedPricingOption.sessions));
      submitData.set("sessionAmountKes", String(selectedPricingOption.amount));
      submitData.set("termsAccepted", formData.termsAccepted ? "yes" : "no");
      submitData.set("company", "");

      const response = await fetch("https://formspree.io/f/xpqjaolz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: submitData,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMessage =
          data?.error ||
          data?.errors?.map?.((e: { message?: string }) => e?.message).filter(Boolean).join(", ") ||
          "Unable to submit the request.";
        throw new Error(errorMessage);
      }

      const paymentResponse = await fetch("/api/dpo/create-token.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPricingOption.amount,
          currency: "KES",
          customer: {
            name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || undefined,
          },
          context: "therapy_booking",
          meta: {
            type: "therapy_booking",
            packageId: selectedPricingOption.id,
            packageLabel: selectedPricingOption.label,
            itemName: selectedPricingOption.label,
            quantity: 1,
            category: selectedPricingOption.category,
            mode: selectedPricingOption.mode,
            sessions: selectedPricingOption.sessions,
            amountKes: selectedPricingOption.amount,
            totalAmount: selectedPricingOption.amount,
            currency: "KES",
            items: [
              {
                itemId: selectedPricingOption.id,
                itemName: selectedPricingOption.label,
                quantity: 1,
                unitPrice: selectedPricingOption.amount,
                totalAmount: selectedPricingOption.amount,
              },
            ],
            assistanceType: formData.assistanceType,
          },
        }),
      });

      if (!paymentResponse.ok) {
        const contentType = paymentResponse.headers.get("content-type") || "";
        const errorPayload = contentType.includes("application/json")
          ? await paymentResponse.json()
          : null;
        const errorText = !errorPayload ? await paymentResponse.text() : "";
        const apiMessage = errorPayload?.error || errorText;
        throw new Error(apiMessage || "Unable to start payment.");
      }

      const paymentData = await paymentResponse.json();
      if (!paymentData?.paymentUrl) {
        const apiError = paymentData?.error ? ` ${paymentData.error}` : "";
        throw new Error(`Missing payment URL. Please try again.${apiError}`);
      }

      setStatus("sent");
      setStatusMessage("Request received. Redirecting you to secure payment.");
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
        pricingOptionId: "",
        termsAccepted: false,
      });

      window.location.href = paymentData.paymentUrl;
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? getFriendlyPaymentErrorMessage(error.message)
          : "Unable to submit the request.",
      );
    } finally {
      setStatus((current) => (current === "sending" ? "idle" : current));
    }
  };

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
            <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Therapy Pricing</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Online individual</p>
                  <p className="text-gray-600">1 session - KES 1,600</p>
                  <p className="text-gray-600">4 sessions - KES 5,000</p>
                  <p className="text-gray-600">6 sessions - KES 7,500</p>
                  <p className="text-gray-600">8 sessions - KES 10,000</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Physical individual</p>
                  <p className="text-gray-600">1 session - KES 1,800</p>
                  <p className="text-gray-600">4 sessions - KES 6,500</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Couples therapy</p>
                  <p className="text-gray-600">Online 1 session - KES 3,000</p>
                  <p className="text-gray-600">Physical 1 session - KES 3,500</p>
                </div>
              </div>
            </div>

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
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-7 shadow-lg border border-amber-100"
            >
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
                      Select therapy package and pricing *
                    </label>
                    <select
                      name="pricingOptionId"
                      value={formData.pricingOptionId}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                    >
                      <option value="">Select package</option>
                      {THERAPY_PRICING_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500">
                      You will be redirected to secure payment after submitting this form.
                    </p>
                  </div>

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

              {status !== "idle" && (
                <div
                  className={`mb-4 rounded-2xl px-5 py-4 text-sm font-bold border ${
                    status === "sent"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-yellow-500 text-black hover:bg-yellow-400 py-4 text-lg"
              >
                {status === "sending" ? "Submitting..." : "Submit & proceed to payment"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestFormSection;
