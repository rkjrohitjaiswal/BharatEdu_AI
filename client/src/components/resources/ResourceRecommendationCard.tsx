import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { Sparkles, ExternalLink, PlayCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResourceRecommendationCardProps {
  recommendation: IResourceRecommendationClient;
}

export const ResourceRecommendationCard: React.FC<ResourceRecommendationCardProps> = ({ recommendation }) => {
  const { resource, recommendationScore, priority, actionType, reason } = recommendation;

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl mb-6 border border-purple-500/30">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2 text-yellow-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Top AI Recommendation • {priority} priority</span>
        </div>
        <span className="bg-white/10 text-yellow-300 text-xs px-3 py-1 rounded-full border border-white/15 font-black">
          {recommendationScore}% Match
        </span>
      </div>

      <h3 className="text-xl font-extrabold mb-2 leading-tight">{resource.title}</h3>
      <p className="text-xs text-indigo-100 mb-4 line-clamp-2">{resource.description}</p>

      <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 mb-4 text-xs">
        <div className="font-bold text-yellow-300 mb-0.5">Why Recommended:</div>
        <div className="text-gray-200">{reason.primaryReason}</div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-indigo-200 font-medium">
          ⏱️ {resource.durationMinutes} mins • <span className="capitalize">{actionType}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to={`/resources/${resource.resourceId}`}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20"
          >
            Why this resource?
          </Link>
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-1.5"
          >
            <span>Start Learning</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
