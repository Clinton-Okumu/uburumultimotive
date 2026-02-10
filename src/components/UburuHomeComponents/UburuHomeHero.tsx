import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../../assets/hero.webp";

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

        <h1 className="text-5xl font-bold mb-4 drop-shadow">Uburu Home</h1>
        <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
          Shop essentials that keep families supported. Every purchase helps fund shelter and care.
        </p>
      </div>
    </section>
  );
};

export default UburuHomeHero;
