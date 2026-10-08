import React from 'react';

export interface TaskWeek {
    week: string;
    progress: number;
    due: number;
    qa: number;
    delegated: number;
    totalTasks: number;
}

interface TaskOverviewCardProps {
    data: TaskWeek[];
    title?: string;
    subtitle?: string;
}

export const TaskOverviewCard: React.FC<TaskOverviewCardProps> = ({
    data,
    title = 'All Tasks Overview',
    subtitle = 'Next 4 Weeks',
}) => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            {/* Top row */}
            <div>
                <h3 className="text-slate-800 font-semibold text-lg tracking-tight">{title}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>
            </div>

            {/* Segmented Rows */}
            <div className="my-6 space-y-4">
                {data.map((item) => (
                    <div key={item.week} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-500 w-14 shrink-0">
                            {item.week}
                        </span>

                        {/* Segmented progress line */}
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 flex overflow-hidden gap-[2px]">
                            {/* Progress (Purple) */}
                            <div
                                style={{ width: `${item.progress}%` }}
                                className="h-full bg-purple-500 rounded-l-full transition-all duration-500"
                                title={`Progress: ${item.progress}%`}
                            />
                            {/* Due (Sky Blue) */}
                            <div
                                style={{ width: `${item.due}%` }}
                                className="h-full bg-sky-500 transition-all duration-500"
                                title={`Due: ${item.due}%`}
                            />
                            {/* QA / Completed (Green) */}
                            <div
                                style={{ width: `${item.qa}%` }}
                                className="h-full bg-emerald-500 transition-all duration-500"
                                title={`QA: ${item.qa}%`}
                            />
                            {/* Delegated (Orange) */}
                            <div
                                style={{ width: `${item.delegated}%` }}
                                className="h-full bg-amber-500 rounded-r-full transition-all duration-500"
                                title={`Delegated: ${item.delegated}%`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend row matching screenshot */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-purple-500 rounded-full inline-block"></span>
                    <span>Progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-sky-500 rounded-full inline-block"></span>
                    <span>Due</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-emerald-500 rounded-full inline-block"></span>
                    <span>QA</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-amber-500 rounded-full inline-block"></span>
                    <span>Delegated</span>
                </div>
            </div>
        </div>
    );
};
