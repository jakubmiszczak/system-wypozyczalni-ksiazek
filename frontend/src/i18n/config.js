export const LANGUAGES = {
  en: {
    name: 'English',
    messages: () => import('./messages/en.json')
  },
  pl: {
    name: 'Polski',
    messages: () => import('./messages/pl.json')
  }
};

export const DEFAULT_LANGUAGE = 'en'; 