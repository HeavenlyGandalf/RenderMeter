import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResults } from '../api/results';
import type { SavedResult as BenchmarkResult } from '../types';

interface Props {
  refreshKey: number;
}

export default function HistoryList({ refreshKey }: Props) {
  const { t, i18n } = useTranslation();
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchResults()
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const locale = i18n.language === 'ru' ? 'ru-RU' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  if (loading) return <p className="muted">{t('history.loading')}</p>;

  if (results.length === 0) {
    return <p className="muted">{t('history.empty')}</p>;
  }

  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>{t('history.colEngine')}</th>
          <th>{t('history.colTime')}</th>
          <th>{t('history.colSize')}</th>
          <th>{t('history.colDate')}</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => (
          <tr key={r._id}>
            <td>{r.templateEngine}</td>
            <td>{r.executionTimeMs.toFixed(3)}</td>
            <td>{r.templateSize}</td>
            <td>{new Date(r.createdAt).toLocaleString(locale)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
