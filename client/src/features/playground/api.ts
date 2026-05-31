import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { SavedResult, RenderResult, TemplateEngine } from '../../shared/types';

// ── Query keys ────────────────────────────────────────────────────────────────

export const playgroundKeys = {
  history: () => ['playground', 'history'] as const,
};

// ── Raw fetch functions ───────────────────────────────────────────────────────

async function fetchHistory(): Promise<SavedResult[]> {
  const res = await api.get<SavedResult[]>('/results');
  return res.data;
}

interface SavePayload {
  templateEngine: TemplateEngine;
  executionTimeMs: number;
  templateSize: number;
}

async function postResult(payload: SavePayload): Promise<SavedResult> {
  const res = await api.post<SavedResult>('/results', payload);
  return res.data;
}

async function postRender(
  engine: TemplateEngine,
  template: string,
  data?: Record<string, unknown>,
): Promise<RenderResult> {
  const res = await api.post<RenderResult>('/render', { engine, template, data });
  return res.data;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function usePlaygroundHistory() {
  return useQuery({
    queryKey: playgroundKeys.history(),
    queryFn: fetchHistory,
    staleTime: 30_000,
  });
}

export function useSaveResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postResult,
    onSuccess: (saved) => {
      queryClient.setQueryData<SavedResult[]>(
        playgroundKeys.history(),
        (prev = []) => [saved, ...prev].slice(0, 20),
      );
    },
  });
}

export function useServerRender() {
  return useMutation({
    mutationFn: ({
      engine,
      template,
      data,
    }: {
      engine: TemplateEngine;
      template: string;
      data?: Record<string, unknown>;
    }) => postRender(engine, template, data),
  });
}
