import causesImg1 from "../../assets/pic5.webp";
import causesImg2 from "../../assets/pic6.webp";
import causesImg3 from "../../assets/pic7.webp";

const CausesSection = () => {
    const causes = [
        {
            id: 1,
            image: causesImg1,
            category: "Healthcare",
            title: "Medical & Mental Health",
            description: "Providing essential medical care and mental health support to help individuals recover and regain physical stability."
        },
        {
            id: 2,
            image: causesImg2,
            category: "Food Security",
            title: "Daily Nutrition",
            description: "Serving consistent, healthy meals to ensure no one in our community has to rebuild their life on an empty stomach."
        },
        {
            id: 3,
            image: causesImg3,
            category: "Shelter",
            title: "Emergency Housing",
            description: "Offering safe, clean, and secure temporary housing—the vital first step toward long-term independence."
        }
    ];

    return (
        <section className="bg-neutral-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        Our Impact
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        How We <span className="text-yellow-500">Change Lives</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        We provide the essentials for safety, dignity, and a path toward permanent stability through our core initiatives.
                    </p>
                </div>

                {/* Causes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {causes.map((cause) => (
                        <div
                            key={cause.id}
                            className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 relative"
                        >
                            {/* Image Wrapper */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={cause.image}
                                    alt={cause.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading="lazy"
                                />
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.1em] shadow-md">
                                        {cause.category}
                                    </span>
                                </div>
                                {/* Dark Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                                    {cause.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    {cause.description}
                                </p>

                                {/* Subtle Action Link */}
                                <div className="flex items-center text-yellow-600 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    Learn More
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>

                            {/* Bottom Highlight Bar */}
                            <div className="absolute bottom-0 left-0 h-1.5 bg-yellow-400 w-0 group-hover:w-full transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CausesSection;
