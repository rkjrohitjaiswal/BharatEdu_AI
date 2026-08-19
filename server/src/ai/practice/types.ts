import { QuestionDifficulty } from '../../models/practice-session.model.js';

export interface PracticeSessionRequestPayload {
  studentId: string;
  subjectId?: string;
  topicId?: string;
  questionCount?: number;
}

export interface PracticeAnswerPayload {
  studentId: string;
  sessionId: string;
  questionIndex: number;
  answer: string;
  confidence?: number;
  timeSpentSeconds?: number;
}

export interface QuestionValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PracticeRecommendationItem {
  topicId: string;
  topicName: string;
  subjectName: string;
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendedDifficulty: QuestionDifficulty;
  estimatedQuestions: number;
  learningGapId?: string;
}

export interface GeneratedQuestionPayload {
  questionText: string;
  questionType: 'mcq' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: QuestionDifficulty;
  learningObjective?: string;
  language?: 'english' | 'hindi' | 'gujarati';
  sources?: any[];
}
