import { RetrievedSource } from './document.types.js';
import { embeddingProvider } from './embedding.provider.js';
import { dataRepository } from '../repositories/data.repository.js';

export interface RetrieverOptions {
  topK?: number;
  minScore?: number;
  subject?: string;
  language?: 'english' | 'hindi' | 'gujarati';
  classLevel?: number;
}

export class VectorRetriever {
  public static calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public static async retrieveRelevantSources(
    query: string,
    options: RetrieverOptions = {}
  ): Promise<RetrievedSource[]> {
    const topK = options.topK || Number(process.env.RAG_TOP_K) || 3;
    const minScore = options.minScore || Number(process.env.RAG_MIN_RELEVANCE_SCORE) || 0.25;

    // 1. Generate Query Vector
    const queryEmbedding = await embeddingProvider.generateEmbedding(query);

    // 2. Fetch Active Chunks from Repository
    const chunks = await dataRepository.getEducationalChunksFilter({
      subject: options.subject,
      language: options.language,
    });

    if (!chunks || chunks.length === 0) {
      console.log(`🔍 [VectorRetriever] No educational chunks found matching subject=${options.subject || 'all'}, language=${options.language || 'all'}`);
      return [];
    }

    // 3. Score Chunks via Cosine Similarity
    const scored = chunks.map((chunk) => {
      let score = 0;
      if (chunk.embedding && chunk.embedding.length > 0) {
        score = this.calculateCosineSimilarity(queryEmbedding, chunk.embedding);
      } else {
        // Simple term overlap backup if embedding is missing
        score = this.calculateKeywordOverlap(query, chunk.content);
      }

      return {
        chunk,
        score: Math.round(score * 100) / 100,
      };
    });

    // 4. Sort and Filter by minScore Threshold
    const filtered = scored
      .filter((item) => item.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    console.log(`🔍 [VectorRetriever] Query "${query.substring(0, 30)}..." -> Found ${filtered.length} grounded sources (Top score: ${filtered[0]?.score || 0})`);

    // 5. Format RetrievedSource objects
    return filtered.map((item) => {
      const doc = item.chunk.documentId && typeof item.chunk.documentId === 'object' ? item.chunk.documentId : {};
      return {
        documentId: String(doc._id || doc.id || item.chunk.documentId || ''),
        title: item.chunk.title || doc.title || 'Verified Educational Material',
        sourceUrl: doc.sourceUrl || 'https://ncert.nic.in',
        publisher: doc.publisher || 'NCERT',
        page: item.chunk.page,
        section: item.chunk.section || 'Core Curriculum',
        contentSnippet: item.chunk.content,
        relevanceScore: item.score,
      };
    });
  }

  private static calculateKeywordOverlap(query: string, text: string): number {
    const qWords = new Set(query.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter((w) => w.length > 3));
    const tWords = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    if (qWords.size === 0 || tWords.length === 0) return 0;

    let hits = 0;
    qWords.forEach((qw) => {
      if (tWords.includes(qw)) hits++;
    });

    return hits / qWords.size;
  }
}
