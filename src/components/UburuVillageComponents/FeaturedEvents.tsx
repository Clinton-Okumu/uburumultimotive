import { useState, type FormEvent } from "react";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import { villageEventOptions } from "../../data/storefrontCatalog";
import olooluaNatureTrail from "../../assets/oloolua.webp";
import maa from "../../assets/maa.webp";

const clampPeopleCount = (value: number, min: number) => Math.max(min, Math.min(99, value));

const formatAmount = (amount: number) => `KES ${amount.toLocaleString("en-KE")}`;

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const [peopleCount, setPeopleCount] = useState(5);
  const [paymentAction, setPaymentAction] = useState<"pay_now" | "pay_later">("pay_now");
  const [payLaterStatus, setPayLaterStatus] = useState<{
    state: "idle" | "sending" | "sent" | "error";
    message: string;
  }>({ state: "idle", message: "" });

  const olooluaOption = villageEventOptions.find(
    (option) => option.id === "oloolua-nature-trail-group",
  );

  const { cartItemCount, updateQuantity, addToCart } = useStorefrontCheckout({
    catalog: villageEventOptions.map(({ id, name, price }) => ({ id, name, price })),
    context: "uburu_village",
    purchaseType: "event_purchase",
    emptyCartMessage: "Please add at least one package to your cart.",
    storageKey: "uburu_village_cart",
  });

  const goToCheckout = () => {
    navigate("/checkout?source=village");
  };

  const goToMaasaiPackage = () => {
    navigate("/get/village/maasai-mara");
  };

  const handleOlooluaCheckout = () => {
    if (!olooluaOption) {
      return;
    }

    const safePeopleCount = clampPeopleCount(peopleCount, 5);
    updateQuantity(olooluaOption.id, safePeopleCount);
    addToCart(olooluaOption.id);
    goToCheckout();
  };

  const handlePayLaterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (payLaterStatus.state === "sending") {
      return;
    }

    setPayLaterStatus({ state: "sending", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = (formData.get("fullName") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();

    if (!phone && !email) {
      setPayLaterStatus({
        state: "error",
        message: "Add a phone number or email so we can reach you.",
      });
      return;
    }

    const safePeopleCount = clampPeopleCount(peopleCount, 5);
    const unitPrice = olooluaOption?.price ?? 1500;
    const totalAmount = safePeopleCount * unitPrice;

    const submitData = new FormData();
    submitData.set("name", fullName);
    submitData.set("email", email || "no-reply@uburumultimovehs.org");
    submitData.set("phone", phone);
    submitData.set("eventName", "Oloolua nature trail");
    submitData.set("peopleCount", String(safePeopleCount));
    submitData.set("totalAmount", formatAmount(totalAmount));
    submitData.set(
      "message",
      `Pay later request for Oloolua nature trail. Guests: ${safePeopleCount}. Unit price: ${formatAmount(unitPrice)} per person. Total: ${formatAmount(totalAmount)}. Contact: ${phone || "N/A"} / ${email || "N/A"}.`,
    );
    submitData.set("_subject", "Uburu Village: Oloolua pay later request");

    try {
      const response = await fetch("https://formspree.io/f/xpqjaolz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: submitData,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMessage =
          data?.error ||
          data?.errors
            ?.map?.((item: { message?: string }) => item?.message)
            .filter(Boolean)
            .join(", ") ||
          "Unable to send your details right now.";
        throw new Error(errorMessage);
      }

      setPayLaterStatus({
        state: "sent",
        message: "Received. We will contact you shortly to complete your booking.",
      });
      form.reset();
    } catch (error) {
      setPayLaterStatus({
        state: "error",
        message:
          error instanceof Error ? error.message : "Unable to send your details right now.",
      });
    }
  };

  const olooluaTotal = (olooluaOption?.price ?? 1500) * clampPeopleCount(peopleCount, 5);

  return (
    <section id="events" className="relative bg-[#f8fbff] px-6 py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#f2c15d]/30 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#2f6f99]/15 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5c6f86]">Featured events</p>
            <h2 className="mt-3 text-3xl font-black text-[#1c3b57] sm:text-4xl">
              Outdoor events for every kind of explorer.
            </h2>
            <p className="mt-3 max-w-xl text-base font-semibold text-[#5c6f86]">
              Keep the two quick cards here, then open the full Maasai package planner when needed.
            </p>
          </div>
          <Button
            onClick={goToCheckout}
            className="bg-[#f2c15d] px-6 py-3 text-xs font-black uppercase tracking-[0.25em] text-[#1c3b57] hover:bg-[#ffd886]"
          >
            <span className="inline-flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Checkout ({cartItemCount})
            </span>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="group overflow-hidden rounded-3xl border border-[#2f6f99] bg-white shadow-lg">
            <div className="relative h-56 overflow-hidden">
              <img
                src={olooluaNatureTrail}
                alt="Oloolua nature trail"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-3xl font-black text-[#1c3b57]">Oloolua nature trail</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#6a7c92]">Uburu Village</p>
                </div>
                <div className="rounded-2xl bg-[#f2c15d]/20 px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7a5d00]">
                  {formatAmount(olooluaTotal)}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#5c6f86]">
                Group bookings only: minimum 5 people at KES 1,500 per person
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] px-3 py-2">
                <button
                  type="button"
                  onClick={() => setPeopleCount((prev) => clampPeopleCount(prev - 1, 5))}
                  className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-[#1c3b57] shadow-sm"
                  aria-label="Decrease Oloolua people count"
                >
                  -
                </button>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a7c92]">
                    Number of people
                  </p>
                  <input
                    type="number"
                    min={5}
                    max={99}
                    value={peopleCount}
                    onChange={(event) =>
                      setPeopleCount(clampPeopleCount(Number(event.target.value) || 5, 5))
                    }
                    className="w-20 bg-transparent text-center text-base font-black text-[#1c3b57] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPeopleCount((prev) => clampPeopleCount(prev + 1, 5))}
                  className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-[#1c3b57] shadow-sm"
                  aria-label="Increase Oloolua people count"
                >
                  +
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] p-2">
                <button
                  type="button"
                  onClick={() => setPaymentAction("pay_now")}
                  className={`rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                    paymentAction === "pay_now" ? "bg-[#2f6f99] text-white" : "bg-white text-[#5c6f86]"
                  }`}
                >
                  Pay now
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentAction("pay_later")}
                  className={`rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                    paymentAction === "pay_later"
                      ? "bg-[#2f6f99] text-white"
                      : "bg-white text-[#5c6f86]"
                  }`}
                >
                  Pay later
                </button>
              </div>

              {paymentAction === "pay_later" && (
                <form className="mt-4 space-y-3" onSubmit={handlePayLaterSubmit}>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    required
                    className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email (optional)"
                    className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                  />
                  {payLaterStatus.state !== "idle" && (
                    <div
                      className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                        payLaterStatus.state === "sent"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {payLaterStatus.message}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-[#f2c15d] py-3 text-xs font-black uppercase tracking-[0.2em] text-[#1c3b57] hover:bg-[#ffd886]"
                    disabled={payLaterStatus.state === "sending"}
                  >
                    {payLaterStatus.state === "sending" ? "Sending..." : "Send pay later request"}
                  </Button>
                </form>
              )}

              <Button
                onClick={handleOlooluaCheckout}
                disabled={paymentAction === "pay_later"}
                className="mt-5 w-full bg-[#2f6f99] py-3 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-[#3b83b4]"
              >
                Proceed to checkout
              </Button>
            </div>
          </div>

          <div className="group overflow-hidden rounded-3xl border border-[#e6eef7] bg-white shadow-lg">
            <div className="relative h-56 overflow-hidden">
              <img
                src={maa}
                alt="Maasai Mara Migration Season"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-3xl font-black text-[#1c3b57]">Maasai Mara Migration Season</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#6a7c92]">Uburu Village</p>
                </div>
                <div className="rounded-2xl bg-[#f2c15d]/20 px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7a5d00]">
                  From KES 27,500
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#5c6f86]">
                Resident and non-resident pricing across camps. Meal plans vary by travel month.
              </div>

              <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] px-4 py-3 text-sm font-semibold text-[#32556f]">
                Open full package details to select camp, residency type, month window, and people count.
              </div>

              <Button
                onClick={goToMaasaiPackage}
                className="mt-5 w-full bg-[#f2c15d] py-3 text-xs font-black uppercase tracking-[0.24em] text-[#1c3b57] hover:bg-[#ffd886]"
              >
                View full package
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
