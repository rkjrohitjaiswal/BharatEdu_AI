import React from 'react';

interface Props {
  breakdown: Record<string, { total: number; correct: number; percentage: number }>;
}

export const AssessmentConceptBreakdown: React.FC<Props> = ({ breakdown }) => {
  if (!breakdown || Object.keys(breakdown).length === 0) return null;

  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
      <h3 className="text-sm font-bold text-white">Concept Mastery Breakdown</h3>
      <div className="space-y-3">
        {Object.entries(breakdown).map(([concept, data]) => (
          <div key={concept} className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300 capitalize">{concept.replace(/_/g, ' ')}</span>
              <span className={data.percentage >= 70 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {data.percentage}% ({data.correct}/{data.total})
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all ${
                  data.percentage >= 70 ? 'bg-emerald-500' : data.percentage >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${data.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentConceptBreakdown;
