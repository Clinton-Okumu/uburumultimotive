import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory, uploadImageToServer } from '../data/homeAdminStorage';
import {
    ArrowLeft,
    CheckCircle2,
    X,
    Upload,
    Image as ImageIcon,
    FolderPlus,
    Eye,
} from 'lucide-react';

export const AdminAddCategory: React.FC = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [shortName, setShortName] = useState('');
    const [slug, setSlug] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'product' | 'service'>('product');
    const [iconName] = useState('ShoppingCart');
    const [accentColor] = useState('from-amber-500 to-yellow-400');

    // Highlight image
    const [imageSourceType, setImageSourceType] = useState<'upload' | 'url'>('url');
    const [imageUrl, setImageUrl] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleNameChange = (val: string) => {
        setName(val);
        if (!shortName) setShortName(val);
        if (!slug) {
            setSlug(
                val
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')
            );
        }
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
                setImageUrl(uploadedUrl);
            } catch {
                setImageUrl(dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!name.trim()) {
            setErrorMessage('Category name is required.');
            return;
        }
        if (!slug.trim()) {
            setErrorMessage('Slug is required.');
            return;
        }
        if (!previewImage) {
            setErrorMessage('Please provide a banner/highlight image for this department.');
            return;
        }

        try {
            createCategory({
                id: slug.trim(),
                slug: slug.trim(),
                name: name.trim(),
                shortName: shortName.trim() || name.trim(),
                tagline: tagline.trim() || 'Quality curated products delivered reliably.',
                description: description.trim() || 'Browse hand-selected products.',
                type,
                iconName,
                accentColor,
                highlightImage: imageUrl || previewImage,
                items: [],
            });

            setSuccessMessage(`Category "${name}" created successfully!`);
            setTimeout(() => {
                navigate('/admin/categories');
            }, 1000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create category.';
            setErrorMessage(message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Category Creator
                </span>
            </div>

            <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Create New Uburu Home Department
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Add a new category with custom banner artwork, descriptions, and department tags.
                </p>
            </div>

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
                {/* Banner Artwork */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-amber-500" />
                            Category Banner / Highlight Artwork <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
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
                                onClick={() => setImageSourceType('upload')}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    imageSourceType === 'upload' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                                }`}
                            >
                                File Upload
                            </button>
                        </div>
                    </div>

                    {imageSourceType === 'upload' ? (
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="cat-image-input"
                            />
                            <label
                                htmlFor="cat-image-input"
                                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/30 rounded-2xl p-6 cursor-pointer transition-colors text-center"
                            >
                                <Upload className="w-8 h-8 text-amber-500 mb-2" />
                                <span className="text-xs sm:text-sm font-bold text-slate-700">
                                    Click to browse and upload category artwork
                                </span>
                            </label>
                        </div>
                    ) : (
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
                    )}

                    {previewImage && (
                        <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200">
                            <img src={previewImage} alt="Banner Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                                <span className="text-xs font-bold text-white flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" /> Banner Ready
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Fields */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-800">Department Meta</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Department Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Uburu Bakery & Treats"
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                URL Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="uburu-bakery"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Short Name / Pill Label
                            </label>
                            <input
                                type="text"
                                placeholder="Bakery"
                                value={shortName}
                                onChange={(e) => setShortName(e.target.value)}
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
                                <option value="product">Physical Products</option>
                                <option value="service">Services & Skilled Trades</option>
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Tagline
                            </label>
                            <input
                                type="text"
                                placeholder="Freshly baked artisan goods straight from the oven."
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Full Description
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Detailed overview shown at the top of this category's store page..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/categories')}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-7 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl text-xs shadow-xs flex items-center gap-2"
                    >
                        <FolderPlus className="w-4 h-4" />
                        Create Department
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddCategory;
