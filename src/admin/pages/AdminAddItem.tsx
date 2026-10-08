import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    getStoredCategories,
    addItemToCategory,
    uploadImageToServer,
} from '../data/homeAdminStorage';
import type { HomeCategory } from '../../data/homeCategories';
import {
    Upload,
    Image as ImageIcon,
    CheckCircle2,
    ArrowLeft,
    Plus,
    X,
    Eye,
    Layers,
} from 'lucide-react';

// Pre-packaged local asset suggestions
import hoodieImg from '../../assets/hoodie.webp';
import capImg from '../../assets/cap.webp';
import shirtImg from '../../assets/shirt.webp';
import bottleImg from '../../assets/waterbottle.webp';
import kidsImg from '../../assets/kids.webp';

const SAMPLE_ASSETS = [
    { label: 'Hoodie', src: hoodieImg },
    { label: 'Cap', src: capImg },
    { label: 'T-Shirt', src: shirtImg },
    { label: 'Bottle', src: bottleImg },
    { label: 'Kids Toy/Book', src: kidsImg },
];

export const AdminAddItem: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedCategory = searchParams.get('category') || '';

    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(preselectedCategory);

    // Form fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [originalPrice, setOriginalPrice] = useState<number | ''>('');
    const [brand, setBrand] = useState('Uburu Brand');
    const [tag, setTag] = useState('');
    const [type, setType] = useState<'product' | 'service'>('product');
    const [stockLocation, setStockLocation] = useState('NBO | KBU');
    const [inStock, setInStock] = useState(true);
    const [description, setDescription] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [features, setFeatures] = useState<string[]>([]);

    // Image handling
    const [imageSourceType, setImageSourceType] = useState<'upload' | 'url' | 'sample'>('upload');
    const [imageUrl, setImageUrl] = useState('');
    const [previewImage, setPreviewImage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loaded = getStoredCategories();
        setCategories(loaded);
        if (loaded.length > 0 && !selectedCategory) {
            setSelectedCategory(preselectedCategory || loaded[0].slug);
        }
    }, [preselectedCategory, selectedCategory]);

    // Handle file upload -> Base64
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrorMessage('Please select a valid image file (PNG, JPG, WebP, etc.)');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const dataUrl = event.target?.result as string;
            setPreviewImage(dataUrl);
            setErrorMessage('');

            try {
                const uploadedUrl = await uploadImageToServer(file);
                setImageUrl(uploadedUrl);
            } catch {
                setImageUrl(dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAddFeature = () => {
        if (!featureInput.trim()) return;
        setFeatures([...features, featureInput.trim()]);
        setFeatureInput('');
    };

    const handleRemoveFeature = (idx: number) => {
        setFeatures(features.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!selectedCategory) {
            setErrorMessage('Please choose a category for this item.');
            return;
        }
        if (!name.trim()) {
            setErrorMessage('Please enter an item name.');
            return;
        }
        if (price === '' || Number(price) <= 0) {
            setErrorMessage('Please enter a valid price.');
            return;
        }
        if (!previewImage) {
            setErrorMessage('Please provide an image for this item (upload a file or enter an image URL).');
            return;
        }

        const numPrice = Number(price);
        const numOriginalPrice = originalPrice !== '' ? Number(originalPrice) : undefined;
        let discountPercent: number | undefined = undefined;
        if (numOriginalPrice && numOriginalPrice > numPrice) {
            discountPercent = Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100);
        }

        try {
            addItemToCategory(selectedCategory, {
                name: name.trim(),
                price: numPrice,
                originalPrice: numOriginalPrice,
                discountPercent,
                currency: 'KES',
                brand: brand.trim() || 'Uburu Brand',
                tag: tag.trim() || 'Store',
                image: imageUrl || previewImage,
                type,
                inStock,
                stockLocation: stockLocation.trim() || 'NBO | KBU',
                description: description.trim(),
                features: features.length > 0 ? features : undefined,
                rating: 5.0,
                reviewCount: 1,
            });

            setSuccessMessage(`Item "${name}" successfully added to the category!`);

            // Reset form
            setName('');
            setPrice('');
            setOriginalPrice('');
            setTag('');
            setDescription('');
            setFeatures([]);
            setPreviewImage('');
            setImageUrl('');
            if (fileInputRef.current) fileInputRef.current.value = '';

            setTimeout(() => {
                navigate('/admin/items');
            }, 1200);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to add item.';
            setErrorMessage(message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
            {/* Top Bar with Back Button */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Catalog
                </button>
                <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Uburu Home Item Manager
                </span>
            </div>

            <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Add New Item to Category
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Upload photos and configure item pricing, stock, and descriptions for Uburu Home departments.
                </p>
            </div>

            {/* Notification messages */}
            {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <X className="w-4 h-4 text-red-600 shrink-0" />
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Category Selection */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-amber-500" />
                            Target Department / Category <span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/add-category')}
                            className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            New Category
                        </button>
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                    >
                        <option value="" disabled>-- Select a Department --</option>
                        {categories.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>
                                {cat.name} ({cat.items?.length || 0} items)
                            </option>
                        ))}
                    </select>
                </div>

                {/* 2. Image Upload Section */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-amber-500" />
                            Item Photo / Image <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                            <button
                                type="button"
                                onClick={() => setImageSourceType('upload')}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    imageSourceType === 'upload' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                                }`}
                            >
                                File Upload
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageSourceType('url')}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    imageSourceType === 'url' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                                }`}
                            >
                                Web URL
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageSourceType('sample')}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    imageSourceType === 'sample' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                                }`}
                            >
                                Quick Assets
                            </button>
                        </div>
                    </div>

                    {/* Mode: File Upload */}
                    {imageSourceType === 'upload' && (
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="item-image-input"
                            />
                            <label
                                htmlFor="item-image-input"
                                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/30 rounded-2xl p-6 cursor-pointer transition-colors text-center"
                            >
                                <Upload className="w-8 h-8 text-amber-500 mb-2" />
                                <span className="text-xs sm:text-sm font-bold text-slate-700">
                                    Click to browse and upload image
                                </span>
                                <span className="text-[11px] text-slate-400 mt-1">
                                    Supports PNG, JPG, WebP, SVG (Auto-compressed)
                                </span>
                            </label>
                        </div>
                    )}

                    {/* Mode: URL */}
                    {imageSourceType === 'url' && (
                        <div className="space-y-2">
                            <input
                                type="url"
                                placeholder="https://images.unsplash.com/photo-..."
                                value={imageUrl}
                                onChange={(e) => {
                                    setImageUrl(e.target.value);
                                    setPreviewImage(e.target.value);
                                }}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <p className="text-[11px] text-slate-400">
                                Paste any high quality image link directly.
                            </p>
                        </div>
                    )}

                    {/* Mode: Sample Assets */}
                    {imageSourceType === 'sample' && (
                        <div className="grid grid-cols-5 gap-3">
                            {SAMPLE_ASSETS.map((asset) => (
                                <button
                                    key={asset.label}
                                    type="button"
                                    onClick={() => {
                                        setPreviewImage(asset.src);
                                        setImageUrl(asset.src);
                                    }}
                                    className={`p-2 rounded-xl border text-center transition-all ${
                                        previewImage === asset.src
                                            ? 'border-amber-500 bg-amber-50/50 ring-2 ring-yellow-400/40'
                                            : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                                    }`}
                                >
                                    <img
                                        src={asset.src}
                                        alt={asset.label}
                                        className="w-12 h-12 object-contain mx-auto rounded-lg"
                                    />
                                    <span className="text-[10px] font-semibold text-slate-700 mt-1 block">
                                        {asset.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Image Live Preview */}
                    {previewImage && (
                        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-2xs"
                                />
                                <div>
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5 text-emerald-500" />
                                        Image Selected & Ready
                                    </span>
                                    <span className="text-[11px] text-slate-400 block mt-0.5">
                                        Will display in store department cards
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewImage('');
                                    setImageUrl('');
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                title="Remove photo"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* 3. Item Basic Information */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-800">Item Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Item Name / Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Fresh Organic Farm Eggs (Tray of 30)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Selling Price (KES) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                    KES
                                </span>
                                <input
                                    type="number"
                                    placeholder="1500"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    required
                                    min="1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Original / Strikethrough Price (Optional)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                    KES
                                </span>
                                <input
                                    type="number"
                                    placeholder="2000"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Brand / Producer
                            </label>
                            <input
                                type="text"
                                placeholder="Uburu Pantry / Farm Fresh"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Promotional Badge / Tag
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. SALE, Organic, Fast Delivery, Hot"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Department Type
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as 'product' | 'service')}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            >
                                <option value="product">Physical Product / Delivery</option>
                                <option value="service">Service / Consultation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Stock Location
                            </label>
                            <input
                                type="text"
                                placeholder="NBO | KBU"
                                value={stockLocation}
                                onChange={(e) => setStockLocation(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={inStock}
                                onChange={(e) => setInStock(e.target.checked)}
                                className="w-4 h-4 text-amber-500 rounded focus:ring-yellow-400"
                            />
                            <span className="text-xs font-semibold text-slate-700">
                                Mark as Available in Stock (Customers can buy immediately)
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Detailed product information, materials, ingredients, or usage instructions..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    {/* Features list */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Key Bullet Features (Optional)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g. 100% Organic Farm Sourced"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddFeature();
                                    }
                                }}
                                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                            >
                                Add Feature
                            </button>
                        </div>

                        {features.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {features.map((feat, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5"
                                    >
                                        • {feat}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeature(idx)}
                                            className="text-amber-700 hover:text-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/items')}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-7 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Save Item to Category
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddItem;
