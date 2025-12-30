import React from 'react';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaCode, FaRocket, FaUsers, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaMobileAlt className="text-4xl" />,
      title: 'End-to-End Development',
      description: 'Complete Android app lifecycle from concept to Play Store deployment',
    },
    {
      icon: <FaCode className="text-4xl" />,
      title: 'Clean Architecture',
      description: 'MVVM, Repository Pattern, and SOLID principles for maintainable code',
    },
    {
      icon: <FaRocket className="text-4xl" />,
      title: 'Performance Optimization',
      description: 'Optimized apps with fast load times and smooth user experience',
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: 'User-Centric Design',
      description: 'Intuitive UI/UX following Material Design guidelines',
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: 'Play Store Success',
      description: 'Proven track record of apps with high ratings and downloads',
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Quality Assurance',
      description: 'Rigorous testing and bug-free releases',
    },
  ];

  return (
    <section id="about" className="section-container bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="section-title">
          Building Scalable & High-Quality Android Applications
        </h2>
        <p className="section-subtitle max-w-3xl mx-auto">
          With over 6 years of professional Android development experience, I specialize in creating
          robust, performant, and user-friendly mobile applications that deliver exceptional value.
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
            className="card text-center"
          >
            <div className="text-primary-600 mb-4 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-16 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12"
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            What Sets Me Apart
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">6+ Years Professional Experience</h4>
                <p className="text-gray-600">
                  Extensive hands-on experience in Android development across various industries
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Expertise in Full App Lifecycle</h4>
                <p className="text-gray-600">
                  From initial concept and design to development, testing, and Play Store deployment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Focus on Performance & Quality</h4>
                <p className="text-gray-600">
                  Clean architecture, optimized code, and rigorous testing for bug-free releases
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">User Experience Excellence</h4>
                <p className="text-gray-600">
                  Intuitive interfaces following Material Design with accessibility in mind
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;

