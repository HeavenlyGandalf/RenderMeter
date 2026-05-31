import { useTranslation } from 'react-i18next';
import s from './PreviewPanel.module.css';

export default function PreviewPanel({ html }: { html: string }) {
  const { t } = useTranslation();
  if (!html) return null;
  return (
    <div className="card">
      <h2>{t('preview.heading')}</h2>
      <div className={s.content} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
