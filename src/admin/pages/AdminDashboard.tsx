import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MetricCard } from '../components/MetricCard';
import { TaskOverviewCard } from '../components/TaskOverviewCard';
import {
    getStoredCategories,
    syncCatalogFromDatabase,
    HOME_CATALOG_EVENT,
} from '../data/homeAdminStorage';
import type { HomeCategory, HomeCategoryItem } from '../../data/homeCategories';
import {
    Plus,
    FolderPlus,
    ArrowRight,
    CheckCircle2,
    Store,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [categories, setCategories] = useState<HomeCategory[]>([]);

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

    const totalCategories = categories.length;
    const totalItems = categories.reduce((sum, c) => sum + (c.items?.length || 0), 0);

    // Flatten all items with category reference for the recent items list
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

    // Top categories with highest item counts for the distribution card
    const categoryDistribution = categories.slice(0, 4).map((cat) => {
        const count = cat.items?.length || 0;
        return {
            week: cat.shortName.length > 10 ? cat.shortName.substring(0, 9) + '…' : cat.shortName,
            progress: count > 0 ? 50 : 10,
            due: 25,
            qa: 15,
            delegated: 10,
            totalTasks: count,
        };
    });

    const itemsSparkline = [5, 8, 12, 10, 16, 14, 20, 18, 22, 26];
    const categoriesSparkline = [8, 9, 10, 10, 11, 11, 12, 12, 12, 12];

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            Uburu Home Admin
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                        Store & Catalog Dashboard
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Manage your departments, upload photos, and add items into Uburu Home categories.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/add-category"
                        className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs transition-colors"
                    >
                        <FolderPlus className="w-4 h-4 text-amber-500" />
                        New Category
                    </Link>
                    <Link
                        to="/admin/add-item"
                        className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item to Category
                    </Link>
                </div>
            </div>

            {/* Top Row: 3 Primary Cards matching uploaded reference screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1: Total Catalog Items */}
                <MetricCard
                    title="Total Catalog Items"
                    subtitle="Products & services across all departments"
                    value={`${totalItems} Items`}
                    trendText="Live in Uburu Home store"
                    sparklineData={itemsSparkline}
                    sparklineColor="#8b5cf6" // Purple line matching screenshot
                    actionLabel="View All"
                    onAction={() => {}}
                />

                {/* Card 2: Active Departments */}
                <MetricCard
                    title="Active Departments"
                    subtitle="Souvenirs, Food, Veggies, Kids, Clothing..."
                    value={`${totalCategories} Categories`}
                    trendText="Curated collections ready"
                    sparklineData={categoriesSparkline}
                    sparklineColor="#0284c7" // Sky blue line matching screenshot
                    actionLabel="Manage"
                    onAction={() => {}}
                />

                {/* Card 3: Department Distribution (Segmented bars matching screenshot) */}
                <TaskOverviewCard
                    data={categoryDistribution}
                    title="Department Stock Density"
                    subtitle="Catalog distribution across top sections"
                />
            </div>

            {/* Departments Grid with Banner Art & Quick Add Button */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
                            UBURU HOME DEPARTMENTS
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">
                            {categories.length} Departments
                        </span>
                    </div>
                    <Link
                        to="/admin/categories"
                        className="text-xs font-semibold text-slate-500 hover:text-amber-500 transition-colors flex items-center gap-1"
                    >
                        View All Categories
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categories.slice(0, 8).map((cat) => {
                        const count = cat.items?.length || 0;

                        return (
                            <div
                                key={cat.slug}
                                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group justify-between"
                            >
                                {/* Category Image */}
                                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                                    <img
                                        src={cat.highlightImage}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                                    <div className="absolute top-2.5 right-2.5">
                                        <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                            {cat.type}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-2.5 left-3 right-3">
                                        <h4 className="font-bold text-white text-sm line-clamp-1">
                                            {cat.name}
                                        </h4>
                                        <span className="text-[11px] text-amber-300 font-semibold">
                                            {count} {count === 1 ? 'item' : 'items'}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body & Quick Action */}
                                <div className="p-3.5 flex items-center justify-between gap-2 bg-slate-50/50">
                                    <Link
                                        to={`/admin/items?category=${cat.slug}`}
                                        className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
                                    >
                                        Browse ({count})
                                    </Link>
                                    <Link
                                        to={`/admin/add-item?category=${cat.slug}`}
                                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Item
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent Catalog Additions Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Catalog Items</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Recently added items and pricing across departments
                        </p>
                    </div>

                    <Link
                        to="/admin/items"
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                        View Full Catalog ({allItems.length})
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="px-6 py-3.5">Product</th>
                                <th className="px-6 py-3.5">Department</th>
                                <th className="px-6 py-3.5">Price</th>
                                <th className="px-6 py-3.5">Stock Status</th>
                                <th className="px-6 py-3.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {allItems.slice(0, 6).map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                                            />
                                            <div>
                                                <div className="font-bold text-slate-800 line-clamp-1">
                                                    {item.name}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    {item.brand || 'Uburu Brand'} {item.tag && `• ${item.tag}`}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-bold text-[11px]">
                                            {item.categoryName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 font-bold text-slate-800">
                                        KES {item.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            item.inStock
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <Link
                                            to={`/get/home/category/${item.categorySlug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                                        >
                                            View in Store
                                        </Link>
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

export default AdminDashboard;
