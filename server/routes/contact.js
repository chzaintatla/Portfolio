const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/emailService');

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

// POST /api/contact
router.post('/', contactValidation, async (req, res) => {
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

    const { name, email, message } = req.body;

    // Try to save to database (don't fail if DB is not available)
    let contactId = null;
    try {
      const contact = new Contact({
        name,
        email,
        message,
      });
      await contact.save();
      contactId = contact._id;
      console.log('✅ Contact saved to database:', contactId);
    } catch (dbError) {
      console.error('⚠️ Database save failed (continuing anyway):', dbError.message);
    }

    // Send email (this is the important part)
    const emailSent = await sendContactEmail({ name, email, message });

    if (!emailSent) {
      console.error('⚠️ Email sending failed');
    }

    res.status(201).json({
      success: true,
      message: emailSent 
        ? 'Contact form submitted successfully! I\'ll get back to you soon.' 
        : 'Contact form submitted, but email notification failed. Please try again or contact directly.',
      data: {
        id: contactId,
        emailSent,
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;

