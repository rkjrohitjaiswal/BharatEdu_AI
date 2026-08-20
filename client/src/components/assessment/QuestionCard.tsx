import React from 'react';
import { IAssessmentQuestionClient } from '../../types/assessment-engine';
import { BookOpen } from 'lucide-react';

interface Props {
  question: IAssessmentQuestionClient;
}

export const QuestionCard: React.FC<Props> = ({ question }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-2.5 py-1 rounded-xl">
          {question.topic} • {question.difficulty.toUpperCase()} • {question.marks} Marks
        </span>
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" /> {question.sourceReference || 'NCERT'}
        </span>
      </div>

      <h2 className="text-base md:text-lg font-bold text-white leading-snug">
        {question.questionText}
      </h2>
    </div>
  );
};

export default QuestionCard;
