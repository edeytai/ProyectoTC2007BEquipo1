import polyglotI18nProvider from 'ra-i18n-polyglot';
import esMessages from '../i18n/es.json';
import enMessages from '../i18n/en.json';

const messages = {
  es: esMessages,
  en: enMessages,
};

export const i18nProvider = polyglotI18nProvider(
  (locale) => messages[locale as keyof typeof messages],
  'es', // Default locale
  [
    { locale: 'es', name: 'Español' },
    { locale: 'en', name: 'English' },
  ]
);