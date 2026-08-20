import { IAIEvaluation } from '../../models/ai-evaluation.model.js';
import { IAssessmentQuestion } from '../../models/assessment-question.model.js';
import { MisconceptionSummary } from './types.js';

export class MisconceptionEngine {
  static analyzeMisconceptions(
    questions: IAssessmentQuestion[],
    evaluations: IAIEvaluation[]
  ): MisconceptionSummary[] {
    const map = new Map<string, MisconceptionSummary>();

    for (const ev of evaluations) {
      const q = questions.find((q) => q.questionId === ev.questionId);
      const tags = ev.misconceptionTags || [];

      for (const tag of tags) {
        if (!map.has(tag)) {
          map.set(tag, {
            misconceptionTag: tag,
            description: `Identified gap in ${(q as any)?.topic || (q as any)?.topicId || 'concept topic'}: ${tag.replace(/_/g, ' ')}`,
            prerequisiteConceptId: (q as any)?.conceptId || (q as any)?.conceptIds?.[0],
            recommendedAction: `Review foundational concepts for ${(q as any)?.conceptId || (q as any)?.conceptIds?.[0] || 'this topic'} before re-attempting practice problems.`,
          });
        }
      }
    }

    return Array.from(map.values());
  }
}
