import React from 'react';
import { AlertTriangle, Award, Brain, Clock, Flame } from 'lucide-react';

export interface RevisionSummaryProps {
  summary: any;
}

export const RevisionSummary: React.FC<RevisionSummaryProps> = ({ summary }) => {
  if (!summary) return null;

  const {
    totalDue = 0,
    totalOverdue = 0,
    averageRetention = 50,
    masteredCount = 0,
    reviewStreakDays = 0,
  } = summary;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-indigo-600" /> Due Today
        </span>
        <div className="text-2xl font-black text-slate-900">{totalDue}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Overdue
        </span>
        <div className="text-2xl font-black text-slate-900">{totalOverdue}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <Brain className="w-3.5 h-3.5 text-purple-600" /> Avg Retention
        </span>
        <div className="text-2xl font-black text-slate-900">{averageRetention}%</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-emerald-600" /> Mastered
        </span>
        <div className="text-2xl font-black text-slate-900">{masteredCount}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" /> Streak
        </span>
        <div className="text-2xl font-black text-slate-900">{reviewStreakDays} Days</div>
      </div>
    </div>
  );
};
