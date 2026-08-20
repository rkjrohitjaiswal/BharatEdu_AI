import React from 'react';
import { IAssessmentResultClient } from '../../types/assessment-engine';
import { AssessmentScoreCard } from './AssessmentScoreCard';
import { AssessmentConceptBreakdown } from './AssessmentConceptBreakdown';
import { AssessmentTopicBreakdown } from './AssessmentTopicBreakdown';
import { AssessmentDifficultyBreakdown } from './AssessmentDifficultyBreakdown';
import { AssessmentRecommendations } from './AssessmentRecommendations';
import { AssessmentAIInsight } from './AssessmentAIInsight';

interface Props {
  result: IAssessmentResultClient;
}

export const AssessmentResult: React.FC<Props> = ({ result }) => {
  return (
    <div className="space-y-6">
      <AssessmentScoreCard attempt={result.attempt} />
      <AssessmentAIInsight />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssessmentConceptBreakdown breakdown={result.conceptPerformance} />
        <AssessmentTopicBreakdown breakdown={result.topicPerformance} />
      </div>
      <AssessmentDifficultyBreakdown breakdown={result.difficultyPerformance} />
      <AssessmentRecommendations actions={result.recommendedActions} />
    </div>
  );
};

export default AssessmentResult;
