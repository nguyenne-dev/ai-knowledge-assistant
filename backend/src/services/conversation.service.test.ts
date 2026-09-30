import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { conversationService } from './conversation.service.js';

describe('ConversationService Test Suite', () => {
  const testConvId = 'test-conv-999';

  beforeEach(() => {
    conversationService.clearSession(testConvId);
  });

  it('should save and retrieve user and assistant messages', () => {
    conversationService.addMessage(testConvId, 'user', 'Xin chào shop');
    conversationService.addMessage(testConvId, 'assistant', 'Chào bạn! Shop có thể giúp gì cho bạn?');

    const history = conversationService.getHistory(testConvId);
    assert.equal(history.length, 2);
    assert.equal(history[0].role, 'user');
    assert.equal(history[0].content, 'Xin chào shop');
    assert.equal(history[1].role, 'assistant');
    assert.equal(history[1].content, 'Chào bạn! Shop có thể giúp gì cho bạn?');
  });

  it('should format history properly for LLM prompt', () => {
    conversationService.addMessage(testConvId, 'user', 'Áo A01 giá sao?');
    conversationService.addMessage(testConvId, 'assistant', 'Giá 499.000đ.');

    const promptText = conversationService.formatHistoryForPrompt(testConvId);
    assert.ok(promptText.includes('Khách hàng: Áo A01 giá sao?'));
    assert.ok(promptText.includes('Trợ lý: Giá 499.000đ.'));
  });

  it('should enrich follow-up query containing pronouns with context subject', () => {
    conversationService.addMessage(testConvId, 'user', 'Áo khoác Tech A01 có những màu nào?');
    conversationService.addMessage(testConvId, 'assistant', 'Có màu Đen và Xám ạ.');

    const followUpQuery = 'Nó có size gì?';
    const enriched = conversationService.enrichQueryWithContext(followUpQuery, testConvId);

    assert.ok(
      enriched.includes('Áo khoác Tech A01'),
      `Enriched query should mention product subject, got: "${enriched}"`
    );
  });

  it('should limit session history to maximum allowed count', () => {
    for (let i = 0; i < 20; i++) {
      conversationService.addMessage(testConvId, 'user', `Message ${i}`);
    }

    const history = conversationService.getHistory(testConvId);
    assert.ok(history.length <= 8, `History count should not exceed 8, got ${history.length}`);
    assert.equal(history[history.length - 1].content, 'Message 19');
  });
});
