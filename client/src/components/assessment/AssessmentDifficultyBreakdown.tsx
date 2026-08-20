import React from 'react';

interface Props {
  breakdown: Record<string, { total: number; correct: number; percentage: number }>;
}

export const AssessmentDifficultyBreakdown: React.FC<Props> = ({ breakdown }) => {
  if (!breakdown || Object.keys(breakdown).length === 0) return null;

  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
      <h3 className="text-sm font-bold text-white">Difficulty Performance</h3>
      <div className="grid grid-cols-3 gap-3 text-xs text-center">
        {['easy', 'medium', 'hard'].map((diff) => {
          const data = breakdown[diff] || { total: 0, correct: 0, percentage: 0 };
          return (
            <div key={diff} className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <div className="text-[10px] font-bold uppercase text-slate-400">{diff}</div>
              <div className="text-base font-extrabold text-white mt-1">{data.percentage}%</div>
              <div className="text-[10px] text-slate-500">{data.correct}/{data.total}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentDifficultyBreakdown;
