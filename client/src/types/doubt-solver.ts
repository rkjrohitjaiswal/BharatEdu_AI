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

export type ExplanationLevel = 'simple' | 'standard' | 'detailed' | 'exam' | 'coding';
export type DoubtDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface IDoubtContextClientDTO {
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

export interface IDoubtMessageClientDTO {
  id: string;
  messageId: string;
  sessionId: string;
  studentId: string;
  role: 'student' | 'tutor';
  content: string;
  explanationLevel: ExplanationLevel;
  referencedConceptIds: string[];
  referencedTopicIds: string[];
  sourceReferences: string[];
  generatedBy: 'ai' | 'deterministic' | 'hybrid';
  isHelpful?: boolean;
  createdAt: string;
}

export interface IDoubtSessionClientDTO {
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
  status: 'active' | 'resolved' | 'archived';
  difficulty: DoubtDifficulty;
  language: string;
  messages?: IDoubtMessageClientDTO[];
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface ISolutionStepClient {
  stepNumber: number;
  title: string;
  description: string;
  formulaOrCode?: string;
}

export interface IDoubtSolutionClientDTO {
  sessionId: string;
  category: DoubtCategory;
  explanationLevel: ExplanationLevel;
  summary: string;
  steps: ISolutionStepClient[];
  prerequisiteChain: string[];
  followUpQuestions: string[];
  sourceReferences: string[];
  generatedBy: 'ai' | 'deterministic' | 'hybrid';
}

export interface ISocraticHintClientDTO {
  sessionId: string;
  hintLevel: number;
  guidingQuestion: string;
  hintContent: string;
  nextStepPrompt: string;
}
