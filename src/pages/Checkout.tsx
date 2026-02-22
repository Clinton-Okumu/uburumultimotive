import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Loader } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/shared/Button";
import {
  homeProducts,
  villageEvents,
  type StorefrontItem,
  type StorefrontSource,
} from "../data/storefrontCatalog";

type PaymentStatus = "idle" | "processing" | "success" | "error";

type CartMap = Record<StorefrontSource, Record<string, number>>;

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

const SOURCE_KEYS: Record<StorefrontSource, string> = {
  home: "uburu_home_cart",
  village: "uburu_village_cart",
};

const SOURCE_CONTEXT: Record<StorefrontSource, "uburu_home" | "uburu_village"> = {
  home: "uburu_home",
  village: "uburu_village",
};

const SOURCE_PURCHASE_TYPE: Record<
  StorefrontSource,
  "product_purchase" | "event_purchase"
> = {
  home: "product_purchase",
  village: "event_purchase",
};

const SOURCE_LABEL: Record<StorefrontSource, string> = {
  home: "Uburu Home",
  village: "Uburu Village",
};

const SOURCE_BACK_LINK: Record<StorefrontSource, string> = {
  home: "/get/home",
  village: "/get/village",
};

const catalogBySource: Record<StorefrontSource, StorefrontItem[]> = {
  home: homeProducts,
  village: villageEvents,
};

const clampQuantity = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const parseSource = (value: string | null): StorefrontSource | null => {
  if (value === "home" || value === "village") {
    return value;
  }

  return null;
};

const readStoredCart = (source: StorefrontSource): Record<string, number> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(SOURCE_KEYS[source]);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(
          (entry): entry is [string, number] =>
            typeof entry[1] === "number" && Number.isFinite(entry[1]),
        )
        .map(([id, value]) => [id, clampQuantity(Math.trunc(value), 1, 99)]),
    );
  } catch {
    return {};
  }
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

const Checkout = () => {
  const location = useLocation();

  const [carts, setCarts] = useState<CartMap>({
    home: readStoredCart("home"),
    village: readStoredCart("village"),
  });
  const [activeSource, setActiveSource] = useState<StorefrontSource>("home");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const sourceFromUrl = parseSource(
      new URLSearchParams(location.search).get("source"),
    );
    if (sourceFromUrl) {
      setActiveSource(sourceFromUrl);
      return;
    }

    if (Object.keys(carts.home).length === 0 && Object.keys(carts.village).length > 0) {
      setActiveSource("village");
    }
  }, [carts.home, carts.village, location.search]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    (Object.keys(SOURCE_KEYS) as StorefrontSource[]).forEach((source) => {
      const nextCart = carts[source];
      const storageKey = SOURCE_KEYS[source];
      if (Object.keys(nextCart).length === 0) {
        window.localStorage.removeItem(storageKey);
      } else {
        window.localStorage.setItem(storageKey, JSON.stringify(nextCart));
      }

      window.dispatchEvent(
        new CustomEvent("uburu:cart-updated", { detail: { storageKey } }),
      );
    });
  }, [carts]);

  const metrics = useMemo(() => {
    const next: Record<StorefrontSource, { items: CartItem[]; total: number; count: number }> = {
      home: { items: [], total: 0, count: 0 },
      village: { items: [], total: 0, count: 0 },
    };

    (Object.keys(catalogBySource) as StorefrontSource[]).forEach((source) => {
      const cart = carts[source];
      const items = catalogBySource[source]
        .map((item) => {
          const quantity = cart[item.id] ?? 0;
          if (quantity <= 0) {
            return null;
          }

          return {
            id: item.id,
            name: item.name,
            quantity,
            unitPrice: item.price,
            lineTotal: item.price * quantity,
          };
        })
        .filter((item): item is CartItem => item !== null);

      next[source] = {
        items,
        total: items.reduce((sum, item) => sum + item.lineTotal, 0),
        count: items.reduce((sum, item) => sum + item.quantity, 0),
      };
    });

    return next;
  }, [carts]);

  const activeMetrics = metrics[activeSource];
  const checkoutDisabled = status === "processing" || activeMetrics.items.length === 0;

  const setItemQuantity = (itemId: string, nextValue: number) => {
    const safe = clampQuantity(nextValue, 0, 99);
    setCarts((prev) => {
      const current = prev[activeSource];
      if (safe === 0) {
        const next = { ...current };
        delete next[itemId];
        return { ...prev, [activeSource]: next };
      }

      return {
        ...prev,
        [activeSource]: { ...current, [itemId]: safe },
      };
    });
    setStatus("idle");
    setStatusMessage("");
  };

  const clearActiveTray = () => {
    setCarts((prev) => ({ ...prev, [activeSource]: {} }));
    setStatus("idle");
    setStatusMessage("");
  };

  const handleCheckout = async () => {
    if (activeMetrics.items.length === 0 || activeMetrics.total <= 0) {
      setStatus("error");
      setStatusMessage("Please add at least one item to your tray.");
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
          amount: activeMetrics.total,
          currency: "KES",
          customer: {
            name: buyerName.trim(),
            email: buyerEmail.trim(),
            phone: undefined,
          },
          context: SOURCE_CONTEXT[activeSource],
          meta: {
            type: SOURCE_PURCHASE_TYPE[activeSource],
            itemCount: activeMetrics.count,
            items: activeMetrics.items.map((item) => ({
              itemId: item.id,
              itemName: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalAmount: item.lineTotal,
            })),
            totalAmount: activeMetrics.total,
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
        error instanceof Error ? error.message : "Payment failed. Please try again.";
      setStatus("error");
      setStatusMessage(getFriendlyErrorMessage(message));
    }
  };

  return (
    <section className="relative bg-slate-950 px-6 py-24 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-10 h-56 w-56 rounded-full bg-yellow-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-500/15 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">Checkout</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Your dedicated checkout page</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold text-white/70">
              Keep trays separate by experience, then finish payment from one focused checkout flow.
            </p>
          </div>
          <Link
            to={SOURCE_BACK_LINK[activeSource]}
            className="rounded-full border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-white/80 transition-colors hover:bg-white/10"
          >
            Back to {SOURCE_LABEL[activeSource]}
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {(Object.keys(SOURCE_LABEL) as StorefrontSource[]).map((source) => {
            const isActive = source === activeSource;
            const sourceMetrics = metrics[source];

            return (
              <button
                key={source}
                type="button"
                onClick={() => {
                  setActiveSource(source);
                  setStatus("idle");
                  setStatusMessage("");
                }}
                className={`rounded-3xl border p-5 text-left transition ${
                  isActive
                    ? "border-yellow-400 bg-white/10 ring-2 ring-yellow-400/30"
                    : "border-white/20 bg-black/20 hover:bg-white/5"
                }`}
              >
                <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
                  {SOURCE_LABEL[source]}
                </p>
                <p className="mt-2 text-2xl font-black text-white">{sourceMetrics.count} item(s)</p>
                <p className="mt-1 text-sm font-bold text-white/70">
                  KES {sourceMetrics.total.toLocaleString("en-KE")}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/20 bg-black/40 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
                {SOURCE_LABEL[activeSource]} tray
              </p>
              <p className="mt-2 text-xl font-black text-white">
                Total: KES {activeMetrics.total.toLocaleString("en-KE")}
              </p>
            </div>
            {activeMetrics.items.length > 0 && (
              <Button
                onClick={clearActiveTray}
                className="bg-neutral-800 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-neutral-700"
              >
                Clear tray
              </Button>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-white/15 bg-black/30 p-4">
            {activeMetrics.items.length === 0 ? (
              <p className="text-sm font-semibold text-white/70">
                This tray is empty. Add items from {SOURCE_LABEL[activeSource]} to continue.
              </p>
            ) : (
              <div className="space-y-3">
                {activeMetrics.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-white/15 bg-black/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-black text-white">{item.name}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                        KES {item.unitPrice.toLocaleString("en-KE")} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setItemQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-lg bg-neutral-800 text-sm font-black text-yellow-300"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-black text-white">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setItemQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-lg bg-neutral-800 text-sm font-black text-yellow-300"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                      <span className="ml-3 text-sm font-black text-yellow-300">
                        KES {item.lineTotal.toLocaleString("en-KE")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setItemQuantity(item.id, 0)}
                        className="ml-2 rounded-lg border border-white/20 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={buyerName}
              onChange={(event) => setBuyerName(event.target.value)}
              placeholder="Full name"
              className="w-full rounded-2xl border border-white/20 bg-black px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="email"
              value={buyerEmail}
              onChange={(event) => setBuyerEmail(event.target.value)}
              placeholder="Email address"
              className="w-full rounded-2xl border border-white/20 bg-black px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              {status === "error" ? <span className="mt-0.5">!</span> : <CheckCircle className="mt-0.5 h-4 w-4" />}
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={handleCheckout}
              disabled={checkoutDisabled}
              className="w-full bg-yellow-400 py-4 text-sm font-black uppercase tracking-[0.3em] text-black hover:bg-yellow-300"
            >
              {status === "processing" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Redirecting...
                </span>
              ) : (
                `Pay for ${SOURCE_LABEL[activeSource]}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
