import { Check, Target } from 'lucide-react';

const MissionSection = () => {
    return (
        <section className="bg-neutral-950 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Image with Decorative Frame */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl border border-neutral-800">
                            <img
                                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80"
                                alt="Compassion in community"
                                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                        {/* The Yellow Accent Frame */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-yellow-400/30 rounded-[2.5rem] z-0 hidden md:block" />

                        {/* Floating Stat Card */}
                        <div className="absolute top-12 -left-8 z-20 bg-yellow-400 p-6 rounded-3xl shadow-xl hidden xl:block">
                            <Target className="w-8 h-8 text-black mb-2" />
                            <p className="text-black font-black text-xl uppercase leading-none">Our Purpose</p>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-8 order-1 lg:order-2 relative z-10">
                        <div>
                            <span className="inline-block bg-yellow-400 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
                                The Core
                            </span>
                            <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter">
                                Our <span className="text-yellow-400 italic">Mission</span>
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <p className="text-gray-400 text-xl leading-relaxed font-medium">
                                We are dedicated to addressing urgent needs such as clean
                                water, education, healthcare, and food security, ensuring that
                                every person has a solid foundation for the future.
                            </p>

                            <p className="text-gray-500 text-lg leading-relaxed">
                                Through targeted programs, sustainable initiatives, and the
                                collective power of compassionate supporters, we strive to
                                make a real and lasting impact in the lives we touch.
                            </p>
                        </div>

                        {/* Mission Points Grid */}
                        <div className="grid sm:grid-cols-1 gap-6 pt-4">
                            {[
                                "Client-Focused Solutions and Results",
                                "Flexible, Value Driven Approach",
                                "Expert Team of Specialized Professionals",
                                "Sustainable Community Development"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-default">
                                    <div className="flex-shrink-0 w-10 h-10 bg-neutral-900 border border-neutral-800 group-hover:border-yellow-400/50 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg">
                                        <Check className="w-5 h-5 text-yellow-400" strokeWidth={3} />
                                    </div>
                                    <p className="text-gray-200 font-bold text-lg tracking-tight group-hover:text-yellow-400 transition-colors">
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

export default MissionSection;
