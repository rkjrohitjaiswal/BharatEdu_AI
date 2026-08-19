import React from 'react';
import { ParentScholarshipCard } from './ParentScholarshipCard';

interface ParentScholarshipSummaryProps {
  opportunitiesCount: number;
}

export const ParentScholarshipSummary: React.FC<ParentScholarshipSummaryProps> = ({ opportunitiesCount }) => {
  return <ParentScholarshipCard opportunitiesCount={opportunitiesCount} />;
};
