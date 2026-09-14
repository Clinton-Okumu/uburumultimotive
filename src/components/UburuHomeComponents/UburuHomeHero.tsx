import { ChevronRight, Instagram, ArrowDown, LayoutGrid, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../../assets/hero.webp";
import uburuLogo from "../../assets/homelogo.webp";
import Button from "../shared/Button";

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

const UburuHomeHero = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Uburu Home", href: "/get/home" },
  ];

  const scrollToSection = (sectionId: string) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      role="banner"
      aria-label="Uburu Home"
      className="relative min-h-[500px] flex items-center bg-cover bg-no-repeat bg-[center_25%] py-20 overflow-hidden"
      style={{ backgroundImage: `url(${hero})` }}
    >
      {/* Dynamic multi-layer gradient with radiant warm lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-neutral-950/70 to-neutral-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.18),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.12),transparent_45%)] pointer-events-none" />

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-10 left-1/3 h-64 w-64 rounded-full bg-yellow-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-amber-500/15 blur-[130px] pointer-events-none" />

      <div className="relative z-10 text-white container mx-auto px-6 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center text-xs font-semibold">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={crumb.href} className="flex items-center">
                  {!isLast ? (
                    <>
                      <Link
                        to={crumb.href}
                        className="text-white/70 hover:text-yellow-400 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                      <ChevronRight className="mx-2 w-3.5 h-3.5 text-yellow-400/70" />
                    </>
                  ) : (
                    <span aria-current="page" className="text-yellow-300 font-bold">
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Brand Badge & Tag */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-yellow-400/40 bg-neutral-900/80 backdrop-blur-md px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-yellow-400 shadow-md">
              <img src={uburuLogo} alt="Uburu Home logo" className="h-full w-full object-cover" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">
                Uburu
              </p>
              <p className="text-sm font-bold text-yellow-300">Feel at Home</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Many Solutions. One Destination.</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-5 text-white tracking-tight leading-[1.1]">
          Welcome to <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Uburu Home</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed mb-8 font-normal">
          Explore our complete marketplace of everyday essentials, farm-fresh produce, wholesome foods, apparel, home care, and vetted skilled services—empowering families and supporting community impact.
        </p>

        {/* Marketplace Action CTAs */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Button
            onClick={() => scrollToSection("categories-rail")}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-3.5 text-xs font-black uppercase tracking-[0.25em] rounded-2xl shadow-[0_10px_30px_rgba(250,204,21,0.35)] hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(250,204,21,0.45)] transition-all flex items-center gap-2.5"
          >
            <LayoutGrid className="w-4 h-4" />
            Browse 12 Departments
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
          <a
            href="https://www.instagram.com/uburu_home?igsh=MWRxazlyemhidWJwaQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-amber-500 text-white/90 hover:text-white px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider hover:scale-[1.02] transition-all shadow-md border border-white/15 backdrop-blur-md"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram (@uburu_home)</span>
          </a>

          <a
            href="https://vm.tiktok.com/ZS9rhJNM6R8dG-pQ0fn/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-black text-white/90 hover:text-white px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider hover:scale-[1.02] transition-all shadow-md border border-white/15 backdrop-blur-md"
          >
            <TikTokIcon className="w-3.5 h-3.5" />
            <span>TikTok</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default UburuHomeHero;
