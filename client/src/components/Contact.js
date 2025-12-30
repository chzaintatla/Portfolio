import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaLinkedin, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    
    // Create WhatsApp message
    const phoneNumber = '13073104711'; // Your WhatsApp number (without +)
    const message = `Hello! I'm ${formData.name} (${formData.email}).\n\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    setSubmitStatus({
      type: 'success',
      message: 'Opening WhatsApp to send your message...',
    });
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <FaWhatsapp className="text-2xl" />,
      label: 'WhatsApp',
      value: '+1 (307) 310-4711',
      link: 'https://wa.me/13073104711',
    },
    {
      icon: <FaPhone className="text-2xl" />,
      label: 'Phone',
      value: '+1 (307) 310-4711',
      link: 'tel:+13073104711',
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      label: 'Email',
      value: 'ctoshadowlink@gmail.com',
      link: 'mailto:ctoshadowlink@gmail.com',
    },
    {
      icon: <FaLinkedin className="text-2xl" />,
      label: 'LinkedIn',
      value: 'Digital Optimistic LLC',
      link: 'https://www.linkedin.com/company/digital-optimistic/',
    },
  ];

  const socialLinks = [
    {
      icon: <FaLinkedin />,
      name: 'LinkedIn',
      url: 'https://pk.linkedin.com/in/mrzaibe',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: <FaInstagram />,
      name: 'Instagram',
      url: '#',
      color: 'bg-pink-600 hover:bg-pink-700',
    },
    {
      icon: <FaFacebook />,
      name: 'Facebook',
      url: '#',
      color: 'bg-blue-800 hover:bg-blue-900',
    },
  ];

  return (
    <section id="contact" className="section-container bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Let's Build Something Great Together</h2>
        <p className="section-subtitle max-w-3xl mx-auto">
          Have a project in mind? Want to collaborate? Or just want to say hello? I'd love to hear
          from you!
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h3>
          <div className="space-y-6 mb-8">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : '_self'}
                rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-3 bg-primary-100 text-primary-600 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {info.icon}
                </div>
                <div>
                  <div className="text-sm text-gray-500">{info.label}</div>
                  <div className="text-lg font-semibold text-gray-900">{info.value}</div>
                </div>
              </motion.a>
            ))}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Connect on Social Media</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`${social.color} text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h3>
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell me about your project or how I can help..."
              />
            </div>

            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitStatus.message}
              </motion.div>
            )}

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
            >
              <FaWhatsapp />
              Send via WhatsApp
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

