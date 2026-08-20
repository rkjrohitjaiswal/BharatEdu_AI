import React from 'react';
import { BookOpen, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export interface ResourceSummaryProps {
  summary: any;
}

export const ResourceSummary: React.FC<ResourceSummaryProps> = ({ summary }) => {
  if (!summary) return null;

  const { totalRecommended = 0, highPriorityCount = 0, activeGapsAddressed = 0, examUrgencyActive = false } = summary;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Recommended
        </span>
        <div className="text-2xl font-black text-slate-900">{totalRecommended}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> High Priority
        </span>
        <div className="text-2xl font-black text-slate-900">{highPriorityCount}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Gaps Addressed
        </span>
        <div className="text-2xl font-black text-slate-900">{activeGapsAddressed}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Exam Mode
        </span>
        <div className="text-2xl font-black text-slate-900">{examUrgencyActive ? 'Active' : 'Standard'}</div>
      </div>
    </div>
  );
};
