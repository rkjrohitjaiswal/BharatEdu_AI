import React from 'react';
import { ArrowRight, Target } from 'lucide-react';

export interface LearningPathNextConceptProps {
  nextConcept?: {
    conceptId: string;
    conceptName: string;
    subject: string;
    reason: string;
    actionUrl: string;
  };
  onStart: () => void;
}

export const LearningPathNextConcept: React.FC<LearningPathNextConceptProps> = ({ nextConcept, onStart }) => {
  if (!nextConcept) return null;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200/80 shadow-md space-y-4">
      <div className="flex items-center gap-2 text-indigo-700">
        <div className="p-2 rounded-xl bg-indigo-100 border border-indigo-200">
          <Target className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block">Recommended Next Focus</span>
          <h3 className="text-base font-black text-slate-900">{nextConcept.conceptName}</h3>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white/80 p-3 rounded-2xl border border-indigo-100">
        {nextConcept.reason}
      </p>

      <button
        onClick={onStart}
        className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 group"
      >
        <span>Start Recommended Concept</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
