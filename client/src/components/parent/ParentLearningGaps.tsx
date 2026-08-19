import React from 'react';
import { ParentAttentionCard } from './ParentAttentionCard';

interface ParentLearningGapsProps {
  activeGapsSummary: {
    subjectName: string;
    gapCount: number;
    description: string;
  }[];
}

export const ParentLearningGaps: React.FC<ParentLearningGapsProps> = ({ activeGapsSummary }) => {
  return <ParentAttentionCard activeGapsSummary={activeGapsSummary} />;
};
