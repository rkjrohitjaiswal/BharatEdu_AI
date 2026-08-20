import { dataRepository } from '../../repositories/data.repository.js';
import { PracticeContext } from './types.js';

export async function buildStudentPracticeContext(studentId: string): Promise<PracticeContext> {
  const [
    gapsList,
    mistakesList,
    revisionsList,
    doubtsList,
    goalsList,
    studyPlan,
    examPapers,
    interactions,
    attempts,
  ] = await Promise.all([
    dataRepository.getStudentGaps ? dataRepository.getStudentGaps(studentId) : [],
    dataRepository.getStudentMisconceptions ? dataRepository.getStudentMisconceptions(studentId) : [],
    dataRepository.getStudentRevisionItems ? dataRepository.getStudentRevisionItems(studentId) : [],
    dataRepository.getStudentDoubts ? dataRepository.getStudentDoubts(studentId) : [],
    dataRepository.getStudentGoals ? dataRepository.getStudentGoals(studentId) : [],
    dataRepository.getStudentStudyPlan ? dataRepository.getStudentStudyPlan(studentId) : null,
    dataRepository.getStudentExamPapers ? dataRepository.getStudentExamPapers(studentId) : [],
    dataRepository.getResourceInteractions ? dataRepository.getResourceInteractions(studentId) : [],
    dataRepository.getStudentPersonalizedAttempts ? dataRepository.getStudentPersonalizedAttempts(studentId) : [],
  ]);

  // Weak concepts & gaps
  const weakConceptIds: string[] = (gapsList || [])
    .filter((g: any) => g.status === 'active' && (g.conceptId || g.topicId))
    .map((g: any) => g.conceptId || g.topicId);

  // Prerequisite gaps
  const prerequisiteGaps: string[] = [];
  (mistakesList || []).forEach((mk: any) => {
    if (mk.prerequisiteConceptId) prerequisiteGaps.push(mk.prerequisiteConceptId);
  });

  // Smart Revision due
  const dueRevisionConceptIds: string[] = (revisionsList || [])
    .filter((r: any) => r.status === 'due' || (r.nextReviewDate && new Date(r.nextReviewDate) <= new Date()))
    .map((r: any) => r.conceptId || r.topicId);

  // Unresolved doubts
  const unresolvedDoubtConcepts: string[] = (doubtsList || [])
    .filter((d: any) => d.status !== 'resolved' && d.conceptId)
    .map((d: any) => d.conceptId);

  // Recent mistakes
  const recentMistakeConcepts: string[] = (mistakesList || [])
    .filter((m: any) => m.status === 'active' && m.conceptId)
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

  // Goals & Career
  const activeGoalConcepts: string[] = (goalsList || [])
    .filter((g: any) => g.status === 'active' && g.conceptId)
    .map((g: any) => g.conceptId);

  const careerGoalIds: string[] = ['software_engineer', 'data_scientist'];
  const careerTags: string[] = ['math', 'python', 'logic', 'algebra'];

  // Study plan minutes
  let availableDailyMinutes = 30;
  if (studyPlan) {
    availableDailyMinutes = studyPlan.availableDailyMinutes || 30;
  }

  // Recent practice accuracy
  const recentAttempts = (attempts || []).slice(0, 10);
  const correctCount = recentAttempts.filter((a: any) => a.isCorrect).length;
  const recentAccuracy = recentAttempts.length > 0 ? (correctCount / recentAttempts.length) * 100 : 70;

  const avgTime = recentAttempts.length > 0
    ? Math.round(recentAttempts.reduce((acc: number, a: any) => acc + (a.responseTimeSeconds || 30), 0) / recentAttempts.length)
    : 45;

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
    careerGoalIds,
    careerTags,
    activeGoalConcepts: Array.from(new Set(activeGoalConcepts)),
    isHighRisk: weakConceptIds.length >= 3,
    recentAccuracy,
    averageResponseTimeSeconds: avgTime,
  };
}
