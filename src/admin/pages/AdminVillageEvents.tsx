import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    getStoredVillageEvents,
    VILLAGE_EVENTS_EVENT,
    updateVillageEvent,
    deleteVillageEvent,
    resetVillageEventsToDefault,
    type VillageEvent,
} from '../data/villageAdminStorage';
import {
    Compass,
    PlusCircle,
    Search,
    MapPin,
    Calendar,
    Sparkles,
    Trash2,
    Edit3,
    ExternalLink,
    RotateCcw,
    X,
    Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminVillageEvents: React.FC = () => {
    const [events, setEvents] = useState<VillageEvent[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');

    // Edit modal state
    const [editingEvent, setEditingEvent] = useState<VillageEvent | null>(null);

    const refreshData = () => {
        setEvents(getStoredVillageEvents());
    };

    useEffect(() => {
        refreshData();
        const handler = () => refreshData();
        window.addEventListener(VILLAGE_EVENTS_EVENT, handler);
        return () => window.removeEventListener(VILLAGE_EVENTS_EVENT, handler);
    }, []);

    const handleToggleActive = (event: VillageEvent) => {
        const nextState = !event.isActive;
        updateVillageEvent(event.id, { isActive: nextState });
        toast.success(`"${event.title}" is now ${nextState ? 'Active' : 'Hidden'}`);
    };

    const handleToggleFeatured = (event: VillageEvent) => {
        const nextState = !event.isFeatured;
        updateVillageEvent(event.id, { isFeatured: nextState });
        toast.success(`"${event.title}" is now ${nextState ? 'Featured' : 'Standard'}`);
    };

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
            deleteVillageEvent(id);
            toast.success(`Event "${title}" has been deleted.`);
        }
    };

    const handleResetDefaults = () => {
        if (window.confirm('Reset all village events to initial factory default catalog? Any custom events will be replaced.')) {
            resetVillageEventsToDefault();
            toast.success('Village events reset to factory default.');
        }
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        updateVillageEvent(editingEvent.id, {
            title: editingEvent.title,
            tag: editingEvent.tag,
            price: Number(editingEvent.price),
            currency: editingEvent.currency,
            location: editingEvent.location,
            datesText: editingEvent.datesText,
            minPeople: Number(editingEvent.minPeople) || 1,
            description: editingEvent.description,
            ticketName: editingEvent.ticketName,
            ticketNote: editingEvent.ticketNote,
            isActive: editingEvent.isActive,
            isFeatured: editingEvent.isFeatured,
        });

        toast.success(`Changes to "${editingEvent.title}" saved.`);
        setEditingEvent(null);
    };

    const filteredEvents = events.filter((e) => {
        // Tab filtering
        if (filterTab === 'active' && !e.isActive) return false;
        if (filterTab === 'inactive' && e.isActive) return false;
        if (filterTab === 'featured' && !e.isFeatured) return false;

        // Search filtering
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            e.title.toLowerCase().includes(q) ||
            e.location.toLowerCase().includes(q) ||
            e.tag.toLowerCase().includes(q) ||
            (e.description && e.description.toLowerCase().includes(q))
        );
    });

    return (
        <div className="space-y-7 animate-in fade-in duration-300 pb-16">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-900 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-yellow-300/60">
                            <Compass className="w-3 h-3 text-yellow-700" />
                            Uburu Village
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">• {events.length} Events Total</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Manage Village Events
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Search, modify, feature, or remove safari and wellness events.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        title="Reset to factory catalog"
                    >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reset Defaults</span>
                    </button>
                    <Link
                        to="/admin/village/add-event"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-yellow-500/20 transition-all hover:scale-[1.02]"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add New Event</span>
                    </Link>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                    {(['all', 'active', 'inactive', 'featured'] as const).map((tab) => {
                        const count =
                            tab === 'all'
                                ? events.length
                                : tab === 'active'
                                ? events.filter((e) => e.isActive).length
                                : tab === 'inactive'
                                ? events.filter((e) => !e.isActive).length
                                : events.filter((e) => e.isFeatured).length;

                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setFilterTab(tab)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                                    filterTab === tab
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {tab} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Search input */}
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title, location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 bg-slate-50 focus:bg-white"
                    />
                </div>
            </div>

            {/* Events Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEvents.map((event) => (
                    <div
                        key={event.id}
                        className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col transition-all ${
                            event.isActive ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200/60 opacity-75'
                        }`}
                    >
                        {/* Event Thumbnail */}
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider">
                                    {event.tag}
                                </span>
                                {event.isFeatured && (
                                    <span className="px-2 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div className="absolute top-3 right-3">
                                <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        event.isActive
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-rose-500 text-white'
                                    }`}
                                >
                                    {event.isActive ? 'Active' : 'Hidden'}
                                </span>
                            </div>

                            <div className="absolute bottom-3 right-3">
                                <span className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs text-slate-950 text-xs font-black shadow-md">
                                    {event.currency} {event.price.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                                <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-1">
                                    {event.title}
                                </h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5 line-clamp-1 font-medium">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    {event.location}
                                </p>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    {event.datesText || 'All year'} • Min: {event.minPeople || 1} participant(s)
                                </p>
                                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleActive(event)}
                                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors ${
                                            event.isActive
                                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                        }`}
                                    >
                                        {event.isActive ? 'Hide' : 'Activate'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleToggleFeatured(event)}
                                        className={`p-1.5 rounded-xl border cursor-pointer transition-colors ${
                                            event.isFeatured
                                                ? 'border-amber-300 bg-amber-50 text-amber-700'
                                                : 'border-slate-200 bg-white text-slate-400 hover:text-amber-600'
                                        }`}
                                        title={event.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <a
                                        href={`/get/village/event/${event.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        title="View Live Event"
                                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setEditingEvent(event)}
                                        title="Quick Edit"
                                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(event.id, event.title)}
                                        title="Delete Event"
                                        className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
                    <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-black text-slate-900">No events found</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Try adjusting your search filter or add a new event using the button below.
                    </p>
                    <Link
                        to="/admin/village/add-event"
                        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shadow-md transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Add New Event
                    </Link>
                </div>
            )}

            {/* Quick Edit Modal */}
            {editingEvent && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Edit Village Event</h2>
                                <p className="text-xs text-slate-500 font-medium">
                                    Updating details for slug: <code className="text-amber-600">{editingEvent.id}</code>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingEvent(null)}
                                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    value={editingEvent.title}
                                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                    required
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Price ({editingEvent.currency})
                                    </label>
                                    <input
                                        type="number"
                                        value={editingEvent.price}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, price: Number(e.target.value) })}
                                        required
                                        min={0}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Currency
                                    </label>
                                    <select
                                        value={editingEvent.currency}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, currency: e.target.value as 'KES' | 'USD' })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold"
                                    >
                                        <option value="KES">KES (Kenyan Shillings)</option>
                                        <option value="USD">USD (US Dollars)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Tag / Category
                                    </label>
                                    <input
                                        type="text"
                                        value={editingEvent.tag}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, tag: e.target.value })}
                                        placeholder="e.g. Uburu Village, Nature Trail"
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Min Participants
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={editingEvent.minPeople || 1}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, minPeople: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Location / Venue
                                </label>
                                <input
                                    type="text"
                                    value={editingEvent.location}
                                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                                    required
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Dates Text
                                    </label>
                                    <input
                                        type="text"
                                        value={editingEvent.datesText || ''}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, datesText: e.target.value })}
                                        placeholder="e.g. All year, Every Saturday"
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Ticket Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingEvent.ticketName || ''}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, ticketName: e.target.value })}
                                        placeholder="e.g. Resident Ticket"
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={editingEvent.description}
                                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-normal leading-relaxed"
                                />
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={editingEvent.isActive}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, isActive: e.target.checked })}
                                        className="w-4 h-4 rounded-md text-amber-500 focus:ring-amber-400 cursor-pointer"
                                    />
                                    Active / Visible to Public
                                </label>
                                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={editingEvent.isFeatured}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, isFeatured: e.target.checked })}
                                        className="w-4 h-4 rounded-md text-amber-500 focus:ring-amber-400 cursor-pointer"
                                    />
                                    Featured on Homepage
                                </label>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingEvent(null)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md cursor-pointer transition-colors"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVillageEvents;
