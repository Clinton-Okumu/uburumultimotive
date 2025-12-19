import { ArrowRight, Trophy } from 'lucide-react';

const StatisticsSection = () => {
    const stats = [
        { value: '12+', label: 'Years of Foundation' },
        { value: '69k', label: 'Monthly Donations' },
        { value: '10+', label: 'Global Partners' },
        { value: '93%', label: 'Projects Completed' }
    ];

    return (
        <section className="bg-neutral-950 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-yellow-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
                                <Trophy className="w-4 h-4" />
                                Our Impact in Numbers
                            </div>

                            <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter">
                                Highest Ambition <br />
                                <span className="text-yellow-400 font-black">is to Help People</span>
                            </h2>
                        </div>

                        <p className="text-gray-400 text-xl leading-relaxed max-w-lg">
                            Our impact is reflected in the numbers—each
                            statistic represents lives changed and futures
                            improved through collective community action.
                        </p>

                        <button className="group inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-sm tracking-widest px-10 py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-yellow-900/10">
                            Donate Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Right: Stats Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="group bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-10 rounded-[2.5rem] text-center hover:border-yellow-400/50 transition-all duration-500"
                            >
                                <div className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tighter group-hover:text-yellow-400 transition-colors">
                                    {stat.value}
                                </div>
                                <div className="text-gray-500 font-bold uppercase text-xs tracking-[0.2em] leading-tight">
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
