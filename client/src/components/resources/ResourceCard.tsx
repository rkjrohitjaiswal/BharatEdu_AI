import React from 'react';
import { CheckCircle2, ExternalLink, PlayCircle, XCircle } from 'lucide-react';
import { IResourceRecommendationClientDTO } from '../../types/resource-recommendations';
import { ResourcePriorityBadge } from './ResourcePriorityBadge';
import { ResourceQualityBadge } from './ResourceQualityBadge';

export interface ResourceCardProps {
  recommendation: IResourceRecommendationClientDTO;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  recommendation,
  onStart,
  onComplete,
  onDismiss,
}) => {
  const { resource, reason, priority, relevanceScore, status, id, actionUrl } = recommendation;

  return (
    <div className="p-5 rounded-2xl border bg-white border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
              {resource.provider} • {resource.resourceType}
            </span>
            <ResourcePriorityBadge priority={priority} />
            <ResourceQualityBadge qualityScore={resource.qualityScore} isVerified={resource.isVerified} />
          </div>
          <h3 className="text-sm font-black text-slate-900 leading-snug">{resource.title}</h3>
        </div>
        <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs shrink-0">
          {relevanceScore}% Score
        </span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">{resource.description}</p>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 leading-normal font-medium">
        💡 <strong className="text-slate-900">Why recommended:</strong> {reason}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <a
          href={actionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-600 hover:underline"
        >
          Open Material <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="flex items-center gap-2">
          {status === 'completed' ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          ) : (
            <>
              <button
                onClick={() => (status === 'started' ? onComplete(id) : onStart(id))}
                className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1 transition"
              >
                {status === 'started' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-3.5 h-3.5" /> Start Resource
                  </>
                )}
              </button>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(id)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                  title="Dismiss Recommendation"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
