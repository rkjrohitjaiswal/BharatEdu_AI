import React from 'react';
import { ExternalLink } from 'lucide-react';
import { ResourceDifficultyBadge } from './ResourceDifficultyBadge';
import { ResourceTimeBadge } from './ResourceTimeBadge';
import { ResourceTrustBadge } from './ResourceTrustBadge';

export interface ResourceCardProps {
  resource: any;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const {
    title,
    description,
    resourceType,
    subject,
    topic,
    difficulty,
    provider,
    url,
    estimatedMinutes,
    verified,
    official,
  } = resource;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-3 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            {resourceType.replace('_', ' ')}
          </span>
          <ResourceTrustBadge verified={verified} official={official} />
        </div>

        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        <p className="text-xs text-slate-500 line-clamp-2">{description}</p>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="font-semibold text-slate-700">{subject}</span>
          <span>•</span>
          <span>{topic}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ResourceDifficultyBadge difficulty={difficulty} />
          <ResourceTimeBadge estimatedMinutes={estimatedMinutes} />
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition"
        >
          <span>Open Material</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
