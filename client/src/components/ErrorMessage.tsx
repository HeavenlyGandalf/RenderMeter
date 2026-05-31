import { useTranslation } from 'react-i18next';

interface Props {
  message: string;
  onDismiss: () => void;
}

export default function ErrorMessage({ message, onDismiss }: Props) {
  const { t } = useTranslation();

  return (
    <div className="error-banner" role="alert">
      <span>{message}</span>
      <button onClick={onDismiss} aria-label={t('error.dismiss')}>×</button>
    </div>
  );
}
