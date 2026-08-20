import React from 'react';
import { GraduationCap } from 'lucide-react';

export interface ExamReadinessTrendProps {
  examReadiness: any;
}

export const ExamReadinessTrend: React.FC<ExamReadinessTrendProps> = ({ examReadiness }) => {
  if (!examReadiness || !examReadiness.examName) return null;

  const {
    examName = 'Upcoming Exam',
    daysRemaining = 0,
    currentReadiness = 0,
    readinessLevel = 'Developing',
    readinessTrend = 'insufficient_data',
  } = examReadiness;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-600" />
          <span>{examName} Readiness</span>
        </h3>
        <span className="text-xs font-semibold text-slate-500 capitalize">Trend: {readinessTrend}</span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">{daysRemaining} days remaining</span>
        <span className="font-extrabold text-purple-700">{currentReadiness}% ({readinessLevel})</span>
      </div>

      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-purple-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, currentReadiness))}%` }}
        />
      </div>
    </div>
  );
};
