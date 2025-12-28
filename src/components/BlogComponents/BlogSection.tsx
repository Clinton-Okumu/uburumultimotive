import { ArrowRight, ChevronLeft, ChevronRight, Newspaper, User } from "lucide-react";
import img3 from "../../assets/pic6.webp";
import img2 from "../../assets/pic7.webp";
import img1 from "../../assets/pic9.webp";

const BlogSection = () => {
    const displayPosts = [
        {
            id: 1,
            image: img1,
            date: "16 Oct 2025",
            author: "Kyle Miller",
            title: "Stories from the Field: Accounts of Disaster Relief",
            description: "Get an inside look at the real-life experiences of our teams on the ground during emergency responses.",
        },
        {
            id: 2,
            image: img2,
            date: "12 Oct 2025",
            author: "Sarah J.",
            title: "Tips for Disaster Preparedness: Staying Safe",
            description: "Disasters strike unexpectedly. Explore practical tips and guides to protect your community.",
        },
        {
            id: 3,
            image: img3,
            date: "08 Oct 2025",
            author: "Michael C.",
            title: "The Power of Collaboration in Crisis Relief",
            description: "Relief efforts are most effective when organizations and communities work together in harmony.",
        },
        {
            id: 1,
            image: img1,
            date: "16 Oct 2025",
            author: "Kyle Miller",
            title: "Stories from the Field: Accounts of Disaster Relief",
            description: "Get an inside look at the real-life experiences of our teams on the ground during emergency responses.",
        },
        {
            id: 2,
            image: img2,
            date: "12 Oct 2025",
            author: "Sarah J.",
            title: "Tips for Disaster Preparedness: Staying Safe",
            description: "Disasters strike unexpectedly. Explore practical tips and guides to protect your community.",
        },
        {
            id: 3,
            image: img3,
            date: "08 Oct 2025",
            author: "Michael C.",
            title: "The Power of Collaboration in Crisis Relief",
            description: "Relief efforts are most effective when organizations and communities work together in harmony.",
        }

    ];

    return (
        <section className="py-24 px-4 bg-white">
            <div className="container mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Newspaper className="w-3 h-3" />
                            The Newsroom
                        </span>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                            Latest News <br /> <span className="text-yellow-500">& Stories</span>
                        </h2>
                    </div>
                    <p className="text-lg text-gray-500 max-w-sm font-medium leading-snug">
                        Stay updated with our latest initiatives, success stories, and insights from the field.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {displayPosts.map((post) => (
                        <article key={post.id} className="group bg-white flex flex-col h-full border border-neutral-100 hover:border-yellow-400/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden">
                            {/* Image Container */}
                            <div className="relative h-72 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Date Badge - Fixed Top Right */}
                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-black text-[10px] font-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-widest">
                                    {post.date}
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 mb-4 text-yellow-600">
                                    <User className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{post.author}</span>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight tracking-tight uppercase italic">
                                    {post.title}
                                </h3>

                                <p className="text-gray-500 font-medium text-sm mb-8 line-clamp-3 leading-relaxed">
                                    {post.description}
                                </p>

                                <div className="mt-auto pt-6 border-t border-neutral-100">
                                    <div className="flex items-center justify-between group/link cursor-pointer">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-black group-hover/link:text-yellow-600 transition-colors">Read Article</span>
                                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center group-hover/link:bg-yellow-400 transition-all duration-300">
                                            <ArrowRight className="w-5 h-5 text-white group-hover/link:text-black group-hover/link:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Static Pagination UI */}
                <div className="flex items-center justify-center gap-3 mt-20">
                    <div className="w-12 h-12 rounded-2xl border border-neutral-200 flex items-center justify-center text-neutral-300 cursor-not-allowed">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-black font-black flex items-center justify-center shadow-lg shadow-yellow-100">1</div>
                    <div className="w-12 h-12 rounded-2xl border border-neutral-200 text-black font-black flex items-center justify-center hover:border-black cursor-pointer transition-all">2</div>
                    <div className="w-12 h-12 rounded-2xl border border-neutral-200 flex items-center justify-center hover:bg-black hover:text-white cursor-pointer transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
