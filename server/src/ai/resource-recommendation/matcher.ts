import { ResourceCandidate, StudentResourceContext } from './types.js';

export function matchResourceCandidate(
  candidate: ResourceCandidate,
  context: StudentResourceContext
): { isMatch: boolean; matchReasons: string[] } {
  const matchReasons: string[] = [];

  // Exclude completed or dismissed resources
  if (context.dismissedResourceIds.includes(candidate.resourceId)) {
    return { isMatch: false, matchReasons: ['Resource was dismissed by student'] };
  }

  if (context.completedResourceIds.includes(candidate.resourceId)) {
    return { isMatch: false, matchReasons: ['Resource already completed'] };
  }

  // 1. Concept / Learning Gap match
  if (context.weakConceptIds.includes(candidate.conceptId)) {
    matchReasons.push('Direct learning gap in weak concept');
  }

  // 2. Prerequisite match
  if (context.prerequisiteGaps.includes(candidate.conceptId)) {
    matchReasons.push('Foundational prerequisite concept for upcoming learning path stage');
  }

  // 3. Doubt match
  if (context.unresolvedDoubtConcepts.includes(candidate.conceptId)) {
    matchReasons.push('Directly addresses an active unresolved doubt');
  }

  // 4. Mistake match
  if (context.recentMistakeConcepts.includes(candidate.conceptId)) {
    matchReasons.push('Targets a concept with recent recurring mistakes');
  }

  // 5. Revision match
  if (context.dueRevisionConceptIds.includes(candidate.conceptId)) {
    matchReasons.push('Due for Smart Revision spacing review');
  }

  // 6. Exam critical match
  if (context.examCriticalConcepts.includes(candidate.conceptId) || candidate.examTags.length > 0) {
    matchReasons.push('High-yield exam preparation topic');
  }

  // 7. Active Goal match
  if (context.activeGoalConcepts.includes(candidate.conceptId)) {
    matchReasons.push('Aligned with active student learning goal');
  }

  // 8. Career match
  if (candidate.careerTags.some((tag) => context.careerTags.includes(tag))) {
    matchReasons.push('Develops skills for target career roadmap');
  }

  // 9. Class / Board fit
  if (candidate.board === context.board && candidate.classLevel === context.classLevel) {
    matchReasons.push('Exact Board and Class Level alignment');
  }

  // If candidate has at least 1 valid reason or is a foundational catalog item
  const isMatch = matchReasons.length > 0 || candidate.official;

  if (matchReasons.length === 0) {
    matchReasons.push('Curriculum catalog recommended resource');
  }

  return {
    isMatch,
    matchReasons,
  };
}
