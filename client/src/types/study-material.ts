export type MaterialType =
  | 'summary'
  | 'detailed_notes'
  | 'quick_notes'
  | 'flashcards'
  | 'key_points'
  | 'examples'
  | 'formula_sheet'
  | 'revision_sheet'
  | 'practice_guide'
  | 'exam_notes';

export type MaterialDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type MaterialGeneratedBy = 'ai' | 'deterministic' | 'hybrid';
export type MaterialStatus = 'draft' | 'ready' | 'archived';

export interface IStudyMaterialSectionClientDTO {
  title: string;
  content: string;
  bullets?: string[];
  examples?: string[];
  keyTerms?: string[];
  order: number;
}

export interface IStudyFlashcardClientDTO {
  id: string;
  materialId: string;
  studentId: string;
  question: string;
  answer: string;
  explanation: string;
  conceptId?: string;
  topicId?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  status: 'active' | 'archived' | 'due' | 'mastered';
}

export interface IStudyMaterialClientDTO {
  id: string;
  materialId: string;
  studentId: string;
  title: string;
  subject: string;
  classLevel: string;
  board: string;
  topicIds: string[];
  conceptIds: string[];
  learningPathId?: string;
  stageId?: string;
  itemId?: string;
  materialType: MaterialType;
  difficulty: MaterialDifficulty;
  language: string;
  estimatedMinutes: number;
  content: string;
  sections: IStudyMaterialSectionClientDTO[];
  sourceReferences: string[];
  generatedBy: MaterialGeneratedBy;
  status: MaterialStatus;
  flashcards?: IStudyFlashcardClientDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface IStudyMaterialSummaryClientDTO {
  studentId: string;
  totalMaterialsCount: number;
  todayMaterialsCount: number;
  archivedMaterialsCount: number;
  topMaterial?: IStudyMaterialClientDTO;
  aiExplanation: string;
  evaluatedAt: string;
}
