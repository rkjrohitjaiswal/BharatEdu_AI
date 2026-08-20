import React from 'react';
import { CalendarRange } from 'lucide-react';

export interface WeeklyPlannerProps {
  weeklyData: any;
}

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ weeklyData }) => {
  if (!weeklyData || !weeklyData.days) return null;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <CalendarRange className="w-5 h-5 text-indigo-600" />
          <span>Weekly Study Schedule (Monday – Sunday)</span>
        </h3>
        <span className="text-xs font-bold text-indigo-600">{weeklyData.totalWeekPlannedMinutes} min total planned</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {weeklyData.days.map((day: any, idx: number) => (
          <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-900">{day.dayName}</span>
              <span className="text-[10px] text-slate-400">{day.date}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 block">
                {day.totalPlannedMinutes} min ({day.tasksCount} tasks)
              </span>
              <p className="font-medium text-slate-800 text-[11px] truncate" title={day.topPriority}>
                🎯 {day.topPriority}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
