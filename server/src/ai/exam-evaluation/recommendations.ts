import { IConceptEvaluationDTO, ITopicEvaluationDTO } from './types.js';

export function generateRemediationRecommendations(
  tEvaluations: ITopicEvaluationDTO[],
  cEvaluations: IConceptEvaluationDTO[]
): string[] {
  const recs: string[] = [];

  const weakTopics = tEvaluations.filter((t) => t.status === 'needs_attention' || t.accuracy < 60);
  if (weakTopics.length > 0) {
    recs.push(`Focus 20 minutes on topic '${weakTopics[0].topicId}' to resolve foundational accuracy gaps.`);
  }

  const weakConcepts = cEvaluations.filter((c) => c.accuracy < 70);
  if (weakConcepts.length > 0) {
    const c = weakConcepts[0];
    if (c.prerequisiteConceptIds && c.prerequisiteConceptIds.length > 0) {
      recs.push(`Prerequisite Alert: Revise prerequisite '${c.prerequisiteConceptIds[0]}' before retrying concept '${c.conceptId}'.`);
    } else {
      recs.push(`Schedule 15 minutes of spaced revision on concept '${c.conceptId}'.`);
    }
  }

  if (recs.length === 0) {
    recs.push('Excellent performance! Take a full-length board-style mock paper to test speed under exam conditions.');
  }

  return recs;
}
