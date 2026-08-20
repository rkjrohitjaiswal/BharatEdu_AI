import { PracticeContext, PracticeMode } from './types.js';

export interface SelectedConceptPriority {
  conceptId: string;
  topicId: string;
  subject: string;
  priorityLevel: number;
  selectionReason: string;
}

export function selectBestPracticeConcept(
  context: PracticeContext,
  mode: PracticeMode = 'mixed',
  requestedConceptId?: string
): SelectedConceptPriority {
  if (requestedConceptId) {
    return {
      conceptId: requestedConceptId,
      topicId: requestedConceptId.includes('algebra') ? 'math_algebra' : 'math_general',
      subject: 'Mathematics',
      priorityLevel: 1,
      selectionReason: 'User explicitly requested concept practice',
    };
  }

  // Priority 1: Critical Prerequisite Gap
  if (context.prerequisiteGaps.length > 0) {
    const cId = context.prerequisiteGaps[0];
    return {
      conceptId: cId,
      topicId: 'math_prereq',
      subject: 'Mathematics',
      priorityLevel: 1,
      selectionReason: 'Critical prerequisite gap must be mastered first before advanced topics',
    };
  }

  // Priority 2: Critical / High Risk Concept
  if (context.isHighRisk && context.weakConceptIds.length > 0) {
    const cId = context.weakConceptIds[0];
    return {
      conceptId: cId,
      topicId: 'math_gaps',
      subject: 'Mathematics',
      priorityLevel: 2,
      selectionReason: 'High-risk weakness identified in core learning profile',
    };
  }

  // Priority 3: Exam-Critical Weak Concept
  if (context.daysUntilExam <= 14 && context.examCriticalConcepts.length > 0) {
    const cId = context.examCriticalConcepts[0];
    return {
      conceptId: cId,
      topicId: 'math_exam_prep',
      subject: 'Mathematics',
      priorityLevel: 3,
      selectionReason: 'Upcoming exam topic with high mark weightage requiring urgent practice',
    };
  }

  // Priority 4: Active Learning Path Concept
  if (mode === 'learning_path' || context.nextConceptId) {
    return {
      conceptId: context.nextConceptId || 'math_quadratic_eq',
      topicId: 'math_algebra',
      subject: 'Mathematics',
      priorityLevel: 4,
      selectionReason: 'Next sequential concept in active curriculum learning path',
    };
  }

  // Priority 5: Repeated Mistakes
  if (mode === 'mistake' && context.recentMistakeConcepts.length > 0) {
    return {
      conceptId: context.recentMistakeConcepts[0],
      topicId: 'math_mistakes',
      subject: 'Mathematics',
      priorityLevel: 5,
      selectionReason: 'Targeted mistake remediation from recent incorrect quiz answers',
    };
  }

  // Priority 6: Smart Revision Due
  if (mode === 'revision' || context.dueRevisionConceptIds.length > 0) {
    const cId = context.dueRevisionConceptIds[0] || 'math_linear_eq';
    return {
      conceptId: cId,
      topicId: 'math_revision',
      subject: 'Mathematics',
      priorityLevel: 6,
      selectionReason: 'Spaced repetition schedule indicates concept review is due today',
    };
  }

  // Priority 7: Learning Goal
  if (mode === 'goal' && context.activeGoalConcepts.length > 0) {
    return {
      conceptId: context.activeGoalConcepts[0],
      topicId: 'math_goals',
      subject: 'Mathematics',
      priorityLevel: 7,
      selectionReason: 'Matches active student personal goal target',
    };
  }

  // Priority 8: Career Skill
  if (mode === 'career_skill') {
    return {
      conceptId: 'python_data_structures',
      topicId: 'cs_python',
      subject: 'Computer Science',
      priorityLevel: 8,
      selectionReason: 'Key foundational skill required for Software Engineer career roadmap',
    };
  }

  // Default / Priority 9-10: Fallback Reinforcement
  return {
    conceptId: context.weakConceptIds[0] || 'math_quadratic_eq',
    topicId: 'math_algebra',
    subject: 'Mathematics',
    priorityLevel: 9,
    selectionReason: 'Adaptive practice targeting weak areas and reinforcement',
  };
}
