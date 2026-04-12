import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, FaMicrochip, FaArrowLeft 
} from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import { projects } from '../data/projects';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const foundProject = projects.find(p => p.id === parseInt(id));
    setProject(foundProject);
    window.scrollTo(0, 0);
  }, [id]);

  const handleScaleClick = () => {
    const element = document.getElementById('meeting');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to home page and scroll to meeting
      navigate('/', { state: { scrollTo: 'meeting' } });
    }
  };

  if (!project) return null;

  return (
    <div className="bg-[#0a192f] min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div className="flex-1">
              <Link to="/" className="text-blue-400 font-bold flex items-center gap-2 mb-8 hover:opacity-70 transition-all">
                <FaArrowLeft />
                Back to Portfolio
              </Link>
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 text-3xl border border-blue-500/10">
                    {project.icon}
                 </div>
                 <span className="text-blue-400 font-black uppercase tracking-[0.2em] text-xs px-4 py-1.5 bg-blue-600/5 rounded-full border border-blue-600/10">
                   {project.category}
                 </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{project.title}</h1>
            </div>
            {project.role && (
              <div className="p-8 bg-[#112240] rounded-3xl border border-blue-500/10 shadow-2xl">
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">My Contribution</p>
                <p className="text-white font-bold text-xl">{project.role}</p>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Image & Tech */}
            <div className="lg:col-span-2 space-y-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[40px] overflow-hidden border border-blue-500/10 shadow-2xl bg-[#112240]"
              >
                <img src={project.image || 'https://via.placeholder.com/1200x800/112240/ffffff?text=Project+Preview'} alt={project.title} className="w-full h-auto" />
              </motion.div>

              <div className="bg-[#112240] p-12 rounded-[40px] border border-blue-500/10 shadow-2xl">
                <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                  <FaMicrochip className="text-blue-500" /> Technical Architecture
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {project.techStack?.map((tech, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-[#0a192f] border border-blue-500/5 hover:border-blue-500/20 transition-all custom-shadow group">
                      <h4 className="text-blue-400 font-black text-lg mb-2 group-hover:translate-x-1 transition-transform">{tech.name}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Descriptions & Specs */}
            <div className="space-y-8">
              <div className="bg-[#112240] p-10 rounded-[40px] border border-blue-500/10 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-6">Execution Overview</h3>
                <p className="text-gray-400 leading-relaxed font-bold text-lg mb-8 italic">
                  "{project.description}"
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {project.longDescription || "This project represents a sophisticated approach to technical problem-solving, focusing on high-scalability and robust user experiences. Built with performance as a priority."}
                </p>
              </div>

              <div className="bg-[#112240] p-10 rounded-[40px] border border-blue-500/10 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-8">Solution Features</h3>
                <div className="space-y-6">
                  {project.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 mt-1 shrink-0">
                        <FaCheckCircle size={14} />
                      </div>
                      <p className="text-gray-400 font-bold text-sm tracking-wide">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-10 rounded-[40px] shadow-2xl shadow-blue-500/20">
                <h3 className="text-2xl font-black text-white mb-4">Need scaling?</h3>
                <p className="text-blue-100 mb-8 opacity-80">I can architect a similar high-performance platform for your business requirements.</p>
                <button 
                   onClick={handleScaleClick}
                   className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black text-lg hover:scale-[1.02] transition-all"
                >
                  Book Growth Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
