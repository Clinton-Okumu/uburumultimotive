import React from "react";
import { useNavigate } from "react-router-dom";
import {
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
  ArrowRight,
} from "lucide-react";
import { homeCategories, type HomeCategory } from "../../data/homeCategories";

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

// Vibrant gradient themes for each category icon container
const categoryThemeMap: Record<string, { gradient: string; text: string; glow: string; border: string }> = {
  "uburu-smart-shopper": {
    gradient: "from-amber-100 to-yellow-50",
    text: "text-amber-700",
    glow: "group-hover:shadow-[0_10px_25px_rgba(245,158,11,0.18)]",
    border: "border-amber-200",
  },
  "uburu-veggies": {
    gradient: "from-emerald-100 to-green-50",
    text: "text-emerald-700",
    glow: "group-hover:shadow-[0_10px_25px_rgba(16,185,129,0.18)]",
    border: "border-emerald-200",
  },
  "uburu-food": {
    gradient: "from-orange-100 to-amber-50",
    text: "text-orange-700",
    glow: "group-hover:shadow-[0_10px_25px_rgba(249,115,22,0.18)]",
    border: "border-orange-200",
  },
  "uburu-office": {
    gradient: "from-blue-100 to-cyan-50",
    text: "text-blue-700",
    glow: "group-hover:shadow-[0_10px_25px_rgba(59,130,246,0.18)]",
    border: "border-blue-200",
  },
  "uburu-beauty": {
    gradient: "from-rose-100 to-pink-50",
    text: "text-rose-700",
    glow: "group-hover:shadow-[0_10px_25px_rgba(244,63,94,0.18)]",
    border: "border-rose-200",
  },
  "uburu-kids": {
    gradient: "from-amber-100 to-yellow-50",
    text: "text-amber-800",
    glow: "group-hover:shadow-[0_10px_25px_rgba(245,158,11,0.18)]",
    border: "border-amber-200",
  },
  "uburu-household": {
    gradient: "from-teal-100 to-emerald-50",
    text: "text-teal-700",
    glow: "group-hover:shadow-[0_10px_25px_rgba(20,184,166,0.18)]",
    border: "border-teal-200",
  },
  "uburu-services": {
    gradient: "from-red-100 to-amber-50",
    text: "text-red-700",
    glow: "group-hover:shadow-[0_10px_25px_rgba(239,68,68,0.18)]",
    border: "border-red-200",
  },
  "uburu-souvenirs": {
    gradient: "from-purple-100 to-pink-50",
    text: "text-purple-700",
    glow: "group-hover:shadow-[0_10px_25px_rgba(168,85,247,0.18)]",
    border: "border-purple-200",
  },
  "uburu-medical": {
    gradient: "from-red-100 to-rose-50",
    text: "text-red-700",
    glow: "group-hover:shadow-[0_10px_25px_rgba(239,68,68,0.18)]",
    border: "border-red-200",
  },
  "uburu-clothing": {
    gradient: "from-yellow-100 to-amber-50",
    text: "text-amber-800",
    glow: "group-hover:shadow-[0_10px_25px_rgba(245,158,11,0.18)]",
    border: "border-yellow-300",
  },
  "uburu-construction": {
    gradient: "from-stone-200 to-amber-100",
    text: "text-stone-800",
    glow: "group-hover:shadow-[0_10px_25px_rgba(120,113,108,0.18)]",
    border: "border-stone-300",
  },
};

interface CategoryRailProps {
  activeCategorySlug?: string;
}

export const CategoryRail: React.FC<CategoryRailProps> = ({
  activeCategorySlug,
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: HomeCategory) => {
    navigate(`/get/home/category/${category.slug}`);
  };

  return (
    <section id="categories-rail" className="relative bg-white py-20 px-4 sm:px-6 border-b border-neutral-200">
      {/* Ambient background lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-yellow-400/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-amber-400/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-amber-900 mb-3 shadow-sm backdrop-blur-md">
            <span>Marketplace Directory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight">
            Explore All <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">12 Categories</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium text-neutral-600 leading-relaxed max-w-xl mx-auto">
            Choose a category below to browse curated goods, value hampers, local harvest produce, and skilled on-demand services.
          </p>
        </div>

        {/* 4x3 Grid Layout (4 columns x 3 rows = 12 visible categories) */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {homeCategories.map((category) => {
            const IconComponent = iconMap[category.iconName] || ShoppingCart;
            const theme = categoryThemeMap[category.id] || {
              gradient: "from-amber-100 to-yellow-50",
              text: "text-amber-700",
              glow: "group-hover:shadow-[0_10px_25px_rgba(245,158,11,0.18)]",
              border: "border-amber-200",
            };
            const isActive = activeCategorySlug === category.slug;

            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCategoryClick(category);
                  }
                }}
                className={`group relative flex flex-col justify-between rounded-3xl border p-6 text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive
                    ? "border-yellow-500 bg-amber-50/40 ring-2 ring-yellow-400/50 shadow-lg -translate-y-1"
                    : "border-neutral-200/90 bg-white hover:border-yellow-400 hover:shadow-xl hover:-translate-y-1.5 shadow-sm"
                }`}
              >
                {/* Subtle card top glow on hover */}
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-yellow-400/0 group-hover:bg-yellow-400/15 blur-2xl transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Top: Themed Icon Badge & Item Count */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} border ${theme.border} ${theme.text} ${theme.glow} transition-all duration-300 group-hover:scale-105 p-3 shadow-xs`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <span className="rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600 group-hover:border-yellow-400/40 group-hover:bg-yellow-50 group-hover:text-amber-900 transition-colors">
                      {category.type === "service" ? "Services" : `${category.items.length} items`}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="mt-5 text-lg font-black text-neutral-900 group-hover:text-amber-700 transition-colors tracking-tight line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-xs font-normal text-neutral-500 line-clamp-2 leading-relaxed">
                    {category.tagline}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-end">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 group-hover:bg-yellow-400 group-hover:text-black border border-neutral-200 group-hover:border-yellow-400 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-neutral-800 transition-all duration-300 shadow-xs">
                    <span>View</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
