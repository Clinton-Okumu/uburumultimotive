import {
  ArrowRight,
  Clock,
  MapPin,
  Package,
  Send,
  Shirt,
  Truck,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import Button from "../shared/Button";

const DonationItemsSection = () => {
  const [donationCategory, setDonationCategory] = useState<"food" | "clothing">(
    "food",
  );
  const [donationType, setDonationType] = useState<"pickup" | "delivery">(
    "pickup",
  );

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
      category: donationCategory,
      deliveryMethod: donationType,
      company: (formData.get("company") || "").toString(),
    };

    try {
      const response = await fetch("/api/forms/donate-items.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Unable to submit the form.");
      }

      setStatus("sent");
      setStatusMessage("Thanks. We'll contact you to coordinate the donation.");
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
          <div className="order-2 lg:order-1">
            <div className="mb-12">
              <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Send className="w-3 h-3" />
                Donate Items
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">
                Donate <span className="text-yellow-500">Food</span> <br />& Clothing
              </h1>
              <p className="text-gray-500 text-lg font-medium max-w-md">
                Simple and easy — tell us what you’d like to donate and how you’d
                like to get it to us.
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

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDonationCategory("food")}
                  className={`py-5 px-6 rounded-[1.5rem] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-3 ${
                    donationCategory === "food"
                      ? "bg-yellow-400 text-black"
                      : "bg-neutral-50 text-gray-600 hover:bg-neutral-100"
                  }`}
                >
                  <Utensils className="w-6 h-6" />
                  Food
                </button>
                <button
                  type="button"
                  onClick={() => setDonationCategory("clothing")}
                  className={`py-5 px-6 rounded-[1.5rem] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-3 ${
                    donationCategory === "clothing"
                      ? "bg-yellow-400 text-black"
                      : "bg-neutral-50 text-gray-600 hover:bg-neutral-100"
                  }`}
                >
                  <Shirt className="w-6 h-6" />
                  Clothing
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDonationType("pickup")}
                  className={`py-4 px-4 rounded-[1.5rem] font-bold uppercase text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                    donationType === "pickup"
                      ? "bg-yellow-400 text-black"
                      : "bg-neutral-50 text-gray-600 hover:bg-neutral-100"
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  We’ll Pick Up
                </button>
                <button
                  type="button"
                  onClick={() => setDonationType("delivery")}
                  className={`py-4 px-4 rounded-[1.5rem] font-bold uppercase text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                    donationType === "delivery"
                      ? "bg-yellow-400 text-black"
                      : "bg-neutral-50 text-gray-600 hover:bg-neutral-100"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  I’ll Deliver
                </button>
              </div>

              {donationType === "pickup" && (
                <div className="p-5 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        Pickup Information
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Our team will contact you within 24 hours to schedule a
                        convenient pickup time and location.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {donationType === "delivery" && (
                <div className="p-5 bg-green-50 border-2 border-green-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        Delivery Information
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Please deliver your donation to our main center at Outer
                        Ring Road, Nairobi. We're open Mon-Sat, 8am-6pm.
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                disabled={status === "sending"}
                className="w-full py-6 bg-black text-black-400 hover:bg-neutral-800 rounded-[1.5rem] text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3"
              >
                {status === "sending" ? "Submitting..." : "Submit Donation"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          </div>

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

export default DonationItemsSection;
