import React from 'react';
import { IResourceRecommendationClient } from '../../types/resource-recommendation';
import { ResourceCollection } from './ResourceCollection';

interface Props {
  recommendations: IResourceRecommendationClient[];
}

export const ExamResourceCollection: React.FC<Props> = ({ recommendations }) => {
  return (
    <ResourceCollection
      title="Exam Preparation Collection"
      description="High-weightage revision materials, question banks, and official board preparation guides."
      recommendations={recommendations}
    />
  );
};

export default ExamResourceCollection;
