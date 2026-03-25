import { useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import {
  homeApparelColorOptions,
  homeBrandingConfigurableProductIds,
  homeColorConfigurableProductIds,
  homeLogoOptions,
  homeProducts as products,
  type HomeApparelColor,
  type HomeLogoOption,
} from "../../data/storefrontCatalog";

const HOME_ITEM_OPTIONS_STORAGE_KEY = "uburu_home_item_options";

type HomeItemOptionsState = Record<string, { color: HomeApparelColor; logo: HomeLogoOption }>;

const defaultHomeItemOption = {
  color: homeApparelColorOptions[0],
  logo: homeLogoOptions[0],
} as const;

const readStoredHomeItemOptions = (): HomeItemOptionsState => {
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
          const option = entry[1];
          return !!option && typeof option === "object";
        })
        .map(([productId, option]) => {
          const nextColor = option.color;
          const nextLogo = option.logo;
          const color =
            typeof nextColor === "string" && validColors.has(nextColor)
              ? (nextColor as HomeApparelColor)
              : defaultHomeItemOption.color;
          const logo =
            typeof nextLogo === "string" && validLogos.has(nextLogo)
              ? (nextLogo as HomeLogoOption)
              : defaultHomeItemOption.logo;

          return [productId, { color, logo }];
        }),
    );
  } catch {
    return {};
  }
};

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const colorConfigurableProductIds = useMemo(
    () => new Set<string>(homeColorConfigurableProductIds),
    [],
  );
  const brandingConfigurableProductIds = useMemo(
    () => new Set<string>(homeBrandingConfigurableProductIds),
    [],
  );
  const [itemOptions, setItemOptions] = useState<HomeItemOptionsState>(() =>
    readStoredHomeItemOptions(),
  );
  const { quantities, cartItemCount, updateQuantity, addToCart } =
    useStorefrontCheckout({
      catalog: products.map(({ id, name, price }) => ({ id, name, price })),
      context: "uburu_home",
      purchaseType: "product_purchase",
      emptyCartMessage: "Please add at least one item to your cart.",
      storageKey: "uburu_home_cart",
    });

  useEffect(() => {
    const configurableProducts = new Set<string>([
      ...homeColorConfigurableProductIds,
      ...homeBrandingConfigurableProductIds,
    ]);
    const needsDefaults = Array.from(configurableProducts).some(
      (productId) => !itemOptions[productId],
    );
    if (!needsDefaults || typeof window === "undefined") {
      return;
    }

    const nextOptions: HomeItemOptionsState = { ...itemOptions };
    configurableProducts.forEach((productId) => {
      if (!nextOptions[productId]) {
        nextOptions[productId] = { ...defaultHomeItemOption };
      }
    });

    setItemOptions(nextOptions);
    window.localStorage.setItem(HOME_ITEM_OPTIONS_STORAGE_KEY, JSON.stringify(nextOptions));
    window.dispatchEvent(new CustomEvent("uburu:home-options-updated"));
  }, [itemOptions]);

  const updateItemOption = (
    productId: string,
    field: "color" | "logo",
    value: HomeApparelColor | HomeLogoOption,
  ) => {
    setItemOptions((prev) => {
      const current = prev[productId] ?? { ...defaultHomeItemOption };
      const next = {
        ...prev,
        [productId]: {
          ...current,
          [field]: value,
        },
      };

      if (typeof window !== "undefined") {
        window.localStorage.setItem(HOME_ITEM_OPTIONS_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent("uburu:home-options-updated"));
      }

      return next;
    });
  };

  const goToCheckout = () => {
    navigate("/checkout?source=home");
  };

  const handleBuyClick = (productId: string) => {
    setSelectedProductId(productId);
    addToCart(productId);
    goToCheckout();
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
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-yellow-200/80">
              Delivery charges are separate from item prices.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-yellow-500/40 bg-black px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-yellow-300">
              {products.length} items
            </span>
            <Button
              onClick={goToCheckout}
              className="bg-yellow-400 px-6 py-3 text-xs font-black uppercase tracking-[0.25em] text-black hover:bg-yellow-300"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Checkout ({cartItemCount})
              </span>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              onMouseEnter={() => setSelectedProductId(product.id)}
              onFocusCapture={() => setSelectedProductId(product.id)}
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
                {(colorConfigurableProductIds.has(product.id) ||
                  brandingConfigurableProductIds.has(product.id)) && (
                  <div className="mt-4 space-y-3 rounded-2xl border border-neutral-800 bg-black/25 p-3">
                    {colorConfigurableProductIds.has(product.id) && (
                      <div>
                        <label
                          htmlFor={`color-${product.id}`}
                          className="text-[10px] font-black uppercase tracking-[0.22em] text-yellow-200/80"
                        >
                          Color
                        </label>
                        <select
                          id={`color-${product.id}`}
                          value={itemOptions[product.id]?.color ?? defaultHomeItemOption.color}
                          onChange={(event) =>
                            updateItemOption(
                              product.id,
                              "color",
                              event.target.value as HomeApparelColor,
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs font-semibold text-white focus:border-yellow-300 focus:outline-none"
                        >
                          {homeApparelColorOptions.map((color) => (
                            <option key={`${product.id}-${color}`} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {brandingConfigurableProductIds.has(product.id) && (
                      <div>
                        <label
                          htmlFor={`logo-${product.id}`}
                          className="text-[10px] font-black uppercase tracking-[0.22em] text-yellow-200/80"
                        >
                          Branding
                        </label>
                        <select
                          id={`logo-${product.id}`}
                          value={itemOptions[product.id]?.logo ?? defaultHomeItemOption.logo}
                          onChange={(event) =>
                            updateItemOption(
                              product.id,
                              "logo",
                              event.target.value as HomeLogoOption,
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs font-semibold text-white focus:border-yellow-300 focus:outline-none"
                        >
                          {homeLogoOptions.map((logoOption) => (
                            <option key={`${product.id}-${logoOption}`} value={logoOption}>
                              {logoOption}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
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
      </div>
    </section>
  );
};

export default FeaturedProducts;
