import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaLinkedin, FaTwitter, FaShieldAlt } from 'react-icons/fa';
import ceoImage from '../ceo.png';

const CEOSection = () => {
  const missionStatement = "At SparkWave Digital Systems, our mission is to empower businesses through elite-level digital infrastructure and ROI-driven marketing strategies. We believe in building not just applications, but digital legacies that scale with your ambition.";

  return (
    <section className="py-32 bg-[#050b1a] border-t border-blue-500/10 relative overflow-hidden">
      {/* Background decoration: Cosmic particles effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute rounded-full bg-blue-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
              {/* Animated Rings */}
              <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-4 border border-indigo-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              
              {/* Profile Image Wrap */}
              <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-blue-500/20 shadow-2xl shadow-blue-500/20">
                <img 
                  src={ceoImage} 
                  alt="CEO Profile" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500/112240/ffffff?text=Zain+Ul+Abidin';
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className="inline-flex items-center gap-3 px-6 py-2.5 bg-blue-600/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-blue-500/20 shadow-xl shadow-blue-500/10 transition-all cursor-crosshair"
            >
              <FaShieldAlt className="animate-pulse" /> Leadership Node // 01
            </motion.div>
            
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic leading-none">
                Zain <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-500">Ul Abidin</span>
              </h2>
              <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs pl-1">Founder & System Architect</p>
            </div>

            <div className="relative pl-12 border-l-2 border-blue-500/20">
              <FaQuoteLeft className="text-blue-600/20 text-6xl absolute -top-8 -left-2" />
              <p className="text-xl md:text-3xl text-gray-300 font-medium leading-relaxed italic relative z-10 selection:bg-blue-500/30">
                "{missionStatement}"
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <a href="#" className="w-12 h-12 rounded-xl bg-[#112240] flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg border border-blue-500/10">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-xl bg-[#112240] flex items-center justify-center text-blue-400 hover:bg-blue-400 hover:text-white transition-all shadow-lg border border-blue-500/10">
                <FaTwitter size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CEOSection;
