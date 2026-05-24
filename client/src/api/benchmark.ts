import api from './axios';
import type { BenchmarkRun, TemplateEngine, Scenario } from '../types';

interface RunPayload {
  engines: TemplateEngine[];
  scenarios: Scenario[];
  runs: number;
  customData?: object | null;
}

export async function runBenchmark(payload: RunPayload): Promise<BenchmarkRun> {
  const res = await api.post<BenchmarkRun>('/benchmark', payload);
  return res.data;
}

export async function fetchBenchmarkHistory(): Promise<BenchmarkRun[]> {
  const res = await api.get<BenchmarkRun[]>('/benchmark/history');
  return res.data;
}

export async function fetchTemplates(): Promise<Record<string, string>> {
  const res = await api.get<Record<string, string>>('/benchmark/templates');
  return res.data;
}

export async function fetchScenarios(): Promise<Record<string, unknown>> {
  const res = await api.get<Record<string, unknown>>('/benchmark/scenarios');
  return res.data;
}
