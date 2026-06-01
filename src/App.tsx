import { ThemeProvider } from './components/ThemeProvider';
import CosmicBackground from './components/CosmicBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import EducationCertifications from './components/EducationCertifications';
import Experience from './components/Experience';
import InteractiveGames from './components/InteractiveGames';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollProgress from './components/ScrollProgress';
import ChatBot from './components/ChatBot';
import LanguagePromptToast from './components/LanguagePromptToast';
import LocalTimeWeather from './components/LocalTimeWeather';
import AudioPlayer from './components/AudioPlayer';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 relative">
        <CosmicBackground />
        <div className="relative z-10">
          <ScrollProgress />
          <Navbar />
          <main>
            <Hero />
            <Stats />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <EducationCertifications />
            <div className="no-print">
              <InteractiveGames />
            </div>
            <Contact />
          </main>
          <div className="no-print">
            <Footer />
            <BackToTop />
            <ChatBot />
            <AudioPlayer />
            
            {/* Floating Widgets Container */}
            <div className="fixed bottom-[110px] right-6 md:bottom-[110px] md:right-8 z-40 pointer-events-auto">
              <LocalTimeWeather />
            </div>

            <LanguagePromptToast />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

