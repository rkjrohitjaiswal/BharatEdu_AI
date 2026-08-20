import React from 'react';
import { DifficultyBadge } from './DifficultyBadge';

export interface AdaptiveDifficultyIndicatorProps {
  difficulty: string;
}

export const AdaptiveDifficultyIndicator: React.FC<AdaptiveDifficultyIndicatorProps> = ({ difficulty }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
      <span className="font-bold text-slate-600">Current Question Difficulty:</span>
      <DifficultyBadge difficulty={difficulty} />
    </div>
  );
};
