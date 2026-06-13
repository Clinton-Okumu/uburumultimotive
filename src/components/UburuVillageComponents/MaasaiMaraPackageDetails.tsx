import { useMemo, useState, type FormEvent } from "react";
import { Ticket, User, Phone, Mail, CheckCircle, CreditCard, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import toast from "react-hot-toast";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import {
  villageCampRates,
  villageEventOptions,
  type VillageResidencyType,
  type VillageTravelMonth,
} from "../../data/storefrontCatalog";

const PAYBILL_NO = "522522";
const ACCOUNT_NO = "1346356009";

const monthLabels: Record<VillageTravelMonth, string> = {
  july: "July",
  august: "August",
  september: "September",
  october: "October",
};

const residencyLabels: Record<VillageResidencyType, string> = {
  resident: "Resident",
  non_resident: "Non-resident",
};

const clampPeopleCount = (value: number) => Math.max(1, Math.min(99, value));

const formatAmount = (currency: "KES" | "USD", amount: number) => {
  const locale = currency === "KES" ? "en-KE" : "en-US";
  return `${currency} ${amount.toLocaleString(locale)}`;
};

const maasaiPackageId = "maasai-mara-daily-group-departures-2026";

type BookingStep = "register" | "payment" | "mpesa_instructions";

const MaasaiMaraPackageDetails = () => {
  const navigate = useNavigate();
  const [selectedCampId, setSelectedCampId] = useState(villageCampRates[0]?.campId ?? "");
  const [residencyType, setResidencyType] = useState<VillageResidencyType>("resident");
  const [travelMonth, setTravelMonth] = useState<VillageTravelMonth>("july");
  const [peopleCount, setPeopleCount] = useState(1);
  const [bookingStep, setBookingStep] = useState<BookingStep>("register");
  
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const packageOptions = useMemo(
    () => villageEventOptions.filter((option) => option.packageId === maasaiPackageId),
    [],
  );

  const { cartItemCount, updateQuantity, addToCart } = useStorefrontCheckout({
    catalog: packageOptions.map(({ id, name, price }) => ({ id, name, price })),
    context: "uburu_village",
    purchaseType: "event_purchase",
    emptyCartMessage: "Please add at least one package to your cart.",
    storageKey: "uburu_village_cart",
  });

  const selectedCamp = useMemo(
    () => villageCampRates.find((camp) => camp.campId === selectedCampId) ?? villageCampRates[0],
    [selectedCampId],
  );

  const selectedOption = useMemo(
    () =>
      packageOptions.find(
        (option) =>
          option.campId === selectedCamp?.campId && option.residencyType === residencyType,
      ),
    [packageOptions, selectedCamp?.campId, residencyType],
  );

  const selectedMonthIsAllowed =
    !!selectedCamp && selectedCamp.availableMonths.includes(travelMonth);
  const currency = selectedOption?.currency ?? "KES";
  const unitPrice = selectedOption?.price ?? 0;
  const totalAmount = unitPrice * peopleCount;

  const goToCheckout = () => {
    navigate("/checkout?source=village");
  };

  const handleCampChange = (nextCampId: string) => {
    const nextCamp = villageCampRates.find((camp) => camp.campId === nextCampId);
    if (!nextCamp) {
      return;
    }

    setSelectedCampId(nextCampId);
    if (!nextCamp.availableMonths.includes(travelMonth)) {
      setTravelMonth(nextCamp.availableMonths[0]);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!bookingForm.fullName || !bookingForm.phone) {
      toast.error("Please fill in your name and phone number.");
      return;
    }

    if (!selectedOption) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Saving your booking details...");

    const submitData = new FormData();
    submitData.append("eventName", selectedOption.name);
    submitData.append("campName", selectedCamp?.campName || "");
    submitData.append("residencyType", residencyLabels[residencyType]);
    submitData.append("travelMonth", monthLabels[travelMonth]);
    submitData.append("fullName", bookingForm.fullName.trim());
    submitData.append("phone", bookingForm.phone.trim());
    submitData.append("email", bookingForm.email.trim());
    submitData.append("peopleCount", String(peopleCount));
    submitData.append("totalAmount", formatAmount(currency, totalAmount));
    submitData.append("_subject", `New Maasai Mara Booking: ${selectedOption.name}`);

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

  const handleOnlinePayment = () => {
    if (!selectedOption || !selectedMonthIsAllowed) {
      return;
    }

    updateQuantity(selectedOption.id, peopleCount);
    addToCart(selectedOption.id);
    goToCheckout();
  };

  const handleWhatsAppShare = () => {
    if (!selectedOption || !selectedCamp) return;
    const message = `*MAASAI MARA BOOKING*%0A%0A*Camp:* ${selectedCamp.campName}%0A*Residency:* ${residencyLabels[residencyType]}%0A*Month:* ${monthLabels[travelMonth]}%0A*Name:* ${bookingForm.fullName}%0A*Phone:* ${bookingForm.phone}%0A*People:* ${peopleCount}%0A*Total:* ${formatAmount(currency, totalAmount)}%0A%0A_I have made the payment via Mpesa Paybill 522522, Acc 1346356009._`;
    window.open(`https://wa.me/254718421205?text=${message}`, "_blank");
  };

  return (
    <section className="relative bg-[#f8fbff] px-6 py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#f2c15d]/30 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#2f6f99]/15 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5c6f86]">
              Migration season package
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#1c3b57] sm:text-4xl">
              Maasai Mara daily group departures 2026
            </h2>
            <p className="mt-3 max-w-2xl text-base font-semibold text-[#5c6f86]">
              Choose camp, residency type, and travel month. Pricing is per person sharing.
            </p>
          </div>
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

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-3xl border border-[#dbe7f3] bg-white p-6 shadow-lg">
            {bookingStep === "register" && (
              <>
                <h3 className="text-lg font-black text-[#1c3b57]">Select your package details</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-semibold text-[#1c3b57]">
                    <span>Camp</span>
                    <select
                      value={selectedCamp?.campId ?? ""}
                      onChange={(event) => handleCampChange(event.target.value)}
                      className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                    >
                      {villageCampRates.map((camp) => (
                        <option key={camp.campId} value={camp.campId}>
                          {camp.campName}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm font-semibold text-[#1c3b57]">
                    <span>Residency</span>
                    <select
                      value={residencyType}
                      onChange={(event) => setResidencyType(event.target.value as VillageResidencyType)}
                      className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                    >
                      <option value="resident">Resident (KES)</option>
                      <option value="non_resident">Non-resident (USD)</option>
                    </select>
                  </label>

                  <label className="space-y-2 text-sm font-semibold text-[#1c3b57]">
                    <span>Travel month</span>
                    <select
                      value={travelMonth}
                      onChange={(event) => setTravelMonth(event.target.value as VillageTravelMonth)}
                      className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                    >
                      {(Object.keys(monthLabels) as VillageTravelMonth[]).map((month) => (
                        <option key={month} value={month}>
                          {monthLabels[month]}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm font-semibold text-[#1c3b57]">
                    <span>People (sharing)</span>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={peopleCount}
                      onChange={(event) => setPeopleCount(clampPeopleCount(Number(event.target.value) || 1))}
                      className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                    />
                  </label>
                </div>

                {!selectedMonthIsAllowed && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    This camp is not available in {monthLabels[travelMonth]}. Meal plan: {selectedCamp?.mealPlanLabel}.
                  </div>
                )}

                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#5c6f86] mb-4">Registration Details</h4>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          required
                          value={bookingForm.fullName}
                          onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          required
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                      />
                    </div>

                    <div className="mt-5 rounded-2xl bg-[#f2c15d]/10 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#7a5d00]">Reflected Amount</p>
                      <p className="mt-1 text-2xl font-black text-[#1c3b57]">{formatAmount(currency, totalAmount)}</p>
                      <p className="mt-1 text-xs font-semibold text-[#5c6f86]">
                        {formatAmount(currency, unitPrice)} per person sharing
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={!selectedMonthIsAllowed || isSubmitting}
                      className="w-full bg-[#1c3b57] py-4 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-[#2a4d6e]"
                    >
                      {isSubmitting ? "Registering..." : "Proceed to Register"}
                    </Button>
                  </form>
                </div>
              </>
            )}

            {bookingStep === "payment" && (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setBookingStep("register")} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                  </button>
                  <h3 className="text-lg font-black text-[#1c3b57]">Choose payment method</h3>
                </div>

                <div className="rounded-2xl bg-[#f8fbff] border border-[#dbe7f3] p-5 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5c6f86]">Total Payable</p>
                  <p className="text-3xl font-black text-[#1c3b57] mt-1">{formatAmount(currency, totalAmount)}</p>
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
                    className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#2f6f99] hover:bg-[#2f6f99]/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-[#1c3b57]">Card / Online</p>
                        <p className="text-xs font-semibold text-[#5c6f86]">Instant DPO checkout</p>
                      </div>
                    </div>
                    <div className="h-6 w-6 rounded-full border-2 border-gray-200 group-hover:border-[#2f6f99] group-hover:bg-[#2f6f99]" />
                  </button>
                </div>
              </div>
            )}

            {bookingStep === "mpesa_instructions" && (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setBookingStep("payment")} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                  </button>
                  <h3 className="text-lg font-black text-[#1c3b57]">Mpesa Payment</h3>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <h4 className="font-black text-green-900">Instructions</h4>
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
                      <span className="text-base font-black text-green-900">{formatAmount(currency, totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#5c6f86] text-center px-4">
                  Once you've made the payment, click below to send your payment confirmation to our team on WhatsApp.
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
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#dbe7f3] bg-white p-6 shadow-lg">
            <h3 className="text-lg font-black text-[#1c3b57]">2026 rate matrix</h3>
            <p className="mt-1 text-sm font-semibold text-[#5c6f86]">
              Cost per person sharing. Currency follows residency type.
            </p>

            <div className="mt-4 space-y-3">
              {villageCampRates.map((camp) => (
                <div key={camp.campId} className="rounded-2xl border border-[#e5edf6] bg-[#f8fbff] p-3">
                  <p className="text-sm font-black text-[#1c3b57]">{camp.campName}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#6a7c92]">
                    Meal plan: {camp.mealPlanLabel}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-semibold text-[#32556f]">
                    <p>Resident: {formatAmount("KES", camp.residentPriceKes)}</p>
                    <p>Non-resident: {formatAmount("USD", camp.nonResidentPriceUsd)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5c6f86]">Inclusions</p>
              <ul className="mt-2 space-y-1 text-sm font-semibold text-[#32556f]">
                <li>2 nights accommodation sharing in a double/twin room</li>
                <li>Meals as per hotel</li>
                <li>3 days shared safari land cruiser transport</li>
                <li>Shared game drives</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaasaiMaraPackageDetails;
