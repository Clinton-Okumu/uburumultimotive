import { XCircle, Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type PaymentStatus = "idle" | "processing";

type CurrencyCode = "KES" | "USD";

const DonationBody = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("KES");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const currencyOptions: { code: CurrencyCode; label: string }[] = [
    { code: "KES", label: "KES (Kenyan Shilling)" },
    { code: "USD", label: "USD (US Dollar)" },
  ];

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
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Support Our Mission
        </h2>
        <p className="text-gray-600 text-center mb-10">
          Your contribution directly impacts communities we serve.
        </p>

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
              <label className="block mb-2 text-gray-700 font-medium">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                disabled={isFormDisabled}
                className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {currencyOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-gray-700 font-medium">
                Donation Amount
              </label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount in ${currency}`}
                disabled={isFormDisabled}
                className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Your name"
              disabled={isFormDisabled}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="you@email.com"
              disabled={isFormDisabled}
            />
          </div>
        </div>

        <div className="mb-10">
          <p className="text-sm text-gray-600 mb-4">
            You'll be redirected to a secure DPO payment page to complete your
            donation.
          </p>
        </div>

        {paymentStatus === "idle" && (
          <button
            onClick={handleSubmit}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isFormDisabled}
          >
            Donate Now
          </button>
        )}

        {paymentStatus === "processing" && (
          <div className="w-full bg-yellow-400 text-black py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3">
            <Loader className="animate-spin" />
            <span>Redirecting to Payment...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationBody;
