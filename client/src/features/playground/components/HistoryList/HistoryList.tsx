import { useTranslation } from 'react-i18next';
import s from './HistoryList.module.css';
import type { SavedResult } from '../../../../shared/types';

interface Props {
  history: SavedResult[];
  isLoading: boolean;
}

export default function HistoryList({ history, isLoading }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ru' ? 'ru-RU' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  if (isLoading) return <p className="muted">{t('history.loading')}</p>;
  if (history.length === 0) return <p className="muted">{t('history.empty')}</p>;

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <th>{t('history.colEngine')}</th>
          <th>{t('history.colTime')}</th>
          <th>{t('history.colSize')}</th>
          <th>{t('history.colDate')}</th>
        </tr>
      </thead>
      <tbody>
        {history.map((r) => (
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
