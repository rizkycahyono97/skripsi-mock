import { Request, Response, NextFunction } from 'express';
import { logStorage, logger } from '../utils/logger';
import crypto from 'crypto';

export const traceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = crypto.randomBytes(4).toString('hex');

  logStorage.run({ requestId }, () => {
    const startTime = Date.now();
    logger.info(`=== ${req.method} ${req.originalUrl} - Incoming Request ===`);

    res.on('=== finish ===', () => {
      const duration = Date.now() - startTime;
      logger.info(
        `${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`
      );
    });

    next();
  });
};
