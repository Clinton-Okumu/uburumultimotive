import { useState } from "react";
import Button from "../shared/Button";
import { Mail, Phone, User, CheckCircle, CreditCard, Send, ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type TherapyPricingOption = {
  id: string;
  category: "Individual" | "Couples";
  mode: "Online" | "Physical";
  sessions: number;
  amount: number;
  currency: "KES" | "USD";
  label: string;
};

const THERAPY_PRICING_OPTIONS: TherapyPricingOption[] = [
  // Kenya packages
  {
    id: "ke-individual-online-1",
    category: "Individual",
    mode: "Online",
    sessions: 1,
    amount: 1600,
    currency: "KES",
    label: "Online individual - 1 session (KES 1,600)",
  },
  {
    id: "ke-individual-online-4",
    category: "Individual",
    mode: "Online",
    sessions: 4,
    amount: 5000,
    currency: "KES",
    label: "Online individual - 4 sessions (KES 5,000)",
  },
  {
    id: "ke-individual-online-6",
    category: "Individual",
    mode: "Online",
    sessions: 6,
    amount: 7500,
    currency: "KES",
    label: "Online individual - 6 sessions (KES 7,500)",
  },
  {
    id: "ke-individual-online-8",
    category: "Individual",
    mode: "Online",
    sessions: 8,
    amount: 10000,
    currency: "KES",
    label: "Online individual - 8 sessions (KES 10,000)",
  },
  {
    id: "ke-individual-online-10",
    category: "Individual",
    mode: "Online",
    sessions: 10,
    amount: 13000,
    currency: "KES",
    label: "Online individual - 10 sessions (KES 13,000)",
  },
  {
    id: "ke-individual-online-12",
    category: "Individual",
    mode: "Online",
    sessions: 12,
    amount: 15000,
    currency: "KES",
    label: "Online individual - 12 sessions (KES 15,000)",
  },
  {
    id: "ke-individual-physical-1",
    category: "Individual",
    mode: "Physical",
    sessions: 1,
    amount: 1800,
    currency: "KES",
    label: "Physical individual - 1 session (KES 1,800)",
  },
  {
    id: "ke-individual-physical-4",
    category: "Individual",
    mode: "Physical",
    sessions: 4,
    amount: 6500,
    currency: "KES",
    label: "Physical individual - 4 sessions (KES 6,500)",
  },
  {
    id: "ke-individual-physical-6",
    category: "Individual",
    mode: "Physical",
    sessions: 6,
    amount: 10000,
    currency: "KES",
    label: "Physical individual - 6 sessions (KES 10,000)",
  },
  {
    id: "ke-individual-physical-8",
    category: "Individual",
    mode: "Physical",
    sessions: 8,
    amount: 12000,
    currency: "KES",
    label: "Physical individual - 8 sessions (KES 12,000)",
  },
  {
    id: "ke-individual-physical-10",
    category: "Individual",
    mode: "Physical",
    sessions: 10,
    amount: 18000,
    currency: "KES",
    label: "Physical individual - 10 sessions (KES 18,000)",
  },
  {
    id: "ke-couples-online-1",
    category: "Couples",
    mode: "Online",
    sessions: 1,
    amount: 3000,
    currency: "KES",
    label: "Couples online - 1 session (KES 3,000)",
  },
  {
    id: "ke-couples-online-4",
    category: "Couples",
    mode: "Online",
    sessions: 4,
    amount: 10000,
    currency: "KES",
    label: "Couples online - 4 sessions (KES 10,000)",
  },
  {
    id: "ke-couples-physical-1",
    category: "Couples",
    mode: "Physical",
    sessions: 1,
    amount: 3500,
    currency: "KES",
    label: "Couples physical - 1 session (KES 3,500)",
  },
  {
    id: "ke-couples-physical-4",
    category: "Couples",
    mode: "Physical",
    sessions: 4,
    amount: 12000,
    currency: "KES",
    label: "Couples physical - 4 sessions (KES 12,000)",
  },
  // International packages
  {
    id: "int-individual-online-1",
    category: "Individual",
    mode: "Online",
    sessions: 1,
    amount: 25,
    currency: "USD",
    label: "Online individual - 1 session (USD 25)",
  },
  {
    id: "int-individual-online-3",
    category: "Individual",
    mode: "Online",
    sessions: 3,
    amount: 50,
    currency: "USD",
    label: "Online individual - 3 sessions (USD 50)",
  },
  {
    id: "int-individual-online-4",
    category: "Individual",
    mode: "Online",
    sessions: 4,
    amount: 65,
    currency: "USD",
    label: "Online individual - 4 sessions (USD 65)",
  },
  {
    id: "int-individual-online-6",
    category: "Individual",
    mode: "Online",
    sessions: 6,
    amount: 85,
    currency: "USD",
    label: "Online individual - 6 sessions (USD 85)",
  },
  {
    id: "int-individual-online-8",
    category: "Individual",
    mode: "Online",
    sessions: 8,
    amount: 120,
    currency: "USD",
    label: "Online individual - 8 sessions (USD 120)",
  },
  {
    id: "int-couples-online-1",
    category: "Couples",
    mode: "Online",
    sessions: 1,
    amount: 40,
    currency: "USD",
    label: "Couples online - 1 session (USD 40)",
  },
  {
    id: "int-couples-online-3",
    category: "Couples",
    mode: "Online",
    sessions: 3,
    amount: 110,
    currency: "USD",
    label: "Couples online - 3 sessions (USD 110)",
  },
  {
    id: "int-couples-online-4",
    category: "Couples",
    mode: "Online",
    sessions: 4,
    amount: 140,
    currency: "USD",
    label: "Couples online - 4 sessions (USD 140)",
  },
  {
    id: "int-couples-online-6",
    category: "Couples",
    mode: "Online",
    sessions: 6,
    amount: 220,
    currency: "USD",
    label: "Couples online - 6 sessions (USD 220)",
  },
  {
    id: "int-couples-online-8",
    category: "Couples",
    mode: "Online",
    sessions: 8,
    amount: 250,
    currency: "USD",
    label: "Couples online - 8 sessions (USD 250)",
  },
];

const isInKenya = (country: string) => country.trim().toLowerCase() === "kenya";

const PAYBILL_NO = "522522";
const ACCOUNT_NO = "1346356009";
const WHATSAPP_NUMBER = "254718421205";

const formatAmount = (amount: number, currency: string = "KES") => {
  const locale = currency === "KES" ? "en-KE" : "en-US";
  return `${currency} ${amount.toLocaleString(locale)}`;
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

  const [bookingStep, setBookingStep] = useState<BookingStep>("location");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "processing">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [locationStatus, setLocationStatus] = useState<"idle" | "detecting" | "success" | "error">(
    "idle",
  );
  const [locationMessage, setLocationMessage] = useState("");

  const isKenyan = isInKenya(formData.country);
  const userCurrency = isKenyan ? "KES" : "USD";
  const availablePricingOptions = THERAPY_PRICING_OPTIONS.filter(
    (option) => option.currency === userCurrency,
  );
  const selectedPricingOption = availablePricingOptions.find(
    (option) => option.id === formData.pricingOptionId,
  );

  const applyDetectedCountry = (country: string, city?: string) => {
    setFormData((prev) => {
      const nextCountry = country || prev.country;
      const next = {
        ...prev,
        country: nextCountry,
      };
      if (isInKenya(nextCountry) !== isInKenya(prev.country)) {
        next.pricingOptionId = "";
      }
      return next as FormData;
    });

    setLocationStatus("success");
    setLocationMessage(
      country
        ? `Location detected: ${city ? `${city}, ` : ""}${country}`
        : "Location detected successfully.",
    );

    setTimeout(() => {
      setBookingStep("register");
    }, 900);
  };

  const detectByIp = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error("IP location lookup failed.");
      }
      const data = await response.json();
      const country = data?.country_name || "";
      const city = data?.city || "";
      if (!country) {
        throw new Error("IP location lookup returned no country.");
      }
      applyDetectedCountry(country, city);
    } catch (error) {
      setLocationStatus("error");
      setLocationMessage(
        error instanceof Error
          ? `${error.message} Please click Detect Location to try again.`
          : "Unable to detect your location. Please click Detect Location to try again.",
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
            {
              headers: {
                "Accept-Language": "en-US,en;q=0.9",
              },
            },
          );

          if (!response.ok) {
            throw new Error("Unable to detect location details.");
          }

          const data = await response.json();
          const country = data?.address?.country || "";
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.county ||
            "";

          if (!country) {
            throw new Error("Unable to detect country from coordinates.");
          }

          applyDetectedCountry(country, city);
        } catch {
          detectByIp();
        }
      },
      () => {
        detectByIp();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
        ...(name === "assistanceType" && value !== "Other"
          ? { assistanceOther: "" }
          : {}),
      } as FormData;

      if (name === "country") {
        const nextCurrency = isInKenya(value) ? "KES" : "USD";
        const prevCurrency = isInKenya(prev.country) ? "KES" : "USD";
        if (nextCurrency !== prevCurrency) {
          next.pricingOptionId = "";
        }
      }

      return next;
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    if (formData.assistanceReason.length === 0) {
      setStatus("error");
      setStatusMessage("Please select at least one reason for assistance.");
      return;
    }

    if (
      formData.assistanceType === "Other" &&
      formData.assistanceOther.trim() === ""
    ) {
      setStatus("error");
      setStatusMessage("Please specify the other assistance type.");
      return;
    }

    if (
      formData.assistanceReason.includes("Others") &&
      formData.assistanceReasonOther.trim() === ""
    ) {
      setStatus("error");
      setStatusMessage("Please specify the other reason for assistance.");
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
      submitData.set("sessionAmount", String(selectedPricingOption.amount));
      submitData.set("sessionCurrency", selectedPricingOption.currency);
      submitData.set("termsAccepted", formData.termsAccepted ? "yes" : "no");
      submitData.set("company", "");

      const response = await fetch(
        import.meta.env.VITE_FORMSPREE_THERAPY_URL || "https://formspree.io/f/xpqjaolz",
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: submitData,
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMessage =
          data?.error ||
          data?.errors?.map?.((e: { message?: string }) => e?.message).filter(Boolean).join(", ") ||
          "Unable to submit the request.";
        throw new Error(errorMessage);
      }

      setStatus("sent");
      setStatusMessage("Request received. Choose your payment method below.");
      setBookingStep("payment");
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

  const handleOnlinePayment = async () => {
    if (!selectedPricingOption) return;

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
            category: selectedPricingOption.category,
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
      setStatusMessage("Redirecting you to secure payment.");
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
    if (!selectedPricingOption) return;
    const message = `*UBURU THERAPY BOOKING*%0A%0A*Package:* ${selectedPricingOption.label}%0A*Name:* ${formData.fullName}%0A*Phone:* ${formData.phone}%0A*Amount:* ${formatAmount(selectedPricingOption.amount, selectedPricingOption.currency)}%0A%0A_I have made the payment via Mpesa Paybill ${PAYBILL_NO}, Acc ${ACCOUNT_NO}._`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const renderLocationStep = () => (
    <div className="bg-white rounded-3xl p-7 shadow-lg border border-amber-100">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-yellow-600">Step 1 of 2</span>
          <span className="text-sm font-medium text-gray-500">50% Complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 rounded-full w-1/2" />
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-600 mb-3">
          Step 1 of 2
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Help us match you to the right therapist
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Please provide your location to help us find the best support available in your region.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex items-start gap-3 mb-6">
          <MapPin className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-yellow-900">
            Click below to detect your location.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={locationStatus === "detecting"}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {locationStatus === "detecting" ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Detecting location...
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5" />
              Detect Location
            </>
          )}
        </button>

        {locationStatus === "success" && locationMessage && (
          <div className="mt-4 rounded-2xl px-5 py-4 text-sm font-bold border bg-green-50 text-green-700 border-green-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
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

  const renderForm = () => (
    <form
      onSubmit={handleRegister}
      className="bg-white rounded-3xl p-7 shadow-lg border border-amber-100"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-yellow-600">Step 2 of 2</span>
          <span className="text-sm font-medium text-gray-500">100% Complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 rounded-full w-full" />
        </div>
      </div>

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
              readOnly
              className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none font-bold transition-all cursor-not-allowed"
              placeholder="Country"
            />
            <p className="text-xs text-gray-500">
              Location is detected automatically to determine pricing.
            </p>
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
              {availablePricingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">
              You will choose a payment method after submitting your details.
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
                Other assistance type *
              </label>
              <input
                type="text"
                name="assistanceOther"
                value={formData.assistanceOther}
                onChange={handleChange}
                required={formData.assistanceType === "Other"}
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
                Others *
              </label>
              <input
                type="text"
                name="assistanceReasonOther"
                value={formData.assistanceReasonOther}
                onChange={handleChange}
                required={formData.assistanceReason.includes("Others")}
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
          <span>
            I have read and accept the{" "}
            <Link
              to="/get/therapy/terms"
              className="text-yellow-600 underline hover:text-yellow-700 transition-colors"
            >
              terms and conditions
            </Link>{" "}
            above.
          </span>
        </label>
      </div>

      {status === "error" && (
        <div className="mb-4 rounded-2xl px-5 py-4 text-sm font-bold border bg-red-50 text-red-700 border-red-200">
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
  );

  const renderPaymentOptions = () => (
    <div className="bg-white rounded-3xl p-7 shadow-lg border border-amber-100 space-y-6">
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

      {status === "error" && (
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
            Tell us a bit about yourself and what support you are looking for. We will
            review your request and help match you with the right practitioner.
          </p>
          <p className="text-sm text-gray-500 mt-4">* Indicates required question</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Therapy Pricing</h3>
              <div className="space-y-4 text-sm">
                {[
                  { key: "individual-online", label: "Online individual" },
                  { key: "individual-physical", label: "Physical individual" },
                  { key: "couples-online", label: "Online couples" },
                  { key: "couples-physical", label: "Physical couples" },
                ].map(({ key, label }) => {
                  const options = availablePricingOptions.filter(
                    (option) =>
                      `${option.category.toLowerCase()}-${option.mode.toLowerCase()}` === key,
                  );
                  if (options.length === 0) return null;
                  return (
                    <div key={key}>
                      <p className="font-semibold text-gray-800">{label}</p>
                      {options.map((option) => (
                        <p key={option.id} className="text-gray-600">
                          {option.sessions} session{option.sessions > 1 ? "s" : ""} -{" "}
                          {formatAmount(option.amount, option.currency)}
                        </p>
                      ))}
                    </div>
                  );
                })}
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
            {bookingStep === "location" && renderLocationStep()}
            {bookingStep === "register" && renderForm()}
            {bookingStep === "payment" && renderPaymentOptions()}
            {bookingStep === "mpesa_instructions" && renderMpesaInstructions()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestFormSection;
