import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
        const { data } = await supabase
          .from('blogs')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(3);
        setBlogs(data || []);
    };
    fetchBlogs();
  }, []);

  // Remove strict null return to keep the section visible as an architectural placeholder
  // if (blogs.length === 0) return null;

  return (
    <section id="blog" className="section-container bg-[#0a192f] py-40 border-t border-blue-500/5">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <h2 className="text-7xl md:text-9xl font-black text-white mt-4 tracking-tighter leading-none italic uppercase">
            Intelligence
          </h2>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mt-8 opacity-80">
            SparkWave Digital Systems • Knowledge Synthesis Node
          </p>
        </motion.div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Main Feature Article */}
            {blogs[0] && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link to={`/blog/${blogs[0].slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[60px] border border-blue-500/10 shadow-3xl mb-10 bg-[#112240]">
                    <img 
                      src={blogs[0].cover_image || 'https://via.placeholder.com/1200x800/112240/ffffff?text=Feature+Insight'} 
                      alt={blogs[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="space-y-6 px-6">
                      <span className="text-blue-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                          <FiBookOpen /> Featured Transmission
                      </span>
                      <h3 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter group-hover:text-blue-400 transition-colors">
                          {blogs[0].title}
                      </h3>
                      <p className="text-gray-400 text-lg leading-relaxed line-clamp-3">
                          {blogs[0].excerpt}
                      </p>
                      <div className="pt-4 flex items-center text-white font-black uppercase tracking-widest text-xs gap-3 group-hover:translate-x-2 transition-transform">
                          Read Manuscript <FiArrowRight className="text-blue-500" />
                      </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Side Articles */}
            <div className="space-y-16">
              {blogs.slice(1).map((blog, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group flex flex-col md:flex-row gap-8 items-center"
                >
                  <Link to={`/blog/${blog.slug}`} className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="w-full md:w-48 h-32 shrink-0 rounded-3xl overflow-hidden border border-blue-500/10 bg-[#112240]">
                          <img 
                              src={blog.cover_image || 'https://via.placeholder.com/400x300/112240/ffffff?text=Insight'} 
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                      </div>
                      <div>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                              {new Date(blog.published_at).toLocaleDateString()}
                          </span>
                          <h4 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors">
                              {blog.title}
                          </h4>
                          <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                              View Protocol <FiArrowRight />
                          </div>
                      </div>
                  </Link>
                </motion.div>
              ))}

              <div className="pt-10">
                  <Link 
                      to="/blog" 
                      className="inline-flex items-center gap-4 text-white font-black uppercase tracking-[0.2em] text-sm group"
                  >
                      <span className="h-0.5 w-12 bg-blue-600 group-hover:w-20 transition-all" />
                      Expand Knowledge Base
                  </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-[#112240]/30 rounded-[60px] border border-blue-500/5">
             <span className="text-blue-500 text-sm font-black uppercase tracking-[0.5em] animate-pulse">Intelligence Node Scrambled</span>
             <p className="text-gray-500 italic mt-4">Secure transmissions pending. New insights arriving momentarily.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
