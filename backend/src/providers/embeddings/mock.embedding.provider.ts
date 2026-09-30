import crypto from 'crypto';
import { IEmbeddingProvider } from './embedding.provider.interface.js';

export class MockEmbeddingProvider implements IEmbeddingProvider {
  private dimension = 3072;

  async embedText(text: string): Promise<number[]> {
    // Generate a deterministic 3072-dim pseudo-vector from text hash
    const vector = new Array(this.dimension).fill(0);
    const hash = crypto.createHash('sha256').update(text.toLowerCase()).digest();

    for (let i = 0; i < this.dimension; i++) {
      const byte = hash[i % hash.length];
      vector[i] = ((byte / 255) * 2 - 1) * 0.1;
    }

    // Normalize vector (L2 norm)
    let sumSq = 0;
    for (let i = 0; i < this.dimension; i++) {
      sumSq += vector[i] * vector[i];
    }
    const norm = Math.sqrt(sumSq) || 1;
    for (let i = 0; i < this.dimension; i++) {
      vector[i] /= norm;
    }

    return vector;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const results: number[][] = [];
    for (const text of texts) {
      results.push(await this.embedText(text));
    }
    return results;
  }

  getDimension(): number {
    return this.dimension;
  }
}
