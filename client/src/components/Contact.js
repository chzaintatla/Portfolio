import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaLinkedin, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import { supabase } from '../config/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: 'loading', message: 'Initialising growth Protocol...' });
    
    try {
      const { error } = await supabase.from('leads').insert([
        {
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service_type: formData.serviceType,
          project_budget: formData.budget,
          project_timeline: formData.timeline,
          message: formData.message,
          source: 'System Service Request Form',
          status: 'new'
        }
      ]);

      if (error) throw error;

      setSubmitStatus({
        type: 'success',
        message: 'Request Authorized. Our specialists will reach out via secure channel shortly.',
      });
      
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        company: '', 
        serviceType: '', 
        budget: '', 
        timeline: '', 
        message: '' 
      });
    } catch (error) {
      console.error('Error saving lead:', error.message);
      setSubmitStatus({
        type: 'error',
        message: 'Protocol Breach: Failed to transmit data. Please retry.',
      });
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      label: 'Operational Hotline',
      value: '+92 313 4750136',
      link: 'https://wa.me/923134750136', // Priority WhatsApp Link
    },
    {
      icon: <FaEnvelope />,
      label: 'Digital Correspondence',
      value: 'connect@sparkwave.dev',
      link: 'mailto:connect@sparkwave.dev',
    },
    {
      icon: <FaLinkedin />,
      label: 'Institutional Node',
      value: 'SparkWave Digitals',
      link: 'https://www.linkedin.com/company/sparkwave-digital-solutions/',
    },
  ];

  return (
    <section id="contact" className="section-container bg-[#0a192f] py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Get In Touch</span>
        <h2 className="text-5xl font-bold text-white mt-4">Start Your Growth Journey</h2>
        <div className="h-1.5 w-24 bg-blue-600 mx-auto mt-6 rounded-full" />
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-8">Contact Information</h3>
          <p className="text-gray-400 mb-12 leading-relaxed text-lg">
            Ready to scale your business with cutting-edge apps and high-ROI digital marketing? 
            Reach out to our expert team today.
          </p>

          <div className="space-y-8">
            {contactInfo.map((info, i) => (
              <a 
                key={i}
                href={info.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#112240] flex items-center justify-center text-blue-500 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xl border border-blue-500/5">
                  {info.icon}
                </div>
                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">{info.label}</p>
                  <p className="text-white text-xl font-bold group-hover:text-blue-400 transition-colors">{info.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-16 pt-16 border-t border-blue-500/10">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Social Presence</h4>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/company/sparkwave-digital-solutions/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-[#112240] flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                <FaLinkedin size={20} />
              </a>
              <a href="https://instagram.com/sparkwave.digitals" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-[#112240] flex items-center justify-center text-pink-500 hover:bg-pink-600 hover:text-white transition-all shadow-lg">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Lead Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="bg-[#112240] p-10 rounded-[40px] border border-blue-500/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="+92 3XX XXXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="Company LLC"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Service Vertical</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all h-[58px]"
                >
                  <option value="">Select Service</option>
                  <option value="IT Systems">Enterprise IT Systems</option>
                  <option value="Mobile App">Mobile App (Flutter/Native)</option>
                  <option value="Web App">Custom Web Application</option>
                  <option value="Marketing">Growth Marketing / Meta Ads</option>
                  <option value="Automation">AI & Workflow Automation</option>
                  <option value="Security">Cyber Security / Scaling</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Project Magnitude (Budget)</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all h-[58px]"
                >
                  <option value="">Select Range</option>
                  <option value="< $5k">Under $5k (MVP)</option>
                  <option value="$5k - $20k">$5k - $20k (Scale)</option>
                  <option value="$20k+">$20k+ (Enterprise)</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Deployment Timeline</label>
              <div className="grid grid-cols-3 gap-4">
                 {['Rapid (1-2m)', 'Standard (3-5m)', 'Strategic (6m+)'].map(time => (
                   <button 
                     key={time}
                     type="button"
                     onClick={() => setFormData({...formData, timeline: time})}
                     className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.timeline === time ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#0a192f] border-blue-500/10 text-gray-500 hover:border-blue-500/30'}`}
                   >
                     {time}
                   </button>
                 ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">System briefing (Message)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="Initialise briefing... describe your project or scaling goals."
              />
            </div>

            {submitStatus && (
              <div className={`mb-6 p-4 rounded-2xl text-sm font-bold ${
                submitStatus.type === 'success' ? 'bg-green-600/10 text-green-500' : 'bg-blue-600/10 text-blue-500'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              <FaPaperPlane />
              Send Brief
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
