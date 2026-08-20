import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { ResourceDifficultyBadge } from './ResourceDifficultyBadge';
import { ResourcePriorityBadge } from './ResourcePriorityBadge';
import { ResourceReason } from './ResourceReason';
import { ResourceTimeBadge } from './ResourceTimeBadge';
import { ResourceTrustBadge } from './ResourceTrustBadge';

export interface ResourceRecommendationCardProps {
  recommendation: any;
  onUpdateStatus: (id: string, status: string) => void;
}

export const ResourceRecommendationCard: React.FC<ResourceRecommendationCardProps> = ({
  recommendation,
  onUpdateStatus,
}) => {
  const { recommendationId, resource, topic, reason, priority, relevanceScore, trustScore, sourceFeature, status } =
    recommendation;

  const isCompleted = status === 'completed';

  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isCompleted
          ? 'bg-slate-50/70 border-slate-200 opacity-75'
          : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <ResourcePriorityBadge priority={priority} />
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-purple-50 text-purple-700 border border-purple-200">
              {relevanceScore}% Match
            </span>
            <ResourceTrustBadge verified={resource?.verified} official={resource?.official} trustScore={trustScore} />
          </div>

          <h4 className="font-extrabold text-slate-900 text-sm">{resource?.title || topic}</h4>
          <p className="text-xs text-slate-500 line-clamp-2">{resource?.description}</p>

          <ResourceReason reason={reason} sourceFeature={sourceFeature} />
        </div>

        <div className="flex flex-col sm:items-end gap-2 shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <ResourceDifficultyBadge difficulty={resource?.difficulty || 'intermediate'} />
            <ResourceTimeBadge estimatedMinutes={resource?.estimatedMinutes || 15} />
          </div>

          <div className="flex items-center gap-2 pt-2">
            {!isCompleted ? (
              <button
                onClick={() => onUpdateStatus(recommendationId || resource?.id, 'completed')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition inline-flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Done</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            )}

            <a
              href={resource?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onUpdateStatus(recommendationId || resource?.id, 'started')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition inline-flex items-center gap-1"
            >
              <span>Study Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
