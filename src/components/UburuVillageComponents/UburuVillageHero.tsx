import { ChevronRight, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../../assets/hero.webp";
import villageLogo from "../../assets/villagelogo.webp";

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.05.82.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V9.05a8.16 8.16 0 0 0 4.91 1.64V7.24a4.85 4.85 0 0 1-1-.55z"/>
  </svg>
);

const UburuVillageHero = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Uburu Village", href: "/get/village" },
  ];

  return (
    <section
      role="banner"
      aria-label="Uburu Village"
      className="relative min-h-[360px] flex items-center bg-cover bg-no-repeat bg-[center_30%] py-12"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#1c3b57]/85 via-[#2f6f99]/75 to-[#1c3b57]/90" />

      <div className="relative z-10 text-white container mx-auto px-6 max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center text-sm">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={crumb.href} className="flex items-center">
                  {!isLast ? (
                    <>
                      <Link
                        to={crumb.href}
                        className="text-white/90 hover:text-[#f2c15d] transition-colors"
                      >
                        {crumb.label}
                      </Link>
                      <ChevronRight className="mx-2 w-4 h-4 text-[#f2c15d]/80" />
                    </>
                  ) : (
                    <span aria-current="page" className="text-white/70">
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="inline-flex items-center gap-3 rounded-full border border-[#f2c15d]/70 bg-[#1b3b58]/70 px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)] mb-4">
          <div className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-[#f2c15d]">
            <img src={villageLogo} alt="Uburu Village logo" className="h-full w-full object-cover" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#f2c15d]">
              Uburu
            </p>
            <p className="text-sm font-bold text-white">Village</p>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-3 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          Uburu Village
        </h1>
        <p className="text-lg text-white/90 max-w-2xl leading-relaxed mb-6">
          A space for recreational events Outdoor & Community bonding Healing & Social Recreation
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.instagram.com/uburu_village?igsh=MWd6NzBqbzJsdTJ0eg=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-95 hover:scale-[1.02] transition-all shadow-lg border border-white/20"
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram (@uburu_village)</span>
          </a>

          <a
            href="https://vm.tiktok.com/ZS9rh1pN7BRSq-pXrcz/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-900 hover:scale-[1.02] transition-all shadow-lg border border-white/20"
          >
            <TikTokIcon className="w-4 h-4" />
            <span>TikTok</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default UburuVillageHero;
