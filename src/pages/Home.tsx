import AboutUs from "../components/HomeComponents/AboutUs";
import CausesSection from "../components/HomeComponents/CausesSection";
import HeroSection from "../components/HomeComponents/HeroSection";
import TestimonialsSection from "../components/HomeComponents/TestimonialSection";
import VolunteerTeamSection from "../components/HomeComponents/VolunteerSection";

const Home = () => {
    return (
        <div>
            <HeroSection />
            <AboutUs />
            <CausesSection />
            <TestimonialsSection />
            <VolunteerTeamSection />
        </div>
    )
}

export default Home
