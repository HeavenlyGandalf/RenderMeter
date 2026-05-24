import pug from 'pug';
import ejs from 'ejs';
import Handlebars from 'handlebars';
import Mustache from 'mustache';
import { getScenarioData, type Scenario, type ScenarioData } from '../scenarios/data';
import { TEMPLATES } from '../scenarios/templates';

const WARMUP = 10;

// ── Types ────────────────────────────────────────────────────────────────────

export interface EngineMetrics {
  avg: number;
  median: number;
  min: number;
  max: number;
  compileMs: number;
}

export interface ScenarioResult {
  scenario: string;
  engines: Record<string, EngineMetrics>;
}

// ── Math helpers ─────────────────────────────────────────────────────────────

function r(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function computeStats(times: number[]): Omit<EngineMetrics, 'compileMs'> {
  const sorted = [...times].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return {
    avg: r(sum / sorted.length),
    median: r(median),
    min: r(sorted[0]),
    max: r(sorted[sorted.length - 1]),
  };
}

// ── Compiler + renderer builder ───────────────────────────────────────────────

function buildRenderer(
  engine: string,
  template: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
): { render: () => string; compileMs: number } {
  const t0 = performance.now();
  let render: () => string;

  switch (engine) {
    case 'pug': {
      const fn = pug.compile(template);
      render = () => fn(data);
      break;
    }
    case 'ejs': {
      const fn = ejs.compile(template);
      render = () => fn(data);
      break;
    }
    case 'handlebars': {
      const fn = Handlebars.compile(template);
      render = () => fn(data);
      break;
    }
    case 'mustache': {
      Mustache.parse(template); // прогревает внутренний кеш
      render = () => Mustache.render(template, data);
      break;
    }
    default:
      throw new Error(`Unknown engine: ${engine}`);
  }

  return { render, compileMs: r(performance.now() - t0) };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function runBenchmark(
  engines: string[],
  scenarios: Scenario[],
  runs: number,
  customData: ScenarioData | null = null
): ScenarioResult[] {
  return scenarios.map((scenario) => {
    // customData заменяет стандартные данные сценария полностью
    const data = customData ?? getScenarioData(scenario);
    const engineResults: Record<string, EngineMetrics> = {};

    for (const engine of engines) {
      const template = TEMPLATES[engine];
      if (!template) continue;

      const { render, compileMs } = buildRenderer(engine, template, data);

      // Warm-up — не измеряем, даём движку прогреться
      for (let i = 0; i < WARMUP; i++) render();

      // Measurement
      const times: number[] = [];
      for (let i = 0; i < runs; i++) {
        const start = performance.now();
        render();
        times.push(performance.now() - start);
      }

      engineResults[engine] = { ...computeStats(times), compileMs };
    }

    return { scenario, engines: engineResults };
  });
}
