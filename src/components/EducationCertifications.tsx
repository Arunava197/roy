import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, X, Calendar, BookOpen } from 'lucide-react';
import { EDUCATION, CERTIFICATIONS } from '../data';
import { useTranslation } from 'react-i18next';

export default function EducationCertifications() {
  const [selectedCert, setSelectedCert] = useState<(typeof CERTIFICATIONS)[0] | null>(null);
  const { t } = useTranslation();

  return (
    <section className="py-8 md:py-12 lg:py-20 relative overflow-hidden" id="education">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-stretch">
          
          {/* Education */}
          <div className="flex flex-col h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center mb-8"
            >
              <GraduationCap className="w-8 h-8 text-brand-blue mr-4" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('section_titles.education', 'Education')}</h2>
            </motion.div>
            
            <div className="space-y-6 flex flex-col flex-1">
              {EDUCATION.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 flex-1 flex flex-col justify-center"
                >
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{edu.degree}</h3>
                  <p className="text-brand-cyan mb-2 font-medium">{edu.institution}</p>
                  <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase mb-3">{edu.field}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {edu.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div id="certifications" className="flex flex-col h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center mb-8"
            >
              <Award className="w-8 h-8 text-brand-purple mr-4" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('section_titles.certifications', 'Certifications')}</h2>
            </motion.div>

            <div className="grid gap-4 flex-1">
              {CERTIFICATIONS.map((cert, index) => (
                <motion.button
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="w-full h-full text-left flex items-center p-4 glass-card group hover:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                >
                  <div className="p-3 bg-brand-purple/10 rounded-full mr-4 group-hover:bg-brand-purple/20 transition-colors">
                    <Award className="w-6 h-6 text-brand-purple" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-brand-cyan transition-colors">{cert.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* Bottom section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />

      {/* Certification Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setSelectedCert(null)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="relative w-full max-w-2xl glass-card flex flex-col p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>

              <div className="pr-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 lg:p-4 bg-brand-purple/10 dark:bg-brand-purple/20 rounded-xl border border-brand-purple/20 hidden sm:block">
                    <Award className="w-8 h-8 lg:w-10 lg:h-10 text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                      {selectedCert.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-slate-500" />
                    <div>
                      <span className="block text-sm text-slate-500 dark:text-slate-400">Issuer</span>
                      <span className="font-semibold">{selectedCert.issuer}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div>
                      <span className="block text-sm text-slate-500 dark:text-slate-400">Date of Completion</span>
                      <span className="font-semibold">{selectedCert.date}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mt-6">
                    <BookOpen className="w-5 h-5 text-slate-500 mt-1" />
                    <div>
                      <span className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Details</span>
                      <p className="leading-relaxed">{selectedCert.summary}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
