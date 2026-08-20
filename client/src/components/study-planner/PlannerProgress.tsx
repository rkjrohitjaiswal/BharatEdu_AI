import React from 'react';
import { Award } from 'lucide-react';

export interface PlannerProgressProps {
  completionPercent: number;
  plannedMinutes: number;
  completedMinutes: number;
}

export const PlannerProgress: React.FC<PlannerProgressProps> = ({
  completionPercent,
  plannedMinutes,
  completedMinutes,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>Today's Completion Progress</span>
        </h3>
        <span className="text-xl font-black text-emerald-600">{completionPercent}%</span>
      </div>

      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, completionPercent))}%` }}
        />
      </div>

      <p className="text-xs text-slate-500 font-medium text-center">
        {completedMinutes} of {plannedMinutes} planned minutes finished today.
      </p>
    </div>
  );
};
