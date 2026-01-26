import { CreditCard, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSection from "../components/DonationComponents/DonationHeroSection";

const DonateLanding = () => {
  return (
    <>
      <HeroSection
        title="Donate"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Donate", href: "/donate" },
        ]}
      />
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Choose a Path
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              How Would You Like to <span className="text-yellow-500">Help</span>?
            </h2>
            <p className="text-gray-500 text-lg font-medium">
              Pick one option below and we’ll guide you to the right donation form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Link
              to="/donate/money"
              className="group rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-xl shadow-yellow-500/5 transition-all hover:-translate-y-1 hover:border-yellow-400"
            >
              <div className="flex items-center gap-5 mb-8">
                <div className="bg-yellow-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  <CreditCard className="w-7 h-7 text-yellow-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Money
                  </p>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-neutral-900">
                    Donate Funds
                  </h3>
                </div>
              </div>
              <p className="text-lg font-semibold text-neutral-600">
                Support our programs with secure card or M-Pesa donations.
              </p>
              <span className="inline-flex mt-8 text-sm font-black uppercase tracking-widest text-yellow-500">
                Continue
              </span>
            </Link>

            <Link
              to="/donate/items"
              className="group rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-xl shadow-yellow-500/5 transition-all hover:-translate-y-1 hover:border-yellow-400"
            >
              <div className="flex items-center gap-5 mb-8">
                <div className="bg-yellow-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-yellow-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Food & Clothing
                  </p>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-neutral-900">
                    Donate Items
                  </h3>
                </div>
              </div>
              <p className="text-lg font-semibold text-neutral-600">
                Share food or clothes and choose pickup or delivery options.
              </p>
              <span className="inline-flex mt-8 text-sm font-black uppercase tracking-widest text-yellow-500">
                Continue
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonateLanding;
