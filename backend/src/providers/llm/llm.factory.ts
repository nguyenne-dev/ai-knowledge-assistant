import { ILLMProvider } from './llm.provider.interface.js';
import { GeminiProvider } from './gemini.provider.js';
import { MockProvider } from './mock.provider.js';
import { config } from '../../config/index.js';

export class LLMFactory {
  private static instance: ILLMProvider;

  public static getProvider(): ILLMProvider {
    if (!LLMFactory.instance) {
      const providerType = config.llmProvider.toLowerCase();

      switch (providerType) {
        case 'mock':
          console.log('🤖 [LLMFactory] Using Mock LLM Provider');
          LLMFactory.instance = new MockProvider();
          break;
        case 'gemini':
          console.log(`🤖 [LLMFactory] Using Gemini Provider (model: ${config.gemini.model})`);
          LLMFactory.instance = new GeminiProvider(config.gemini.apiKey, config.gemini.model);
          break;
        default:
          console.warn(`Unknown LLM_PROVIDER '${providerType}', falling back to Gemini`);
          LLMFactory.instance = new GeminiProvider(config.gemini.apiKey, config.gemini.model);
          break;
      }
    }

    return LLMFactory.instance;
  }

  // Allows resetting for tests/runtime config updates
  public static resetProvider(): void {
    LLMFactory.instance = undefined as any;
  }
}
