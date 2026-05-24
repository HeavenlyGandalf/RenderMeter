import { useEffect, useState } from 'react';
import { fetchResults } from '../api/results';
import type { SavedResult as BenchmarkResult } from '../types';

interface Props {
  refreshKey: number;
}

export default function HistoryList({ refreshKey }: Props) {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchResults()
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) return <p className="muted">Loading…</p>;

  if (results.length === 0) {
    return <p className="muted">No runs yet — start your first benchmark!</p>;
  }

  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Engine</th>
          <th>Time (ms)</th>
          <th>Size (chars)</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => (
          <tr key={r._id}>
            <td>{r.templateEngine}</td>
            <td>{r.executionTimeMs.toFixed(3)}</td>
            <td>{r.templateSize}</td>
            <td>{new Date(r.createdAt).toLocaleString('ru')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
