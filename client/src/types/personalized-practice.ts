export type PracticeMode =
  | 'quick'
  | 'weak_topic'
  | 'exam'
  | 'revision'
  | 'mistake'
  | 'learning_path'
  | 'prerequisite'
  | 'career_skill'
  | 'goal'
  | 'mixed';

export type PracticeDifficulty = 'easy' | 'medium' | 'hard';

export interface IPracticeRecommendation {
  recommendationId: string;
  mode: PracticeMode;
  title: string;
  description: string;
  subject: string;
  topicId: string;
  conceptId: string;
  difficulty: PracticeDifficulty;
  questionCount: number;
  estimatedMinutes: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}

export interface IPracticeQuestionClient {
  questionId: string;
  subject: string;
  topicId: string;
  conceptId: string;
  classLevel?: string;
  board?: string;
  questionType: string;
  difficulty: PracticeDifficulty;
  question: string;
  options?: string[];
  hints?: string[];
  misconceptionTags?: string[];
}

export interface IPracticeSessionState {
  sessionId: string;
  studentId: string;
  mode: PracticeMode;
  targetConceptId: string;
  startingDifficulty: PracticeDifficulty;
  currentDifficulty: PracticeDifficulty;
  questionIds: string[];
  currentIndex: number;
  attempts: any[];
  status: 'active' | 'completed';
}

export interface IPracticeSessionSummary {
  sessionId: string;
  studentId: string;
  mode: PracticeMode;
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  accuracyPercentage: number;
  totalTimeSeconds: number;
  hintsUsedCount: number;
  startingDifficulty: PracticeDifficulty;
  endingDifficulty: PracticeDifficulty;
  conceptsPracticed: string[];
  misconceptionsIdentified: string[];
  recommendedResourceId?: string;
  recommendedRevisionId?: string;
  completedAt: string;
}
