import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { ResourceCollection } from './ResourceCollection';

interface Props {
  recommendations: IResourceRecommendationClient[];
}

export const RecommendedForYou: React.FC<Props> = ({ recommendations }) => {
  return (
    <ResourceCollection
      title="Recommended For You"
      description="Personalized educational resources tailored to your mastery, goals, and learning velocity."
      recommendations={recommendations}
    />
  );
};

export default RecommendedForYou;
