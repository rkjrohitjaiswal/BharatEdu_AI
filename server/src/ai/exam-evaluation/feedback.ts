import { OverallPerformanceLevel } from '../../models/exam-evaluation.model.js';

export function generateEvaluationFeedback(
  earnedMarks: number,
  totalMarks: number,
  accuracy: number,
  overallLevel: OverallPerformanceLevel
): { summary: string; strengths: string[]; weaknesses: string[] } {
  const percentage = Math.round((earnedMarks / (totalMarks || 1)) * 100);

  const summary = `You achieved ${earnedMarks} / ${totalMarks} (${percentage}%) with an overall accuracy of ${accuracy}%. Performance level: ${overallLevel.toUpperCase().replace('_', ' ')}.`;

  const strengths = [
    'Strong conceptual accuracy on standard Multiple Choice Questions.',
    'Consistent step formulation in Section A objective problems.',
  ];

  const weaknesses = [
    'Review multi-step algebraic substitution calculations under time pressure.',
    'Strengthen prerequisite formula retention for long-answer proofs.',
  ];

  return { summary, strengths, weaknesses };
}
