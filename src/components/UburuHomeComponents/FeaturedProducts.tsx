import { useState } from "react";
import { CheckCircle, Loader } from "lucide-react";
import Button from "../shared/Button";
import pic1 from "../../assets/pic1.webp";
import pic4 from "../../assets/pic4.webp";
import pic6 from "../../assets/pic6.webp";
import pic7 from "../../assets/pic7.webp";

type PaymentStatus = "idle" | "processing" | "success" | "error";

const products = [
  {
    id: "ebooks",
    name: "Ebooks",
    price: 1200,
    tag: "Digital",
    image: pic1,
  },
  {
    id: "tshirts",
    name: "T-shirts",
    price: 1800,
    tag: "Apparel",
    image: pic4,
  },
  {
    id: "caps",
    name: "Caps",
    price: 900,
    tag: "Everyday",
    image: pic6,
  },
  {
    id: "hoodies",
    name: "Hoodies",
    price: 2800,
    tag: "Cozy",
    image: pic7,
  },
  {
    id: "reusable-bottles",
    name: "Reusable bottles",
    price: 1500,
    tag: "Eco",
    image: pic1,
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
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  const updateQuantity = (productId: string, nextValue: number) => {
    const safeValue = Math.max(1, Math.min(99, nextValue));
    setQuantities((prev) => ({ ...prev, [productId]: safeValue }));
  };

  const handleBuyClick = (productId: string) => {
    setSelectedProductId(productId);
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
    if (!selectedProduct) return;
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

    const quantity = quantities[selectedProduct.id] ?? 1;
    const totalAmount = selectedProduct.price * quantity;

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
          context: "uburu_home",
          meta: {
            type: "product_purchase",
            itemId: selectedProduct.id,
            itemName: selectedProduct.name,
            quantity,
            unitPrice: selectedProduct.price,
            totalAmount,
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
              6 items
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
            {selectedProduct && (
              <div className="rounded-2xl border border-neutral-800 bg-black px-5 py-4 text-sm font-bold text-white/80">
                {selectedProduct.name} · Qty: {quantities[selectedProduct.id] ?? 1}
                <span className="ml-2 text-yellow-300">
                  KES {(selectedProduct.price * (quantities[selectedProduct.id] ?? 1)).toLocaleString("en-KE")}
                </span>
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
              disabled={status === "processing"}
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
