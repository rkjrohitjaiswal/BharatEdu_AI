import React from 'react';
import { Clock, Play, Calendar, CheckCircle2 } from 'lucide-react';
import { RevisionPriorityBadge } from './RevisionPriorityBadge';
import { RevisionReason } from './RevisionReason';
import { RevisionRetentionMeter } from './RevisionRetentionMeter';

export interface RevisionTaskCardProps {
  task: any;
  onStartReview: (task: any) => void;
}

export const RevisionTaskCard: React.FC<RevisionTaskCardProps> = ({ task, onStartReview }) => {
  const {
    id,
    subject,
    topic,
    reviewLevel,
    retentionScore,
    priority,
    nextReviewAt,
    estimatedMinutes,
    reason,
    overdue,
    status,
  } = task;

  const isMastered = status === 'mastered' || reviewLevel === 'mastered';
  const dueDateStr = new Date(nextReviewAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        overdue
          ? 'bg-red-50/40 border-red-200 hover:border-red-300'
          : isMastered
          ? 'bg-emerald-50/40 border-emerald-200'
          : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              {subject}
            </span>
            <RevisionPriorityBadge priority={priority} />
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700 border border-slate-200 capitalize">
              {reviewLevel} level
            </span>
            {overdue && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-red-100 text-red-700 border border-red-300 animate-pulse">
                Overdue
              </span>
            )}
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">{topic}</h4>
            <RevisionReason reason={reason} />
          </div>

          <div className="max-w-xs">
            <RevisionRetentionMeter score={retentionScore} />
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-3 shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {estimatedMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {dueDateStr}
            </span>
          </div>

          {isMastered ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Topic Mastered
            </span>
          ) : (
            <button
              onClick={() => onStartReview(task)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Review</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
