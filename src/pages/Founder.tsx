import AboutHeroSection from "../components/AboutComponents/AboutHeroSection";
import FounderStorySection from "../components/FounderComponents/FounderStorySection";
import hero from "../assets/hero.webp";

const Founder = () => {
  return (
    <>
      <AboutHeroSection
        title="Founder"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Founder", href: "/founder" },
        ]}
        image={hero}
      />
      <FounderStorySection />
    </>
  );
};

export default Founder;
