import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export interface RevisionScheduleProps {
  schedule: any[];
}

export const RevisionSchedule: React.FC<RevisionScheduleProps> = ({ schedule }) => {
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-indigo-600" />
        <h3 className="font-extrabold text-sm text-slate-900">7-Day Spaced Repetition Forecast</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {schedule.map((day, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border text-center space-y-1 ${
              day.dueCount > 0 ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase">{day.date.split('-').slice(1).join('/')}</span>
            <div className="font-extrabold text-base text-slate-900">{day.dueCount} Due</div>
            <span className="text-[10px] font-semibold text-slate-400 block">{day.estimatedMinutes} min</span>
          </div>
        ))}
      </div>
    </div>
  );
};
