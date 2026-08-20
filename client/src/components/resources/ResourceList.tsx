import React from 'react';
import { ResourceRecommendationCard } from './ResourceRecommendationCard';

export interface ResourceListProps {
  recommendations: any[];
  onUpdateStatus: (id: string, status: string) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({ recommendations, onUpdateStatus }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <ResourceRecommendationCard
          key={rec.recommendationId || rec.resource?.id}
          recommendation={rec}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};
