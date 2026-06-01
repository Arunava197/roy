import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, Volume2, Square } from 'lucide-react';
import HeroScene from './HeroScene';
import { useReadAloud } from '../hooks/useReadAloud';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { isPlaying, toggle } = useReadAloud();
  const { t } = useTranslation();

  const handleToggleVoice = () => {
    const text = t('voice.hero_intro', "Hi, I am Arunava Chandan Roy, a Business Intelligence and Data Analyst. I specialize in turning data into insight, strategy, and measurable decisions.");
    toggle(text);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-grid">
      <HeroScene />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center lg:text-left flex flex-col lg:flex-row items-center">
        <motion.div 
          className="lg:w-1/2 flex flex-col items-center lg:items-start lg:mt-0 pt-10 lg:pt-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Mobile Display Picture */}
          <div className="print-profile-pic-mobile lg:hidden relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 glass-card overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)] mb-8">
            <div className="no-print absolute inset-0 rounded-full border border-brand-cyan/20 animate-[spin_10s_linear_infinite]" />
            <img 
              src="./dp.jpeg" 
              alt="Arunava Chandan Roy" 
              className="w-full h-full object-cover rounded-full bg-slate-200 dark:bg-slate-800"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=Arunava+Roy&size=512&background=0284c7&color=fff";
              }}
            />
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-brand-blue dark:text-brand-cyan uppercase bg-brand-blue/10 dark:bg-brand-cyan/10 rounded-full flex items-center gap-2"
          >
            {t('hero.role', 'Business Intelligence & Data Analyst')}
            <button 
              onClick={handleToggleVoice}
              className="ml-2 hover:text-brand-blue/70 dark:hover:text-brand-cyan/70 transition-colors focus:outline-none"
              aria-label={isPlaying ? "Stop voice introduction" : "Listen to introduction"}
              title={isPlaying ? "Stop reading" : "Read aloud"}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            Arunava <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Chandan Roy</span>
          </motion.h1>
          
          <motion.p 
            className="mt-4 text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 mb-8 font-light"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          >
            {t('hero.description', 'Turning data into insight, strategy, and measurable decisions.')}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            <motion.a 
              href="#projects" 
              className="px-8 py-3.5 flex items-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-brand-cyan dark:text-slate-900 font-semibold hover:bg-brand-blue dark:hover:bg-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/25 w-full sm:w-auto justify-center"
            >
              {t('nav.Projects', 'View Projects')}
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            
            <motion.a 
              href="#contact" 
              className="px-8 py-3.5 flex items-center gap-2 rounded-xl glass-card text-slate-700 dark:text-white font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition-all w-full sm:w-auto justify-center"
            >
              {t('hero.contact_me', 'Contact Me')}
              <Mail className="w-5 h-5" />
            </motion.a>

            <motion.a 
               href="https://docs.google.com/document/d/1nroL4fj6yCovXBERxtE5D1IYcpja_Jl_cyLwtpDLzaY/preview"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="Download CV"
               title="View CV"
               className="px-4 py-3.5 flex items-center gap-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
            >
              <Printer className="w-5 h-5" />
              <span className="text-sm font-medium">{t('hero.download_cv', 'Download CV')}</span>
            </motion.a>

          </motion.div>
        </motion.div>

        {/* Display Picture Area */}
        <motion.div 
          className="print-pic-wrapper lg:w-1/2 hidden lg:flex justify-center items-center h-[500px] relative mt-10 lg:mt-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* Decorative rings around the DP */}
          <div className="no-print absolute w-[340px] h-[340px] rounded-full border border-brand-cyan/20 animate-[spin_10s_linear_infinite]" />
          <div className="no-print absolute w-[380px] h-[380px] rounded-full border border-brand-blue/20 animate-[spin_15s_linear_infinite_reverse]" />
          
          <div className="print-profile-pic relative w-80 h-80 rounded-full p-2 glass-card overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.2)]">
            <img 
              src="./dp.jpeg" 
              alt="Arunava Chandan Roy" 
              className="w-full h-full object-cover rounded-full bg-slate-200 dark:bg-slate-800"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=Arunava+Roy&size=512&background=0284c7&color=fff";
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/10 dark:bg-brand-purple/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none -z-20" />
      
      {/* Bottom section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />
    </section>
  );
}
