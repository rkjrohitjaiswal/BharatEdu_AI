import { AssessmentType, AssessmentStatus } from '../../models/adaptive-assessment.model.js';
import { QuestionDifficulty, QuestionType } from '../../models/question.model.js';

export interface IQuestionItem {
  questionId: string;
  conceptId: string;
  subject: string;
  classLevel: string;
  board: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  sourceType: string;
  sourceReference: string;
  generatedBy: 'human' | 'ai';
  verified: boolean;
  isActive: boolean;
}

export interface IQuestionPublicItem {
  questionId: string;
  conceptId: string;
  subject: string;
  classLevel: string;
  board: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  stem: string;
  options: string[];
  hint?: string;
  sourceType: string;
  // NOTE: correctAnswer & explanation are omitted before submission!
}

export interface IQuestionValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface IAnswerSubmissionResult {
  attemptId?: string;
  isCorrect: boolean;
  correctAnswer?: string;
  explanation: string;
  masteryImpact: number;
  newDifficulty: QuestionDifficulty;
  isAssessmentCompleted: boolean;
}

export interface IAssessmentSummaryData {
  assessmentId: string;
  studentId: string;
  assessmentType: AssessmentType;
  targetConceptId: string;
  targetConceptName: string;
  subject: string;
  questionCount: number;
  completedQuestions: number;
  correctAnswers: number;
  accuracy: number;
  startingDifficulty: QuestionDifficulty;
  endingDifficulty: QuestionDifficulty;
  readinessBefore: number;
  readinessAfter: number;
  status: AssessmentStatus;
  startedAt: string;
  completedAt?: string;
  recommendedRemediation?: string;
  aiExplanation?: string;
}
