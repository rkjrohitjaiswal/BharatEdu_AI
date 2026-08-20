import React from 'react';
import { Award, BookOpen, Calendar, Flame, LineChart } from 'lucide-react';

export interface AnalyticsOverviewProps {
  overview: any;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ overview }) => {
  if (!overview) return null;

  const {
    currentMastery = 0,
    practiceAccuracy = 0,
    questionsSolved = 0,
    studyMinutes = 0,
    currentStreak = 0,
    planCompletionPercentage = 0,
  } = overview;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Mastery
        </span>
        <div className="text-2xl font-black text-slate-900">{currentMastery}%</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <LineChart className="w-3.5 h-3.5 text-emerald-600" /> Accuracy
        </span>
        <div className="text-2xl font-black text-slate-900">{practiceAccuracy}%</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-purple-600" /> Questions
        </span>
        <div className="text-2xl font-black text-slate-900">{questionsSolved}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-blue-600" /> Study Time
        </span>
        <div className="text-2xl font-black text-slate-900">{studyMinutes} min</div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-orange-600" /> Streak
        </span>
        <div className="text-2xl font-black text-slate-900">{currentStreak} Days</div>
      </div>
    </div>
  );
};
