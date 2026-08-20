import React from 'react';
import { Archive, Award, BookOpen, Sparkles } from 'lucide-react';
import { IStudyMaterialSummaryClientDTO } from '../../types/study-material';

export interface StudyMaterialSummaryProps {
  summary: IStudyMaterialSummaryClientDTO;
}

export const StudyMaterialSummaryCard: React.FC<StudyMaterialSummaryProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Active Notes</span>
        </div>
        <p className="text-lg font-black text-slate-900">{summary.totalMaterialsCount}</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Today Queue</span>
        </div>
        <p className="text-lg font-black text-indigo-600">{summary.todayMaterialsCount}</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Archive className="w-3.5 h-3.5 text-slate-600" />
          <span>Archived</span>
        </div>
        <p className="text-lg font-black text-slate-900">{summary.archivedMaterialsCount}</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Format Fit</span>
        </div>
        <p className="text-lg font-black text-emerald-600">Personalized</p>
      </div>
    </div>
  );
};
