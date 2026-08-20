import { ResourceCandidate, ResourceExplanation, StudentResourceContext } from './types.js';

export async function generateAIResourceExplanation(
  candidate: ResourceCandidate,
  context: StudentResourceContext,
  reason: string
): Promise<ResourceExplanation> {
  const isAIKeyAvailable = !!process.env.AI_API_KEY;

  if (isAIKeyAvailable) {
    try {
      // In production with AI_API_KEY, an LLM call can enhance the wording.
      // Here we provide grounded structure.
    } catch (e) {
      // Fallback
    }
  }

  // Deterministic Grounded Explanation Fallback
  let howItHelps = `Study ${candidate.title} to reinforce your understanding of ${candidate.topicId} (${candidate.conceptId}).`;
  if (context.weakConceptIds.includes(candidate.conceptId)) {
    howItHelps = `Directly addresses your current learning gap in ${candidate.topicId} to raise your mastery above 60%.`;
  } else if (context.prerequisiteGaps.includes(candidate.conceptId)) {
    howItHelps = `Builds essential foundational prerequisite knowledge required before advancing on your Learning Path.`;
  } else if (context.unresolvedDoubtConcepts.includes(candidate.conceptId)) {
    howItHelps = `Clarifies concepts related to your recent academic doubts with structured step-by-step guidance.`;
  }

  const whatToLearnBefore = candidate.prerequisites.length > 0 ? candidate.prerequisites : ['Basic algebra and core concepts'];
  const whatToDoAfter = `Take a 10-minute diagnostic practice quiz on ${candidate.topicId} to verify your mastery.`;

  return {
    recommendationId: `rec_${candidate.resourceId}`,
    whyRecommended: reason,
    howItHelps,
    whatToLearnBefore,
    whatToDoAfter,
  };
}
