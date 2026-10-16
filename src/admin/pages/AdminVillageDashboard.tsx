import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    getStoredVillageExperiences,
    getStoredVillageCamps,
    saveVillageExperience,
    VILLAGE_CONFIG_EVENT,
    type VillageExperience,
    type VillageCampRateConfig,
} from '../data/villageAdminStorage';
import {
    Compass,
    MapPin,
    Users,
    ExternalLink,
    ArrowRight,
    Edit3,
    CheckCircle2,
    Sparkles,
    Tent,
    DollarSign,
    Plus,
} from 'lucide-react';

export const AdminVillageDashboard: React.FC = () => {
    const [experiences, setExperiences] = useState<VillageExperience[]>([]);
    const [camps, setCamps] = useState<VillageCampRateConfig[]>([]);

    const refreshData = () => {
        setExperiences(getStoredVillageExperiences());
        setCamps(getStoredVillageCamps());
    };

    useEffect(() => {
        refreshData();
        const handler = () => refreshData();
        window.addEventListener(VILLAGE_CONFIG_EVENT, handler);
        return () => window.removeEventListener(VILLAGE_CONFIG_EVENT, handler);
    }, []);

    const activeExperiencesCount = experiences.filter((e) => e.isActive).length;
    const activeCampsCount = camps.filter((c) => c.isActive).length;

    const handleToggleActive = async (exp: VillageExperience) => {
        try {
            await saveVillageExperience({ ...exp, isActive: !exp.isActive });
            refreshData();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to update experience status.';
            alert(message);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-900 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-yellow-300/60">
                            <Compass className="w-3 h-3 text-yellow-700" />
                            Uburu Village & Travel
                        </span>
                        <span className="text-xs text-slate-500">• Experiences & Safari Expeditions</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Experiences & Travel Dashboard
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Control outdoor experiences, community excursions, and Maasai Mara safari departure rates.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link
                        to="/get/village"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-colors"
                    >
                        <span>Live Village Storefront</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </Link>

                    <Link
                        to="/admin/village/events"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Manage Experiences</span>
                    </Link>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-yellow-300 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                        <span>Total Experiences</span>
                        <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center">
                            <Compass className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{experiences.length}</div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-yellow-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{activeExperiencesCount} Active on public storefront</span>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                        <span>Safari Camps</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Tent className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{camps.length}</div>
                    <div className="text-xs text-slate-500 mt-2">
                        {activeCampsCount} Maasai Mara Daily Departures
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                        <span>Starting Day Rate</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">KES 3,500</div>
                    <div className="text-xs text-slate-500 mt-2">
                        Paradise Lost & Kids Adventure
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                        <span>Group Bookings</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">Min 5 Pax</div>
                    <div className="text-xs text-slate-500 mt-2">
                        Oloolua Nature Trail Group Pass
                    </div>
                </div>
            </div>

            {/* Quick Action Navigation Card */}
            <div className="bg-gradient-to-br from-[#141b2d] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <span className="px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 border border-amber-400/30">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            Live Storefront Sync
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            Manage Village Day Trips, Outings & Safari Tiers
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Add or update trip dates, locations, minimum group sizes, and dual currency rates (KES / USD) for residents and international travelers.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to="/admin/village/events"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                        >
                            <span>Open Events Configurator</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Experiences Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                            Active Experiences & Day Trips
                        </h3>
                        <p className="text-xs text-slate-500">
                            Synchronized live with the public Uburu Village catalog and checkout system.
                        </p>
                    </div>

                    <Link
                        to="/admin/village/events"
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                        <span>View All & Edit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {experiences.map((exp) => (
                        <div
                            key={exp.id}
                            className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-xs ${
                                exp.isActive ? 'border-slate-200/90' : 'border-slate-200/60 opacity-60'
                            }`}
                        >
                            <div>
                                {/* Card image header */}
                                <div className="h-44 relative bg-slate-100 overflow-hidden">
                                    <img
                                        src={exp.image}
                                        alt={exp.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute top-3 left-3 flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs border border-white/20">
                                            {exp.tag}
                                        </span>
                                        {exp.isFeatured && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950 shadow-xs">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 className="font-bold text-sm tracking-tight leading-snug drop-shadow-xs">
                                            {exp.title}
                                        </h4>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <div className="flex items-center gap-1 truncate">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{exp.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0 font-medium text-slate-700">
                                            <Users className="w-3.5 h-3.5 text-slate-400" />
                                            <span>Min {exp.minPeople}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                        {exp.description}
                                    </p>

                                    {exp.highlights && exp.highlights.length > 0 && (
                                        <div className="pt-2 border-t border-slate-100 space-y-1">
                                            {exp.highlights.slice(0, 2).map((h, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                                    <span className="truncate">{h}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Rate</div>
                                    <div className="text-sm font-black text-slate-900">
                                        KES {(exp.priceKes ?? exp.price ?? 0).toLocaleString()}
                                        {exp.priceUsd && (
                                            <span className="text-xs text-slate-500 font-medium ml-1">
                                                / ${exp.priceUsd}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleActive(exp)}
                                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                                            exp.isActive
                                                ? 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200'
                                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                        }`}
                                    >
                                        {exp.isActive ? 'Active' : 'Hidden'}
                                    </button>

                                    <Link
                                        to={`/admin/village/events?edit=${exp.id}`}
                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                                        title="Edit Experience"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Safari Camps Section */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Tent className="w-5 h-5 text-amber-500" />
                            Maasai Mara Daily Departures & Safari Camps
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Dual-rate safari camp packages for resident Kenyans and international non-residents.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Camp / Lodge</th>
                                <th className="px-4 py-3">Season Window</th>
                                <th className="px-4 py-3">Resident Rate (KES)</th>
                                <th className="px-4 py-3">Non-Resident Rate (USD)</th>
                                <th className="px-4 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {camps.map((camp) => (
                                <tr key={camp.campId} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-4 py-3.5 font-bold text-slate-900">
                                        {camp.campName}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500">
                                        {camp.mealPlanLabel}
                                    </td>
                                    <td className="px-4 py-3.5 font-bold text-slate-800">
                                        KES {camp.residentPriceKes.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3.5 font-bold text-amber-600">
                                        ${camp.nonResidentPriceUsd.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-900">
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
