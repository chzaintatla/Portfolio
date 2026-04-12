import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCode,
  FaDatabase,
  FaMobile,
  FaSearch,
  FaChartLine,
  FaCloud,
  FaRobot,
  FaLayerGroup,
  FaTerminal,
  FaShieldAlt,
  FaBullhorn,
} from 'react-icons/fa';
import { 
  SiReact, SiNodedotjs, SiJavascript, SiFlutter, SiPostgresql, 
  SiSupabase, SiGoogleads, SiFacebook, SiDocker, SiAmazonaws, 
  SiPython, SiGraphql, SiTypescript, SiTailwindcss, SiGo 
} from 'react-icons/si';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Premium Frontend & Web',
      icon: <FaLayerGroup />,
      skills: [
        { name: 'React.js & Next.js', icon: <SiReact />, level: 98 },
        { name: 'TypeScript', icon: <SiTypescript />, level: 95 },
        { name: 'Tailwind CSS', icon: <SiTailwindcss />, level: 98 },
        { name: 'Framer Motion', icon: <SiJavascript />, level: 92 },
        { name: 'GraphQL & Apollo', icon: <SiGraphql />, level: 88 },
        { name: 'Web Performance Opt', icon: <FaCode />, level: 94 },
      ],
    },
    {
      title: 'Enterprise Backend',
      icon: <FaTerminal />,
      skills: [
        { name: 'Node.js (Nest/Express)', icon: <SiNodedotjs />, level: 95 },
        { name: 'Python (Django/FastAPI)', icon: <SiPython />, level: 90 },
        { name: 'Go (Golang)', icon: <SiGo />, level: 82 },
        { name: 'Supabase & Firebase', icon: <SiSupabase />, level: 96 },
        { name: 'PostgreSQL & MongoDB', icon: <SiPostgresql />, level: 94 },
        { name: 'Microservices Arch', icon: <FaCode />, level: 88 },
      ],
    },
    {
      title: 'DevOps & Infrastructure',
      icon: <FaCloud />,
      skills: [
        { name: 'AWS (S3/EC2/Lambda)', icon: <SiAmazonaws />, level: 85 },
        { name: 'Docker & K8s', icon: <SiDocker />, level: 88 },
        { name: 'CI/CD Pipelines (Github)', icon: <FaCode />, level: 90 },
        { name: 'Serverless Computing', icon: <FaCloud />, level: 86 },
        { name: 'Database Scalability', icon: <FaDatabase />, level: 92 },
        { name: 'System Security', icon: <FaShieldAlt />, level: 94 },
      ],
    },
    {
      title: 'Mobile Architecture',
      icon: <FaMobile />,
      skills: [
        { name: 'Flutter & Dart (Elite)', icon: <SiFlutter />, level: 98 },
        { name: 'Native iOS/Android SDK', icon: <FaCode />, level: 92 },
        { name: 'State Management (BLoC)', icon: <FaCode />, level: 95 },
        { name: 'Native Method Channels', icon: <FaCode />, level: 90 },
        { name: 'App Performance Opt', icon: <FaCode />, level: 96 },
        { name: 'Offline Data Sync', icon: <FaDatabase />, level: 94 },
      ],
    },
    {
      title: 'Digital Marketing & AI',
      icon: <FaChartLine />,
      skills: [
        { name: 'Meta Ads (Mastery)', icon: <SiFacebook />, level: 98 },
        { name: 'Google Ads & PPC', icon: <SiGoogleads />, level: 94 },
        { name: 'AI Models Integration', icon: <FaRobot />, level: 92 },
        { name: 'Advanced SEO Engine', icon: <FaSearch />, level: 96 },
        { name: 'Data Analytics & ROI', icon: <FaChartLine />, level: 95 },
        { name: 'TikTok Growth Strategy', icon: <FaBullhorn />, level: 90 },
      ],
    },
  ];

  return (
    <section id="skills" className="section-container bg-[#0a192f] py-32 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <span className="text-blue-400 font-bold tracking-[0.3em] uppercase text-sm">Tech Stack</span>
        <h2 className="text-6xl font-black text-white mt-4 tracking-tighter">Commanding Excellence</h2>
        <div className="h-2 w-32 bg-gradient-to-r from-blue-600 to-indigo-700 mx-auto mt-8 rounded-full shadow-lg shadow-blue-500/20" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.1, duration: 0.8 }}
            className="group bg-[#112240] p-10 rounded-[40px] border border-blue-500/10 hover:border-blue-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 text-[160px] text-blue-500/5 group-hover:text-blue-500/10 transition-all transform -rotate-12">
               {category.icon}
            </div>
            
            <div className="flex items-center gap-6 mb-12 relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500 text-3xl border border-blue-500/10">
                {category.icon}
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">{category.title}</h3>
            </div>

            <div className="grid grid-cols-1 gap-8 relative z-10">
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-white font-bold group/skill">
                      <span className="text-blue-400 text-xl group-hover/skill:scale-125 transition-transform">{skill.icon}</span>
                      <span className="text-sm tracking-wide">{skill.name}</span>
                    </div>
                    <span className="text-xs text-blue-500 font-black font-mono">[{skill.level}%]</span>
                  </div>
                  <div className="w-full bg-[#0a192f] rounded-full h-2 shadow-inner border border-blue-500/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + skillIndex * 0.1, duration: 2, ease: "easeOut" }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 h-full rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
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
