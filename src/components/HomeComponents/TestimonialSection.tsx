import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useState } from "react";

const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            rating: 5,
            text: "This shelter gave me more than just a bed. They treated me with respect and helped me find the strength to find my footing again.",
            name: "Sharon M.",
            role: "Former Resident"
        },
        {
            id: 2,
            rating: 5,
            text: "The staff listened without judgment. Having a safe place to sleep gave me the clarity I needed to start my life over.",
            name: "John L.",
            role: "Shelter Guest"
        },
        {
            id: 3,
            rating: 5,
            text: "Volunteering here showed me real impact. This is a place where dignity is restored, one person at a time.",
            name: "Daniel K.",
            role: "Volunteer"
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
        <section className="bg-neutral-950 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-50" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-yellow-400 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-4 tracking-tight">
                        Stories of <span className="text-yellow-400">Hope</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-xl mx-auto">
                        Real impact, told by the people who experienced it.
                    </p>
                </div>

                {/* Testimonials Container */}
                <div className="relative">

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 z-20 bg-neutral-900 border border-neutral-800 text-white hover:bg-yellow-400 hover:text-black rounded-full p-4 shadow-2xl transition-all duration-300 group"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 z-20 bg-neutral-900 border border-neutral-800 text-white hover:bg-yellow-400 hover:text-black rounded-full p-4 shadow-2xl transition-all duration-300 group"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {getVisibleTestimonials().map((testimonial, index) => (
                            <div
                                key={`${testimonial.id}-${index}`}
                                className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between hover:border-yellow-400/40 transition-all duration-500 group relative"
                            >
                                {/* Quote Icon decoration */}
                                <Quote className="absolute top-6 right-8 w-10 h-10 text-neutral-800 group-hover:text-yellow-400/10 transition-colors" />

                                <div>
                                    {/* Yellow Stars */}
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4 fill-yellow-400 text-yellow-400 shadow-yellow-500/20"
                                            />
                                        ))}
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-gray-200 text-lg font-medium italic leading-relaxed mb-8 relative z-10">
                                        "{testimonial.text}"
                                    </p>
                                </div>

                                {/* Author Info */}
                                <div className="flex items-center gap-4">
                                    {/* Yellow vertical accent bar */}
                                    <div className="h-12 w-1.5 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.4)]" />
                                    <div>
                                        <h4 className="text-white font-extrabold text-base tracking-wide">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-yellow-500/80 text-xs font-bold uppercase tracking-widest">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
