import React from 'react';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaCode, FaChartLine, FaShieldAlt, FaDatabase, FaBullhorn } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaCode />,
      title: 'Full-Stack Development',
      description: 'React.js, Node.js, and modern frameworks for high-performance web systems.',
    },
    {
      icon: <FaMobileAlt />,
      title: 'Mobile App Expert',
      description: 'Building cross-platform mobile experiences with Flutter and Android SDK.',
    },
    {
      icon: <FaBullhorn />,
      title: 'Digital Marketing',
      description: 'Growth-focused strategies using Meta Ads, TikTok Ads, and lead generation.',
    },
    {
      icon: <FaDatabase />,
      title: 'System Architecture',
      description: 'Scalable backend systems using MongoDB, Supabase, and SQL optimization.',
    },
    {
      icon: <FaChartLine />,
      title: 'Growth Marketing',
      description: 'Data-driven insights and SEO to scale your digital presence globally.',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Security & Automation',
      description: 'Robust security handling and business process automation for efficiency.',
    },
  ];

  return (
    <section id="about" className="section-container bg-[#0a192f] py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Our Mission</span>
        <h2 className="text-5xl font-bold text-white mt-4 mb-6">
          SparkWave <span className="text-blue-500">Digital Solutions</span>
        </h2>
        <p className="max-w-4xl mx-auto text-gray-300 text-xl leading-relaxed italic border-l-4 border-blue-600 pl-8 py-4 bg-blue-600/5 rounded-r-2xl">
          "At <strong>SparkWave Digital Solutions</strong>, we empower businesses to build, scale, and succeed through 
          cutting-edge technology and data-driven marketing, delivering high-quality apps, web platforms, 
          and growth-focused solutions that maximize ROI and create lasting impact."
        </p>

      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-[#112240] p-8 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-all group"
          >
            <div className="text-blue-500 text-3xl mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-12 border border-blue-500/10 text-center"
      >
        <h3 className="text-3xl font-bold text-white mb-8 italic">
          "I build products that sell and systems that scale."
        </h3>
        <div className="flex flex-wrap justify-center gap-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">✓</div>
            <span className="text-gray-300 font-bold">Client Magnet Strategy</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">✓</div>
            <span className="text-gray-300 font-bold">ROI Focused Development</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">✓</div>
            <span className="text-gray-300 font-bold">Automation First Approach</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;


