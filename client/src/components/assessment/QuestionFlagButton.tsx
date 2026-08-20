import React from 'react';
import { Flag } from 'lucide-react';

interface Props {
  isFlagged: boolean;
  onToggle: () => void;
}

export const QuestionFlagButton: React.FC<Props> = ({ isFlagged, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
        isFlagged
          ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
      }`}
    >
      <Flag className="w-3.5 h-3.5" />
      <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
    </button>
  );
};

export default QuestionFlagButton;
