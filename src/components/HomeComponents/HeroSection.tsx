import hero from "../../assets/hero.png";
import Button from "../shared/Button";


const HeroSection = () => {
    return (
        <section className=" mx-auto  relative w-screen h-[80vh] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${hero})`,
                }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                    <span className="text-4xl md:text-5xl uppercase tracking-wider block text-yellow-400">
                        Uburu Multimove
                    </span>

                    <span className="text-5xl text-white md:text-6xl block max-w-2xl drop-shadow-xl">
                        Homeless Shelter NGO
                    </span>
                </h1>


                {/* Description */}
                <p className="text-white/80 max-w-xl mt-4">
                    “Touching one homeless person at a time”
                </p>

                {/* CTA Button */}
                <div className="mt-8">
                    <Button>
                        Join The Relief Effort
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
