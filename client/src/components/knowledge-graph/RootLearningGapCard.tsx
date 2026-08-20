import React from 'react';
import { AlertOctagon, ArrowRight } from 'lucide-react';
import { PrerequisiteChain } from './PrerequisiteChain';

export interface RootLearningGapCardProps {
  rootGap: any;
}

export const RootLearningGapCard: React.FC<RootLearningGapCardProps> = ({ rootGap }) => {
  if (!rootGap) return null;

  const {
    rootGapConceptName,
    subject,
    masteryScore,
    affectedConceptsCount,
    affectedConcepts = [],
    prerequisiteChain = [],
    severity,
    explanation,
  } = rootGap;

  return (
    <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-600 animate-pulse" />
          <h4 className="font-extrabold text-slate-900 text-sm">Root Learning Gap Identified</h4>
        </div>
        <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-red-100 text-red-700 border border-red-300">
          {severity} Severity
        </span>
      </div>

      <div>
        <h3 className="text-base font-extrabold text-slate-900">
          {rootGapConceptName} <span className="text-xs font-semibold text-slate-500">({subject})</span>
        </h3>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{explanation}</p>
      </div>

      <div className="p-3 rounded-xl bg-white/80 border border-red-100 space-y-2">
        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
          <span>Affecting {affectedConceptsCount} Downstream Topic(s):</span>
          <span className="text-slate-500 font-semibold">{affectedConcepts.join(', ')}</span>
        </div>

        <PrerequisiteChain chain={prerequisiteChain} />
      </div>
    </div>
  );
};
