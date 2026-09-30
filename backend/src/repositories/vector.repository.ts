import { QdrantClient } from '@qdrant/js-client-rest';
import crypto from 'crypto';
import { config } from '../config/index.js';

export interface KnowledgeChunk {
  id?: string;
  content: string;
  source: string;
  section: string;
  chunkIndex: number;
}

export interface ScoredChunk extends KnowledgeChunk {
  score: number;
}

export class VectorRepository {
  private client: QdrantClient;
  private collectionName: string;

  constructor() {
    this.collectionName = config.qdrant.collection || 'tech_fashion_knowledge';
    this.client = new QdrantClient({
      url: config.qdrant.url,
      apiKey: config.qdrant.apiKey || undefined,
    });
  }

  /**
   * Ensures the target collection exists with the correct cosine distance and vector size.
   */
  async initCollection(dimension = 3072): Promise<void> {
    try {
      const response = await this.client.getCollections();
      const exists = response.collections.some((c) => c.name === this.collectionName);

      if (!exists) {
        console.log(`📦 [VectorRepository] Creating collection '${this.collectionName}' (dim: ${dimension}, metric: Cosine)...`);
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: dimension,
            distance: 'Cosine',
          },
        });
        console.log(`✅ [VectorRepository] Collection '${this.collectionName}' created successfully.`);
      } else {
        console.log(`ℹ️ [VectorRepository] Collection '${this.collectionName}' already exists.`);
      }
    } catch (error: any) {
      console.error('[VectorRepository.initCollection Error]:', error?.message || error);
      throw error;
    }
  }

  /**
   * Upserts knowledge chunks with their vector embeddings into Qdrant.
   */
  async upsertChunks(chunks: KnowledgeChunk[], vectors: number[][]): Promise<void> {
    if (chunks.length !== vectors.length) {
      throw new Error('Chunks count and vectors count must match.');
    }

    const points = chunks.map((chunk, index) => {
      // Create a deterministic UUID based on source + section + chunkIndex
      const hash = crypto.createHash('md5').update(`${chunk.source}:${chunk.section}:${chunk.chunkIndex}`).digest('hex');
      const pointId = [
        hash.substring(0, 8),
        hash.substring(8, 12),
        hash.substring(12, 16),
        hash.substring(16, 20),
        hash.substring(20, 32),
      ].join('-');

      return {
        id: pointId,
        vector: vectors[index],
        payload: {
          content: chunk.content,
          source: chunk.source,
          section: chunk.section,
          chunkIndex: chunk.chunkIndex,
        },
      };
    });

    console.log(`🚀 [VectorRepository] Upserting ${points.length} points to '${this.collectionName}'...`);
    await this.client.upsert(this.collectionName, {
      wait: true,
      points,
    });
    console.log(`✅ [VectorRepository] Upserted ${points.length} points successfully.`);
  }

  /**
   * Performs semantic similarity search against the collection.
   */
  async search(queryVector: number[], limit = 3, scoreThreshold = 0.5): Promise<ScoredChunk[]> {
    try {
      const results = await this.client.search(this.collectionName, {
        vector: queryVector,
        limit,
        score_threshold: scoreThreshold,
        with_payload: true,
      });

      return results.map((item) => ({
        id: String(item.id),
        score: item.score,
        content: String(item.payload?.content || ''),
        source: String(item.payload?.source || ''),
        section: String(item.payload?.section || ''),
        chunkIndex: Number(item.payload?.chunkIndex || 0),
      }));
    } catch (error: any) {
      console.error('[VectorRepository.search Error]:', error?.message || error);
      throw error;
    }
  }

  /**
   * Retrieves collection info and count.
   */
  async getStats(): Promise<any> {
    try {
      const info = await this.client.getCollection(this.collectionName);
      return {
        collection: this.collectionName,
        pointsCount: info.points_count ?? info.indexed_vectors_count ?? 0,
        status: info.status,
      };
    } catch (error: any) {
      return {
        collection: this.collectionName,
        pointsCount: 0,
        status: 'not_found_or_error',
        error: error.message,
      };
    }
  }
}

export const vectorRepository = new VectorRepository();
