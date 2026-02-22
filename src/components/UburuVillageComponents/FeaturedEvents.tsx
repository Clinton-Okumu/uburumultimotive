import { useState } from "react";
import { CheckCircle, Loader, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../shared/Button";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import { villageEvents as events } from "../../data/storefrontCatalog";

const FeaturedEvents = () => {
  const [selectedEventId, setSelectedEventId] = useState(events[0].id);
  const {
    quantities,
    buyerName,
    buyerEmail,
    status,
    statusMessage,
    cartItems,
    cartTotal,
    cartItemCount,
    setBuyerName,
    setBuyerEmail,
    updateQuantity,
    addToCart,
    updateCartItemQuantity,
    clearCart,
    scrollToCheckout,
    handleCheckout,
  } = useStorefrontCheckout({
    catalog: events.map(({ id, name, price }) => ({ id, name, price })),
    context: "uburu_village",
    purchaseType: "event_purchase",
    emptyCartMessage: "Please add at least one ticket to your cart.",
    storageKey: "uburu_village_cart",
  });

  const handleBuyClick = (eventId: string) => {
    setSelectedEventId(eventId);
    addToCart(eventId);
    scrollToCheckout("uburu-village-checkout");
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
              {events.length} events
            </span>
            <Button
              onClick={() => scrollToCheckout("uburu-village-checkout")}
              className="bg-[#f2c15d] px-6 py-3 text-xs font-black uppercase tracking-[0.25em] text-[#1c3b57] hover:bg-[#ffd886]"
            >
              <span className="inline-flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Tray ({cartItemCount})
              </span>
            </Button>
            <Link
              to="/checkout?source=village"
              className="rounded-full border border-[#dbe7f3] px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-[#1c3b57] transition-colors hover:bg-[#eef4fc]"
            >
              Checkout page
            </Link>
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
                    <h3 className="text-lg font-black text-[#1c3b57]">{event.name}</h3>
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
                  className="mt-5 w-full bg-[#2f6f99] py-3 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-[#3b83b4]"
                >
                  Add to tray
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div
          id="uburu-village-checkout"
          className="mt-12 rounded-[2.5rem] border border-[#dbe7f3] bg-white p-8 shadow-lg"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5c6f86]">
                Checkout
              </p>
              <h3 className="mt-2 text-2xl font-black text-[#1c3b57]">Complete your purchase</h3>
              <p className="mt-2 text-sm font-semibold text-[#5c6f86]">
                Payments are processed securely via DPO.
              </p>
            </div>
            <div className="rounded-2xl border border-[#dbe7f3] bg-white px-5 py-4 text-sm font-bold text-[#3b4b74]">
              Cart total: <span className="text-[#1c3b57]">KES {cartTotal.toLocaleString("en-KE")}</span>
              <span className="ml-3 text-[#5c6f86]">Items: {cartItemCount}</span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#5c6f86]">
            Checkout summary: {cartItems.length} line item(s) · KES {cartTotal.toLocaleString("en-KE")}
          </div>

          <div className="mt-6 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] p-4">
            {cartItems.length === 0 ? (
              <p className="text-sm font-semibold text-[#5c6f86]">
                Your cart is empty. Tap Add to tray on any event card to add tickets and jump here.
              </p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-[#dbe7f3] bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-black text-[#1c3b57]">{item.name}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a7c92]">
                        KES {item.unitPrice.toLocaleString("en-KE")} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-lg bg-white text-sm font-black text-[#1c3b57] shadow-sm"
                        aria-label={`Decrease ${item.name} quantity in cart`}
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-black text-[#1c3b57]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-lg bg-white text-sm font-black text-[#1c3b57] shadow-sm"
                        aria-label={`Increase ${item.name} quantity in cart`}
                      >
                        +
                      </button>
                      <span className="ml-3 text-sm font-black text-[#1c3b57]">
                        KES {item.lineTotal.toLocaleString("en-KE")}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, 0)}
                        className="ml-3 rounded-lg border border-[#dbe7f3] px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#5c6f86]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {cartItems.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={clearCart}
                  className="bg-[#dbe7f3] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#1c3b57] hover:bg-[#c9ddef]"
                >
                  Clear cart
                </Button>
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
              disabled={status === "processing" || cartItems.length === 0}
              className="w-full bg-[#f2c15d] py-4 text-sm font-black uppercase tracking-[0.3em] text-[#1c3b57] hover:bg-[#ffd886]"
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
