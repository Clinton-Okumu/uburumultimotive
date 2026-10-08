import React, { useState, useRef, useEffect } from 'react';
import {
    Menu,
    Bell,
    Mail,
    ChevronDown,
    Search,
    CheckCheck,
    LogOut,
    ExternalLink,
    Store,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StoreNotification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'order' | 'item' | 'system';
}

const defaultStoreNotifications: StoreNotification[] = [
    {
        id: 'notif-1',
        title: 'New Customer Order',
        message: 'Mercy Achieng placed an order for 2x Fleece Hoodies (KES 6,600).',
        time: '10m ago',
        read: false,
        type: 'order',
    },
    {
        id: 'notif-2',
        title: 'Department Inquiry',
        message: 'New WhatsApp inquiry received for Uburu Household cleaning pack.',
        time: '45m ago',
        read: false,
        type: 'item',
    },
    {
        id: 'notif-3',
        title: 'Catalog Synced',
        message: 'All Uburu Home store departments updated with latest stock.',
        time: '2h ago',
        read: true,
        type: 'system',
    },
];

interface AdminHeaderProps {
    onMenuToggle: () => void;
    title?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    onMenuToggle,
    title = 'Account',
}) => {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState(defaultStoreNotifications);

    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Close popovers on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <header className="h-20 bg-white border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-all">
            {/* Left side: Hamburger button + Title */}
            <div className="flex items-center gap-3 sm:gap-4">
                <button
                    onClick={onMenuToggle}
                    className="p-2 -ml-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Toggle navigation menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Right side: Search + 2 badged icons + Avatar with dropdown */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Search box */}
                <div className="hidden md:flex items-center relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                        type="text"
                        placeholder="Search items, categories..."
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 w-44 lg:w-56 transition-all"
                    />
                </div>

                {/* Notifications Bell matching screenshot with orange badge "3" */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => {
                            setNotificationsOpen(!notificationsOpen);
                            setProfileOpen(false);
                        }}
                        className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        aria-label="View notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications dropdown */}
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                                <span className="font-bold text-sm text-slate-800">
                                    Notifications ({unreadCount})
                                </span>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5" />
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-3.5 hover:bg-slate-50 transition-colors ${
                                            !notif.read ? 'bg-amber-50/40' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-xs font-semibold text-slate-800">
                                                {notif.title}
                                            </p>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                                {notif.time}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            {notif.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Messages / Enquiries Icon with badge */}
                <div className="relative">
                    <button
                        className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        aria-label="Direct messages"
                        onClick={() => alert('New WhatsApp customer cart inquiries')}
                    >
                        <Mail className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                            3
                        </span>
                    </button>
                </div>

                {/* User avatar + Chevron dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => {
                            setProfileOpen(!profileOpen);
                            setNotificationsOpen(false);
                        }}
                        className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-900 font-extrabold text-xs flex items-center justify-center ring-2 ring-yellow-400/30 overflow-hidden">
                            <span className="tracking-tighter">UA</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                    </button>

                    {/* Profile dropdown menu */}
                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="px-4 py-2 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-800">Uburu Admin</p>
                                <p className="text-[11px] text-slate-500 truncate">
                                    admin@uburumultimove.org
                                </p>
                            </div>

                            <div className="py-1">
                                <Link
                                    to="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                                >
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                    Visit Public Website
                                </Link>
                                <Link
                                    to="/get/home"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                                >
                                    <Store className="w-3.5 h-3.5 text-slate-400" />
                                    Visit Uburu Home
                                </Link>
                            </div>

                            <div className="border-t border-slate-100 pt-1">
                                <Link
                                    to="/"
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold"
                                >
                                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                                    Exit Admin
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
