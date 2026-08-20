import React from 'react';
import { ShieldAlert, Zap } from 'lucide-react';

export interface DifficultyBadgeProps {
  difficulty: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const getBadgeStyle = (diff: string) => {
    switch (diff) {
      case 'foundational':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'easy':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'medium':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      case 'hard':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'advanced':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-300';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg border ${getBadgeStyle(difficulty)}`}>
      <Zap className="w-3 h-3" />
      <span>{difficulty}</span>
    </span>
  );
};
