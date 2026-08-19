import React from 'react';
import { Award, BookOpen, GraduationCap, LineChart, Target } from 'lucide-react';
import { RiskScoreMeter } from '../risk/RiskScoreMeter';

export interface TeacherStudentSummaryProps {
  snapshot: any;
}

export const TeacherStudentSummary: React.FC<TeacherStudentSummaryProps> = ({ snapshot }) => {
  if (!snapshot) return null;

  const {
    studentName = 'Student',
    overallMastery = 0,
    riskLevel = 'low',
    riskTrend = 'stable',
    practiceAccuracy = 0,
    studyConsistency = 0,
    examReadiness,
    careerSkillProgress,
    goalProgress = { activeGoals: 0, completedGoals: 0 },
  } = snapshot;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{studentName}</h2>
          <span className="text-xs text-slate-500 font-medium">Student Performance Snapshot</span>
        </div>

        <div className="w-full sm:w-64">
          <RiskScoreMeter score={overallMastery} level={riskLevel} trend={riskTrend} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Mastery
          </span>
          <div className="text-xl font-extrabold text-slate-900">{overallMastery}%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
            <LineChart className="w-3.5 h-3.5 text-emerald-600" /> Practice Acc.
          </span>
          <div className="text-xl font-extrabold text-slate-900">{practiceAccuracy}%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-amber-600" /> Plan Consistency
          </span>
          <div className="text-xl font-extrabold text-slate-900">{studyConsistency}%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Exam Prep
          </span>
          <div className="text-xl font-extrabold text-slate-900">
            {examReadiness !== undefined ? `${examReadiness}%` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};
