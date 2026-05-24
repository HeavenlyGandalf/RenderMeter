import { BenchmarkResult } from '../models/BenchmarkResult';

interface CreateResultData {
  templateEngine: string;
  executionTimeMs: number;
  templateSize: number;
}

export async function saveResult(data: CreateResultData) {
  return BenchmarkResult.create(data);
}

export async function getRecentResults() {
  return BenchmarkResult.find().sort({ createdAt: -1 }).limit(20);
}
