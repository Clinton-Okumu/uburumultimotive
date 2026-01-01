import { ArrowRight, Calendar, CheckCircle, User } from "lucide-react";

const StepCard = ({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <div className="relative">
    <div className="flex items-start gap-4">
      <div className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
        {step}
      </div>
      <div className="flex-1">
        <div className="bg-yellow-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
          <Icon className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
    {step < 4 && (
      <div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-yellow-300 to-transparent"></div>
    )}
  </div>
);

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Getting started with therapy is easy. Follow these simple steps to begin your journey to better mental health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <StepCard
            step={1}
            icon={CheckCircle}
            title="Submit Request"
            description="Fill out our simple therapy request form with your basic information and preferences."
          />
          <StepCard
            step={2}
            icon={Calendar}
            title="Schedule Session"
            description="Our team will contact you to schedule your first session at a convenient time."
          />
          <StepCard
            step={3}
            icon={User}
            title="Meet Your Therapist"
            description="Connect with a licensed therapist who specializes in your specific needs."
          />
          <StepCard
            step={4}
            icon={ArrowRight}
            title="Begin Your Journey"
            description="Start your therapy sessions and take the first step toward healing and growth."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
