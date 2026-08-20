import React from 'react';

interface Props {
  current: number;
  total: number;
}

export const AssessmentProgress: React.FC<Props> = ({ current, total }) => {
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex justify-between text-slate-400 font-semibold">
        <span>Question {current + 1} of {total}</span>
        <span className="text-purple-400">{pct}% Completed</span>
      </div>
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default AssessmentProgress;
