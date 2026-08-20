import { dataRepository } from '../../repositories/data.repository.js';
import { StudentResourceContext } from './types.js';

export async function buildStudentResourceContext(studentId: string): Promise<StudentResourceContext> {
  const [
    gapsList,
    mistakesList,
    revisionsList,
    doubtsList,
    goalsList,
    studyPlan,
    examPapers,
    interactions,
    bookmarks,
    dismissedRecs,
  ] = await Promise.all([
    dataRepository.getStudentGaps ? dataRepository.getStudentGaps(studentId) : [],
    dataRepository.getStudentMisconceptions ? dataRepository.getStudentMisconceptions(studentId) : [],
    dataRepository.getStudentRevisionItems ? dataRepository.getStudentRevisionItems(studentId) : [],
    dataRepository.getStudentDoubts ? dataRepository.getStudentDoubts(studentId) : [],
    dataRepository.getStudentGoals ? dataRepository.getStudentGoals(studentId) : [],
    dataRepository.getStudentStudyPlan ? dataRepository.getStudentStudyPlan(studentId) : null,
    dataRepository.getStudentExamPapers ? dataRepository.getStudentExamPapers(studentId) : [],
    dataRepository.getResourceInteractions ? dataRepository.getResourceInteractions(studentId) : [],
    dataRepository.getResourceBookmarks ? dataRepository.getResourceBookmarks(studentId) : [],
    dataRepository.getResourceRecommendations ? dataRepository.getResourceRecommendations(studentId) : [],
  ]);

  // Extract weak concepts & gaps
  const weakConceptIds: string[] = (gapsList || [])
    .filter((g: any) => g.status === 'active' && (g.conceptId || g.topicId))
    .map((g: any) => g.conceptId || g.topicId);

  // Extract prerequisite gaps
  const prerequisiteGaps: string[] = [];
  (mistakesList || []).forEach((mk: any) => {
    if (mk.conceptId && !weakConceptIds.includes(mk.conceptId)) {
      prerequisiteGaps.push(mk.conceptId);
    }
  });

  // Due revisions
  const dueRevisionConceptIds: string[] = (revisionsList || [])
    .filter((r: any) => r.conceptId && (r.isDue || new Date(r.nextReviewAt || 0) <= new Date()))
    .map((r: any) => r.conceptId);

  // Doubts
  const unresolvedDoubtConcepts: string[] = (doubtsList || [])
    .filter((d: any) => d.status !== 'resolved' && d.conceptId)
    .map((d: any) => d.conceptId);

  // Mistakes
  const recentMistakeConcepts: string[] = (mistakesList || [])
    .filter((m: any) => m.conceptId)
    .map((m: any) => m.conceptId);

  // Exam urgency
  let daysUntilExam = 30;
  const examCriticalConcepts: string[] = [];
  if (examPapers && examPapers.length > 0) {
    const activeExam = examPapers[0];
    if (activeExam.targetExamDate) {
      const diffMs = new Date(activeExam.targetExamDate).getTime() - Date.now();
      daysUntilExam = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }
    if (activeExam.weakTopicIds) {
      examCriticalConcepts.push(...activeExam.weakTopicIds);
    }
  }

  // Active goals
  const activeGoalConcepts: string[] = (goalsList || [])
    .filter((g: any) => g.status === 'active' && g.conceptId)
    .map((g: any) => g.conceptId);

  // Career tags
  const careerList: any[] = [];
  const careerTags: string[] = [];
  (careerList || []).forEach((c: any) => {
    if (c.requiredSkills) careerTags.push(...c.requiredSkills);
  });

  // Daily study minutes
  let availableDailyMinutes = 30;
  if (studyPlan) {
    availableDailyMinutes = studyPlan.availableDailyMinutes || 30;
  }

  // Interactions history
  const completedResourceIds = (interactions || [])
    .filter((i: any) => i.interactionType === 'completed')
    .map((i: any) => i.resourceId);

  const skippedResourceIds = (interactions || [])
    .filter((i: any) => i.interactionType === 'skipped')
    .map((i: any) => i.resourceId);

  const helpfulTypesSet = new Set<any>();
  (interactions || []).forEach((i: any) => {
    if (i.interactionType === 'helpful' && i.resourceType) {
      helpfulTypesSet.add(i.resourceType);
    }
  });

  const dismissedResourceIds = (dismissedRecs || [])
    .filter((r: any) => r.isDismissed)
    .map((r: any) => r.resourceId);

  return {
    studentId,
    classLevel: '10th',
    board: 'CBSE',
    preferredLanguage: 'en',
    availableDailyMinutes,
    weakConceptIds: Array.from(new Set(weakConceptIds)),
    prerequisiteGaps: Array.from(new Set(prerequisiteGaps)),
    dueRevisionConceptIds: Array.from(new Set(dueRevisionConceptIds)),
    unresolvedDoubtConcepts: Array.from(new Set(unresolvedDoubtConcepts)),
    recentMistakeConcepts: Array.from(new Set(recentMistakeConcepts)),
    currentLearningPathStage: 'Algebra Stage 1',
    nextConceptId: weakConceptIds[0] || 'math_quadratic_eq',
    daysUntilExam,
    examCriticalConcepts: Array.from(new Set(examCriticalConcepts)),
    careerGoalIds: (careerList || []).map((c: any) => c.careerId || c._id),
    careerTags: Array.from(new Set(careerTags)),
    activeGoalConcepts: Array.from(new Set(activeGoalConcepts)),
    isHighRisk: weakConceptIds.length >= 3,
    completedResourceIds: Array.from(new Set(completedResourceIds)),
    skippedResourceIds: Array.from(new Set(skippedResourceIds)),
    helpfulResourceTypes: Array.from(helpfulTypesSet),
    dismissedResourceIds: Array.from(new Set(dismissedResourceIds)),
  };
}
