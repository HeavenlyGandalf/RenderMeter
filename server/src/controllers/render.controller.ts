import { Request, Response } from 'express';
import { renderTemplate } from '../services/render.service';

const SERVER_ENGINES = ['pug', 'ejs'];

export function renderHandler(req: Request, res: Response): void {
  const { engine, template, data } = req.body as {
    engine?: string;
    template?: string;
    data?: Record<string, unknown>;
  };

  if (!engine || !template) {
    res.status(400).json({ error: 'engine and template are required' });
    return;
  }

  if (!SERVER_ENGINES.includes(engine)) {
    res.status(400).json({ error: `Unsupported engine: ${engine}. Server renders: ${SERVER_ENGINES.join(', ')}` });
    return;
  }

  try {
    const result = renderTemplate(engine, template, data);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Render error';
    res.status(422).json({ error: message });
  }
}
