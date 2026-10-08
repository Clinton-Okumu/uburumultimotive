import React from 'react';
import { Sparkline } from './Sparkline';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
    title: string;
    subtitle: string;
    value: string;
    trendText: string;
    trendType?: 'positive' | 'neutral';
    sparklineData: number[];
    sparklineColor: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    subtitle,
    value,
    trendText,
    sparklineData,
    sparklineColor,
    actionLabel,
    onAction,
}) => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
            {/* Top row */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-slate-800 font-semibold text-lg tracking-tight">{title}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>
                </div>
                {actionLabel && (
                    <button
                        onClick={onAction}
                        className="text-xs font-medium text-slate-400 hover:text-amber-600 flex items-center gap-0.5 transition-colors"
                    >
                        {actionLabel}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Middle value & trend */}
            <div className="my-5">
                <div className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-baseline gap-2">
                    {value}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{trendText}</span>
                </div>
            </div>

            {/* Bottom sparkline */}
            <div className="-mx-6 -mb-6 pt-2">
                <Sparkline
                    data={sparklineData}
                    color={sparklineColor}
                    height={55}
                />
            </div>
        </div>
    );
};
