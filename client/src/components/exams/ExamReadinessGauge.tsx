import React from 'react';

interface ExamReadinessGaugeProps {
  score: number;
  level: string;
}

export const ExamReadinessGauge: React.FC<ExamReadinessGaugeProps> = ({ score, level }) => {
  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'strong':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'ready':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'developing':
        return 'text-sky-600 bg-sky-50 border-sky-200';
      case 'needs_attention':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical':
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-purple-50/50 rounded-2xl border border-purple-100 shadow-xs space-y-3">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-slate-100"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-purple-600 transition-all duration-1000 ease-out"
            strokeDasharray={`${score}, 100`}
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-slate-900">{score}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ 100</span>
        </div>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${getLevelColor(
          level
        )}`}
      >
        Readiness: {level.replace('_', ' ')}
      </span>
    </div>
  );
};
