import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Loader, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface LifeCoachingFormSectionProps {
  onBack?: () => void;
}

type LifeArea =
  | "Personal growth"
  | "Emotional healing"
  | "Life transitions"
  | "Addictions"
  | "ADHD"
  | "My career";

type SexualOrientation =
  | "Straight"
  | "Gay"
  | "Lesbian"
  | "Bi or Pan"
  | "Other"
  | "Prefer not to say";

type CoachingType = "Online coaching" | "In person coaching";

type SessionFrequency =
  | "Weekly"
  | "Every two weeks"
  | "Monthly"
  | "Flexible / As needed";

type ContactMethod = "Phone Call" | "Video Call" | "Email" | "WhatsApp";

type BestTime = "Morning" | "Afternoon" | "Evening" | "Anytime";

export interface CoachingPricingPackage {
  id: string;
  sessions: number;
  amount: number;
  currency: "KES" | "USD";
  mode: "Online" | "Physical";
  label: string;
}

export const LIFE_COACHING_PRICING: CoachingPricingPackage[] = [
  // Kenya - Online
  { id: "lc-ke-online-1", sessions: 1, amount: 1600, currency: "KES", mode: "Online", label: "1 Session - KES 1,600" },
  { id: "lc-ke-online-4", sessions: 4, amount: 5000, currency: "KES", mode: "Online", label: "4 Sessions - KES 5,000" },
  { id: "lc-ke-online-6", sessions: 6, amount: 7500, currency: "KES", mode: "Online", label: "6 Sessions - KES 7,500" },
  { id: "lc-ke-online-8", sessions: 8, amount: 10000, currency: "KES", mode: "Online", label: "8 Sessions - KES 10,000" },
  { id: "lc-ke-online-10", sessions: 10, amount: 13000, currency: "KES", mode: "Online", label: "10 Sessions - KES 13,000" },

  // Kenya - Physical
  { id: "lc-ke-physical-1", sessions: 1, amount: 1800, currency: "KES", mode: "Physical", label: "1 Session - KES 1,800" },
  { id: "lc-ke-physical-4", sessions: 4, amount: 6500, currency: "KES", mode: "Physical", label: "4 Sessions - KES 6,500" },
  { id: "lc-ke-physical-6", sessions: 6, amount: 10000, currency: "KES", mode: "Physical", label: "6 Sessions - KES 10,000" },
  { id: "lc-ke-physical-8", sessions: 8, amount: 12000, currency: "KES", mode: "Physical", label: "8 Sessions - KES 12,000" },
  { id: "lc-ke-physical-10", sessions: 10, amount: 18000, currency: "KES", mode: "Physical", label: "10 Sessions - KES 18,000" },

  // International - Online
  { id: "lc-int-online-1", sessions: 1, amount: 25, currency: "USD", mode: "Online", label: "1 Session - USD $25" },
  { id: "lc-int-online-3", sessions: 3, amount: 50, currency: "USD", mode: "Online", label: "3 Sessions - USD $50" },
  { id: "lc-int-online-4", sessions: 4, amount: 65, currency: "USD", mode: "Online", label: "4 Sessions - USD $65" },
  { id: "lc-int-online-6", sessions: 6, amount: 85, currency: "USD", mode: "Online", label: "6 Sessions - USD $85" },
  { id: "lc-int-online-8", sessions: 8, amount: 120, currency: "USD", mode: "Online", label: "8 Sessions - USD $120" },
];

const formatAmount = (amount: number, currency: "KES" | "USD") => {
  return currency === "KES"
    ? `KES ${amount.toLocaleString("en-KE")}`
    : `USD $${amount.toLocaleString("en-US")}`;
};

const LifeCoachingFormSection = ({ onBack }: LifeCoachingFormSectionProps) => {
  const [step, setStep] = useState<"location" | "form">("location");
  const [locationStatus, setLocationStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");
  const [locationMessage, setLocationMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phone: "",
    email: "",
    country: "",
    orientation: "" as SexualOrientation | "",
    supportAreas: [] as LifeArea[],
    biggestChallenge: "",
    coachingGoal: "",
    coachingType: "" as CoachingType | "",
    frequency: "" as SessionFrequency | "",
    language: "",
    contactMethod: "" as ContactMethod | "",
    bestTime: "" as BestTime | "",
    packageId: "",
    termsAccepted: false,
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isKenyan = formData.country.toLowerCase().includes("kenya");
  const userCurrency = isKenyan ? "KES" : "USD";
  const selectedMode = formData.coachingType === "In person coaching" ? "Physical" : "Online";

  const availablePricingOptions = LIFE_COACHING_PRICING.filter((option) => {
    if (option.currency !== userCurrency) return false;
    if (!isKenyan) return option.mode === "Online";
    return option.mode === selectedMode;
  });

  const selectedPricingOption = availablePricingOptions.find(
    (option) => option.id === formData.packageId
  );

  // Auto select default package if available packages change and current selection is invalid
  useEffect(() => {
    if (availablePricingOptions.length > 0) {
      if (!selectedPricingOption) {
        setFormData((prev) => ({ ...prev, packageId: availablePricingOptions[0].id }));
      }
    } else {
      setFormData((prev) => ({ ...prev, packageId: "" }));
    }
  }, [formData.coachingType, formData.country]);

  const applyDetectedCountry = (countryName: string) => {
    setFormData((prev) => ({ ...prev, country: countryName }));
    setLocationStatus("success");
    setLocationMessage(countryName ? `Country detected: ${countryName}` : "Country detected successfully.");
    setTimeout(() => {
      setStep("form");
    }, 900);
  };

  const detectByIp = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("IP country lookup failed.");
      const data = await response.json();
      const country = data?.country_name || "";
      if (!country) throw new Error("IP country lookup returned no country.");
      applyDetectedCountry(country);
    } catch (error) {
      setLocationStatus("error");
      setLocationMessage(
        error instanceof Error
          ? `${error.message} Please click Detect Country to try again.`
          : "Unable to detect your country. Please click Detect Country to try again."
      );
    }
  };

  const handleDetectLocation = () => {
    setLocationStatus("detecting");
    setLocationMessage("");

    if (!navigator.geolocation) {
      detectByIp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en-US,en;q=0.9" } }
          );
          if (!response.ok) throw new Error("Unable to detect country.");
          const data = await response.json();
          const country = data?.address?.country || "";
          if (!country) throw new Error("Unable to detect country from coordinates.");
          applyDetectedCountry(country);
        } catch {
          detectByIp();
        }
      },
      () => {
        detectByIp();
      }
    );
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSupportAreaToggle = (area: LifeArea) => {
    setFormData((prev) => {
      const exists = prev.supportAreas.includes(area);
      return {
        ...prev,
        supportAreas: exists
          ? prev.supportAreas.filter((item) => item !== area)
          : [...prev.supportAreas, area],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in your full name, email, and phone number.");
      return;
    }

    if (!formData.coachingType) {
      toast.error("Please select what type of coaching you would like.");
      return;
    }

    if (!selectedPricingOption) {
      toast.error("Please select a coaching package.");
      return;
    }

    if (!formData.termsAccepted) {
      toast.error("Please accept the terms and conditions to proceed.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const submitData = new FormData();
      submitData.set("_subject", "Website: Life Coaching Request");
      submitData.set("fullName", formData.fullName);
      submitData.set("email", formData.email);
      submitData.set("_replyto", formData.email);
      submitData.set("phone", formData.phone);
      submitData.set("country", formData.country);
      submitData.set("age", formData.age);
      submitData.set("sexualOrientation", formData.orientation);
      submitData.set("supportAreas", formData.supportAreas.join(", "));
      submitData.set("biggestChallenge", formData.biggestChallenge);
      submitData.set("coachingGoal", formData.coachingGoal);
      submitData.set("coachingType", formData.coachingType);

      // Pricing package details
      submitData.set("sessionPackage", selectedPricingOption.label);
      submitData.set("sessionCount", String(selectedPricingOption.sessions));
      submitData.set("sessionAmount", String(selectedPricingOption.amount));
      submitData.set("sessionCurrency", selectedPricingOption.currency);
      submitData.set("sessionMode", selectedPricingOption.mode);

      submitData.set("frequency", formData.frequency);
      submitData.set("language", formData.language);
      submitData.set("contactMethod", formData.contactMethod);
      submitData.set("bestTime", formData.bestTime);
      submitData.set("termsAccepted", formData.termsAccepted ? "yes" : "no");
      submitData.set("company", "");

      const response = await fetch(
        import.meta.env.VITE_FORMSPREE_THERAPY_URL || "https://formspree.io/f/xpqjaolz",
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: submitData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit request. Please try again.");
      }

      setStatus("sent");
      toast.success("Life coaching request submitted successfully!");
    } catch (error) {
      setStatus("error");
      const msg = error instanceof Error ? error.message : "Submission failed.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-neutral-100 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-3">Request Submitted!</h3>
        <p className="text-gray-600 leading-relaxed mb-8">
          Thank you for starting your transformation journey with Uburu. Our team will review your details and reach out via your preferred contact method shortly.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-md"
        >
          Return to Support Pathways
        </button>
      </div>
    );
  }

  if (step === "location") {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-neutral-200/80 shadow-sm max-w-3xl mx-auto">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-600 hover:text-yellow-600 mb-6 bg-white hover:bg-yellow-100 px-5 py-2.5 rounded-full transition-all border border-neutral-200/80 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Support Pathways
          </button>
        )}

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Life Coaching Request
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Start your transformation journey
          </h2>
          <p className="text-gray-600 text-base max-w-xl mx-auto font-medium">
            Please detect your country first so we can tailor your coaching pricing and pathway for your region.
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-6">
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={locationStatus === "detecting"}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wider py-5 rounded-2xl transition-all duration-300 shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2.5 text-xs disabled:opacity-70"
          >
            {locationStatus === "detecting" ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                <span>Detecting country...</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                <span>Detect Country</span>
              </>
            )}
          </button>

          {locationStatus === "success" && locationMessage && (
            <div className="mt-4 rounded-2xl px-5 py-4 text-sm font-bold border bg-green-50 text-green-700 border-green-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {locationMessage}
            </div>
          )}
          {locationStatus === "error" && locationMessage && (
            <div className="mt-4 rounded-2xl px-5 py-4 text-sm font-bold border bg-red-50 text-red-700 border-red-200">
              {locationMessage}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Top Bar with Back Button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-600 hover:text-yellow-600 mb-8 bg-white hover:bg-yellow-100 px-5 py-2.5 rounded-full transition-all border border-neutral-200/80 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Support Pathways
        </button>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
          Life Coaching Form
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Start your transformation journey
        </h2>
        <p className="text-gray-600 text-lg font-medium leading-relaxed">
          Tell us about your goals, and we'll help you find the right approach to reach your potential.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />

        {/* SECTION 1: Personal Details & Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Personal Details */}
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              Personal details <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleTextChange}
                placeholder="Full name"
                required
                className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleTextChange}
                  placeholder="Age"
                  min={1}
                  required
                  className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
                />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  readOnly
                  placeholder="Detected Country"
                  className="w-full px-5 py-4 bg-neutral-100 border border-neutral-200/80 rounded-2xl font-bold text-gray-700 cursor-not-allowed"
                />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleTextChange}
                placeholder="Phone number"
                required
                className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleTextChange}
                placeholder="Email address"
                required
                className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Card 2: Sexual Orientation */}
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              How do you identify? (Sexual Orientation) <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Straight",
                "Gay",
                "Lesbian",
                "Bi or Pan",
                "Other",
                "Prefer not to say",
              ].map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                    formData.orientation === option
                      ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                      : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                  }`}
                >
                  <span>{option}</span>
                  <input
                    type="radio"
                    name="orientation"
                    value={option}
                    checked={formData.orientation === option}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        orientation: e.target.value as SexualOrientation,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.orientation === option
                        ? "border-yellow-500 bg-yellow-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.orientation === option && (
                      <div className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: Life Areas & Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 3: Support Areas */}
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              What areas of life do you need support in? <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Personal growth",
                "Emotional healing",
                "Life transitions",
                "Addictions",
                "ADHD",
                "My career",
              ].map((area) => {
                const isSelected = formData.supportAreas.includes(area as LifeArea);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => handleSupportAreaToggle(area as LifeArea)}
                    className={`rounded-2xl border p-4 text-sm font-bold text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                        : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                    }`}
                  >
                    <span>{area}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-yellow-500 bg-yellow-500" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 4: Biggest Challenge */}
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              What's your biggest challenge right now? <span className="text-red-500">*</span>
            </h3>
            <textarea
              name="biggestChallenge"
              value={formData.biggestChallenge}
              onChange={handleTextChange}
              rows={4}
              placeholder="Describe the main obstacle you're currently facing"
              className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Card 5: Achieve Goal */}
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              What would you like to achieve through coaching? <span className="text-red-500">*</span>
            </h3>
            <textarea
              name="coachingGoal"
              value={formData.coachingGoal}
              onChange={handleTextChange}
              rows={4}
              placeholder="Briefly describe what you'd like to achieve through coaching"
              className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Card 6: Type of Coaching */}
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              What type of coaching would you like? <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              {["Online coaching", "In person coaching"].map((type) => (
                <label
                  key={type}
                  className={`cursor-pointer rounded-2xl border p-5 text-sm font-bold transition-all flex items-center justify-between ${
                    formData.coachingType === type
                      ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                      : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                  }`}
                >
                  <span>{type}</span>
                  <input
                    type="radio"
                    name="coachingType"
                    value={type}
                    checked={formData.coachingType === type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        coachingType: e.target.value as CoachingType,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.coachingType === type
                        ? "border-yellow-500 bg-yellow-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.coachingType === type && (
                      <div className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: Select Life Coaching Package */}
        {availablePricingOptions.length > 0 && (
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              Select Life Coaching Package & Pricing <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePricingOptions.map((option) => {
                const isSelected = formData.packageId === option.id;
                return (
                  <label
                    key={option.id}
                    className={`cursor-pointer rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                        : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name="packageId"
                      value={option.id}
                      checked={isSelected}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, packageId: e.target.value }))
                      }
                      required
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
                        {option.sessions} Session{option.sessions > 1 ? "s" : ""}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-yellow-500 bg-yellow-500" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900 mt-2">
                      {formatAmount(option.amount, option.currency)}
                    </div>
                    <span className="text-xs font-semibold text-gray-500 mt-1">
                      {option.mode} Life Coaching
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 4: Preferences & Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 7: Frequency */}
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              How often would you like to have sessions? <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["Weekly", "Every two weeks", "Monthly", "Flexible / As needed"].map(
                (freq) => (
                  <label
                    key={freq}
                    className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                      formData.frequency === freq
                        ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                        : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                    }`}
                  >
                    <span>{freq}</span>
                    <input
                      type="radio"
                      name="frequency"
                      value={freq}
                      checked={formData.frequency === freq}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          frequency: e.target.value as SessionFrequency,
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.frequency === freq
                          ? "border-yellow-500 bg-yellow-500"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.frequency === freq && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Card 8: Preferred Language */}
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              What language do you prefer? <span className="text-red-500">*</span>
            </h3>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleTextChange}
              placeholder="e.g., English"
              required
              className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Card 9: Preferred Contact Method */}
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              Preferred Contact Method <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["Phone Call", "Video Call", "Email", "WhatsApp"].map((method) => (
                <label
                  key={method}
                  className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                    formData.contactMethod === method
                      ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                      : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                  }`}
                >
                  <span>{method}</span>
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method}
                    checked={formData.contactMethod === method}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactMethod: e.target.value as ContactMethod,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.contactMethod === method
                        ? "border-yellow-500 bg-yellow-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.contactMethod === method && (
                      <div className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Card 10: Best Time to Reach You */}
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              Best Time to Reach You <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["Morning", "Afternoon", "Evening", "Anytime"].map((time) => (
                <label
                  key={time}
                  className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                    formData.bestTime === time
                      ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                      : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                  }`}
                >
                  <span>{time}</span>
                  <input
                    type="radio"
                    name="bestTime"
                    value={time}
                    checked={formData.bestTime === time}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bestTime: e.target.value as BestTime,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.bestTime === time
                        ? "border-yellow-500 bg-yellow-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.bestTime === time && (
                      <div className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5: Terms Checkbox & Submit */}
        <div className="pt-6 border-t border-neutral-200/80 space-y-6">
          <label className="flex items-start gap-3.5 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }))
              }
              className="mt-1 w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
            />
            <span className="text-sm font-medium text-gray-600 leading-relaxed">
              I agree to the processing of my personal data for the purpose of scheduling my first coaching session. Read our{" "}
              <Link to="/get/therapy/terms" className="text-yellow-600 font-bold underline hover:text-yellow-700">
                Terms and Conditions
              </Link>.
            </span>
          </label>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-bold border border-red-200">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "sending" ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Submitting Request...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Life Coaching Request</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LifeCoachingFormSection;
