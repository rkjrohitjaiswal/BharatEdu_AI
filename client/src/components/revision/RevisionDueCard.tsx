import React from 'react';
import { Clock } from 'lucide-react';
import { RevisionTaskCard } from './RevisionTaskCard';

export interface RevisionDueCardProps {
  dueTasks: any[];
  onStartReview: (task: any) => void;
}

export const RevisionDueCard: React.FC<RevisionDueCardProps> = ({ dueTasks, onStartReview }) => {
  if (!dueTasks || dueTasks.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
        <Clock className="w-4 h-4 text-indigo-600" />
        <span>Due for Revision ({dueTasks.length})</span>
      </div>

      <div className="space-y-3">
        {dueTasks.map((task) => (
          <RevisionTaskCard key={task.id} task={task} onStartReview={onStartReview} />
        ))}
      </div>
    </div>
  );
};
