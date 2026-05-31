import { useTranslation } from 'react-i18next';

interface Props {
  html: string;
}

export default function PreviewPanel({ html }: Props) {
  const { t } = useTranslation();

  if (!html) return null;

  return (
    <div className="card">
      <h2>{t('preview.heading')}</h2>
      <div
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
