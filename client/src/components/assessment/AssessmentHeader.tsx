import React from 'react';
import { IAssessmentClient } from '../../types/assessment-engine';
import { Award, BookOpen, ShieldCheck } from 'lucide-react';

interface Props {
  assessment: IAssessmentClient;
}

export const AssessmentHeader: React.FC<Props> = ({ assessment }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
              {assessment.subject} • Class {assessment.classLevel} ({assessment.board})
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white mt-1">{assessment.title}</h1>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4" /> Server Authoritative Scoring
        </div>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{assessment.description}</p>
    </div>
  );
};

export default AssessmentHeader;
