import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    getStoredTherapyServices,
    getStoredTherapyPricing,
    THERAPY_CONFIG_EVENT,
    type TherapyServiceConfig,
    type TherapyPricingPlan,
} from '../data/therapyAdminStorage';
import {
    HeartPulse,
    Brain,
    Rocket,
    Stethoscope,
    MessageSquare,
    DollarSign,
    ExternalLink,
    ArrowRight,
    Edit3,
    CheckCircle2,
    Users,
    Sliders,
    Sparkles,
} from 'lucide-react';

const iconMap = {
    MessageSquare,
    Rocket,
    Stethoscope,
    Brain,
    HeartPulse,
};

export const AdminTherapyDashboard: React.FC = () => {
    const [services, setServices] = useState<TherapyServiceConfig[]>([]);
    const [pricingPlans, setPricingPlans] = useState<TherapyPricingPlan[]>([]);

    const refreshData = () => {
        setServices(getStoredTherapyServices());
        setPricingPlans(getStoredTherapyPricing());
    };

    useEffect(() => {
        refreshData();
        const handler = () => refreshData();
        window.addEventListener(THERAPY_CONFIG_EVENT, handler);
        return () => window.removeEventListener(THERAPY_CONFIG_EVENT, handler);
    }, []);

    const activeServicesCount = services.filter((s) => s.enabled).length;
    const activePlansCount = pricingPlans.filter((p) => p.isActive).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-900 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-yellow-300/60">
                            <HeartPulse className="w-3 h-3 text-yellow-700" />
                            Uburu Therapy Administration
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                        Therapy & Wellbeing Management
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Configure clinical support pathways, customize service copy, and adjust consultation pricing.
                    </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                    <Link
                        to="/get/therapy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs transition-colors shrink-0"
                    >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Public View</span>
                    </Link>
                    <Link
                        to="/admin/therapy/pricing"
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                    >
                        <DollarSign className="w-4 h-4 shrink-0" />
                        <span>Edit Pricing</span>
                    </Link>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Support Pathways
                        </span>
                        <div className="text-2xl font-black text-slate-800 mt-1">
                            {activeServicesCount} / {services.length} Active
                        </div>
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready for booking
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center ring-4 ring-yellow-400/10">
                        <HeartPulse className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Pricing Packages
                        </span>
                        <div className="text-2xl font-black text-slate-800 mt-1">
                            {activePlansCount} Plans
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium mt-1">
                            Individual, Couples & Groups
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center ring-4 ring-amber-400/10">
                        <DollarSign className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Service Delivery
                        </span>
                        <div className="text-2xl font-black text-slate-800 mt-1">
                            Online + Clinic
                        </div>
                        <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
                            <Sparkles className="w-3 h-3" /> Virtual & In-Person
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center ring-4 ring-indigo-400/10">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Pathways Cards Section (Directly reflecting the user's uploaded screenshot) */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
                                ACTIVE SUPPORT PATHWAYS
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                                {services.length} Pathways
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            These 3 pathways are rendered directly on the public therapy portal.
                        </p>
                    </div>

                    <Link
                        to="/admin/therapy/services"
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                        <span>Configure Cards</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* 3 Pathway Cards matching uploaded screenshot layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((item) => {
                        const IconComponent = iconMap[item.iconName] || MessageSquare;
                        const isCoaching = item.id === 'coaching';

                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-yellow-400 transition-all duration-300"
                            >
                                {/* Top Header Block */}
                                <div
                                    className={`py-10 flex flex-col items-center justify-center border-b border-slate-100 ${
                                        isCoaching ? 'bg-neutral-900' : 'bg-yellow-50/70'
                                    }`}
                                >
                                    <div
                                        className={`p-3.5 rounded-2xl shadow-sm ${
                                            isCoaching
                                                ? 'bg-neutral-800 border border-yellow-500/30'
                                                : 'bg-white border border-slate-100'
                                        }`}
                                    >
                                        <IconComponent
                                            className={`w-8 h-8 ${
                                                isCoaching ? 'text-yellow-400' : 'text-amber-600'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex-1 flex flex-col justify-between text-center space-y-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                                            {item.badge}
                                        </span>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <div className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-xs">
                                            <span>{item.buttonText || 'Book Now'}</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>

                                        <Link
                                            to="/admin/therapy/services"
                                            className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                                            <span>Edit Service Copy</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Rates Overview Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="font-black text-slate-800 text-base">
                            Active Consultation Rates Preview
                        </h3>
                        <p className="text-xs text-slate-500">
                            Current session rates configured for Kenya (KES) and International (USD) clients.
                        </p>
                    </div>
                    <Link
                        to="/admin/therapy/pricing"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
                    >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Manage All Pricing Plans</span>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                                <th className="pb-3 font-bold">Plan Name</th>
                                <th className="pb-3 font-bold">Category</th>
                                <th className="pb-3 font-bold">Format</th>
                                <th className="pb-3 font-bold">Sessions</th>
                                <th className="pb-3 font-bold">KES Rate</th>
                                <th className="pb-3 font-bold">USD Rate</th>
                                <th className="pb-3 font-bold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-700">
                            {pricingPlans.slice(0, 6).map((plan) => (
                                <tr key={plan.id} className="hover:bg-slate-50/50">
                                    <td className="py-3 font-bold text-slate-900">{plan.title}</td>
                                    <td className="py-3">
                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                                            {plan.category}
                                        </span>
                                    </td>
                                    <td className="py-3">{plan.mode}</td>
                                    <td className="py-3 font-semibold">{plan.sessions} {plan.sessions === 1 ? 'session' : 'sessions'}</td>
                                    <td className="py-3 font-extrabold text-slate-900">KES {plan.amountKes.toLocaleString()}</td>
                                    <td className="py-3 font-bold text-slate-600">{plan.amountUsd ? `$${plan.amountUsd}` : '—'}</td>
                                    <td className="py-3 text-right">
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTherapyDashboard;
