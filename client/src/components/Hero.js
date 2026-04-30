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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-7xl md:text-[12rem] font-black text-white mb-2 leading-[0.8] tracking-tighter uppercase italic"
          >
            Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-500">
              Systems
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xs md:text-sm font-black text-blue-500 mb-16 uppercase tracking-[1.5em] opacity-80"
          >
            SparkWave Digital Systems
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-3xl text-gray-400 mb-20 max-w-5xl mx-auto leading-relaxed font-medium italic"
          >
            "Building high-impact digital architectures with a data-driven approach to maximize your business ROI."
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col md:flex-row gap-8 justify-center items-center"
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="px-14 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center gap-4"
            >
              <FaRocket size={18} />
              Verify Our Portfolio
            </button>
            <button
              onClick={() => scrollToSection('meeting')}
              className="px-14 py-6 border-2 border-blue-500/20 text-white hover:bg-blue-600 hover:border-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center gap-4 group"
            >
              <FaChartLine className="text-blue-500 group-hover:text-white transition-colors" size={18} />
              Secure Growth Briefing
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-32 flex flex-wrap justify-center gap-16"
          >
            {[
              { label: 'Market Tenure', value: '06+', sub: 'Years' },
              { label: 'Assets Delivered', value: '50+', sub: 'Projects' },
              { label: 'Uplink Capacity', value: '100M+', sub: 'Reach' }
            ].map((stat, i) => (
              <div key={i} className="text-center bg-[#112240] p-10 rounded-[40px] border border-blue-500/5 hover:border-blue-500/20 transition-all custom-shadow min-w-[200px]">
                <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-500 opacity-60 mb-1">{stat.label}</div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-500">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


