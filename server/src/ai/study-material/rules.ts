import { MaterialDifficulty, MaterialType } from '../../models/study-material.model.js';

export interface IStudyMaterialContextInput {
  conceptId?: string;
  topicId?: string;
  subject?: string;
  isPrerequisiteGap: boolean;
  masteryScore: number; // 0 to 100
  isExamUrgent: boolean;
  isHighRisk: boolean;
  isRevisionDue: boolean;
  availableMinutes: number;
  requestedType?: MaterialType;
}

export function determinePersonalizedMaterialRules(input: IStudyMaterialContextInput): {
  recommendedType: MaterialType;
  difficulty: MaterialDifficulty;
  estimatedMinutes: number;
  reason: string;
  prerequisiteGapNotice?: string;
} {
  const { isPrerequisiteGap, masteryScore, isExamUrgent, isHighRisk, isRevisionDue, availableMinutes, requestedType } =
    input;

  let recommendedType: MaterialType = requestedType || 'detailed_notes';
  let difficulty: MaterialDifficulty = 'intermediate';
  let estimatedMinutes = Math.min(availableMinutes || 30, 30);
  let reason = 'Personalized learning notes aligned with your study goals.';
  let prerequisiteGapNotice: string | undefined;

  if (isPrerequisiteGap) {
    recommendedType = 'quick_notes';
    difficulty = 'beginner';
    estimatedMinutes = 15;
    reason = 'Prerequisite Foundation: Repairing fundamental prerequisite concepts before advancing.';
    prerequisiteGapNotice = 'Foundational concept mastery is below 70%. Foundational repair notes generated first.';
  } else if (isHighRisk) {
    recommendedType = 'key_points';
    difficulty = 'beginner';
    estimatedMinutes = 15;
    reason = 'Academic Recovery: High-yield concise notes to recover performance.';
  } else if (isExamUrgent) {
    recommendedType = 'exam_notes';
    difficulty = 'intermediate';
    estimatedMinutes = 20;
    reason = 'Exam Prep Priority: Focused high-value formulas, key points, and exam strategies.';
  } else if (isRevisionDue) {
    recommendedType = 'revision_sheet';
    difficulty = 'intermediate';
    estimatedMinutes = 15;
    reason = 'Spaced Repetition: Consolidated revision sheet to strengthen long-term memory.';
  } else if (masteryScore < 50) {
    recommendedType = 'detailed_notes';
    difficulty = 'beginner';
    estimatedMinutes = 30;
    reason = 'Mastery Boost: Comprehensive detailed guide with worked examples.';
  } else if (masteryScore >= 80) {
    recommendedType = 'practice_guide';
    difficulty = 'advanced';
    estimatedMinutes = 20;
    reason = 'Advanced Challenge: Applied practice guide & problem-solving examples.';
  }

  return {
    recommendedType,
    difficulty,
    estimatedMinutes,
    reason,
    prerequisiteGapNotice,
  };
}
