import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface MentorExamSummaryProps {
  examStatus: any;
}

export const MentorExamSummary: React.FC<MentorExamSummaryProps> = ({ examStatus }) => {
  if (!examStatus) return null;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-purple-600" />
          <span>{examStatus.title}</span>
        </h4>
        <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
          {examStatus.daysRemaining} Days Left
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Exam Readiness Score:</span>
        <span className="font-extrabold text-slate-900">{examStatus.readinessScore}%</span>
      </div>

      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-purple-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, examStatus.readinessScore))}%` }}
        />
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Topics: {examStatus.priorityTopics?.join(', ')}</span>
        <Link to="/exam-prep" className="font-semibold text-indigo-600 hover:underline">
          Go to Exam Prep
        </Link>
      </div>
    </div>
  );
};
