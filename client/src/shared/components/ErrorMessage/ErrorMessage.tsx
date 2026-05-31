import { useTranslation } from 'react-i18next';
import s from './ErrorMessage.module.css';

interface Props {
  message: string;
  onDismiss: () => void;
}

export default function ErrorMessage({ message, onDismiss }: Props) {
  const { t } = useTranslation();
  return (
    <div className={s.banner} role="alert">
      <span>{message}</span>
      <button onClick={onDismiss} aria-label={t('error.dismiss')}>×</button>
    </div>
  );
}
