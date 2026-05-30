import express, { Router } from 'express';
import * as docController from '../controller/documentController.js';
import { apiKeyAuth } from '../middleware/authMiddleware.js';

const router: Router = express.Router();

router.post('/sign', apiKeyAuth, docController.signDocument);

export default router;
