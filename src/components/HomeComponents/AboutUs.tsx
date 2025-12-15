import { ArrowRight, Heart, Users } from "lucide-react";
import type { ReactNode } from "react";
import potraitImg from "../../assets/pic4.png";
import Button from "../shared/Button";

interface FeatureCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: ReactNode;
}

const FeatureCard = ({ icon: Icon, title, children }: FeatureCardProps) => (
    <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-start space-x-4">
            <Icon className="w-8 h-8 text-gray-800" />
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600">
                    {children}
                </p>
            </div>
        </div>
    </div>
);

const AboutUs = () => {
    return (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* LEFT CONTENT */}
                <div className="space-y-8">
                    <header>
                        <p className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mb-6">
                            About Us
                        </p>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            A Safe Place to Rest, Recover, and Rebuild
                        </h1>

                        <p className="text-lg text-gray-600">
                            At Uburu Multimove Homeless Shelter, we provide safe shelter,
                            warm meals, and compassionate support to individuals and
                            families experiencing homelessness. Our work focuses on
                            restoring dignity today while helping people move toward
                            stability and independence.
                        </p>
                    </header>

                    <div className="space-y-4">
                        <FeatureCard
                            icon={Users}
                            title="Safe shelter and essential support"
                        >
                            We offer a secure place to sleep, nutritious meals, clean
                            facilities, and a supportive environment where people can
                            rest, recover, and feel human again.
                        </FeatureCard>

                        <FeatureCard
                            icon={Heart}
                            title="Care rooted in dignity and respect"
                        >
                            Everyone deserves compassion. We meet people where they are,
                            offering help without judgment and support that respects
                            their dignity and lived experience.
                        </FeatureCard>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="space-y-6">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80"
                            alt="Community support at the shelter"
                            className="w-full h-96 object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between">
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                Our mission is to move people off the streets and into
                                safety—providing immediate shelter while supporting
                                pathways toward long-term housing, stability, and hope.
                            </p>

                            <Button>
                                <span>Volunteer</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={potraitImg}
                                alt="Person supported by the shelter"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutUs;
