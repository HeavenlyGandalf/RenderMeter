import { Request, Response } from 'express';
import { runBenchmark, type ScenarioResult } from '../services/benchmark.service';
import { BenchmarkRunModel } from '../models/BenchmarkRun';
import { getScenarioData, type Scenario, type ScenarioData } from '../scenarios/data';
import { TEMPLATES } from '../scenarios/templates';

const VALID_ENGINES = ['handlebars', 'mustache', 'pug', 'ejs'];
const VALID_SCENARIOS: Scenario[] = ['simple', 'medium', 'heavy', 'extreme'];
const MAX_RUNS = 500;

export async function startBenchmark(req: Request, res: Response): Promise<void> {
  const {
    engines,
    scenarios,
    runs = 100,
    customData,
  } = req.body as {
    engines?: string[];
    scenarios?: string[];
    runs?: number;
    customData?: ScenarioData;
  };

  if (!Array.isArray(engines) || engines.length === 0) {
    res.status(400).json({ error: 'engines must be a non-empty array' });
    return;
  }
  if (!Array.isArray(scenarios) || scenarios.length === 0) {
    res.status(400).json({ error: 'scenarios must be a non-empty array' });
    return;
  }

  const unknownEngines = engines.filter((e) => !VALID_ENGINES.includes(e));
  if (unknownEngines.length) {
    res.status(400).json({ error: `Unknown engines: ${unknownEngines.join(', ')}` });
    return;
  }

  const unknownScenarios = scenarios.filter((s) => !VALID_SCENARIOS.includes(s as Scenario));
  if (unknownScenarios.length) {
    res.status(400).json({ error: `Unknown scenarios: ${unknownScenarios.join(', ')}` });
    return;
  }

  if (runs < 1 || runs > MAX_RUNS) {
    res.status(400).json({ error: `runs must be between 1 and ${MAX_RUNS}` });
    return;
  }

  const results: ScenarioResult[] = runBenchmark(
    engines,
    scenarios as Scenario[],
    runs,
    customData ?? null
  );

  const saved = await BenchmarkRunModel.create({
    engines,
    scenarios,
    runs,
    results,
    isCustomData: !!customData,
  });
  res.json(saved);
}

export async function getBenchmarkHistory(_req: Request, res: Response): Promise<void> {
  const history = await BenchmarkRunModel.find().sort({ createdAt: -1 }).limit(10);
  res.json(history);
}

export function getTemplates(_req: Request, res: Response): void {
  res.json(TEMPLATES);
}

// Возвращает тестовые данные всех сценариев для просмотра и редактирования
export function getScenarios(_req: Request, res: Response): void {
  const data: Record<Scenario, ScenarioData> = {
    simple: getScenarioData('simple'),
    medium: getScenarioData('medium'),
    heavy: getScenarioData('heavy'),
    extreme: getScenarioData('extreme'),
  };
  res.json(data);
}
