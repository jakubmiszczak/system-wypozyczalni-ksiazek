import { createContext, useState, useContext, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../i18n/config';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(localStorage.getItem('language') || DEFAULT_LANGUAGE);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages(locale);
  }, [locale]);

  const loadMessages = async (locale) => {
    try {
      setLoading(true);
      const response = await LANGUAGES[locale].messages();
      const messageData = response.default || response;
      setMessages(messageData);
    } catch (err) {
      console.error(`Failed to load messages for locale ${locale}:`, err);
      setMessages({});
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('language', newLocale);
  };

  if (loading || !messages) {
    return <div className="loading">Loading translations...</div>;
  }

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      <IntlProvider
        messages={messages}
        locale={locale}
        defaultLocale={DEFAULT_LANGUAGE}
        onError={(err) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Intl Error:', err);
          }
        }}
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext); 