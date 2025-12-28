import { ArrowRight, Heart, Home } from "lucide-react";
import type { ReactNode } from "react";
import potraitImg from "../../assets/pic4.webp";
import img1 from "../../assets/pic7.webp";
import Button from "../shared/Button";

interface FeatureCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: ReactNode;
}

const FeatureCard = ({ icon: Icon, title, children }: FeatureCardProps) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
            <div className="bg-yellow-50 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                    {children}
                </p>
            </div>
        </div>
    </div>
);

const AboutUs = () => {
    return (
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* LEFT CONTENT */}
                <div className="space-y-8">
                    <div>
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                            About Our Mission
                        </span>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                            Rest, Recover, and <span className="text-yellow-500">Rebuild.</span>
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            We provide safe shelter, warm meals, and the compassionate support
                            needed to help individuals and families move from the streets
                            toward lasting independence.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <FeatureCard
                            icon={Home}
                            title="Safe Haven"
                        >
                            Secure beds, nutritious meals, and clean facilities
                            to help you find your footing again.
                        </FeatureCard>

                        <FeatureCard
                            icon={Heart}
                            title="Dignity First"
                        >
                            Compassionate care without judgment, meeting every
                            individual exactly where they are.
                        </FeatureCard>
                    </div>
                </div>

                {/* RIGHT CONTENT - VISUAL GRID */}
                <div className="relative">
                    <div className="space-y-6">
                        <div className="rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src={img1}
                                alt="Community support"
                                className="w-full h-80 object-cover"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-neutral-900 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
                                <div>
                                    <h4 className="text-yellow-400 font-bold uppercase text-xs tracking-widest mb-3">Our Goal</h4>
                                    <p className="text-white text-sm leading-relaxed mb-6 font-medium">
                                        To provide immediate safety
                                        while creating clear pathways toward long-term housing.
                                    </p>
                                </div>

                                <Button className="bg-yellow-500 text-black hover:bg-yellow-400 border-none w-full justify-center text-xs font-bold uppercase">
                                    <span>Volunteer</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>

                            <div className="rounded-3xl overflow-hidden shadow-lg transform lg:-translate-y-4">
                                <img
                                    src={potraitImg}
                                    alt="Person supported"
                                    className="w-full h-full object-cover min-h-[200px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Decorative Background Element */}
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-100 rounded-full -z-10 blur-3xl opacity-60"></div>
                </div>

            </div>
        </section>
    );
};

export default AboutUs;
