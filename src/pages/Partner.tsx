import HeroSection from "../components/DonationComponents/DonationHeroSection";
import PartnerFormSection from "../components/PartnerComponents/PartnerFormSection";

const Partner = () => {
  return (
    <>
      <HeroSection
        title="Partner With Us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Partner", href: "/partner" },
        ]}
      />
      <PartnerFormSection />
    </>
  );
};

export default Partner;
