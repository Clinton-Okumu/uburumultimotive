import { ArrowRight, Heart, Users } from "lucide-react";
import Button from "../shared/Button";

const FeatureCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-start space-x-4">
            <Icon className="w-8 h-8 text-gray-800" />
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{children}</p>
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
                        <p className="inline-block bg-neutral-800 text-white text-sm font-medium px-6 py-2 rounded-full mb-4">About Us</p>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            Committed to Relief, Dedicated to Hope
                        </h1>

                        <p className="text-lg text-gray-600">
                            Across Africa, millions go to sleep hungry every night. At Uburu
                            Multimove Homeless Shelter, we believe a single meal at the right
                            moment can be the difference between despair and hope.
                        </p>
                    </header>

                    <div className="space-y-4">
                        <FeatureCard
                            icon={Users}
                            title="Helping people rebuild with dignity"
                        >
                            We support communities to recover stronger and more resilient,
                            empowering them for the challenges of tomorrow.
                        </FeatureCard>

                        <FeatureCard
                            icon={Heart}
                            title="Compassion at the center of our mission"
                        >
                            Every action we take is driven by empathy and the belief that even
                            small acts of kindness can change lives.
                        </FeatureCard>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="space-y-6">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80"
                            alt="Community support"
                            className="w-full h-96 object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between">
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                Our mission is simple: deliver immediate relief to those affected
                                by crisis, while building pathways toward long-term recovery.
                            </p>

                            <Button>
                                <span>Volunteer</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&q=80"
                                alt="Child portrait"
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
