import { Router } from 'express';
import { handlePrompt } from '../controllers/aiController.js';

const router = Router();

router.post('/prompt', handlePrompt);

export default router;
