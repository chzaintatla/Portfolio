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

    // Try to save to database (don't fail if DB is not available)
    let meetingId = null;
    try {
      const meeting = new Meeting({
        name,
        email,
        date,
        time,
        message: message || '',
        meetingLink,
      });
      await meeting.save();
      meetingId = meeting._id;
      console.log('✅ Meeting saved to database:', meetingId);
    } catch (dbError) {
      console.error('⚠️ Database save failed (continuing anyway):', dbError.message);
    }

    // Send confirmation email to client
    const clientEmailSent = await sendMeetingConfirmationToClient({
      name,
      email,
      date,
      time,
      message: message || '',
      meetingLink,
    });

    // Send notification email to owner (IMPORTANT - this must work)
    const ownerEmailSent = await sendMeetingNotificationToOwner({
      name,
      email,
      date,
      time,
      message: message || '',
      meetingLink,
    });

    if (!ownerEmailSent) {
      console.error('⚠️ CRITICAL: Owner email notification failed!');
    }

    res.status(201).json({
      success: true,
      message: ownerEmailSent 
        ? 'Meeting booked successfully! Check your email for confirmation.' 
        : 'Meeting booked, but email notification failed. Please contact directly.',
      data: {
        id: meetingId,
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

