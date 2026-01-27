import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../shared/Button";

interface ContactInfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title: string;
  details: string[];
  isPrimary?: boolean;
}

const ContactInfoCard = ({
  icon: Icon,
  label,
  title,
  details,
  isPrimary = false,
}: ContactInfoCardProps) => {
  return (
    <div
      className={`group p-10 rounded-[2.5rem] transition-all duration-500 border ${
        isPrimary
          ? "bg-yellow-400 border-yellow-400 shadow-xl shadow-yellow-900/10"
          : "bg-white border-neutral-100 hover:border-yellow-400"
      }`}
    >
      <div className="flex items-center gap-5 mb-8">
        <div
          className={`${isPrimary ? "bg-black" : "bg-neutral-100"} p-4 rounded-2xl group-hover:scale-110 transition-transform`}
        >
          <Icon
            className={`w-6 h-6 ${isPrimary ? "text-yellow-400" : "text-black"}`}
          />
        </div>
        <div>
          <p
            className={`text-[10px] font-black uppercase tracking-widest ${isPrimary ? "text-black/60" : "text-neutral-400"}`}
          >
            {label}
          </p>
          <h3
            className={`text-xl font-black uppercase italic tracking-tight ${isPrimary ? "text-black" : "text-neutral-900"}`}
          >
            {title}
          </h3>
        </div>
      </div>
      <div className="space-y-1">
        {details.map((detail, index) => (
          <p
            key={index}
            className={`text-lg font-bold ${isPrimary ? "text-black" : "text-neutral-600"}`}
          >
            {detail}
          </p>
        ))}
      </div>
    </div>
  );
};

const ContactFormSection = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (status === "sending") return;
    setStatus("sending");
    setStatusMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      firstName: (formData.get("firstName") || "").toString().trim(),
      lastName: (formData.get("lastName") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      message: (formData.get("message") || "").toString().trim(),
      company: (formData.get("company") || "").toString(),
    };

    try {
      const response = await fetch("/api/forms/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Unable to submit the form.");
      }

      setStatus("sent");
      setStatusMessage("Message sent. We'll reply within 24 hours.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to submit the form.",
      );
    }
  };

  return (
    <section className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Form Side */}
          <div className="order-2 lg:order-1">
            <div className="mb-12">
              <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Send className="w-3 h-3" />
                Get In Touch
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">
                Ready to <span className="text-yellow-500">Make</span> <br /> A
                Difference?
              </h1>
              <p className="text-gray-500 text-lg font-medium max-w-md">
                We respond to questions, partnerships, and urgent needs within 24
                hours. Let us know how we can help.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name*"
                  required
                  className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name*"
                  required
                  className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address*"
                required
                className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
              />
              <textarea
                name="message"
                placeholder="How can we help you?*"
                rows={4}
                required
                className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all resize-none"
              />
              {status !== "idle" && (
                <p
                  className={`text-sm font-bold ${
                    status === "sent" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {statusMessage}
                </p>
              )}

              <Button
                type="submit"
                className="w-full py-6 bg-black text-black-400 hover:bg-neutral-800 rounded-[1.5rem] text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send Message"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          </div>

          {/* Map Side */}
          <div className="order-1 lg:order-2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-yellow-400/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-neutral-100 rounded-[3rem] overflow-hidden aspect-square border-8 border-white shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.578665042217!2d36.8833!3d-1.2833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1115!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1600000000000"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: "grayscale(1) contrast(1.2) invert(0.9)",
                  }}
                  allowFullScreen={true}
                  loading="lazy"
                  title="Nairobi Location Map"
                />
                {/* Location Tag */}
                <div className="absolute bottom-10 left-10 bg-black text-white p-6 rounded-[2rem] shadow-2xl border border-white/10">
                  <h4 className="font-black uppercase italic text-yellow-400 mb-1">
                    Our Base
                  </h4>
                  <p className="text-sm font-bold opacity-70">
                    Outer Ring Road,
                    <br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactInfoSection = () => {
  const quickLinks = [
    {
      id: 1,
      title: "Donate Items",
      description: "Food and clothing support",
      href: "/donate/items",
    },
    {
      id: 2,
      title: "Volunteer",
      description: "Give time and skills",
      href: "/volunteer",
    },
    {
      id: 3,
      title: "Donate",
      description: "Support our programs",
      href: "/donate",
    },
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: "24/7 Service",
      title: "Call Us",
      details: ["+254 718 421 205"],
    },
    {
      icon: Mail,
      label: "Drop a Line",
      title: "Email Us",
      details: ["uburumultimove@gmail.com"],
      isPrimary: true,
    },
    {
      icon: MapPin,
      label: "Visit Us",
      title: "Location",
      details: ["Outer Ring Road, Nairobi"],
    },
  ];

  return (
    <section className="pb-24 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-8 lg:col-span-2">
            {contactInfo.map((info, index) => (
              <ContactInfoCard key={index} {...info} />
            ))}
          </div>
          <div className="bg-neutral-950 text-white rounded-[2.5rem] p-10 shadow-2xl border border-neutral-900">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400 mb-4">
              Quick Actions
            </p>
            <h3 className="text-3xl font-black mb-4 tracking-tight">
              Find the right way to help
            </h3>
            <p className="text-neutral-300 text-sm font-medium mb-8">
              Choose the path that matches your heart. We’ll guide you to the
              right place.
            </p>
            <div className="space-y-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.href}
                  className="flex items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4 hover:border-yellow-400/70 hover:bg-neutral-900/70 transition-all"
                >
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-white">
                      {link.title}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-yellow-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSections = () => {
  return (
    <div className="bg-white">
      <ContactFormSection />
      <ContactInfoSection />
    </div>
  );
};

export default ContactSections;
