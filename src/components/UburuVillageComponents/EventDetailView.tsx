import { useState, type FormEvent, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Share2,
  User,
  Phone,
  Mail,
  Users,
  CheckCircle,
  CreditCard,
  Send,
  Maximize2,
  X,
  ChevronRight,
  Sparkles,
  Ticket,
  Info,
  ArrowLeft,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../shared/Button";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import { villageEventOptions } from "../../data/storefrontCatalog";

import glassdoor2Image from "../../assets/glassdoor2.webp";
import kidsImage from "../../assets/kids.webp";
import olooluaNatureTrail from "../../assets/oloolua.webp";
import paradiseLostImage from "../../assets/paradiselost.jpg";
import maaImage from "../../assets/maa.webp";

const PAYBILL_NO = "522522";
const ACCOUNT_NO = "1346356009";

export interface EventDetailData {
  id: string;
  optionId: string;
  title: string;
  image: string;
  location: string;
  datesText?: string;
  availableDates?: string[];
  host: string;
  price: number;
  currency: string;
  priceLabel: string;
  ticketName: string;
  ticketNote: string;
  description: string;
  highlights?: string[];
  minPeople?: number;
}

export const uburuEventsDetailData: Record<string, EventDetailData> = {
  "kids-outdoor-adventure": {
    id: "kids-outdoor-adventure",
    optionId: "kids-outdoor-adventure-resident",
    title: "Kids Outdoor & Wellness Adventure",
    image: kidsImage,
    location: "Kiambu Paradise lost",
    datesText: "",
    availableDates: [],
    host: "Uburu Village",
    price: 3500,
    currency: "KES",
    priceLabel: "KES 3,500 each",
    ticketName: "Kids Adventure Ticket",
    ticketNote: "Includes guided outdoor activities, art workshops & snacks",
    description:
      "A fun-filled therapeutic outdoor adventure tailored for children! Features nature exploration, creative arts, team bonding games, and guided mindfulness activities in a safe, nurturing environment. All proceeds directly support Uburu Village shelter and child support programs.",
    highlights: [
      "Guided nature walk & outdoor team games",
      "Creative arts, painting & glass craft sessions",
      "Mindfulness & emotional wellness activities for kids",
      "Healthy snacks & refreshments included",
      "Direct support to Uburu Village children's shelter",
    ],
    minPeople: 1,
  },
  "therapeutic-trip": {
    id: "therapeutic-trip",
    optionId: "therapeutic-trip-resident",
    title: "Therapeutic trip to (glassdoor Kitengela)",
    image: glassdoor2Image,
    location: "Kitengela Glass Trust (Anselm Hot Glass), Kajiado",
    datesText: "",
    availableDates: [],
    host: "Uburu Village",
    price: 4500,
    currency: "KES",
    priceLabel: "KES 4,500 each",
    ticketName: "Resident Ticket (Kitengela Excursion)",
    ticketNote: "Includes transport guidance, glass-blowing tour & therapeutic group session",
    description:
      "Join Uburu Village for an inspiring and restorative therapeutic trip to the world-famous Kitengela Glass (Anselm Hot Glass). Nestled on the edge of the Nairobi National Park, Kitengela Glass is a wonderland of mosaic pathways, handcrafted glass art, and stunning suspension bridges across deep gorges.\n\nThis trip is specially curated to combine artistic discovery, outdoor rejuvenation, and group therapeutic reflection. All proceeds support Uburu Village's community mental health and shelter initiatives.",
    highlights: [
      "Guided tour of Anselm Hot Glass studios & mosaic galleries",
      "Thrilling walk across the Kitengela suspension bridge",
      "Therapeutic group reflection & outdoor wellness activities",
      "Networking & community bonding surrounded by nature",
      "Direct support to Uburu Village's social impact projects",
    ],
    minPeople: 1,
  },
  "oloolua-nature-trail": {
    id: "oloolua-nature-trail",
    optionId: "oloolua-nature-trail-group",
    title: "Oloolua nature trail",
    image: olooluaNatureTrail,
    location: "Oloolua Nature Trail, Karen, Nairobi",
    datesText: "",
    availableDates: [],
    host: "Uburu Village",
    price: 4000,
    currency: "KES",
    priceLabel: "KES 4,000 each",
    ticketName: "Group Pass (Min 5 People)",
    ticketNote: "Group bookings: minimum 5 participants required",
    description:
      "Escape the bustle of the city into the lush greenery of Oloolua Forest in Karen. Enjoy guided forest walks, natural caves exploration, waterfall views, and peaceful bamboo groves. Perfect for groups, families, and mental wellness seekers.",
    highlights: [
      "2-hour guided forest hike & cave exploration",
      "Waterfall views & bamboo garden relaxation",
      "Mindfulness & team wellness exercises",
      "Group package discount",
    ],
    minPeople: 5,
  },
  "paradise-lost": {
    id: "paradise-lost",
    optionId: "paradise-lost-resident",
    title: "Paradise Lost excursion",
    image: paradiseLostImage,
    location: "Paradise Lost Resort, Kiambu Road, Kiambu",
    datesText: "",
    availableDates: [],
    host: "Uburu Village",
    price: 3500,
    currency: "KES",
    priceLabel: "KES 3,500 each",
    ticketName: "Resident Excursion Ticket",
    ticketNote: "Covers park entry, cave tour, boat ride & group activities",
    description:
      "A full-day adventure at Paradise Lost Kiambu. Features ancient Stone Age caves, natural waterfalls, boat rides on the lake, coffee farm tours, and refreshing outdoor group therapy sessions in nature.",
    highlights: [
      "Prehistoric Stone Age cave tour",
      "Boating on the peaceful lake & waterfall views",
      "Coffee farm walk & outdoor team bonding",
      "Therapeutic group wellness session",
    ],
    minPeople: 1,
  },
  "maasai-mara": {
    id: "maasai-mara",
    optionId: "maasai-mara-daily-group-departures-2026",
    title: "Maasai Mara Migration Season",
    image: maaImage,
    location: "Maasai Mara National Reserve, Kenya",
    datesText: "",
    availableDates: [],
    host: "Uburu Village",
    price: 27500,
    currency: "KES",
    priceLabel: "From KES 27,500",
    ticketName: "Migration Tour Pass",
    ticketNote: "Covers transport, tented camp stay, park fees & game drives",
    description:
      "Witness the Eighth Wonder of the World! Experience the legendary Great Wildebeest Migration across the Mara River. Includes budget or luxury tented camp accommodation, game drives, park fees, and professional safari guide.",
    highlights: [
      "Great Wildebeest Migration river crossing views",
      "Full day game drives in Maasai Mara National Reserve",
      "Comfortable tented camp accommodation & meals",
      "Professional safari guide & transport",
    ],
    minPeople: 1,
  },
};

interface EventDetailViewProps {
  eventId?: string;
  onClose?: () => void;
}

export default function EventDetailView({ eventId = "therapeutic-trip", onClose }: EventDetailViewProps) {
  const navigate = useNavigate();
  const event = uburuEventsDetailData[eventId] || uburuEventsDetailData["therapeutic-trip"];

  const [peopleCount, setPeopleCount] = useState<number>(event.minPeople || 1);

  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    age: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"details" | "mpesa_instructions">("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingDPO, setIsProcessingDPO] = useState(false);
  const [activeZoomImage, setActiveZoomImage] = useState<string | null>(null);

  const unitPrice = event.price;

  const totalAmount = useMemo(() => {
    const minP = event.minPeople || 1;
    const count = Math.max(minP, peopleCount);
    return unitPrice * count;
  }, [unitPrice, peopleCount, event.minPeople]);

  const formatAmount = (amount: number, currency: string = "KES") => {
    const locale = currency === "KES" ? "en-KE" : "en-US";
    return `${currency} ${amount.toLocaleString(locale)}`;
  };

  const { addToCart, updateQuantity } = useStorefrontCheckout({
    catalog: villageEventOptions.map(({ id, name, price }) => ({ id, name, price })),
    context: "uburu_village",
    purchaseType: "event_purchase",
    emptyCartMessage: "Please add at least one package to your cart.",
    storageKey: "uburu_village_cart",
  });

  const handleShare = (platform?: string) => {
    const shareUrl = window.location.href;
    const shareText = `Check out "${event.title}" with Uburu Village! ${shareUrl}`;

    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
    } else if (platform === "email") {
      window.open(`mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(shareText)}`, "_blank");
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success("Event link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  const validateForm = () => {
    if (!bookingForm.fullName.trim() || !bookingForm.phone.trim() || !bookingForm.email.trim()) {
      toast.error("Please fill in your Full Name, Phone Number, and Email.");
      return false;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the Travel Program Terms and Conditions.");
      return false;
    }
    return true;
  };

  const submitFormspree = async () => {
    const submitData = new FormData();
    submitData.append("eventName", event.title);
    submitData.append("fullName", bookingForm.fullName.trim());
    submitData.append("phone", bookingForm.phone.trim());
    submitData.append("email", bookingForm.email.trim());
    submitData.append("age", bookingForm.age.trim() || "N/A");
    submitData.append("peopleCount", String(peopleCount));
    submitData.append("totalAmount", formatAmount(totalAmount, event.currency));
    submitData.append("_subject", `New Event Booking: ${event.title}`);

    try {
      await fetch(import.meta.env.VITE_FORMSPREE_VILLAGE_BOOKING_URL || "https://formspree.io/f/xpqjaolz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: submitData,
      });
    } catch (err) {
      console.error("Formspree submit error:", err);
    }
  };

  const handlePayDPO = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessingDPO(true);
    const toastId = toast.loading("Saving registration & connecting to DPO payment...");

    await submitFormspree();

    try {
      const response = await fetch("/api/dpo/create-token.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: event.currency,
          customer: {
            name: bookingForm.fullName.trim(),
            email: bookingForm.email.trim(),
            phone: bookingForm.phone.trim() || undefined,
          },
          context: "uburu_village",
          meta: {
            type: "event_purchase",
            itemCount: peopleCount,
            items: [
              {
                itemId: event.optionId,
                itemName: event.title,
                quantity: peopleCount,
                unitPrice: unitPrice,
                totalAmount: totalAmount,
              },
            ],
            totalAmount: totalAmount,
          },
        }),
      });

      if (!response.ok) throw new Error("Payment gateway error");

      const data = await response.json();
      toast.dismiss(toastId);
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
    } catch (error) {
      console.error("DPO Error:", error);
      toast.dismiss(toastId);
      updateQuantity(event.optionId, peopleCount);
      addToCart(event.optionId);
      navigate("/checkout?source=village");
    } finally {
      setIsProcessingDPO(false);
    }
  };

  const handleShowMpesaInstructions = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Saving registration details...");
    await submitFormspree();
    toast.success("Registration details saved!", { id: toastId });
    setIsSubmitting(false);
    setPaymentStep("mpesa_instructions");
  };

  const handleWhatsAppConfirmation = () => {
    const msg = `*UBURU VILLAGE EVENT BOOKING*%0A%0A*Event:* ${event.title}%0A*Name:* ${bookingForm.fullName}%0A*Phone:* ${bookingForm.phone}%0A*Email:* ${bookingForm.email}%0A*Tickets:* ${peopleCount}%0A*Total Paid:* ${formatAmount(totalAmount, event.currency)}%0A%0A_Payment made via Mpesa Paybill 522522, Acc 1346356009._`;
    window.open(`https://wa.me/254718421205?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#1c3b57]">
      {/* Dark Brand Hero Header */}
      <section className="relative overflow-hidden bg-[#0f2b41] pt-28 pb-12 sm:pt-36 sm:pb-16 text-white border-b border-[#2f6f99]/30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#f2c15d]/15 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#2f6f99]/20 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation inside Hero */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#f2c15d]/90">
              <Link to="/get/village" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Uburu Village
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-white/40" />
              <Link to="/get/village#events" className="hover:text-white transition-colors">
                Events
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-white/40" />
              <span className="text-white font-extrabold truncate max-w-[200px] sm:max-w-none">{event.title}</span>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <X className="h-4 w-4" /> Close
              </button>
            )}
          </div>

          {/* Event Main Title & Meta */}
          <div className="max-w-4xl">
            <span className="inline-block rounded-full bg-[#f2c15d]/20 px-4 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-[#f2c15d] mb-4 border border-[#f2c15d]/30">
              Featured Village Event
            </span>
            <h1 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl uppercase tracking-tight leading-tight">
              {event.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-white/85">
              <div className="flex items-center gap-2 text-[#f2c15d]">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="font-bold text-white/95">{event.location}</span>
              </div>
              {event.datesText && (
                <div className="flex items-center gap-2 text-white/80">
                  <span>{event.datesText}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white/80">
                <Sparkles className="h-4 w-4 shrink-0 text-[#f2c15d]" />
                <span>Hosted by <strong className="text-white">{event.host}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column (Image Poster, Share, Description, Highlights) */}
          <div className="space-y-8 lg:col-span-7">
            {/* Event Poster Image */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#dbe7f3] bg-white shadow-xl">
              <img
                src={event.image}
                alt={event.title}
                className="h-[360px] sm:h-[480px] w-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <button
                onClick={() => setActiveZoomImage(event.image)}
                className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-[#1c3b57] shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:bg-white"
              >
                <Maximize2 className="h-4 w-4 text-[#2f6f99]" /> View Full Poster
              </button>
            </div>

            {/* Social Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dbe7f3] bg-white p-5 shadow-sm">
              <span className="text-xs font-black uppercase tracking-widest text-[#1c3b57] flex items-center gap-2">
                <Share2 className="h-4 w-4 text-[#2f6f99]" /> Share Event:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleShare("facebook")}
                  className="rounded-xl bg-[#1877F2]/10 p-2.5 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
                  title="Share on Facebook"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare("instagram")}
                  className="rounded-xl bg-pink-50 p-2.5 text-pink-600 hover:bg-pink-100 transition-colors"
                  title="Share on Instagram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="rounded-xl bg-[#0A66C2]/10 p-2.5 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors"
                  title="Share on LinkedIn"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="rounded-xl bg-gray-100 p-2.5 text-black hover:bg-gray-200 transition-colors"
                  title="Share on X"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="rounded-xl bg-[#25D366]/10 p-2.5 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                  title="Share on WhatsApp"
                >
                  <Send className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare()}
                  className="flex items-center gap-1.5 rounded-xl border border-[#2f6f99]/30 bg-[#f0f6fc] px-3.5 py-2 text-xs font-bold text-[#2f6f99] hover:bg-[#2f6f99]/10 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Host Section */}
            <div className="rounded-3xl border border-[#dbe7f3] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 rounded-full bg-[#f2c15d]" />
                <div>
                  <h3 className="text-lg font-black text-[#1c3b57]">Hosted By</h3>
                  <p className="text-sm font-bold text-[#2f6f99] flex items-center gap-1.5 mt-0.5">
                    <Sparkles className="h-4 w-4 text-[#f2c15d]" /> {event.host}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="rounded-3xl border border-[#dbe7f3] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-1 rounded-full bg-[#f2c15d]" />
                <h3 className="text-xl font-black text-[#1c3b57]">Event Description</h3>
              </div>
              <div className="space-y-4 text-sm sm:text-base font-semibold leading-relaxed text-[#5c6f86] whitespace-pre-line">
                {event.description}
              </div>

              {event.highlights && (
                <div className="mt-8 rounded-2xl bg-[#f0f6fc] p-6 border border-[#d5e3f1]">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#1c3b57] mb-4 flex items-center gap-2">
                    <Info className="h-4.5 w-4.5 text-[#2f6f99]" /> Event Experience Highlights
                  </h4>
                  <ul className="grid gap-3 text-xs sm:text-sm font-bold text-[#2d4d6e]">
                    {event.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Ticket Booking Box) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="sticky top-28 overflow-hidden rounded-3xl border border-[#dbe7f3] bg-white shadow-2xl">
              {/* Card Title Header Banner */}
              <div className="bg-gradient-to-br from-[#0f2b41] via-[#1c3b57] to-[#12334e] p-6 sm:p-7 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#f2c15d]">Ticket Reservation</span>
                <h2 className="mt-1 text-2xl font-black text-white">Get your tickets to {event.title}</h2>
                <p className="mt-2 text-xs font-semibold text-white/80">Kindly indicate how many tickets you would like</p>
              </div>

              <div className="p-6 sm:p-7 space-y-6">
                {/* Available Dates Section (Only rendered if dates exist) */}
                {event.availableDates && event.availableDates.length > 0 && (
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-[#1c3b57] block mb-3">Dates</label>
                    <div className="flex flex-wrap gap-3">
                      {event.availableDates.map((dateStr, idx) => (
                        <div
                          key={idx}
                          className="text-xs font-extrabold px-4 py-2.5 rounded-xl border border-[#f2c15d] bg-[#f2c15d]/15 text-[#1c3b57]"
                        >
                          {dateStr}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ticket Item Pricing Box */}
                <div className="rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dbe7f3] pb-4">
                    <div>
                      <h4 className="text-sm font-black text-[#1c3b57]">{event.ticketName}</h4>
                      <p className="text-[11px] font-semibold text-[#5c6f86] mt-0.5">{event.ticketNote}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#1c3b57]">{formatAmount(unitPrice, event.currency)}</div>
                    </div>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-xs font-black uppercase text-[#5c6f86] flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-[#2f6f99]" /> Quantity
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPeopleCount(Math.max(event.minPeople || 1, peopleCount - 1))}
                        className="h-9 w-9 rounded-xl border border-gray-300 bg-white font-black text-[#1c3b57] shadow-sm hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-black text-[#1c3b57] min-w-[24px] text-center">{peopleCount}</span>
                      <button
                        type="button"
                        onClick={() => setPeopleCount(peopleCount + 1)}
                        className="h-9 w-9 rounded-xl border border-gray-300 bg-white font-black text-[#1c3b57] shadow-sm hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Details Form */}
                {paymentStep === "details" ? (
                  <form onSubmit={handlePayDPO} className="space-y-4 pt-3 border-t border-gray-100">
                    <h3 className="text-center text-sm font-black uppercase tracking-wider text-[#1c3b57]">Enter your details</h3>

                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={bookingForm.fullName}
                        onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-xs font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email address"
                        required
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-xs font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          required
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-10 pr-3 text-xs font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                        />
                      </div>

                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          placeholder="Age"
                          min={1}
                          value={bookingForm.age}
                          onChange={(e) => setBookingForm({ ...bookingForm, age: e.target.value })}
                          className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-10 pr-3 text-xs font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                        />
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        id="event_terms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#2f6f99] focus:ring-[#2f6f99]"
                      />
                      <label htmlFor="event_terms" className="text-[11px] font-semibold text-gray-600 leading-snug">
                        I have read and agree to{" "}
                        <Link
                          to="/get/village/terms"
                          target="_blank"
                          className="text-[#2f6f99] underline decoration-[#f2c15d] decoration-2 underline-offset-2 hover:text-[#1c3b57]"
                        >
                          Travel Program Terms and Conditions
                        </Link>
                        .
                      </label>
                    </div>

                    {/* Total Summary */}
                    <div className="flex items-center justify-between rounded-2xl bg-[#f2c15d]/15 p-4 border border-[#f2c15d]/30">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-[#7a5d00]">Total Amount</p>
                        <p className="text-2xl font-black text-[#1c3b57]">{formatAmount(totalAmount, event.currency)}</p>
                      </div>
                      <Ticket className="h-8 w-8 text-[#f2c15d]" />
                    </div>

                    {/* Submit Buttons */}
                    <div className="space-y-3 pt-2">
                      <Button
                        type="submit"
                        disabled={isProcessingDPO || !agreedToTerms}
                        className="w-full bg-[#f2c15d] py-4 text-xs font-black uppercase tracking-[0.25em] text-[#1c3b57] hover:bg-[#ffd886] disabled:opacity-50 transition-colors shadow-md"
                      >
                        {isProcessingDPO ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1c3b57] border-t-transparent" />
                            Connecting to DPO...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <CreditCard className="h-4 w-4" /> Pay Online (DPO / Card)
                          </span>
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={handleShowMpesaInstructions}
                        disabled={isSubmitting || !agreedToTerms}
                        className="w-full rounded-2xl border border-emerald-600/30 bg-emerald-50 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-emerald-800 hover:bg-emerald-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Lock className="h-3.5 w-3.5" /> Pay via Mpesa Paybill
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Mpesa Instructions Step */
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <h4 className="font-black text-emerald-900 text-sm">Mpesa Paybill Instructions</h4>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-emerald-200/60">
                          <span className="font-bold text-emerald-800 uppercase">Paybill No:</span>
                          <span className="font-black text-emerald-950 text-sm">{PAYBILL_NO}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-emerald-200/60">
                          <span className="font-bold text-emerald-800 uppercase">Account No:</span>
                          <span className="font-black text-emerald-950 text-sm">{ACCOUNT_NO}</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="font-bold text-emerald-800 uppercase">Amount:</span>
                          <span className="font-black text-emerald-950 text-sm">{formatAmount(totalAmount, event.currency)}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-center text-xs font-semibold text-gray-600">
                      After completing the Mpesa payment on your phone, click below to confirm via WhatsApp.
                    </p>

                    <Button
                      onClick={handleWhatsAppConfirmation}
                      className="w-full bg-[#25D366] py-3.5 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-[#20bd5a]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" /> Send Payment to WhatsApp
                      </span>
                    </Button>

                    <button
                      type="button"
                      onClick={() => setPaymentStep("details")}
                      className="w-full text-xs font-black uppercase tracking-wider text-gray-500 hover:text-gray-800 text-center block"
                    >
                      Back to details
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Full Image Zoom Modal */}
      {activeZoomImage && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 p-4 sm:p-10">
          <button
            onClick={() => setActiveZoomImage(null)}
            className="absolute right-6 top-6 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={activeZoomImage}
            alt="Full poster zoom"
            className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
