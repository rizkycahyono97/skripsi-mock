import 'dotenv/config';
import express, { Express, ErrorRequestHandler } from 'express';
import { corsMiddleware, errorHandler } from './src/middleware/corsMiddleware';
import documentRoutes from './src/route/documentRoutes';

const app: Express = express();

app.use(corsMiddleware);

app.use(express.json());

app.use('/api/v1', documentRoutes);

app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
