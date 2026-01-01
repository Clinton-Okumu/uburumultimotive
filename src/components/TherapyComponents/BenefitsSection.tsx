import { CheckCircle2, DollarSign, Lock, Star, Timer, Video } from "lucide-react";

const BenefitItem = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="bg-yellow-100 p-2 rounded-lg">
      <Icon className="w-5 h-5 text-yellow-600" />
    </div>
    <span className="text-gray-700 font-medium">{text}</span>
  </div>
);

const BenefitsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              Why Choose Us
            </span>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1]">
              Quality Care,{" "}
              <span className="text-yellow-500">Accessible Price</span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              We believe everyone deserves access to professional mental health support. 
              Our therapy services are designed to be affordable without compromising on quality.
            </p>

            <div className="space-y-4 pt-4">
              <BenefitItem icon={DollarSign} text="Affordable sliding scale fees" />
              <BenefitItem icon={Star} text="Licensed and experienced therapists" />
              <BenefitItem icon={Lock} text="Completely confidential sessions" />
              <BenefitItem icon={Video} text="Flexible in-person and online options" />
              <BenefitItem icon={Timer} text="Quick scheduling within 48 hours" />
              <BenefitItem icon={CheckCircle2} text="No insurance or referral needed" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-12 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-extrabold text-yellow-600 mb-2">95%</div>
                  <p className="text-gray-700 font-medium">Client Satisfaction</p>
                </div>

                <div className="h-px bg-yellow-200"></div>

                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                    <p className="text-sm text-gray-600">Clients Helped</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">20+</div>
                    <p className="text-sm text-gray-600">Licensed Therapists</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-60 -z-10"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-40 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
