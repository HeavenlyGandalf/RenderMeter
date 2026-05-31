// Maps an i18next language code to an Intl locale used for date formatting.
const LOCALE_BY_LANG: Record<string, string> = {
  ru: 'ru-RU',
  fr: 'fr-FR',
  en: 'en-US',
};

export function getLocale(lang: string): string {
  return LOCALE_BY_LANG[lang] ?? 'en-US';
}

export function formatDateTime(iso: string, lang: string): string {
  return new Date(iso).toLocaleString(getLocale(lang));
}
