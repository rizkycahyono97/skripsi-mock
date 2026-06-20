import { Request, Response, NextFunction } from 'express';

export const apiKeyAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const apiKey: string | undefined = req.header('X-API-Key');
  const validApiKey: string | undefined = process.env.APP_API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid API Key'
    });
  }
  next();
};
