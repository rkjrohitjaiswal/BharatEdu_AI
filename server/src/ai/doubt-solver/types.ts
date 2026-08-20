import { DoubtDifficulty, DoubtSessionStatus } from '../../models/doubt-session.model.js';
import { DoubtGeneratedBy, DoubtRole, ExplanationLevel } from '../../models/doubt-message.model.js';

export type DoubtCategory =
  | 'concept_explanation'
  | 'prerequisite_gap'
  | 'worked_example'
  | 'formula_question'
  | 'calculation'
  | 'coding_question'
  | 'mistake_analysis'
  | 'exam_question'
  | 'revision_question'
  | 'career_application'
  | 'resource_request'
  | 'general_academic';

export interface IDoubtContextDTO {
  studentId: string;
  sessionId: string;
  conceptId?: string;
  topicId?: string;
  masteryScore: number;
  confidenceScore: number;
  riskLevel: string;
  examUrgency: boolean;
  learningPathStage: number;
  prerequisiteConceptIds: string[];
  learningGapIds: string[];
  revisionDue: boolean;
  recommendedDifficulty: DoubtDifficulty;
  capturedAt: string;
}

export interface IDoubtMessageDTO {
  id: string;
  messageId: string;
  sessionId: string;
  studentId: string;
  role: DoubtRole;
  content: string;
  explanationLevel: ExplanationLevel;
  referencedConceptIds: string[];
  referencedTopicIds: string[];
  sourceReferences: string[];
  generatedBy: DoubtGeneratedBy;
  isHelpful?: boolean;
  createdAt: string;
}

export interface IDoubtSessionDTO {
  id: string;
  sessionId: string;
  studentId: string;
  subject: string;
  classLevel: string;
  board: string;
  topicId?: string;
  conceptId?: string;
  learningPathId?: string;
  materialId?: string;
  examId?: string;
  title: string;
  status: DoubtSessionStatus;
  difficulty: DoubtDifficulty;
  language: string;
  messages?: IDoubtMessageDTO[];
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface ISolutionStep {
  stepNumber: number;
  title: string;
  description: string;
  formulaOrCode?: string;
}

export interface IDoubtSolutionDTO {
  sessionId: string;
  category: DoubtCategory;
  explanationLevel: ExplanationLevel;
  summary: string;
  steps: ISolutionStep[];
  prerequisiteChain: string[];
  followUpQuestions: string[];
  sourceReferences: string[];
  recommendedPracticeId?: string;
  recommendedRevisionId?: string;
  generatedBy: DoubtGeneratedBy;
}

export interface ISocraticHintDTO {
  sessionId: string;
  hintLevel: number; // 0, 1, 2, 3
  guidingQuestion: string;
  hintContent: string;
  nextStepPrompt: string;
}

export interface IDoubtSummaryData {
  studentId: string;
  totalSessionsCount: number;
  activeSessionsCount: number;
  resolvedSessionsCount: number;
  topConfusedTopic?: string;
  aiExplanation: string;
  evaluatedAt: string;
}
