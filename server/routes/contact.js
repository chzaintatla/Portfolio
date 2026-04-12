const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const supabase = require('../utils/supabase');
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, message, company, phone, interest } = req.body;

    // Save to Supabase (Leads Table)
    const { data, error: sbError } = await supabase
      .from('leads')
      .insert([
        { 
          full_name: name, 
          email, 
          message, 
          company: company || null, 
          phone: phone || null, 
          interest: interest || 'General Inquiry',
          source: 'Contact Form',
          status: 'new'
        }
      ])
      .select();

    if (sbError) {
      console.error('⚠️ Supabase save failed:', sbError.message);
    }

    // Send email notification
    const emailSent = await sendContactEmail({ name, email, message });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      data: {
        id: data ? data[0].id : null,
        emailSent,
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
    });
  }
});

module.exports = router;
