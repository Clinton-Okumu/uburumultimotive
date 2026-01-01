import { Brain, Heart, Shield, Users } from "lucide-react";

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const ServiceCard = ({ icon: Icon, title, description }: ServiceCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
    <div className="bg-yellow-100 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-yellow-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const ServicesSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
            Comprehensive Mental Health Support
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer a range of therapy services designed to meet diverse needs and provide accessible mental health care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard
            icon={Brain}
            title="Individual Counseling"
            description="One-on-one sessions with licensed therapists to address personal challenges and promote growth."
          />
          <ServiceCard
            icon={Users}
            title="Group Therapy"
            description="Supportive group sessions where you can connect with others facing similar experiences."
          />
          <ServiceCard
            icon={Heart}
            title="Family Counseling"
            description="Strengthen family bonds and improve communication through guided therapy sessions."
          />
          <ServiceCard
            icon={Shield}
            title="Crisis Support"
            description="Immediate help when you need it most, with 24/7 crisis intervention services."
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
