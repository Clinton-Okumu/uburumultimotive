import causesImg1 from "../../assets/pic5.png";
import causesImg2 from "../../assets/pic6.png";
import causesImg3 from "../../assets/pic7.png";

const CausesSection = () => {
    const causes = [
        {
            id: 1,
            image: causesImg1,
            percentage: 16,
            raised: 13000,
            goal: 85000,
            category: "Healthcare",
            title: "Medical Care & Mental Health Support",
            description:
                "Access to healthcare is critical for people experiencing homelessness. We provide basic medical care, mental health support, and referrals to help individuals recover and regain stability."
        },
        {
            id: 2,
            image: causesImg2,
            percentage: 28,
            raised: 26000,
            goal: 90000,
            category: "Food Security",
            title: "Daily Meals & Hunger Relief",
            description:
                "No one can rebuild their life on an empty stomach. We provide consistent, nutritious meals to individuals and families staying at the shelter or living on the streets."
        },
        {
            id: 3,
            image: causesImg3,
            percentage: 24,
            raised: 13701,
            goal: 60000,
            category: "Shelter",
            title: "Emergency Shelter & Safe Housing",
            description:
                "Safe shelter is the first step off the streets. We offer temporary housing, clean facilities, and a secure environment where people can rest, recover, and plan their next steps."
        }
    ];

    return (
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mb-6">
                        Our Work
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        How We Make an Impact
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Ending homelessness requires more than a bed for the night.
                        <br />
                        We focus on safety, dignity, and long-term stability.
                    </p>
                </div>

                {/* Causes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {causes.map((cause) => (
                        <div
                            key={cause.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={cause.image}
                                    alt={cause.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Category Badge */}
                                <div className="mb-4">
                                    <span className="inline-block bg-emerald-600 text-white text-sm font-semibold px-4 py-1.5 rounded">
                                        {cause.category}
                                    </span>
                                </div>

                                {/* Title and Description */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {cause.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {cause.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CausesSection;
