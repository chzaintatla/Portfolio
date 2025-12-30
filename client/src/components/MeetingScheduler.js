import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaComment, FaCheckCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const MeetingScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const meetingData = {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      const response = await axios.post(API_ENDPOINTS.MEETING, meetingData);

      if (response.data.success) {
        setSubmitStatus({
          type: 'success',
          message: response.data.message || 'Meeting booked successfully! Check your email for confirmation.',
        });
        // Reset form
        setSelectedDate(null);
        setSelectedTime('');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.data.message || 'Failed to book meeting. Please try again.',
        });
      }
    } catch (error) {
      console.error('Meeting booking error:', error);
      let errorMessage = 'Failed to book meeting. Please try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.data?.errors) {
          // Validation errors
          const validationErrors = error.response.data.errors.map(err => err.msg).join(', ');
          errorMessage = `Validation error: ${validationErrors}`;
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Unable to connect to server. Please check your internet connection or try again later.';
      } else {
        // Error setting up request
        errorMessage = 'An error occurred. Please try again.';
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting || !selectedDate || !selectedTime}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Booking...' : 'Book Meeting'}
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
            technical solutions, and determine how I can help bring your Android app idea to life.
            The meeting link will be sent to your email upon confirmation.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MeetingScheduler;

