import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Box, X, ArrowRight, Search, Database, BarChart2, FileSpreadsheet, Terminal, Code2, LineChart, Volume2, Square, Gamepad2 } from 'lucide-react';
import { PROJECTS } from '../data';
import { useReadAloud } from '../hooks/useReadAloud';
import { TicTacToeModal } from './TicTacToeModal';
import { useTranslation } from 'react-i18next';

const ProjectImageSlideshow = ({ images, className = "" }: { images: string[], className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000 + Math.random() * 1000); // add jitter to stagger animations slightly
    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt="Project Slide"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700"
        />
      </AnimatePresence>
    </div>
  );
};

const CATEGORIES = ['All', 'SQL', 'Power BI', 'Python', 'Excel', 'Data Analysis'];

const getToolIcon = (tool: string) => {
  const t = tool.toLowerCase();
  if (t.includes('sql') || t.includes('database')) return <Database className="w-3.5 h-3.5 mr-1.5" />;
  if (t.includes('power bi')) return <BarChart2 className="w-3.5 h-3.5 mr-1.5" />;
  if (t.includes('python')) return <Terminal className="w-3.5 h-3.5 mr-1.5" />;
  if (t.includes('excel')) return <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />;
  if (t.includes('analysis')) return <LineChart className="w-3.5 h-3.5 mr-1.5" />;
  return <Code2 className="w-3.5 h-3.5 mr-1.5" />;
};

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [isTicTacToeOpen, setIsTicTacToeOpen] = useState(false);
  const { isPlaying, toggle } = useReadAloud();
  const { t } = useTranslation();

  const handleReadProject = (project: typeof PROJECTS[0]) => {
    const text = `${project.title}. Problem: ${project.problem}. Methodology: ${project.method}. Findings: ${project.findings}. Impact: ${project.impact}.`;
    toggle(text);
  };

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      const matchesCategory = filter === 'All' ? true : project.tools.includes(filter);
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        project.title.toLowerCase().includes(searchLower) ||
        project.tools.some(tool => tool.toLowerCase().includes(searchLower)) ||
        project.problem.toLowerCase().includes(searchLower) ||
        project.method.toLowerCase().includes(searchLower);
      
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <section id="projects" className="py-8 md:py-12 lg:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('section_titles.projects', 'Analytical Projects').split(' ')[0]} <span className="text-brand-blue">{t('section_titles.projects', 'Analytical Projects').split(' ').slice(1).join(' ')}</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-blue to-brand-cyan mx-auto rounded-full mb-8 md:mb-10" />
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFilter(category);
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue ${
                  filter === category
                    ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
            
            <button
              onClick={() => setIsTicTacToeOpen(true)}
              className="px-4 py-2 flex items-center gap-2 rounded-full text-sm font-bold bg-brand-blue/10 text-brand-blue dark:text-brand-cyan hover:bg-brand-blue hover:text-white dark:hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] border border-brand-blue/20"
            >
              <X className="w-4 h-4" />
              Tic Tac Toe
            </button>
            <button
              onClick={() => {
                document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 flex items-center gap-2 rounded-full text-sm font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-amber-500/30"
            >
              <Gamepad2 className="w-4 h-4" />
              Interactive Playground
            </button>
          </div>

          <div className="max-w-md mx-auto relative mb-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('ui.search', 'Search by keywords, tools, or topics...')}
              className="block w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-white/10 rounded-xl leading-5 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue sm:text-sm transition-all duration-300 shadow-sm"
            />
          </div>
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, delay: index * 0.1 } }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3, delay: 0 } }}
                transition={{ layout: { type: "spring", bounce: 0.2, duration: 0.6 } }}
                whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                className="glass-card flex flex-col h-full transform transition-transform duration-300 relative group overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                style={{ transformPerspective: 1000 }}
              >
                {/* Background gradient effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/0 to-brand-cyan/0 group-hover:from-brand-blue/5 group-hover:to-brand-cyan/10 transition-colors duration-500" />
                
                <div className="h-48 w-full relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/40 mix-blend-overlay z-10 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
                  <ProjectImageSlideshow images={project.images} className="group-hover:scale-105 transition-transform duration-700" />
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 hidden">
                      <Box className="w-6 h-6 text-brand-blue" />
                    </div>
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto text-slate-400 hover:text-brand-cyan transition-colors"
                      aria-label="View on GitHub"
                      title="View on GitHub"
                    >
                      <Code2 className="w-5 h-5" />
                    </a>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
                    {project.description}
                  </p>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 relative z-10 flex flex-wrap gap-2 mt-auto">
                  {project.tools.map((tool) => (
                    <span 
                      key={tool} 
                      className="text-xs px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded flex items-center font-medium"
                    >
                      {getToolIcon(tool)}
                      {tool}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => setSelectedProject(project)}
                  className="mt-6 flex items-center justify-center w-full py-2.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-medium hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue transition-all duration-300 group/btn"
                >
                  <span>{t('ui.view_details', 'View Details')}</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Bottom section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-white">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="relative w-full max-w-3xl glass-card max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto p-6 sm:p-8 pt-16 sm:pt-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-xl border border-brand-blue/20 hidden">
                      <Box className="w-8 h-8 text-brand-blue" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => handleReadProject(selectedProject)}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-brand-blue dark:text-brand-cyan shrink-0"
                    aria-label={isPlaying ? "Stop reading" : "Read project details"}
                    title={isPlaying ? "Stop reading" : "Read project details"}
                  >
                    {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProject.tools.map((tool) => (
                    <span 
                      key={tool} 
                      className="text-sm px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-medium flex items-center shadow-sm"
                    >
                      {getToolIcon(tool)}
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-xl border border-slate-100 dark:border-white/10">
                    <span className="text-sm font-bold text-brand-cyan uppercase tracking-wider block mb-2">{t('ui.problem', 'Problem Statement')}</span>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{selectedProject.problem}</p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-xl border border-slate-100 dark:border-white/10">
                    <span className="text-sm font-bold text-brand-purple uppercase tracking-wider block mb-2">{t('ui.methodology', 'Methodology')}</span>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{selectedProject.method}</p>
                  </div>
                  
                  {selectedProject.findings && (
                    <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-xl border border-slate-100 dark:border-white/10">
                      <span className="text-sm font-bold text-brand-cyan/80 uppercase tracking-wider block mb-2">Key Findings</span>
                      <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{selectedProject.findings}</p>
                    </div>
                  )}

                  <div className="bg-green-500/10 p-5 rounded-xl border border-green-500/20">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider block mb-2">{t('ui.impact', 'Business Impact')}</span>
                    <p className="text-base text-green-900 dark:text-green-100 font-medium leading-relaxed">{selectedProject.impact}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-end gap-3">
                  <a 
                    href={selectedProject.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    View Code on GitHub
                  </a>
                  <a 
                    href={selectedProject.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-brand-blue text-white rounded-lg font-medium hover:bg-brand-cyan transition-colors"
                  >
                    {t('ui.view_live', 'View Project Live')}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <TicTacToeModal isOpen={isTicTacToeOpen} onClose={() => setIsTicTacToeOpen(false)} />
    </section>
  );
}
