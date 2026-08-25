import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, CheckCircle2, CreditCard, Loader, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../shared/Button";

const PAYBILL_NO = "400200";
const ACCOUNT_NO = "40059516";

interface MedicalConsultationFormSectionProps {
  onBack?: () => void;
}

type ConsultationType = "In-person" | "Virtual";

type SpecialistType =
  | "Psychiatrist"
  | "Dentist"
  | "Gynaecologist"
  | "Family Physician"
  | "Paediatrician"
  | "Cardiologist"
  | "Dermatologist"
  | "ENT Doctors";

type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

type YesNo = "Yes" | "No";

type ContactMethod = "Phone Call" | "Video Call" | "Email" | "WhatsApp";

type BestTime = "Morning" | "Afternoon" | "Evening" | "Anytime";

export interface MedicalPricingPackage {
  id: string;
  sessions: number;
  amount: number;
  currency: "KES" | "USD";
  mode: "Online" | "Physical";
  label: string;
}

export const MEDICAL_CONSULTATION_PRICING: MedicalPricingPackage[] = [
  // Kenya - Online (Virtual)
  {
    id: "med-ke-online-1",
    sessions: 1,
    amount: 2500,
    currency: "KES",
    mode: "Online",
    label: "Online Medical Consultation (1 Session) - KES 2,500",
  },
  // Kenya - Physical (In-Person)
  {
    id: "med-ke-physical-1",
    sessions: 1,
    amount: 3000,
    currency: "KES",
    mode: "Physical",
    label: "Physical Medical Consultation (1 Session) - KES 3,000",
  },
  // International - Online (Virtual)
  {
    id: "med-int-online-1",
    sessions: 1,
    amount: 40,
    currency: "USD",
    mode: "Online",
    label: "Online Medical Consultation (1 Session) - USD $40",
  },
];

const formatAmount = (amount: number, currency: "KES" | "USD") => {
  return currency === "KES"
    ? `KES ${amount.toLocaleString("en-KE")}`
    : `USD $${amount.toLocaleString("en-US")}`;
};

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

type BookingStep = "location" | "register" | "payment" | "mpesa_instructions";

const MedicalConsultationFormSection = ({
  onBack,
}: MedicalConsultationFormSectionProps) => {
  const [bookingStep, setBookingStep] = useState<BookingStep>("location");
  const [locationStatus, setLocationStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");
  const [locationMessage, setLocationMessage] = useState("");

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    age: "",
    phone: "",
    email: "",
    country: "",

    // Next of Kin
    nextOfKinName: "",
    nextOfKinContact: "",
    nextOfKinRelationship: "",

    // Medical Consultation Details
    consultationReason: "",
    consultationType: "" as ConsultationType | "",
    specialist: "" as SpecialistType | "",
    gender: "" as Gender | "",

    // Medical History
    preExistingConditions: "" as YesNo | "",
    takingMedication: "" as YesNo | "",
    allergies: "",
    pastSurgeries: "",
    familyMedicalHistory: "",
    hasHealthInsurance: "" as YesNo | "",

    // Preferences & Package
    packageId: "",
    language: "",
    medicalConcerns: "",
    contactMethod: "" as ContactMethod | "",
    bestTime: "" as BestTime | "",
    termsAccepted: false,
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "processing" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const isKenyan = formData.country.toLowerCase().includes("kenya");
  const userCurrency = isKenyan ? "KES" : "USD";
  const selectedMode = formData.consultationType === "In-person" ? "Physical" : "Online";

  const availablePricingOptions = MEDICAL_CONSULTATION_PRICING.filter((option) => {
    if (option.currency !== userCurrency) return false;
    if (!isKenyan) return option.mode === "Online";
    return option.mode === selectedMode;
  });

  const selectedPricingOption = availablePricingOptions.find(
    (option) => option.id === formData.packageId
  ) || availablePricingOptions[0];

  useEffect(() => {
    if (availablePricingOptions.length > 0) {
      if (!formData.packageId || !availablePricingOptions.some(p => p.id === formData.packageId)) {
        setFormData((prev) => ({ ...prev, packageId: availablePricingOptions[0].id }));
      }
    }
  }, [formData.consultationType, formData.country]);

  const applyDetectedCountry = (countryName: string) => {
    setFormData((prev) => ({ ...prev, country: countryName }));
    setLocationStatus("success");
    setLocationMessage(countryName ? `Country detected: ${countryName}` : "Country detected successfully.");
    setTimeout(() => {
      setBookingStep("register");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in your full name, email, and phone number.");
      return;
    }

    if (!formData.consultationType) {
      toast.error("Please select your preferred consultation type.");
      return;
    }

    if (!formData.termsAccepted) {
      toast.error("Please accept the terms and conditions to proceed.");
      return;
    }

    setStatus("sending");
    setStatusMessage("");

    try {
      const submitData = new FormData();
      submitData.set("_subject", "Website: Medical Consultation Request");
      submitData.set("fullName", formData.fullName);
      submitData.set("email", formData.email);
      submitData.set("_replyto", formData.email);
      submitData.set("phone", formData.phone);
      submitData.set("country", formData.country);
      submitData.set("age", formData.age);

      // Next of Kin
      submitData.set("nextOfKinName", formData.nextOfKinName);
      submitData.set("nextOfKinContact", formData.nextOfKinContact);
      submitData.set("nextOfKinRelationship", formData.nextOfKinRelationship);

      // Consultation Specs
      submitData.set("consultationReason", formData.consultationReason);
      submitData.set("consultationType", formData.consultationType);
      submitData.set("specialist", formData.specialist);
      submitData.set("gender", formData.gender);

      // History
      submitData.set("preExistingConditions", formData.preExistingConditions);
      submitData.set("takingMedication", formData.takingMedication);
      submitData.set("allergies", formData.allergies);
      submitData.set("pastSurgeries", formData.pastSurgeries);
      submitData.set("familyMedicalHistory", formData.familyMedicalHistory);
      submitData.set("hasHealthInsurance", formData.hasHealthInsurance);

      // Preferences
      submitData.set("language", formData.language);
      submitData.set("medicalConcerns", formData.medicalConcerns);
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
        throw new Error("Failed to submit medical consultation request. Please try again.");
      }

      setStatus("sent");
      setStatusMessage("Details saved. Choose your payment method below.");
      setBookingStep("payment");
      toast.success("Medical consultation request saved! Proceed to payment below.");
    } catch (error) {
      setStatus("error");
      const msg = error instanceof Error ? error.message : "Submission failed.";
      setStatusMessage(msg);
      toast.error(msg);
    }
  };

  const handleOnlinePayment = async () => {
    if (!selectedPricingOption) {
      toast.error("Please select a package first.");
      return;
    }

    setStatus("processing");
    setStatusMessage("");

    try {
      const paymentResponse = await fetch("/api/dpo/create-token.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPricingOption.amount,
          currency: selectedPricingOption.currency,
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
            category: "Medical Consultation",
            mode: selectedPricingOption.mode,
            sessions: selectedPricingOption.sessions,
            amount: selectedPricingOption.amount,
            totalAmount: selectedPricingOption.amount,
            currency: selectedPricingOption.currency,
            items: [
              {
                itemId: selectedPricingOption.id,
                itemName: selectedPricingOption.label,
                quantity: 1,
                unitPrice: selectedPricingOption.amount,
                totalAmount: selectedPricingOption.amount,
              },
            ],
            assistanceType: "Medical Consultation",
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

      window.location.href = paymentData.paymentUrl;
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? getFriendlyPaymentErrorMessage(error.message)
          : "Unable to start payment. Please try again.",
      );
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Hi Uburu Team,\n\nI have submitted a Medical Consultation request and made my payment via M-Pesa.\n\n*Name:* ${formData.fullName}\n*Phone:* ${formData.phone}\n*Package:* ${selectedPricingOption?.label}\n*Amount:* ${selectedPricingOption ? formatAmount(selectedPricingOption.amount, selectedPricingOption.currency) : ""}\n\nPlease confirm my booking.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/254705593817?text=${encoded}`, "_blank");
  };

  const renderLocationStep = () => (
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
          Medical Consultation Request
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
          Expert medical guidance
        </h2>
        <p className="text-gray-600 text-base max-w-xl mx-auto font-medium">
          Please detect your country first so we can connect you with medical experts and pricing in your region.
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

  const renderPaymentOptions = () => (
    <div className="space-y-8">
      {/* 1. Select Medical Consultation Fee & Package */}
      {availablePricingOptions.length > 0 && (
        <div className="bg-white rounded-3xl p-7 md:p-8 shadow-lg border border-amber-100 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Select Medical Consultation Fee <span className="text-red-500">*</span>
            </h3>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {formData.consultationType === "In-person" ? "In-Person" : "Virtual"} Consultation
            </span>
          </div>

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
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
                      {option.sessions} Session
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
                    {option.mode === "Online" ? "Online / Virtual" : "Physical / In-Person"} Consultation
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Choose Payment Method */}
      <div className="bg-white rounded-3xl p-7 md:p-8 shadow-lg border border-amber-100 space-y-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-black text-gray-900">Choose payment method</h3>
        </div>

        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Total Payable</p>
          <p className="text-3xl font-black text-gray-900 mt-1">
            {selectedPricingOption
              ? formatAmount(selectedPricingOption.amount, selectedPricingOption.currency)
              : `${userCurrency} 0`}
          </p>
        </div>

        <div className="grid gap-4">
          {isKenyan && (
            <button
              onClick={() => setBookingStep("mpesa_instructions")}
              className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-yellow-400 hover:bg-yellow-50/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <span className="font-black">M</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900">Mpesa Paybill</p>
                  <p className="text-xs font-semibold text-gray-500">Manual payment via Paybill</p>
                </div>
              </div>
              <div className="h-6 w-6 rounded-full border-2 border-gray-200 group-hover:border-yellow-400 group-hover:bg-yellow-400" />
            </button>
          )}

          <button
            onClick={handleOnlinePayment}
            disabled={status === "processing"}
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
                {status === "processing" ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-800 border-t-transparent" />
                ) : (
                  <CreditCard className="h-6 w-6" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900">Card / Online</p>
                <p className="text-xs font-semibold text-gray-500">
                  {status === "processing" ? "Redirecting to DPO..." : "Instant DPO checkout"}
                </p>
              </div>
            </div>
            <div className="h-6 w-6 rounded-full border-2 border-gray-200 group-hover:border-neutral-800 group-hover:bg-neutral-800" />
          </button>
        </div>

        {status === "error" && statusMessage && (
          <div className="rounded-2xl px-5 py-4 text-sm font-bold border bg-red-50 text-red-700 border-red-200">
            {statusMessage}
          </div>
        )}

        <button
          onClick={() => {
            setBookingStep("register");
            setStatus("idle");
            setStatusMessage("");
          }}
          className="w-full text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900"
        >
          Back to details
        </button>
      </div>
    </div>
  );

  const renderMpesaInstructions = () => (
    <div className="bg-white rounded-3xl p-7 shadow-lg border border-amber-100 space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setBookingStep("payment");
            setStatus("idle");
            setStatusMessage("");
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h3 className="text-lg font-black text-gray-900">Mpesa Payment</h3>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
            <CheckCircle className="h-5 w-5" />
          </div>
          <h4 className="font-black text-green-900">Instructions</h4>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-green-100">
            <span className="text-xs font-bold text-green-700 uppercase">Paybill No</span>
            <span className="text-base font-black text-green-900">{PAYBILL_NO}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-green-100">
            <span className="text-xs font-bold text-green-700 uppercase">Account No</span>
            <span className="text-base font-black text-green-900">{ACCOUNT_NO}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs font-bold text-green-700 uppercase">Amount</span>
            <span className="text-base font-black text-green-900">
              {selectedPricingOption
                ? formatAmount(selectedPricingOption.amount, selectedPricingOption.currency)
                : `${userCurrency} 0`}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-500 text-center px-4">
        Once you have made the payment, click below to send your payment confirmation to our team on WhatsApp.
      </p>

      <Button
        onClick={handleWhatsAppShare}
        className="w-full bg-[#25D366] py-4 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-[#20bd5a]"
      >
        <span className="flex items-center justify-center gap-2">
          <Send className="h-4 w-4" />
          Send to WhatsApp
        </span>
      </Button>

      <button
        onClick={() => {
          setBookingStep("payment");
          setStatus("idle");
          setStatusMessage("");
        }}
        className="w-full text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900"
      >
        Change payment method
      </button>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-10">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />

      {/* SECTION 1: Personal Details & Next of Kin */}
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

        {/* Card 2: Next of Kin */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Emergency contact / Next of Kin <span className="text-red-500">*</span>
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              name="nextOfKinName"
              value={formData.nextOfKinName}
              onChange={handleTextChange}
              placeholder="Next of Kin Full Name"
              required
              className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
            />
            <input
              type="tel"
              name="nextOfKinContact"
              value={formData.nextOfKinContact}
              onChange={handleTextChange}
              placeholder="Next of Kin Contact"
              required
              className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
            />
            <input
              type="text"
              name="nextOfKinRelationship"
              value={formData.nextOfKinRelationship}
              onChange={handleTextChange}
              placeholder="Relationship (e.g., Parent, Spouse, Friend)"
              required
              className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Consultation Reason, Type, Specialist & Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 3: Consultation Reason */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            What is the reason for consultation? <span className="text-red-500">*</span>
          </h3>
          <textarea
            name="consultationReason"
            value={formData.consultationReason}
            onChange={handleTextChange}
            rows={4}
            placeholder="Please describe the primary reason for seeking this medical consultation"
            required
            className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Card 4: Preferred Consultation Type */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5 flex flex-col justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            What is your preferred consultation type? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 mt-auto">
            {["In-person", "Virtual"].map((type) => (
              <label
                key={type}
                className={`cursor-pointer rounded-2xl border p-5 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.consultationType === type
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{type}</span>
                <input
                  type="radio"
                  name="consultationType"
                  value={type}
                  checked={formData.consultationType === type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      consultationType: e.target.value as ConsultationType,
                    }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.consultationType === type
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.consultationType === type && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Card 5: Type of Specialist */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            What type of specialist are you looking for? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Psychiatrist",
              "Dentist",
              "Gynaecologist",
              "Family Physician",
              "Paediatrician",
              "Cardiologist",
              "Dermatologist",
              "ENT Doctors",
            ].map((specialist) => (
              <label
                key={specialist}
                className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.specialist === specialist
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{specialist}</span>
                <input
                  type="radio"
                  name="specialist"
                  value={specialist}
                  checked={formData.specialist === specialist}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialist: e.target.value as SpecialistType,
                    }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    formData.specialist === specialist
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.specialist === specialist && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Card 6: Gender */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            What is your gender? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
              <label
                key={g}
                className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.gender === g
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{g}</span>
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gender: e.target.value as Gender,
                    }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.gender === g
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.gender === g && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: Medical History & Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 7: Pre-existing conditions */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Do you have pre-existing medical conditions? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.preExistingConditions === option
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="preExistingConditions"
                  value={option}
                  checked={formData.preExistingConditions === option}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      preExistingConditions: e.target.value as YesNo,
                    }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.preExistingConditions === option
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.preExistingConditions === option && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Card 8: Taking medication */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Are you taking any medication? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.takingMedication === option
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="takingMedication"
                  value={option}
                  checked={formData.takingMedication === option}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      takingMedication: e.target.value as YesNo,
                    }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.takingMedication === option
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.takingMedication === option && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Card 9: Allergies */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Do you have any allergies? <span className="text-red-500">*</span>
          </h3>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleTextChange}
            rows={3}
            placeholder="Please list any allergies or write 'None'"
            className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Card 10: Past Surgeries */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Have you undergone any surgeries in the past? <span className="text-red-500">*</span>
          </h3>
          <textarea
            name="pastSurgeries"
            value={formData.pastSurgeries}
            onChange={handleTextChange}
            rows={3}
            placeholder="Please list past surgeries and approximate year, or write 'None'"
            className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Card 11: Family History */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Is there a history of chronic illnesses in your family? <span className="text-red-500">*</span>
          </h3>
          <textarea
            name="familyMedicalHistory"
            value={formData.familyMedicalHistory}
            onChange={handleTextChange}
            rows={3}
            placeholder="e.g., Diabetes, Hypertension, Heart Disease, Cancer, etc."
            className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Card 12: Health Insurance */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Do you have health insurance? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.hasHealthInsurance === option
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="hasHealthInsurance"
                  value={option}
                  checked={formData.hasHealthInsurance === option}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasHealthInsurance: e.target.value as YesNo,
                    }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.hasHealthInsurance === option
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.hasHealthInsurance === option && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: Preferences, Contact Method & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 13: Preferred Language */}
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

        {/* Card 14: Medical Concerns */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Medical concerns <span className="text-red-500">*</span>
          </h3>
          <textarea
            name="medicalConcerns"
            value={formData.medicalConcerns}
            onChange={handleTextChange}
            rows={3}
            placeholder="Share any specific medical concerns or health history relevant to this consultation"
            className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Card 15: Preferred Contact Method */}
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

        {/* Card 16: Best Time to Reach You */}
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
            required
            className="mt-1 w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
          />
          <span className="text-sm font-medium text-gray-600 leading-relaxed">
            I agree to the processing of my health data for the purpose of this medical consultation. Read our{" "}
            <Link to="/get/therapy/terms" className="text-yellow-600 font-bold underline hover:text-yellow-700">
              Terms and Conditions
            </Link>.
          </span>
        </label>

        {status === "error" && statusMessage && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-bold border border-red-200">
            {statusMessage}
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
              <span>Submit & Proceed to Payment</span>
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
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
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Medical Consultation Request
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
            Expert Medical Guidance
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Provide your details below to schedule a medical consultation with our healthcare professionals.
          </p>
          <p className="text-sm text-gray-500 mt-4">* Indicates required question</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Medical Consultation Pricing</h3>
              <div className="space-y-4 text-sm">
                {availablePricingOptions.length > 0 ? (
                  (() => {
                    const grouped = availablePricingOptions.reduce(
                      (acc, option) => {
                        const key = `${option.mode === "Online" ? "Virtual" : "In-Person"} consultation`;
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(option);
                        return acc;
                      },
                      {} as Record<string, MedicalPricingPackage[]>
                    );
                    return Object.entries(grouped).map(([key, options]) => (
                      <div key={key}>
                        <p className="font-semibold text-gray-800 capitalize">{key}</p>
                        {options.map((option) => (
                          <p key={option.id} className="text-gray-600">
                            {option.sessions} session -{" "}
                            {formatAmount(option.amount, option.currency)}
                          </p>
                        ))}
                      </div>
                    ));
                  })()
                ) : (
                  <p className="text-gray-500">
                    Detect country to view pricing options.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">Privacy Notice</h3>
              <p className="text-yellow-50 mb-4">
                Your health data is confidential and used strictly to schedule and deliver your consultation with authorized medical practitioners.
              </p>
              <div className="text-sm text-yellow-50">
                Never submit passwords or financial details through this form.
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {bookingStep === "location" && renderLocationStep()}
            {bookingStep === "register" && renderForm()}
            {bookingStep === "payment" && renderPaymentOptions()}
            {bookingStep === "mpesa_instructions" && renderMpesaInstructions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalConsultationFormSection;
