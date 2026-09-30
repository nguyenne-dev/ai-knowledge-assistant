import { Router } from 'express';
import { triggerIngestion, getIngestionStatus } from '../controllers/ingestion.controller.js';
import { ingestRateLimiter } from '../middlewares/rate-limit.middleware.js';

const router = Router();

// POST /api/ingest - trigger ingestion
router.post('/ingest', ingestRateLimiter, triggerIngestion);

// GET /api/ingest/status - check collection statistics
router.get('/ingest/status', getIngestionStatus);

export default router;
