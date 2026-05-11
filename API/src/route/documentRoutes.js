import express from 'express';
import * as docController from '../controller/documentController.js';
import { apiKeyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sign', apiKeyAuth, docController.signDocument);

export default router;
