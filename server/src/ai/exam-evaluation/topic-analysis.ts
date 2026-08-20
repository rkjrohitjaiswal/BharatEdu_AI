import { IQuestionEvaluationDTO, ITopicEvaluationDTO } from './types.js';

export function analyzeTopicPerformance(qEvaluations: IQuestionEvaluationDTO[]): ITopicEvaluationDTO[] {
  const map: Record<string, { total: number; correct: number; available: number; earned: number }> = {};

  qEvaluations.forEach((q) => {
    const tId = q.topicId || 'General';
    if (!map[tId]) map[tId] = { total: 0, correct: 0, available: 0, earned: 0 };
    map[tId].total += 1;
    if (q.isCorrect) map[tId].correct += 1;
    map[tId].available += q.marksAvailable;
    map[tId].earned += q.marksAwarded;
  });

  return Object.entries(map).map(([tId, data]) => {
    const accuracy = Math.round((data.correct / (data.total || 1)) * 100);
    const status = accuracy >= 80 ? 'strong' : accuracy >= 50 ? 'developing' : 'needs_attention';
    return {
      topicId: tId,
      questionsAttempted: data.total,
      correctAnswers: data.correct,
      accuracy,
      marksAvailable: data.available,
      marksEarned: data.earned,
      status,
    };
  });
}
