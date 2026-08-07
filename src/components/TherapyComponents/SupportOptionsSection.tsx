import { MessageSquare, Rocket, Stethoscope, ArrowRight, CheckCircle2 } from "lucide-react";

interface SupportOptionsSectionProps {
  onSelectService?: (serviceType: string) => void;
  activeService?: string;
}

export type SupportOption = {
  id: string;
  title: string;
  serviceType: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  headerBg: string;
  headerHoverBg: string;
  iconColor: string;
  buttonBg: string;
  buttonHoverBg: string;
  shadowColor: string;
  borderColor: string;
};

export const SUPPORT_OPTIONS: SupportOption[] = [
  {
    id: "therapy",
    title: "Therapy",
    serviceType: "Individual Therapy (For Myself)",
    badge: "Mental Wellbeing",
    description:
      "Professional counseling for individuals, couples, and families to support emotional well-being.",
    icon: MessageSquare,
    headerBg: "bg-yellow-50/90",
    headerHoverBg: "group-hover:bg-yellow-100/90",
    iconColor: "text-yellow-600",
    buttonBg: "bg-yellow-500 text-black",
    buttonHoverBg: "hover:bg-yellow-400",
    shadowColor: "shadow-yellow-500/20",
    borderColor: "group-hover:border-yellow-400",
  },
  {
    id: "coaching",
    title: "Life Coaching",
    serviceType: "Life Coaching",
    badge: "Personal Growth",
    description:
      "Personalized guidance to help you set and achieve life goals and maximize your potential.",
    icon: Rocket,
    headerBg: "bg-neutral-900",
    headerHoverBg: "group-hover:bg-black",
    iconColor: "text-yellow-400",
    buttonBg: "bg-neutral-900 text-yellow-400 border border-yellow-500/30",
    buttonHoverBg: "hover:bg-black hover:text-yellow-300 hover:border-yellow-400",
    shadowColor: "shadow-neutral-900/30",
    borderColor: "group-hover:border-yellow-400",
  },
  {
    id: "medical",
    title: "Medical Consultation",
    serviceType: "Medical Consultation",
    badge: "Holistic Health",
    description:
      "Expert medical advice and consultation services to support your holistic health and wellbeing.",
    icon: Stethoscope,
    headerBg: "bg-amber-100/60",
    headerHoverBg: "group-hover:bg-amber-200/80",
    iconColor: "text-amber-800",
    buttonBg: "bg-yellow-500 text-black",
    buttonHoverBg: "hover:bg-yellow-400",
    shadowColor: "shadow-yellow-500/20",
    borderColor: "group-hover:border-yellow-400",
  },
];

const SupportOptionsSection = ({
  onSelectService,
  activeService,
}: SupportOptionsSectionProps) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50/60 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-32 left-10 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
            Support Pathways
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 tracking-tight leading-tight">
            How can we <span className="text-yellow-500 italic">help you</span> today?
          </h2>
          <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
            Choose the type of support that best fits your needs. Our team of experts is here to guide you on your journey.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {SUPPORT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = activeService === option.serviceType;

            return (
              <div
                key={option.id}
                onClick={() => onSelectService?.(option.serviceType)}
                className={`group cursor-pointer rounded-[2.5rem] bg-white border border-neutral-200/80 shadow-xl shadow-yellow-500/5 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${option.borderColor} flex flex-col justify-between relative ${
                  isSelected ? "ring-2 ring-yellow-400 border-yellow-400" : ""
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-20 bg-yellow-400 text-neutral-900 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected
                  </div>
                )}

                {/* Top Colored Banner Header */}
                <div
                  className={`${option.headerBg} ${option.headerHoverBg} py-12 flex flex-col items-center justify-center transition-colors duration-300 border-b border-neutral-100 relative`}
                >
                  <div
                    className={`p-4 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300 ${
                      option.id === "coaching"
                        ? "bg-neutral-800 border border-yellow-500/30"
                        : "bg-white border border-neutral-100"
                    }`}
                  >
                    <Icon className={`w-10 h-10 ${option.iconColor}`} />
                  </div>
                </div>

                {/* Card Body Content */}
                <div className="p-8 flex flex-col items-center text-center flex-1 justify-between space-y-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">
                      {option.badge}
                    </span>
                    <h3 className="text-2xl font-black text-neutral-900 mb-3 tracking-tight">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 text-base font-normal leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectService?.(option.serviceType);
                    }}
                    className={`w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg group-hover:shadow-xl group-hover:scale-[1.02] ${option.buttonBg} ${option.buttonHoverBg} ${option.shadowColor}`}
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SupportOptionsSection;
