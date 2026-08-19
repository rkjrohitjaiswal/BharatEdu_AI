export interface TutorSource {
  title: string;
  sourceUrl?: string;
  documentId?: string;
  page?: number;
  section?: string;
  publisher?: string;
  contentSnippet?: string;
  relevanceScore?: number;
}

export interface TutorChatMessageContext {
  role: 'student' | 'tutor';
  content: string;
}

export interface TutorContext {
  studentId: string;
  studentName: string;
  classLevel: number;
  preferredLanguage: 'english' | 'hindi' | 'gujarati';
  subjectName?: string;
  topicName?: string;
  learningGoals?: string[];
  strengths?: string[];
  weaknesses?: string[];
  activeGaps?: string[];
  recentMessages?: TutorChatMessageContext[];
  retrievedSources?: TutorSource[];
}

export interface TutorRequest {
  conversationId: string;
  studentMessage: string;
  language?: 'english' | 'hindi' | 'gujarati';
  subjectId?: string;
  topicId?: string;
  context: TutorContext;
}

export interface TutorResponse {
  answer: string;
  explanation?: string;
  sources: TutorSource[];
  suggestedNextQuestions?: string[];
  detectedGapCandidate?: string;
  metadata?: Record<string, any>;
}

export interface TutorProvider {
  name: string;
  generateResponse(request: TutorRequest): Promise<TutorResponse>;
}
