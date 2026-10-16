import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    addVillageEvent,
    type VillageEvent,
} from '../data/villageAdminStorage';
import { uploadImageToServer } from '../data/homeAdminStorage';
import {
    Compass,
    Upload,
    Image as ImageIcon,
    CheckCircle2,
    ArrowLeft,
    Plus,
    X,
    Eye,
    MapPin,
    Calendar,
    Sparkles,
    Ticket,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Curated sample asset photography for rapid event creation
import olooluaImg from '../../assets/oloolua.webp';
import kidsImg from '../../assets/kids.webp';
import glassdoorImg from '../../assets/glassdoor2.webp';
import paradiseLostImg from '../../assets/paradiselost.jpg';
import kitengelaImg from '../../assets/kitengelaglass.webp';
import maaImg from '../../assets/maa.webp';

const SAMPLE_VILLAGE_ASSETS = [
    { label: 'Oloolua Trail', src: olooluaImg },
    { label: 'Kids Adventure', src: kidsImg },
    { label: 'Kitengela Glass', src: glassdoorImg },
    { label: 'Paradise Lost', src: paradiseLostImg },
    { label: 'Kitengela Crafts', src: kitengelaImg },
    { label: 'Maasai Mara Safari', src: maaImg },
];

export const AdminAddVillageEvent: React.FC = () => {
    const navigate = useNavigate();

    // Form states
    const [title, setTitle] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [tag, setTag] = useState('Uburu Village');
    const [price, setPrice] = useState<number | ''>('');
    const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');
    const [priceLabel, setPriceLabel] = useState('');
    const [location, setLocation] = useState('');
    const [datesText, setDatesText] = useState('All year');
    const [minPeople, setMinPeople] = useState<number>(1);
    const [ticketName, setTicketName] = useState('');
    const [ticketNote, setTicketNote] = useState('Includes guided tour, transport guidance & refreshments');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(true);

    // Highlights bullets
    const [highlightInput, setHighlightInput] = useState('');
    const [highlights, setHighlights] = useState<string[]>([
        'Guided nature exploration & scenic views',
        'Mindfulness and team therapeutic reflection in nature',
        'Direct support to Uburu Village social impact initiatives',
    ]);

    // Image handling
    const [imageSourceType, setImageSourceType] = useState<'upload' | 'url' | 'sample'>('sample');
    const [imageUrl, setImageUrl] = useState('');
    const [previewImage, setPreviewImage] = useState<string>(olooluaImg);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const uploadedUrl = await uploadImageToServer(file);
            setPreviewImage(uploadedUrl);
            setImageUrl(uploadedUrl);
            toast.success('Image ready for event!');
        } catch {
            toast.error('Failed to process image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddHighlight = () => {
        if (!highlightInput.trim()) return;
        setHighlights((prev) => [...prev, highlightInput.trim()]);
        setHighlightInput('');
    };

    const handleRemoveHighlight = (idx: number) => {
        setHighlights((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Please enter an event title');
            return;
        }

        if (price === '' || Number(price) <= 0) {
            toast.error('Please enter a valid price');
            return;
        }

        if (!location.trim()) {
            toast.error('Please specify the location or venue');
            return;
        }

        if (!previewImage) {
            toast.error('Please provide an image for the event');
            return;
        }

        setIsSubmitting(true);
        try {
            const formattedPrice = Number(price);
            const computedPriceLabel = priceLabel.trim() || `${currency} ${formattedPrice.toLocaleString()} each`;
            const computedTicketName = ticketName.trim() || `${title} Pass`;

            const newEvent: Omit<VillageEvent, 'id'> & { id?: string } = {
                id: customSlug.trim() ? customSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined,
                title: title.trim(),
                image: previewImage,
                tag: tag.trim() || 'Uburu Village',
                price: formattedPrice,
                priceKes: currency === 'KES' ? formattedPrice : Math.round(formattedPrice * 130),
                priceUsd: currency === 'USD' ? formattedPrice : Math.round(formattedPrice / 130),
                currency,
                priceLabel: computedPriceLabel,
                location: location.trim(),
                datesText: datesText.trim() || 'All year',
                minPeople: Math.max(1, Number(minPeople) || 1),
                ticketName: computedTicketName,
                ticketNote: ticketNote.trim(),
                description: description.trim() || 'Exciting outdoor adventure and wellness experience organized by Uburu Village.',
                highlights: highlights.length > 0 ? highlights : ['Exclusive experience hosted by Uburu Village'],
                isActive,
                isFeatured,
            };

            addVillageEvent(newEvent);
            toast.success(`Event "${title}" published successfully!`);
            navigate('/admin/village/events');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save event';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-7 animate-in fade-in duration-300 pb-20">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            to="/admin/village/events"
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to Village Events
                        </Link>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Compass className="w-7 h-7 text-amber-500" />
                        Create Village Event
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Add a new retreat, wilderness safari, or therapeutic excursion to Uburu Village.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                        <h2 className="text-base font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100">
                            1. Event Overview & Classification
                        </h2>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Event Title <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Lake Naivasha Crescent Island Retreat"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold text-slate-900"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Custom URL Slug <span className="text-slate-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={customSlug}
                                    onChange={(e) => setCustomSlug(e.target.value)}
                                    placeholder="e.g. naivasha-retreat"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-mono text-slate-700"
                                />
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                    Leave blank to auto-generate from event title
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Tag / Category
                                </label>
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    placeholder="e.g. Uburu Village, Safari, Day Trip"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Location / Venue <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Naivasha, Nakuru County"
                                        required
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold text-slate-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Schedule / Dates
                                </label>
                                <div className="relative">
                                    <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={datesText}
                                        onChange={(e) => setDatesText(e.target.value)}
                                        placeholder="e.g. All year, Every 2nd Saturday"
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Description & Story
                            </label>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Write an engaging overview of the trip, activities, wildlife, and therapeutic benefits..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-normal text-slate-800 leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Image Selection Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                        <h2 className="text-base font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-amber-500" />
                            2. Event Artwork & Photography
                        </h2>

                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <button
                                type="button"
                                onClick={() => setImageSourceType('sample')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                                    imageSourceType === 'sample'
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                Sample Assets
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageSourceType('upload')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                                    imageSourceType === 'upload'
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                Upload Photo
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageSourceType('url')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                                    imageSourceType === 'url'
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                Direct Image URL
                            </button>
                        </div>

                        {imageSourceType === 'sample' && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {SAMPLE_VILLAGE_ASSETS.map((asset) => (
                                    <button
                                        type="button"
                                        key={asset.label}
                                        onClick={() => setPreviewImage(asset.src)}
                                        className={`p-2 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                            previewImage === asset.src
                                                ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/30'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <img
                                            src={asset.src}
                                            alt={asset.label}
                                            className="w-full h-20 object-cover rounded-xl"
                                        />
                                        <span className="text-[11px] font-bold text-slate-700">
                                            {asset.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {imageSourceType === 'upload' && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-xs font-bold text-slate-700">
                                    {isUploading ? 'Uploading to server...' : 'Click to upload image'}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                            </div>
                        )}

                        {imageSourceType === 'url' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => {
                                        setImageUrl(e.target.value);
                                        setPreviewImage(e.target.value);
                                    }}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-mono text-slate-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Pricing & Tickets Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                        <h2 className="text-base font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-amber-600" />
                            3. Pricing, Capacity & Tickets
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Ticket Price <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                                    placeholder="e.g. 4500"
                                    required
                                    min={1}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-black text-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Currency
                                </label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value as 'KES' | 'USD')}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-bold text-slate-900 bg-white"
                                >
                                    <option value="KES">KES (Kenyan Shillings)</option>
                                    <option value="USD">USD (US Dollars)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Min Participants
                                </label>
                                <input
                                    type="number"
                                    value={minPeople}
                                    onChange={(e) => setMinPeople(Number(e.target.value) || 1)}
                                    min={1}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Custom Price Label <span className="text-slate-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={priceLabel}
                                    onChange={(e) => setPriceLabel(e.target.value)}
                                    placeholder="e.g. KES 4,500 each or From KES 27,500"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold text-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Ticket Label
                                </label>
                                <input
                                    type="text"
                                    value={ticketName}
                                    onChange={(e) => setTicketName(e.target.value)}
                                    placeholder="e.g. General Admission Pass"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-semibold text-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Inclusions & Ticket Note
                            </label>
                            <input
                                type="text"
                                value={ticketNote}
                                onChange={(e) => setTicketNote(e.target.value)}
                                placeholder="e.g. Includes guided hike, park entry, boat ride & refreshments"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-medium text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Highlights & Bullet Points Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
                        <h2 className="text-base font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            4. Key Highlights & Itinerary
                        </h2>

                        <div className="flex items-center gap-2">
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
                                placeholder="Add a key feature or itinerary perk (press Enter)..."
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-medium"
                            />
                            <button
                                type="button"
                                onClick={handleAddHighlight}
                                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2 mt-2">
                            {highlights.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveHighlight(idx)}
                                        className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Publishing Options & Submit */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
                        <div className="flex items-center gap-6">
                            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-4 h-4 rounded-md text-amber-500 focus:ring-amber-400 cursor-pointer"
                                />
                                Publish Immediately (Active)
                            </label>

                            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-4 h-4 rounded-md text-amber-500 focus:ring-amber-400 cursor-pointer"
                                />
                                Mark as Featured Event
                            </label>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Link
                                to="/admin/village/events"
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-yellow-500/20 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                                {isSubmitting ? 'Publishing Event...' : 'Publish Village Event'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Right Column: Live Event Card Preview */}
                <div className="space-y-4">
                    <div className="sticky top-24 space-y-4">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-amber-500" />
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Live Storefront Preview
                            </h3>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col group">
                            <div className="relative h-56 bg-slate-100 overflow-hidden">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <ImageIcon className="w-10 h-10" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider">
                                        {tag || 'Uburu Village'}
                                    </span>
                                    {isFeatured && (
                                        <span className="px-2 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                            <Sparkles className="w-2.5 h-2.5" />
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <div className="absolute bottom-3 right-3">
                                    <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shadow-md">
                                        {price ? `${currency} ${Number(price).toLocaleString()}` : `${currency} 0`}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="text-base font-black text-slate-900 leading-snug">
                                        {title || 'Untitled Village Event'}
                                    </h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        {location || 'Location not specified'}
                                    </p>
                                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        {datesText || 'All year'} • Min: {minPeople || 1} participant(s)
                                    </p>
                                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                                        {description || 'Event description will appear here...'}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {ticketName || 'Event Ticket'}
                                    </span>
                                    <span className="text-xs font-black text-amber-600">
                                        View Event Details →
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-900 text-xs leading-relaxed">
                            <span className="font-bold">Instant Sync:</span> Once published, this event will instantly appear on the public Uburu Village page, booking forms, and reservation checkout without requiring a site rebuild.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAddVillageEvent;
