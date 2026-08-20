import { ExamPaperStatus, ExamPaperType } from '../../models/exam-paper.model.js';
import { ExamQuestionStatus, QuestionDifficultyType, QuestionTypeFormat } from '../../models/exam-paper-question.model.js';

export interface IExamPaperQuestionClientDTO {
  id: string;
  questionId: string;
  paperId: string;
  sectionId: string;
  sequence: number;
  subject: string;
  topicId: string;
  conceptId: string;
  difficulty: QuestionDifficultyType;
  questionType: QuestionTypeFormat;
  questionText: string;
  options?: string[];
  // NO correctAnswer returned before submission!
  marks: number;
  negativeMarks: number;
  sourceType: string;
  status: ExamQuestionStatus;
}

export interface IExamPaperQuestionReviewDTO extends IExamPaperQuestionClientDTO {
  correctAnswer: string;
  expectedConceptCoverage?: string[];
  submittedAnswer?: string;
  isCorrect?: boolean;
  marksAwarded?: number;
  negativeMarksApplied?: number;
  feedback?: string;
}

export interface IExamPaperSectionDTO {
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

export interface IExamPaperDTO {
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
  sections: IExamPaperSectionDTO[];
  status: ExamPaperStatus;
  startedAt?: string;
  completedAt?: string;
  currentQuestion?: IExamPaperQuestionClientDTO;
  createdAt: string;
  updatedAt: string;
}

export interface IExamPaperResultsDTO {
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
