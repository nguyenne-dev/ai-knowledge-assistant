import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import apiRoutes from './routes/index.js';
import webhookRoutes from './routes/webhook.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

export const createApp = (): Application => {
  const app = express();

  // Basic Middlewares
  app.use(
    cors({
      origin: '*', // Allow all during development & POC, can be configured via config.frontendUrl
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root welcome endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'AI Customer Support Chatbot API',
      status: 'online',
      version: '1.0.0',
      docs: '/api/health'
    });
  });

  // Mount API routes under /api
  app.use('/api', apiRoutes);

  // Mount Webhook routes under /webhooks
  app.use('/webhooks', webhookRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: 'error',
      statusCode: 404,
      message: 'Endpoint not found',
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
