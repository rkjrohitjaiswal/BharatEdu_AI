import { ResourceCandidate, ResourcePreferenceProfile, StudentResourceContext } from './types.js';

export function applyPersonalizationFilters(
  candidates: ResourceCandidate[],
  context: StudentResourceContext
): { filteredCandidates: ResourceCandidate[]; fallbackExplanations: Record<string, string> } {
  const fallbackExplanations: Record<string, string> = {};

  const filtered = candidates.filter((candidate) => {
    // 1. Time budget fit
    if (context.availableDailyMinutes && candidate.estimatedMinutes > context.availableDailyMinutes + 15) {
      return false;
    }

    // 2. Language fit & Fallback logic
    if (context.preferredLanguage !== 'en' && candidate.language !== context.preferredLanguage) {
      if (candidate.language === 'en' && candidate.verified) {
        fallbackExplanations[candidate.resourceId] =
          `Available in English as a verified fallback because no verified ${context.preferredLanguage.toUpperCase()} resource exists for '${candidate.topicId}'.`;
      }
    }

    return true;
  });

  return {
    filteredCandidates: filtered.length > 0 ? filtered : candidates,
    fallbackExplanations,
  };
}

export function inferPreferenceProfile(context: StudentResourceContext): ResourcePreferenceProfile {
  return {
    studentId: context.studentId,
    preferredLanguage: context.preferredLanguage || 'en',
    preferredResourceTypes: context.helpfulResourceTypes.length > 0 ? context.helpfulResourceTypes : ['ncert', 'video', 'practice'],
    preferredMaxMinutes: context.availableDailyMinutes || 30,
    dislikedResourceIds: context.skippedResourceIds,
  };
}
