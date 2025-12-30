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
} from 'react-icons/fa';
import { SiKotlin, SiAndroidstudio, SiGoogleplay } from 'react-icons/si';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: <FaCode className="text-3xl" />,
      skills: [
        { name: 'Java', icon: <FaJava />, level: 100 },
        { name: 'Kotlin', icon: <SiKotlin />, level: 100 },
        { name: 'XML', icon: <FaCode />, level: 100 },
      ],
    },
    {
      title: 'Android Framework',
      icon: <FaAndroid className="text-3xl" />,
      skills: [
        { name: 'MVVM Architecture', icon: <FaCode />, level: 98 },
        { name: 'LiveData & ViewModel', icon: <FaMobile />, level: 95 },
        { name: 'Room Database', icon: <FaDatabase />, level: 92 },
        { name: 'WorkManager', icon: <FaTools />, level: 90 },
        { name: 'Jetpack Compose', icon: <FaAndroid />, level: 85 },
        { name: 'Navigation Component', icon: <FaMobile />, level: 93 },
      ],
    },
    {
      title: 'Backend & APIs',
      icon: <FaServer className="text-3xl" />,
      skills: [
        { name: 'Firebase', icon: <FaFire />, level: 95 },
        { name: 'REST APIs', icon: <FaServer />, level: 92 },
        { name: 'Retrofit', icon: <FaCode />, level: 94 },
        { name: 'OkHttp', icon: <FaCode />, level: 90 },
        { name: 'JSON Parsing', icon: <FaCode />, level: 95 },
      ],
    },
    {
      title: 'Tools & Services',
      icon: <FaTools className="text-3xl" />,
      skills: [
        { name: 'Git & GitHub', icon: <FaGitAlt />, level: 95 },
        { name: 'Android Studio', icon: <SiAndroidstudio />, level: 98 },
        { name: 'Play Console', icon: <SiGoogleplay />, level: 90 },
        { name: 'Firebase Analytics', icon: <FaFire />, level: 88 },
        { name: 'Crashlytics', icon: <FaShieldAlt />, level: 90 },
      ],
    },
    {
      title: 'Advanced Features',
      icon: <FaMobile className="text-3xl" />,
      skills: [
        { name: 'Accessibility Services', icon: <FaShieldAlt />, level: 85 },
        { name: 'Sensors Integration', icon: <FaMobile />, level: 88 },
        { name: 'Background Services', icon: <FaTools />, level: 90 },
        { name: 'Push Notifications', icon: <FaMobile />, level: 92 },
        { name: 'In-App Purchases', icon: <FaMobile />, level: 85 },
      ],
    },
    {
      title: 'UI/UX Design',
      icon: <FaPalette className="text-3xl" />,
      skills: [
        { name: 'Material Design', icon: <FaPalette />, level: 95 },
        { name: 'Figma', icon: <FaFigma />, level: 80 },
        { name: 'Custom Views', icon: <FaCode />, level: 90 },
        { name: 'Animations', icon: <FaPalette />, level: 88 },
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
          A comprehensive skill set covering all aspects of Android development, from core
          programming to advanced features and deployment.
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

