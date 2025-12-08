import { ArrowRight } from 'lucide-react';

const StatisticsSection = () => {
    const stats = [
        { value: '12+', label: 'Years of Fundation' },
        { value: '69+', label: 'Monthly Donate' },
        { value: '3+', label: 'Global Partners' },
        { value: '93+', label: 'Project Complete' }
    ];

    return (
        <section className="bg-gradient-to-br from-teal-700 to-teal-600 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="space-y-6">
                        <div className="inline-block bg-teal-800/50 text-white px-4 py-2 rounded-md text-sm font-medium">
                            Company Statistics
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Highest Ambition is to Help People
                        </h2>

                        <p className="text-teal-100 text-lg leading-relaxed">
                            Our impact is reflected in the numbers—and each
                            statistic represents lives changed and futures
                            improved over the past year alone.
                        </p>

                        <button className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-4 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl">
                            Donate Now
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Right: Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-200"
                            >
                                <div className="text-5xl font-bold text-gray-900 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatisticsSection;
