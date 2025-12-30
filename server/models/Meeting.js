const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/your-meeting-link',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Meeting', meetingSchema);

