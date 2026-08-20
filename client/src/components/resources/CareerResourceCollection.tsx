import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { ResourceCollection } from './ResourceCollection';

interface Props {
  recommendations: IResourceRecommendationClient[];
}

export const CareerResourceCollection: React.FC<Props> = ({ recommendations }) => {
  return (
    <ResourceCollection
      title="Career Skills Collection"
      description="STEM and engineering skill-building resources aligned with your long-term career target."
      recommendations={recommendations}
    />
  );
};

export default CareerResourceCollection;
