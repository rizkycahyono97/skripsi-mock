import 'dotenv/config';
import express, { Express, ErrorRequestHandler } from 'express';
import { corsMiddleware, errorHandler } from './src/middleware/corsMiddleware';
import documentRoutes from './src/route/documentRoutes';
import { traceMiddleware } from './src/middleware/traceMiddleware';
import { logger } from './src/utils/logger';

const app: Express = express();

app.use(corsMiddleware);

app.use(express.json());

app.use(traceMiddleware);

app.use('/api/v1', documentRoutes);

app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
