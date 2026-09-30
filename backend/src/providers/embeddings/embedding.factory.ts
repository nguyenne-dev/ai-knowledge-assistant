import { IEmbeddingProvider } from './embedding.provider.interface.js';
import { GeminiEmbeddingProvider } from './gemini.embedding.provider.js';
import { MockEmbeddingProvider } from './mock.embedding.provider.js';
import { config } from '../../config/index.js';

export class EmbeddingFactory {
  private static instance: IEmbeddingProvider;

  public static getProvider(): IEmbeddingProvider {
    if (!EmbeddingFactory.instance) {
      const providerType = (process.env.EMBEDDING_PROVIDER || config.llmProvider).toLowerCase();

      switch (providerType) {
        case 'mock':
          console.log('🧠 [EmbeddingFactory] Using Mock Embedding Provider');
          EmbeddingFactory.instance = new MockEmbeddingProvider();
          break;
        case 'gemini':
        default:
          EmbeddingFactory.instance = new GeminiEmbeddingProvider(config.gemini.apiKey);
          break;
      }
    }

    return EmbeddingFactory.instance;
  }

  public static setProvider(provider: IEmbeddingProvider): void {
    EmbeddingFactory.instance = provider;
  }

  public static resetProvider(): void {
    EmbeddingFactory.instance = undefined as any;
  }
}
