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

  try {
    const result = await saveResult({ templateEngine, executionTimeMs, templateSize });
    res.status(201).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save result';
    res.status(500).json({ error: message });
  }
}

export async function listResults(_req: Request, res: Response): Promise<void> {
  try {
    const results = await getRecentResults();
    res.json(results);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch results';
    res.status(500).json({ error: message });
  }
}
