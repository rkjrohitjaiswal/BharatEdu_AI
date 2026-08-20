import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { ResourcePriorityBadge } from './ResourcePriorityBadge';
import { ResourceSourceBadge } from './ResourceSourceBadge';
import { ResourceDuration } from './ResourceDuration';
import { ResourceReason } from './ResourceReason';
import { ExternalLink, Play, BookOpen, Bookmark, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  recommendation: IResourceRecommendationClient;
  onStart?: () => void;
  onSave?: () => void;
}

export const ResourceRecommendationCard: React.FC<Props> = ({ recommendation, onStart, onSave }) => {
  const resource = recommendation.resource;
  if (!resource) return null;

  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 rounded-2xl space-y-4 text-xs transition-all shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <ResourceSourceBadge provider={resource.provider} isVerified={resource.isVerified} />
        <div className="flex items-center gap-2">
          <ResourcePriorityBadge priority={recommendation.priority} />
          <span className="text-[10px] font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            Score: {recommendation.recommendationScore}
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-base font-bold text-white leading-snug">{resource.title}</h4>
        <p className="text-slate-300 line-clamp-2 mt-1">{resource.description}</p>
      </div>

      <ResourceReason reason={recommendation.reason} />

      <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="capitalize font-semibold text-slate-300">{resource.resourceType.replace(/_/g, ' ')}</span>
          <ResourceDuration minutes={resource.estimatedMinutes} />
        </div>

        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={onSave}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              title="Save Resource"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          )}

          {resource.sourceUrl && (
            <a
              href={resource.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center gap-1 text-[11px]"
            >
              <span>Open Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <Link
            to={`/resources/${resource.resourceId}`}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold rounded-lg text-[11px]"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourceRecommendationCard;
