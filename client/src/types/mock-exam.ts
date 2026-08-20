export type ExamType =
  | 'full_length'
  | 'sectional'
  | 'topic_test'
  | 'revision_test'
  | 'adaptive_mock'
  | 'board_mock'
  | 'competitive_mock';

export interface IMockExamRecommendation {
  recommendationId: string;
  examType: ExamType;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}

export interface IMockExamClient {
  examId: string;
  studentId?: string;
  title: string;
  examType: ExamType;
  board: string;
  classLevel: string;
  targetExam: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  negativeMarks: number;
  totalQuestions: number;
  sections: Array<{
    sectionId: string;
    name: string;
    subject: string;
    questionCount: number;
    totalMarks: number;
  }>;
  status: string;
}

export interface IMockExamQuestionClient {
  questionId: string;
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
}

export interface IMockExamTimerClient {
  startedAt: string;
  expiresAt: string;
  durationMinutes: number;
  timeRemainingSeconds: number;
  totalElapsedSeconds: number;
  isExpired: boolean;
}

export interface IMockExamResultClient {
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
  sectionResults: Array<{
    sectionId: string;
    sectionName: string;
    score: number;
    totalMarks: number;
    accuracy: number;
  }>;
  topicPerformance: Array<{
    topicId: string;
    topicName: string;
    correct: number;
    total: number;
    accuracy: number;
  }>;
  conceptPerformance: Array<{
    conceptId: string;
    conceptName: string;
    correct: number;
    total: number;
    accuracy: number;
  }>;
  difficultyPerformance: {
    easy: { correct: number; total: number; accuracy: number };
    medium: { correct: number; total: number; accuracy: number };
    hard: { correct: number; total: number; accuracy: number };
  };
  timeManagement: {
    totalTimeSpentSeconds: number;
    averageTimePerQuestionSeconds: number;
    recommendation: string;
  };
  strengths: string[];
  weaknesses: string[];
  riskAreas: string[];
  recommendedActions: Array<{
    actionType: string;
    title: string;
    description: string;
    targetId?: string;
  }>;
  generatedAt: string;
}
