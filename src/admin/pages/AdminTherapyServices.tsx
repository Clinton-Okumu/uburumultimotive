import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    getStoredTherapyServices,
    saveTherapyServices,
    resetTherapyToDefault,
    THERAPY_CONFIG_EVENT,
    type TherapyServiceConfig,
} from '../data/therapyAdminStorage';
import {
    HeartPulse,
    ArrowLeft,
    CheckCircle2,
    Save,
    RotateCcw,
    ExternalLink,
    MessageSquare,
    Rocket,
    Stethoscope,
    Brain,
    Eye,
} from 'lucide-react';

const iconMap = {
    MessageSquare,
    Rocket,
    Stethoscope,
    Brain,
    HeartPulse,
};

export const AdminTherapyServices: React.FC = () => {
    const [services, setServices] = useState<TherapyServiceConfig[]>([]);
    const [savedNotification, setSavedNotification] = useState(false);

    useEffect(() => {
        setServices(getStoredTherapyServices());
        const handler = () => setServices(getStoredTherapyServices());
        window.addEventListener(THERAPY_CONFIG_EVENT, handler);
        return () => window.removeEventListener(THERAPY_CONFIG_EVENT, handler);
    }, []);

    const handleFieldChange = (id: string, field: keyof TherapyServiceConfig, value: unknown) => {
        setServices((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const handleSaveAll = () => {
        saveTherapyServices(services);
        setSavedNotification(true);
        setTimeout(() => setSavedNotification(false), 3000);
    };

    const handleReset = () => {
        if (confirm('Reset therapy pathways to original system defaults?')) {
            resetTherapyToDefault();
            setServices(getStoredTherapyServices());
            setSavedNotification(true);
            setTimeout(() => setSavedNotification(false), 3000);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/therapy"
                        className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            Configure Therapy Pathways
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Customize the 3 main support pathway cards rendered on the public therapy page.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveAll}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-colors shadow-xs"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>

            {/* Notification alert */}
            {savedNotification && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Therapy pathways successfully updated and synchronized!</span>
                    </div>
                    <Link
                        to="/get/therapy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-emerald-900 hover:text-emerald-950 inline-flex items-center gap-1"
                    >
                        <span>View Public Page</span>
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>
            )}

            {/* 3 Pathway Cards Configurator */}
            <div className="space-y-6">
                {services.map((item, index) => {
                    const IconComponent = iconMap[item.iconName] || MessageSquare;
                    const isCoaching = item.id === 'coaching';

                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                                            isCoaching
                                                ? 'bg-neutral-900 text-yellow-400'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                            Pathway {index + 1}
                                        </span>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={item.enabled}
                                            onChange={(e) =>
                                                handleFieldChange(item.id, 'enabled', e.target.checked)
                                            }
                                            className="w-4 h-4 rounded text-amber-500 accent-amber-500 focus:ring-amber-400"
                                        />
                                        <span>{item.enabled ? 'Enabled' : 'Hidden'}</span>
                                    </label>
                                </div>
                            </div>

                            {/* Two-Column Editor: Inputs (Left) & Live Preview (Right) */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                {/* Left: Form Fields */}
                                <div className="lg:col-span-7 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Category Badge (Uppercase)
                                            </label>
                                            <input
                                                type="text"
                                                value={item.badge}
                                                onChange={(e) =>
                                                    handleFieldChange(item.id, 'badge', e.target.value)
                                                }
                                                placeholder="e.g. Mental Wellbeing"
                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Service Title
                                            </label>
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) =>
                                                    handleFieldChange(item.id, 'title', e.target.value)
                                                }
                                                placeholder="e.g. Therapy"
                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Description Copy
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={item.description}
                                            onChange={(e) =>
                                                handleFieldChange(item.id, 'description', e.target.value)
                                            }
                                            placeholder="Service explanation displayed to clients..."
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Button Call-to-Action
                                            </label>
                                            <input
                                                type="text"
                                                value={item.buttonText || 'Book Now'}
                                                onChange={(e) =>
                                                    handleFieldChange(item.id, 'buttonText', e.target.value)
                                                }
                                                placeholder="Book Now"
                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Form Booking Mapper
                                            </label>
                                            <input
                                                type="text"
                                                value={item.serviceType}
                                                onChange={(e) =>
                                                    handleFieldChange(item.id, 'serviceType', e.target.value)
                                                }
                                                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Live Card Preview matching screenshot */}
                                <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60">
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                                        <Eye className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Live Preview</span>
                                    </div>

                                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
                                        <div
                                            className={`py-8 flex flex-col items-center justify-center border-b border-slate-100 ${
                                                isCoaching ? 'bg-neutral-900' : 'bg-yellow-50/80'
                                            }`}
                                        >
                                            <div
                                                className={`p-3 rounded-2xl shadow-sm ${
                                                    isCoaching
                                                        ? 'bg-neutral-800 border border-yellow-500/30'
                                                        : 'bg-white border border-slate-100'
                                                }`}
                                            >
                                                <IconComponent
                                                    className={`w-7 h-7 ${
                                                        isCoaching ? 'text-yellow-400' : 'text-amber-600'
                                                    }`}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6 text-center space-y-3">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                                                {item.badge}
                                            </span>
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                {item.description}
                                            </p>
                                            <div
                                                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider ${
                                                    isCoaching
                                                        ? 'bg-neutral-900 text-yellow-400 border border-yellow-500/30'
                                                        : 'bg-amber-400 text-slate-950'
                                                }`}
                                            >
                                                {item.buttonText || 'Book Now'} →
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Save floating bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                    type="button"
                    onClick={handleSaveAll}
                    className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                    <Save className="w-4 h-4" />
                    <span>Save All Pathway Changes</span>
                </button>
            </div>
        </div>
    );
};

export default AdminTherapyServices;
