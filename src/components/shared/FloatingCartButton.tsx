import React, { useEffect, useState, useMemo } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import {
  getSanitizedHomeCart,
  getSanitizedVillageCart,
  getAllValidHomeProductsMap,
} from "../../utils/cartStorage";

export const FloatingCartButton: React.FC = () => {
  const [homeCart, setHomeCart] = useState<Record<string, number>>(() =>
    getSanitizedHomeCart()
  );
  const [villageCart, setVillageCart] = useState<Record<string, number>>(() =>
    getSanitizedVillageCart()
  );
  const [isBouncing, setIsBouncing] = useState(false);

  const refreshCart = () => {
    setHomeCart(getSanitizedHomeCart());
    setVillageCart(getSanitizedVillageCart());
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener("uburu:cart-updated", refreshCart);
    window.addEventListener("storage", refreshCart);

    return () => {
      window.removeEventListener("uburu:cart-updated", refreshCart);
      window.removeEventListener("storage", refreshCart);
    };
  }, []);

  const { totalCount, totalAmount } = useMemo(() => {
    let count = 0;
    let amount = 0;

    const validHomeProducts = getAllValidHomeProductsMap();

    // Sum home valid products
    Object.entries(homeCart).forEach(([id, qty]) => {
      const product = validHomeProducts.get(id);
      if (product && qty > 0) {
        count += qty;
        amount += product.price * qty;
      }
    });

    // Sum village products count
    Object.values(villageCart).forEach((qty) => {
      if (qty > 0) {
        count += qty;
      }
    });

    return { totalCount: count, totalAmount: amount };
  }, [homeCart, villageCart]);

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-40 flex justify-center pointer-events-none">
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("uburu:open-cart"))}
        className={`pointer-events-auto w-full sm:w-auto flex items-center justify-between gap-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-3.5 sm:py-3 shadow-[0_12px_35px_rgba(250,204,21,0.4)] border border-yellow-300 ring-2 ring-yellow-400/50 transition-all duration-300 active:scale-95 ${
          isBouncing ? "scale-105" : "scale-100"
        }`}
        aria-label="View Shopping Tray"
      >
        {/* Left: Icon & Count Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-black text-yellow-400 shadow-sm">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-black text-white shadow ring-2 ring-yellow-400">
              {totalCount}
            </span>
          </div>

          <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-wider text-black/70 leading-none">
              Your Tray
            </p>
            {totalAmount > 0 ? (
              <p className="text-sm font-black text-black leading-tight mt-0.5">
                KES {totalAmount.toLocaleString("en-KE")}
              </p>
            ) : (
              <p className="text-xs font-black text-black leading-tight mt-0.5">
                {totalCount} {totalCount === 1 ? "item" : "items"}
              </p>
            )}
          </div>
        </div>

        {/* Right: Action CTA */}
        <div className="flex items-center gap-1.5 rounded-xl bg-black text-yellow-400 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider shadow-sm">
          <span>Checkout</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </button>
    </div>
  );
};

export default FloatingCartButton;
