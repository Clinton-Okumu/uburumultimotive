import { useState } from "react";
import TherapyHeroSection from "../components/TherapyComponents/TherapyHeroSection";
import SupportOptionsSection from "../components/TherapyComponents/SupportOptionsSection";
import RequestFormSection from "../components/TherapyComponents/RequestFormSection";
import LifeCoachingFormSection from "../components/TherapyComponents/LifeCoachingFormSection";
import MedicalConsultationFormSection from "../components/TherapyComponents/MedicalConsultationFormSection";

const Therapy = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleSelectService = (serviceType: string) => {
    setSelectedService(serviceType);
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const handleBackToOptions = () => {
    setSelectedService(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <TherapyHeroSection />
      {!selectedService ? (
        <SupportOptionsSection
          onSelectService={handleSelectService}
        />
      ) : (
        <section id="booking-form" className="py-16 bg-neutral-50/80 min-h-[600px]">
          <div className="container mx-auto px-4 max-w-7xl">
            {selectedService === "Life Coaching" ? (
              <LifeCoachingFormSection onBack={handleBackToOptions} />
            ) : selectedService === "Medical Consultation" ? (
              <MedicalConsultationFormSection onBack={handleBackToOptions} />
            ) : (
              <RequestFormSection
                selectedService={selectedService}
                onServiceChange={setSelectedService}
                onBack={handleBackToOptions}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Therapy;
