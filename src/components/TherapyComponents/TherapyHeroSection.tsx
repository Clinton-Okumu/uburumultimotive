import { ChevronRight, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../../assets/hero.webp";

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

const TherapyHeroSection = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Uburu Therapy", href: "/get/therapy" },
  ];

  return (
    <section
      role="banner"
      aria-label="Uburu Therapy"
      className="relative min-h-[360px] flex items-center bg-cover bg-no-repeat bg-[center_30%] py-12"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

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
                        className="text-white/90 hover:text-white transition-colors"
                      >
                        {crumb.label}
                      </Link>
                      <ChevronRight className="mx-2 w-4 h-4 text-white/60" />
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

        <h1 className="text-5xl font-bold mb-4 drop-shadow">Uburu Therapy</h1>
        <p className="text-lg text-white/90 max-w-2xl leading-relaxed mb-6">
          Confidential, affordable support with licensed therapists for individuals,
          couples, and teens.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.instagram.com/uburu_therapy?igsh=YjNpd3JkajZ0Nnh2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-95 hover:scale-[1.02] transition-all shadow-lg border border-white/20"
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram</span>
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

export default TherapyHeroSection;
