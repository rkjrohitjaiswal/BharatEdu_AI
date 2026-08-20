import React from 'react';

interface Props {
  confidence: 'low' | 'medium' | 'high';
  onChange: (conf: 'low' | 'medium' | 'high') => void;
}

export const QuestionConfidence: React.FC<Props> = ({ confidence, onChange }) => {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-400 font-semibold">Answer Confidence:</span>
      {(['low', 'medium', 'high'] as const).map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`px-2.5 py-1 rounded-lg border uppercase text-[10px] font-bold transition-all ${
            confidence === level
              ? 'bg-purple-950/80 border-purple-500 text-purple-300'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export default QuestionConfidence;
