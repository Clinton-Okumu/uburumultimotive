import { useMemo, useState, type FormEvent } from "react";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import { useStorefrontCheckout } from "../../hooks/useStorefrontCheckout";
import {
  villageCampRates,
  villageEventOptions,
  type VillageResidencyType,
  type VillageTravelMonth,
} from "../../data/storefrontCatalog";

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

const MaasaiMaraPackageDetails = () => {
  const navigate = useNavigate();
  const [selectedCampId, setSelectedCampId] = useState(villageCampRates[0]?.campId ?? "");
  const [residencyType, setResidencyType] = useState<VillageResidencyType>("resident");
  const [travelMonth, setTravelMonth] = useState<VillageTravelMonth>("july");
  const [peopleCount, setPeopleCount] = useState(1);
  const [paymentAction, setPaymentAction] = useState<"pay_now" | "pay_later">("pay_now");
  const [payLaterStatus, setPayLaterStatus] = useState<{
    state: "idle" | "sending" | "sent" | "error";
    message: string;
  }>({ state: "idle", message: "" });

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
    setPayLaterStatus({ state: "idle", message: "" });
  };

  const handleProceedToCheckout = () => {
    if (!selectedOption || !selectedMonthIsAllowed) {
      return;
    }

    updateQuantity(selectedOption.id, peopleCount);
    addToCart(selectedOption.id);
    goToCheckout();
  };

  const handlePayLaterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCamp || !selectedOption || !selectedMonthIsAllowed) {
      return;
    }
    if (payLaterStatus.state === "sending") {
      return;
    }

    setPayLaterStatus({ state: "sending", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = (formData.get("fullName") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();

    if (!phone && !email) {
      setPayLaterStatus({
        state: "error",
        message: "Add a phone number or email so we can reach you.",
      });
      return;
    }

    const submitData = new FormData();
    submitData.set("name", fullName);
    submitData.set("email", email || "no-reply@uburumultimovehs.org");
    submitData.set("phone", phone);
    submitData.set("eventName", "Maasai Mara Daily Group Departures");
    submitData.set("camp", selectedCamp.campName);
    submitData.set("residency", residencyLabels[residencyType]);
    submitData.set("travelMonth", monthLabels[travelMonth]);
    submitData.set("mealPlan", selectedCamp.mealPlanLabel);
    submitData.set("peopleCount", String(peopleCount));
    submitData.set("totalAmount", formatAmount(currency, totalAmount));
    submitData.set(
      "message",
      `Pay later request for Maasai Mara package. Camp: ${selectedCamp.campName}. Residency: ${residencyLabels[residencyType]}. Travel month: ${monthLabels[travelMonth]}. Guests: ${peopleCount}. Unit price: ${formatAmount(currency, unitPrice)} per person sharing. Total: ${formatAmount(currency, totalAmount)}. Contact: ${phone || "N/A"} / ${email || "N/A"}.`,
    );
    submitData.set("_subject", "Uburu Village: Maasai Mara pay later request");

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
          data?.errors
            ?.map?.((item: { message?: string }) => item?.message)
            .filter(Boolean)
            .join(", ") ||
          "Unable to send your details right now.";
        throw new Error(errorMessage);
      }

      setPayLaterStatus({
        state: "sent",
        message: "Received. We will contact you shortly to complete your booking.",
      });
      form.reset();
    } catch (error) {
      setPayLaterStatus({
        state: "error",
        message:
          error instanceof Error ? error.message : "Unable to send your details right now.",
      });
    }
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

            <div className="mt-5 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] p-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#5c6f86]">Pricing</p>
              <p className="mt-2 text-xl font-black text-[#1c3b57]">{formatAmount(currency, totalAmount)}</p>
              <p className="mt-1 text-sm font-semibold text-[#5c6f86]">
                {formatAmount(currency, unitPrice)} per person sharing
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#6a7c92]">
                Meal plan window: {selectedCamp?.mealPlanLabel}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#dbe7f3] bg-[#f8fbff] p-2">
              <button
                type="button"
                onClick={() => setPaymentAction("pay_now")}
                className={`rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                  paymentAction === "pay_now" ? "bg-[#2f6f99] text-white" : "bg-white text-[#5c6f86]"
                }`}
              >
                Pay now
              </button>
              <button
                type="button"
                onClick={() => setPaymentAction("pay_later")}
                className={`rounded-xl px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                  paymentAction === "pay_later"
                    ? "bg-[#2f6f99] text-white"
                    : "bg-white text-[#5c6f86]"
                }`}
              >
                Pay later
              </button>
            </div>

            {paymentAction === "pay_later" && (
              <form className="mt-4 space-y-3" onSubmit={handlePayLaterSubmit}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  required
                  className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email (optional)"
                  className="w-full rounded-xl border border-[#dbe7f3] bg-white px-3 py-2 text-sm font-semibold text-[#1c3b57] focus:outline-none focus:ring-2 focus:ring-[#2f6f99]/40"
                />

                {payLaterStatus.state !== "idle" && (
                  <div
                    className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                      payLaterStatus.state === "sent"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {payLaterStatus.message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#f2c15d] py-3 text-xs font-black uppercase tracking-[0.2em] text-[#1c3b57] hover:bg-[#ffd886]"
                  disabled={payLaterStatus.state === "sending" || !selectedMonthIsAllowed}
                >
                  {payLaterStatus.state === "sending" ? "Sending..." : "Send pay later request"}
                </Button>
              </form>
            )}

            <Button
              onClick={handleProceedToCheckout}
              disabled={paymentAction === "pay_later" || !selectedMonthIsAllowed}
              className="mt-5 w-full bg-[#2f6f99] py-3 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-[#3b83b4]"
            >
              Proceed to checkout
            </Button>
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
