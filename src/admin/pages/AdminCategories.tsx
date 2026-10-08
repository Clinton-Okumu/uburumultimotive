import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    getStoredCategories,
    syncCatalogFromDatabase,
    deleteCategory,
    HOME_CATALOG_EVENT,
} from '../data/homeAdminStorage';
import type { HomeCategory } from '../../data/homeCategories';
import {
    Plus,
    FolderPlus,
    Search,
    Package,
    Trash2,
    ExternalLink,
    PlusCircle,
    ArrowRight,
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [search, setSearch] = useState('');

    const refresh = () => {
        setCategories(getStoredCategories());
    };

    useEffect(() => {
        refresh();
        syncCatalogFromDatabase().then((cats) => {
            if (cats && cats.length > 0) setCategories(cats);
        });
        const handler = () => refresh();
        window.addEventListener(HOME_CATALOG_EVENT, handler);
        return () => window.removeEventListener(HOME_CATALOG_EVENT, handler);
    }, []);

    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.shortName.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (slug: string, name: string) => {
        if (confirm(`Are you sure you want to delete the department "${name}" and its items?`)) {
            deleteCategory(slug);
            refresh();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-12">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                        Uburu Home Departments & Categories
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Manage your store's departments, banner photography, and product catalogs.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/add-category"
                        className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs transition-colors"
                    >
                        <FolderPlus className="w-4 h-4 text-amber-500" />
                        Create Department
                    </Link>
                    <Link
                        to="/admin/add-item"
                        className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Item
                    </Link>
                </div>
            </div>

            {/* Filter Search */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
                <span className="text-xs text-slate-500 font-semibold hidden sm:inline-block">
                    Showing <strong className="text-slate-800">{filtered.length}</strong> departments
                </span>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((cat) => {
                    const itemCount = cat.items?.length || 0;

                    return (
                        <div
                            key={cat.slug}
                            className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
                        >
                            {/* Category Banner Photo */}
                            <div className="relative h-44 bg-slate-100 overflow-hidden">
                                <img
                                    src={cat.highlightImage}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                                {/* Badges */}
                                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                    <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                        {cat.type}
                                    </span>
                                </div>

                                <div className="absolute bottom-3 left-4 right-4">
                                    <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">
                                        {cat.shortName}
                                    </span>
                                    <h3 className="text-white font-black text-lg line-clamp-1">
                                        {cat.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Body details */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <p className="text-xs text-slate-500 line-clamp-2">
                                    {cat.tagline || cat.description}
                                </p>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                                        <Package className="w-4 h-4 text-amber-500" />
                                        <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} in store</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/get/home/category/${cat.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-slate-400 hover:text-amber-600 font-semibold flex items-center gap-1"
                                        >
                                            Store View
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(cat.slug, cat.name)}
                                            className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                                            title="Delete department"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <button
                                        onClick={() => navigate(`/admin/add-item?category=${cat.slug}`)}
                                        className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                                    >
                                        <PlusCircle className="w-3.5 h-3.5" />
                                        Add Item
                                    </button>
                                    <button
                                        onClick={() => navigate(`/admin/items?category=${cat.slug}`)}
                                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                                    >
                                        Manage
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminCategories;
