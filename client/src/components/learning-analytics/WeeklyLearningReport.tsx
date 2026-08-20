import React from 'react';
import { Calendar } from 'lucide-react';

export interface WeeklyLearningReportProps {
  report: any;
}

export const WeeklyLearningReport: React.FC<WeeklyLearningReportProps> = ({ report }) => {
  if (!report) return null;

  const {
    overallProgressTrend = 'stable',
    questionsSolved = 0,
    accuracy = 0,
    studyMinutes = 0,
    planCompletionPercentage = 0,
    currentStreak = 0,
    wins = [],
    areasNeedingAttention = [],
    nextWeekPriorities = [],
  } = report;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <span>Weekly Learning Report</span>
        </h3>
        <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
          Trend: {overallProgressTrend}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Questions</span>
          <span className="font-black text-slate-900">{questionsSolved}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Accuracy</span>
          <span className="font-black text-slate-900">{accuracy}%</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Study Time</span>
          <span className="font-black text-slate-900">{studyMinutes} min</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Plan Completion</span>
          <span className="font-black text-slate-900">{planCompletionPercentage}%</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Streak</span>
          <span className="font-black text-slate-900">{currentStreak} Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <span className="font-extrabold text-emerald-950 block">✨ Top Wins</span>
          <ul className="space-y-1 text-emerald-900 font-medium">
            {wins.map((w: string, idx: number) => (
              <li key={idx}>• {w}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
          <span className="font-extrabold text-amber-950 block">🌱 Needs Attention</span>
          <ul className="space-y-1 text-amber-900 font-medium">
            {areasNeedingAttention.map((a: string, idx: number) => (
              <li key={idx}>• {a}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
          <span className="font-extrabold text-indigo-950 block">🎯 Next Week Priorities</span>
          <ul className="space-y-1 text-indigo-900 font-medium">
            {nextWeekPriorities.map((p: string, idx: number) => (
              <li key={idx}>• {p}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
