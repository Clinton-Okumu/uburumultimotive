import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";
import img3 from "../../assets/pic6.webp";
import img2 from "../../assets/pic7.webp";
import img1 from "../../assets/pic9.webp";
import img4 from "../../assets/pic2.webp";
import img5 from "../../assets/pic3.webp";
import img6 from "../../assets/pic4.webp";

const galleryImages = [
    {
        id: 1,
        image: img1,
        month: "January 2026",
        category: "Food Distribution",
        description: "Food distribution to homeless families in downtown Nairobi",
    },
    {
        id: 2,
        image: img2,
        month: "January 2026",
        category: "Clothing Donation",
        description: "Clothing drive for children at our shelter",
    },
    {
        id: 3,
        image: img3,
        month: "January 2026",
        category: "Shelter Construction",
        description: "Building new housing units for families",
    },
    {
        id: 4,
        image: img4,
        month: "December 2025",
        category: "Therapy Session",
        description: "Group therapy session for community members",
    },
    {
        id: 5,
        image: img5,
        month: "December 2025",
        category: "Community Event",
        description: "Annual community gathering and celebration",
    },
    {
        id: 6,
        image: img6,
        month: "December 2025",
        category: "Volunteer Activity",
        description: "Volunteers helping with shelter maintenance",
    },
];

const GallerySection = () => {
    const [selectedMonth, setSelectedMonth] = useState<string>("All");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

    const months = ["All", "January 2026", "December 2025"];
    const categories = ["All", "Food Distribution", "Clothing Donation", "Shelter Construction", "Therapy Session", "Community Event", "Volunteer Activity"];

    const filteredImages = galleryImages.filter(img => {
        const monthMatch = selectedMonth === "All" || img.month === selectedMonth;
        const categoryMatch = selectedCategory === "All" || img.category === selectedCategory;
        return monthMatch && categoryMatch;
    });

    return (
        <section className="py-20 px-4 bg-white">
            <div className="container mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                        Our Work Gallery
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Monthly updates of our activities and community impact
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-3xl mx-auto">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Month</label>
                        <div className="relative">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-md appearance-none cursor-pointer"
                            >
                                {months.map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500 pointer-events-none rotate-90" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-md appearance-none cursor-pointer"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500 pointer-events-none rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImages.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.description}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wide">
                                    {item.month}
                                </div>
                                <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wide">
                                    {item.category}
                                </div>
                            </div>

                            <div className="p-5">
                                <p className="text-gray-700 font-medium text-sm line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredImages.length === 0 && (
                    <div className="text-center py-20">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No images found for this filter</p>
                    </div>
                )}

                {/* Pagination */}
                {filteredImages.length > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400 cursor-not-allowed hover:bg-gray-50">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-lg bg-yellow-400 text-gray-900 font-bold flex items-center justify-center">1</button>
                        <button className="w-10 h-10 rounded-lg border border-gray-300 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-50">2</button>
                        <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2"
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    <div
                        className="relative max-w-4xl max-h-[85vh] w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.image}
                            alt={selectedImage.description}
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="mt-4 text-white text-center">
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-md uppercase">
                                    {selectedImage.category}
                                </span>
                                <span className="text-sm text-gray-300">
                                    {selectedImage.month}
                                </span>
                            </div>
                            <p className="text-base">{selectedImage.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default GallerySection;
