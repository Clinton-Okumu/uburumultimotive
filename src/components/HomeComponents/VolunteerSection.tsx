import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const VolunteerTeamSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const volunteers = [
        {
            id: 1,
            name: "Samuel Corwin",
            role: "Senior Manager",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80"
        },
        {
            id: 2,
            name: "Hilda Wunsch",
            role: "Volunteer",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80"
        },
        {
            id: 3,
            name: "Anita Gusikowski",
            role: "General Manager",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80"
        },
        {
            id: 4,
            name: "Anita Gusikowski",
            role: "General Manager",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === volunteers.length - 4 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? volunteers.length - 4 : prevIndex - 1
        );
    };

    const getVisibleVolunteers = () => {
        const visible = [];
        for (let i = 0; i < 4; i++) {
            const index = (currentIndex + i) % volunteers.length;
            visible.push(volunteers[index]);
        }
        return visible;
    };

    return (
        <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mb-6">
                        Meet our Volunteers
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        We Have a Volunteer Team
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Provide tips, articles, or expert advice on maintaining a healthy work-
                        <br />
                        life balance, managing, Workshops or seminars organizational.
                    </p>
                </div>

                {/* Volunteers Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 z-10 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-colors"
                        aria-label="Previous volunteers"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 z-10 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-colors"
                        aria-label="Next volunteers"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-900" />
                    </button>

                    {/* Volunteers Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getVisibleVolunteers().map((volunteer, index) => (
                            <div
                                key={`${volunteer.id}-${index}`}
                                className="group cursor-pointer"
                            >
                                {/* Image Container */}
                                <div className="relative overflow-hidden rounded-lg mb-4 aspect-[3/4]">
                                    <img
                                        src={volunteer.image}
                                        alt={volunteer.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Info Card */}
                                <div className="bg-white rounded-lg p-5 shadow-md text-center -mt-8 relative z-10 mx-4 transition-transform duration-300 group-hover:-translate-y-2">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {volunteer.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {volunteer.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerTeamSection;
