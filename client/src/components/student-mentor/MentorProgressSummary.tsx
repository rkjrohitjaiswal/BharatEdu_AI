import React from 'react';
import { BookOpen, Calendar, Flame, LineChart } from 'lucide-react';

export interface MentorProgressSummaryProps {
  snapshot: any;
}

export const MentorProgressSummary: React.FC<MentorProgressSummaryProps> = ({ snapshot }) => {
  if (!snapshot) return null;

  const { overallMastery = 0, practiceHistory = {}, studyPlanProgress = {} } = snapshot;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Overall Mastery
        </span>
        <div className="text-xl font-black text-slate-900">{overallMastery}%</div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <LineChart className="w-3.5 h-3.5 text-emerald-600" /> Practice Accuracy
        </span>
        <div className="text-xl font-black text-slate-900">{practiceHistory.accuracy || 0}%</div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-orange-600" /> Practice Streak
        </span>
        <div className="text-xl font-black text-slate-900">{practiceHistory.streakDays || 1} Days</div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-purple-600" /> Schedule Adherence
        </span>
        <div className="text-xl font-black text-slate-900">{studyPlanProgress.adherence || 0}%</div>
      </div>
    </div>
  );
};
