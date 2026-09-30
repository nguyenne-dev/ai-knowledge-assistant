import { Router } from 'express';
import healthRoutes from './health.routes.js';
import chatRoutes from './chat.routes.js';
import ingestionRoutes from './ingestion.routes.js';

const router = Router();

// Mount routes under /api
router.use('/', healthRoutes);
router.use('/', chatRoutes);
router.use('/', ingestionRoutes);

export default router;
