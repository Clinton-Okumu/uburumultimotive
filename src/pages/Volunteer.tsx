import HeroSection from "../components/DonationComponents/DonationHeroSection";
import VolunteerFormSection from "../components/VolunteerComponents/VolunteerFormSection";

const Volunteer = () => {
  return (
    <>
      <HeroSection
        title="Volunteer"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Volunteer", href: "/volunteer" },
        ]}
      />
      <VolunteerFormSection />
    </>
  );
};

export default Volunteer;
