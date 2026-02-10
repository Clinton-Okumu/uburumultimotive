import { ArrowUpRight } from "lucide-react";
import pic8 from "../../assets/pic8.webp";
import pic9 from "../../assets/pic9.webp";
import pic11 from "../../assets/pic11.webp";

const categories = [
  {
    name: "Shelter Essentials",
    description: "Warm bedding, blankets, and hygiene basics.",
    image: pic8,
  },
  {
    name: "Community Pantry",
    description: "Food kits and dry goods for families in need.",
    image: pic9,
  },
  {
    name: "Handcrafted Care",
    description: "Locally made goods that tell real stories.",
    image: pic11,
  },
];

const CategoryHighlights = () => {
  return (
    <section className="bg-neutral-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
              Shop by need
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Focus on what matters most.
            </h2>
            <p className="mt-3 max-w-xl text-base font-semibold text-white/70">
              Every category directly fuels shelter operations and long-term support programs.
            </p>
          </div>
          <div className="text-sm font-bold text-white/70">New drops monthly</div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black">{category.name}</h3>
                <p className="mt-2 text-sm font-semibold text-white/70">
                  {category.description}
                </p>
                <button className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
                  Explore
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryHighlights;
