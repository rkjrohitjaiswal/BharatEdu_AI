import React from 'react';
import { ILearningResourceClient } from '../../types/resource-recommendation';
import { ExternalLink, CheckCircle2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResourceCardProps {
  resource: ILearningResourceClient;
  recommendationScore?: number;
  reason?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, recommendationScore, reason }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {resource.resourceType}
            </span>
            {resource.verified && (
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>NCERT Verified</span>
              </span>
            )}
          </div>

          {recommendationScore && (
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              {recommendationScore}% Match
            </span>
          )}
        </div>

        <h4 className="font-extrabold text-sm text-gray-900 mb-1 leading-snug">{resource.title}</h4>
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{resource.description}</p>

        {reason && <div className="text-[11px] text-indigo-900 bg-indigo-50/60 p-2 rounded-lg font-medium mb-3">💡 {reason}</div>}
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">⏱️ {resource.durationMinutes} mins</span>
        <div className="flex items-center space-x-2">
          <Link
            to={`/resources/${resource.resourceId}`}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold rounded-lg"
          >
            Details
          </Link>
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-sm"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
