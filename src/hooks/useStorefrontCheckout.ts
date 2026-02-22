import { useEffect, useMemo, useState } from "react";

type PaymentStatus = "idle" | "processing" | "success" | "error";

type CatalogItem = {
  id: string;
  name: string;
  price: number;
};

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type UseStorefrontCheckoutOptions = {
  catalog: CatalogItem[];
  context: "uburu_home" | "uburu_village";
  purchaseType: "product_purchase" | "event_purchase";
  emptyCartMessage: string;
  storageKey: string;
};

const clampQuantity = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const readStoredCart = (storageKey: string): Record<string, number> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const entries = Object.entries(parsed)
      .filter(
        (entry): entry is [string, number] =>
          typeof entry[1] === "number" && Number.isFinite(entry[1]),
      )
      .map(([key, value]) => [key, clampQuantity(Math.trunc(value), 1, 99)]);

    return Object.fromEntries(entries);
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

export const useStorefrontCheckout = ({
  catalog,
  context,
  purchaseType,
  emptyCartMessage,
  storageKey,
}: UseStorefrontCheckoutOptions) => {
  const [quantities, setQuantities] = useState(
    Object.fromEntries(catalog.map((item) => [item.id, 1])) as Record<
      string,
      number
    >,
  );
  const [cart, setCart] = useState<Record<string, number>>(() =>
    readStoredCart(storageKey),
  );
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (Object.keys(cart).length === 0) {
      window.localStorage.removeItem(storageKey);
      window.dispatchEvent(
        new CustomEvent("uburu:cart-updated", { detail: { storageKey } }),
      );
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(cart));
    window.dispatchEvent(
      new CustomEvent("uburu:cart-updated", { detail: { storageKey } }),
    );
  }, [cart, storageKey]);

  const cartItems = useMemo<CartItem[]>(
    () =>
      catalog
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
        .filter((item): item is CartItem => item !== null),
    [catalog, cart],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.lineTotal, 0),
    [cartItems],
  );
  const cartItemCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems],
  );

  const updateQuantity = (itemId: string, nextValue: number) => {
    const safeValue = clampQuantity(nextValue, 1, 99);
    setQuantities((prev) => ({ ...prev, [itemId]: safeValue }));
  };

  const addToCart = (itemId: string) => {
    const quantityToAdd = quantities[itemId] ?? 1;
    setCart((prev) => {
      const nextQuantity = clampQuantity((prev[itemId] ?? 0) + quantityToAdd, 1, 99);
      return { ...prev, [itemId]: nextQuantity };
    });
    setStatus("idle");
    setStatusMessage("");
  };

  const updateCartItemQuantity = (itemId: string, nextValue: number) => {
    const safeValue = clampQuantity(nextValue, 0, 99);
    setCart((prev) => {
      if (safeValue <= 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: safeValue };
    });
    setStatus("idle");
    setStatusMessage("");
  };

  const clearCart = () => {
    setCart({});
    setStatus("idle");
    setStatusMessage("");
  };

  const scrollToCheckout = (checkoutElementId: string) => {
    const checkoutElement = document.getElementById(checkoutElementId);
    if (checkoutElement) {
      checkoutElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || cartTotal <= 0) {
      setStatus("error");
      setStatusMessage(emptyCartMessage);
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
          context,
          meta: {
            type: purchaseType,
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
        error instanceof Error ? error.message : "Payment failed. Please try again.";
      setStatus("error");
      setStatusMessage(getFriendlyErrorMessage(message));
    }
  };

  return {
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
  };
};
