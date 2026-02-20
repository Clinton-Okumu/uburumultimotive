import { useState } from "react";
import { CheckCircle, Loader } from "lucide-react";
import Button from "../shared/Button";
import culturalEvent from "../../assets/Screenshot-2026-02-20_10-06-49.webp";
import communityPainting from "../../assets/community-painting-wood-medium-shot.webp";
import footballCircle from "../../assets/top-view-childs-feet-around-football-ball.webp";
import  charityHome from "../../assets/pic20.webp";

type PaymentStatus = "idle" | "processing" | "success" | "error";

const events = [
  {
    id: "charity-home",
    name: "Charity home",
    price: 1500,
    tag: "Care",
    image: charityHome,
  },
  {
    id: "gala-dinner",
    name: "Cultural concert/performance",
    price: 4500,
    tag: "Live",
    image: culturalEvent,
  },
  {
    id: "quiz-evening",
    name: "Quiz evening",
    price: 1200,
    tag: "Interactive",
    image: communityPainting,
  },
  {
    id: "sport-tournaments",
    name: "Sport tournaments",
    price: 2000,
    tag: "All ages",
    image: footballCircle,
  },
];

const FeaturedEvents = () => {
  const [quantities, setQuantities] = useState(
    Object.fromEntries(events.map((event) => [event.id, 1])) as Record<
      string,
      number
    >,
  );
  const [selectedEventId, setSelectedEventId] = useState(events[0].id);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  const updateQuantity = (eventId: string, nextValue: number) => {
    const safeValue = Math.max(1, Math.min(99, nextValue));
    setQuantities((prev) => ({ ...prev, [eventId]: safeValue }));
  };

  const handleBuyClick = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const getFriendlyErrorMessage = (message: string) => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.toLowerCase().includes("invalid amount")) {
      return "Please check the total amount and try again.";
    }
    if (trimmedMessage.toLowerCase().includes("unsupported currency")) {
      return "This currency is not supported.";
    }
    if (trimmedMessage.toLowerCase().includes("missing payment url")) {
      return "We could not start the payment. Please try again.";
    }
    return trimmedMessage || "Payment failed. Please try again.";
  };

  const handleCheckout = async () => {
    if (!selectedEvent) return;
    if (!buyerName.trim()) {
      setStatus("error");
      setStatusMessage("Please enter your full name.");
      return;
    }
    if (!buyerEmail.trim()) {
      setStatus("error");
      setStatusMessage("Please enter your email address.");
      return;
    }

    const quantity = quantities[selectedEvent.id] ?? 1;
    const totalAmount = selectedEvent.price * quantity;

    setStatus("processing");
    setStatusMessage("");

    try {
      const response = await fetch("/api/dpo/create-token.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "KES",
          customer: {
            name: buyerName.trim(),
            email: buyerEmail.trim(),
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

      setStatus("success");
      setStatusMessage("Redirecting you to DPO to complete payment.");
      window.location.href = data.paymentUrl;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again.";
      setStatus("error");
      setStatusMessage(getFriendlyErrorMessage(message));
    }
  };

  return (
    <section id="events" className="relative bg-[#f8fbff] px-6 py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#f2c15d]/30 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#2f6f99]/15 blur-[140px]" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5c6f86]">
              Featured events
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#1c3b57] sm:text-4xl">
              Outdoor events for every kind of explorer.
            </h2>
            <p className="mt-3 max-w-xl text-base font-semibold text-[#5c6f86]">
              Grab tickets for the next adventure and keep community programs moving.
            </p>
          </div>
          <div className="flex items-center gap-3">
              <span className="rounded-full border border-[#dbe7f3] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-[#5c6f86]">
                5 events
              </span>
            <Button className="bg-[#f2c15d] text-[#1c3b57] hover:bg-[#ffd886] px-6 py-3 text-xs font-black uppercase tracking-[0.3em]">
              View all
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => (
            <div
              key={event.id}
              className={`group overflow-hidden rounded-3xl border bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1 ${
                selectedEventId === event.id
                  ? "border-[#2f6f99] ring-2 ring-[#2f6f99]/25"
                  : "border-[#e6eef7]"
              }`}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#1c3b57] shadow-sm">
                  {event.tag}
                </span>
                <span className="absolute bottom-4 left-4 rounded-full bg-[#1c3b57]/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#f2c15d]">
                  Tickets open
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-[#1c3b57]">
                      {event.name}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#6a7c92]">
                      Uburu Village
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#f2c15d]/20 px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7a5d00]">
                    KES {event.price.toLocaleString("en-KE")}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-3 py-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(event.id, (quantities[event.id] ?? 1) - 1)}
                    className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-[#1c3b57] shadow-sm"
                    aria-label={`Decrease ${event.name} ticket quantity`}
                  >
                    -
                  </button>
                  <span className="text-xs font-black uppercase tracking-widest text-[#6a7c92]">
                    Qty:
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={quantities[event.id] ?? 1}
                    onChange={(eventInput) =>
                      updateQuantity(event.id, Number(eventInput.target.value) || 1)
                    }
                    className="w-16 bg-transparent text-center text-sm font-black text-[#1c3b57] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(event.id, (quantities[event.id] ?? 1) + 1)}
                    className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-[#1c3b57] shadow-sm"
                    aria-label={`Increase ${event.name} ticket quantity`}
                  >
                    +
                  </button>
                </div>
                <Button
                  onClick={() => handleBuyClick(event.id)}
                  className="mt-5 w-full bg-[#2f6f99] text-white hover:bg-[#3b83b4] py-3 text-xs font-black uppercase tracking-[0.3em]"
                >
                  Book ticket
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[2.5rem] border border-[#dbe7f3] bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5c6f86]">
                Checkout
              </p>
              <h3 className="mt-2 text-2xl font-black text-[#1c3b57]">
                Confirm your tickets
              </h3>
              <p className="mt-2 text-sm font-semibold text-[#5c6f86]">
                Payments are processed securely via DPO.
              </p>
            </div>
            {selectedEvent && (
              <div className="rounded-2xl border border-[#dbe7f3] bg-white px-5 py-4 text-sm font-bold text-[#3b4b74]">
                {selectedEvent.name} · Qty: {quantities[selectedEvent.id] ?? 1}
                <span className="ml-2 text-[#1c3b57]">
                  KES {(selectedEvent.price * (quantities[selectedEvent.id] ?? 1)).toLocaleString("en-KE")}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={buyerName}
              onChange={(eventInput) => setBuyerName(eventInput.target.value)}
              placeholder="Full name"
              className="w-full rounded-2xl border border-[#dbe7f3] bg-white px-5 py-4 text-sm font-bold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#f2c15d]"
            />
            <input
              type="email"
              value={buyerEmail}
              onChange={(eventInput) => setBuyerEmail(eventInput.target.value)}
              placeholder="Email address"
              className="w-full rounded-2xl border border-[#dbe7f3] bg-white px-5 py-4 text-sm font-bold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#f2c15d]"
            />
          </div>

          {status !== "idle" && (
            <div
              className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${
                status === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {status === "error" ? (
                <span className="mt-0.5">!</span>
              ) : (
                <CheckCircle className="mt-0.5 h-4 w-4" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={handleCheckout}
              disabled={status === "processing"}
              className="w-full bg-[#f2c15d] text-[#1c3b57] hover:bg-[#ffd886] py-4 text-sm font-black uppercase tracking-[0.3em]"
            >
              {status === "processing" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Redirecting...
                </span>
              ) : (
                "PAY"
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
