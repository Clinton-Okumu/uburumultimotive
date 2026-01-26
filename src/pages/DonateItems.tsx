import DonationItemsSection from "../components/DonationComponents/DonationItemsSection";
import HeroSection from "../components/DonationComponents/DonationHeroSection";

const DonateItems = () => {
  return (
    <>
      <HeroSection
        title="Donate Items"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Donate Items", href: "/donate/items" },
        ]}
      />
      <DonationItemsSection />
    </>
  );
};

export default DonateItems;
