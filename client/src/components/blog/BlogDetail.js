import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Helmet } from 'react-helmet-async';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) return (
    <div className="bg-[#0a192f] min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!blog) return (
    <div className="bg-[#0a192f] min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
      <Link to="/blog" className="text-blue-400 hover:underline">Return to Blog</Link>
    </div>
  );

  return (
    <div className="bg-[#0a192f] min-h-screen">
      <Helmet>
        <title>{blog.meta_title || blog.title}</title>
        <meta name="description" content={blog.meta_description || blog.excerpt} />
        {blog.keywords && <meta name="keywords" content={blog.keywords.join(', ')} />}
      </Helmet>
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 py-32">
        <header className="mb-12">
          <Link to="/blog" className="text-blue-400 text-sm font-bold flex items-center mb-8 hover:opacity-80">
            <span className="mr-2">←</span> Back to Insights
          </Link>
          <div className="flex items-center space-x-2 text-blue-400 text-sm font-bold uppercase tracking-widest mb-4">
            <span>{new Date(blog.published_at).toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-8">
            {blog.title}
          </h1>
          {blog.cover_image && (
            <div className="rounded-3xl overflow-hidden shadow-2xl mb-12">
              <img src={blog.cover_image} alt={blog.title} className="w-full h-auto" />
            </div>
          )}
        </header>

        <div 
          className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <footer className="mt-20 pt-10 border-t border-blue-500/10">
          <div className="bg-[#112240] p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between">
            <div>
              <h4 className="text-white font-bold text-xl">Love this article?</h4>
              <p className="text-gray-400 mt-2">Share it with your network or talk to us about your next project.</p>
            </div>
            <Link to="/#contact" className="mt-6 md:mt-0 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Get in Touch
            </Link>
          </div>
        </footer>
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;
