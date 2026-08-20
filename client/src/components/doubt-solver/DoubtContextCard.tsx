import React from 'react';
import { AlertCircle, Brain, CheckCircle2, GitBranch, ShieldAlert } from 'lucide-react';
import { IDoubtContextClientDTO } from '../../types/doubt-solver';

export interface DoubtContextCardProps {
  context: IDoubtContextClientDTO;
}

export const DoubtContextCard: React.FC<DoubtContextCardProps> = ({ context }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1.5">
          <Brain className="w-4 h-4" /> Curriculum Context
        </span>
        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">
          Mastery: {context.masteryScore}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-xl bg-white border border-slate-100 font-medium text-slate-700">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Risk Status</span>
          <span className={`font-black ${context.riskLevel === 'HIGH' ? 'text-red-600' : 'text-emerald-600'}`}>
            {context.riskLevel}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-white border border-slate-100 font-medium text-slate-700">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Prerequisites</span>
          <span className="font-bold text-slate-800">{context.prerequisiteConceptIds.length} Prerequisites</span>
        </div>
      </div>

      {context.prerequisiteConceptIds.length > 0 && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2 text-[11px] text-amber-800 font-medium">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Explaining foundational prerequisite concepts first before advancing.</span>
        </div>
      )}
    </div>
  );
};
