import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Check,
  Copy,
  Share2,
  ArrowRight,
  Globe,
  MapPin,
  ShieldCheck,
  Clock,
  HeartHandshake,
  Users,
  CalendarCheck,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

type LocationMode = "kenya" | "international";

const Pricing = () => {
  const [locationMode, setLocationMode] = useState<LocationMode>("kenya");
  const [detectedCountry, setDetectedCountry] = useState<string>("Kenya");
  const [isDetecting, setIsDetecting] = useState<boolean>(true);
  const [sessionTypeTab, setSessionTypeTab] = useState<"all" | "individual" | "couples" | "group">("all");

  // Auto-detect country on mount
  useEffect(() => {
    const detectLocation = async () => {
      setIsDetecting(true);
      try {
        const response = await fetch("https://ipapi.co/json/", {
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          const country = data?.country_name || "";
          if (country) {
            setDetectedCountry(country);
            if (country.toLowerCase().includes("kenya")) {
              setLocationMode("kenya");
            } else {
              setLocationMode("international");
            }
          }
        }
      } catch (err) {
        console.warn("Could not auto-detect location via IP, defaulting to Kenya:", err);
      } finally {
        setIsDetecting(false);
      }
    };

    detectLocation();
  }, []);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Therapy pricing link copied to clipboard!");
  };

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = `Here are the official session rates & packages for Uburu Therapy: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const isKenya = locationMode === "kenya";

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-28 pb-20">
      {/* Hero Header */}
      <section className="relative px-6 py-10 lg:py-14 text-center overflow-hidden">
        {/* Subtle warm glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 border border-yellow-300/60 text-yellow-800 text-xs font-black uppercase tracking-widest mb-5">
            <Brain className="w-3.5 h-3.5 text-yellow-700" />
            Therapy Pricing
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 mb-5">
            Therapy <span className="text-yellow-600">Pricing</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Transparent, compassionate mental health care. Professional one-on-one therapy, couple counseling, support groups, and coaching tailored to your location.
          </p>

          {/* Auto-detected Location Status */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-full mb-8 shadow-sm max-w-full">
            <MapPin className="w-4 h-4 text-yellow-600 shrink-0" />
            <span className="text-xs font-semibold">
              {isDetecting ? (
                <span className="flex items-center gap-1.5 text-neutral-600">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-800" />
                  Detecting location...
                </span>
              ) : (
                <>
                  Location detected: <strong className="text-neutral-950 font-bold">{detectedCountry}</strong>
                </>
              )}
            </span>
          </div>

          {/* Share Links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <Copy className="w-3.5 h-3.5 text-neutral-700" />
              Copy Shareable Link
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share to WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-100 border border-neutral-200 rounded-2xl max-w-lg w-full justify-center">
            <button
              onClick={() => setSessionTypeTab("all")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                sessionTypeTab === "all" ? "bg-yellow-400 text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              All Plans
            </button>
            <button
              onClick={() => setSessionTypeTab("individual")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                sessionTypeTab === "individual" ? "bg-yellow-400 text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              Individual
            </button>
            <button
              onClick={() => setSessionTypeTab("couples")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                sessionTypeTab === "couples" ? "bg-yellow-400 text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              Couples
            </button>
            {isKenya && (
              <button
                onClick={() => setSessionTypeTab("group")}
                className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  sessionTypeTab === "group" ? "bg-yellow-400 text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Group
              </button>
            )}
          </div>
        </div>

        {/* PRICING CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* CARD 1: INDIVIDUAL THERAPY */}
          {(sessionTypeTab === "all" || sessionTypeTab === "individual") && (
            <div className="bg-white border border-neutral-200 hover:border-yellow-400/80 rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group">
              <div>
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-700 mb-5 border border-yellow-200">
                  <Brain className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-neutral-950 mb-2">Individual Therapy</h3>
                <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                  One-on-one psychological support for depression, anxiety, trauma recovery, burnout, and emotional wellness.
                </p>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-yellow-600" />
                    Available Session Packages:
                  </p>

                  {isKenya ? (
                    <div className="space-y-3">
                      <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1.5">
                          Online Sessions (Virtual)
                        </span>
                        <ul className="space-y-1.5 text-xs text-neutral-700 font-medium">
                          <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                            <span>1 Session</span>
                            <span className="font-bold text-neutral-950">KES 1,600</span>
                          </li>
                          <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                            <span>4 Sessions (Monthly)</span>
                            <span className="font-bold text-neutral-950">KES 5,000</span>
                          </li>
                          <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                            <span>6 Sessions</span>
                            <span className="font-bold text-neutral-950">KES 7,500</span>
                          </li>
                          <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                            <span>8 Sessions</span>
                            <span className="font-bold text-neutral-950">KES 10,000</span>
                          </li>
                          <li className="flex justify-between items-center pt-1">
                            <span>10 Sessions</span>
                            <span className="font-bold text-neutral-950">KES 13,000</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1.5">
                          Physical Sessions (In-Person)
                        </span>
                        <ul className="space-y-1.5 text-xs text-neutral-700 font-medium">
                          <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                            <span>1 Session</span>
                            <span className="font-bold text-neutral-950">KES 1,800</span>
                          </li>
                          <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                            <span>4 Sessions</span>
                            <span className="font-bold text-neutral-950">KES 6,500</span>
                          </li>
                          <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                            <span>6 Sessions</span>
                            <span className="font-bold text-neutral-950">KES 10,000</span>
                          </li>
                          <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                            <span>8 Sessions</span>
                            <span className="font-bold text-neutral-950">KES 12,000</span>
                          </li>
                          <li className="flex justify-between items-center pt-1">
                            <span>10 Sessions</span>
                            <span className="font-bold text-neutral-950">KES 18,000</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1.5">
                        Online Sessions (International USD)
                      </span>
                      <ul className="space-y-2 text-xs text-neutral-700 font-medium">
                        <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                          <span>1 Single Session</span>
                          <span className="font-bold text-neutral-950">$25 USD</span>
                        </li>
                        <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                          <span>3 Sessions</span>
                          <span className="font-bold text-neutral-950">$50 USD</span>
                        </li>
                        <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                          <span>4 Sessions</span>
                          <span className="font-bold text-neutral-950">$65 USD</span>
                        </li>
                        <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                          <span>6 Sessions</span>
                          <span className="font-bold text-neutral-950">$85 USD</span>
                        </li>
                        <li className="flex justify-between items-center pt-1">
                          <span>8 Sessions</span>
                          <span className="font-bold text-neutral-950">$120 USD</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <Link
                to="/get/therapy"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-950 text-xs font-black uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                Book Individual Session
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* CARD 2: COUPLES THERAPY */}
          {(sessionTypeTab === "all" || sessionTypeTab === "couples") && (
            <div className="bg-white border border-neutral-200 hover:border-yellow-400/80 rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group">
              <div>
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-700 mb-5 border border-pink-200">
                  <HeartHandshake className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-neutral-950 mb-2">Couples Counseling</h3>
                <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                  Relationship strengthening, premarital coaching, communication repair, and mediation with certified relationship counselors.
                </p>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-yellow-600" />
                    Available Session Packages:
                  </p>

                  {isKenya ? (
                    <div className="space-y-3">
                      <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1.5">
                          Online Couples Sessions
                        </span>
                        <ul className="space-y-1.5 text-xs text-neutral-700 font-medium">
                          <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                            <span>1 Session</span>
                            <span className="font-bold text-neutral-950">KES 3,000</span>
                          </li>
                          <li className="flex justify-between items-center pt-1">
                            <span>4 Sessions Bundle</span>
                            <span className="font-bold text-neutral-950">KES 10,000</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1.5">
                          Physical Couples Sessions
                        </span>
                        <ul className="space-y-1.5 text-xs text-neutral-700 font-medium">
                          <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                            <span>1 Session</span>
                            <span className="font-bold text-neutral-950">KES 3,500</span>
                          </li>
                          <li className="flex justify-between items-center pt-1">
                            <span>4 Sessions Bundle</span>
                            <span className="font-bold text-neutral-950">KES 12,000</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1.5">
                        Online Sessions (International USD)
                      </span>
                      <ul className="space-y-2 text-xs text-neutral-700 font-medium">
                        <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                          <span>1 Single Session</span>
                          <span className="font-bold text-neutral-950">$40 USD</span>
                        </li>
                        <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                          <span>3 Sessions</span>
                          <span className="font-bold text-neutral-950">$110 USD</span>
                        </li>
                        <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                          <span>4 Sessions</span>
                          <span className="font-bold text-neutral-950">$140 USD</span>
                        </li>
                        <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                          <span>6 Sessions</span>
                          <span className="font-bold text-neutral-950">$220 USD</span>
                        </li>
                        <li className="flex justify-between items-center pt-1">
                          <span>8 Sessions</span>
                          <span className="font-bold text-neutral-950">$250 USD</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <Link
                to="/get/therapy"
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                Book Couples Session
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* CARD 3: GROUP THERAPY & SPECIALIZED CARE */}
          {(sessionTypeTab === "all" || sessionTypeTab === "group") && (
            <div className="bg-white border border-neutral-200 hover:border-yellow-400/80 rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 mb-5 border border-blue-200">
                  <Users className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-neutral-950 mb-2">Group & Specialized Care</h3>
                <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                  Support circles, group debriefs, life coaching roadmaps, and certified medical psychiatric consultations.
                </p>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-yellow-600" />
                    Specialized Offerings:
                  </p>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1">
                        Group Support Circles
                      </span>
                      <div className="flex justify-between items-center text-xs text-neutral-700 font-medium">
                        <span>Group therapy session</span>
                        <span className="font-bold text-neutral-950">
                          {isKenya ? "KES 1,500 / person" : "$20 USD / person"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1">
                        Medical Consultation
                      </span>
                      <ul className="space-y-1.5 text-xs text-neutral-700 font-medium">
                        {isKenya ? (
                          <>
                            <li className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                              <span>Physical (In-Person)</span>
                              <span className="font-bold text-neutral-950">KES 3,500</span>
                            </li>
                            <li className="flex justify-between items-center pt-1">
                              <span>Online (Virtual)</span>
                              <span className="font-bold text-neutral-950">KES 2,500</span>
                            </li>
                          </>
                        ) : (
                          <li className="flex justify-between items-center py-1">
                            <span>Online / Virtual (1 Session)</span>
                            <span className="font-bold text-neutral-950">$40 USD</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1">
                        Life Coaching & Psychiatric Assessment
                      </span>
                      <ul className="space-y-1.5 text-xs text-neutral-700">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-yellow-600" />
                          <span>Executive & Personal Transformation</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-yellow-600" />
                          <span>Doctor Psychiatric Assessment</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/get/therapy"
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                Request Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* TRUST & QUALITY HIGHLIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-neutral-50 border border-neutral-200/80 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-950 mb-1">100% Confidential</h4>
              <p className="text-xs text-neutral-600">Strict patient privacy standards and encrypted records.</p>
            </div>
          </div>

          <div className="p-6 bg-neutral-50 border border-neutral-200/80 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-700 shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-950 mb-1">Licensed Therapists</h4>
              <p className="text-xs text-neutral-600">Certified counseling psychologists and psychiatrists.</p>
            </div>
          </div>

          <div className="p-6 bg-neutral-50 border border-neutral-200/80 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-700 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-950 mb-1">Flexible Scheduling</h4>
              <p className="text-xs text-neutral-600">Evening and weekend sessions tailored to your schedule.</p>
            </div>
          </div>

          <div className="p-6 bg-neutral-50 border border-neutral-200/80 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-700 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-950 mb-1">Online & In-Person</h4>
              <p className="text-xs text-neutral-600">Join securely from anywhere in the world or visit in person.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
