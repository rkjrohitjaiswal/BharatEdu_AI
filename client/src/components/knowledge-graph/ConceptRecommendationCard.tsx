import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ConceptRecommendationCardProps {
  recommendation: any;
}

export const ConceptRecommendationCard: React.FC<ConceptRecommendationCardProps> = ({ recommendation }) => {
  const { conceptName, subject, priority, reason, readinessScore, unblocksCount, actionUrl } = recommendation;

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            {subject}
          </span>
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-50 text-purple-700 border border-purple-200">
            Unblocks {unblocksCount} Topics
          </span>
        </div>

        <h4 className="font-bold text-slate-900 text-xs">{conceptName}</h4>
        <p className="text-[11px] text-slate-500 line-clamp-2">💡 {reason}</p>
      </div>

      <Link
        to={actionUrl || '/practice'}
        className="inline-flex items-center justify-center gap-1 w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition mt-2"
      >
        <span>Strengthen Concept</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
