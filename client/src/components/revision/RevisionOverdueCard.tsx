import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { RevisionTaskCard } from './RevisionTaskCard';

export interface RevisionOverdueCardProps {
  overdueTasks: any[];
  onStartReview: (task: any) => void;
}

export const RevisionOverdueCard: React.FC<RevisionOverdueCardProps> = ({ overdueTasks, onStartReview }) => {
  if (!overdueTasks || overdueTasks.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
      <div className="flex items-center gap-2 text-sm font-extrabold text-red-800">
        <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
        <span>Overdue Topics ({overdueTasks.length}) — High Memory Decay Risk</span>
      </div>

      <div className="space-y-3">
        {overdueTasks.map((task) => (
          <RevisionTaskCard key={task.id} task={task} onStartReview={onStartReview} />
        ))}
      </div>
    </div>
  );
};
