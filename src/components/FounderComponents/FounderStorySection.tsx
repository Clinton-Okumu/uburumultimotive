import founderPortrait from "../../assets/jk.avif";

const founderFacts = [
  "Licensed therapist with expertise in trauma-informed care",
  "Bachelor's in Counseling Psychology (MKU), Master's in Psychology (UK)",
  "Champions holistic mental health integration in homeless support",
];

const FounderStorySection = () => {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={founderPortrait}
                alt="Joyeve Kuria - Founder of Uburu Multimove"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>

          <div>
            <span className="inline-flex rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-black">
              Founder Story
            </span>
            <h2 className="mt-6 text-4xl font-black tracking-tighter text-gray-900 md:text-5xl">
              Meet <span className="italic text-yellow-500">Joyeve Kuria</span>, the visionary
              behind Uburu Multimove
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Joyeve Kuria is the founder of Uburu Multimove Homeless Shelter, a purpose-driven
              initiative committed to restoring dignity, stability, and hope among individuals
              experiencing homelessness. As a trained and licensed therapist, Joyeve brings both
              professional expertise and deep compassion into her work, shaping a model of care that
              addresses not only immediate needs but also long-term transformation.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              She holds a Bachelor's degree in Counseling Psychology from Mount Kenya University (MKU)
              and a Master's degree in Psychology from Liverpool John Moores University (UK). Her
              academic background is complemented by hands-on experience in mental health support,
              equipping her with a strong foundation in trauma-informed care, emotional resilience, and behavioral
              change.
            </p>

            <p className="mt-6 italic text-xl text-yellow-600">
              "Sustainable change goes beyond providing shelter—it requires addressing the psychological,
              emotional, and social challenges that often accompany homelessness."
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {founderFacts.map((fact) => (
                <span
                  key={fact}
                  className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm font-medium text-gray-800"
                >
                  {fact}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStorySection;