import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a192f] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Latest Insights</h1>
          <p className="text-blue-400 text-lg">Exploring technology, design, and business strategy.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  whileHover={{ y: -10 }}
                  className="bg-[#112240] rounded-2xl overflow-hidden border border-blue-500/10 shadow-xl"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={blog.cover_image || 'https://via.placeholder.com/800x400?text=Blog+Cover'} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <span>Article</span>
                      <span>•</span>
                      <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 hover:text-blue-400 transition-colors">
                      <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                      {blog.excerpt || 'Read the full article to learn more...'}
                    </p>
                    <Link 
                      to={`/blog/${blog.slug}`}
                      className="text-blue-400 font-bold text-sm flex items-center group"
                    >
                      Read More 
                      <span className="ml-2 group-hover:ml-3 transition-all">→</span>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-xl font-medium italic">No articles published yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BlogList;
