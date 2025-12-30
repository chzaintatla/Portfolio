import React from 'react';
import { motion } from 'framer-motion';
import { FaAndroid, FaCode, FaRocket } from 'react-icons/fa';
import profileImage from '../pic.jpeg';

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-20">
      <div className="section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-2xl overflow-hidden">
              <img 
                src={profileImage} 
                alt="Muhammad Zohaib Talha" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4"
          >
            Muhammad Zohaib Talha
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-600 mb-4"
          >
            Senior Android Developer
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 mb-2 font-semibold"
          >
            6+ Years of Building High-Performance Android Apps
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Expert in Kotlin, Java, MVVM, Firebase & Play Store Optimization
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="btn-primary flex items-center gap-2"
            >
              <FaRocket className="text-lg" />
              View Projects
            </button>
            <button
              onClick={() => scrollToSection('meeting')}
              className="btn-secondary flex items-center gap-2"
            >
              <FaCode className="text-lg" />
              Book Free 30-Minute Meeting
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 flex justify-center gap-8 text-gray-400"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600">6+</div>
              <div className="text-sm md:text-base">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600">50+</div>
              <div className="text-sm md:text-base">Apps Developed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600">100K+</div>
              <div className="text-sm md:text-base">Downloads</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

