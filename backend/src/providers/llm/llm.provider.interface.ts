export interface LLMGenerateOptions {
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface ILLMProvider {
  /**
   * Generates a textual response given a user prompt and optional options.
   */
  generateResponse(prompt: string, options?: LLMGenerateOptions): Promise<string>;
}
