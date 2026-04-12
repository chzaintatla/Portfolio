import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechFlow Solutions',
      content: 'Zain transformed our outdated system into a modern, scalable platform. His growth strategies increased our lead generation by 40% in just two months.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'David Chen',
      role: 'Marketing Director, Global Retail',
      content: 'The custom CRM Zain built for us is a game-changer. His expertise in both development and Meta Ads is truly unique and highly valuable.',
      rating: 5,
      avatar: 'DC'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Founder, EcoStay',
      content: 'Professional, efficient, and highly creative. Zain doesn’t just deliver code; he delivers business results. Highly recommended for any scaling startup.',
      rating: 5,
      avatar: 'ER'
    }
  ];

  return (
    <section className="bg-[#0a192f] py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Testimonials</span>
          <h2 className="text-5xl font-bold text-white mt-4">What Clients Say</h2>
          <div className="h-1.5 w-24 bg-blue-600 mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#112240] p-10 rounded-3xl border border-blue-500/10 relative group hover:border-blue-500/30 transition-all"
            >
              <FaQuoteLeft className="text-4xl text-blue-600/20 absolute top-10 right-10 group-hover:text-blue-600/40 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              
              <p className="text-gray-300 italic mb-8 leading-relaxed">
                "{t.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <p className="text-blue-400 text-xs font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
