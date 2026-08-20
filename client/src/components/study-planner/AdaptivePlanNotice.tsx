import React from 'react';
import { Info } from 'lucide-react';

export const AdaptivePlanNotice: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-indigo-900 text-xs flex items-start gap-2.5 font-medium">
      <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
      <div>
        <span className="font-bold block">Adaptive Scheduling Active</span>
        <span>
          This plan dynamically recalibrates based on your active learning gaps, exam dates, risk indicators, and completed tasks.
        </span>
      </div>
    </div>
  );
};
