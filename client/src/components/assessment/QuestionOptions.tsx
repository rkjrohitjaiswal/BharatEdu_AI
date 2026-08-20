import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export interface QuestionOptionsProps {
  questionType: string;
  options: string[];
  selectedAnswer: string;
  onSelect: (ans: string) => void;
  disabled?: boolean;
}

export const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  questionType,
  options,
  selectedAnswer,
  onSelect,
  disabled,
}) => {
  if (questionType === 'numerical' || questionType === 'short_answer') {
    return (
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700">Enter your numeric / short answer:</label>
        <input
          type="text"
          disabled={disabled}
          placeholder="Type answer here..."
          value={selectedAnswer}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
        />
      </div>
    );
  }

  const choices = options && options.length > 0 ? options : questionType === 'true_false' ? ['True', 'False'] : [];

  return (
    <div className="grid grid-cols-1 gap-2.5">
      {choices.map((opt, idx) => {
        const isSelected = selectedAnswer === opt;
        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt)}
            className={`flex items-center justify-between p-3.5 rounded-2xl border-2 text-left text-xs font-bold transition-all ${
              isSelected
                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
            } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span>{opt}</span>
            {isSelected ? (
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};
