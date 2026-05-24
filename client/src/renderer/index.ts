import Handlebars from 'handlebars';
import Mustache from 'mustache';
import type { TemplateEngine, RenderResult } from '../types';

// Единые тестовые данные для всех движков
const sampleData = {
  title: 'RenderMeter',
  items: ['Apple', 'Banana', 'Cherry'],
  user: { name: 'Developer', active: true },
};

export function renderTemplate(
  engine: TemplateEngine,
  template: string,
  data: Record<string, unknown> = sampleData
): RenderResult {
  const start = performance.now();
  let html: string;

  switch (engine) {
    case 'handlebars':
      html = Handlebars.compile(template)(data);
      break;

    case 'mustache':
      html = Mustache.render(template, data);
      break;

    default:
      throw new Error(`Unknown engine: ${engine}`);
  }

  return {
    html,
    executionTimeMs: Math.round((performance.now() - start) * 1000) / 1000,
  };
}
