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
        <h2 className="text-7xl md:text-9xl font-black text-white mt-10 tracking-tighter leading-none italic uppercase">
          Mastering <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-500">
            Digital Systems
          </span>
        </h2>
        <div className="h-1 w-20 bg-blue-600 mx-auto mt-10 rounded-full" />
        
        <p className="max-w-4xl mx-auto text-gray-400 text-xs md:text-sm font-black uppercase tracking-[0.3em] leading-loose mt-16 italic opacity-70">
          "At <strong className="text-blue-400">SparkWave Digital Systems</strong>, we empower businesses to build, scale, and succeed through 
          cutting-edge technology and data-driven marketing."
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-[#112240] p-10 rounded-[32px] border border-blue-500/10 hover:border-blue-500/40 hover:bg-[#1e2d4a] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-blue-600/10 transition-all" />
            <div className="text-blue-500 text-4xl mb-6 group-hover:scale-110 group-hover:text-blue-400 transition-all">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-blue-400 transition-colors">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">{feature.description}</p>
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


