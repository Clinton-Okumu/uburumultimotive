import { Heart, Quote, Sparkles } from "lucide-react";
import founderPortrait from "../../assets/hero.webp";
import founderCommunity from "../../assets/pic4.webp";

const founderFacts = [
  "Community-first leadership rooted in service",
  "Built Uburu Multimove around dignity and practical care",
  "Focused on sustainable support, not one-time relief",
];

const FounderStorySection = () => {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative">
          <div className="absolute -left-6 top-10 hidden rounded-[2rem] border border-yellow-400/20 bg-black p-5 text-yellow-400 shadow-2xl md:block">
            <Sparkles className="mb-3 h-7 w-7" />
            <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300/80">
              Founder Focus
            </p>
            <p className="mt-2 max-w-[10rem] text-2xl font-black leading-tight text-white">
              Purpose turned into daily action
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-xl">
              <img
                src={founderPortrait}
                alt="Founder portrait placeholder"
                className="h-[420px] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-4 pt-8 sm:pt-16">
              <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-xl">
                <img
                  src={founderCommunity}
                  alt="Founder supporting the community"
                  className="h-[250px] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="rounded-[2rem] bg-neutral-950 p-8 text-white shadow-xl">
                <Heart className="mb-4 h-8 w-8 fill-yellow-400 text-yellow-400" />
                <p className="text-sm font-black uppercase tracking-[0.24em] text-yellow-400">
                  Why This Page
                </p>
                <p className="mt-3 text-base leading-relaxed text-gray-300">
                  This founder page uses placeholder copy for now, so you can swap in the real
                  biography, milestones, and photos when ready.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <span className="inline-flex rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-black">
            Founder Story
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tighter text-gray-900 md:text-6xl">
            Meet the <span className="italic text-yellow-500">visionary behind</span> Uburu
            Multimove
          </h2>
          <p className="mt-8 text-lg font-medium leading-relaxed text-gray-600">
            Founder Name is presented here as a placeholder profile. This section is designed to
            tell the personal story behind the mission, what shaped the founder's values, and how
            those experiences inspired a long-term commitment to serving vulnerable communities.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-gray-500">
            The story can later be replaced with the founder's real background, early struggles,
            turning points, and the moment Uburu Multimove was born. For now, the structure gives
            you a polished page ready for that content.
          </p>

          <div className="mt-10 rounded-[2rem] border border-neutral-100 bg-neutral-50 p-8">
            <Quote className="h-10 w-10 text-yellow-500" />
            <p className="mt-5 text-xl italic leading-relaxed text-gray-700">
              "Every lasting movement begins with one person deciding that compassion must become
              action. This page is built to carry that story clearly."
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            {founderFacts.map((fact) => (
              <div
                key={fact}
                className="flex items-center gap-4 rounded-2xl border border-neutral-100 px-5 py-4"
              >
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-gray-900">
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStorySection;
