import React from 'react';
import { Award, CheckCircle2, RotateCcw, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface AssessmentSummaryProps {
  summary: any;
  onRestart?: () => void;
}

export const AssessmentSummary: React.FC<AssessmentSummaryProps> = ({ summary, onRestart }) => {
  if (!summary) return null;

  const {
    targetConceptName,
    subject,
    completedQuestions,
    correctAnswers,
    accuracy,
    startingDifficulty,
    endingDifficulty,
    readinessBefore,
    readinessAfter,
    recommendedRemediation,
    aiExplanation,
  } = summary;

  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg max-w-2xl mx-auto space-y-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto font-black">
        <Award className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
          {subject} Assessment Complete
        </span>
        <h2 className="text-2xl font-black text-slate-900">{targetConceptName}</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Accuracy</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{accuracy}%</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Score</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {correctAnswers}/{completedQuestions}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-500">Readiness Impact</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {readinessBefore}% → {readinessAfter}%
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-left space-y-1">
        <h4 className="text-xs font-extrabold text-indigo-900">Adaptive Progress & Strategy</h4>
        <p className="text-xs text-indigo-950 font-medium leading-relaxed">{aiExplanation}</p>
      </div>

      <div className="pt-4 flex items-center justify-center gap-3">
        {onRestart && (
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
        )}

        <Link
          to="/knowledge-graph"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
        >
          <Target className="w-4 h-4" />
          <span>View Learning Map</span>
        </Link>
      </div>
    </div>
  );
};
