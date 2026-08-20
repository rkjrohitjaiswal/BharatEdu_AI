import { ResourceCandidate, ResourceRankingBreakdown, StudentResourceContext } from './types.js';

export function rankResourceCandidate(
  candidate: ResourceCandidate,
  context: StudentResourceContext
): { totalScore: number; breakdown: ResourceRankingBreakdown } {
  let conceptRelevance = 10;
  let learningGapRelevance = 0;
  let prerequisiteRelevance = 0;
  let examRelevance = 0;
  let difficultyFit = 5;
  let learningPathAlignment = 5;
  let careerGoalAlignment = 0;
  let languagePreference = 0;
  let qualityVerification = 0;

  // 1. Concept relevance (Max 25)
  if (context.nextConceptId === candidate.conceptId) {
    conceptRelevance = 25;
  } else if (context.weakConceptIds.includes(candidate.conceptId)) {
    conceptRelevance = 20;
  } else if (context.dueRevisionConceptIds.includes(candidate.conceptId)) {
    conceptRelevance = 15;
  }

  // 2. Learning Gap relevance (Max 15)
  if (context.weakConceptIds.includes(candidate.conceptId) || context.recentMistakeConcepts.includes(candidate.conceptId)) {
    learningGapRelevance = 15;
  } else if (context.unresolvedDoubtConcepts.includes(candidate.conceptId)) {
    learningGapRelevance = 12;
  }

  // 3. Prerequisite relevance (Max 15)
  if (context.prerequisiteGaps.includes(candidate.conceptId)) {
    prerequisiteRelevance = 15;
  } else if (candidate.prerequisites.length > 0) {
    prerequisiteRelevance = 10;
  }

  // 4. Exam relevance (Max 10)
  if (context.examCriticalConcepts.includes(candidate.conceptId)) {
    examRelevance = 10;
  } else if (context.daysUntilExam <= 14) {
    examRelevance = 8;
  } else if (candidate.examTags.length > 0) {
    examRelevance = 5;
  }

  // 5. Mastery & Difficulty fit (Max 10)
  if (context.isHighRisk && (candidate.difficulty === 'beginner' || candidate.difficulty === 'easy')) {
    difficultyFit = 10;
  } else if (candidate.difficulty === 'medium') {
    difficultyFit = 8;
  } else {
    difficultyFit = 6;
  }

  // 6. Learning Path alignment (Max 10)
  if (context.nextConceptId === candidate.conceptId) {
    learningPathAlignment = 10;
  } else if (candidate.subject === 'Mathematics' || candidate.subject === 'Physics') {
    learningPathAlignment = 8;
  }

  // 7. Career / Goal alignment (Max 5)
  if (context.activeGoalConcepts.includes(candidate.conceptId)) {
    careerGoalAlignment = 5;
  } else if (candidate.careerTags.some((tag) => context.careerTags.includes(tag))) {
    careerGoalAlignment = 4;
  }

  // 8. Language preference (Max 5)
  if (candidate.language === context.preferredLanguage) {
    languagePreference = 5;
  } else if (candidate.language === 'en') {
    languagePreference = 3; // English fallback
  }

  // 9. Quality & Verification (Max 5)
  if (candidate.verified && candidate.official) {
    qualityVerification = 5;
  } else if (candidate.verified) {
    qualityVerification = 4;
  } else {
    qualityVerification = 2;
  }

  // Repetition penalty
  if (context.skippedResourceIds.includes(candidate.resourceId)) {
    learningGapRelevance = Math.max(0, learningGapRelevance - 5);
  }

  const rawScore =
    conceptRelevance +
    learningGapRelevance +
    prerequisiteRelevance +
    examRelevance +
    difficultyFit +
    learningPathAlignment +
    careerGoalAlignment +
    languagePreference +
    qualityVerification;

  const totalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  const breakdown: ResourceRankingBreakdown = {
    conceptRelevance,
    learningGapRelevance,
    prerequisiteRelevance,
    examRelevance,
    difficultyFit,
    learningPathAlignment,
    careerGoalAlignment,
    languagePreference,
    qualityVerification,
    totalScore,
  };

  return {
    totalScore,
    breakdown,
  };
}
