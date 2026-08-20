import { ExamType } from '../../models/mock-exam.model.js';

export interface MockExamConfig {
  title?: string;
  examType?: ExamType;
  board?: string;
  classLevel?: string;
  targetExam?: string;
  durationMinutes?: number;
  totalQuestions?: number;
  totalMarks?: number;
  negativeMarking?: boolean;
  negativeMarks?: number;
  subjects?: string[];
  focusTopicId?: string;
  focusConceptId?: string;
}

export interface ExamSectionConfig {
  sectionId: string;
  name: string;
  subject: string;
  questionCount: number;
  totalMarks: number;
  allowedQuestionTypes: string[];
}

export interface ExamBlueprint {
  blueprintId: string;
  targetExam: string;
  board: string;
  classLevel: string;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  negativeMarking: boolean;
  negativeMarks: number;
  sections: ExamSectionConfig[];
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  conceptDistribution: Array<{
    conceptId: string;
    topicId: string;
    subject: string;
    questionCount: number;
  }>;
}

export interface ExamQuestion {
  questionId: string;
  examId?: string;
  sectionId: string;
  questionNumber: number;
  marks: number;
  negativeMarks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  conceptId: string;
  topicId: string;
  questionType: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  solutionSteps?: string[];
  sourceType: 'verified_bank' | 'ai_generated' | 'previous_year';
  misconceptionTags?: string[];
}

export interface ExamSection {
  sectionId: string;
  name: string;
  subject: string;
  durationMinutes?: number;
  questionCount: number;
  totalMarks: number;
  order: number;
}

export interface ExamAttemptState {
  attemptId: string;
  examId: string;
  studentId: string;
  startedAt: string;
  expiresAt: string;
  currentQuestionNumber: number;
  totalQuestions: number;
  answers: Record<string, string>; // questionId -> selectedAnswer
  visitedQuestions: number[];
  markedForReview: number[];
  timeSpentSeconds: number;
  status: 'in_progress' | 'submitted' | 'evaluated' | 'expired';
}

export interface ExamAnswerResult {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
  timeSpentSeconds: number;
}

export interface SectionPerformance {
  sectionId: string;
  sectionName: string;
  subject: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
}

export interface TimeManagementMetrics {
  totalTimeSpentSeconds: number;
  averageTimePerQuestionSeconds: number;
  slowQuestionCount: number;
  rushedQuestionCount: number;
  timeEfficiencyScore: number;
  recommendation: string;
}

export interface ExamRecommendation {
  actionType: 'revision' | 'practice' | 'doubt' | 'resource' | 'study_plan';
  title: string;
  description: string;
  targetId?: string;
  reason: string;
}

export interface ExamResult {
  resultId: string;
  attemptId: string;
  studentId: string;
  examId: string;
  totalScore: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  rankEstimate?: number;
  percentileEstimate?: number;
  sectionResults: SectionPerformance[];
  topicPerformance: Array<{ topicId: string; topicName: string; correct: number; total: number; accuracy: number }>;
  conceptPerformance: Array<{ conceptId: string; conceptName: string; correct: number; total: number; accuracy: number }>;
  difficultyPerformance: {
    easy: { correct: number; total: number; accuracy: number };
    medium: { correct: number; total: number; accuracy: number };
    hard: { correct: number; total: number; accuracy: number };
  };
  timeManagement: TimeManagementMetrics;
  strengths: string[];
  weaknesses: string[];
  riskAreas: string[];
  recommendedActions: ExamRecommendation[];
  generatedAt: string;
}

export interface ExamSimulationContext {
  studentId: string;
  board: string;
  classLevel: string;
  targetExam: string;
  weakConceptIds: string[];
  prerequisiteGaps: string[];
  mistakeConceptIds: string[];
  overallReadiness: number;
}
