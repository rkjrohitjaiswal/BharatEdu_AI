import React from 'react';
import { Award, BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import { IResourceRecommendationSummaryClientDTO } from '../../types/resource-recommendations';

export interface ResourceSummaryProps {
  summary: IResourceRecommendationSummaryClientDTO;
}

export const ResourceSummaryCard: React.FC<ResourceSummaryProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Recommended</span>
        </div>
        <p className="text-lg font-black text-slate-900">{summary.totalRecommendedCount}</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Today Queue</span>
        </div>
        <p className="text-lg font-black text-indigo-600">{summary.todayRecommendedCount}</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Completed</span>
        </div>
        <p className="text-lg font-black text-emerald-600">{summary.completedCount}</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Avg Fit Score</span>
        </div>
        <p className="text-lg font-black text-slate-900">{summary.avgRelevanceScore}%</p>
      </div>
    </div>
  );
};
