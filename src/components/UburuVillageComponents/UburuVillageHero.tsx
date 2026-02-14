import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../../assets/hero.webp";
import villageLogo from "../../assets/villagelogo.webp";

const UburuVillageHero = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Uburu Village", href: "/get/village" },
  ];

  return (
    <section
      role="banner"
      aria-label="Uburu Village"
      className="relative h-[340px] flex items-center bg-cover bg-no-repeat bg-[center_30%] pt-10"
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

        <div className="inline-flex items-center gap-3 rounded-full border border-[#f2c15d]/70 bg-[#1b3b58]/70 px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
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

        <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          Uburu Village
        </h1>
        <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
          Outdoor events, guided trails, and community adventures that fund shelter work.
        </p>
      </div>
    </section>
  );
};

export default UburuVillageHero;
