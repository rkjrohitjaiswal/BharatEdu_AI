import React from 'react';
import { CheckCircle2, PlayCircle, SkipForward } from 'lucide-react';
import { ILearningPathTaskDTO } from '../../types/learning-path';
import { LearningPathPriorityBadge } from './LearningPathPriorityBadge';

export interface LearningPathItemProps {
  item: ILearningPathTaskDTO;
  onStart: (itemId: string) => void;
  onComplete: (itemId: string) => void;
  onSkip?: (itemId: string) => void;
}

export const LearningPathItemCard: React.FC<LearningPathItemProps> = ({ item, onStart, onComplete, onSkip }) => {
  return (
    <div className="p-4 rounded-2xl border bg-white border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
            {item.taskType} • {item.estimatedMinutes} mins
          </span>
          <LearningPathPriorityBadge priority={item.priority} />
        </div>
        <h4 className="text-xs font-black text-slate-900 leading-snug">{item.title}</h4>
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        {item.status === 'completed' ? (
          <span className="w-full py-1.5 text-center rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        ) : (
          <>
            <button
              onClick={() => (item.status === 'active' ? onComplete(item.id) : onStart(item.id))}
              className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-1 transition"
            >
              {item.status === 'active' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" /> Start
                </>
              )}
            </button>
            {onSkip && (
              <button
                onClick={() => onSkip(item.id)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs transition"
                title="Skip Item"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
