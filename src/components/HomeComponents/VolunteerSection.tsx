import { Camera } from "lucide-react";
import testimonialImg1 from "../../assets/pic2.webp";
import testimonialImg2 from "../../assets/pic3.webp";
import testimonialImg3 from "../../assets/pic4.webp";
import testimonialImg4 from "../../assets/pic5.webp";
import testimonialImg5 from "../../assets/pic8.webp";

const GallerySection = () => {
  const galleryImages = [
    { id: 1, src: testimonialImg1, alt: "Volunteers serving meals" },
    { id: 2, src: testimonialImg2, alt: "Warm meals prepared with care" },
    { id: 3, src: testimonialImg3, alt: "Community outreach" },
    { id: 4, src: testimonialImg4, alt: "Safe shelter spaces" },
    { id: 5, src: testimonialImg5, alt: "Volunteers working together" },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80",
      alt: "Compassion in action",
    },
  ];

  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
            Visualizing Impact
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Relief in <span className="text-yellow-500 font-black">Action</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Capturing the everyday moments of safety, nourishment, and hope
            happening within our community.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-[400px] object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />

              {/* Yellow Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/90 via-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center mb-4">
                    <Camera className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-black text-lg font-black leading-tight uppercase tracking-tight">
                    {image.alt}
                  </p>
                  <div className="h-1 w-12 bg-black mt-3 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
