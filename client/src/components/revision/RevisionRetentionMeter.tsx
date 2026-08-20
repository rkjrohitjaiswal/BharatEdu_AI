import React from 'react';
import { Brain } from 'lucide-react';

export interface RevisionRetentionMeterProps {
  score: number;
  showLabel?: boolean;
}

export const RevisionRetentionMeter: React.FC<RevisionRetentionMeterProps> = ({ score, showLabel = true }) => {
  const boundedScore = Math.min(100, Math.max(0, score));

  const getLabel = (val: number) => {
    if (val >= 90) return { text: 'Retained', color: 'text-emerald-700', bg: 'bg-emerald-500' };
    if (val >= 75) return { text: 'Strong', color: 'text-indigo-700', bg: 'bg-indigo-500' };
    if (val >= 50) return { text: 'Developing', color: 'text-blue-700', bg: 'bg-blue-500' };
    if (val >= 25) return { text: 'Weak', color: 'text-amber-700', bg: 'bg-amber-500' };
    return { text: 'Critical', color: 'text-red-700', bg: 'bg-red-500' };
  };

  const status = getLabel(boundedScore);

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-500 flex items-center gap-1">
            <Brain className="w-3.5 h-3.5 text-indigo-600" /> Retention Strength
          </span>
          <span className={status.color}>
            {boundedScore}% ({status.text})
          </span>
        </div>
      )}

      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${status.bg}`}
          style={{ width: `${boundedScore}%` }}
        />
      </div>
    </div>
  );
};
