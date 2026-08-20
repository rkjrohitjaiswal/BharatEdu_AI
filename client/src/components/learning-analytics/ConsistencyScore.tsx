import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

export interface ConsistencyScoreProps {
  consistency: any;
}

export const ConsistencyScore: React.FC<ConsistencyScoreProps> = ({ consistency }) => {
  if (!consistency) return null;

  const { consistencyScore = 0, consistencyLevel = 'needs_improvement', contributingFactors = [] } = consistency;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Study Consistency Score</span>
        </h3>
        <div className="text-right">
          <span className="text-2xl font-black text-indigo-600">{consistencyScore}/100</span>
          <span className="text-xs font-bold text-slate-500 capitalize block">{consistencyLevel.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, consistencyScore))}%` }}
        />
      </div>

      <div className="space-y-1 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-semibold text-slate-400 block uppercase">Contributing Factors:</span>
        <ul className="text-xs text-slate-600 space-y-1 font-medium">
          {contributingFactors.map((f: string, idx: number) => (
            <li key={idx} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
