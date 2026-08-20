import { MaterialDifficulty, MaterialGeneratedBy, MaterialStatus, MaterialType } from '../../models/study-material.model.js';
import { FlashcardDifficulty, FlashcardStatus } from '../../models/study-flashcard.model.js';

export interface IStudyMaterialSectionDTO {
  title: string;
  content: string;
  bullets?: string[];
  examples?: string[];
  keyTerms?: string[];
  order: number;
}

export interface IStudyFlashcardDTO {
  id: string;
  materialId: string;
  studentId: string;
  question: string;
  answer: string;
  explanation: string;
  conceptId?: string;
  topicId?: string;
  difficulty: FlashcardDifficulty;
  order: number;
  status: FlashcardStatus;
}

export interface IStudyMaterialDTO {
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
  sections: IStudyMaterialSectionDTO[];
  sourceReferences: string[];
  generatedBy: MaterialGeneratedBy;
  status: MaterialStatus;
  flashcards?: IStudyFlashcardDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface IStudyMaterialSummaryData {
  studentId: string;
  totalMaterialsCount: number;
  todayMaterialsCount: number;
  archivedMaterialsCount: number;
  topMaterial?: IStudyMaterialDTO;
  aiExplanation: string;
  evaluatedAt: string;
}
