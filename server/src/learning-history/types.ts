/**
 * TypeScript Interfaces for Practice & Quiz History Engine
 */

export interface PracticeHistoryItem {
  sessionId: string;
  studentId: string;
  subjectId?: string;
  subjectName: string;
  topicId?: string;
  topicName: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'intermediate';
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  score: number;
  status: 'in_progress' | 'completed';
  startedAt: Date;
  completedAt?: Date;
}

export interface PracticeHistoryFilterOptions {
  limit?: number;
  page?: number;
  subjectId?: string;
  topicId?: string;
  difficulty?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SubjectHistoryPerformance {
  subjectId: string;
  subjectName: string;
  totalSessions: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface TopicHistoryPerformance {
  topicId: string;
  topicName: string;
  subjectName: string;
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  latestPracticeDate: Date;
  difficulty: string;
}

export interface PracticeTimeSeriesPoint {
  date: string;
  questions: number;
  correct: number;
  accuracy: number;
}

export interface PracticeHistorySummary {
  totalSessions: number;
  completedSessions: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  overallAccuracy: number;
  averageSessionAccuracy: number;
  currentPracticeStreak: number;
  bestPracticeStreak: number;
  totalPracticeMinutes: number;
  subjectPerformance: SubjectHistoryPerformance[];
  topicPerformance: TopicHistoryPerformance[];
  timeSeries: PracticeTimeSeriesPoint[];
}

export interface PracticeSessionDetailQuestion {
  questionId: string;
  questionText: string;
  options?: string[];
  studentAnswer?: string;
  correctAnswer?: string; // Exposed ONLY if answered/completed
  isCorrect?: boolean;
  score?: number;
  feedback?: string;
  topicName: string;
  difficulty: string;
}

export interface PracticeSessionDetailResult {
  sessionId: string;
  studentId: string;
  subjectName: string;
  topicName: string;
  difficulty: string;
  status: string;
  score: number;
  accuracy: number;
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  startedAt: Date;
  completedAt?: Date;
  questions: PracticeSessionDetailQuestion[];
}
