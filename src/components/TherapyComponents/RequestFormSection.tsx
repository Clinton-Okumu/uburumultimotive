import { useState, useEffect } from "react";
import Button from "../shared/Button";
import { Mail, Phone, User, CheckCircle, CreditCard, Send, ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type TherapyCategory = "Individual" | "Couples" | "Group";

type TherapyPricingOption = {
  id: string;
  category: TherapyCategory;
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

const getPricingCategory = (assistanceType: string): TherapyCategory | null => {
  if (assistanceType.includes("Couple")) return "Couples";
  if (assistanceType.includes("Group")) return "Group";
  if (
    assistanceType.includes("Individual") ||
    assistanceType.includes("Teens") ||
    assistanceType.includes("Coaching") ||
    assistanceType.includes("Consultation")
  ) {
    return "Individual";
  }
  return null;
};

const isInKenya = (country: string) => country.trim().toLowerCase() === "kenya";

const PAYBILL_NO = "522522";
const ACCOUNT_NO = "1346356289";
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

interface RequestFormSectionProps {
  selectedService?: string;
  onServiceChange?: (service: string) => void;
  onBack?: () => void;
}

const RequestFormSection = ({
  selectedService,
  onServiceChange,
  onBack,
}: RequestFormSectionProps = {}) => {
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
    sessionMode: "Online" | "Physical" | "";
    groupSize: string;
    termsAccepted: boolean;
  };

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    country: "",
    age: "",
    assistanceType: selectedService || "",
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
    sessionMode: "",
    groupSize: "",
    termsAccepted: false,
  });

  useEffect(() => {
    if (selectedService && selectedService !== formData.assistanceType) {
      setFormData((prev) => ({
        ...prev,
        assistanceType: selectedService,
        sessionMode: "",
        pricingOptionId: "",
        groupSize: "",
      }));
    }
  }, [selectedService]);

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
  const pricingCategory = getPricingCategory(formData.assistanceType);
  const isGroup = pricingCategory === "Group";
  const requiresMode =
    isKenyan && pricingCategory !== null && pricingCategory !== "Group";

  const groupSizeNum = Math.max(0, parseInt(formData.groupSize, 10) || 0);
  const groupPricingOption: TherapyPricingOption | null =
    isKenyan && isGroup && groupSizeNum > 1
      ? {
          id: "ke-group",
          category: "Group",
          mode: "Physical",
          sessions: 1,
          amount: groupSizeNum * 1500,
          currency: "KES",
          label: `Group therapy - ${groupSizeNum} people (KES ${(groupSizeNum * 1500).toLocaleString("en-KE")})`,
        }
      : null;

  const availablePricingOptions = THERAPY_PRICING_OPTIONS.filter((option) => {
    if (option.currency !== userCurrency) return false;
    if (pricingCategory === null) return false;
    if (isGroup) return false;
    if (option.category !== pricingCategory) return false;
    if (isKenyan) return option.mode === formData.sessionMode;
    return option.mode === "Online";
  });

  const selectedPricingOption =
    groupPricingOption ||
    availablePricingOptions.find((option) => option.id === formData.pricingOptionId);

  const applyDetectedCountry = (country: string) => {
    setFormData((prev) => {
      const nextCountry = country || prev.country;
      const next: FormData = {
        ...prev,
        country: nextCountry,
      };
      if (isInKenya(nextCountry) !== isInKenya(prev.country)) {
        next.pricingOptionId = "";
        next.sessionMode = "";
        next.groupSize = "";
      }
      return next;
    });

    setLocationStatus("success");
    setLocationMessage(
      country
        ? `Country detected: ${country}`
        : "Country detected successfully.",
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
        throw new Error("IP country lookup failed.");
      }
      const data = await response.json();
      const country = data?.country_name || "";
      if (!country) {
        throw new Error("IP country lookup returned no country.");
      }
      applyDetectedCountry(country);
    } catch (error) {
      setLocationStatus("error");
      setLocationMessage(
        error instanceof Error
          ? `${error.message} Please click Detect Country to try again.`
          : "Unable to detect your country. Please click Detect Country to try again.",
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
            throw new Error("Unable to detect country.");
          }

          const data = await response.json();
          const country = data?.address?.country || "";

          if (!country) {
            throw new Error("Unable to detect country from coordinates.");
          }

          applyDetectedCountry(country);
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
      const next: FormData = {
        ...prev,
        [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
      };

      if (name === "assistanceType") {
        next.sessionMode = "";
        next.pricingOptionId = "";
        next.groupSize = "";
        onServiceChange?.(value);
      }

      if (name === "country") {
        const nextCurrency = isInKenya(value) ? "KES" : "USD";
        const prevCurrency = isInKenya(prev.country) ? "KES" : "USD";
        if (nextCurrency !== prevCurrency) {
          next.pricingOptionId = "";
          next.sessionMode = "";
          next.groupSize = "";
        }
      }

      if (name === "sessionMode") {
        next.pricingOptionId = "";
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
      formData.assistanceReason.includes("Others") &&
      formData.assistanceReasonOther.trim() === ""
    ) {
      setStatus("error");
      setStatusMessage("Please specify the other reason for assistance.");
      return;
    }

    if (requiresMode && !formData.sessionMode) {
      setStatus("error");
      setStatusMessage("Please select a session mode (Online or Physical).");
      return;
    }

    if (isKenyan && isGroup && groupSizeNum <= 1) {
      setStatus("error");
      setStatusMessage("Group therapy requires the number of persons to be greater than 1.");
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
      const subjectHeader = formData.assistanceType
        ? `Website: ${formData.assistanceType} Request`
        : "Website: Therapy Request";
      submitData.set("_subject", subjectHeader);
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
      if (selectedPricingOption.category === "Group") {
        submitData.set("groupSize", String(groupSizeNum));
      }
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
            quantity: selectedPricingOption.category === "Group" ? groupSizeNum : 1,
            category: selectedPricingOption.category,
            mode: selectedPricingOption.mode,
            sessions: selectedPricingOption.sessions,
            amount: selectedPricingOption.amount,
            totalAmount: selectedPricingOption.amount,
            currency: selectedPricingOption.currency,
            ...(selectedPricingOption.category === "Group" ? { groupSize: groupSizeNum } : {}),
            items: [
              {
                itemId: selectedPricingOption.id,
                itemName: selectedPricingOption.label,
                quantity: selectedPricingOption.category === "Group" ? groupSizeNum : 1,
                unitPrice:
                  selectedPricingOption.category === "Group"
                    ? 1500
                    : selectedPricingOption.amount,
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

  const getServiceHeader = () => {
    const service = formData.assistanceType || selectedService || "";
    if (service.includes("Coaching")) {
      return {
        badge: "Life Coaching Request",
        title: "Help us match you to the right life coach",
        subtitle: "Please provide your location to help us find the best life coach available in your region.",
      };
    }
    if (service.includes("Consultation")) {
      return {
        badge: "Medical Consultation Request",
        title: "Help us match you to the right medical consultant",
        subtitle: "Please provide your location to help us find the best medical expert available in your region.",
      };
    }
    return {
      badge: "Therapy Request",
      title: "Help us match you to the right therapist",
      subtitle: "Please provide your location to help us find the best therapist available in your region.",
    };
  };

  const renderLocationStep = () => {
    const serviceHeader = getServiceHeader();
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
            {serviceHeader.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
            {serviceHeader.title}
          </h2>
          <p className="text-gray-600 text-base max-w-xl mx-auto font-medium">
            {serviceHeader.subtitle}
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
};

  const renderForm = () => (
    <form onSubmit={handleRegister} className="space-y-8">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-600 hover:text-yellow-600 mb-2 bg-white hover:bg-yellow-100 px-5 py-2.5 rounded-full transition-all border border-neutral-200/80 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Support Pathways
        </button>
      )}

      {/* SECTION 1: Client Personal Details & Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Client Details */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Client details <span className="text-red-500">*</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                What are your names? *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Full name"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                  className="w-full pl-12 pr-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                Client phone number? *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="+254 123 456 789"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Client's age? *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min={1}
                  className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Age"
                />
              </div>

              <div>
                <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Detected Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  readOnly
                  className="w-full px-5 py-4 bg-neutral-100 border border-neutral-200/80 rounded-2xl font-bold text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Gender of Client */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5 flex flex-col justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Gender of Client? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 mt-auto">
            {["Woman", "Man"].map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-2xl border p-5 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.gender === option
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={formData.gender === option}
                  onChange={handleChange}
                  required
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.gender === option
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.gender === option && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Service Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 3: Type of Therapy */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5 md:col-span-2">
          <h3 className="text-xl font-bold text-gray-900">
            What type of support are you looking for? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "Individual Therapy (For Myself)", val: "Individual Therapy (For Myself)" },
              { label: "Couple Therapy (For Couples)", val: "Couple Therapy (for myself and my partner)" },
              { label: "Teens Therapy (For Child)", val: "Teens Therapy (For child)" },
              ...(isKenyan ? [{ label: "Group Therapy", val: "Group Therapy" }] : []),
            ].map((item) => (
              <label
                key={item.val}
                className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.assistanceType === item.val
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{item.label}</span>
                <input
                  type="radio"
                  name="assistanceType"
                  value={item.val}
                  checked={formData.assistanceType === item.val}
                  onChange={handleChange}
                  required
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                    formData.assistanceType === item.val
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.assistanceType === item.val && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Card: Group Size */}
        {isGroup && (
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              Number of Persons <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Group therapy rate is <span className="font-bold text-gray-900">KES 1,500</span> per person (must be greater than 1 person).
              </p>
              <div>
                <input
                  type="number"
                  name="groupSize"
                  min="2"
                  step="1"
                  value={formData.groupSize}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  required
                  className="w-full rounded-2xl border border-neutral-200/80 px-4 py-3.5 text-base font-semibold text-gray-900 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>
              {groupSizeNum > 1 ? (
                <div className="rounded-xl bg-yellow-50 border border-yellow-200/80 p-4 text-sm font-medium text-yellow-950 flex items-center justify-between">
                  <span>Total ({groupSizeNum} persons × KES 1,500):</span>
                  <span className="text-lg font-black text-gray-900">
                    KES {(groupSizeNum * 1500).toLocaleString("en-KE")}
                  </span>
                </div>
              ) : formData.groupSize !== "" ? (
                <p className="text-xs font-semibold text-red-500">
                  Number of persons must be greater than 1.
                </p>
              ) : null}
            </div>
          </div>
        )}

        {/* Card 4: Session Mode */}
        {requiresMode && (
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              Session Mode <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["Online", "Physical"].map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                    formData.sessionMode === option
                      ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                      : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                  }`}
                >
                  <span>{option === "Physical" ? "In Person" : "Online"}</span>
                  <input
                    type="radio"
                    name="sessionMode"
                    value={option}
                    checked={formData.sessionMode === option}
                    onChange={handleChange}
                    required
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.sessionMode === option
                        ? "border-yellow-500 bg-yellow-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.sessionMode === option && (
                      <div className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Card 5: Practitioner Preference */}
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Practitioner Gender Preference <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Female", val: "Female" },
              { label: "Male", val: "Male" },
              { label: "No Preference", val: "Any is okay" },
            ].map((option) => (
              <label
                key={option.val}
                className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.practitionerGender === option.val
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{option.label}</span>
                <input
                  type="radio"
                  name="practitionerGender"
                  value={option.val}
                  checked={formData.practitionerGender === option.val}
                  onChange={handleChange}
                  required
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    formData.practitionerGender === option.val
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.practitionerGender === option.val && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: Selectable Package Cards */}
      {isGroup ? (
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Group Therapy Package & Pricing <span className="text-red-500">*</span>
          </h3>
          {groupSizeNum > 1 ? (
            <div className="rounded-2xl border-2 border-yellow-500 bg-yellow-50/70 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
                  1 Session • {groupSizeNum} Persons
                </span>
                <h4 className="text-xl font-bold text-gray-900 mt-2">Group Therapy Package</h4>
                <p className="text-sm font-medium text-gray-600 mt-1">
                  KES 1,500 per person × {groupSizeNum} persons
                </p>
              </div>
              <div className="sm:text-right">
                <div className="text-2xl sm:text-3xl font-black text-gray-900">
                  KES {(groupSizeNum * 1500).toLocaleString("en-KE")}
                </div>
                <span className="text-xs font-semibold text-gray-500">Total payable</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-500 text-sm">
              Please enter the number of persons (greater than 1) above to calculate total package pricing.
            </div>
          )}
        </div>
      ) : (
        availablePricingOptions.length > 0 && (
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              Select Therapy Package & Pricing <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePricingOptions.map((option) => {
                const isSelected = formData.pricingOptionId === option.id;
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
                      name="pricingOptionId"
                      value={option.id}
                      checked={isSelected}
                      onChange={handleChange}
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
                      {option.mode} {option.category} Therapy
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* SECTION 4: Background & Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Have you done therapy before? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.priorTherapy === option
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="priorTherapy"
                  value={option}
                  checked={formData.priorTherapy === option}
                  onChange={handleChange}
                  required
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.priorTherapy === option
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.priorTherapy === option && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-gray-900">
            Currently taking medication? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition-all flex items-center justify-between ${
                  formData.medication === option
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="medication"
                  value={option}
                  checked={formData.medication === option}
                  onChange={handleChange}
                  required
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.medication === option
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.medication === option && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: Reasons for Seeking Support */}
      <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-neutral-200/80 shadow-sm space-y-5">
        <h3 className="text-xl font-bold text-gray-900">
          What led you to consider our assistance? <span className="text-red-500">*</span>
        </h3>
        <p className="text-xs text-gray-500">Select all that apply.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
          ].map((option) => {
            const isSelected = formData.assistanceReason.includes(option);
            return (
              <button
                type="button"
                key={option}
                onClick={() => handleReasonToggle(option)}
                className={`rounded-2xl border p-4 text-sm font-bold text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-yellow-500 bg-yellow-50 text-gray-900 shadow-sm ring-2 ring-yellow-400/20"
                    : "border-neutral-200/80 bg-neutral-50/50 text-gray-700 hover:bg-neutral-100/70"
                }`}
              >
                <span>{option}</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                    isSelected ? "border-yellow-500 bg-yellow-500" : "border-gray-300"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
              </button>
            );
          })}
        </div>

        {formData.assistanceReason.includes("Others") && (
          <div className="pt-3">
            <input
              type="text"
              name="assistanceReasonOther"
              value={formData.assistanceReasonOther}
              onChange={handleChange}
              placeholder="Specify other reason"
              className="w-full px-5 py-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        )}
      </div>

      {/* SECTION 6: Terms & Submit Button */}
      <div className="pt-6 border-t border-neutral-200/80 space-y-6">
        <label className="flex items-start gap-3.5 cursor-pointer">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            required
            className="mt-1 w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
          />
          <span className="text-sm font-medium text-gray-600 leading-relaxed">
            By booking a therapy appointment under Uburu, you confirm that you are doing so voluntarily. Read our{" "}
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
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
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

  const getFormTitle = () => {
    const service = formData.assistanceType || selectedService || "";
    if (service.includes("Coaching")) return "Uburu Life Coaching Form";
    if (service.includes("Consultation")) return "Uburu Medical Consultation Form";
    return "Uburu Therapy Form";
  };

  const formTitle = getFormTitle();

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            {formTitle}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
            {formTitle}
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
                {isGroup ? (
                  <div>
                    <p className="font-semibold text-gray-800">Group therapy</p>
                    <p className="text-gray-600">KES 1,500 per person</p>
                    <p className="text-gray-500 text-xs">Must be greater than 1 person</p>
                    {groupSizeNum > 1 && (
                      <p className="text-yellow-700 font-bold mt-2 text-xs">
                        Total for {groupSizeNum} persons: KES {(groupSizeNum * 1500).toLocaleString("en-KE")}
                      </p>
                    )}
                  </div>
                ) : availablePricingOptions.length > 0 ? (
                  (() => {
                    const grouped = availablePricingOptions.reduce(
                      (acc, option) => {
                        const key = `${option.mode} ${option.category.toLowerCase()}`;
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(option);
                        return acc;
                      },
                      {} as Record<string, TherapyPricingOption[]>,
                    );
                    return Object.entries(grouped).map(([key, options]) => (
                      <div key={key}>
                        <p className="font-semibold text-gray-800 capitalize">{key}</p>
                        {options.map((option) => (
                          <p key={option.id} className="text-gray-600">
                            {option.sessions} session{option.sessions > 1 ? "s" : ""} -{" "}
                            {formatAmount(option.amount, option.currency)}
                          </p>
                        ))}
                      </div>
                    ));
                  })()
                ) : (
                  <p className="text-gray-500">
                    Select a therapy type
                    {isKenyan ? " and session mode" : ""} to see pricing.
                  </p>
                )}
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
    </div>
  );
};

export default RequestFormSection;
