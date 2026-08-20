import React from 'react';

export interface ConceptReadinessProps {
  score: number;
  level: string;
}

export const ConceptReadiness: React.FC<ConceptReadinessProps> = ({ score, level }) => {
  const getLevelColor = (l: string) => {
    switch (l) {
      case 'strong':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'ready':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'developing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'weak':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getLevelColor(level)}`}>
        {score}% ({level})
      </span>
    </div>
  );
};
