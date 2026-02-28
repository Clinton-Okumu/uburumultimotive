import { useState } from "react";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import {
  villageEventOptions,
  type VillageEventOption,
  type VillageTicketType,
} from "../../data/storefrontCatalog";

type VillageEventCard = {
  id: string;
  name: string;
  image: string;
  tag: string;
  individualOption: VillageEventOption;
  groupOption: VillageEventOption;
};

const eventCards: VillageEventCard[] = (() => {
  const grouped = new Map<string, VillageEventCard>();

  villageEventOptions.forEach((option) => {
    const existing = grouped.get(option.baseEventId);

    if (!existing) {
      grouped.set(option.baseEventId, {
        id: option.baseEventId,
        name: option.name.replace(" (Individual)", "").replace(" (Group of 5)", ""),
        image: option.image,
        tag: "Tickets",
        individualOption: option,
        groupOption: option,
      });
      return;
    }

    if (option.ticketType === "individual") {
      existing.individualOption = option;
    } else {
      existing.groupOption = option;
    }
  });

  return Array.from(grouped.values());
})();

const visibleEventCards = eventCards.slice(0, 1);

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(visibleEventCards[0]?.id ?? "");
  const [ticketTypeByEventId, setTicketTypeByEventId] = useState<
    Record<string, VillageTicketType>
  >(() =>
    Object.fromEntries(
      visibleEventCards.map((event) => [event.id, "individual"] as const),
    ),
  );
  const [groupActionByEventId, setGroupActionByEventId] = useState<
    Record<string, "pay_now" | "pay_later">
  >(() => Object.fromEntries(visibleEventCards.map((event) => [event.id, "pay_now"] as const)));
  const [payLaterStatusByEventId, setPayLaterStatusByEventId] = useState<
    Record<string, { state: "idle" | "sending" | "sent" | "error"; message: string }>
  >(() => Object.fromEntries(visibleEventCards.map((event) => [event.id, { state: "idle", message: "" }] as const)));
  const { quantities, cartItemCount, updateQuantity, addToCart } =
    useStorefrontCheckout({
      catalog: villageEventOptions.map(({ id, name, price }) => ({ id, name, price })),
      context: "uburu_village",
      purchaseType: "event_purchase",
      emptyCartMessage: "Please add at least one ticket to your cart.",
      storageKey: "uburu_village_cart",
    });

  const goToCheckout = () => {
    navigate("/checkout?source=village");
  };

  const getSelectedOption = (event: VillageEventCard) =>
    ticketTypeByEventId[event.id] === "group"
      ? event.groupOption
      : event.individualOption;

  const handleBuyClick = (event: VillageEventCard) => {
    const selectedOption = getSelectedOption(event);
    setSelectedEventId(event.id);
    addToCart(selectedOption.id);
    goToCheckout();
  };

  const handlePayLaterSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    event: VillageEventCard,
  ) => {
    e.preventDefault();
    const status = payLaterStatusByEventId[event.id]?.state;
    if (status === "sending") return;

    setPayLaterStatusByEventId((prev) => ({
      ...prev,
      [event.id]: { state: "sending", message: "" },
    }));

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullName = (formData.get("fullName") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();

    if (!phone && !email) {
      setPayLaterStatusByEventId((prev) => ({
        ...prev,
        [event.id]: {
          state: "error",
          message: "Add a phone number or email so we can reach you.",
        },
      }));
      return;
    }

    const selectedOption = getSelectedOption(event);
    const submitData = new FormData();
    submitData.set("name", fullName);
    submitData.set("email", email || "no-reply@uburumultimovehs.org");
    submitData.set("phone", phone);
    submitData.set("eventName", event.name);
    submitData.set("ticketOption", selectedOption.name);
    submitData.set("message", `Pay later request for ${event.name} (${selectedOption.name}). Contact: ${phone || "N/A"} / ${email || "N/A"}.`);
    submitData.set("_subject", "Uburu Village: Group booking pay later request");

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

      setPayLaterStatusByEventId((prev) => ({
        ...prev,
        [event.id]: {
          state: "sent",
          message: "Received. We will contact you shortly to complete your booking.",
        },
      }));
      form.reset();
    } catch (error) {
      setPayLaterStatusByEventId((prev) => ({
        ...prev,
        [event.id]: {
          state: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to send your details right now.",
        },
      }));
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
               {visibleEventCards.length} event
            </span>
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
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleEventCards.map((event) => {
            const selectedOption = getSelectedOption(event);
            const ticketType = ticketTypeByEventId[event.id] ?? "individual";
            const groupAction = groupActionByEventId[event.id] ?? "pay_now";
            const payLaterStatus = payLaterStatusByEventId[event.id] ?? {
              state: "idle",
              message: "",
            };

            return (
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
                    <h3 className="text-lg font-black text-[#1c3b57]">{event.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#6a7c92]">
                      Uburu Village
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#f2c15d]/20 px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7a5d00]">
                    KES {selectedOption.price.toLocaleString("en-KE")}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] p-2">
                  <button
                    type="button"
                    onClick={() =>
                      setTicketTypeByEventId((prev) => ({
                        ...prev,
                        [event.id]: "individual",
                      }))
                    }
                    className={`rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                      ticketType === "individual"
                        ? "bg-[#2f6f99] text-white"
                        : "bg-white text-[#5c6f86]"
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTicketTypeByEventId((prev) => ({
                        ...prev,
                        [event.id]: "group",
                      }))
                    }
                    className={`rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                      ticketType === "group"
                        ? "bg-[#2f6f99] text-white"
                        : "bg-white text-[#5c6f86]"
                    }`}
                  >
                    Group (5)
                  </button>
                </div>

                {ticketType === "individual" ? (
                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-3 py-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          selectedOption.id,
                          (quantities[selectedOption.id] ?? 1) - 1,
                        )
                      }
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
                      value={quantities[selectedOption.id] ?? 1}
                      onChange={(eventInput) =>
                        updateQuantity(
                          selectedOption.id,
                          Number(eventInput.target.value) || 1,
                        )
                      }
                      className="w-16 bg-transparent text-center text-sm font-black text-[#1c3b57] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          selectedOption.id,
                          (quantities[selectedOption.id] ?? 1) + 1,
                        )
                      }
                      className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-[#1c3b57] shadow-sm"
                      aria-label={`Increase ${event.name} ticket quantity`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#5c6f86]">
                      Group package: fixed at 5 people
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] p-2">
                      <button
                        type="button"
                        onClick={() =>
                          setGroupActionByEventId((prev) => ({
                            ...prev,
                            [event.id]: "pay_now",
                          }))
                        }
                        className={`rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                          groupAction === "pay_now"
                            ? "bg-[#2f6f99] text-white"
                            : "bg-white text-[#5c6f86]"
                        }`}
                      >
                        Pay now
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setGroupActionByEventId((prev) => ({
                            ...prev,
                            [event.id]: "pay_later",
                          }))
                        }
                        className={`rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                          groupAction === "pay_later"
                            ? "bg-[#2f6f99] text-white"
                            : "bg-white text-[#5c6f86]"
                        }`}
                      >
                        Pay later
                      </button>
                    </div>

                    {groupAction === "pay_later" && (
                      <form className="mt-4 space-y-3" onSubmit={(e) => handlePayLaterSubmit(e, event)}>
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
                          {payLaterStatus.state === "sending"
                            ? "Sending..."
                            : "Send pay later request"}
                        </Button>
                      </form>
                    )}
                  </>
                )}
                <Button
                  onClick={() => handleBuyClick(event)}
                  disabled={ticketType === "group" && groupAction === "pay_later"}
                  className="mt-5 w-full bg-[#2f6f99] py-3 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-[#3b83b4]"
                >
                  {ticketType === "group" ? "Proceed to checkout" : "Add to tray"}
                </Button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
