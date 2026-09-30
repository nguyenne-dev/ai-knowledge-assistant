import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service.js';

export const handleChatMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message, conversationId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Field "message" is required and must be a non-empty string.',
      });
      return;
    }

    const result = await chatService.handleUserMessage(message, conversationId);

    res.status(200).json({
      answer: result.answer,
      sources: result.sources,
      conversationId: result.conversationId,
    });
  } catch (error) {
    next(error);
  }
};
