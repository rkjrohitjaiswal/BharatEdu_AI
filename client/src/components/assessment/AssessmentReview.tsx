import React from 'react';
import { IAssessmentQuestionClient } from '../../types/assessment-engine';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  questions: IAssessmentQuestionClient[];
  responses: Array<{ questionId: string; answer: any; isCorrect?: boolean; marksAwarded?: number }>;
}

export const AssessmentReview: React.FC<Props> = ({ questions, responses }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 text-xs">
      <h3 className="text-sm font-bold text-white">Question Response Review</h3>
      <div className="space-y-3">
        {questions.map((q, idx) => {
          const resp = responses.find((r) => r.questionId === q.questionId);
          const isCorrect = resp?.isCorrect;

          return (
            <div key={q.questionId} className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400">Q{idx + 1}. {q.topic}</span>
                {isCorrect ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct (+{q.marks})
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Incorrect ({q.negativeMarks ? `-${q.negativeMarks}` : '0'})
                  </span>
                )}
              </div>
              <p className="font-semibold text-white">{q.questionText}</p>
              <div className="text-slate-400">Your Answer: <span className="text-slate-200">{resp?.answer || 'Skipped'}</span></div>
              {q.explanation && (
                <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl text-slate-300">
                  <span className="font-bold text-purple-400">Explanation: </span>{q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentReview;
