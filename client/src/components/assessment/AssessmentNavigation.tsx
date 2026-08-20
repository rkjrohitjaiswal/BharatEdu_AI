import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const AssessmentNavigation: React.FC<Props> = ({
  currentIndex,
  total,
  onPrev,
  onNext,
  onSubmit,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
      <button
        disabled={isFirst}
        onClick={onPrev}
        className="px-4 py-2 bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40 rounded-xl flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" /> Previous
      </button>

      {isLast ? (
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
        >
          <CheckCircle2 className="w-4 h-4" /> Submit Assessment
        </button>
      ) : (
        <button
          onClick={onNext}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-950/40"
        >
          Next Question <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AssessmentNavigation;
