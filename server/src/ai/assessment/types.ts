export interface AssessmentContext {
  assessmentId: string;
  teacherId: string;
  title: string;
  subject: string;
  topic?: string;
  classLevel: string;
  board: string;
  totalMarks: number;
}

export interface QuestionEvaluation {
  questionId: string;
  isObjective: boolean;
  score: number;
  maxScore: number;
  isCorrect?: boolean;
  confidence: number;
  rubricScores?: {
    criterionId: string;
    criterionName: string;
    score: number;
    maxScore: number;
    feedback?: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  evidence: string[];
  misconceptions: string[];
  feedback: string;
}

export interface RubricEvaluation {
  criterionId: string;
  name: string;
  score: number;
  maxScore: number;
  levelName?: string;
  justification?: string;
}

export interface AIEvaluationDTO {
  evaluationId: string;
  submissionId: string;
  questionId: string;
  proposedScore: number;
  maxScore: number;
  confidence: number;
  rubricScores: RubricEvaluation[];
  strengths: string[];
  weaknesses: string[];
  evidence: string[];
  misconceptionTags: string[];
  feedback: string;
  recommendedActions: string[];
  modelVersion: string;
  evaluationStatus: 'pending' | 'generated' | 'teacher_approved' | 'teacher_modified' | 'rejected';
  generatedAt: Date;
}

export interface TeacherEvaluationDTO {
  submissionId: string;
  teacherId: string;
  questionGrades: {
    questionId: string;
    score: number;
    maxScore: number;
    isObjective: boolean;
    teacherComment?: string;
    aiApproved?: boolean;
    rubricScores?: {
      criterionId: string;
      score: number;
      maxScore: number;
    }[];
  }[];
  teacherFeedback?: string;
}

export interface SubmissionSummary {
  submissionId: string;
  studentId: string;
  studentName?: string;
  submittedAt?: Date;
  status: string;
  completionPercent: number;
  finalScore: number;
  totalMarks: number;
  percentage: number;
  lateByMinutes: number;
}

export interface AssessmentAnalytics {
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

export interface StudentFeedback {
  submissionId: string;
  totalScore: number;
  totalMarks: number;
  percentage: number;
  grade?: string;
  generalFeedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendedRevisionTopics: string[];
  recommendedResources: { title: string; type: string; url?: string }[];
  questionBreakdown: {
    questionId: string;
    questionText: string;
    score: number;
    maxMarks: number;
    studentAnswer: any;
    correctAnswer?: any; // Only returned if assessment is finalized & returned
    teacherComment?: string;
    improvementSuggestion?: string;
  }[];
}

export interface MisconceptionSummary {
  misconceptionTag: string;
  description: string;
  prerequisiteConceptId?: string;
  recommendedAction: string;
}

export interface AssessmentRecommendation {
  type: 'revision' | 'practice' | 'resource' | 'doubt_solver';
  title: string;
  description: string;
  targetId?: string;
}
