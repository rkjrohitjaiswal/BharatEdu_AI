import crypto from 'crypto';
import { embeddingProvider } from '../embedding.provider.js';
import { dataRepository } from '../../repositories/data.repository.js';

export interface IngestDocumentPayload {
  title: string;
  description?: string;
  publisher: string;
  sourceUrl?: string;
  documentType: 'textbook' | 'chapter' | 'article' | 'educational_resource';
  language: 'english' | 'hindi' | 'gujarati';
  subject: string;
  classLevels: number[];
  license?: string;
  attribution?: string;
  content: string;
  sections?: { sectionTitle?: string; page?: number; text: string }[];
}

export class DocumentIngester {
  public static computeHash(text: string): string {
    return crypto.createHash('sha256').update(text.trim()).digest('hex');
  }

  public static async ingestDocument(payload: IngestDocumentPayload): Promise<{
    document: any;
    chunkCount: number;
    skipped: boolean;
  }> {
    const fullContent = payload.content || (payload.sections || []).map((s) => s.text).join('\n\n');
    const docHash = this.computeHash(fullContent);

    // 1. Check for duplicate document ingestion using contentHash
    const existingDoc = await dataRepository.getEducationalDocumentByHash(docHash);
    if (existingDoc) {
      console.log(`ℹ️ [DocumentIngester] Document "${payload.title}" (hash: ${docHash.slice(0, 8)}) already exists. Skipping.`);
      const existingChunks = await dataRepository.getEducationalChunksByDocumentId(existingDoc._id || existingDoc.id);
      return {
        document: existingDoc,
        chunkCount: existingChunks.length,
        skipped: true,
      };
    }

    // 2. Save Document Record
    const createdDoc = await dataRepository.createEducationalDocument({
      title: payload.title,
      description: payload.description || '',
      publisher: payload.publisher || 'NCERT',
      sourceUrl: payload.sourceUrl || '',
      documentType: payload.documentType || 'educational_resource',
      language: payload.language || 'english',
      subject: payload.subject,
      classLevels: payload.classLevels || [8],
      license: payload.license || 'Public Educational Resource',
      attribution: payload.attribution || 'NCERT',
      version: '1.0',
      contentHash: docHash,
      status: 'active',
    });

    const docId = createdDoc._id || createdDoc.id;

    // 3. Chunk Document
    const rawChunks: { text: string; section?: string; page?: number }[] = [];

    if (payload.sections && payload.sections.length > 0) {
      payload.sections.forEach((sec) => {
        const subChunks = this.chunkText(sec.text, 600, 100);
        subChunks.forEach((sc) => {
          rawChunks.push({
            text: sc,
            section: sec.sectionTitle || '',
            page: sec.page,
          });
        });
      });
    } else {
      const subChunks = this.chunkText(fullContent, 600, 100);
      subChunks.forEach((sc) => {
        rawChunks.push({ text: sc });
      });
    }

    // 4. Generate Embeddings & Save Chunks
    let chunkIndex = 0;
    for (const item of rawChunks) {
      const chunkHash = this.computeHash(`${docId}_${chunkIndex}_${item.text}`);
      const embedding = await embeddingProvider.generateEmbedding(item.text);

      await dataRepository.createEducationalChunk({
        documentId: docId,
        chunkIndex,
        title: payload.title,
        section: item.section || 'General Section',
        page: item.page,
        content: item.text,
        subject: payload.subject,
        topic: payload.title,
        language: payload.language || 'english',
        embedding,
        contentHash: chunkHash,
      });

      chunkIndex++;
    }

    console.log(`✅ [DocumentIngester] Successfully ingested "${payload.title}" -> Created ${chunkIndex} chunks with embeddings.`);

    return {
      document: createdDoc,
      chunkCount: chunkIndex,
      skipped: false,
    };
  }

  private static chunkText(text: string, chunkSize: number = 600, overlap: number = 100): string[] {
    const words = text.trim().split(/\s+/);
    if (words.length === 0) return [];

    const chunks: string[] = [];
    let currentWords: string[] = [];
    let currentLength = 0;

    for (const word of words) {
      currentWords.push(word);
      currentLength += word.length + 1;

      if (currentLength >= chunkSize) {
        chunks.push(currentWords.join(' '));
        // Keep overlap
        const overlapWords: string[] = [];
        let overlapLen = 0;
        for (let i = currentWords.length - 1; i >= 0; i--) {
          const w = currentWords[i];
          if (overlapLen + w.length + 1 <= overlap) {
            overlapWords.unshift(w);
            overlapLen += w.length + 1;
          } else {
            break;
          }
        }
        currentWords = overlapWords;
        currentLength = overlapLen;
      }
    }

    if (currentWords.length > 0) {
      chunks.push(currentWords.join(' '));
    }

    return chunks;
  }
}
