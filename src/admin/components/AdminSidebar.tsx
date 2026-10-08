import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.webp';
import {
    LayoutDashboard,
    Layers,
    Package,
    PlusCircle,
    ExternalLink,
    X,
    LogOut,
    Store,
    FolderPlus,
    ChevronDown,
    ShieldCheck,
} from 'lucide-react';
import { getStoredCategories, HOME_CATALOG_EVENT } from '../data/homeAdminStorage';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const [categoryCount, setCategoryCount] = useState(0);
    const [itemCount, setItemCount] = useState(0);

    // Collapsible dropdown state for Uburu Home section
    const [isHomeOpen, setIsHomeOpen] = useState(true);

    const refreshCounts = () => {
        const cats = getStoredCategories();
        setCategoryCount(cats.length);
        const totalItems = cats.reduce((sum, c) => sum + (c.items?.length || 0), 0);
        setItemCount(totalItems);
    };

    useEffect(() => {
        refreshCounts();
        const handler = () => refreshCounts();
        window.addEventListener(HOME_CATALOG_EVENT, handler);
        return () => window.removeEventListener(HOME_CATALOG_EVENT, handler);
    }, []);

    // Ensure Uburu Home stays open when active
    useEffect(() => {
        const path = location.pathname;
        if (
            path === '/admin' ||
            path.startsWith('/admin/categories') ||
            path.startsWith('/admin/items') ||
            path.startsWith('/admin/add-item') ||
            path.startsWith('/admin/add-category')
        ) {
            setIsHomeOpen(true);
        }
    }, [location.pathname]);

    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group ${
            isActive
                ? 'bg-slate-800 text-white font-bold shadow-xs border-l-4 border-yellow-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
        }`;

    const isHomeRouteActive =
        location.pathname === '/admin' ||
        location.pathname.startsWith('/admin/categories') ||
        location.pathname.startsWith('/admin/items') ||
        location.pathname.startsWith('/admin/add-item') ||
        location.pathname.startsWith('/admin/add-category');

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar container */}
            <aside
                className={`fixed top-0 bottom-0 left-0 w-64 bg-[#141b2d] text-slate-200 z-50 flex flex-col border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand / Logo Top Header - Called Uburu Admin Panel */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/70">
                    <Link to="/admin" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform">
                            <img
                                src={logo}
                                alt="Uburu Logo"
                                className="w-full h-full object-contain filter drop-shadow-xs"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white tracking-tight text-base">
                                    Uburu Admin
                                </span>
                            </div>
                            <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block">
                                Admin Panel
                            </span>
                        </div>
                    </Link>

                    {/* Mobile close button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation scrollable area */}
                <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                    {/* SECTION: UBURU HOME (Collapsible Dropdown Section) */}
                    <div>
                        <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                            ENTITIES & SECTIONS
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsHomeOpen(!isHomeOpen)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                isHomeRouteActive
                                    ? 'bg-slate-800/90 text-amber-400 ring-1 ring-slate-700/50'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                    isHomeRouteActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-400'
                                }`}>
                                    <Store className="w-3.5 h-3.5" />
                                </div>
                                <span className="tracking-wide uppercase text-[11px]">UBURU HOME</span>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                    isHomeOpen ? 'rotate-180 text-amber-400' : ''
                                }`}
                            />
                        </button>

                        {/* Dropdown Sub-Items for Uburu Home */}
                        {isHomeOpen && (
                            <nav className="mt-1 ml-3 pl-3 border-l border-slate-800/80 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                <NavLink to="/admin" end className={navItemClass} onClick={() => onClose()}>
                                    <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                                    <span>Overview</span>
                                </NavLink>

                                <NavLink to="/admin/categories" className={navItemClass} onClick={() => onClose()}>
                                    <Layers className="w-4 h-4 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                                    <span className="flex-1">Categories</span>
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-amber-400 rounded-full border border-slate-700">
                                        {categoryCount}
                                    </span>
                                </NavLink>

                                <NavLink to="/admin/items" className={navItemClass} onClick={() => onClose()}>
                                    <Package className="w-4 h-4 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                                    <span className="flex-1">Catalog Items</span>
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-emerald-400 rounded-full border border-slate-700">
                                        {itemCount}
                                    </span>
                                </NavLink>

                                <NavLink to="/admin/add-item" className={navItemClass} onClick={() => onClose()}>
                                    <PlusCircle className="w-4 h-4 text-amber-400 group-hover:text-yellow-300 transition-colors" />
                                    <span className="flex-1 font-semibold text-amber-300">Add Item</span>
                                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-amber-400 text-slate-950 rounded-md">
                                        Action
                                    </span>
                                </NavLink>

                                <NavLink to="/admin/add-category" className={navItemClass} onClick={() => onClose()}>
                                    <FolderPlus className="w-4 h-4 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                                    <span>Add Category</span>
                                </NavLink>
                            </nav>
                        )}
                    </div>
                </div>

                {/* Bottom Footer Section */}
                <div className="p-4 border-t border-slate-800/80 bg-[#0f1523]/60 space-y-3">
                    {/* Switch to website */}
                    <Link
                        to="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50"
                    >
                        <span className="flex items-center gap-2">
                            <ExternalLink className="w-3.5 h-3.5 text-yellow-400" />
                            View Public Website
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold">Live</span>
                    </Link>

                    {/* Admin User profile pill */}
                    <div className="flex items-center gap-3 pt-2">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 flex items-center justify-center font-bold text-slate-900 text-xs shadow-xs">
                                UA
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#141b2d]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                                Uburu Admin
                            </p>
                            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-amber-400 inline" />
                                Super Admin
                            </p>
                        </div>
                        <Link
                            to="/"
                            title="Sign out / Exit"
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
};
