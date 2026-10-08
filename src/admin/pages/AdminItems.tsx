import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    getStoredCategories,
    syncCatalogFromDatabase,
    deleteItemFromCategory,
    HOME_CATALOG_EVENT,
} from '../data/homeAdminStorage';
import type { HomeCategory, HomeCategoryItem } from '../../data/homeCategories';
import {
    Plus,
    Search,
    Trash2,
    AlertCircle,
} from 'lucide-react';

export const AdminItems: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCategoryFilter = searchParams.get('category') || 'all';

    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');

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

    // Flatten all items with category reference
    const allItems: (HomeCategoryItem & { categoryName: string; categorySlug: string })[] = [];
    categories.forEach((cat) => {
        (cat.items || []).forEach((item) => {
            allItems.push({
                ...item,
                categoryName: cat.name,
                categorySlug: cat.slug,
            });
        });
    });

    const filtered = allItems.filter((item) => {
        const matchesCategory =
            currentCategoryFilter === 'all' || item.categorySlug === currentCategoryFilter;
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.tag && item.tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'inStock' && item.inStock) ||
            (statusFilter === 'outOfStock' && !item.inStock);

        return matchesCategory && matchesSearch && matchesStatus;
    });

    const handleDeleteItem = (catSlug: string, itemId: string, itemName: string) => {
        if (confirm(`Are you sure you want to remove "${itemName}" from the store?`)) {
            deleteItemFromCategory(catSlug, itemId);
            refresh();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                        Uburu Home Catalog Items
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        View, organize, and manage products and services across all store departments.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to={
                            currentCategoryFilter !== 'all'
                                ? `/admin/add-item?category=${currentCategoryFilter}`
                                : '/admin/add-item'
                        }
                        className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Item
                    </Link>
                </div>
            </div>

            {/* Department Filter Pills */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs overflow-x-auto scrollbar-thin">
                <div className="flex items-center gap-2 min-w-max">
                    <button
                        onClick={() => setSearchParams({})}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            currentCategoryFilter === 'all'
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        All Items ({allItems.length})
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => setSearchParams({ category: cat.slug })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                currentCategoryFilter === cat.slug
                                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {cat.shortName} ({cat.items?.length || 0})
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Secondary Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search items by name, brand, or tag..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                            statusFilter === 'all' ? 'bg-slate-200 text-slate-800 font-bold' : 'text-slate-500'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('inStock')}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                            statusFilter === 'inStock' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-500'
                        }`}
                    >
                        In Stock
                    </button>
                    <button
                        onClick={() => setStatusFilter('outOfStock')}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                            statusFilter === 'outOfStock' ? 'bg-red-100 text-red-800 font-bold' : 'text-slate-500'
                        }`}
                    >
                        Out of Stock
                    </button>
                </div>
            </div>

            {/* Catalog Items Grid / Table */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-2xs space-y-3">
                    <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="font-bold text-slate-700 text-base">No items found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        No products match your current department or search filter. Add items to stock this category.
                    </p>
                    <Link
                        to={
                            currentCategoryFilter !== 'all'
                                ? `/admin/add-item?category=${currentCategoryFilter}`
                                : '/admin/add-item'
                        }
                        className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add First Item to This Category
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
                        >
                            {/* Product Photo */}
                            <div className="relative h-44 bg-slate-100 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {item.tag && (
                                    <span className="absolute top-2.5 left-2.5 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                                        {item.tag}
                                    </span>
                                )}
                                <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    item.inStock
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-red-500 text-white'
                                }`}>
                                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Item Information */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                                        {item.categoryName}
                                    </span>
                                    <h3 className="font-bold text-slate-800 text-sm mt-1 line-clamp-2" title={item.name}>
                                        {item.name}
                                    </h3>
                                    {item.brand && (
                                        <span className="text-[11px] text-slate-400 block mt-0.5">
                                            {item.brand}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-extrabold text-slate-900">
                                            KES {item.price.toLocaleString()}
                                        </div>
                                        {item.originalPrice && (
                                            <div className="text-[11px] text-slate-400 line-through">
                                                KES {item.originalPrice.toLocaleString()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => handleDeleteItem(item.categorySlug, item.id, item.name)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminItems;
