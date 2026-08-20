import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export interface RevisionWeeklyPlanProps {
  weeklyData: any;
}

export const RevisionWeeklyPlan: React.FC<RevisionWeeklyPlanProps> = ({ weeklyData }) => {
  if (!weeklyData || !Array.isArray(weeklyData.days)) return null;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>7-Day Spaced Repetition Schedule</span>
        </div>
        <span className="text-xs font-bold text-slate-500">
          Total: {weeklyData.totalWeekPlannedMinutes || 105} mins
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
        {weeklyData.days.map((day: any, idx: number) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border space-y-2 text-xs flex flex-col justify-between ${
              day.dueCount > 0 ? 'bg-indigo-50/40 border-indigo-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <div className="font-bold text-slate-900 text-xs">{day.dayName}</div>
              <div className="text-[10px] text-slate-400 font-semibold">{day.date}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-indigo-700">{day.dueCount} Topics</div>
              <div className="text-[10px] text-slate-500 font-medium line-clamp-1">{day.topPriorityTopic}</div>
            </div>

            <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {day.plannedMinutes}m
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
