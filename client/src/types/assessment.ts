export type AssessmentType =
  | 'assignment'
  | 'quiz'
  | 'subjective_test'
  | 'coding_assessment'
  | 'project'
  | 'worksheet'
  | 'mixed';

export type AssessmentStatus = 'draft' | 'published' | 'closed' | 'archived';

export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'late'
  | 'under_review'
  | 'ai_evaluated'
  | 'teacher_reviewed'
  | 'returned';

export interface IAssessmentClient {
  _id?: string;
  assessmentId: string;
  teacherId: string;
  title: string;
  description?: string;
  subject: string;
  topic?: string;
  conceptIds: string[];
  classLevel: string;
  board: string;
  assessmentType: AssessmentType;
  instructions?: string;
  totalMarks: number;
  passingMarks: number;
  durationMinutes?: number;
  dueAt?: string;
  lateSubmissionAllowed: boolean;
  latePenaltyPercent: number;
  status: AssessmentStatus;
  rubricId?: string;
  questionCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAssessmentQuestionClient {
  _id?: string;
  assessmentId: string;
  questionId: string;
  order: number;
  questionType: string;
  question: string;
  options?: string[];
  marks: number;
  correctAnswer?: any;
  expectedPoints?: string[];
  conceptIds: string[];
  topicId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  modelAnswer?: string;
  hints?: string[];
}

export interface IAssessmentSubmissionClient {
  _id?: string;
  submissionId: string;
  assessmentId: string;
  studentId: string;
  submittedAt?: string;
  status: SubmissionStatus;
  attemptNumber: number;
  totalQuestions: number;
  answeredQuestions: number;
  completionPercent: number;
  lateByMinutes: number;
  finalScore: number;
  percentage: number;
  teacherFinalized: boolean;
  returnedAt?: string;
}

export interface IAIEvaluationClient {
  evaluationId: string;
  submissionId: string;
  questionId: string;
  proposedScore: number;
  maxScore: number;
  confidence: number;
  rubricScores: {
    criterionId: string;
    criterionName: string;
    assignedScore: number;
    maxScore: number;
    feedback?: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  evidence: string[];
  misconceptionTags: string[];
  feedback: string;
  recommendedActions: string[];
  evaluationStatus: string;
}

export interface IAssessmentAnalyticsClient {
  assessmentId: string;
  title: string;
  totalSubmissions: number;
  classAverage: number;
  medianScore: number;
  highestScore: number;
  lowestScore: number;
  completionRate: number;
  questionPerformance: {
    questionId: string;
    questionNumber: number;
    averageScore: number;
    maxMarks: number;
    successRate: number;
    flaggedQualityIssue?: string;
  }[];
  topMisconceptions: {
    tag: string;
    count: number;
    affectedStudentsCount: number;
  }[];
  studentsNeedingAttention: {
    studentId: string;
    score: number;
    percentage: number;
    riskReason: string;
  }[];
}
