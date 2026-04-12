import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCode,
  FaSearch,
  FaMobile,
  FaBullhorn,
  FaShieldAlt,
  FaRobot,
} from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: <FaCode />,
      title: 'Full Stack Systems',
      description: 'End-to-end web applications with React, Node.js and Supabase. Scalable, secure, and performant.',
      features: ['Real-time Apps', 'Admin Dashboards', 'API Integration', 'Cloud Deployment'],
      color: 'blue'
    },
    {
      icon: <FaMobile />,
      title: 'Mobile App Solutions',
      description: 'High-performance mobile apps for iOS and Android using Flutter and native Android SDK.',
      features: ['Cross-platform', 'Offline-first', 'Push Notifications', 'App Store Ready'],
      color: 'purple'
    },
    {
      icon: <FaBullhorn />,
      title: 'Growth Marketing',
      description: 'Acquire users at scale with Meta (Facebook/Insta) and TikTok Ads. ROI-driven campaigns.',
      features: ['Meta Ads Expert', 'TikTok Marketing', 'Funnel Optimization', 'Retargeting'],
      color: 'pink'
    },
    {
      icon: <FaSearch />,
      title: 'SEO & Visibility',
      description: 'Dominate search rankings and drive organic traffic with advanced technical SEO.',
      features: ['Keyword Strategy', 'Technical SEO', 'Content Clusters', 'Performance SEO'],
      color: 'green'
    },
    {
      icon: <FaRobot />,
      title: 'System Automation',
      description: 'Automate repetitive business tasks and integrate AI into your workflows.',
      features: ['Crm Automation', 'Zapier/Make.com', 'AI Chatbots', 'Workflow Design'],
      color: 'orange'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Security & Scaling',
      description: 'Relational database design (SQL/Oracle) and server-side security hardening.',
      features: ['SQL Optimization', 'Security Audits', 'Load Balancing', 'Backup Strategies'],
      color: 'red'
    }
  ];

  return (
    <section id="services" className="section-container bg-[#0a192f] py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Services</span>
        <h2 className="text-5xl font-bold text-white mt-4">Premium Business Solutions</h2>
        <div className="h-1.5 w-24 bg-blue-600 mx-auto mt-6 rounded-full" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-10 bg-[#112240] rounded-3xl border border-blue-500/10 hover:border-blue-500/30 transition-all relative overflow-hidden"
          >
            <div className={`text-4xl text-${service.color}-500 mb-6 group-hover:scale-110 transition-transform duration-500`}>
              {service.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              {service.description}
            </p>
            
            <ul className="space-y-3">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-center text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                  <span className={`w-1.5 h-1.5 rounded-full bg-${service.color}-500 mr-2 opacity-50`} />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-24 p-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[40px] text-center shadow-2xl shadow-blue-500/20"
      >
        <h3 className="text-3xl md:text-4xl font-black text-white mb-6">Need a custom enterprise solution?</h3>
        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          Let’s build something that doesn’t just work, but scales your business to the next level.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black hover:bg-gray-100 transition-all transform hover:scale-105">
            Book a Strategy Call
          </button>
          <button className="px-10 py-4 border-2 border-white/20 text-white rounded-2xl font-black hover:bg-white/10 transition-all">
            View Pricing Packages
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Services;


