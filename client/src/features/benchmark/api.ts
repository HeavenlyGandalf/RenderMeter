import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { BenchmarkRun, TemplateEngine, Scenario } from '../../shared/types';

// ── Query keys ────────────────────────────────────────────────────────────────

export const benchmarkKeys = {
  history:   () => ['benchmark', 'history'] as const,
  templates: () => ['benchmark', 'templates'] as const,
  scenarios: () => ['benchmark', 'scenarios'] as const,
};

// ── Raw fetch functions ───────────────────────────────────────────────────────

async function fetchHistory(): Promise<BenchmarkRun[]> {
  const res = await api.get<BenchmarkRun[]>('/benchmark/history');
  return res.data;
}

async function fetchTemplates(): Promise<Record<string, string>> {
  const res = await api.get<Record<string, string>>('/benchmark/templates');
  return res.data;
}

async function fetchScenarios(): Promise<Record<string, unknown>> {
  const res = await api.get<Record<string, unknown>>('/benchmark/scenarios');
  return res.data;
}

interface RunPayload {
  engines: TemplateEngine[];
  scenarios: Scenario[];
  runs: number;
  customData?: object;
}

async function postBenchmark(payload: RunPayload): Promise<BenchmarkRun> {
  const res = await api.post<BenchmarkRun>('/benchmark', payload);
  return res.data;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useBenchmarkHistory() {
  return useQuery({
    queryKey: benchmarkKeys.history(),
    queryFn: fetchHistory,
    staleTime: 30_000,
  });
}

export function useTemplates(enabled: boolean) {
  return useQuery({
    queryKey: benchmarkKeys.templates(),
    queryFn: fetchTemplates,
    enabled,
    staleTime: Infinity,
  });
}

export function useScenarios(enabled: boolean) {
  return useQuery({
    queryKey: benchmarkKeys.scenarios(),
    queryFn: fetchScenarios,
    enabled,
    staleTime: Infinity,
  });
}

export function useBenchmarkRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postBenchmark,
    onSuccess: (newRun) => {
      queryClient.setQueryData<BenchmarkRun[]>(
        benchmarkKeys.history(),
        (prev = []) => [newRun, ...prev].slice(0, 10),
      );
    },
  });
}
