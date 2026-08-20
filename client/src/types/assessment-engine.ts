export interface IAssessmentClient {
  assessmentId: string;
  teacherId?: string;
  classId?: string;
  studentId?: string;
  title: string;
  description: string;
  subject: string;
  classLevel: number;
  board: string;
  assessmentType: 'diagnostic' | 'practice' | 'formative' | 'summative' | 'mock_exam' | 'adaptive' | 'revision' | 'remedial';
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  status: 'draft' | 'published' | 'active' | 'completed' | 'archived';
  source: 'teacher' | 'system' | 'ai';
  createdAt?: string;
}

export interface IAssessmentQuestionClient {
  questionId: string;
  assessmentId: string;
  conceptId: string;
  subject: string;
  topic: string;
  questionType: 'mcq' | 'multiple_select' | 'true_false' | 'short_answer' | 'numerical' | 'coding' | 'assertion_reason' | 'case_based';
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options?: string[];
  explanation?: string;
  marks: number;
  negativeMarks: number;
  learningObjective?: string;
  prerequisiteConcepts?: string[];
  sourceReference?: string;
  validationStatus?: string;
}

export interface IAssessmentAttemptClient {
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

export interface IAssessmentResultClient {
  attempt: IAssessmentAttemptClient;
  conceptPerformance: Record<string, { total: number; correct: number; percentage: number }>;
  topicPerformance: Record<string, { total: number; correct: number; percentage: number }>;
  difficultyPerformance: Record<string, { total: number; correct: number; percentage: number }>;
  strongConcepts: string[];
  weakConcepts: string[];
  recommendedActions: string[];
}

export interface IAssessmentAnalyticsClient {
  totalAttempts: number;
  averageScore: number;
  medianScore: number;
  completionRate: number;
  averageAccuracy: number;
  scoreDistribution: { A: number; B: number; C: number; D: number; F: number };
}
