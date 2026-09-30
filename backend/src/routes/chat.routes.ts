import { Router } from 'express';
import { handleChatMessage } from '../controllers/chat.controller.js';
import { chatRateLimiter } from '../middlewares/rate-limit.middleware.js';

const router = Router();

// POST /api/chat
router.post('/chat', chatRateLimiter, handleChatMessage);

export default router;
