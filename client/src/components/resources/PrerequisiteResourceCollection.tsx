import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { ResourceCollection } from './ResourceCollection';

interface Props {
  recommendations: IResourceRecommendationClient[];
}

export const PrerequisiteResourceCollection: React.FC<Props> = ({ recommendations }) => {
  return (
    <ResourceCollection
      title="Prerequisite First Collection"
      description="Foundational concept materials recommended before attempting advanced target topics."
      recommendations={recommendations}
    />
  );
};

export default PrerequisiteResourceCollection;
