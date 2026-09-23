import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
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
  CheckCircle2,
  Tag,
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
import { ServiceInquiryModal } from "../components/UburuHomeComponents/ServiceInquiryModal";

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
  const [selectedService, setSelectedService] = useState<HomeCategoryItem | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  useEffect(() => {
    if (category) {
      document.title = `${category.name} | Uburu Home`;
    } else {
      document.title = "Category | Uburu Home";
    }
  }, [category]);

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

  const categoryTabsRef = useRef<HTMLDivElement>(null);

  const scrollCategoryTabs = (direction: "left" | "right") => {
    if (categoryTabsRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      categoryTabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
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

  // Compute item count per tag
  const tagCounts = useMemo(() => {
    if (!category) return {};
    const counts: Record<string, number> = { All: category.items.length };
    category.items.forEach((item) => {
      if (item.tag) {
        counts[item.tag] = (counts[item.tag] || 0) + 1;
      }
    });
    return counts;
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
      <div className="min-h-screen bg-slate-50 text-neutral-900 px-6 py-28 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black text-amber-600 mb-3">Category Not Found</h2>
        <p className="text-neutral-600 max-w-md mb-8">
          The category you requested does not exist or has been relocated.
        </p>
        <Link
          to="/get/home"
          className="rounded-xl bg-yellow-400 px-6 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-yellow-300 transition-colors shadow-md"
        >
          Return to Uburu Home
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[category.iconName] || ShoppingCart;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-neutral-900 pt-24 pb-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-yellow-400/10 blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-amber-400/10 blur-[140px]" />
      </div>

      {/* Category Banner & Breadcrumbs */}
      <section className="relative bg-white border-b border-neutral-200/80 px-4 sm:px-6 py-12 shadow-xs">
        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center text-xs font-semibold">
              <li className="flex items-center">
                <Link to="/" className="text-neutral-500 hover:text-amber-600 transition-colors">
                  Home
                </Link>
                <ChevronRight className="mx-2 w-3.5 h-3.5 text-neutral-400" />
              </li>
              <li className="flex items-center">
                <Link to="/get/home" className="text-neutral-500 hover:text-amber-600 transition-colors">
                  Uburu Home
                </Link>
                <ChevronRight className="mx-2 w-3.5 h-3.5 text-neutral-400" />
              </li>
              <li className="text-amber-700 font-bold" aria-current="page">
                {category.name}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/25">
                <IconComponent className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-50 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-900 mb-2 shadow-xs">
                  <span>Category Catalog</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight">
                  {category.name}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/get/home"
                className="rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-neutral-800 transition-all flex items-center gap-2 shadow-xs"
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

          {/* Quick Department Switcher Ribbon with Mini-Icons & Scroll Controls */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-800">
                  Marketplace Categories
                </span>
                <span className="rounded-full bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 text-[10px] font-bold text-neutral-600">
                  {homeCategories.length} Departments
                </span>
              </div>

              {/* Scroll Arrow Buttons for smooth horizontal navigation */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCategoryTabs("left")}
                  aria-label="Scroll categories left"
                  className="h-7 w-7 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCategoryTabs("right")}
                  aria-label="Scroll categories right"
                  className="h-7 w-7 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Category Track with Icons */}
            <div
              ref={categoryTabsRef}
              className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
              style={{ scrollbarWidth: "none" }}
            >
              {homeCategories.map((cat) => {
                const TabIcon = iconMap[cat.iconName] || ShoppingCart;
                const isActive = cat.id === category.id;

                return (
                  <Link
                    key={cat.id}
                    to={`/get/home/category/${cat.slug}`}
                    className={`group shrink-0 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-yellow-400 text-black font-black shadow-[0_8px_20px_rgba(250,204,21,0.25)] ring-2 ring-yellow-400/50 scale-[1.02]"
                        : "bg-white text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-200 shadow-xs"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? "bg-black/15 text-black"
                          : "bg-neutral-100 text-amber-700 group-hover:text-amber-800"
                      }`}
                    >
                      <TabIcon className="h-3.5 w-3.5" />
                    </div>
                    <span>{cat.shortName}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Product / Service Catalog View */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12">
        {category.items.length > 0 ? (
          <>
            {/* Elevated Two-Tier Search, Filter & Sort Toolbar */}
            <div className="mb-10 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              {/* Tier 1: Search and Sort Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Full-width responsive Search bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search in ${category.name}...`}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-11 pr-10 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-yellow-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="absolute right-3.5 top-3.5 rounded-full bg-neutral-200 p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none rounded-2xl border border-neutral-200 bg-neutral-50 pl-10 pr-9 py-3 text-xs font-bold text-neutral-800 focus:border-yellow-400 focus:bg-white focus:outline-none cursor-pointer transition-all hover:border-neutral-300"
                    >
                      <option value="default">Sort: Recommended</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <SlidersHorizontal className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-600 pointer-events-none" />
                    <div className="absolute right-3.5 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-500" />
                  </div>
                </div>
              </div>

              {/* Tier 2: Sub-tag Filter Chips with Item Counts */}
              {availableTags.length > 1 && (
                <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mr-1 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-amber-600" />
                    Filter:
                  </span>
                  {availableTags.map((tag) => {
                    const isSelected = selectedTag === tag;
                    const count = tagCounts[tag];

                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-yellow-400 text-black font-black shadow-xs"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200"
                        }`}
                      >
                        <span>{tag}</span>
                        {count !== undefined && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                              isSelected
                                ? "bg-black/20 text-black"
                                : "bg-neutral-200 text-neutral-600"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs font-bold text-neutral-500 mb-8 px-1">
              <span>Showing {filteredItems.length} items</span>
              <span className="text-amber-800 uppercase tracking-wider font-extrabold">
                All prices in Kenyan Shillings (KES)
              </span>
            </div>

            {category.type === "service" ? (
              /* Service Cards Grid (Tailored for Uburu Services) */
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((service) => (
                  <div
                    key={service.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:border-yellow-400 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <div>
                      {/* Service Image / Banner */}
                      <div className="relative h-48 overflow-hidden bg-neutral-100">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        
                        {service.tag && (
                          <span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-900 border border-yellow-400/40 shadow-xs">
                            {service.tag}
                          </span>
                        )}
                        {service.badge && (
                          <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                            {service.badge}
                          </span>
                        )}
                      </div>

                      {/* Service Details */}
                      <div className="p-6">
                        <h3 className="text-lg font-black text-neutral-900 group-hover:text-amber-700 transition-colors leading-snug">
                          {service.name}
                        </h3>
                        <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Bulleted Features */}
                        {service.features && service.features.length > 0 && (
                          <div className="mt-4 space-y-1.5 rounded-2xl bg-neutral-50 border border-neutral-200 p-3">
                            {service.features.map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[11px] text-neutral-700 font-medium">
                                <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                                <span className="line-clamp-1">{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Base Quote & Inquiry Action */}
                    <div className="p-6 pt-0">
                      <div className="pt-4 border-t border-neutral-100 mb-4">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                              Estimated Base
                            </span>
                            {service.unit && (
                              <span className="text-[11px] text-neutral-500 font-medium">
                                {service.unit}
                              </span>
                            )}
                          </div>
                          <span className="text-base sm:text-lg font-black text-amber-700">
                            KES {service.price.toLocaleString("en-KE")}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => {
                            setSelectedService(service);
                            setIsServiceModalOpen(true);
                          }}
                          className="bg-yellow-400 hover:bg-yellow-300 text-black py-3 text-[11px] font-black uppercase tracking-wider rounded-xl shadow-xs transition-all"
                        >
                          Request
                        </Button>
                        <a
                          href={`https://wa.me/254714138139?text=${encodeURIComponent(
                            `Hello Uburu Home, I would like to request/inquire about "${service.name}".`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-3 text-[11px] font-black uppercase tracking-wider rounded-xl shadow-xs transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Product Cards Grid */
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredItems.map((product) => {
                  const qty = quantities[product.id] ?? 1;
                  const isSelected = selectedProductId === product.id;

                  return (
                    <div
                      key={product.id}
                      onMouseEnter={() => setSelectedProductId(product.id)}
                      onFocusCapture={() => setSelectedProductId(product.id)}
                      className={`group flex flex-col justify-between overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                        isSelected
                          ? "border-yellow-400 ring-2 ring-yellow-400/40 shadow-lg"
                          : "border-neutral-200 hover:border-yellow-400"
                      }`}
                    >
                      <div>
                        {/* Product Image */}
                        <div className="relative h-56 overflow-hidden bg-neutral-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          
                          <span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-900 border border-yellow-400/40 shadow-xs">
                            {product.tag}
                          </span>
                          <span className="absolute bottom-4 left-4 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-300">
                            {product.isFolder ? "Collection" : "In stock"}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-black text-neutral-900">{product.name}</h3>
                              <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                                Uburu Home
                              </p>
                            </div>
                            {!product.isFolder && (
                              <div className="rounded-2xl bg-yellow-50 border border-yellow-300 px-3 py-2 text-xs font-black uppercase tracking-widest text-amber-900 shadow-xs">
                                KES {product.price.toLocaleString("en-KE")}
                              </div>
                            )}
                          </div>

                          {!product.isFolder ? (
                            <>
                              {/* Quantity Selector */}
                              <div className="mt-5 flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(product.id, qty - 1)}
                                  className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-neutral-800 hover:bg-neutral-200 transition-colors shadow-xs border border-neutral-200"
                                  aria-label={`Decrease ${product.name} quantity`}
                                >
                                  -
                                </button>
                                <span className="text-xs font-black uppercase tracking-widest text-neutral-600">
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
                                  className="w-16 bg-transparent text-center text-sm font-black text-neutral-900 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(product.id, qty + 1)}
                                  className="h-9 w-9 rounded-xl bg-white text-lg font-bold text-neutral-800 hover:bg-neutral-200 transition-colors shadow-xs border border-neutral-200"
                                  aria-label={`Increase ${product.name} quantity`}
                                >
                                  +
                                </button>
                              </div>

                              {/* Color / Branding Configurable Selects */}
                              {(colorConfigurableProductIds.has(product.id) ||
                                brandingConfigurableProductIds.has(product.id)) && (
                                <div className="mt-4 space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                                  {colorConfigurableProductIds.has(product.id) && (
                                    <div>
                                      <label
                                        htmlFor={`color-${product.id}`}
                                        className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-700 block mb-1.5"
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
                                        className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-yellow-400 focus:outline-none"
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
                                        className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-700 block mb-1.5"
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
                                        className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-yellow-400 focus:outline-none"
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
                                className="mt-5 w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3.5 text-xs font-black uppercase tracking-[0.25em] rounded-2xl shadow-md transition-all"
                              >
                                Add to tray
                              </Button>
                            </>
                          ) : (
                            /* Folder / Digital Library Card */
                            <div className="mt-5">
                              <p className="mb-4 text-xs font-medium text-neutral-600">
                                Explore our digital library. Select individual titles to support our cause.
                              </p>
                              <Button
                                onClick={() => {
                                  setActiveFolderItem(product);
                                  setIsFolderOpen(true);
                                }}
                                className="w-full border-2 border-yellow-400 bg-yellow-400 py-3.5 text-xs font-black uppercase tracking-[0.25em] text-black hover:bg-yellow-300 rounded-2xl shadow-md transition-all"
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
            )}
          </>
        ) : (
          /* Empty / Coming Soon Department State */
          <div className="rounded-3xl border border-neutral-200 bg-white p-12 sm:p-16 text-center max-w-2xl mx-auto shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-50 border border-yellow-300 text-amber-800 mx-auto mb-5">
              <IconComponent className="h-8 w-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              {category.name} Catalog
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed mb-8">
              We are currently curating and onboarding fresh items for this category. If you need specific items or services right away, our team is ready to assist you directly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/254714138139?text=${encodeURIComponent(
                  `Hello Uburu Home, I would like to inquire about items in the ${category.name} category.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Inquire on WhatsApp
              </a>
              <Link
                to="/get/home"
                className="rounded-2xl border border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black text-xs uppercase tracking-wider px-6 py-3.5 transition-all"
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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsFolderOpen(false)}
          />
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-2xl">
            <button
              onClick={() => setIsFolderOpen(false)}
              className="absolute right-6 top-6 rounded-full bg-neutral-100 p-2 text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-10 text-center">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-800">
                Digital Library
              </p>
              <h3 className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">
                Ebook Collection
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeFolderItem.folderItems?.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-yellow-400 hover:shadow-lg"
                >
                  <div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-3">
                      <h4 className="text-lg font-black text-neutral-900 leading-tight">
                        {item.name}
                      </h4>
                      <div className="shrink-0 rounded-xl bg-yellow-50 border border-yellow-200 px-3 py-1 text-[11px] font-black text-amber-900">
                        KES {item.price.toLocaleString("en-KE")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <Button
                      onClick={() => handleBuyClick(item.id)}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-black rounded-2xl shadow-md transition-all"
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

      {/* Service Inquiry Modal */}
      <ServiceInquiryModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
};

export default CategoryDetail;
