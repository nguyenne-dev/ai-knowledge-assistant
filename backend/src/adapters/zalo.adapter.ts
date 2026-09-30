import {
  ZaloWebhookPayload,
  ZaloWebhookResponse,
  NormalizedMessage,
} from '../types/channel.types.js';
import { ChatResult } from '../services/chat.service.js';

export class ZaloAdapter {
  /**
   * Validates and normalizes incoming Zalo webhook payload into standard internal format.
   */
  normalize(payload: any): NormalizedMessage {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid Zalo payload: Body must be an object.');
    }

    const { senderId, message, appId } = payload as ZaloWebhookPayload;

    if (!senderId || typeof senderId !== 'string') {
      throw new Error('Invalid Zalo payload: "senderId" is required.');
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new Error('Invalid Zalo payload: "message" cannot be empty.');
    }

    return {
      channel: 'zalo',
      userId: senderId.trim(),
      message: message.trim(),
      timestamp: Date.now(),
      metadata: {
        appId: appId || 'default-zalo-oa',
      },
    };
  }

  /**
   * Formats internal ChatResult into Zalo Official Account message reply format.
   */
  formatResponse(result: ChatResult, userId: string): ZaloWebhookResponse {
    return {
      channel: 'zalo',
      recipient: {
        user_id: userId,
      },
      message: {
        text: result.answer,
      },
      sources: result.sources,
      timestamp: new Date().toISOString(),
    };
  }
}

export const zaloAdapter = new ZaloAdapter();
