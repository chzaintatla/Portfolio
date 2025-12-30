const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Meeting = require('../models/Meeting');
const {
  sendMeetingConfirmationToClient,
  sendMeetingNotificationToOwner,
} = require('../utils/emailService');

// Validation rules
const meetingValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('message').optional().trim(),
];

// POST /api/meeting/book
router.post('/book', meetingValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, date, time, message } = req.body;

    // Check if there's already a meeting at this time
    const existingMeeting = await Meeting.findOne({
      date,
      time,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingMeeting) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please select another time.',
      });
    }

    // Generate meeting link (you can customize this)
    const meetingLink = `https://meet.google.com/${generateMeetingId()}`;

    // Save to database
    const meeting = new Meeting({
      name,
      email,
      date,
      time,
      message: message || '',
      meetingLink,
    });

    await meeting.save();

    // Send confirmation email to client
    const clientEmailSent = await sendMeetingConfirmationToClient({
      name,
      email,
      date,
      time,
      message: message || '',
      meetingLink,
    });

    // Send notification email to owner
    const ownerEmailSent = await sendMeetingNotificationToOwner({
      name,
      email,
      date,
      time,
      message: message || '',
      meetingLink,
    });

    res.status(201).json({
      success: true,
      message: 'Meeting booked successfully',
      data: {
        id: meeting._id,
        date,
        time,
        clientEmailSent,
        ownerEmailSent,
      },
    });
  } catch (error) {
    console.error('Meeting booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book meeting',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Helper function to generate meeting ID
function generateMeetingId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = router;

