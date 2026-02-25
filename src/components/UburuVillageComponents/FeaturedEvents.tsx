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

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(eventCards[0]?.id ?? "");
  const [ticketTypeByEventId, setTicketTypeByEventId] = useState<
    Record<string, VillageTicketType>
  >(() =>
    Object.fromEntries(
      eventCards.map((event) => [event.id, "individual"] as const),
    ),
  );
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
              {eventCards.length} events
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
          {eventCards.map((event) => {
            const selectedOption = getSelectedOption(event);
            const ticketType = ticketTypeByEventId[event.id] ?? "individual";

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
                  <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#5c6f86]">
                    Group package: fixed at 5 people
                  </div>
                )}
                <Button
                  onClick={() => handleBuyClick(event)}
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
