import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../i18n/config';
import './LanguageSelector.css';

function LanguageSelector() {
  const { locale, changeLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <select value={locale} onChange={(e) => changeLanguage(e.target.value)}>
        {Object.entries(LANGUAGES).map(([code, language]) => (
          <option key={code} value={code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector; 