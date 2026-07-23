import { useState, type FormEvent, useMemo } from "react";
import { Ticket, X, Maximize2, Share2, User, Phone, Mail, Users, CheckCircle, CreditCard, Send } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../shared/Button";
import toast from "react-hot-toast";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import { villageEventOptions, type VillageEventOption } from "../../data/storefrontCatalog";
import olooluaNatureTrail from "../../assets/oloolua.webp";
import kidsImage from "../../assets/kids.webp";
import maa from "../../assets/maa.webp";
import therapeuticTripImage from "../../assets/glassdoor2.webp";
import paradiseLostImage from "../../assets/paradiselost.jpg";

const PAYBILL_NO = "522522";
const ACCOUNT_NO = "1346356009";

const clampPeopleCount = (value: number, min: number) => Math.max(min, Math.min(99, value));

const formatAmount = (amount: number, currency: string = "KES") => {
  const locale = currency === "KES" ? "en-KE" : "en-US";
  return `${currency} ${amount.toLocaleString(locale)}`;
};

type BookingStep = "register" | "payment" | "mpesa_instructions";

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [bookingEvent, setBookingEvent] = useState<VillageEventOption | null>(null);
  const [bookingStep, setBookingStep] = useState<BookingStep>("register");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    age: "",
    peopleCount: 1,
  });

  const activeTotal = useMemo(() => {
    if (!bookingEvent) return 0;
    const minPeople = bookingEvent.id === "oloolua-nature-trail-group" ? 5 : 1;
    return bookingEvent.price * Math.max(minPeople, bookingForm.peopleCount);
  }, [bookingEvent, bookingForm.peopleCount]);

  const { cartItemCount, updateQuantity, addToCart } = useStorefrontCheckout({
    catalog: villageEventOptions.map(({ id, name, price }) => ({ id, name, price })),
    context: "uburu_village",
    purchaseType: "event_purchase",
    emptyCartMessage: "Please add at least one package to your cart.",
    storageKey: "uburu_village_cart",
  });

  const goToCheckout = () => {
    navigate("/checkout?source=village");
  };

  const goToMaasaiPackage = () => {
    navigate("/get/village/maasai-mara");
  };

  const handleShareEvent = (eventId: string, eventName: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#${eventId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success(`Link for "${eventName}" copied to clipboard!`);
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const openBooking = (event: VillageEventOption) => {
    setBookingEvent(event);
    setBookingStep("register");
    setAgreedToTerms(false);
    setBookingForm({
      fullName: "",
      phone: "",
      email: "",
      age: "",
      peopleCount: event.id === "oloolua-nature-trail-group" ? 5 : 1,
    });
  };

  const closeBooking = () => {
    setBookingEvent(null);
    setBookingStep("register");
    setAgreedToTerms(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!bookingForm.fullName || !bookingForm.phone || !bookingForm.age) {
      toast.error("Please fill in your name, phone number and age.");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the Travel Program Terms and Conditions.");
      return;
    }

    if (!bookingEvent) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Saving your booking details...");

    const submitData = new FormData();
    submitData.append("eventName", bookingEvent.name);
    submitData.append("fullName", bookingForm.fullName.trim());
    submitData.append("phone", bookingForm.phone.trim());
    submitData.append("email", bookingForm.email.trim());
    submitData.append("age", bookingForm.age);
    submitData.append("peopleCount", String(bookingForm.peopleCount));
    submitData.append("totalAmount", formatAmount(activeTotal, bookingEvent.currency));
    submitData.append("_subject", `New Booking: ${bookingEvent.name}`);

    try {
      await fetch(import.meta.env.VITE_FORMSPREE_VILLAGE_BOOKING_URL || "https://formspree.io/f/xpqjaolz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: submitData,
      });
      toast.success("Booking details saved!", { id: toastId });
    } catch (error) {
      console.error("Formspree submission error:", error);
      toast.error("Failed to save booking details, but you can still proceed to payment.", { id: toastId });
    } finally {
      setIsSubmitting(false);
      setBookingStep("payment");
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleOnlinePayment = async () => {
    if (!bookingEvent) return;

    // For the glassdoor event (Therapeutic Trip), we bypass the checkout tray and go directly to DPO
    if (bookingEvent.id === "therapeutic-trip-resident") {
      setIsProcessing(true);
      try {
        const response = await fetch("/api/dpo/create-token.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: activeTotal,
            currency: "KES",
            customer: {
              name: bookingForm.fullName.trim(),
              email: bookingForm.email.trim(),
              phone: bookingForm.phone.trim() || undefined,
            },
            context: "uburu_village",
            meta: {
              type: "event_purchase",
              itemCount: bookingForm.peopleCount,
              items: [
                {
                  itemId: bookingEvent.id,
                  itemName: bookingEvent.name,
                  quantity: bookingForm.peopleCount,
                  unitPrice: bookingEvent.price,
                  totalAmount: activeTotal,
                },
              ],
              totalAmount: activeTotal,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to start payment session.");
        }

        const data = await response.json();
        if (data?.paymentUrl) {
          window.location.href = data.paymentUrl;
          return;
        }
      } catch (error) {
        toast.error("Failed to start payment. Please try again.");
        setIsProcessing(false);
      }
      return;
    }

    // Default behavior for other events
    updateQuantity(bookingEvent.id, bookingForm.peopleCount);
    addToCart(bookingEvent.id);
    goToCheckout();
  };

  const handleWhatsAppShare = () => {
    if (!bookingEvent) return;
    const message = `*UBURU VILLAGE BOOKING*%0A%0A*Event:* ${bookingEvent.name}%0A*Name:* ${bookingForm.fullName}%0A*Phone:* ${bookingForm.phone}%0A*People:* ${bookingForm.peopleCount}%0A*Total:* ${formatAmount(activeTotal, bookingEvent.currency)}%0A%0A_I have made the payment via Mpesa Paybill 522522, Acc 1346356009._`;
    window.open(`https://wa.me/254718421205?text=${message}`, "_blank"); // Replace with actual admin number
  };

  const events = [
    {
      id: "oloolua-nature-trail",
      title: "Oloolua nature trail",
      image: olooluaNatureTrail,
      optionId: "oloolua-nature-trail-group",
      tag: "Uburu Village",
      priceLabel: "KES 4,000 each",
      description: "Group bookings: min 5 people",
      minPeople: 5,
    },
    {
      id: "kids-outdoor-adventure",
      title: "Kids Outdoor & Wellness Adventure",
      image: kidsImage,
      optionId: "kids-outdoor-adventure-resident",
      tag: "Uburu Village",
      priceLabel: "KES 3,500 each",
      description: "Outdoor fun, arts & mindfulness for children",
      minPeople: 1,
    },
    {
      id: "therapeutic-trip",
      title: "Therapeutic trip to (glassdoor Kitengela)",
      image: therapeuticTripImage,
      optionId: "therapeutic-trip-resident",
      tag: "Uburu Village",
      priceLabel: "KES 4,500 each",
      description: "",
      minPeople: 1,
    },
    {
      id: "paradise-lost",
      title: "Paradise Lost excursion",
      image: paradiseLostImage,
      optionId: "paradise-lost-resident",
      tag: "Uburu Village",
      priceLabel: "KES 3,500 each",
      description: "",
      minPeople: 1,
    },
  ];

  return (
    <section id="events" className="relative bg-[#f8fbff] px-6 py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#f2c15d]/30 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#2f6f99]/15 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5c6f86]">Featured events</p>
            <h2 className="mt-3 text-3xl font-black text-[#1c3b57] sm:text-4xl">
              Outdoor events for every kind of explorer.
            </h2>
            <p className="mt-3 max-w-xl text-base font-semibold text-[#5c6f86]">
              Handpicked experiences to support our shelter and therapeutic programs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={goToCheckout}
              className="bg-[#f2c15d] px-6 py-3 text-xs font-black uppercase tracking-[0.25em] text-[#1c3b57] hover:bg-[#ffd886]"
            >
              <span className="inline-flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Checkout ({cartItemCount})
              </span>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event) => {
            const option = villageEventOptions.find(o => o.id === event.optionId);
            return (
              <div key={event.id} id={event.id} className="group flex flex-col overflow-hidden rounded-3xl border border-[#dbe7f3] bg-white shadow-lg transition-all hover:border-[#2f6f99]/50">
                <div 
                  className="relative h-56 cursor-zoom-in overflow-hidden"
                  onClick={() => setActiveImage(event.image)}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="rounded-full bg-white/90 p-3 text-[#1c3b57] shadow-xl">
                      <Maximize2 className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-grow flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-black text-[#1c3b57] flex items-center gap-2">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#6a7c92]">{event.tag}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="rounded-2xl bg-[#f2c15d]/20 px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7a5d00]">
                        {event.priceLabel}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleShareEvent(event.id, event.title)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#2f6f99]/20 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#2f6f99] hover:bg-[#2f6f99]/5 transition-colors"
                        title="Share event"
                      >
                        <Share2 className="h-3 w-3" />
                        Share
                      </button>
                    </div>
                  </div>

                  {event.description && (
                    <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#5c6f86]">
                      {event.description}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-2">
                    <Button
                      onClick={() => navigate(`/get/village/event/${event.id}`)}
                      className="w-full bg-[#1c3b57] py-3 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-[#2a4d6e]"
                    >
                      View Event Details
                    </Button>
                    <button
                      type="button"
                      onClick={() => option && openBooking(option)}
                      className="w-full py-2 text-[11px] font-black uppercase tracking-widest text-[#2f6f99] hover:text-[#1c3b57] text-center"
                    >
                      Quick Book
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Maasai Mara Migration Card */}
          <div id="maasai-mara" className="group flex flex-col overflow-hidden rounded-3xl border border-[#e6eef7] bg-white shadow-lg transition-all hover:border-[#f2c15d]/50">
            <div 
              className="relative h-56 cursor-zoom-in overflow-hidden"
              onClick={() => setActiveImage(maa)}
            >
              <img
                src={maa}
                alt="Maasai Mara Migration Season"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="rounded-full bg-white/90 p-3 text-[#1c3b57] shadow-xl">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="flex flex-grow flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black text-[#1c3b57] flex items-center gap-2">
                    Maasai Mara Migration
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#6a7c92]">Uburu Village</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="rounded-2xl bg-[#f2c15d]/20 px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7a5d00]">
                    From KES 27.5k
                  </div>
                  <button
                    type="button"
                    onClick={() => handleShareEvent("maasai-mara", "Maasai Mara Migration")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#2f6f99]/20 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#2f6f99] hover:bg-[#2f6f99]/5 transition-colors"
                    title="Share event"
                  >
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f5f9ff] px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#5c6f86]">
                Multiple camps & residency options.
              </div>

              <Button
                onClick={goToMaasaiPackage}
                className="mt-8 w-full bg-[#f2c15d] py-3 text-xs font-black uppercase tracking-[0.24em] text-[#1c3b57] hover:bg-[#ffd886]"
              >
                View full package
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingEvent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={closeBooking}
              className="absolute right-6 top-6 z-10 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-8">
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5c6f86]">Booking Event</span>
                <h3 className="text-2xl font-black text-[#1c3b57]">{bookingEvent.name}</h3>
              </div>

              {bookingStep === "register" && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={bookingForm.fullName}
                        onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-6 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-6 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Email"
                          required
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-6 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                        />
                      </div>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          placeholder="Age"
                          required
                          min={1}
                          value={bookingForm.age}
                          onChange={(e) => setBookingForm({ ...bookingForm, age: e.target.value })}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-6 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-bold text-[#5c6f86]">People attending</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setBookingForm({ ...bookingForm, peopleCount: clampPeopleCount(bookingForm.peopleCount - 1, bookingEvent.id === "oloolua-nature-trail-group" ? 5 : 1) })}
                          className="h-8 w-8 rounded-lg bg-white font-bold text-[#1c3b57] shadow-sm"
                        >
                          -
                        </button>
                        <span className="text-base font-black text-[#1c3b57]">{bookingForm.peopleCount}</span>
                        <button
                          type="button"
                          onClick={() => setBookingForm({ ...bookingForm, peopleCount: clampPeopleCount(bookingForm.peopleCount + 1, 1) })}
                          className="h-8 w-8 rounded-lg bg-white font-bold text-[#1c3b57] shadow-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:border-[#f2c15d]/30">
                      <div className="relative flex h-5 items-center">
                        <input
                          id="terms"
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-[#1c3b57] focus:ring-[#2f6f99]"
                        />
                      </div>
                      <label htmlFor="terms" className="text-[10px] font-semibold leading-relaxed text-[#5c6f86]">
                        I have read and agree to the{" "}
                        <Link
                          to="/get/village/terms"
                          target="_blank"
                          className="text-[#1c3b57] underline decoration-[#f2c15d] decoration-2 underline-offset-4 hover:text-[#2f6f99]"
                        >
                          Travel Program Terms and Conditions
                        </Link>
                        . I understand that by registering, I am bound by these terms.
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#f2c15d]/10 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a5d00]">Reflected Amount</p>
                    <p className="text-2xl font-black text-[#1c3b57]">{formatAmount(activeTotal, bookingEvent.currency)}</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !agreedToTerms}
                    className="w-full bg-[#1c3b57] py-4 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-[#2a4d6e] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Registering..." : "Proceed to Register"}
                  </Button>
                </form>
              )}

              {bookingStep === "payment" && (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-[#f8fbff] border border-[#dbe7f3] p-5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5c6f86]">Total Payable</p>
                    <p className="text-3xl font-black text-[#1c3b57] mt-1">{formatAmount(activeTotal, bookingEvent.currency)}</p>
                  </div>

                  <div className="grid gap-4">
                    <button
                      onClick={() => setBookingStep("mpesa_instructions")}
                      className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#f2c15d] hover:bg-[#f2c15d]/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                          <span className="font-black">M</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-[#1c3b57]">Mpesa Paybill</p>
                          <p className="text-xs font-semibold text-[#5c6f86]">Manual payment via Paybill</p>
                        </div>
                      </div>
                      <div className="h-6 w-6 rounded-full border-2 border-gray-200 group-hover:border-[#f2c15d] group-hover:bg-[#f2c15d]" />
                    </button>

                    <button
                      onClick={handleOnlinePayment}
                      disabled={isProcessing}
                      className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#2f6f99] hover:bg-[#2f6f99]/5 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          {isProcessing ? (
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                          ) : (
                            <CreditCard className="h-6 w-6" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-[#1c3b57]">Card / Online</p>
                          <p className="text-xs font-semibold text-[#5c6f86]">
                            {isProcessing ? "Redirecting to DPO..." : "Instant DPO checkout"}
                          </p>
                        </div>
                      </div>
                      <div className="h-6 w-6 rounded-full border-2 border-gray-200 group-hover:border-[#2f6f99] group-hover:bg-[#2f6f99]" />
                    </button>
                  </div>

                  <button
                    onClick={() => setBookingStep("register")}
                    className="w-full text-xs font-black uppercase tracking-[0.2em] text-[#5c6f86] hover:text-[#1c3b57]"
                  >
                    Back to details
                  </button>
                </div>
              )}

              {bookingStep === "mpesa_instructions" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <h4 className="font-black text-green-900">Mpesa Instructions</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-green-100">
                        <span className="text-xs font-bold text-green-700 uppercase">Paybill No</span>
                        <span className="text-base font-black text-green-900">{PAYBILL_NO}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-green-100">
                        <span className="text-xs font-bold text-green-700 uppercase">Account No</span>
                        <span className="text-base font-black text-green-900">{ACCOUNT_NO}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-xs font-bold text-green-700 uppercase">Amount</span>
                        <span className="text-base font-black text-green-900">{formatAmount(activeTotal, bookingEvent.currency)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-[#5c6f86] text-center px-4">
                    Once you've made the payment, click below to send your booking(payment) confirmation to our team on WhatsApp.
                  </p>

                  <Button
                    onClick={handleWhatsAppShare}
                    className="w-full bg-[#25D366] py-4 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-[#20bd5a]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Send to WhatsApp
                    </span>
                  </Button>

                  <button
                    onClick={() => setBookingStep("payment")}
                    className="w-full text-xs font-black uppercase tracking-[0.2em] text-[#5c6f86] hover:text-[#1c3b57]"
                  >
                    Change payment method
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 sm:p-10">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative h-full w-full flex items-center justify-center">
            <img
              src={activeImage}
              alt="Full view"
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedEvents;
