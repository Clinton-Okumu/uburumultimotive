import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Loader,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Truck,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  Package,
  Building,
  AlertCircle,
  Tag,
  Calendar,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/shared/Button";
import {
  homeApparelColorOptions,
  homeBrandingConfigurableProductIds,
  homeColorConfigurableProductIds,
  homeLogoOptions,
  homeProducts,
  villageEvents,
  type CurrencyCode,
  type HomeApparelColor,
  type HomeLogoOption,
  type StorefrontItem,
  type StorefrontSource,
} from "../data/storefrontCatalog";

type PaymentStatus = "idle" | "processing" | "success" | "error";

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  currency: CurrencyCode;
  image: string;
  tag: string;
};

type HomeItemOptions = {
  color: HomeApparelColor;
  logo: HomeLogoOption;
};

const SOURCE_KEYS: Record<StorefrontSource, string> = {
  home: "uburu_home_cart",
  village: "uburu_village_cart",
};

const HOME_ITEM_OPTIONS_STORAGE_KEY = "uburu_home_item_options";

const DEFAULT_HOME_ITEM_OPTIONS: HomeItemOptions = {
  color: homeApparelColorOptions[0],
  logo: homeLogoOptions[0],
};

const HOME_COLOR_PRODUCT_SET = new Set<string>(homeColorConfigurableProductIds);
const HOME_BRANDING_PRODUCT_SET = new Set<string>(homeBrandingConfigurableProductIds);

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

const KENYAN_COUNTIES = [
  "Nairobi",
  "Kiambu",
  "Machakos",
  "Kajiado",
  "Mombasa",
  "Nakuru",
  "Kisumu",
  "Eldoret / Uasin Gishu",
  "Nyeri",
  "Meru",
  "Kilifi",
  "Other County (Courier dispatch)",
];

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

    const minQuantity = 1;
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(
          (entry): entry is [string, number] =>
            typeof entry[1] === "number" && Number.isFinite(entry[1]),
        )
        .map(([id, value]) => [id, clampQuantity(Math.trunc(value), minQuantity, 99)]),
    );
  } catch {
    return {};
  }
};

const readStoredHomeItemOptions = (): Record<string, HomeItemOptions> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(HOME_ITEM_OPTIONS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const validColors = new Set<string>(homeApparelColorOptions);
    const validLogos = new Set<string>(homeLogoOptions);

    return Object.fromEntries(
      Object.entries(parsed)
        .filter((entry): entry is [string, Record<string, unknown>] => {
          const value = entry[1];
          return !!value && typeof value === "object";
        })
        .map(([productId, value]) => {
          const color =
            typeof value.color === "string" && validColors.has(value.color)
              ? (value.color as HomeApparelColor)
              : DEFAULT_HOME_ITEM_OPTIONS.color;

          const logo =
            typeof value.logo === "string" && validLogos.has(value.logo)
              ? (value.logo as HomeLogoOption)
              : DEFAULT_HOME_ITEM_OPTIONS.logo;

          return [productId, { color, logo }];
        }),
    );
  } catch {
    return {};
  }
};

const formatAmount = (amount: number, currency: CurrencyCode) => {
  const locale = currency === "KES" ? "en-KE" : "en-US";
  return `${currency} ${Math.round(amount).toLocaleString(locale)}`;
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

interface CheckoutProps {
  forcedSource?: StorefrontSource;
}

const Checkout: React.FC<CheckoutProps> = ({ forcedSource }) => {
  const location = useLocation();

  // Determine whether this checkout instance is dedicated to "home" or "village"
  const activeSource: StorefrontSource = useMemo(() => {
    if (forcedSource) return forcedSource;
    if (location.pathname.endsWith("/village")) return "village";
    if (location.pathname.endsWith("/home")) return "home";
    const querySource = parseSource(new URLSearchParams(location.search).get("source"));
    if (querySource) return querySource;
    return "home";
  }, [forcedSource, location.pathname, location.search]);

  // Load ONLY the cart for this specific storefront
  const [cart, setCart] = useState<Record<string, number>>(() => readStoredCart(activeSource));

  // Customer Contact State
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  // Delivery / Shipping State (Uburu Home only)
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [deliveryCounty, setDeliveryCounty] = useState("Nairobi");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  // Booking & Travel State (Uburu Village only)
  const [travelDate, setTravelDate] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [travelNotes, setTravelNotes] = useState("");

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [homeItemOptions, setHomeItemOptions] = useState<Record<string, HomeItemOptions>>(
    () => readStoredHomeItemOptions(),
  );

  // Sync apparel variant options
  useEffect(() => {
    const syncHomeOptions = () => setHomeItemOptions(readStoredHomeItemOptions());
    window.addEventListener("storage", syncHomeOptions);
    window.addEventListener("uburu:home-options-updated", syncHomeOptions as EventListener);

    return () => {
      window.removeEventListener("storage", syncHomeOptions);
      window.removeEventListener(
        "uburu:home-options-updated",
        syncHomeOptions as EventListener,
      );
    };
  }, []);

  // Sync cart storage changes specifically for this activeSource
  useEffect(() => {
    const storageKey = SOURCE_KEYS[activeSource];
    if (typeof window === "undefined") return;

    if (Object.keys(cart).length === 0) {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, JSON.stringify(cart));
    }

    window.dispatchEvent(
      new CustomEvent("uburu:cart-updated", { detail: { storageKey } }),
    );
  }, [cart, activeSource]);

  // Map and calculate items for THIS dedicated checkout
  const items: CartItem[] = useMemo(() => {
    const catalog = catalogBySource[activeSource] || [];
    return catalog
      .map((item): CartItem | null => {
        const quantity = cart[item.id] ?? 0;
        if (quantity <= 0) return null;
        return {
          id: item.id,
          name: item.name,
          quantity,
          unitPrice: item.price,
          lineTotal: item.price * quantity,
          currency: item.currency,
          image: item.image,
          tag: item.tag,
        };
      })
      .filter((item): item is CartItem => item !== null);
  }, [activeSource, cart]);

  const uniqueCurrencies = useMemo(() => new Set(items.map((i) => i.currency)), [items]);
  const hasMixedCurrencies = uniqueCurrencies.size > 1;
  const currency: CurrencyCode = items[0]?.currency ?? "KES";
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.lineTotal, 0), [items]);
  const totalItemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  // Discount Calculation
  const discountAmount = useMemo(() => {
    if (!appliedPromo || subtotal <= 0) return 0;
    return (subtotal * appliedPromo.discountPercent) / 100;
  }, [appliedPromo, subtotal]);

  const payableTotal = Math.max(0, subtotal - discountAmount);

  const checkoutDisabled =
    status === "processing" ||
    items.length === 0 ||
    hasMixedCurrencies;

  const setItemQuantity = (itemId: string, nextValue: number) => {
    const minQuantity = 1;
    const safe = nextValue <= 0 ? 0 : clampQuantity(nextValue, minQuantity, 99);
    setCart((prev) => {
      const next = { ...prev };
      if (safe === 0) {
        delete next[itemId];
      } else {
        next[itemId] = safe;
      }
      return next;
    });
    setStatus("idle");
    setStatusMessage("");
  };

  const clearTray = () => {
    if (window.confirm(`Are you sure you want to clear your ${SOURCE_LABEL[activeSource]} tray?`)) {
      setCart({});
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === "UBURU10" || code === "WELCOME10") {
      setAppliedPromo({ code, discountPercent: 10 });
      setPromoCodeInput("");
    } else if (code === "UBURU5") {
      setAppliedPromo({ code, discountPercent: 5 });
      setPromoCodeInput("");
    } else {
      setPromoError("Invalid promo code. Try 'UBURU10' for 10% off.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

  const handleCheckout = async () => {
    if (items.length === 0 || payableTotal <= 0) {
      setStatus("error");
      setStatusMessage("Please add at least one item to your cart.");
      return;
    }
    if (hasMixedCurrencies) {
      setStatus("error");
      setStatusMessage("Please checkout items with the same currency together.");
      return;
    }
    if (!buyerName.trim()) {
      setStatus("error");
      setStatusMessage("Please enter your full name.");
      return;
    }
    if (!buyerEmail.trim() || !buyerEmail.includes("@")) {
      setStatus("error");
      setStatusMessage("Please enter a valid email address for your order confirmation.");
      return;
    }
    if (!buyerPhone.trim()) {
      setStatus("error");
      setStatusMessage("Please enter your phone number (required for M-Pesa prompt and order updates).");
      return;
    }

    // Specific validation for Uburu Home
    if (activeSource === "home" && deliveryMethod === "delivery" && !deliveryAddress.trim()) {
      setStatus("error");
      setStatusMessage("Please specify your delivery address (street, building, or area).");
      return;
    }

    setStatus("processing");
    setStatusMessage("");

    try {
      const response = await fetch("/api/dpo/create-token.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payableTotal,
          currency,
          customer: {
            name: buyerName.trim(),
            email: buyerEmail.trim(),
            phone: buyerPhone.trim(),
          },
          context: SOURCE_CONTEXT[activeSource],
          meta: {
            type: SOURCE_PURCHASE_TYPE[activeSource],
            itemCount: totalItemCount,
            // Uburu Home metadata
            deliveryMethod: activeSource === "home" ? deliveryMethod : undefined,
            deliveryCounty: activeSource === "home" && deliveryMethod === "delivery" ? deliveryCounty : undefined,
            deliveryAddress: activeSource === "home" && deliveryMethod === "delivery" ? deliveryAddress.trim() : undefined,
            deliveryNotes: activeSource === "home" ? deliveryNotes.trim() || undefined : undefined,
            // Uburu Village metadata
            travelDate: activeSource === "village" ? travelDate || undefined : undefined,
            guestCount: activeSource === "village" ? guestCount || undefined : undefined,
            travelNotes: activeSource === "village" ? travelNotes.trim() || undefined : undefined,
            promoCode: appliedPromo?.code || undefined,
            discountAmount: discountAmount > 0 ? discountAmount : undefined,
            items: items.map((item) => ({
              itemId: item.id,
              itemName: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalAmount: item.lineTotal,
              currency: item.currency,
              ...(activeSource === "home"
                ? {
                    ...(HOME_COLOR_PRODUCT_SET.has(item.id)
                      ? {
                          color:
                            homeItemOptions[item.id]?.color ??
                            DEFAULT_HOME_ITEM_OPTIONS.color,
                        }
                      : {}),
                    ...(HOME_BRANDING_PRODUCT_SET.has(item.id)
                      ? {
                          logoOption:
                            homeItemOptions[item.id]?.logo ??
                            DEFAULT_HOME_ITEM_OPTIONS.logo,
                        }
                      : {}),
                  }
                : {}),
            })),
            totalAmount: payableTotal,
            currency,
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
      setStatusMessage("Redirecting you to secure payment gateway...");
      window.location.href = data.paymentUrl;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Payment failed. Please try again.";
      setStatus("error");
      setStatusMessage(getFriendlyErrorMessage(message));
    }
  };

  const isHome = activeSource === "home";

  return (
    <section className="relative min-h-screen bg-neutral-950 px-4 sm:px-6 pt-24 pb-20 text-white font-sans">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-yellow-500/10 blur-[140px]" />
        <div className="absolute top-1/2 right-10 h-80 w-80 rounded-full bg-amber-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Top Breadcrumb & Return Nav */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to={SOURCE_BACK_LINK[activeSource]} className="hover:text-yellow-400 transition-colors">
              {SOURCE_LABEL[activeSource]}
            </Link>
            <span>/</span>
            <span className="text-yellow-400 font-bold">{isHome ? "Home Checkout" : "Village Checkout"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={SOURCE_BACK_LINK[activeSource]}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-2 text-xs font-bold text-neutral-300 hover:border-yellow-400/50 hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-yellow-400" />
              <span>Back to {SOURCE_LABEL[activeSource]}</span>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 px-3 py-0.5 text-[11px] font-black uppercase tracking-widest text-yellow-400">
              <Lock className="w-3 h-3" />
              Dedicated {SOURCE_LABEL[activeSource]} Checkout
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isHome ? "Uburu Home Checkout" : "Uburu Village Booking & Checkout"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-2xl">
            {isHome
              ? "Complete your purchase for fresh groceries, produce, apparel, merchandise, and home goods."
              : "Confirm your reservation for eco-cultural retreats, Maasai Mara expeditions, and village cultural events."}
          </p>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Customer & Fulfillment Form (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact Info */}
            <div className="rounded-3xl border border-neutral-800/90 bg-neutral-900/80 backdrop-blur-md p-6 shadow-xl">
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400 text-black font-black text-xs">
                  1
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {isHome ? "Customer Contact Information" : "Lead Traveler / Guest Information"}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {isHome
                      ? "Where should we send your order confirmation and dispatch receipt?"
                      : "Booking confirmation, travel tickets, and itinerary details will be sent here."}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-yellow-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Jane Mwangi"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:bg-neutral-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-yellow-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:bg-neutral-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Phone Number (M-Pesa) <span className="text-yellow-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="tel"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="0712 345 678"
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:bg-neutral-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Uburu Home Delivery Details */}
            {isHome && (
              <div className="rounded-3xl border border-neutral-800/90 bg-neutral-900/80 backdrop-blur-md p-6 shadow-xl">
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400 text-black font-black text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Delivery & Fulfillment</h2>
                    <p className="text-xs text-neutral-400">Choose how you would like to receive your Uburu Home items</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                      deliveryMethod === "delivery"
                        ? "border-yellow-400 bg-yellow-400/10 ring-1 ring-yellow-400"
                        : "border-neutral-700/80 bg-neutral-800/40 hover:border-neutral-600"
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${deliveryMethod === "delivery" ? "bg-yellow-400 text-black" : "bg-neutral-700 text-neutral-300"}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Doorstep Delivery</p>
                      <p className="mt-0.5 text-[11px] text-neutral-400">Direct courier dispatch to your location</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                      deliveryMethod === "pickup"
                        ? "border-yellow-400 bg-yellow-400/10 ring-1 ring-yellow-400"
                        : "border-neutral-700/80 bg-neutral-800/40 hover:border-neutral-600"
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${deliveryMethod === "pickup" ? "bg-yellow-400 text-black" : "bg-neutral-700 text-neutral-300"}`}>
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Uburu Hub Collection</p>
                      <p className="mt-0.5 text-[11px] text-neutral-400">Pick up from our central dispatch point</p>
                    </div>
                  </button>
                </div>

                {deliveryMethod === "delivery" ? (
                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        County / Destination Region <span className="text-yellow-400">*</span>
                      </label>
                      <select
                        value={deliveryCounty}
                        onChange={(e) => setDeliveryCounty(e.target.value)}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 px-4 py-3 text-sm text-white focus:border-yellow-400 focus:outline-none transition-all"
                      >
                        {KENYAN_COUNTIES.map((county) => (
                          <option key={county} value={county} className="bg-neutral-900 text-white">
                            {county}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Street / Building / House Address <span className="text-yellow-400">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="e.g. Westlands, Delta Corner Annex, Floor 4, Suite 12"
                          className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:bg-neutral-900 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Delivery Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="e.g. Leave with security desk, call before arriving"
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:bg-neutral-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-800/40 p-4 text-xs text-neutral-300 flex items-start gap-3">
                    <Package className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Uburu Hub Pick-up Selected</p>
                      <p className="mt-1 text-neutral-400">
                        Your items will be safely packaged for collection at our central fulfillment hub. You will receive an SMS and email notification once ready for pick-up.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Uburu Village Travel & Booking Details */}
            {!isHome && (
              <div className="rounded-3xl border border-neutral-800/90 bg-neutral-900/80 backdrop-blur-md p-6 shadow-xl">
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400 text-black font-black text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Travel & Reservation Details</h2>
                    <p className="text-xs text-neutral-400">Provide preferred trip dates and guest preferences</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Preferred Travel Date / Month
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          placeholder="e.g. July 2026 / Migration Season"
                          className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:bg-neutral-900 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Number of Guests / Participants
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 pl-10 pr-4 py-3 text-sm text-white focus:border-yellow-400 focus:bg-neutral-900 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Dietary, Accommodation or Special Requests (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={travelNotes}
                      onChange={(e) => setTravelNotes(e.target.value)}
                      placeholder="e.g. Vegetarian meals requested, ground transfer required from Nairobi"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:bg-neutral-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}


          </div>

          {/* RIGHT COLUMN: Dedicated Order Summary & Payment Button (5 cols on lg, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <div className="rounded-3xl border border-neutral-800/90 bg-neutral-900/90 backdrop-blur-md p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white">Order Summary</h2>
                  <p className="text-xs text-neutral-400">
                    {SOURCE_LABEL[activeSource]} ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})
                  </p>
                </div>
                {items.length > 0 && (
                  <button
                    onClick={clearTray}
                    className="text-neutral-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Clear tray"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="mt-4 divide-y divide-neutral-800 max-h-80 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <div className="py-8 text-center">
                    <ShoppingBag className="mx-auto h-10 w-10 text-neutral-600" />
                    <p className="mt-3 text-sm font-bold text-neutral-300">Your {SOURCE_LABEL[activeSource]} tray is empty</p>
                    <p className="mt-1 text-xs text-neutral-500">Please add items from {SOURCE_LABEL[activeSource]} to checkout.</p>
                    <Link
                      to={SOURCE_BACK_LINK[activeSource]}
                      className="mt-4 inline-block rounded-xl bg-yellow-400 px-4 py-2 text-xs font-black text-black hover:bg-yellow-300 transition-colors"
                    >
                      Browse {SOURCE_LABEL[activeSource]}
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center gap-3">
                      {/* Product Thumbnail */}
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-700/80 bg-neutral-800">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-yellow-400">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        )}
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-black text-black shadow">
                          {item.quantity}
                        </span>
                      </div>

                      {/* Info & Options */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-neutral-400">
                          {formatAmount(item.unitPrice, item.currency)} each
                        </p>

                        {/* Variant Badges for Uburu Home */}
                        {isHome &&
                          (HOME_COLOR_PRODUCT_SET.has(item.id) || HOME_BRANDING_PRODUCT_SET.has(item.id)) && (
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                              {HOME_COLOR_PRODUCT_SET.has(item.id) && (
                                <span className="rounded-md bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 text-neutral-300">
                                  Color: {homeItemOptions[item.id]?.color ?? DEFAULT_HOME_ITEM_OPTIONS.color}
                                </span>
                              )}
                              {HOME_BRANDING_PRODUCT_SET.has(item.id) && (
                                <span className="rounded-md bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 text-yellow-400/90">
                                  {homeItemOptions[item.id]?.logo ?? DEFAULT_HOME_ITEM_OPTIONS.logo}
                                </span>
                              )}
                            </div>
                          )}

                        {/* Quantity Stepper & Remove */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center rounded-lg border border-neutral-700 bg-neutral-800/80 p-0.5">
                            <button
                              type="button"
                              onClick={() => setItemQuantity(item.id, item.quantity - 1)}
                              className="h-5 w-5 rounded flex items-center justify-center text-xs font-bold text-neutral-300 hover:bg-neutral-700 hover:text-white"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="min-w-6 text-center text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setItemQuantity(item.id, item.quantity + 1)}
                              className="h-5 w-5 rounded flex items-center justify-center text-xs font-bold text-neutral-300 hover:bg-neutral-700 hover:text-white"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setItemQuantity(item.id, 0)}
                            className="text-[10px] text-neutral-400 hover:text-red-400 transition-colors uppercase font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-yellow-400">
                          {formatAmount(item.lineTotal, item.currency)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Promo Code Input */}
              {items.length > 0 && (
                <div className="mt-4 border-t border-neutral-800 pt-4">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-xs">
                      <div className="flex items-center gap-2 text-yellow-400 font-bold">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Code "{appliedPromo.code}" applied (-{appliedPromo.discountPercent}%)</span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-[11px] text-neutral-400 hover:text-white uppercase font-bold ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="Promo code (e.g. UBURU10)"
                        className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-neutral-800 border border-neutral-700 hover:border-yellow-400 px-3.5 py-2 text-xs font-bold text-white hover:text-yellow-400 transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoError && (
                    <p className="mt-1.5 text-[11px] text-red-400">{promoError}</p>
                  )}
                </div>
              )}

              {/* Cost Calculations */}
              {items.length > 0 && (
                <div className="mt-4 border-t border-neutral-800 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">
                      {formatAmount(subtotal, currency)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount ({appliedPromo?.code})</span>
                      <span className="font-semibold">
                        -{formatAmount(discountAmount, currency)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400">
                    <span>{isHome ? "Delivery Charges" : "Booking Fee"}</span>
                    <span className="font-semibold text-neutral-300">
                      {isHome
                        ? deliveryMethod === "pickup"
                          ? "Free (Hub Collection)"
                          : "Arranged upon dispatch"
                        : "Included"}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-400">
                    <span>Tax (VAT)</span>
                    <span className="font-semibold text-neutral-300">Included in prices</span>
                  </div>

                  <div className="border-t border-neutral-800 pt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-white">Total Amount</span>
                      <p className="text-[10px] text-neutral-400">Final payable amount</p>
                    </div>
                    <span className="text-xl font-black text-yellow-400">
                      {formatAmount(payableTotal, currency)}
                    </span>
                  </div>
                </div>
              )}

              {/* Status Banner */}
              {status !== "idle" && (
                <div
                  className={`mt-4 flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs font-semibold ${
                    status === "error"
                      ? "border-red-400/40 bg-red-500/10 text-red-200"
                      : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                  }`}
                >
                  {status === "error" ? (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Main Checkout CTA Button */}
              <div className="mt-5">
                <Button
                  onClick={handleCheckout}
                  disabled={checkoutDisabled}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {status === "processing" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4 animate-spin text-black" />
                      Redirecting to DPO Pay...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4 text-black" />
                      Pay {formatAmount(payableTotal, currency)} via DPO Pay
                    </span>
                  )}
                </Button>
              </div>

              <div className="mt-3.5 flex items-center justify-center gap-2 text-[10px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Authorized DPO Payment Gateway · Instant M-Pesa & Cards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
