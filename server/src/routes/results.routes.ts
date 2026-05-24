import { Router } from 'express';
import { createResult, listResults } from '../controllers/results.controller';

const router = Router();

router.post('/', createResult);
router.get('/', listResults);

export default router;
