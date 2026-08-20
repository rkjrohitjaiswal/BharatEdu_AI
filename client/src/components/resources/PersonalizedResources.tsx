import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { ResourceCard } from './ResourceCard';

interface PersonalizedResourcesProps {
  recommendations: IResourceRecommendationClient[];
}

export const PersonalizedResources: React.FC<PersonalizedResourcesProps> = ({ recommendations }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Best Tailored For Your Current Learning Gaps</h3>
        <span className="text-xs text-gray-500 font-medium">{recommendations.length} Verified Items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, idx) => (
          <ResourceCard
            key={idx}
            resource={rec.resource}
            recommendationScore={rec.recommendationScore}
            reason={rec.reason.primaryReason}
          />
        ))}
      </div>
    </div>
  );
};
