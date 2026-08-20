import React from 'react';
import { useParams } from 'react-router-dom';
import { AssessmentPage } from './AssessmentPage';

export const MockExamPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();

  // Reuses Feature 40 Assessment Engine UI seamlessly
  return <AssessmentPage />;
};
