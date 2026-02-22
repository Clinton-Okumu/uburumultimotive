import { useState } from "react";
import { CheckCircle, Loader, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../shared/Button";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import { homeProducts as products } from "../../data/storefrontCatalog";

const FeaturedProducts = () => {
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
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
    catalog: products.map(({ id, name, price }) => ({ id, name, price })),
    context: "uburu_home",
    purchaseType: "product_purchase",
    emptyCartMessage: "Please add at least one item to your cart.",
    storageKey: "uburu_home_cart",
  });

  const handleBuyClick = (productId: string) => {
    setSelectedProductId(productId);
    addToCart(productId);
    scrollToCheckout("uburu-home-checkout");
  };

  return (
    <section id="featured" className="relative bg-black px-6 py-20 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-yellow-500/25 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-red-500/15 blur-[140px]" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
              Featured picks
            </p>
            <h2 className="mt-3 text-3xl font-black text-yellow-400 sm:text-4xl">
              Curated essentials for everyday care.
            </h2>
            <p className="mt-3 max-w-xl text-base font-semibold text-white/70">
              Each item is selected to support shelter programs, counseling, and reintegration.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-yellow-500/40 bg-black px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-yellow-300">
              {products.length} items
            </span>
            <Button
              onClick={() => scrollToCheckout("uburu-home-checkout")}
              className="bg-yellow-400 text-black hover:bg-yellow-300 px-6 py-3 text-xs font-black uppercase tracking-[0.25em]"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Tray ({cartItemCount})
              </span>
            </Button>
            <Link
              to="/checkout?source=home"
              className="rounded-full border border-yellow-500/40 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-yellow-200 transition-colors hover:bg-neutral-900"
            >
              Checkout page
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`group overflow-hidden rounded-3xl border bg-neutral-900 shadow-lg transition-transform duration-300 hover:-translate-y-1 ${
                selectedProductId === product.id
                  ? "border-yellow-400 ring-2 ring-yellow-400/30"
                  : "border-neutral-800"
              }`}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-300 shadow-sm">
                  {product.tag}
                </span>
                <span className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-300">
                  In stock
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-white">{product.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-yellow-200/70">
                      Uburu Home
                    </p>
                  </div>
                  <div className="rounded-2xl bg-yellow-400/15 px-3 py-2 text-xs font-black uppercase tracking-widest text-yellow-200">
                    KES {product.price.toLocaleString("en-KE")}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, (quantities[product.id] ?? 1) - 1)}
                    className="h-9 w-9 rounded-xl bg-black text-lg font-bold text-yellow-300 shadow-sm"
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    -
                  </button>
                  <span className="text-xs font-black uppercase tracking-widest text-yellow-200/70">
                    Qty:
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={quantities[product.id] ?? 1}
                    onChange={(event) =>
                      updateQuantity(product.id, Number(event.target.value) || 1)
                    }
                    className="w-16 bg-transparent text-center text-sm font-black text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, (quantities[product.id] ?? 1) + 1)}
                    className="h-9 w-9 rounded-xl bg-black text-lg font-bold text-yellow-300 shadow-sm"
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    +
                  </button>
                </div>
                <Button
                  onClick={() => handleBuyClick(product.id)}
                  className="mt-5 w-full bg-red-600 py-3 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-red-500"
                >
                  Add to tray
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div
          id="uburu-home-checkout"
          className="mt-12 rounded-[2.5rem] border border-neutral-800 bg-neutral-900 p-8 shadow-lg"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
                Checkout
              </p>
              <h3 className="mt-2 text-2xl font-black text-yellow-400">Complete your purchase</h3>
              <p className="mt-2 text-sm font-semibold text-white/70">
                Payments are processed securely via DPO.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black px-5 py-4 text-sm font-bold text-white/80">
              Cart total: <span className="text-yellow-300">KES {cartTotal.toLocaleString("en-KE")}</span>
              <span className="ml-3 text-white/60">Items: {cartItemCount}</span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-neutral-800 bg-black/50 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            Checkout summary: {cartItems.length} line item(s) · KES {cartTotal.toLocaleString("en-KE")}
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-800 bg-black/70 p-4">
            {cartItems.length === 0 ? (
              <p className="text-sm font-semibold text-white/60">
                Your cart is empty. Tap Add to tray on any product card to add it and jump here.
              </p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900/80 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-black text-white">{item.name}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-200/70">
                        KES {item.unitPrice.toLocaleString("en-KE")} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-lg bg-neutral-800 text-sm font-black text-yellow-300"
                        aria-label={`Decrease ${item.name} quantity in cart`}
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-lg bg-neutral-800 text-sm font-black text-yellow-300"
                        aria-label={`Increase ${item.name} quantity in cart`}
                      >
                        +
                      </button>
                      <span className="ml-3 text-sm font-black text-yellow-300">
                        KES {item.lineTotal.toLocaleString("en-KE")}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, 0)}
                        className="ml-3 rounded-lg border border-neutral-700 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70"
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
                  className="bg-neutral-800 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-neutral-700"
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
              onChange={(event) => setBuyerName(event.target.value)}
              placeholder="Full name"
              className="w-full rounded-2xl border border-neutral-800 bg-black px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="email"
              value={buyerEmail}
              onChange={(event) => setBuyerEmail(event.target.value)}
              placeholder="Email address"
              className="w-full rounded-2xl border border-neutral-800 bg-black px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              className="w-full bg-yellow-400 py-4 text-sm font-black uppercase tracking-[0.3em] text-black hover:bg-yellow-300"
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

export default FeaturedProducts;
