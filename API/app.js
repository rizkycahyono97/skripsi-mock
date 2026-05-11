import 'dotenv/config';
import express from 'express';
import { corsMiddleware } from './src/middleware/corsMiddleware.js';
import { apiKeyAuth } from './src/middleware/authMiddleware.js';
import documentRoutes from './src/route/documentRoutes.js';

const app = express();

app.use(corsMiddleware);

app.use(express.json());

app.use('/api/v1', documentRoutes);

app.use((err, req, res, next) => {
  if (err.message == 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS Error: Access denied' });
  }
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
