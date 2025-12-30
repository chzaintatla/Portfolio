import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const Experience = () => {
  const experiences = [
    {
      title: 'Senior Android Engineer',
      company: 'Hazel Mobile',
      period: 'July 2025 – Present',
      duration: 'Current',
      location: 'Remote',
      achievements: [
        'Leading Android development initiatives and architectural decisions',
        'Mentoring team members and establishing best practices',
        'Developing high-performance Android applications with modern architecture',
        'Collaborating with cross-functional teams for product delivery',
        'Optimizing app performance and user experience',
        'Managing Play Store releases and app updates',
      ],
    },
    {
      title: 'Android Developer',
      company: 'Hazel Mobile',
      period: 'August 2022 – July 2025',
      duration: '3 Years',
      location: 'Remote',
      achievements: [
        'Led development of 15+ Android applications with 100K+ combined downloads',
        'Architected scalable MVVM-based solutions reducing code complexity by 40%',
        'Optimized app performance resulting in 50% faster load times',
        'Mentored junior developers and established coding standards',
        'Successfully published apps on Google Play Store with 4.5+ average ratings',
        'Implemented Firebase Analytics, Crashlytics, and Remote Config',
        'Developed apps using Kotlin, Java, Room DB, Retrofit, and WorkManager',
        'Collaborated with cross-functional teams for seamless product delivery',
      ],
    },
    {
      title: 'Android Developer',
      company: 'JanBark Technologies',
      period: 'November 2021 – July 2022',
      duration: '9 Months',
      location: 'Remote',
      achievements: [
        'Developed 8+ production-ready Android applications',
        'Implemented RESTful API integration using Retrofit and OkHttp',
        'Built responsive UIs following Material Design guidelines',
        'Integrated third-party SDKs including payment gateways and analytics',
        'Performed code reviews and maintained high code quality standards',
        'Reduced app crash rate by 60% through comprehensive testing',
        'Worked with Git version control and Agile development methodologies',
      ],
    },
    {
      title: 'Android Developer',
      company: 'SolutionSurface',
      period: 'May 2020 – October 2021',
      duration: '1 Year 5 Months',
      location: 'Remote',
      achievements: [
        'Developed 10+ Android applications from concept to deployment',
        'Created custom UI components and reusable libraries',
        'Implemented local data persistence using Room Database and SharedPreferences',
        'Integrated Google Maps, Firebase Authentication, and Cloud Messaging',
        'Optimized app size and performance for better user experience',
        'Published apps on Google Play Store and managed app updates',
        'Collaborated with designers to implement pixel-perfect UI designs',
      ],
    },
  ];

  return (
    <section id="experience" className="section-container bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Professional Experience</h2>
        <p className="section-subtitle max-w-3xl mx-auto">
          Over 6 years of professional Android development experience across multiple companies,
          delivering high-quality mobile applications.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200 transform md:-translate-x-1/2" />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`relative mb-12 ${
                index % 2 === 0 ? 'md:pr-1/2 md:pr-8' : 'md:pl-1/2 md:pl-8 md:text-right'
              }`}
            >
              {/* Timeline Dot */}
              <div
                className={`absolute left-4 md:left-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg transform md:-translate-x-1/2 ${
                  index % 2 === 0 ? 'md:left-1/2' : 'md:left-1/2'
                }`}
              />

              <div className={`card ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-0' : 'md:ml-auto'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
                    <FaBriefcase className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{exp.title}</h3>
                    <h4 className="text-xl text-primary-600 font-semibold mb-2">{exp.company}</h4>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-primary-600" />
                    Key Achievements & Responsibilities:
                  </h5>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start gap-2 text-gray-700">
                        <span className="text-primary-600 mt-1.5">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

