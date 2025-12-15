import testimonialImg1 from "../../assets/pic2.png";
import testimonialImg2 from "../../assets/pic3.png";
import testimonialImg3 from "../../assets/pic4.png";
import testimonialImg4 from "../../assets/pic5.png";
import testimonialImg5 from "../../assets/pic8.png";

const GallerySection = () => {
    const galleryImages = [
        {
            id: 1,
            src: testimonialImg1,
            alt: "Volunteers serving meals at the shelter"
        },
        {
            id: 2,
            src: testimonialImg2,
            alt: "Warm meals prepared for shelter residents"
        },
        {
            id: 3,
            src: testimonialImg3,
            alt: "Community support and outreach"
        },
        {
            id: 4,
            src: testimonialImg4,
            alt: "Safe shelter space for people in need"
        },
        {
            id: 5,
            src: testimonialImg5,
            alt: "Volunteers working together at the shelter"
        },
        {
            id: 6,
            src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80",
            alt: "Care and compassion in action"
        }
    ];

    return (
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mb-6">
                        Our Gallery
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        The Frontlines of Relief
                    </h2>

                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        These moments reflect the everyday work happening inside and
                        beyond our shelter—providing safety, nourishment, and hope
                        to people rebuilding their lives.
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((image) => (
                        <div
                            key={image.id}
                            className="relative overflow-hidden rounded-xl shadow-md group"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
