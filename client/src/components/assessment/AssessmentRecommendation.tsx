import React from 'react';
import { Target } from 'lucide-react';

export interface AssessmentRecommendationProps {
  conceptName: string;
  reason?: string;
  onStart: () => void;
}

export const AssessmentRecommendation: React.FC<AssessmentRecommendationProps> = ({ conceptName, reason, onStart }) => {
  return (
    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="space-y-0.5">
        <div className="font-extrabold text-indigo-900 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Recommended Next Target: {conceptName}</span>
        </div>
        {reason && <p className="text-[11px] text-indigo-700 font-medium">{reason}</p>}
      </div>

      <button
        onClick={onStart}
        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0 shadow-sm transition"
      >
        Start Recommended Assessment
      </button>
    </div>
  );
};
