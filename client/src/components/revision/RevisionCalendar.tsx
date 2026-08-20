import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export interface RevisionCalendarProps {
  days: any[];
}

export const RevisionCalendar: React.FC<RevisionCalendarProps> = ({ days }) => {
  if (!days || days.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
        <CalendarIcon className="w-4 h-4 text-indigo-600" />
        <span>Revision Distribution</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((d, i) => (
          <div key={i} className="flex-1 min-w-[70px] text-center p-2 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500">{d.dayName?.slice(0, 3)}</div>
            <div className="text-xs font-extrabold text-slate-900">{d.dueCount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
