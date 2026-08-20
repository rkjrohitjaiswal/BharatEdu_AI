export type EvaluationStatus = 'pending' | 'evaluating' | 'completed' | 'failed';
export type OverallPerformanceLevel = 'critical' | 'needs_improvement' | 'developing' | 'good' | 'strong';

export interface IQuestionEvaluationClient {
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

export interface ITopicEvaluationClient {
  topicId: string;
  questionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
  marksAvailable: number;
  marksEarned: number;
  status: 'strong' | 'developing' | 'needs_attention';
}

export interface IConceptEvaluationClient {
  conceptId: string;
  prerequisiteConceptIds: string[];
  accuracy: number;
  misconceptionCount: number;
  readinessScore: number;
  recommendedAction: string;
}

export interface IStudentMisconceptionClient {
  id: string;
  studentId: string;
  topicId: string;
  conceptId: string;
  misconceptionType: string;
  description: string;
  evidenceCount: number;
  severity: string;
  status: string;
  recommendedAction: string;
  lastDetectedAt: string;
}

export interface IExamEvaluation {
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
  questionEvaluations: IQuestionEvaluationClient[];
  topicEvaluations: ITopicEvaluationClient[];
  conceptEvaluations: IConceptEvaluationClient[];
  misconceptions: IStudentMisconceptionClient[];
  recommendations: string[];
  generatedAt: string;
  completedAt?: string;
}
