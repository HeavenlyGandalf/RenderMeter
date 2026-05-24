import api from './axios';
import type { SavedResult as BenchmarkResult } from '../types';

interface SaveResultPayload {
  templateEngine: string;
  executionTimeMs: number;
  templateSize: number;
}

export async function saveResult(payload: SaveResultPayload): Promise<BenchmarkResult> {
  const res = await api.post<BenchmarkResult>('/results', payload);
  return res.data;
}

export async function fetchResults(): Promise<BenchmarkResult[]> {
  const res = await api.get<BenchmarkResult[]>('/results');
  return res.data;
}
