import { EvaluationStatus, OverallPerformanceLevel } from '../../models/exam-evaluation.model.js';
import { MisconceptionCategoryType, MisconceptionSeverityLevel, MisconceptionStatus } from '../../models/student-misconception.model.js';

export interface IQuestionEvaluationDTO {
  questionId: string;
  paperId: string;
  questionType: string;
  topicId: string;
  conceptId: string;
  difficulty: string;
  submittedAnswer: string;
  isCorrect: boolean;
  marksAvailable: number;
  marksAwarded: number;
  negativeMarks: number;
  responseTimeSeconds: number;
  confidence: number;
  evaluationMethod: 'deterministic' | 'rubric' | 'semantic' | 'hybrid';
  misconceptionType?: string;
  feedback: string;
}

export interface ITopicEvaluationDTO {
  topicId: string;
  questionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
  marksAvailable: number;
  marksEarned: number;
  status: 'strong' | 'developing' | 'needs_attention';
}

export interface IConceptEvaluationDTO {
  conceptId: string;
  prerequisiteConceptIds: string[];
  accuracy: number;
  misconceptionCount: number;
  readinessScore: number;
  recommendedAction: string;
}

export interface IStudentMisconceptionDTO {
  id: string;
  studentId: string;
  topicId: string;
  conceptId: string;
  misconceptionType: MisconceptionCategoryType;
  description: string;
  evidenceCount: number;
  severity: MisconceptionSeverityLevel;
  status: MisconceptionStatus;
  recommendedAction: string;
  lastDetectedAt: string;
}

export interface IExamEvaluationDTO {
  id: string;
  evaluationId: string;
  paperId: string;
  studentId: string;
  totalMarks: number;
  earnedMarks: number;
  percentage: number;
  accuracy: number;
  completionRate: number;
  averageResponseTimeSeconds: number;
  unansweredCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  negativeMarks: number;
  evaluationStatus: EvaluationStatus;
  overallLevel: OverallPerformanceLevel;
  aiInsight?: string;
  questionEvaluations: IQuestionEvaluationDTO[];
  topicEvaluations: ITopicEvaluationDTO[];
  conceptEvaluations: IConceptEvaluationDTO[];
  misconceptions: IStudentMisconceptionDTO[];
  recommendations: string[];
  generatedAt: string;
  completedAt?: string;
}
