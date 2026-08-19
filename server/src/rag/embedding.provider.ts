import OpenAI from 'openai';

export interface EmbeddingProvider {
  name: string;
  mode: 'PRODUCTION_SEMANTIC' | 'DEVELOPMENT_FALLBACK_HASH';
  generateEmbedding(text: string): Promise<number[]>;
}

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  name = 'OpenAIEmbeddingProvider';
  mode: 'PRODUCTION_SEMANTIC' | 'DEVELOPMENT_FALLBACK_HASH' = 'DEVELOPMENT_FALLBACK_HASH';

  private getApiKey(): string | undefined {
    return process.env.AI_API_KEY;
  }

  private getModelName(): string {
    return process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const apiKey = this.getApiKey();

    if (!apiKey || apiKey.trim().length === 0) {
      this.mode = 'DEVELOPMENT_FALLBACK_HASH';
      // Development Fallback: Generate a deterministic 128-dimensional term vector for offline development mode
      return this.generateFallbackVector(text);
    }

    this.mode = 'PRODUCTION_SEMANTIC';
    const modelName = this.getModelName();
    const openai = new OpenAI({ apiKey });

    try {
      const response = await openai.embeddings.create({
        model: modelName,
        input: text.replace(/\n/g, ' '),
      });
      return response.data[0]?.embedding || this.generateFallbackVector(text);
    } catch (error: any) {
      console.warn(`⚠️ [OpenAIEmbeddingProvider] Error calling OpenAI Embeddings API: ${error.message}. Using development fallback vector.`);
      this.mode = 'DEVELOPMENT_FALLBACK_HASH';
      return this.generateFallbackVector(text);
    }
  }

  // Deterministic term-frequency hash vector generator for offline/dev environment
  private generateFallbackVector(text: string): number[] {
    const dim = 128;
    const vector = new Array(dim).fill(0);
    const cleaned = text.toLowerCase().replace(/[^\w\s]/g, '');
    const words = cleaned.split(/\s+/).filter(Boolean);

    if (words.length === 0) return vector;

    words.forEach((word) => {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = (hash << 5) - hash + word.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % dim;
      vector[index] += 1;
    });

    // L2 Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map((v) => v / magnitude) : vector;
  }
}

export const embeddingProvider = new OpenAIEmbeddingProvider();
