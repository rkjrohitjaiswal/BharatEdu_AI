import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface MentorPriorityCardProps {
  task: any;
}

export const MentorPriorityCard: React.FC<MentorPriorityCardProps> = ({ task }) => {
  if (!task) return null;

  return (
    <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
              #1 Top Priority Today
            </span>
          </div>
          <h4 className="font-extrabold text-amber-950 text-sm">{task.title}</h4>
          <p className="text-xs text-amber-900 font-medium">{task.reason}</p>
        </div>
      </div>

      <Link
        to={task.actionUrl || '/practice'}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-sm transition shrink-0"
      >
        <span>Address Priority Now</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
