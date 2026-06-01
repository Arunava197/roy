import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send, MapPin, Phone, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('arunava2171@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/xojboqev", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
        setTimeout(() => setIsSubmitted(false), 5000); // Hide success message after 5s
      } else {
        alert("Oops! There was a problem submitting your form");
      }
    } catch (error) {
      alert("Oops! There was a problem submitting your form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-8 md:py-12 lg:py-20 relative">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('section_titles.contact', "Get in Touch").split(' ').slice(0,2).join(' ')} <span className="text-brand-cyan">{t('section_titles.contact', "Get in Touch").split(' ').slice(2).join(' ')}</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-blue to-brand-purple mx-auto rounded-full mb-6" />
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Open to opportunities and networking. Drop a message or connect via social channels.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 h-full flex flex-col"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Contact Information</h3>
            
            <div className="space-y-4">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="flex items-center p-4 rounded-xl text-slate-600 dark:text-slate-300 group hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-brand-cyan/30 dark:hover:border-brand-cyan/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-default"
              >
                <div className="w-12 h-12 flex shrink-0 items-center justify-center bg-slate-200 dark:bg-white/5 rounded-lg mr-4 group-hover:bg-brand-cyan/20 transition-all duration-300 border border-transparent group-hover:border-brand-cyan/50">
                  <MapPin className="w-6 h-6 group-hover:text-brand-cyan transition-colors" />
                </div>
                <span className="text-base sm:text-lg break-all group-hover:text-brand-cyan transition-colors">Dhaka, Bangladesh</span>
              </motion.div>

              <motion.a 
                whileHover={{ scale: 1.03 }}
                href="tel:+8801303022570" 
                className="flex items-center p-4 rounded-xl text-slate-600 dark:text-slate-300 group hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-brand-cyan/30 dark:hover:border-brand-cyan/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <div className="w-12 h-12 flex shrink-0 items-center justify-center bg-slate-200 dark:bg-white/5 rounded-lg mr-4 group-hover:bg-brand-cyan/20 transition-all duration-300 border border-transparent group-hover:border-brand-cyan/50">
                  <Phone className="w-6 h-6 group-hover:text-brand-cyan transition-colors" />
                </div>
                <span className="text-base sm:text-lg break-all group-hover:text-brand-cyan transition-colors">+8801303022570</span>
              </motion.a>
              
              <motion.a 
                whileHover={{ scale: 1.03 }}
                href="mailto:arunava2171@gmail.com"
                onClick={handleCopyEmail}
                className="relative flex items-center p-4 rounded-xl text-slate-600 dark:text-slate-300 group hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-brand-cyan/30 dark:hover:border-brand-cyan/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
              >
                <div className="w-12 h-12 flex shrink-0 items-center justify-center bg-slate-200 dark:bg-white/5 rounded-lg mr-4 group-hover:bg-brand-cyan/20 transition-all duration-300 border border-transparent group-hover:border-brand-cyan/50">
                  <Mail className="w-6 h-6 group-hover:text-brand-cyan transition-colors" />
                </div>
                <span className="text-base sm:text-lg break-all group-hover:text-brand-cyan transition-colors">arunava2171@gmail.com</span>
                
                {/* Floating Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 translate-y-2 group-hover:translate-y-0">
                  {copied ? (
                    <div className="flex items-center text-xs font-semibold text-white bg-green-500 px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                      <Check className="w-3.5 h-3.5 mr-1.5" /> Copied!
                    </div>
                  ) : (
                    <div className="flex items-center text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Email
                    </div>
                  )}
                </div>
              </motion.a>
              
              <motion.a 
                whileHover={{ scale: 1.03 }}
                href="https://github.com/Arunava197" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center p-4 rounded-xl text-slate-600 dark:text-slate-300 group hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-brand-cyan/30 dark:hover:border-brand-cyan/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <div className="w-12 h-12 flex shrink-0 items-center justify-center bg-slate-200 dark:bg-white/5 rounded-lg mr-4 group-hover:bg-brand-cyan/20 transition-all duration-300 border border-transparent group-hover:border-brand-cyan/50">
                  <Github className="w-6 h-6 group-hover:text-brand-cyan transition-colors" />
                </div>
                <span className="text-base sm:text-lg break-all group-hover:text-brand-cyan transition-colors">github.com/Arunava197</span>
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.03 }}
                href="https://www.linkedin.com/in/arunava-chandan-roy-177790145/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center p-4 rounded-xl text-slate-600 dark:text-slate-300 group hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-brand-cyan/30 dark:hover:border-brand-cyan/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <div className="w-12 h-12 flex shrink-0 items-center justify-center bg-slate-200 dark:bg-white/5 rounded-lg mr-4 group-hover:bg-brand-cyan/20 transition-all duration-300 border border-transparent group-hover:border-brand-cyan/50">
                  <Linkedin className="w-6 h-6 group-hover:text-brand-cyan transition-colors" />
                </div>
                <span className="text-base sm:text-lg break-all group-hover:text-brand-cyan transition-colors">LinkedIn Profile</span>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 h-full flex flex-col"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center flex-1 text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 text-green-500 dark:bg-green-500/10 dark:text-brand-cyan rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 flex flex-col flex-1">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-3 bg-white/50 dark:bg-[#050a15]/50 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 bg-white/50 dark:bg-[#050a15]/50 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    placeholder="Your message here..."
                    required
                    className="w-full flex-1 px-4 py-3 bg-white/50 dark:bg-[#050a15]/50 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan text-slate-900 dark:text-white resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-auto py-4 px-6 bg-slate-900 dark:bg-brand-cyan text-white dark:text-slate-900 font-bold rounded-lg hover:bg-brand-blue dark:hover:bg-cyan-400 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && <Send className="w-5 h-5" />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
