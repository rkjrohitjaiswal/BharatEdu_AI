import { AssessmentDifficulty, AssessmentStatus, AssessmentType } from '../../models/adaptive-assessment.model.js';
import { QuestionGeneratedBy, QuestionStatus, QuestionType } from '../../models/adaptive-assessment-question.model.js';

export interface IAssessmentQuestionClientDTO {
  id: string;
  questionId: string;
  assessmentId: string;
  sequence: number;
  subject: string;
  topicId: string;
  conceptId: string;
  difficulty: AssessmentDifficulty;
  questionType: QuestionType;
  question: string;
  options?: string[];
  // NO correctAnswer returned to student before submission!
  marks: number;
  timeLimitSeconds: number;
  status: QuestionStatus;
}

export interface IAssessmentQuestionReviewDTO extends IAssessmentQuestionClientDTO {
  correctAnswer: string;
  submittedAnswer?: string;
  isCorrect?: boolean;
  marksAwarded?: number;
  feedback?: string;
}

export interface IAdaptiveAssessmentDTO {
  id: string;
  assessmentId: string;
  studentId: string;
  title: string;
  subject: string;
  classLevel: string;
  board: string;
  assessmentType: AssessmentType;
  targetConceptId?: string;
  difficulty: AssessmentDifficulty;
  questionCount: number;
  timeLimitMinutes: number;
  status: AssessmentStatus;
  currentQuestionIndex: number;
  score: number;
  accuracy: number;
  masteryImpact: number;
  currentQuestion?: IAssessmentQuestionClientDTO;
  createdAt: string;
  updatedAt: string;
}

export interface IAssessmentResultsDTO {
  assessmentId: string;
  studentId: string;
  title: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  completionRate: number;
  masteryImpact: number;
  topicPerformance: { topicId: string; topicName: string; accuracy: number }[];
  conceptPerformance: { conceptId: string; conceptName: string; accuracy: number }[];
  difficultyPerformance: { difficulty: string; accuracy: number }[];
  stoppingReason?: string;
  aiExplanation?: string;
  evaluatedAt: string;
}

export interface IAssessmentSummaryData {
  studentId: string;
  totalAssessmentsCount: number;
  completedCount: number;
  averageScore: number;
  topWeaknessTopic?: string;
  aiExplanation: string;
  evaluatedAt: string;
}
