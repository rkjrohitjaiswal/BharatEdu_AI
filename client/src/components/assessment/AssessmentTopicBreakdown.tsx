import React from 'react';

interface Props {
  breakdown: Record<string, { total: number; correct: number; percentage: number }>;
}

export const AssessmentTopicBreakdown: React.FC<Props> = ({ breakdown }) => {
  if (!breakdown || Object.keys(breakdown).length === 0) return null;

  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
      <h3 className="text-sm font-bold text-white">Topic Performance</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {Object.entries(breakdown).map(([topic, data]) => (
          <div key={topic} className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between">
            <span className="font-semibold text-slate-200">{topic}</span>
            <span className="font-bold text-purple-400">{data.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentTopicBreakdown;
