import React from 'react';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { ResourceReasonCard } from './ResourceReasonCard';

export interface RecommendedResourceCardProps {
  recommendation: any;
  onOpen: (rec: any) => void;
}

export const RecommendedResourceCard: React.FC<RecommendedResourceCardProps> = ({
  recommendation,
  onOpen,
}) => {
  if (!recommendation) return null;

  const { title, description, subject, topic, priority, reason, estimatedMinutes, relevanceScore } =
    recommendation;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Top Study Recommendation</span>
        </div>

        <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
          {priority} Priority • {relevanceScore}% Match
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-indigo-300 uppercase">{subject} • {topic}</span>
        <h3 className="text-lg font-black text-white">{title}</h3>
        <p className="text-xs text-indigo-100/80 leading-relaxed line-clamp-2">{description}</p>
      </div>

      <ResourceReasonCard reason={reason} />

      <div className="flex items-center justify-between pt-2 border-t border-indigo-800/50">
        <span className="text-xs font-semibold text-indigo-200 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-indigo-400" /> {estimatedMinutes} minutes
        </span>

        <button
          onClick={() => onOpen(recommendation)}
          className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition inline-flex items-center gap-1.5"
        >
          <span>Start Studying</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
