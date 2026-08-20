import { IConceptEvaluationDTO, IQuestionEvaluationDTO } from './types.js';

export function analyzeConceptPerformance(qEvaluations: IQuestionEvaluationDTO[]): IConceptEvaluationDTO[] {
  const map: Record<string, { total: number; correct: number; misconceptions: number }> = {};

  qEvaluations.forEach((q) => {
    const cId = q.conceptId || 'math_linear_eq';
    if (!map[cId]) map[cId] = { total: 0, correct: 0, misconceptions: 0 };
    map[cId].total += 1;
    if (q.isCorrect) map[cId].correct += 1;
    if (q.misconceptionType) map[cId].misconceptions += 1;
  });

  return Object.entries(map).map(([cId, data]) => {
    const accuracy = Math.round((data.correct / (data.total || 1)) * 100);
    const prerequisiteConceptIds = cId.includes('trig') ? ['math_algebra_basics', 'math_triangles'] : ['math_algebra_basics'];
    return {
      conceptId: cId,
      prerequisiteConceptIds,
      accuracy,
      misconceptionCount: data.misconceptions,
      readinessScore: accuracy,
      recommendedAction: accuracy >= 75 ? 'Mastery verified. Proceed to next topic.' : 'Revise prerequisite formulas before retrying practice tests.',
    };
  });
}
