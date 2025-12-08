import { useState } from 'react';

const MissionVisionSection = () => {
    const [activeTab, setActiveTab] = useState('mission');

    const tabs = [
        { id: 'mission', label: 'Our Mission' },
        { id: 'vision', label: 'Our Vission' },
        { id: 'history', label: 'Charity History' }
    ];

    return (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Image */}
                    <div className="relative">
                        <div className="overflow-hidden rounded-2xl shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800"
                                alt="Volunteers working together at community center"
                                className="w-full h-[500px] object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-6">
                        <div className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
                            Our Mission & Vision
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Our Purpose: Mission and Vision for a Better
                        </h2>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our mission to bring hope, resources, & opportunitie communities
                            in need, empowering individuals to build brighter, sustainable
                            futures we are committed to tackling critical challenges.
                        </p>

                        {/* Tabs */}
                        <div className="flex gap-4 border-b-2 border-gray-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === tab.id
                                        ? 'text-teal-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="pt-4 space-y-4">
                            {activeTab === 'mission' && (
                                <div className="space-y-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        Our vision is a world where everyone has the opportunity
                                        to thrive, with access the resources and support necessary
                                        for lasting change guided by compassion, integrity.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        Guided by compassion, integrity, and community, we work
                                        tirelessly to make this vision a reality. Together, with our
                                        supporters, partners, and volunteers, we are creating.
                                    </p>
                                </div>
                            )}
                            {activeTab === 'vision' && (
                                <div className="space-y-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        We envision a future where every community has access to essential
                                        resources, education, and opportunities for growth and development.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        Through sustainable practices and collaborative partnerships, we
                                        strive to create lasting positive change that empowers generations.
                                    </p>
                                </div>
                            )}
                            {activeTab === 'history' && (
                                <div className="space-y-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        Founded over a decade ago, our organization has grown from a small
                                        local initiative to a global movement of compassionate changemakers.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        Our journey has been marked by countless success stories, partnerships,
                                        and the unwavering support of our community members worldwide.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionVisionSection;
