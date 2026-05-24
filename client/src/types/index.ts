export type TemplateEngine = 'handlebars' | 'mustache' | 'pug' | 'ejs';
export type Scenario = 'simple' | 'medium' | 'heavy' | 'extreme';

// ── Benchmark run (new) ───────────────────────────────────────────────────────

export interface EngineMetrics {
  avg: number;
  median: number;
  min: number;
  max: number;
  compileMs: number;
}

export interface ScenarioResult {
  scenario: Scenario;
  engines: Partial<Record<TemplateEngine, EngineMetrics>>;
}

export interface BenchmarkRun {
  _id: string;
  engines: TemplateEngine[];
  scenarios: Scenario[];
  runs: number;
  results: ScenarioResult[];
  createdAt: string;
}

// ── Playground / single render (legacy) ──────────────────────────────────────

export interface RenderResult {
  html: string;
  executionTimeMs: number;
}

export interface SavedResult {
  _id: string;
  templateEngine: TemplateEngine;
  executionTimeMs: number;
  templateSize: number;
  createdAt: string;
}
