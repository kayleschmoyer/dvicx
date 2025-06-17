import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err);
  const status = err.status || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ error: message, status });
}
