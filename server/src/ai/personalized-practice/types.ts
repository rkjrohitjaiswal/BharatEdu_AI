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

export interface PracticeContext {
  studentId: string;
  classLevel: string;
  board: string;
  preferredLanguage: 'en' | 'hi' | 'gu';
  availableDailyMinutes: number;
  weakConceptIds: string[];
  prerequisiteGaps: string[];
  dueRevisionConceptIds: string[];
  unresolvedDoubtConcepts: string[];
  recentMistakeConcepts: string[];
  currentLearningPathStage: string;
  nextConceptId: string;
  daysUntilExam: number;
  examCriticalConcepts: string[];
  careerGoalIds: string[];
  careerTags: string[];
  activeGoalConcepts: string[];
  isHighRisk: boolean;
  recentAccuracy: number;
  averageResponseTimeSeconds: number;
}

export interface QuestionCandidate {
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
  correctAnswer?: any; // SERVER ONLY
  explanation?: string;
  solutionSteps?: string[];
  hints?: string[];
  misconceptionTags?: string[];
  prerequisiteConceptIds?: string[];
  examTags?: string[];
  careerTags?: string[];
  sourceType: string;
  qualityScore: number;
}

export interface QuestionGenerationRequest {
  studentId: string;
  conceptId: string;
  topicId: string;
  subject: string;
  difficulty: PracticeDifficulty;
  generationReason: string;
  preferredLanguage?: string;
}

export interface ValidatedQuestion {
  question: QuestionCandidate;
  isValid: boolean;
  validationScore: number;
  issues: string[];
}

export interface AdaptiveQuestionSelection {
  selectedQuestion: QuestionCandidate;
  score: number;
  rankingBreakdown: Record<string, number>;
  selectionReason: string;
}

export interface PracticeRecommendation {
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

export interface PracticeSessionSummary {
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
  completedAt: Date;
}

export interface DifficultyState {
  studentId: string;
  conceptId: string;
  currentDifficulty: PracticeDifficulty;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  recentAccuracy: number;
  updatedAt: Date;
}

export interface ConceptPracticeState {
  conceptId: string;
  masteryScore: number;
  attemptsCount: number;
  lastPracticedAt: Date;
}
