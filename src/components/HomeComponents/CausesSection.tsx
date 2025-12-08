const CausesSection = () => {
    const causes = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80",
            percentage: 16,
            raised: 13000,
            goal: 85000,
            category: "Disasters",
            title: "Medical And Assistance",
            description: "Access healthcare becomes a lifeline in times of crisis. We offer medical support, mobile clinics, & mental."
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
            percentage: 28,
            raised: 26000,
            goal: 90000,
            category: "Disasters",
            title: "Hunger Relief and Food",
            description: "In the aftermath of a disaster access to nutritious food is often disrupted. We work provide emergency meals."
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
            percentage: 24,
            raised: 13701,
            goal: 60000,
            category: "Disasters",
            title: "Shelter and Housing",
            description: "Rebuilding home & shelter essential for recovery. We help restore safe living conditions by offering."
        }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mb-6">
                        Causes
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Our Latest Causes
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Long-term recovery requires sustainable livelihoods.
                        <br />
                        We support individuals & families in rebuilding.
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
                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {cause.percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                        <div
                                            className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${cause.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>
                                            <span className="font-semibold text-gray-900">Raised:</span>{' '}
                                            {formatCurrency(cause.raised)}
                                        </span>
                                        <span>
                                            <span className="font-semibold text-gray-900">Goal:</span>{' '}
                                            {formatCurrency(cause.goal)}
                                        </span>
                                    </div>
                                </div>

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
