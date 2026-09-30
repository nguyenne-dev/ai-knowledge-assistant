import { knowledgeLoader } from './knowledge.loader.js';
import { EmbeddingFactory } from '../providers/embeddings/embedding.factory.js';
import { IEmbeddingProvider } from '../providers/embeddings/embedding.provider.interface.js';
import { vectorRepository } from '../repositories/vector.repository.js';
import { config } from '../config/index.js';

export interface IngestionResult {
  status: 'success' | 'error';
  filesProcessed: number;
  chunksIndexed: number;
  collection: string;
  timestamp: string;
  error?: string;
}

export class IngestionService {
  private get embeddingProvider(): IEmbeddingProvider {
    return EmbeddingFactory.getProvider();
  }

  async runPipeline(): Promise<IngestionResult> {
    console.log('🏁 [IngestionService] Starting Knowledge Ingestion Pipeline...');

    try {
      // 1. Load documents and generate chunks
      const { chunks, filesCount } = await knowledgeLoader.loadDocuments();

      if (chunks.length === 0) {
        throw new Error('No chunks found to ingest.');
      }

      // 2. Generate vector embeddings for all chunks
      console.log(`🧠 [IngestionService] Generating embeddings for ${chunks.length} chunks via Gemini...`);
      const textsToEmbed = chunks.map((c) => c.content);
      const vectors = await this.embeddingProvider.embedBatch(textsToEmbed);

      // 3. Initialize collection in Qdrant
      const dimension = this.embeddingProvider.getDimension();
      await vectorRepository.initCollection(dimension);

      // 4. Upsert vectors & metadata to Qdrant
      await vectorRepository.upsertChunks(chunks, vectors);

      console.log('🎉 [IngestionService] Ingestion pipeline completed successfully!');

      return {
        status: 'success',
        filesProcessed: filesCount,
        chunksIndexed: chunks.length,
        collection: config.qdrant.collection,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('❌ [IngestionService] Pipeline failed:', error?.message || error);
      return {
        status: 'error',
        filesProcessed: 0,
        chunksIndexed: 0,
        collection: config.qdrant.collection,
        timestamp: new Date().toISOString(),
        error: error?.message || 'Unknown error',
      };
    }
  }
}

export const ingestionService = new IngestionService();
