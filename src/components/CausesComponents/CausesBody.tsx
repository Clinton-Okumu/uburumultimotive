import { ArrowRight, Heart, Home, Sparkles, Users } from "lucide-react";
import img1 from "../../assets/pic5.png";
import img2 from "../../assets/pic6.png";
import img3 from "../../assets/pic7.png";
import Button from "../shared/Button";

const CausesBody = () => {
    const causes = [
        {
            id: 1,
            title: "Feeding Program",
            description: "Providing nutritious meals to those in need, ensuring no one goes hungry. Our feeding program reaches communities across the region, delivering hope one meal at a time.",
            icon: Heart,
            image: img1,
        },
        {
            id: 2,
            title: "Clothing and Shelter",
            description: "Offering essential clothing and safe shelter to vulnerable individuals and families. We believe everyone deserves dignity, warmth, and a place to call home.",
            icon: Home,
            image: img2,
        },
        {
            id: 3,
            title: "Social Rehabilitation",
            description: "Supporting holistic recovery and reintegration through comprehensive welfare programs. We empower individuals to rebuild their lives with dignity and purpose.",
            icon: Users,
            image: img3,
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles className="w-3 h-3" />
                            Our Focus Areas
                        </span>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                            Causes That <span className="text-yellow-500">Matter</span>
                        </h2>
                    </div>
                    <p className="text-lg text-gray-500 max-w-md font-medium leading-tight">
                        We are committed to making a lasting difference in the lives of those who need it most through our dedicated programs.
                    </p>
                </div>

                {/* Causes Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {causes.map((cause) => {
                        const Icon = cause.icon;
                        return (
                            <div
                                key={cause.id}
                                className="group bg-neutral-50 rounded-[2.5rem] border border-neutral-100 hover:border-yellow-400/50 transition-all duration-500 overflow-hidden flex flex-col h-full"
                            >
                                {/* Image Container */}
                                <div className="relative h-72 overflow-hidden m-4 rounded-[2rem]">
                                    <img
                                        src={cause.image}
                                        alt={cause.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Brand Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                    {/* Icon Badge - Signature Yellow */}
                                    <div className="absolute bottom-6 left-6 bg-yellow-400 p-4 rounded-2xl shadow-xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                                        <Icon className="w-6 h-6 text-black" strokeWidth={2.5} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 pt-4 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase">
                                        {cause.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-8 font-medium">
                                        {cause.description}
                                    </p>

                                    <div className="mt-auto">
                                        <button className="w-full flex items-center justify-between py-4 px-6 bg-white border border-neutral-200 rounded-xl font-black uppercase text-xs tracking-widest group/btn hover:bg-black hover:text-white transition-all duration-300">
                                            Learn More
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-yellow-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* High-Contrast Impact CTA */}
                <div className="mt-24">
                    <div className="bg-neutral-950 rounded-[3rem] p-10 md:p-16 relative overflow-hidden text-center md:text-left">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -mr-20 -mt-20" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="max-w-xl">
                                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter italic">
                                    Ready to <span className="text-yellow-400">Transform</span> Lives?
                                </h3>
                                <p className="text-gray-400 text-lg font-medium">
                                    Your support provides the foundation for sustainable change. Whether you volunteer your time or donate, every action matters.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <Button className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-5 text-sm font-black uppercase tracking-widest rounded-2xl">
                                    Donate Now
                                </Button>
                                <button className="bg-neutral-800 text-white px-10 py-5 text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-700 transition-all border border-neutral-700">
                                    Become a Volunteer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CausesBody;
