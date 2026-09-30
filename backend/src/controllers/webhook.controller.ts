import { Request, Response, NextFunction } from 'express';
import { facebookAdapter } from '../adapters/facebook.adapter.js';
import { zaloAdapter } from '../adapters/zalo.adapter.js';
import { chatService } from '../services/chat.service.js';

export class WebhookController {
  /**
   * Handles incoming Facebook Messenger webhook POST requests.
   */
  async handleFacebookWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Normalize payload
      const normalized = facebookAdapter.normalize(req.body);
      console.log(`💬 [Webhook:Facebook] Received message from user: ${normalized.userId}`);

      // 2. Pass into Core Chat & RAG Service
      const conversationId = `facebook-${normalized.userId}`;
      const chatResult = await chatService.handleUserMessage(normalized.message, conversationId);

      // 3. Convert back to Facebook channel format
      const responsePayload = facebookAdapter.formatResponse(chatResult, normalized.userId);

      res.status(200).json(responsePayload);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming Zalo Official Account webhook POST requests.
   */
  async handleZaloWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Normalize payload
      const normalized = zaloAdapter.normalize(req.body);
      console.log(`💬 [Webhook:Zalo] Received message from user: ${normalized.userId}`);

      // 2. Pass into Core Chat & RAG Service
      const conversationId = `zalo-${normalized.userId}`;
      const chatResult = await chatService.handleUserMessage(normalized.message, conversationId);

      // 3. Convert back to Zalo channel format
      const responsePayload = zaloAdapter.formatResponse(chatResult, normalized.userId);

      res.status(200).json(responsePayload);
    } catch (error) {
      next(error);
    }
  }
}

export const webhookController = new WebhookController();
