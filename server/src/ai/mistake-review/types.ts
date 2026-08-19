/**
 * TypeScript Interfaces for AI Mistake Review & Explanation Engine
 */

export interface RAGCitation {
  title: string;
  publisher?: string;
  sourceUrl?: string;
  page?: number;
  section?: string;
}

export interface MistakeReviewItem {
  id: string;
  attemptId: string;
  studentId: string;
  questionId: string;
  questionText: string;
  options?: string[];
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  subjectId?: string;
  subjectName: string;
  topicId?: string;
  topicName: string;
  difficulty: string;
  explanation: string;
  keyConcept: string;
  misconception?: string;
  recommendedAction: string;
  sources: RAGCitation[];
  timestamp: Date;
}

export interface MistakeExplanationResult {
  explanation: string;
  keyConcept: string;
  misconception?: string;
  recommendedAction: string;
  sources: RAGCitation[];
  aiEnriched: boolean;
}
