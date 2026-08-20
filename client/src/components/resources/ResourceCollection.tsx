import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { ResourceRecommendationCard } from './ResourceRecommendationCard';

interface Props {
  title: string;
  description: string;
  recommendations: IResourceRecommendationClient[];
}

export const ResourceCollection: React.FC<Props> = ({ title, description, recommendations }) => {
  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <ResourceRecommendationCard key={rec.recommendationId || rec.resourceId} recommendation={rec} />
        ))}
      </div>
    </div>
  );
};

export default ResourceCollection;
