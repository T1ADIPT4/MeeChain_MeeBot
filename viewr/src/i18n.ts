import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import thJson from './i18n/th.json';
import enJson from './i18n/en.json';

i18n.use(initReactI18next).init({
  resources: {
    th: {
      translation: thJson,
    },
    en: {
      translation: enJson,
    },
  },
  lng: 'th', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;