import React from 'react';
import { Target, Zap } from 'lucide-react';

export interface AssessmentHeaderProps {
  conceptName: string;
  subject: string;
  assessmentType: string;
}

export const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({ conceptName, subject, assessmentType }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            {subject} • {assessmentType.replace('_', ' ')}
          </span>
          <h2 className="font-extrabold text-base text-slate-900 mt-0.5">{conceptName}</h2>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
        <Zap className="w-4 h-4 text-indigo-600 animate-pulse" />
        <span>Adaptive Real-time Difficulty</span>
      </div>
    </div>
  );
};
