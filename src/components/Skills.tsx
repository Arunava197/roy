import { motion } from 'framer-motion';
import { SKILLS_CATEGORIES } from '../data';
import { Hexagon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Skills() {
  const { t } = useTranslation();
  return (
    <section id="skills" className="py-8 md:py-12 lg:py-20 relative">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('section_titles.skills', 'Technical Skills').split(' ')[0]} <span className="text-brand-purple">{t('section_titles.skills', 'Technical Skills').split(' ').slice(1).join(' ')}</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-cyan to-brand-purple mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {SKILLS_CATEGORIES.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="glass-card p-8 flex flex-col items-center text-center group"
            >
              <div className="mb-6 pointer-events-none">
                <Hexagon className="w-12 h-12 text-brand-purple opacity-80 group-hover:text-brand-cyan transition-colors" strokeWidth={1} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                {category.category}
              </h3>
              <div className="w-full flex flex-col gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name} className="w-full text-left">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 pr-4">{skill.name}</span>
                      <span className="text-sm font-medium text-brand-purple dark:text-brand-cyan">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 dark:bg-slate-700 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-brand-cyan to-brand-purple h-1.5 rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: skillIndex * 0.1 + catIndex * 0.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent" />
    </section>
  );
}
