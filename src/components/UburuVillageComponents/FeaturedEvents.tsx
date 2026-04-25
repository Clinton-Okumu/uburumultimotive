import { useState, type FormEvent } from "react";
import { Ticket, X, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import { villageEventOptions } from "../../data/storefrontCatalog";
import olooluaNatureTrail from "../../assets/oloolua.webp";
import maa from "../../assets/maa.webp";
import therapeuticTripImage from "../../assets/event3.avif";

const clampPeopleCount = (value: number, min: number) => Math.max(min, Math.min(99, value));

const formatAmount = (amount: number, currency: string = "KES") => {
  const locale = currency === "KES" ? "en-KE" : "en-US";
  return `${currency} ${amount.toLocaleString(locale)}`;
};

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  const [olooluaPeopleCount, setOlooluaPeopleCount] = useState(5);
  const [olooluaPaymentAction, setOlooluaPaymentAction] = useState<"pay_now" | "pay_later">("pay_now");
  const [olooluaPayLaterStatus, setOlooluaPayLaterStatus] = useState<{
    state: "idle" | "sending" | "sent" | "error";
    message: string;
  }>({ state: "idle", message: "" });

  const [therapyResidency, setTherapyResidency] = useState<"resident" | "non_resident">("resident");
  const [therapyPeopleCount, setTherapyPeopleCount] = useState(6);
  const [therapyPaymentAction, setTherapyPaymentAction] = useState<"pay_now" | "pay_later">("pay_now");
  const [therapyPayLaterStatus, setTherapyPayLaterStatus] = useState<{
    state: "idle" | "sending" | "sent" | "error";
    message: string;
  }>({ state: "idle", message: "" });

  const olooluaOption = villageEventOptions.find(
    (option) => option.id === "oloolua-nature-trail-group",
  );

  const therapyResidentOption = villageEventOptions.find(
    (option) => option.id === "therapeutic-trip-resident",
  );
  const therapyNonResidentOption = villageEventOptions.find(
    (option) => option.id === "therapeutic-trip-non-resident",
  );

  const activeTherapyOption = therapyResidency === "resident" ? therapyResidentOption : therapyNonResidentOption;

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

    const safePeopleCount = clampPeopleCount(olooluaPeopleCount, 5);
    updateQuantity(olooluaOption.id, safePeopleCount);
    addToCart(olooluaOption.id);
    goToCheckout();
  };

  const handleTherapyCheckout = () => {
    if (!activeTherapyOption) {
      return;
    }

    const safePeopleCount = clampPeopleCount(therapyPeopleCount, 6);
    updateQuantity(activeTherapyOption.id, safePeopleCount);
    addToCart(activeTherapyOption.id);
    goToCheckout();
  };

  const handlePayLaterSubmit = async (
    event: FormEvent<HTMLFormElement>,
    eventName: string,
    peopleCount: number,
    unitPrice: number,
    currency: string,
    setStatus: (status: { state: "idle" | "sending" | "sent" | "error"; message: string }) => void,
  ) => {
    event.preventDefault();
    setStatus({ state: "sending", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = (formData.get("fullName") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();

    if (!phone && !email) {
      setStatus({
        state: "error",
        message: "Add a phone number or email so we can reach you.",
      });
      return;
    }

    const totalAmount = peopleCount * unitPrice;

    const submitData = new FormData();
    submitData.set("name", fullName);
    submitData.set("email", email || "no-reply@uburumultimovehs.org");
    submitData.set("phone", phone);
    submitData.set("eventName", eventName);
    submitData.set("peopleCount", String(peopleCount));
    submitData.set("totalAmount", formatAmount(totalAmount, currency));
    submitData.set(
      "message",
      `Pay later request for ${eventName}. Guests: ${peopleCount}. Unit price: ${formatAmount(unitPrice, currency)} per person. Total: ${formatAmount(totalAmount, currency)}. Contact: ${phone || "N/A"} / ${email || "N/A"}.`,
    );
    submitData.set("_subject", `Uburu Village: ${eventName} pay later request`);

    try {
      const response = await fetch("https://formspree.io/f/xpqjaolz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: submitData,
      });

      if (!response.ok) {
        throw new Error("Unable to send your details right now.");
      }

      setStatus({
        state: "sent",
        message: "Received. We will contact you shortly to complete your booking.",
      });
      form.reset();
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error ? error.message : "Unable to send your details right now.",
      });
    }
  };

  const olooluaTotal = (olooluaOption?.price ?? 1500) * clampPeopleCount(olooluaPeopleCount, 5);
  const therapyTotal = (activeTherapyOption?.price ?? 0) * clampPeopleCount(therapyPeopleCount, 1);

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
              Handpicked experiences to support our shelter and therapeutic programs.
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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Oloolua Nature Trail */}
          <div className="group flex flex-col overflow-hidden rounded-3xl border border-[#dbe7f3] bg-white shadow-lg transition-all hover:border-[#2f6f99]/50">
            <div 
              className="relative h-56 cursor-zoom-in overflow-hidden"
              onClick={() => setActiveImage(olooluaNatureTrail)}
            >
              <img
                src={olooluaNatureTrail}
                alt="Oloolua nature trail"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="rounded-full bg-white/90 p-3 text-[#1c3b57] shadow-xl">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="flex flex-grow flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black text-[#1c3b57]">Oloolua nature trail</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#6a7c92]">Uburu Village</p>
                </div>
                <div className="rounded-2xl bg-[#f2c15d]/20 px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7a5d00]">
                  {formatAmount(olooluaTotal)}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#5c6f86]">
                Group bookings: min 5 people at KES 1,500 each
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] px-3 py-2">
                <button
                  type="button"
                  onClick={() => setOlooluaPeopleCount((prev) => clampPeopleCount(prev - 1, 5))}
                  className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-[#1c3b57] shadow-sm"
                >
                  -
                </button>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a7c92]">People</p>
                  <input
                    type="number"
                    min={5}
                    value={olooluaPeopleCount}
                    onChange={(e) => setOlooluaPeopleCount(clampPeopleCount(Number(e.target.value) || 5, 5))}
                    className="w-16 bg-transparent text-center text-base font-black text-[#1c3b57] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setOlooluaPeopleCount((prev) => clampPeopleCount(prev + 1, 5))}
                  className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-[#1c3b57] shadow-sm"
                >
                  +
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] p-2">
                <button
                  type="button"
                  onClick={() => setOlooluaPaymentAction("pay_now")}
                  className={`rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                    olooluaPaymentAction === "pay_now" ? "bg-[#2f6f99] text-white" : "bg-white text-[#5c6f86]"
                  }`}
                >
                  Pay now
                </button>
                <button
                  type="button"
                  onClick={() => setOlooluaPaymentAction("pay_later")}
                  className={`rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                    olooluaPaymentAction === "pay_later" ? "bg-[#2f6f99] text-white" : "bg-white text-[#5c6f86]"
                  }`}
                >
                  Pay later
                </button>
              </div>

              {olooluaPaymentAction === "pay_later" && (
                <form 
                  className="mt-4 space-y-3" 
                  onSubmit={(e) => handlePayLaterSubmit(e, "Oloolua nature trail", olooluaPeopleCount, 1500, "KES", setOlooluaPayLaterStatus)}
                >
                  <input type="text" name="fullName" placeholder="Full name" required className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-xs font-semibold text-[#1c3b57] focus:outline-none" />
                  <input type="tel" name="phone" placeholder="Phone" className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-xs font-semibold text-[#1c3b57] focus:outline-none" />
                  {olooluaPayLaterStatus.state !== "idle" && (
                    <div className={`rounded-xl border px-3 py-2 text-[10px] font-bold ${olooluaPayLaterStatus.state === "sent" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                      {olooluaPayLaterStatus.message}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-[#f2c15d] py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1c3b57]" disabled={olooluaPayLaterStatus.state === "sending"}>
                    {olooluaPayLaterStatus.state === "sending" ? "Sending..." : "Request"}
                  </Button>
                </form>
              )}

              {olooluaPaymentAction === "pay_now" && (
                <Button
                  onClick={handleOlooluaCheckout}
                  className="mt-auto w-full bg-[#2f6f99] py-3 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-[#3b83b4]"
                >
                  Proceed
                </Button>
              )}
            </div>
          </div>

          {/* Therapeutic Trip */}
          <div className="group flex flex-col overflow-hidden rounded-3xl border border-[#dbe7f3] bg-white shadow-lg transition-all hover:border-[#2f6f99]/50">
            <div 
              className="relative h-56 cursor-zoom-in overflow-hidden"
              onClick={() => setActiveImage(therapeuticTripImage)}
            >
              <img
                src={therapeuticTripImage}
                alt="Therapeutic trip"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="rounded-full bg-white/90 p-3 text-[#1c3b57] shadow-xl">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="flex flex-grow flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black text-[#1c3b57]">Therapeutic trip</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#6a7c92]">Uburu Village</p>
                </div>
                <div className="rounded-2xl bg-[#f2c15d]/20 px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7a5d00]">
                  {formatAmount(therapyTotal, activeTherapyOption?.currency)}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#5c6f86]">
                Group bookings: min 6 people required
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] p-2">
                <button
                  type="button"
                  onClick={() => setTherapyResidency("resident")}
                  className={`rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                    therapyResidency === "resident" ? "bg-[#f2c15d] text-[#1c3b57]" : "bg-white text-[#5c6f86]"
                  }`}
                >
                  Resident
                </button>
                <button
                  type="button"
                  onClick={() => setTherapyResidency("non_resident")}
                  className={`rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                    therapyResidency === "non_resident" ? "bg-[#f2c15d] text-[#1c3b57]" : "bg-white text-[#5c6f86]"
                  }`}
                >
                  Non-resident
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] px-3 py-2">
                <button
                  type="button"
                  onClick={() => setTherapyPeopleCount((prev) => clampPeopleCount(prev - 1, 6))}
                  className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-[#1c3b57] shadow-sm"
                >
                  -
                </button>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a7c92]">People</p>
                  <input
                    type="number"
                    min={6}
                    value={therapyPeopleCount}
                    onChange={(e) => setTherapyPeopleCount(clampPeopleCount(Number(e.target.value) || 6, 6))}
                    className="w-16 bg-transparent text-center text-base font-black text-[#1c3b57] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setTherapyPeopleCount((prev) => clampPeopleCount(prev + 1, 6))}
                  className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-[#1c3b57] shadow-sm"
                >
                  +
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] p-2">
                <button
                  type="button"
                  onClick={() => setTherapyPaymentAction("pay_now")}
                  className={`rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                    therapyPaymentAction === "pay_now" ? "bg-[#2f6f99] text-white" : "bg-white text-[#5c6f86]"
                  }`}
                >
                  Pay now
                </button>
                <button
                  type="button"
                  onClick={() => setTherapyPaymentAction("pay_later")}
                  className={`rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                    therapyPaymentAction === "pay_later" ? "bg-[#2f6f99] text-white" : "bg-white text-[#5c6f86]"
                  }`}
                >
                  Pay later
                </button>
              </div>

              {therapyPaymentAction === "pay_later" && (
                <form 
                  className="mt-4 space-y-3" 
                  onSubmit={(e) => handlePayLaterSubmit(e, "Therapeutic trip", therapyPeopleCount, activeTherapyOption?.price ?? 0, activeTherapyOption?.currency ?? "KES", setTherapyPayLaterStatus)}
                >
                  <input type="text" name="fullName" placeholder="Full name" required className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-xs font-semibold text-[#1c3b57] focus:outline-none" />
                  <input type="tel" name="phone" placeholder="Phone" className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-xs font-semibold text-[#1c3b57] focus:outline-none" />
                  {therapyPayLaterStatus.state !== "idle" && (
                    <div className={`rounded-xl border px-3 py-2 text-[10px] font-bold ${therapyPayLaterStatus.state === "sent" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                      {therapyPayLaterStatus.message}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-[#f2c15d] py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1c3b57]" disabled={therapyPayLaterStatus.state === "sending"}>
                    {therapyPayLaterStatus.state === "sending" ? "Sending..." : "Request"}
                  </Button>
                </form>
              )}

              {therapyPaymentAction === "pay_now" && (
                <Button
                  onClick={handleTherapyCheckout}
                  className="mt-auto w-full bg-[#2f6f99] py-3 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-[#3b83b4]"
                >
                  Proceed
                </Button>
              )}
            </div>
          </div>

          {/* Maasai Mara Migration */}
          <div className="group flex flex-col overflow-hidden rounded-3xl border border-[#e6eef7] bg-white shadow-lg transition-all hover:border-[#f2c15d]/50">
            <div 
              className="relative h-56 cursor-zoom-in overflow-hidden"
              onClick={() => setActiveImage(maa)}
            >
              <img
                src={maa}
                alt="Maasai Mara Migration Season"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="rounded-full bg-white/90 p-3 text-[#1c3b57] shadow-xl">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="flex flex-grow flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black text-[#1c3b57]">Maasai Mara Migration</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#6a7c92]">Uburu Village</p>
                </div>
                <div className="rounded-2xl bg-[#f2c15d]/20 px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7a5d00]">
                  From KES 27.5k
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#5c6f86]">
                Multiple camps & residency options.
              </div>

              <div className="mt-4 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] p-4 text-xs font-semibold text-[#32556f]">
                Open full package details to select camp, residency type, month window, and people count.
              </div>

              <Button
                onClick={goToMaasaiPackage}
                className="mt-auto w-full bg-[#f2c15d] py-3 text-xs font-black uppercase tracking-[0.24em] text-[#1c3b57] hover:bg-[#ffd886]"
              >
                View full package
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-10">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative h-full w-full flex items-center justify-center">
            <img
              src={activeImage}
              alt="Full view"
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedEvents;
