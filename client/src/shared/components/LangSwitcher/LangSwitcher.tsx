import { useTranslation } from 'react-i18next';
import s from './LangSwitcher.module.css';

const LANGS = ['en', 'ru', 'fr'] as const;

export default function LangSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language;

  return (
    <div className={s.switcher}>
      {LANGS.map((lng) => (
        <button
          key={lng}
          className={`${s.btn} ${current === lng ? s.active : ''}`}
          onClick={() => i18n.changeLanguage(lng)}
          aria-label={t(`lang.${lng}`)}
        >
          {t(`lang.${lng}`)}
        </button>
      ))}
    </div>
  );
}
