import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { ResourceCollection } from './ResourceCollection';

interface Props {
  recommendations: IResourceRecommendationClient[];
}

export const GapResourceCollection: React.FC<Props> = ({ recommendations }) => {
  return (
    <ResourceCollection
      title="Fix My Learning Gaps"
      description="Targeted practice modules and foundational recaps addressing your active weak concepts."
      recommendations={recommendations}
    />
  );
};

export default GapResourceCollection;
