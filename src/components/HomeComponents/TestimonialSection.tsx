import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';

const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            rating: 5,
            text: "My family and I were able to rebuild not only our home but also a sense of security and future. We are forever grateful to the volunteers & donors who made this possible.",
            name: "Sharon McClure",
            role: "Volunteer",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"
        },
        {
            id: 2,
            rating: 5,
            text: "The support we received after the disaster was nothing short of life-changing. When everything we had was lost, the kindness and quick response from this organization.",
            name: "Johnnie Lind",
            role: "Volunteer",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
        },
        {
            id: 3,
            rating: 5,
            text: "The support we received after the disaster was nothing short of life-changing. When everything we had was lost, the kindness and quick response from this organization.",
            name: "Johnnie Lind",
            role: "Volunteer",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    const getVisibleTestimonials = () => {
        const visible = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % testimonials.length;
            visible.push(testimonials[index]);
        }
        return visible;
    };

    return (
        <div className="bg-neutral-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block bg-neutral-800 text-white text-sm font-medium px-6 py-2 rounded-full mb-4">
                        Testimonial
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Stories from the Heart
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Long-term recovery requires sustainable livelihoods.
                        <br />
                        We support individuals & families in rebuilding.
                    </p>
                </div>

                {/* Testimonials Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 z-10 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-colors"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 z-10 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-colors"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-900" />
                    </button>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getVisibleTestimonials().map((testimonial, index) => (
                            <div
                                key={`${testimonial.id}-${index}`}
                                className="bg-neutral-800 rounded-xl p-8 relative transition-transform hover:scale-105 duration-300"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 fill-yellow-500 text-yellow-500"
                                        />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-gray-300 text-base leading-relaxed mb-8">
                                    "{testimonial.text}"
                                </p>

                                {/* Divider */}
                                <div className="border-t border-gray-700 mb-6"></div>

                                {/* Author Info */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="text-white font-semibold text-base">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-gray-400 text-sm">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quote Icon */}
                                    <div className="text-yellow-500 text-5xl font-serif leading-none">
                                        ,,
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;
