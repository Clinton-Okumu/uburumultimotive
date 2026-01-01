import { ArrowRight } from "lucide-react";
import hero from "../../assets/hero.webp";
import Button from "../shared/Button";

const HeroSection = () => {
  const donateUrl =
    "https://shop.directpay.online/paymybills/UBURUMULTIMOVEHOMELESSSHELTER?utm_source=ig&utm_medium=social&utm_content=link_in_bio";

  return (
    <section className=" mx-auto  relative w-screen h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${hero})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] mb-3 tracking-tight">
          <span className="text-4xl md:text-5xl uppercase tracking-wider block text-yellow-400">
            Uburu Multimove
          </span>

          <span className="text-5xl text-white md:text-6xl block max-w-2xl drop-shadow-xl">
            Homeless Shelter NGO
          </span>
        </h1>

        {/* Description */}
        <p className="text-white/80 max-w-xl mt-1 font-bold italic">
          “A home where there is no home”
        </p>

        {/* CTA Button */}
        <div className="mt-5">
          <a href={donateUrl} target="_blank" rel="noopener noreferrer">
            <Button icon={<ArrowRight />}>Join our cause today</Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
