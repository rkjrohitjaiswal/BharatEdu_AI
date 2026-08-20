import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { ResourceCollection } from './ResourceCollection';

interface Props {
  recommendations: IResourceRecommendationClient[];
}

export const RevisionResourceCollection: React.FC<Props> = ({ recommendations }) => {
  return (
    <ResourceCollection
      title="Spaced Repetition Revision"
      description="Quick formula sheets and summary references due for periodic review."
      recommendations={recommendations}
    />
  );
};

export default RevisionResourceCollection;
