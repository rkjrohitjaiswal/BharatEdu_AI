import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Flame } from 'lucide-react';

export interface RevisionTodaySummaryProps {
  totalDue: number;
  criticalCount: number;
  highCount: number;
  estimatedMinutes: number;
}

export const RevisionTodaySummary: React.FC<RevisionTodaySummaryProps> = ({
  totalDue,
  criticalCount,
  highCount,
  estimatedMinutes,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Items Due</span>
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-extrabold text-slate-900">{totalDue}</div>
      </div>

      <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-red-600 text-xs font-semibold">
          <span>Critical Items</span>
          <AlertCircle className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-2xl font-extrabold text-red-700">{criticalCount}</div>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-amber-600 text-xs font-semibold">
          <span>High Priority</span>
          <CheckCircle2 className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-extrabold text-amber-700">{highCount}</div>
      </div>

      <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-indigo-600 text-xs font-semibold">
          <span>Est. Time Budget</span>
          <Clock className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-2xl font-extrabold text-indigo-700">{estimatedMinutes} min</div>
      </div>
    </div>
  );
};
