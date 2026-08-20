import React from 'react';
import { ArrowRight, BookOpen, Clock, RotateCcw } from 'lucide-react';
import { RevisionPriorityBadge } from './RevisionPriorityBadge';
import { RevisionReason } from './RevisionReason';

export interface RevisionCardProps {
  item: any;
  onStart: (item: any) => void;
  onReview: (id: string, outcome: 'again' | 'hard' | 'good' | 'easy') => void;
}

export const RevisionCard: React.FC<RevisionCardProps> = ({ item, onStart, onReview }) => {
  const { id, topic, subject, priority, reason, estimatedMinutes, masteryScore, recommendedResourceTitle } = item;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            {subject}
          </span>
          <RevisionPriorityBadge priority={priority} />
        </div>

        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">{topic}</h4>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {estimatedMinutes || 10} min
            </span>
            <span>Mastery: {masteryScore}%</span>
          </div>
        </div>

        <RevisionReason reason={reason} />

        {recommendedResourceTitle && (
          <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-indigo-500" />
            <span className="truncate">Resource: {recommendedResourceTitle}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onStart(item)}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition inline-flex items-center gap-1 shadow-sm"
        >
          <span>Start Revision</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onReview(id, 'again')}
            className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] border border-red-200 transition"
          >
            Again
          </button>
          <button
            onClick={() => onReview(id, 'hard')}
            className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] border border-amber-200 transition"
          >
            Hard
          </button>
          <button
            onClick={() => onReview(id, 'good')}
            className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] border border-indigo-200 transition"
          >
            Good
          </button>
          <button
            onClick={() => onReview(id, 'easy')}
            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 transition"
          >
            Easy
          </button>
        </div>
      </div>
    </div>
  );
};
