import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    getStoredVillageExperiences,
    saveVillageExperience,
    deleteVillageExperience,
    resetVillageToDefault,
    VILLAGE_CONFIG_EVENT,
    type VillageExperience,
} from '../data/villageAdminStorage';
import { uploadImageToServer } from '../data/homeAdminStorage';
import {
    Compass,
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    RotateCcw,
    X,
    ArrowLeft,
    MapPin,
    Clock,
} from 'lucide-react';

export const AdminVillageEvents: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const editParamId = searchParams.get('edit');

    const [experiences, setExperiences] = useState<VillageExperience[]>([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hidden'>('all');
    const [notification, setNotification] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    // Form state
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('Eco Walk');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('Nairobi & Environs');
    const [duration, setDuration] = useState('Full Day');
    const [priceKes, setPriceKes] = useState<number | ''>(3500);
    const [priceUsd, setPriceUsd] = useState<number | ''>(35);
    const [minPeople, setMinPeople] = useState<number>(1);
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [highlights, setHighlights] = useState<string[]>([]);
    const [highlightInput, setHighlightInput] = useState('');
    const [image, setImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const refreshData = () => {
        setExperiences(getStoredVillageExperiences());
    };

    useEffect(() => {
        refreshData();
        const handler = () => refreshData();
        window.addEventListener(VILLAGE_CONFIG_EVENT, handler);
        return () => window.removeEventListener(VILLAGE_CONFIG_EVENT, handler);
    }, []);

    // Auto-open modal if ?edit=ID is in URL
    useEffect(() => {
        if (editParamId && experiences.length > 0) {
            const exp = experiences.find((e) => e.id === editParamId);
            if (exp) {
                openEditModal(exp);
            }
        }
    }, [editParamId, experiences]);

    const showNotify = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const openCreateModal = () => {
        setId(`exp-${Date.now()}`);
        setTitle('');
        setTag('Eco Walk');
        setDescription('');
        setLocation('Nairobi & Environs');
        setDuration('Full Day');
        setPriceKes(3500);
        setPriceUsd(35);
        setMinPeople(1);
        setIsActive(true);
        setIsFeatured(false);
        setHighlights(['Guided nature trail walk', 'Roundtrip group transport', 'Packed refreshments']);
        setImage('');
        setPreviewImage('');
        setModalError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (exp: VillageExperience) => {
        setId(exp.id);
        setTitle(exp.title);
        setTag(exp.tag);
        setDescription(exp.description);
        setLocation(exp.location);
        setDuration(exp.duration);
        setPriceKes(exp.priceKes);
        setPriceUsd(exp.priceUsd || '');
        setMinPeople(exp.minPeople || 1);
        setIsActive(exp.isActive);
        setIsFeatured(!!exp.isFeatured);
        setHighlights(exp.highlights || []);
        setImage(exp.image);
        setPreviewImage(exp.image);
        setModalError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        if (searchParams.has('edit')) {
            searchParams.delete('edit');
            setSearchParams(searchParams);
        }
    };

    const handleAddHighlight = () => {
        if (!highlightInput.trim()) return;
        setHighlights([...highlights, highlightInput.trim()]);
        setHighlightInput('');
    };

    const handleRemoveHighlight = (idx: number) => {
        setHighlights(highlights.filter((_, i) => i !== idx));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const dataUrl = event.target?.result as string;
            setPreviewImage(dataUrl);

            try {
                const uploadedUrl = await uploadImageToServer(file);
                setImage(uploadedUrl);
            } catch {
                setImage(dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError(null);

        if (!title.trim()) {
            setModalError('Please enter a title for this experience.');
            return;
        }

        if (priceKes === '' || Number(priceKes) <= 0) {
            setModalError('Please enter a valid KES price.');
            return;
        }

        if (!previewImage && !image) {
            setModalError('Please provide an image for this experience.');
            return;
        }

        setIsSaving(true);

        const expToSave: VillageExperience = {
            id,
            title: title.trim(),
            tag: tag.trim() || 'Experience',
            description: description.trim(),
            location: location.trim() || 'Kenya',
            duration: duration.trim() || 'Full Day',
            image: image || previewImage,
            priceKes: Number(priceKes),
            priceUsd: priceUsd !== '' ? Number(priceUsd) : undefined,
            minPeople: Number(minPeople) || 1,
            optionId: id,
            isActive,
            isFeatured,
            highlights,
        };

        try {
            await saveVillageExperience(expToSave);
            refreshData();
            setIsSaving(false);
            closeModal();
            showNotify(`Experience "${expToSave.title}" saved successfully!`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save experience.';
            setModalError(message);
            setIsSaving(false);
        }
    };

    const handleDelete = async (expId: string, expTitle: string) => {
        if (confirm(`Are you sure you want to remove "${expTitle}" from Uburu Village?`)) {
            try {
                await deleteVillageExperience(expId);
                refreshData();
                showNotify(`Experience "${expTitle}" removed.`);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to delete experience.';
                alert(message);
            }
        }
    };

    const handleResetAll = async () => {
        if (confirm('Reset all village experiences and safari camp rates to original defaults?')) {
            try {
                await resetVillageToDefault();
                refreshData();
                showNotify('All village experiences reset to system defaults.');
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to reset village experiences.';
                alert(message);
            }
        }
    };

    const filtered = experiences.filter((e) => {
        const matchesSearch =
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.location.toLowerCase().includes(search.toLowerCase()) ||
            e.tag.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'active' && e.isActive) ||
            (filterStatus === 'hidden' && !e.isActive);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/village"
                        className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                        title="Back to Village Overview"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-900 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-yellow-300/60">
                                <Compass className="w-3 h-3 text-amber-600" />
                                Uburu Village
                            </span>
                            <span className="text-xs text-slate-500">• Experiences Configurator</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Village Experiences & Outings
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleResetAll}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-colors cursor-pointer"
                        title="Reset all to defaults"
                    >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reset Defaults</span>
                    </button>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Experience</span>
                    </button>
                </div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-2.5 text-amber-900 text-xs font-semibold animate-in fade-in duration-200 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{notification}</span>
                </div>
            )}

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search experiences by name, tag, location..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                    />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {(['all', 'active', 'hidden'] as const).map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                                filterStatus === status
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {status === 'all' ? 'All Experiences' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Experiences Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-5 py-3.5">Experience</th>
                                <th className="px-4 py-3.5">Location & Duration</th>
                                <th className="px-4 py-3.5">Resident Rate (KES)</th>
                                <th className="px-4 py-3.5">Non-Resident (USD)</th>
                                <th className="px-4 py-3.5">Min Pax</th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-medium">
                                        No experiences found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                                        {/* Image + Title */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                                    <img
                                                        src={exp.image}
                                                        alt={exp.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                                                        <span>{exp.title}</span>
                                                        {exp.isFeatured && (
                                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-slate-950">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                                        {exp.tag}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location & Duration */}
                                        <td className="px-4 py-3.5">
                                            <div className="font-medium text-slate-800 flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                <span>{exp.location}</span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                <Clock className="w-3 h-3" />
                                                <span>{exp.duration}</span>
                                            </div>
                                        </td>

                                        {/* Price KES */}
                                        <td className="px-4 py-3.5 font-bold text-slate-900">
                                            KES {exp.priceKes.toLocaleString()}
                                        </td>

                                        {/* Price USD */}
                                        <td className="px-4 py-3.5 font-bold text-amber-600">
                                            {exp.priceUsd ? `$${exp.priceUsd.toLocaleString()}` : '—'}
                                        </td>

                                        {/* Min People */}
                                        <td className="px-4 py-3.5 font-medium text-slate-700">
                                            {exp.minPeople} Pax
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    exp.isActive
                                                        ? 'bg-amber-100 text-amber-900'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {exp.isActive ? 'Active' : 'Hidden'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(exp)}
                                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                                    title="Edit Experience"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(exp.id, exp.title)}
                                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                                                    title="Delete Experience"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Experience Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                    {experiences.some((e) => e.id === id) ? 'Edit Village Experience' : 'Add New Village Experience'}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Configure outing details, dual pricing tiers, and public storefront display.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Error Alert */}
                        {modalError && (
                            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                                {modalError}
                            </div>
                        )}

                        {/* Modal Form */}
                        <form onSubmit={handleSave} className="mt-6 space-y-4">
                            {/* Title & Tag */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Experience Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Oloolua Nature Trail & Waterfalls"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Badge / Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={tag}
                                        onChange={(e) => setTag(e.target.value)}
                                        placeholder="e.g. Eco Walk"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                                    />
                                </div>
                            </div>

                            {/* Location & Duration */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Karen, Nairobi"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Duration / Hours
                                    </label>
                                    <input
                                        type="text"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="e.g. Full Day (8:00 AM - 4:00 PM)"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                                    />
                                </div>
                            </div>

                            {/* Pricing & Group Size */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Resident Rate (KES)
                                    </label>
                                    <input
                                        type="number"
                                        value={priceKes}
                                        onChange={(e) => setPriceKes(e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder="4000"
                                        required
                                        min={1}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Non-Resident Rate (USD)
                                    </label>
                                    <input
                                        type="number"
                                        value={priceUsd}
                                        onChange={(e) => setPriceUsd(e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder="40"
                                        min={0}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Min Group Size (Pax)
                                    </label>
                                    <input
                                        type="number"
                                        value={minPeople}
                                        onChange={(e) => setMinPeople(Number(e.target.value) || 1)}
                                        min={1}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief overview of what participants will experience on this trip..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 leading-relaxed"
                                />
                            </div>

                            {/* Highlights bullets */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Key Highlights (Bullet Points)
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={highlightInput}
                                        onChange={(e) => setHighlightInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddHighlight();
                                            }
                                        }}
                                        placeholder="e.g. Roundtrip transfer from Nairobi CBD"
                                        className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddHighlight}
                                        className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {highlights.map((h, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 border border-slate-200"
                                        >
                                            <span>{h}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveHighlight(i)}
                                                className="text-slate-400 hover:text-rose-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Experience Banner Image
                                </label>
                                <div className="flex items-center gap-4">
                                    {previewImage && (
                                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleFileUpload}
                                            className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={image}
                                            onChange={(e) => {
                                                setImage(e.target.value);
                                                setPreviewImage(e.target.value);
                                            }}
                                            placeholder="Or enter image URL (e.g. https://...)"
                                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="flex items-center gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
                                    />
                                    <span>Active (Visible on public storefront)</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.checked)}
                                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
                                    />
                                    <span>Featured Badge</span>
                                </label>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>Save Experience</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
