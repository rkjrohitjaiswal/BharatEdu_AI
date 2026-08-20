import React from 'react';

export interface RevisionProgressProps {
  completed: number;
  total: number;
}

export const RevisionProgress: React.FC<RevisionProgressProps> = ({ completed, total }) => {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-700">Today's Revision Progress</span>
        <span className="text-indigo-600">{percent}% ({completed}/{total} Completed)</span>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};
