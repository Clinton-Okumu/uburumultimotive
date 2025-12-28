import { Check, Heart } from 'lucide-react';
import img2 from '../../assets/hero.webp';
import img3 from '../../assets/pic11.webp';
import img1 from '../../assets/pic8.webp';

const AboutSection = () => {
    return (
        <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Subtle background element */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Staggered Image Grid */}
                    <div className="grid grid-cols-2 gap-4 relative">
                        {/* Decorative Badge */}
                        <div className="absolute -top-6 -left-6 z-20 bg-black text-yellow-400 p-6 rounded-3xl shadow-2xl hidden md:block border border-yellow-400/20">
                            <Heart className="w-8 h-8 fill-yellow-400 mb-2" />
                            <p className="text-2xl font-black italic">10+</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Years of Impact</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-[2rem] h-[300px] border-4 border-white shadow-xl">
                                <img
                                    src={img1}
                                    alt="Volunteers organizing donation boxes"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                            </div>
                            <div className="relative overflow-hidden rounded-[2rem] h-[200px] border-4 border-white shadow-xl">
                                <img
                                    src={img3}
                                    alt="Community working together"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div className="pt-12">
                            <div className="relative overflow-hidden rounded-[2rem] h-[450px] border-4 border-white shadow-xl">
                                <img
                                    src={img2}
                                    alt="Happy volunteer celebrating"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-yellow-400/10 group-hover:bg-transparent transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="flex flex-col">
                        <span className="inline-block bg-yellow-400 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 w-fit">
                            Our Story
                        </span>

                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.95]">
                            Stronger Communities <span className="text-yellow-500 italic">One Gift</span> at a Time
                        </h2>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed font-medium">
                            Our organization is built on a simple yet powerful belief: together, we can
                            create lasting change. Through compassion, dedication, and the generous
                            support of our community, we work to uplift those in need.
                        </p>

                        <div className="p-8 bg-neutral-50 rounded-[2rem] border border-neutral-100 mb-10 relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Heart className="w-16 h-16 text-black" />
                            </div>
                            <p className="text-gray-700 italic leading-relaxed relative z-10">
                                "From providing essential resources to funding life-changing projects,
                                every effort is directed toward building a better, more equitable world
                                by uniting individuals and businesses."
                            </p>
                        </div>

                        {/* Mission Points */}
                        <div className="grid sm:grid-cols-1 gap-4">
                            {[
                                "Join Our Mission to Make a Difference",
                                "Transforming Lives and Communities",
                                "Standing Up for Human Rights"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 bg-black group-hover:bg-yellow-400 rounded-xl flex items-center justify-center transition-colors duration-300">
                                        <Check className="w-4 h-4 text-yellow-400 group-hover:text-black transition-colors" strokeWidth={4} />
                                    </div>
                                    <p className="text-gray-900 font-black uppercase text-sm tracking-wide">
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
