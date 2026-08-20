export interface AssessmentBlueprint {
  blueprintId?: string;
  teacherId?: string;
  classId?: string;
  studentId?: string;
  subject: string;
  classLevel: number;
  board?: string;
  objectives?: string[];
  conceptDistribution?: Record<string, number>;
  difficultyDistribution?: {
    easy: number;
    medium: number;
    hard: number;
  };
  questionTypeDistribution?: Record<string, number>;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
}

export interface QuestionCandidate {
  questionId?: string;
  conceptId: string;
  subject: string;
  topic: string;
  questionType: 'mcq' | 'multiple_select' | 'true_false' | 'short_answer' | 'numerical' | 'coding' | 'assertion_reason' | 'case_based';
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options?: string[];
  correctAnswer: any;
  explanation: string;
  solutionSteps?: string[];
  marks: number;
  negativeMarks: number;
  learningObjective?: string;
  prerequisiteConcepts?: string[];
  sourceReference?: string;
  generationMethod?: 'manual' | 'template' | 'ai_draft' | 'ai_validated';
}

export interface ValidatedQuestion extends QuestionCandidate {
  validationStatus: 'pending' | 'approved' | 'rejected';
  validationErrors?: string[];
  qualityScore: number;
}

export interface QuestionGenerationContext {
  subject: string;
  topic: string;
  conceptId: string;
  learningObjective?: string;
  classLevel: number;
  board: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: 'mcq' | 'multiple_select' | 'true_false' | 'short_answer' | 'numerical' | 'coding' | 'assertion_reason' | 'case_based';
  language?: string;
}

export interface AdaptiveAssessmentState {
  assessmentId: string;
  studentId: string;
  currentQuestionIndex: number;
  currentDifficulty: 'easy' | 'medium' | 'hard';
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  masteryScore: number;
  testedConcepts: string[];
  weakConceptsFound: string[];
}

export interface AssessmentAttemptSummary {
  attemptId: string;
  assessmentId: string;
  studentId: string;
  status: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  timeSpentSeconds: number;
}

export interface AssessmentResult {
  attempt: AssessmentAttemptSummary;
  conceptPerformance: Record<string, { total: number; correct: number; percentage: number }>;
  topicPerformance: Record<string, { total: number; correct: number; percentage: number }>;
  difficultyPerformance: Record<string, { total: number; correct: number; percentage: number }>;
  strongConcepts: string[];
  weakConcepts: string[];
  recommendedActions: string[];
}

export interface QuestionQualityReport {
  questionId?: string;
  qualityScore: number; // 0-100
  warnings: string[];
  errors: string[];
  validationStatus: 'approved' | 'rejected';
}

export interface AssessmentRecommendation {
  type: 'retest' | 'prerequisite' | 'revision' | 'practice' | 'resource' | 'learning_path' | 'doubt_solver' | 'exam_prep';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  targetId?: string;
}

export interface AssessmentInsight {
  studentId: string;
  overallPerformance: string;
  keyStrengths: string[];
  keyGaps: string[];
  aiCoachAdvice: string;
}

export interface StudentAssessmentProfile {
  studentId: string;
  masteryMap: Record<string, number>;
  activeGaps: string[];
  prerequisiteGaps: string[];
  riskLevel: 'low' | 'medium' | 'high';
  revisionDueConcepts: string[];
  examTarget?: string;
}
