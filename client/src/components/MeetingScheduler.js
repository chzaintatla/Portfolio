import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaComment, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MeetingScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // Generate time slots (30-minute intervals from 9 AM to 6 PM)
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

  // Filter out past dates
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Exclude weekends
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Tomorrow onwards

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      setSubmitStatus({ type: 'error', message: 'Please select a date and time' });
      return;
    }

    // Format date
    const formattedDate = selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Create WhatsApp message
    const phoneNumber = '13073104711'; // Your WhatsApp number (without +)
    let message = `Hello! I would like to book a meeting.\n\n`;
    message += `Name: ${formData.name}\n`;
    message += `Email: ${formData.email}\n`;
    message += `Date: ${formattedDate}\n`;
    message += `Time: ${selectedTime}\n`;
    if (formData.message) {
      message += `Message: ${formData.message}\n`;
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    setSubmitStatus({
      type: 'success',
      message: 'Opening WhatsApp to confirm your meeting booking...',
    });
    
    // Reset form
    setSelectedDate(null);
    setSelectedTime('');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="meeting" className="section-container bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Book a Free 30-Minute Consultation</h2>
        <p className="section-subtitle max-w-3xl mx-auto">
          Let's discuss your Android app project, explore opportunities, or answer any questions
          you have. I'm here to help!
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-primary-600" />
                Select Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                filterDate={isWeekday}
                minDate={minDate}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select a date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                wrapperClassName="w-full"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaClock className="text-primary-600" />
                  Select Time (30-minute slots)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full overflow-x-auto">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                        selectedTime === time
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaUser className="text-primary-600" />
                Your Name
              </label>
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

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-primary-600" />
                Your Email
              </label>
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

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaComment className="text-primary-600" />
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell me about your project or questions..."
              />
            </div>

            {/* Submit Status */}
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
                <div className="flex items-center gap-2">
                  {submitStatus.type === 'success' && <FaCheckCircle />}
                  <span>{submitStatus.message}</span>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedDate || !selectedTime}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
            >
              <FaWhatsapp />
              Book Meeting via WhatsApp
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 bg-primary-50 rounded-xl p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">What to Expect</h3>
          <p className="text-gray-600">
            During our 30-minute consultation, we'll discuss your project requirements, explore
            technical solutions, and determine how I can help bring your idea to life.
            You'll receive confirmation via WhatsApp with meeting details.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MeetingScheduler;

