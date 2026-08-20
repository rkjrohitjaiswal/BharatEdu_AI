export type DoubtSourceContext =
  | 'practice'
  | 'exam'
  | 'revision'
  | 'learning_path'
  | 'dashboard'
  | 'free_question'
  | 'teacher_assigned';

export type DoubtDifficultyLevel = 'easy' | 'medium' | 'hard' | 'unknown';
export type DoubtStatus = 'open' | 'answered' | 'needs_clarification' | 'resolved';

export interface IDoubtResponseStepClient {
  stepNumber: number;
  title: string;
  description: string;
  formula?: string;
}

export interface IDoubtSourceReferenceClient {
  sourceType: string;
  sourceId?: string;
  officialSourceUrl?: string;
  title: string;
}

export interface IDoubtFollowupClient {
  doubtId: string;
  studentId: string;
  parentResponseId: string;
  question: string;
  responseId: string;
  answer: string;
  explanation: string;
  createdAt: string;
}

export interface IDoubtResponseClient {
  responseId: string;
  doubtId: string;
  studentId: string;
  answer: string;
  explanation: string;
  steps: IDoubtResponseStepClient[];
  keyConcepts: string[];
  prerequisiteConcepts: string[];
  examples: string[];
  commonMistakes: string[];
  verificationNotes: string;
  confidence: number;
  sourceReferences: IDoubtSourceReferenceClient[];
  responseType: string;
  intentCategory: string;
  explanationLevel: string;
  language: string;
  generatedAt: string;
}

export interface IStudentDoubtClient {
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
  response?: IDoubtResponseClient;
  followups?: IDoubtFollowupClient[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface IDoubtContextClientDTO {
  subject: string;
  topicId: string;
  conceptId?: string;
  difficulty: string;
  masteryScore?: number;
  riskLevel?: string;
  prerequisiteConceptIds?: string[];
}

export interface IDoubtSolutionClientDTO {
  category?: string;
  summary?: string;
  solutionText?: string;
  explanation?: string;
  prerequisites?: string[];
  prerequisiteChain?: string[];
  steps?: any[];
  followUpQuestions?: string[];
}
