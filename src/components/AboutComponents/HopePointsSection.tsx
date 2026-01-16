import { MapPin, ShieldCheck } from "lucide-react";

const HopePointsSection = () => {
    const locations = [
        {
            title: "Nairobi",
            subtitle: "Hope Points",
            items: ["Umoja Hope Point", "Kibra Hope Point", "Dandora Hope Point", "CBD Hope Point"],
        },
        {
            title: "Across Kenya",
            subtitle: "Hope Points",
            items: ["Nyeri Hope Point", "Nakuru Hope Point", "Kisumu Hope Point", "Mombasa Hope Point"],
        },
    ];

    return (
        <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute -top-20 right-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl" />
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-14 items-start">
                    <div>
                        <span className="inline-flex items-center gap-2 bg-black text-yellow-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
                            <ShieldCheck className="w-4 h-4" />
                            Working Legally
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[0.95] tracking-tighter mb-6">
                            We are working legally <span className="text-yellow-500">across Kenya</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium max-w-lg">
                            Our Hope Points are official community touchpoints where people can access
                            support, information, and partnerships.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {locations.map((location) => (
                            <div
                                key={location.title}
                                className="group p-8 rounded-[2rem] border border-neutral-100 bg-neutral-50 hover:border-yellow-400/60 transition-all duration-300 shadow-sm"
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-black text-yellow-400 flex items-center justify-center">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                                            {location.subtitle}
                                        </p>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">
                                            {location.title}
                                        </h3>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {location.items.map((item) => (
                                        <li key={item} className="text-gray-700 font-bold text-sm">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HopePointsSection;
