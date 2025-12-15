import { Check } from 'lucide-react';

const MissionSection = () => {
    return (
        <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Image */}
                    <div className="relative">
                        <div className="overflow-hidden rounded-2xl shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80"
                                alt="Woman holding donation box in community center"
                                className="w-full h-[500px] object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Our Mission
                        </h2>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            We are dedicated to addressing urgent needs such as clean
                            water, education, healthcare, and food security, ensuring that
                            every person has the foundation.
                        </p>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            Through targeted programs, sustainable initiatives, & the
                            collective power of compassionate supporters, we strive to
                            make a real and lasting impact.
                        </p>

                        {/* Mission Points */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mt-1">
                                    <Check className="w-4 h-4 text-gray-900" strokeWidth={3} />
                                </div>
                                <p className="text-gray-900 font-medium text-lg">
                                    Client-Focused Solutions and Results
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mt-1">
                                    <Check className="w-4 h-4 text-gray-900" strokeWidth={3} />
                                </div>
                                <p className="text-gray-900 font-medium text-lg">
                                    Flexible, Value Driven Approach
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mt-1">
                                    <Check className="w-4 h-4 text-gray-900" strokeWidth={3} />
                                </div>
                                <p className="text-gray-900 font-medium text-lg">
                                    Warning of updated legal risks for customers
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mt-1">
                                    <Check className="w-4 h-4 text-gray-900" strokeWidth={3} />
                                </div>
                                <p className="text-gray-900 font-medium text-lg">
                                    A team of experienced and highly specialized
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
