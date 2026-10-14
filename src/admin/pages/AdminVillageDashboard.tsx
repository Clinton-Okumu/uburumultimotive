import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    getStoredVillageEvents,
    VILLAGE_EVENTS_EVENT,
    updateVillageEvent,
    deleteVillageEvent,
    type VillageEvent,
} from '../data/villageAdminStorage';
import {
    Compass,
    Calendar,
    PlusCircle,
    ExternalLink,
    MapPin,
    Eye,
    Trash2,
    CheckCircle2,
    XCircle,
    Sparkles,
    Ticket,
    Layers,
    ArrowRight,
    Search,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminVillageDashboard: React.FC = () => {
    const [events, setEvents] = useState<VillageEvent[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const refreshData = () => {
        setEvents(getStoredVillageEvents());
    };

    useEffect(() => {
        refreshData();
        const handler = () => refreshData();
        window.addEventListener(VILLAGE_EVENTS_EVENT, handler);
        return () => window.removeEventListener(VILLAGE_EVENTS_EVENT, handler);
    }, []);

    const activeEventsCount = events.filter((e) => e.isActive).length;
    const featuredEventsCount = events.filter((e) => e.isFeatured && e.isActive).length;
    const lowestPrice = events.length > 0 ? Math.min(...events.map((e) => e.price)) : 0;

    const handleToggleActive = (event: VillageEvent) => {
        const nextState = !event.isActive;
        updateVillageEvent(event.id, { isActive: nextState });
        toast.success(`"${event.title}" is now ${nextState ? 'Active' : 'Hidden'}`);
    };

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteVillageEvent(id);
            toast.success(`Event "${title}" deleted.`);
        }
    };

    const filteredEvents = events.filter((e) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            e.title.toLowerCase().includes(q) ||
            e.location.toLowerCase().includes(q) ||
            e.tag.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-900 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-yellow-300/60">
                            <Compass className="w-3 h-3 text-yellow-700" />
                            Uburu Village Engine
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                            Live Sync Active
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Village Events Administration
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Create, organize, and manage travel retreats, outdoor excursions, and cultural events.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <a
                        href="/get/village"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-all"
                    >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>Public Village</span>
                    </a>
                    <Link
                        to="/admin/village/add-event"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-yellow-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add New Event</span>
                    </Link>
                </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Total Events
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                            {events.length}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">
                            Across all packages and retreats
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Active / Published
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                            {activeEventsCount}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">
                            Visible to public visitors
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Featured Showcase
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                            {featuredEventsCount}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">
                            Highlighted on village homepage
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Starting Rate
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Ticket className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                            KES {lowestPrice.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">
                            Accessible entry packages
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions Banner */}
            <div className="bg-gradient-to-r from-[#141b2d] to-[#1c2742] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-2.5 border border-amber-400/30">
                            <Compass className="w-3.5 h-3.5" />
                            Instant Live Propagation
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                            Manage Village Tours, Safaris & Healing Excursions
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                            Any event you create or update updates immediately across the featured events grid, the detailed event pages, and the checkout reservation cart.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                        <Link
                            to="/admin/village/events"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
                        >
                            <Layers className="w-4 h-4 text-amber-400" />
                            Manage All Events
                        </Link>
                        <Link
                            to="/admin/village/add-event"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs transition-colors shadow-md shadow-yellow-500/20"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Add New Event
                        </Link>
                    </div>
                </div>
            </div>

            {/* Live Storefront Preview Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Eye className="w-5 h-5 text-amber-500" />
                            Live Storefront Event Cards
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            Real-time rendering of active events as seen by travelers on Uburu Village.
                        </p>
                    </div>
                    <Link
                        to="/admin/village/events"
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                        View all ({events.length}) <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {events
                        .filter((e) => e.isActive)
                        .slice(0, 4)
                        .map((event) => (
                            <div
                                key={event.id}
                                className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col group hover:border-amber-400/50 transition-all"
                            >
                                <div className="relative h-44 overflow-hidden bg-slate-100">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider">
                                            {event.tag}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 right-3">
                                        <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shadow-sm">
                                            {event.currency} {event.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 line-clamp-1">
                                            {event.title}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 line-clamp-1">
                                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                            {event.location}
                                        </p>
                                        <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                                            {event.description}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400">
                                            Min: {event.minPeople || 1} person
                                        </span>
                                        <a
                                            href={`/get/village/event/${event.id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1"
                                        >
                                            View Page <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Recent Events Table with Quick Controls */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            Village Events Directory
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            Quick status controls, pricing inspection, and deletion.
                        </p>
                    </div>

                    <div className="relative max-w-xs w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter by title, location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 bg-slate-50"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                            <tr>
                                <th className="px-5 py-3.5">Event</th>
                                <th className="px-4 py-3.5">Location & Dates</th>
                                <th className="px-4 py-3.5">Price</th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-4 py-3.5">Featured</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <div className="font-black text-slate-900 text-xs sm:text-sm truncate">
                                                    {event.title}
                                                </div>
                                                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                                                    {event.tag}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-slate-900 font-semibold truncate max-w-xs">
                                            {event.location}
                                        </div>
                                        <div className="text-slate-400 text-[11px]">
                                            {event.datesText || 'All year round'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-black text-slate-900 whitespace-nowrap">
                                        {event.currency} {event.price.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(event)}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition-all ${
                                                event.isActive
                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                            }`}
                                        >
                                            {event.isActive ? (
                                                <>
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3 h-3 text-rose-600" />
                                                    Hidden
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        {event.isFeatured ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                                                <Sparkles className="w-3 h-3 text-amber-600" />
                                                Featured
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-[11px] font-medium">Standard</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={`/get/village/event/${event.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                title="View Public Page"
                                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(event.id, event.title)}
                                                title="Delete Event"
                                                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
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

export default AdminVillageDashboard;
