import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { chatService } from './chat.service.js';
import { LLMFactory } from '../providers/llm/llm.factory.js';
import { EmbeddingFactory } from '../providers/embeddings/embedding.factory.js';
import { MockProvider } from '../providers/llm/mock.provider.js';
import { MockEmbeddingProvider } from '../providers/embeddings/mock.embedding.provider.js';

describe('ChatService Test Suite', () => {
  it('should reject empty message', async () => {
    await assert.rejects(
      async () => {
        await chatService.handleUserMessage('   ');
      },
      /Message cannot be empty/
    );
  });

  it('should process user message and return structured response with conversationId', async () => {
    // Override providers with mocks for offline deterministic testing
    (LLMFactory as any).instance = new MockProvider();
    EmbeddingFactory.setProvider(new MockEmbeddingProvider());

    const result = await chatService.handleUserMessage(
      'Áo khoác Tech A01 giá bao nhiêu?',
      'conv-unit-test'
    );

    assert.ok(result.answer, 'Answer must not be empty');
    assert.equal(typeof result.answer, 'string');
    assert.equal(result.conversationId, 'conv-unit-test');
    assert.ok(Array.isArray(result.sources), 'Sources must be an array');
  });
});
