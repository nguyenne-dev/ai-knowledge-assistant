export interface IEmbeddingProvider {
  /**
   * Generates a vector embedding for a single text.
   */
  embedText(text: string): Promise<number[]>;

  /**
   * Generates vector embeddings for a batch of texts.
   */
  embedBatch(texts: string[]): Promise<number[][]>;

  /**
   * Returns the vector dimension produced by this provider (e.g. 3072).
   */
  getDimension(): number;
}
