import React from 'react';
import { IAssessmentQuestionClient } from '../../types/assessment-engine';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  question: IAssessmentQuestionClient;
  selectedAnswer: any;
  onSelect: (ans: any) => void;
}

export const QuestionOptions: React.FC<Props> = ({ question, selectedAnswer, onSelect }) => {
  if (question.questionType === 'mcq' && question.options) {
    return (
      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={idx}
              onClick={() => onSelect(opt)}
              className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
                isSelected
                  ? 'bg-purple-950/60 border-purple-500 text-purple-200 ring-2 ring-purple-500/30'
                  : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{opt}</span>
              {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2 text-xs">
      <label className="text-slate-400 font-semibold">Your Solution / Answer:</label>
      <textarea
        rows={4}
        value={selectedAnswer || ''}
        onChange={(e) => onSelect(e.target.value)}
        placeholder="Type your response here..."
        className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
      />
    </div>
  );
};

export default QuestionOptions;
