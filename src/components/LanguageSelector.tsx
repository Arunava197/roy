import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useReadAloud } from '../hooks/useReadAloud';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'bn', label: 'BN' },
  { code: 'hi', label: 'HI' },
  { code: 'zh', label: 'ZH' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
  { code: 'ru', label: 'RU' }
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const { speak } = useReadAloud();

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    await i18n.changeLanguage(newLang);
    speak(t('voice.lang_changed', { lng: newLang }));
  };

  return (
    <div className="relative group flex items-center">
      <Globe className="w-5 h-5 text-slate-600 dark:text-slate-300 mr-2" />
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className="appearance-none bg-transparent text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-cyan focus:outline-none cursor-pointer uppercase pr-4"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
