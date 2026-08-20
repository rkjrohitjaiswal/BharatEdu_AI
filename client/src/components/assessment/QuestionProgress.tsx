import React from 'react';

export interface QuestionProgressProps {
  current: number;
  total: number;
}

export const QuestionProgress: React.FC<QuestionProgressProps> = ({ current, total }) => {
  const percent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span>Question {current} of {total}</span>
        <span>{percent}% Complete</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
