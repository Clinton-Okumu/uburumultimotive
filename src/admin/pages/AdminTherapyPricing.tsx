import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    getStoredTherapyPricing,
    savePricingPlan,
    deletePricingPlan,
    resetTherapyToDefault,
    THERAPY_CONFIG_EVENT,
    type TherapyPricingPlan,
} from '../data/therapyAdminStorage';
import {
    Plus,
    Trash2,
    Edit3,
    ArrowLeft,
    CheckCircle2,
    RotateCcw,
    X,
    Star,
    Check,
} from 'lucide-react';

export const AdminTherapyPricing: React.FC = () => {
    const [pricingPlans, setPricingPlans] = useState<TherapyPricingPlan[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'Individual' | 'Couples' | 'Group' | 'Coaching' | 'Medical'>('all');
    const [editingPlan, setEditingPlan] = useState<TherapyPricingPlan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const refreshData = () => {
        setPricingPlans(getStoredTherapyPricing());
    };

    useEffect(() => {
        refreshData();
        const handler = () => refreshData();
        window.addEventListener(THERAPY_CONFIG_EVENT, handler);
        return () => window.removeEventListener(THERAPY_CONFIG_EVENT, handler);
    }, []);

    const showNotify = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredPlans = pricingPlans.filter(
        (p) => activeTab === 'all' || p.category === activeTab
    );

    const handleOpenCreate = () => {
        setEditingPlan({
            id: `plan-${Date.now()}`,
            category: activeTab !== 'all' ? activeTab : 'Individual',
            mode: 'Online',
            title: '',
            sessions: 1,
            amountKes: 2000,
            amountUsd: 40,
            description: '',
            features: ['50-minute clinical session', 'Confidential video room', 'Actionable mental health tools'],
            isPopular: false,
            isActive: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (plan: TherapyPricingPlan) => {
        setEditingPlan({ ...plan, features: [...plan.features] });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete the plan "${title}"?`)) {
            deletePricingPlan(id);
            refreshData();
            showNotify(`Plan "${title}" deleted.`);
        }
    };

    const handleSavePlan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlan) return;
        if (!editingPlan.title.trim()) {
            alert('Please provide a plan title');
            return;
        }

        savePricingPlan(editingPlan);
        refreshData();
        setIsModalOpen(false);
        showNotify(`Plan "${editingPlan.title}" saved successfully!`);
    };

    const handleResetAll = () => {
        if (confirm('Reset all therapy pricing plans to system defaults?')) {
            resetTherapyToDefault();
            refreshData();
            showNotify('All pricing plans reset to original defaults.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
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
                            Therapy Pricing & Consultation Packages
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Set consultation rates, package bundles, and virtual or in-person delivery fees.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                    <button
                        type="button"
                        onClick={handleResetAll}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-colors shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Pricing Plan</span>
                    </button>
                </div>
            </div>

            {/* Notification Alert */}
            {notification && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{notification}</span>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-2xs overflow-x-auto scrollbar-thin">
                <div className="flex items-center gap-2 min-w-max">
                    {(
                        [
                            { id: 'all', label: 'All Plans' },
                            { id: 'Individual', label: 'Individual Therapy' },
                            { id: 'Couples', label: 'Couples & Family' },
                            { id: 'Group', label: 'Group Circles' },
                            { id: 'Coaching', label: 'Life Coaching' },
                            { id: 'Medical', label: 'Medical Consultation' },
                        ] as const
                    ).map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label} (
                            {tab.id === 'all'
                                ? pricingPlans.length
                                : pricingPlans.filter((p) => p.category === tab.id).length}
                            )
                        </button>
                    ))}
                </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`bg-white rounded-3xl border shadow-sm p-6 sm:p-7 flex flex-col justify-between group hover:shadow-xl transition-all relative ${
                            plan.isPopular
                                ? 'border-amber-400 ring-2 ring-amber-400/20'
                                : 'border-slate-200/90'
                        }`}
                    >
                        {plan.isPopular && (
                            <span className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                <Star className="w-3 h-3 fill-slate-950" />
                                Most Popular
                            </span>
                        )}

                        <div>
                            {/* Top metadata */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider">
                                    {plan.category}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                    {plan.mode} · {plan.sessions} {plan.sessions === 1 ? 'session' : 'sessions'}
                                </span>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                {plan.title}
                            </h3>

                            {plan.description && (
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                                    {plan.description}
                                </p>
                            )}

                            {/* Price */}
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-900">
                                    KES {plan.amountKes.toLocaleString()}
                                </span>
                                {plan.amountUsd && (
                                    <span className="text-xs text-slate-500 font-semibold">
                                        / ${plan.amountUsd} USD
                                    </span>
                                )}
                            </div>

                            {/* Features list */}
                            <ul className="mt-4 space-y-2 text-xs text-slate-600">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Card bottom actions */}
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={() => handleOpenEdit(plan)}
                                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                                <span>Edit Plan</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(plan.id, plan.title)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Delete plan"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal: Create or Edit Plan */}
            {isModalOpen && editingPlan && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                            <h3 className="text-lg font-black text-slate-900">
                                {editingPlan.id ? 'Configure Pricing Plan' : 'New Pricing Plan'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Plan Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editingPlan.title}
                                    onChange={(e) =>
                                        setEditingPlan({ ...editingPlan, title: e.target.value })
                                    }
                                    placeholder="e.g. Online Individual - 4 Sessions"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={editingPlan.category}
                                        onChange={(e) =>
                                            setEditingPlan({
                                                ...editingPlan,
                                                category: e.target.value as TherapyPricingPlan['category'],
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    >
                                        <option value="Individual">Individual</option>
                                        <option value="Couples">Couples & Family</option>
                                        <option value="Group">Group</option>
                                        <option value="Coaching">Life Coaching</option>
                                        <option value="Medical">Medical</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Mode / Delivery
                                    </label>
                                    <select
                                        value={editingPlan.mode}
                                        onChange={(e) =>
                                            setEditingPlan({
                                                ...editingPlan,
                                                mode: e.target.value as TherapyPricingPlan['mode'],
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    >
                                        <option value="Online">Online Virtual</option>
                                        <option value="Physical">In-Clinic Physical</option>
                                        <option value="Both">Both Available</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Sessions Count
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={editingPlan.sessions}
                                        onChange={(e) =>
                                            setEditingPlan({
                                                ...editingPlan,
                                                sessions: parseInt(e.target.value) || 1,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Amount (KES)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min={0}
                                        value={editingPlan.amountKes}
                                        onChange={(e) =>
                                            setEditingPlan({
                                                ...editingPlan,
                                                amountKes: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Amount (USD)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={editingPlan.amountUsd || ''}
                                        onChange={(e) =>
                                            setEditingPlan({
                                                ...editingPlan,
                                                amountUsd: parseInt(e.target.value) || undefined,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={2}
                                    value={editingPlan.description || ''}
                                    onChange={(e) =>
                                        setEditingPlan({ ...editingPlan, description: e.target.value })
                                    }
                                    placeholder="Short plan summary..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Features (One per line)
                                </label>
                                <textarea
                                    rows={3}
                                    value={editingPlan.features.join('\n')}
                                    onChange={(e) =>
                                        setEditingPlan({
                                            ...editingPlan,
                                            features: e.target.value.split('\n').filter((l) => l.trim()),
                                        })
                                    }
                                    placeholder="Features list..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800 font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={editingPlan.isPopular}
                                        onChange={(e) =>
                                            setEditingPlan({ ...editingPlan, isPopular: e.target.checked })
                                        }
                                        className="w-4 h-4 rounded text-amber-500 accent-amber-500 focus:ring-amber-400"
                                    />
                                    <span>Badge as "Most Popular"</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800 font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={editingPlan.isActive}
                                        onChange={(e) =>
                                            setEditingPlan({ ...editingPlan, isActive: e.target.checked })
                                        }
                                        className="w-4 h-4 rounded text-amber-500 accent-amber-500 focus:ring-amber-400"
                                    />
                                    <span>Plan is Active</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-xl hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-xs"
                                >
                                    Save Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTherapyPricing;
