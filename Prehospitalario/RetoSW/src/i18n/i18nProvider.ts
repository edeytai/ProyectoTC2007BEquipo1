import polyglotI18nProvider from 'ra-i18n-polyglot';
import spanishMessages from './es';

export const i18nProvider = polyglotI18nProvider(
  () => spanishMessages,
  'es',
  [
    { locale: 'es', name: 'Español' },
  ],
  { allowMissing: true }
);
