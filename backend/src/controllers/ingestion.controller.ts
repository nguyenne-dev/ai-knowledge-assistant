import { Request, Response, NextFunction } from 'express';
import { ingestionService } from '../services/ingestion.service.js';
import { vectorRepository } from '../repositories/vector.repository.js';

export const triggerIngestion = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await ingestionService.runPipeline();

    if (result.status === 'success') {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    next(error);
  }
};

export const getIngestionStatus = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await vectorRepository.getStats();
    res.status(200).json({
      status: 'ok',
      ...stats,
    });
  } catch (error) {
    next(error);
  }
};
