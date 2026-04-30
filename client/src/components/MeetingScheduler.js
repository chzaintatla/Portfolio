import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaComment, FaCheckCircle, FaUsers, FaPhone } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const MeetingScheduler = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: 'loading', message: 'Securing your slot...' });
    
    if (!selectedDate || !selectedTime) {
      setSubmitStatus({ type: 'error', message: 'Please select a date and time' });
      return;
    }

    const startDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    startDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);

    try {
      const { error } = await supabase.from('meetings').insert([
        {
          title: `Growth Strategy: ${formData.name}`,
          description: formData.message,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          client_id: user?.id || null, // Link to account if logged in
          status: 'pending'
        }
      ]);

      if (error) throw error;

      // Also save as a lead
      await supabase.from('leads').insert([
        {
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `BOOKED MEETING for ${startDateTime.toLocaleString()}\n\nNote: ${formData.message}`,
          source: 'Meeting Scheduler',
          status: 'new'
        }
      ]);

      setSubmitStatus({
        type: 'success',
        message: 'Strategy Briefing Requested! Once authorized, you can login to your terminal to chat directly with our specialists.',
      });
      
      // Optionally show a login button after success
      setFormData({ ...formData, showLoginLink: true });
      
      setSelectedDate(null);
      setSelectedTime('');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error booking meeting:', error.message);
      setSubmitStatus({
        type: 'error',
        message: 'Could not schedule. Please try again or contact us directly.',
      });
    }
  };

  return (
    <section id="meeting" className="section-container bg-[#0a192f] py-16 border-t border-blue-500/5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Scheduler</span>
        <h2 className="text-5xl font-bold text-white mt-4">Book a Strategy Call</h2>
        <div className="h-1.5 w-24 bg-blue-600 mx-auto mt-6 rounded-full" />
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="space-y-8"
        >
          <div className="bg-[#112240] p-10 rounded-[48px] border border-blue-500/10 shadow-2xl space-y-8 col-span-1 lg:col-span-2 scrollable-terminal custom-scrollbar">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FaUsers className="text-blue-500" />
              What to Expect
            </h3>
            <ul className="space-y-6">
              {[
                'Identify your business bottleneck.',
                'Discover ROI-focused tech solutions.',
                'Get a clear roadmap for scaling.',
                'Personalized attention from our senior team.'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 mt-1 shrink-0">
                    <FaCheckCircle size={14} />
                  </div>
                  <p className="text-gray-400 leading-relaxed font-medium">{text}</p>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-8">
            <h4 className="text-white font-bold mb-4 italic text-xl">"Success begins with a conversation."</h4>
            <p className="text-gray-500">Pick a time that works for you, and let’s start your digital transformation journey today.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-[#112240] p-10 rounded-[40px] border border-blue-500/10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6 scrollable-terminal custom-scrollbar pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500" /> Select Date
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  filterDate={isWeekday}
                  minDate={minDate}
                  dateFormat="MMMM d, yyyy"
                  className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholderText="Click to pick a date"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <FaClock className="text-blue-500" /> Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all h-[58px]"
                  style={{ appearance: 'none' }}
                >
                  <option value="">Choose a slot</option>
                  {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <FaUser className="text-blue-500" /> Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <FaEnvelope className="text-blue-500" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <FaPhone className="text-blue-500" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="+92 3XX XXXXXXX"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <FaComment className="text-blue-500" /> Project Brief
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all h-24"
                placeholder="Briefly describe your project or questions..."
              />
            </div>

            {submitStatus && (
              <div className={`p-4 rounded-2xl text-sm font-bold ${
                submitStatus.type === 'success' ? 'bg-green-600/10 text-green-500' : 'bg-blue-600/10 text-blue-500'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedDate || !selectedTime}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20 transition-all transform hover:scale-[1.02]"
            >
              Confirm Growth Call
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default MeetingScheduler;
