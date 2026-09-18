import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
  Star,
  CheckCircle2,
  Wrench,
  Sparkles,
} from "lucide-react";
import Button from "../shared/Button";
import {
  homeCategories,
  type HomeCategory,
  type HomeCategoryItem,
} from "../../data/homeCategories";
import { homeProducts } from "../../data/storefrontCatalog";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import { ServiceInquiryModal } from "./ServiceInquiryModal";

interface CategoryShowcaseProps {
  selectedCategory?: HomeCategory;
  onCategoryChange?: (category: HomeCategory) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<HomeCategory>(
    selectedCategory || homeCategories[0]
  );
  const [selectedService, setSelectedService] = useState<HomeCategoryItem | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Connect to the shared Uburu Home cart
  const { quantities, cartItemCount, updateQuantity, addToCart } =
    useStorefrontCheckout({
      catalog: homeProducts.map(({ id, name, price }) => ({ id, name, price })),
      context: "uburu_home",
      purchaseType: "product_purchase",
      emptyCartMessage: "Please add at least one item to your tray.",
      storageKey: "uburu_home_cart",
    });

  // Sync if prop changes
  React.useEffect(() => {
    if (selectedCategory && selectedCategory.id !== activeCategory.id) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleTabChange = (category: HomeCategory) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const handleAddProduct = (item: HomeCategoryItem) => {
    addToCart(item.id);
  };

  const handleBuyNow = (item: HomeCategoryItem) => {
    addToCart(item.id);
    navigate("/checkout?source=home");
  };

  const handleOpenService = (service: HomeCategoryItem) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  return (
    <section id="category-showcase" className="relative bg-neutral-900/90 py-20 px-4 sm:px-6 text-white border-t border-neutral-800">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-0 h-64 w-64 rounded-full bg-yellow-500/10 blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-amber-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shop By Category</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {activeCategory.name}
            </h2>
            <p className="mt-2 text-sm sm:text-base font-semibold text-white/70 max-w-2xl">
              {activeCategory.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/get/home/category/${activeCategory.slug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/50 bg-yellow-400/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-yellow-300 hover:bg-yellow-400 hover:text-black transition-all shadow-md"
            >
              <span>Explore All {activeCategory.shortName}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Button
              onClick={() => navigate("/checkout?source=home")}
              className="bg-yellow-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-yellow-300"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Tray ({cartItemCount})
              </span>
            </Button>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-3 no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {homeCategories.map((cat) => {
            const isSelected = activeCategory.id === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                  isSelected
                    ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20 ring-2 ring-yellow-400/40"
                    : "bg-black/60 text-white/70 hover:bg-neutral-800 hover:text-white border border-white/10"
                }`}
              >
                {cat.shortName}
              </button>
            );
          })}
        </div>

        {/* Product / Service Cards Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activeCategory.type === "product" ? (
            /* Product Cards */
            activeCategory.items.map((item) => {
              const qty = quantities[item.id] ?? 1;

              return (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-950 p-5 shadow-lg transition-all duration-300 hover:border-yellow-400/60 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-900">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {item.tag && (
                        <span className="absolute left-3 top-3 rounded-full bg-black/80 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-300 border border-yellow-400/30">
                          {item.tag}
                        </span>
                      )}
                      {item.badge && (
                        <span className="absolute right-3 top-3 rounded-full bg-red-600/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                          {item.badge}
                        </span>
                      )}
                      {item.unit && (
                        <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white/80 bg-black/60 px-2 py-0.5 rounded">
                          {item.unit}
                        </span>
                      )}
                    </div>

                    {/* Title & Price */}
                    <div className="mt-4">
                      {item.rating && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-yellow-400 mb-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400" />
                          <span>{item.rating.toFixed(1)}</span>
                          <span className="text-white/40 font-normal">/ 5.0</span>
                        </div>
                      )}
                      <h3 className="text-base font-black text-white group-hover:text-yellow-300 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-white/60 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.08]">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                        Price
                      </span>
                      <span className="text-lg font-black text-yellow-400">
                        KES {item.price.toLocaleString("en-KE")}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 mb-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, qty - 1)}
                        className="h-7 w-7 rounded-lg bg-black text-sm font-bold text-yellow-300 hover:bg-neutral-800 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-white">
                        Qty: {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, qty + 1)}
                        className="h-7 w-7 rounded-lg bg-black text-sm font-bold text-yellow-300 hover:bg-neutral-800 transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleAddProduct(item)}
                        className="bg-neutral-800 hover:bg-neutral-700 text-yellow-300 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl border border-yellow-400/30"
                      >
                        Add to tray
                      </Button>
                      <Button
                        onClick={() => handleBuyNow(item)}
                        className="bg-red-600 hover:bg-red-500 text-white py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Service Cards (Uburu Services) */
            activeCategory.items.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-lg transition-all duration-300 hover:border-yellow-400 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                      <Wrench className="h-6 w-6" />
                    </div>
                    {service.badge && (
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-300">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-lg font-black text-white group-hover:text-yellow-300 transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-xs text-white/70 leading-relaxed">
                    {service.description}
                  </p>

                  {service.features && (
                    <div className="mt-4 space-y-1.5 rounded-2xl bg-white/[0.02] border border-white/5 p-3">
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-white/80 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                        Estimated Base
                      </span>
                      <span className="text-xs text-white/60">
                        {service.unit}
                      </span>
                    </div>
                    <span className="text-lg font-black text-yellow-400">
                      KES {service.price.toLocaleString("en-KE")}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleOpenService(service)}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg"
                  >
                    Request Service
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Banner linking to full store */}
        <div className="mt-12 rounded-3xl border border-yellow-400/30 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg sm:text-xl font-black text-white">
              Looking for something specific in {activeCategory.name}?
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-white/70">
              Browse our complete catalog with search, price filters, and instant checkout.
            </p>
          </div>
          <Link
            to={`/get/home/category/${activeCategory.slug}`}
            className="shrink-0 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all shadow-lg inline-flex items-center gap-2"
          >
            <span>Open Category</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Service Inquiry Modal */}
      <ServiceInquiryModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
      />
    </section>
  );
};
