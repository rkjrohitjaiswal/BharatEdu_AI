import React from 'react';
import { DifficultyBadge } from './DifficultyBadge';
import { QuestionOptions } from './QuestionOptions';

export interface QuestionCardProps {
  question: any;
  selectedAnswer: string;
  onSelectAnswer: (ans: string) => void;
  disabled?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  disabled,
}) => {
  if (!question) return null;

  const { stem, questionType, difficulty, options } = question;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          Question Type: {questionType.replace('_', ' ')}
        </span>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      <h3 className="font-extrabold text-base text-slate-900 leading-relaxed">{stem}</h3>

      <QuestionOptions
        questionType={questionType}
        options={options}
        selectedAnswer={selectedAnswer}
        onSelect={onSelectAnswer}
        disabled={disabled}
      />
    </div>
  );
};
