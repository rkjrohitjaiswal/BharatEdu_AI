export type ExamPaperType =
  | 'school_exam'
  | 'unit_test'
  | 'midterm'
  | 'preboard'
  | 'board_style'
  | 'mock_exam'
  | 'practice_paper'
  | 'custom';

export type ExamPaperStatus = 'draft' | 'generated' | 'ready' | 'in_progress' | 'completed' | 'expired';

export interface IExamPaperQuestionClient {
  id: string;
  questionId: string;
  paperId: string;
  sectionId: string;
  sequence: number;
  subject: string;
  topicId: string;
  conceptId: string;
  difficulty: string;
  questionType: string;
  questionText: string;
  options?: string[];
  marks: number;
  negativeMarks: number;
  sourceType: string;
  status: string;
}

export interface IExamPaperQuestionReview extends IExamPaperQuestionClient {
  correctAnswer: string;
  expectedConceptCoverage?: string[];
  submittedAnswer?: string;
  isCorrect?: boolean;
  marksAwarded?: number;
  negativeMarksApplied?: number;
  feedback?: string;
}

export interface IExamPaperSection {
  sectionId: string;
  paperId: string;
  title: string;
  instructions: string;
  sequence: number;
  questionType: string;
  questionCount: number;
  marksPerQuestion: number;
  totalMarks: number;
  negativeMarking: boolean;
  negativeMarks: number;
}

export interface IExamPaper {
  id: string;
  paperId: string;
  studentId: string;
  title: string;
  board: string;
  classLevel: string;
  subject: string;
  academicYear: string;
  examType: ExamPaperType;
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  sections: IExamPaperSection[];
  status: ExamPaperStatus;
  startedAt?: string;
  completedAt?: string;
  currentQuestion?: IExamPaperQuestionClient;
  createdAt: string;
  updatedAt: string;
}

export interface IExamPaperResults {
  paperId: string;
  studentId: string;
  title: string;
  grossMarks: number;
  negativeMarks: number;
  netMarks: number;
  totalMarks: number;
  accuracy: number;
  percentage: number;
  completionRate: number;
  sectionPerformance: { sectionId: string; title: string; score: number; totalMarks: number }[];
  topicPerformance: { topicId: string; topicName: string; accuracy: number }[];
  difficultyPerformance: { difficulty: string; accuracy: number }[];
  aiInsight?: string;
  evaluatedAt: string;
}
