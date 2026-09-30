import { GoogleGenerativeAI } from '@google/generative-ai';
import { IEmbeddingProvider } from './embedding.provider.interface.js';
import { config } from '../../config/index.js';

export class GeminiEmbeddingProvider implements IEmbeddingProvider {
  private client: GoogleGenerativeAI;
  private modelName = 'gemini-embedding-001';
  private dimension = 3072;

  constructor(apiKey?: string) {
    const key = apiKey || config.gemini.apiKey;
    if (!key) {
      console.warn('⚠️ [GeminiEmbeddingProvider] GEMINI_API_KEY is not set.');
    }
    this.client = new GoogleGenerativeAI(key || 'MISSING_KEY');
  }

  async embedText(text: string): Promise<number[]> {
    try {
      const model = this.client.getGenerativeModel({ model: this.modelName });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error: any) {
      console.error('[GeminiEmbeddingProvider Error]:', error?.message || error);
      throw new Error(`Embedding generation failed: ${error?.message || 'Unknown error'}`);
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const results: number[][] = [];
    for (const text of texts) {
      const vector = await this.embedText(text);
      results.push(vector);
      // Small pause between items to prevent hitting strict rate limits
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    return results;
  }

  getDimension(): number {
    return this.dimension;
  }
}
