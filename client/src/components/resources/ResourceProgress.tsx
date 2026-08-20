import React from 'react';
import { BookOpen } from 'lucide-react';

interface Props {
  completedCount: number;
  totalCount: number;
}

export const ResourceProgress: React.FC<Props> = ({ completedCount, totalCount }) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 text-xs">
      <div className="flex items-center justify-between font-bold">
        <span className="text-white flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-purple-400" /> Resource Completion Progress
        </span>
        <span className="text-purple-400">{completedCount} / {totalCount} Completed ({percentage}%)</span>
      </div>
      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ResourceProgress;
