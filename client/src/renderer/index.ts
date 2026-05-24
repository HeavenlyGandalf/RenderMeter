import Handlebars from 'handlebars';
import Mustache from 'mustache';
import type { TemplateEngine, RenderResult } from '../types';
import { SERVER_ENGINES } from '../constants';

// Единые тестовые данные для клиентских движков
const sampleData = {
  title: 'RenderMeter',
  items: ['Apple', 'Banana', 'Cherry'],
  user: { name: 'Developer', active: true },
};

// handlebars / mustache — рендер прямо в браузере
function renderClientSide(engine: TemplateEngine, template: string): RenderResult {
  const start = performance.now();
  let html: string;

  switch (engine) {
    case 'handlebars':
      html = Handlebars.compile(template)(sampleData);
      break;
    case 'mustache':
      html = Mustache.render(template, sampleData);
      break;
    default:
      throw new Error(`Not a client-side engine: ${engine}`);
  }

  return {
    html,
    executionTimeMs: Math.round((performance.now() - start) * 1000) / 1000,
  };
}

// pug / ejs — рендер на сервере (Node.js only)
async function renderServerSide(engine: TemplateEngine, template: string): Promise<RenderResult> {
  const res = await fetch('/api/render', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ engine, template }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Server render failed' }));
    throw new Error(err.error);
  }

  return res.json();
}

export async function renderTemplate(
  engine: TemplateEngine,
  template: string
): Promise<RenderResult> {
  if (SERVER_ENGINES.includes(engine)) {
    return renderServerSide(engine, template);
  }
  return renderClientSide(engine, template);
}
