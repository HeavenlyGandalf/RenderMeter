export type TemplateEngine = 'handlebars' | 'mustache';

export interface BenchmarkResult {
  _id: string;
  templateEngine: TemplateEngine;
  executionTimeMs: number;
  templateSize: number;
  createdAt: string;
}

export interface RenderResult {
  html: string;
  executionTimeMs: number;
}
