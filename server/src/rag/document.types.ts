export interface EducationalDocument {
  documentId: string;
  title: string;
  publisher: string;
  sourceUrl?: string;
  subject: string;
  classLevel: number;
  language: 'english' | 'hindi' | 'gujarati';
  totalPages?: number;
}

export interface EducationalChunk {
  chunkId: string;
  documentId: string;
  content: string;
  page?: number;
  section?: string;
  embeddingId?: string;
}

export interface RetrievedSource {
  documentId: string;
  title: string;
  sourceUrl?: string;
  publisher: string;
  page?: number;
  section?: string;
  contentSnippet: string;
  relevanceScore: number;
}
