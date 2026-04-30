import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Services from './Services';
import Testimonials from './Testimonials';
import MeetingScheduler from './MeetingScheduler';
import Contact from './Contact';
import CEOSection from './CEOSection';
import BlogSection from './BlogSection';
import Footer from './Footer';
import { FiArrowUp } from 'react-icons/fi';

const LandingPage = () => {
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Back to top visibility
      setShowBackToTop(window.scrollY > 500);
      
      // Scroll progress calculation
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <Navbar />
      
      {/* Visual Scroll Progress Engine */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Hero />
      <About />
      <Skills />
      <Projects />
      <Services />
      <BlogSection />
      <Testimonials />
      <MeetingScheduler />
      <Contact />
      <CEOSection />
      <Footer />

      {/* Back to Top Terminal */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-28 right-8 w-12 h-12 bg-blue-600 text-white rounded-xl shadow-2xl shadow-blue-500/40 z-[90] flex items-center justify-center hover:bg-blue-700 transition-all border border-white/10 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
            <FiArrowUp size={20} className="relative z-10 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingPage;
