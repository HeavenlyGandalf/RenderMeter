import pug from 'pug';
import ejs from 'ejs';

// Те же тестовые данные, что и на клиенте
const sampleData = {
  title: 'RenderMeter',
  items: ['Apple', 'Banana', 'Cherry'],
  user: { name: 'Developer', active: true },
};

export interface RenderResult {
  html: string;
  executionTimeMs: number;
}

export function renderTemplate(engine: string, template: string): RenderResult {
  const start = performance.now();
  let html: string;

  switch (engine) {
    case 'pug':
      html = pug.render(template, sampleData);
      break;

    case 'ejs':
      html = ejs.render(template, sampleData);
      break;

    default:
      throw new Error(`Unknown server-side engine: ${engine}`);
  }

  return {
    html,
    executionTimeMs: Math.round((performance.now() - start) * 1000) / 1000,
  };
}
