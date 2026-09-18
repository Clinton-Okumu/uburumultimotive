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
    gradient: "from-amber-500/25 to-yellow-500/10",
    text: "text-yellow-400",
    glow: "group-hover:shadow-[0_0_25px_rgba(250,204,21,0.25)]",
    border: "border-yellow-500/30",
  },
  "uburu-veggies": {
    gradient: "from-emerald-500/25 to-green-500/10",
    text: "text-emerald-400",
    glow: "group-hover:shadow-[0_0_25px_rgba(52,211,153,0.25)]",
    border: "border-emerald-500/30",
  },
  "uburu-food": {
    gradient: "from-orange-500/25 to-amber-500/10",
    text: "text-amber-400",
    glow: "group-hover:shadow-[0_0_25px_rgba(251,146,60,0.25)]",
    border: "border-orange-500/30",
  },
  "uburu-office": {
    gradient: "from-blue-500/25 to-cyan-500/10",
    text: "text-cyan-400",
    glow: "group-hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]",
    border: "border-blue-500/30",
  },
  "uburu-beauty": {
    gradient: "from-rose-500/25 to-pink-500/10",
    text: "text-rose-400",
    glow: "group-hover:shadow-[0_0_25px_rgba(251,113,133,0.25)]",
    border: "border-rose-500/30",
  },
  "uburu-kids": {
    gradient: "from-amber-400/25 to-yellow-300/10",
    text: "text-yellow-300",
    glow: "group-hover:shadow-[0_0_25px_rgba(253,224,71,0.25)]",
    border: "border-yellow-400/30",
  },
  "uburu-household": {
    gradient: "from-teal-500/25 to-emerald-500/10",
    text: "text-teal-400",
    glow: "group-hover:shadow-[0_0_25px_rgba(45,212,191,0.25)]",
    border: "border-teal-500/30",
  },
  "uburu-services": {
    gradient: "from-red-500/25 to-amber-500/10",
    text: "text-amber-400",
    glow: "group-hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]",
    border: "border-red-500/30",
  },
  "uburu-souvenirs": {
    gradient: "from-purple-500/25 to-pink-500/10",
    text: "text-purple-400",
    glow: "group-hover:shadow-[0_0_25px_rgba(192,132,252,0.25)]",
    border: "border-purple-500/30",
  },
  "uburu-medical": {
    gradient: "from-red-500/25 to-rose-400/10",
    text: "text-red-400",
    glow: "group-hover:shadow-[0_0_25px_rgba(248,113,113,0.25)]",
    border: "border-red-500/30",
  },
  "uburu-clothing": {
    gradient: "from-yellow-500/25 to-amber-400/10",
    text: "text-yellow-400",
    glow: "group-hover:shadow-[0_0_25px_rgba(250,204,21,0.25)]",
    border: "border-yellow-500/30",
  },
  "uburu-construction": {
    gradient: "from-stone-500/25 to-amber-600/10",
    text: "text-amber-300",
    glow: "group-hover:shadow-[0_0_25px_rgba(217,119,6,0.25)]",
    border: "border-amber-600/30",
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
    <section id="categories-rail" className="relative bg-neutral-950 py-20 px-4 sm:px-6 border-b border-white/[0.08]">
      {/* Ambient background lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-yellow-500/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300 mb-3 shadow-sm backdrop-blur-md">
            <span>Marketplace Directory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Explore All <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">12 Categories</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium text-neutral-400 leading-relaxed max-w-xl mx-auto">
            Choose a category below to browse curated goods, value hampers, local harvest produce, and skilled on-demand services.
          </p>
        </div>

        {/* 4x3 Grid Layout (4 columns x 3 rows = 12 visible categories) */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {homeCategories.map((category) => {
            const IconComponent = iconMap[category.iconName] || ShoppingCart;
            const theme = categoryThemeMap[category.id] || {
              gradient: "from-yellow-500/25 to-amber-500/10",
              text: "text-yellow-400",
              glow: "group-hover:shadow-[0_0_25px_rgba(250,204,21,0.25)]",
              border: "border-yellow-500/30",
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
                className={`group relative flex flex-col justify-between rounded-3xl border p-6 text-left transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl ${
                  isActive
                    ? "border-yellow-400 bg-neutral-900/90 ring-2 ring-yellow-400/40 shadow-[0_15px_35px_rgba(250,204,21,0.2)] -translate-y-1"
                    : "border-white/[0.08] bg-neutral-900/60 hover:border-yellow-400/60 hover:bg-neutral-900/90 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                }`}
              >
                {/* Subtle card top glow on hover */}
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-yellow-500/0 group-hover:bg-yellow-500/15 blur-2xl transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Top: Themed Icon Badge & Item Count */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} border ${theme.border} ${theme.text} ${theme.glow} transition-all duration-300 group-hover:scale-105 p-3`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <span className="rounded-full bg-white/[0.05] border border-white/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-300 group-hover:border-yellow-400/30 group-hover:text-yellow-300 transition-colors">
                      {category.type === "service" ? "Services" : `${category.items.length} items`}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="mt-5 text-lg font-black text-white group-hover:text-yellow-300 transition-colors tracking-tight line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-xs font-normal text-neutral-400 line-clamp-2 leading-relaxed">
                    {category.tagline}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-end">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] group-hover:bg-yellow-400 group-hover:text-black border border-white/[0.08] group-hover:border-yellow-400 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-yellow-300 transition-all duration-300 shadow-sm">
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
