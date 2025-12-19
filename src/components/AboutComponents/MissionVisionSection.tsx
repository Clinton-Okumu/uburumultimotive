import { Eye, History, Rocket } from 'lucide-react';
import { useState } from 'react';
import img1 from '../../assets/pic9.png';

const MissionVisionSection = () => {
    const [activeTab, setActiveTab] = useState('mission');

    const tabs = [
        { id: 'mission', label: 'Our Mission', icon: <Rocket className="w-4 h-4" /> },
        { id: 'vision', label: 'Our Vision', icon: <Eye className="w-4 h-4" /> },
        { id: 'history', label: 'Our History', icon: <History className="w-4 h-4" /> }
    ];

    const content = {
        mission: {
            title: "Empowering Lives Through Action",
            text1: "Our mission is to bring hope, resources, and opportunities to communities in need, empowering individuals to build brighter, sustainable futures.",
            text2: "We are committed to tackling critical challenges through targeted programs and the collective power of our compassionate supporters."
        },
        vision: {
            title: "A Future of Limitless Potential",
            text1: "We envision a world where everyone has the opportunity to thrive, with access to the resources and support necessary for lasting change.",
            text2: "Guided by compassion and integrity, we work tirelessly to make this vision a reality alongside our global partners."
        },
        history: {
            title: "A Decade of Dedicated Service",
            text1: "Founded over a decade ago, our organization has grown from a small local initiative into a movement of compassionate changemakers.",
            text2: "Our journey is marked by countless success stories and the unwavering support of our community members worldwide."
        }
    };

    return (
        <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Image with Premium Frame */}
                    <div className="relative group">
                        <div className="overflow-hidden rounded-[2.5rem] shadow-2xl relative z-10 border-8 border-neutral-50">
                            <img
                                src={img1}
                                alt="Community impact"
                                className="w-full h-[550px] object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                        {/* Decorative Background Blob */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                    </div>

                    {/* Right: Content */}
                    <div className="flex flex-col h-full">
                        <div className="mb-8">
                            <span className="inline-block bg-black text-yellow-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
                                Purpose & Legacy
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[0.95] tracking-tighter">
                                Creating a <span className="text-yellow-500">Better Tomorrow</span>
                            </h2>
                        </div>

                        {/* Custom Animated Tabs */}
                        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-neutral-100 rounded-2xl w-fit">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${activeTab === tab.id
                                        ? 'bg-white text-black shadow-md border-b-2 border-yellow-500'
                                        : 'text-gray-500 hover:text-black'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content with Fade-in Effect */}
                        <div className="min-h-[250px] flex flex-col justify-center">
                            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                    <div className="w-8 h-1 bg-yellow-400" />
                                    {content[activeTab as keyof typeof content].title}
                                </h3>
                                <div className="space-y-6">
                                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                        {content[activeTab as keyof typeof content].text1}
                                    </p>
                                    <p className="text-gray-500 leading-relaxed italic">
                                        {content[activeTab as keyof typeof content].text2}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Simple Call to Action */}
                        <div className="mt-10 pt-8 border-t border-neutral-100">
                            <button className="flex items-center gap-2 font-black uppercase text-xs tracking-[0.2em] text-gray-900 hover:text-yellow-500 transition-colors">
                                Learn More About Our Journey
                                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionVisionSection;
