import { motion } from 'framer-motion';
import { EXPERIENCES } from '../data';
import { Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Experience() {
  const { t } = useTranslation();
  return (
    <section id="experience" className="py-8 md:py-12 lg:py-20 relative relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-16 gap-6 relative"
        >
          <div className="w-full flex justify-center md:absolute md:inset-0 md:pointer-events-none">
            <div className="text-center md:pointer-events-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {t('section_titles.experience', 'Resume & Experience')}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-brand-cyan to-brand-blue mx-auto rounded-full" />
            </div>
          </div>
          
          <div className="md:ml-auto z-10 w-full md:w-auto flex justify-center md:justify-end">
            <a 
              href="https://docs.google.com/document/d/1nroL4fj6yCovXBERxtE5D1IYcpja_Jl_cyLwtpDLzaY/export?format=pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 flex items-center gap-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm"
              title="Download CV"
            >
              <Download className="w-4 h-4" />
              <span>View CV PDF</span>
            </a>
          </div>
        </motion.div>

        <div className="relative border-l border-slate-300 dark:border-white/20 ml-3 md:ml-6">
          {EXPERIENCES.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-8 md:mb-12 ml-6 md:ml-12 relative"
            >
              {/* Geometric Node timeline marker */}
              <div className="absolute -left-[33px] md:-left-[61px] top-1">
                <div className="w-5 h-5 bg-brand-cyan rounded-sm rotate-45 border-4 border-slate-100 dark:border-[#080d1e] shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              </div>

              <div className="glass-card p-6 md:p-8 hover:border-brand-cyan/40 transition-colors">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                    <p className="text-lg text-brand-blue dark:text-brand-cyan">{exp.company}</p>
                  </div>
                  <span className="inline-block mt-2 md:mt-0 px-3 py-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full">
                    {exp.timeline}
                  </span>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {exp.description}
                </p>
                
                <ul className="space-y-2">
                  {exp.achievements.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-brand-cyan mr-2 mt-1">▹</span>
                      <span className="text-slate-600 dark:text-slate-300 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />
    </section>
  );
}
