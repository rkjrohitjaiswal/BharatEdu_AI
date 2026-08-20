import React from 'react';
import { Award, BookOpen, Clock, Target } from 'lucide-react';

export interface LearningPathSummaryProps {
  summary: {
    topPathTitle: string;
    overallProgressPercent: number;
    currentLearningLevel: string;
    todayTasksCount: number;
    todayMinutes: number;
  };
}

export const LearningPathSummary: React.FC<LearningPathSummaryProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Curriculum</span>
        </div>
        <p className="text-sm font-black text-slate-900 truncate">{summary.topPathTitle}</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Target className="w-3.5 h-3.5 text-purple-600" />
          <span>Overall Progress</span>
        </div>
        <p className="text-sm font-black text-indigo-600">{summary.overallProgressPercent}%</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mastery Level</span>
        </div>
        <p className="text-sm font-black text-slate-900 capitalize">{summary.currentLearningLevel}</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Today Budget</span>
        </div>
        <p className="text-sm font-black text-slate-900">{summary.todayMinutes} mins</p>
      </div>
    </div>
  );
};
