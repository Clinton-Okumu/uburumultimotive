import UburuHomeHero from "../components/UburuHomeComponents/UburuHomeHero";
import { CategoryRail } from "../components/UburuHomeComponents/CategoryRail";

const UburuHome = () => {
  return (
    <div className="bg-white min-h-screen text-neutral-900">
      {/* 1. Hero Section with Brand Tagline and CTA */}
      <UburuHomeHero />

      {/* 2. Compact Horizontal Category Rail (12 Categories with Direct Page Navigation) */}
      <CategoryRail />
    </div>
  );
};

export default UburuHome;
