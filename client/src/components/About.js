import React from 'react';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaCode, FaRocket, FaUsers, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaCode className="text-4xl" />,
      title: 'Full-Stack Development',
      description: 'Complete web and mobile solutions from frontend to backend, ensuring seamless integration and scalability',
    },
    {
      icon: <FaMobileAlt className="text-4xl" />,
      title: 'Mobile & Web Apps',
      description: 'Native and cross-platform mobile applications plus responsive web applications for all devices',
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: 'SEO & Digital Marketing',
      description: 'Comprehensive SEO strategies and data-driven marketing campaigns to boost online visibility and growth',
    },
    {
      icon: <FaRocket className="text-4xl" />,
      title: 'Performance & Optimization',
      description: 'Optimized solutions with fast load times, smooth user experience, and cloud scalability',
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: 'User-Centric Design',
      description: 'Intuitive UI/UX design following modern design principles with accessibility in mind',
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Security & Maintenance',
      description: 'Robust security measures, regular updates, and 24/7 support for your digital solutions',
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
          Building Scalable & High-Quality Digital Solutions
        </h2>
        <p className="section-subtitle max-w-3xl mx-auto">
          With over 6 years of professional experience, I specialize in creating robust, performant,
          and user-friendly digital solutions including web development, mobile apps, SEO, digital marketing,
          and cloud solutions that deliver exceptional value.
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
                  Extensive hands-on experience in web development, mobile apps, SEO, and digital marketing across various industries
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Full-Stack Expertise</h4>
                <p className="text-gray-600">
                  From frontend design to backend development, database management, and cloud deployment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">SEO & Marketing Excellence</h4>
                <p className="text-gray-600">
                  Proven strategies to improve search rankings, drive organic traffic, and grow your online presence
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cloud & Scalability</h4>
                <p className="text-gray-600">
                  Scalable cloud solutions with AWS, Azure, and modern DevOps practices for optimal performance
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

