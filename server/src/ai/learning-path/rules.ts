import { StudentLearningLevel } from './types.js';

export function calculateStudentLearningLevel(
  averageMastery: number,
  completedStagesCount: number
): { level: StudentLearningLevel; score: number } {
  const boundedMastery = Math.min(100, Math.max(0, Math.round(averageMastery)));

  let level: StudentLearningLevel = 'foundation';
  if (boundedMastery >= 90 && completedStagesCount >= 4) level = 'mastery';
  else if (boundedMastery >= 75 && completedStagesCount >= 3) level = 'advanced';
  else if (boundedMastery >= 60 && completedStagesCount >= 2) level = 'intermediate';
  else if (boundedMastery >= 40) level = 'developing';

  return {
    level,
    score: boundedMastery,
  };
}

export function selectNextBestConcept(context: {
  rootGapConceptId?: string;
  rootGapConceptName?: string;
  rootGapSubject?: string;
  examUrgentConceptId?: string;
  highRiskConceptId?: string;
  activeGoalConceptId?: string;
  careerConceptId?: string;
  weakConceptId?: string;
  weakConceptName?: string;
  weakConceptSubject?: string;
}): { conceptId: string; conceptName: string; subject: string; reason: string; actionUrl: string } {
  const {
    rootGapConceptId,
    rootGapConceptName,
    rootGapSubject,
    examUrgentConceptId,
    highRiskConceptId,
    activeGoalConceptId,
    careerConceptId,
    weakConceptId,
    weakConceptName,
    weakConceptSubject,
  } = context;

  // 1. Knowledge Graph Root Prerequisite Gap MUST take top priority
  if (rootGapConceptId) {
    return {
      conceptId: rootGapConceptId,
      conceptName: rootGapConceptName || rootGapConceptId,
      subject: rootGapSubject || 'Mathematics',
      reason: `Fix Root Prerequisite Gap: Repair ${rootGapConceptName || rootGapConceptId} before attempting downstream concepts.`,
      actionUrl: `/learning-path`,
    };
  }

  // 2. Exam Urgent Concept
  if (examUrgentConceptId) {
    return {
      conceptId: examUrgentConceptId,
      conceptName: examUrgentConceptId,
      subject: 'Mathematics',
      reason: 'Exam Urgent: High-weight concept for your upcoming board examination.',
      actionUrl: `/exam-prep`,
    };
  }

  // 3. High Risk Concept
  if (highRiskConceptId) {
    return {
      conceptId: highRiskConceptId,
      conceptName: highRiskConceptId,
      subject: 'Science',
      reason: 'High Risk Area: Urgent remediation required to prevent academic decline.',
      actionUrl: `/practice`,
    };
  }

  // 4. Active Goal Concept
  if (activeGoalConceptId) {
    return {
      conceptId: activeGoalConceptId,
      conceptName: activeGoalConceptId,
      subject: 'Computer Science',
      reason: 'Goal Alignment: Directly supports your active learning target.',
      actionUrl: `/goals`,
    };
  }

  // 5. Weak Mastery Concept
  if (weakConceptId) {
    return {
      conceptId: weakConceptId,
      conceptName: weakConceptName || weakConceptId,
      subject: weakConceptSubject || 'Mathematics',
      reason: `Improve Mastery: Boost your score in ${weakConceptName || weakConceptId}.`,
      actionUrl: `/learning-path`,
    };
  }

  // Default Progression
  return {
    conceptId: 'math_linear_eq',
    conceptName: 'Linear Equations in Two Variables',
    subject: 'Mathematics',
    reason: 'Curriculum Progression: Master pair of linear equations.',
    actionUrl: `/learning-path`,
  };
}

export function calculatePathProgress(
  completedStages: number,
  totalStages: number,
  completedTasks: number,
  totalTasks: number
): number {
  if (totalStages <= 0) return 0;
  const stageComponent = (completedStages / totalStages) * 70;
  const taskComponent = totalTasks > 0 ? (completedTasks / totalTasks) * 30 : 0;
  const total = Math.round(stageComponent + taskComponent);
  return Math.min(100, Math.max(0, total));
}
