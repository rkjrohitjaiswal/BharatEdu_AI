import { DoubtDifficultyLevel, DoubtSourceContext, DoubtStatus } from '../../models/student-doubt.model.js';
import { DoubtResponseType, IDoubtResponseStep, IDoubtSourceReference } from '../../models/doubt-response.model.js';
import { DoubtFeedbackType } from '../../models/doubt-feedback.model.js';

export type DoubtIntentCategory =
  | 'concept_explanation'
  | 'solve_problem'
  | 'explain_answer'
  | 'compare_concepts'
  | 'formula_explanation'
  | 'coding_help'
  | 'debugging'
  | 'exam_question'
  | 'mistake_explanation'
  | 'prerequisite_help'
  | 'revision_help'
  | 'career_question'
  | 'general_academic';

export type DoubtCategory = DoubtIntentCategory;

export type ExplanationLevel = 'beginner' | 'standard' | 'advanced' | 'exam_focused';
export type ExplanationLanguage = 'en' | 'hi' | 'gu';

export interface IDoubtFollowupDTO {
  doubtId: string;
  studentId: string;
  parentResponseId: string;
  question: string;
  responseId: string;
  answer: string;
  explanation: string;
  createdAt: string;
}

export interface IDoubtResponseDTO {
  responseId: string;
  doubtId: string;
  studentId: string;
  answer: string;
  explanation: string;
  steps: IDoubtResponseStep[];
  keyConcepts: string[];
  prerequisiteConcepts: string[];
  examples: string[];
  commonMistakes: string[];
  verificationNotes: string;
  confidence: number;
  sourceReferences: IDoubtSourceReference[];
  responseType: DoubtResponseType;
  intentCategory: DoubtIntentCategory;
  explanationLevel: ExplanationLevel;
  language: ExplanationLanguage;
  generatedAt: string;
}

export interface IStudentDoubtDTO {
  id: string;
  doubtId: string;
  studentId: string;
  question: string;
  normalizedQuestion: string;
  subject: string;
  topicId: string;
  conceptId?: string;
  sourceContext: DoubtSourceContext;
  sourceId?: string;
  difficulty: DoubtDifficultyLevel;
  status: DoubtStatus;
  response?: IDoubtResponseDTO;
  followups?: IDoubtFollowupDTO[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
