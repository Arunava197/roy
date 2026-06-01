import { motion } from 'framer-motion';
import { Database, LineChart, Target, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  const bulletPoints = [
    {
      icon: <LineChart className="w-6 h-6 text-brand-cyan" />,
      title: 'Data-Driven Insights',
      description: 'Translating complex datasets into clear, actionable business strategies.',
    },
    {
      icon: <Database className="w-6 h-6 text-brand-blue" />,
      title: 'Statistical Precision',
      description: 'Applying rigorous statistical methods to ensure reliable and robust analysis.',
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-purple" />,
      title: 'Process Improvement',
      description: 'Identifying bottlenecks and optimizing workflows for enhanced efficiency.',
    },
    {
      icon: <Target className="w-6 h-6 text-cyan-400" />,
      title: 'Reporting & Dashboards',
      description: 'Designing intuitive, interactive dashboards that empower stakeholders.',
    },
  ];

  return (
    <section id="about" className="py-8 md:py-12 lg:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('section_titles.about', 'About Me').split(' ')[0]} <span className="text-brand-cyan">{t('section_titles.about', 'About Me').split(' ').slice(1).join(' ')}</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-blue to-brand-cyan mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-300"
          >
            <p className="text-lg leading-relaxed">
              I am a <strong>Business Intelligence & Data Analyst</strong> focused on transforming complex datasets into clear, actionable strategies. My core expertise lies in SQL, Power BI, and advanced statistical modeling to drive business growth.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Rather than just building dashboards, I partner closely with stakeholders to solve fundamental business problems—establishing reliable KPIs, optimizing workflows, and ensuring rigorous data governance across reporting pipelines.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Whether validating financial data structures or automating performance metrics, my approach is simple: <strong>make data accessible, accurate, and impact-driven</strong>.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {bulletPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-cyan/10 rounded-full blur-xl group-hover:bg-brand-cyan/20 transition-all duration-500 z-0" />
                <div className="relative z-10">
                  <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg inline-block mb-4 border border-slate-200 dark:border-white/10">
                    {point.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />
    </section>
  );
}
