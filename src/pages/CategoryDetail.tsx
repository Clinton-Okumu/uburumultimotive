import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Wrench,
  Shirt,
  Carrot,
  UtensilsCrossed,
  Briefcase,
  Baby,
  Home,
  Gift,
  Stethoscope,
  HardHat,
  ShoppingCart,
  X,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import {
  homeCategories,
  getCategoryBySlug,
  type HomeCategoryItem,
} from "../data/homeCategories";
import {
  homeProducts,
  homeApparelColorOptions,
  homeLogoOptions,
  homeColorConfigurableProductIds,
  homeBrandingConfigurableProductIds,
  type HomeApparelColor,
  type HomeLogoOption,
} from "../data/storefrontCatalog";
import { useStorefrontCheckout } from "../hooks/useStorefrontCheckout";
import Button from "../components/shared/Button";

const HOME_ITEM_OPTIONS_STORAGE_KEY = "uburu_home_item_options";

type HomeItemOptionsState = Record<
  string,
  { color: HomeApparelColor; logo: HomeLogoOption }
>;

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
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return {};

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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingCart,
  Carrot,
  UtensilsCrossed,
  Briefcase,
  Sparkles,
  Baby,
  Home,
  Wrench,
  Gift,
  Stethoscope,
  Shirt,
  HardHat,
};

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const category = useMemo(() => {
    return categoryId ? getCategoryBySlug(categoryId) : undefined;
  }, [categoryId]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [activeFolderItem, setActiveFolderItem] = useState<HomeCategoryItem | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

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

  // Universal cart checkout hook
  const { quantities, cartItemCount, updateQuantity, addToCart } =
    useStorefrontCheckout({
      catalog: homeProducts.map(({ id, name, price }) => ({ id, name, price })),
      context: "uburu_home",
      purchaseType: "product_purchase",
      emptyCartMessage: "Please add at least one item to your tray.",
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

  const handleAddToCart = (productId: string) => {
    setSelectedProductId(productId);
    addToCart(productId);
    window.dispatchEvent(new CustomEvent("uburu:open-cart"));
  };

  const handleBuyClick = (productId: string) => {
    handleAddToCart(productId);
  };

  // Extract all unique tags in this category
  const availableTags = useMemo(() => {
    if (!category) return ["All"];
    const tags = new Set<string>();
    category.items.forEach((item) => {
      if (item.tag) tags.add(item.tag);
    });
    return ["All", ...Array.from(tags)];
  }, [category]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!category) return [];

    let items = category.items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag === "All" || item.tag === selectedTag;

      return matchesSearch && matchesTag;
    });

    if (sortBy === "price-asc") {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [category, searchQuery, selectedTag, sortBy]);

  if (!category) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white px-6 py-28 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black text-yellow-400 mb-3">Category Not Found</h2>
        <p className="text-neutral-400 max-w-md mb-8">
          The category you requested does not exist or has been relocated.
        </p>
        <Link
          to="/get/home"
          className="rounded-xl bg-yellow-400 px-6 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-yellow-300 transition-colors"
        >
          Return to Uburu Home
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[category.iconName] || ShoppingCart;

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-yellow-500/10 blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[140px]" />
      </div>

      {/* Category Banner & Breadcrumbs */}
      <section className="relative bg-neutral-900/60 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 py-12">
        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center text-xs font-semibold">
              <li className="flex items-center">
                <Link to="/" className="text-white/60 hover:text-yellow-400 transition-colors">
                  Home
                </Link>
                <ChevronRight className="mx-2 w-3.5 h-3.5 text-yellow-400/60" />
              </li>
              <li className="flex items-center">
                <Link to="/get/home" className="text-white/60 hover:text-yellow-400 transition-colors">
                  Uburu Home
                </Link>
                <ChevronRight className="mx-2 w-3.5 h-3.5 text-yellow-400/60" />
              </li>
              <li className="text-yellow-300 font-bold" aria-current="page">
                {category.name}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/20">
                <IconComponent className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-300 mb-2">
                  <span>Department Catalog</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {category.name}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/get/home"
                className="rounded-2xl border border-white/15 bg-neutral-900/80 hover:bg-neutral-800 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                All Categories
              </Link>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("uburu:open-cart"))}
                className="bg-yellow-400 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-black hover:bg-yellow-300 rounded-2xl shadow-[0_10px_25px_rgba(250,204,21,0.3)] transition-all"
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Tray ({cartItemCount})
                </span>
              </Button>
            </div>
          </div>

          {/* Quick Department Switcher Pills */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center gap-2 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
            <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 shrink-0 mr-2">
              Departments:
            </span>
            {homeCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/get/home/category/${cat.slug}`}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  cat.id === category.id
                    ? "bg-yellow-400 text-black font-black shadow-md shadow-yellow-400/20 ring-2 ring-yellow-400/40"
                    : "bg-white/[0.05] text-neutral-300 hover:bg-white/10 hover:text-white border border-white/[0.06]"
                }`}
              >
                {cat.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product / Service Catalog View */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12">
        {category.items.length > 0 ? (
          <>
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 bg-neutral-900/60 backdrop-blur-md p-4 rounded-3xl border border-white/[0.08]">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${category.name}...`}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-3 text-xs text-neutral-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sub-tag filter pills */}
              {availableTags.length > 2 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                        selectedTag === tag
                          ? "bg-yellow-400 text-black font-black shadow-sm"
                          : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] border border-white/[0.06]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-yellow-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-2xl border border-white/15 bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs font-bold text-neutral-400 mb-8 px-1">
              <span>Showing {filteredItems.length} items</span>
              <span className="text-yellow-300 uppercase tracking-wider">
                All prices in Kenyan Shillings (KES)
              </span>
            </div>

            {/* Product Cards Grid (Matching the exact design from the original Featured picks) */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredItems.map((product) => {
                const qty = quantities[product.id] ?? 1;
                const isSelected = selectedProductId === product.id;

                return (
                  <div
                    key={product.id}
                    onMouseEnter={() => setSelectedProductId(product.id)}
                    onFocusCapture={() => setSelectedProductId(product.id)}
                    className={`group flex flex-col justify-between overflow-hidden rounded-3xl border bg-neutral-900/90 shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${
                      isSelected
                        ? "border-yellow-400 ring-2 ring-yellow-400/40 shadow-[0_15px_35px_rgba(250,204,21,0.15)]"
                        : "border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div>
                      {/* Product Image */}
                      <div className="relative h-56 overflow-hidden bg-neutral-950">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        
                        <span className="absolute left-4 top-4 rounded-full bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-300 border border-yellow-400/30">
                          {product.tag}
                        </span>
                        <span className="absolute bottom-4 left-4 rounded-full bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-300">
                          {product.isFolder ? "Collection" : "In stock"}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-black text-white">{product.name}</h3>
                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-yellow-200/70">
                              Uburu Home
                            </p>
                          </div>
                          {!product.isFolder && (
                            <div className="rounded-2xl bg-yellow-400/15 border border-yellow-400/30 px-3 py-2 text-xs font-black uppercase tracking-widest text-yellow-300">
                              KES {product.price.toLocaleString("en-KE")}
                            </div>
                          )}
                        </div>

                        {!product.isFolder ? (
                          <>
                            {/* Quantity Selector */}
                            <div className="mt-5 flex items-center justify-between rounded-2xl border border-neutral-800 bg-black/50 px-3 py-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, qty - 1)}
                                className="h-9 w-9 rounded-xl bg-neutral-900 text-lg font-bold text-yellow-300 hover:bg-neutral-800 transition-colors shadow-sm"
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
                                value={qty}
                                onChange={(event) =>
                                  updateQuantity(product.id, Number(event.target.value) || 1)
                                }
                                className="w-16 bg-transparent text-center text-sm font-black text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, qty + 1)}
                                className="h-9 w-9 rounded-xl bg-neutral-900 text-lg font-bold text-yellow-300 hover:bg-neutral-800 transition-colors shadow-sm"
                                aria-label={`Increase ${product.name} quantity`}
                              >
                                +
                              </button>
                            </div>

                            {/* Color / Branding Configurable Selects */}
                            {(colorConfigurableProductIds.has(product.id) ||
                              brandingConfigurableProductIds.has(product.id)) && (
                              <div className="mt-4 space-y-3 rounded-2xl border border-neutral-800 bg-black/30 p-3">
                                {colorConfigurableProductIds.has(product.id) && (
                                  <div>
                                    <label
                                      htmlFor={`color-${product.id}`}
                                      className="text-[10px] font-black uppercase tracking-[0.22em] text-yellow-200/80 block mb-1.5"
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
                                      className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs font-semibold text-white focus:border-yellow-300 focus:outline-none"
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
                                      className="text-[10px] font-black uppercase tracking-[0.22em] text-yellow-200/80 block mb-1.5"
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
                                      className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs font-semibold text-white focus:border-yellow-300 focus:outline-none"
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
                              className="mt-5 w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3.5 text-xs font-black uppercase tracking-[0.25em] rounded-2xl shadow-lg transition-all"
                            >
                              Add to tray
                            </Button>
                          </>
                        ) : (
                          /* Folder / Digital Library Card */
                          <div className="mt-5">
                            <p className="mb-4 text-xs font-medium text-neutral-300">
                              Explore our digital library. Select individual titles to support our cause.
                            </p>
                            <Button
                              onClick={() => {
                                setActiveFolderItem(product);
                                setIsFolderOpen(true);
                              }}
                              className="w-full border-2 border-yellow-400 bg-yellow-400 py-3.5 text-xs font-black uppercase tracking-[0.25em] text-black hover:bg-yellow-300 rounded-2xl shadow-lg transition-all"
                            >
                              Browse Collection
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Empty / Coming Soon Department State */
          <div className="rounded-3xl border border-white/[0.08] bg-neutral-900/60 backdrop-blur-xl p-12 sm:p-16 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 mx-auto mb-5">
              <IconComponent className="h-8 w-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              {category.name} Catalog
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed mb-8">
              We are currently curating and onboarding fresh items for this department. If you need specific items or services right away, our team is ready to assist you directly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/254714138139?text=${encodeURIComponent(
                  `Hello Uburu Home, I would like to inquire about items in the ${category.name} department.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Inquire on WhatsApp
              </a>
              <Link
                to="/get/home"
                className="rounded-2xl border border-white/20 bg-neutral-800 hover:bg-neutral-700 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 transition-all"
              >
                Back to All Categories
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Ebook / Digital Library Modal */}
      {isFolderOpen && activeFolderItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setIsFolderOpen(false)}
          />
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-neutral-950 p-6 sm:p-10 shadow-2xl">
            <button
              onClick={() => setIsFolderOpen(false)}
              className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-10 text-center">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
                Digital Library
              </p>
              <h3 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                Ebook Collection
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeFolderItem.folderItems?.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-yellow-400/50 hover:bg-white/[0.06]"
                >
                  <div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-3">
                      <h4 className="text-lg font-black text-white leading-tight">
                        {item.name}
                      </h4>
                      <div className="shrink-0 rounded-xl bg-yellow-400/10 px-3 py-1 text-[11px] font-black text-yellow-300">
                        KES {item.price.toLocaleString("en-KE")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <Button
                      onClick={() => handleBuyClick(item.id)}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-black rounded-2xl shadow-lg transition-all"
                    >
                      Add to tray
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
