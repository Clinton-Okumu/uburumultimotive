import TherapyHeroSection from "../components/TherapyComponents/TherapyHeroSection";
import ServicesSection from "../components/TherapyComponents/ServicesSection";
import HowItWorksSection from "../components/TherapyComponents/HowItWorksSection";
import BenefitsSection from "../components/TherapyComponents/BenefitsSection";
import RequestFormSection from "../components/TherapyComponents/RequestFormSection";

const Therapy = () => {
  return (
    <div>
      <TherapyHeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <RequestFormSection />
    </div>
  );
};

export default Therapy;
