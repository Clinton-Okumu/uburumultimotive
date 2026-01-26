import { ChevronDown, HandHeart } from "lucide-react";
import { useState } from "react";
import hero from "../../assets/hero.webp";
import { Link } from "react-router-dom";
import { getDropdownItems } from "../Layout/DropdownMenu";
import Button from "../shared/Button";

const HeroSection = () => {
  const [isGetOpen, setIsGetOpen] = useState(false);

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
          "A home where there is no home"
        </p>

        {/* CTA Buttons with Dropdowns */}
        <div className="mt-5 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Link to="/donate" className="inline-flex">
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold px-8 border-none shadow-lg shadow-yellow-500/20 flex items-center gap-2">
                <HandHeart className="w-5 h-5" />
                Donate
              </Button>
            </Link>
          </div>

          <div className="relative">
            <Button
              className="bg-white hover:bg-gray-100 text-black font-extrabold px-8 border-none shadow-lg flex items-center gap-2"
              onClick={() => setIsGetOpen(!isGetOpen)}
            >
              Get
              <ChevronDown className={`w-4 h-4 transition-transform ${isGetOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isGetOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl z-50 sm:bottom-auto sm:mb-0 sm:top-full sm:mt-2">
                <div className="p-2">
                  {getDropdownItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      onClick={() => setIsGetOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
