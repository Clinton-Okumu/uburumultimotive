import React from "react";
import { Link } from "react-router-dom";
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
  ArrowUpRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
} from "lucide-react";
import { homeCategories } from "../../data/homeCategories";

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

export const CategoryGridSection: React.FC = () => {
  return (
    <section id="category-grid" className="relative bg-neutral-900/60 py-20 px-4 sm:px-6 text-white">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 right-10 h-72 w-72 rounded-full bg-yellow-500/10 blur-[130px]" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-red-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300 mb-3">
            <span>12 Complete Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Explore All <span className="text-yellow-400">Marketplace</span> Categories
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-white/70 leading-relaxed">
            Click on any category to view full product selections, prices in KES, value bundles, and request specialized services.
          </p>
        </div>

        {/* 12 Category Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {homeCategories.map((category) => {
            const IconComponent = iconMap[category.iconName] || ShoppingCart;

            return (
              <Link
                key={category.id}
                to={`/get/home/category/${category.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 p-6 transition-all duration-300 hover:border-yellow-400/80 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(250,204,21,0.12)]"
              >
                <div>
                  {/* Category Image Header */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-900 mb-5">
                    <img
                      src={category.highlightImage}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Top Icon Badge */}
                    <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/80 backdrop-blur-md border border-yellow-400/30 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                      <IconComponent className="h-5 w-5" />
                    </div>

                    {/* Department Type / Count Badge */}
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-300 border border-yellow-400/20">
                      {category.type === "service" ? "Professional Services" : `${category.items.length} Products`}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-black text-white group-hover:text-yellow-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-white/65 line-clamp-2 leading-relaxed">
                    {category.tagline}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-yellow-400 group-hover:underline inline-flex items-center gap-1.5">
                    Shop {category.shortName}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <span className="text-[10px] font-bold text-white/40 group-hover:text-white transition-colors uppercase tracking-wider">
                    View Catalog
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Value Proposition Highlights */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3 pt-12 border-t border-white/10">
          <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">100% Impact Driven</h4>
              <p className="mt-1 text-xs text-white/60 leading-relaxed">
                Proceeds directly sustain emergency homeless shelter, nutrition, therapy, and reintegration programs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Reliable Local Delivery</h4>
              <p className="mt-1 text-xs text-white/60 leading-relaxed">
                Fast doorstep fulfillment across Nairobi and surrounding regions with transparent shipping options.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Verified Quality & Artisans</h4>
              <p className="mt-1 text-xs text-white/60 leading-relaxed">
                All food staples, produce, apparel, and skilled technicians meet high community safety and quality standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
