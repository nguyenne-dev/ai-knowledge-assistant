import { EmbeddingFactory } from '../providers/embeddings/embedding.factory.js';
import { IEmbeddingProvider } from '../providers/embeddings/embedding.provider.interface.js';
import { vectorRepository, ScoredChunk } from '../repositories/vector.repository.js';
import { ChatSourceItem } from './chat.service.js';

export interface RAGRetrievalResult {
  contextText: string;
  sources: ChatSourceItem[];
  matchedChunks: ScoredChunk[];
}

export class RAGService {
  private get embeddingProvider(): IEmbeddingProvider {
    return EmbeddingFactory.getProvider();
  }

  /**
   * Retrieves relevant context from Qdrant Vector DB for a given user query.
   */
  async retrieveContext(
    query: string,
    limit = 3,
    scoreThreshold = 0.45
  ): Promise<RAGRetrievalResult> {
    try {
      console.log(`🔍 [RAGService] Generating query vector for: "${query}"...`);
      const queryVector = await this.embeddingProvider.embedText(query);

      console.log(`🔎 [RAGService] Searching Qdrant Cloud (limit: ${limit}, minScore: ${scoreThreshold})...`);
      const matchedChunks = await vectorRepository.search(queryVector, limit, scoreThreshold);

      if (matchedChunks.length === 0) {
        console.log('ℹ️ [RAGService] No relevant chunks found above similarity threshold.');
        return {
          contextText: '',
          sources: [],
          matchedChunks: [],
        };
      }

      console.log(`✅ [RAGService] Retrieved ${matchedChunks.length} relevant chunks:`);
      matchedChunks.forEach((c, idx) => {
        console.log(`   #${idx + 1} [Score: ${c.score.toFixed(4)}] ${c.source} -> ${c.section}`);
      });

      // Format context block for LLM prompt
      const contextBlocks = matchedChunks.map((chunk, idx) => {
        return `[Tài liệu ${idx + 1}: ${chunk.source} | Mục: ${chunk.section}]\n${chunk.content}`;
      });
      const contextText = contextBlocks.join('\n\n---\n\n');

      // Deduplicate sources for clean citation
      const uniqueSourcesMap = new Map<string, ChatSourceItem>();
      for (const chunk of matchedChunks) {
        const key = `${chunk.source}:${chunk.section}`;
        if (!uniqueSourcesMap.has(key)) {
          uniqueSourcesMap.set(key, {
            source: chunk.source,
            section: chunk.section,
          });
        }
      }

      return {
        contextText,
        sources: Array.from(uniqueSourcesMap.values()),
        matchedChunks,
      };
    } catch (error: any) {
      console.error('[RAGService Error]:', error?.message || error);
      // Fallback gracefully if search fails
      return {
        contextText: '',
        sources: [],
        matchedChunks: [],
      };
    }
  }
}

export const ragService = new RAGService();
