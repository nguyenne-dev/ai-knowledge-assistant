import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller.js';

const router = Router();

// POST /webhooks/facebook
router.post('/facebook', (req, res, next) => webhookController.handleFacebookWebhook(req, res, next));

// POST /webhooks/zalo
router.post('/zalo', (req, res, next) => webhookController.handleZaloWebhook(req, res, next));

export default router;
