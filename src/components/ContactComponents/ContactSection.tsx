import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import Button from "../shared/Button";

interface ContactInfoCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    title: string;
    details: string[];
    bgColor?: string;
}

// ContactInfoCard Component
const ContactInfoCard = ({ icon: Icon, label, title, details, bgColor = "bg-black" }: ContactInfoCardProps) => {
    return (
        <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
                <div className={`${bgColor} rounded-xl p-4`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>
            </div>
            <div className="w-12 h-1 bg-yellow-400 mb-6" />
            <div className="space-y-2">
                {details.map((detail: string, index: number) => (
                    <p key={index} className="text-gray-700">
                        {detail}
                    </p>
                ))}
            </div>
        </div>
    );
};

// ContactInfoSection Component
const ContactInfoSection = () => {
    const contactInfo = [
        {
            icon: Phone,
            label: "24/7 Service",
            title: "Call Us Today",
            details: ["+00 123 456 789", "+00 987 654 321"],
            bgColor: "bg-black",
        },
        {
            icon: Mail,
            label: "Drop Line",
            title: "Mail Information",
            details: ["info@charity.com", "Infocharity@gmail.com"],
            bgColor: "bg-yellow-400",
        },
        {
            icon: MapPin,
            label: "Address",
            title: "Our Location",
            details: ["8708 Technology Forest Pl Suite 125-G, The Woodlands, TX 77381"],
            bgColor: "bg-black",
        },
    ];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {contactInfo.map((info, index) => (
                        <ContactInfoCard key={index} {...info} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// ContactFormSection Component
const ContactFormSection = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        amount: "",
        donationTo: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Thank you for reaching out! We'll get back to you soon.");
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            amount: "",
            donationTo: "",
            message: "",
        });
    };

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Map Side */}
                    <div className="relative">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg lg:sticky lg:top-8">
                            {/* Header Card */}
                            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-4 z-10 max-w-xs">
                                <h3 className="font-bold text-gray-900 mb-1">Kahawa</h3>
                                <p className="text-sm text-gray-600 mb-2">Nairobi, Kenya</p>
                                <a href="#" className="text-blue-600 text-sm hover:underline">
                                    Directions
                                </a>
                                <a href="#" className="text-blue-600 text-sm hover:underline block mt-1">
                                    View larger map
                                </a>
                            </div>

                            {/* Map */}

                            <div className="w-full h-[500px] bg-gradient-to-br from-teal-100 via-blue-50 to-blue-100 relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.839061827877!2d36.89692451053871!3d-1.1886469776264585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3e5442ecd4c7%3A0x7e1a974a8545538f!2sKahawa%20West%2C%20Githurai!5e0!3m2!1sen!2ske!4v1765262671911!5m2!1sen!2ske"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                     allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Los Angeles Map"
                                />
                            </div>
                        </div>
                    </div>


                    {/* Form Side */}
                    <div>
                        <div className="mb-8">
                            <div className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mb-6">
                                Contact Us
                            </div>


                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Reach Together, We Can Make a Difference
                            </h2>
                            <p className="text-gray-600">
                                We're here to answer questions, provide information about our work, and help you find ways to get involved whether interested.
                            </p>
                        </div>

                         <form onSubmit={handleSubmit} className="space-y-6 font-bold">
                             {/* Name Fields */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <input
                                     type="text"
                                     name="firstName"
                                     value={formData.firstName}
                                     onChange={handleChange}
                                     placeholder="First Name*"
                                     required
                                     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                 />
                                 <input
                                     type="text"
                                     name="lastName"
                                     value={formData.lastName}
                                     onChange={handleChange}
                                     placeholder="Last Name*"
                                     required
                                     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                 />
                             </div>

                             {/* Email and Amount */}
                             <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                 <input
                                     type="email"
                                     name="email"
                                     value={formData.email}
                                     onChange={handleChange}
                                     placeholder="Email Address*"
                                     required
                                     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                 />
                             </div>

                             {/* Message Field */}
                             <textarea
                                 name="message"
                                 value={formData.message}
                                 onChange={handleChange}
                                 placeholder="How can we help you?*"
                                 required
                                 rows={5}
                                 className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
                             />

                             {/* Submit Button */}
                             <Button type="submit">
                                 Send Now
                                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                             </Button>
                         </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Main Component
const ContactSections = () => {
    return (
        <div>
            <ContactFormSection />
            <ContactInfoSection />
        </div>
    );
};

export default ContactSections;
