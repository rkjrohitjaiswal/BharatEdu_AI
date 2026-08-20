import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { ResourceRecommendationCard } from './ResourceRecommendationCard';

export interface ResourceListProps {
  recommendations: IResourceRecommendationClient[];
  onUpdateStatus?: (id: string, status: string) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <ResourceRecommendationCard
          key={rec.recommendationId || rec.resourceId}
          recommendation={rec}
        />
      ))}
    </div>
  );
};
