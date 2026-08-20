import React from 'react';
import { Clock } from 'lucide-react';

export interface StudyTimeBudgetProps {
  availableMinutes: number;
  plannedMinutes: number;
  completedMinutes: number;
  onUpdateAvailable: (minutes: number) => void;
}

export const StudyTimeBudget: React.FC<StudyTimeBudgetProps> = ({
  availableMinutes,
  plannedMinutes,
  completedMinutes,
  onUpdateAvailable,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span>Daily Study Time Budget</span>
        </h3>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-slate-500">Available:</span>
          <select
            value={availableMinutes}
            onChange={(e) => onUpdateAvailable(Number(e.target.value))}
            className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
            <option value={90}>90 min</option>
            <option value={120}>120 min</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Available</span>
          <span className="text-lg font-black text-slate-900">{availableMinutes} min</span>
        </div>

        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
          <span className="text-[10px] text-indigo-600 block font-semibold uppercase">Planned</span>
          <span className="text-lg font-black text-indigo-800">{plannedMinutes} min</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
          <span className="text-[10px] text-emerald-600 block font-semibold uppercase">Completed</span>
          <span className="text-lg font-black text-emerald-800">{completedMinutes} min</span>
        </div>
      </div>
    </div>
  );
};
