import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../config/supabase';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiCpu, FiGlobe, FiSettings } from 'react-icons/fi';
import { generateAIResponse } from '../../utils/ai';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    meta_title: '',
    meta_description: '',
    keywords: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!formData.title) {
       alert("Please enter a title first so the AI knows the topic.");
       return;
    }
    setIsAiLoading(true);
    try {
      const res = await generateAIResponse(formData.title, 'blog');
      setFormData({ ...formData, content: res.text });
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('blogs').insert([
        {
          ...formData,
          slug: formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          keywords: formData.keywords.split(',').map(k => k.trim()),
          is_published: false
        }
      ]);
      if (error) throw error;
      setShowModal(false);
      fetchBlogs();
      setFormData({ title: '', content: '', excerpt: '', meta_title: '', meta_description: '', keywords: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  const togglePublish = async (id, currentState) => {
    await supabase.from('blogs').update({ is_published: !currentState }).eq('id', id);
    fetchBlogs();
  };

  const deleteBlog = async (id) => {
    if (window.confirm('Delete article?')) {
      await supabase.from('blogs').delete().eq('id', id);
      fetchBlogs();
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white px-2 border-l-4 border-blue-600">Content Engine</h1>
          <p className="text-gray-400 mt-2 font-medium">Manage your authority assets and SEO performance.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center space-x-3 shadow-2xl shadow-blue-500/20"
        >
          <FiPlus />
          <span>New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div className="flex justify-center py-20 animate-pulse text-blue-500 font-black tracking-widest uppercase">Initializing Digital Manuscripts...</div>
        ) : (
          blogs.map((blog) => (
            <motion.div 
              key={blog.id} 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#112240] p-8 rounded-[48px] border border-blue-500/5 flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-blue-500/20 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col lg:flex-row items-center space-x-0 lg:space-x-10 flex-1 min-w-0 w-full text-center lg:text-left">
                <div className="h-32 w-56 rounded-[32px] bg-[#0a192f] overflow-hidden border border-blue-500/10 shadow-2xl relative mb-6 lg:mb-0">
                  <img src={blog.cover_image || 'https://via.placeholder.com/400x300?text=SparkWave'} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-3">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                      blog.is_published 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5'
                    }`}>
                      {blog.is_published ? 'LIVE ON REPLICATED NETWORK' : 'PENDING APPROVAL'}
                    </span>
                    {blog.meta_title && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-400 rounded-full border border-blue-500/10 text-[9px] font-black">
                        <FiGlobe size={10} /> SEO ACTIVE
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-white truncate max-w-full tracking-tight">{blog.title}</h3>
                  <p className="text-gray-500 text-xs mt-2 font-mono italic opacity-60">protocol://{blog.slug}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => togglePublish(blog.id, blog.is_published)} 
                  title={blog.is_published ? "Retract from site" : "Deploy to site"}
                  className={`p-5 rounded-2xl transition-all border ${
                    blog.is_published 
                      ? 'bg-amber-500/5 text-amber-500 border-amber-500/10 hover:bg-amber-500 hover:text-white' 
                      : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  {blog.is_published ? <FiXCircle size={22} /> : <FiCheckCircle size={22} />}
                </button>
                <button className="p-5 bg-blue-500/5 text-blue-400 rounded-2xl border border-blue-500/10 hover:bg-blue-600 hover:text-white transition-all shadow-xl hover:shadow-blue-500/20">
                  <FiEdit2 size={22} />
                </button>
                <button 
                  onClick={() => deleteBlog(blog.id)} 
                  className="p-5 bg-red-500/5 text-red-500 rounded-2xl border border-red-500/10 hover:bg-red-600 hover:text-white transition-all shadow-xl hover:shadow-red-500/20"
                >
                  <FiTrash2 size={22} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Advanced Editorial Studio Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050b1a] backdrop-blur-3xl overflow-y-auto">
          <div className="bg-[#0d152a] w-full max-w-5xl rounded-[64px] p-12 lg:p-16 border border-blue-500/20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] my-8">
            <div className="flex justify-between items-start mb-16">
               <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-3 h-10 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" />
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Manuscript <span className="text-blue-500">Editor</span></h2>
                  </div>
                  <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px] pl-7 opacity-50">Enterprise Editorial Environment v4.0</p>
               </div>
               <button onClick={() => setShowModal(false)} className="w-16 h-16 flex items-center justify-center bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-gray-400 rounded-[28px] transition-all text-4xl font-light">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 form-scroll-node custom-scrollbar">
                  <div className="lg:col-span-2 space-y-10">
                     <div className="group">
                        <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 pl-1">Narrative Hook (Excerpt)</label>
                        <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full bg-[#050b1a] border border-blue-500/10 rounded-[32px] px-8 py-6 text-gray-300 min-h-[160px] outline-none focus:border-blue-500/50 transition-all font-medium leading-relaxed shadow-inner" placeholder="Summarize your article's core value proposition..." />
                     </div>

                     <div className="group">
                        <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 pl-1">Article Headline</label>
                        <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#112240] border border-blue-500/10 rounded-[28px] px-8 py-6 text-white focus:border-blue-500/50 outline-none transition-all font-black text-2xl shadow-xl" placeholder="The Future of Digital Excellence..." required />
                     </div>
                     
                     <div className="relative group">
                        <div className="flex justify-between items-center mb-4 pl-1">
                           <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Source Manuscript</label>
                           <button type="button" onClick={handleAiGenerate} disabled={isAiLoading} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[20px] font-black text-[10px] uppercase shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                              <FiCpu size={14} /> {isAiLoading ? 'Synthesizing...' : 'AI Generate Draft'}
                           </button>
                        </div>
                        <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-[#050b1a] border border-blue-500/10 rounded-[40px] px-10 py-10 text-gray-200 min-h-[600px] outline-none focus:border-blue-500/50 transition-all font-mono text-sm leading-8 shadow-inner" placeholder="Compose your digital masterpiece..." required />
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="bg-[#050b1a] p-10 rounded-[40px] border border-blue-500/5 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8 border-b border-blue-500/10 pb-6">
                           <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl"><FiSettings size={20} /></div>
                           <h4 className="text-white font-black text-xs uppercase tracking-widest">SEO Engine</h4>
                        </div>
                        
                        <div className="space-y-6">
                           <div>
                              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Cover Assets URL</label>
                              <input value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} className="w-full bg-[#112240] border border-blue-500/10 rounded-xl px-4 py-3 text-white text-xs font-bold" placeholder="https://..." />
                           </div>
                           <div>
                              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">SEO Meta Title</label>
                              <input value={formData.meta_title} onChange={e => setFormData({...formData, meta_title: e.target.value})} className="w-full bg-[#112240] border border-blue-500/10 rounded-xl px-4 py-3 text-white text-xs font-bold" />
                           </div>
                           <div>
                              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Search Keywords</label>
                              <input value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} className="w-full bg-[#112240] border border-blue-500/10 rounded-xl px-4 py-3 text-white text-xs font-bold" placeholder="growth, tech, agile..." />
                           </div>
                        </div>
                     </div>

                     <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[40px] shadow-2xl text-white">
                        <h4 className="font-black text-sm uppercase tracking-widest mb-4">Publishing Status</h4>
                        <p className="text-sm opacity-80 mb-6 font-medium">Your work is currently saved as a private draft. Deploy to live servers for public viewing.</p>
                        <button type="submit" className="w-full py-5 bg-white text-blue-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-black/20 duration-300">Deploy To Live Site</button>
                        <button type="button" onClick={() => setShowModal(false)} className="w-full py-4 mt-3 text-white/60 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">Retain as Draft</button>
                     </div>
                  </div>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
