import { Request, Response } from 'express';
import { saveResult, getRecentResults } from '../services/results.service';

export async function createResult(req: Request, res: Response): Promise<void> {
  const { templateEngine, executionTimeMs, templateSize } = req.body as {
    templateEngine?: string;
    executionTimeMs?: number;
    templateSize?: number;
  };

  if (!templateEngine || executionTimeMs == null || templateSize == null) {
    res.status(400).json({ error: 'templateEngine, executionTimeMs and templateSize are required' });
    return;
  }

  const result = await saveResult({ templateEngine, executionTimeMs, templateSize });
  res.status(201).json(result);
}

export async function listResults(_req: Request, res: Response): Promise<void> {
  const results = await getRecentResults();
  res.json(results);
}
