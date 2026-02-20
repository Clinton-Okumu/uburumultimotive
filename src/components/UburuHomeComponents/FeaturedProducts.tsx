import { useState } from "react";
import { CheckCircle, Loader } from "lucide-react";
import Button from "../shared/Button";
import ebook from "../../assets/ebook.webp";
import shirt from "../../assets/shirt.webp";
import cap from "../../assets/cap.webp";
import hoodie from "../../assets/hoodie.webp";
import waterBottle from "../../assets/waterbottle.webp";

type PaymentStatus = "idle" | "processing" | "success" | "error";

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

const products = [
  {
    id: "ebooks",
    name: "Ebooks",
    price: 1200,
    tag: "Digital",
    image: ebook,
  },
  {
    id: "tshirts",
    name: "T-shirts",
    price: 1800,
    tag: "Apparel",
    image: shirt,
  },
  {
    id: "caps",
    name: "Caps",
    price: 900,
    tag: "Everyday",
    image: cap,
  },
  {
    id: "hoodies",
    name: "Hoodies",
    price: 2800,
    tag: "Cozy",
    image: hoodie,
  },
  {
    id: "reusable-bottles",
    name: "Reusable bottles",
    price: 1500,
    tag: "Eco",
    image: waterBottle,
  },
];

const FeaturedProducts = () => {
  const [quantities, setQuantities] = useState(
    Object.fromEntries(products.map((product) => [product.id, 1])) as Record<
      string,
      number
    >,
  );
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const cartItems: CartItem[] = products
    .map((product) => {
      const quantity = cart[product.id] ?? 0;
      if (quantity <= 0) {
        return null;
      }

      return {
        id: product.id,
        name: product.name,
        quantity,
        unitPrice: product.price,
        lineTotal: product.price * quantity,
      };
    })
    .filter((item): item is CartItem => item !== null);

  const cartTotal = cartItems.reduce((total, item) => total + item.lineTotal, 0);
  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  const updateQuantity = (productId: string, nextValue: number) => {
    const safeValue = Math.max(1, Math.min(99, nextValue));
    setQuantities((prev) => ({ ...prev, [productId]: safeValue }));
  };

  const scrollToCheckout = () => {
    const checkoutElement = document.getElementById("uburu-home-checkout");
    if (checkoutElement) {
      checkoutElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBuyClick = (productId: string) => {
    setSelectedProductId(productId);
    const quantityToAdd = quantities[productId] ?? 1;
    setCart((prev) => {
      const nextQuantity = Math.max(
        1,
        Math.min(99, (prev[productId] ?? 0) + quantityToAdd),
      );
      return { ...prev, [productId]: nextQuantity };
    });
    setStatus("idle");
    setStatusMessage("");
    scrollToCheckout();
  };

  const updateCartItemQuantity = (productId: string, nextValue: number) => {
    const safeValue = Math.max(0, Math.min(99, nextValue));
    setCart((prev) => {
      if (safeValue <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: safeValue };
    });
    setStatus("idle");
    setStatusMessage("");
  };

  const clearCart = () => {
    setCart({});
    setStatus("idle");
    setStatusMessage("");
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
    if (cartItems.length === 0 || cartTotal <= 0) {
      setStatus("error");
      setStatusMessage("Please add at least one item to your cart.");
      return;
    }
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

    setStatus("processing");
    setStatusMessage("");

    try {
      const response = await fetch("/api/dpo/create-token.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal,
          currency: "KES",
          customer: {
            name: buyerName.trim(),
            email: buyerEmail.trim(),
            phone: undefined,
          },
          context: "uburu_home",
          meta: {
            type: "product_purchase",
            itemCount: cartItemCount,
            items: cartItems.map((item) => ({
              itemId: item.id,
              itemName: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalAmount: item.lineTotal,
            })),
            totalAmount: cartTotal,
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
            <Button className="bg-yellow-400 text-black hover:bg-yellow-300 px-6 py-3 text-xs font-black uppercase tracking-[0.3em]">
              View all
            </Button>
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
                    <h3 className="text-lg font-black text-white">
                      {product.name}
                    </h3>
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
                  className="mt-5 w-full bg-red-600 text-white hover:bg-red-500 py-3 text-xs font-black uppercase tracking-[0.3em]"
                >
                  Buy now
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
              <h3 className="mt-2 text-2xl font-black text-yellow-400">
                Complete your purchase
              </h3>
              <p className="mt-2 text-sm font-semibold text-white/70">
                Payments are processed securely via DPO.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black px-5 py-4 text-sm font-bold text-white/80">
              Cart total: <span className="text-yellow-300">KES {cartTotal.toLocaleString("en-KE")}</span>
              <span className="ml-3 text-white/60">Items: {cartItemCount}</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-800 bg-black/70 p-4">
            {cartItems.length === 0 ? (
              <p className="text-sm font-semibold text-white/60">
                Your cart is empty. Tap Buy now on any product card to add it and jump here.
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
                        onClick={() =>
                          updateCartItemQuantity(item.id, item.quantity - 1)
                        }
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
                        onClick={() =>
                          updateCartItemQuantity(item.id, item.quantity + 1)
                        }
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
                  className="bg-neutral-800 text-white hover:bg-neutral-700 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em]"
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
              className="w-full bg-yellow-400 text-black hover:bg-yellow-300 py-4 text-sm font-black uppercase tracking-[0.3em]"
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
