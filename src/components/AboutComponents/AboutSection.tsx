import { Check } from 'lucide-react';
import img2 from '../../assets/hero.png';
import img3 from '../../assets/pic11.png';
import img1 from '../../assets/pic8.png';

const AboutSection = () => {
    return (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-left">

                {/* Section Label */}
                <div className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mb-6">
                    About Us
                </div>

                {/* Main Heading */}
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-2xl">
                    Stronger Communities One Gift at a Time
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-12 max-w-2xl leading-relaxed">
                    Our organization is built on a simple yet powerful belief: together, we can
                    create lasting change. Through compassion, dedication, and the generous
                    support of our community, we work to uplift.
                </p>

                {/* Images Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Left Image */}
                    <div className="relative overflow-hidden rounded-lg h-[400px]">
                        <img
                            src={img1}
                            alt="Volunteers organizing donation boxes with food and supplies"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right Image */}
                    <div className="relative overflow-hidden rounded-lg h-[400px]">
                        <img
                            src={img2}
                            alt="Happy volunteer in green shirt celebrating at donation center"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Bottom Image */}
                    <div className="relative overflow-hidden rounded-lg h-[300px] md:col-span-1">
                        <img
                            src={img3}
                            alt="Volunteers working together at donation center"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right Content */}
                    <div className="flex flex-col justify-center space-y-6">
                        <p className="text-gray-600 leading-relaxed">
                            From providing essential resources to funding life-changing projects,
                            every effort is directed toward building a better, more equitable world.
                            By uniting individuals, businesses, and communities.
                        </p>

                        {/* Mission Points */}
                        <div className="space-y-4">
                            {[
                                "Join Our Mission to Make a Difference",
                                "Transforming Lives and Communities",
                                "Standing Up for Human Rights"
                            ].map((text, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mt-1">
                                        <Check className="w-4 h-4 text-gray-900" strokeWidth={3} />
                                    </div>
                                    <p className="text-gray-900 font-medium">
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutSection;
