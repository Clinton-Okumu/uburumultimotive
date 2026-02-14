import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../../assets/hero.webp";
import uburuLogo from "../../assets/homelogo.webp";

const UburuHomeHero = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Uburu Home", href: "/get/home" },
  ];

  return (
    <section
      role="banner"
      aria-label="Uburu Home"
      className="relative h-[340px] flex items-center bg-cover bg-no-repeat bg-[center_30%] pt-10"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90" />

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
                        className="text-yellow-100/90 hover:text-yellow-400 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                      <ChevronRight className="mx-2 w-4 h-4 text-red-500/80" />
                    </>
                  ) : (
                    <span aria-current="page" className="text-yellow-100/70">
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="inline-flex items-center gap-3 rounded-full border border-yellow-400/60 bg-black/70 px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <div className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-yellow-400">
            <img src={uburuLogo} alt="Uburu Home logo" className="h-full w-full object-cover" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">
              Uburu
            </p>
            <p className="text-sm font-bold text-yellow-300">Feel at Home</p>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4 text-yellow-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          Uburu Home
        </h1>
        <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
          Shop essentials that keep families supported. Every purchase helps fund shelter and care.
        </p>
      </div>
    </section>
  );
};

export default UburuHomeHero;
