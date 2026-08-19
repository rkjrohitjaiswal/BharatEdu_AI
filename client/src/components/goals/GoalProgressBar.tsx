import React from 'react';

interface GoalProgressBarProps {
  progressPercent: number;
  currentValue: number;
  targetValue: number;
  unit: string;
}

export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  progressPercent,
  currentValue,
  targetValue,
  unit,
}) => {
  const percent = Math.min(100, Math.max(0, Math.round(progressPercent || 0)));

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex justify-between items-center text-slate-700">
        <span className="font-semibold text-slate-600">Progress</span>
        <span className="font-extrabold text-slate-900">
          {currentValue} / {targetValue} {unit} ({percent}%)
        </span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            percent >= 100 ? 'bg-emerald-500' : percent >= 50 ? 'bg-purple-600' : 'bg-indigo-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
