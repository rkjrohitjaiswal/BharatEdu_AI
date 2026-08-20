import React from 'react';
import { Target } from 'lucide-react';

export interface GoalAnalyticsProps {
  goalAnalytics: any;
}

export const GoalAnalytics: React.FC<GoalAnalyticsProps> = ({ goalAnalytics }) => {
  if (!goalAnalytics) return null;

  const {
    activeGoalsCount = 0,
    completedGoalsCount = 0,
    averageProgress = 0,
    goalsNearingCompletion = 0,
  } = goalAnalytics;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          <span>Goal Progress Analytics</span>
        </h3>
        <span className="text-xs font-bold text-purple-600">{averageProgress}% Avg Progress</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Active Goals</span>
          <span className="text-lg font-black text-slate-900">{activeGoalsCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
          <span className="text-[10px] text-emerald-600 block font-semibold uppercase">Completed</span>
          <span className="text-lg font-black text-emerald-800">{completedGoalsCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
          <span className="text-[10px] text-purple-600 block font-semibold uppercase">Nearing Done</span>
          <span className="text-lg font-black text-purple-800">{goalsNearingCompletion}</span>
        </div>
      </div>
    </div>
  );
};
