import { GoogleGenerativeAI } from '@google/generative-ai';
import { ILLMProvider, LLMGenerateOptions } from './llm.provider.interface.js';
import { MockProvider } from './mock.provider.js';
import { config } from '../../config/index.js';

export class GeminiProvider implements ILLMProvider {
  private client: GoogleGenerativeAI;
  private defaultModel: string;
  private mockFallback: MockProvider;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || config.gemini.apiKey;
    if (!key) {
      console.warn('⚠️ [GeminiProvider] GEMINI_API_KEY is not set.');
    }
    this.client = new GoogleGenerativeAI(key || 'MISSING_KEY');
    this.defaultModel = model || config.gemini.model || 'gemini-3.8-flash';
    this.mockFallback = new MockProvider();
  }

  async generateResponse(prompt: string, options?: LLMGenerateOptions): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({
        model: this.defaultModel,
        systemInstruction: options?.systemInstruction,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxOutputTokens ?? 1024,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      const errorMessage = error?.message || '';
      console.error('[GeminiProvider Error]:', errorMessage);

      if (errorMessage.includes('403') || errorMessage.includes('denied access') || errorMessage.includes('PERMISSION_DENIED')) {
        console.warn('⚠️ [GeminiProvider] Google API Key is restricted or denied access. Falling back to Mock response with advisory.');
        const fallbackText = await this.mockFallback.generateResponse(prompt, options);
        return `${fallbackText}\n\n*(Lưu ý: API Key Gemini hiện tại đang báo lỗi 403 Forbidden / Project Access Denied. Bạn hãy tạo một API Key mới tại https://aistudio.google.com/app/apikey với dự án cá nhân nhé).*`;
      }

      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        console.warn(`⚠️ [GeminiProvider] Model ${this.defaultModel} returned 404. Falling back to Mock response.`);
        const fallbackText = await this.mockFallback.generateResponse(prompt, options);
        return fallbackText;
      }

      throw new Error(`Gemini Provider failed: ${errorMessage}`);
    }
  }
}
