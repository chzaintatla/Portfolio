import React from 'react';
import { motion } from 'framer-motion';
import {
  FaJava,
  FaCode,
  FaDatabase,
  FaFire,
  FaGitAlt,
  FaFigma,
  FaAndroid,
  FaMobile,
  FaServer,
  FaPalette,
  FaTools,
  FaShieldAlt,
  FaSearch,
  FaChartLine,
  FaCloud,
  FaShoppingCart,
  FaBullhorn,
} from 'react-icons/fa';
import { SiKotlin, SiAndroidstudio, SiGoogleplay, SiReact, SiNodedotjs, SiJavascript, SiHtml5, SiCss3, SiMongodb, SiAmazonaws, SiGooglecloud } from 'react-icons/si';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Web Development',
      icon: <FaCode className="text-3xl" />,
      skills: [
        { name: 'React.js & Next.js', icon: <SiReact />, level: 95 },
        { name: 'Node.js & Express', icon: <SiNodedotjs />, level: 92 },
        { name: 'JavaScript & TypeScript', icon: <SiJavascript />, level: 95 },
        { name: 'HTML5 & CSS3', icon: <SiHtml5 />, level: 98 },
        { name: 'REST APIs', icon: <FaServer />, level: 94 },
        { name: 'MongoDB & Databases', icon: <SiMongodb />, level: 90 },
      ],
    },
    {
      title: 'Mobile Development',
      icon: <FaMobile className="text-3xl" />,
      skills: [
        { name: 'Android (Kotlin/Java)', icon: <FaAndroid />, level: 98 },
        { name: 'MVVM Architecture', icon: <FaCode />, level: 98 },
        { name: 'React Native', icon: <SiReact />, level: 90 },
        { name: 'Room Database', icon: <FaDatabase />, level: 92 },
        { name: 'Firebase Integration', icon: <FaFire />, level: 95 },
        { name: 'Play Store Deployment', icon: <SiGoogleplay />, level: 95 },
      ],
    },
    {
      title: 'SEO & Digital Marketing',
      icon: <FaSearch className="text-3xl" />,
      skills: [
        { name: 'SEO Optimization', icon: <FaSearch />, level: 95 },
        { name: 'Keyword Research', icon: <FaSearch />, level: 92 },
        { name: 'Content Marketing', icon: <FaBullhorn />, level: 90 },
        { name: 'Social Media Marketing', icon: <FaChartLine />, level: 88 },
        { name: 'PPC & Analytics', icon: <FaChartLine />, level: 90 },
        { name: 'Link Building', icon: <FaSearch />, level: 85 },
      ],
    },
    {
      title: 'Cloud & DevOps',
      icon: <FaCloud className="text-3xl" />,
      skills: [
        { name: 'AWS Services', icon: <SiAmazonaws />, level: 90 },
        { name: 'Google Cloud', icon: <SiGooglecloud />, level: 85 },
        { name: 'CI/CD Pipelines', icon: <FaTools />, level: 88 },
        { name: 'Docker & Containers', icon: <FaCloud />, level: 85 },
        { name: 'Serverless Functions', icon: <FaServer />, level: 90 },
        { name: 'Git & Version Control', icon: <FaGitAlt />, level: 95 },
      ],
    },
    {
      title: 'E-Commerce & Business',
      icon: <FaShoppingCart className="text-3xl" />,
      skills: [
        { name: 'E-Commerce Platforms', icon: <FaShoppingCart />, level: 92 },
        { name: 'Payment Gateways', icon: <FaShoppingCart />, level: 90 },
        { name: 'Inventory Management', icon: <FaDatabase />, level: 88 },
        { name: 'Order Tracking Systems', icon: <FaChartLine />, level: 90 },
        { name: 'Business Analytics', icon: <FaChartLine />, level: 88 },
      ],
    },
    {
      title: 'UI/UX & Design',
      icon: <FaPalette className="text-3xl" />,
      skills: [
        { name: 'UI/UX Design', icon: <FaPalette />, level: 95 },
        { name: 'Figma & Design Tools', icon: <FaFigma />, level: 90 },
        { name: 'Responsive Design', icon: <FaCode />, level: 98 },
        { name: 'Material Design', icon: <FaPalette />, level: 95 },
        { name: 'Prototyping', icon: <FaPalette />, level: 88 },
      ],
    },
  ];

  return (
    <section id="skills" className="section-container bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Technical Expertise</h2>
        <p className="section-subtitle max-w-3xl mx-auto">
          A comprehensive skill set covering web development, mobile apps, SEO, digital marketing,
          cloud solutions, and more - delivering end-to-end digital solutions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="text-primary-600">{category.icon}</div>
              <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
            </div>
            <div className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="text-primary-600">{skill.icon}</span>
                      <span>{skill.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05, duration: 1 }}
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-2.5 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;

