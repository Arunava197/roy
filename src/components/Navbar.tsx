import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Moon, Sun, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const PRIMARY_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

const MORE_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Games', href: '#games' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-lg bg-white/85 dark:bg-[#050a15]/90 border-b border-slate-200 dark:border-white/10">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo (Left) */}
          <div className="flex justify-start items-center shrink-0">
            <a href="#home" className="text-2xl font-bold tracking-tight">
              <span className="text-slate-900 dark:text-white">Arunava</span>
              <span className="text-brand-cyan">.</span>
            </a>
          </div>

          {/* Desktop Nav (Center) */}
          <nav className="hidden lg:flex flex-1 items-center justify-center flex-wrap gap-x-4 xl:gap-x-6 px-4">
            {PRIMARY_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-brand-blue dark:text-slate-300 dark:hover:text-brand-cyan transition-colors"
                style={{ whiteSpace: 'nowrap' }}
              >
                {t(`nav.${link.label}`, link.label)}
              </a>
            ))}
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-blue dark:text-slate-300 dark:hover:text-brand-cyan transition-colors"
              >
                {t('nav.More', 'More')}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 right-1/2 translate-x-1/2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden py-2 z-50 flex flex-col"
                  >
                    {MORE_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMoreOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-blue dark:hover:text-brand-cyan transition-colors text-center"
                      >
                        {t(`nav.${link.label}`, link.label)}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Desktop Actions (Right) */}
          <div className="hidden lg:flex items-center justify-end shrink-0">
            <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-700 pl-4">

              <LanguageSelector />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-brand-cyan" />
                ) : (
                  <Moon className="w-5 h-5 text-brand-blue" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Actions (Right) */}
          <div className="flex items-center justify-end lg:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-brand-cyan" />
              ) : (
                <Moon className="w-5 h-5 text-brand-blue" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-cyan focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden m-4 pt-2 p-4 absolute top-full w-[calc(100%-2rem)] left-0 shadow-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#050a15]/95 backdrop-blur-xl z-50"
        >
          <div className="flex flex-col space-y-4">
            {[...PRIMARY_LINKS, ...MORE_LINKS].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              >
                {t(`nav.${link.label}`, link.label)}
              </a>
            ))}
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-4">
              <div className="flex items-center justify-between px-3">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Language</span>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
