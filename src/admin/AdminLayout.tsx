import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

export const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Determine current section title based on pathname
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/village/add-event')) return 'Add Village Event';
        if (path.includes('/village/events')) return 'Manage Village Events';
        if (path.includes('/village')) return 'Uburu Village Administration';
        if (path.includes('/therapy/services')) return 'Therapy Pathways & Services';
        if (path.includes('/therapy/pricing')) return 'Therapy Pricing & Packages';
        if (path.includes('/therapy')) return 'Uburu Therapy Administration';
        if (path.includes('/categories')) return 'Uburu Home Categories';
        if (path.includes('/add-item')) return 'Add Item to Category';
        if (path.includes('/add-category')) return 'Create New Category';
        if (path.includes('/items')) return 'Catalog Items';
        return 'Uburu Admin Panel';
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased">
            {/* Dark Sidebar matching uploaded dashboard screenshot */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area (offset by sidebar width on lg screens) */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
                {/* Clean Top Header with badges and profile dropdown */}
                <AdminHeader
                    title={getPageTitle()}
                    onMenuToggle={() => setSidebarOpen((prev) => !prev)}
                />

                {/* Body Content */}
                <main className="flex-1 p-4 sm:p-7 lg:p-8 max-w-[1400px] w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
