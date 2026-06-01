import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReadAloud } from '../hooks/useReadAloud';

const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: 'English',
  bn: 'বাংলা',
  hi: 'हिंदी',
  zh: '中文',
  es: 'Español',
  de: 'Deutsch',
  ru: 'Русский'
};

export default function LanguagePromptToast() {
  const [showToast, setShowToast] = useState(false);
  const [detectedLang, setDetectedLang] = useState<{code: string, name: string} | null>(null);
  const { i18n, t } = useTranslation();
  const { speak } = useReadAloud();

  useEffect(() => {
    const hasPrompted = localStorage.getItem('languagePrompted');
    if (!hasPrompted) {
      const browserLang = navigator.language.split('-')[0];
      
      if (
        browserLang !== 'en' && 
        SUPPORTED_LANGUAGES[browserLang] &&
        browserLang !== i18n.language
      ) {
        setDetectedLang({ code: browserLang, name: SUPPORTED_LANGUAGES[browserLang] });
        setShowToast(true);
      }
    }
  }, [i18n.language]);

  const handleAccept = async () => {
    if (detectedLang) {
      await i18n.changeLanguage(detectedLang.code);
      speak(t('voice.lang_changed', { lng: detectedLang.code }));
    }
    closeToast();
  };

  const closeToast = () => {
    setShowToast(false);
    localStorage.setItem('languagePrompted', 'true');
  };

  return (
    <AnimatePresence>
      {showToast && detectedLang && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-brand-blue dark:text-brand-cyan">
              <Globe className="w-5 h-5" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Language Suggestion</h3>
            </div>
            <button 
              onClick={closeToast}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            We noticed your browser language is {detectedLang.name}. Would you like to switch the portfolio to this language?
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-blue dark:bg-brand-cyan dark:text-slate-900 rounded-lg hover:bg-blue-600 dark:hover:bg-cyan-400 transition-colors"
            >
              Switch to {detectedLang.name}
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              No, thanks
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
