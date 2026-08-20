import React from 'react';
import { Layers } from 'lucide-react';

export const ClassComparison: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Layers className="w-5 h-5 text-indigo-400" />
        Multi-Class Performance Comparison
      </h3>
      <p className="text-xs text-slate-400">
        Comparing Class 10-A (72% Mastery) vs Class 10-B (68% Mastery). Class 10-A demonstrates +4% higher practice accuracy.
      </p>
    </div>
  );
};

export default ClassComparison;
