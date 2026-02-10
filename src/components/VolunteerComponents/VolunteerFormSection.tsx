import {
  ArrowRight,
  CalendarClock,
  HeartHandshake,
  Users,
} from "lucide-react";
import { useState } from "react";
import Button from "../shared/Button";

const VolunteerFormSection = () => {
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
    const firstName = (formData.get("firstName") || "").toString().trim();
    const lastName = (formData.get("lastName") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const location = (formData.get("location") || "").toString().trim();
    const availability = (formData.get("availability") || "").toString().trim();
    const frequency = (formData.get("frequency") || "").toString().trim();
    const interests = formData
      .getAll("interests")
      .map((v) => v.toString())
      .filter(Boolean);
    const message = (formData.get("message") || "").toString().trim();
    const company = (formData.get("company") || "").toString();

    const submitData = new FormData();
    submitData.set("firstName", firstName);
    submitData.set("lastName", lastName);
    submitData.set("name", `${firstName} ${lastName}`.trim());
    submitData.set("email", email);
    submitData.set("_replyto", email);
    submitData.set("phone", phone);
    submitData.set("location", location);
    submitData.set("availability", availability);
    submitData.set("frequency", frequency);
    submitData.set("interests", interests.join(", "));
    submitData.set("message", message);
    submitData.set("company", company);
    submitData.set("_subject", "Website: Volunteer form");

    try {
      const response = await fetch("https://formspree.io/f/xpqjaolz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: submitData,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMessage =
          data?.error ||
          data?.errors?.map?.((e: { message?: string }) => e?.message).filter(Boolean).join(", ") ||
          "Unable to submit the form.";
        throw new Error(errorMessage);
      }

      setStatus("sent");
      setStatusMessage(
        "Submitted successfully. Thanks for volunteering. We'll contact you soon.",
      );
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="order-2 lg:order-1">
            <div className="mb-12">
              <span className="inline-flex items-center gap-2 bg-neutral-900 text-yellow-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <HeartHandshake className="w-3 h-3" />
                Volunteer With Us
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">
                Give Your <span className="text-yellow-500">Time</span>,
                <br />
                Share Your Heart
              </h1>
              <p className="text-gray-500 text-lg font-medium max-w-md">
                Join a caring community serving families with shelter, meals, and
                support. Tell us how you want to help.
              </p>
            </div>

            <form
              onSubmit={handleFormSubmit}
              action="https://formspree.io/f/xpqjaolz"
              method="POST"
              className="space-y-6"
            >
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address*"
                  required
                  className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number*"
                  required
                  className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                />
              </div>
              <input
                type="text"
                name="location"
                placeholder="Location (City / Area)*"
                required
                className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  name="availability"
                  className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Availability*
                  </option>
                  <option value="weekday-mornings">Weekday mornings</option>
                  <option value="weekday-afternoons">Weekday afternoons</option>
                  <option value="weekends">Weekends</option>
                  <option value="flexible">Flexible</option>
                </select>
                <select
                  name="frequency"
                  className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Commitment*
                  </option>
                  <option value="one-time">One-time</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="bg-neutral-50 border border-neutral-100 rounded-[1.5rem] p-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 mb-4">
                  Areas of Interest
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold text-neutral-700">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="interests" value="meals" />
                    Meal Service
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="interests" value="outreach" />
                    Community Outreach
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="interests" value="shelter" />
                    Shelter Support
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="interests" value="admin" />
                    Admin & Logistics
                  </label>
                </div>
              </div>

              <textarea
                name="message"
                placeholder="Tell us about your skills or how you'd like to help"
                rows={4}
                className="w-full px-6 py-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all resize-none"
              />

              {status !== "idle" && (
                <div
                  className={`rounded-2xl px-5 py-4 text-sm font-bold border ${
                    status === "sent"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-6 bg-black text-black-400 hover:bg-neutral-800 rounded-[1.5rem] text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3"
              >
                {status === "sending" ? "Submitting..." : "Submit Volunteer Form"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="p-8 rounded-[2rem] border border-neutral-100 bg-white shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-100 p-3 rounded-2xl">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-neutral-900">
                  Why Volunteer
                </h3>
              </div>
              <p className="text-neutral-600 font-semibold">
                You help families access safe shelter, warm meals, and pathways
                to stability. Every shift is a step toward dignity.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] border border-neutral-900 bg-neutral-950 text-white shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-400 p-3 rounded-2xl">
                  <CalendarClock className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight">
                  What We Ask
                </h3>
              </div>
              <ul className="space-y-3 text-sm font-semibold text-neutral-200">
                <li>Be kind, consistent, and ready to serve.</li>
                <li>Respect privacy and dignity at all times.</li>
                <li>Minimum commitment: 3 hours per shift.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerFormSection;
