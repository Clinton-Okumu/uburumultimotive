import { ArrowRight, Heart, Home, Users } from "lucide-react";
import Button from "../shared/Button";

const CausesBody = () => {
    const causes = [
        {
            id: 1,
            title: "Feeding Program",
            description: "Providing nutritious meals to those in need, ensuring no one goes hungry. Our feeding program reaches communities across the region, delivering hope one meal at a time.",
            icon: Heart,
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop",
            color: "bg-emerald-500",
        },
        {
            id: 2,
            title: "Clothing and Shelter",
            description: "Offering essential clothing and safe shelter to vulnerable individuals and families. We believe everyone deserves dignity, warmth, and a place to call home.",
            icon: Home,
            image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop",
            color: "bg-blue-500",
        },
        {
            id: 3,
            title: "Welfare and Social Rehabilitation",
            description: "Supporting holistic recovery and reintegration through comprehensive welfare programs. We empower individuals to rebuild their lives with dignity and purpose.",
            icon: Users,
            image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop",
            color: "bg-purple-500",
        },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 font-inter">
                        Our Causes
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
                        We are committed to making a lasting difference in the lives of those who need it most through our dedicated programs.
                    </p>
                </div>

                {/* Causes Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {causes.map((cause) => {
                        const Icon = cause.icon;
                        return (
                            <div
                                key={cause.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                {/* Image with Icon Overlay */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={cause.image}
                                        alt={cause.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    {/* Icon Badge */}
                                    <div className={`absolute top-4 right-4 ${cause.color} p-3 rounded-full shadow-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                        {cause.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {cause.description}
                                    </p>
                                    <button className="text-gray-800 font-medium hover:text-gray-600 transition-colors inline-flex items-center group/btn">
                                        Learn More
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Join Us in Making a Difference
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Your support can transform lives. Every contribution, big or small, helps us continue our mission to serve those in need.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button>
                                Donate Now
                            </Button>
                            <button className="bg-gray-100 text-gray-800 px-8 py-3 rounded-3xl font-semibold hover:bg-gray-200 transition-colors">
                                Become a Volunteer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default CausesBody;
