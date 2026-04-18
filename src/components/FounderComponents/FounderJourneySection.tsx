import { HandHeart, Lightbulb, MapPinned, Users } from "lucide-react";

const milestones = [
  {
    title: "Academic Foundation",
    text: "Pursued Bachelor's in Counseling Psychology (MKU) and Master's in Psychology (UK).",
    icon: Lightbulb,
  },
  {
    title: "Clinical Training",
    text: "Trained and licensed as a therapist, building expertise in trauma-informed care.",
    icon: Users,
  },
  {
    title: " vision for Change",
    text: "Recognized the need to integrate mental health services into homeless support systems.",
    icon: MapPinned,
  },
  {
    title: "Uburu Multimove",
    text: "Founded Uburu Multimove—combining therapy, safe housing, and empowerment programs.",
    icon: HandHeart,
  },
];

const FounderJourneySection = () => {
  return (
    <section className="bg-neutral-950 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-yellow-500/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-yellow-300">
            Journey & Legacy
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tighter text-white md:text-5xl">
            A journey rooted in <span className="italic text-yellow-400">psychology</span> and
            purpose
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-400">
            Joyeve's academic background and hands-on experience in mental health support shaped her
            vision for a holistic approach to homelessness—one that combines therapy, safe housing,
            and empowerment programs.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {milestones.map(({ title, text, icon: Icon }, index) => (
            <article
              key={title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-yellow-400/40 hover:bg-white/[0.08]"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-yellow-400 p-3 text-black">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.24em] text-gray-500">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-black tracking-tight text-white">{title}</h3>
              <p className="mt-4 leading-relaxed text-gray-400">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FounderJourneySection;
