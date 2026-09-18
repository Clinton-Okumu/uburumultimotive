import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  homeColorConfigurableProductIds,
  homeBrandingConfigurableProductIds,
  type HomeApparelColor,
  type HomeLogoOption,
  type StorefrontItem,
} from "../../data/storefrontCatalog";
import {
  getSanitizedHomeCart,
  getAllValidHomeProductsMap,
  HOME_CART_STORAGE_KEY,
  HOME_OPTIONS_STORAGE_KEY,
} from "../../utils/cartStorage";
import Button from "./Button";

type HomeItemOptions = {
  color: HomeApparelColor;
  logo: HomeLogoOption;
};

const readStoredOptions = (): Record<string, HomeItemOptions> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(HOME_OPTIONS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, HomeItemOptions>;
  } catch {
    return {};
  }
};

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>(() => getSanitizedHomeCart());
  const [itemOptions, setItemOptions] = useState<Record<string, HomeItemOptions>>(() =>
    readStoredOptions()
  );

  const colorProductSet = useMemo(
    () => new Set<string>(homeColorConfigurableProductIds),
    []
  );
  const brandingProductSet = useMemo(
    () => new Set<string>(homeBrandingConfigurableProductIds),
    []
  );

  const syncCart = () => {
    setCart(getSanitizedHomeCart());
    setItemOptions(readStoredOptions());
  };

  useEffect(() => {
    const handleOpen = () => {
      syncCart();
      setIsOpen(true);
    };

    window.addEventListener("uburu:open-cart", handleOpen);
    window.addEventListener("uburu:cart-updated", syncCart);
    window.addEventListener("uburu:home-options-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("uburu:open-cart", handleOpen);
      window.removeEventListener("uburu:cart-updated", syncCart);
      window.removeEventListener("uburu:home-options-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const cartItems = useMemo(() => {
    const list: {
      product: StorefrontItem;
      quantity: number;
      lineTotal: number;
      options?: HomeItemOptions;
    }[] = [];

    const validProductsMap = getAllValidHomeProductsMap();

    Object.entries(cart).forEach(([id, qty]) => {
      const product = validProductsMap.get(id);
      if (product && qty > 0) {
        list.push({
          product,
          quantity: qty,
          lineTotal: product.price * qty,
          options: itemOptions[product.id],
        });
      }
    });

    return list;
  }, [cart, itemOptions]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [cartItems]);

  const totalItemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const updateItemQuantity = (productId: string, nextQty: number) => {
    const nextCart = { ...cart };
    if (nextQty <= 0) {
      delete nextCart[productId];
    } else {
      nextCart[productId] = Math.min(99, nextQty);
    }
    setCart(nextCart);
    if (Object.keys(nextCart).length === 0) {
      window.localStorage.removeItem(HOME_CART_STORAGE_KEY);
    } else {
      window.localStorage.setItem(HOME_CART_STORAGE_KEY, JSON.stringify(nextCart));
    }
    window.dispatchEvent(
      new CustomEvent("uburu:cart-updated", { detail: { storageKey: HOME_CART_STORAGE_KEY } })
    );
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout?source=home");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full w-full justify-end sm:pl-10 pointer-events-none">
        <div className="w-full sm:max-w-md transform bg-neutral-950 border-l border-white/10 shadow-2xl transition-all duration-300 flex flex-col justify-between text-white pointer-events-auto h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Your Tray</h3>
                <p className="text-xs text-neutral-400">
                  {totalItemCount} {totalItemCount === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-neutral-900 border border-white/10 p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close tray"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] text-neutral-500 mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Your tray is empty</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-6">
                  Browse Uburu Home categories and add essentials to your tray.
                </p>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-md"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              cartItems.map(({ product, quantity, lineTotal, options }) => {
                const hasColor = colorProductSet.has(product.id) && options?.color;
                const hasLogo = brandingProductSet.has(product.id) && options?.logo;

                return (
                  <div
                    key={product.id}
                    className="flex gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-neutral-900/60 p-3 sm:p-4 transition-all hover:border-yellow-400/40"
                  >
                    {/* Thumbnail */}
                    <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-950 border border-white/10">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-white truncate">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => updateItemQuantity(product.id, 0)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-0.5"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Options Label */}
                        {(hasColor || hasLogo) && (
                          <p className="text-[10px] sm:text-[11px] font-medium text-yellow-300/80 mt-0.5 truncate">
                            {hasColor ? `Color: ${options.color}` : ""}
                            {hasColor && hasLogo ? " • " : ""}
                            {hasLogo ? `${options.logo}` : ""}
                          </p>
                        )}

                        <p className="text-[11px] sm:text-xs font-bold text-neutral-400 mt-1">
                          KES {product.price.toLocaleString("en-KE")} each
                        </p>
                      </div>

                      {/* Quantity & Line Total */}
                      <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 border-t border-white/5">
                        <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-950 px-1.5 sm:px-2 py-0.5">
                          <button
                            onClick={() => updateItemQuantity(product.id, quantity - 1)}
                            className="h-5 w-5 sm:h-6 sm:w-6 text-sm font-bold text-yellow-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="w-6 sm:w-8 text-center text-xs font-black text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateItemQuantity(product.id, quantity + 1)}
                            className="h-5 w-5 sm:h-6 sm:w-6 text-sm font-bold text-yellow-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-black text-yellow-400">
                          KES {lineTotal.toLocaleString("en-KE")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Subtotal & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-white/10 bg-neutral-900/95 space-y-3 sm:space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-sm font-black text-white">
                    KES {totalAmount.toLocaleString("en-KE")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-yellow-200/80">
                  <span className="inline-flex items-center gap-1">
                    <Truck className="h-3 w-3" /> Delivery
                  </span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_25px_rgba(250,204,21,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-yellow-400" />
                <span>Secure Payment • Direct Checkout & Fast Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
