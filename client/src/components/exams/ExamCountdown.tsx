import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface ExamCountdownProps {
  daysRemaining: number;
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({ daysRemaining }) => {
  if (daysRemaining < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
        <Clock className="w-3 h-3" /> Completed / Past
      </span>
    );
  }

  if (daysRemaining === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-red-700 bg-red-100 px-2.5 py-1 rounded-full animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5" /> TODAY IS EXAM DAY!
      </span>
    );
  }

  const isUrgent = daysRemaining <= 7;
  const isWarning = daysRemaining <= 14;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
        isUrgent
          ? 'bg-red-100 text-red-700 border border-red-200'
          : isWarning
          ? 'bg-amber-100 text-amber-800 border border-amber-200'
          : 'bg-purple-100 text-purple-700 border border-purple-200'
      }`}
    >
      <Clock className="w-3.5 h-3.5" /> {daysRemaining} Day{daysRemaining > 1 ? 's' : ''} Left
    </span>
  );
};
