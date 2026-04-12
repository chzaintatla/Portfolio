import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects_data';

const ProjectCard = ({ project, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/project/${project.id}`)}
      className="group relative bg-[#112240] rounded-[32px] overflow-hidden cursor-pointer border border-blue-500/10 hover:border-blue-500/30 transition-all shadow-2xl hover:-translate-y-2 duration-500"
    >
      <div className="aspect-video overflow-hidden bg-[#1e2d4a] relative border-b border-blue-500/10">
        <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors z-10" />
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl text-blue-400 group-hover:scale-110 transition-transform duration-700">
            {project.icon}
          </div>
        )}
        <div className="absolute bottom-4 left-4 z-20">
          <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
            {project.category}
          </span>
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mt-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-6">
          {project.tech?.slice(0, 3).map((t, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-wide text-blue-400 bg-blue-500/5 px-3 py-1 rounded-lg border border-blue-500/10">
              {t}
            </span>
          ))}
          {project.tech?.length > 3 && (
            <span className="text-[10px] font-black text-gray-500 bg-gray-500/5 px-3 py-1 rounded-lg border border-gray-500/10">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-blue-500/5 flex items-center justify-between">
           <span className="text-blue-400 text-xs font-black uppercase tracking-widest">Case Study</span>
           <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
              →
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Web', 'Mobile', 'AI', 'System'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="section-container bg-[#0a192f] py-32">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-blue-400 font-bold tracking-[0.3em] uppercase text-sm">Industrial Projects</span>
          <h2 className="text-6xl font-black text-white mt-4 tracking-tighter">Case Studies</h2>
          <div className="h-2 w-32 bg-gradient-to-r from-blue-600 to-indigo-700 mx-auto mt-8 rounded-full shadow-lg shadow-blue-500/20" />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                filter === c 
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/30 -translate-y-1' 
                : 'bg-[#112240] text-gray-400 hover:text-white border border-blue-500/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
