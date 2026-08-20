import React from 'react';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';

export interface PracticeAnalyticsProps {
  practice: any;
}

export const PracticeAnalytics: React.FC<PracticeAnalyticsProps> = ({ practice }) => {
  if (!practice) return null;

  const {
    totalQuestionsSolved = 0,
    correctAnswers = 0,
    incorrectAnswers = 0,
    accuracy = 0,
    dailyActivity = [],
  } = practice;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-600" />
        <span>Practice Activity Breakdown</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Correct</span>
            <div className="text-xl font-black text-slate-900">{correctAnswers}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Incorrect</span>
            <div className="text-xl font-black text-slate-900">{incorrectAnswers}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Accuracy</span>
            <div className="text-xl font-black text-slate-900">{accuracy}%</div>
          </div>
        </div>
      </div>

      {dailyActivity.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase">Recent Daily Practice Timeline</h4>
          <div className="space-y-1.5">
            {dailyActivity.slice(-5).map((point: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">{point.date}</span>
                <span className="text-slate-500 font-medium">{point.questions} questions ({point.accuracy}% acc)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
