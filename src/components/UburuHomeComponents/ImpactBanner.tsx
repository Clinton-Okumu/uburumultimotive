import Button from "../shared/Button";
import pic18 from "../../assets/pic18.webp";

const ImpactBanner = () => {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-neutral-100 bg-neutral-50">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="p-10 lg:p-14">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">
              Impact first
            </p>
            <h2 className="mt-4 text-3xl font-black text-neutral-900 sm:text-4xl">
              Your cart keeps the lights on, meals hot, and counselors present.
            </h2>
            <p className="mt-4 text-base font-semibold text-neutral-600">
              We reinvest every shilling into safe shelter, mental wellness support, and long-term housing pathways.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="bg-yellow-500 text-black hover:bg-yellow-400 px-6 py-3 text-xs font-black uppercase tracking-[0.3em]">
                Learn our story
              </Button>
              <Button className="bg-neutral-900 text-white hover:bg-neutral-800 px-6 py-3 text-xs font-black uppercase tracking-[0.3em]">
                Partner with us
              </Button>
            </div>
          </div>
          <div className="relative min-h-[260px]">
            <img
              src={pic18}
              alt="Community support"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactBanner;
