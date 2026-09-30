import {
  FacebookWebhookPayload,
  FacebookWebhookResponse,
  NormalizedMessage,
} from '../types/channel.types.js';
import { ChatResult } from '../services/chat.service.js';

export class FacebookAdapter {
  /**
   * Validates and normalizes incoming Facebook webhook payload into standard internal format.
   */
  normalize(payload: any): NormalizedMessage {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid Facebook payload: Body must be an object.');
    }

    const { senderId, message } = payload as FacebookWebhookPayload;

    if (!senderId || typeof senderId !== 'string') {
      throw new Error('Invalid Facebook payload: "senderId" is required.');
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new Error('Invalid Facebook payload: "message" cannot be empty.');
    }

    return {
      channel: 'facebook',
      userId: senderId.trim(),
      message: message.trim(),
      timestamp: Date.now(),
      metadata: {
        rawSenderId: senderId,
      },
    };
  }

  /**
   * Formats internal ChatResult into Facebook Messenger API reply format.
   */
  formatResponse(result: ChatResult, userId: string): FacebookWebhookResponse {
    return {
      channel: 'facebook',
      recipient: {
        id: userId,
      },
      message: {
        text: result.answer,
      },
      sources: result.sources,
      timestamp: new Date().toISOString(),
    };
  }
}

export const facebookAdapter = new FacebookAdapter();
