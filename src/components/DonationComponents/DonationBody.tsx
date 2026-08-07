import { XCircle, Loader, CreditCard, Smartphone, Copy, Check, Send, Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type PaymentStatus = "idle" | "processing";
type CurrencyCode = "KES" | "USD";
type PaymentMethod = "card" | "paybill";

const DONATE_PAYBILL_NO = "910200";
const DONATE_ACCOUNT_NO = "2110122664";
const WHATSAPP_NUMBER = "254718421205";

const DonationBody = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("KES");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedField, setCopiedField] = useState<"paybill" | "account" | null>(null);

  const currencyOptions: { code: CurrencyCode; label: string }[] = [
    { code: "KES", label: "KES (Kenyan Shilling)" },
    { code: "USD", label: "USD (US Dollar)" },
  ];

  const handleCopy = (text: string, field: "paybill" | "account") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field === "paybill" ? "Paybill number" : "Account number"} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleWhatsAppShare = () => {
    const message = `*UBURU DONATION CONFIRMATION*%0A%0A*Payment Method:* M-Pesa Paybill%0A*Paybill No:* ${DONATE_PAYBILL_NO}%0A*Account No:* ${DONATE_ACCOUNT_NO}%0A${amount ? `*Amount:* ${currency} ${amount}%0A` : ""}${name ? `*Name:* ${name}%0A` : ""}%0A_I have completed my donation via M-Pesa._`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const getFriendlyErrorMessage = (message: string) => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmedMessage) as { error?: string };
        if (parsed?.error) {
          return getFriendlyErrorMessage(parsed.error);
        }
      } catch {
        // Fall through to default handling.
      }
    }

    const normalizedMessage = trimmedMessage.toLowerCase();
    if (normalizedMessage.includes("amount out of range")) {
      return "Donation amount must be at least 1.";
    }
    if (normalizedMessage.includes("invalid amount")) {
      return "Please enter a valid donation amount.";
    }
    if (normalizedMessage.includes("unsupported currency")) {
      return "This currency is not supported for donations.";
    }
    if (normalizedMessage.includes("missing payment url")) {
      return "We could not start the payment. Please try again.";
    }
    if (
      normalizedMessage.includes("invalid response from payment gateway") ||
      normalizedMessage.includes("empty response from payment gateway")
    ) {
      return "Payment service is temporarily unavailable. Please try again.";
    }
    if (
      normalizedMessage.includes("missing company token configuration") ||
      normalizedMessage.includes("missing api endpoint configuration") ||
      normalizedMessage.includes("missing pay url configuration") ||
      normalizedMessage.includes("missing redirect or back url configuration") ||
      normalizedMessage.includes("invalid redirect or back url configuration") ||
      normalizedMessage.includes("invalid service type configuration")
    ) {
      return "Payment service is unavailable right now. Please try again later.";
    }

    return trimmedMessage || "Payment failed. Please try again.";
  };

  const handleError = (message: string) => {
    const friendlyMessage = getFriendlyErrorMessage(message);
    setErrorMessage(friendlyMessage);
    toast.error(friendlyMessage);
    setPaymentStatus("idle");
  };

  const handleSubmit = async () => {
    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      handleError("Please enter a valid donation amount.");
      return;
    }
    if (!name.trim()) {
      handleError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      handleError("Please enter your email address.");
      return;
    }

    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      const response = await fetch("/api/dpo/create-token.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          currency,
          customer: {
            name: name.trim(),
            email: email.trim(),
            phone: undefined,
          },
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        const errorPayload = contentType.includes("application/json")
          ? await response.json()
          : null;
        const errorText = !errorPayload ? await response.text() : "";
        const apiMessage = errorPayload?.error || errorText;
        throw new Error(apiMessage || "Unable to start payment.");
      }

      const data = await response.json();

      if (!data?.paymentUrl) {
        const apiError = data?.error ? ` ${data.error}` : "";
        throw new Error(`Missing payment URL. Please try again.${apiError}`);
      }

      window.location.href = data.paymentUrl;
    } catch (error) {
      handleError(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again.",
      );
      setPaymentStatus("idle");
    }
  };

  const isFormDisabled = paymentStatus === "processing";

  return (
    <div className="w-full bg-gray-50 py-16 px-4 md:px-0">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-neutral-100">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Support Our Cause
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Support Our Mission
          </h2>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Your contribution directly impacts communities we serve. Choose your preferred donation method below.
          </p>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 p-1.5 bg-neutral-100/80 rounded-2xl border border-neutral-200">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`py-4 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 ${
              paymentMethod === "card"
                ? "bg-white text-neutral-900 shadow-md border border-neutral-200"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <CreditCard className={`w-4 h-4 ${paymentMethod === "card" ? "text-yellow-600" : "text-neutral-500"}`} />
            <span>Card / Online Payment</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("paybill")}
            className={`py-4 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 ${
              paymentMethod === "paybill"
                ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>M-Pesa Paybill</span>
          </button>
        </div>

        {/* TAB 1: Online Card Payment */}
        {paymentMethod === "card" && (
          <div>
            {errorMessage && (
              <div className="mb-8 bg-red-50 border border-red-200 p-6 rounded-xl flex items-start gap-3">
                <XCircle className="text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Payment Failed</h3>
                  <p className="text-red-700">{errorMessage}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Please check your amount and try again.
                  </p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 text-gray-700 font-bold uppercase text-xs tracking-wider">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    disabled={isFormDisabled}
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                  >
                    {currencyOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-gray-700 font-bold uppercase text-xs tracking-wider">
                    Donation Amount
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter amount in ${currency}`}
                    disabled={isFormDisabled}
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block mb-2 text-gray-700 font-bold uppercase text-xs tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                  placeholder="Your full name"
                  disabled={isFormDisabled}
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-bold uppercase text-xs tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                  placeholder="you@email.com"
                  disabled={isFormDisabled}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-6 text-center">
              You will be redirected to a secure card payment gateway to complete your donation.
            </p>

            {paymentStatus === "idle" && (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isFormDisabled}
              >
                <Heart className="w-4 h-4 fill-black" />
                <span>Donate Now via Card</span>
              </button>
            )}

            {paymentStatus === "processing" && (
              <div className="w-full bg-yellow-400 text-black py-5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3">
                <Loader className="animate-spin" />
                <span>Redirecting to Payment...</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: M-Pesa Paybill */}
        {paymentMethod === "paybill" && (
          <div className="space-y-6">
            {/* Paybill Details Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50/80 border-2 border-green-200 rounded-2xl p-5 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700 block mb-1">
                  M-Pesa Paybill No.
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-green-950 tracking-wider">
                    {DONATE_PAYBILL_NO}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(DONATE_PAYBILL_NO, "paybill")}
                    className="p-2 bg-green-200/80 hover:bg-green-300 text-green-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    {copiedField === "paybill" ? (
                      <Check className="w-4 h-4 text-green-800" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50/80 border-2 border-yellow-200 rounded-2xl p-5 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-800 block mb-1">
                  Account No.
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-yellow-950 tracking-wider">
                    {DONATE_ACCOUNT_NO}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(DONATE_ACCOUNT_NO, "account")}
                    className="p-2 bg-yellow-200/80 hover:bg-yellow-300 text-yellow-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    {copiedField === "account" ? (
                      <Check className="w-4 h-4 text-yellow-800" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* M-Pesa Step by Step Instructions */}
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
              <h4 className="font-extrabold text-neutral-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-green-600" />
                How to Donate via M-Pesa:
              </h4>

              <ol className="space-y-3 text-sm text-neutral-700 font-medium">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span>Go to the <strong>M-Pesa menu</strong> on your phone.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <span>Select <strong>Lipa na M-Pesa</strong> → <strong>Pay Bill</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <span>Enter Business No: <strong className="text-green-800 font-extrabold">{DONATE_PAYBILL_NO}</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <span>Enter Account No: <strong className="text-yellow-800 font-extrabold">{DONATE_ACCOUNT_NO}</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white font-bold text-xs flex items-center justify-center">
                    5
                  </span>
                  <span>Enter your desired donation <strong>Amount</strong> and <strong>M-Pesa PIN</strong> to send.</span>
                </li>
              </ol>
            </div>

            {/* Optional WhatsApp Confirmation Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2.5"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Payment via WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationBody;
