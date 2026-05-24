import { Router } from 'express';
import { renderHandler } from '../controllers/render.controller';

const router = Router();

router.post('/', renderHandler);

export default router;
