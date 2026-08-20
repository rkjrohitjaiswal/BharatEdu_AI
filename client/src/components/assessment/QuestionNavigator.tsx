import React from 'react';

interface Props {
  totalQuestions: number;
  currentIndex: number;
  answeredIndices: number[];
  flaggedIndices: number[];
  onSelectIndex: (idx: number) => void;
}

export const QuestionNavigator: React.FC<Props> = ({
  totalQuestions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  onSelectIndex,
}) => {
  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
      <h3 className="text-xs font-bold text-white">Question Navigator</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answeredIndices.includes(idx);
          const isFlagged = flaggedIndices.includes(idx);

          return (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`h-9 w-full rounded-xl text-xs font-bold transition-all relative ${
                isCurrent
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                  : isAnswered
                  ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {idx + 1}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigator;
