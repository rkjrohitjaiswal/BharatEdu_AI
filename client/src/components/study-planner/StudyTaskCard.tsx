import React from 'react';
import { ArrowRight, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StudyTaskCardProps {
  task: any;
  onComplete: (taskId: string) => void;
  completing: boolean;
}

export const StudyTaskCard: React.FC<StudyTaskCardProps> = ({ task, onComplete, completing }) => {
  const { taskId, title, subject, topic, taskType, estimatedMinutes, priority, reason, actionUrl, completed } = task;

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        completed
          ? 'bg-slate-50/70 border-slate-200 opacity-75'
          : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getPriorityBadge(priority)}`}>
              {priority}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              {taskType.replace('_', ' ')}
            </span>
            <span className="text-xs font-semibold text-slate-500">{subject}</span>
          </div>

          <h4 className={`font-bold text-sm text-slate-900 ${completed ? 'line-through text-slate-500' : ''}`}>
            {title}
          </h4>

          <p className="text-xs text-slate-500 font-medium">💡 {reason}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {estimatedMinutes} min
          </span>

          {!completed ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onComplete(taskId)}
                disabled={completing}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition inline-flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>

              <Link
                to={actionUrl || '/practice'}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition inline-flex items-center"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
