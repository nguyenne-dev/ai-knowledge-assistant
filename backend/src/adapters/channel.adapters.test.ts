import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { facebookAdapter } from './facebook.adapter.js';
import { zaloAdapter } from './zalo.adapter.js';

describe('Channel Adapters Test Suite', () => {
  describe('FacebookAdapter', () => {
    it('should successfully normalize a valid Facebook payload', () => {
      const payload = {
        senderId: 'fb-user-123',
        message: 'Áo khoác A01 còn size L không?',
      };

      const normalized = facebookAdapter.normalize(payload);

      assert.equal(normalized.channel, 'facebook');
      assert.equal(normalized.userId, 'fb-user-123');
      assert.equal(normalized.message, 'Áo khoác A01 còn size L không?');
      assert.ok(normalized.timestamp);
    });

    it('should throw an error if senderId is missing', () => {
      assert.throws(
        () => facebookAdapter.normalize({ message: 'Hello' }),
        /senderId/
      );
    });

    it('should throw an error if message is empty', () => {
      assert.throws(
        () => facebookAdapter.normalize({ senderId: 'fb-123', message: '   ' }),
        /message/
      );
    });

    it('should format a valid Facebook reply', () => {
      const chatResult = {
        answer: 'Sản phẩm hiện còn đủ size ạ.',
        sources: [{ source: 'products.md', section: 'Áo khoác Tech A01' }],
        conversationId: 'fb-conv-1',
      };

      const response = facebookAdapter.formatResponse(chatResult, 'fb-user-123');

      assert.equal(response.channel, 'facebook');
      assert.equal(response.recipient.id, 'fb-user-123');
      assert.equal(response.message.text, 'Sản phẩm hiện còn đủ size ạ.');
      assert.equal(response.sources?.length, 1);
    });
  });

  describe('ZaloAdapter', () => {
    it('should successfully normalize a valid Zalo OA payload', () => {
      const payload = {
        senderId: 'zalo-user-456',
        message: 'Chính sách bảo hành như thế nào?',
        appId: 'oa-789',
      };

      const normalized = zaloAdapter.normalize(payload);

      assert.equal(normalized.channel, 'zalo');
      assert.equal(normalized.userId, 'zalo-user-456');
      assert.equal(normalized.message, 'Chính sách bảo hành như thế nào?');
      assert.equal(normalized.metadata?.appId, 'oa-789');
    });

    it('should throw an error if senderId is missing', () => {
      assert.throws(
        () => zaloAdapter.normalize({ message: 'Hello' }),
        /senderId/
      );
    });

    it('should format a valid Zalo reply', () => {
      const chatResult = {
        answer: 'Bảo hành 30 ngày đổi mới nếu có lỗi nhà sản xuất.',
        sources: [],
        conversationId: 'zalo-conv-1',
      };

      const response = zaloAdapter.formatResponse(chatResult, 'zalo-user-456');

      assert.equal(response.channel, 'zalo');
      assert.equal(response.recipient.user_id, 'zalo-user-456');
      assert.equal(response.message.text, 'Bảo hành 30 ngày đổi mới nếu có lỗi nhà sản xuất.');
    });
  });
});
