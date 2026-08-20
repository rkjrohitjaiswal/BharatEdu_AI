import React from 'react';
import { AlertTriangle, CheckCircle2, GitBranch, ShieldAlert } from 'lucide-react';

export interface KnowledgeGraphSummaryProps {
  summary: any;
}

export const KnowledgeGraphSummary: React.FC<KnowledgeGraphSummaryProps> = ({ summary }) => {
  if (!summary) return null;

  const {
    totalConcepts = 0,
    strongConceptsCount = 0,
    developingConceptsCount = 0,
    weakConceptsCount = 0,
    blockedConceptsCount = 0,
    overallHealthScore = 75,
  } = summary;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <GitBranch className="w-3.5 h-3.5 text-indigo-600" /> Total Concepts
        </span>
        <div className="text-2xl font-black text-slate-900">{totalConcepts}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Strong / Ready
        </span>
        <div className="text-2xl font-black text-slate-900">{strongConceptsCount}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-blue-600" /> Developing
        </span>
        <div className="text-2xl font-black text-slate-900">{developingConceptsCount}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Weak
        </span>
        <div className="text-2xl font-black text-slate-900">{weakConceptsCount}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Blocked
        </span>
        <div className="text-2xl font-black text-slate-900">{blockedConceptsCount}</div>
      </div>
    </div>
  );
};
