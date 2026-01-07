import { motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  Home,
  Image as ImageIcon,
  Quote,
  Shirt,
  Users,
  Utensils,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import img1 from "../../assets/pic19.webp";
import img5 from "../../assets/pic2.webp";
import img2 from "../../assets/pic20.webp";
import img4 from "../../assets/pic3.webp";
import img6 from "../../assets/pic4.webp";
import img3 from "../../assets/pic6.webp";

const galleryImages = [
  {
    id: 1,
    image: img1,
    category: "Food",
    icon: Utensils,
    title: "Warm Meals for Families",
    description:
      "Served warm meals to 54 families facing homelessness in downtown Nairobi.",
    fullStory:
      "Our team of 12 volunteers gathered at the downtown shelter to prepare and serve 216 warm meals to 54 homeless families. The menu included hearty vegetable soup, fresh bread, and fruits. Children received special care packages with additional snacks. One mother shared, 'This meal means my children can sleep peacefully tonight.' The outreach is part of our food security program, aiming to provide consistent nutrition to those in need.",
    impact: { familiesHelped: 54, mealsServed: 216, volunteers: 12 },
    testimonial: "This meal means my children can sleep peacefully tonight.",
    testimonialAuthor: "Sarah M., Community Member",
  },
  {
    id: 2,
    image: img2,
    category: "Clothing",
    icon: Shirt,
    title: "Clothing for Children",
    description:
      "Distributed clothes to 32 children staying at our temporary shelter.",
    fullStory:
      "Thanks to generous donations from local retailers, we provided complete clothing sets to 32 children currently residing in our temporary shelter. Each child received 3-4 outfits including school uniforms, play clothes, and warm winter wear. Our volunteers ensured proper sizing and styling for each child. The joy on their faces as they tried on their new clothes was unforgettable. This initiative helps children maintain dignity and participate fully in school and community activities.",
    impact: { childrenHelped: 32, clothesProvided: 128, donors: 15 },
    testimonial: "Getting new clothes makes me feel like I belong.",
    testimonialAuthor: "David, Age 9",
  },
  {
    id: 3,
    image: img3,
    category: "Shelter",
    icon: Home,
    title: "Building New Homes",
    description:
      "Constructing 4 new housing units for displaced families.",
    fullStory:
      "Our shelter construction project is progressing rapidly. We're building 4 new housing units that will provide safe, dignified homes for 4 families currently in temporary shelters. Each unit includes 2 bedrooms, a kitchen, and proper sanitation. Local construction workers and volunteers work together, creating jobs while building homes. This project represents our commitment to providing sustainable, long-term solutions to homelessness.",
    impact: { familiesSupported: 4, unitsBuilt: 4, workers: 23 },
    testimonial: "Having a permanent home means everything to my family.",
    testimonialAuthor: "James O., Future Resident",
  },
  {
    id: 4,
    image: img4,
    category: "Therapy",
    icon: Heart,
    title: "Healing Together",
    description:
      "Group therapy session supported 28 community members in their journey.",
    fullStory:
      "Our group therapy session provided a safe space for 28 community members to share their struggles and find support. Led by licensed counselors, the session focused on trauma healing and building resilience. Participants formed support networks that continue beyond the sessions. 'I finally feel understood,' shared one participant. These sessions are free and open to anyone dealing with emotional challenges, grief, or stress.",
    impact: { participants: 28, sessionsHeld: 12, counselors: 3 },
    testimonial: "I finally feel understood and supported.",
    testimonialAuthor: "Grace K., Session Participant",
  },
  {
    id: 5,
    image: img5,
    category: "Community",
    icon: Users,
    title: "Community Celebration",
    description: "Annual gathering brought together 150+ community members.",
    fullStory:
      "Our annual community celebration was a resounding success! Over 150 community members gathered for a day of food, music, games, and connection. We provided free meals, organized children's activities, and distributed gifts to 40 families. The event strengthened community bonds and allowed people to celebrate resilience and progress together. Volunteers contributed 200+ hours to make this event possible. It was truly a day of hope and unity.",
    impact: { attendees: 150, familiesGifted: 40, volunteerHours: 200 },
    testimonial: "This event reminded me that we're not alone.",
    testimonialAuthor: "Community Member",
  },
  {
    id: 6,
    image: img6,
    category: "Volunteer",
    icon: Wrench,
    title: "Volunteer Impact",
    description: "35 volunteers improved shelter facilities for 65 residents.",
    fullStory:
      "35 dedicated volunteers spent the day improving our shelter facilities for 65 residents. Work included painting walls, fixing plumbing, repairing furniture, and deep-cleaning common areas. The improvements created a more welcoming and dignified environment. Residents expressed deep gratitude for the enhanced living conditions. 'It feels like a new home,' shared one elderly resident. Our volunteer program continues to be the backbone of our operations.",
    impact: { volunteers: 35, residentsBenefited: 65, tasksCompleted: 89 },
    testimonial: "It feels like a new home now.",
    testimonialAuthor: "Elderly Resident",
  },
];

const impactMetrics = [
  { value: 12, label: "Families Housed", icon: Home },
  { value: 1540, label: "Meals Delivered", icon: Utensils },
  { value: 210, label: "Children Clothed", icon: Shirt },
  { value: 4, label: "Shelters Built", icon: Wrench },
];

const GallerySection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);

  const categories = [
    "All",
    "Food",
    "Clothing",
    "Shelter",
    "Therapy",
    "Community",
    "Volunteer",
  ];

  const filteredImages = galleryImages.filter((img) => {
    const categoryMatch =
      selectedCategory === "All" || img.category === selectedCategory;
    return categoryMatch;
  });

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Impact Metrics Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every number represents a life changed through your generous
              support
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <metric.icon className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">
                  {metric.value.toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Stories of Change
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our updates to see the real impact of your
            support
          </p>
        </div>

        {/* Filters - Pills/Chips */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-yellow-400 text-gray-900 shadow-lg"
                    : "bg-white text-gray-600 border border-gray-300 hover:border-yellow-400 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              onClick={() => setSelectedImage(item)}
            >
              <div className="relative h-72 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-yellow-400 text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-lg">
                    <item.icon className="w-3 h-3" />
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-white/90 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 bg-white">
                <div className="flex items-center justify-end">
                  <button className="text-yellow-500 hover:text-yellow-600 font-semibold text-sm flex items-center gap-1 transition-colors">
                    View Full Story
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <p className="text-gray-500 text-xl font-medium">
              No stories found for this filter
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Detailed Story Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-4 -right-4 bg-white hover:bg-gray-100 rounded-full p-3 shadow-xl transition-colors z-10"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6 text-gray-900" />
              </button>

              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                {/* Image */}
                <div className="relative h-80 md:h-96">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide mb-3 flex items-center gap-2 w-fit">
                      <selectedImage.icon className="w-4 h-4" />
                      {selectedImage.category}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                      {selectedImage.title}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Impact Numbers */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 rounded-2xl p-6">
                    {Object.entries(selectedImage.impact).map(
                      ([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-3xl font-black text-gray-900">
                            {value as number}
                          </div>
                          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mt-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Full Story */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      The Full Story
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {selectedImage.fullStory}
                    </p>
                  </div>

                  {/* Testimonial */}
                  {selectedImage.testimonial && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl mb-6">
                      <Quote className="w-8 h-8 text-yellow-400 mb-3" />
                      <p className="text-gray-800 text-lg italic mb-3">
                        "{selectedImage.testimonial}"
                      </p>
                      <p className="text-gray-600 font-semibold text-sm">
                        — {selectedImage.testimonialAuthor}
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold uppercase tracking-wide py-4 px-8 rounded-xl transition-colors">
                      Make a Donation
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold uppercase tracking-wide py-4 px-8 rounded-xl transition-colors">
                      Volunteer With Us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;

