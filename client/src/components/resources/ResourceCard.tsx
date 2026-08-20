import React from 'react';
import { ExternalLink, Bookmark, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ILearningResourceClient, IResourceRecommendationClient } from '../../types/learning-resource';

interface ResourceCardProps {
  recommendation?: IResourceRecommendationClient;
  resource?: ILearningResourceClient;
  onOpen?: (resourceId: string, url?: string | null) => void;
  onBookmark?: (resourceId: string) => void;
  onDismiss?: (recommendationId: string) => void;
  isBookmarked?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  recommendation,
  resource: rawResource,
  onOpen,
  onBookmark,
  onDismiss,
  isBookmarked = false,
}) => {
  const res = recommendation?.resource || rawResource;
  if (!res) return null;

  const priorityColor =
    recommendation?.priority === 'critical'
      ? 'bg-red-100 text-red-800 border-red-200'
      : recommendation?.priority === 'high'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-indigo-50 text-indigo-700 border-indigo-100';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              {res.resourceType.replace('_', ' ')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase">
              {res.subject}
            </span>
          </div>

          {recommendation && (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${priorityColor}`}>
              {recommendation.priority} • Score {recommendation.score}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-slate-900 leading-snug hover:text-indigo-600 transition cursor-pointer"
            onClick={() => onOpen && onOpen(res.resourceId, res.url)}>
          {res.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 font-medium leading-relaxed">
          {res.description}
        </p>

        {/* Reason Banner */}
        {recommendation && (
          <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-medium">
            💡 {recommendation.reason}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {res.estimatedMinutes}m
          </span>

          {res.verified && (
            <span className="flex items-center gap-1 text-emerald-600" title="Verified Educational Source">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onBookmark && (
            <button
              onClick={() => onBookmark(res.resourceId)}
              className={`p-2 rounded-xl border transition ${
                isBookmarked ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark Resource'}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          )}

          {res.url ? (
            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onOpen && onOpen(res.resourceId, res.url)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              Open <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button
              onClick={() => onOpen && onOpen(res.resourceId, null)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              Launch Native Practice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
