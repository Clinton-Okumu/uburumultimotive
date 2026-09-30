import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Heart,
  LayoutGrid,
  List,
  Star,
  Camera,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Info,
  Filter,
  Wrench,
  ShoppingCart,
  Carrot,
  UtensilsCrossed,
  Briefcase,
  Sparkles,
  Baby,
  Home as HomeIcon,
  Gift,
  Stethoscope,
  Shirt,
  HardHat,
  ArrowRight,
} from "lucide-react";
import {
  homeCategories,
  type HomeCategoryItem,
} from "../../data/homeCategories";
import {
  homeApparelColorOptions,
  homeLogoOptions,
  type HomeApparelColor,
  type HomeLogoOption,
} from "../../data/storefrontCatalog";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import Button from "../shared/Button";
import { ServiceInquiryModal } from "./ServiceInquiryModal";
import uburuLogo from "../../assets/homelogo.webp";

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingCart,
  Carrot,
  UtensilsCrossed,
  Briefcase,
  Sparkles,
  Baby,
  Home: HomeIcon,
  Wrench,
  Gift,
  Stethoscope,
  Shirt,
  HardHat,
};

const categoryThemeMap: Record<string, { gradient: string; text: string; border: string }> = {
  "uburu-smart-shopper": {
    gradient: "from-amber-100 to-yellow-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "uburu-veggies": {
    gradient: "from-emerald-100 to-green-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  "uburu-food": {
    gradient: "from-orange-100 to-amber-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  "uburu-office": {
    gradient: "from-blue-100 to-cyan-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "uburu-beauty": {
    gradient: "from-rose-100 to-pink-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  "uburu-kids": {
    gradient: "from-amber-100 to-yellow-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  "uburu-household": {
    gradient: "from-teal-100 to-emerald-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  "uburu-services": {
    gradient: "from-red-100 to-amber-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  "uburu-souvenirs": {
    gradient: "from-purple-100 to-pink-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "uburu-medical": {
    gradient: "from-red-100 to-rose-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  "uburu-clothing": {
    gradient: "from-yellow-100 to-amber-50",
    text: "text-amber-800",
    border: "border-yellow-300",
  },
  "uburu-construction": {
    gradient: "from-stone-200 to-amber-100",
    text: "text-stone-800",
    border: "border-stone-300",
  },
};

const HOME_ITEM_OPTIONS_STORAGE_KEY = "uburu_home_item_options";
const WISHLIST_STORAGE_KEY = "uburu_wishlist_items";

type HomeItemOptionsState = Record<
  string,
  { color: HomeApparelColor; logo: HomeLogoOption }
>;

const defaultHomeItemOption = {
  color: homeApparelColorOptions[0],
  logo: homeLogoOptions[0],
} as const;

export const TakealotMarketplace: React.FC = () => {

  // Navigation and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategorySlug]);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [isDepartmentMenuOpen, setIsDepartmentMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Accordion toggle states
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isSellerExpanded, setIsSellerExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [selectedOptionsProduct, setSelectedOptionsProduct] = useState<HomeCategoryItem | null>(null);
  const [selectedService, setSelectedService] = useState<HomeCategoryItem | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isEbookModalOpen, setIsEbookModalOpen] = useState(false);
  const [activeEbookItem, setActiveEbookItem] = useState<HomeCategoryItem | null>(null);

  // Cart integration
  const allProductsList = useMemo(() => {
    const list: HomeCategoryItem[] = [];
    const seen = new Set<string>();
    homeCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          list.push(item);
        }
      });
    });
    return list;
  }, []);

  const { quantities, cartItemCount, updateQuantity, addToCart } =
    useStorefrontCheckout({
      catalog: allProductsList.map(({ id, name, price }) => ({ id, name, price })),
      context: "uburu_home",
      purchaseType: "product_purchase",
      emptyCartMessage: "Your tray is currently empty.",
      storageKey: "uburu_home_cart",
    });

  // Product configuration state
  const [itemOptions, setItemOptions] = useState<HomeItemOptionsState>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(HOME_ITEM_OPTIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleAddToCartClick = (product: HomeCategoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.type === "service" || product.categorySlug === "uburu-services") {
      setSelectedService(product);
      setIsServiceModalOpen(true);
      return;
    }

    if (product.isFolder) {
      setActiveEbookItem(product);
      setIsEbookModalOpen(true);
      return;
    }

    if (product.hasColorOptions) {
      setSelectedOptionsProduct(product);
      return;
    }

    addToCart(product.id);
    window.dispatchEvent(new CustomEvent("uburu:open-cart"));
  };

  const handleProductCardClick = (product: HomeCategoryItem) => {
    if (product.type === "service" || product.categorySlug === "uburu-services") {
      setSelectedService(product);
      setIsServiceModalOpen(true);
    } else if (product.isFolder) {
      setActiveEbookItem(product);
      setIsEbookModalOpen(true);
    } else if (product.hasColorOptions) {
      setSelectedOptionsProduct(product);
    } else {
      addToCart(product.id);
      window.dispatchEvent(new CustomEvent("uburu:open-cart"));
    }
  };

  const updateProductOption = (
    productId: string,
    field: "color" | "logo",
    value: HomeApparelColor | HomeLogoOption
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
        localStorage.setItem(HOME_ITEM_OPTIONS_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent("uburu:home-options-updated"));
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategorySlug(null);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setMinRating(0);
    setSortBy("relevance");
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...allProductsList];

    // Category filter
    if (selectedCategorySlug && selectedCategorySlug !== "all") {
      result = result.filter((p) => p.categorySlug === selectedCategorySlug);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.tag && p.tag.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }

    // Price range
    const minVal = parseFloat(minPrice);
    const maxVal = parseFloat(maxPrice);
    if (!isNaN(minVal)) {
      result = result.filter((p) => p.price >= minVal);
    }
    if (!isNaN(maxVal)) {
      result = result.filter((p) => p.price <= maxVal);
    }

    // In Stock
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Min Rating
    if (minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= minRating);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "discount") {
      result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    }

    return result;
  }, [
    allProductsList,
    selectedCategorySlug,
    searchQuery,
    selectedBrands,
    minPrice,
    maxPrice,
    inStockOnly,
    minRating,
    sortBy,
  ]);

  const activeCategoryObject = useMemo(() => {
    if (selectedCategorySlug === "all") return null;
    return homeCategories.find((c) => c.slug === selectedCategorySlug);
  }, [selectedCategorySlug]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-neutral-900 flex flex-col font-sans pt-16 pb-16">
      {/* 1. Integrated Marketplace Search & Department Sub-Bar (Styled with Site Colors) */}
      <section className="bg-neutral-900 text-white border-b border-yellow-500/20 py-3.5 px-4 sm:px-6 shadow-md md:sticky md:top-16 md:z-40">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Shop by Department Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsDepartmentMenuOpen(!isDepartmentMenuOpen)}
              className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-all shadow-sm"
            >
              <span>Shop by Department</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDepartmentMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isDepartmentMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDepartmentMenuOpen(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-neutral-200 bg-white py-2 shadow-2xl z-50 text-neutral-900 divide-y divide-neutral-100 max-h-96 overflow-y-auto">
                  <div
                    onClick={() => {
                      setSelectedCategorySlug("all");
                      setIsDepartmentMenuOpen(false);
                    }}
                    className={`px-4 py-2.5 text-xs font-black cursor-pointer hover:bg-yellow-50 flex items-center justify-between ${
                      selectedCategorySlug === "all" ? "bg-yellow-100/60 text-amber-900" : "text-neutral-900"
                    }`}
                  >
                    <span>All Departments</span>
                    <span className="text-[10px] text-neutral-500 font-normal">({allProductsList.length})</span>
                  </div>
                  {homeCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategorySlug(cat.slug);
                        setIsDepartmentMenuOpen(false);
                      }}
                      className={`px-4 py-2.5 text-xs font-bold cursor-pointer hover:bg-yellow-50 flex items-center justify-between ${
                        selectedCategorySlug === cat.slug ? "bg-yellow-100/60 text-amber-900" : "text-neutral-700"
                      }`}
                    >
                      <span className="line-clamp-1">{cat.name}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">({cat.items.length})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Wide Marketplace Search Bar */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, groceries, apparel, fresh produce, services..."
              className="w-full rounded-l-xl bg-neutral-800/90 border border-neutral-700 pl-4 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-400 focus:border-yellow-400 focus:bg-neutral-950 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-14 text-neutral-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => {}}
              aria-label="Search"
              className="bg-yellow-400 hover:bg-yellow-300 px-5 py-2.5 rounded-r-xl text-black font-black flex items-center justify-center transition-colors shrink-0 shadow-sm"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Wishlist, Cart & Mobile Filter Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {wishlist.length > 0 && (
              <div
                className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-neutral-800 px-3 py-2 text-xs font-bold text-red-400"
                title="Wishlisted items"
              >
                <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                <span>{wishlist.length}</span>
              </div>
            )}

            <button
              onClick={() => window.dispatchEvent(new CustomEvent("uburu:open-cart"))}
              className="flex items-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 px-3.5 py-2 text-xs font-black text-black transition-all shadow-sm"
              title="View Cart Tray"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tray ({cartItemCount})</span>
            </button>

            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-yellow-400/40 bg-neutral-800 px-4 py-2 text-xs font-bold text-yellow-400 hover:bg-neutral-700 transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Body: Categories Directory First vs Selected Category Products */}
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8 flex-1">
        {!selectedCategorySlug && !searchQuery.trim() ? (
          /* ======================================================== */
          /* VIEW 1: CATEGORIES FIRST DIRECTORY PAGE                 */
          /* ======================================================== */
          <section className="space-y-8 animate-in fade-in duration-300">
            {/* Directory Header Banner */}
            <div className="rounded-3xl bg-white border border-neutral-200/90 p-8 sm:p-12 shadow-xs text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 border border-yellow-300/60 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-900 mb-4 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-700" />
                  <span>Marketplace Departments</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight">
                  Shop by <span className="text-amber-700">Category</span>
                </h1>
                <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Select a department below to explore fresh farm harvests, daily groceries, authentic merchandise, digital publications, and certified on-demand services.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setSelectedCategorySlug("all")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    <LayoutGrid className="w-4 h-4 text-yellow-400" />
                    <span>Browse All Products ({allProductsList.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 12 Categories Grid Cards */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {homeCategories.map((category) => {
                const IconComponent = categoryIconMap[category.iconName] || ShoppingCart;
                const theme = categoryThemeMap[category.id] || {
                  gradient: "from-amber-100 to-yellow-50",
                  text: "text-amber-700",
                  border: "border-amber-200",
                };

                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategorySlug(category.slug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedCategorySlug(category.slug);
                      }
                    }}
                    className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-6 text-left transition-all duration-300 hover:border-yellow-400 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer shadow-xs"
                  >
                    <div>
                      {/* Top Category Visual Header */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100 mb-5">
                        <img
                          src={category.highlightImage}
                          alt={category.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Top Icon Badge */}
                        <div
                          className={`absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 backdrop-blur-md border ${theme.border} ${theme.text} shadow-md`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>

                        {/* Item Count / Type Badge */}
                        <span className="absolute bottom-3 left-3 rounded-full bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-300 border border-yellow-400/30">
                          {category.type === "service" ? "Professional Services" : `${category.items.length} Products`}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base sm:text-lg font-black text-neutral-900 group-hover:text-amber-700 transition-colors tracking-tight line-clamp-1">
                        {category.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {category.tagline}
                      </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-800 group-hover:text-black inline-flex items-center gap-1.5">
                        <span>View {category.shortName}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-yellow-500" />
                      </span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Explore
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          /* ======================================================== */
          /* VIEW 2: SELECTED CATEGORY / SEARCH PRODUCTS VIEW         */
          /* ======================================================== */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Back to Categories Navigation Header */}
            <div className="rounded-2xl bg-white border border-neutral-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategorySlug(null);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-2 rounded-xl bg-neutral-100 hover:bg-yellow-400 hover:text-black text-neutral-800 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-xs shrink-0 group"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
                  <span>All Categories</span>
                </button>

                <div className="h-6 w-px bg-neutral-200 hidden sm:block" />

                <div>
                  <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
                    <span>
                      {activeCategoryObject
                        ? activeCategoryObject.name
                        : searchQuery
                        ? `Search results for "${searchQuery}"`
                        : "All Products"}
                    </span>
                    <span className="text-xs text-neutral-500 font-normal">
                      ({filteredProducts.length} items)
                    </span>
                  </h2>
                  {activeCategoryObject && (
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      {activeCategoryObject.tagline}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Category Switcher Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategorySlug("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    selectedCategorySlug === "all"
                      ? "bg-yellow-400 text-black font-black"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  All ({allProductsList.length})
                </button>
                {homeCategories.slice(0, 5).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      selectedCategorySlug === cat.slug
                        ? "bg-yellow-400 text-black font-black"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {cat.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* 2-Column Marketplace: Filters (Left) & Products (Right) */}
            <div className="flex gap-6 items-start">
          {/* Left Column: Refine & Filters Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-5 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-64 lg:p-0 lg:bg-transparent lg:shadow-none lg:overflow-visible lg:transform-none ${
              isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            {/* Mobile Header */}
            <div className="flex lg:hidden items-center justify-between pb-4 mb-4 border-b border-neutral-200">
              <span className="text-base font-bold text-neutral-900">Filters</span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 text-neutral-600 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Card 1: Refine by Category */}
            <div className="rounded border border-neutral-200 bg-white p-4 shadow-xs mb-4">
              <div
                className="flex items-center justify-between cursor-pointer pb-2"
                onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
              >
                <h3 className="text-sm font-bold text-neutral-900">Refine by Category</h3>
                {isCategoryExpanded ? <Minus className="w-3.5 h-3.5 text-neutral-500" /> : <Plus className="w-3.5 h-3.5 text-neutral-500" />}
              </div>

              {isCategoryExpanded && (
                <div className="mt-2 space-y-1 pt-2 border-t border-neutral-100 text-xs font-mono sm:font-sans">
                  <div
                    onClick={() => setSelectedCategorySlug("all")}
                    className={`cursor-pointer py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                      selectedCategorySlug === "all"
                        ? "text-[#0b79bf] font-bold bg-[#0b79bf]/10"
                        : "text-neutral-700 hover:text-[#0b79bf] hover:bg-neutral-50"
                    }`}
                  >
                    <span className="font-semibold text-xs">All Categories</span>
                    <span className="text-[11px] text-neutral-500 font-normal">({allProductsList.length})</span>
                  </div>

                  {(showAllCategories ? homeCategories : homeCategories.slice(0, 7)).map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategorySlug(cat.slug)}
                      className={`cursor-pointer py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                        selectedCategorySlug === cat.slug
                          ? "text-[#0b79bf] font-bold bg-[#0b79bf]/10"
                          : "text-neutral-700 hover:text-[#0b79bf] hover:bg-neutral-50"
                      }`}
                    >
                      <span className="line-clamp-1 text-xs">{cat.name}</span>
                      <span className="text-[11px] text-neutral-400">({cat.items.length})</span>
                    </div>
                  ))}

                  {homeCategories.length > 7 && (
                    <button
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className="text-xs font-bold text-[#0b79bf] hover:underline pt-2 px-2 block"
                    >
                      {showAllCategories ? "See Less" : "See More"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Card 2: Filters */}
            <div className="rounded border border-neutral-200 bg-white p-4 shadow-xs space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <span className="text-sm font-bold text-neutral-900">Filters</span>
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-[#0b79bf] hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Seller / Store Filter */}
              <div>
                <div
                  className="flex items-center justify-between cursor-pointer py-1"
                  onClick={() => setIsSellerExpanded(!isSellerExpanded)}
                >
                  <span className="text-xs font-bold text-neutral-900">Seller</span>
                  {isSellerExpanded ? <Minus className="w-3.5 h-3.5 text-neutral-500" /> : <Plus className="w-3.5 h-3.5 text-neutral-500" />}
                </div>

                {isSellerExpanded && (
                  <div className="mt-2 space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-neutral-700">
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        className="rounded border-neutral-300 text-yellow-500 focus:ring-yellow-400"
                      />
                      <span>Uburu Official Store</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Price Filter with Histogram Visualizer */}
              <div className="border-t border-neutral-100 pt-4">
                <div
                  className="flex items-center justify-between cursor-pointer py-1"
                  onClick={() => setIsPriceExpanded(!isPriceExpanded)}
                >
                  <span className="text-xs font-bold text-neutral-900">Price (KES)</span>
                  {isPriceExpanded ? <Minus className="w-3.5 h-3.5 text-neutral-500" /> : <Plus className="w-3.5 h-3.5 text-neutral-500" />}
                </div>

                {isPriceExpanded && (
                  <div className="mt-3">
                    {/* Warm Histogram Bar Simulation */}
                    <div className="flex items-end gap-1 h-14 w-full px-1 mb-3 bg-neutral-50/80 rounded-lg border border-neutral-100 pt-2">
                      <div className="flex-1 bg-amber-200 h-[30%] rounded-t-xs" />
                      <div className="flex-1 bg-amber-300 h-[85%] rounded-t-xs" />
                      <div className="flex-1 bg-yellow-400 h-[100%] rounded-t-xs" />
                      <div className="flex-1 bg-amber-400 h-[60%] rounded-t-xs" />
                      <div className="flex-1 bg-amber-300 h-[40%] rounded-t-xs" />
                      <div className="flex-1 bg-amber-200 h-[20%] rounded-t-xs" />
                      <div className="flex-1 bg-amber-100 h-[15%] rounded-t-xs" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">Min.</span>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          placeholder="Min"
                          className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs text-neutral-800 focus:border-yellow-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">Max.</span>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          placeholder="Max"
                          className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs text-neutral-800 focus:border-yellow-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right Column: Products & Results Area */}
          <section className="flex-1 min-w-0">
            {/* Top Results Bar */}
            <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-xs mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Store identity / Results count */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-yellow-400 shadow-xs">
                    <img src={uburuLogo} alt="Uburu" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block">
                      {activeCategoryObject ? activeCategoryObject.name : "Uburu Marketplace"}
                    </span>
                  </div>
                </div>

                <span className="text-xs text-neutral-500 font-medium">
                  {filteredProducts.length} results
                </span>
              </div>

              {/* Right sorting & view controls */}
              <div className="flex items-center gap-4 text-xs">
                {/* Open in new tab toggle */}
                <label className="hidden md:flex items-center gap-2 cursor-pointer select-none text-neutral-600">
                  <span>Open in new tab</span>
                  <input
                    type="checkbox"
                    checked={openInNewTab}
                    onChange={(e) => setOpenInNewTab(e.target.checked)}
                    className="rounded-full h-4 w-7 text-yellow-500 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500 font-medium">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none rounded-lg border border-neutral-300 bg-white pl-2.5 pr-7 py-1.5 text-xs font-bold text-neutral-800 focus:border-yellow-400 focus:outline-none cursor-pointer"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="discount">Highest Discount</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* View Mode Toggle Icons */}
                <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 ${viewMode === "grid" ? "bg-yellow-400 text-black font-bold" : "bg-white text-neutral-500 hover:text-black"}`}
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 ${viewMode === "list" ? "bg-yellow-400 text-black font-bold" : "bg-white text-neutral-500 hover:text-black"}`}
                    aria-label="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid / List */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);
                  const isService = product.type === "service" || product.categorySlug === "uburu-services";

                  if (viewMode === "list") {
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleProductCardClick(product)}
                        className="group flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs transition-all hover:border-yellow-400 hover:shadow-md cursor-pointer gap-5"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-50 flex items-center justify-center p-2">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-contain transition-transform group-hover:scale-105"
                            />
                            {product.discountPercent && (
                              <span className="absolute left-1 top-1 rounded bg-yellow-400 px-1.5 py-0.5 text-[9px] font-black text-black">
                                {product.discountPercent}% OFF
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-amber-700 hover:underline">
                              {product.brand || "Uburu Home"}
                            </span>
                            <h4 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-amber-700">
                              {product.name}
                            </h4>
                            <p className="text-xs text-neutral-500 line-clamp-1 mt-1">
                              {product.description}
                            </p>
                            {product.rating && (
                              <div className="flex items-center gap-1 text-xs text-amber-500 mt-1.5 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span>{product.rating.toFixed(1)}</span>
                                <span className="text-neutral-400 font-normal">({product.reviewCount || 40})</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-48 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 gap-2">
                          <div className="text-left sm:text-right">
                            <span className="text-base font-black text-neutral-900 block">
                              KES {product.price.toLocaleString("en-KE")}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-neutral-400 line-through">
                                KES {product.originalPrice.toLocaleString("en-KE")}
                              </span>
                            )}
                          </div>

                          <Button
                            onClick={(e) => handleAddToCartClick(product, e)}
                            className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl shadow-xs"
                          >
                            {isService ? "Request Service" : product.hasColorOptions ? "Shop Options" : "+ Add to Tray"}
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  // Takealot Grid Product Card with Uburu Site Theme
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleProductCardClick(product)}
                      className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-3.5 shadow-xs transition-all duration-200 hover:border-yellow-400 hover:shadow-lg cursor-pointer"
                    >
                      <div>
                        {/* Card Top: Badges & Wishlist Heart */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50 flex items-center justify-center p-2 mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Top Left Discount / Sale Ribbon */}
                          {product.badge === "SALE" && (
                            <div className="absolute top-2 left-2 rounded-md bg-yellow-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-xs">
                              SALE
                            </div>
                          )}
                          {product.discountPercent && product.badge !== "SALE" && (
                            <div className="absolute top-2 left-2 rounded-md bg-yellow-400 px-1.5 py-0.5 text-[10px] font-black text-black shadow-xs">
                              {product.discountPercent}% OFF
                            </div>
                          )}

                          {/* Photo Count Pill */}
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            <Camera className="w-3 h-3" />
                            <span>{product.imageCount || 1}</span>
                          </div>

                          {/* Wishlist Heart Icon */}
                          <button
                            type="button"
                            onClick={(e) => toggleWishlist(product.id, e)}
                            aria-label="Add to wishlist"
                            className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Heart
                              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                                isWishlisted ? "fill-red-500 text-red-500" : "text-neutral-400"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Product Details */}
                        <div>
                          {/* Title */}
                          <h4 className="text-xs font-bold text-neutral-900 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-amber-700 transition-colors">
                            {product.name}
                          </h4>

                          {/* Brand */}
                          <span className="text-[11px] font-semibold text-amber-700 hover:underline block mt-0.5">
                            {product.brand || "Uburu Home"}
                          </span>

                          {/* Price Row */}
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-base font-black text-neutral-900">
                              KES {product.price.toLocaleString("en-KE")}
                            </span>
                            {product.originalPrice && (
                              <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                                <span className="line-through">KES {product.originalPrice.toLocaleString("en-KE")}</span>
                                <Info className="w-3 h-3 text-neutral-400" />
                              </div>
                            )}
                          </div>

                          {/* Stock Location Pill */}
                          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-neutral-600">
                            <span className="text-neutral-500 font-medium">In stock</span>
                            <span className="rounded bg-neutral-100 px-1.5 py-0.2 text-[10px] font-bold text-neutral-700">
                              {product.stockLocation || "NBO"}
                            </span>
                          </div>

                          {/* Swatch indicator / Service tag */}
                          {product.hasColorOptions ? (
                            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-neutral-600">
                              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-yellow-500" />
                              <span>More Colours</span>
                            </div>
                          ) : isService ? (
                            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-amber-700">
                              <Wrench className="w-3 h-3" />
                              <span>Certified Service</span>
                            </div>
                          ) : null}

                          {/* Ratings */}
                          {product.rating && (
                            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-neutral-700 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{product.rating.toFixed(1)}</span>
                              <span className="text-neutral-400 font-normal">({product.reviewCount || 48})</span>
                              <ChevronDown className="w-3 h-3 text-neutral-400 ml-0.5" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Bottom Action Button */}
                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        {product.hasColorOptions ? (
                          <button
                            type="button"
                            onClick={(e) => handleAddToCartClick(product, e)}
                            className="w-full rounded-xl border-2 border-yellow-400 py-2 text-xs font-black uppercase tracking-wider text-black hover:bg-yellow-400 transition-colors"
                          >
                            Shop Options
                          </button>
                        ) : isService ? (
                          <button
                            type="button"
                            onClick={(e) => handleAddToCartClick(product, e)}
                            className="w-full rounded-xl bg-neutral-900 text-yellow-400 hover:bg-neutral-800 py-2 text-xs font-black uppercase tracking-wider transition-colors"
                          >
                            Request Quote
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleAddToCartClick(product, e)}
                            className="w-full rounded-xl bg-yellow-400 hover:bg-yellow-300 py-2 text-xs font-black uppercase tracking-wider text-black transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <span>+</span>
                            <span>Add to Tray</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
                <Search className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-neutral-800">No matching products found</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search terms, changing the department, or resetting the price filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-yellow-300 transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    )}
  </main>

      {/* 3. Configurable Options Modal */}
      {selectedOptionsProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <button
              onClick={() => setSelectedOptionsProduct(null)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 items-start pb-4 border-b border-neutral-200">
              <div className="h-20 w-20 shrink-0 rounded-xl bg-neutral-50 p-2 border border-neutral-200 flex items-center justify-center">
                <img
                  src={selectedOptionsProduct.image}
                  alt={selectedOptionsProduct.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-700">
                  {selectedOptionsProduct.brand || "Uburu Apparel"}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                  {selectedOptionsProduct.name}
                </h3>
                <span className="text-base font-black text-neutral-900 block mt-1">
                  KES {selectedOptionsProduct.price.toLocaleString("en-KE")}
                </span>
              </div>
            </div>

            {/* Options Selection */}
            <div className="mt-4 space-y-4">
              {/* Color Select */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                  Select Color:
                </label>
                <div className="flex flex-wrap gap-2">
                  {homeApparelColorOptions.map((color) => {
                    const isSelected =
                      (itemOptions[selectedOptionsProduct.id]?.color ?? defaultHomeItemOption.color) === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateProductOption(selectedOptionsProduct.id, "color", color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? "border-yellow-400 bg-yellow-400 text-black shadow-xs font-black"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Branding Option */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                  Branding:
                </label>
                <div className="flex flex-wrap gap-2">
                  {homeLogoOptions.map((logo) => {
                    const isSelected =
                      (itemOptions[selectedOptionsProduct.id]?.logo ?? defaultHomeItemOption.logo) === logo;
                    return (
                      <button
                        key={logo}
                        type="button"
                        onClick={() => updateProductOption(selectedOptionsProduct.id, "logo", logo)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? "border-yellow-400 bg-yellow-400 text-black shadow-xs font-black"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {logo}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="pt-2">
                <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-neutral-300 overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          selectedOptionsProduct.id,
                          (quantities[selectedOptionsProduct.id] ?? 1) - 1
                        )
                      }
                      className="px-3 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-black text-neutral-900">
                      {quantities[selectedOptionsProduct.id] ?? 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          selectedOptionsProduct.id,
                          (quantities[selectedOptionsProduct.id] ?? 1) + 1
                        )
                      }
                      className="px-3 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedOptionsProduct(null)}
                className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-black"
              >
                Cancel
              </button>
              <Button
                onClick={() => {
                  addToCart(selectedOptionsProduct.id);
                  setSelectedOptionsProduct(null);
                  window.dispatchEvent(new CustomEvent("uburu:open-cart"));
                }}
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-md"
              >
                Add to Tray
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Digital Ebook Modal */}
      {isEbookModalOpen && activeEbookItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsEbookModalOpen(false)}
              className="absolute right-4 top-4 text-neutral-500 hover:text-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-800">
                Digital Empowerment Library
              </span>
              <h3 className="text-xl font-black text-neutral-900 mt-1">
                {activeEbookItem.name}
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {activeEbookItem.folderItems?.map((book) => (
                <div
                  key={book.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[3/4] overflow-hidden rounded-xl bg-neutral-50 mb-3">
                      <img
                        src={book.image}
                        alt={book.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900 leading-snug">
                      {book.name}
                    </h4>
                    <span className="text-xs font-black text-amber-800 block mt-1">
                      KES {book.price.toLocaleString("en-KE")}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      addToCart(book.id);
                      setIsEbookModalOpen(false);
                      window.dispatchEvent(new CustomEvent("uburu:open-cart"));
                    }}
                    className="mt-4 w-full bg-yellow-400 hover:bg-yellow-300 text-black py-2.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-xs"
                  >
                    + Add to Tray
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Service Inquiry Modal */}
      <ServiceInquiryModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
};
