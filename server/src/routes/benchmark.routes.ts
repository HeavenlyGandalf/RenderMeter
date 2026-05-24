import { Router } from 'express';
import {
  startBenchmark,
  getBenchmarkHistory,
  getTemplates,
  getScenarios,
} from '../controllers/benchmark.controller';

const router = Router();

router.post('/', startBenchmark);
router.get('/history', getBenchmarkHistory);
router.get('/templates', getTemplates);
router.get('/scenarios', getScenarios);

export default router;
