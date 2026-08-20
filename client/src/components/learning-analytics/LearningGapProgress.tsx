import React from 'react';
import { AlertTriangle } from 'lucide-react';

export interface LearningGapProgressProps {
  gapProgress: any;
}

export const LearningGapProgress: React.FC<LearningGapProgressProps> = ({ gapProgress }) => {
  if (!gapProgress) return null;

  const {
    totalActiveGaps = 0,
    criticalGaps = 0,
    highGaps = 0,
    mediumGaps = 0,
    gapClosureTrend = 'stable',
  } = gapProgress;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Learning Gap Progress</span>
        </h3>
        <span className="text-xs font-semibold text-slate-500 capitalize">Trend: {gapClosureTrend}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Active</span>
          <span className="text-lg font-black text-slate-900">{totalActiveGaps}</span>
        </div>
        <div className="p-3 rounded-xl bg-red-50 border border-red-100">
          <span className="text-[10px] text-red-500 block font-semibold uppercase">Critical</span>
          <span className="text-lg font-black text-red-700">{criticalGaps}</span>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
          <span className="text-[10px] text-amber-600 block font-semibold uppercase">High</span>
          <span className="text-lg font-black text-amber-800">{highGaps}</span>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
          <span className="text-[10px] text-blue-500 block font-semibold uppercase">Medium</span>
          <span className="text-lg font-black text-blue-700">{mediumGaps}</span>
        </div>
      </div>
    </div>
  );
};
