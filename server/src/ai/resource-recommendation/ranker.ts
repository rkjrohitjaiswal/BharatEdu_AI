import { LearningResource, RecommendationScore, StudentResourceProfile } from './types.js';
import { RecommendationRulesEngine } from './rules.js';

export function rankResourceCandidate(resource: LearningResource, profile: StudentResourceProfile): RecommendationScore {
  const signals = RecommendationRulesEngine.evaluateSignals(resource, profile);
  return RecommendationRulesEngine.calculateScore(signals);
}
