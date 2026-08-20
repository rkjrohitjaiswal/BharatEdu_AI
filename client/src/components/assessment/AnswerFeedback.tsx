import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export interface AnswerFeedbackProps {
  feedback: any;
  onNext: () => void;
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({ feedback, onNext }) => {
  if (!feedback) return null;

  const { isCorrect, correctAnswer, explanation, newDifficulty, isAssessmentCompleted } = feedback;

  return (
    <div
      className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
        isCorrect
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          : 'bg-red-50/80 border-red-200 text-red-950'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          <h4 className="font-extrabold text-sm">{isCorrect ? 'Correct!' : 'Incorrect'}</h4>
        </div>
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700">
          Next Difficulty: {newDifficulty}
        </span>
      </div>

      {!isCorrect && correctAnswer && (
        <div className="text-xs font-bold text-red-900">Correct Answer: {correctAnswer}</div>
      )}

      {explanation && <p className="text-xs font-medium leading-relaxed">{explanation}</p>}

      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
      >
        <span>{isAssessmentCompleted ? 'View Final Summary' : 'Next Question'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
