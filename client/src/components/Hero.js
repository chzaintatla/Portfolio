import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine } from 'react-icons/fa';

import ceoImage from '../ceo.png';

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-[#0a192f] pt-32 md:pt-40 w-full overflow-x-hidden relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* CEO Picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-blue-600/50 p-2 mb-8 relative"
          >
            <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-2xl animate-pulse" />
            <img 
              src={ceoImage} 
              alt="CEO SparkWave" 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400/1e2d4a/ffffff?text=CEO';
                e.target.onerror = null;
              }}
              className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl relative z-10"
            />

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-8 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-sm font-bold tracking-widest uppercase"
          >
            Empowering Digital Excellence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tighter uppercase italic"
          >
            SparkWave <span className="text-blue-500">Digitals</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-3xl font-bold text-gray-300 mb-8 uppercase tracking-widest"
          >
            Build. Scale. Succeed.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Building high-impact apps and web platforms with a data-driven approach to maximize your business growth and ROI.
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-blue-500/20 flex items-center gap-3"
            >
              <FaRocket />
              Explore My Work
            </button>
            <button
              onClick={() => scrollToSection('meeting')}
              className="px-10 py-4 border border-blue-500/20 text-white hover:bg-blue-500/5 rounded-2xl font-bold transition-all flex items-center gap-3"
            >
              <FaChartLine className="text-blue-500" />
              Book Growth Call
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 flex flex-wrap justify-center gap-12 text-gray-500"
          >
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-blue-500 transition-colors">6+</div>
              <div className="text-xs uppercase tracking-widest font-bold mt-2">Years Experience</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-blue-500 transition-colors">50+</div>
              <div className="text-xs uppercase tracking-widest font-bold mt-2">Projects Completed</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-blue-500 transition-colors">100M+</div>
              <div className="text-xs uppercase tracking-widest font-bold mt-2">Total Downloads</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


